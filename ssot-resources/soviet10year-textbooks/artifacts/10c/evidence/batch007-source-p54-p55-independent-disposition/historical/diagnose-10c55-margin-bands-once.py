import hashlib
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path("/Users/yong/.codex/worktrees/a07e/lemmadeck")
TOOLS = ROOT / ".claude/skills/ld-s10y-lesson/tools"
sys.path.insert(0, str(TOOLS))
import blocks
import layout

T = ROOT / ".intentfold/tickets/STEMROBIN-184/tmp"
OUT = T / "source-10c-p55-margin-diagnostic"
PAGE = ROOT / "ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0055"
WORK = ROOT / ".tmp/ld-s10y-lesson/10c/pages/0055"
assert not OUT.exists(), "One read-only diagnostic only"
digest = lambda file: hashlib.sha256(file.read_bytes()).hexdigest()
protected = {
    str(file): digest(file)
    for file in [
        TOOLS / "layout.py",
        *PAGE.glob("*.*"),
        *WORK.glob("*.*"),
        *WORK.glob("figures/*.png"),
        T / "source-10c-p54-p55-independent-source-first.md",
        T / "source-10c-p54-p55-independent-review.md",
    ]
    if file.is_file()
}
assert digest(PAGE / "page.md") == "5b9c7af4278211419d78157e30fa3d8bb6c4c203c75762dcc1deb4df4fe757c2"
assert digest(WORK / "page.png") == "d6dc690b00c551b7c15c7392b574a0a62ac304c02aa33bfaec74e237eac1e7c4"
meta, parsed = blocks.parse((PAGE / "page.md").read_text())
audit = json.loads((PAGE / "audit.json").read_text())
assert audit["lines_printed"] == 17 and audit["lines_md"] == 15
image = Image.open(WORK / "page.png")
ink = layout.ink_mask(image)
masked = ink.copy()
for figure in audit["figures"]:
    x, y, w, h = figure["box"]
    masked[max(0, y):y + h, max(0, x):x + w] = False
masked = layout.counting_ink(masked, meta.get("count_exclusions", []))
columns = np.flatnonzero(ink.any(axis=0))
width = int(columns[-1] - columns[0] + 1)
bands = layout.line_bands(masked, width)
details = []
for index, (a, b) in enumerate(bands, 1):
    local = masked[a:b + 1]
    xs = np.flatnonzero(local.any(axis=0))
    details.append({
        "band": index, "y": [a, b], "x": [int(xs[0]), int(xs[-1])],
        "height": b - a + 1, "pixels": int(local.sum()),
    })
result = {
    "role": "READ_ONLY_AFFECTED_BAND_DIAGNOSTIC_NOT_SOURCE_REVIEW",
    "machineCount": len(bands), "bodyCount": blocks.printed_lines(parsed),
    "bands": details, "protected": protected,
    "limits": "Current masks only; no new exclusions/overrides, image payloads or visual opens, source/crop/tool edits, finalize, retry, source approval or physical-origin attribution.",
}
for file, value in protected.items():
    assert digest(Path(file)) == value
OUT.mkdir()
(OUT / "diagnostic.json").write_text(json.dumps(result, indent=2) + "\n")
print(json.dumps(result, indent=2))
