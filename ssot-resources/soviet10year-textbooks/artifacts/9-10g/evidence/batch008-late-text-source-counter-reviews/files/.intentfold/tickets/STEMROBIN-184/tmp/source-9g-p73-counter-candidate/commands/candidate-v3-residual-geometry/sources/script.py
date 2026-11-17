import hashlib
import importlib.util
import json
import sys
from pathlib import Path

import numpy as np

HERE = Path(__file__).resolve().parent
CODE = HERE / "candidate/layout.py"
spec = importlib.util.spec_from_file_location("residual_geometry", CODE)
layout = importlib.util.module_from_spec(spec)
spec.loader.exec_module(layout)
with np.load(HERE.parent / "source-9g-p73-first-counter-diagnostic/fraction-geometry-arrays.npz") as arrays:
    source_band = arrays["before"].copy()
captured = {}


def trace(frame, event, result):
    if frame.f_code.co_filename != str(CODE):
        return None
    if frame.f_code.co_name == "_single_fraction_row" and event == "return":
        captured.update(frame.f_locals)
        captured["result"] = result
    return trace


rows, arrays = [], {"source_band": source_band}
for height in (38, 39):
    captured.clear()
    sys.settrace(trace)
    try:
        layout._single_fraction_row(source_band, 0, 86, height)
    finally:
        sys.settrace(None)
    residual = captured["band"].copy()
    arrays[f"residual_h{height}"] = residual
    glyphs = []
    for sy, sx in captured["full_glyphs"]:
        mask = residual[sy, sx]
        glyphs.append({
            "box": [sx.start, 1556 + sy.start, sx.stop - sx.start, sy.stop - sy.start],
            "arrow_headed_residue": bool(layout._arrow_headed_rule(mask, height)),
            "central_y": [1556 + sy.start + (sy.stop - sy.start) / 4,
                          1556 + sy.stop - (sy.stop - sy.start) / 4],
        })
    remaining = captured["remaining"]
    rows.append({
        "line_h": height, "fraction_result": bool(captured["result"]),
        "accepted_rule_columns": captured["rules"],
        "remaining_y": [1556 + int(remaining[0]), 1556 + int(remaining[-1])],
        "compact_limit": 2 * height,
        "glyph_height_lower_bound": 0.6 * height,
        "surviving_full_glyphs": glyphs,
        "surviving_arrow_glyphs": [item for item in glyphs if item["arrow_headed_residue"]],
    })
out = {
    "candidate_sha256": hashlib.sha256(CODE.read_bytes()).hexdigest(),
    "source_array_unchanged": arrays["source_band"].tobytes() == source_band.tobytes(),
    "rows": rows,
}
with (HERE / "residual-geometry.json").open("x") as stream:
    json.dump(out, stream, indent=2)
    stream.write("\n")
with (HERE / "residual-arrays.npz").open("xb") as stream:
    np.savez_compressed(stream, **arrays)
with (HERE / "residual-array-hashes.json").open("x") as stream:
    json.dump({name: {"shape": list(value.shape), "dtype": str(value.dtype),
                     "sha256": hashlib.sha256(value.tobytes()).hexdigest()}
               for name, value in arrays.items()}, stream, indent=2)
    stream.write("\n")
print(json.dumps({**out, "rows": [
    {key: value for key, value in item.items() if key != "surviving_full_glyphs"}
    for item in rows
]}, indent=2))
