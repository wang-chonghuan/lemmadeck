import hashlib
import json
from pathlib import Path

from PIL import Image


ROOT = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
OUT = ROOT / ".intentfold/tickets/STEMROBIN-181/tmp/d883-source236-first-independent-review"
SOURCE = ROOT / ".intentfold/tickets/STEMROBIN-181/tmp/d870-source236-punctuation-repair/work/10p/pages/0236/page.png"
EXPECTED = "8e4d2c4d119698a56da6f0132cbb983d4f8fd976ebf3ffaad1ff83eac8b4ed8a"


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


assert Path.cwd() == ROOT
assert sha(SOURCE) == EXPECTED
regions = [
    ("original-middle-detail.png", (145, 945, 1315, 1470)),
    ("original-lower-detail.png", (145, 1475, 1320, 2020)),
]
receipt = {
    "source": str(SOURCE),
    "sourceSha256": EXPECTED,
    "operation": "unmasked rectangular crops, nearest-neighbor enlargement 2x",
    "sourcePixelsModified": False,
    "outputs": [],
}
with Image.open(SOURCE) as image:
    assert image.size == (1536, 2337)
    for name, box in regions:
        target = OUT / name
        assert not target.exists()
        crop = image.crop(box)
        crop.resize((crop.width * 2, crop.height * 2), Image.Resampling.NEAREST).save(target)
        receipt["outputs"].append({
            "path": str(target),
            "boxXYXY": box,
            "sha256": sha(target),
        })
assert sha(SOURCE) == EXPECTED
target = OUT / "source-details-provenance.json"
assert not target.exists()
target.write_text(json.dumps(receipt, ensure_ascii=False, indent=2) + "\n")
print(json.dumps(receipt, ensure_ascii=False, indent=2))
