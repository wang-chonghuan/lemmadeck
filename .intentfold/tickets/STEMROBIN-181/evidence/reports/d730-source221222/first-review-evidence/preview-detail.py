import hashlib
import json
from pathlib import Path

from PIL import Image

repo = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
assert Path.cwd() == repo
tmp = repo / ".intentfold/tickets/STEMROBIN-181/tmp"
own = tmp / "d711-source221222-first-review"
source = tmp / "d709-source221222-first-preparation/work/10p/pages/0222/page.png"
output = own / "source-0222-n83-first-paragraph-detail.png"
box = (160, 1430, 1340, 1570)
with Image.open(source) as image:
    crop = image.crop(box)
    crop.resize((crop.width * 2, crop.height * 2)).save(output)

raw = tmp / "d710-source221222-first-author/work/10p/pages/0221/figures/fig-195.png"
with Image.open(raw) as image:
    image = image.convert("L")
    bottom_ink = []
    for y in range(image.height - 8, image.height):
        xs = [x for x in range(image.width) if image.getpixel((x, y)) < 128]
        if xs:
            bottom_ink.append({"row": y, "minX": min(xs), "maxX": max(xs), "count": len(xs)})
result = {
    "detail": {
        "path": str(output),
        "source": str(source),
        "box": box,
        "scale": 2,
        "sha256": hashlib.sha256(output.read_bytes()).hexdigest(),
    },
    "rawBottomInk": bottom_ink,
    "rawCropSourceOrigin": [820, 93],
}
(own / "preview-detail.json").write_text(json.dumps(result, indent=2) + "\n")
print(json.dumps(result, indent=2))
