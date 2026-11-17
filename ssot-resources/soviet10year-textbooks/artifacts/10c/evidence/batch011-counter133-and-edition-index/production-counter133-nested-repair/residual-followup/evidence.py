"""Additive, zero-model-image residual-expression trace and repair evidence."""
from __future__ import annotations

import argparse
import ast
from datetime import datetime, timezone
import difflib
import hashlib
import inspect
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
PRIOR = ROOT / ".intentfold/tickets/STEMROBIN-184/tmp/production-counter133-nested-repair"
OUT = PRIOR / "residual-followup"
DIAG = ROOT / ".intentfold/tickets/STEMROBIN-184/tmp/production-source125-133-count-diagnosis"
SOURCE = ROOT / ".intentfold/tickets/STEMROBIN-184/tmp/production-source10c130-133/10c/pages/0133/page.png"
PAGE = ROOT / "ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0133"
LAYOUT = TOOLS / "layout.py"
TEST = TOOLS / "test_layout_nested_fraction_rows.py"
BASE_LAYOUT_SHA = "ebe5c9c61aced17ec39269048ac54ee26ca134db01288226a3ebf80d9a8c43dc"
BASE_TEST_SHA = "dbef9063d266eff0df2e84185bb94748df3a83834a669c298dae520062cedfc7"


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


def plain(value):
    import numpy as np
    if isinstance(value, np.ndarray):
        return value.tolist() if value.size < 300 else {
            "shape": list(value.shape), "dtype": str(value.dtype),
            "sha256": hashlib.sha256(value.tobytes()).hexdigest(),
        }
    if isinstance(value, np.generic):
        return value.item()
    if isinstance(value, slice):
        return [value.start, value.stop]
    if isinstance(value, (tuple, list, set)):
        return [plain(item) for item in value]
    if isinstance(value, dict):
        return {str(key): plain(item) for key, item in value.items()}
    return value


def run(argv, cwd, label):
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
        "launcher_argv": sys.orig_argv, "harness_sha256": sha(Path(__file__)),
        "started": started, "finished": stamp(), "elapsed_seconds": elapsed,
        "exit_code": process.returncode, "signal": -process.returncode if process.returncode < 0 else None,
        "status": "pass" if process.returncode == 0 else "fail",
        "stdout_path": str(logdir / "stdout.txt"), "stdout_sha256": sha(logdir / "stdout.txt"),
        "stderr_path": str(logdir / "stderr.txt"), "stderr_sha256": sha(logdir / "stderr.txt"),
        "layout_sha256": sha(LAYOUT), "test_sha256": sha(TEST),
        "environment_delta": {"PYTHONDONTWRITEBYTECODE": "1"},
    }
    dump(logdir / "command.json", record)
    append(OUT / "commands.jsonl", record)
    sys.stdout.buffer.write(process.stdout)
    sys.stderr.buffer.write(process.stderr)
    print(f"\nCOMMAND_RECORD={logdir / 'command.json'}", flush=True)
    return record


def snapshot():
    assert not (OUT / "baseline.json").exists()
    assert sha(LAYOUT) == BASE_LAYOUT_SHA
    assert sha(TEST) == BASE_TEST_SHA
    inputs = {
        "layout.py": LAYOUT, "test_layout_nested_fraction_rows.py": TEST,
        "page.png": SOURCE, "page-audit.json": PAGE / "audit.json",
        "page.json": PAGE / "page.json", "page.md": PAGE / "page.md",
        "original-layout.py": PRIOR / "original/layout.py",
        "original-layout-trace.json": PRIOR / "original/original-layout-trace.json",
        "original-inventory.json": PRIOR / "original/original-inventory.json",
        "prior-affected-count.json": PRIOR / "affected-count.json",
        "prior-report.md": PRIOR / "report.md",
        "prior-test-evidence.json": PRIOR / "test-evidence.json",
        "prior-final-hashes.json": PRIOR / "final-hashes.json",
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
        "timestamp": stamp(), "inputs": facts, "new_model_images": 0,
        "permanent_model_image_consumption": 6, "diagnostic_fullpage_counts": 0,
    })
    print(json.dumps(facts, indent=2))


def read(path, start, end):
    path = Path(path)
    assert path in (
        LAYOUT, TEST, PRIOR / "original/original-layout-trace.json",
        PRIOR / "original/original-inventory.json", OUT / "followup-report.md",
        ROOT / ".claude/skills/ld-s10y-lesson/SKILL.md",
        ROOT / ".agents/skills/ld-s10y-image/SKILL.md",
    ) or path.is_relative_to(OUT) and path.suffix != ".png"
    sys.stdout.write("".join(path.read_text().splitlines(keepends=True)[start - 1:end]))


def cleanup_prefix(layout, ink, content_w):
    """Execute actual cleanup/scale production statements, stopping before row joining."""
    module = ast.parse(inspect.getsource(layout.line_bands))
    function = module.body[0]
    body = []
    raw_assignments = 0
    for statement in function.body:
        body.append(statement)
        if isinstance(statement, ast.Assign) and any(
            isinstance(target, ast.Name) and target.id == "raw" for target in statement.targets
        ):
            raw_assignments += 1
            if raw_assignments == 2:
                break
    assert raw_assignments == 2
    function.name = "_bounded_cleanup_prefix"
    function.body = body + [ast.Return(value=ast.Tuple(
        elts=[ast.Name(id=name, ctx=ast.Load())
              for name in ("ink", "components", "line_h", "glyph_h")], ctx=ast.Load(),
    ))]
    module = ast.fix_missing_locations(module)
    namespace = dict(vars(layout))
    exec(compile(module, "<bounded-production-cleanup-prefix>", "exec"), namespace)
    return namespace["_bounded_cleanup_prefix"](ink, content_w), ast.unparse(module)


def prior_failure():
    trace = json.loads((OUT / "original/original-layout-trace.json").read_text())
    inventory = json.loads((OUT / "original/original-inventory.json").read_text())
    prior = json.loads((OUT / "original/prior-affected-count.json").read_text())
    selected = []
    for event in trace["events"]:
        state = event.get("locals", {})
        if state.get("a") == 701 and state.get("b") == 855:
            selected.append({
                "function": event["function"], "line": event["line"], "stage": event["stage"],
                "return": event.get("return"),
                "locals": {key: state[key] for key in (
                    "a", "b", "line_h", "glyph_h", "pitch", "band_h", "count",
                    "remaining", "glyph_rows", "cores", "overlapping",
                ) if key in state},
            })
    result = {
        "original_trace_sha256": sha(OUT / "original/original-layout-trace.json"),
        "original_inventory_sha256": sha(OUT / "original/original-inventory.json"),
        "prior_native_count_sha256": sha(OUT / "original/prior-affected-count.json"),
        "original_current_audit_facts": inventory["current_audit_facts"],
        "original_expression_call_path": selected, "prior_native_count_evidence": prior,
        "new_native_count_calls": 0, "model_images": 0,
    }
    dump(OUT / "preserved-failure-summary.json", result)
    print(json.dumps(result, indent=2))


def expression_trace(label="expression-role-trace"):
    import numpy as np
    from scipy import ndimage
    from PIL import Image
    sys.path.insert(0, str(TOOLS))
    import layout
    baseline = json.loads((OUT / "baseline.json").read_text())
    assert sha(SOURCE) == baseline["inputs"]["page.png"]["sha256"]
    assert not (OUT / (label + ".json")).exists(), "Do not overwrite trace evidence"
    with Image.open(SOURCE) as image:
        ink = layout.ink_mask(image)
    columns = np.flatnonzero(ink.any(axis=0))
    width = int(columns[-1] - columns[0] + 1)
    (cleaned, original_components, line_h, glyph_h), prefix = cleanup_prefix(layout, ink, width)
    prefix_path = OUT / (label + "-cleanup-prefix.py.txt")
    prefix_path.write_text(prefix + "\n")
    a, b = 701, 855
    context = original_components[a:b + 1]
    bounds = ndimage.find_objects(context)
    components = []
    for ident, box in enumerate(bounds, 1):
        if box is None:
            continue
        rows, cols = box
        area = int((context[box] == ident).sum())
        if area < 8:
            continue
        height, span = rows.stop - rows.start, cols.stop - cols.start
        components.append({
            "id": ident, "box_xywh": [cols.start, a + rows.start, span, height], "ink_pixels": area,
            "surviving_cleanup_ink": int((cleaned[a:b + 1][box] & (context[box] == ident)).sum()),
            "delimiter_height_guard": height >= 2 * glyph_h,
            "delimiter_width_guard": span <= 0.25 * glyph_h,
            "role_glyph_guard": 0.35 * glyph_h <= height <= 0.9 * glyph_h and 0.15 * glyph_h <= span <= glyph_h,
            "role_bar_size_guard": height <= 0.2 * glyph_h and span >= 0.35 * glyph_h,
        })
    events = []
    selected = (
        "a", "b", "line_h", "height", "rules", "full_fraction_levels", "full_glyph_bounds",
        "glyphs", "bars", "delimiters", "owned", "parents", "upper_limits", "numerators",
        "denominators", "stem_rows", "stem_columns", "parent_rows", "rows", "columns",
        "remaining", "glyph_rows", "cores", "overlapping", "source_components",
    )

    def observe(frame, event, value):
        if Path(frame.f_code.co_filename) != LAYOUT:
            return observe
        if frame.f_code.co_name in ("_single_fraction_row", "_fraction_limit_ownership") and event == "return":
            state = frame.f_locals
            entry = {
                "function": frame.f_code.co_name, "return_line": frame.f_lineno,
                "return": plain(value),
                "locals": {key: plain(state[key]) for key in selected if key in state},
            }
            if frame.f_code.co_name == "_single_fraction_row":
                residual = state["band"]
                residual_labels, _ = ndimage.label(residual)
                entry["residual_components"] = [
                    {
                        "box_xywh": [cols.start, a + rows.start, cols.stop - cols.start, rows.stop - rows.start],
                        "pixels": int((residual_labels[box] == ident).sum()),
                        "source_component_ids": plain(np.unique(
                            context[box][residual_labels[box] == ident]
                        )),
                    }
                    for ident, box in enumerate(ndimage.find_objects(residual_labels), 1)
                    if box is not None for rows, cols in [box]
                ]
                entry["residual_projection_rows"] = [
                    {
                        "y": a + int(y), "pixels": int(residual[y].sum()),
                        "source_component_ids": plain(np.unique(context[y][residual[y]])),
                        "x_runs": plain(layout._runs(residual[y])),
                    }
                    for y in state.get("remaining", []) if residual[y].any()
                ]
            events.append(entry)
        return observe

    decisions = {}
    sys.settrace(observe)
    try:
        for scale in dict.fromkeys((float(line_h), float(glyph_h))):
            decisions[str(scale)] = bool(layout._single_fraction_row(
                cleaned, a, b, scale, original_components
            ))
    finally:
        sys.settrace(None)
    result = {
        "timestamp": stamp(), "source_sha256": sha(SOURCE), "layout_sha256": sha(LAYOUT),
        "expression_y_inclusive": [a, b], "content_width": width,
        "production_cleanup_scales": {"line_h": float(line_h), "glyph_h": float(glyph_h)},
        "original_context_ink_pixels": int((context > 0).sum()),
        "cleaned_expression_ink_pixels": int(cleaned[a:b + 1].sum()),
        "original_component_geometry": components, "helper_decisions": decisions, "events": events,
        "diagnostic_fullpage_count_calls": 0, "model_image_opens": 0,
        "method": "Native computational array only; actual production cleanup prefix stops before joining/counting; trace only the existing failed expression and private role helper. No image files/output/payload.",
    }
    dump(OUT / (label + ".json"), result)
    print(json.dumps({
        key: value for key, value in result.items() if key not in ("events", "original_component_geometry")
    }, indent=2))
    print("COMPONENTS PASSING DELIMITER HEIGHT OR CONTAINING LOWER-LIMIT INK:")
    print(json.dumps([item for item in components
                      if item["delimiter_height_guard"] or
                      item["box_xywh"][1] >= 778 and item["box_xywh"][0] > 500], indent=2))
    for event in events:
        if event["function"] == "_fraction_limit_ownership":
            print(json.dumps(event, indent=2))
        else:
            print(json.dumps({
                "function": event["function"], "return_line": event["return_line"],
                "return": event["return"], "remaining": event["locals"].get("remaining"),
                "glyph_rows": event["locals"].get("glyph_rows"), "cores": event["locals"].get("cores"),
                "overlapping": event["locals"].get("overlapping"),
                "residual_components": event.get("residual_components"),
                "residual_projection_rows": event.get("residual_projection_rows"),
            }, indent=2))


def test_case(name):
    design = json.loads((OUT / "new-test-design.json").read_text())
    assert name in {case["case"] for case in design["cases"]}
    ledger = OUT / "test-cases.jsonl"
    prior = [json.loads(line) for line in ledger.read_text().splitlines()] if ledger.exists() else []
    assert not any(item["case"] == name and item["exit_code"] == 0 for item in prior), "PASS rerun forbidden"
    record = run(
        [sys.executable, "-B", "-m", "unittest", "-v", "test_layout_nested_fraction_rows." + name],
        TOOLS, name,
    )
    append(ledger, {"case": name, **record})
    return record["exit_code"]


def test_outcomes():
    design = json.loads((OUT / "new-test-design.json").read_text())
    attempts = [json.loads(line) for line in (OUT / "test-cases.jsonl").read_text().splitlines()]
    latest = {}
    for attempt in attempts:
        assert attempt["case"] in {case["case"] for case in design["cases"]}
        latest[attempt["case"]] = attempt
    assert set(latest) == {case["case"] for case in design["cases"]}
    assert all(attempt["exit_code"] == 0 for attempt in latest.values())
    return {"design_sha256": sha(OUT / "new-test-design.json"), "attempts": attempts, "latest": latest}


def native_count():
    import numpy as np
    from PIL import Image
    sys.path.insert(0, str(TOOLS))
    import layout
    tests = test_outcomes()
    dump(OUT / "followup-test-evidence.json", tests)
    before = json.loads((OUT / "baseline.json").read_text())
    after_trace = json.loads((OUT / "after-residual-trace.json").read_text())
    assert all(after_trace["helper_decisions"].values())
    assert after_trace["layout_sha256"] == sha(LAYOUT)
    assert not (OUT / "native-count-started.json").exists(), "Only one new native count"
    source_before = sha(SOURCE)
    assert source_before == before["inputs"]["page.png"]["sha256"]
    assert sha(PAGE / "audit.json") == before["inputs"]["page-audit.json"]["sha256"]
    audit = json.loads((PAGE / "audit.json").read_text())
    assert audit["figures"] == [] and audit.get("count_exclusions", []) == []
    dump(OUT / "native-count-started.json", {
        "timestamp": stamp(), "source_sha256": source_before, "layout_sha256": sha(LAYOUT),
        "authorized_native_count_calls": 1, "model_image_opens": 0,
        "test_readiness_sha256": sha(OUT / "followup-test-evidence.json"),
    })
    with Image.open(SOURCE) as image:
        dimensions, mode = image.size, image.mode
        ink = layout.ink_mask(image)
    original_ink = ink.copy()
    counting = layout.counting_ink(ink, [])
    np.testing.assert_array_equal(counting, ink)
    columns = np.flatnonzero(counting.any(axis=0))
    width = int(columns[-1] - columns[0] + 1)
    events = []

    def observe(frame, event, value):
        if Path(frame.f_code.co_filename) != LAYOUT:
            return observe
        state = frame.f_locals
        if state.get("a") != 701 or state.get("b") != 855:
            return observe
        if event == "return" and frame.f_code.co_name == "_single_fraction_row":
            events.append({
                "function": frame.f_code.co_name, "line": frame.f_lineno, "return": bool(value),
                "line_h": plain(state["line_h"]), "remaining": plain(state.get("remaining")),
                "source_context_present": state.get("source_components") is not None,
            })
        elif event == "line" and frame.f_code.co_name == "line_bands":
            current_line = inspect.getsource(layout.line_bands).splitlines()[
                frame.f_lineno - layout.line_bands.__code__.co_firstlineno
            ]
            if current_line.strip() == "if count == 1:":
                events.append({
                    "function": "line_bands", "line": frame.f_lineno,
                    "count": int(state["count"]), "pitch": plain(state["pitch"]),
                    "band_h": int(state["band_h"]),
                })
        return observe

    sys.settrace(observe)
    clock = time.monotonic()
    try:
        bands = layout.line_bands(counting, width)
    finally:
        elapsed = time.monotonic() - clock
        sys.settrace(None)
    np.testing.assert_array_equal(ink, original_ink)
    np.testing.assert_array_equal(counting, original_ink)
    source_after = sha(SOURCE)
    assert source_before == source_after
    prior = json.loads((OUT / "original/prior-affected-count.json").read_text())
    outside_before = [band for band in prior["bands"] if band[1] < 701 or band[0] > 855]
    outside_after = [plain(band) for band in bands if band[1] < 701 or band[0] > 855]
    target_bands = [plain(band) for band in bands if band[0] <= 855 and band[1] >= 701]
    witness = prior["author_witness_unchanged"]
    result = {
        "timestamp": stamp(), "source": str(SOURCE),
        "source_sha256_before": source_before, "source_sha256_after": source_after,
        "source_size": list(dimensions), "source_mode": mode, "content_width": width,
        "layout_sha256": sha(LAYOUT), "test_sha256": sha(TEST),
        "count": len(bands), "author_witness_unchanged": witness,
        "count_matches_unchanged_witness": len(bands) == witness,
        "bands": plain(bands), "affected_expression_bands": target_bands,
        "outside_expression_bands_unchanged": outside_after == outside_before,
        "counting_ink_exclusions": [], "counting_input_unchanged": True,
        "expression_call_trace": events, "line_bands_seconds": elapsed,
        "native_count_calls": 1, "diagnosis_fullpage_count_calls": 0,
        "new_model_images": 0, "permanent_images_consumed": 6,
        "finalize_called": False,
    }
    dump(OUT / "followup-affected-count.json", result)
    print(json.dumps(result, indent=2))
    return 0 if (
        result["count_matches_unchanged_witness"] and target_bands == [[701, 855]]
        and result["outside_expression_bands_unchanged"]
    ) else 1


def final_evidence():
    baseline = json.loads((OUT / "baseline.json").read_text())
    facts = {}
    for name, item in baseline["inputs"].items():
        current = sha(item["path"])
        original = sha(item["snapshot"])
        assert original == item["sha256"]
        if name not in ("layout.py", "test_layout_nested_fraction_rows.py"):
            assert current == item["sha256"], f"Input changed: {name}"
        facts[name] = {**item, "current_sha256": current, "unchanged": current == item["sha256"]}
    current_layout = ast.parse(LAYOUT.read_text())
    original_layout = ast.parse((OUT / "original/layout.py").read_text())
    def declarations(tree):
        return {
            node.name: ast.dump(node, include_attributes=False)
            for node in tree.body if isinstance(node, (ast.FunctionDef, ast.ClassDef))
        }
    first, last = declarations(original_layout), declarations(current_layout)
    changed = [name for name in first.keys() | last.keys() if first.get(name) != last.get(name)]
    assert changed == ["_single_fraction_row"]
    old_other = [
        ast.dump(node, include_attributes=False) for node in original_layout.body
        if not isinstance(node, (ast.FunctionDef, ast.ClassDef))
    ]
    new_other = [
        ast.dump(node, include_attributes=False) for node in current_layout.body
        if not isinstance(node, (ast.FunctionDef, ast.ClassDef))
    ]
    assert old_other == new_other
    old_test = declarations(ast.parse((OUT / "original/test_layout_nested_fraction_rows.py").read_text()))
    new_test = declarations(ast.parse(TEST.read_text()))
    assert all(new_test.get(name) == value for name, value in old_test.items())
    original_prefix = (OUT / "original/test_layout_nested_fraction_rows.py").read_text().split(
        '\n\nif __name__ == "__main__":'
    )[0]
    assert TEST.read_text().startswith(original_prefix + "\n\n")
    tests = test_outcomes()
    dump(OUT / "followup-test-evidence.json", tests)
    for path, name in ((LAYOUT, "layout-followup.patch"), (TEST, "test-followup.patch")):
        original = OUT / "original" / path.name
        patch = "".join(difflib.unified_diff(
            original.read_text().splitlines(keepends=True), path.read_text().splitlines(keepends=True),
            fromfile=str(original), tofile=str(path),
        ))
        (OUT / name).write_text(patch)
    dump(OUT / "preservation-proof.json", {
        "layout_changed_declarations": changed, "all_other_layout_declarations_identical": True,
        "layout_imports_constants_identical": True, "prior_test_declarations_identical": True,
        "prior_evidence_and_native_metadata_bytes_identical": True,
        "comparison_baseline": str(OUT / "original"),
    })
    artifacts = {
        str(path): {"sha256": sha(path), "bytes": path.stat().st_size}
        for path in sorted(OUT.rglob("*")) if path.is_file()
        and not path.is_relative_to(OUT / "commands")
        and path.name not in ("final-hashes.json", "followup-report.md")
    }
    dump(OUT / "final-hashes.json", {
        "timestamp": stamp(), "input_preservation": facts, "artifacts": artifacts,
        "new_model_images": 0, "permanent_images": 6, "native_count_calls": 1,
    })
    print(json.dumps({
        "input_preservation": facts, "layout_changed_declarations": changed,
        "new_test_attempts": len(tests["attempts"]), "new_cases": len(tests["latest"]),
        "artifacts": artifacts,
    }, indent=2))


def seal_package():
    assert sha(LAYOUT) == "b303055123e59a72a05c043f9c04c9631eb3fc8baa8c38e40832ced331dc21a4"
    assert sha(TEST) == "415bf9189a7cbb1e115523f02e44be28977a8cbdeaaac6c39174c34cf5e5948d"
    assert (OUT / "followup-report.md").exists()
    assert not (OUT / "handoff-freeze.json").exists()
    original_test_prefix = (OUT / "original/test_layout_nested_fraction_rows.py").read_text().split(
        '\n\nif __name__ == "__main__":'
    )[0]
    assert TEST.read_text().startswith(original_test_prefix + "\n\n")
    commands = []
    for path in sorted((OUT / "commands").glob("*/command.json")):
        record = json.loads(path.read_text())
        record["command_record_path"] = str(path)
        record["command_record_sha256"] = sha(path)
        stdout = Path(record["stdout_path"])
        stderr = Path(record["stderr_path"])
        assert sha(stdout) == record["stdout_sha256"]
        assert sha(stderr) == record["stderr_sha256"]
        commands.append(record)
    dump(OUT / "command-evidence.json", {
        "records": commands, "record_count": len(commands),
        "includes_failed_reads": True, "includes_wrapper_and_nested_test_commands": True,
        "stdout_stderr_complete_at_recorded_absolute_paths": True,
    })
    text = ["# Residual Followup Command Ledger\n\n"]
    for index, record in enumerate(commands, 1):
        argv = record["argv"]
        text.extend([
            f"## {index}. {Path(record['command_record_path']).parent.name}\n\n",
            "Actual subprocess argv:\n\n```json\n",
            json.dumps(argv, indent=2) + "\n```\n\n",
            f"- CWD: `{record['cwd']}`\n",
            f"- Start UTC: `{record.get('started', record.get('start_utc'))}`\n",
            f"- End UTC: `{record.get('finished', record.get('end_utc'))}`\n",
            f"- Elapsed seconds: `{record['elapsed_seconds']}`\n",
            f"- Exit/status: `{record['exit_code']}` / `{record['status']}`\n",
            f"- Full stdout: `{record['stdout_path']}`\n",
            f"- stdout SHA256: `{record['stdout_sha256']}`\n",
            f"- Full stderr: `{record['stderr_path']}`\n",
            f"- stderr SHA256: `{record['stderr_sha256']}`\n",
            f"- Record: `{record['command_record_path']}`\n",
            f"- Record SHA256: `{record['command_record_sha256']}`\n\n",
        ])
    (OUT / "command-evidence.md").write_text("".join(text))
    tests = test_outcomes()
    old_tests = json.loads((OUT / "original/prior-test-evidence.json").read_text())
    count = json.loads((OUT / "followup-affected-count.json").read_text())
    prior_count = json.loads((OUT / "original/prior-affected-count.json").read_text())
    dump(OUT / "attempt-ledger.json", {
        "previous_evidence_preserved_verbatim": {
            "test_evidence_path": str(OUT / "original/prior-test-evidence.json"),
            "sha256": sha(OUT / "original/prior-test-evidence.json"),
            "all_original_outcomes": old_tests,
            "native_count_path": str(OUT / "original/prior-affected-count.json"),
            "native_count_sha256": sha(OUT / "original/prior-affected-count.json"),
            "native_count": prior_count,
        },
        "followup": {
            "test_attempt_count": len(tests["attempts"]), "distinct_cases": len(tests["latest"]),
            "test_attempts": tests["attempts"], "latest_cases": tests["latest"],
            "new_test_failures": [item for item in tests["attempts"] if item["exit_code"] != 0],
            "other_command_failures": [item for item in commands
                                       if item["exit_code"] != 0 and "-m" not in item["argv"]
                                       and "test-case" not in item["argv"]],
            "native_count": count, "new_native_count_calls": 1,
            "old_pass_test_reruns": 0, "new_pass_test_reruns": 0,
            "new_model_images": 0, "permanent_model_images": 6,
        },
    })
    baseline = json.loads((OUT / "baseline.json").read_text())
    facts = {}
    for name, record in baseline["inputs"].items():
        original = record["sha256"]
        assert sha(record["snapshot"]) == original
        current = sha(record["path"])
        if name not in ("layout.py", "test_layout_nested_fraction_rows.py"):
            assert current == original
        facts[name] = {**record, "current_sha256": current, "unchanged": current == original}
    artifacts = {
        str(path): {"sha256": sha(path), "bytes": path.stat().st_size}
        for path in sorted(OUT.rglob("*")) if path.is_file()
        and path.name not in ("final-hashes.json", "handoff-freeze.json")
    }
    dump(OUT / "final-hashes.json", {
        "timestamp": stamp(), "input_preservation": facts, "artifacts": artifacts,
        "all_command_records_and_streams_included": True,
        "new_model_images": 0, "permanent_images": 6, "native_count_calls": 1,
    })
    freeze = {
        "frozen_utc": stamp(), "owned_files": {
            str(LAYOUT): sha(LAYOUT), str(TEST): sha(TEST),
        },
        "report_path": str(OUT / "followup-report.md"),
        "report_sha256": sha(OUT / "followup-report.md"),
        "final_hashes_path": str(OUT / "final-hashes.json"),
        "final_hashes_sha256": sha(OUT / "final-hashes.json"),
        "command_ledger_path": str(OUT / "command-evidence.json"),
        "command_ledger_sha256": sha(OUT / "command-evidence.json"),
        "attempt_ledger_path": str(OUT / "attempt-ledger.json"),
        "attempt_ledger_sha256": sha(OUT / "attempt-ledger.json"),
        "native_count": count["count"], "witness_unchanged": count["author_witness_unchanged"],
        "new_model_images": 0, "permanent_model_images": 6,
        "no_further_owned_file_writes": True,
        "no_child_processes_or_background_sessions_created": True,
        "parent_owns_finalize": True,
    }
    dump(OUT / "handoff-freeze.json", freeze)
    freeze["handoff_freeze_sha256"] = sha(OUT / "handoff-freeze.json")
    print(json.dumps(freeze, indent=2))
    for name in (
        "followup-test-evidence.json", "followup-affected-count.json",
        "before-residual-trace.json", "after-residual-trace.json",
        "layout-followup.patch", "test-followup.patch",
        "preservation-proof.json", "command-evidence.md",
    ):
        print(f"{OUT / name}\nSHA256={sha(OUT / name)}")


def main(arguments):
    parser = argparse.ArgumentParser()
    actions = parser.add_subparsers(dest="action", required=True)
    actions.add_parser("snapshot")
    reader = actions.add_parser("read")
    reader.add_argument("path")
    reader.add_argument("--start", type=int, default=1)
    reader.add_argument("--end", type=int, default=1000000)
    actions.add_parser("expression-trace")
    actions.add_parser("prior-failure")
    actions.add_parser("native-count")
    actions.add_parser("final-evidence")
    actions.add_parser("seal")
    tracer = actions.add_parser("residual-trace")
    tracer.add_argument("label")
    tester = actions.add_parser("test-case")
    tester.add_argument("name")
    args = parser.parse_args(arguments)
    if args.action == "snapshot":
        snapshot()
    elif args.action == "read":
        read(args.path, args.start, args.end)
    elif args.action == "expression-trace":
        expression_trace()
    elif args.action == "prior-failure":
        prior_failure()
    elif args.action == "native-count":
        return native_count()
    elif args.action == "final-evidence":
        final_evidence()
    elif args.action == "seal":
        assert (OUT / "followup-report.md").exists()
        assert not (OUT / "handoff-freeze.json").exists()
        print("Final evidence seal prepared; no count/test/image/production write.")
    elif args.action == "residual-trace":
        assert args.label in ("before-residual-trace", "after-residual-trace")
        expression_trace(args.label)
    elif args.action == "test-case":
        return test_case(args.name)
    return 0


if __name__ == "__main__":
    if sys.argv[1:2] == ["_execute"]:
        sys.exit(main(sys.argv[2:]))
    OUT.mkdir(parents=True, exist_ok=True)
    record = run(
        [sys.executable, "-B", str(Path(__file__).resolve()), "_execute", *sys.argv[1:]],
        ROOT, sys.argv[1],
    )
    if sys.argv[1:2] == ["seal"] and record["exit_code"] == 0:
        seal_package()
    sys.exit(record["exit_code"])
