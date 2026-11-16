import hashlib
import json
import sys
from pathlib import Path

from PIL import Image

result_path = Path(sys.argv[1])
label = sys.argv[2]
result = json.loads(result_path.read_text())
assert result["status"] in ("incomplete", "pass")
folder = result_path.parent
root = Path("ssot-resources/soviet10year-textbooks/artifacts/9p/editions/modern-us-neutral/lessons")
tiles = []
empty = []
for surface in result["results"]:
    card, name = surface["id"], surface["surface"]
    width = surface["viewport"]["width"]
    lesson = json.loads((root / card / "lesson.json").read_text())
    exercises = json.loads((root / card / "exercises.json").read_text())
    if name == "exercises" and exercises["count"] == 0:
        empty.append({"card": card, "surface": name, "viewport": width})
        continue
    images = [(Path(surface["screenshot"]), surface["screenshotSha256"], "start")]
    metrics = surface["metrics"]
    if metrics.get("scrollEndScreenshot"):
        images.append((Path(metrics["scrollEndScreenshot"]), metrics["scrollEndScreenshotSha256"], "end"))
    for source, expected, position in images:
        assert hashlib.sha256(source.read_bytes()).hexdigest() == expected
        with Image.open(source) as image:
            left, right = (300, 1140) if width == 1440 else (0, width)
            for index, top in enumerate(range(0, image.height, 1800), 1):
                target = folder / f"{card}-{name}-{width}-{position}-tile-{index}.png"
                assert not target.exists()
                bottom = min(top + 1800, image.height)
                image.crop((left, top, right, bottom)).save(target)
                tiles.append({
                    "card": card, "surface": name, "viewport": width, "scrollPosition": position,
                    "path": str(target), "sha256": hashlib.sha256(target.read_bytes()).hexdigest(),
                    "source": str(source), "crop": [left, top, right, bottom],
                })
output = folder / f"d018-{label}-screenshot-tiles.json"
assert not output.exists()
output.write_text(json.dumps({
    "role": "Exact original-pixel crops, no rescaling or browser rerun.",
    "result": {"path": str(result_path), "sha256": hashlib.sha256(result_path.read_bytes()).hexdigest()},
    "tiles": tiles, "emptySourceDefinedSurfaces": empty,
}, indent=2) + "\n")
print(str(output))
print(f"{len(tiles)} tiles; {len(empty)} source-defined empty surfaces")
