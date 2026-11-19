import importlib.util
import json
import sys
import unittest
from pathlib import Path
from unittest.mock import patch

import numpy as np

ROOT = Path("/Users/yong/.codex/worktrees/d9b1/lemmadeck")
assert Path.cwd() == ROOT
BASE = ROOT / ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13"
CANDIDATE = BASE / "counter-owned/layout.py"
factory = importlib.util.spec_from_file_location
spec = factory("layout", CANDIDATE)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
sys.modules["layout"] = module
tests = ROOT / ".claude/skills/ld-s10y-lesson/tests"
patterns = sorted(path.name for path in tests.glob("test*fract*.py")
                  if path.name != "test_wrapped_fraction_baselines.py")
patterns += ["test_layout.py", "test_footnote_separator_row.py",
             "test_radical_overbar_margin_outline.py"]


def candidate_spec(name, location, *args, **kwargs):
    if Path(location) == ROOT / ".claude/skills/ld-s10y-lesson/tools/layout.py":
        location = CANDIDATE
    return factory(name, location, *args, **kwargs)


with patch("importlib.util.spec_from_file_location", candidate_spec):
    suite = unittest.TestSuite()
    loader = unittest.TestLoader()
    for pattern in patterns:
        suite.addTests(loader.discover(str(tests), pattern=pattern))
    result = unittest.TextTestRunner(verbosity=2).run(suite)

ink = np.zeros((165, 560), bool)
for top in (0, 90):
    ink[top:top + 25, 110:128] = True
    ink[top + 35:top + 38, 80:180] = True
    ink[top + 50:top + 75, 130:148] = True
limitations = {}
for name, source in [
    ("head", BASE / "counter-owned/head-layout.py"),
    ("before", BASE / "counter-affected/.claude__skills__ld-s10y-lesson__tools__layout.py"),
    ("candidate", CANDIDATE),
]:
    spec = factory(name, source)
    probe = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(probe)
    limitations[name] = probe._single_fraction_row(ink, 0, 164, 33)
report = {
    "status": "pass" if result.wasSuccessful() else "fail",
    "candidate": str(CANDIDATE),
    "patterns": patterns,
    "testsRun": result.testsRun,
    "skipped": len(result.skipped),
    "failures": len(result.failures),
    "errors": len(result.errors),
    "sameColumnFractionExploratoryLimitation": {
        "expectedSingleRow": False,
        "observed": limitations,
        "notCausedByThisPatch": len(set(limitations.values())) == 1,
        "notUsedForSourceAcceptance": True,
    },
    "userHelperTestsExcluded": True,
}
with (BASE / "counter-owned/test-result-FIRST.json").open("x") as stream:
    json.dump(report, stream, indent=2)
    stream.write("\n")
print(json.dumps(report))
sys.exit(0 if result.wasSuccessful() else 1)
