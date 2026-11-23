from pathlib import Path
import json
import shutil
from PIL import Image

cwd = Path("/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188")
root = cwd / ".intentfold/tickets/STEMROBIN-188/tmp/source6g177178-author7"
copies = []
for page in (177, 178):
    source = cwd / f".tmp/ld-s10y-lesson/6-8g/pages/{page:04d}"
    target = root / f"work/6-8g/pages/{page:04d}"
    target.mkdir(parents=True, exist_ok=True)
    for name in ("page.png", "page.grid.png", "layout.json", "page.template.md",
                 "prepare.0001.stdout", "prepare.0001.stderr"):
        destination = target / name
        if destination.exists():
            raise RuntimeError(f"Refusing to overwrite {destination}")
        shutil.copyfile(source / name, destination)
        copies.append({"source": str(source / name), "copy": str(destination)})

details = [
    (177, "p0177-ex493-detail.png", (270, 830, 1295, 1095)),
    (178, "p0178-ex504-509-detail.png", (145, 1140, 1270, 1920)),
]
(root / "observations").mkdir(exist_ok=True)
for page, name, box in details:
    source = root / f"work/6-8g/pages/{page:04d}/page.png"
    destination = root / "observations" / name
    with Image.open(source) as image:
        image.crop(box).save(destination)
    copies.append({"detail_crop": str(destination), "source": str(source),
                   "box_xyxy": list(box), "operation": "unaltered rectangular crop"})

(root / "copy-receipt.json").write_text(
    json.dumps({"cwd": str(cwd), "copies": copies, "prepare_reruns": 0,
                "original_image_sha256_verified_once": {
        "0177/page.png": "2d8641fb0d5461eae8a1024f600a535321c8970823d44c83289efaf34b639f79",
        "0177/page.grid.png": "5a75c941604ab12dd0c67cc5c6252448478cd91477f92a5f1afa97048baa2cce",
        "0178/page.png": "703824c5d4a028f14502436cde079fda67e404f0cb1a768faca55bb284d1b57b",
        "0178/page.grid.png": "e58d66e8c5e48afaa555668d0d27861f8e95733f37c05652a99cc6d2b132a15f"
    }}, indent=2) + "\n", encoding="utf-8")
print(json.dumps({"copied_files": 12, "detail_crops_created": 2,
                  "root": str(root), "prepare_reruns": 0}))
