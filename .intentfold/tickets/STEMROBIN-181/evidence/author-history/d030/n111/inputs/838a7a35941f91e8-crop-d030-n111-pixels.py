import hashlib
import json
from pathlib import Path

from PIL import Image

work = Path(".intentfold/tickets/STEMROBIN-181/tmp")
folder = work / "d030-n111-offline-pixels"
card = "phy9-c2-s4-n111"
result_path = work / "offline-d024" / f"result-{card}.json"
result = json.loads(result_path.read_text())
assert result["status"] == "pass"
assert len(result["results"]) == 4
output = work / "d030-n111-offline-tiles.json"
assert not output.exists()
folder.mkdir(exist_ok=True)
tiles, empty, exact_reuse, seen = [], [], [], {}
for surface in result["results"]:
    assert surface["id"] == card
    width = surface["viewport"]["width"]
    if surface["surface"] == "exercises":
        assert not surface["metrics"]["media"]
        empty.append({"card": card, "surface": "exercises", "viewport": width,
                      "screenshot": surface["screenshot"],
                      "sha256": surface["screenshotSha256"]})
        continue
    assert surface["surface"] == "text"
    screenshots = [("start", surface["screenshot"], surface["screenshotSha256"])]
    if surface["metrics"].get("scrollEndScreenshot"):
        screenshots.append(("end", surface["metrics"]["scrollEndScreenshot"],
                            surface["metrics"]["scrollEndScreenshotSha256"]))
    for position, filename, expected in screenshots:
        source = Path(filename)
        assert hashlib.sha256(source.read_bytes()).hexdigest() == expected
        with Image.open(source) as image:
            left, right = (300, 1140) if width == 1440 else (0, width)
            for index, top in enumerate(range(0, image.height, 2000), 1):
                bottom = min(top + 2000, image.height)
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
                target = folder / f"{card}-text-{width}-{position}-tile-{index}.png"
                assert not target.exists()
                pixels.save(target)
                binding = {"path": str(target),
                           "sha256": hashlib.sha256(target.read_bytes()).hexdigest()}
                tiles.append({
                    "card": card, "surface": "text", "viewport": width,
                    "scrollPosition": position, **binding,
                    "source": str(source), "sourceSha256": expected, "crop": crop,
                })
                seen[key] = binding
output.write_text(json.dumps({
    "role": "Unscaled original pixels of the new111-only display subset, reusable in the eventual3-5card batch; no delivery claim.",
    "result": {"path": str(result_path),
               "sha256": hashlib.sha256(result_path.read_bytes()).hexdigest()},
    "tiles": tiles, "emptySourceDefinedSurfaces": empty, "exactPixelReuse": exact_reuse,
    "browserReruns": 0,
}, indent=2) + "\n")
print(f"{len(tiles)} unique tiles; {len(empty)} source-defined empty surfaces; "
      f"{len(exact_reuse)} exact pixel reuses")
