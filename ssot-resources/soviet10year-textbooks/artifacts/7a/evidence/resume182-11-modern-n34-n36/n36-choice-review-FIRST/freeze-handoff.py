import datetime
import hashlib
import json
import os
from pathlib import Path

ROOT = Path("/Users/yong/.codex/worktrees/d9b1/lemmadeck")
assert Path.cwd() == ROOT
B = Path(".intentfold/tickets/STEMROBIN-182/tmp/resume182-11")
OWN = B / "n36-choice-review-FIRST"


def byte_hash(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def load(path):
    return json.loads(path.read_bytes())


receipts = [
    OWN / name for name in (
        "01-source-freeze.json",
        "02-view-projection.json",
        "03-view-freeze.json",
        "04-internal-disclosure.json",
        "05-review-freeze.json",
        "06-validation.json",
    )
]
for previous, current in zip(receipts, receipts[1:]):
    assert byte_hash(previous) == load(current)["prior_receipt_byte_sha256"]
source_receipt, view_receipt = load(receipts[0]), load(receipts[2])
disclosure_receipt, review_receipt, validation_receipt = map(load, receipts[3:])
assert byte_hash(OWN / "source-solutions.json") == source_receipt["evidence_byte_sha256"]
assert byte_hash(OWN / "view-analysis.json") == view_receipt["evidence_byte_sha256"]
assert byte_hash(OWN / "internal-comparison.json") == review_receipt["comparison_byte_sha256"]
assert byte_hash(OWN / "review.json") == review_receipt["review_byte_sha256"]
assert byte_hash(B / "n36-author/seed.json") == source_receipt["seed_byte_sha256"]
assert byte_hash(B / "n36-author/draft.json") == disclosure_receipt["draft_byte_sha256"]
assert validation_receipt["invocation_count"] == 1
assert validation_receipt["exit_code"] == 3
assert validation_receipt["stderr"] == "mechanical checks passed; semantic review outcome: blocked\n"
for name in ("log", "stdout", "stderr"):
    assert byte_hash(Path(validation_receipt[f"{name}_path"])) == validation_receipt[f"{name}_byte_sha256"]

review = load(OWN / "review.json")
blind = load(OWN / "view-analysis.json")
assert review["outcome"] == "blocked"
assert review["reviewer"]["kind"] == "independent_agent"
assert len(review["source_reviews"]) == 16
assert len(review["question_reviews"]) == 21
assert sum(len(row["mathematics"]["option_checks"]) for row in review["question_reviews"]) == 96
for frozen, final in zip(blind["question_reviews"], review["question_reviews"]):
    assert frozen["question_id"] == final["question_id"]
    for name in ("task_fidelity", "redundancy", "answer_leakage"):
        assert frozen[name] == final[name]
    assert frozen["mathematics"]["correct"] == final["mathematics"]["correct"]
    assert [o["truth"] for o in frozen["mathematics"]["option_checks"]] == [
        o["truth"] for o in final["mathematics"]["option_checks"]
    ]

files = [OWN / name for name in (
    "source-solutions.json", "01-source-freeze.json", "project-view.py",
    "learner-view.json", "02-view-projection.json", "view-analysis.json",
    "03-view-freeze.json", "disclose-internals.py", "04-internal-disclosure.json",
    "internal-comparison.json", "assemble-review.py", "review.json",
    "05-review-freeze.json", "run-validation-once.py", "06-validation.json",
    "validate.stdout.log", "validate.stderr.log", "validate.log", "review.md",
    "freeze-handoff.py",
)]
inventory = []
for path in files:
    assert path.resolve().is_relative_to(OWN.resolve())
    inventory.append({"path": str(path), "byte_sha256": byte_hash(path)})
    os.chmod(path, 0o444)
record = {
    "stage": "handoff-frozen",
    "frozen_at_utc": datetime.datetime.now(datetime.timezone.utc).isoformat(),
    "cwd": str(ROOT),
    "prior_receipt_byte_sha256": byte_hash(receipts[-1]),
    "ordered_receipt_chain_verified": True,
    "source_and_view_evidence_unchanged": True,
    "independent_truth_sets_and_view_verdicts_unchanged": True,
    "author_seed_and_draft_bytes_unchanged": True,
    "validator_invocation_count": 1,
    "validator_exit_code": 3,
    "outcome": "blocked",
    "file_mode": "0444",
    "files": inventory,
}
output = OWN / "07-handoff-freeze.json"
with output.open("x", encoding="utf-8") as stream:
    json.dump(record, stream, indent=2)
    stream.write("\n")
os.chmod(output, 0o444)
print(json.dumps(record, indent=2))
