"""Apply the native border-only removal, then crop transparent margins."""

import hashlib
import importlib.util
import json
from pathlib import Path

from PIL import Image

own = Path(__file__).resolve().parent
repo = own.parents[2]
out = own / "fig-229" / "artwork"
native = repo / ".agents/skills/ld-s10y-image/scripts/remove_background.py"
module_spec = importlib.util.spec_from_file_location("native_remove_background", native)
module = importlib.util.module_from_spec(module_spec)
module_spec.loader.exec_module(module)
source = out / "burner-opaque.png"
transparent = out / "burner-transparent-full.png"
cropped = out / "burner.png"
assert not transparent.exists() and not cropped.exists()
removed = module.remove_background(source, transparent)
image = Image.open(transparent).convert("RGBA")
alpha = image.getchannel("A")
bounds = alpha.getbbox()
assert bounds and bounds[0] > 0 and bounds[1] > 0
assert bounds[2] < image.width and bounds[3] < image.height
padding = 8
crop = (
    max(0, bounds[0] - padding), max(0, bounds[1] - padding),
    min(image.width, bounds[2] + padding), min(image.height, bounds[3] + padding),
)
image.crop(crop).save(cropped)


def bind(file):
    return {"path": str(file), "sha256": hashlib.sha256(file.read_bytes()).hexdigest(),
            "bytes": file.stat().st_size}


with Image.open(source) as original:
    original = original.convert("RGBA")
    retained = 0
    for before, after in zip(original.getdata(), image.getdata()):
        if after[3] > 0:
            assert before[:3] == after[:3]
            retained += 1
report = {
    "status": "pass", "scope": "Mechanical derivation, not visual acceptance",
    "nativeHelper": bind(native), "opaque": bind(source), "transparentFull": bind(transparent),
    "derived": bind(cropped), "removedBorderConnectedBackgroundPixels": removed,
    "nonTransparentPixelsRetainedWithoutRGBChange": retained, "alphaBounds": bounds,
    "cropBounds": crop, "paddingPx": padding,
    "dimensions": {"width": crop[2] - crop[0], "height": crop[3] - crop[1]},
    "repairCount": 0, "method": "Native border-connected background removal and alpha-bounding-box crop only; no redraw or distortion.",
    "modelContextImageOpens": 0,
}
(out / "derivation.json").write_text(json.dumps(report, indent=2) + "\n")
print(json.dumps(report, indent=2))
