from hashlib import sha256
from pathlib import Path

from PIL import Image


ROOT = Path("/Users/yong/.codex/worktrees/stemrobin-181-resume/lemmadeck")
OUT = ROOT / ".intentfold/tickets/STEMROBIN-181/tmp/d1816-raw245246-source309-final-review"
SOURCE = ROOT / ".tmp/ld-s10y-lesson/10p/pages/0309/page.png"
EXPECTED = "6e068eaef1d01ccc5a4c4992f9714d8ce56f49487fc36874374d868861c0cfd7"
BOX = (235, 588, 1180, 186)
TARGET = OUT / "source0309-ex7-adjacent-original-pixels.png"

assert sha256(SOURCE.read_bytes()).hexdigest() == EXPECTED
assert not TARGET.exists(), "Do not replace another worker's evidence."
x, y, width, height = BOX
with Image.open(SOURCE) as source:
    crop = source.crop((x, y, x + width, y + height))
    crop.save(TARGET)
with Image.open(SOURCE) as source, Image.open(TARGET) as target:
    assert target.mode == source.mode
    assert target.size == (width, height)
    assert target.tobytes() == source.crop((x, y, x + width, y + height)).tobytes()
print(f"path={TARGET}")
print(f"sha256={sha256(TARGET.read_bytes()).hexdigest()}")
print(f"source_box_px={list(BOX)}")
print("transform=crop-only; no resizing, enhancement, thresholding, or retyping")
