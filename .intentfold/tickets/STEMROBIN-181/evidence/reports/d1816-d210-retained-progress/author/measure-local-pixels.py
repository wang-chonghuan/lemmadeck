import hashlib
import json
from pathlib import Path

import numpy as np
from PIL import Image
from scipy.ndimage import label


ROOT = Path("/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck")
AUTHOR = ROOT / ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d210-fig31-source-gap-author"
SOURCE = ROOT / ".tmp/STEMROBIN-181/d1816-d210/physical57-embedded-original/physical57-000.png"
assert Path.cwd() == ROOT
with Image.open(SOURCE) as image:
    pixels = np.asarray(image)
box = (950, 1088, 980, 1111)
local = pixels[box[1]:box[3], box[0]:box[2]]
labels, count = label(local, structure=np.ones((3, 3), dtype=int))
assert count == 2, count
components = []
coordinate_arrays = []
for identifier in range(1, count + 1):
    ys, xs = np.where(labels == identifier)
    xs, ys = xs + box[0], ys + box[1]
    coordinates = np.column_stack((xs, ys))
    coordinate_arrays.append(coordinates)
    components.append({
        "id": identifier,
        "foregroundPixels": len(xs),
        "boundingBoxXYXYHalfOpen": [
            int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1
        ],
    })
distances = coordinate_arrays[0][:, None, :] - coordinate_arrays[1][None, :, :]
squared = np.sum(distances ** 2, axis=2)
nearest = np.unravel_index(np.argmin(squared), squared.shape)
rows = []
for y in range(1094, 1104):
    xs = np.where(pixels[y, box[0]:box[2]])[0] + box[0]
    rows.append({"intrinsicY": y, "whiteForegroundIntrinsicX": [int(x) for x in xs]})
evidence = {
    "batch": "D210",
    "role": "AUTHOR_ONLY",
    "finding": "D200-F31-SOURCE-LOCAL-STROKE-INTENT",
    "cwd": str(ROOT),
    "source": {
        "path": str(SOURCE),
        "bytes": SOURCE.stat().st_size,
        "sha256": hashlib.sha256(SOURCE.read_bytes()).hexdigest(),
        "width": 1472,
        "height": 2240,
        "mode": "1",
    },
    "windowXYXYHalfOpen": list(box),
    "foregroundDefinition": "Original stencil value 255 (white); background value 0 (black). No threshold or polarity conversion.",
    "analysis": "8-connected component labeling in this local pixel window only, below the horizontal axis and excluding the thick neighboring stroke.",
    "connectedComponentCount": int(count),
    "components": components,
    "nearestForegroundPixelCenters": [
        coordinate_arrays[0][nearest[0]].tolist(),
        coordinate_arrays[1][nearest[1]].tolist(),
    ],
    "minimumSquaredEuclideanPixelCenterDistance": int(squared.min()),
    "no8ConnectedBridgeInLocalWindow": True,
    "rawRows": rows,
    "resampling": False,
    "newImagesGenerated": 0,
    "newModelImageDisplays": 0,
    "causalLimit": "This proves missing adjoining foreground pixels in the extracted raw stencil. It does not prove why the original stroke is interrupted, what the pre-scan artwork contained, or any mathematical/physical intent.",
}
with (AUTHOR / "local-pixel-evidence.json").open("x", encoding="ascii") as stream:
    json.dump(evidence, stream, indent=2)
    stream.write("\n")
print(json.dumps(evidence, indent=2))
