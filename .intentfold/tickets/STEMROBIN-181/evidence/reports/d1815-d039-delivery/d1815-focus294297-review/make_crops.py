import hashlib
import json
from pathlib import Path

from PIL import Image


ROOT = Path("/Users/yong/.codex/worktrees/stemrobin-181-resume/lemmadeck")
OUT = Path(__file__).parent
SOURCES = {
    page: ROOT / f".tmp/ld-s10y-lesson/10p/pages/{page:04d}/page.png"
    for page in (294, 296, 297)
}
CROPS = (
    ("294-title-delimiters", 294, (300, 1725, 952, 1787)),
    ("296-propagation", 296, (715, 1605, 1320, 1679)),
    ("296-after-suoyi", 296, (175, 1965, 790, 2035)),
    ("297-metal-names", 297, (178, 1540, 1350, 1758)),
)


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


records = []
for page, path in SOURCES.items():
    with Image.open(path) as image:
        records.append({
            "kind": "original",
            "source_page": page,
            "path": str(path),
            "sha256": digest(path),
            "size_px": list(image.size),
            "mode": image.mode,
        })

for name, page, box in CROPS:
    path = OUT / f"{name}.png"
    if path.exists():
        raise FileExistsError(path)
    with Image.open(SOURCES[page]) as image:
        if not (0 <= box[0] < box[2] <= image.width
                and 0 <= box[1] < box[3] <= image.height):
            raise ValueError(box)
        image.crop(box).resize(
            ((box[2] - box[0]) * 2, (box[3] - box[1]) * 2),
            Image.Resampling.NEAREST,
        ).save(path)
    records.append({
        "kind": "focused_crop",
        "id": name,
        "source_page": page,
        "path": str(path),
        "sha256": digest(path),
        "source_sha256": digest(SOURCES[page]),
        "box_xyxy_px": list(box),
        "box_convention": "left/top inclusive; right/bottom exclusive",
        "transform": "crop then 2x nearest-neighbor; no enhancement/OCR",
        "size_px": [(box[2] - box[0]) * 2, (box[3] - box[1]) * 2],
    })

manifest = OUT / "pixel-manifest.json"
with manifest.open("x") as stream:
    json.dump({"images": records}, stream, indent=2)
    stream.write("\n")
print(json.dumps({"images": records}, indent=2))
