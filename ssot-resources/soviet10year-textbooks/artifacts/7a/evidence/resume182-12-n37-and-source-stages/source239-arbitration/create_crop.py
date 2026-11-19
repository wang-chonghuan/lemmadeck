import hashlib
import json
from datetime import datetime, timezone
from pathlib import Path

from PIL import Image


ROOT = Path("/Users/yong/.codex/worktrees/d9b1/lemmadeck")
OUT = ROOT / ".intentfold/tickets/STEMROBIN-182/tmp/resume182-12/source239-arbitration"
SOURCE = ROOT / ".tmp/ld-s10y-lesson/7a/pages/0239/page.png"
CROP = OUT / "page0239-x180-1320-y285-390-nearest2x.png"
LOG = OUT / "crop-provenance.json"
BOUNDS = (180, 285, 1320, 390)


def sha256(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


if Path.cwd().resolve() != ROOT:
    raise RuntimeError("Unexpected working directory")
if CROP.exists() or LOG.exists():
    raise RuntimeError("Refusing to replace an existing crop or provenance log")

source_sha = sha256(SOURCE)
with Image.open(SOURCE) as image:
    size = image.size
    if not (0 <= BOUNDS[0] < BOUNDS[2] <= size[0]
            and 0 <= BOUNDS[1] < BOUNDS[3] <= size[1]):
        raise RuntimeError("Crop exceeds source bounds")
    crop = image.crop(BOUNDS)
    crop = crop.resize((crop.width * 2, crop.height * 2), Image.Resampling.NEAREST)
    crop.save(CROP, format="PNG")

if sha256(SOURCE) != source_sha:
    raise RuntimeError("Source changed during crop creation")

LOG.write_text(json.dumps({
    "created_at_utc": datetime.now(timezone.utc).isoformat(),
    "source_path": str(SOURCE),
    "source_sha256": source_sha,
    "source_size_pixels": list(size),
    "crop_path": str(CROP),
    "crop_sha256": sha256(CROP),
    "crop_bounds_xyxy_exclusive": list(BOUNDS),
    "crop_size_pixels": [crop.width, crop.height],
    "scale": 2,
    "resampling": "nearest-neighbor",
    "format": "lossless PNG",
    "pixel_values_interpolated": False,
    "original_display_count": 0,
    "permitted_crop_display_count": 1,
    "note": "This log was created before any source transcription or report comparison."
}, indent=2) + "\n", encoding="utf-8")
print(LOG.read_text(encoding="utf-8"))
