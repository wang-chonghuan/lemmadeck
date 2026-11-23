"""Create four precisely localized, unaltered source crops and component facts."""

import json
import sys
from pathlib import Path

REPO = Path("/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184")
TOOLS = REPO / ".claude/skills/ld-s10y-lesson/tools"
sys.path.insert(0, str(TOOLS))

import layout
import numpy as np
from PIL import Image
from scipy import ndimage

OUT = Path(__file__).resolve().parent
PREPARED = REPO / ".tmp/stemrobin-184-six/n11-nov23-source4651/prepared/9c/pages"
CROPS = [
    (46, [205, 2018, 510, 122], "0046-footnote-separator.png"),
    (47, [0, 2300, 1695, 81], "0047-bottom-edge.png"),
    (48, [0, 780, 1000, 170], "0048-left-blotch-heading.png"),
    (49, [200, 1490, 1120, 275], "0049-ex91-fractions-annotation.png"),
]
REGIONS = {
    46: [[205, 2018, 510, 122]],
    47: [[0, 2300, 1695, 81]],
    48: [[0, 780, 1000, 170], [1220, 385, 180, 32]],
    49: [[200, 1490, 1120, 275], [1540, 825, 110, 80]],
}

records = []
for page, box, filename in CROPS:
    source = PREPARED / f"{page:04d}/page.png"
    target = OUT / filename
    if target.exists():
        raise FileExistsError(target)
    with Image.open(source) as image:
        x, y, width, height = box
        image.crop((x, y, x + width, y + height)).save(target)
        ink = layout.ink_mask(image)
    labels, _ = ndimage.label(ink)
    records.append({
        "page": page,
        "source": str(source),
        "source_sha256": layout.sha256_file(source),
        "crop": str(target),
        "crop_box": box,
        "crop_sha256": layout.sha256_file(target),
        "pixel_transform": "unscaled source crop; no overlays, labels, montage or grid",
        "regions": [
            {"box": region, "components": []} for region in REGIONS[page]
        ],
    })
    for component_id, bounds in enumerate(ndimage.find_objects(labels), 1):
        if bounds is None:
            continue
        ys, xs = bounds
        area = int(np.count_nonzero(labels[bounds] == component_id))
        if area < 10:
            continue
        component = {
            "source_component_id": component_id,
            "box": [xs.start, ys.start, xs.stop - xs.start, ys.stop - ys.start],
            "ink_pixels": area,
        }
        for region in records[-1]["regions"]:
            rx, ry, rw, rh = region["box"]
            if xs.start < rx + rw and xs.stop > rx and ys.start < ry + rh and ys.stop > ry:
                region["components"].append(component)
    print(f"{filename}: source crop {box}")
    for region in records[-1]["regions"]:
        substantial = sorted(
            region["components"], key=lambda item: item["ink_pixels"], reverse=True
        )[:12]
        print(f"  region {region['box']} substantial components: {substantial}")

with (OUT / "crop-component-facts.json").open("x", encoding="utf-8") as output:
    json.dump(records, output, ensure_ascii=False, indent=2)
    output.write("\n")
