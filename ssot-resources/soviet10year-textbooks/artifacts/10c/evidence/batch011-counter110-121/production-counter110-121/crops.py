import json
from pathlib import Path

from PIL import Image

from diagnose import OUT, inputs, load_layout, TOOLS

layout = load_layout(TOOLS / "layout.py")
regions = [
    (110, "lower-margin", (90, 2455, 600, 55)),
    (114, "lower-margin", (0, 2450, 1640, 100)),
    (117, "integral-body", (300, 1380, 1230, 125)),
    (117, "separator", (200, 1970, 600, 35)),
    (118, "evaluation-bands", (140, 990, 1300, 285)),
    (121, "integral-body", (300, 725, 740, 130)),
    (121, "labelled-integral", (390, 2100, 1110, 135)),
]
ledger = []
for page, name, (x, y, w, h) in regions:
    source, _, _ = inputs(page)
    target = OUT / f"{page}-{name}-native.png"
    if target.exists():
        raise RuntimeError(f"Refuse to recreate crop {target}")
    with Image.open(source) as img:
        img.crop((x, y, x+w, y+h)).save(target)
    ledger.append({
        "source": str(source), "source_sha256": layout.sha256_file(source),
        "path": str(target), "xywh": [x, y, w, h], "size": [w, h],
        "sha256": layout.sha256_file(target), "transformation": "native rectangular subset only",
    })
print(json.dumps(ledger, indent=2))
(OUT / "crop-ledger.json").write_text(json.dumps(ledger, indent=2) + "\n")
