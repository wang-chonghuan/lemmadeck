import hashlib
import importlib.util
import json
import subprocess
import sys
import unittest
from pathlib import Path

from PIL import Image

repo = Path("/Users/yong/.codex/worktrees/d9b1/lemmadeck")
assert Path.cwd() == repo
root = repo / ".intentfold/tickets/STEMROBIN-182/tmp/resume182-8"
snapshot = root / "index-layout.py"
code = subprocess.check_output(
    ["git", "show", ":.claude/skills/ld-s10y-lesson/tools/layout.py"], cwd=repo
)
with snapshot.open("xb") as output:
    output.write(code)
spec = importlib.util.spec_from_file_location("layout", snapshot)
layout = importlib.util.module_from_spec(spec)
sys.modules["layout"] = layout
spec.loader.exec_module(layout)
counts = []
for page, expected in [(205, 24), (206, 20)]:
    image_path = repo / f".tmp/ld-s10y-lesson/7a/pages/{page:04d}/page.png"
    with Image.open(image_path) as image:
        ink = layout.ink_mask(image)
        columns = ink.any(axis=0).nonzero()[0]
        width = int(columns[-1] - columns[0] + 1) if columns.size else image.width
        actual = len(layout.line_bands(ink, width))
    assert actual == expected, (page, actual, expected)
    counts.append({"page": page, "expected": expected, "actual": actual})
    print(f"Staged-only counter {page}: {actual}/{expected}")
test_path = repo / ".claude/skills/ld-s10y-lesson/tests/test_system_labels_fraction_tail.py"
test_spec = importlib.util.spec_from_file_location("owned_counter_tests", test_path)
tests = importlib.util.module_from_spec(test_spec)
test_spec.loader.exec_module(tests)
suite = unittest.defaultTestLoader.loadTestsFromModule(tests)
result = unittest.TextTestRunner(verbosity=2).run(suite)
assert result.wasSuccessful()
record = {
    "status": "pass",
    "stagedLayoutSha256": hashlib.sha256(code).hexdigest(),
    "actualCounts": counts,
    "focusedTests": result.testsRun,
    "preexistingFractionBaselineHunksInStagedCode": "_fraction_baselines" in code.decode(),
    "sourceOrAuditRewritten": False,
    "pipelineFinalizersRerun": False,
    "imagesLoadedIntoModelContext": 0,
}
assert not record["preexistingFractionBaselineHunksInStagedCode"]
with (root / "index-counter-result.json").open("x", encoding="utf-8") as output:
    json.dump(record, output, indent=2)
    output.write("\n")
print(json.dumps(record))
