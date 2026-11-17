"""Create the seven explicitly authorized, untransformed native crops once."""

import hashlib
import json
from pathlib import Path

from PIL import Image


OUT = Path(__file__).resolve().parent
ROOT = OUT.parents[4]
NUMERIC = OUT.parent / "production-counter144-151-array-trace"
TARGETS = (
    ("144", 144, (141, 2466, 454, 2494)),
    ("146A", 146, (533, 2463, 970, 2491)),
    ("146B", 146, (1419, 2471, 1649, 2502)),
    ("147", 147, (30, 2472, 1481, 2522)),
    ("148", 148, (1490, 2482, 1639, 2510)),
    ("150", 150, (7, 2457, 1635, 2502)),
    ("151", 151, (43, 2473, 1655, 2518)),
)


def file_sha(filename):
    return hashlib.sha256(filename.read_bytes()).hexdigest()


def write_json(filename, value):
    with filename.open("x") as stream:
        json.dump(value, stream, ensure_ascii=True, indent=2)
        stream.write("\n")


summary_path = NUMERIC / "runtime-summary.json"
bindings_path = NUMERIC / "final-input-bindings.json"
if file_sha(summary_path) != "b845c30c70a2bd3bac18fbb7ff0c3e4bcf8ede1ba818c438d470eca2f1456d47":
    raise ValueError("Frozen numeric summary changed")
if file_sha(bindings_path) != "7aa4b53715c7b8cf76125eecd8b54dbdadad689e31039e9280a92bca038eee6b":
    raise ValueError("Frozen source bindings changed")
summary = json.loads(summary_path.read_text())
old_bindings = json.loads(bindings_path.read_text())
sources = {}
source_images = {}
metadata = []
for key, page, box in TARGETS:
    source_item = next(item for item in summary["pages"] if item["page"] == page)
    group = "144-147" if page < 148 else "148-151"
    source = OUT.parent / f"production-source10c{group}/10c/pages/{page:04d}/page.png"
    expected = source_item["source_sha256"]
    if str(source) not in old_bindings or old_bindings[str(source)]["sha256"] != expected:
        raise ValueError(f"Unexpected original source binding: {page}")
    if page not in sources:
        actual = file_sha(source)
        if actual != expected:
            raise ValueError(f"Original source changed: {page}")
        image = Image.open(source)
        image.load()
        source_images[page] = image
        sources[page] = {
            "path": str(source), "bytes": source.stat().st_size,
            "dimensions_wh": list(image.size), "mode": image.mode,
            "sha256": actual, "matches_frozen_first_source": True,
        }
    image = source_images[page]
    x0, y0, x1, y1 = box
    if not (0 <= x0 < x1 <= image.width and 0 <= y0 < y1 <= image.height):
        raise ValueError(f"Authorized crop out of source bounds: {key}")
    directory = OUT / "crops" / key
    directory.mkdir(parents=True, exist_ok=False)
    crop_path = directory / "native.png"
    crop = image.crop(box)
    with crop_path.open("xb") as stream:
        crop.save(stream, format="PNG")
    record = {
        "target": key, "physical_page": page,
        "source": sources[page],
        "crop": {
            "path": str(crop_path), "halfopen_xyxy": list(box),
            "bytes": crop_path.stat().st_size, "dimensions_wh": list(crop.size),
            "mode": crop.mode, "sha256": file_sha(crop_path),
        },
        "transform": "PIL.Image.crop(exact half-open box); PNG save only",
        "resize_contrast_ocr_montage": False,
        "model_views_at_creation": 0,
        "view_limit": 1,
    }
    write_json(directory / "metadata.json", record)
    metadata.append(record)
for image in source_images.values():
    image.close()
write_json(OUT / "crop-bindings.json", {
    "status": "SEVEN_NEW_NATIVE_CROPS_CREATED_ONCE",
    "numeric_inputs": [
        {"path": str(filename), "sha256": file_sha(filename)}
        for filename in (summary_path, bindings_path)
    ],
    "source_originals": list(sources.values()),
    "crops": metadata,
    "optional145": "NOT_CREATED; existing numerical diagnosis is complete",
    "numeric_reruns": 0,
    "model_images_before": "0/24",
    "batch_max_images": 8,
})
print(json.dumps({
    "created": len(metadata), "originals_decoded_programmatically": len(sources),
    "targets": [item["target"] for item in metadata],
    "metadata": [str(OUT / "crops" / item["target"] / "metadata.json") for item in metadata],
    "additional_line_bands_calls": 0, "model_views": 0,
}, indent=2))
