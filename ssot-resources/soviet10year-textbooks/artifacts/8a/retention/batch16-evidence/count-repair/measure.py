"""Read-only production tracing; writes only this diagnosis directory."""

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
if (OUT / "measurements.json").exists():
    raise RuntimeError("Diagnosis measurements already recorded.")
SOURCE = LAYOUT.read_text()
LINES = SOURCE.splitlines()
SPEC = importlib.util.spec_from_file_location("production_layout_diagnosis", LAYOUT)
MODULE = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(MODULE)
VISUAL = json.loads((OUT / "visual-rows.json").read_text())


def sha(file):
    return hashlib.sha256(file.read_bytes()).hexdigest()


def facts(paths):
    return {str(file.relative_to(REPO)): sha(file) for file in sorted(set(paths))}


def tree(directory):
    return [file for file in directory.rglob("*") if file.is_file()]


protected = tree(ROOT / "8a") + tree(ROOT / "snapshot-8a") + tree(ROOT / "commands-8a")
protected += tree(ROOT / "commands/prepare-p0014")
protected += tree(ROOT.parent / "batch16-work/8a")
protected.append(LAYOUT)
before = facts(protected)


def simple(value):
    if isinstance(value, (np.integer, np.floating, np.bool_)):
        return value.item()
    if isinstance(value, (set, tuple, list)):
        return [simple(item) for item in value]
    if isinstance(value, dict):
        return {key: simple(item) for key, item in value.items()}
    if isinstance(value, slice):
        return [value.start, value.stop]
    return value


def bands_info(mask, bands):
    result = []
    for index, (top, bottom) in enumerate(bands, 1):
        region = mask[top:bottom + 1]
        xs = np.flatnonzero(region.any(axis=0))
        result.append({
            "index": index,
            "y_inclusive": [int(top), int(bottom)],
            "ink_box_xywh": [int(xs[0]), int(top), int(xs[-1] - xs[0] + 1), int(bottom - top + 1)],
            "ink_pixels": int(region.sum()),
            "max_ink_per_row": int(region.sum(axis=1).max()),
        })
    return result


def components_info(mask, region_xyxy):
    labels, _ = ndimage.label(mask)
    sizes = np.bincount(labels.ravel())
    x0, y0, x1, y1 = region_xyxy
    indices = set(int(item) for item in np.unique(labels[y0:y1, x0:x1]) if item)
    result = []
    for component_id, bounds in enumerate(ndimage.find_objects(labels), 1):
        if bounds is None or component_id not in indices:
            continue
        rows, columns = bounds
        height, width = rows.stop - rows.start, columns.stop - columns.start
        result.append({
            "id_full_page_4_connected": component_id,
            "box_xywh": [columns.start, rows.start, width, height],
            "area": int(sizes[component_id]),
            "density": float(sizes[component_id] / (width * height)),
            "row_counts": [int(item) for item in (labels[bounds] == component_id).sum(axis=1)],
            "fully_inside_region": x0 <= columns.start and columns.stop <= x1
                and y0 <= rows.start and rows.stop <= y1,
        })
    return result


STAGES = {
    "if not raw:": "raw-fragments",
    "number_glyph_h = min(line_h, glyph_h)": "cleaned-fragments",
    "stacked_centres = []": "after-quotient-recovery",
    "merged = []": "before-first-merge",
    "joined = []": "after-first-merge",
    "merged = joined": "after-fraction-spill-merge",
    "out = []": "after-tall-band-expansion",
    "return out": "final-bands",
}
SCALARS = [
    "line_h", "glyph_h", "number_glyph_h", "merge_gap", "typical_h", "typical_gap", "pitch",
    "a", "b", "prev_a", "prev_b", "separate_tall_rows", "separate_full_text", "different_stacked_rows",
    "compact_fragment", "aligned", "heights", "widths", "fraction_spill", "separate_full_row",
    "band_h", "band_w", "thin", "edge_border", "short_text", "short_glyph_h", "glyph_w", "decoration",
]
CROPS = [
    (8, "p8-blemish", [2190, 3320, 2440, 3480], 0),
    (8, "p8-footer", [1870, 3120, 2140, 3240], 1),
    (8, "p8-short-prose", [345, 2440, 650, 2570], 1),
    (8, "p8-two-prose-rows", [340, 2560, 2160, 2790], 2),
    (9, "p9-nested-numerator", [780, 1320, 1670, 1610], 1),
    (9, "p9-simple-fraction", [700, 720, 2150, 912], 1),
    (9, "p9-two-prose-rows", [330, 920, 2160, 1150], 2),
    (9, "p9-genuine-wrapped-formula", [330, 2070, 2160, 2375], 2),
    (9, "p9-second-nested-fraction", [780, 1790, 1680, 2060], 1),
]
results = []
crop_records = []
for page in (8, 9):
    png = WORK / f"{page:04d}" / "page.png"
    with Image.open(png) as image:
        mask = MODULE.ink_mask(image)
    xs = np.flatnonzero(mask.any(axis=0))
    content_w = int(xs[-1] - xs[0] + 1)
    events, stages, masks = [], [], {}
    final_locals = {}
    seen = set()

    def scalar_state(locals_):
        return {
            key: simple(locals_[key])
            for key in SCALARS
            if key in locals_ and not callable(locals_[key])
        }

    def tracer(frame, event, arg):
        if frame.f_code.co_filename != str(LAYOUT):
            return None
        if frame.f_code.co_name != "line_bands":
            return tracer
        loc = frame.f_locals
        if event == "return":
            final_locals.update(loc)
            masks["final"] = loc["ink"].copy()
        if event != "line":
            return tracer
        text = LINES[frame.f_lineno - 1].strip()
        if text in STAGES and frame.f_lineno not in seen:
            seen.add(frame.f_lineno)
            stage = STAGES[text]
            bands_key = {
                "after-first-merge": "merged",
                "after-fraction-spill-merge": "joined",
                "after-tall-band-expansion": "merged",
                "final-bands": "out",
            }.get(stage, "raw")
            stages.append({
                "stage": stage,
                "line": frame.f_lineno,
                "before_statement": text,
                "scalars": scalar_state(loc),
                "bands": bands_info(loc["ink"], loc.get(bands_key, [])),
            })
            masks[stage] = loc["ink"].copy()
        if text in ("merged.append((a, b))", "joined.append((a, b))", "if not decoration:"):
            a, b = loc.get("a", -1), loc.get("b", -1)
            relevant = page == 8 and a >= 3100 or page == 9 and (
                1300 <= a <= 1600 or 1300 <= loc.get("prev_a", -1) <= 1600
            )
            if relevant:
                events.append({
                    "line": frame.f_lineno,
                    "statement": text,
                    "scalars": scalar_state(loc),
                    "glyph_boxes_local_band": simple(loc.get("glyphs", [])),
                })
        return tracer

    previous_trace = sys.gettrace()
    try:
        sys.settrace(tracer)
        bands = MODULE.line_bands(mask, content_w)
    finally:
        sys.settrace(previous_trace)
    retained = json.loads((WORK / f"{page:04d}" / "layout.json").read_text())["line_bands"]
    counting = masks["final"]
    regions = (
        [("blemish", [2190, 3320, 2440, 3480]), ("footer", [1870, 3120, 2140, 3240])]
        if page == 8 else [("nested-numerator", [780, 1320, 1670, 1610])]
    )
    component_records = []
    for name, box in regions:
        component_records.append({
            "name": name,
            "region_xyxy": box,
            "original_mask_components": components_info(mask, box),
            "production_final_counting_mask_components": components_info(counting, box),
        })
    diagnostic_helpers = []
    if page == 9:
        for start, end in [(1362, 1569), (1362, 1497), (1503, 1569)]:
            h = float(final_locals["glyph_h"])
            diagnostic_helpers.append({
                "function": "_single_fraction_row",
                "full_page_y": [start, end],
                "line_h_argument": h,
                "result": bool(MODULE._single_fraction_row(counting, start, end, h)),
                "note": "Read-only helper probe, no patched logic.",
            })
    for item_page, name, box, visual_count in CROPS:
        if item_page != page:
            continue
        crop_path = OUT / f"{name}.png"
        with Image.open(png) as image:
            crop = image.crop(tuple(box))
            crop.save(crop_path)
        annotated = crop.convert("RGB")
        draw = ImageDraw.Draw(annotated)
        relevant_components = components_info(counting, box)
        for component in relevant_components:
            x, y, w, h = component["box_xywh"]
            if component["area"] >= 8:
                draw.rectangle((x - box[0], y - box[1], x + w - 1 - box[0], y + h - 1 - box[1]),
                               outline=(205, 40, 40), width=1)
        overlay_path = OUT / f"{name}-components.png"
        annotated.save(overlay_path)
        crop_records.append({
            "id": name, "page": page, "source": str(png.relative_to(REPO)),
            "source_sha256": sha(png), "bounds_xyxy": box,
            "path": str(crop_path.relative_to(REPO)), "sha256": sha(crop_path),
            "component_overlay": str(overlay_path.relative_to(REPO)), "overlay_sha256": sha(overlay_path),
            "independent_visual_rows": visual_count,
            "production_bands_intersecting_crop": [
                band for band in bands_info(counting, bands)
                if band["y_inclusive"][0] < box[3] and band["y_inclusive"][1] >= box[1]
            ],
        })
    results.append({
        "pdf_page": page,
        "original_png": str(png.relative_to(REPO)),
        "original_png_sha256": sha(png),
        "content_width": content_w,
        "production_line_bands": bands_info(counting, bands),
        "production_count": len(bands),
        "equals_retained_prepare_bands": simple(bands) == retained,
        "independent_visual_count": next(item["visual_count_including_footer"]
            for item in VISUAL["pages"] if item["pdf_page"] == page),
        "stages": stages,
        "relevant_decision_events": events,
        "components": component_records,
        "read_only_helper_probes": diagnostic_helpers,
    })

after = facts(protected)
changes = [name for name in before if before[name] != after[name]]
(OUT / "protected-bytes.json").write_text(json.dumps({
    "schema": "8a-count-diagnosis/protected-bytes@1",
    "before": before, "after": after, "changed": changes,
}, indent=2) + "\n")
(OUT / "layout.py.snapshot").write_bytes(LAYOUT.read_bytes())
report = {
    "schema": "8a-count-diagnosis/measurements@1",
    "production_layout": str(LAYOUT.relative_to(REPO)),
    "production_layout_sha256": sha(LAYOUT),
    "execution": "Original production module imported without edits; sys.settrace observes locals; line_bands once per whole prepared page. No p2c, prepare, finalize, assembly, tests, or new-source parsing.",
    "pages": results, "crops": crop_records,
    "protected_file_count": len(before), "protected_changes": changes,
}
result_path = OUT / "measurements.json"
result_path.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n")
print(json.dumps({
    "measurements": str(result_path.relative_to(REPO)), "sha256": sha(result_path),
    "layout_sha256": sha(LAYOUT),
    "pages": [{
        "page": item["pdf_page"], "production": item["production_count"],
        "visual": item["independent_visual_count"], "retained_match": item["equals_retained_prepare_bands"],
        "relevant_decisions": item["relevant_decision_events"],
        "helper_probes": item["read_only_helper_probes"],
        "stage_scalars": [{key: value for key, value in stage.items() if key != "bands"}
            for stage in item["stages"]],
    } for item in results],
    "protected_files": len(before), "protected_changes": changes,
}, ensure_ascii=False, indent=2))
