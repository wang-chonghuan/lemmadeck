from pathlib import Path

from PIL import Image


ROOT = Path("/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-182")
BASE = ROOT / ".tmp/ld-s10y-lesson/resume182-7-C5Ex"
OUT = BASE / "source-review-229-231-FIRST"
REQUESTS = (
    ("0229", (460, 2590, 1760, 2790), "0229-ex720.native.record0444.png"),
    ("0230", (575, 750, 1995, 1005), "0230-ex723.native.record0444.png"),
    ("0231", (1175, 1680, 2035, 2990), "0231-fig83.native.record0444.png"),
)

for page, box, name in REQUESTS:
    target = OUT / name
    if target.exists():
        raise FileExistsError(target)
    with Image.open(BASE / "prepared-FIRST/8a/pages" / page / "page.png") as image:
        image.crop(box).save(target)
    print(f"{page}: {box} -> {target}")
