import hashlib
import json
import math
from pathlib import Path

from PIL import Image


workspace = Path("/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-180")
assert Path.cwd() == workspace
source = workspace / ".tmp/180-7-n12/native62/scan-000.png"
output = workspace / (
    "ssot-resources/soviet10year-textbooks/artifacts/8p/lessons/"
    "phy8-c1-s2-n12/source-review/native62-typography"
)
output.mkdir(exist_ok=True)


def binding(path):
    data = path.read_bytes()
    return {
        "path": str(path),
        "bytes": len(data),
        "sha256": hashlib.sha256(data).hexdigest(),
    }


image = Image.open(source)
assert image.size == (1472, 2240)
assert image.mode == "1"
regions = [
    ("t62-1-definition.png", [145, 1190, 1460, 1730]),
    ("t62-2-question.png", [145, 1030, 1460, 1405]),
    ("t62-3-terms.png", [145, 535, 1460, 1155]),
]
crops = []
for name, rendered in regions:
    native = [
        math.floor(rendered[0] * 1472 / 1695),
        math.floor(rendered[1] * 2240 / 2580),
        math.ceil(rendered[2] * 1472 / 1695),
        math.ceil(rendered[3] * 2240 / 2580),
    ]
    destination = output / name
    assert not destination.exists(), "Do not overwrite existing evidence"
    cropped = image.crop(native)
    cropped.save(destination)
    decoded = Image.open(destination)
    assert decoded.mode == "1"
    assert decoded.tobytes() == image.crop(native).tobytes()
    crops.append({
        "renderedBoxXYXY": rendered,
        "nativeBoxXYXY": native,
        "mode": cropped.mode,
        "size": list(cropped.size),
        "nativePixelsUnchanged": True,
        "file": binding(destination),
    })

record = {
    "workspace": str(workspace),
    "source": binding(source),
    "sourceMode": image.mode,
    "sourceSize": list(image.size),
    "sourcePremise": "Parent: PDF object123, CCITT stencil, 261ppi",
    "coordinateScale": {"x": "1472/1695", "y": "2240/2580"},
    "rounding": "floor left/top; ceil right/bottom",
    "resizing": False,
    "enhancement": False,
    "crops": crops,
    "priorReviewerImageViews": 8,
    "newPhaseMaximumViews": 3,
    "cumulativeMaximumAfterPhase": 11,
}
record_path = output / "crop-bindings.json"
assert not record_path.exists()
record_path.write_text(json.dumps(record, indent=2) + "\n")
print(json.dumps(record, indent=2))
