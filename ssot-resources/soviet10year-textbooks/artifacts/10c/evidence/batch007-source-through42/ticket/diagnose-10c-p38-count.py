import json
from pathlib import Path
import sys

import numpy as np
from PIL import Image

sys.path.insert(0, str(Path(".claude/skills/ld-s10y-lesson/tools").resolve()))
import layout

root = Path(".intentfold/tickets/STEMROBIN-184/tmp/10c-p38-count-diagnostic")
assert not root.exists(), "Preserve the original diagnostic"
root.mkdir()
source = Path(".tmp/ld-s10y-lesson/10c/pages/0038/page.png")
document = json.loads(Path(
    "ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0038/page.json"
).read_text())
image = Image.open(source).convert("RGB")
ink = layout.ink_mask(image)
masked = ink.copy()
for figure in document["meta"]["figures"]:
    x, y, width, height = figure["box"]
    masked[y:y + height, x:x + width] = False
columns = np.flatnonzero(ink.any(axis=0))
content_width = int(columns[-1] - columns[0] + 1)
calls = []
state = {}


def trace(frame, event, value):
    if frame.f_code.co_filename != layout.__file__:
        return trace
    if event == "return" and frame.f_code.co_name == "_single_fraction_row":
        current = frame.f_locals
        if current["a"] >= 1700:
            calls.append({
                "a": current["a"], "b": current["b"],
                "line_h": float(current["line_h"]), "result": bool(value),
                "rules": [[int(x), int(y)] for x, y in current["rules"]],
                "remaining_span": [int(current["remaining"][0]),
                                   int(current["remaining"][-1])]
                if current.get("remaining", np.array([])).size else None,
                "glyph_rows": [int(row) for row in current.get("glyph_rows", [])],
            })
    if event == "return" and frame.f_code.co_name == "line_bands":
        current = frame.f_locals
        state.update({
            "line_h": float(current["line_h"]),
            "glyph_h": float(current["glyph_h"]),
            "typical_gap": float(current["typical_gap"]),
            "pitch": float(current["pitch"]),
            "joined": [[int(x), int(y)] for x, y in current["joined"]],
            "fraction_starts": sorted(int(x) for x in current["fraction_starts"]),
        })
    return trace


sys.settrace(trace)
try:
    bands = layout.line_bands(masked, content_width)
finally:
    sys.settrace(None)
for name, box in [
    ("first-quotient.png", (205, 1755, 1470, 1990)),
    ("second-quotient.png", (205, 2000, 1470, 2240)),
]:
    image.crop(box).save(root / name)
report = {
    "status": "diagnostic only; no source/finalize or passing gate claimed",
    "source": str(source), "source_sha256": layout.sha256_file(source),
    "layout_sha256": layout.sha256_file(Path(layout.__file__)),
    "content_width": content_width,
    "bands": [[int(x), int(y)] for x, y in bands],
    "band_count": len(bands), "state": state,
    "fraction_calls": calls,
}
(root / "report.json").write_text(
    json.dumps(report, ensure_ascii=True, indent=2) + "\n"
)
print(json.dumps(report, ensure_ascii=True, indent=2))
