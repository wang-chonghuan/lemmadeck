"""Read-only pixel/count diagnosis; outputs stay in this owned evidence root."""

import hashlib
import json
import sys
import types
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = Path("/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184")
OUT = Path(__file__).resolve().parent
RECOVERY = ROOT / ".tmp/stemrobin-184-six/n15-nov23-recovery"
SOURCE = RECOVERY / "prepared/9c/pages/0063/page.png"
TOOLS = ROOT / ".claude/skills/ld-s10y-lesson/tools"
EXPECTED = "d6720e9e360c2e4ffd71e19c4e558b51828ee09b20cc7db8ce695c71b7bb63e9"


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def write_new_json(path, value):
    with path.open("x", encoding="utf-8") as stream:
        json.dump(value, stream, indent=2)
        stream.write("\n")


assert Path.cwd() == ROOT
assert OUT == ROOT / (
    "ssot-resources/soviet10year-textbooks/artifacts/9c/evidence/"
    "nov23-1847-n15/count-source-review"
)
assert digest(SOURCE) == EXPECTED
sys.dont_write_bytecode = True
sys.path.insert(0, str(TOOLS))
import blocks

# Capture the live counting helper without importing or invoking the finalizer.
code = (TOOLS / "layout.py").read_bytes()
layout = types.ModuleType("count_source_review_layout")
layout.__file__ = str(TOOLS / "layout.py")
sys.modules[layout.__name__] = layout
exec(compile(code, layout.__file__, "exec"), layout.__dict__)

raw = RECOVERY / "raw/9c/pages/0063"
page = json.loads((raw / "page.json").read_text())
audit = json.loads((raw / "audit.json").read_text())
prepared = json.loads((RECOVERY / "prepared/9c/pages/0063/layout.json").read_text())
assert not audit["count_exclusions"]
assert not page["meta"].get("count_exclusions", [])
with Image.open(SOURCE) as opened:
    image = opened.copy()
ink = layout.ink_mask(image)
columns = np.flatnonzero(ink.any(axis=0))
width = int(columns[-1] - columns[0] + 1)
masked = ink.copy()
for figure in audit["figures"]:
    x, y, w, h = figure["box"]
    masked[y:y + h, x:x + w] = False

trace = {}


def observe_return(frame, event, arg):
    if frame.f_code is layout.line_bands.__code__ and event == "return":
        for key in ("line_h", "glyph_h", "typical_h", "typical_gap", "pitch"):
            if key in frame.f_locals:
                trace[key] = float(frame.f_locals[key])
        for key in ("raw", "merged", "expanded"):
            if key in frame.f_locals:
                trace[key] = [
                    [int(a), int(b)] for a, b in frame.f_locals[key]
                ]
    return observe_return


sys.settrace(observe_return)
try:
    bands = layout.line_bands(masked, width)
finally:
    sys.settrace(None)

labels, _ = ndimage.label(ink)
bounds = ndimage.find_objects(labels)
sizes = np.bincount(labels.ravel())


def components_in(box):
    x, y, w, h = box
    region = labels[y:y + h, x:x + w]
    results = []
    for component_id in np.unique(region):
        if not component_id:
            continue
        rows, cols = bounds[component_id - 1]
        results.append({
            "id": int(component_id),
            "box": [
                cols.start, rows.start,
                cols.stop - cols.start, rows.stop - rows.start,
            ],
            "total_ink_pixels": int(sizes[component_id]),
            "region_ink_pixels": int(np.count_nonzero(region == component_id)),
        })
    return results


regions = {
    "title_print_only": [400, 595, 720, 100],
    "title_right_margin": [1525, 595, 170, 120],
    "footer_print": [150, 2150, 200, 70],
    "interior_stroke_below_caption": [1100, 2150, 150, 70],
    "bottom_edge": [0, 2350, 1695, 31],
}
band_stats = []
for a, b in bands:
    xs = np.flatnonzero(masked[a:b + 1].any(axis=0))
    band_stats.append({
        "y_inclusive": [a, b],
        "x_extent_inclusive": [int(xs[0]), int(xs[-1])],
        "ink_pixels_after_existing_figure_boxes": int(masked[a:b + 1].sum()),
    })

crops = []
for name, box in [
    ("title-and-right-margin.png", [380, 595, 1260, 120]),
    ("lower-caption-footer-edge.png", [130, 2065, 1490, 316]),
]:
    x, y, w, h = box
    path = OUT / name
    with path.open("xb") as stream:
        image.crop((x, y, x + w, y + h)).save(stream, format="PNG")
    crops.append({
        "file": name,
        "source_box_xywh": box,
        "sha256": digest(path),
        "model_opened": False,
    })

inputs = [
    SOURCE, raw / "page.md", raw / "page.json", raw / "audit.json",
    RECOVERY / "prepared/9c/pages/0063/layout.json", OUT / "source-first.md",
    TOOLS / "blocks.py",
]
report = {
    "schema": "stemrobin-184/count-source-numeric@1",
    "source_sha256": EXPECTED,
    "dimensions": list(image.size),
    "inputs": [
        {"path": str(path.relative_to(ROOT)), "sha256": digest(path)}
        for path in inputs
    ],
    "counting_helper": {
        "path": str((TOOLS / "layout.py").relative_to(ROOT)),
        "executed_bytes_sha256": hashlib.sha256(code).hexdigest(),
        "file_sha256_after": digest(TOOLS / "layout.py"),
        "scope": "Current working helper, not the historical native-finalizer code.",
    },
    "content_width": width,
    "ink_threshold": layout.INK_THRESHOLD,
    "figure_boxes": [figure["box"] for figure in audit["figures"]],
    "count_exclusions": [],
    "recovered_audit_count": audit["lines_printed"],
    "recovered_audit_authored": audit["lines_md"],
    "recount_authored": blocks.printed_lines(page["blocks"]),
    "prepared_unmasked_bands": prepared["line_bands"],
    "current_helper_count": len(bands),
    "current_helper_bands": band_stats,
    "current_helper_trace": trace,
    "regions": [
        {"name": name, "box": box, "components": components_in(box)}
        for name, box in regions.items()
    ],
    "crops_created_not_yet_model_opened": crops,
    "source_sha256_after": digest(SOURCE),
    "source_first_sha256_after": digest(OUT / "source-first.md"),
    "forbidden_actions_performed": [],
}
write_new_json(OUT / "numeric-count.json", report)
print(json.dumps({
    "output": str(OUT / "numeric-count.json"),
    "historical_count": report["recovered_audit_count"],
    "current_count": report["current_helper_count"],
    "authored_count": report["recount_authored"],
    "helper_sha256": report["counting_helper"]["executed_bytes_sha256"],
    "trace_scale": {k: v for k, v in trace.items() if not isinstance(v, list)},
    "regions": report["regions"],
    "crops": crops,
}))
