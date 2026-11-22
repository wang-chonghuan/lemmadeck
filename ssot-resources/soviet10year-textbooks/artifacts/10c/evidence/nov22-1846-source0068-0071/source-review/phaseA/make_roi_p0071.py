"""Final bounded native ROI for the visible property-4 source token."""

from pathlib import Path

from PIL import Image


ROOT = Path("/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck")
DEST = ROOT / ".tmp/stemrobin-184-six/source10c6871-review/phaseA"
SOURCE = ROOT / ".tmp/stemrobin-184-six/source10c5255-work/10c/pages/0071/page.png"
OUTPUT = DEST / "p0071-roi01-native.png"
BOX = (215, 473, 835, 540)

if OUTPUT.exists():
    raise SystemExit("Refusing to overwrite an existing ROI")
with Image.open(SOURCE) as image:
    if image.size != (1695, 2580):
        raise SystemExit(f"Unexpected native source dimensions: {image.size}")
    image.crop(BOX).save(OUTPUT)
print(f"created={OUTPUT}")
print(f"source={SOURCE}")
print(f"native_box_xyxy={BOX}; native_size=620x67; scale=1; creations=1")
