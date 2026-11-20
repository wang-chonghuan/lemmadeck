import json
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

BASE = Path("/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck")
EVIDENCE = BASE / ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d151-n9-figures89-author"

for figure in ("fig-08", "fig-09"):
    context = json.loads((EVIDENCE / f"{figure}.input-context.json").read_text())
    source = Image.open(context["sourceImage"]["path"]).convert("RGB")
    source.resize((source.width * 3, source.height * 3), Image.Resampling.NEAREST).save(
        EVIDENCE / "inventories" / f"{figure}.source-pixels-3x.png"
    )
    white = np.asarray(source.convert("L")) > 180
    labels, count = ndimage.label(white)
    components = []
    for label in range(1, count + 1):
        ys, xs = np.where(labels == label)
        if len(xs) < 12:
            continue
        components.append({
            "area": len(xs),
            "center": [round(float(xs.mean()), 2), round(float(ys.mean()), 2)],
            "bounds": [int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max())],
        })
    print(json.dumps({
        "figure": figure,
        "sourceDimensions": list(source.size),
        "whiteComponents": components,
        "warning": "Pixel components are inventory aids, not inferred molecule counts.",
    }))
