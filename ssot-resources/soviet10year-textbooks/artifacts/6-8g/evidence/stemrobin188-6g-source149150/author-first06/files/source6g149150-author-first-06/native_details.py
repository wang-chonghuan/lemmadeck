from pathlib import Path
import hashlib
import json
from PIL import Image

OWN = Path(__file__).resolve().parent
DETAILS = [
    ("0149", "given", (265, 1360, 640, 1492)),
    ("0150", "cases", (214, 960, 1235, 1150)),
    ("0150", "proof-head", (137, 200, 1280, 600)),
]
records = []
for page, label, box in DETAILS:
    source = OWN / "work" / "6-8g" / "pages" / page / "page.png"
    output = OWN / "nativecrops" / f"{page}-{label}.png"
    if output.exists():
        raise RuntimeError(f"do not replay successful crop: {output}")
    output.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(source) as image:
        crop = image.crop(box)
        crop.save(output)
    records.append({
        "source": str(source),
        "source_sha256": hashlib.sha256(source.read_bytes()).hexdigest(),
        "crop": str(output),
        "crop_sha256": hashlib.sha256(output.read_bytes()).hexdigest(),
        "box_xyxy": box,
        "native_pixels": True,
        "resized": False,
    })
print(json.dumps(records, indent=2))
