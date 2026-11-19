import datetime
import hashlib
import json
import os
from pathlib import Path

ROOT = Path("/Users/yong/.codex/worktrees/d9b1/lemmadeck")
assert Path.cwd() == ROOT
B = Path(".intentfold/tickets/STEMROBIN-182/tmp/resume182-11")
OWN = B / "n36-choice-review-affected"


def load(path):
    return json.loads(path.read_bytes())


def byte_hash(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def digest(value):
    return hashlib.sha256(
        json.dumps(value, sort_keys=True, ensure_ascii=True, separators=(",", ":")).encode()
    ).hexdigest()


names = [
    "01-source-inheritance.json", "02-view-projection.json", "03-view-freeze.json",
    "04-internal-disclosure.json", "05-review-freeze.json", "06-validation.json",
]
for before, after in zip(names, names[1:]):
    assert byte_hash(OWN / before) == load(OWN / after)["prior_receipt_byte_sha256"]
freeze = load(OWN / "05-review-freeze.json")
validation = load(OWN / "06-validation.json")
assert validation["invocation_count"] == 1 and validation["exit_code"] == 0
assert validation["stdout"] == "mechanical checks passed; declared semantic review: pass (not automatically proved)\n"
assert validation["stderr"] == ""
assert byte_hash(Path(validation["invocation"]["path"])) == validation["invocation"]["byte_sha256"]
assert byte_hash(OWN / "review.json") == freeze["review"]["byte_sha256"]
for name in ("inheritance", "delta", "internal_comparison"):
    ref = freeze[name]
    assert byte_hash(Path(ref["path"])) == ref["byte_sha256"]
for ref in validation["logs"]:
    assert byte_hash(Path(ref["path"])) == ref["byte_sha256"]
assert byte_hash(B / "n36-choice-repaired/seed.json") == validation["seed_byte_sha256"]
assert byte_hash(B / "n36-choice-repaired/draft.json") == validation["draft_byte_sha256"]
assert byte_hash(B / "n36-choice-repaired/affected-repair.json") == load(OWN / "04-internal-disclosure.json")["affected_repair"]["byte_sha256"]
assert byte_hash(B / "n36-author/draft.json") == "1b169d2605d50f09cbbca25490b4cb5ea4220d803fb5678f6dcf2a811018f4a9"
assert byte_hash(B / "n36-choice-review-FIRST/review.json") == "35f58d9c9b25e17f9cef78643147b6579948d4f8de9300b75b69c717778033ed"
assert byte_hash(B / "n36-774-figures-independent-FIRST.json") == "1e2ee7624db1578ffe1d8a4960bed583d228a7bfb929a5fa0f7293f17a9ca721"

review = load(OWN / "review.json")
prior = load(B / "n36-choice-review-FIRST/review.json")
affected = {"q774-line-graphical", "q774-reciprocal-graphical"}
old_rows = {row["question_id"]: row for row in prior["question_reviews"]}
assert digest(review) == freeze["review"]["canonical_sha256"]
assert review["outcome"] == "pass" and len(review["question_reviews"]) == 21
assert len(review["source_reviews"]) == 16
assert sum(len(row["mathematics"]["option_checks"]) for row in review["question_reviews"]) == 96
for row in review["question_reviews"]:
    if row["question_id"] not in affected:
        assert row == old_rows[row["question_id"]]
old_sources = {row["source_number"]: row for row in prior["source_reviews"]}
for row in review["source_reviews"]:
    assert row["independent_solution"] == old_sources[row["source_number"]]["independent_solution"]
    if row["source_number"] != "774":
        assert row == old_sources[row["source_number"]]
for row in review["figure_checks"]:
    assert byte_hash(Path(row["asset_path"])) == row["asset_sha256"]
blind = load(OWN / "view-analysis.json")
new_rows = {row["question_id"]: row for row in review["question_reviews"]}
for row in blind["question_reviews"]:
    current = new_rows[row["question_id"]]
    for name in ("task_fidelity", "redundancy", "answer_leakage"):
        assert row[name] == current[name]
    assert row["mathematics"]["correct"] == current["mathematics"]["correct"]
    assert [value["truth"] for value in row["mathematics"]["option_checks"]] == [
        value["truth"] for value in current["mathematics"]["option_checks"]
    ]

files = [OWN / name for name in (
    "start-affected.py", "01-source-inheritance.json",
    "project-affected-view.py", "learner-view.json", "02-view-projection.json",
    "view-analysis.json", "freeze-affected-view.py", "03-view-freeze.json",
    "disclose-affected.py", "04-internal-disclosure.json",
    "internal-comparison.json", "assemble-affected-review.py",
    "inheritance.json", "delta.json", "review.json", "05-review-freeze.json",
    "run-validation-once.py", "validation-invocation.json",
    "validate.stdout.log", "validate.stderr.log", "validate.log",
    "06-validation.json", "review.md", "freeze-handoff.py",
)]
outputs = []
for path in files:
    assert path.resolve().is_relative_to(OWN.resolve())
    outputs.append({"path": str(path.resolve()), "byte_sha256": byte_hash(path)})
    os.chmod(path, 0o444)
receipt = {
    "stage": "affected-handoff-frozen",
    "frozen_at_utc": datetime.datetime.now(datetime.timezone.utc).isoformat(),
    "cwd": str(ROOT),
    "prior_receipt_byte_sha256": byte_hash(OWN / "06-validation.json"),
    "ordered_receipt_chain_verified": True,
    "outcome": "pass",
    "validator_invocation_count": 1,
    "validator_exit_code": 0,
    "images": 0,
    "counts": {
        "affected_questions": 2, "affected_options": 8,
        "inherited_questions": 19, "inherited_options": 88,
        "total_questions": 21, "total_options": 96,
        "affected_source_coverages": 1, "inherited_source_coverages": 15,
        "inherited_source_solutions": 16, "inherited_independent_figure_passes": 2,
    },
    "seed_canonical_sha256": freeze["seed_sha256"],
    "draft_canonical_sha256": freeze["draft_sha256"],
    "review_canonical_sha256": digest(review),
    "first_blocked_review_unchanged": True,
    "original_and_repaired_drafts_unchanged_by_reviewer": True,
    "inherited_records_verbatim": True,
    "frozen_affected_truth_sets_and_view_verdicts_unchanged": True,
    "file_mode": "0444",
    "outputs": outputs,
}
path = OWN / "07-handoff.json"
with path.open("x", encoding="utf-8") as stream:
    json.dump(receipt, stream, indent=2)
    stream.write("\n")
os.chmod(path, 0o444)
print(json.dumps(receipt, indent=2))
