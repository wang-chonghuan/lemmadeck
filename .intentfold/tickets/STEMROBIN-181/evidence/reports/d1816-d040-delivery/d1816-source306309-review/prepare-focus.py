from pathlib import Path
import hashlib
import json

from PIL import Image

ROOT = Path("/Users/yong/.codex/worktrees/stemrobin-181-resume/lemmadeck")
OUT = ROOT / ".intentfold/tickets/STEMROBIN-181/tmp/d1816-source306309-review"
TARGETS = [
    (307, "source0307-focus-text.png", (190, 465, 610, 785), "音道 emphasis endpoints and 楔形孔 glyph"),
    (307, "source0307-focus-fig245.png", (800, 557, 540, 648), "Complete small apparatus and labels"),
    (308, "source0308-focus-frequency.png", (245, 1528, 1100, 90), "Question4 frequency glyph"),
    (309, "source0309-focus-exercises.png", (235, 164, 1180, 610), "Printed exercise numbers, math glyphs, superscripts and uncertain last-line weight"),
]


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


ledger = []
for page, name, box, reason in TARGETS:
    source = ROOT / f".tmp/ld-s10y-lesson/10p/pages/{page:04d}/page.png"
    destination = OUT / name
    if destination.exists():
        raise FileExistsError(destination)
    x, y, w, h = box
    with Image.open(source) as image:
        crop = image.crop((x, y, x + w, y + h))
        crop.resize((w * 2, h * 2), Image.Resampling.NEAREST).save(destination)
    ledger.append({
        "physical_page": page,
        "source": {"path": str(source), "sha256": digest(source)},
        "path": str(destination),
        "sha256": digest(destination),
        "coarse_box_px": list(box),
        "coordinate_system": "Original source pixels, x,y,width,height, origin top-left",
        "transform": "2x nearest-neighbor enlargement; no enhancement, cleanup or inferred pixels",
        "width_px": w * 2,
        "height_px": h * 2,
        "reason": reason,
        "opened": False
    })

with (OUT / "crop-preparation-ledger.json").open("x") as stream:
    json.dump(ledger, stream, ensure_ascii=False, indent=2)
    stream.write("\n")
print(json.dumps(ledger, ensure_ascii=False, indent=2))
