"""Create the complete additive ledger/report and freeze after logging close."""
import ast
import difflib
import json
import shutil

import evidence


def verify():
    baseline = json.loads((evidence.OUT / "baseline.json").read_text())
    checks = {}
    for name, item in baseline["inputs"].items():
        checks[name] = {
            "snapshot_sha256": evidence.sha(item["snapshot"]),
            "expected_sha256": item["sha256"],
            "snapshot_unchanged": evidence.sha(item["snapshot"]) == item["sha256"],
        }
        if name != "layout.py":
            checks[name]["original_unchanged"] = evidence.sha(item["path"]) == item["sha256"]
    for path, expected in baseline["existing_tests_hash_only"].items():
        checks[path] = {"expected_sha256": expected, "sha256": evidence.sha(path),
                        "original_unchanged": evidence.sha(path) == expected}
    assert all(
        value for item in checks.values()
        for key, value in item.items() if key.endswith("unchanged")
    )
    design = json.loads((evidence.OUT / "new-test-design-checkpoint.json").read_text())
    assert evidence.sha(evidence.TEST) == design["test_sha256"]
    tests = json.loads((evidence.OUT / "test-evidence.json").read_text())
    assert len(tests["attempts"]) == 22 and tests["failed_attempts"] == 2
    assert len(tests["latest_case_results"]) == 20
    assert all(value == "pass" for value in tests["latest_case_results"].values())
    count = json.loads((evidence.OUT / "native-count.json").read_text())
    assert count["count"] == 14 and count["status"] == "FAIL"
    assert count["layout_sha256"] == evidence.sha(evidence.LAYOUT)
    before = (evidence.OUT / "original/layout.py").read_text()
    after = evidence.LAYOUT.read_text()
    old_functions = {
        item.name: ast.dump(item, include_attributes=False)
        for item in ast.parse(before).body if isinstance(item, ast.FunctionDef)
    }
    new_functions = {
        item.name: ast.dump(item, include_attributes=False)
        for item in ast.parse(after).body if isinstance(item, ast.FunctionDef)
    }
    changed = [name for name in old_functions if old_functions[name] != new_functions[name]]
    added = sorted(set(new_functions) - set(old_functions))
    assert changed == ["_single_fraction_row"]
    assert added == ["_bounded_carrier_limit_ownership", "_bounded_fraction_rules"]
    return checks, before, after, changed, added


def seal():
    assert not (evidence.OUT / "handoff-freeze.json").exists()
    checks, before, after, changed, added = verify()
    evidence.dump(evidence.OUT / "production-preservation.json", {
        "timestamp": evidence.stamp(), "preservation": checks,
        "changed_existing_functions": changed, "added_functions": added,
        "all_other_existing_function_bodies_preserved": True,
        "frozen_test_contract_unchanged": True,
    })
    patch = "".join(difflib.unified_diff(
        before.splitlines(keepends=True), after.splitlines(keepends=True),
        fromfile=str(evidence.OUT / "original/layout.py"), tofile=str(evidence.LAYOUT),
    ))
    (evidence.OUT / "layout-change.patch").write_text(patch)
    folder = evidence.OUT / "checkpoints/final-frozen"
    folder.mkdir(parents=True, exist_ok=False)
    for path in (evidence.LAYOUT, evidence.TEST):
        shutil.copyfile(path, folder / path.name)
    commands = [json.loads(line) for line in (evidence.OUT / "commands.jsonl").read_text().splitlines()]
    ledger = ["# Complete Exact Command Ledger", "",
              "Each subprocess and launcher argv is preserved. Wrapper records are not test reruns.", ""]
    for index, item in enumerate(commands, 1):
        ledger += [
            f"## {index}: {item['status']} (exit {item['exit_code']})",
            f"UTC: {item['started']} -> {item['finished']}",
            f"Elapsed seconds: {item['elapsed_seconds']:.9f}",
            f"CWD: {item['cwd']}", f"ARGV: {json.dumps(item['argv'])}",
            f"Launcher ARGV: {json.dumps(item['launcher_argv'])}",
            f"Shell command: {item['shell_command']}",
            f"STDOUT: {item['stdout_path']}", f"STDOUT SHA256: {item['stdout_sha256']}",
            f"STDERR: {item['stderr_path']}", f"STDERR SHA256: {item['stderr_sha256']}",
            f"Layout SHA256: {item['layout_sha256']}",
            f"Test SHA256: {item['test_sha256']}",
            f"Source SHA256: {item['source_sha256']}",
            f"Harness SHA256: {item['harness_sha256']}", "",
        ]
    (evidence.OUT / "command-ledger.md").write_text("\n".join(ledger) + "\n")
    replacements = {
        "@@COMMANDS@@": str(len(commands)),
        "@@FAILED_COMMANDS@@": str(sum(item["exit_code"] != 0 for item in commands)),
        "@@LAYOUT_SHA@@": evidence.sha(evidence.LAYOUT),
        "@@TEST_SHA@@": evidence.sha(evidence.TEST),
    }
    report = (evidence.OUT / "report-template.md").read_text()
    for marker, value in replacements.items():
        report = report.replace(marker, value)
    assert "@@" not in report
    (evidence.OUT / "report.md").write_text(report)
    hashes = {
        str(path): evidence.sha(path)
        for path in sorted(evidence.OUT.rglob("*")) if path.is_file()
    }
    hashes[str(evidence.LAYOUT)] = evidence.sha(evidence.LAYOUT)
    hashes[str(evidence.TEST)] = evidence.sha(evidence.TEST)
    evidence.dump(evidence.OUT / "final-hashes.json", {
        "timestamp": evidence.stamp(), "files": hashes,
        "source_original_and_final_sha256": evidence.SOURCE_SHA,
        "inventory_excludes_self_and_subsequently_written_freeze": True,
    })
    frozen = {
        "timestamp": evidence.stamp(), "status": "WAIT",
        "owned_files": {
            str(evidence.LAYOUT): evidence.sha(evidence.LAYOUT),
            str(evidence.TEST): evidence.sha(evidence.TEST),
        },
        "report_path": str(evidence.OUT / "report.md"),
        "report_sha256": evidence.sha(evidence.OUT / "report.md"),
        "test_evidence_sha256": evidence.sha(evidence.OUT / "test-evidence.json"),
        "native_count_sha256": evidence.sha(evidence.OUT / "native-count.json"),
        "command_ledger_sha256": evidence.sha(evidence.OUT / "command-ledger.md"),
        "commands_jsonl_sha256": evidence.sha(evidence.OUT / "commands.jsonl"),
        "final_hashes_sha256": evidence.sha(evidence.OUT / "final-hashes.json"),
        "patch_sha256": evidence.sha(evidence.OUT / "layout-change.patch"),
        "command_records": len(commands),
        "source_sha256": evidence.sha(evidence.SOURCE),
        "native_count_outcome": "FAIL14/13",
        "new_test_cases": 20, "test_attempts": 22, "failed_test_attempts": 2,
        "new_model_images": 0, "permanent_model_images": 6,
        "diagnostic_fullpage_count_calls": 0, "ready_native_count_calls": 1,
        "unanchored_band": "UNKNOWN; unmasked; no exclusion approval",
        "all_preservation_checks_passed": True,
        "no_active_writes_or_command_sessions_after_handoff": True,
        "owned_file_ownership_released_to_parent": True,
    }
    evidence.dump(evidence.OUT / "handoff-freeze.json", frozen)
    assert frozen["owned_files"][str(evidence.LAYOUT)] == evidence.sha(evidence.LAYOUT)
    assert frozen["owned_files"][str(evidence.TEST)] == evidence.sha(evidence.TEST)
    print(json.dumps({**frozen, "freeze_sha256": evidence.sha(evidence.OUT / "handoff-freeze.json")},
                     indent=2))


if __name__ == "__main__":
    verify()
    print("Preservation, test contract, sole native failure, and scoped patch verified; no tests/counts run.")
