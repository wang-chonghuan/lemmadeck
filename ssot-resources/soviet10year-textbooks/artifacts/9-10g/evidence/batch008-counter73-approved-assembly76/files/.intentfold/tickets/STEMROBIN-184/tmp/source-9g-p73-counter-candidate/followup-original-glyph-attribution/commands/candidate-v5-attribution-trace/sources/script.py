import hashlib
import importlib.util
import json
import sys
from pathlib import Path

import numpy as np
from scipy import ndimage

HERE = Path(__file__).resolve().parent
DIAGNOSTIC = HERE.parent.parent / "source-9g-p73-first-counter-diagnostic"
with np.load(DIAGNOSTIC / "fraction-geometry-arrays.npz") as arrays:
    source = arrays["before"].copy()
original, _ = ndimage.label(source)
original_bounds = ndimage.find_objects(original)


def identity(array):
    return {"shape": list(array.shape), "dtype": str(array.dtype),
            "sha256": hashlib.sha256(array.tobytes()).hexdigest()}


def box(bounds):
    rows, columns = bounds
    return [columns.start, rows.start + 1556,
            columns.stop - columns.start, rows.stop - rows.start]


arrays = {"original": original, "source": source}
facts = []
paths = {
    "v3": HERE / "v3/layout.py",
    "v4": HERE / "commands/candidate-v4-carrier-contracts/sources/layout.py",
    "v5": HERE / "candidate/layout.py",
}
for version, path in paths.items():
    spec = importlib.util.spec_from_file_location(f"attribution_{version}", path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    for height in (38, 39):
        captured = {}

        def trace(frame, event, result):
            if frame.f_code.co_filename != str(path):
                return None
            if frame.f_code.co_name == "_single_fraction_row" and event == "return":
                captured.update(frame.f_locals)
                captured["result"] = bool(result)
            return trace

        before = source.tobytes()
        sys.settrace(trace)
        try:
            result = module._single_fraction_row(source, 0, len(source) - 1, height)
        finally:
            sys.settrace(None)
        assert before == source.tobytes()
        residual = captured["band"]
        labels, _ = ndimage.label(residual)
        mappings = []
        for component_id, bounds in enumerate(ndimage.find_objects(labels), 1):
            if bounds is None:
                continue
            rows, columns = bounds
            glyph_height = rows.stop - rows.start
            ids = np.unique(original[bounds][labels[bounds] == component_id])
            central = labels[
                rows.start + glyph_height // 4:rows.stop - glyph_height // 4, columns
            ] == component_id
            xs = np.flatnonzero(central.any(axis=0))
            mappings.append({
                "residual_id": component_id, "box": box(bounds),
                "original_ids": [int(value) for value in ids],
                "full_height_width_eligible": bool(
                    0.6 * height <= glyph_height <= 1.8 * height
                    and columns.stop - columns.start >= 0.2 * height
                ),
                "central_width": int(np.ptp(xs) + 1) if xs.size else 0,
                "included_full_glyph": bounds in captured["glyph_bounds"],
                "omitted_as_original_decoration": bool(ids.size and all(
                    int(value) in captured.get("original_decorations", set()) for value in ids
                )),
                "accepted_bar_carrier": any(
                    int(value) in captured.get("accepted_carriers", set()) for value in ids
                ),
            })
        decorations = []
        if hasattr(module, "_original_arrow_decoration"):
            for component_id, bounds in enumerate(original_bounds, 1):
                if bounds is not None and module._original_arrow_decoration(
                    original[bounds] == component_id, height
                ):
                    decorations.append(component_id)
        key = f"{version}_{height}"
        for name in ("band", "counts", "remaining"):
            arrays[f"{key}_{name}"] = captured[name].copy()
        facts.append({
            "version": version, "line_h": height, "result": bool(result),
            "code_sha256": hashlib.sha256(path.read_bytes()).hexdigest(),
            "source_unchanged": before == source.tobytes(),
            "residual": identity(residual),
            "counts": identity(captured["counts"]),
            "remaining_rows": captured["remaining"].tolist(),
            "rules": [list(rule) for rule in captured["rules"]],
            "accepted_carriers": sorted(int(value) for value in captured.get("accepted_carriers", set())),
            "independently_recognized_original_decorations": decorations,
            "original_decoration_attribution_ids": sorted(captured.get("original_decorations", set())),
            "full_glyph_boxes": [box(bounds) for bounds in captured["glyph_bounds"]],
            "mappings": mappings,
        })
for height in (38, 39):
    assert np.array_equal(arrays[f"v3_{height}_band"], arrays[f"v5_{height}_band"])
    assert np.array_equal(arrays[f"v3_{height}_counts"], arrays[f"v5_{height}_counts"])
    v5 = next(item for item in facts if item["version"] == "v5" and item["line_h"] == height)
    assert v5["result"] is True
    assert 19 in v5["accepted_carriers"]
    assert 19 not in v5["original_decoration_attribution_ids"]
    assert any(19 in item["original_ids"] for item in v5["mappings"])
assert next(item for item in facts if item["version"] == "v3" and item["line_h"] == 38)["result"] is False
with (HERE / "attribution-arrays.npz").open("xb") as stream:
    np.savez_compressed(stream, **arrays)
with (HERE / "attribution-trace.json").open("x") as stream:
    json.dump({"mode": "raw arrays and original/residual identity only; no images",
               "facts": facts}, stream, indent=2)
    stream.write("\n")
print(json.dumps([
    {key: item[key] for key in (
        "version", "line_h", "result", "accepted_carriers",
        "original_decoration_attribution_ids", "residual", "source_unchanged"
    )} for item in facts
], indent=2))
