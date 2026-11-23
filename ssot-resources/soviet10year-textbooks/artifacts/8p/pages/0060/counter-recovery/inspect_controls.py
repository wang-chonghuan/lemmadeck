"""Retain the first candidate's exact remaining counter failures."""
import importlib.util
import json
from pathlib import Path
import sys

import numpy as np
from PIL import Image


OWN = Path(__file__).resolve().parent
ROOT = OWN.parents[1]
spec = importlib.util.spec_from_file_location("layout", OWN / "candidate-01/layout.py")
layout = importlib.util.module_from_spec(spec)
sys.modules["layout"] = layout
spec.loader.exec_module(layout)
with Image.open(ROOT / ".tmp/ld-s10y-lesson/8p/pages/0060/page.png") as image:
    ink = layout.ink_mask(image)


def inspect(control):
    captures = []
    prior = sys.gettrace()

    def trace(frame, event, arg):
        if frame.f_code is layout.line_bands.__code__:
            if event == "line" and frame.f_lineno in (603, 605, 606, 632, 634, 635, 656, 664, 666):
                values = frame.f_locals
                captures.append({
                    "line": frame.f_lineno,
                    "a": values.get("a"), "b": values.get("b"),
                    "raw": values.get("raw"),
                    "glyph_h": values.get("glyph_h"),
                    "body_glyphs": len(values.get("body", [])),
                    "small_glyphs": len(values.get("small", [])),
                    "body_h": values.get("body_h"),
                    "small_h": values.get("small_h"),
                })
            if event == "return":
                counted = frame.f_locals["ink"]
                captures.append({
                    "line": "return",
                    "removed_in_added_glyph": int(
                        np.count_nonzero(control[2420:2457, 24:65] & ~counted[2420:2457, 24:65])
                    ),
                    "glyph_input_ink": int(control[2420:2457, 24:65].sum()),
                })
        return trace

    try:
        sys.settrace(trace)
        bands = layout.line_bands(control, 1640)
    finally:
        sys.settrace(prior)
    return {"bands": bands, "trace": captures}


out = {}
for top, bottom in ((1602, 1649), (1849, 1895)):
    control = ink.copy()
    control[top:bottom + 1] = False
    out[f"delete-{top}-{bottom}"] = inspect(control)
control = ink.copy()
control[2420:2457, 24:65] |= ink[2187:2224, 140:181]
out["standalone-footnote-glyph-at-left"] = inspect(control)
(OWN / "candidate-01/remaining-failure-diagnosis.json").write_text(
    json.dumps(out, indent=2) + "\n"
)
for key, value in out.items():
    print(key, value["bands"])
    for frame in value["trace"]:
        if frame.get("a") == 1960 or frame["line"] == "return":
            print(frame)
