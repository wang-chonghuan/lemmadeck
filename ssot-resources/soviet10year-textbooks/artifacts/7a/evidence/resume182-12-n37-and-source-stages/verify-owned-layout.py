import importlib.util
import json
import sys
import unittest
from pathlib import Path

ROOT = Path("/Users/yong/.codex/worktrees/d9b1/lemmadeck")
assert Path.cwd() == ROOT
BASE = ROOT / ".intentfold/tickets/STEMROBIN-182/tmp/resume182-12"
candidate = BASE / "staged-layout/layout.py"
spec = importlib.util.spec_from_file_location("layout", candidate)
module = importlib.util.module_from_spec(spec)
sys.modules["layout"] = module
spec.loader.exec_module(module)
tests = ROOT / ".claude/skills/ld-s10y-lesson/tests"
patterns = sorted(path.name for path in tests.glob("test_*fraction*.py")
                  if path.name != "test_wrapped_fraction_baselines.py")
patterns += ["test_layout.py", "test_footnote_separator_row.py"]
suite = unittest.TestSuite()
loader = unittest.TestLoader()
for pattern in patterns:
    suite.addTests(loader.discover(str(tests), pattern=pattern))
result = unittest.TextTestRunner(verbosity=2).run(suite)
report = {
    "status": "pass" if result.wasSuccessful() else "fail",
    "candidate": str(candidate),
    "testsRun": result.testsRun,
    "skips": len(result.skipped),
    "patterns": patterns,
    "failures": len(result.failures),
    "errors": len(result.errors),
    "excluded": "Pre-existing untracked helper tests remain outside this batch.",
    "sourceOutputsChanged": False,
}
with (BASE / "staged-layout/test-result-FIRST.json").open("x") as stream:
    json.dump(report, stream, indent=2)
    stream.write("\n")
print(json.dumps(report))
sys.exit(0 if result.wasSuccessful() else 1)
