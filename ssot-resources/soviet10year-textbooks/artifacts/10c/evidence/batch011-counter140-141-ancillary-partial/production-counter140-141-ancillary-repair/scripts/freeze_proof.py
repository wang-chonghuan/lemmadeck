#!/usr/bin/env python3
"""Freeze the independently authored proof and narrow production patch."""
import ast
import difflib
import hashlib
import json
from pathlib import Path

OWNED = Path(__file__).resolve().parents[1]
ROOT = OWNED.parents[4]


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main():
    before = json.loads((OWNED / "before/inputs.json").read_text())
    for item in before["inputs"]:
        if item["immutable"] and sha(Path(item["path"])) != item["sha256"]:
            raise SystemExit("Immutable input changed: " + item["path"])
    tool = ROOT / ".claude/skills/ld-s10y-lesson/tools/layout.py"
    test = ROOT / ".claude/skills/ld-s10y-lesson/tools/test_layout_carrier_ancillary_rows.py"
    old = (OWNED / "before/layout.py").read_text()
    new = tool.read_text()
    marker = "def _single_carrier_row("
    end_marker = "\n\ndef line_bands("
    old_start, new_start = old.index(marker), new.index(marker)
    old_end, new_end = old.index(end_marker, old_start), new.index(end_marker, new_start)
    if old[:old_start] != new[:new_start] or old[old_end:] != new[new_end:]:
        raise SystemExit("Production edit escaped _single_carrier_row")
    ast.parse(new)
    tree = ast.parse(test.read_text())
    declared = next(
        node.value for node in tree.body
        if isinstance(node, ast.Assign)
        and any(isinstance(target, ast.Name) and target.id == "CASES" for target in node.targets)
    )
    names = [ast.literal_eval(key) for key in declared.keys]
    results = []
    for record_path in sorted((OWNED / "commands").glob("*.json")):
        record = json.loads(record_path.read_text())
        argv = record["argv"]
        if "--case" not in argv:
            continue
        name = argv[argv.index("--case") + 1]
        for stream in ("stdout", "stderr"):
            if sha(Path(record[stream])) != record[stream + "_sha256"]:
                raise SystemExit("Test stream changed: " + str(record_path))
        result = json.loads(Path(record["stdout"]).read_text())
        if record["exit_code"] or not result["passed"] or result["case"] != name:
            raise SystemExit("A proof case failed: " + name)
        results.append({
            "case": name, "command_record": str(record_path),
            "record_sha256": sha(record_path), "stdout_sha256": record["stdout_sha256"],
            "stderr_sha256": record["stderr_sha256"], "exit_code": record["exit_code"],
        })
    if sorted(names) != sorted(item["case"] for item in results):
        raise SystemExit("Every newly declared case must have exactly one successful run")
    proof = OWNED / "proof"
    proof.mkdir(exist_ok=True)
    gate = proof / "gate.json"
    if gate.exists():
        raise SystemExit("An existing proof gate must not be replaced")
    (proof / "layout.py").write_bytes(tool.read_bytes())
    (proof / "test_layout_carrier_ancillary_rows.py").write_bytes(test.read_bytes())
    diff = "".join(difflib.unified_diff(
        old.splitlines(keepends=True), new.splitlines(keepends=True),
        fromfile=str(OWNED / "before/layout.py"), tofile=str(tool),
    ))
    (proof / "layout.patch").write_text(diff, encoding="utf-8")
    result = {
        "status": "ALL_NEW_PROOF_CASES_PASS_FROZEN",
        "baseline_layout_sha256": before["baseline_layout_sha256"],
        "layout_path": str(tool), "layout_sha256": sha(tool),
        "new_test_path": str(test), "new_test_sha256": sha(test),
        "test_authored_before_patch_sha256": before["new_test_authored_before_patch_sha256"],
        "test_unchanged_since_authoring": sha(test) == before["new_test_authored_before_patch_sha256"],
        "change_confined_to_single_carrier_row": True,
        "proof_cases": results,
        "authorized_native_pages": {"140": 18, "141": 23},
        "native_counts_already_run": 0,
    }
    gate.write_text(json.dumps(result, indent=2) + "\n", encoding="ascii")
    for path in proof.iterdir():
        path.chmod(0o444)
    proof.chmod(0o555)
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
