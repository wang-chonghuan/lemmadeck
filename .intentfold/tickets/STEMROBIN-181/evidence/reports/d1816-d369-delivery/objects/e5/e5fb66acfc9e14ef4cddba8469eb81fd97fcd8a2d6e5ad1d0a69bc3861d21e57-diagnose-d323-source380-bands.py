import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image

sys.path.insert(0, str(Path(".claude/skills/ld-s10y-lesson/tools").resolve()))
import blocks
import layout

root = Path(".tmp/STEMROBIN-181/d1816-d313")
meta, _ = blocks.load(root / "root/10p/pages/0380/page.md")
ink = layout.ink_mask(Image.open(root / "source-work/10p/pages/0380/page.png"))
masked = ink.copy()
for figure in meta["figures"]:
    x, y, w, h = figure["box"]
    masked[y:y + h, x:x + w] = False
columns = np.flatnonzero(ink.any(axis=0))
content_w = int(columns[-1] - columns[0] + 1)
rows = []
for a, b in layout.line_bands(masked, content_w):
    xs = np.flatnonzero(masked[a:b + 1].any(axis=0))
    rows.append({
        "y": [a, b], "x": [int(xs[0]), int(xs[-1])],
        "inkPixels": int(masked[a:b + 1].sum()),
    })
print(json.dumps({
    "role": "READ_ONLY_FAILURE_SEGMENTATION_DIAGNOSIS_NOT_FINALIZE_OR_APPROVAL",
    "page": 380, "bands": rows, "contentWidth": content_w,
    "firstNativeFailureRetained": True, "sourcePixelsModified": False,
    "imagePayloads": 0,
}))
