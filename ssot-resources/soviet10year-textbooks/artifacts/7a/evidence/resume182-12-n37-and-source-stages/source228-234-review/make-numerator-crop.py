from pathlib import Path
import hashlib
import json
from PIL import Image

root = Path.cwd()
assert str(root) == "/Users/yong/.codex/worktrees/d9b1/lemmadeck"
owned = root / ".intentfold/tickets/STEMROBIN-182/tmp/resume182-12/source228-234-review"
source = root / ".tmp/ld-s10y-lesson/7a/pages/0229/page.png"
output = owned / "0229-example3-numerator.crop.png"
assert not output.exists()
box = (520, 630, 970, 775)
with Image.open(source) as image:
    image.crop(box).resize((900, 290)).save(output)
receipt = {
    "source": str(source),
    "source_sha256": hashlib.sha256(source.read_bytes()).hexdigest(),
    "crop": str(output),
    "crop_sha256": hashlib.sha256(output.read_bytes()).hexdigest(),
    "box_xyxy": list(box),
    "resize": [900, 290],
    "purpose": "Settle printed middle numerator 33 versus 36 before authored comparison.",
    "model_crop_opens_planned": 1,
}
(owned / "crop-receipt.json").write_text(json.dumps(receipt, indent=2) + "\n")
print(json.dumps(receipt))
