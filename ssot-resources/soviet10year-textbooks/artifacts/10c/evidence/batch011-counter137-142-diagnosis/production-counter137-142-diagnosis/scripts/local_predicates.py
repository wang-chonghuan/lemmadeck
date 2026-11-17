#!/usr/bin/env python3
"""Explain selected saved bands with local ownership predicates, not a recount."""
import argparse
import json
from pathlib import Path
import sys

sys.dont_write_bytecode = True
import numpy as np
from PIL import Image
from scipy import ndimage
from geometry import ROOT, TOOL, digest, load_tool, source_path, component_records

SUSPECTS = {
    140: [
        ("R06-505-506", 752, 857, [[752, 804], [805, 857]]),
        ("R08-509-a", 1026, 1121, [[1026, 1073], [1074, 1121]]),
        ("R09-509-b", 1157, 1256, [[1157, 1206], [1207, 1256]]),
        ("R17-515", 2126, 2219, [[2126, 2172], [2173, 2219]]),
        ("R07-507-508-control", 886, 1019, [[886, 1019]]),
        ("R11-510-control", 1385, 1484, [[1385, 1484]]),
        ("R12-511-control", 1515, 1621, [[1515, 1621]]),
        ("R03-R04-fraction-boundary-control", 477, 617, [[477, 547], [548, 617]]),
    ],
    141: [
        ("R01-516", 233, 326, [[233, 279], [280, 326]]),
        ("R07-519", 858, 957, [[858, 907], [908, 957]]),
        ("R03-517-control", 438, 528, [[438, 528]]),
        ("R05-518-preserve-UNKNOWN-control", 648, 741, [[648, 741]]),
        ("R11-520-control", 1238, 1329, [[1238, 1329]]),
    ],
    142: [
        ("bottom-edge-A", 2479, 2481, [[2479, 2481]]),
        ("bottom-edge-B", 2485, 2488, [[2485, 2488]]),
        ("chapter-separator-control", 626, 640, []),
        ("right-edge818-control", 818, 834, []),
    ],
}


def traced_call(function, *args):
    captured = {}
    def trace(frame, event, value):
        if frame.f_code is function.__code__ and event == "return":
            captured["return_line"] = frame.f_lineno
            for name in (
                "local", "carriers", "bodies", "top", "bottom", "limits",
                "rows", "columns", "height", "width", "nearest",
            ):
                if name in frame.f_locals:
                    captured[name] = frame.f_locals[name]
        return trace
    sys.settrace(trace)
    try:
        result = function(*args)
    finally:
        sys.settrace(None)
    captured["result"] = bool(result)
    return captured


def serializable(value):
    if isinstance(value, slice):
        return [value.start, value.stop]
    if isinstance(value, dict):
        return {str(k): serializable(v) for k, v in value.items()}
    if isinstance(value, (tuple, list)):
        return [serializable(v) for v in value]
    if isinstance(value, np.generic):
        return value.item()
    return value


def short_carrier_trace(trace):
    result = {key: serializable(value) for key, value in trace.items()
              if key not in ("local", "bodies")}
    result["body_count"] = len(trace.get("bodies", []))
    result["body_boxes_xywh"] = [
        [cols.start, rows.start, cols.stop - cols.start, rows.stop - rows.start]
        for rows, cols in trace.get("bodies", [])
    ]
    return result


def final_filter_geometry(ink, a, b, line_h, content_w):
    xs = np.flatnonzero(ink[a:b + 1].any(axis=0))
    width = int(xs[-1] - xs[0] + 1)
    thin = b - a + 1 < 0.4 * line_h
    return {
        "scale": line_h,
        "box": [int(xs[0]), a, width, b - a + 1],
        "thin": thin,
        "edge_border": bool(a < 0.02 * ink.shape[0] and
                            (thin or width > 0.7 * content_w)),
        "width_filter": bool(width > 0.3 * content_w or width < 0.05 * content_w),
        "short_text_width_gate": bool(width >= 0.8 * line_h),
        "bottom_folio_branch": bool(thin and a >= 0.9 * ink.shape[0]),
        "zero_ink": int(ink[a:b + 1].sum()) == 0,
    }


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--page", required=True, type=int, choices=(140, 141, 142))
    args = parser.parse_args()
    page = args.page
    tool = load_tool()
    with Image.open(source_path(page)) as image:
        source_ink = np.asarray(image.convert("L")) < 128
    source_components, _ = ndimage.label(source_ink)
    source_bounds = ndimage.find_objects(source_components)
    ink = source_ink.copy()
    edge = int(ink.shape[1] * 0.01)
    ink[:, :edge] = False
    ink[:, -edge:] = False
    labels, _ = ndimage.label(ink)
    bounds = ndimage.find_objects(labels)
    cols = np.flatnonzero(source_ink.any(axis=0))
    content_w = int(cols[-1] - cols[0] + 1)
    saved = ROOT / (
        ".intentfold/tickets/STEMROBIN-184/tmp/production-source10c140-143/"
        f"10c/pages/{page:04d}/layout.json"
    )
    saved_bands = json.loads(saved.read_text())["line_bands"]
    report = {
        "page": page,
        "source_sha256": digest(source_path(page)),
        "tool_sha256": digest(TOOL),
        "saved_layout_path": str(saved),
        "saved_layout_sha256": digest(saved),
        "scale_note": "42-52 is a local sensitivity range, not an asserted full-page runtime scale",
        "suspects": [],
    }
    for name, a, b, existing in SUSPECTS[page]:
        item = {
            "name": name,
            "y_inclusive": [a, b],
            "saved_bands": existing,
            "saved_bands_present": all(span in saved_bands for span in existing),
            "original_components": component_records(
                source_components, source_bounds, [0, a, 1695, b - a + 1]
            ),
            "scale_predicates": [],
        }
        for scale in (42, 44, 46, 48, 50, 52):
            # Mirror only the tall-streak cleanup inside this selected band.
            local = ink[a:b + 1].copy()
            removed = []
            for cid in np.unique(labels[a:b + 1]):
                if not cid:
                    continue
                rows, columns = bounds[int(cid) - 1]
                height = rows.stop - rows.start
                width = columns.stop - columns.start
                if height > 1.8 * scale and width < 0.5 * scale and width < 0.2 * height:
                    stroke = labels[rows, columns] == cid
                    row_widths = stroke.sum(axis=1)
                    if row_widths.max() > 2 * np.median(row_widths):
                        continue
                    local[labels[a:b + 1] == cid] = False
                    removed.append([columns.start, rows.start, width, height])
            context = labels[a:b + 1]
            carrier = traced_call(
                tool._single_carrier_row, labels, bounds,
                a, b, float(scale),
            )
            local_fragments = tool._row_fragments(local, content_w)
            bounded = tool._bounded_carrier_limit_ownership(context, float(scale))
            owned_ids = np.unique(context[bounded])
            context_bounds = ndimage.find_objects(context)
            owned_boxes = [
                [context_bounds[int(cid) - 1][1].start,
                 a + context_bounds[int(cid) - 1][0].start,
                 context_bounds[int(cid) - 1][1].stop - context_bounds[int(cid) - 1][1].start,
                 context_bounds[int(cid) - 1][0].stop - context_bounds[int(cid) - 1][0].start]
                for cid in owned_ids if cid
            ]
            item["scale_predicates"].append({
                "scale": scale,
                "removed_tall_streak_boxes": removed,
                "carrier": short_carrier_trace(carrier),
                "single_fraction": tool._single_fraction_row(
                    local, 0, b - a, float(scale), context
                ),
                "bounded_limit_boxes": owned_boxes,
                "local_fragments_after_streak_cleanup": [
                    [a + lo, a + hi] for lo, hi in local_fragments
                ],
                "final_filter_geometry": final_filter_geometry(ink, a, b, scale, content_w),
            })
        report["suspects"].append(item)
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
