import hashlib
import json
from pathlib import Path
from PIL import Image

folder = Path(".intentfold/tickets/STEMROBIN-181/tmp/offline-d018-font-correction")
result_path = folder / "result-phy9-c2-s2-n64.json"
result = json.loads(result_path.read_text())
surface = next(item for item in result["results"] if item["surface"] == "text" and item["viewport"]["width"] == 390)
source = Path(surface["metrics"]["scrollEndScreenshot"])
assert hashlib.sha256(source.read_bytes()).hexdigest() == surface["metrics"]["scrollEndScreenshotSha256"]
manifest = json.loads((folder / "d018-n64-corrected-screenshot-tiles.json").read_text())
with Image.open(source) as image:
    for tile in manifest["tiles"]:
        if tile["viewport"] != 390 or tile["scrollPosition"] != "end":
            continue
        target = folder / (Path(tile["path"]).stem + "-font-ready.png")
        assert not target.exists()
        image.crop(tuple(tile["crop"])).save(target)
        tile.update(path=str(target), source=str(source), sha256=hashlib.sha256(target.read_bytes()).hexdigest())
manifest["result"] = {"path": str(result_path), "sha256": hashlib.sha256(result_path.read_bytes()).hexdigest()}
target = folder / "d018-n64-font-ready-screenshot-tiles.json"
assert not target.exists()
target.write_text(json.dumps(manifest, indent=2) + "\n")
print(target)
