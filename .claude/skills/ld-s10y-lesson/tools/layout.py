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


def _arrow_headed_rule(mask: np.ndarray, line_h: float) -> bool:
    """Detect two-sided terminal expansion on the original, un-opened shaft."""
    xs = np.flatnonzero(mask.any(axis=0))
    if xs.size < max(4, 0.5 * line_h):
        return False
    counts = mask.sum(axis=0)[xs]
    centers = (mask * np.arange(mask.shape[0])[:, None]).sum(axis=0)[xs] / counts
    trim = max(1, xs.size // 5)
    shaft_x = xs[trim:-trim]
    fit = np.polyfit(shaft_x, centers[trim:-trim], 1)
    shaft = np.polyval(fit, xs)
    spans = []
    above, below = [], []
    for x, center in zip(xs, shaft):
        ys = np.flatnonzero(mask[:, x])
        spans.append(ys[-1] - ys[0] + 1)
        above.append(center - ys[0])
        below.append(ys[-1] - center)
    middle = float(np.median(spans[trim:-trim]))
    head_min = max(2 * middle, 0.2 * line_h)
    extension = max(2, 0.08 * line_h)
    return any(
        max(spans[part]) > head_min
        and max(above[part]) > middle / 2 + extension
        and max(below[part]) > middle / 2 + extension
        # A diagonal head tapers; a full-height terminal wall has no such span.
        and any(
            middle + extension / 2 < span < max(spans[part]) - extension / 2
            for span in spans[part]
        )
        for part in (slice(0, trim), slice(-trim, None))
    )


def _straight_fraction_rule(mask: np.ndarray, line_h: float) -> bool:
    if _arrow_headed_rule(mask, line_h):
        return False
    counts = mask.sum(axis=0)
    x = np.flatnonzero(counts)
    if len(x) < 2:
        return False
    centers = (
        (mask * np.arange(mask.shape[0])[:, None]).sum(axis=0)[x] / counts[x]
    )
    residual = centers - np.polyval(np.polyfit(x, centers, 1), x)
    return np.percentile(np.abs(residual), 90) <= max(1.0, 0.03 * line_h)


def _thin_fraction_rule(
    mask: np.ndarray, line_h: float, thickness_factor: float = 0.2
) -> bool:
    """Measure rule thickness across columns independently of small scan skew."""
    if not _straight_fraction_rule(mask, line_h):
        return False
    x = np.flatnonzero(mask.any(axis=0))
    spans = [
        ys[-1] - ys[0] + 1 for column in x
        for ys in [np.flatnonzero(mask[:, column])]
    ]
    counts = mask.sum(axis=0)[x]
    centers = (mask * np.arange(mask.shape[0])[:, None]).sum(axis=0)[x] / counts
    return (
        np.percentile(spans, 90) <= thickness_factor * line_h
        and abs(np.polyfit(x, centers, 1)[0]) <= 0.1
    )


def _bar_local_fraction_support(
    components: np.ndarray, original_bounds, original_ids, rows, columns,
    line_h: float,
) -> bool:
    """Require detached, aligned fraction glyphs around a short body-connected bar."""
    if columns.stop - columns.start >= 2 * line_h:
        return False
    upper, lower = [], []
    for component_id, bounds in enumerate(original_bounds, 1):
        if bounds is None or component_id in original_ids:
            continue
        glyph_rows, glyph_columns = bounds
        height = glyph_rows.stop - glyph_rows.start
        if not (
            0.6 * line_h <= height <= 1.8 * line_h
            and glyph_columns.stop - glyph_columns.start >= 0.2 * line_h
            and columns.start <= glyph_columns.start < glyph_columns.stop <= columns.stop
        ):
            continue
        if 0 <= rows.start - glyph_rows.stop <= 0.75 * line_h:
            upper.append(glyph_columns)
        if 0 <= glyph_rows.start - rows.stop <= 0.75 * line_h:
            lower.append(glyph_columns)
    if not any(
        max(first.start, second.start) < min(first.stop, second.stop)
        for first in upper for second in lower
    ):
        return False
    for component_id in original_ids:
        if not component_id:
            continue
        bounds = original_bounds[component_id - 1]
        body_rows, body_columns = bounds
        outside = max(
            columns.start - body_columns.start, body_columns.stop - columns.stop
        )
        if not (
            outside >= 0.2 * line_h
            and 0.6 * line_h <= body_rows.stop - body_rows.start <= 1.8 * line_h
        ):
            return False
        shaft = components[body_rows, columns] == component_id
        # A head ends at a narrow tip before any attached body. Do not mistake
        # a body's expansion beyond the candidate bar for that terminal head.
        for direction in (shaft, shaft[:, ::-1]):
            spans = np.array([
                np.ptp(ys) + 1 if ys.size else 0
                for x in range(direction.shape[1])
                for ys in [np.flatnonzero(direction[:, x])]
            ])
            if spans[0] > 0.2 * line_h:
                continue
            for tip in np.flatnonzero(np.diff(spans) < 0) + 1:
                if _arrow_headed_rule(direction[:, :tip + 1], line_h):
                    return False
    return True


def _original_arrow_decoration(mask: np.ndarray, line_h: float) -> bool:
    """Recognize a headed shaft without discarding an attached full body glyph."""
    if not _arrow_headed_rule(mask, line_h):
        return False
    xs = np.flatnonzero(mask.any(axis=0))
    trim = max(1, xs.size // 5)
    spans = [
        np.ptp(ys) + 1 for x in xs[trim:-trim]
        for ys in [np.flatnonzero(mask[:, x])]
    ]
    if np.median(spans) > 0.2 * line_h:
        return False
    horizontal = ndimage.binary_opening(
        mask, structure=np.ones((1, max(2, int(0.7 * line_h))), dtype=bool)
    )
    shafts, _ = ndimage.label(horizontal)
    body = mask.copy()
    found = False
    for component_id, bounds in enumerate(ndimage.find_objects(shafts), 1):
        if bounds is None or bounds[0].stop - bounds[0].start > 0.2 * line_h:
            continue
        if _straight_fraction_rule(shafts[bounds] == component_id, line_h):
            region = body[bounds]
            region[shafts[bounds] == component_id] = False
            found = True
    if not found:
        return False
    # Head halves are short. A surviving full body means this is not decoration.
    return not any(
        rows.stop - rows.start >= 0.6 * line_h
        and columns.stop - columns.start >= 0.2 * line_h
        for bounds in ndimage.find_objects(ndimage.label(body)[0]) if bounds is not None
        for rows, columns in [bounds]
    )


def _fraction_limit_ownership(components: np.ndarray, rules, line_h: float) -> np.ndarray:
    """Identify fractional evaluation limits beside an established fraction bar."""
    bounds = ndimage.find_objects(components)
    glyphs, bars, delimiters = [], [], []
    for component_id, box in enumerate(bounds, 1):
        if box is None:
            continue
        rows, columns = box
        height, width = rows.stop - rows.start, columns.stop - columns.start
        if 0.35 * line_h <= height <= 0.9 * line_h and 0.15 * line_h <= width <= line_h:
            glyphs.append((component_id, rows, columns))
        if height <= 0.2 * line_h and width >= 0.35 * line_h:
            if _straight_fraction_rule(components[box] == component_id, line_h):
                bars.append((component_id, rows, columns))
        if height >= 2 * line_h and width <= 0.25 * line_h:
            delimiters.append((component_id, rows, columns))
    owned = set()
    for _, stem_rows, stem_columns in delimiters:
        parents = [
            (rows, columns) for _, rows, columns in bars
            if columns.stop - columns.start >= 0.7 * line_h
            and 0 <= stem_columns.start - columns.stop <= 0.75 * line_h
            and stem_rows.start + 0.25 * (stem_rows.stop - stem_rows.start)
            <= (rows.start + rows.stop) / 2
            <= stem_rows.start + 0.75 * (stem_rows.stop - stem_rows.start)
            and any(left <= columns.start and columns.stop - 1 <= right for left, right in rules)
        ]
        for parent_rows, _ in parents:
            side_glyphs = [
                item for item in glyphs
                if stem_columns.stop <= item[2].start
                and item[2].stop <= stem_columns.stop + line_h
            ]
            upper_integers = [
                item for item in side_glyphs
                if stem_rows.start - 0.5 * line_h <= item[1].start
                and item[1].stop <= stem_rows.start + 0.75 * line_h
                and item[1].stop <= parent_rows.start - 0.2 * line_h
            ]
            lower_integers = [
                item for item in side_glyphs
                if stem_rows.stop - 0.75 * line_h <= item[1].start
                and item[1].stop <= stem_rows.stop + 0.75 * line_h
                and item[1].start >= parent_rows.stop + 0.2 * line_h
            ]
            # Detached integer limits need both ends of the same delimiter.
            # An intervening aligned bar instead belongs to a fractional limit.
            for upper in upper_integers:
                for lower in lower_integers:
                    if (
                        max(upper[2].start, lower[2].start)
                        >= min(upper[2].stop, lower[2].stop)
                        or any(
                            parent_rows.stop <= rows.start < lower[1].start
                            and max(columns.start, lower[2].start)
                            < min(columns.stop, lower[2].stop)
                            for _, rows, columns in bars
                        )
                    ):
                        continue
                    owned.update((upper[0], lower[0]))
            for bar_id, rows, columns in bars:
                if not (
                    columns.stop - columns.start <= 1.1 * line_h
                    and 0 <= columns.start - stem_columns.stop <= 0.75 * line_h
                    and 0.35 * line_h <= rows.start - parent_rows.stop <= 1.75 * line_h
                ):
                    continue
                aligned = [
                    item for item in glyphs
                    if columns.start <= item[2].start and item[2].stop <= columns.stop
                ]
                upper_limits = [
                    item for item in aligned
                    if stem_rows.start <= item[1].start
                    and item[1].stop <= parent_rows.start - 0.2 * line_h
                ]
                numerators = [
                    item for item in aligned
                    if parent_rows.stop <= item[1].start
                    and 0 <= rows.start - item[1].stop <= 0.75 * line_h
                ]
                denominators = [
                    item for item in aligned
                    if 0 <= item[1].start - rows.stop <= 0.75 * line_h
                    and item[1].stop <= stem_rows.stop + 0.25 * line_h
                ]
                if upper_limits and any(
                    max(first[2].start, second[2].start) < min(first[2].stop, second[2].stop)
                    for first in numerators for second in denominators
                ):
                    owned.add(bar_id)
                    owned.update(item[0] for item in upper_limits + numerators + denominators)
    return np.isin(components, list(owned))


def _bounded_carrier_limit_ownership(components: np.ndarray, line_h: float) -> np.ndarray:
    """Own paired endpoint groups, retaining complete original source components."""
    bounds = ndimage.find_objects(components)
    carriers = [
        (component_id, rows, columns)
        for component_id, box in enumerate(bounds, 1) if box is not None
        for rows, columns in [box]
        if 2 * line_h <= rows.stop - rows.start <= 4.5 * line_h
        and columns.stop - columns.start <= 0.65 * line_h
        and columns.stop - columns.start < 0.3 * (rows.stop - rows.start)
    ]
    owned = set()
    for carrier_id, stem_rows, stem_columns in carriers:
        center = (stem_rows.start + stem_rows.stop) / 2
        sides = []
        for upper in (True, False):
            endpoint = stem_rows.start if upper else stem_rows.stop
            candidates = [
                (component_id, rows, columns)
                for component_id, box in enumerate(bounds, 1)
                if box is not None and component_id != carrier_id
                for rows, columns in [box]
                if 0.1 * line_h <= rows.stop - rows.start <= 0.9 * line_h
                and 0.15 * line_h <= columns.stop - columns.start <= line_h
                and stem_columns.stop <= columns.start
                and columns.stop <= stem_columns.stop + 1.75 * line_h
                and endpoint - 0.75 * line_h <= rows.start
                and rows.stop <= endpoint + 0.75 * line_h
                and (rows.stop < center - 0.5 * line_h if upper
                     else rows.start > center + 0.5 * line_h)
            ]
            groups = []
            for item in sorted(candidates, key=lambda item: item[2].start):
                if (
                    not groups
                    or item[2].start - max(peer[2].stop for peer in groups[-1]) > 0.4 * line_h
                ):
                    groups.append([])
                groups[-1].append(item)
            sides.append([
                group for group in groups
                if min(item[2].start for item in group) - stem_columns.stop <= 0.75 * line_h
                and any(item[1].stop - item[1].start >= 0.35 * line_h for item in group)
                and max(item[1].start for item in group) < min(item[1].stop for item in group)
            ])
        for upper in sides[0]:
            for lower in sides[1]:
                if max(
                    min(item[2].start for item in upper), min(item[2].start for item in lower)
                ) < min(
                    max(item[2].stop for item in upper), max(item[2].stop for item in lower)
                ):
                    owned.update(item[0] for item in upper + lower)
    return np.isin(components, list(owned))


def _bounded_fraction_rules(components: np.ndarray, rules, line_h: float):
    """Complete short or broken rules only with detached two-sided glyph support."""
    bounds = ndimage.find_objects(components)
    bars, glyphs = [], []
    for component_id, box in enumerate(bounds, 1):
        if box is None:
            continue
        rows, columns = box
        height, width = rows.stop - rows.start, columns.stop - columns.start
        if height <= 0.2 * line_h and width >= 0.35 * line_h:
            if _straight_fraction_rule(components[box] == component_id, line_h):
                bars.append((rows, columns))
        if 0.1 * line_h <= height <= 1.8 * line_h and width >= 0.15 * line_h:
            glyphs.append((rows, columns))
    groups = []
    for item in sorted(bars, key=lambda item: item[1].start):
        for group in groups:
            if (
                0 <= item[1].start - max(peer[1].stop for peer in group) <= 0.2 * line_h
                and max(item[0].start, max(peer[0].start for peer in group))
                < min(item[0].stop, min(peer[0].stop for peer in group))
            ):
                group.append(item)
                break
        else:
            groups.append([item])
    completed = list(rules)
    for group in groups:
        left, right = min(item[1].start for item in group), max(item[1].stop for item in group)
        top, bottom = min(item[0].start for item in group), max(item[0].stop for item in group)
        if (
            bottom - top > 0.25 * line_h
            or any(x <= left and right - 1 <= y for x, y in rules)
        ):
            continue
        seeded = any(left <= x <= y < right for x, y in rules)
        if not seeded and right - left >= 0.7 * line_h:
            continue
        # Detached diagonal heads must remain in the rule's source context.
        margin = max(2, int(0.25 * line_h))
        context_labels = components[max(0, top - margin):bottom + margin, left:right]
        full_glyph_ids = [
            component_id for component_id, box in enumerate(bounds, 1)
            if box is not None and box[0].stop - box[0].start >= 0.35 * line_h
        ]
        # A clipped full numerator is not a detached short head fragment.
        context = (context_labels > 0) & ~np.isin(context_labels, full_glyph_ids)
        headed = _arrow_headed_rule(context, line_h)
        for direction in (context, context[:, ::-1]):
            spans = np.array([
                np.ptp(ys) + 1 if ys.size else 0
                for x in range(direction.shape[1])
                for ys in [np.flatnonzero(direction[:, x])]
            ])
            headed |= any(
                _arrow_headed_rule(direction[:, :tip + 1], line_h)
                for tip in np.flatnonzero(np.diff(spans) < 0) + 1
            )
        if headed:
            continue
        sides = []
        for upper in (True, False):
            local = [
                (rows, columns) for rows, columns in glyphs
                if left - 0.25 * line_h <= columns.start
                and columns.stop <= right + 0.25 * line_h
                and (0 <= top - rows.stop <= 0.75 * line_h if upper
                     else 0 <= rows.start - bottom <= 0.75 * line_h)
            ]
            supported = []
            for rows, _ in local:
                if rows.stop - rows.start < 0.35 * line_h:
                    continue
                peers = [
                    columns for peer_rows, columns in local
                    if max(rows.start, peer_rows.start) < min(rows.stop, peer_rows.stop)
                ]
                supported.append((min(columns.start for columns in peers),
                                  max(columns.stop for columns in peers)))
            sides.append(supported)
        if any(max(x, u) < min(y, v) for x, y in sides[0] for u, v in sides[1]):
            completed.append((left, right - 1))
    return completed


def _fraction_rule_has_sides(ink: np.ndarray, rows, columns, line_h: float) -> bool:
    """A fraction bar needs local numerator and denominator ink in its columns."""
    reach = max(1, int(0.75 * line_h))
    return all(
        occupied.size and occupied[-1] - occupied[0] + 1 >= 0.2 * line_h
        for side in (
            ink[max(0, rows.start - reach):rows.start, columns],
            ink[rows.stop:rows.stop + reach, columns],
        )
        for occupied in [np.flatnonzero(side.any(axis=1))]
    )


def _single_fraction_row(
    ink: np.ndarray, a: int, b: int, line_h: float,
    source_components: np.ndarray | None = None,
) -> bool:
    """Distinguish tall inline fractions from two full text rows."""
    band = ink[a:b + 1].copy()
    height = band.shape[0]
    rules = []
    rule_supports = []
    components, _ = ndimage.label(band)
    original_components = components
    for component_id, bounds in enumerate(ndimage.find_objects(components), 1):
        if bounds is None:
            continue
        rows, columns = bounds
        if (
            columns.stop - columns.start >= 0.7 * line_h
            and 0.3 * height <= (rows.start + rows.stop) / 2 <= 0.7 * height
            and _thin_fraction_rule(components[bounds] == component_id, line_h)
            and _fraction_rule_has_sides(band, rows, columns, line_h)
        ):
            rules.append((columns.start, columns.stop - 1))
            rule_supports.append((rules[-1], (rows.start + rows.stop) / 2, {component_id}))
    horizontal = ndimage.binary_opening(
        band, structure=np.ones((1, max(2, int(0.7 * line_h))), dtype=bool)
    )
    rule_components, _ = ndimage.label(horizontal)
    original_bounds = ndimage.find_objects(components)
    for rule_component_id, bounds in enumerate(ndimage.find_objects(rule_components), 1):
        if bounds is None:
            continue
        rows, columns = bounds
        original_ids = np.unique(components[bounds][horizontal[bounds]])
        whole_component_arrow = any(
            _arrow_headed_rule(
                components[original_bounds[component_id - 1]] == component_id, line_h
            )
            for component_id in original_ids if component_id
        )
        glyph_stroke = any(
            original_bounds[component_id - 1] is not None
            and columns.stop - columns.start < 2 * line_h
            and 0.6 * line_h <= (
                original_bounds[component_id - 1][0].stop
                - original_bounds[component_id - 1][0].start
            ) <= 1.8 * line_h
            for component_id in original_ids if component_id
        )
        local_fraction = (
            (whole_component_arrow or glyph_stroke)
            and _bar_local_fraction_support(
                components, original_bounds, original_ids, rows, columns, line_h
            )
        )
        if (
            (not whole_component_arrow or local_fraction)
            and (not glyph_stroke or local_fraction)
            and all(
                _straight_fraction_rule(
                    # Connected numerators need only their horizontal bar checked.
                    horizontal[bounds]
                    if original_bounds[component_id - 1][0].stop
                    - original_bounds[component_id - 1][0].start > 0.5 * line_h
                    else components[original_bounds[component_id - 1]] == component_id,
                    line_h,
                )
                for component_id in original_ids if component_id
            )
            and
            _thin_fraction_rule(rule_components[bounds] == rule_component_id, line_h, 0.25)
            and _fraction_rule_has_sides(band, rows, columns, line_h)
            and (
                0.3 * height <= (rows.start + rows.stop) / 2 <= 0.7 * height
                # A nested denominator moves its long outer rule above centre.
                or height > 3 * line_h
                and columns.stop - columns.start >= 2 * line_h
                and 0.2 * height <= (rows.start + rows.stop) / 2 <= 0.8 * height
            )
        ):
            rules.append((columns.start, columns.stop - 1))
            rule_supports.append((
                rules[-1], (rows.start + rows.stop) / 2,
                {int(component_id) for component_id in original_ids if component_id},
            ))
    if not rules:
        return False
    limit_context = original_components if source_components is None else source_components[a:b + 1]
    bounded_limits = _bounded_carrier_limit_ownership(limit_context, line_h)
    if bounded_limits.any():
        rules = _bounded_fraction_rules(original_components, rules, line_h)
        rule_supports = [
            support for support in rule_supports
            if any(left <= support[0][0] <= support[0][1] <= right for left, right in rules)
        ]
        # Completed short/broken bars need their own vertical support as well.
        for component_id, box in enumerate(original_bounds, 1):
            if box is None:
                continue
            rows, columns = box
            if (
                rows.stop - rows.start <= 0.2 * line_h
                and columns.stop - columns.start >= 0.35 * line_h
                and any(left <= columns.start <= columns.stop - 1 <= right for left, right in rules)
                and _straight_fraction_rule(original_components[box] == component_id, line_h)
            ):
                rule_supports.append((
                    (columns.start, columns.stop - 1),
                    (rows.start + rows.stop) / 2, {component_id},
                ))
    rule_centers = [center for _, center, _ in rule_supports]
    accepted_carriers = {
        component_id for _, _, component_ids in rule_supports for component_id in component_ids
    }
    if not rules or not rule_centers:
        return False
    full_fraction_levels = []
    full_glyph_bounds = [
        box for box in original_bounds if box is not None
        and 0.6 * line_h <= box[0].stop - box[0].start <= 1.8 * line_h
        and box[1].stop - box[1].start >= 0.2 * line_h
    ]
    for component_id, box in enumerate(original_bounds, 1):
        if box is None:
            continue
        rows, columns = box
        width = columns.stop - columns.start
        if not (
            width >= 0.7 * line_h
            and any(left <= columns.start and columns.stop - 1 <= right for left, right in rules)
            and _thin_fraction_rule(original_components[box] == component_id, line_h)
        ):
            continue
        aligned = [
            (glyph_rows, glyph_columns) for glyph_rows, glyph_columns in full_glyph_bounds
            if columns.start <= glyph_columns.start and glyph_columns.stop <= columns.stop
        ]
        if any(
            0 <= rows.start - upper.stop <= 0.75 * line_h
            and 0 <= lower.start - rows.stop <= 0.75 * line_h
            and max(first.start, second.start) < min(first.stop, second.stop)
            for upper, first in aligned for lower, second in aligned
        ):
            full_fraction_levels.append((
                (rows.start + rows.stop) / 2, width,
                columns.start, columns.stop - 1,
            ))
    # Whole-column ownership must not swallow two complete, body-scale fractions.
    # An enclosing intermediate bar instead makes them one nested fraction.
    if any(
        abs(first_y - second_y) > 1.5 * line_h
        and min(first_w, second_w) >= 0.7 * max(first_w, second_w)
        and not any(
            min(first_y, second_y) < center < max(first_y, second_y)
            and left <= min(first_left, second_left)
            and max(first_right, second_right) <= right
            and right - left + 1 > max(first_w, second_w)
            for (left, right), center, _ in rule_supports
        )
        for index, (first_y, first_w, first_left, first_right) in enumerate(full_fraction_levels)
        for second_y, second_w, second_left, second_right in full_fraction_levels[index + 1:]
    ):
        return False
    # Limits belong to their delimiter, not to another full body row. Use the
    # original components when counting cleanup has already removed the stem.
    band[_fraction_limit_ownership(limit_context, rules, line_h) | bounded_limits] = False
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
    glyph_components, _ = ndimage.label(band)
    residual_bounds = ndimage.find_objects(glyph_components)
    original_decorations = {
        component_id for component_id, bounds in enumerate(original_bounds, 1)
        if bounds is not None
        and component_id not in accepted_carriers
        and _original_arrow_decoration(original_components[bounds] == component_id, line_h)
    }
    glyph_bounds = []
    for component_id, bounds in enumerate(residual_bounds, 1):
        if bounds is None:
            continue
        rows, columns = bounds
        height = rows.stop - rows.start
        if not (
            0.6 * line_h <= height <= 1.8 * line_h
            and columns.stop - columns.start >= 0.2 * line_h
        ):
            continue
        original_ids = np.unique(
            original_components[bounds][glyph_components[bounds] == component_id]
        )
        if original_ids.size and all(
            original_id in original_decorations for original_id in original_ids
        ):
            continue
        central = glyph_components[
            rows.start + height // 4:rows.stop - height // 4, columns
        ] == component_id
        # A detached delimiter end is wide only at its tip, not through its body.
        if np.ptp(np.flatnonzero(central.any(axis=0))) + 1 >= 0.25 * height:
            glyph_bounds.append((rows, columns))
    # A remote short singleton is not evidence of a second formula body row.
    # Keep connected source context and aligned peers; adjust only the projection.
    support_spans = rules + [
        (columns.start, columns.stop - 1) for _, columns in glyph_bounds
    ]
    context_bounds = ndimage.find_objects(limit_context)
    for component_id, bounds in enumerate(residual_bounds, 1):
        if bounds is None:
            continue
        rows, columns = bounds
        if (
            rows.stop - rows.start >= 0.6 * line_h
            or columns.stop - columns.start >= 0.6 * line_h
            or any(
                columns.start <= right + 2 * line_h
                and columns.stop - 1 >= left - 2 * line_h
                for left, right in support_spans
            )
        ):
            continue
        original_ids = np.unique(
            limit_context[bounds][glyph_components[bounds] == component_id]
        )
        if any(
            box is not None
            and (box[0].stop - box[0].start >= 0.6 * line_h
                 or box[1].stop - box[1].start >= 0.6 * line_h)
            for original_id in original_ids if original_id
            for box in [context_bounds[original_id - 1]]
        ):
            continue
        if any(
            other_id != component_id
            and 0.2 * line_h <= other_rows.stop - other_rows.start
            and other_columns.stop - other_columns.start >= 0.15 * line_h
            and columns.start <= other_columns.stop + 2 * line_h
            and columns.stop >= other_columns.start - 2 * line_h
            and max(rows.start, other_rows.start) < min(rows.stop, other_rows.stop)
            for other_id, box in enumerate(residual_bounds, 1) if box is not None
            for other_rows, other_columns in [box]
        ):
            continue
        counts[rows] -= (glyph_components[bounds] == component_id).sum(axis=1)
    # Skew widens a row's envelope. Neighboring full glyphs must still overlap
    # through their central half, unlike independently supported text rows.
    # A complete adjacent row may be slightly shorter than the page median.
    # Fraction bars connect the formula's horizontal support. A distant singleton
    # cannot establish another body row, but repeated glyph groups still can.
    support_groups = _merge_close(
        sorted(rules + [
            (columns.start, columns.stop - 1) for _, columns in glyph_bounds
        ]),
        2 * line_h,
    )
    supported_glyphs = []
    for left, right in support_groups:
        group = [
            bounds for bounds in glyph_bounds
            if left <= bounds[1].start and bounds[1].stop - 1 <= right
        ]
        if len(group) >= 2 or any(left <= x <= y <= right for x, y in rules):
            supported_glyphs.extend(group)
    # Rejected singleton glyphs must not widen either residual-row evidence.
    # This changes the counting projection, never the source or ownership mask.
    for component_id, bounds in enumerate(residual_bounds, 1):
        if bounds in glyph_bounds and bounds not in supported_glyphs:
            rows, _ = bounds
            counts[rows] -= (glyph_components[bounds] == component_id).sum(axis=1)
    remaining = np.flatnonzero(counts > max(8, 0.25 * counts.max()))
    glyph_rows = [
        row for rows, _ in supported_glyphs for row in (rows.start, rows.stop - 1)
    ]
    if glyph_rows:
        remaining = np.union1d(remaining, glyph_rows)
    full_glyphs = sorted(supported_glyphs, key=lambda bounds: bounds[1].start)
    if not remaining.size or remaining[-1] - remaining[0] + 1 <= 2.0 * line_h:
        # Compact side captions may be staggered but still share glyph rows.
        affiliated = all(
            any(
                rows.start + 0.25 * (rows.stop - rows.start) - 0.5 * line_h
                <= center
                <= rows.stop - 0.25 * (rows.stop - rows.start) + 0.5 * line_h
                for center in rule_centers
            )
            for rows, _ in full_glyphs
        )
        return affiliated and all(
            max(first.start, second.start) < min(first.stop, second.stop)
            for (first, _), (second, _) in zip(full_glyphs, full_glyphs[1:])
        )
    cores = [
        (rows.start + 0.25 * (rows.stop - rows.start),
         rows.stop - 0.25 * (rows.stop - rows.start))
        for rows, _ in full_glyphs
    ]
    overlapping = all(
        max(a, c) <= min(b, d) for (a, b), (c, d) in zip(cores, cores[1:])
    )
    # Co-row prose remote from every fraction bar is not an inline side caption.
    affiliated = all(
        any(start - 0.5 * line_h <= center <= stop + 0.5 * line_h
            for center in rule_centers)
        for start, stop in cores
    )
    return len(cores) >= 3 and overlapping and affiliated


def _subscript_continues(
    ink: np.ndarray, a: int, split: int, b: int, glyph_h: float
) -> bool:
    """Require small lower glyphs to belong to a matching local upper group."""
    if (
        split <= a or split > b
        or b - a + 1 > 2.8 * glyph_h
        or b - split + 1 > 1.4 * glyph_h
    ):
        return False
    bounds = [
        bounds for bounds in ndimage.find_objects(ndimage.label(ink[a:b + 1])[0])
        if bounds is not None
    ]
    upper, lower = [], []
    for rows, columns in bounds:
        height, width = rows.stop - rows.start, columns.stop - columns.start
        if rows.stop <= split - a and height >= 0.2 * glyph_h:
            upper.append((columns.start, columns.stop - 1, height))
        elif rows.start >= split - a - 0.2 * glyph_h:
            if height >= 0.6 * glyph_h and width >= 0.2 * glyph_h:
                return False
            if height >= 0.1 * glyph_h and width >= 2:
                lower.append((columns.start, columns.stop - 1, height))
        elif height >= 0.6 * glyph_h:
            return False
    supported = False
    for left, right in _merge_close(
        sorted((x, y) for x, y, _ in lower), max(2, 0.4 * glyph_h)
    ):
        # Isolated punctuation/scan specks do not establish a lower text group.
        members = [(x, y, h) for x, y, h in lower if left <= x <= y <= right]
        if len(members) < 3:
            continue
        width = right - left + 1
        local_upper = [
            (x, y, h) for x, y, h in upper
            if left - 0.25 * glyph_h <= x <= right + 0.25 * glyph_h
        ]
        if not local_upper or not any(h >= 0.6 * glyph_h for _, _, h in local_upper):
            return False
        x = min(x for x, _, _ in local_upper)
        y = max(y for _, y, _ in local_upper)
        if not (
            0.7 * glyph_h <= y - x + 1 <= 2.5 * glyph_h
            and 0.55 <= width / (y - x + 1) <= 1.6
            and abs((left + right) - (x + y)) <= 0.8 * glyph_h
        ):
            return False
        supported = True
    return supported


def _fraction_prefix_rows(ink: np.ndarray, content_w: int, glyph_h: float):
    """Find supported prose rows before a proposed fraction boundary."""
    fragments = _row_fragments(ink, content_w)
    supported = _supported_glyph_rows(ink, fragments, glyph_h)
    return supported or (fragments if _small_text_rows(ink, fragments, glyph_h) else [])


def _fraction_tail_split(
    ink: np.ndarray, a: int, b: int, content_w: int, glyph_h: float,
    source_components: np.ndarray | None = None,
) -> int | None:
    """Separate supported prose from an independently valid fraction of any height."""
    whole_fraction = _single_fraction_row(ink, a, b, glyph_h, source_components)
    if whole_fraction:
        return None
    fragments = _row_fragments(ink[a:b + 1], content_w)
    for (_, prev_b), (next_a, _) in zip(fragments, fragments[1:]):
        cut = a + (prev_b + next_a + 1) // 2
        if cut - a < 0.6 * glyph_h:
            continue
        prefix_rows = _fraction_prefix_rows(ink[a:cut], content_w, glyph_h)
        if not prefix_rows:
            continue
        tail_fraction = _single_fraction_row(ink, cut, b, glyph_h, source_components)
        if tail_fraction:
            return cut
    return None


def _supported_glyph_rows(
    ink: np.ndarray, fragments, glyph_h: float
) -> list[tuple[int, int]]:
    """Require full body components, not an arrow fragment's projection envelope."""
    components, _ = ndimage.label(ink)
    bounds = ndimage.find_objects(components)
    return [
        (a, b) for a, b in fragments
        if any(
            a - 0.15 * glyph_h <= rows.start
            and rows.stop - 1 <= b + 0.15 * glyph_h
            and 0.6 * glyph_h <= rows.stop - rows.start <= 1.8 * glyph_h
            and columns.stop - columns.start >= 0.2 * glyph_h
            and not _arrow_headed_rule(components[item] == component_id, glyph_h)
            for component_id, item in enumerate(bounds, 1)
            if item is not None for rows, columns in [item]
        )
    ]


def _small_text_rows(ink: np.ndarray, fragments, glyph_h: float) -> bool:
    """Retain repeated, independently supported rows in a smaller local font."""
    if _supported_glyph_rows(ink, fragments, glyph_h):
        return False
    if len(fragments) < 2:
        return False
    bounds = ndimage.find_objects(ndimage.label(ink)[0])
    heights = []
    for a, b in fragments:
        local = [
            rows.stop - rows.start
            for item in bounds if item is not None for rows, columns in [item]
            if a <= rows.start and rows.stop - 1 <= b
            and 0.35 * glyph_h <= rows.stop - rows.start < 0.6 * glyph_h
            and columns.stop - columns.start >= 0.2 * glyph_h
        ]
        if len(local) < 2:
            return False
        heights.append(float(np.median(local)))
    return max(heights) <= 1.25 * min(heights)


def _decorated_folio(ink: np.ndarray, a: int, b: int, glyph_h: float) -> bool:
    if a < 0.9 * ink.shape[0] or b - a + 1 > glyph_h:
        return False
    band = ink[a:b + 1]
    groups = _merge_close(
        [
            (x, y) for x, y in _runs(band.any(axis=0))
            if y - x + 1 >= max(2, 0.1 * glyph_h)
        ],
        max(2, 0.45 * glyph_h),
    )
    if len(groups) != 3:
        return False
    heights = []
    for x, y in groups:
        rows = np.flatnonzero(band[:, x:y + 1].any(axis=1))
        heights.append(int(rows[-1] - rows[0] + 1))
    return (
        max(heights[0], heights[2]) < 0.5 * glyph_h
        and heights[1] >= 0.4 * glyph_h
        and max(groups[0][1] - groups[0][0], groups[2][1] - groups[2][0])
        < 0.5 * glyph_h
    )


def _folio_fragment_continues(
    ink: np.ndarray, prev_a: int, prev_b: int, a: int, b: int, glyph_h: float
) -> bool:
    if not _decorated_folio(ink, prev_a, b, glyph_h):
        return False
    components, _ = ndimage.label(ink[prev_a:b + 1])
    shared = np.intersect1d(
        np.unique(components[:prev_b - prev_a + 1]),
        np.unique(components[a - prev_a:]),
    )
    bounds = ndimage.find_objects(components)
    return any(
        rows.stop - rows.start >= 0.4 * glyph_h
        and columns.stop - columns.start >= max(2, 0.1 * glyph_h)
        for component_id in shared if component_id
        for rows, columns in [bounds[component_id - 1]]
    )


def _overhead_angle_mark(mask: np.ndarray, glyph_h: float) -> bool:
    """Recognize a shallow two-arm angle accent, not a complete body glyph."""
    ys = np.flatnonzero(mask.any(axis=1))
    xs = np.flatnonzero(mask.any(axis=0))
    if not ys.size or not xs.size:
        return False
    height, width = ys[-1] - ys[0] + 1, xs[-1] - xs[0] + 1
    if not (0.2 * glyph_h <= height <= 0.6 * glyph_h and width >= max(glyph_h, 2 * height)):
        return False
    counts = mask.sum(axis=0)[xs]
    centers = (mask * np.arange(mask.shape[0])[:, None]).sum(axis=0)[xs] / counts
    apex = int(np.argmin(centers))
    if not 0.25 * len(xs) <= apex <= 0.75 * len(xs):
        return False
    spans = [
        occupied[-1] - occupied[0] + 1
        for x in xs for occupied in [np.flatnonzero(mask[:, x])]
    ]
    if np.median(spans) > 0.2 * glyph_h:
        return False
    for arm, direction in ((slice(None, apex + 1), -1), (slice(apex, None), 1)):
        fit = np.polyfit(xs[arm], centers[arm], 1)
        residual = centers[arm] - np.polyval(fit, xs[arm])
        if (
            direction * fit[0] <= 0
            or np.ptp(centers[arm]) < 0.2 * glyph_h
            or np.percentile(np.abs(residual), 90) > max(1, 0.06 * glyph_h)
        ):
            return False
    return True


def _overhead_arrow_continues(
    ink: np.ndarray, components: np.ndarray, bounds_list,
    prev_a: int, prev_b: int, a: int, b: int, glyph_h: float, content_w: int,
) -> bool:
    """Attribute a clipped shaft or angle accent to its horizontally related body."""
    if not 0 < a - prev_b <= 0.75 * glyph_h:
        return False
    original_ids = np.unique(components[prev_a:prev_b + 1][ink[prev_a:prev_b + 1]])
    if not original_ids.size:
        return False
    for component_id in original_ids:
        bounds = bounds_list[component_id - 1]
        rows, _ = bounds
        angle_mark = _overhead_angle_mark(components[bounds] == component_id, glyph_h)
        if (
            rows.stop > a
            or prev_a <= rows.start and rows.stop - 1 <= prev_b and not angle_mark
            or not angle_mark
            and not _original_arrow_decoration(components[bounds] == component_id, glyph_h)
        ):
            return False
    fragments = _row_fragments(ink[a:b + 1], content_w)
    if len(fragments) != 1 or not _supported_glyph_rows(ink[a:b + 1], fragments, glyph_h):
        return False
    body_ids = np.unique(components[a:b + 1][ink[a:b + 1]])
    bodies = [
        columns for component_id in body_ids
        for rows, columns in [bounds_list[component_id - 1]]
        if a <= rows.start and rows.stop - 1 <= b
        and 0.45 * glyph_h <= rows.stop - rows.start <= 1.8 * glyph_h
        and columns.stop - columns.start >= 0.2 * glyph_h
        and not _arrow_headed_rule(
            components[bounds_list[component_id - 1]] == component_id, glyph_h
        )
    ]
    return all(
        any(max(columns.start, body.start) < min(columns.stop, body.stop) for body in bodies)
        for component_id in original_ids
        for _, columns in [bounds_list[component_id - 1]]
    )


def _fragmented_body_scale(components, bounds_list, line_h: float) -> int:
    """Recover coherent full glyphs when projection retained only their strokes."""
    heights = []
    for component_id, bounds in enumerate(bounds_list, 1):
        if bounds is None:
            continue
        rows, columns = bounds
        height, width = rows.stop - rows.start, columns.stop - columns.start
        if (
            height >= max(MIN_BAND_HEIGHT, 1.8 * line_h)
            and max(MIN_BAND_WIDTH, 0.2 * height) <= width <= 1.3 * height
            and np.count_nonzero(components[bounds] == component_id) >= 0.12 * height ** 2
            and not _arrow_headed_rule(components[bounds] == component_id, height)
        ):
            heights.append(height)
    if len(heights) < 3 or np.percentile(heights, 75) > 1.25 * np.percentile(heights, 25):
        return 0
    return int(np.median(heights))


def _body_supported_heights(components, bounds_list, spans, arrow_components):
    """Keep repeated body glyphs, not singleton limits, as row-scale evidence."""
    heights = []
    for a, b in spans:
        height = b - a + 1
        supported = 0
        for component_id, bounds in enumerate(bounds_list, 1):
            if bounds is None or component_id in arrow_components:
                continue
            rows, columns = bounds
            if (
                a - 0.15 * height <= rows.start
                and rows.stop - 1 <= b + 0.15 * height
                and 0.6 * height <= rows.stop - rows.start <= 1.3 * height
                and 0.2 * height <= columns.stop - columns.start <= 1.3 * height
                and np.count_nonzero(components[bounds] == component_id) >= 0.12 * height ** 2
            ):
                supported += 1
        if supported >= 3:
            heights.append(height)
    return heights


def _single_carrier_row(components, bounds_list, a: int, b: int, glyph_h: float) -> bool:
    """A tall narrow carrier may extend one body row, but cannot hide another."""
    if b - a + 1 > 3.2 * glyph_h:
        return False
    local = [
        bounds for bounds in bounds_list if bounds is not None
        and a - 0.25 * glyph_h <= bounds[0].start
        and bounds[0].stop - 1 <= b + 0.25 * glyph_h
    ]
    carriers = [
        bounds for bounds in local for rows, columns in [bounds]
        if 1.5 * glyph_h < rows.stop - rows.start <= 3.2 * glyph_h
        and columns.stop - columns.start < 0.6 * glyph_h
        and columns.stop - columns.start < 0.3 * (rows.stop - rows.start)
    ]
    if not carriers:
        return False
    bodies = [
        bounds for bounds in local for rows, columns in [bounds]
        if bounds not in carriers
        and 0.6 * glyph_h <= rows.stop - rows.start <= 1.8 * glyph_h
        and columns.stop - columns.start >= 0.2 * glyph_h
    ]
    if len(bodies) < 3:
        return False
    top = max(rows.start + 0.25 * (rows.stop - rows.start) for rows, _ in bodies)
    bottom = min(rows.stop - 0.25 * (rows.stop - rows.start) for rows, _ in bodies)
    if top > bottom:
        return False
    limits = {}
    for rows, columns in local:
        height = rows.stop - rows.start
        width = columns.stop - columns.start
        if height < 0.3 * glyph_h or width < 0.15 * glyph_h:
            continue
        if (rows, columns) in carriers or (rows, columns) in bodies:
            continue
        if rows.start <= bottom and rows.stop >= top:
            continue
        if height >= 0.6 * glyph_h:
            return False
        # Short body-owned marks can miss the common core on a skewed row.
        if any(
            max(0, columns.start - body_columns.stop, body_columns.start - columns.stop)
            <= 0.75 * glyph_h
            and body_rows.start - 0.35 * glyph_h <= rows.start
            and rows.stop <= body_rows.stop + 0.35 * glyph_h
            for body_rows, body_columns in bodies
        ):
            continue
        nearest = [
            index for index, (_, carrier_columns) in enumerate(carriers)
            if carrier_columns.start - 0.5 * glyph_h <= columns.start
            and columns.stop <= carrier_columns.stop + glyph_h
        ]
        if not nearest:
            return False
        key = (nearest[0], rows.stop < top)
        limits[key] = limits.get(key, 0) + 1
        if limits[key] > 2:
            return False
    return True


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
    arrow_components = {
        component_id for component_id, bounds in enumerate(bounds_list, 1)
        if bounds is not None
        and _arrow_headed_rule(components[bounds] == component_id, line_h)
    }
    # Decoration cannot set the body scale that then rejects complete text glyphs.
    body_heights = [
        b - a + 1 for a, b in raw
        if not set(np.unique(components[a:b + 1][ink[a:b + 1]])).issubset(arrow_components)
    ]
    supported_heights = _body_supported_heights(components, bounds_list, raw, arrow_components)
    if len(supported_heights) >= 3:
        body_heights = supported_heights
    line_h = int(np.median(body_heights)) if body_heights else line_h
    glyph_heights = [
        rows.stop - rows.start
        for component_id, bounds in enumerate(bounds_list, 1) if bounds is not None
        for rows, columns in [bounds]
        if 0.25 * line_h <= rows.stop - rows.start <= 1.3 * line_h
        and 0.2 * line_h <= columns.stop - columns.start <= 1.3 * line_h
        and component_id not in arrow_components
    ]
    component_scale = (
        _fragmented_body_scale(components, bounds_list, line_h)
        if len(glyph_heights) < 3 else 0
    )
    if component_scale:
        line_h = component_scale
    glyph_h = (
        float(np.percentile(glyph_heights, 75)) if len(glyph_heights) >= 3 else line_h
    )
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
            stroke = components[bounds] == component_id
            row_widths = stroke.sum(axis=1)
            # Delimiter ends/hooks widen across the stem; a plain streak does not.
            if row_widths.max() > 2 * np.median(row_widths):
                continue
            region = ink[bounds]
            region[stroke] = False
    raw = _row_fragments(ink, content_w)
    if not raw:
        return []
    body_heights = [
        b - a + 1 for a, b in raw
        if not set(np.unique(components[a:b + 1][ink[a:b + 1]])).issubset(arrow_components)
    ]
    supported_heights = _body_supported_heights(components, bounds_list, raw, arrow_components)
    if len(supported_heights) >= 3:
        body_heights = supported_heights
    # Projection refresh must not discard the recovered full-glyph scale.
    line_h = max(component_scale, int(np.median(body_heights))) if body_heights else line_h
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
            if _decorated_folio(ink, a, b, glyph_h):
                # A sparse digit neck can split one folio's row projection.
                if _folio_fragment_continues(ink, prev_a, prev_b, a, b, glyph_h):
                    merged[-1] = (prev_a, b)
                else:
                    merged.append((a, b))
                continue
            separate_tall_rows = (
                min(prev_b - prev_a + 1, b - a + 1) >= 1.8 * glyph_h
                and not _single_fraction_row(ink, prev_a, b, glyph_h)
            )
            # A nearby thin rule needs shared columns before a gap-only join.
            disjoint_thin_fragment = (
                min(prev_b - prev_a + 1, b - a + 1) <= 0.25 * min(line_h, glyph_h)
                and not np.any(
                    ink[prev_a:prev_b + 1].any(axis=0)
                    & ink[a:b + 1].any(axis=0)
                )
            )
            if a - prev_b <= merge_gap and not separate_tall_rows and not disjoint_thin_fragment:
                merged[-1] = (prev_a, b)
                continue
        merged.append((a, b))
    joined = []
    fraction_starts = set()
    for a, b in merged:
        if joined:
            prev_a, prev_b = joined[-1]
            if _decorated_folio(ink, a, b, glyph_h):
                if _folio_fragment_continues(ink, prev_a, prev_b, a, b, glyph_h):
                    joined[-1] = (prev_a, b)
                else:
                    joined.append((a, b))
                continue
            if _overhead_arrow_continues(
                ink, components, bounds_list, prev_a, prev_b, a, b, glyph_h, content_w
            ):
                joined[-1] = (prev_a, b)
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
            subscript_continues = (
                a - prev_b <= 0.75 * min(line_h, glyph_h)
                and _subscript_continues(ink, prev_a, a, b, glyph_h)
            )
            # A delimiter can bridge a sparse projection gap around a fraction.
            shared_strokes = np.intersect1d(
                np.unique(components[prev_a:prev_b + 1][ink[prev_a:prev_b + 1]]),
                np.unique(components[a:b + 1][ink[a:b + 1]]),
            )
            connected_fraction = shared_strokes.size > 0 and _single_fraction_row(
                ink, prev_a, b, min(line_h, glyph_h)
            )
            detached_fraction = (
                shared_strokes.size == 0
                and a - prev_b <= 0.75 * min(line_h, glyph_h)
                and b - prev_a + 1 <= 3.2 * min(line_h, glyph_h)
                and _single_fraction_row(ink, prev_a, b, min(line_h, glyph_h))
            )
            carrier_row = _single_carrier_row(
                components, bounds_list, prev_a, b, min(line_h, glyph_h)
            )
            if (
                a - prev_b <= (
                    0.6 if min(heights) < 0.4 * line_h else 0.5
                ) * min(line_h, 1.5 * glyph_h)
                and (
                    compact_fragment and aligned
                    and min(widths) / max(widths) >= 0.65
                    and _single_fraction_row(ink, prev_a, b, min(line_h, glyph_h))
                    or fraction_spill
                )
                or subscript_continues
                or connected_fraction
                or detached_fraction
                or carrier_row
            ):
                joined[-1] = (prev_a, b)
                if fraction_spill:
                    fraction_starts.add(prev_a)
                continue
        joined.append((a, b))
    merged = []
    index = 0
    while index < len(joined):
        a, b = joined[index]
        cut = _fraction_tail_split(ink, a, b, content_w, glyph_h, components)
        if cut is None and index + 1 < len(joined):
            next_a, next_b = joined[index + 1]
            if (
                b - a + 1 >= 1.8 * glyph_h
                and next_a - b <= 0.75 * glyph_h
                and next_b - a + 1 <= 6 * glyph_h
            ):
                cut = _fraction_tail_split(ink, a, next_b, content_w, glyph_h, components)
                if cut is not None:
                    b = next_b
                    index += 1
        if cut is not None:
            prefix_rows = _fraction_prefix_rows(ink[a:cut], content_w, glyph_h)
            prefix_edges = [a] + [
                a + (prev_b + next_a + 1) // 2
                for (_, prev_b), (next_a, _) in zip(prefix_rows, prefix_rows[1:])
            ] + [cut]
            merged.extend(
                (start, stop - 1) for start, stop in zip(prefix_edges, prefix_edges[1:])
            )
            merged.append((cut, b))
        else:
            merged.append((a, b))
        index += 1

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
        fragments = _row_fragments(ink[a:b + 1], content_w)
        glyph_rows = _supported_glyph_rows(ink[a:b + 1], fragments, glyph_h)
        if _small_text_rows(ink[a:b + 1], fragments, glyph_h):
            glyph_rows = fragments
        compact_text_rows = (
            len(glyph_rows) >= 2
            and all(y - x + 1 <= 1.5 * glyph_h for x, y in glyph_rows)
            or len(glyph_rows) == 1 and len(fragments) > 1
            and all(
                y < glyph_rows[0][0] and glyph_rows[0][0] - y <= 0.75 * glyph_h
                and (
                    _arrow_headed_rule(ink[a + x:a + y + 1], glyph_h)
                    or _overhead_arrow_continues(
                        ink, components, bounds_list, a + x, a + y,
                        a + glyph_rows[0][0], a + glyph_rows[0][1], glyph_h, content_w,
                    )
                )
                for x, y in fragments if (x, y) != glyph_rows[0]
            )
        )
        subscript_row = any(
            _subscript_continues(ink, a, a + x, b, glyph_h)
            for x, _ in fragments[1:]
        )
        carrier_row = _single_carrier_row(components, bounds_list, a, b, glyph_h)
        if (
            a not in fraction_starts
            and not subscript_row
            and not carrier_row
            and (
                band_h > 2.0 * min(typical_h, glyph_h)
                or compact_text_rows
            )
            and pitch > 0
        ):
            # Brace-connected rows are often shorter than an integral pitch
            # multiple. Count the nearest number of row centres, not a floor.
            count = max(2, int(round((band_h + typical_gap) / pitch)))
            core = counts[a:b + 1]
            strong_rows = _merge_close(
                [(a + x, a + y) for x, y in _runs(core > 0.12 * core.max())],
                max(2, 0.25 * typical_h),
            )
            strong_rows = [
                (x, y) for x, y in strong_rows if y - x + 1 >= 0.3 * typical_h
            ]
            count = max(count, min(len(strong_rows), len(glyph_rows)))
            if compact_text_rows:
                # Compact text rows need not share the body's line pitch.
                count = len(glyph_rows)
            if count == 3 and len(strong_rows) == 2 and len(glyph_rows) < 3:
                count = 2
            if (
                count == 2 and _single_fraction_row(ink, a, b, typical_h, components)
                or _single_fraction_row(ink, a, b, min(typical_h, glyph_h), components)
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
        folio = False
        if thin and a >= 0.9 * page_h:
            # A narrow folio digit can extend beyond its projected dot row.
            folio_rows = [
                rows for bounds in bounds_list if bounds is not None
                for rows, columns in [bounds]
                if rows.start <= b and a < rows.stop
                and columns.stop - columns.start >= max(2, 0.1 * glyph_h)
            ]
            if folio_rows:
                folio = _decorated_folio(
                    ink,
                    min(rows.start for rows in folio_rows),
                    max(rows.stop - 1 for rows in folio_rows),
                    glyph_h,
                )
        decoration = edge_border or (
            thin
            and (band_w > 0.3 * content_w or band_w < 0.05 * content_w)
            and not short_text
            and not folio
        )
        if not decoration:
            out.append((a, b))
    return out


def counting_ink(ink: np.ndarray, exclusions: list[dict]) -> np.ndarray:
    """Exclude explicitly inspected non-text objects from counting, not extraction."""
    if not isinstance(exclusions, list):
        raise ValueError("count_exclusions 必须是数组")
    masked = ink.copy()
    height, width = ink.shape
    for entry in exclusions:
        if not isinstance(entry, dict) or set(entry) != {"kind", "box", "reason"}:
            raise ValueError("count_exclusions 每项必须有 kind、box、reason")
        box = entry["box"]
        if (
            not isinstance(box, list) or len(box) != 4
            or any(type(value) is not int for value in box)
        ):
            raise ValueError("count_exclusions.box 必须是四个整数")
        x, y, w, h = box
        if x < 0 or y < 0 or w <= 0 or h <= 0 or x + w > width or y + h > height:
            raise ValueError("count_exclusions.box 超出原图")
        if not isinstance(entry["reason"], str) or not entry["reason"].strip():
            raise ValueError("count_exclusions.reason 不能为空")
        if entry["kind"] == "scan-artifact":
            if not (
                x + w <= 0.05 * width or x >= 0.90 * width
                or y + h <= 0.05 * height or y >= 0.95 * height
            ):
                raise ValueError("scan-artifact 必须位于页边无正文区域")
        elif entry["kind"] == "separator-rule":
            if h > 0.015 * height or w < 0.20 * width:
                raise ValueError("separator-rule 必须是薄分隔横线")
        else:
            raise ValueError("count_exclusions.kind 只允许 scan-artifact / separator-rule")
        masked[y:y + h, x:x + w] = False
    return masked


def _figure_components(ink: np.ndarray, box: list[int]):
    x, y, w, h = box
    H, W = ink.shape
    x0, y0 = max(0, x), max(0, y)
    x1, y1 = min(W - 1, x + w - 1), min(H - 1, y + h - 1)
    labels, n = ndimage.label(ink)
    if n == 0:
        return labels, [], []
    sizes = np.bincount(labels.ravel())
    inside = np.bincount(labels[y0:y1 + 1, x0:x1 + 1].ravel(), minlength=len(sizes))
    boxes = ndimage.find_objects(labels)
    selected = []
    for lab in np.flatnonzero(inside[1:]) + 1:
        if inside[lab] < SNAP_OVERLAP * sizes[lab]:
            continue
        sy, sx = boxes[lab - 1]
        if (sy.stop - sy.start) > 0.9 * H or (sx.stop - sx.start) > 0.9 * W:
            continue
        selected.append(int(lab))
    return labels, selected, boxes


def figure_ink(ink: np.ndarray, box: list[int]) -> np.ndarray:
    """Use the same component ownership as snapping, not the rectangular envelope."""
    labels, selected, _ = _figure_components(ink, box)
    return np.isin(labels, selected)


def figure_component_ownership(
    ink: np.ndarray, figures: list[dict], specification: dict | None,
    render_sha256: str,
) -> dict[str, np.ndarray]:
    """Apply explicit, source-bound whole-component transfers, never pixel cuts."""
    owned = {
        figure["id"]: figure_ink(ink, figure.get("from", figure["box"]))
        for figure in figures
    }
    if specification is None:
        return owned
    if len(owned) != len(figures):
        raise ValueError("figure_component_ownership: duplicate figure identity")
    if (
        not isinstance(specification, dict)
        or set(specification) != {"render_sha256", "transfers"}
        or specification["render_sha256"] != render_sha256
        or not isinstance(specification["transfers"], list)
        or not specification["transfers"]
    ):
        raise ValueError("figure_component_ownership: invalid or stale source binding")
    labels, _ = ndimage.label(ink)
    bounds = ndimage.find_objects(labels)
    by_id = {figure["id"]: figure for figure in figures}
    transfers, seen = [], set()
    for entry in specification["transfers"]:
        if not isinstance(entry, dict) or set(entry) != {
            "from", "to", "box", "pixels", "ink_sha256", "reason",
        }:
            raise ValueError("figure_component_ownership: invalid transfer")
        donor, receiver = entry["from"], entry["to"]
        if (
            not isinstance(donor, str) or not isinstance(receiver, str)
            or donor not in owned or receiver not in owned or donor == receiver
            or not isinstance(entry["reason"], str) or not entry["reason"].strip()
        ):
            raise ValueError("figure_component_ownership: invalid explicit owner")
        box = entry["box"]
        if (
            not isinstance(box, list) or len(box) != 4
            or any(type(value) is not int for value in box)
        ):
            raise ValueError("figure_component_ownership: invalid component box")
        x, y, w, h = box
        if x < 0 or y < 0 or w <= 0 or h <= 0 or x + w > ink.shape[1] or y + h > ink.shape[0]:
            raise ValueError("figure_component_ownership: component outside source")
        ids = np.unique(labels[y:y + h, x:x + w])
        ids = ids[ids != 0]
        if len(ids) != 1:
            raise ValueError("figure_component_ownership: must select one whole component")
        component = int(ids[0])
        rows, cols = bounds[component - 1]
        actual = [cols.start, rows.start, cols.stop - cols.start, rows.stop - rows.start]
        local = labels[rows, cols] == component
        if (
            actual != box or type(entry["pixels"]) is not int
            or entry["pixels"] != int(local.sum())
            or entry["ink_sha256"] != hashlib.sha256(local.tobytes()).hexdigest()
        ):
            raise ValueError("figure_component_ownership: partial or changed component")
        if component in seen:
            raise ValueError("figure_component_ownership: component assigned twice")
        mask = labels == component
        if not (owned[donor] & mask).any() or not (owned[receiver] & mask).any():
            raise ValueError("figure_component_ownership: cannot transfer foreign or own-only ink")
        # A connected stroke extending out of the receiver's original selection
        # cannot be split or silently transferred as a neighbour glyph.
        rx, ry, rw, rh = by_id[receiver].get("from", by_id[receiver]["box"])
        if x < rx or y < ry or x + w > rx + rw or y + h > ry + rh:
            raise ValueError("figure_component_ownership: shared/partial receiver stroke")
        cx, cy, cw, ch = by_id[receiver]["box"]
        if x < cx or y < cy or x + w > cx + cw or y + h > cy + ch:
            raise ValueError("figure_component_ownership: receiver crop cuts component")
        transfers.append((donor, receiver, mask))
        seen.add(component)
    original = np.logical_or.reduce(list(owned.values()))
    for donor, receiver, mask in transfers:
        owned[donor] &= ~mask
        if not owned[donor].any() or not owned[receiver][mask].all():
            raise ValueError("figure_component_ownership: receiver lost transferred ink")
    if not np.array_equal(original, np.logical_or.reduce(list(owned.values()))):
        raise ValueError("figure_component_ownership: source ink lost")
    return owned


def figure_crop_exclusion(
    ink: np.ndarray, owned: np.ndarray, box: list[int]
) -> np.ndarray | None:
    """Remove foreign component edges captured by a snapped figure envelope."""
    x, y, w, h = box
    foreign = ink & ~owned
    if not foreign[max(0, y):y + h, max(0, x):x + w].any():
        return None
    return ndimage.binary_dilation(foreign, iterations=2) & ~owned


def snap(ink: np.ndarray, box: list[int]) -> tuple[list[int], dict]:
    """把粗框吸附到它覆盖的连通域上，按落在框内的比例认领墨迹。"""
    x, y, w, h = box
    H, W = ink.shape
    x0, y0 = max(0, x), max(0, y)
    x1, y1 = min(W - 1, x + w - 1), min(H - 1, y + h - 1)
    _, selected, boxes = _figure_components(ink, box)
    nx0, ny0, nx1, ny1 = x1, y1, x0, y0
    for lab in selected:
        sy, sx = boxes[lab - 1]
        nx0, ny0 = min(nx0, sx.start), min(ny0, sy.start)
        nx1, ny1 = max(nx1, sx.stop - 1), max(ny1, sy.stop - 1)
    if not selected:
        return [x0, y0, x1 - x0 + 1, y1 - y0 + 1], {"components": 0}
    return [int(nx0), int(ny0), int(nx1 - nx0 + 1), int(ny1 - ny0 + 1)],  {
        "components": len(selected), "from": box}


def crop(png: Path, box: list[int], out: Path, pad: int = 12,
         exclude: np.ndarray | None = None) -> None:
    with Image.open(png) as source:
        img = source.copy()
    if exclude is not None:
        if exclude.shape != (img.height, img.width) or exclude.dtype != bool:
            raise ValueError("crop exclusion must be a page-sized boolean mask")
        img = img.copy()
        white = 255 if img.mode == "L" else tuple(255 for _ in img.getbands())
        img.paste(white, mask=Image.fromarray(exclude.astype(np.uint8) * 255))
    x, y, w, h = box
    out.parent.mkdir(parents=True, exist_ok=True)
    left, top = max(0, x - pad), max(0, y - pad)
    right, bottom = min(img.width, x + w + pad), min(img.height, y + h + pad)
    white = 255 if img.mode == "L" else tuple(255 for _ in img.getbands())
    padded = Image.new(img.mode, (right - left, bottom - top), white)
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
