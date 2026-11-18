import hashlib
import json
from pathlib import Path
from PIL import Image

out = Path(__file__).resolve().parent
author = out.parent / "d260-source178179-first-author"
records = []
for page, name, box in [
    ("0178", "source178-lower-detail.png", (140, 1620, 1375, 2110)),
    ("0179", "source179-upper-detail.png", (180, 90, 1420, 970)),
    ("0179", "source179-lower-detail.png", (180, 990, 1420, 2020)),
]:
    source = author / "work/10p/pages" / page / "page.png"
    destination = out / name
    if destination.exists():
        raise RuntimeError(f"Refusing repeat generation: {destination}")
    with Image.open(source) as image:
        image.crop(box).save(destination)
    records.append({
        "path": str(destination),
        "sha256": hashlib.sha256(destination.read_bytes()).hexdigest(),
        "page": str(source),
        "page_sha256": hashlib.sha256(source.read_bytes()).hexdigest(),
        "crop_box_ltrb": box,
        "resized": False,
    })

page = author / "work/10p/pages/0178/page.png"
png = author / "work/10p/pages/0178/figures/fig-136.png"
with Image.open(page) as whole, Image.open(png) as raw:
    exact = whole.convert("RGB").crop((344, 241, 1131, 502))
    compared = raw.convert("RGB")
    equal = exact.size == compared.size and exact.tobytes() == compared.tobytes()
    if not equal:
        raise RuntimeError("RAW136 PNG does not equal the declared padded page region")
    dimensions = raw.size
receipt = {
    "schema": "d267-detail-generation-and-png-equality@1",
    "date": "2026-11-18",
    "exitCode": 0,
    "detailsGenerated": records,
    "detailsActuallyOpenedByThisCommand": 0,
    "raw136": {
        "png": str(png),
        "sha256": hashlib.sha256(png.read_bytes()).hexdigest(),
        "native_box_xywh": [356, 253, 763, 237],
        "padded_page_region_ltrb": [344, 241, 1131, 502],
        "dimensions": dimensions,
        "RGBPixelEqualityWithPageRegion": equal,
        "isSupplementaryToIndependentVisualReview": True,
    },
    "oldFilesModified": 0,
    "nativeRuns": 0,
}
destination = out / "detail-and-png-receipt.json"
with destination.open("x", encoding="utf-8") as handle:
    json.dump(receipt, handle, ensure_ascii=False, indent=2)
    handle.write("\n")
print(json.dumps(receipt, ensure_ascii=False))
