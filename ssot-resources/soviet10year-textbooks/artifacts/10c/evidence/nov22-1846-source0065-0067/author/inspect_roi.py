import hashlib
import json
from pathlib import Path

from PIL import Image


root = Path("/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck")
source = root / ".tmp/stemrobin-184-six/source10c5255-work/10c/pages/0066/page.png"
output = root / ".tmp/stemrobin-184-six/source10c6567-author/p0066-inequalities-roi.png"
box = (120, 1480, 1440, 1660)
with Image.open(source) as image:
    image.load()
    roi = image.crop(box)
    roi.save(output)
print(json.dumps({
    "purpose": "Distinguish source inequality glyphs in exercises 190 and 191.",
    "source": str(source),
    "box_xyxy": box,
    "output": str(output),
    "sha256": hashlib.sha256(output.read_bytes()).hexdigest(),
    "native_explicit_calls": {"Image.open": 1, "Image.load": 1, "Image.crop": 1, "Image.save": 1},
    "internal_codec_calls": "UNKNOWN; not instrumented by this ROI helper",
    "model_image_loads_at_creation": 0
}, ensure_ascii=False))
