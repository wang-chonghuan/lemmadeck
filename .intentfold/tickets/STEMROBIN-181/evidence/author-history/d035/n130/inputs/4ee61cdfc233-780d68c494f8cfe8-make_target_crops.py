import hashlib
import json
from pathlib import Path

from PIL import Image


ROOT = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
OUT = ROOT / ".intentfold/tickets/STEMROBIN-181/tmp/d035-source318-targeted-evidence"
SOURCE = ROOT / ".tmp/ld-s10y-lesson/9p/pages/0318/page.png"
SOURCE_HASH = "e454f4df18da41fe1421956da8e6786d32c981f5b761d75aecab135b413a777a"

assert hashlib.sha256(SOURCE.read_bytes()).hexdigest() == SOURCE_HASH
image = Image.open(SOURCE)
assert image.size == (1504, 2289)
regions = [
    ("p0318-first-paragraph-locator.png", [190, 215, 710, 430], 2),
    ("p0318-emphasis-context.png", [175, 710, 1180, 435], 2),
    ("p0318-row5-subscript.png", [630, 495, 110, 65], 8),
    ("p0318-row6-subscript.png", [248, 578, 90, 65], 8),
    ("p0318-emphasis-same-row-control.png", [275, 715, 1075, 75], 3),
]
bindings = []
for name, rect, scale in regions:
    x, y, width, height = rect
    crop = image.crop((x, y, x + width, y + height))
    crop = crop.resize((width * scale, height * scale), Image.Resampling.NEAREST)
    target = OUT / name
    crop.save(target)
    bindings.append({
        "path": str(target),
        "sha256": hashlib.sha256(target.read_bytes()).hexdigest(),
        "sourcePath": str(SOURCE),
        "sourceSha256": SOURCE_HASH,
        "sourceRectXYWH": rect,
        "nearestNeighborScale": scale,
        "outputDimensionsPx": list(crop.size),
        "pixelAlterations": "None except nearest-neighbor integer enlargement.",
    })

manifest = OUT / "crop-bindings.json"
manifest.write_text(json.dumps(bindings, indent=2) + "\n", encoding="utf-8")
print(json.dumps(bindings, indent=2))
