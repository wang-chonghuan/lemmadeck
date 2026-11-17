import hashlib
import json
from pathlib import Path

from PIL import Image


root = Path(__file__).resolve().parent
regions = [
    ("zh-text-390x844", (16, 767, 374, 969)),
    ("en-text-390x844", (16, 1081, 374, 1307)),
]
manifest = []
for surface, box in regions:
    source = root / f"{surface}-fullpage.png"
    output = root / f"{surface}-projection-context-2x.png"
    if output.exists():
        raise RuntimeError(f"Refusing to overwrite {output}")
    with Image.open(source) as image:
        crop = image.crop(box)
        crop.resize((crop.width * 2, crop.height * 2), Image.Resampling.NEAREST).save(output)
    manifest.append({
        "surface": surface,
        "source": str(source),
        "sourceSha256": hashlib.sha256(source.read_bytes()).hexdigest(),
        "crop": str(output),
        "cropSha256": hashlib.sha256(output.read_bytes()).hexdigest(),
        "sourcePixelBox": box,
        "scale": 2,
        "resampling": "nearest; existing screenshot pixels only",
        "purpose": "Resolve retained local projection-formula overflow finding",
        "nativeRerender": False,
        "browserPass": False,
    })
output = root / "crop-manifest.json"
with output.open("x") as handle:
    json.dump(manifest, handle, indent=2)
    handle.write("\n")
print(json.dumps(manifest, indent=2))
