from hashlib import sha256
from pathlib import Path

from PIL import Image


OWNED = Path(__file__).resolve().parent
SOURCE = OWNED.parent / "d570-source204-first-author/work/10p/pages/0204/page.png"
CROPS = (
    ("source204-heading-prose-native.png", (130, 280, 1335, 600)),
    ("source204-ratios-native.png", (130, 600, 1335, 1300)),
    ("source204-algebra-tail-native.png", (130, 1310, 1335, 2110)),
)

with Image.open(SOURCE) as source:
    print(f"source_size={source.size}; mode={source.mode}; resizing=none")
    for name, box in CROPS:
        target = OWNED / name
        if target.exists():
            raise FileExistsError(target)
        cropped = source.crop(box)
        cropped.save(target)
        with Image.open(target) as saved:
            assert saved.mode == source.mode
            assert saved.size == (box[2] - box[0], box[3] - box[1])
            assert saved.tobytes() == source.crop(box).tobytes()
        print(
            f"{name}; xyxy={box}; size={cropped.size}; "
            f"pixel_identical=true; sha256={sha256(target.read_bytes()).hexdigest()}"
        )
