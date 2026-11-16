import hashlib
import json
import shutil
import subprocess
import sys
from pathlib import Path

import numpy as np
from PIL import Image

sys.path.insert(0, ".claude/skills/ld-s10y-lesson/tools")
import layout


root = Path(".intentfold/tickets/STEMROBIN-184/tmp/source-9g-p63-counter-repair")
tool = Path(layout.__file__)
page = Path("ssot-resources/soviet10year-textbooks/artifacts/9-10g/pages/0063")
image = Path(".tmp/ld-s10y-lesson/9-10g/pages/0063/page.png")
digest = lambda file: hashlib.sha256(file.read_bytes()).hexdigest()
mode = sys.argv[1]
if mode == "before":
    assert not root.exists(), "Preserve the first repair checkpoint"
    root.mkdir()
    shutil.copy2(tool, root / "layout.before.py")
    protected = {
        str(file): digest(file)
        for file in [image, *page.iterdir()]
    }
    (root / "before.json").write_text(json.dumps({
        "tool": {"path": str(tool), "sha256": digest(tool)},
        "protected": protected,
        "basis": "Frozen independent63 StageB and read-only row diagnostic; no source-row repair.",
    }, indent=2) + "\n")
elif mode == "verify":
    assert not (root / "verification.json").exists(), "One focused repair verification"
    before = json.loads((root / "before.json").read_text())
    for file, sha in before["protected"].items():
        assert digest(Path(file)) == sha
    test_args = [
        "-B", "-m", "unittest", "discover",
        "-s", ".claude/skills/ld-s10y-lesson/tests",
        "-p", "test_*rows.py",
    ]
    test = subprocess.run([sys.executable, *test_args], capture_output=True, text=True)
    (root / "tests.stdout.txt").write_text(test.stdout)
    (root / "tests.stderr.txt").write_text(test.stderr)
    ink = layout.ink_mask(Image.open(image))
    audit = json.loads((page / "audit.json").read_text())
    for figure in audit["figures"]:
        x, y, w, h = figure["box"]
        ink[y:y + h, x:x + w] = False
    columns = np.flatnonzero(ink.any(axis=0))
    width = int(columns[-1] - columns[0] + 1)
    bands = layout.line_bands(ink, width)
    result = {
        "status": "AFFECTED_COUNTER_REPAIR_ONLY",
        "testCommand": [sys.executable, *test_args],
        "testExit": test.returncode,
        "toolBefore": before["tool"],
        "toolAfter": {"path": str(tool), "sha256": digest(tool)},
        "bands": bands,
        "printedCount": len(bands),
        "unchangedTranscribedCount": audit["lines_md"],
        "protected": before["protected"],
        "limits": "No source/crop/audit repair, finalize, image review, override or exclusion.",
    }
    for file, sha in before["protected"].items():
        assert digest(Path(file)) == sha
    (root / "verification.json").write_text(json.dumps(result, indent=2) + "\n")
    print(test.stderr)
    print(json.dumps(result, indent=2))
    assert test.returncode == 0, "Preserve the actual focused-test failure"
    assert len(bands) == audit["lines_md"], "Preserve unresolved counter failure"
else:
    raise ValueError("Expected before or verify")
