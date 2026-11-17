import importlib.util
import json
from pathlib import Path

import numpy as np
from scipy import ndimage

HERE = Path(__file__).resolve().parent
PREVIOUS = HERE.parent
spec = importlib.util.spec_from_file_location("original_geometry_v3", HERE / "v3/layout.py")
layout = importlib.util.module_from_spec(spec)
spec.loader.exec_module(layout)
with np.load(PREVIOUS.parent / "source-9g-p73-first-counter-diagnostic/fraction-geometry-arrays.npz") as arrays:
    band = arrays["before"].copy()
components, _ = ndimage.label(band)
original_bounds = ndimage.find_objects(components)
facts = []
for component_id, bounds in enumerate(original_bounds, 1):
    if bounds is None:
        continue
    rows, columns = bounds
    height, width = rows.stop - rows.start, columns.stop - columns.start
    if not (20 <= height <= 50 and width >= 15):
        continue
    mask = components[bounds] == component_id
    arrow = layout._arrow_headed_rule(mask, 38)
    if not arrow and columns.start not in (647, 402, 892, 431, 676):
        continue
    xs = np.flatnonzero(mask.any(axis=0))
    counts = mask.sum(axis=0)[xs]
    centers = (mask * np.arange(height)[:, None]).sum(axis=0)[xs] / counts
    trim = max(1, xs.size // 5)
    core_x, core_y = xs[trim:-trim], centers[trim:-trim]
    fit = np.polyval(np.polyfit(core_x, core_y, 1), core_x)
    spans = np.array([
        np.ptp(ys) + 1 for x in xs for ys in [np.flatnonzero(mask[:, x])]
    ])
    horizontal = ndimage.binary_opening(mask, structure=np.ones((1, 26), dtype=bool))
    residue = mask & ~horizontal
    residue_bounds = ndimage.find_objects(ndimage.label(residue)[0])
    facts.append({
        "component_id": component_id,
        "box": [columns.start, 1556 + rows.start, width, height],
        "original_arrow": bool(arrow),
        "shaft_median_span": float(np.median(spans[trim:-trim])),
        "shaft_center_residual90": float(np.percentile(np.abs(core_y - fit), 90)),
        "opened_boxes": [[s[1].start, s[0].start, s[1].stop - s[1].start,
                          s[0].stop - s[0].start]
                         for s in ndimage.find_objects(ndimage.label(horizontal)[0]) if s],
        "post_shaft_body_boxes": [
            [s[1].start, s[0].start, s[1].stop - s[1].start, s[0].stop - s[0].start]
            for s in residue_bounds if s
            and s[0].stop - s[0].start >= 0.6 * 38
            and s[1].stop - s[1].start >= 0.2 * 38
        ],
    })
with (HERE / "original-facts.json").open("x") as stream:
    json.dump({"page": 73, "line_h": 38, "facts": facts}, stream, indent=2)
    stream.write("\n")
print(json.dumps(facts, indent=2))
