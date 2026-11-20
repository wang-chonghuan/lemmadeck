from pathlib import Path
from PIL import Image

W = Path("/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck")
assert Path.cwd() == W
O = W / ".tmp/STEMROBIN-181/d1816-d073/source-details"
O.mkdir(parents=True, exist_ok=True)
image = Image.open(W / ".tmp/ld-s10y-lesson/9p/pages/0311/figures/fig-286.png")
for name, box in [
    ("left-circulation", (0, 204, 164, 323)),
    ("right-circulation", (284, 189, 393, 254)),
]:
    target = O / (name + ".png")
    assert not target.exists()
    crop = image.crop(box)
    crop.resize((crop.width * 4, crop.height * 4), Image.Resampling.NEAREST).save(target)
    print(target)
