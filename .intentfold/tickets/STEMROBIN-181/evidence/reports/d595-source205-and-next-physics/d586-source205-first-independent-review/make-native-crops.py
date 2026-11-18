from pathlib import Path
from hashlib import sha256
import json
from PIL import Image, ImageChops

ROOT = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
OWN = Path(__file__).resolve().parent
SOURCE = ROOT / ".intentfold/tickets/STEMROBIN-181/tmp/d579-source205-first-author/work/10p/pages/0205/page.png"
EXPECTED = "4939ac844ebd5a0a8359025f133a0ab74a3daaacae35526836cd1db8bfd01947"
assert sha256(SOURCE.read_bytes()).hexdigest() == EXPECTED
image = Image.open(SOURCE)
records = []
for name, top, bottom in [
    ("source205-top-native.png", 180, 1040),
    ("source205-middle-native.png", 1040, 1615),
    ("source205-bottom-native.png", 1615, 2130),
]:
    box = (0, top, image.width, bottom)
    crop = image.crop(box)
    target = OWN / name
    assert not target.exists()
    crop.save(target)
    saved = Image.open(target)
    assert saved.size == crop.size
    assert ImageChops.difference(saved, crop).getbbox() is None
    records.append({
        "path": str(target),
        "sha256": sha256(target.read_bytes()).hexdigest(),
        "source_box_xyxy": list(box),
        "dimensions": list(saved.size),
        "unscaled": True,
        "source_identical_pixels": True,
    })
metadata = OWN / "native-crops.json"
assert not metadata.exists()
metadata.write_text(json.dumps({
    "source": {"path": str(SOURCE), "sha256": EXPECTED, "dimensions": list(image.size)},
    "crops": records,
}, indent=2) + "\n")
print(metadata.read_text())
