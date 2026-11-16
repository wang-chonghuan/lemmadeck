import hashlib
import json
from pathlib import Path
import sys

from PIL import Image

work = Path(".intentfold/tickets/STEMROBIN-181/tmp")
folder = work / "offline-d023"
cards = sys.argv[1:]
assert 3 <= len(cards) <= 5 and len(set(cards)) == len(cards)
result_path = folder / f"result-{'--'.join(sorted(cards))}.json"
result = json.loads(result_path.read_text())
assert result["status"] == "pass"
assert len(result["results"]) == len(cards) * 4
root = Path("ssot-resources/soviet10year-textbooks/artifacts/9p/editions/modern-us-neutral/lessons")
tiles, empty, exact_reuse = [], [], []
seen = {}
for surface in result["results"]:
    card, name = surface["id"], surface["surface"]
    width = surface["viewport"]["width"]
    assert card in cards and name in ["text", "exercises"]
    exercises = json.loads((root / card / "exercises.json").read_text())
    if name == "exercises" and exercises["count"] == 0:
        empty.append({"card": card, "surface": name, "viewport": width})
        continue
    screenshots = [("start", surface["screenshot"], surface["screenshotSha256"])]
    if surface["metrics"].get("scrollEndScreenshot"):
        screenshots.append(("end", surface["metrics"]["scrollEndScreenshot"],
                            surface["metrics"]["scrollEndScreenshotSha256"]))
    for position, filename, expected in screenshots:
        source = Path(filename)
        assert hashlib.sha256(source.read_bytes()).hexdigest() == expected
        with Image.open(source) as image:
            left, right = (300, 1140) if width == 1440 else (0, width)
            for index, top in enumerate(range(0, image.height, 1800), 1):
                bottom = min(top + 1800, image.height)
                crop = [left, top, right, bottom]
                pixels = image.crop(tuple(crop))
                pixel_key = (card, name, width, tuple(crop),
                             hashlib.sha256(pixels.tobytes()).hexdigest())
                if pixel_key in seen:
                    exact_reuse.append({
                        "source": str(source), "sourceSha256": expected,
                        "scrollPosition": position, "crop": crop,
                        "samePixelsAs": seen[pixel_key], "newPixelInspectionRequired": False,
                    })
                    continue
                target = folder / f"{card}-{name}-{width}-{position}-tile-{index}.png"
                assert not target.exists()
                pixels.save(target)
                binding = {"path": str(target), "sha256": hashlib.sha256(target.read_bytes()).hexdigest()}
                tiles.append({
                    "card": card, "surface": name, "viewport": width, "scrollPosition": position,
                    **binding, "source": str(source), "sourceSha256": expected, "crop": crop,
                })
                seen[pixel_key] = binding
output = work / "d023-offline-tiles.json"
assert not output.exists()
output.write_text(json.dumps({
    "role": "Unscaled original-pixel crops of one D023 selected-card desktop/mobile run.",
    "result": {"path": str(result_path), "sha256": hashlib.sha256(result_path.read_bytes()).hexdigest()},
    "tiles": tiles, "emptySourceDefinedSurfaces": empty,
    "exactPixelReuse": exact_reuse,
}, indent=2) + "\n")
print(f"{len(tiles)} unique tiles; {len(empty)} empty surfaces; {len(exact_reuse)} exact pixel reuses")
