import hashlib
import json
from pathlib import Path

from PIL import Image

folder = Path(".intentfold/tickets/STEMROBIN-181/tmp/offline-d017")
cards = ["phy9-c2-s1", "phy9-c2-s2-n59", "phy9-c2-s2-n61"]
result_path = folder / f"result-{'--'.join(sorted(cards))}.json"
result = json.loads(result_path.read_text())
assert result["status"] == "pass"
assert len(result["results"]) == 12
root = Path("ssot-resources/soviet10year-textbooks/artifacts/9p/editions/modern-us-neutral/lessons")
tiles = []
empty = []
for surface in result["results"]:
    card = surface["id"]
    name = surface["surface"]
    width = surface["viewport"]["width"]
    lesson = json.loads((root / card / "lesson.json").read_text())
    exercises = json.loads((root / card / "exercises.json").read_text())
    source_empty = (
        name == "text"
        and not any(block["kind"] == "fig" or block.get("text", "").strip() for block in lesson["prose"])
    ) or (name == "exercises" and exercises["count"] == 0)
    if source_empty:
        empty.append({"card": card, "surface": name, "viewport": width})
        continue
    source = Path(surface["screenshot"])
    assert hashlib.sha256(source.read_bytes()).hexdigest() == surface["screenshotSha256"]
    with Image.open(source) as image:
        left, right = (300, 1140) if width == 1440 else (0, width)
        for index, top in enumerate(range(0, image.height, 1800), 1):
            target = folder / f"{card}-{name}-{width}-tile-{index}.png"
            assert not target.exists()
            bottom = min(top + 1800, image.height)
            image.crop((left, top, right, bottom)).save(target)
            tiles.append({
                "card": card, "surface": name, "viewport": width,
                "path": str(target), "sha256": hashlib.sha256(target.read_bytes()).hexdigest(),
                "source": str(source), "crop": [left, top, right, bottom],
            })
output = folder / "d017-screenshot-tiles.json"
assert not output.exists()
output.write_text(json.dumps({
    "role": "Original-pixel crops of the complete12surface D017 subset; six desktop surfaces reused from the initial batch, no rescaling or passed-surface rerun.",
    "result": {"path": str(result_path), "sha256": hashlib.sha256(result_path.read_bytes()).hexdigest()},
    "tiles": tiles, "emptySourceDefinedSurfaces": empty,
}, indent=2) + "\n")
print("\n".join(tile["path"] for tile in tiles))
