"""Computational ownership prototype; no page counter or visual output."""
import inspect
import sys

import numpy as np
from scipy import ndimage

import evidence
import ast


def paired_limits(components, scale):
    bounds = ndimage.find_objects(components)
    carriers, owned, pairs = [], set(), []
    for ident, box in enumerate(bounds, 1):
        if box is None:
            continue
        rows, cols = box
        h, w = rows.stop - rows.start, cols.stop - cols.start
        if 2 * scale <= h <= 4.5 * scale and w <= 0.65 * scale and w < 0.3 * h:
            carriers.append((ident, rows, cols))
    for carrier_id, stem_rows, stem_cols in carriers:
        sides = []
        center = (stem_rows.start + stem_rows.stop) / 2
        for upper in (True, False):
            candidates = []
            for ident, box in enumerate(bounds, 1):
                if box is None or ident == carrier_id:
                    continue
                rows, cols = box
                h, w = rows.stop - rows.start, cols.stop - cols.start
                endpoint = stem_rows.start if upper else stem_rows.stop
                if (
                    0.1 * scale <= h <= 0.9 * scale
                    and 0.15 * scale <= w <= scale
                    and stem_cols.stop <= cols.start
                    and cols.stop <= stem_cols.stop + 1.75 * scale
                    and endpoint - 0.75 * scale <= rows.start
                    and rows.stop <= endpoint + 0.75 * scale
                    and (rows.stop < center - 0.5 * scale if upper
                         else rows.start > center + 0.5 * scale)
                ):
                    candidates.append((ident, rows, cols))
            groups = []
            for item in sorted(candidates, key=lambda item: item[2].start):
                if not groups or item[2].start - max(x[2].stop for x in groups[-1]) > 0.4 * scale:
                    groups.append([])
                groups[-1].append(item)
            sides.append([
                group for group in groups
                if min(item[2].start for item in group) - stem_cols.stop <= 0.75 * scale
                and any(item[1].stop - item[1].start >= 0.35 * scale for item in group)
                and max(item[1].start for item in group) < min(item[1].stop for item in group)
            ])
        for upper in sides[0]:
            for lower in sides[1]:
                if max(min(x[2].start for x in upper), min(x[2].start for x in lower)) >= min(
                    max(x[2].stop for x in upper), max(x[2].stop for x in lower)
                ):
                    continue
                ids = [item[0] for item in upper + lower]
                owned.update(ids)
                pairs.append({"carrier_id": carrier_id, "owned_ids": ids})
    return np.isin(components, list(owned)), pairs


def supported_rule_extensions(components, rules, scale):
    bounds = ndimage.find_objects(components)
    bars, glyphs = [], []
    for ident, box in enumerate(bounds, 1):
        if box is None:
            continue
        rows, cols = box
        h, w = rows.stop - rows.start, cols.stop - cols.start
        if h <= 0.2 * scale and w >= 0.35 * scale:
            if evidence_layout._straight_fraction_rule(components[box] == ident, scale):
                bars.append((ident, rows, cols))
        if 0.1 * scale <= h <= 1.8 * scale and w >= 0.15 * scale:
            glyphs.append((ident, rows, cols))
    groups = []
    for item in sorted(bars, key=lambda item: item[2].start):
        for group in groups:
            if (
                0 <= item[2].start - max(x[2].stop for x in group) <= 0.2 * scale
                and max(item[1].start, max(x[1].start for x in group))
                < min(item[1].stop, min(x[1].stop for x in group))
            ):
                group.append(item)
                break
        else:
            groups.append([item])
    added = []
    for group in groups:
        left, right = min(x[2].start for x in group), max(x[2].stop for x in group)
        top, bottom = min(x[1].start for x in group), max(x[1].stop for x in group)
        if bottom - top > 0.25 * scale:
            continue
        seeded = any(left <= x <= y < right for x, y in rules)
        if not seeded and right - left >= 0.7 * scale:
            continue
        sides = []
        for upper in (True, False):
            local = [
                item for item in glyphs
                if left - 0.25 * scale <= item[2].start
                and item[2].stop <= right + 0.25 * scale
                and (0 <= top - item[1].stop <= 0.75 * scale if upper
                     else 0 <= item[1].start - bottom <= 0.75 * scale)
            ]
            supported = []
            for item in local:
                if item[1].stop - item[1].start < 0.35 * scale:
                    continue
                peers = [
                    peer for peer in local
                    if max(item[1].start, peer[1].start) < min(item[1].stop, peer[1].stop)
                ]
                supported.append((min(x[2].start for x in peers), max(x[2].stop for x in peers)))
            sides.append(supported)
        if any(max(x, u) < min(y, v) for x, y in sides[0] for u, v in sides[1]):
            added.append((left, right - 1))
    return list(rules) + added, added


def main():
    global evidence_layout
    layout, (ink, components, bounds, line_h, scale), _ = evidence.arrays()
    evidence_layout = layout
    original = layout._fraction_limit_ownership
    function = ast.parse(inspect.getsource(layout._single_fraction_row)).body[0]
    for index, node in enumerate(function.body):
        if isinstance(node, ast.Assign) and any(
            isinstance(t, ast.Name) and t.id == "full_fraction_levels" for t in node.targets
        ):
            function.body[index:index] = ast.parse(
                "rules = supported_rule_extensions(original_components, rules, line_h)[0]"
            ).body
            break
    namespace = dict(vars(layout), supported_rule_extensions=supported_rule_extensions)
    exec(compile(ast.fix_missing_locations(ast.Module(body=[function], type_ignores=[])),
                 "<fraction-role-prototype>", "exec"), namespace)
    prototype_fraction = namespace[function.name]
    result = []
    for a, b in evidence.REGIONS:
        local = components[a:b + 1]
        mask, pairs = paired_limits(local, scale)
        events = []

        def trace(frame, event, arg):
            if event == "return" and frame.f_code.co_name == "_single_fraction_row":
                events.append({
                    "line": frame.f_lineno, "result": bool(arg),
                    "locals": evidence.plain({
                        key: frame.f_locals.get(key)
                        for key in ("line_h", "rules", "cores", "overlapping", "glyph_bounds", "remaining")
                    }),
                })
            return trace

        def combined(context, rules, glyph_scale):
            return original(context, rules, glyph_scale) | paired_limits(context, glyph_scale)[0]

        layout._fraction_limit_ownership = combined
        namespace["_fraction_limit_ownership"] = combined
        sys.settrace(trace)
        try:
            fraction = prototype_fraction(ink, a, b, scale, components)
        finally:
            sys.settrace(None)
            layout._fraction_limit_ownership = original
        item = {
            "y": [a, b], "pairs": pairs, "owned_pixels": int(mask.sum()),
            "fraction_with_prototype": fraction, "fraction_return_trace": events,
            "supported_rule_extensions": supported_rule_extensions(
                ndimage.label(ink[a:b + 1])[0], events[0]["locals"]["rules"], scale
            )[1],
            "original_component_context_sha256": __import__("hashlib").sha256(local.tobytes()).hexdigest(),
            "original_context_unchanged": bool(np.array_equal(local, components[a:b + 1])),
        }
        result.append(item)
        print({"y": item["y"], "pairs": pairs, "fraction_with_prototype": fraction,
               "return_trace": events})
    evidence.dump(evidence.OUT / "prototype-complete-role-trace.json", {
        "regions": result, "line_h": line_h, "glyph_h": scale,
        "source_sha256": evidence.sha(evidence.SOURCE), "layout_sha256": evidence.sha(evidence.LAYOUT),
        "diagnostic_fullpage_count_calls": 0, "model_image_loads": 0,
    })


if __name__ == "__main__":
    main()
