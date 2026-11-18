import hashlib
import json
from pathlib import Path

from PIL import Image


TMP = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck/.intentfold/tickets/STEMROBIN-181/tmp")
inventory = TMP / "d462-source196-first-independent-text-review/sourceinventory.json"
source = TMP / "d451-source196-first-preparation/work/10p/pages/0196/page.png"
output = Path(__file__).parent / "source163-original-detail.png"
assert hashlib.sha256(inventory.read_bytes()).hexdigest() == "305dc4bf655c049a2ffeb9aa0c6a845aad33a5a1c9352cc98e178c410a13091c"
assert hashlib.sha256(source.read_bytes()).hexdigest() == "bbff853722e7e5c3d119451b35718e00503d1efc849c8a2b6ea88140d27bf7f3"
objects = json.loads(inventory.read_text())["objects"]
x, y, width, height = next(item for item in objects if item["id"] == "I196-F163")["approx_original_xywh"]
assert not output.exists()
with Image.open(source) as original:
    assert x >= 0 and y >= 0 and x + width <= original.width and y + height <= original.height
    detail = original.crop((x, y, x + width, y + height))
    detail.save(output)
    with Image.open(output) as saved:
        assert saved.size == (width, height)
        assert saved.mode == detail.mode and saved.tobytes() == detail.tobytes()
print(json.dumps({"source_dimensions": list(original.size), "xywh": [x, y, width, height], "output_dimensions": [width, height], "resize": False, "pixel_identity_verified": True, "output": str(output), "sha256": hashlib.sha256(output.read_bytes()).hexdigest()}))
