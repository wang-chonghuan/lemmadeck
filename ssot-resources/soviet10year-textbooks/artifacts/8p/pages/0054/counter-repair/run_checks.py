"""Reuse existing bounded counter runner against only private snapshots."""
import difflib
import importlib.util
import json
import os
from pathlib import Path
import sys
import tempfile

ROOT = Path("/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-180")
OUT = ROOT / ".tmp/180-7-p54-counter"
assert Path.cwd() == ROOT
sys.dont_write_bytecode = True
sys.path.insert(0, str(ROOT / ".claude/skills/ld-s10y-lesson/tools"))
spec = importlib.util.spec_from_file_location(
    "existing_runner", ROOT / ".tmp/180-7-n8-counter-next/run_checks.py"
)
runner = importlib.util.module_from_spec(spec)
spec.loader.exec_module(runner)
label = sys.argv[1]
assert label in ("baseline", "candidate")
destination = OUT / label
temporary = destination / "render-temp"
temporary.mkdir(exist_ok=True)
os.environ["TMPDIR"] = str(temporary)
tempfile.tempdir = str(temporary)
owner = runner.load("layout", destination / "layout.py")
groups = {
    "focused": [OUT / "test_counter.py"],
    "prior_focused": runner.GROUPS["prior_focused"],
    "shared": runner.GROUPS["shared"],
}
bindings = [
    ROOT / ".tmp/ld-s10y-lesson/8p/pages/0054/page.png",
    ROOT / ".tmp/ld-s10y-lesson/8p/pages/0031/page.png",
    *sorted((ROOT /
        "ssot-resources/soviet10year-textbooks/artifacts/8p/pages/0054").rglob("*")),
]
before = {str(p.relative_to(ROOT)): runner.sha(p) for p in bindings if p.is_file()}
report = {
    "cwd": str(ROOT), "argv": sys.argv, "layout_sha256": runner.sha(destination / "layout.py"),
    "test_hashes": {str(p.relative_to(ROOT)): runner.sha(p)
                    for paths in groups.values() for p in paths},
}
reuse = "--focused-only" in sys.argv
previous = json.loads((destination / "results.json").read_text()) if reuse else None
if previous:
    assert report["layout_sha256"] == previous["layout_sha256"]
for name, paths in groups.items():
    if reuse and name != "focused":
        assert all(report["test_hashes"][str(p.relative_to(ROOT))]
                   == previous["test_hashes"][str(p.relative_to(ROOT))] for p in paths)
        report[name] = previous[name]
    else:
        report[name] = runner.run(paths, name, destination)
report["unchanged_prior_and_shared_evidence_reused"] = reuse
test = sys.modules["focused_0"].Page54CounterTests
report["page54_bands"] = owner.line_bands(test.ink, 1690)
report["input_hashes"] = before
report["inputs_unchanged"] = before == {
    str(p.relative_to(ROOT)): runner.sha(p) for p in bindings if p.is_file()
}
report["live_layout_hash_at_end"] = runner.sha(runner.TOOLS / "layout.py")
report["exit_code"] = int(any(
    report[name]["failures"] or report[name]["errors"] for name in groups
) or not report["inputs_unchanged"])
(destination / "results.json").write_text(json.dumps(report, indent=2) + "\n")
if label == "candidate":
    diff = "".join(difflib.unified_diff(
        (OUT / "baseline/layout.py").read_text().splitlines(keepends=True),
        (OUT / "candidate/layout.py").read_text().splitlines(keepends=True),
        fromfile="baseline/layout.py", tofile="candidate/layout.py",
    ))
    (OUT / "candidate.diff").write_text(diff)
print(json.dumps({k: v for k, v in report.items()
                  if k not in ("test_hashes", "input_hashes")}, indent=2))
raise SystemExit(report["exit_code"])
