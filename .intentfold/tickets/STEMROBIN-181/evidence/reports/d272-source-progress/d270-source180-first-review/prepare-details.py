import hashlib
import json
from pathlib import Path
from PIL import Image

out = Path(__file__).resolve().parent
author = out.parent / "d268-source180-first-author"
inputs = json.loads((author / "input-bindings.json").read_text(encoding="utf-8"))
for item in [inputs["manifest"], *inputs["preparedInputs"]]:
    if hashlib.sha256(Path(item["path"]).read_bytes()).hexdigest() != item["sha256"]:
        raise RuntimeError(f"Stale input: {item['path']}")
source = author / "work/10p/pages/0180/page.png"
records = []
with Image.open(source) as image:
    for name, box in [
        ("source180-upper-detail.png", (160, 240, 1380, 1280)),
        ("source180-lower-detail.png", (155, 1350, 1400, 2110)),
    ]:
        destination = out / name
        if destination.exists():
            raise RuntimeError(f"Refusing repeated generation: {destination}")
        image.crop(box).save(destination)
        records.append({
            "path": str(destination),
            "sha256": hashlib.sha256(destination.read_bytes()).hexdigest(),
            "cropBoxLTRB": box,
            "resized": False,
        })
receipt = {
    "schema": "d270-source180-necessary-details@1",
    "date": "2026-11-18",
    "exitCode": 0,
    "preparedHashesVerified": 5,
    "source": {
        "path": str(source),
        "sha256": hashlib.sha256(source.read_bytes()).hexdigest(),
    },
    "details": records,
    "newImageOpensByThisCommand": 0,
    "source179PixelsRead": False,
    "nativeCommands": 0,
    "oldFilesModified": 0,
}
destination = out / "detail-receipt.json"
with destination.open("x", encoding="utf-8") as handle:
    json.dump(receipt, handle, ensure_ascii=False, indent=2)
    handle.write("\n")
print(json.dumps(receipt, ensure_ascii=False))
