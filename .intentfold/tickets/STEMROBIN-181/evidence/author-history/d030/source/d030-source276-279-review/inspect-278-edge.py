import hashlib
import json
from pathlib import Path

from PIL import Image
import numpy as np

root = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
source = root / ".tmp/ld-s10y-lesson/9p/pages/0278/page.png"
output = root / ".intentfold/tickets/STEMROBIN-181/tmp/d030-source276-279-review"
output.mkdir(parents=True, exist_ok=True)
image = Image.open(source).convert("RGB")
pixels = np.asarray(image)
mask = pixels.min(axis=2) < 128
ys, xs = np.where(mask[2160:2185])
assert xs.size
edge = 110
interior = (xs >= edge) & (xs < image.width - edge)
crop = output / "0278-extra-bottom-band.png"
assert not crop.exists()
image.crop((0, 2120, image.width, 2220)).save(crop)
result = {
    "source": str(source),
    "sourceSha256": hashlib.sha256(source.read_bytes()).hexdigest(),
    "crop": str(crop),
    "cropSha256": hashlib.sha256(crop.read_bytes()).hexdigest(),
    "cropBoxLTRB": [0, 2120, image.width, 2220],
    "extraNativeBandInclusive": [2160, 2184],
    "blackPixelsInBand": int(xs.size),
    "blackXRange": [int(xs.min()), int(xs.max())],
    "candidateCountingEdgeMarginPx": edge,
    "blackPixelsInsideRetainedCountingWidth": int(interior.sum()),
    "retainedBlackPixelsBy50pxBand": {
        str(int(column)): int((xs[interior] // 50 == column).sum())
        for column in np.unique(xs[interior] // 50)
    },
    "sourcePixelsChanged": False,
    "semanticApproval": False,
}
(output / "0278-edge-pixel-measurement.json").write_text(
    json.dumps(result, indent=2) + "\n", encoding="utf-8"
)
print(json.dumps(result))
