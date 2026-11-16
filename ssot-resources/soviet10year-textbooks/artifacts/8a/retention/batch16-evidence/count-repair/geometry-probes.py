"""Supplementary crop/component evidence and original helper probes, no page gates."""

import hashlib
import importlib.util
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage


OUT = Path(__file__).resolve().parent
ROOT = OUT.parent
REPO = ROOT.parents[4]
WORK = ROOT.parent / "batch16-work" / "8a" / "pages"
LAYOUT = REPO / ".claude/skills/ld-s10y-lesson/tools/layout.py"
if (OUT / "geometry-probes.json").exists():
    raise RuntimeError("Geometry probes already recorded.")
MEASUREMENTS = json.loads((OUT / "measurements.json").read_text())
SPEC = importlib.util.spec_from_file_location("layout_geometry_probes", LAYOUT)
MODULE = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(MODULE)
ITEMS = [
    (8, "p8-whole-noise-band", [1600, 3370, 2440, 3460], 0),
    (8, "p8-tight-two-prose-rows", [340, 1885, 2160, 2110], 2),
    (9, "p9-whole-nested-row-with-noise", [780, 1330, 2390, 1610], 1),
]


def sha(file):
    return hashlib.sha256(file.read_bytes()).hexdigest()


def simple(item):
    if isinstance(item, (np.integer, np.floating, np.bool_)):
        return item.item()
    if isinstance(item, (tuple, list)):
        return [simple(value) for value in item]
    return item


rows = []
for page, name, box, visual_count in ITEMS:
    png = WORK / f"{page:04d}" / "page.png"
    with Image.open(png) as image:
        mask = MODULE.ink_mask(image)
        crop = image.crop(tuple(box)).convert("RGB")
    target = OUT / f"{name}.png"
    crop.save(target)
    labels, _ = ndimage.label(mask)
    areas = np.bincount(labels.ravel())
    x0, y0, x1, y1 = box
    component_ids = set(int(item) for item in np.unique(labels[y0:y1, x0:x1]) if item)
    components = []
    draw = ImageDraw.Draw(crop)
    for component_id, bounds in enumerate(ndimage.find_objects(labels), 1):
        if bounds is None or component_id not in component_ids:
            continue
        sy, sx = bounds
        height, width = sy.stop - sy.start, sx.stop - sx.start
        components.append({
            "id_original_full_page_4_connected": component_id,
            "box_xywh": [sx.start, sy.start, width, height],
            "area": int(areas[component_id]),
            "density": float(areas[component_id] / (width * height)),
        })
        if areas[component_id] >= 8:
            draw.rectangle((sx.start - x0, sy.start - y0, sx.stop - 1 - x0, sy.stop - 1 - y0),
                           outline=(205, 40, 40), width=1)
    overlay = OUT / f"{name}-components.png"
    crop.save(overlay)
    rows.append({
        "id": name, "page": page,
        "source_sha256": sha(png), "bounds_xyxy": box,
        "path": str(target.relative_to(REPO)), "sha256": sha(target),
        "overlay": str(overlay.relative_to(REPO)), "overlay_sha256": sha(overlay),
        "independent_visual_count": visual_count, "original_components": components,
        "largest_component_height": max(item["box_xywh"][3] for item in components),
    })

PROBES = [
    (8, "tight-two-prose-rows", [340, 1909, 2160, 2088], 2),
    (9, "one-nested-numerator-equation", [780, 1362, 1670, 1570], 1),
    (9, "two-prose-rows", [330, 938, 2160, 1127], 2),
    (9, "genuine-wrapped-formula-and-ac", [330, 2093, 2160, 2344], 2),
]
probes = []
for page, name, box, visual_count in PROBES:
    with Image.open(WORK / f"{page:04d}/page.png") as image:
        mask = MODULE.ink_mask(image)[box[1]:box[3], box[0]:box[2]]
    trace = {}

    def tracer(frame, event, arg):
        if frame.f_code.co_filename != str(LAYOUT):
            return None
        if event == "return" and frame.f_code.co_name == "_single_fraction_row":
            loc = frame.f_locals
            trace.update({
                "return_line": frame.f_lineno,
                "height": int(loc["height"]),
                "rules_x_inclusive_crop": simple(loc["rules"]),
                "residual_row_indices_crop": simple(loc.get("remaining", []).tolist())
                    if "remaining" in loc else [],
                "residual_max_ink_per_row": int(loc["counts"].max()) if "counts" in loc else None,
            })
        return tracer

    previous = sys.gettrace()
    try:
        sys.settrace(tracer)
        result = bool(MODULE._single_fraction_row(mask, 0, mask.shape[0] - 1, 63.0))
    finally:
        sys.settrace(previous)
    probes.append({
        "id": name, "page": page,
        "original_pixel_region_xyxy": box, "visual_rows": visual_count,
        "production_helper": "_single_fraction_row", "line_h_argument": 63.0,
        "result": result, "trace": trace,
        "scope": "Local unmodified source pixels; read-only helper classification, not an implemented-fix test or finalize rerun.",
    })

report = {
    "schema": "8a-count-diagnosis/geometry-probes@1",
    "production_layout_sha256": sha(LAYOUT),
    "same_layout_as_measurement": sha(LAYOUT) == MEASUREMENTS["production_layout_sha256"],
    "crops": rows,
    "helper_probes": probes,
    "line_bands_calls": 0,
    "finalize_calls": 0,
}
result = OUT / "geometry-probes.json"
result.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n")
print(json.dumps({
    "path": str(result.relative_to(REPO)), "sha256": sha(result),
    "crop_components": [{"id": item["id"], "count": len(item["original_components"]),
        "largest_height": item["largest_component_height"]} for item in rows],
    "helper_probes": probes,
}, ensure_ascii=False, indent=2))
