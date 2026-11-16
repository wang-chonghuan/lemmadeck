import hashlib
import json
import sys
from collections import Counter
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = Path.cwd()
TOOLS = ROOT / ".claude/skills/ld-s10y-lesson/tools"
sys.path.insert(0, str(TOOLS))
import blocks
import layout

OUT = ROOT / ".intentfold/tickets/STEMROBIN-184/tmp/10c-p40-count-diagnostic"
PNG = ROOT / ".tmp/ld-s10y-lesson/10c/pages/0040/page.png"
LAYOUT = PNG.parent / "layout.json"
MD = OUT / "first-failed-triples/page.md"
RESULT = OUT / "diagnostic.json"
if not (OUT / "before-handling-hashes.json").exists():
    raise RuntimeError("Preserve failed triples before diagnostic")
if RESULT.exists():
    raise RuntimeError("Do not overwrite the diagnostic")


def binding(path):
    raw = path.read_bytes()
    return {
        "path": str(path.relative_to(ROOT)),
        "sha256": hashlib.sha256(raw).hexdigest(),
        "bytes": len(raw),
    }


def serial(value):
    if isinstance(value, np.generic):
        return value.item()
    if isinstance(value, np.ndarray):
        return value.tolist()
    if isinstance(value, set):
        return sorted(value)
    if isinstance(value, (list, tuple)):
        return [serial(v) for v in value]
    return value


image = Image.open(PNG)
ink = layout.ink_mask(image)
cols = np.flatnonzero(ink.any(axis=0))
content_width = int(cols[-1] - cols[0] + 1) if cols.size else image.width
trace_events = []
stage_lines = {
    379: ("initial-line-height", ("raw", "line_h")),
    388: ("estimated-glyph-height", ("line_h", "glyph_h")),
    437: ("fragments-before-merge", ("raw", "line_h", "glyph_h", "merge_gap")),
    530: ("after-fraction-tail-processing", ("merged", "fraction_starts")),
    609: ("expanded-bands", ("merged", "typical_h", "typical_gap", "pitch")),
    655: (
        "band-retained",
        ("a", "b", "band_h", "band_w", "thin", "edge_border", "short_text",
         "folio", "decoration", "typical_h", "glyph_h"),
    ),
}
processed_ink = None


def trace(frame, event, arg):
    global processed_ink
    if frame.f_code is not layout.line_bands.__code__:
        return trace
    if event == "line" and frame.f_lineno in stage_lines:
        name, fields = stage_lines[frame.f_lineno]
        trace_events.append({
            "event": name,
            "implementation_line": frame.f_lineno,
            **{key: serial(frame.f_locals[key]) for key in fields if key in frame.f_locals},
        })
    if event == "return":
        processed_ink = frame.f_locals["ink"].copy()
        trace_events.append({
            "event": "return",
            "implementation_line": frame.f_lineno,
            "bands": serial(arg),
            "typical_h": serial(frame.f_locals.get("typical_h")),
            "glyph_h": serial(frame.f_locals.get("glyph_h")),
        })
    return trace


sys.settrace(trace)
try:
    bands = layout.line_bands(ink, content_width)
finally:
    sys.settrace(None)
stored = json.loads(LAYOUT.read_text())
assert serial(bands) == stored["line_bands"], "Current recomputation differs from existing prepare layout"
meta, parsed = blocks.parse(MD.read_text())
assert not meta.get("count_exclusions"), "Diagnostic must not introduce or apply exclusions"
assert not any(b["kind"] == "fig" for b in parsed)
md_count = blocks.printed_lines(parsed)
mask_unchanged = np.array_equal(ink, layout.ink_mask(image))
assert mask_unchanged, "Existing counting function must not mutate input extraction mask"

labels, n = ndimage.label(processed_ink)
component_bounds = ndimage.find_objects(labels)
components = []
for component_id, bounds in enumerate(component_bounds, 1):
    if bounds is None:
        continue
    rows, columns = bounds
    if rows.stop <= 2440 or rows.start >= 2540:
        continue
    mask = labels[bounds] == component_id
    y, x = np.nonzero(mask)
    width = columns.stop - columns.start
    height = rows.stop - rows.start
    components.append({
        "component": component_id,
        "box": [columns.start, rows.start, width, height],
        "ink_pixels": int(mask.sum()),
        "occupancy": float(mask.sum() / (width * height)),
        "full_page_centroid": [float(columns.start + x.mean()), float(rows.start + y.mean())],
        "mask_sha256": hashlib.sha256(mask.tobytes()).hexdigest(),
    })
components.sort(key=lambda c: c["ink_pixels"], reverse=True)
row_stats = [{
    "y": y,
    "raw_ink_pixels": int(ink[y].sum()),
    "processed_count_copy_ink_pixels": int(processed_ink[y].sum()),
    "processed_x_min": int(np.flatnonzero(processed_ink[y])[0]) if processed_ink[y].any() else None,
    "processed_x_max": int(np.flatnonzero(processed_ink[y])[-1]) if processed_ink[y].any() else None,
} for y in range(2440, 2540)]
crop_entries = []
for name, box in (
    ("bottom-left-native.png", [0, 2440, 850, 100]),
    ("bottom-right-native.png", [850, 2440, 845, 100]),
    ("folio-native.png", [130, 2258, 230, 90]),
):
    x, y, w, h = box
    path = OUT / name
    if path.exists():
        raise RuntimeError(f"Preserve native strip: {path}")
    image.crop((x, y, x + w, y + h)).save(path)
    reopened = Image.open(path)
    assert np.array_equal(np.asarray(reopened), np.asarray(image)[y:y + h, x:x + w])
    crop_entries.append({
        **binding(path),
        "source_box_xywh": box,
        "native_size": list(reopened.size),
        "raw_pixel_slice_exact": True,
        "scaled": False,
        "enhanced": False,
        "annotated": False,
    })

band_details = []
for index, (a, b) in enumerate(bands, 1):
    local = processed_ink[a:b + 1]
    xs = np.flatnonzero(local.any(axis=0))
    band_details.append({
        "band": index,
        "y_inclusive": [a, b],
        "height": b - a + 1,
        "x_extent_inclusive": [int(xs[0]), int(xs[-1])],
        "width": int(xs[-1] - xs[0] + 1),
        "ink_pixels": int(local.sum()),
        "row_ink_max": int(local.sum(axis=1).max()),
    })

result = {
    "role": "physical40 count-only diagnosis; no source semantic review or repair",
    "inputs": [binding(PNG), binding(LAYOUT), binding(MD),
               binding(OUT / "first-failed-triples/page.json"),
               binding(OUT / "first-failed-triples/audit.json"),
               binding(TOOLS / "layout.py"), binding(TOOLS / "blocks.py"),
               binding(TOOLS / "p2c.py")],
    "runtime": {
        "python": sys.version,
        "executable": sys.executable,
        "numpy": np.__version__,
        "function_invoked": "layout.line_bands(original layout.ink_mask(page.png), content_width)",
        "read_only_trace": "sys.settrace observes existing function locals; no code/argument/threshold modification",
        "finalize_invocations": 0,
        "count_exclusions_applied": [],
        "expected_count_override": False,
    },
    "source_size": list(image.size),
    "content_width": content_width,
    "machine_bands_match_existing_layout_exactly": True,
    "machine_count": len(bands),
    "md_count_from_official_blocks_function": md_count,
    "md_object_counts": dict(Counter(b["kind"] for b in parsed)),
    "samerow_count": sum(bool(b["samerow"]) for b in parsed),
    "original_ink_input_unchanged": mask_unchanged,
    "bands": band_details,
    "trace": trace_events,
    "bottom_components_on_existing_count_copy": components,
    "bottom_row_projection": row_stats,
    "native_strips": crop_entries,
    "literal101": {
        "text": next(b["lines"] for b in parsed if b["kind"] == "ex" and b["label"] == "101"),
        "semantic_status": "UNKNOWN; adjacency of literal2 / stacked1-over7 / pi is not parsed as mixed-number or multiplication",
        "not_a_math_erratum": True,
    },
    "limits": "Only physical40 examined. Full original image was opened once, tool display resized it; the saved bounded strips retain actual native pixels. No p38 comparison, source glyph recovery, semantic review or repair; no exclusion box applied.",
}
RESULT.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n")
print(json.dumps({
    "diagnostic": binding(RESULT),
    "machine_count": len(bands),
    "md_count": md_count,
    "last_bands": band_details[-2:],
    "last_filter_events": [e for e in trace_events if e["event"] == "band-retained"][-2:],
    "largest_bottom_components": components[:8],
    "native_strips": crop_entries,
}, indent=2))
