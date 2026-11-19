import inspect
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image

R = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
OUT = R / ".intentfold/tickets/STEMROBIN-181/tmp/d808-source231-raw201202-first-review"
A = R / ".intentfold/tickets/STEMROBIN-181/tmp/d797-source231-first-author"
sys.path.insert(0, str(R / ".claude/skills/ld-s10y-lesson/tools"))
import layout

source, first_line = inspect.getsourcelines(layout.line_bands)
stages = {
    first_line + offset: name
    for offset, text in enumerate(source)
    for token, name in (
        ("joined = []", "after_gap_merge_before_join"),
        ("typical_h = float(line_h)", "before_pitch_expansion"),
    )
    if token in text
}
trace = {}


def capture(frame, event, arg):
    if frame.f_code is layout.line_bands.__code__ and event == "line" and frame.f_lineno in stages:
        trace[stages[frame.f_lineno]] = {
            "code_line": frame.f_lineno,
            "footnote_bands": [
                list(band) for band in frame.f_locals["merged"]
                if 1740 <= band[0] <= 1900
            ],
            "line_h": frame.f_locals["line_h"],
            "glyph_h": frame.f_locals["glyph_h"],
            "merge_gap": frame.f_locals["merge_gap"],
        }
    return capture


image = Image.open(A / "work/10p/pages/0231/page.png")
ink = layout.ink_mask(image)
columns = np.flatnonzero(ink.any(axis=0))
content_w = int(columns[-1] - columns[0] + 1)
audit = json.loads((A / "root/10p/pages/0231/audit.json").read_text())
for figure in audit["figures"]:
    x, y, w, h = figure["box"]
    ink[y:y + h, x:x + w] = False
sys.settrace(capture)
bands = layout.line_bands(ink, content_w)
sys.settrace(None)
assert trace["after_gap_merge_before_join"]["footnote_bands"] == [[1755, 1892]]
assert trace["before_pitch_expansion"]["footnote_bands"] == [[1755, 1892]]
trace["final_footnote_bands"] = [band for band in bands if 1740 <= band[0] <= 1900]
trace["diagnosis"] = {
    "source_projection_rows": [[1755, 1797], [1813, 1852], [1863, 1892]],
    "actual_gap_merge_result": [1755, 1892],
    "local_footnote_font_smaller_than_main_text": True,
    "global_line_height_px": 42,
    "global_glyph_height_px": 40.0,
    "merge_gap_px": 16.0,
    "typical_inter_row_gap_px": 31.0,
    "pitch_px": 73.0,
    "combined_height_px": 138,
    "pitch_row_estimate": "(138 + 31) / 73 = 2.315..., rounded to 2",
    "artificial_split_inside_real_second_row": {
        "real_second_row": [1813, 1852],
        "artificial_boundary": [1823, 1824],
    },
    "separator_rule_y": [1720, 1728],
    "separator_counted_as_text": False,
    "producer_calls": 0,
    "pixel_candidate_or_counter_edits": 0,
    "native_requirement_resolved": False,
}
path = OUT / "counting-trace.json"
path.write_text(json.dumps(trace, indent=2) + "\n")
print(json.dumps(trace, indent=2))
