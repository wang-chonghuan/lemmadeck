import copy
import datetime
import hashlib
import json
import os
from pathlib import Path

ROOT = Path("/Users/yong/.codex/worktrees/d9b1/lemmadeck")
assert Path.cwd() == ROOT
B = Path(".intentfold/tickets/STEMROBIN-182/tmp/resume182-11")
OWN = B / "n36-choice-review-FIRST"


def load(path):
    return json.loads(path.read_bytes())


def digest(value):
    return hashlib.sha256(
        json.dumps(
            value, sort_keys=True, ensure_ascii=True, separators=(",", ":")
        ).encode()
    ).hexdigest()


source_receipt = load(OWN / "01-source-freeze.json")
view_receipt = load(OWN / "03-view-freeze.json")
disclosure_receipt = load(OWN / "04-internal-disclosure.json")
source_path = OWN / "source-solutions.json"
view_path = OWN / "view-analysis.json"
assert hashlib.sha256(source_path.read_bytes()).hexdigest() == source_receipt["evidence_byte_sha256"]
assert hashlib.sha256(view_path.read_bytes()).hexdigest() == view_receipt["evidence_byte_sha256"]
seed_path = B / "n36-author/seed.json"
draft_path = B / "n36-author/draft.json"
seed = load(seed_path)
draft = load(draft_path)
assert digest(seed) == source_receipt["seed_canonical_sha256"]
assert hashlib.sha256(seed_path.read_bytes()).hexdigest() == source_receipt["seed_byte_sha256"]
assert digest(draft) == disclosure_receipt["draft_canonical_sha256"]
assert digest(draft) == view_receipt["draft_canonical_sha256"]
assert hashlib.sha256(draft_path.read_bytes()).hexdigest() == disclosure_receipt["draft_byte_sha256"]
assert seed["figures"] == []
assert draft["new_figures"] == []

sources = load(source_path)["source_reviews"]
blind = load(view_path)["question_reviews"]
comparison_path = OWN / "internal-comparison.json"
comparison = load(comparison_path)
coverage = {row["source_number"]: row for row in comparison["source_coverage"]}
internal_checks = {row["question_id"]: row for row in comparison["questions"]}
authored = {row["id"]: row for row in draft["questions"]}
assert set(coverage) == {row["source_number"] for row in sources}
assert set(internal_checks) == set(authored) == {row["question_id"] for row in blind}

question_reviews = copy.deepcopy(blind)
for row in question_reviews:
    qid = row["question_id"]
    math = row["mathematics"]
    author = authored[qid]
    # Compare, never replace, the independently frozen sets and truth labels.
    assert set(math["correct"]) == set(author["key"]["correct"]), qid
    rationales = {item["option_id"]: item for item in author["key"]["rationales"]}
    checked = internal_checks[qid]
    assert set(checked["rationale_checks"]) == set(rationales)
    for option in math["option_checks"]:
        oid = option["option_id"]
        assert option["truth"] == rationales[oid]["truth"], (qid, oid)
        option["evidence"] += " Author rationale/misconception comparison: " + checked["rationale_checks"][oid]
    math["independent_solution"] += " Post-freeze intent comparison: " + checked["intent_check"]

source_reviews = []
for row in sources:
    assessed = coverage[row["source_number"]]
    source_reviews.append({
        **row,
        "coverage": {"verdict": assessed["verdict"], "evidence": assessed["evidence"]},
    })
verdicts = [row["coverage"]["verdict"] for row in source_reviews]
for row in question_reviews:
    verdicts.extend(row[name]["verdict"] for name in (
        "task_fidelity", "redundancy", "answer_leakage", "mathematics"
    ))
outcome = "blocked" if "blocked" in verdicts else "revise" if "revise" in verdicts else "pass"
review = {
    "schema": "s10y-choice-review-v1",
    "seed_sha256": digest(seed),
    "draft_sha256": digest(draft),
    "reviewer": {
        "kind": "independent_agent",
        "identity": "Codex independent n36 reviewer for STEMROBIN-182; not the n36 draft author; source-first and learner-view-blind evidence frozen before author internals.",
    },
    "source_reviews": source_reviews,
    "figure_checks": [],
    "new_figure_reviews": [],
    "question_reviews": question_reviews,
    "outcome": outcome,
}
assert len(source_reviews) == 16 and len(question_reviews) == 21
assert sum(len(row["mathematics"]["option_checks"]) for row in question_reviews) == 96
path = OWN / "review.json"
serialized = (json.dumps(review, ensure_ascii=True, indent=2) + "\n").encode()
with path.open("xb") as stream:
    stream.write(serialized)
os.chmod(path, 0o444)
os.chmod(comparison_path, 0o444)
receipt = {
    "stage": "3-complete",
    "frozen_at_utc": datetime.datetime.now(datetime.timezone.utc).isoformat(),
    "cwd": str(ROOT),
    "prior_receipt_byte_sha256": hashlib.sha256(
        (OWN / "04-internal-disclosure.json").read_bytes()
    ).hexdigest(),
    "comparison_path": str(comparison_path),
    "comparison_byte_sha256": hashlib.sha256(comparison_path.read_bytes()).hexdigest(),
    "comparison_canonical_sha256": digest(comparison),
    "review_path": str(path),
    "review_byte_sha256": hashlib.sha256(serialized).hexdigest(),
    "review_canonical_sha256": digest(review),
    "seed_sha256": digest(seed),
    "draft_sha256": digest(draft),
    "source_count": 16,
    "question_count": 21,
    "option_count": 96,
    "independent_true_sets_changed": False,
    "frozen_view_verdicts_changed": False,
    "author_files_changed": False,
    "outcome": outcome,
    "blocked_units": ["q774-line-graphical", "q774-reciprocal-graphical", "source-774-coverage"],
}
receipt_path = OWN / "05-review-freeze.json"
with receipt_path.open("x", encoding="utf-8") as stream:
    json.dump(receipt, stream, indent=2)
    stream.write("\n")
os.chmod(receipt_path, 0o444)
print(json.dumps(receipt, indent=2))
