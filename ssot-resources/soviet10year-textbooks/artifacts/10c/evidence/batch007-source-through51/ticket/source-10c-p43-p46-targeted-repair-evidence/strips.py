import hashlib
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path.cwd()
OUT = ROOT / ".intentfold/tickets/STEMROBIN-184/tmp/source-10c-p43-p46-targeted-repair-evidence"
assert (OUT / "diagnostic.json").exists(), "Use the saved natural band diagnosis"
TARGET = OUT / "native-strips.json"
assert not TARGET.exists(), "Do not overwrite native strip evidence"

specs = [
    (43, "p43-final-prose-row", [300, 2098, 1220, 145]),
    (46, "p46-single-a-minus-one-row", [490, 1248, 620, 105]),
    (46, "p46-first-two-prose-rows", [135, 1360, 1340, 170]),
    (46, "p46-three-fraction-prose-rows", [130, 1534, 1320, 410]),
    (46, "p46-right-margin", [1495, 1310, 170, 385]),
    (46, "p46-bottom-margin", [420, 2458, 1275, 70]),
    (46, "p46-figure27-caption-boundary", [100, 610, 1510, 145]),
    (46, "p46-final-prose-row", [130, 2095, 1190, 140]),
]
records = []
for page, name, box in specs:
    png = ROOT / f".tmp/ld-s10y-lesson/10c/pages/{page:04}/page.png"
    image = Image.open(png)
    x, y, w, h = box
    target = OUT / f"{name}.png"
    assert not target.exists()
    crop = image.crop((x, y, x + w, y + h))
    crop.save(target)
    assert np.array_equal(np.asarray(crop), np.asarray(image)[y:y + h, x:x + w])
    records.append({
        "page": page, "path": str(target.relative_to(ROOT)),
        "source": str(png.relative_to(ROOT)),
        "source_sha256": hashlib.sha256(png.read_bytes()).hexdigest(),
        "source_box_xywh": box, "native_size": list(crop.size),
        "sha256": hashlib.sha256(target.read_bytes()).hexdigest(),
        "bytes": target.stat().st_size, "native_pixel_slice_exact": True,
        "scaled": False, "enhanced": False, "annotated": False,
    })
TARGET.write_text(json.dumps({
    "role": "Specific natural-band diagnostic strips only; not source reapproval",
    "image_context_limit": 8, "native_strips": records,
}, indent=2) + "\n")
print(json.dumps(records, indent=2))
