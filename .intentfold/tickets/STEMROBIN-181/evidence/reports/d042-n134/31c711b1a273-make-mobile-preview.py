import hashlib
import json
from pathlib import Path

from PIL import Image


owned = Path(__file__).resolve().parent
native = owned / "preview/fig-303.native.png"
mobile = owned / "preview/fig-303.mobile-316.png"
assert not mobile.exists(), "Do not overwrite a previous preview."

with Image.open(native) as image:
    assert image.size == (640, 1160)
    rgb = image.convert("RGB")
    rgb.resize((316, round(1160 * 316 / 640)), Image.Resampling.LANCZOS).save(mobile)
    checks = []
    for name, box in [
        ("top-panel", (42, 78, 608, 558)),
        ("bottom-panel", (42, 638, 608, 1118)),
    ]:
        pixels = list(rgb.crop(box).getdata())
        dark = sum(max(pixel) < 180 for pixel in pixels)
        ratio = dark / len(pixels)
        assert 0.001 < ratio < 0.25, f"Blank/black panel: {name}"
        checks.append({"panel": name, "darkPixels": dark, "darkRatio": ratio})

payload = {
    "schema": "ld-s10y-image/author-pixel-check@1",
    "status": "pass",
    "source": {
        "path": str(native),
        "sha256": hashlib.sha256(native.read_bytes()).hexdigest(),
    },
    "mobile": {
        "path": str(mobile),
        "sha256": hashlib.sha256(mobile.read_bytes()).hexdigest(),
        "width": 316,
        "height": round(1160 * 316 / 640),
    },
    "panels": checks,
    "scope": "Nonblank native renderer pixels and derived raster preview only; SVG label sizes are checked by native screen-CTM metadata, not this raster resize.",
    "independentApproval": False,
}
output = owned / "preview/pixel-check.json"
with output.open("x") as handle:
    json.dump(payload, handle, indent=2)
    handle.write("\n")
print(json.dumps(payload, indent=2))
