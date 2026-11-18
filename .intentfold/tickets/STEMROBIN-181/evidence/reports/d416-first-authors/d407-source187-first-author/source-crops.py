from pathlib import Path
import json

from PIL import Image

root = Path(__file__).resolve().parent
source = root / "work/10p/pages/0187/page.png"
crops = [
    ("exercise-2-reading.png", (180, 678, 1370, 915)),
    ("exercise-3-reading.png", (180, 914, 1370, 1217)),
]
output = root / "reading-crops"
output.mkdir(exist_ok=False)
with Image.open(source) as image:
    for name, box in crops:
        image.crop(box).save(output / name)
print(json.dumps({"source": str(source), "crops": crops, "image_opens": 0}))
