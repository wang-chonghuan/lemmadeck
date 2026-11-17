import ast
import hashlib
import importlib.util
import json
from pathlib import Path

import numpy as np
from scipy import ndimage

HERE = Path(__file__).resolve().parent
tree = ast.parse((HERE / "test_contracts.py").read_text())
fixtures = [node for node in tree.body if isinstance(node, ast.FunctionDef)
            and node.name in ("glyph", "arrow")]
namespace = {"np": np}
exec(compile(ast.Module(body=fixtures, type_ignores=[]), "frozen-fixtures", "exec"), namespace)
spec = importlib.util.spec_from_file_location("frozen_v5_projection", HERE / "v5/layout.py")
layout = importlib.util.module_from_spec(spec)
spec.loader.exec_module(layout)
facts, arrays = [], {}
for kind in ("H", "hollow"):
    mask = np.zeros((160, 650), dtype=bool)
    for y in (40, 100):
        for x in range(50, 570, 40):
            namespace["glyph"](mask, x, y, height=23, walls=4, shape=kind)
        namespace["arrow"](mask, start=290, stop=359, y=y - 17, head=8)
    labels, _ = ndimage.label(mask)
    bounds = ndimage.find_objects(labels)
    before = mask.tobytes()
    raw = layout._row_fragments(mask, 600)
    projected = []
    for a, b in raw:
        ids = np.unique(labels[a:b + 1][mask[a:b + 1]])
        projected.append({
            "band": [a, b], "original_ids": [int(value) for value in ids],
            "cropped_band_arrow": bool(layout._arrow_headed_rule(mask[a:b + 1], 23)),
            "full_glyph_support": layout._supported_glyph_rows(
                mask[a:b + 1], [(0, b - a)], 23
            ),
            "original_components": [{
                "id": int(value),
                "box": [bounds[value - 1][1].start, bounds[value - 1][0].start,
                        bounds[value - 1][1].stop - bounds[value - 1][1].start,
                        bounds[value - 1][0].stop - bounds[value - 1][0].start],
                "original_arrow_decoration": bool(layout._original_arrow_decoration(
                    labels[bounds[value - 1]] == value, 23
                )),
            } for value in ids],
        })
    bands = layout.line_bands(mask, 600)
    assert mask.tobytes() == before
    assert bands == [(23, 25), (40, 62), (83, 85), (100, 122)]
    facts.append({
        "kind": kind, "mask_sha256": hashlib.sha256(before).hexdigest(),
        "line_h": 23, "glyph_h": 23, "existing_merge_gap": 0.4 * 23,
        "existing_overhead_proximity": 0.75 * 23, "baseline_bands": bands,
        "projection": projected,
    })
    arrays[f"{kind}_ink"] = mask
    arrays[f"{kind}_original_labels"] = labels
with (HERE / "original-projection-arrays.npz").open("xb") as stream:
    np.savez_compressed(stream, **arrays)
with (HERE / "original-projection-facts.json").open("x") as stream:
    json.dump(facts, stream, indent=2)
    stream.write("\n")
print(json.dumps([
    {"kind": item["kind"], "bands": item["baseline_bands"],
     "overhead": [row for row in item["projection"] if row["band"][1] - row["band"][0] == 2]}
    for item in facts
], indent=2))
