import hashlib
import json
from pathlib import Path

from PIL import Image

work = Path(".intentfold/tickets/STEMROBIN-181/tmp")
folder = work / "d016-answer-display"
result = json.loads((work / "d016-answer-display-finalization.json").read_text())
assert result["status"] == "pass"
assert len(result["results"]) == 2
tiles = []
for surface in result["results"]:
    width = surface["viewport"]["width"]
    source = Path(surface["screenshot"])
    with Image.open(source) as image:
        left, right = (300, 1140) if width == 1440 else (0, width)
        for index, top in enumerate(range(0, image.height, 1800), 1):
            target = folder / f"answers-{width}-corrected-tile-{index}.png"
            assert not target.exists()
            bottom = min(top + 1800, image.height)
            image.crop((left, top, right, bottom)).save(target)
            tiles.append({
                "card": surface["id"],
                "surface": "answers",
                "viewport": width,
                "path": str(target),
                "sha256": hashlib.sha256(target.read_bytes()).hexdigest(),
                "source": str(source),
                "crop": [left, top, right, bottom],
            })
(work / "d016-answer-display-tiles.json").write_text(json.dumps({
    "role": "Unscaled original-pixel tiles of the two affected answer surfaces only.",
    "tiles": tiles,
}, indent=2) + "\n")
print(f"Created {len(tiles)} affected answer screenshot tiles.")
