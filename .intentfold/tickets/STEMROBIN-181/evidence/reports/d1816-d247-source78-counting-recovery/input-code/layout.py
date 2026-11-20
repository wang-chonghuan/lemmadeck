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
            out[-1][1] = max(out[-1][1], b)
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
    band = ink[a:b + 1].copy()
    height = band.shape[0]
    counts = band.sum(axis=1)
    for top, bottom in _runs(counts > 0.4 * counts.max()):
        xs = np.flatnonzero(band[top:bottom + 1].any(axis=0))
        if (
            bottom - top + 1 >= 0.5 * line_h
            and xs.size and xs[-1] - xs[0] + 1 >= 0.6 * ink.shape[1]
            and not 0.3 * height <= (top + bottom) / 2 <= 0.7 * height
        ):
            # Full text at an outer edge is another row, not a numerator.
            return False
    rules = []
    components, _ = ndimage.label(band)
    glyph_bounds = ndimage.find_objects(components)
    for bounds in glyph_bounds:
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
            source_ids = np.unique(components[rows, columns][horizontal[rows, columns]])
            # A complete glyph's horizontal stroke is not a fraction rule.
            if any(
                source_id > 0
                and 0.6 * line_h <= glyph_bounds[source_id - 1][0].stop
                - glyph_bounds[source_id - 1][0].start <= 1.3 * line_h
                and 0.4 * line_h <= glyph_bounds[source_id - 1][1].stop
                - glyph_bounds[source_id - 1][1].start <= 1.5 * line_h
                for source_id in source_ids
            ):
                continue
            rules.append((columns.start, columns.stop - 1))
    if not rules:
        return False
    glyphs = []
    tall_glyphs = []
    for component_id, bounds in enumerate(glyph_bounds, 1):
        if bounds is None:
            continue
        rows, columns = bounds
        if (
            0.5 * line_h <= rows.stop - rows.start <= 1.5 * line_h
            and 0.2 * line_h <= columns.stop - columns.start <= 1.6 * line_h
            and np.count_nonzero(components[bounds] == component_id) >= 0.06 * line_h ** 2
            and not any(
                rule_left - 0.5 * line_h <= (columns.start + columns.stop - 1) / 2
                <= rule_right + 0.5 * line_h
                for rule_left, rule_right in rules
            )
        ):
            glyphs.append(((rows.start + rows.stop - 1) / 2, columns.start, columns.stop))
        elif (
            1.8 * line_h <= rows.stop - rows.start <= 3.2 * line_h
            and 0.6 * line_h <= columns.stop - columns.start <= 6 * line_h
        ):
            tall_glyphs.append(((rows.start + rows.stop - 1) / 2, columns.start, columns.stop))
    for centre, left, right in tall_glyphs:
        for other_centre, other_left, other_right in glyphs:
            if (
                other_centre - centre >= 0.55 * line_h
                and max(other_left - right, left - other_right) >= 1.5 * line_h
            ):
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
            rows.stop - rows.start > 1.8 * line_h
            and columns.stop - columns.start < 0.6 * line_h
        ):
            region = band[bounds]
            region[components[bounds] == component_id] = False
    counts = band.sum(axis=1)
    remaining = np.flatnonzero(counts > max(8, 0.25 * counts.max()))
    return not remaining.size or remaining[-1] - remaining[0] + 1 <= 2.0 * line_h


def _short_fraction_fragments(
    ink: np.ndarray, prev_a: int, prev_b: int, a: int, b: int, glyph_h: float,
) -> tuple[int, int] | None:
    """Recover a narrow numerator when a short fraction rule and denominator split."""
    if (
        max(prev_b - prev_a + 1, b - a + 1) >= 0.85 * glyph_h
        or a - prev_b > 1.25 * glyph_h
        or b - prev_a + 1 > 3.2 * glyph_h
    ):
        return None
    top = max(0, int(prev_a - 1.4 * glyph_h))
    components, _ = ndimage.label(ink[top:b + 1])
    bounds_list = ndimage.find_objects(components)
    lower_x = np.flatnonzero(ink[a:b + 1].any(axis=0))
    if not lower_x.size:
        return None
    for bounds in bounds_list:
        if bounds is None:
            continue
        rows, columns = bounds
        rule_top, rule_bottom = rows.start + top, rows.stop + top - 1
        left, right = columns.start, columns.stop - 1
        if not (
            prev_a <= rule_top <= rule_bottom <= prev_b
            and rows.stop - rows.start <= 0.25 * glyph_h
            and columns.stop - columns.start >= 1.2 * glyph_h
            and left - 0.15 * glyph_h <= lower_x[0] <= lower_x[-1] <= right + 0.15 * glyph_h
        ):
            continue
        numerators = [
            other[0].start + top
            for other in bounds_list if other is not None
            if 0.4 * glyph_h <= other[0].stop - other[0].start <= 1.5 * glyph_h
            and other[0].stop + top <= rule_top
            and rule_top - (other[0].stop + top) <= 0.5 * glyph_h
            and left <= (other[1].start + other[1].stop - 1) / 2 <= right
        ]
        denominator = any(
            other is not None
            and a <= other[0].start + top <= other[0].stop + top - 1 <= b
            and 0.4 * glyph_h <= other[0].stop - other[0].start <= 1.5 * glyph_h
            and left <= (other[1].start + other[1].stop - 1) / 2 <= right
            for other in bounds_list
        )
        if numerators and denominator:
            return min(prev_a, min(numerators)), b
    return None


def _small_prose_continuation(
    ink: np.ndarray, top: int, top_bottom: int, bottom_top: int, bottom: int,
    glyph_h: float,
) -> bool:
    """Keep left-aligned small-font prose rows out of glyph merging."""
    if (
        not all(
            0.5 * glyph_h <= b - a + 1 <= 1.3 * glyph_h
            for a, b in ((top, top_bottom), (bottom_top, bottom))
        )
    ):
        return False
    rows = []
    lower_glyphs = []
    for a, b in ((top, top_bottom), (bottom_top, bottom)):
        labels, _ = ndimage.label(ink[a:b + 1])
        bounds_list = [
            bounds for bounds in ndimage.find_objects(labels) if bounds is not None
        ]
        glyphs = [
            (r, c)
            for r, c in bounds_list
            if 0.6 * glyph_h <= r.stop - r.start <= 1.1 * glyph_h
            and 0.5 * (r.stop - r.start) <= c.stop - c.start
            <= 1.4 * (r.stop - r.start)
        ]
        if len(glyphs) < (3 if a == top else 1):
            return False
        rows.append((
            float(np.median([r.stop - r.start for r, _ in glyphs])),
            min(c.start for _, c in glyphs),
            max(c.stop for _, c in glyphs),
        ))
        if a == bottom_top:
            lower_glyphs = [
                (slice(a + r.start, a + r.stop), c) for r, c in glyphs
            ]
    (top_h, top_left, _), (bottom_h, bottom_left, _) = rows
    local_h = min(top_h, bottom_h)
    if (
        bottom_top - top_bottom <= 0.1 * local_h
        or max(top_h, bottom_h) > 0.9 * glyph_h
        or abs(top_h - bottom_h) > 0.25 * local_h
        or abs(top_left - bottom_left) > 2.5 * local_h
    ):
        return False
    components, _ = ndimage.label(ink)
    bounds_list = ndimage.find_objects(components)
    # A horizontal stroke within a Chinese glyph is not a covering fraction rule.
    return not any(
        _fraction_denominator(ink, r, c, bounds_list, local_h)
        for r, c in lower_glyphs
    )


def _fraction_denominator(ink, rows, columns, bounds_list, glyph_h: float) -> bool:
    """Require a covering fraction rule and its numerator before hiding a glyph."""
    margin = 0.15 * glyph_h
    top = max(0, rows.start - int(glyph_h))
    horizontal = ndimage.binary_opening(
        ink[top:rows.start],
        structure=np.ones((1, max(2, int(0.7 * glyph_h))), dtype=bool),
    )
    rules, _ = ndimage.label(horizontal)
    for bounds in ndimage.find_objects(rules):
        if bounds is None:
            continue
        rule_rows, rule_columns = bounds
        rule_rows = slice(top + rule_rows.start, top + rule_rows.stop)
        if not (
            rule_rows.stop - rule_rows.start <= 0.25 * glyph_h
            and rule_columns.stop - rule_columns.start >= 0.7 * glyph_h
            and 0 <= rows.start - rule_rows.stop <= 0.6 * glyph_h
            and rule_columns.start - margin <= columns.start
            and columns.stop <= rule_columns.stop + margin
        ):
            continue
        if any(
            0.5 * glyph_h <= numerator_rows.stop - numerator_rows.start <= 1.3 * glyph_h
            and 0.3 * glyph_h <= numerator_columns.stop - numerator_columns.start
            and 0 <= rule_rows.start - numerator_rows.stop <= 0.6 * glyph_h
            and rule_columns.start - margin <= numerator_columns.start
            and numerator_columns.stop <= rule_columns.stop + margin
            for numerator in bounds_list if numerator is not None
            for numerator_rows, numerator_columns in [numerator]
        ):
            return True
    return False


def _small_prose_row_bands(
    ink: np.ndarray, a: int, b: int, glyph_h: float,
) -> list[tuple[int, int]]:
    """Recover slanted small-font rows from full glyphs, not body-font pitch."""
    components, _ = ndimage.label(ink)
    bounds_list = ndimage.find_objects(components)
    glyphs = [
        (rows, columns)
        for bounds in bounds_list if bounds is not None
        for rows, columns in [bounds]
        if a <= (rows.start + rows.stop - 1) / 2 <= b
        and 0.6 * glyph_h <= rows.stop - rows.start <= 1.1 * glyph_h
        and 0.5 * (rows.stop - rows.start) <= columns.stop - columns.start
        <= 1.4 * (rows.stop - rows.start)
    ]
    if len(glyphs) < 6:
        return []
    local_h = float(np.median([r.stop - r.start for r, _ in glyphs]))
    if local_h > 0.9 * glyph_h:
        return []
    glyphs = [
        (r, c) for r, c in glyphs
        if not _fraction_denominator(ink, r, c, bounds_list, local_h)
    ]
    groups = []
    last_centre = None
    for rows, columns in sorted(glyphs, key=lambda glyph: sum(
        (glyph[0].start, glyph[0].stop)
    )):
        centre = (rows.start + rows.stop - 1) / 2
        if last_centre is None or centre - last_centre > 0.75 * local_h:
            groups.append([])
        groups[-1].append((rows, columns))
        last_centre = centre
    if len(groups) < 2 or any(len(group) < 3 for group in groups):
        return []
    bands = []
    lefts = []
    heights = []
    for group in groups:
        top = min(r.start for r, _ in group)
        bottom = max(r.stop - 1 for r, _ in group)
        if bottom - top + 1 > 1.8 * local_h:
            return []
        bands.append((top, bottom))
        lefts.append(min(c.start for _, c in group))
        heights.append(float(np.median([r.stop - r.start for r, _ in group])))
    if (
        max(lefts) - min(lefts) > 2.5 * local_h
        or max(heights) - min(heights) > 0.25 * local_h
    ):
        return []
    return bands


def _connected_radical_row(
    ink: np.ndarray, top: int, cap_bottom: int, row_top: int, bottom: int,
    glyph_h: float,
) -> bool:
    """Join a thin radical cap through an inclined stem, allowing a tiny scan gap."""
    if (
        cap_bottom - top + 1 > 0.45 * glyph_h
        or bottom - row_top + 1 < 0.6 * glyph_h
        or bottom - top + 1 > 2.5 * glyph_h
        or row_top - cap_bottom < 3
    ):
        return False
    band = ink[top:bottom + 1]
    labels, _ = ndimage.label(band)
    cap_height = cap_bottom - top + 1
    main_start = row_top - top
    cap = ndimage.binary_opening(
        band[:cap_height],
        structure=np.ones((1, max(2, int(0.7 * glyph_h))), dtype=bool),
    )
    cap_labels, _ = ndimage.label(cap)
    cap_bounds_list = ndimage.find_objects(cap_labels)
    for component_id, bounds in enumerate(ndimage.find_objects(labels), 1):
        if bounds is None:
            continue
        rows, columns = bounds
        if rows.start >= cap_height or rows.stop <= main_start:
            continue
        component = labels[:, columns] == component_id
        bridge = component[cap_height:main_start]
        widths = bridge.sum(axis=1)
        if not widths.size or widths.min() == 0 or widths.max() > max(3, 0.2 * glyph_h):
            continue
        # A radical descends leftward; a vertical rule linking rows does not.
        first_x = np.flatnonzero(bridge[0]).mean() + columns.start
        last_x = np.flatnonzero(bridge[-1]).mean() + columns.start
        if first_x - last_x < 0.1 * glyph_h:
            continue
        lower_x = np.flatnonzero(component[main_start:].any(axis=0)) + columns.start
        for cap_bounds in cap_bounds_list:
            if cap_bounds is None:
                continue
            cap_rows, cap_columns = cap_bounds
            stem_top_x = (
                np.flatnonzero(component[cap_rows].any(axis=0)) + columns.start
            )
            cap_near_stem = stem_top_x.size and max(
                cap_columns.start - stem_top_x[-1],
                stem_top_x[0] - (cap_columns.stop - 1),
                0,
            ) <= max(2, 0.15 * glyph_h)
            if (
                cap_rows.start <= 0.15 * glyph_h
                and cap_rows.stop - cap_rows.start <= 0.2 * glyph_h
                and cap_columns.stop - cap_columns.start >= 0.7 * glyph_h
                and first_x <= cap_columns.start + 0.15 * glyph_h
                and cap_near_stem
                and lower_x.size
                and lower_x[0] <= cap_columns.start - 0.4 * glyph_h
            ):
                return True
    return False


def line_bands(
    ink: np.ndarray, content_w: int, *, edge_margin_px: int | None = None,
    top_margin_px: int | None = None,
) -> list[tuple[int, int]]:
    """Count printed rows after masking model-identified figures."""
    # Work on a counting-only copy; extraction pixels are never changed.
    ink = ink.copy()
    if top_margin_px is not None:
        if type(top_margin_px) is not int or not 1 <= top_margin_px * 10 <= ink.shape[0]:
            raise ValueError("counting top margin must be an integer from 1..10% of page height")
        ink[:top_margin_px] = False
    edge = (
        max(1, int(ink.shape[1] * 0.01))
        if edge_margin_px is None
        else edge_margin_px
    )
    if not isinstance(edge, int) or not 1 <= edge <= ink.shape[1] * 0.1:
        raise ValueError("counting edge margin must be 1..10% of page width")
    ink[:, :edge] = False
    ink[:, -edge:] = False
    raw = _row_fragments(ink, content_w)
    if not raw:
        return []
    line_h = int(np.median([b - a + 1 for a, b in raw]))
    components, _ = ndimage.label(ink)
    bounds_list = ndimage.find_objects(components)
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
    # Shallow specks cannot protect each other as neighboring text rows.
    # Keep nearby fraction rules when a full-height row anchors them.
    for a, b in raw:
        if edge_margin_px is not None and b - a + 1 <= 0.35 * glyph_h and not any(
            (other_a, other_b) != (a, b)
            and other_b - other_a + 1 > 0.35 * glyph_h
            and min(abs(a - other_b), abs(other_a - b)) <= 1.5 * glyph_h
            for other_a, other_b in raw
        ):
            ink[a:b + 1] = False
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
        if height > 1.8 * line_h and width < 0.5 * line_h and width < 0.2 * height:
            region = ink[bounds]
            region[components[bounds] == component_id] = False
    raw = _row_fragments(ink, content_w)
    if not raw:
        return []
    line_h = int(np.median([b - a + 1 for a, b in raw]))
    # Projection thresholds can miss a narrow standalone quotient such as 1 or 7.
    for component_id, bounds in enumerate(ndimage.find_objects(components), 1):
        if bounds is None:
            continue
        rows, columns = bounds
        height, width = rows.stop - rows.start, columns.stop - columns.start
        if (
            0.6 * line_h <= height <= 1.3 * line_h
            and 0.3 * line_h <= width <= line_h
            and np.count_nonzero(components[bounds] == component_id) >= 0.12 * line_h ** 2
            and not any(a <= rows.start and rows.stop - 1 <= b for a, b in raw)
        ):
            raw.append((rows.start, rows.stop - 1))
    raw.sort()
    merged = []
    merge_gap = max(2.0, GLYPH_GAP_FACTOR * min(line_h, glyph_h))
    for a, b in _merge_close(raw, 0):
        if merged:
            prev_a, prev_b = merged[-1]
            separate_tall_rows = (
                min(prev_b - prev_a + 1, b - a + 1) >= 1.8 * glyph_h
                and not _single_fraction_row(ink, prev_a, b, glyph_h)
            )
            if (
                a - prev_b <= merge_gap and not separate_tall_rows
                and not _small_prose_continuation(
                    ink, prev_a, prev_b, a, b, glyph_h
                )
            ):
                merged[-1] = (prev_a, b)
                continue
        merged.append((a, b))
    joined = []
    fraction_starts = set()
    radical_starts = set()
    for a, b in merged:
        if joined:
            prev_a, prev_b = joined[-1]
            fraction_row = _short_fraction_fragments(
                ink, prev_a, prev_b, a, b, glyph_h
            )
            if fraction_row is not None:
                joined[-1] = fraction_row
                fraction_starts.add(fraction_row[0])
                continue
            if _connected_radical_row(ink, prev_a, prev_b, a, b, glyph_h):
                joined[-1] = (prev_a, b)
                radical_starts.add(prev_a)
                continue
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
            if (
                a - prev_b <= (
                    0.6 if min(heights) < 0.4 * line_h else 0.5
                ) * min(line_h, 1.5 * glyph_h)
                and (
                    compact_fragment and aligned
                    and min(widths) / max(widths) >= 0.65
                    or fraction_spill
                )
                and not _small_prose_continuation(
                    ink, prev_a, prev_b, a, b, glyph_h
                )
            ):
                joined[-1] = (prev_a, b)
                if fraction_spill:
                    fraction_starts.add(prev_a)
                continue
        joined.append((a, b))
    merged = joined

    # Dense glyphs or staggered side-by-side text can keep the row projection
    # continuously live across two or more printed rows. Recover the row count
    # from the page's normal band height and inter-line gap instead of treating
    # one unusually tall projection band as one line.
    typical_h = float(line_h)
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
        if (
            a not in fraction_starts and a not in radical_starts
            and band_h > 1.8 * typical_h and pitch > 0
        ):
            small_prose_rows = _small_prose_row_bands(ink, a, b, glyph_h)
            if small_prose_rows:
                expanded.extend(small_prose_rows)
                continue
            # Brace-connected rows are often shorter than an integral pitch
            # multiple. Count the nearest number of row centres, not a floor.
            count = max(2, int(round((band_h + typical_gap) / pitch)))
            core = counts[a:b + 1]
            strong_rows = _merge_close(
                [(a + x, a + y) for x, y in _runs(core > 0.2 * core.max())],
                max(2, 0.25 * typical_h),
            )
            strong_rows = [
                (x, y) for x, y in strong_rows if y - x + 1 >= 0.3 * typical_h
            ]
            # Smaller footnotes have their own pitch; their distinct cores
            # can outnumber the estimate from the surrounding body font.
            count = max(count, len(strong_rows))
            if band_h <= 2.2 * typical_h and len(strong_rows) < 2:
                count = 1
            if (
                count == 3 and len(strong_rows) == 2
                and strong_rows[0][0] - a < 1.2 * typical_h
                and b - strong_rows[-1][1] < 1.2 * typical_h
            ):
                # A short middle sentence can fall below the long rows' ink threshold.
                middle_text = any(
                    strong_rows[0][1] < rows.start
                    and rows.stop - 1 < strong_rows[1][0]
                    and 0.6 * glyph_h <= rows.stop - rows.start <= 1.3 * glyph_h
                    and 0.4 * glyph_h <= columns.stop - columns.start <= 1.5 * glyph_h
                    and not _fraction_denominator(
                        ink, rows, columns, bounds_list, glyph_h
                    )
                    for bounds in bounds_list if bounds is not None
                    for rows, columns in [bounds]
                )
                if not middle_text:
                    count = 2
            if (
                count == 2 and _single_fraction_row(ink, a, b, typical_h)
                or _single_fraction_row(ink, a, b, min(typical_h, glyph_h))
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
        if thin and not edge_border and band_w < 0.05 * content_w:
            labels, _ = ndimage.label(ink[a:b + 1])
            glyphs = [
                bounds for bounds in ndimage.find_objects(labels)
                if bounds is not None
                and bounds[0].stop - bounds[0].start >= 0.25 * typical_h
                and bounds[1].stop - bounds[1].start >= 0.2 * typical_h
                and bounds[0].stop - bounds[0].start >= (
                    0.35 * (bounds[1].stop - bounds[1].start)
                )
            ]
            # A short final number can be lower than the Chinese body glyphs.
            short_text = bool(glyphs) and band_w >= 0.8 * typical_h
        decoration = edge_border or (
            thin
            and (band_w > 0.3 * content_w or band_w < 0.05 * content_w)
            and not short_text
        )
        if thin and band_w > 0.15 * content_w:
            components, _ = ndimage.label(ink[a:b + 1])
            decoration = decoration or any(
                bounds is not None
                and bounds[1].stop - bounds[1].start >= 0.9 * band_w
                and bounds[0].stop - bounds[0].start < 0.35 * typical_h
                for bounds in ndimage.find_objects(components)
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


def crop(
    png: Path, box: list[int], out: Path, pad: int = 12,
    exclude_boxes: list[list[int]] | None = None,
) -> None:
    img = Image.open(png)
    x, y, w, h = box
    out.parent.mkdir(parents=True, exist_ok=True)
    left, top = max(0, x - pad), max(0, y - pad)
    right, bottom = min(img.width, x + w + pad), min(img.height, y + h + pad)
    result = img.crop((left, top, right, bottom))
    draw = ImageDraw.Draw(result)
    for ex, ey, ew, eh in exclude_boxes or []:
        x0, y0 = max(left, ex), max(top, ey)
        x1, y1 = min(right, ex + ew), min(bottom, ey + eh)
        if x0 < x1 and y0 < y1:
            draw.rectangle((x0 - left, y0 - top, x1 - left - 1, y1 - top - 1), fill="white")
    result.save(out)


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
