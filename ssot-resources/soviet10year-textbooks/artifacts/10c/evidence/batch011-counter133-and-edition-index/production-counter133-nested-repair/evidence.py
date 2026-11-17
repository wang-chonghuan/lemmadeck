"""Command and preservation evidence for the bounded zero-image counter repair."""
from __future__ import annotations

from datetime import datetime, timezone
import argparse
import hashlib
import json
import os
from pathlib import Path
import shlex
import shutil
import subprocess
import sys
import time

sys.dont_write_bytecode = True
ROOT = Path("/Users/yong/.codex/worktrees/a07e/lemmadeck")
TOOLS = ROOT / ".claude/skills/ld-s10y-lesson/tools"
OUT = ROOT / ".intentfold/tickets/STEMROBIN-184/tmp/production-counter133-nested-repair"
DIAG = ROOT / ".intentfold/tickets/STEMROBIN-184/tmp/production-source125-133-count-diagnosis"
SOURCE = ROOT / ".intentfold/tickets/STEMROBIN-184/tmp/production-source10c130-133/10c/pages/0133/page.png"
PAGE = ROOT / "ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0133"
FIRST = ROOT / ".intentfold/tickets/STEMROBIN-184/tmp/production-source10c130-133-first-finalize/0133"
EXPECTED_LAYOUT_SHA = "211f8b194c1fae5d5ab87543ea13931811d44574386d1082dc9eab816afde389"
TEST = TOOLS / "test_layout_nested_fraction_rows.py"


def stamp():
    return datetime.now(timezone.utc).isoformat()


def sha(path):
    with Path(path).open("rb") as stream:
        return hashlib.file_digest(stream, "sha256").hexdigest()


def dump(path, data):
    path = Path(path)
    assert path.is_relative_to(OUT)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2, ensure_ascii=True) + "\n")


def append(path, data):
    with Path(path).open("a") as stream:
        stream.write(json.dumps(data, ensure_ascii=True) + "\n")
        stream.flush()
        os.fsync(stream.fileno())


def logged_subprocess(argv, cwd, label):
    logdir = OUT / "commands" / (
        datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%S%fZ") + "-" + label
    )
    logdir.mkdir(parents=True)
    started = stamp()
    clock = time.monotonic()
    process = subprocess.run(
        argv, cwd=cwd, capture_output=True, env=dict(os.environ, PYTHONDONTWRITEBYTECODE="1")
    )
    elapsed = time.monotonic() - clock
    (logdir / "stdout.txt").write_bytes(process.stdout)
    (logdir / "stderr.txt").write_bytes(process.stderr)
    record = {
        "argv": argv, "shell_command": shlex.join(argv), "cwd": str(cwd),
        "started": started, "finished": stamp(), "elapsed_seconds": elapsed,
        "exit_code": process.returncode, "signal": -process.returncode if process.returncode < 0 else None,
        "status": "pass" if process.returncode == 0 else "fail",
        "stdout_path": str(logdir / "stdout.txt"), "stdout_sha256": sha(logdir / "stdout.txt"),
        "stderr_path": str(logdir / "stderr.txt"), "stderr_sha256": sha(logdir / "stderr.txt"),
        "layout_sha256": sha(TOOLS / "layout.py"),
        "test_sha256": sha(TEST) if TEST.exists() else None,
        "environment_delta": {"PYTHONDONTWRITEBYTECODE": "1"},
    }
    dump(logdir / "command.json", record)
    append(OUT / "commands.jsonl", record)
    sys.stdout.buffer.write(process.stdout)
    sys.stderr.buffer.write(process.stderr)
    print(f"\nCOMMAND_RECORD={logdir / 'command.json'}", flush=True)
    return record


def snapshot():
    assert not (OUT / "baseline.json").exists(), "Baseline already exists"
    assert sha(TOOLS / "layout.py") == EXPECTED_LAYOUT_SHA, "Current layout differs from authorized base"
    assert not TEST.exists(), "Requested new test file already exists; do not overwrite"
    inputs = {
        "layout.py": TOOLS / "layout.py",
        "page.png": SOURCE,
        "page-audit.json": PAGE / "audit.json",
        "page.json": PAGE / "page.json",
        "page.md": PAGE / "page.md",
        "original-layout-trace.json": DIAG / "0133/layout-trace.json",
        "original-inventory.json": DIAG / "0133/inventory.json",
        "original-first-command.json": FIRST / "command.json",
        "original-first-stdout.txt": FIRST / "stdout.txt",
        "original-first-stderr.txt": FIRST / "stderr.txt",
    }
    facts = {}
    for name, path in inputs.items():
        before = sha(path)
        target = OUT / "original" / name
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(path, target)
        assert before == sha(path) == sha(target)
        facts[name] = {"path": str(path), "snapshot": str(target), "sha256": before}
    dump(OUT / "baseline.json", {
        "timestamp": stamp(), "inputs": facts, "authorized_layout_sha256": EXPECTED_LAYOUT_SHA,
        "new_test_preexisting": False, "new_model_image_opens": 0,
        "carried_model_image_consumption": {"assignment": 6, "lifetime": 6},
    })
    print(json.dumps(facts, indent=2))
    print("BASELINE: source already failed at 17/16; no original count or successful gate rerun.")


def read(path, start, end):
    path = Path(path)
    assert path in (
        TOOLS / "layout.py", TEST, DIAG / "0133/layout-trace.json",
        DIAG / "0133/disposition.json", OUT / "report.md",
    )
    text = path.read_text().splitlines(keepends=True)
    sys.stdout.write("".join(text[start - 1:end]))


def test_case(name):
    assert name.startswith("NestedFractionRowsTests.test_")
    ledger = OUT / "test-cases.jsonl"
    prior = [json.loads(line) for line in ledger.read_text().splitlines()] if ledger.exists() else []
    assert not any(item["case"] == name and item["exit_code"] == 0 for item in prior), "PASS rerun forbidden"
    qualified = "test_layout_nested_fraction_rows." + name
    record = logged_subprocess(
        [sys.executable, "-B", "-m", "unittest", "-v", qualified], TOOLS, name
    )
    append(ledger, {"case": name, **record})
    return record["exit_code"]


def affected_count():
    assert not (OUT / "affected-count-consumed.json").exists(), "Affected count already consumed"
    tests = [json.loads(line) for line in (OUT / "test-cases.jsonl").read_text().splitlines()]
    latest = {}
    for item in tests:
        latest[item["case"]] = item
    assert latest and all(item["exit_code"] == 0 for item in latest.values())
    expected = json.loads((OUT / "test-design.json").read_text())["cases"]
    assert set(latest) == {item["case"] for item in expected}
    baseline = json.loads((OUT / "baseline.json").read_text())
    assert sha(SOURCE) == baseline["inputs"]["page.png"]["sha256"]
    assert sha(PAGE / "audit.json") == baseline["inputs"]["page-audit.json"]["sha256"]
    dump(OUT / "affected-count-consumed.json", {"started": stamp(), "source": str(SOURCE), "attempt": 1})
    sys.path.insert(0, str(TOOLS))
    import numpy as np
    from PIL import Image
    import layout
    audit = json.loads((PAGE / "audit.json").read_text())
    with Image.open(SOURCE) as image:
        ink = layout.ink_mask(image)
        masked = ink.copy()
        for figure in audit["figures"]:
            x, y, w, h = figure["box"]
            masked[y:y + h, x:x + w] = False
        masked = layout.counting_ink(masked, audit.get("count_exclusions", []))
        columns = np.flatnonzero(ink.any(axis=0))
        width = int(columns[-1] - columns[0] + 1) if columns.size else image.width
        bands = layout.line_bands(masked, width)
        facts = {
            "timestamp": stamp(), "source": str(SOURCE),
            "source_sha256_before": baseline["inputs"]["page.png"]["sha256"],
            "source_sha256_after": sha(SOURCE), "source_size": list(image.size), "source_mode": image.mode,
            "layout_sha256": sha(TOOLS / "layout.py"), "audit_sha256": sha(PAGE / "audit.json"),
            "count": len(bands), "author_witness_unchanged": audit["lines_md"],
            "bands": [[int(a), int(b)] for a, b in bands],
            "count_exclusions": audit.get("count_exclusions", []),
            "new_model_image_opens": 0, "native_image_payload_emitted": False,
            "method": "Only authorized computational page count, after new focused cases; no finalize",
        }
    dump(OUT / "affected-count.json", facts)
    print(json.dumps(facts, indent=2))
    return 0 if facts["count"] == facts["author_witness_unchanged"] else 1


def failed_probe(name):
    import inspect
    import numpy as np
    ledger = [json.loads(line) for line in (OUT / "test-cases.jsonl").read_text().splitlines()]
    previous = [item for item in ledger if item["case"] == name]
    assert previous and previous[-1]["exit_code"] != 0, "Probe only currently failed new cases"
    sys.path.insert(0, str(TOOLS))
    import layout
    import test_layout_nested_fraction_rows as fixtures
    if name.endswith("test_tall_nested_evaluation_is_one_row"):
        math = fixtures.nested_evaluation()
    elif name.endswith("test_two_independent_fraction_rows_stay_two"):
        math = np.zeros((250, 460), dtype=bool)
        for offset in (0, 120):
            fixtures.glyph(math, 128, 10 + offset, "3", 5)
            math[52 + offset:55 + offset, 100:205] = True
            fixtures.glyph(math, 136, 62 + offset, "2", 5)
    else:
        raise ValueError("Not a bounded failed fixture")
    page = fixtures.page_with_math(math)
    events = []
    source, start = inspect.getsourcelines(layout.line_bands)
    points = {start + index: line.strip() for index, line in enumerate(source)
              if line.strip() in ("joined = []", "typical_h = float(line_h)",
                                  "if count == 1:", "merged = expanded")}
    selected = ("a", "b", "line_h", "glyph_h", "count", "typical_h", "typical_gap", "pitch",
                "rules", "raw", "joined", "merged", "expanded", "fragments", "glyph_rows",
                "strong_rows", "compact_text_rows", "subscript_row", "carrier_row")

    def plain(value):
        if isinstance(value, np.ndarray):
            return value.tolist() if value.size < 200 else {"shape": list(value.shape)}
        if isinstance(value, np.generic):
            return value.item()
        if isinstance(value, (tuple, list)):
            return [plain(item) for item in value]
        if isinstance(value, slice):
            return [value.start, value.stop]
        return value

    def observe(frame, event, value):
        if Path(frame.f_code.co_filename) != TOOLS / "layout.py":
            return observe
        name = frame.f_code.co_name
        state = frame.f_locals
        stage = None
        if name == "line_bands" and event == "line" and frame.f_lineno in points:
            stage = points[frame.f_lineno]
        if name in ("_single_fraction_row", "_fraction_tail_split") and event == "return":
            if 300 <= state.get("a", -1) < 600:
                stage = "helper-return"
        if stage:
            record = {"function": name, "line": frame.f_lineno, "stage": stage,
                      "locals": {key: plain(state[key]) for key in selected if key in state}}
            if event == "return":
                record["return"] = plain(value)
            events.append(record)
        return observe

    sys.settrace(observe)
    try:
        bands = layout.line_bands(page, page.shape[1])
    finally:
        sys.settrace(None)
    result = {"case": name, "timestamp": stamp(), "layout_sha256": sha(TOOLS / "layout.py"),
              "bands": bands, "count": len(bands), "events": events, "model_image_opens": 0}
    dump(OUT / "failed-probes" / f"{name}.json", result)
    print(json.dumps(result, indent=2))


def report():
    import ast
    import difflib
    baseline = json.loads((OUT / "baseline.json").read_text())
    final = {}
    for name, facts in baseline["inputs"].items():
        final[name] = {
            **facts, "final_sha256": sha(facts["path"]),
            "unchanged": sha(facts["path"]) == facts["sha256"],
            "snapshot_unchanged": sha(facts["snapshot"]) == facts["sha256"],
        }
        assert final[name]["snapshot_unchanged"]
        if name != "layout.py":
            assert final[name]["unchanged"], f"Input changed: {name}"
    original = Path(baseline["inputs"]["layout.py"]["snapshot"]).read_text()
    current = (TOOLS / "layout.py").read_text()
    before_ast = ast.parse(original)
    after_ast = ast.parse(current)
    before_defs = {node.name: node for node in before_ast.body if isinstance(node, ast.FunctionDef)}
    after_defs = {node.name: node for node in after_ast.body if isinstance(node, ast.FunctionDef)}
    changed = [
        name for name in before_defs
        if ast.dump(before_defs[name], include_attributes=False)
        != ast.dump(after_defs[name], include_attributes=False)
    ]
    added = sorted(set(after_defs) - set(before_defs))
    assert set(changed) == {"_single_fraction_row", "_fraction_tail_split", "line_bands"}
    assert added == ["_fraction_limit_ownership"]
    diff = "".join(difflib.unified_diff(
        original.splitlines(keepends=True), current.splitlines(keepends=True),
        fromfile=str(OUT / "original/layout.py"), tofile=str(TOOLS / "layout.py"),
    ))
    (OUT / "layout-change.patch").write_text(diff)
    tests = [json.loads(line) for line in (OUT / "test-cases.jsonl").read_text().splitlines()]
    latest = {}
    for item in tests:
        latest[item["case"]] = item
    assert len(latest) == 9 and all(item["exit_code"] == 0 for item in latest.values())
    for name in latest:
        attempts = [item for item in tests if item["case"] == name]
        assert len([item for item in attempts if item["exit_code"] == 0]) == 1
    count = json.loads((OUT / "affected-count.json").read_text())
    commands = [json.loads(line) for line in (OUT / "commands.jsonl").read_text().splitlines()]
    first = json.loads((OUT / "original/original-first-command.json").read_text())
    first_stdout = (OUT / "original/original-first-stdout.txt").read_text()
    first_stderr = (OUT / "original/original-first-stderr.txt").read_text()
    bootstrap = {
        "argv": ["sed", "-n", "1,260p", ".claude/skills/ld-s10y-lesson/tools/layout.py"],
        "cwd": str(ROOT), "exit_code": 0, "tool_reported_wall_seconds": 0.0,
        "started": None, "finished": None,
        "timing_limitation": "This initial read preceded the persistent logger; exact UTC timestamps were not exposed by exec_command and are not invented.",
        "stdout_reconstruction_basis": baseline["inputs"]["layout.py"],
        "stdout": "".join(original.splitlines(keepends=True)[:260]), "stderr": "",
    }
    dump(OUT / "bootstrap-read.json", bootstrap)
    changed_files = {
        str(TOOLS / "layout.py"): {
            "status": "modified", "original_sha256": EXPECTED_LAYOUT_SHA,
            "final_sha256": sha(TOOLS / "layout.py"),
        },
        str(TEST): {"status": "new", "final_sha256": sha(TEST)},
    }
    dump(OUT / "final-hashes.json", {
        "timestamp": stamp(), "inputs": final, "changed_files": changed_files,
        "unchanged_existing_function_bodies": sorted(set(before_defs) - set(changed)),
        "modified_existing_function_bodies": changed, "added_function": added,
        "new_model_image_opens": 0, "carried_image_consumption": {"assignment": 6, "lifetime": 6},
    })
    dump(OUT / "test-evidence.json", {
        "timestamp": stamp(), "test_file": str(TEST), "test_sha256": sha(TEST),
        "cases": tests, "latest": latest, "distinct_cases": 9, "unittest_invocations": len(tests),
        "new_pass_reruns": 0, "old_tests_or_gates_run": [],
        "case_version_note": "Seven cases passed once at the initial implementation SHA. Only the two actual failures were repaired and rerun, once each, at the final SHA. Passing cases were not rerun after those repairs, as instructed.",
    })
    status = "SOURCE_REPAIR_UNRESOLVED_AWAITING_PARENT"
    result = {
        "timestamp": stamp(), "status": status,
        "source_result": count, "original_failure": {"command": first, "stdout": first_stdout, "stderr": first_stderr},
        "changed_files": changed_files, "layout_patch_path": str(OUT / "layout-change.patch"),
        "test_evidence_path": str(OUT / "test-evidence.json"), "test_cases_latest": latest,
        "test_design_path": str(OUT / "test-design.json"), "inputs": final,
        "commands_at_generation": commands, "complete_command_index": str(OUT / "commands.jsonl"),
        "bootstrap_command_record": str(OUT / "bootstrap-read.json"),
        "new_model_image_opens": 0, "carried_consumption": {"assignment": 6, "lifetime": 6},
        "affected_source_count_invocations": 1, "affected_source_count_allowance_consumed": True,
        "finalize_runs": [], "old_gate_runs": [], "expectation_changes": [], "source_content_changes": [],
        "page_130_touched": False, "workflow_refresh": False, "git_operations": [],
    }
    dump(OUT / "report.json", result)
    lines = [
        "# STEMROBIN-184: Zero-Image Nested-Fraction Repair",
        "",
        f"Status: **{status}**",
        f"UTC: {stamp()}",
        "",
        "## Outcome",
        "",
        "**Do not treat this as a validated source repair.** The one authorized page-133",
        "computational count still returns 17 against the unchanged independently reviewed",
        "author witness 16. The original `[701,777]` / `[778,855]` split remains.",
        "That count allowance is consumed. No second source count or finalize was run.",
        "The edits remain present for parent review; this worker now waits.",
        "",
        "All nine new focused cases have a passing latest result. Seven passed once at",
        "the initial implementation version. Only the two failing cases were repaired",
        "and rerun once each. No previously passing case, old test, or gate was rerun.",
        "These independent cases are not sufficient to establish fidelity on native page 133.",
        "",
        "## Exact Changed Files",
        "",
    ]
    for path, facts in changed_files.items():
        lines.extend([f"- `{path}`", f"  {facts['status']}; final SHA256 `{facts['final_sha256']}`"])
    lines.extend([
        "",
        f"Original layout SHA256: `{EXPECTED_LAYOUT_SHA}`",
        f"Exact patch: `{OUT / 'layout-change.patch'}`",
        "",
        "## Repair Design",
        "",
        "Fractional evaluation-limit ownership requires an established neighboring main",
        "fraction bar, a tall thin delimiter, an aligned upper limit, and a complete",
        "lower numerator/bar/denominator object within scaled geometric bounds.",
        "Ownership affects only the private classification copy; no native/page-count",
        "ink mask, count exclusion, page-specific coordinate, or expected-count override",
        "was added. The page input arrays remain unmodified by line_bands.",
        "",
        "Original pre-cleanup components are available to the fraction-tail and final",
        "expansion checks so a removed thin delimiter can still supply role evidence.",
        "A new guard prevents whole-column ownership from swallowing two complete",
        "body-scale fractions at distinct vertical levels with comparable widths.",
        "",
        "Existing function AST bodies outside _single_fraction_row, _fraction_tail_split,",
        "and line_bands are identical to the authorized dirty baseline. The new helper is",
        "_fraction_limit_ownership. Existing carrier/offset helpers and global thresholds",
        "are unchanged. No surrounding dirty work was discarded.",
        "",
        "## New Independent Cases",
        "",
        "Expectations were designed from the source-confirmed single horizontal expression",
        "and production fraction/body ownership rules, without reading old tests.",
        "Fixtures use independently authored connected-glyph Boolean geometry; no native",
        "PNG/crop, previous image-bearing history, font asset, or model image was loaded.",
        "No assertion, fixture, or expected result was changed after a test failure.",
        "",
        "| New case | Attempts | Latest exit | Latest layout SHA256 |",
        "| --- | --- | --- | --- |",
    ])
    for name, item in sorted(latest.items()):
        attempts = [attempt for attempt in tests if attempt["case"] == name]
        lines.append(f"| `{name}` | {len(attempts)} | {item['exit_code']} | `{item['layout_sha256']}` |")
    lines.extend([
        "",
        f"Full per-attempt test stdout/stderr/timing/status/hash evidence: `{OUT / 'test-evidence.json'}`",
        f"Fixed independent expectations: `{OUT / 'test-design.json'}`",
        "",
        "The initial single-row fixture passed the helper but was split at fraction-tail",
        "recovery after cleanup removed delimiters. Original component context repaired",
        "that synthetic failure. The independent-fraction fixture exposed column-wide",
        "ownership swallowing both fractions; the two-level complete-fraction guard",
        "repaired that synthetic failure. Both expectations were retained.",
        "",
        "Failed-fixture debug probes are retained under failed-probes/. The first",
        "single-row probe failed while serializing slice objects; its command/stderr",
        "and the subsequent serialization-only script repair are retained in commands/.",
        "No successful test case was run by these failed-case probes.",
        "",
        "## Original Failure",
        "",
        f"Recorded original args: `{shlex.join(first['args'])}`",
        f"UTC start `{first['started']}`, finish `{first['finished']}`,",
        f"exit={first['exitCode']}, signal={first['signal']}, error={first['error']}.",
        "The original command record does not identify the Python executable; none is inferred.",
        "```text",
        first_stdout.rstrip(),
        "```",
        f"Original stderr: {repr(first_stderr)}",
        "",
        "## Sole Affected Source Count",
        "",
        f"UTC result `{count['timestamp']}`; command exit 1; printed count {count['count']};",
        f"unchanged author witness {count['author_witness_unchanged']}; no exclusions.",
        f"Current layout SHA256 `{count['layout_sha256']}`.",
        f"Source SHA256 before/after `{count['source_sha256_after']}`.",
        f"Result path: `{OUT / 'affected-count.json'}`",
        "The residual native failure was not diagnosed through another pixel read or count.",
        "",
        "## Preservation and Scope",
        "",
        "Original layout and relevant tool/source/metadata/trace/failure inputs were",
        "byte-hash snapshotted below original/. Every input except the owned layout.py",
        "still matches its original SHA256; all snapshots themselves remain unchanged.",
        f"Full preservation record: `{OUT / 'final-hashes.json'}`",
        "",
        "New model image opens: 0. Prior permanent consumption remains 6/8 and 6/24.",
        "The sole native decode was computational count evidence with no image payload.",
        "Page 130 remains UNKNOWN and untouched. Source, metadata, author body, wraps,",
        "and expected values were not edited. No finalize, workflow refresh, dependency,",
        "database, app, project test/build, Charter, publish, or Git operation occurred.",
        "",
        "## Commands",
        "",
        "All logged execution argv, working directories, exact UTC start/finish, elapsed",
        "time, exit/signal/status, and byte-exact stdout/stderr with hashes are retained",
        "in commands/*/command.json and the complete live commands.jsonl index.",
        f"Index: `{OUT / 'commands.jsonl'}`",
        "",
        "Logging limitation: the initial `sed -n '1,260p' layout.py` read occurred before",
        "the persistent logger. Its exit and reported 0.0000s wall time are known;",
        "exact UTC timestamps were not exposed by exec_command. stdout is reproducible",
        "from the unchanged authorized baseline; missing times are explicitly null.",
        f"Bootstrap record: `{OUT / 'bootstrap-read.json'}`",
        "",
        "## Parent Decision",
        "",
        "Native page 133 is not fixed by the current candidate despite focused-case passes.",
        "Review the retained patch and evidence before using it. This worker has stopped",
        "and waits for a new bounded authorization; it will not consume another count",
        "or image allowance or finalize on its own.",
        "",
    ])
    (OUT / "report.md").write_text("\n".join(lines))
    delivery = {
        "timestamp": stamp(), "status": status, "changed_files": changed_files,
        "evidence_hashes": {
            str(OUT / name): sha(OUT / name)
            for name in ("report.md", "report.json", "test-evidence.json", "test-design.json",
                         "layout-change.patch", "final-hashes.json", "affected-count.json")
        },
    }
    dump(OUT / "delivery.json", delivery)
    print(json.dumps(delivery, indent=2))


def main(arguments):
    parser = argparse.ArgumentParser()
    actions = parser.add_subparsers(dest="action", required=True)
    actions.add_parser("snapshot")
    actions.add_parser("report")
    reader = actions.add_parser("read")
    reader.add_argument("path")
    reader.add_argument("--start", type=int, default=1)
    reader.add_argument("--end", type=int, default=1000000)
    case = actions.add_parser("test-case")
    case.add_argument("name")
    probe = actions.add_parser("failed-probe")
    probe.add_argument("name")
    actions.add_parser("affected-count")
    args = parser.parse_args(arguments)
    if args.action == "snapshot":
        snapshot()
    elif args.action == "read":
        read(args.path, args.start, args.end)
    elif args.action == "test-case":
        return test_case(args.name)
    elif args.action == "affected-count":
        return affected_count()
    elif args.action == "failed-probe":
        failed_probe(args.name)
    elif args.action == "report":
        report()
    return 0


if __name__ == "__main__":
    if sys.argv[1:2] == ["_execute"]:
        sys.exit(main(sys.argv[2:]))
    OUT.mkdir(parents=True, exist_ok=True)
    record = logged_subprocess(
        [sys.executable, "-B", str(Path(__file__).resolve()), "_execute", *sys.argv[1:]],
        ROOT, sys.argv[1],
    )
    sys.exit(record["exit_code"])
