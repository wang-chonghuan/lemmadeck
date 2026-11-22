"""Make source-only diagnostic crops without resampling or pixel changes."""

import hashlib
import json
from pathlib import Path
import sys

from PIL import Image


ROOT = Path("/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck")
SOURCE = ROOT / ".tmp/STEMROBIN-181/d1816-d805/work/10p/pages/0137/page.png"
OUTPUT = ROOT / ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d867-source137-held-details-review"
EXPECTED = "acf965b86a7c7cdb73c98637b61875f8546268a8429254729270184331153e79"
CROPS = {
    "rows12-15": (180, 880, 1390, 1120),
    "row13-glyphs": (180, 940, 1180, 1005),
}


def sha256(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


if Path.cwd() != ROOT:
    raise SystemExit("Wrong workdir")
if sha256(SOURCE) != EXPECTED:
    raise SystemExit("Source hash mismatch")
name = sys.argv[1]
box = CROPS[name]
target = OUTPUT / (name + ".png")
if target.exists():
    raise SystemExit("Refusing to overwrite existing evidence")
with Image.open(SOURCE) as original:
    crop = original.crop(box)
    crop.save(target, format="PNG")
    with Image.open(target) as saved:
        if saved.mode != crop.mode or saved.size != crop.size:
            raise SystemExit("Crop mode or dimensions changed")
        if saved.tobytes() != crop.tobytes():
            raise SystemExit("Decoded crop pixels changed")
    receipt = {
        "operation": "native_coordinate_lossless_crop",
        "source": str(SOURCE),
        "source_sha256": EXPECTED,
        "source_size": list(original.size),
        "source_mode": original.mode,
        "box_xyxy_right_bottom_exclusive": list(box),
        "output": str(target),
        "output_sha256": sha256(target),
        "output_size": list(crop.size),
        "decoded_pixel_equality": True,
        "resampling": False,
        "ocr": False,
    }
receipt_path = OUTPUT / (name + ".crop-receipt.json")
with receipt_path.open("x", encoding="utf-8") as stream:
    json.dump(receipt, stream, indent=2)
    stream.write("\n")
print(json.dumps(receipt, indent=2))
