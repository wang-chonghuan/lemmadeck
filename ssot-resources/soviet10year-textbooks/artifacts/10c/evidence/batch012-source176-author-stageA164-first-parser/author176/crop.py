import hashlib
import json
import pathlib
import sys

from PIL import Image


page = int(sys.argv[1])
box = tuple(map(int, sys.argv[2:6]))
reason = sys.argv[6]
repo = pathlib.Path.cwd()
source = repo / f".intentfold/tickets/STEMROBIN-184/tmp/production-source10c176-179/10c/pages/{page:04d}/page.png"
output = pathlib.Path(__file__).resolve().parent / f"crop-{page:04d}.png"
if output.exists():
    raise FileExistsError(output)
with Image.open(source) as image:
    cropped = image.crop(box)
    with output.open("xb") as stream:
        cropped.save(stream, format="PNG", dpi=(300, 300))
print(json.dumps({
    "path": str(output),
    "bytes": output.stat().st_size,
    "width": cropped.width,
    "height": cropped.height,
    "mode": cropped.mode,
    "dpi": 300,
    "sha256": hashlib.sha256(output.read_bytes()).hexdigest(),
    "input": str(source),
    "input_sha256": hashlib.sha256(source.read_bytes()).hexdigest(),
    "crop_ltrb": box,
    "reason": reason,
    "operation": "Single native ROI saved; no resize, enhancement, thumbnail, grid, or original display.",
}, ensure_ascii=False, indent=2))
