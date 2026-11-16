import hashlib
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path.cwd()
TOOLS = ROOT / ".claude/skills/ld-s10y-lesson/tools"
sys.path.insert(0, str(TOOLS))
import blocks
import layout

OUT = ROOT / ".intentfold/tickets/STEMROBIN-184/tmp/source-10c-p53-row-diagnostic"
PAGE = ROOT / "ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0053"
WORK = ROOT / ".tmp/ld-s10y-lesson/10c/pages/0053"
assert not OUT.exists(), "Preserve first diagnostic without retry"
digest = lambda file: hashlib.sha256(file.read_bytes()).hexdigest()
protected = {
    str(file): digest(file)
    for file in [TOOLS / "layout.py", *PAGE.iterdir(), *WORK.glob("*.*"), *WORK.glob("figures/*.png")]
    if file.is_file()
}
assert digest(WORK / "page.png") == "10c637fa27f71059839822d4f579bde1cceb2f27084cbf00e14077779c1af333"
assert digest(PAGE / "page.md") == "78d8acf0f75f7f2485267129fa8af24e154719bd33c0253892cae03bb142c562"
meta, parsed = blocks.parse((PAGE / "page.md").read_text())
audit = json.loads((PAGE / "audit.json").read_text())
assert audit["lines_printed"] == 19 and audit["lines_md"] == 20
image = Image.open(WORK / "page.png")
original = layout.ink_mask(image)
masked = original.copy()
for figure in audit["figures"]:
    x, y, w, h = figure["box"]
    masked[max(0, y):y + h, max(0, x):x + w] = False
masked = layout.counting_ink(masked, meta.get("count_exclusions", []))
cols = np.flatnonzero(original.any(axis=0))
width = int(cols[-1] - cols[0] + 1)
calls = []
state = {}


def plain(value):
    if isinstance(value, np.generic):
        return value.item()
    if isinstance(value, np.ndarray):
        return value.tolist()
    if isinstance(value, slice):
        return [value.start, value.stop]
    if isinstance(value, (list, tuple)):
        return [plain(item) for item in value]
    if isinstance(value, set):
        return plain(sorted(value))
    if isinstance(value, dict):
        return {str(key): plain(item) for key, item in value.items()}
    return value


def trace(frame, event, result):
    if frame.f_code.co_filename != str(TOOLS / "layout.py") or event != "return":
        return trace
    name = frame.f_code.co_name
    values = frame.f_locals
    if name == "line_bands":
        state["processed_ink"] = values["ink"].copy()
        for key in ["line_h", "glyph_h", "typical_h", "typical_gap", "pitch", "raw", "joined", "fraction_starts"]:
            state[key] = plain(values.get(key))
    elif name in ["_single_fraction_row", "_subscript_continues", "_fraction_tail_split"]:
        calls.append({
            "function": name, "returnLine": frame.f_lineno, "result": plain(result),
            **{key: plain(values.get(key)) for key in
               ["a", "b", "split", "line_h", "glyph_h", "rules", "remaining", "glyph_bounds", "cores"]},
        })
    return trace


sys.settrace(trace)
try:
    bands = layout.line_bands(masked, width)
finally:
    sys.settrace(None)
processed = state.pop("processed_ink")
details = []
for index, (a, b) in enumerate(bands, 1):
    local = processed[a:b + 1]
    xs = np.flatnonzero(local.any(axis=0))
    details.append({
        "band": index, "y": [a, b], "x": [int(xs[0]), int(xs[-1])],
        "height": b - a + 1, "pixels": int(local.sum()),
    })
report = {
    "role": "READ_ONLY_AFFECTED_ROW_DIAGNOSTIC_NOT_SOURCE_REVIEW",
    "protected": protected, "contentWidth": width, "bands": details,
    "machineCount": len(bands), "bodyCount": blocks.printed_lines(parsed),
    "state": state, "calls": calls,
    "limits": "No source/tool/crop edits, images emitted/opened, overrides, exclusions, finalize, or acceptance.",
}
for file, sha in protected.items():
    assert digest(Path(file)) == sha
OUT.mkdir()
(OUT / "diagnostic.json").write_text(json.dumps(report, indent=2) + "\n")
print(json.dumps({"machineCount": len(bands), "bodyCount": report["bodyCount"], "bands": details, "state": state}, indent=2))
