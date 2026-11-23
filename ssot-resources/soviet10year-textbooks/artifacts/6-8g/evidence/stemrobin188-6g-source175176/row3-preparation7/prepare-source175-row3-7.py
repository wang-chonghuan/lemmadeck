import hashlib
import json
import sys
from pathlib import Path

from PIL import Image
import numpy as np

W = Path("/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188")
assert Path.cwd().resolve() == W
sys.path.insert(0, str(W / ".claude/skills/ld-s10y-lesson/tools"))
import layout

base = W / "ssot-resources/soviet10year-textbooks/artifacts/6-8g/evidence/stemrobin188-6g-source175176"
source = base / "author-first7/work/6-8g/pages/0175/page.png"
audit = base / "author-first7/artifacts/6-8g/pages/0175/audit.json"
target = base / "row3-preparation7"
assert not target.exists(), "Do not repeat targeted crop preparation"
source_hash = hashlib.sha256(source.read_bytes()).hexdigest()
assert source_hash == "7c23e84f1def17e8d28ac87fe54f6849e9d2127829492417bb58b63143dd7247"
with Image.open(source) as image:
    ink = layout.ink_mask(image)
    masked = ink.copy()
    for figure in json.loads(audit.read_text())["figures"]:
        x, y, width, height = figure["box"]
        masked[y:y + height, x:x + width] = False
    columns = np.flatnonzero(ink.any(axis=0))
    bands = layout.line_bands(masked, int(columns[-1] - columns[0] + 1))
    assert len(bands) == 24, "Existing row locators differ; do not guess the target"
    top = max(0, bands[2][0] - 12)
    bottom = min(image.height, bands[3][1] + 13)
    box = (100, top, min(1300, image.width), bottom)
    crop = image.crop(box)
    target.mkdir()
    output = target / "target175-corollary1.png"
    crop.save(output, format="PNG")
    with Image.open(output) as saved:
        assert np.array_equal(np.asarray(saved), np.asarray(crop))
record = {
    "source": {"path": str(source), "sha256": source_hash},
    "target": {"path": str(output), "sha256": hashlib.sha256(output.read_bytes()).hexdigest()},
    "box_xywh": [box[0], box[1], box[2] - box[0], box[3] - box[1]],
    "locator_rows": [3, 4],
    "locator_only": True,
    "visual_source_fact_or_candidate_approval": False,
    "whole_source_visual_reopens": 0,
    "images_loaded_by_parent": 0,
    "native_finalizer_replays": 0,
    "resizing_redrawing_denoising_recoloring": False,
    "pixels_verified_equal": True,
}
manifest = target / "preparation.json"
manifest.write_text(json.dumps(record, ensure_ascii=False, indent=2) + "\n")
for file in target.iterdir():
    file.chmod(0o444)
print(json.dumps(record, ensure_ascii=False))
