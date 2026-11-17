"""Trace only the authorized offset-rule geometry, without opening an image."""
from __future__ import annotations

import hashlib
import importlib.util
import json
import sys
from pathlib import Path

import numpy as np


source = Path(sys.argv[1])
spec = importlib.util.spec_from_file_location("offset_layout", source)
layout = importlib.util.module_from_spec(spec)
spec.loader.exec_module(layout)
ink = np.zeros((1100, 800), dtype=bool)
ordinary_rows = (80, 140, 200, 260, 500, 560)
for y, count in [(y, 12) for y in ordinary_rows] + [(350, 8), (388, 8)]:
    for index in range(count):
        x = 80 + 26 * index
        ink[y:y + 20, x:x + 14] = True
ink[375:378, 450:620] = True
before = ink.copy()
input_sha = hashlib.sha256(ink.tobytes()).hexdigest()
events = []
seen = {}


def trace(frame, event, arg):
    if frame.f_code is not layout.line_bands.__code__:
        return None
    if event not in ("line", "return"):
        return trace
    for name in ("raw", "merged", "joined", "expanded"):
        spans = frame.f_locals.get(name)
        if not isinstance(spans, list):
            continue
        snapshot = [list(span) for span in spans]
        if seen.get(name) == snapshot:
            continue
        seen[name] = snapshot
        events.append({
            "line": frame.f_lineno, "stage": name, "spans": snapshot,
            "line_h": frame.f_locals.get("line_h"),
            "glyph_h": frame.f_locals.get("glyph_h"),
            "merge_gap": frame.f_locals.get("merge_gap"),
        })
    return trace


sys.settrace(trace)
try:
    bands = layout.line_bands(ink, 800)
finally:
    sys.settrace(None)
np.testing.assert_array_equal(ink, before)
body_x = np.flatnonzero(ink[350:370].any(axis=0))
bar_x = np.flatnonzero(ink[375:378].any(axis=0))
print(json.dumps({
    "source": str(source), "source_sha256": hashlib.sha256(source.read_bytes()).hexdigest(),
    "fixture": {
        "shape": [1100, 800], "ordinary_rows": list(ordinary_rows),
        "body_rows": [350, 388], "body_x": [80, 275], "body_count": 8,
        "body_height": 20, "glyph_width": 14, "glyph_pitch": 26,
        "bar_box_half_open": [450, 375, 620, 378], "independent_expected_rows": 9,
    },
    "input_sha256": input_sha, "after_sha256": hashlib.sha256(ink.tobytes()).hexdigest(),
    "input_ink_pixels": int(ink.sum()), "unchanged_ink": True,
    "body_bar_column_overlap": bool(np.intersect1d(body_x, bar_x).size),
    "body_to_bar_gap": 375 - 369,
    "fraction_proof_body_bar": bool(layout._single_fraction_row(ink, 350, 377, 20)),
    "fraction_proof_two_bodies_bar": bool(layout._single_fraction_row(ink, 350, 407, 20)),
    "actual_rows": len(bands), "bands": bands, "trace": events,
}, indent=2))
