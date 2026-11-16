import argparse
import hashlib
import json
from datetime import datetime, timezone
from pathlib import Path

from PIL import Image

parser = argparse.ArgumentParser()
parser.add_argument("page", choices=["0070", "0071"])
parser.add_argument("name")
parser.add_argument("box", nargs=4, type=int)
args = parser.parse_args()
root = Path("/Users/yong/.codex/worktrees/a07e/lemmadeck")
source = root / ".tmp/ld-s10y-lesson/6-8g/pages" / args.page / "page.png"
out = Path(__file__).resolve().parent / f"crop-{args.page}-{args.name}.png"
if out.exists():
    raise SystemExit("Refusing to overwrite crop")
x, y, width, height = args.box
with Image.open(source) as image:
    if min(x, y) < 0 or min(width, height) <= 0 or x + width > image.width or y + height > image.height:
        raise SystemExit("Crop outside source")
    image.crop((x, y, x + width, y + height)).save(out)
facts = {
    "source": str(source),
    "source_sha256": hashlib.sha256(source.read_bytes()).hexdigest(),
    "output": str(out),
    "sha256": hashlib.sha256(out.read_bytes()).hexdigest(),
    "box_xywh": args.box,
    "size": [width, height],
    "created_at": datetime.now(timezone.utc).isoformat(),
    "operation": "PIL crop from original page.png; no rescale, enhancement, OCR or correction",
}
with out.with_suffix(".json").open("x", encoding="utf-8") as file:
    json.dump(facts, file, indent=2)
    file.write("\n")
print(json.dumps(facts, indent=2))
