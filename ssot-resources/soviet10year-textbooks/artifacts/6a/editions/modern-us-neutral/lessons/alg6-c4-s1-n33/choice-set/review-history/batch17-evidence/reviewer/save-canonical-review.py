"""Mechanically bind completed independent evidence; not validate.py."""
import copy
import hashlib
import json
from pathlib import Path

directory = Path(".intentfold/tickets/STEMROBIN-182/tmp/reviewer-6a-n33")
author = Path(".intentfold/tickets/STEMROBIN-182/tmp/6a-n33")
def load(path):
    return json.loads(path.read_text(encoding="utf-8"))
def canonical_hash(value):
    return hashlib.sha256(json.dumps(value, sort_keys=True, ensure_ascii=True, separators=(",", ":")).encode("utf-8")).hexdigest()
def byte_hash(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()
source = load(directory / "source-solutions.json")
pure = load(directory / "view-checks-revised.json")
internal = load(directory / "internal-comparison-evidence.json")
seed = load(author / "seed.json")
draft = load(author / "draft.json")
assert byte_hash(directory / "source-solutions.json") == pure["inputs"]["source_baseline_frozen_before_opening_view"]["byte_sha256"]
assert pure["outcome"] == internal["outcome"] == "pass"
assert canonical_hash(seed) == source["input"]["canonical_sha256"] == draft["seed_sha256"]
assert seed["figures"] == draft["new_figures"] == []
assert {"questions": [{field: q[field] for field in ("id", "source_numbers", "view")} for q in draft["questions"]]} == load(author / "view.json")
question_reviews = copy.deepcopy(pure["lessons"][0]["question_reviews"])
comparisons = {q["question_id"]: q for q in internal["question_comparisons"]}
for qreview in question_reviews:
    authored = next(q for q in draft["questions"] if q["id"] == qreview["question_id"])
    compared = comparisons[qreview["question_id"]]
    assert authored["key"]["correct"] == qreview["mathematics"]["correct"]
    checks = {check["option_id"]: check for check in compared["option_program_checks"]}
    rationales = {r["option_id"]: r for r in authored["key"]["rationales"]}
    for option in qreview["mathematics"]["option_checks"]:
        assert rationales[option["option_id"]]["truth"] == option["truth"]
        assert checks[option["option_id"]]["verdict"] == "pass"
        option["evidence"] += " Internal comparison after truth freeze: " + checks[option["option_id"]]["evidence"]
    qreview["task_fidelity"]["evidence"] += " Internal intent comparison: " + compared["unit_reason_and_limitations_evidence"]
coverage_comparisons = {item["source_number"]: item for item in internal["source_coverage_comparison"]}
source_reviews = []
for baseline in source["sources"]:
    number = baseline["source_number"]
    cov = next(item for item in pure["source_coverage"] if item["source_number"] == number)
    actual_ids = [q["id"] for q in draft["questions"] if number in q["source_numbers"]]
    coverage = next(item for item in draft["coverage"] if item["source_number"] == number)
    assert actual_ids == cov["question_ids"] == coverage["question_ids"]
    evidence = cov["coverage"]["evidence"] + " Internal coverage comparison: " + coverage_comparisons[number]["evidence"]
    evidence += " Concrete response-production limits: " + "; ".join(cov["production_losses"])
    source_reviews.append({"source_number": number, "independent_solution": baseline["independent_solution"], "coverage": {"verdict": "pass", "evidence": evidence}})
review = {
    "schema": "s10y-choice-review-v1",
    "seed_sha256": canonical_hash(seed),
    "draft_sha256": canonical_hash(draft),
    "reviewer": source["reviewer"],
    "source_reviews": source_reviews,
    "figure_checks": [],
    "new_figure_reviews": [],
    "question_reviews": question_reviews,
    "outcome": "pass",
}
review_path = directory / "review.json"
with review_path.open("x", encoding="utf-8") as handle:
    handle.write(json.dumps(review, ensure_ascii=False, indent=2) + "\n")
summary = {
    "stage": "canonical_semantic_comparison_complete_without_validation",
    "outcome": "pass",
    "sources": len(source_reviews),
    "questions": len(question_reviews),
    "option_checks": sum(len(q["mathematics"]["option_checks"]) for q in question_reviews),
    "review_path": review_path.as_posix(),
    "review_byte_sha256": byte_hash(review_path),
    "seed_sha256": review["seed_sha256"],
    "draft_sha256": review["draft_sha256"],
    "findings": internal["findings"],
    "old_rejected_evidence_preserved": True,
    "validate_invocations": 0,
    "validation_result": None,
    "browser_invocations": 0,
    "model": None,
    "usage": None,
}
with (directory / "final-comparison-result.json").open("x", encoding="utf-8") as handle:
    handle.write(json.dumps(summary, ensure_ascii=False, indent=2) + "\n")
print(json.dumps(summary, ensure_ascii=False, indent=2))
