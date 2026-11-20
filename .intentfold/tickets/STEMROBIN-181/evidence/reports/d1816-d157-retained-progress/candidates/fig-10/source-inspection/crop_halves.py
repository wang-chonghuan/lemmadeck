from pathlib import Path
from PIL import Image

ROOT = Path("/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck")
source = ROOT / ".tmp/STEMROBIN-181/d1816-d149/root/9p/figures/fig-10.png"
folder = ROOT / ".tmp/STEMROBIN-181/d1816-d157/figures/fig-10/source-inspection"
boxes = {
    "particles-left-nearest-8x.png": (9, 331, 141, 441),
    "particles-right-nearest-8x.png": (133, 331, 265, 441),
}
with Image.open(source) as image:
    for name, box in boxes.items():
        output = folder / name
        if output.exists():
            raise SystemExit(f"Refusing to overwrite {output}")
        image.crop(box).resize((1056, 880), Image.Resampling.NEAREST).save(output)
        print(f"{output}: source box={box}, output=1056x880")
