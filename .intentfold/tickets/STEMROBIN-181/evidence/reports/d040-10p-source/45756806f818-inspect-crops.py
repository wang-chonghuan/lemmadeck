from pathlib import Path

from PIL import Image

folder = Path(__file__).resolve().parent
for page, box, name in [
    (100, (170, 1230, 1375, 1315), "0100-corona-text-crop.png"),
    (103, (200, 880, 1390, 1000), "0103-ex7-name-crop.png"),
]:
    destination = folder / name
    if destination.exists():
        raise SystemExit(f"Refusing to overwrite {destination}")
    source = Path(f".tmp/ld-s10y-lesson/10p/pages/{page:04d}/page.png")
    with Image.open(source) as image:
        image.crop(box).save(destination)
    print(destination)
