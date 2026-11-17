"""Run only frozen NEW cases; passing cases cannot be rerun."""
import json
import sys

import evidence


design = json.loads((evidence.OUT / "new-test-design-checkpoint.json").read_text())
assert evidence.sha(evidence.TEST) == design["test_sha256"]
attempt_path = evidence.OUT / "test-attempts.jsonl"
attempts = [
    json.loads(line) for line in attempt_path.read_text().splitlines()
] if attempt_path.exists() else []
selected = sys.argv[1:] or design["cases"]
if not sys.argv[1:]:
    assert not attempts
failures = 0
for case in selected:
    assert case in design["cases"]
    previous = [item for item in attempts if item["case"] == case]
    assert not previous or previous[-1]["exit_code"] != 0
    argv = [
        sys.executable, "-B", "-m", "unittest", "-v",
        "test_layout_integral_limit_rows.IntegralLimitGeometryTests." + case,
    ]
    record = evidence.run(argv, evidence.TOOLS, case)
    attempt = {"case": case, "attempt": len(previous) + 1, **record}
    evidence.append(attempt_path, attempt)
    attempts.append(attempt)
    failures += record["exit_code"] != 0
evidence.dump(evidence.OUT / "test-evidence.json", {
    "frozen_test_sha256": design["test_sha256"], "attempts": attempts,
    "new_cases": len(design["cases"]), "failed_attempts": sum(x["exit_code"] != 0 for x in attempts),
    "latest_case_results": {
        case: [x for x in attempts if x["case"] == case][-1]["status"]
        for case in design["cases"] if any(x["case"] == case for x in attempts)
    },
    "old_test_runs": 0,
})
print({"selected": len(selected), "failed": failures, "total_attempts": len(attempts)})
sys.exit(bool(failures))
