"""Read existing source pixels and collect unmodified native counting facts."""

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
RAW = REPO / ".tmp/stemrobin-184-six/n11-nov23-source4651/raw/9c/pages"


def box_for(mask, y_offset=0):
    ys, xs = np.nonzero(mask)
    if not len(xs):
        return None
    return [
        int(xs.min()),
        int(ys.min()) + y_offset,
        int(xs.max() - xs.min() + 1),
        int(ys.max() - ys.min() + 1),
    ]


result = {
    "cwd": str(REPO),
    "coordinate_contract": "zero-based source pixels; band y endpoints inclusive; boxes x,y,w,h",
    "method": "layout.ink_mask + unchanged layout.line_bands; scipy.ndimage.label facts",
    "helper_sha256": layout.sha256_file(TOOLS / "layout.py"),
    "no_exclusions_or_expected_counts": True,
    "pages": [],
}

for page in (46, 47, 48, 49):
    source = PREPARED / f"{page:04d}/page.png"
    with Image.open(source) as image:
        ink = layout.ink_mask(image)
        width, height = image.size
    cols = np.flatnonzero(ink.any(axis=0))
    content_width = int(cols[-1] - cols[0] + 1) if len(cols) else width
    bands = layout.line_bands(ink, content_width)
    edge_trim = max(1, int(width * 0.01))
    trimmed = ink.copy()
    trimmed[:, :edge_trim] = False
    trimmed[:, -edge_trim:] = False
    labels, _ = ndimage.label(trimmed)
    components = []
    for component_id, bounds in enumerate(ndimage.find_objects(labels), 1):
        if bounds is None:
            continue
        ys, xs = bounds
        area = int(np.count_nonzero(labels[bounds] == component_id))
        components.append({
            "id": component_id,
            "box": [xs.start, ys.start, xs.stop - xs.start, ys.stop - ys.start],
            "ink_pixels": area,
        })
    rows = []
    for index, (first, last) in enumerate(bands, 1):
        overlaps = [
            component for component in components
            if component["box"][1] <= last
            and component["box"][1] + component["box"][3] > first
            and component["ink_pixels"] >= 10
        ]
        row = {
            "native_row": index,
            "y_inclusive": [first, last],
            "source_ink_box": box_for(ink[first:last + 1], first),
            "edge_trimmed_ink_box": box_for(trimmed[first:last + 1], first),
            "edge_trimmed_ink_pixels": int(trimmed[first:last + 1].sum()),
            "overlapping_components_area_at_least_10": overlaps,
        }
        rows.append(row)
        significant_margin = [
            component for component in overlaps
            if component["ink_pixels"] >= 100
            and (
                component["box"][0] + component["box"][2] <= 0.05 * width
                or component["box"][0] >= 0.90 * width
                or component["box"][1] >= 0.95 * height
            )
        ]
        print(
            f"{page:04d} row {index:02d} y={first}:{last} "
            f"box={row['edge_trimmed_ink_box']} margin={significant_margin}"
        )
    audit = json.loads((RAW / f"{page:04d}/audit.json").read_text())
    result["pages"].append({
        "page": page,
        "source": str(source),
        "source_sha256": layout.sha256_file(source),
        "size": [width, height],
        "content_width": content_width,
        "edge_trim_px": edge_trim,
        "first_audit": audit,
        "native_band_total": len(bands),
        "bands": rows,
        "all_edge_trimmed_components": components,
    })

with (OUT / "native-count-facts.json").open("x", encoding="utf-8") as output:
    json.dump(result, output, ensure_ascii=False, indent=2)
    output.write("\n")
