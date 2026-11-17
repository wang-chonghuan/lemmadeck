"""Create the four targeted crops reserved after full-page inspections."""

from pathlib import Path

from PIL import Image


WORK = Path(__file__).resolve().parent
CROPS = (
    ("0095", "p0095-ex324-sign.png", (200, 1740, 970, 1840)),
    ("0096", "p0096-domain-variables.png", (110, 1060, 1410, 1620)),
    ("0097", "p0097-ex-number-after327.png", (220, 1000, 890, 1120)),
    ("0097", "p0097-ex330-denominator-sign.png", (220, 1270, 790, 1390)),
)

output = WORK / "crops"
output.mkdir(exist_ok=True)
for page, name, box in CROPS:
    with Image.open(WORK / "10c" / "pages" / page / "page.png") as image:
        image.crop(box).save(output / name)
    print(f"{name}: source p{page}, xyxy={box}")
