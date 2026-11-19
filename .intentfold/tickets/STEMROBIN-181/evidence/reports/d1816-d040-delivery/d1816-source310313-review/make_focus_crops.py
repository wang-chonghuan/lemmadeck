from pathlib import Path
import hashlib
import json
from PIL import Image


ROOT = Path("/Users/yong/.codex/worktrees/stemrobin-181-resume/lemmadeck")
OUT = ROOT / ".intentfold/tickets/STEMROBIN-181/tmp/d1816-source310313-review"
REQUESTS = [
    ("focus0312-fig247.png", 312, (748, 216, 514, 430)),
    ("focus0312-constant.png", 312, (130, 1725, 1200, 284)),
    ("focus0313-equation.png", 313, (630, 470, 770, 130)),
    ("focus0313-emphasis.png", 313, (200, 1475, 1190, 420)),
]


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


ledger_path = OUT / "focus-crops.generated.json"
if ledger_path.exists() or any((OUT / name).exists() for name, _, _ in REQUESTS):
    raise SystemExit("Refusing to overwrite existing focus evidence.")

ledger = []
for name, page, (x, y, width, height) in REQUESTS:
    source = ROOT / f".tmp/ld-s10y-lesson/10p/pages/{page:04d}/page.png"
    target = OUT / name
    with Image.open(source) as image:
        if image.size != (1536, 2337):
            raise SystemExit(f"Unexpected source dimensions: {source}")
        image.crop((x, y, x + width, y + height)).save(target)
    target.chmod(0o444)
    ledger.append({
        "physical_page": page,
        "source_path": str(source),
        "source_sha256": digest(source),
        "crop_path": str(target),
        "crop_sha256": digest(target),
        "box_px": [x, y, width, height],
        "width_px": width,
        "height_px": height,
        "resized": False,
        "image_open_in_context": False
    })

with ledger_path.open("x", encoding="utf-8") as output:
    json.dump({"schema": "independent-source-focus-crops@1", "crops": ledger}, output, indent=2)
    output.write("\n")
ledger_path.chmod(0o444)
print(json.dumps(ledger, indent=2))
