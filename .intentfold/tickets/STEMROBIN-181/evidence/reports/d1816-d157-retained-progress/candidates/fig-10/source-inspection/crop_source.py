from pathlib import Path
from PIL import Image

ROOT = Path("/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck")
source = ROOT / ".tmp/STEMROBIN-181/d1816-d149/root/9p/figures/fig-10.png"
output = ROOT / ".tmp/STEMROBIN-181/d1816-d157/figures/fig-10/source-inspection/particles-nearest-4x.png"
if output.exists():
    raise SystemExit("Refusing to overwrite an inspection artifact")
with Image.open(source) as image:
    crop = image.crop((9, 325, 269, 451))
    crop.resize((1040, 504), Image.Resampling.NEAREST).save(output)
print(output)
print("source box=[9,325,269,451], output=1040x504, nearest-neighbor")
