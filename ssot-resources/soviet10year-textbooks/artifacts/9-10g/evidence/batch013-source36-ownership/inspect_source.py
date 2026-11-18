import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = Path("/Users/yong/.codex/worktrees/a07e/lemmadeck")
sys.path.insert(0, str(ROOT / ".claude/skills/ld-s10y-lesson/tools"))
import layout

SIDE = ROOT / ".tmp/s10y-source/batch013-ownership122"
SOURCE = ROOT / "ssot-resources/soviet10year-textbooks/artifacts/9-10g/evidence/batch013-source122123-first-prepare/pages/0122/page.png"
with Image.open(SOURCE) as image:
    ink = layout.ink_mask(image)
    image.crop((570, 590, 1330, 990)).save(SIDE / "source122-roi.png")
labels, _ = ndimage.label(ink)
bounds = ndimage.find_objects(labels)
audit = json.loads((ROOT / "ssot-resources/soviet10year-textbooks/artifacts/9-10g/pages/0122/audit.json").read_text())
for figure in audit["figures"]:
    if figure["id"] not in ("fig-133", "fig-134"):
        continue
    _, selected, _ = layout._figure_components(ink, figure["from"])
    print(figure["id"], "roughbox", figure["from"])
    for component in selected:
        rows, cols = bounds[component - 1]
        print(json.dumps({
            "component": component,
            "box": [cols.start, rows.start, cols.stop - cols.start, rows.stop - rows.start],
            "pixels": int(np.count_nonzero(labels[rows, cols] == component)),
        }))
