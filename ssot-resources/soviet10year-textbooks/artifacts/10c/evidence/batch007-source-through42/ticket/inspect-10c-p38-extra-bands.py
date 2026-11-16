import json
from pathlib import Path
import sys

import numpy as np
from PIL import Image

sys.path.insert(0, str(Path(".claude/skills/ld-s10y-lesson/tools").resolve()))
import layout

root = Path(".intentfold/tickets/STEMROBIN-184/tmp/10c-p38-count-diagnostic")
target = root / "extra-bands.json"
assert not target.exists(), "Preserve the first band-location observation"
source = Path(".tmp/ld-s10y-lesson/10c/pages/0038/page.png")
image = Image.open(source).convert("RGB")
ink = layout.ink_mask(image)
masked = ink.copy()
document = json.loads(Path(
    "ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0038/page.json"
).read_text())
for figure in document["meta"]["figures"]:
    x, y, width, height = figure["box"]
    masked[y:y + height, x:x + width] = False
rows = []
for name, start, end in [("table-side", 837, 845), ("bottom", 2471, 2489)]:
    columns = np.flatnonzero(masked[start:end + 1].any(axis=0))
    left, right = int(columns[0]), int(columns[-1])
    box = [left, start, right - left + 1, end - start + 1]
    crop = [max(0, left - 20), max(0, start - 25),
            min(image.width, right + 21), min(image.height, end + 26)]
    image.crop(crop).save(root / f"{name}-native.png")
    rows.append({
        "name": name, "box": box, "crop_ltrb": crop,
        "ink_pixels": int(masked[start:end + 1].sum()),
        "source_sha256": layout.sha256_file(source),
    })
target.write_text(json.dumps(rows, indent=2) + "\n")
print(json.dumps(rows, indent=2))
