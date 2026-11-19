from pathlib import Path

from PIL import Image


ROOT = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
SOURCE = ROOT / ".intentfold/tickets/STEMROBIN-181/tmp/d889-source238-first-preparation/work/10p/pages/0238/page.png"
OUTPUT = ROOT / ".intentfold/tickets/STEMROBIN-181/tmp/d897-source238-first-independent-review"
CROPS = {
    "source-top.png": (155, 210, 1360, 705),
    "source-middle.png": (155, 715, 1360, 1490),
    "source-bottom.png": (155, 1505, 1360, 2065),
}

with Image.open(SOURCE) as image:
    for name, box in CROPS.items():
        target = OUTPUT / name
        if target.exists():
            raise FileExistsError(target)
        image.crop(box).save(target)
        print(f"{name}: source box {box}, unchanged pixels")
