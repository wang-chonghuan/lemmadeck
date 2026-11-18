import json
from pathlib import Path

import numpy as np
from PIL import Image
from scipy.ndimage import distance_transform_edt, find_objects, label

root = Path(__file__).resolve().parent
author = root.parent / "d561-source203-first-author"
prepared = root.parent / "d567-source203-svg-and-source204-preparation"
ident = "fig-180"
with Image.open(author / f"work/10p/pages/0203/figures/{ident}.png") as raw:
    ink = np.mean(np.asarray(raw.convert("RGB")), axis=2) < 128
with Image.open(prepared / f"previews/{ident}.native.png") as preview:
    traced = np.mean(np.asarray(preview.convert("RGB")), axis=2) < 128
remote = ink & (distance_transform_edt(~traced) > 2)
components, count = label(remote, structure=np.ones((3, 3)))
items = []
for index, slices in enumerate(find_objects(components), 1):
    y, x = slices
    items.append({
        "pixels": int((components[slices] == index).sum()),
        "RAW_bbox_xyxy": [x.start, y.start, x.stop, y.stop],
        "source_bbox_xyxy": [x.start + 813, y.start + 1161, x.stop + 813, y.stop + 1161],
    })
print(json.dumps({
    "figure": ident,
    "purpose": "Adjudicate the remote raw-ink outlier from the first pixel-support computation; no image payload or new SVG rasterization.",
    "remote_ink_pixels_more_than_2px_from_preview": int(remote.sum()),
    "remote_component_count": count,
    "remote_components": items,
    "images_emitted_or_visually_reopened": 0,
}))
