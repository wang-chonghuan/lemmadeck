import hashlib
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path.cwd()
OUT = ROOT / ".intentfold/tickets/STEMROBIN-184/tmp/source-10c-p43-p46-targeted-repair-evidence"
sys.path.insert(0, str(ROOT / ".claude/skills/ld-s10y-lesson/tools"))
import layout

TARGET = OUT / "margin-only-diagnostic.json"
assert not TARGET.exists(), "Do not repeat the metadata-only diagnostic"
saved = json.loads((OUT / "diagnostic.json").read_text())
page = next(entry for entry in saved["pages"] if entry["page"] == 46)
png = ROOT / ".tmp/ld-s10y-lesson/10c/pages/0046/page.png"
image = Image.open(png)
ink = layout.ink_mask(image)
masked = ink.copy()
for figure in page["figure_boxes"]:
    x, y, w, h = figure["box"]
    masked[y:y + h, x:x + w] = False

exclusions = [
    {"kind": "scan-artifact", "box": [1594, 1360, 11, 14],
     "reason": "Native right-margin strip shows an isolated ink speck outside printed prose and both figure boxes."},
    {"kind": "scan-artifact", "box": [1589, 1554, 11, 17],
     "reason": "Native right-margin strip shows the second isolated speck outside printed prose and both figure boxes."},
]
strip = ink[2458:2528, 420:1695]
ys, xs = np.nonzero(strip)
bottom = [int(420 + xs.min()), int(2458 + ys.min()),
          int(xs.max() - xs.min() + 1), int(ys.max() - ys.min() + 1)]
exclusions.append({
    "kind": "scan-artifact", "box": bottom,
    "reason": "Native bottom-margin strip shows only the scan-edge line and sparse dots below folio y2259-2287; exact ink bounding box lies in the bottom 5%."})

before_masked = masked.copy()
count_copy = layout.counting_ink(masked, exclusions)
before_count_copy = count_copy.copy()
state = {}
processed = None


def trace(frame, event, value):
    global processed
    if frame.f_code is layout.line_bands.__code__ and event == "return":
        current = frame.f_locals
        processed = current["ink"].copy()
        state.update({key: float(current[key]) for key in (
            "line_h", "glyph_h", "typical_h", "typical_gap", "pitch")})
    return trace


sys.settrace(trace)
try:
    bands = layout.line_bands(count_copy, page["content_width"])
finally:
    sys.settrace(None)
assert np.array_equal(ink, layout.ink_mask(image))
assert np.array_equal(masked, before_masked)
assert np.array_equal(count_copy, before_count_copy)
result = {
    "role": "One diagnostic-only metadata-count-copy probe; not finalize or gate",
    "page": 46, "source_sha256": hashlib.sha256(png.read_bytes()).hexdigest(),
    "proposed_count_exclusions": exclusions,
    "guard": "Existing layout.counting_ink accepted all three exact inspected margin boxes",
    "durable_metadata_modified": False, "original_pixels_modified": False,
    "owned_crop_modified": False, "expected_count_override": False,
    "first_machine_count": page["machine_count"],
    "official_md_count": page["md_count"], "natural_margin_only_machine_count": len(bands),
    "state": state, "bands": [list(band) for band in bands],
    "body_regions_retained": [
        {"region_y": [1386, 1436], "returned_bands": [list(band) for band in bands
         if band[0] <= 1436 and band[1] >= 1386]},
        {"region_y": [1468, 1517], "returned_bands": [list(band) for band in bands
         if band[0] <= 1517 and band[1] >= 1468]},
        {"region_y": [1266, 1343], "returned_bands": [list(band) for band in bands
         if band[0] <= 1343 and band[1] >= 1266]},
    ],
    "finalize_invocations": 0,
}
TARGET.write_text(json.dumps(result, indent=2) + "\n")
print(json.dumps(result, indent=2))
