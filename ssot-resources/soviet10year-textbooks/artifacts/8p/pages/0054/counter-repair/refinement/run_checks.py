"""Run unchanged p54 controls and the existing bounded counter groups."""
import difflib
import importlib.util
import json
import os
from pathlib import Path
import sys
import tempfile
import unittest

ROOT = Path("/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-180")
OUT = ROOT / ".tmp/180-7-p54-counter/refinement"
assert Path.cwd() == ROOT
sys.dont_write_bytecode = True
TOOLS = ROOT / ".claude/skills/ld-s10y-lesson/tools"
sys.path.insert(0, str(TOOLS))
spec = importlib.util.spec_from_file_location(
    "existing_runner", ROOT / ".tmp/180-7-n8-counter-next/p53-only/run.py"
)
runner = importlib.util.module_from_spec(spec)
spec.loader.exec_module(runner)
label = sys.argv[1]
destination = OUT / label
assert destination.parent == OUT and destination.is_dir()
temporary = destination / "render-temp"
temporary.mkdir(exist_ok=True)
os.environ["TMPDIR"] = str(temporary)
tempfile.tempdir = str(temporary)
owner = runner.load("layout", destination / "layout.py")
loader = unittest.defaultTestLoader
p54_path = OUT.parent / "test_counter.py"
p53_path = TOOLS / "test_line_bands_counter_rows.py"
p54 = runner.load("p54_controls", p54_path)
p53 = runner.load("p53_controls", p53_path)
paths = {
    "prior_focused": [TOOLS / "test_line_bands_margin_rounding.py"],
    "shared": [
        TOOLS / "test_line_bands_fragmented_margin.py",
        TOOLS / "test_line_bands_margin_core.py",
        TOOLS / "test_line_bands_fraction.py",
        TOOLS / "test_line_bands_short_continuation.py",
        TOOLS.parent / "tests/test_layout.py",
        TOOLS.parent / "tests/test_hollow_margin_blots.py",
    ],
}
groups = {
    "p54": loader.loadTestsFromTestCase(p54.Page54CounterTests),
    "p53": loader.loadTestsFromTestCase(p53.CounterPage53Tests),
    "guard": loader.loadTestsFromTestCase(p53.CounterEmptyCoreTests),
}
extra = OUT / "test_typography.py"
if extra.is_file():
    module = runner.load("typography", extra)
    groups["typography"] = loader.loadTestsFromTestCase(module.SmallerTypeRecoveryTests)
for name, items in paths.items():
    suite = unittest.TestSuite()
    for index, path in enumerate(items):
        suite.addTests(loader.loadTestsFromModule(runner.load(f"{name}_{index}", path)))
    groups[name] = suite
bindings = [
    p54_path, p53_path, OUT.parent / "report.md",
    OUT.parent / "candidate/layout.py", OUT.parent / "candidate/results.json",
    OUT.parent / "baseline/layout.py", OUT.parent / "candidate.diff",
    ROOT / ".tmp/ld-s10y-lesson/8p/pages/0054/page.png",
    ROOT / ".tmp/ld-s10y-lesson/8p/pages/0031/page.png",
    *sorted((ROOT /
        "ssot-resources/soviet10year-textbooks/artifacts/8p/pages/0054").rglob("*")),
]
before = {str(p.relative_to(ROOT)): runner.sha(p) for p in bindings if p.is_file()}
report = {
    "cwd": str(ROOT), "argv": sys.argv,
    "layout_sha256": runner.sha(destination / "layout.py"),
    "current_base_sha256": runner.sha(OUT / "current-base/layout.py"),
    "test_hashes": {str(p.relative_to(ROOT)): runner.sha(p)
                    for p in [p54_path, p53_path, *[p for ps in paths.values() for p in ps],
                              *([extra] if extra.is_file() else [])]},
    "new_images": 0, "images_cumulative": 3, "no_finalize": True,
}
for name, suite in groups.items():
    if "--p54-only" in sys.argv and name not in ("p54", "typography"):
        continue
    report[name] = runner.run(suite, destination, name)
    print(f"{name}: {json.dumps(report[name])}", flush=True)
report["page54_bands"] = owner.line_bands(p54.Page54CounterTests.ink, 1690)
report["bindings"] = before
report["bindings_unchanged"] = before == {
    str(p.relative_to(ROOT)): runner.sha(p) for p in bindings if p.is_file()
}
report["live_layout_sha256"] = runner.sha(TOOLS / "layout.py")
report["exit_code"] = int(not report["bindings_unchanged"] or any(
    report[name]["failures"] or report[name]["errors"] for name in groups if name in report
))
(destination / "results.json").write_text(json.dumps(report, indent=2) + "\n")
diff = "".join(difflib.unified_diff(
    (OUT / "current-base/layout.py").read_text().splitlines(keepends=True),
    (destination / "layout.py").read_text().splitlines(keepends=True),
    fromfile="current-base/layout.py", tofile=f"{label}/layout.py",
))
(destination / "candidate.diff").write_text(diff)
print(json.dumps({k: report[k] for k in ("layout_sha256", "bindings_unchanged", "exit_code")}))
raise SystemExit(report["exit_code"])
