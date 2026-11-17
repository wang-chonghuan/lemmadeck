import hashlib
import json
from pathlib import Path

from PIL import Image

evidence = Path(__file__).resolve().parent
prepared = evidence.parent / "production-source10c168-171" / "10c" / "pages"
crops = [
    ("0169", "0169-prime.png", (200, 450, 650, 585), "Tiny prime after ln in property 2"),
    ("0170", "0170-case-g.png", (210, 1640, 1390, 1965), "Case-reference glyphs and exponent grouping"),
    ("0171", "0171-exp-subscripts.png", (560, 1550, 1140, 1645), "Whether right-hand exp also has subscript a"),
]
records = []
for page, name, box, reason in crops:
    source = prepared / page / "page.png"
    output = evidence / "crops" / name
    output.parent.mkdir(parents=True, exist_ok=True)
    if output.exists():
        raise FileExistsError(output)
    with Image.open(source) as image:
        image.crop(box).save(output)
    records.append({
        "source": str(source),
        "source_sha256": hashlib.sha256(source.read_bytes()).hexdigest(),
        "output": str(output),
        "sha256": hashlib.sha256(output.read_bytes()).hexdigest(),
        "bytes": output.stat().st_size,
        "box_xyxy": list(box),
        "width": box[2] - box[0],
        "height": box[3] - box[1],
        "resize": False,
        "reason": reason,
        "model_opened_by_this_command": False,
        "created_after_original_model_opens": 4,
    })
with (evidence / "crops" / "creation.json").open("x") as receipt:
    json.dump(records, receipt, indent=2)
    receipt.write("\n")
print(json.dumps(records, indent=2))
