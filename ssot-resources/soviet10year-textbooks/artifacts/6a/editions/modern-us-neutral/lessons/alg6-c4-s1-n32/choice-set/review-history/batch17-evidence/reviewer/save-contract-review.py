"""Assemble already-reviewed evidence and bind its snapshots; run no validator."""
import copy
import hashlib
import json
from pathlib import Path


ROOT = Path(".intentfold/tickets/STEMROBIN-182/tmp")
REVIEWER = ROOT / "reviewer-6a-n32"
AUTHOR = ROOT / "6a-n32"


def read_json(path):
    return json.loads(path.read_text(encoding="utf-8"))


def byte_digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def canonical_digest(value):
    serialized = json.dumps(
        value, sort_keys=True, ensure_ascii=True, separators=(",", ":")
    )
    return hashlib.sha256(serialized.encode("utf-8")).hexdigest()


def save_new(path, value):
    with path.open("x", encoding="utf-8") as handle:
        handle.write(json.dumps(value, ensure_ascii=False, indent=2) + "\n")


source = read_json(REVIEWER / "source-solutions.json")
pure = read_json(REVIEWER / "view-checks.json")
internal = read_json(REVIEWER / "internal-comparison-evidence.json")
seed = read_json(AUTHOR / "seed.json")
draft = read_json(AUTHOR / "draft.json")
author_source = read_json(AUTHOR / "source-solutions.json")

# Joins must use the frozen evidence, not silently follow a changed author view.
assert byte_digest(REVIEWER / "source-solutions.json") == pure["source_evidence"]["byte_sha256"]
assert byte_digest(AUTHOR / "view.json") == pure["view_snapshot"]["byte_sha256"]
assert byte_digest(AUTHOR / "seed.json") == source["seed_byte_sha256"]
projection = {
    "questions": [
        {field: question[field] for field in ("id", "source_numbers", "view")}
        for question in draft["questions"]
    ]
}
assert projection == read_json(AUTHOR / "view.json")
seed_digest = canonical_digest(seed)
assert seed_digest == draft["seed_sha256"] == author_source["seed_sha256"]

comparisons = {
    item["question_id"]: item for item in internal["question_comparisons"]
}
questions = {item["id"]: item for item in draft["questions"]}
question_reviews = copy.deepcopy(pure["question_reviews"])
for question_review in question_reviews:
    question_id = question_review["question_id"]
    author_question = questions[question_id]
    comparison = comparisons[question_id]
    assert (
        question_review["mathematics"]["correct"]
        == comparison["independent_correct"]
        == author_question["key"]["correct"]
    )
    programs = {
        item["option_id"]: item for item in comparison["option_program_checks"]
    }
    rationales = {
        item["option_id"]: item for item in author_question["key"]["rationales"]
    }
    for option in question_review["mathematics"]["option_checks"]:
        option_id = option["option_id"]
        assert option["truth"] == rationales[option_id]["truth"]
        assert programs[option_id]["verdict"] == "pass"
        option["evidence"] += (
            " Author derivation/misconception comparison after independent truth freeze: "
            + programs[option_id]["evidence"]
        )
    question_review["mathematics"]["independent_solution"] += (
        " Author source/intent comparison: "
        + comparison["source_solution_comparison"]
    )
    question_review["task_fidelity"]["evidence"] += (
        " Internal unit and local production-loss comparison: "
        + comparison["unit_reason_and_limitations_evidence"]
    )

source_coverage = {
    item["source_number"]: item for item in pure["source_coverage"]
}
coverage_comparisons = {
    item["source_number"]: item for item in internal["source_coverage_comparison"]
}
author_coverage = {
    item["source_number"]: item for item in draft["coverage"]
}
source_reviews = []
for baseline in source["sources"]:
    number = baseline["source_number"]
    citing_ids = [
        item["id"]
        for item in draft["questions"]
        if number in item["source_numbers"]
    ]
    previous_coverage = source_coverage[number]
    compared_coverage = coverage_comparisons[number]
    assert citing_ids == previous_coverage["question_ids"] == author_coverage[number]["question_ids"]
    assert previous_coverage["verdict"] == compared_coverage["verdict"]
    source_reviews.append(
        {
            "source_number": number,
            "independent_solution": baseline["independent_solution"],
            "coverage": {
                "verdict": compared_coverage["verdict"],
                "evidence": (
                    previous_coverage["evidence"]
                    + " Internal author-source/intent/coverage comparison: "
                    + compared_coverage["evidence"]
                ),
            },
        }
    )

assert draft["new_figures"] == []
review = {
    "schema": "s10y-choice-review-v1",
    "seed_sha256": seed_digest,
    "draft_sha256": canonical_digest(draft),
    "reviewer": source["reviewer"],
    "source_reviews": source_reviews,
    "figure_checks": copy.deepcopy(pure["figure_checks"]),
    "new_figure_reviews": [],
    "question_reviews": question_reviews,
    "outcome": "blocked",
}
review_path = REVIEWER / "review.json"
save_new(review_path, review)
result = {
    "stage": "final_contract_semantic_review_saved_without_validator",
    "outcome": review["outcome"],
    "question_mathematics": "pass",
    "option_programs": "pass",
    "sources": len(source_reviews),
    "questions": len(question_reviews),
    "options": sum(
        len(item["mathematics"]["option_checks"]) for item in question_reviews
    ),
    "source_coverage_pass": 14,
    "source_coverage_blocked": 1,
    "review_path": review_path.as_posix(),
    "review_byte_sha256": byte_digest(review_path),
    "seed_sha256": review["seed_sha256"],
    "draft_sha256": review["draft_sha256"],
    "author_source_byte_sha256": byte_digest(AUTHOR / "source-solutions.json"),
    "source_evidence_byte_sha256": byte_digest(REVIEWER / "source-solutions.json"),
    "pure_view_evidence_byte_sha256": byte_digest(REVIEWER / "view-checks.json"),
    "internal_evidence_byte_sha256": byte_digest(REVIEWER / "internal-comparison-evidence.json"),
    "findings": internal["findings"],
    "narrow_internal_repair_findings": [],
    "original_source_and_pure_view_preserved": True,
    "validator_invocations": 0,
    "validation_result": None,
    "browser_invocations": 0,
    "durable_or_author_writes": False,
    "model": None,
    "usage": None,
}
save_new(REVIEWER / "final-comparison-result.json", result)
print(json.dumps(result, ensure_ascii=False, indent=2))
