"""One matched RAW/raster detail crop pair; no new SVG rasterization."""
import hashlib
import json
from pathlib import Path

from PIL import Image

REPO = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
OUT = REPO / "tmp/d327-source181-first-independent-review"
ROOT = REPO / ".intentfold/tickets/STEMROBIN-181/evidence/reports/d285-bounded-progress/d279-source181-first-author"
BOX = (110, 145, 325, 280)
records = []
for kind, source in [
    ("raw", ROOT / "work/10p/pages/0181/figures/fig-138.png"),
    ("existing-raster", OUT / "fig-138.existing-svg.resvg.png"),
]:
    target = OUT / f"fig-138.{kind}.central-detail-3x.png"
    if target.exists():
        raise ValueError(f"Refusing second crop: {target}")
    image = Image.open(source)
    crop = image.crop(BOX)
    crop.resize((crop.width * 3, crop.height * 3), Image.Resampling.NEAREST).save(target)
    records.append({
        "kind": kind,
        "source": str(source),
        "sourceSHA256": hashlib.sha256(source.read_bytes()).hexdigest(),
        "path": str(target),
        "sha256": hashlib.sha256(target.read_bytes()).hexdigest(),
        "cropBoxLTRB": list(BOX),
        "scale": 3,
        "filter": "nearest",
        "size": [645, 405],
        "svgRasterizations": 0,
        "semanticInferenceAdded": False,
    })
with (OUT / "detail-crop-receipts.json").open("x") as handle:
    json.dump(records, handle, indent=2)
    handle.write("\n")
print(json.dumps(records, indent=2))
