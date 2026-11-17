#!/usr/bin/env python3
"""Extract exact source-component details for already located suspect regions."""
import json
import sys

sys.dont_write_bytecode = True
import numpy as np
from PIL import Image
from scipy import ndimage
from geometry import OWNED, source_path, digest

result = {"method": "selected source regions only; no masking, classifier or page-row counter"}
with Image.open(source_path(142)) as image:
    ink = np.asarray(image.convert("L")) < 128
labels, _ = ndimage.label(ink)
bounds = ndimage.find_objects(labels)
result["bottom_regions"] = []
for box in ([772, 2479, 133, 3], [1404, 2485, 244, 4]):
    x, y, w, h = box
    local_ids = [int(cid) for cid in np.unique(labels[y:y + h, x:x + w]) if cid]
    components = []
    for cid in local_ids:
        rows, cols = bounds[cid - 1]
        mask = labels[rows, cols] == cid
        components.append({
            "id": cid,
            "source_box": [cols.start, rows.start, cols.stop - cols.start, rows.stop - rows.start],
            "area": int(mask.sum()),
        })
    result["bottom_regions"].append({
        "box": box,
        "ink_pixels_in_box": int(ink[y:y + h, x:x + w].sum()),
        "source_component_count": len(components),
        "max_complete_component_height": max(c["source_box"][3] for c in components),
        "source_components": components,
        "existing_scan_artifact_geometry_valid": y >= 0.95 * ink.shape[0],
        "source_empty_gap_below_footer_at_least": y - 2288 - 1,
    })
result["source142_sha256"] = digest(source_path(142))
result["carrier_rejections"] = []
for page, filename in ((140, "029-local140.stdout"), (141, "030-local141.stdout")):
    data = json.loads((OWNED / filename).read_text())
    for suspect in data["suspects"]:
        if "control" in suspect["name"]:
            continue
        measured = [p for p in suspect["scale_predicates"] if p["scale"] == 46][0]
        result["carrier_rejections"].append({
            "page": page,
            "row": suspect["name"],
            "saved_bands": suspect["saved_bands"],
            "carrier_boxes": [
                [cols[0], rows[0], cols[1] - cols[0], rows[1] - rows[0]]
                for rows, cols in measured["carrier"]["carriers"]
            ],
            "rejection_box": [
                measured["carrier"]["columns"][0],
                measured["carrier"]["rows"][0],
                measured["carrier"]["width"],
                measured["carrier"]["height"],
            ],
            "core_y": [measured["carrier"]["top"], measured["carrier"]["bottom"]],
            "return_line": measured["carrier"]["return_line"],
            "fraction_false_for_all_sampled_scales": all(
                not p["single_fraction"] for p in suspect["scale_predicates"]
            ),
        })
print(json.dumps(result, indent=2))
