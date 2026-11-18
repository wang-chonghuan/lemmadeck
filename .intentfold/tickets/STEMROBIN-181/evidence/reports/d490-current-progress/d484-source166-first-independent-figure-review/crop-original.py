import hashlib
import json
from pathlib import Path

from PIL import Image


TMP = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck/.intentfold/tickets/STEMROBIN-181/tmp")
inventory = TMP / "d481-source197-first-independent-text-review/sourceinventory.json"
source = TMP / "d465-source197-first-preparation/work/10p/pages/0197/page.png"
output = Path(__file__).parent / "source166-original-detail.png"
assert hashlib.sha256(inventory.read_bytes()).hexdigest() == "0cca0cc527c2394d66400292a7001d220a603e056ef57fd4e1203541227d7556"
assert hashlib.sha256(source.read_bytes()).hexdigest() == "755cd7aff0af318cb4ca42c0b3dfff8b18152c176403d97ca513dedae7578559"
x, y, width, height = next(item for item in json.loads(inventory.read_text())["objects"] if item["id"] == "I197-F166")["approx_original_xywh"]
assert not output.exists()
with Image.open(source) as original:
    assert x >= 0 and y >= 0 and x + width <= original.width and y + height <= original.height
    detail = original.crop((x, y, x + width, y + height))
    detail.save(output)
    with Image.open(output) as saved:
        assert saved.size == (width, height)
        assert saved.mode == detail.mode and saved.tobytes() == detail.tobytes()
print(json.dumps({"source_dimensions": list(original.size), "xywh": [x, y, width, height], "output_dimensions": [width, height], "resize": False, "pixel_identity_verified": True, "output": str(output), "sha256": hashlib.sha256(output.read_bytes()).hexdigest()}))
