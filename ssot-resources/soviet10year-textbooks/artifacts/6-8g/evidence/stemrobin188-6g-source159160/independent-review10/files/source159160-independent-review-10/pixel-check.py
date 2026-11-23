"""Nonvisual transport check and bounded native source details only."""

import hashlib
import json
from pathlib import Path

from PIL import Image, ImageChops, ImageOps


OWN = Path(__file__).resolve().parent
REPO = OWN.parents[4]
AUTHOR = REPO / ".intentfold/tickets/STEMROBIN-188/tmp/source6g159160-author-first-09"
ORIGINALS = {
    159: AUTHOR / "work/6-8g/pages/0159/page.png",
    160: AUTHOR / "work/6-8g/pages/0160/page.png",
}


def binding(path):
    return {
        "path": str(path),
        "sha256": hashlib.sha256(path.read_bytes()).hexdigest(),
        "mode": format(path.stat().st_mode & 0o7777, "04o"),
        "bytes": path.stat().st_size,
    }


checks = []
with Image.open(ORIGINALS[160]) as source:
    for name, box in [
        ("tbl-p0160-01", (144, 556, 1112, 361)),
        ("fig-213", (896, 1598, 318, 267)),
    ]:
        x, y, w, h = box
        native = source.crop((x, y, x + w, y + h)).convert("L")
        path = AUTHOR / f"work/6-8g/pages/0160/figures/{name}.png"
        with Image.open(path) as retained:
            pad_x = (retained.width - w) // 2
            pad_y = (retained.height - h) // 2
            expected = ImageOps.expand(native, (pad_x, pad_y), 255)
            diff = ImageChops.difference(expected, retained.convert("L"))
            checks.append({
                "id": name,
                "source": binding(ORIGINALS[160]),
                "crop": binding(path),
                "source_xywh": list(box),
                "source_mode": source.mode,
                "crop_mode": retained.mode,
                "native_size": list(native.size),
                "retained_size": list(retained.size),
                "white_padding_xy": [pad_x, pad_y],
                "pixel_difference_bbox": diff.getbbox(),
                "pixel_mismatch_count": sum(n for value, n in enumerate(diff.histogram()) if value),
                "exact_transport": expected.size == retained.size and diff.getbbox() is None,
            })

details = []
for page, name, box in [
    (159, "native159-relations", (425, 1310, 600, 62)),
    (159, "native159-445-marks", (180, 625, 220, 63)),
    (160, "native160-downward-mark", (218, 1160, 105, 72)),
]:
    x, y, w, h = box
    target = OWN / f"{name}.png"
    if target.exists():
        raise RuntimeError(f"Refuse to overwrite existing native detail: {target}")
    with Image.open(ORIGINALS[page]) as source:
        detail = source.crop((x, y, x + w, y + h))
        detail.save(target)
    details.append({
        "page": page,
        "source": binding(ORIGINALS[page]),
        "native_detail": binding(target),
        "source_xywh": list(box),
        "scale": 1,
        "no_grid": True,
    })

result = {
    "schema": "independent-source-pixel-transport@1",
    "visual_approval": False,
    "original_visual_reopens": 0,
    "checks": checks,
    "native_details_created_not_yet_viewed": details,
}
target = OWN / "pixel-check.json"
if target.exists():
    raise RuntimeError(f"Refuse to overwrite existing check: {target}")
target.write_text(json.dumps(result, indent=2) + "\n", encoding="ascii")
print(json.dumps(result, indent=2))
