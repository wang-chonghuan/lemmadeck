import hashlib
import json
from pathlib import Path


ROOT = Path("/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck")
if Path.cwd() != ROOT:
    raise SystemExit("Wrong cwd")

OWN = ".tmp/stemrobin-184-six/n81-choice-review/"
VISIBLE = ".tmp/stemrobin-184-six/n81-choice-visible.json"
STAGE1 = OWN + "STAGE1-MANIFEST.json"
SEMANTICS = OWN + "stage2-fidelity.json"
MATH = OWN + "stage2-mathematics.json"
FINDINGS = OWN + "STAGE2-FINDINGS.md"
SELF = OWN + "check-stage2-freeze.py"
paths = [VISIBLE, STAGE1, SEMANTICS, MATH, FINDINGS, SELF]
raw = {path: (ROOT / path).read_bytes() for path in paths}
hashes = {path: hashlib.sha256(raw[path]).hexdigest() for path in paths}
assert hashes[VISIBLE] == "36819ec780c305bfddba09ae302bc4309118814d373c24d81913f7472282eddc"
assert hashes[STAGE1] == "2928ea511c486eb8fa5f2718d3b9034a481600f41c07c2b19e8488f7bd65cad8"
visible = json.loads(raw[VISIBLE])
semantics = json.loads(raw[SEMANTICS])
mathematics = json.loads(raw[MATH])
assert set(visible) == {"schema", "seed_sha256", "questions", "coverage"}
questions = visible["questions"]
assert len(questions) == 9
assert [q["id"] for q in questions] == [
    q["question_id"] for q in semantics["question_reviews"]
] == [q["question_id"] for q in mathematics["question_reviews"]]
assert len(semantics["source_coverage"]) == len(visible["coverage"]) == 9
assert [q["source_numbers"] for q in questions] == [
    [str(number)] for number in range(60, 69)
]
for question, coverage, source_check in zip(
    questions, visible["coverage"], semantics["source_coverage"]
):
    assert set(question) == {"id", "source_numbers", "view"}
    assert question["view"]["figure_ids"] == []
    assert all(option["figure_ids"] == [] for option in question["view"]["options"])
    assert coverage["source_number"] == source_check["source_number"]
    assert coverage["question_ids"] == source_check["question_ids"] == [question["id"]]
    assert coverage["source_number"] == question["source_numbers"][0]
sets = []
true_count = 0
false_count = 0
for question, review in zip(questions, mathematics["question_reviews"]):
    options = question["view"]["options"]
    checks = review["mathematics"]["option_checks"]
    assert review["mode"] == question["view"]["mode"]
    assert [o["id"] for o in options] == [c["option_id"] for c in checks]
    assert all(c["truth"] in {"correct", "incorrect"} and c["evidence"] for c in checks)
    correct = [c["option_id"] for c in checks if c["truth"] == "correct"]
    assert correct == review["mathematics"]["correct"]
    assert correct
    if review["mode"] == "single":
        assert len(correct) == 1
    true_count += len(correct)
    false_count += len(checks) - len(correct)
    sets.append({"question_id": question["id"], "correct": correct})
assert mathematics["complete_true_sets"] == sets
assert (true_count, false_count) == (13, 25)
assert mathematics["counts"] == {
    "questions_solved": 9,
    "alternatives_checked": 38,
    "true_alternatives": 13,
    "false_alternatives": 25,
    "blocked_alternatives": 0,
}
result = {
    "cwd": str(ROOT),
    "input_and_artifact_byte_sha256": hashes,
    "questions": 9,
    "alternatives": 38,
    "true_alternatives": true_count,
    "false_alternatives": false_count,
    "complete_true_sets": sets,
    "structure_and_binding_check": "pass",
    "mathematical_proof_execution": False,
    "author_key_access": False,
    "stage1_content_reopened": "Manifest bytes only to bind the accepted snapshot; source solutions/group/findings not reread.",
    "images_opened_or_decoded": 0,
}
print(json.dumps(result, sort_keys=True, ensure_ascii=True, indent=2))
