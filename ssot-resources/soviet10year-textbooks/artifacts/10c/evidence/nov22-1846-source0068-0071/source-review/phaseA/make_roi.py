"""One bounded native source crop; no OCR, rescaling or source modification."""

from pathlib import Path

from PIL import Image


ROOT = Path("/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck")
DEST = ROOT / ".tmp/stemrobin-184-six/source10c6871-review/phaseA"
SOURCE = ROOT / ".tmp/stemrobin-184-six/source10c5255-work/10c/pages/0070/page.png"
OUTPUT = DEST / "p0070-roi01-native.png"
BOX = (1115, 260, 1450, 330)

if OUTPUT.exists():
    raise SystemExit("Refusing to overwrite an existing ROI")
with Image.open(SOURCE) as image:
    if image.size != (1695, 2580):
        raise SystemExit(f"Unexpected native source dimensions: {image.size}")
    image.crop(BOX).save(OUTPUT)
print(f"created={OUTPUT}")
print(f"source={SOURCE}")
print(f"native_box_xyxy={BOX}; native_size=335x70; scale=1; creations=1")
