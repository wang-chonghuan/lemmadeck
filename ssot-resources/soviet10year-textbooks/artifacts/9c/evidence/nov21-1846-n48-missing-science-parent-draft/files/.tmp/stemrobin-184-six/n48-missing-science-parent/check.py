import hashlib
import json
from fractions import Fraction
from pathlib import Path

ROOT = Path("/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck")
assert Path.cwd() == ROOT
folder = ROOT / ".tmp/stemrobin-184-six/n48-missing-science-parent"
expected_path = folder / "expected.json"
expected_bytes = expected_path.read_bytes()
expected = json.loads(expected_bytes)
assert expected["status"] == "DRAFT_EXPECTATIONS_BEFORE_EXECUTION_NOT_APPROVAL"
assert len(expected["cases"]) == 10
results = []
for case in expected["cases"]:
    x = Fraction(case["x"])
    if case["function"] == "a":
        assert x != 0
        value = 2 * x + 1 / x**2
        slope = 2 - 2 / x**3
    else:
        assert case["function"] == "b"
        value = 2 * x / (1 + x**2)
        slope = 2 * (1 - x**2) / (1 + x**2)**2
    assert value == Fraction(case["value"]), case
    assert slope == Fraction(case["slope"]), case
    results.append({**case, "status": "PASS"})
print(json.dumps({
    "status": "PASS_BOUNDED_NEW_GRAPH_COORDINATE_SLOPE_ARITHMETIC_ONLY",
    "expected_sha256": hashlib.sha256(expected_bytes).hexdigest(),
    "cases": results,
    "universal_arguments": "Parent draft algebra/sign/limit reasoning, not sample-only proof",
    "zero_power_source_convention": "HOLD_NOT_INFERRED",
    "independent_review": "NOT_RUN",
    "source_math_native_replays": 0,
    "image_views_or_decodes": 0,
    "complete_lesson_delta": 0,
}, indent=2))
