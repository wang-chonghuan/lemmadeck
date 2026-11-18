import hashlib
import json
from pathlib import Path

from PIL import Image


HERE = Path(__file__).resolve().parent
AUTHOR = HERE.parent / "d160-source168-author"
SOURCE = AUTHOR / "work/10p/pages/0168/page.png"
EXPECTED = "dbfdecab45696ff15e5adff20311726210f29799f3ea369116fa0b9a77eb0b34"


def sha256(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


assert sha256(SOURCE) == EXPECTED, "Source hash changed"
records = []
with Image.open(SOURCE) as image:
    assert image.size == (1536, 2337), "Unexpected source dimensions"
    for name, bounds in [
        ("typography-upper.png", (110, 870, 1310, 1440)),
        ("typography-lower.png", (110, 1440, 1310, 2090)),
    ]:
        output = HERE / name
        assert not output.exists(), "Do not overwrite existing evidence"
        image.crop(bounds).save(output)
        records.append({
            "path": str(output),
            "sha256": sha256(output),
            "sourcePath": str(SOURCE),
            "sourceSha256": EXPECTED,
            "boxXYXY": bounds,
            "resampled": False,
        })
receipt = HERE / "crop-evidence.json"
assert not receipt.exists(), "Do not overwrite existing receipt"
receipt.write_text(json.dumps(records, indent=2) + "\n", encoding="utf-8")
print(json.dumps({"status": "created-not-yet-opened", "crops": records}, indent=2))
