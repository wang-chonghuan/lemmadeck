import hashlib
import json
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path.cwd()
OUT = ROOT / ".intentfold/tickets/STEMROBIN-184/tmp/source-10c-p47-p49-targeted-repair-evidence"
target = OUT / "native-strips.json"
assert not target.exists(), "Preserve native diagnostic strips"
records = []
for page, name, box in [
    (48, "bottom-noise-native.png", [0, 2440, 1695, 100]),
    (48, "folio-native.png", [130, 2240, 200, 90]),
    (49, "bottom-noise-native.png", [0, 2440, 1695, 100]),
    (49, "folio-native.png", [1320, 2260, 190, 90]),
]:
    source = ROOT / f".tmp/ld-s10y-lesson/10c/pages/{page:04d}/page.png"
    image = Image.open(source)
    x, y, w, h = box
    file = OUT / f"{page:04d}" / name
    assert not file.exists()
    image.crop((x, y, x + w, y + h)).save(file)
    with Image.open(file) as strip:
        assert np.array_equal(np.asarray(strip), np.asarray(image)[y:y + h, x:x + w])
    records.append({
        "page": page, "path": str(file.relative_to(ROOT)),
        "sha256": hashlib.sha256(file.read_bytes()).hexdigest(),
        "source": str(source.relative_to(ROOT)),
        "source_sha256": hashlib.sha256(source.read_bytes()).hexdigest(),
        "source_box_xywh": box, "pixel_slice_exact": True,
        "scaled": False, "enhanced": False, "annotated": False,
    })
target.write_text(json.dumps(records, indent=2) + "\n")
print(json.dumps(records, indent=2))
