"""ld-s10y-lesson 版面几何（确定性，只做模型做不好的事）。

分工：**哪里是图由模型看图决定，框到哪里由这里算。**

放弃了纯机械的图/文判据——长横线、连通域高度、尺寸下限那一套，每换一种版面就
要加一条规则，补了五轮仍在漏（图题被裁进图、坐标轴被行带切断、页码被切成三截）。
模型一眼就能看出哪块是插图、哪块是半张表，但**给不准像素坐标**。所以模型只负责
指认，这里负责把粗框吸附到真实墨迹上。
"""
from __future__ import annotations

import hashlib
import subprocess
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage

INK_THRESHOLD = 128          # 灰度低于此值视为墨迹
ROW_INK_MIN_RATIO = 0.008    # 行墨迹占版心宽比例低于此值视为空白（抑制扫描噪点）
MIN_BAND_HEIGHT = 3          # 保留拆成上下笔画的短标号（如表格前单独一行的 а)）
MIN_BAND_WIDTH = 14          # Retain a single printed quotient digit.
# 只用来把同一行里断开的笔画（分式、上下标、页码的点）接回去。不能取大：取 0.6
# 会把行距紧的相邻几行并成一行，数出来的行数就少了。
GLYPH_GAP_FACTOR = 0.4       # Keep captions separate from the following printed row.
SNAP_OVERLAP = 0.45          # 连通域与粗框的重叠比例超过此值才吸附进来
GRID = 100                   # 坐标网格间距（px），画在 page.grid.png 上供读图取坐标


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def render_page(pdf: Path, page: int, out_png: Path, dpi: int = 300) -> Path:
    out_png.parent.mkdir(parents=True, exist_ok=True)
    prefix = out_png.parent / "__render"
    subprocess.run(
        ["pdftoppm", "-png", "-r", str(dpi), "-f", str(page), "-l", str(page),
         str(pdf), str(prefix)],
        check=True, capture_output=True,
    )
    produced = sorted(out_png.parent.glob("__render-*.png"))
    if not produced:
        raise RuntimeError(f"pdftoppm 未产出页 {page}")
    produced[0].replace(out_png)
    for leftover in out_png.parent.glob("__render-*.png"):
        leftover.unlink()
    return out_png


def ink_mask(img: Image.Image) -> np.ndarray:
    return np.asarray(img.convert("L")) < INK_THRESHOLD


def mask_scan_noise(ink, entries, render_sha256, figure_boxes=()):
    """Mask explicitly identified scan blemishes only in the counting copy."""
    if not isinstance(entries, list):
        raise ValueError("scan_noise must be a list")
    masked, retained = ink.copy(), []
    for entry in entries:
        if not isinstance(entry, dict) or set(entry) != {"box", "render_sha256", "reason"}:
            raise ValueError("scan_noise requires box, render_sha256 and reason")
        if entry["render_sha256"] != render_sha256:
            raise ValueError("scan_noise is not bound to the current page pixels")
        box = entry["box"]
        if not isinstance(box, list) or len(box) != 4 or any(type(v) is not int for v in box):
            raise ValueError("scan_noise box must contain four integers")
        x, y, w, h = box
        if x < 0 or y < 0 or w <= 0 or h <= 0 or x + w > ink.shape[1] or y + h > ink.shape[0]:
            raise ValueError("scan_noise box leaves the page")
        if w * h > ink.size * 0.001:
            raise ValueError("scan_noise box is too large for a local blemish")
        if not isinstance(entry["reason"], str) or not entry["reason"].strip():
            raise ValueError("scan_noise requires a source observation")
        for fx, fy, fw, fh in [*figure_boxes, *(item["box"] for item in retained)]:
            if x < fx + fw and fx < x + w and y < fy + fh and fy < y + h:
                raise ValueError("scan_noise overlaps a figure or another exclusion")
        region = ink[y:y + h, x:x + w]
        if not region.any():
            raise ValueError("scan_noise box has no ink")
        retained.append({**entry, "ink_pixels": int(region.sum())})
        masked[y:y + h, x:x + w] = False
    return masked, retained


def _runs(live: np.ndarray) -> list[tuple[int, int]]:
    out, start = [], None
    for i, on in enumerate(live):
        if on and start is None:
            start = i
        elif not on and start is not None:
            out.append((start, i - 1))
            start = None
    if start is not None:
        out.append((start, len(live) - 1))
    return out


def _merge_close(spans, gap: float):
    if not spans:
        return []
    out = [list(spans[0])]
    for a, b in spans[1:]:
        if a - out[-1][1] <= gap:
            out[-1][1] = b
        else:
            out.append([a, b])
    return [(a, b) for a, b in out]


def grid_overlay(png: Path, out: Path, step: int = GRID) -> Path:
    """在整页图上画坐标网格。读图时照着网格报框，能把误差压到半格以内。"""
    img = Image.open(png).convert("RGB")
    d = ImageDraw.Draw(img)
    for x in range(0, img.width, step):
        d.line([(x, 0), (x, img.height)], fill=(255, 120, 120), width=1)
        d.text((x + 3, 3), str(x), fill=(200, 0, 0))
    for y in range(0, img.height, step):
        d.line([(0, y), (img.width, y)], fill=(120, 160, 255), width=1)
        d.text((3, y + 3), str(y), fill=(0, 0, 200))
    img.save(out)
    return out


def _row_fragments(ink: np.ndarray, content_w: int) -> list[tuple[int, int]]:
    counts = ink.sum(axis=1)
    raw = []
    for a, b in _runs(counts > 8):
        if b - a + 1 < MIN_BAND_HEIGHT:
            continue
        xs = np.flatnonzero(ink[a:b + 1].any(axis=0))
        if counts[a:b + 1].max() <= ROW_INK_MIN_RATIO * content_w and (
            not xs.size or xs[-1] - xs[0] + 1 > 0.08 * content_w
        ):
            continue
        if xs.size and xs[-1] - xs[0] + 1 >= MIN_BAND_WIDTH:
            raw.append((a, b))
    return raw


def _single_fraction_row(ink: np.ndarray, a: int, b: int, line_h: float) -> bool:
    """Distinguish tall inline fractions from two full text rows."""
    # Radical overbars at the band's top have no numerator above them.
    ink = ink.copy()
    band = ink[a:b + 1]
    horizontal = ndimage.binary_opening(
        band, structure=np.ones((1, max(2, int(0.7 * line_h))), dtype=bool)
    )
    components, _ = ndimage.label(horizontal)
    for bounds in ndimage.find_objects(components):
        if bounds is None:
            continue
        rows, columns = bounds
        if (
            rows.stop <= 0.2 * line_h
            and np.count_nonzero(band[:rows.start, columns]) < 0.1 * line_h ** 2
        ):
            band[rows, columns] = False
    band = ink[a:b + 1].copy()
    height = band.shape[0]
    rules = []
    components, _ = ndimage.label(band)
    for bounds in ndimage.find_objects(components):
        if bounds is None:
            continue
        rows, columns = bounds
        if (
            columns.stop - columns.start >= 0.7 * line_h
            and rows.stop - rows.start <= 0.2 * line_h
            and 0.3 * height <= (rows.start + rows.stop) / 2 <= 0.7 * height
        ):
            rules.append((columns.start, columns.stop - 1))
    horizontal = ndimage.binary_opening(
        band, structure=np.ones((1, max(2, int(0.7 * line_h))), dtype=bool)
    )
    rule_components, _ = ndimage.label(horizontal)
    rule_bounds = []
    for bounds in ndimage.find_objects(rule_components):
        if bounds is None:
            continue
        rows, columns = bounds
        if (
            rows.stop - rows.start <= 0.25 * line_h
            and (
                0.3 * height <= (rows.start + rows.stop) / 2 <= 0.7 * height
                # A nested denominator moves its long outer rule above centre.
                or height > 3 * line_h
                and columns.stop - columns.start >= 2 * line_h
                and 0.2 * height <= (rows.start + rows.stop) / 2 <= 0.8 * height
            )
        ):
            rules.append((columns.start, columns.stop - 1))
            rule_bounds.append((rows, columns))
    outer_rules = [
        (rows, columns) for rows, columns in rule_bounds
        if not any(
            other_columns.start <= columns.start
            and columns.stop <= other_columns.stop
            and other_columns.stop - other_columns.start
            > columns.stop - columns.start + 0.2 * line_h
            for _, other_columns in rule_bounds
        )
    ]
    if outer_rules:
        centres = [(rows.start + rows.stop) / 2 for rows, _ in outer_rules]
        if max(centres) - min(centres) > 1.5 * line_h:
            return False
    if not rules:
        return False
    for left, right in rules:
        margin = int(0.5 * line_h)
        band[:, max(0, left - margin):min(band.shape[1], right + margin + 1)] = False
    components, _ = ndimage.label(band)
    for component_id, bounds in enumerate(ndimage.find_objects(components), 1):
        if bounds is None:
            continue
        rows, columns = bounds
        if (
            rows.stop - rows.start < 0.6 * line_h
            or rows.stop - rows.start > 1.8 * line_h
            and columns.stop - columns.start < 0.6 * line_h
        ):
            region = band[bounds]
            region[components[bounds] == component_id] = False
    counts = band.sum(axis=1)
    remaining = np.flatnonzero(counts > max(8, 0.25 * counts.max()))
    return not remaining.size or remaining[-1] - remaining[0] + 1 <= 2.0 * line_h


def _fraction_across_split(
    ink: np.ndarray, a: int, split: int, b: int, glyph_h: float
) -> bool:
    """Recognize a supported fraction rule, including single-digit quotients."""
    band = ink[a:b + 1]
    labels, _ = ndimage.label(band)
    boxes = [bounds for bounds in ndimage.find_objects(labels) if bounds is not None]
    glyphs = [
        (rows, columns) for rows, columns in boxes
        if rows.stop - rows.start >= 0.3 * glyph_h
        and columns.stop - columns.start >= 0.1 * glyph_h
    ]
    supported = []
    for rows, columns in boxes:
        centre = a + (rows.start + rows.stop) / 2
        if not (
            rows.stop - rows.start <= 0.25 * glyph_h
            and columns.stop - columns.start >= 0.7 * glyph_h
            and abs(centre - split) <= 0.5 * glyph_h
            # Wavy emphasis underlines can have glyphs both above and below.
            and band[rows, columns].sum(axis=1).max()
            >= 0.9 * (columns.stop - columns.start)
        ):
            continue
        contained = [
            (top, side) for top, side in glyphs
            if columns.start <= (side.start + side.stop) / 2 < columns.stop
        ]
        if (
            any(top.stop <= rows.start and a + top.start < split for top, _ in contained)
            and any(top.start >= rows.stop for top, _ in contained)
        ):
            supported.append((rows, columns))
    if not supported:
        return False
    # Fraction columns may be tall; unrelated shorter wrapped rows must survive.
    for rows, columns in glyphs:
        if rows.stop - rows.start < 0.6 * glyph_h:
            continue
        centre_x = (columns.start + columns.stop) / 2
        if not any(
            rule_columns.start - 0.15 * glyph_h <= centre_x
            <= rule_columns.stop + 0.15 * glyph_h
            or rows.start - 0.25 * glyph_h
            <= (rule_rows.start + rule_rows.stop) / 2
            <= rows.stop + 0.25 * glyph_h
            for rule_rows, rule_columns in supported
        ):
            return False
    return _single_fraction_row(ink, a, b, glyph_h)


def _fraction_followed_by_text(
    ink: np.ndarray, a: int, prev_b: int, next_a: int, b: int, glyph_h: float
) -> bool:
    """Keep a completed tall quotient separate from a short following sentence."""
    if not (
        prev_b - a + 1 >= 1.8 * glyph_h
        and 0.6 * glyph_h <= b - next_a + 1 <= 1.3 * glyph_h
    ):
        return False
    labels, _ = ndimage.label(ink[next_a:b + 1])
    glyphs = [
        bounds for bounds in ndimage.find_objects(labels) if bounds is not None
        if 0.6 * glyph_h <= bounds[0].stop - bounds[0].start <= 1.3 * glyph_h
        and 0.2 * glyph_h <= bounds[1].stop - bounds[1].start <= 1.3 * glyph_h
    ]
    return (
        len(glyphs) >= 3
        and _single_fraction_row(ink, a, prev_b, glyph_h)
        and not _single_fraction_row(ink, a, b, glyph_h)
        and not _fraction_across_split(ink, a, (prev_b + next_a) // 2, b, glyph_h)
    )


def _offset_system_label_band(
    ink: np.ndarray, a: int, b: int, glyph_h: float, bounds_list: list
) -> bool:
    braces = [
        (rows, columns)
        for bounds in bounds_list if bounds is not None
        for rows, columns in [bounds]
        if rows.start < a <= b < rows.stop
        and rows.stop - rows.start > 2 * glyph_h
        and columns.stop - columns.start < 0.6 * glyph_h
    ]
    if not braces:
        return False
    band = ink[a:b + 1].copy()
    for _, columns in braces:
        band[:, columns] = False
    labels, _ = ndimage.label(band)
    glyphs = [
        bounds
        for bounds in ndimage.find_objects(labels) if bounds is not None
        if bounds[0].stop - bounds[0].start >= 0.6 * glyph_h
        and bounds[1].stop - bounds[1].start >= 0.2 * glyph_h
    ]
    return bool(glyphs) and all(
        any(
            brace_columns.start - 2 * glyph_h <= columns.start
            and columns.stop <= brace_columns.start
            for _, brace_columns in braces
        )
        for _, columns in glyphs
    )


def _fraction_system_row_count(
    ink: np.ndarray, a: int, b: int, glyph_h: float, strong_rows: list
) -> int | None:
    """Combine fraction baselines with full rows inside a spanning brace."""
    labels, _ = ndimage.label(ink[a:b + 1])
    if not any(
        rows.stop - rows.start >= 0.9 * (b - a + 1)
        and columns.stop - columns.start < 0.8 * glyph_h
        for bounds in ndimage.find_objects(labels) if bounds is not None
        for rows, columns in [bounds]
    ):
        return None
    band = ink[a:b + 1]
    horizontal = ndimage.binary_opening(
        band, structure=np.ones((1, max(2, int(0.7 * glyph_h))), dtype=bool)
    )
    rule_labels, _ = ndimage.label(horizontal)
    rules = []
    reach = int(1.5 * glyph_h)
    for bounds in ndimage.find_objects(rule_labels):
        if bounds is None:
            continue
        rows, columns = bounds
        if (
            rows.stop - rows.start <= 0.25 * glyph_h
            and band[max(0, rows.start - reach):rows.start, columns].any()
            and band[rows.stop:min(len(band), rows.stop + reach), columns].any()
        ):
            rules.append((rows.start, rows.stop, columns.start, columns.stop))
    outer_rules = {
        max(
            (other for other in rules
             if other[2] - 0.2 * glyph_h <= left
             and right <= other[3] + 0.2 * glyph_h),
            key=lambda other: other[3] - other[2],
        )
        for _, _, left, right in rules
    }
    fractions = []
    for top, bottom, _, _ in sorted(outer_rules):
        centre = a + (top + bottom) / 2
        if not fractions or centre - fractions[-1] > 1.5 * glyph_h:
            fractions.append(centre)
    if not fractions:
        return None
    centres = sorted(fractions + [
        (top + bottom) / 2 for top, bottom in strong_rows
        if all(abs((top + bottom) / 2 - centre) > 1.5 * glyph_h
               for centre in fractions)
    ])
    distinct = []
    for centre in centres:
        if not distinct or centre - distinct[-1] > 1.5 * glyph_h:
            distinct.append(centre)
    return len(distinct) if len(distinct) >= 2 else None


def line_bands(ink: np.ndarray, content_w: int) -> list[tuple[int, int]]:
    """Count printed rows after masking model-identified figures."""
    # Work on a counting-only copy; extraction pixels are never changed.
    ink = ink.copy()
    edge = max(1, int(ink.shape[1] * 0.01))
    ink[:, :edge] = False
    ink[:, -edge:] = False
    raw = _row_fragments(ink, content_w)
    if not raw:
        return []
    line_h = int(np.median([b - a + 1 for a, b in raw]))
    components, _ = ndimage.label(ink)
    bounds_list = ndimage.find_objects(components)
    sizes = np.bincount(components.ravel())
    compact = sorted(
        (rows.stop - rows.start, int(sizes[component_id]))
        for component_id, bounds in enumerate(bounds_list, 1) if bounds is not None
        for rows, columns in [bounds]
        if 0.2 * (rows.stop - rows.start)
        <= columns.stop - columns.start <= 2 * (rows.stop - rows.start)
    )
    if compact:
        # Many tiny specks can outvote printed glyphs, but not their ink area.
        cumulative = np.cumsum([area for _, area in compact])
        supported_h = compact[int(np.searchsorted(cumulative, 0.75 * cumulative[-1]))][0]
        line_h = max(line_h, supported_h)
    glyph_heights = [
        rows.stop - rows.start
        for bounds in bounds_list if bounds is not None
        for rows, columns in [bounds]
        if 0.25 * line_h <= rows.stop - rows.start <= 1.3 * line_h
        and 0.2 * line_h <= columns.stop - columns.start <= 1.3 * line_h
    ]
    glyph_h = (
        float(np.percentile(glyph_heights, 75)) if len(glyph_heights) >= 3 else line_h
    )
    glyph_boxes = [
        bounds for bounds in bounds_list if bounds is not None
        for rows, columns in [bounds]
        if rows.stop - rows.start >= 0.6 * glyph_h
        and columns.stop - columns.start >= 0.2 * glyph_h
    ]
    short_rows = [
        (a, b) for a, b in _merge_close(raw, 0.4 * glyph_h)
        if 0.3 * glyph_h <= b - a + 1 < 0.65 * glyph_h
        and (supported_columns := np.flatnonzero(
            ink[a:b + 1].sum(axis=0) >= MIN_BAND_HEIGHT
        )).size
        and 0.5 * glyph_h <= np.ptp(supported_columns) + 1 <= 2 * glyph_h
    ]
    for component_id, bounds in enumerate(bounds_list, 1):
        if bounds is None:
            continue
        rows, columns = bounds
        height, width = rows.stop - rows.start, columns.stop - columns.start
        sparse_shallow_rule = (
            0.3 * glyph_h <= height <= 0.4 * glyph_h
            and width >= 3 * glyph_h
            and sizes[component_id] < 0.2 * width * height
        )
        isolated_fragment = height < 0.3 * glyph_h or (
            height < 0.65 * glyph_h and width >= 0.5 * glyph_h
            and sizes[component_id] >= 0.35 * width * height
        ) or sparse_shallow_rule
        thin_rule = height <= 0.2 * glyph_h and width >= 0.7 * glyph_h
        if isolated_fragment and not (
            height < 0.65 * glyph_h
            and any(a <= rows.start and rows.stop - 1 <= b for a, b in short_rows)
        ) and not any(
            (
                abs((rows.start + rows.stop) - (other_rows.start + other_rows.stop))
                <= 1.5 * glyph_h
                or (thin_rule or height >= 0.3 * glyph_h)
                and max(rows.start - other_rows.stop, other_rows.start - rows.stop)
                <= (1.0 if thin_rule else 0.5) * glyph_h
            )
            and max(columns.start - other_columns.stop,
                    other_columns.start - columns.stop) <= 1.5 * glyph_h
            for other_rows, other_columns in glyph_boxes
        ):
            region = ink[bounds]
            region[components[bounds] == component_id] = False
    raw = _row_fragments(ink, content_w)
    supporting_rows = {
        (a, b) for a, b in raw
        if any(
            a <= rows.start and rows.stop - 1 <= b
            and rows.stop - rows.start >= 0.2 * glyph_h
            and columns.stop - columns.start >= 0.1 * glyph_h
            and not (
                rows.stop - rows.start > 1.8 * line_h
                and columns.stop - columns.start < 0.5 * line_h
                and columns.stop - columns.start < 0.2 * (rows.stop - rows.start)
            )
            for bounds in bounds_list if bounds is not None
            for rows, columns in [bounds]
        )
    }
    # Dense, joined shallow blemishes are not glyphs or thin fraction rules.
    # Remove them only when they occupy an otherwise isolated projection row.
    for component_id, bounds in enumerate(bounds_list, 1):
        if bounds is None:
            continue
        rows, columns = bounds
        height, width = rows.stop - rows.start, columns.stop - columns.start
        area = np.count_nonzero(components[bounds] == component_id)
        if (
            0.35 * glyph_h <= height <= 0.65 * glyph_h
            and width >= 1.5 * glyph_h
            and area >= 0.35 * width * height
            and any(
                a - 0.15 * glyph_h <= rows.start
                and rows.stop - 1 <= b + 0.15 * glyph_h
                and b - a + 1 <= 0.65 * glyph_h
                and np.count_nonzero(ink[a:b + 1]) <= area * 1.1
                for a, b in raw
            )
        ):
            region = ink[bounds]
            region[components[bounds] == component_id] = False
    for component_id, bounds in enumerate(ndimage.find_objects(components), 1):
        if bounds is None:
            continue
        rows, columns = bounds
        height, width = rows.stop - rows.start, columns.stop - columns.start
        margin_outline = (
            rows.start < 0.1 * ink.shape[0]
            and height > 1.2 * glyph_h and width > 2 * glyph_h
            and sizes[component_id] < 0.2 * width * height
            and not any(
                other_id != component_id
                and sizes[other_id] >= 0.15 * glyph_h ** 2
                and 0.6 * glyph_h <= other_rows.stop - other_rows.start <= 1.3 * glyph_h
                and 0.2 * glyph_h <= other_columns.stop - other_columns.start <= 1.3 * glyph_h
                and max(rows.start - other_rows.stop, other_rows.start - rows.stop) <= 1.5 * glyph_h
                for other_id, other_bounds in enumerate(bounds_list, 1)
                if other_bounds is not None
                for other_rows, other_columns in [other_bounds]
            )
        )
        if margin_outline or (
            height > 1.8 * line_h and width < 0.5 * line_h and width < 0.2 * height
        ):
            region = ink[bounds]
            region[components[bounds] == component_id] = False
    raw = _row_fragments(ink, content_w)
    # Check residual streaks after removing the larger scan outlines.
    for a, b in raw:
        xs = np.flatnonzero(ink[a:b + 1].any(axis=0))
        fraction_support = (
            xs.size
            and b - a + 1 <= 0.25 * glyph_h
            and xs[-1] - xs[0] + 1 >= 2 * glyph_h
            and any(
                rows.stop <= a and a - rows.stop <= 1.5 * glyph_h
                and xs[0] <= (columns.start + columns.stop) / 2 <= xs[-1]
                for rows, columns in glyph_boxes
            )
            and any(
                rows.start > b and rows.start - b <= 1.5 * glyph_h
                and xs[0] <= (columns.start + columns.stop) / 2 <= xs[-1]
                for rows, columns in glyph_boxes
            )
        )
        if (
            b - a + 1 < 0.2 * glyph_h
            and xs.size and xs[-1] - xs[0] + 1 > 2 * glyph_h
            and not fraction_support
            and not any(
                (c, d) != (a, b)
                and (c, d) in supporting_rows
                and max(c - b, a - d) <= 1.5 * glyph_h
                for c, d in raw
            )
        ):
            ink[a:b + 1] = False
    raw = _row_fragments(ink, content_w)
    if not raw:
        return []
    line_h = max(glyph_h, int(np.median([b - a + 1 for a, b in raw])))
    # Fraction-heavy pages inflate row heights without enlarging printed digits.
    number_glyph_h = min(line_h, glyph_h)
    # Projection thresholds can miss a narrow standalone quotient such as 1 or 7.
    for component_id, bounds in enumerate(ndimage.find_objects(components), 1):
        if bounds is None:
            continue
        rows, columns = bounds
        height, width = rows.stop - rows.start, columns.stop - columns.start
        if (
            0.6 * number_glyph_h <= height <= 1.3 * number_glyph_h
            and 0.3 * number_glyph_h <= width <= number_glyph_h
            and np.count_nonzero(components[bounds] == component_id) >= 0.12 * number_glyph_h ** 2
            and not any(a <= rows.start and rows.stop - 1 <= b for a, b in raw)
        ):
            raw.append((rows.start, rows.stop - 1))
    raw.sort()
    stacked_centres = []
    stacked_rules = []
    spans = _merge_close(raw, 0)
    for first, second, rule, result in zip(spans, spans[1:], spans[2:], spans[3:]):
        glyph_rows = (first, second, result)
        heights = [b - a + 1 for a, b in glyph_rows]
        widths = [
            np.flatnonzero(ink[a:b + 1].any(axis=0))
            for a, b in glyph_rows
        ]
        widths = [xs[-1] - xs[0] + 1 for xs in widths]
        rule_x = np.flatnonzero(ink[rule[0]:rule[1] + 1].any(axis=0))
        pitches = (second[0] - first[0], result[0] - second[0])
        if (
            all(0.6 * glyph_h <= height <= 1.5 * glyph_h for height in heights)
            and min(widths) >= 2 * glyph_h
            and min(widths) >= 0.65 * max(widths)
            and rule[1] - rule[0] + 1 <= 0.25 * glyph_h
            and rule_x.size and rule_x[-1] - rule_x[0] + 1 >= min(widths)
            and min(pitches) > 0
            and max(pitches) <= 1.35 * min(pitches)
        ):
            # A rule below two aligned operand rows is not a fraction bar.
            stacked_centres.extend((a + b) / 2 for a, b in glyph_rows)
            stacked_rules.append(rule)
    if stacked_centres:
        for a, b in stacked_rules:
            ink[a:b + 1] = False
        raw = [(a, b) for a, b in raw if ink[a:b + 1].any()]

    def different_stacked_rows(first, second):
        return (
            any(first[0] <= centre <= first[1] for centre in stacked_centres)
            and any(second[0] <= centre <= second[1] for centre in stacked_centres)
        )

    merged = []
    merge_gap = max(2.0, GLYPH_GAP_FACTOR * min(line_h, glyph_h))
    for a, b in _merge_close(raw, 0):
        if merged:
            prev_a, prev_b = merged[-1]
            separate_tall_rows = (
                min(prev_b - prev_a + 1, b - a + 1) >= 1.8 * glyph_h
                and not _single_fraction_row(ink, prev_a, b, glyph_h)
            )
            row_widths = [
                np.flatnonzero(ink[top:bottom + 1].any(axis=0))
                for top, bottom in ((prev_a, prev_b), (a, b))
            ]
            row_widths = [xs[-1] - xs[0] + 1 for xs in row_widths]
            # Complete smaller or short wrapped rows can have a tight gap.
            separate_full_text = (
                min(prev_b - prev_a + 1, b - a + 1) >= 0.6 * glyph_h
                and min(row_widths) >= 2 * glyph_h
                and not any(
                    prev_a <= c <= d <= b
                    and d - c + 1 <= 0.25 * glyph_h
                    and np.ptp(np.flatnonzero(ink[c:d + 1].any(axis=0))) >= 0.7 * glyph_h
                    for c, d in raw
                )
                and not _fraction_across_split(ink, prev_a, a, b, glyph_h)
            )
            if (
                a - prev_b <= merge_gap
                and not separate_tall_rows
                and not separate_full_text
                and not _fraction_followed_by_text(ink, prev_a, prev_b, a, b, glyph_h)
                and not different_stacked_rows((prev_a, prev_b), (a, b))
            ):
                merged[-1] = (prev_a, b)
                continue
        merged.append((a, b))
    joined = []
    fraction_starts = set()
    for a, b in merged:
        if joined:
            prev_a, prev_b = joined[-1]
            prev_x = np.flatnonzero(ink[prev_a:prev_b + 1].any(axis=0))
            next_x = np.flatnonzero(ink[a:b + 1].any(axis=0))
            widths = (prev_x[-1] - prev_x[0] + 1, next_x[-1] - next_x[0] + 1)
            compact_fragment = min(prev_b - prev_a + 1, b - a + 1) < 0.75 * line_h
            aligned = abs((prev_x[0] + prev_x[-1]) - (next_x[0] + next_x[-1])) < line_h
            heights = (prev_b - prev_a + 1, b - a + 1)
            small, large = (prev_x, next_x) if widths[0] < widths[1] else (next_x, prev_x)
            fraction_spill = (
                b - prev_a + 1 <= (
                    4.8 if prev_a in fraction_starts else 3.2
                ) * max(line_h, glyph_h)
                and min(heights) <= 1.2 * line_h
                and (
                    max(heights) >= 1.8 * line_h
                    or min(heights) < 0.4 * line_h
                    and max(heights) >= 1.35 * line_h
                )
                and min(widths) <= (
                    0.4 if min(heights) < 0.4 * line_h else 0.3
                ) * max(widths)
                and large[0] <= small[0] <= small[-1] <= large[-1]
            )
            radical_overbar_spill = (
                min(heights) < 0.4 * line_h
                and max(heights) >= 1.35 * line_h
                and b - prev_a + 1 <= 3.2 * max(line_h, glyph_h)
                and _single_fraction_row(ink, prev_a, b, glyph_h)
            )
            supported_fraction = _fraction_across_split(
                ink, prev_a, (prev_b + a) // 2, b, glyph_h
            )
            separate_full_row = (
                max(heights) >= 1.8 * glyph_h
                and min(heights) >= 0.6 * glyph_h
                and min(widths) / max(widths) >= 0.65
                and not _single_fraction_row(ink, prev_a, b, glyph_h)
            )
            if (
                not separate_full_row
                and not _fraction_followed_by_text(ink, prev_a, prev_b, a, b, glyph_h)
                and not different_stacked_rows((prev_a, prev_b), (a, b))
                and
                a - prev_b <= (
                    0.75 if supported_fraction
                    else 0.6 if min(heights) < 0.4 * line_h else 0.5
                ) * min(line_h, 1.5 * glyph_h)
                and (
                    compact_fragment and aligned
                    and min(widths) / max(widths) >= 0.65
                    or fraction_spill
                    or radical_overbar_spill
                    or supported_fraction
                )
            ):
                joined[-1] = (prev_a, b)
                if fraction_spill or radical_overbar_spill or supported_fraction:
                    fraction_starts.add(prev_a)
                continue
        joined.append((a, b))
    merged = joined

    # Dense glyphs or staggered side-by-side text can keep the row projection
    # continuously live across two or more printed rows. Recover the row count
    # from the page's normal band height and inter-line gap instead of treating
    # one unusually tall projection band as one line.
    # A page dominated by brace-connected systems has a multi-row median band.
    typical_h = float(min(line_h, glyph_h))
    nearby_gaps = [
        next_a - prev_b - 1
        for (_, prev_b), (next_a, _) in zip(merged, merged[1:])
        if 0 < next_a - prev_b - 1 <= 1.5 * typical_h
    ]
    typical_gap = float(np.median(nearby_gaps)) if nearby_gaps else typical_h * 0.75
    pitch = typical_h + typical_gap
    counts = ink.sum(axis=1)
    expanded = []
    for a, b in merged:
        band_h = b - a + 1
        count = 1
        spanning_brace = any(
            min(rows.stop, b + 1) - max(rows.start, a) >= 0.9 * band_h
            and rows.stop - rows.start <= band_h + 0.5 * glyph_h
            and columns.stop - columns.start < 0.8 * glyph_h
            for bounds in bounds_list if bounds is not None
            for rows, columns in [bounds]
        )
        # Staggered text inflates typical_h; a local brace retains glyph-sized rows.
        if a not in fraction_starts and pitch > 0 and (
            band_h > 2.2 * typical_h
            or spanning_brace and band_h > 2.2 * glyph_h
        ):
            # Brace-connected rows are often shorter than an integral pitch
            # multiple. Count the nearest number of row centres, not a floor.
            count = max(2, int(round((band_h + typical_gap) / pitch)))
            core = counts[a:b + 1]
            strong_rows = _merge_close(
                [(a + x, a + y) for x, y in _runs(core > 0.4 * core.max())],
                max(2, 0.25 * typical_h),
            )
            strong_rows = [
                (x, y) for x, y in strong_rows if y - x + 1 >= 0.3 * typical_h
            ]
            middle_label = (
                len(strong_rows) == 2
                and strong_rows[0][1] + 1 <= strong_rows[1][0] - 1
                and _offset_system_label_band(
                    ink, strong_rows[0][1] + 1, strong_rows[1][0] - 1,
                    glyph_h, bounds_list,
                )
            )
            if middle_label:
                count = 3
            elif count == 3 and len(strong_rows) == 2:
                count = 2
            system_rows = _fraction_system_row_count(ink, a, b, glyph_h, strong_rows)
            if system_rows is not None:
                count = system_rows + int(middle_label)
            if (
                system_rows is None
                and not middle_label
                and (
                    count == 2 and _single_fraction_row(ink, a, b, typical_h)
                    or _single_fraction_row(ink, a, b, min(typical_h, glyph_h))
                )
            ):
                count = 1
        if count == 1:
            expanded.append((a, b))
            continue
        step = band_h / count
        expanded.extend(
            (
                int(round(a + index * step)),
                int(round(a + (index + 1) * step)) - 1,
            )
            for index in range(count)
        )
    merged = expanded

    # 扫描页常有页顶黑边、章标题横线和孤立墨点。它们能通过最小宽高阈值，却不是
    # 印刷文字行；只过滤明显偏薄且过宽/过窄的孤立带，页底的页码装饰则保留。
    out = []
    page_h = ink.shape[0]
    for a, b in merged:
        xs = np.flatnonzero(ink[a:b + 1].any(axis=0))
        band_h = b - a + 1
        band_w = int(xs[-1] - xs[0] + 1)
        thin = band_h < 0.4 * typical_h
        edge_border = a < 0.02 * page_h and (
            thin or band_w > 0.7 * content_w
        )
        short_text = False
        if thin and not edge_border:
            labels, _ = ndimage.label(ink[a:b + 1])
            short_glyph_h = min(typical_h, glyph_h)
            glyphs = [
                bounds for bounds in ndimage.find_objects(labels)
                if bounds is not None
                and bounds[0].stop - bounds[0].start >= 0.6 * short_glyph_h
                and bounds[1].stop - bounds[1].start >= 0.2 * short_glyph_h
                and bounds[0].stop - bounds[0].start >= (
                    0.35 * (bounds[1].stop - bounds[1].start)
                )
            ]
            # A short final number can be lower than the Chinese body glyphs.
            if glyphs:
                glyph_w = max(bounds[1].stop for bounds in glyphs) - min(
                    bounds[1].start for bounds in glyphs
                )
                short_text = 0.3 * short_glyph_h <= glyph_w < 0.05 * content_w
        horizontal_rule = (
            band_h <= 0.2 * glyph_h and band_w >= 4 * glyph_h
            and ink[a:b + 1, xs[0]:xs[-1] + 1].mean() >= 0.5
        )
        edge_blot = (
            a > 0.95 * page_h
            and band_h < 0.65 * glyph_h and band_w < 0.65 * glyph_h
            and ink[a:b + 1, xs[0]:xs[-1] + 1].mean() >= 0.5
            and not any(
                (c, d) != (a, b)
                and max(c - b, a - d) <= 1.5 * glyph_h
                for c, d in merged
            )
        )
        decoration = edge_border or horizontal_rule or edge_blot or (
            thin
            and (band_w > 0.3 * content_w or band_w < 0.05 * content_w)
            and not short_text
        )
        if not decoration:
            out.append((a, b))
    return out


def snap(ink: np.ndarray, box: list[int]) -> tuple[list[int], dict]:
    """把粗框吸附到它覆盖的连通域上：框歪一点、小一点都能救回来。

    判据是「连通域有多大比例落在框内」——整体在框内的（图形本身、被框住的标注）
    并进来，只被蹭到边的（相邻正文行）排除在外。
    """
    x, y, w, h = box
    H, W = ink.shape
    x0, y0 = max(0, x), max(0, y)
    x1, y1 = min(W - 1, x + w - 1), min(H - 1, y + h - 1)
    labels, n = ndimage.label(ink)
    if n == 0:
        return [x0, y0, x1 - x0 + 1, y1 - y0 + 1], {"components": 0}

    sizes = np.bincount(labels.ravel())
    inside = np.bincount(labels[y0:y1 + 1, x0:x1 + 1].ravel(), minlength=len(sizes))
    boxes = ndimage.find_objects(labels)

    took, nx0, ny0, nx1, ny1 = 0, x1, y1, x0, y0
    for lab in np.flatnonzero(inside[1:]) + 1:
        if inside[lab] < SNAP_OVERLAP * sizes[lab]:
            continue
        sy, sx = boxes[lab - 1]
        # 贯通整页的连通域是扫描件页边黑线，吞进来会把整页当成插图
        if (sy.stop - sy.start) > 0.9 * H or (sx.stop - sx.start) > 0.9 * W:
            continue
        took += 1
        nx0, ny0 = min(nx0, sx.start), min(ny0, sy.start)
        nx1, ny1 = max(nx1, sx.stop - 1), max(ny1, sy.stop - 1)
    if took == 0:
        return [x0, y0, x1 - x0 + 1, y1 - y0 + 1], {"components": 0}
    return [int(nx0), int(ny0), int(nx1 - nx0 + 1), int(ny1 - ny0 + 1)],  {
        "components": int(took), "from": box}


def crop(png: Path, box: list[int], out: Path, pad: int = 12) -> None:
    img = Image.open(png)
    x, y, w, h = box
    out.parent.mkdir(parents=True, exist_ok=True)
    img.crop((max(0, x - pad), max(0, y - pad),
              min(img.width, x + w + pad), min(img.height, y + h + pad))).save(out)


def ink_coverage(ink: np.ndarray, boxes: list[list[int]]) -> dict:
    """墨迹里有多少落在给定框之外。用于「文字行数」以外的第二重体检。"""
    H, W = ink.shape
    cov = np.zeros_like(ink)
    for x, y, w, h in boxes:
        cov[max(0, y):min(H, y + h), max(0, x):min(W, x + w)] = True
    resid = ink & ~cov
    total = int(ink.sum())
    return {"ink_px": total, "outside_px": int(resid.sum()),
            "outside_ratio": round(int(resid.sum()) / max(total, 1), 5)}
