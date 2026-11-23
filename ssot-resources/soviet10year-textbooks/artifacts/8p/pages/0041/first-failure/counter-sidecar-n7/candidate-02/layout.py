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
    band = ink[a:b + 1].copy()
    height = band.shape[0]
    rules = []
    components, _ = ndimage.label(band)
    text_centers = []
    text_glyphs = []
    for bounds in ndimage.find_objects(components):
        if bounds is None:
            continue
        rows, columns = bounds
        if (
            0.75 * line_h <= rows.stop - rows.start <= 1.35 * line_h
            and 0.65 * line_h <= columns.stop - columns.start <= 1.3 * line_h
            and columns.stop - columns.start >= 0.85 * (rows.stop - rows.start)
        ):
            text_centers.append((rows.start + rows.stop) / 2)
            text_glyphs.append((rows, columns))
        if (
            columns.stop - columns.start >= 0.7 * line_h
            and rows.stop - rows.start <= 0.2 * line_h
            and 0.3 * height <= (rows.start + rows.stop) / 2 <= 0.7 * height
        ):
            rules.append((columns.start, columns.stop - 1, (rows.start + rows.stop) / 2))
    # A short second CJK line can vanish under a long first line's ink threshold.
    # Preserve independently visible body-glyph rows before masking rule columns.
    text_rows = [
        (start, end)
        for start, end in _merge_close(
            [(center, center) for center in sorted(text_centers)], 0.4 * line_h
        )
        if sum(start <= center <= end for center in text_centers) >= 3
    ]
    if len(text_rows) >= 2 and text_rows[-1][0] - text_rows[0][1] >= 1.5 * line_h:
        return False
    # Rule-column masking can erase a two-glyph continuation aligned with prose.
    for start, end in _merge_close(
        [(center, center) for center in sorted(text_centers)], 0.4 * line_h
    ):
        short = sorted(
            [(rows, cols) for rows, cols in text_glyphs
             if start <= (rows.start + rows.stop) / 2 <= end],
            key=lambda glyph: glyph[1].start,
        )
        if len(short) != 2 or not (
            0 <= short[1][1].start - short[0][1].stop <= 0.6 * line_h
        ):
            continue
        for body_start, body_end in text_rows:
            if max(start - body_end, body_start - end) < 1.5 * line_h:
                continue
            body = [
                cols for rows, cols in text_glyphs
                if body_start <= (rows.start + rows.stop) / 2 <= body_end
            ]
            if all(
                any(abs(cols.start - other.start) <= 0.25 * line_h for other in body)
                for _, cols in short
            ):
                return False
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
            rules.append((columns.start, columns.stop - 1, (rows.start + rows.stop) / 2))
    if not rules:
        return False
    # An underlined side column is not a fraction when another column has
    # separate body rows, even if its last row contains only one CJK glyph.
    outside = band.copy()
    for left, right, _ in rules:
        margin = int(0.5 * line_h)
        outside[:, max(0, left - margin):min(outside.shape[1], right + margin + 1)] = False
    outside_components, _ = ndimage.label(outside)
    outside_bounds = [
        bounds for bounds in ndimage.find_objects(outside_components) if bounds is not None
    ]
    # Offset short prose can disappear in the pooled ink or column thresholds.
    body_centers = [
        (start + end) / 2
        for start, end in _row_fragments(outside, outside.shape[1])
        if 0.6 * line_h <= end - start + 1 <= 1.35 * line_h
        and any(
            start - 0.25 * line_h <= rows.start
            and rows.stop - 1 <= end + 0.25 * line_h
            and 0.75 * line_h <= rows.stop - rows.start <= 1.35 * line_h
            and 0.2 * line_h <= columns.stop - columns.start <= 1.3 * line_h
            for rows, columns in outside_bounds
        )
    ]
    if len(body_centers) >= 2 and body_centers[-1] - body_centers[0] >= 1.5 * line_h:
        return False
    for left, right in _merge_close(_runs(outside.any(axis=0)), line_h):
        glyphs = [
            (rows, columns)
            for rows, columns in outside_bounds
            if left <= columns.start and columns.stop - 1 <= right
            and 0.75 * line_h <= rows.stop - rows.start <= 1.35 * line_h
            and 0.2 * line_h <= columns.stop - columns.start <= 1.3 * line_h
        ]
        centers = [(rows.start + rows.stop) / 2 for rows, _ in glyphs]
        row_groups = _merge_close(
            [(center, center) for center in sorted(centers)], 0.4 * line_h
        )
        body_rows = []
        for start, end in row_groups:
            fragments = [
                (columns.start, columns.stop - 1, rows.stop - rows.start)
                for rows, columns in glyphs
                if start <= (rows.start + rows.stop) / 2 <= end
            ]
            height = float(np.median([height for _, _, height in fragments]))
            widths = _merge_close([(x, y) for x, y, _ in sorted(fragments)], 0)
            if any(
                max(0.65 * line_h, 0.85 * height) <= y - x + 1 <= 1.3 * line_h
                for x, y in widths
            ):
                body_rows.append((start, end))
        if len(body_rows) >= 2 and body_rows[-1][0] - body_rows[0][1] >= 1.5 * line_h:
            return False
    for left, right, _ in rules:
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
    # Remaining prose must belong beside the fraction, not solely below it.
    return not remaining.size or (
        remaining[-1] - remaining[0] + 1 <= 2.0 * line_h
        and any(
            remaining[0] - line_h <= center <= remaining[-1] + line_h
            for _, _, center in rules
        )
    )


def _has_column_body_rows(
    ink: np.ndarray, a: int, b: int, line_h: float, count: int
) -> bool:
    """Check independent body-glyph rows without pooling staggered columns."""
    band = ink[a:b + 1]
    components, _ = ndimage.label(band)
    bounds_list = [bounds for bounds in ndimage.find_objects(components) if bounds is not None]
    columns = _merge_close(_runs(band.any(axis=0)), line_h)
    for left, right in columns:
        centers = [
            (rows.start + rows.stop) / 2
            for rows, cols in bounds_list
            if left <= cols.start and cols.stop - 1 <= right
            and 0.25 * line_h <= rows.stop - rows.start <= 1.3 * line_h
            and 0.2 * line_h <= cols.stop - cols.start <= 1.3 * line_h
        ]
        rows = [
            (start, end)
            for start, end in _merge_close(
                [(center, center) for center in sorted(centers)], 0.4 * line_h
            )
            if sum(start <= center <= end for center in centers) >= 3
        ]
        if len(rows) >= count:
            return True
    return False


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
    # Emphasis dots below consecutive body glyphs can bridge printed rows.
    # Remove only the isolated dot sequence from this counting-only mask.
    for index, (a, b) in enumerate(raw):
        if index == 0 or b - a + 1 > 0.3 * glyph_h:
            continue
        prev_a, prev_b = raw[index - 1]
        if not (
            0.75 * glyph_h <= prev_b - prev_a + 1 <= 1.35 * glyph_h
            and 0 < a - prev_b <= 0.5 * glyph_h
        ):
            continue
        dots = []
        for component_id, bounds in enumerate(bounds_list, 1):
            if bounds is None:
                continue
            rows, columns = bounds
            if (
                a - 1 <= rows.start and rows.stop - 1 <= b + 1
                and 0.1 * glyph_h <= rows.stop - rows.start <= 0.3 * glyph_h
                and 0.1 * glyph_h <= columns.stop - columns.start <= 0.3 * glyph_h
            ):
                dots.append((component_id, bounds))
        centers = sorted((columns.start + columns.stop) / 2 for _, (_, columns) in dots)
        regular_sequence = len(centers) >= 3 and all(
            0.6 * glyph_h <= gap <= 1.5 * glyph_h for gap in np.diff(centers)
        )
        # A two-glyph row, or a missing dot in a longer sequence, still has
        # independently visible body glyphs directly above its emphasis dots.
        body_columns = [
            columns for bounds in bounds_list if bounds is not None
            for rows, columns in [bounds]
            if prev_a - 1 <= rows.start and rows.stop - 1 <= prev_b + 1
            and 0.1 * glyph_h <= rows.stop - rows.start <= 1.35 * glyph_h
            and 0.1 * glyph_h <= columns.stop - columns.start <= 1.3 * glyph_h
        ]
        aligned_sequence = len(centers) >= 2 and all(
            any(columns.start - 1 <= center <= columns.stop + 1 for columns in body_columns)
            for center in centers
        )
        if not (regular_sequence or aligned_sequence):
            continue
        area = sum(np.count_nonzero(components[bounds] == cid) for cid, bounds in dots)
        if area < 0.8 * np.count_nonzero(ink[max(0, a - 1):b + 2]):
            continue
        for component_id, bounds in dots:
            region = ink[bounds]
            region[components[bounds] == component_id] = False
    # Small gaps can split a compact margin blot into separate ink fragments.
    margin_clusters, _ = ndimage.label(ndimage.binary_closing(
        ink, structure=np.ones((3, 3), dtype=bool)
    ))
    for bounds in ndimage.find_objects(margin_clusters):
        if bounds is None:
            continue
        rows, columns = bounds
        height, width = rows.stop - rows.start, columns.stop - columns.start
        area = np.count_nonzero(ink[bounds])
        clearance = int(2 * glyph_h)
        compact_shape = 0.8 * height <= width <= 1.4 * height
        if not compact_shape and width <= 1.3 * glyph_h and height <= 0.75 * glyph_h:
            # A shallow smear can have thin tails around a solid, glyph-sized core.
            core_size = max(2, int(0.2 * glyph_h))
            core = ndimage.binary_opening(
                ink[bounds], structure=np.ones((core_size, core_size), dtype=bool)
            )
            compact_shape = np.count_nonzero(core) >= 0.7 * area
        margin_blot = (
            (columns.stop <= 0.05 * ink.shape[1]
             or columns.start >= int(0.95 * ink.shape[1]))
            and 0.45 * glyph_h <= height <= 1.3 * glyph_h
            and compact_shape
            and (
                area >= 0.6 * width * height
                or (
                    area >= 0.35 * width * height
                    and not np.any(
                        ndimage.binary_fill_holes(margin_clusters[bounds] > 0)
                        & (margin_clusters[bounds] == 0)
                    )
                )
            )
            and np.count_nonzero(ink[
                max(0, rows.start - clearance):rows.stop + clearance,
                max(0, columns.start - clearance):columns.stop + clearance,
            ]) <= area * 1.1
        )
        if margin_blot:
            ink[bounds] = False
            # Standalone numeral recovery must not resurrect removed ink.
            components[bounds] = 0
    # Separate solid specks can form one margin blot without a full-height glyph.
    fragment_gap = max(3, int(0.4 * glyph_h))
    margin_w = int(0.05 * ink.shape[1]) + fragment_gap
    fragment_mask = np.zeros_like(ink)
    for left, right in ((0, margin_w), (ink.shape[1] - margin_w, ink.shape[1])):
        fragment_mask[:, left:right] = ndimage.binary_closing(
            ink[:, left:right],
            structure=np.ones((fragment_gap, fragment_gap), dtype=bool),
        )
    fragment_clusters, _ = ndimage.label(fragment_mask)
    fragment_bounds = ndimage.find_objects(margin_clusters)
    for bounds in ndimage.find_objects(fragment_clusters):
        if bounds is None:
            continue
        rows, columns = bounds
        height, width = rows.stop - rows.start, columns.stop - columns.start
        if not (
            (columns.stop <= 0.05 * ink.shape[1]
             or columns.start >= int(0.95 * ink.shape[1]))
            and 0.45 * glyph_h <= height <= 1.3 * glyph_h
            and 0.8 * height <= width <= 1.6 * height
        ):
            continue
        ids = np.unique(margin_clusters[bounds])
        fragments = [fragment_bounds[cid - 1] for cid in ids if cid]
        if len(fragments) < 2 or any(
            item[0].stop - item[0].start > 0.75 * glyph_h
            or item[1].stop - item[1].start > 1.3 * glyph_h
            or np.any(
                ndimage.binary_fill_holes(margin_clusters[item] > 0)
                & (margin_clusters[item] == 0)
            )
            for item in fragments
        ):
            continue
        area = np.count_nonzero(ink[bounds])
        dense_fragments = all(
            item[0].stop - item[0].start <= 0.65 * glyph_h
            and np.count_nonzero(ink[item]) >= 0.6 * (
                (item[0].stop - item[0].start) * (item[1].stop - item[1].start)
            )
            for item in fragments
        )
        clearance = int(2 * glyph_h)
        if (
            (area >= 0.35 * width * height or dense_fragments)
            and np.count_nonzero(ink[
                max(0, rows.start - clearance):rows.stop + clearance,
                max(0, columns.start - clearance):columns.stop + clearance,
            ]) <= area * 1.1
        ):
            ink[bounds] = False
            components[bounds] = 0
    # Shallow blemishes must occupy an otherwise isolated projection row.
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
    detected_raw = raw.copy()
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
    independent_body_starts = set()
    merge_gap = max(2.0, GLYPH_GAP_FACTOR * min(line_h, glyph_h))
    for a, b in _merge_close(raw, 0):
        if merged:
            prev_a, prev_b = merged[-1]
            separate_tall_rows = (
                (
                    min(prev_b - prev_a + 1, b - a + 1) >= 1.8 * glyph_h
                    or prev_b - prev_a + 1 >= 1.8 * glyph_h
                    and 0.6 * glyph_h <= b - a + 1 <= 1.35 * glyph_h
                    and _single_fraction_row(ink, prev_a, prev_b, glyph_h)
                )
                and not _single_fraction_row(ink, prev_a, b, glyph_h)
            )
            if (
                a - prev_b <= merge_gap and separate_tall_rows
                and 0.6 * glyph_h <= b - a + 1 <= 1.35 * glyph_h
            ):
                # A proven body row keeps its projection, not recovered glyph tails.
                body_rows = [
                    (x, y) for x, y in detected_raw
                    if a <= x <= y <= b
                    and 0.6 * glyph_h <= y - x + 1 <= 1.35 * glyph_h
                ]
                if len(body_rows) == 1:
                    a, b = body_rows[0]
                independent_body_starts.add(a)
            separate_offset_rows = False
            if (
                a - prev_b <= merge_gap
                and 0.6 * glyph_h <= min(prev_b - prev_a + 1, b - a + 1)
                and max(prev_b - prev_a + 1, b - a + 1) <= 1.35 * glyph_h
            ):
                prev_x = np.flatnonzero(ink[prev_a:prev_b + 1].any(axis=0))
                next_x = np.flatnonzero(ink[a:b + 1].any(axis=0))
                # Complete, horizontally disjoint rows are not split glyph
                # strokes, even when a smaller page number has a close gap.
                separate_offset_rows = prev_x[-1] < next_x[0] or next_x[-1] < prev_x[0]
            if (
                a - prev_b <= merge_gap
                and not separate_tall_rows
                and not separate_offset_rows
                and prev_a not in independent_body_starts
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
            if (
                # Preserve the independent body row on both sides of spill joins.
                a not in independent_body_starts
                and prev_a not in independent_body_starts
                and a - prev_b <= (
                    0.6 if min(heights) < 0.4 * line_h else 0.5
                ) * min(line_h, 1.5 * glyph_h)
                and (
                    compact_fragment and aligned
                    and min(widths) / max(widths) >= 0.65
                    or fraction_spill
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
        if a not in fraction_starts and band_h > 2.2 * typical_h and pitch > 0:
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
            # A wide separator or caption can hide a narrow variable row in
            # the full-width peaks; independent column glyphs veto that loss.
            if (
                count == 3 and len(strong_rows) == 2
                and not _has_column_body_rows(ink, a, b, typical_h, count)
            ):
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
        if not decoration:
            out.append((a, b))
    return out


def snap(
    ink: np.ndarray, box: list[int], *, allow_page_spanning: bool = False
) -> tuple[list[int], dict]:
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
        if not allow_page_spanning and (
            (sy.stop - sy.start) > 0.9 * H or (sx.stop - sx.start) > 0.9 * W
        ):
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
    left, top = max(0, x - pad), max(0, y - pad)
    right, bottom = min(img.width, x + w + pad), min(img.height, y + h + pad)
    # Padding is blank space, not permission to copy a neighboring caption.
    padded = Image.new(img.mode, (right - left, bottom - top), "white")
    padded.paste(img.crop((x, y, x + w, y + h)), (x - left, y - top))
    padded.save(out)


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
