import hashlib
import importlib.util
import json
import sys
from pathlib import Path

import numpy as np

HERE = Path(__file__).resolve().parent
CODE = HERE / "candidate/layout.py"
VERSION = sys.argv[1]
HEIGHT = float(sys.argv[2]) if len(sys.argv) > 2 else 39
spec = importlib.util.spec_from_file_location("candidate_trace", CODE)
layout = importlib.util.module_from_spec(spec)
spec.loader.exec_module(layout)
with np.load(HERE.parent / "source-9g-p73-first-counter-diagnostic/fraction-geometry-arrays.npz") as arrays:
    band = arrays["before"].copy()
lines = CODE.read_text().splitlines()
events = []


def simple(value):
    if isinstance(value, np.ndarray):
        return value.tolist() if value.size < 100 else {"shape": list(value.shape)}
    if isinstance(value, np.generic):
        return value.item()
    if isinstance(value, slice):
        return [value.start, value.stop]
    if isinstance(value, (list, tuple)):
        return [simple(item) for item in value]
    return value


def trace(frame, event, result):
    if frame.f_code.co_filename != str(CODE):
        return None
    if frame.f_code.co_name in ("_bar_local_fraction_support", "_single_fraction_row"):
        source = lines[frame.f_lineno - 1].strip()
        if event == "return" or event == "line" and source.startswith((
            "if not any(", "for component_id in original_ids:", "for _, tip",
            "if _arrow_headed_rule", "return ", "if (", "rules.append(",
        )):
            events.append({
                "function": frame.f_code.co_name, "event": event,
                "source": source, "result": simple(result),
                "locals": {key: simple(item) for key, item in frame.f_locals.items()
                           if key in ("rows", "columns", "line_h", "upper", "lower",
                                      "outside", "tip", "spans", "whole_component_arrow",
                                      "glyph_stroke", "local_fraction", "rules",
                                      "remaining", "full_glyphs", "cores", "overlapping")},
            })
    return trace


sys.settrace(trace)
try:
    result = layout._single_fraction_row(band, 0, len(band) - 1, HEIGHT)
finally:
    sys.settrace(None)
out = {"candidate_sha256": hashlib.sha256(CODE.read_bytes()).hexdigest(), "line_h": HEIGHT,
       "fraction_result": bool(result), "events": events}
with (HERE / f"trace-{VERSION}.json").open("x") as stream:
    json.dump(out, stream, indent=2)
    stream.write("\n")
print(json.dumps(out, indent=2))
