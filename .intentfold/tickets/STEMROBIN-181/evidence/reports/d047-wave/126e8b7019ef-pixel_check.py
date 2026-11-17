import hashlib
import json
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parent
outputs = []
for relative in [
    "attempts/initial/fig-70.native.png",
    "preview/initial/media-640.png",
    "preview/initial/mobile-390-left.png",
    "preview/initial/mobile-390-end.png",
]:
    path = root / relative
    image = Image.open(path).convert("RGB")
    ink = sum(min(pixel) < 180 for pixel in image.getdata())
    white = sum(min(pixel) > 245 for pixel in image.getdata())
    total = image.width * image.height
    assert 0.005 < ink / total < 0.2
    assert white / total > 0.8
    outputs.append({
        "path": str(path),
        "sha256": hashlib.sha256(path.read_bytes()).hexdigest(),
        "size": list(image.size),
        "inkPixels": ink,
        "inkRatio": ink / total,
        "whiteRatio": white / total,
        "nonblank": True,
        "notBlackRaster": True,
    })
target = root / "checks/initial-pixels.json"
assert not target.exists()
target.write_text(json.dumps({"status": "pass", "outputs": outputs}, indent=2) + "\n")
print(json.dumps({"status": "pass", "outputs": len(outputs)}))
