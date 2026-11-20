import hashlib
import json
from pathlib import Path
from PIL import Image

ROOT = Path("/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck")
assert Path.cwd() == ROOT
OUT = ROOT / ".tmp/STEMROBIN-181/d1816-d050/n13-fig17-author"
source = OUT / "fig-17.preview-331.png"
target = OUT / "fig-17.preview-331-disk-crop-nearest-6x.png"
assert not target.exists()
box = (288, 198, 324, 239)
with Image.open(source) as image:
    assert image.width == 331
    crop = image.crop(box)
    crop.resize((crop.width * 6, crop.height * 6), Image.Resampling.NEAREST).save(target)
record = {
    "role": "AUTHOR",
    "source": {"path": str(source), "sha256": hashlib.sha256(source.read_bytes()).hexdigest()},
    "output": {"path": str(target), "sha256": hashlib.sha256(target.read_bytes()).hexdigest()},
    "cropBox": box,
    "nearestNeighborMagnification": 6,
    "purpose": "Inspect the existing actual 331px raster arrow tip, without regenerating the SVG or adding pixels.",
    "originalPngReopened": False,
    "nativeFigureRerendered": False,
}
(ROOT / ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d050-n13-author/mobile-arrow-crop.json").write_text(
    json.dumps(record, indent=2) + "\n", encoding="utf-8",
)
