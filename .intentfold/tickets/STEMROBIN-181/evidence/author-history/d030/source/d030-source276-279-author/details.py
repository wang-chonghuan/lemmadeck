import hashlib
import json
import sys
from pathlib import Path

from PIL import Image

out = Path(__file__).resolve().parent
page = int(sys.argv[1])
assert page in (276, 277, 278, 279)
box = tuple(map(int, sys.argv[2:]))
assert len(box) == 4
source = Path(f".tmp/ld-s10y-lesson/9p/pages/{page:04d}/page.png")
target = out / "details" / f"{page:04d}.detail.png"
receipt = target.with_suffix(".json")
assert not target.exists() and not receipt.exists()
target.parent.mkdir(parents=True, exist_ok=True)
with Image.open(source) as image:
    assert 0 <= box[0] < box[2] <= image.width
    assert 0 <= box[1] < box[3] <= image.height
    image.crop(box).save(target)
receipt.write_text(json.dumps({
    "source": str(source),
    "source_sha256": hashlib.sha256(source.read_bytes()).hexdigest(),
    "crop": str(target),
    "crop_sha256": hashlib.sha256(target.read_bytes()).hexdigest(),
    "box_ltrb": box,
    "pixel_edits": False,
    "resized": False,
    "opened_in_context_by_this_script": False,
}, indent=2) + "\n")
print(target)
