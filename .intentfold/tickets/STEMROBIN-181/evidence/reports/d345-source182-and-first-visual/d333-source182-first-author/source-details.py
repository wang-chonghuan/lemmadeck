import hashlib
import json
from pathlib import Path

from PIL import Image

BASE = Path(__file__).resolve().parent
SOURCE = BASE / "work/10p/pages/0182/page.png"
DETAILS = BASE / "details"
DETAILS.mkdir(exist_ok=True)
rows = []
with Image.open(SOURCE) as source:
    for name, box in [
        ("source182-raw139.png", (495, 245, 1075, 540)),
        ("source182-raw140.png", (935, 1315, 1330, 1595)),
        ("source182-lower-text.png", (165, 1515, 1350, 2085)),
    ]:
        output = DETAILS / name
        if output.exists():
            raise FileExistsError(output)
        source.crop(box).save(output)
        rows.append({
            "source": str(SOURCE),
            "sourceSha256": hashlib.sha256(SOURCE.read_bytes()).hexdigest(),
            "boxXYXY": list(box),
            "output": str(output),
            "outputSha256": hashlib.sha256(output.read_bytes()).hexdigest(),
            "transform": "Unscaled rectangular pixel crop; no OCR, inference, or edits",
        })
receipt = DETAILS / "source-details.receipt.json"
with receipt.open("x", encoding="utf-8") as handle:
    json.dump(rows, handle, ensure_ascii=False, indent=2)
    handle.write("\n")
