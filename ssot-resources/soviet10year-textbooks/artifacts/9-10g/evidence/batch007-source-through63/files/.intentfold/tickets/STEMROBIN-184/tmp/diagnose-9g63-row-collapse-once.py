import hashlib
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image

sys.path.insert(0, ".claude/skills/ld-s10y-lesson/tools")
import layout


root = Path(".intentfold/tickets/STEMROBIN-184/tmp/source-9g-p63-row-diagnostic")
assert not root.exists(), "Preserve the first row diagnostic"
page = Path("ssot-resources/soviet10year-textbooks/artifacts/9-10g/pages/0063")
image = Path(".tmp/ld-s10y-lesson/9-10g/pages/0063/page.png")
selection = Path(
    ".intentfold/tickets/STEMROBIN-184/tmp/"
    "source-9g-p63-selection-diagnostic/diagnostic.json"
)
tool = Path(layout.__file__)
digest = lambda file: hashlib.sha256(file.read_bytes()).hexdigest()
before = {str(file): digest(file) for file in [image, selection, tool, *page.iterdir()]}
assert digest(image) == "f83211d4d4952b88719cf5fb93f348ac2bfdbb9c53bf32080e2fb05c5b68d795"
audit = json.loads((page / "audit.json").read_text())
ink = layout.ink_mask(Image.open(image))
for figure in audit["figures"]:
    x, y, w, h = figure["box"]
    ink[y:y + h, x:x + w] = False
columns = np.flatnonzero(ink.any(axis=0))
content_width = int(columns[-1] - columns[0] + 1)
calls = []
stages = []


def plain(value):
    if isinstance(value, np.generic):
        return value.item()
    if isinstance(value, slice):
        return [value.start, value.stop]
    if isinstance(value, (list, tuple)):
        return [plain(item) for item in value]
    if isinstance(value, dict):
        return {str(key): plain(item) for key, item in value.items()}
    return value


def trace(frame, event, result):
    if frame.f_code.co_filename != str(tool):
        return trace
    name = frame.f_code.co_name
    values = frame.f_locals
    if name == "line_bands" and event == "line":
        if frame.f_lineno in (490, 552, 576, 657):
            stages.append({
                "line": frame.f_lineno,
                "lineHeight": values.get("line_h"),
                "glyphHeight": values.get("glyph_h"),
                "raw": values.get("raw"),
                "merged": values.get("merged"),
                "joined": values.get("joined"),
                "fractionStarts": sorted(values.get("fraction_starts", [])),
            })
    if event == "return" and name in (
        "_single_fraction_row", "_subscript_continues", "_fraction_tail_split"
    ):
        a, b = values.get("a"), values.get("b")
        if a is not None and b is not None and a <= 1772 and b >= 1587:
            calls.append({
                "function": name,
                "returnLine": frame.f_lineno,
                "a": a,
                "b": b,
                "split": values.get("split"),
                "lineHeight": values.get("line_h"),
                "glyphHeight": values.get("glyph_h"),
                "result": plain(result),
                "rules": values.get("rules"),
                "remaining": plain(values["remaining"].tolist())
                if "remaining" in values else None,
                "glyphBounds": values.get("glyph_bounds"),
                "cores": values.get("cores"),
            })
    return trace


sys.settrace(trace)
bands = layout.line_bands(ink, content_width)
sys.settrace(None)
components, _ = layout.ndimage.label(ink[1587:1773])
component_records = [
    {
        "id": component_id,
        "box": [
            columns.start, 1587 + rows.start,
            columns.stop - columns.start, rows.stop - rows.start,
        ],
        "pixels": int(np.count_nonzero(components[bounds] == component_id)),
    }
    for component_id, bounds in enumerate(layout.ndimage.find_objects(components), 1)
    if bounds is not None
    for rows, columns in [bounds]
]
result = {
    "status": "READ_ONLY_ROW_COLLAPSE_DIAGNOSTIC",
    "protected": before,
    "contentWidth": content_width,
    "bands": bands,
    "count": len(bands),
    "stages": plain(stages),
    "callsAroundZeroVector": plain(calls),
    "componentsAroundZeroVector": component_records,
    "limits": "No source/tool/crop edits, images emitted/opened, overrides, exclusions or source review.",
}
for file, sha in before.items():
    assert digest(Path(file)) == sha
root.mkdir()
(root / "diagnostic.json").write_text(json.dumps(result, indent=2) + "\n")
print(json.dumps({"count": len(bands), "stages": len(stages), "calls": plain(calls)}, indent=2))
