"""Offline, affected-only ownership and grouping evidence; no image decoding."""
import ast
import copy
import hashlib
import json
import re
import subprocess
import sys
import types
from datetime import datetime, timezone
from pathlib import Path

sys.dont_write_bytecode = True
ROOT = Path("/Users/yong/.codex/worktrees/d9b1/lemmadeck")
assert Path.cwd() == ROOT
BASE = ROOT / ".intentfold/tickets/STEMROBIN-182/tmp/resume182-12"
OUT = BASE / "owned-layout-review"
FILE = ROOT / ".claude/skills/ld-s10y-lesson/tools/layout.py"
CANDIDATE = BASE / "staged-layout/layout.py"
PRIOR = BASE / "counter-repair/layout229-233-PASS.py"
BEFORE = BASE / "counter-repair/layout-before.py"

import numpy as np


def digest(data):
    return hashlib.sha256(data).hexdigest()


def binding(path):
    path = Path(path)
    data = path.read_bytes()
    return {"path": str(path), "sha256": digest(data), "bytes": len(data)}


def read_json(path):
    return json.loads(Path(path).read_text())


def write_json(name, value):
    target = OUT / name
    assert target.parent == OUT
    with target.open("x") as stream:
        json.dump(value, stream, indent=2)
        stream.write("\n")


def module_from_saved_source(path):
    module = types.ModuleType(path.stem)
    exec(compile(path.read_bytes(), str(path), "exec"), module.__dict__)
    return module


def nodes(source):
    return {node.name: node for node in ast.parse(source).body
            if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef))}


def node_bytes(source, name):
    node = nodes(source)[name]
    return "".join(source.splitlines(keepends=True)[node.lineno - 1:node.end_lineno])


def ast_dump(node):
    return ast.dump(node, include_attributes=False)


def apply_owned_patch(head, patch):
    lines = patch.splitlines(keepends=True)
    source = head.splitlines(keepends=True)
    output, cursor, hunk_count = [], 0, 0
    index = 0
    while index < len(lines):
        match = re.match(r"@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@", lines[index])
        if not match:
            index += 1
            continue
        start = int(match[1]) - 1
        old_count = int(match[2] or 1)
        new_count = int(match[4] or 1)
        index += 1
        old, new = [], []
        while index < len(lines) and not lines[index].startswith("@@ "):
            line = lines[index]
            assert line[0] in " +-", line
            if line[0] in " -":
                old.append(line[1:])
            if line[0] in " +":
                new.append(line[1:])
            index += 1
        assert len(old) == old_count and len(new) == new_count
        assert start >= cursor and source[start:start + old_count] == old
        output.extend(source[cursor:start])
        output.extend(new)
        cursor = start + old_count
        hunk_count += 1
    output.extend(source[cursor:])
    return "".join(output), hunk_count


current_text = FILE.read_text()
candidate_text = CANDIDATE.read_text()
before_text = BEFORE.read_text()
own_patch = (BASE / "staged-layout/own.patch").read_text()
head = subprocess.run(
    ["git", "show", "HEAD:.claude/skills/ld-s10y-lesson/tools/layout.py"],
    cwd=ROOT, check=True, capture_output=True,
).stdout.decode()
index_before = subprocess.run(
    ["git", "diff", "--cached", "--", ".claude/skills/ld-s10y-lesson/tools/layout.py"],
    cwd=ROOT, check=True, capture_output=True,
).stdout
reconstructed, hunk_count = apply_owned_patch(head, own_patch)
assert reconstructed == candidate_text and hunk_count == 5
assert "_fraction_baselines" not in candidate_text
assert "_fraction_baselines" not in own_patch
assert node_bytes(current_text, "_fraction_baselines") == node_bytes(before_text, "_fraction_baselines")
assert node_bytes(current_text, "_single_fraction_row") == node_bytes(before_text, "_single_fraction_row")
assert node_bytes(candidate_text, "_single_fraction_row") == node_bytes(head, "_single_fraction_row")
current_ast = ast.parse(current_text)
normalized = copy.deepcopy(current_ast)
normalized.body = [
    node for node in normalized.body
    if not isinstance(node, ast.FunctionDef) or node.name != "_fraction_baselines"
]
single = next(node for node in normalized.body
              if isinstance(node, ast.FunctionDef) and node.name == "_single_fraction_row")
assert isinstance(single.body[1], ast.If)
assert "_fraction_baselines" in ast_dump(single.body[1])
single.body.pop(1)
assert ast_dump(normalized) == ast_dump(ast.parse(candidate_text))
unchanged = [
    name for name in nodes(head)
    if name != "line_bands" and
    ast_dump(nodes(head)[name]) == ast_dump(nodes(candidate_text)[name])
]
assert set(nodes(head)) - {"line_bands"} == set(unchanged)
saved = read_json(BASE / "staged-layout/binding.json")
assert binding(FILE)["sha256"] == saved["currentFileSha256"]
assert binding(CANDIDATE)["sha256"] == saved["candidateSha256"]
assert digest(own_patch.encode()) == saved["ownPatchSha256"]

candidate = module_from_saved_source(CANDIDATE)
prior = module_from_saved_source(PRIOR)


def canvas():
    return np.zeros((290, 500), dtype=bool)


def glyph_row(mask, top, bottom, left=200, right=360):
    for x in range(left, right, 16):
        mask[top:bottom, x:x + 8] = True


def fraction(mask, centre, left, right):
    glyph_row(mask, centre - 18, centre - 6, left + 8, right - 4)
    mask[centre - 1:centre + 1, left:right] = True
    glyph_row(mask, centre + 6, centre + 18, left + 8, right - 4)


cases = []
mixed = canvas()
mixed[150:220, 100:112] = True
fraction(mixed, 170, 200, 260)
glyph_row(mixed, 198, 218)
mixed_rows = [(152, 163), (176, 187), (198, 217)]
cases.append(("fraction_plus_distinct_full_equation", mixed, 150, 219, mixed_rows, 2))
unbraced = mixed.copy()
unbraced[:, 100:112] = False
cases.append(("same_rows_without_spanning_brace", unbraced, 150, 219, mixed_rows, None))
no_rules = canvas()
no_rules[150:220, 100:112] = True
glyph_row(no_rules, 152, 172)
glyph_row(no_rules, 198, 218)
cases.append(("spanning_brace_but_no_fraction_rules", no_rules, 150, 219,
              [(152, 171), (198, 217)], None))
cases.append(("empty_ink", canvas(), 150, 219, [], None))
nested = canvas()
nested[150:245, 100:112] = True
fraction(nested, 170, 200, 280)
fraction(nested, 212, 220, 260)
cases.append(("nested_rules_are_one_outer_fraction", nested, 150, 244, [], None))
two = canvas()
two[150:250, 100:112] = True
fraction(two, 170, 200, 260)
fraction(two, 230, 300, 360)
cases.append(("two_distinct_fraction_equation_rows", two, 150, 249, [], 2))

probes = []
for name, mask, a, b, strong_rows, expected in cases:
    before_hash = digest(mask.tobytes())
    actual = candidate._fraction_system_row_count(mask, a, b, 20.0, strong_rows)
    previous = prior._fraction_system_row_count(mask, a, b, 20.0, strong_rows)
    probes.append({
        "case": name, "expected_from_geometry": expected, "actual": actual,
        "prior_affected_behavior": previous, "prior_parity": actual == previous,
        "passed": actual == expected, "mask_sha256": before_hash,
        "input_unchanged": digest(mask.tobytes()) == before_hash,
    })

# Normal body rows provide the glyph-height context for the real call-site guard.
workflow = mixed.copy()
for top in (20, 60, 100):
    glyph_row(workflow, top, top + 20)
input_hash = digest(workflow.tobytes())
actual_bands = candidate.line_bands(workflow, 500)
old_bands = prior.line_bands(workflow, 500)
probes.append({
    "case": "three_prose_rows_then_two_equation_system",
    "expected_from_geometry": 5, "actual": len(actual_bands),
    "prior_affected_behavior": len(old_bands), "prior_parity": actual_bands == old_bands,
    "passed": len(actual_bands) == 5, "bands": actual_bands,
    "input_unchanged": digest(workflow.tobytes()) == input_hash,
    "mask_sha256": input_hash,
})
single_mask = canvas()
for top in (20, 60, 100):
    glyph_row(single_mask, top, top + 20)
fraction(single_mask, 170, 200, 260)
single_hash = digest(single_mask.tobytes())
single_bands = candidate.line_bands(single_mask, 500)
probes.append({
    "case": "three_prose_rows_then_one_fraction",
    "expected_from_geometry": 4, "actual": len(single_bands),
    "passed": len(single_bands) == 4, "bands": single_bands,
    "input_unchanged": digest(single_mask.tobytes()) == single_hash,
    "mask_sha256": single_hash,
})

review_229 = read_json(BASE / "counter229-233-review/counter229-233-review.json")
review_238 = read_json(BASE / "source237-241-affected-review/source237-241-affected-review.json")
source_records = []
for page, expected in ((229, 22), (233, 23), (238, 25)):
    if page != 238:
        record = next(p for p in review_229["affected_pages"] if p["page"] == page)
        assert record["source_physical_rows_including_footer"] == expected
        source_path = ROOT / record["source_dir"] / "page.png"
        source_expected = record["source_bindings"]["page.png"]
        output_dir = ROOT / record["current_dir"]
        outputs = [
            {"path": str(output_dir / name), "sha256": item["current_and_FIRST_sha256"]}
            for name, item in record["triplet"].items() if name != "audit.json"
        ]
        outputs.append({"path": str(output_dir / "audit.json"),
                        "sha256": record["triplet"]["audit.json"]["current_sha256"]})
    else:
        record = next(p for p in review_238["pages"] if p["physical"] == page)
        source_path = Path(record["source"]["path"])
        source_expected = record["source"]["sha256"]
        outputs = record["current_triplet"]
    source_current = binding(source_path)
    assert source_current["sha256"] == source_expected
    output_checks = []
    for item in outputs:
        observed = binding(item["path"])
        assert observed["sha256"] == item["sha256"]
        output_checks.append({**observed, "inherited_sha256": item["sha256"], "unchanged": True})
    audit = read_json(ROOT / f"ssot-resources/soviet10year-textbooks/artifacts/7a/pages/{page:04d}/audit.json")
    source_records.append({
        "page": page, "independently_confirmed_rows": expected,
        "source_pixel_input": {**source_current, "inherited_sha256": source_expected, "unchanged": True},
        "source_outputs": output_checks, "existing_audit_counts": {
            key: value for key, value in audit.items() if key.startswith("lines") or key == "errors"
        },
        "pixel_decodes": 0, "new_source_count_run": False,
    })

receipt_path = BASE / "stages/owned-layout-tests-FIRST.receipt.json"
receipt = read_json(receipt_path)
assert receipt["exit"] == 0
for stream in receipt["streams"]:
    assert binding(ROOT / stream["path"])["sha256"] == stream["sha256"]
test_result = read_json(BASE / "staged-layout/test-result-FIRST.json")
assert test_result["status"] == "pass" and test_result["testsRun"] == 59
assert test_result["skips"] == 4 and not test_result["failures"] and not test_result["errors"]
index_after = subprocess.run(
    ["git", "diff", "--cached", "--", ".claude/skills/ld-s10y-lesson/tools/layout.py"],
    cwd=ROOT, check=True, capture_output=True,
).stdout
assert index_after == index_before
assert binding(FILE)["sha256"] == saved["currentFileSha256"]
assert binding(CANDIDATE)["sha256"] == saved["candidateSha256"]
for record in source_records:
    assert binding(record["source_pixel_input"]["path"])["sha256"] == record["source_pixel_input"]["sha256"]
    for item in record["source_outputs"]:
        assert binding(item["path"])["sha256"] == item["sha256"]

report = {
    "ticket": "STEMROBIN-182", "finish": "review", "scope": "owned layout self-containment only",
    "cwd": str(ROOT), "write_root": str(OUT),
    "created_at_utc": datetime.now(timezone.utc).isoformat(),
    "verdict": "PASS" if all(p["passed"] and p["input_unchanged"] for p in probes) else "REVISE",
    "ownership": {
        "head_sha256": digest(head.encode()), "own_hunks": hunk_count,
        "head_plus_owned_hunks_equals_candidate": True,
        "excluded_user_helper_and_guard_byte_identical_to_before": True,
        "candidate_minus_current_only_excludes_user_helper_and_guard": True,
        "candidate_single_fraction_helper_byte_identical_to_HEAD": True,
        "other_existing_helpers_unchanged_from_HEAD": unchanged,
        "candidate_contains_no_fraction_baselines_reference": True,
        "module_import_succeeded": True, "git_index_layout_diff_unchanged": True,
        "reviewed_candidate_sha256": binding(CANDIDATE)["sha256"],
        "reviewed_patch_sha256": digest(own_patch.encode()),
        "source_module_unchanged_during_review": True,
    },
    "synthetic_probes": probes, "affected_source_preservation": source_records,
    "inherited_tests": {
        "tests_run": 59, "skips": 4, "errors": 0, "failures": 0,
        "receipt": binding(receipt_path), "streams": receipt["streams"],
        "result": binding(BASE / "staged-layout/test-result-FIRST.json"), "rerun": False,
    },
    "input_bindings": [
        binding(path) for path in (
            FILE, CANDIDATE, PRIOR, BEFORE, BASE / "staged-layout/own.patch",
            BASE / "staged-layout/excluded-user.patch", BASE / "staged-layout/binding.json",
            BASE / "counter229-233-review/counter229-233-review.json",
            BASE / "source237-241-affected-review/source237-241-affected-review.json",
            BASE / "verify-owned-layout.py",
            ROOT / ".claude/skills/ld-s10y-lesson/references/production-resume.md",
        )
    ],
    "boundaries": {
        "source_code_edits": 0, "image_payloads": 0, "source_pixel_decodes": 0,
        "unit_test_source_reads": 0, "passed_suite_reruns": 0, "full_pipeline_runs": 0,
        "network": False, "git_writes": False, "staging_performed": False,
        "db_env_model_publish_app_dependencies": False,
        "agent_chat_merge_deploy_closure": False, "whole_batch_approval": False,
    },
    "staging_condition": (
        "Only the bound own.patch against the bound HEAD is reviewed; recheck these hashes and "
        "the resulting staged-only module immediately before narrow staging. Do not stage the "
        "whole dirty layout.py or excluded-user.patch. This review does not stage or authorize other files."
    ),
}
write_json("probe-results.json", report)
print(json.dumps({
    "verdict": report["verdict"],
    "probes": [{key: p[key] for key in ("case", "expected_from_geometry", "actual", "passed")} for p in probes],
    "candidate_sha256": report["ownership"]["reviewed_candidate_sha256"],
    "report": binding(OUT / "probe-results.json"),
}))
