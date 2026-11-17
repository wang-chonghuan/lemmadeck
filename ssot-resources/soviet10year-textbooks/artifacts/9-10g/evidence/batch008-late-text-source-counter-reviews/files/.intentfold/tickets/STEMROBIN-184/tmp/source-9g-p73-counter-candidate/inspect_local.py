import json
from pathlib import Path

import numpy as np
from scipy import ndimage

HERE = Path(__file__).resolve().parent
DIAG = HERE.parent / "source-9g-p73-first-counter-diagnostic"
with np.load(DIAG / "fraction-geometry-arrays.npz") as arrays:
    band = arrays["before"].copy()


def boxes(mask):
    labels, _ = ndimage.label(mask)
    out = []
    for component_id, bounds in enumerate(ndimage.find_objects(labels), 1):
        if bounds is None:
            continue
        rows, columns = bounds
        if columns.start > 685 or columns.stop < 585:
            continue
        component = labels[bounds] == component_id
        ys, xs = np.nonzero(component)
        out.append({
            "id": component_id,
            "box": [columns.start, 1556 + rows.start,
                    columns.stop - columns.start, rows.stop - rows.start],
            "area": int(component.sum()),
            "column_counts": component.sum(axis=0).tolist(),
            "row_counts": component.sum(axis=1).tolist(),
            "x_centroid": float(columns.start + xs.mean()),
            "y_centroid": float(1556 + rows.start + ys.mean()),
        })
    return out


detached = band.copy()
detached[1603 - 1556:1605 - 1556, 600:651] = False
result = {
    "original": boxes(band),
    "bar_removed": boxes(detached),
    "rule_rows_original_x580_690": [
        {"y": y + 1556, "runs": []} for y in []
    ],
}
for y in range(1583 - 1556, 1613 - 1556):
    xs = np.flatnonzero(band[y, 580:691]) + 580
    breaks = np.flatnonzero(np.diff(xs) > 1) + 1
    runs = [[int(part[0]), int(part[-1])] for part in np.split(xs, breaks) if part.size]
    result["rule_rows_original_x580_690"].append({"y": y + 1556, "runs": runs})
with (HERE / "local-facts.json").open("x") as stream:
    json.dump(result, stream, indent=2)
    stream.write("\n")
print(json.dumps(result, indent=2))
