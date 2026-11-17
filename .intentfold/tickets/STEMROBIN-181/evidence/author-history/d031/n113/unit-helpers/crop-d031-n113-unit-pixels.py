import hashlib
import json
from pathlib import Path

from PIL import Image

work = Path(".intentfold/tickets/STEMROBIN-181/tmp")
result_path = work / "d031-n113-unit-repair/result.json"
manifest_path = work / "d031-n113-unit-tiles.json"
assert not manifest_path.exists()
result = json.loads(result_path.read_text())
assert result["status"] == "pass-unit-browser-pixels-pending"
assert len(result["results"]) == 2
folder = work / "d031-n113-unit-repair/pixels"
folder.mkdir(exist_ok=True)
tiles, exact_reuse, seen = [], [], {}
for surface in result["results"]:
    width = surface["viewport"]["width"]
    screenshots = [
        ("start", surface["screenshot"], surface["screenshotSha256"]),
        ("end", surface["metrics"]["scrollEndScreenshot"],
         surface["metrics"]["scrollEndScreenshotSha256"]),
    ]
    for position, filename, expected in screenshots:
        source = Path(filename)
        assert hashlib.sha256(source.read_bytes()).hexdigest() == expected
        with Image.open(source) as image:
            left, right = (300, 1140) if width == 1440 else (0, width)
            for index, top in enumerate(range(0, image.height, 1800), 1):
                bottom = min(top + 1800, image.height)
                crop = [left, top, right, bottom]
                pixels = image.crop(tuple(crop))
                key = (width, tuple(crop), hashlib.sha256(pixels.tobytes()).hexdigest())
                if key in seen:
                    exact_reuse.append({
                        "source": str(source), "sourceSha256": expected,
                        "scrollPosition": position, "crop": crop,
                        "samePixelsAs": seen[key], "newPixelInspectionRequired": False,
                    })
                    continue
                target = folder / f"exercises-{width}-{position}-tile-{index}.png"
                assert not target.exists()
                pixels.save(target)
                binding = {
                    "path": str(target),
                    "sha256": hashlib.sha256(target.read_bytes()).hexdigest(),
                }
                tiles.append({
                    "index": len(tiles), "card": "phy9-c2-s4-n113",
                    "surface": "exercises", "viewport": width,
                    "scrollPosition": position, **binding,
                    "source": str(source), "sourceSha256": expected, "crop": crop,
                })
                seen[key] = binding
assert len(tiles) <= 8
manifest_path.write_text(json.dumps({
    "role": "Affected exercise surfaces only; unscaled tiles, no pixel approval claim.",
    "card": "phy9-c2-s4-n113",
    "result": {
        "path": str(result_path),
        "sha256": hashlib.sha256(result_path.read_bytes()).hexdigest(),
    },
    "tiles": tiles, "exactPixelReuse": exact_reuse,
    "emptySourceDefinedSurfaces": [], "browserReruns": 0,
}, indent=2) + "\n")
print(f"{len(tiles)} unique affected tiles; {len(exact_reuse)} exact pixel reuses")
