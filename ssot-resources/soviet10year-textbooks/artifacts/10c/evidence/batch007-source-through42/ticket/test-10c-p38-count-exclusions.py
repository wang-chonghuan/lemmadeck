import json
from pathlib import Path
import shutil
import sys

import numpy as np
from PIL import Image

sys.path.insert(0, str(Path(".claude/skills/ld-s10y-lesson/tools").resolve()))
import layout

root = Path(".intentfold/tickets/STEMROBIN-184/tmp/10c-p38-count-diagnostic")
target = root / "candidate-exclusions.json"
assert not target.exists(), "Preserve the first candidate calculation"
before = root / "before-metadata"
assert not before.exists()
durable = Path("ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0038")
shutil.copytree(durable, before)
source = Path(".tmp/ld-s10y-lesson/10c/pages/0038/page.png")
ink = layout.ink_mask(Image.open(source))
document = json.loads((durable / "page.json").read_text())
masked = ink.copy()
for figure in document["meta"]["figures"]:
    x, y, width, height = figure["box"]
    masked[y:y + height, x:x + width] = False
exclusions = [
    {
        "kind": "scan-artifact", "box": [1596, 828, 31, 28],
        "reason": "Native source crop shows an isolated right-margin scan speck; no table edge, text or mathematical label is in this box.",
    },
    {
        "kind": "scan-artifact", "box": [0, 2452, 1695, 128],
        "reason": "Native bottom-margin crop shows only a broken scan-boundary line below the complete folio at y2266-2300; no printed body or formula is excluded.",
    },
]
columns = np.flatnonzero(ink.any(axis=0))
content_width = int(columns[-1] - columns[0] + 1)
bands = layout.line_bands(layout.counting_ink(masked, exclusions), content_width)
report = {
    "status": "metadata-candidate diagnostic, not finalized or source-approved",
    "source_sha256": layout.sha256_file(source),
    "layout_sha256": layout.sha256_file(Path(layout.__file__)),
    "exclusions": exclusions, "count": len(bands),
    "bands": [[int(x), int(y)] for x, y in bands],
    "source_math": "Both quotient bands remain one row each; no fraction bug or code change is demonstrated.",
}
target.write_text(json.dumps(report, indent=2) + "\n")
print(json.dumps(report, indent=2))
assert len(bands) == 14
assert (1767, 1974) in bands and (2015, 2223) in bands
