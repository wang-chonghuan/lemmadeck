import hashlib
import json
from pathlib import Path

from PIL import Image

root = Path(__file__).resolve().parent
source = root.parent / "d561-source203-first-author/work/10p/pages/0203/page.png"
expected = "d42c5de941ab9b479506a6fb9c07bfd352edbdc06384d5330067e8506c3faf63"
assert hashlib.sha256(source.read_bytes()).hexdigest() == expected

requests = [
    ("row21-adjudication", (220, 1575, 1380, 1640), 1),
    ("fig180-lower-left-label", (934, 1445, 981, 1486), 4),
]
with Image.open(source) as image:
    assert image.size == (1536, 2337)
    for name, box, scale in requests:
        output = root / (name + ".png")
        assert not output.exists(), "No crop replay"
        crop = image.crop(box)
        if scale != 1:
            crop = crop.resize(
                (crop.width * scale, crop.height * scale),
                Image.Resampling.NEAREST,
            )
        crop.save(output)
        receipt = {
            "source_path": str(source),
            "source_sha256": expected,
            "crop_xyxy": list(box),
            "scale": scale,
            "resampling": "nearest" if scale != 1 else "none",
            "path": str(output),
            "sha256": hashlib.sha256(output.read_bytes()).hexdigest(),
            "image_open_count_on_creation": 0,
            "purpose": name,
            "source_mutated": False,
            "initial_inventory_mutated": False,
        }
        (root / (name + ".receipt.json")).write_text(
            json.dumps(receipt, indent=2) + "\n", encoding="utf-8"
        )
        print(json.dumps(receipt))
