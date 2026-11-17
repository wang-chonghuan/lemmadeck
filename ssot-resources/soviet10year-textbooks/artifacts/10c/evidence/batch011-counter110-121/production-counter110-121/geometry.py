import json

import numpy as np
from PIL import Image
from scipy import ndimage

from diagnose import OUT, inputs, load_layout, TOOLS

layout = load_layout(TOOLS / "layout.py")
before = json.loads((OUT / "before.json").read_text())
for entry in before["pages"]:
    page = entry["page"]
    png, _, _ = inputs(page)
    with Image.open(png) as img:
        ink = layout.ink_mask(img)
    edge = max(1, int(ink.shape[1]*0.01))
    ink[:, :edge] = ink[:, -edge:] = False
    labels, _ = ndimage.label(ink)
    bounds = ndimage.find_objects(labels)
    heights = [
        rows.stop-rows.start for item in bounds if item is not None
        for rows, cols in [item]
        if rows.stop-rows.start >= 10 and 10 <= cols.stop-cols.start <= 80
        and cols.stop-cols.start <= 1.3*(rows.stop-rows.start)
    ]
    print(page, "component height percentiles", np.percentile(heights, [25, 50, 75, 90]))
    print("joined", entry["joined"])
    regions = {
        110: [(2470, 2500)],
        114: [(2460, 2520)],
        117: [(1395, 1487), (1980, 2000)],
        118: [(279, 373), (1012, 1109), (1155, 1255), (1382, 1488)],
        121: [(742, 835), (2120, 2216)],
    }[page]
    for a, b in regions:
        print("REGION", a, b)
        for cid, item in enumerate(bounds, 1):
            if item is None:
                continue
            rows, cols = item
            height, width = rows.stop-rows.start, cols.stop-cols.start
            if a <= rows.start and rows.stop <= b+1 and (height >= 15 or width >= 40):
                part = labels[item] == cid
                row_widths = part.sum(axis=1)
                print(f"  x={cols.start}:{cols.stop} y={rows.start}:{rows.stop} wh={width},{height} area={part.sum()} widths={row_widths.min()}/{np.median(row_widths)}/{row_widths.max()}")
