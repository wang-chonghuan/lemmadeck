import hashlib
import json
from pathlib import Path

from PIL import Image


ROOT = Path("/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck")
SOURCE = ROOT / ".tmp/STEMROBIN-181/d1816-d316/source-work/10p/pages/0384/page.png"
OUTPUT = Path(__file__).resolve().parent / "source384-final-paragraph.crop.png"
EXPECTED = "9d9fff58f56e041d5cce1b43242b6951c8d5774360c27ab5806ff1ef72bed006"
BOX = (160, 1595, 1360, 2025)

assert hashlib.sha256(SOURCE.read_bytes()).hexdigest() == EXPECTED
assert not OUTPUT.exists()
with Image.open(SOURCE) as original:
    assert BOX[2] <= original.width and BOX[3] <= original.height
    cropped = original.crop(BOX)
    assert cropped.size == (1200, 430)
    cropped.save(OUTPUT)
    print(json.dumps({
        "source_path": str(SOURCE),
        "source_sha256": EXPECTED,
        "source_size_px": list(original.size),
        "source_mode": original.mode,
        "crop_box_ltrb_px": list(BOX),
        "crop_path": str(OUTPUT),
        "crop_size_px": list(cropped.size),
        "crop_sha256": hashlib.sha256(OUTPUT.read_bytes()).hexdigest(),
        "operation": "Original pixels only; no resizing, masking, filtering or enhancement.",
    }, indent=2))
