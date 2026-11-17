import hashlib
import json
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

HERE = Path(__file__).resolve().parent
AUTHOR = HERE / "inputs"


def digest(file):
    return hashlib.sha256(file.read_bytes()).hexdigest()


page = AUTHOR / "work/10p/pages/0096/page.png"
source = Image.open(page)
crops = []
for name, box in [
    ("0096-footnote-rule-and-two-rows.png", (150, 1838, 1380, 2002)),
    ("0096-footnote-second-row-and-footer.png", (150, 1935, 1380, 2058)),
]:
    output = HERE / name
    source.crop(box).save(output)
    crops.append({
        "path": str(output),
        "sha256": digest(output),
        "source": str(page),
        "sourceSha256": digest(page),
        "sourceBoxXYWH": [box[0], box[1], box[2] - box[0], box[3] - box[1]],
    })

# Inventory connected ink only; do not import or run the lesson line counter.
ink = np.asarray(source.convert("L")) < 128
labels, _ = ndimage.label(ink)
extra = []
for index, bounds in enumerate(ndimage.find_objects(labels), 1):
    if bounds is None:
        continue
    rows, columns = bounds
    height, width = rows.stop - rows.start, columns.stop - columns.start
    if height > 80 or width > 150:
        extra.append({
            "component": index,
            "boxXYWH": [columns.start, rows.start, width, height],
            "inkPixels": int((labels[bounds] == index).sum()),
        })

figures = []
for page_number, figure, box in [
    (97, "fig-61", (291, 869, 987, 518)),
    (98, "fig-62", (255, 538, 998, 513)),
]:
    directory = AUTHOR / f"work/10p/pages/{page_number:04d}"
    original_path = directory / "page.png"
    crop_path = directory / f"figures/{figure}.png"
    original = Image.open(original_path)
    actual = Image.open(crop_path)
    x, y, w, h = box
    expected = original.crop((x - 12, y - 12, x + w + 12, y + h + 12))
    equal = actual.mode == expected.mode and np.array_equal(np.asarray(actual), np.asarray(expected))
    if not equal:
        raise RuntimeError(f"Figure crop differs from original: {figure}")
    figures.append({
        "id": figure,
        "source": str(original_path),
        "sourceSha256": digest(original_path),
        "crop": str(crop_path),
        "cropSha256": digest(crop_path),
        "boxXYWH": list(box),
        "paddingPx": 12,
        "pixelEquality": equal,
        "size": list(actual.size),
    })

report = {
    "schema": "stemrobin-181/source-review-pixels@1",
    "method": "Exact rectangular pixel comparison and connected-ink inventory only; no line counter, prepare, finalize, or source modification.",
    "targetedCrops": crops,
    "page96LargeConnectedInk": extra,
    "page96ConnectedComponentPredicate": "4-connected ink at grayscale < 128; retain height > 80 px OR width > 150 px.",
    "figures": figures,
}
(HERE / "crop-pixel-check.json").write_text(json.dumps(report, indent=2) + "\n")
print(json.dumps({"targetedCrops": crops, "page96LargeConnectedInk": extra, "figures": figures}, indent=2))
