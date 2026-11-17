from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parent
source = root.parents[4] / "ssot-resources/soviet10year-textbooks/artifacts/10p/figures/fig-70.png"
assert source.exists()
image = Image.open(source)
for name, box in [
    ("source-upper-detail.png", (75, 105, 620, 695)),
    ("source-lower-detail.png", (80, 695, 920, 1355)),
]:
    target = root / name
    assert not target.exists()
    image.crop(box).resize(((box[2] - box[0]) * 2, (box[3] - box[1]) * 2)).save(target)
