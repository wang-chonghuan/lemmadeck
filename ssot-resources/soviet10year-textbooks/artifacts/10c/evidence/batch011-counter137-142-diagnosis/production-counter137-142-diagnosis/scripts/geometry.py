#!/usr/bin/env python3
"""Numeric-only bounded-region inspection; never call a full-page row counter."""
import argparse
import hashlib
import importlib.util
import json
from pathlib import Path
import sys

sys.dont_write_bytecode = True
import numpy as np
from PIL import Image
from scipy import ndimage

OWNED = Path(__file__).resolve().parents[1]
ROOT = OWNED.parents[4]
TOOL = ROOT / ".claude/skills/ld-s10y-lesson/tools/layout.py"
FROZEN_TOOL = "5a40298cf32590aa93fc87d5b158efda0e6d85b1defbfe7b8d3fb8a515c325b7"
PAGES = (137, 140, 141, 142)
WINDOWS = {
    137: [
        ("integral-R03", [0, 735, 1695, 120]),
        ("integral-R13", [0, 1600, 1695, 123]),
        ("footnote-separator", [0, 2050, 1695, 65]),
        ("upper-edge", [0, 0, 1695, 180]),
        ("lower-edge", [0, 2320, 1695, 260]),
    ],
    140: [
        ("fraction-R02", [0, 320, 1695, 140]),
        ("inline-fraction-R03", [0, 460, 1695, 103]),
        ("integrals-R06", [0, 742, 1695, 135]),
        ("integrals-R07", [0, 875, 1695, 130]),
        ("integral-R08", [0, 1005, 1695, 133]),
        ("integral-R09", [0, 1140, 1695, 135]),
        ("integrals-R11", [0, 1360, 1695, 135]),
        ("integral-bracket-R12", [0, 1495, 1695, 140]),
        ("integrals-R13", [0, 1635, 1695, 135]),
        ("integrals-R14", [0, 1770, 1695, 135]),
        ("integrals-R15", [0, 1905, 1695, 130]),
        ("integral-R17", [0, 2110, 1695, 125]),
        ("upper-edge", [0, 0, 1695, 185]),
        ("lower-edge", [0, 2330, 1695, 250]),
    ],
    141: [
        ("integrals-R01", [0, 210, 1695, 140]),
        ("integral-R03", [0, 415, 1695, 140]),
        ("integrals-R05-unknown518-preserved", [0, 625, 1695, 140]),
        ("integrals-bars-R07", [0, 840, 1695, 140]),
        ("integral-R11", [0, 1215, 1695, 135]),
        ("upper-edge", [0, 0, 1695, 185]),
        ("lower-edge", [0, 2330, 1695, 250]),
    ],
    142: [
        ("chapter-row1", [0, 380, 1695, 130]),
        ("chapter-row2", [0, 510, 1695, 100]),
        ("chapter-separator", [0, 610, 1695, 60]),
        ("upper-edge", [0, 0, 1695, 300]),
        ("lower-edge", [0, 2330, 1695, 250]),
        ("left-side-formula-break", [0, 1180, 727, 165]),
        ("caption-shared-row", [0, 2140, 1695, 105]),
    ],
}


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def source_path(page):
    group = "136-139" if page == 137 else "140-143"
    return ROOT / (
        ".intentfold/tickets/STEMROBIN-184/tmp/"
        f"production-source10c{group}/10c/pages/{page:04d}/page.png"
    )


def load_tool():
    actual = digest(TOOL)
    if actual != FROZEN_TOOL:
        raise SystemExit(f"Frozen layout SHA mismatch: {actual}")
    spec = importlib.util.spec_from_file_location("diagnostic_layout", TOOL)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    # A hard fence against accidentally performing the forbidden full-page count.
    def forbidden(*args, **kwargs):
        raise RuntimeError("line_bands is forbidden in this diagnostic")
    module.line_bands = forbidden
    return module


def component_records(labels, bounds, box, minimum_area=8):
    x, y, w, h = box
    ids = np.unique(labels[y:y + h, x:x + w])
    records = []
    for cid in ids:
        if not cid:
            continue
        rows, cols = bounds[int(cid) - 1]
        mask = labels[rows, cols] == cid
        area = int(mask.sum())
        if area < minimum_area:
            continue
        record = {
            "id": int(cid),
            "box": [cols.start, rows.start, cols.stop - cols.start, rows.stop - rows.start],
            "area": area,
            "row_width_max": int(mask.sum(axis=1).max()),
            "row_width_median": float(np.median(mask.sum(axis=1))),
            "fully_within_window": (
                x <= cols.start and cols.stop <= x + w
                and y <= rows.start and rows.stop <= y + h
            ),
        }
        records.append(record)
    return records


def inspect_region(tool, ink, labels, bounds, name, box, content_w):
    x, y, w, h = box
    band = ink[y:y + h, x:x + w].copy()
    edge = int(ink.shape[1] * 0.01)
    if x == 0:
        band[:, :edge] = False
    if x + w == ink.shape[1]:
        band[:, -edge:] = False
    projection = band.sum(axis=1)
    fragments = tool._row_fragments(band, content_w)
    spans = []
    for a, b in fragments:
        ys, xs = np.nonzero(band[a:b + 1])
        spans.append({
            "y_inclusive": [y + a, y + b],
            "box": [x + int(xs.min()), y + a, int(xs.max() - xs.min() + 1), b - a + 1],
            "peak_ink": int(projection[a:b + 1].max()),
            "ink_pixels": int(projection[a:b + 1].sum()),
        })
    return {
        "name": name,
        "window_xywh": box,
        "fragments_not_rows": spans,
        "components": component_records(labels, bounds, box),
    }


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--page", type=int, choices=PAGES, required=True)
    args = parser.parse_args()
    tool = load_tool()
    page = args.page
    source = source_path(page)
    with Image.open(source) as image:
        ink = np.asarray(image.convert("L")) < 128
    # Decoding is array-only: no show, save, crop files, payload or plotting API.
    labels, _ = ndimage.label(ink)
    bounds = ndimage.find_objects(labels)
    columns = np.flatnonzero(ink.any(axis=0))
    content_w = int(columns[-1] - columns[0] + 1)
    result = {
        "page": page,
        "source": str(source),
        "source_sha256": digest(source),
        "tool": str(TOOL),
        "tool_sha256": digest(TOOL),
        "array_shape": list(ink.shape),
        "content_w": content_w,
        "method": "local projection fragments and original connected components; no line_bands invocation",
        "regions": [
            inspect_region(tool, ink, labels, bounds, name, box, content_w)
            for name, box in WINDOWS[page]
        ],
    }
    # Numerical margin inventory does not classify any component as noise.
    result["right_margin_unclassified"] = component_records(
        labels, bounds, [1526, 185, 169, 2145], minimum_area=20
    )
    result["left_margin_unclassified"] = component_records(
        labels, bounds, [0, 185, 90, 2145], minimum_area=20
    )
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
