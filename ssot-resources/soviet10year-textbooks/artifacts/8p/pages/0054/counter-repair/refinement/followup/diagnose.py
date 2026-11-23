"""Numerical component evidence for the four retained p54 failures."""
import importlib.util
from pathlib import Path
import sys

import numpy as np
from scipy import ndimage

ROOT = Path("/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-180")
assert Path.cwd() == ROOT
sys.dont_write_bytecode = True
sys.path.insert(0, str(ROOT / ".claude/skills/ld-s10y-lesson/tools"))


def load(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    module = importlib.util.module_from_spec(spec)
    sys.modules[name] = module
    spec.loader.exec_module(module)
    return module


label = sys.argv[1] if len(sys.argv) > 1 else "candidate-03"
layout = load("layout", ROOT / f".tmp/180-7-p54-counter/refinement/{label}/layout.py")
controls = load("p54_controls", ROOT / ".tmp/180-7-p54-counter/test_counter.py")
controls.Page54CounterTests.setUpClass()
original = controls.Page54CounterTests.ink


def inspect(mask, box):
    top, bottom, left, right = box
    crop = mask[top:bottom, left:right]
    for close in (1, 3):
        closed = crop if close == 1 else ndimage.binary_closing(
            crop, structure=np.ones((close, close), dtype=bool),
        )
        labels, _ = ndimage.label(closed)
        print("closing", close)
        for cid, bounds in enumerate(ndimage.find_objects(labels), 1):
            if bounds is None:
                continue
            rows, columns = bounds
            area = int(np.count_nonzero(crop[bounds]))
            if area < 8:
                continue
            shape = (rows.stop - rows.start, columns.stop - columns.start)
            fragment = crop[bounds]
            print({
                "box": [rows.start + top, rows.stop + top,
                        columns.start + left, columns.stop + left],
                "shape": shape, "area": area,
                "density": round(area / np.prod(shape), 3),
                "holes": int(np.count_nonzero(ndimage.binary_fill_holes(fragment) & ~fragment)),
                "cores": {
                    size: int(np.count_nonzero(ndimage.binary_opening(
                        fragment, structure=np.ones((size, size), dtype=bool),
                    ))) for size in (3, 5, 8, 9)
                },
                "nearby_area": int(np.count_nonzero(mask[
                    max(0, rows.start + top - 88):rows.stop + top + 88,
                    max(0, columns.start + left - 88):columns.stop + left + 88,
                ])),
            })


for name, row, shape, box in (
    ("heading", (557, 605), None, (570, 635, 1610, 1695)),
    ("prose", (1930, 1975), None, (1885, 1935, 1610, 1695)),
    ("speck12", None, (12, 12), (2400, 2470, 16, 180)),
    ("speck18", None, (18, 9), (2400, 2470, 16, 180)),
):
    ink = original.copy()
    if row:
        ink[row[0]:row[1] + 1] = False
    if shape:
        ink &= ~controls.Page54CounterTests.separator
        height, width = shape
        ink[2420:2420 + height, 24:24 + width] = True
    captured = {}

    def trace(frame, event, arg):
        if (
            label == "candidate-04" and frame.f_code is layout.line_bands.__code__
            and event == "line" and frame.f_lineno in (492, 519)
            and frame.f_locals["rows"].start < box[1]
            and frame.f_locals["rows"].stop > box[0]
        ):
            local = frame.f_locals
            print("classifier", frame.f_lineno, {
                key: local.get(key) for key in (
                    "rows", "columns", "height", "width", "area", "compact_shape",
                    "solid_core", "margin_blot", "nearby_area",
                )
            }, "closed_holes", np.count_nonzero(
                ndimage.binary_fill_holes(local["margin_clusters"][local["bounds"]] > 0)
                & (local["margin_clusters"][local["bounds"]] == 0)
            ))
        if frame.f_code is layout.line_bands.__code__ and event == "return":
            captured.update(frame.f_locals)
        return trace

    sys.settrace(trace)
    try:
        bands = layout.line_bands(ink, 1690)
    finally:
        sys.settrace(None)
    print("\nCONTROL", name, "count", len(bands),
          "glyph_h", captured["glyph_h"], "typical_h", captured["typical_h"],
          "bands", [band for band in bands if band[0] < box[1] and band[1] >= box[0]])
    print("input")
    inspect(ink, box)
    print("counting output")
    inspect(captured["ink"], box)

print("\nREAL standalone letters")
for box in ((1855, 1889, 849, 877), (2218, 2247, 1398, 1416),
            (2222, 2250, 220, 238), (1223, 1275, 278, 332)):
    inspect(original, box)
