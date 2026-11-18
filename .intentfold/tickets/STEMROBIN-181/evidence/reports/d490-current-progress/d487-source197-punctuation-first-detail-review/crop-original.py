import hashlib
import json
from pathlib import Path

from PIL import Image


TMP = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck/.intentfold/tickets/STEMROBIN-181/tmp")
inventory = TMP / "d481-source197-first-independent-text-review/sourceinventory.json"
ledger = TMP / "d484-source166-first-independent-figure-review/actual-opens.json"
zero_ledger = TMP / "d474-n71-q12-first-independent-choice-review/actual-opens.json"
source = TMP / "d465-source197-first-preparation/work/10p/pages/0197/page.png"
output = Path(__file__).parent / "source197-p03-punctuation-strip.png"
assert hashlib.sha256(inventory.read_bytes()).hexdigest() == "0cca0cc527c2394d66400292a7001d220a603e056ef57fd4e1203541227d7556"
assert hashlib.sha256(ledger.read_bytes()).hexdigest() == "84d46c08bc95380c71dcc33fc96020d15b9262ca8660619980a76460ab64903b"
assert hashlib.sha256(zero_ledger.read_bytes()).hexdigest() == "2d913bed253a960bd6a772985cf1bd7c3d069c4159fdd409967750d1abf1ef6e"
assert hashlib.sha256(source.read_bytes()).hexdigest() == "755cd7aff0af318cb4ca42c0b3dfff8b18152c176403d97ca513dedae7578559"
old = json.loads(ledger.read_text())["totals"]["cumulative"]
zero = json.loads(zero_ledger.read_text())["totals"]
assert zero["new"] == 0 and zero["cumulative"] == old and old + 1 <= 24
row = next(item for item in json.loads(inventory.read_text())["objects"] if item["id"] == "I197-P03")
assert row["y_range"] == [879, 994]
# Narrow first-row strip selected from the reviewer's prior page observation.
x, y, width, height = 650, 875, 230, 60
assert not output.exists()
with Image.open(source) as original:
    assert x >= 0 and y >= 0 and x + width <= original.width and y + height <= original.height
    detail = original.crop((x, y, x + width, y + height))
    detail.save(output)
    with Image.open(output) as saved:
        assert saved.size == (width, height)
        assert saved.mode == detail.mode and saved.tobytes() == detail.tobytes()
print(json.dumps({"old_images": old, "after_one_open": old + 1, "source_dimensions": list(original.size), "xywh": [x, y, width, height], "output_dimensions": [width, height], "resize": False, "pixel_identity_verified": True, "output": str(output), "sha256": hashlib.sha256(output.read_bytes()).hexdigest()}))
