import hashlib
import json
from pathlib import Path

from PIL import Image, ImageChops


evidence = Path(__file__).resolve().parent
author = evidence / "snapshots" / "author"
source_path = author / "work/10p/pages/0093/page.png"
source = Image.open(source_path)
audit = json.loads((author / "root/10p/pages/0093/audit.json").read_text())
checks = []
for figure in audit["figures"]:
    x, y, width, height = figure["box"]
    rectangle = [x - 12, y - 12, x + width + 12, y + height + 12]
    crop_path = author / f"work/10p/pages/0093/figures/{figure['id']}.png"
    crop = Image.open(crop_path)
    expected = source.crop(rectangle)
    assert expected.size == crop.size
    assert ImageChops.difference(expected.convert("RGB"), crop.convert("RGB")).getbbox() is None
    checks.append({
        "id": figure["id"],
        "box": figure["box"],
        "paddingPx": 12,
        "sourceRectangleXYXY": rectangle,
        "size": list(crop.size),
        "sha256": hashlib.sha256(crop_path.read_bytes()).hexdigest(),
        "pixelEquality": True,
    })
result = {
    "schema": "stemrobin-181/source-crop-pixel-check@1",
    "sourcePath": str(source_path),
    "sourceSha256": hashlib.sha256(source_path.read_bytes()).hexdigest(),
    "checks": checks,
    "note": "Read-only crop equality check; does not run prepare or finalize.",
}
with (evidence / "crop-pixel-check.json").open("x") as output:
    json.dump(result, output, indent=2)
    output.write("\n")

page92 = Image.open(author / "work/10p/pages/0092/page.png")
snippet = evidence / "0092-line12-source.png"
assert not snippet.exists()
page92.crop((150, 980, 1380, 1060)).save(snippet)
print(json.dumps({"cropChecks": checks, "defectSnippet": str(snippet)}))
