import hashlib
import json
from pathlib import Path

from PIL import Image

folder = Path(".intentfold/tickets/STEMROBIN-181/tmp/offline-batch2")
cards = [
    "phy9-c1-s6-n54",
    "phy9-c1-s6-t8",
    "phy9-c1-s7-n56",
    "phy9-c1-s7-n57",
]
result = json.loads((folder / f"result-{'--'.join(sorted(cards))}.json").read_text())
assert result["status"] == "pass"
assert len(result["results"]) == 20
tiles = []
empty = []
for surface in result["results"]:
    card = surface["id"]
    name = surface["surface"]
    width = surface["viewport"]["width"]
    if (card.endswith("t8") and name == "text") or (
        not card.endswith("t8") and name == "exercises"
    ):
        empty.append({"card": card, "surface": name, "viewport": width})
        continue
    source = Path(surface["screenshot"])
    with Image.open(source) as image:
        left, right = (300, 1140) if width == 1440 else (0, width)
        for index, top in enumerate(range(0, image.height, 1800), 1):
            target = folder / f"{card}-{name}-{width}-tile-{index}.png"
            bottom = min(top + 1800, image.height)
            image.crop((left, top, right, bottom)).save(target)
            tiles.append({
                "card": card,
                "surface": name,
                "viewport": width,
                "path": str(target),
                "sha256": hashlib.sha256(target.read_bytes()).hexdigest(),
                "source": str(source),
                "crop": [left, top, right, bottom],
            })
(folder / "d016-screenshot-tiles.json").write_text(json.dumps({
    "role": "Actual original-pixel crops of the unique20surface batch run; no browser rerun or rescaling.",
    "tiles": tiles,
    "emptySourceDefinedSurfaces": empty,
}, indent=2) + "\n")
print("\n".join(tile["path"] for tile in tiles))
