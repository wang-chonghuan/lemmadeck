"""Extract source-only row details; nearest-neighbor enlargement invents no ink."""

import hashlib
import json
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[4]
SOURCE = ROOT / "ssot-resources/soviet10year-textbooks/artifacts/9p/figures/fig-110.png"
OUT = Path(__file__).resolve().parent / "d018-n65-fig110-atom-details"
EXPECTED = "ebe0f4bd89854b8159ce4d21f52fbf1870537736d98ce72295a471fb8cc7b8e7"
BANDS = [(130, 154), (151, 179), (176, 205), (201, 232),
         (229, 257), (251, 280), (276, 306), (300, 330)]


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def binding(path):
    return {"path": path.relative_to(ROOT).as_posix(), "sha256": sha(path)}


assert sha(SOURCE) == EXPECTED
assert not OUT.exists(), "Preserve any pre-existing detail evidence"
OUT.mkdir()
image = Image.open(SOURCE)
rows = []
for number, (top, bottom) in enumerate(BANDS, 1):
    box = (148, top, 350, bottom)
    detail = image.crop(box)
    raw = OUT / f"row-{number:02d}.png"
    enlarged = OUT / f"row-{number:02d}-nearest6x.png"
    detail.save(raw)
    detail.resize((detail.width * 6, detail.height * 6), Image.Resampling.NEAREST).save(enlarged)
    rows.append({
        "row": number, "sourceBoxXYXY": list(box),
        "raw": binding(raw), "nearest6x": binding(enlarged),
        "method": "Exact pixel crop plus nearest-neighbor6x; adjacent bands overlap for source-boundary context.",
    })
manifest = {"source": binding(SOURCE), "helper": binding(Path(__file__).resolve()), "rows": rows}
path = OUT / "crop-manifest.json"
path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n")
print(json.dumps(binding(path)))
