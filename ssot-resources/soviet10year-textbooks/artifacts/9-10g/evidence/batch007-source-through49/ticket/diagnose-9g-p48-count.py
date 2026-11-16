import hashlib
import json
from pathlib import Path
import shutil
import sys

import numpy as np
from PIL import Image

sys.path.insert(0, str(Path(".claude/skills/ld-s10y-lesson/tools").resolve()))
import layout

root = Path(".intentfold/tickets/STEMROBIN-184/tmp/9g-p48-count-diagnostic")
assert not root.exists(), "Preserve any earlier diagnostic"
source = Path(".tmp/ld-s10y-lesson/9-10g/pages/0048/page.png")
prepared = source.parent / "layout.json"
durable = Path("ssot-resources/soviet10year-textbooks/artifacts/9-10g/pages/0048")
review = Path(".intentfold/tickets/STEMROBIN-184/tmp/source-review-9g-p48.md")


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


assert sha(review) == "65c7d71c6afa92324bb3dd9b285c26e2e86ce1b1f3741a5eb5191233f6a88a24"
root.mkdir()
(root / "before-metadata").mkdir()
for name in ("page.md", "page.json", "audit.json"):
    shutil.copyfile(durable / name, root / "before-metadata" / name)
image = Image.open(source).convert("RGB")
ink = layout.ink_mask(image)
saved = json.loads(prepared.read_text())
assert len(saved["line_bands"]) == 26
bands = []
for number, (a, b) in enumerate(saved["line_bands"], 1):
    local = ink[a:b + 1]
    xs = np.flatnonzero(local.any(axis=0))
    bands.append({
        "number": number, "y_inclusive": [a, b], "height": b - a + 1,
        "x_extent_inclusive": [int(xs[0]), int(xs[-1])],
        "width": int(xs[-1] - xs[0] + 1), "ink_pixels": int(local.sum()),
    })
crop_box = [0, 1840, 1506, 195]
image.crop((0, 1840, 1506, 2035)).save(root / "separator-foot-folio-native.png")
report = {
    "status": "stored-band/pixel diagnostic only; no counter rerun or source gate",
    "source_sha256": sha(source), "layout_sha256": sha(prepared),
    "tool_sha256": sha(Path(layout.__file__)),
    "source_size": list(image.size), "bands": bands,
    "native_strip": {"path": str(root / "separator-foot-folio-native.png"),
                     "source_box_xywh": crop_box,
                     "sha256": sha(root / "separator-foot-folio-native.png")},
    "counter_invocations": 0, "finalize_invocations": 0,
    "count_exclusions_applied": [],
    "basis": "Sole source StageB froze25 real rows before disclosure; first actual audit26/25 remains. This diagnostic locates existing saved bands in original pixels without changing them.",
}
(root / "report.json").write_text(json.dumps(report, indent=2) + "\n")
print(json.dumps({"last_bands": bands[-3:], "native_strip": report["native_strip"]}, indent=2))
