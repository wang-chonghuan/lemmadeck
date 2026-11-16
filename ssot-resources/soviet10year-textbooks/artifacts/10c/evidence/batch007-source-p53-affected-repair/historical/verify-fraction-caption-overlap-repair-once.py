import hashlib
import io
import json
import sys
import unittest
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path.cwd()
TOOLS = ROOT / ".claude/skills/ld-s10y-lesson/tools"
TESTS = ROOT / ".claude/skills/ld-s10y-lesson/tests"
sys.path[:0] = [str(TOOLS), str(TESTS)]
import blocks
import layout

OUT = ROOT / ".intentfold/tickets/STEMROBIN-184/tmp/source-10c-p53-row-core-guard/overlap-repair"
assert not OUT.exists(), "Affected overlap repair verification only once"
digest = lambda file: hashlib.sha256(file.read_bytes()).hexdigest()
PAGE = ROOT / "ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0053"
WORK = ROOT / ".tmp/ld-s10y-lesson/10c/pages/0053"
protected = {str(file): digest(file) for file in [
    *PAGE.glob("*.*"), *WORK.glob("*.*"), *WORK.glob("figures/*.png"),
]}
OUT.mkdir()
names = [
    "test_fraction_line_spacing.FractionLineSpacing.test_fraction_prose_and_side_caption_share_one_printed_row",
    "test_fraction_caption_rows",
]
(OUT / "start.json").write_text(json.dumps({
    "role": "AFFECTED_OVERLAP_BRANCH_TEST_AND_PAGE53_COUNT_ONLY",
    "tests": names, "cwd": str(ROOT), "protected": protected,
    "layout": digest(TOOLS / "layout.py"),
}, indent=2) + "\n")
stream = io.StringIO()
result = unittest.TextTestRunner(stream=stream, verbosity=2).run(
    unittest.defaultTestLoader.loadTestsFromNames(names)
)
(OUT / "tests.txt").write_text(stream.getvalue())
print(stream.getvalue())
assert result.wasSuccessful()
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
for file, sha in protected.items():
    assert digest(Path(file)) == sha
record = {
    "testsRun": result.testsRun, "failures": len(result.failures), "errors": len(result.errors),
    "machineRows": len(bands), "bodyRows": blocks.printed_lines(parsed), "bands": bands,
    "sourceCropAuditUnchanged": True, "protected": protected,
    "limits": "No full-suite repeat, image emitted/opened, source/crop/metadata edits, finalize, threshold/exclusion/override or source approval.",
}
(OUT / "result.json").write_text(json.dumps(record, indent=2) + "\n")
print(json.dumps(record, indent=2))
assert record["machineRows"] == record["bodyRows"] == 20
