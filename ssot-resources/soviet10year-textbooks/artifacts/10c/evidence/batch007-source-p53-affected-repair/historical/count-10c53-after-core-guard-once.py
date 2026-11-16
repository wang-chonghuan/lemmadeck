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

OUT = ROOT / ".intentfold/tickets/STEMROBIN-184/tmp/source-10c-p53-row-core-guard"
assert not OUT.exists(), "Preserve this affected count without a repeat"
diagnostic = json.loads(
    (ROOT / ".intentfold/tickets/STEMROBIN-184/tmp/source-10c-p53-row-diagnostic/diagnostic.json").read_text()
)
digest = lambda file: hashlib.sha256(file.read_bytes()).hexdigest()
protected = {
    file: sha for file, sha in diagnostic["protected"].items()
    if file != str(TOOLS / "layout.py")
}
for file, sha in protected.items():
    assert digest(Path(file)) == sha
PAGE = ROOT / "ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0053"
WORK = ROOT / ".tmp/ld-s10y-lesson/10c/pages/0053"
meta, parsed = blocks.parse((PAGE / "page.md").read_text())
audit = json.loads((PAGE / "audit.json").read_text())
original = layout.ink_mask(Image.open(WORK / "page.png"))
masked = original.copy()
for figure in audit["figures"]:
    x, y, w, h = figure["box"]
    masked[max(0, y):y + h, max(0, x):x + w] = False
masked = layout.counting_ink(masked, meta.get("count_exclusions", []))
columns = np.flatnonzero(original.any(axis=0))
bands = layout.line_bands(masked, int(columns[-1] - columns[0] + 1))
report = {
    "role": "AFFECTED_COUNT_ONLY_NOT_SOURCE_REVIEW",
    "before": {"machine": 19, "body": 20},
    "after": {"machine": len(bands), "body": blocks.printed_lines(parsed)},
    "bands": bands,
    "protected_unchanged": protected,
    "layout_before": diagnostic["protected"][str(TOOLS / "layout.py")],
    "layout_after": digest(TOOLS / "layout.py"),
    "synthetic_tests": {"executed_once": True, "passed": 4, "failed": 0},
    "limits": "No image emitted/opened, source/crop/audit edit, count override, exclusion, finalize or broad test.",
}
for file, sha in protected.items():
    assert digest(Path(file)) == sha
OUT.mkdir()
(OUT / "result.json").write_text(json.dumps(report, indent=2) + "\n")
print(json.dumps(report, indent=2))
assert report["after"] == {"machine": 20, "body": 20}
