import copy
import hashlib
import json
from collections import Counter
from pathlib import Path


OWN = Path("/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck/.tmp/stemrobin-184-six/n88-choice-review/semantic-affected01/comparison")
data = json.loads((OWN / "intake.json").read_text(encoding="utf-8"))
plan = json.loads((OWN / "review-plan.json").read_text(encoding="utf-8"))


def digest(value):
    text = json.dumps(value, sort_keys=True, ensure_ascii=True, separators=(",", ":"))
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def save_new(name, value):
    with (OWN / name).open("x", encoding="utf-8") as handle:
        json.dump(value, handle, ensure_ascii=False, indent=2)
        handle.write("\n")


sources = copy.deepcopy(data["prior_source_reviews"])
for source in sources:
    number = str(source["source_number"])
    if number in plan["source_solution_overrides"]:
        source["independent_solution"] = plan["source_solution_overrides"][number]
    if number in plan["source_coverage"]:
        source["coverage"] = plan["source_coverage"][number]

protected = copy.deepcopy(data["protected_question_reviews"])
questions = copy.deepcopy(protected)
new_by_id = {row["id"]: row for row in data["new_questions"]}
truth_by_id = {row["id"]: row for row in data["blind_truths"]}
comparison_counts = Counter()
for assessment in plan["question_assessments"]:
    identifier = assessment["id"]
    authored = new_by_id[identifier]
    frozen = truth_by_id[identifier]
    if set(assessment["rationale_assessments"]) != set(authored["option_ids"]):
        raise RuntimeError(f"missing per-option comparison evidence: {identifier}")
    rationale_by_id = {row["option_id"]: row for row in authored["key"]["rationales"]}
    key_matches = set(authored["key"]["correct"]) == set(frozen["true_option_ids"])
    option_checks = []
    truths_match = True
    misconceptions_typed = True
    for option in frozen["options"]:
        expected = "correct" if option["true"] else "incorrect"
        rationale = rationale_by_id[option["id"]]
        matches = rationale["truth"] == expected
        truths_match = truths_match and matches
        misconception_ok = (
            rationale["misconception"] is None if option["true"]
            else isinstance(rationale["misconception"], str) and bool(rationale["misconception"].strip())
        )
        misconceptions_typed = misconceptions_typed and misconception_ok
        comparison_counts["rationale_truth_matches" if matches else "rationale_truth_mismatches"] += 1
        comparison_counts["misconception_fields_match_type" if misconception_ok else "misconception_field_errors"] += 1
        option_checks.append({
            "option_id": option["id"],
            "truth": expected,
            "evidence": option["evidence"] + " Released-author comparison: " + assessment["rationale_assessments"][option["id"]],
        })
    comparison_counts["keys_match" if key_matches else "keys_mismatch"] += 1
    pieces = ["Reused pre-key blind solution, SHAe84f24f6b283a34b1b92f627ed2705dbb92c971e6bcfcddafbc785ee277fdec4.", frozen["domain"]]
    for field in ("complete_solution", "independent_profile", "values_in_input_order", "independent_relationship", "independent_sum_profile", "independent_global_relationship"):
        if field in frozen:
            pieces.append(field + ": " + json.dumps(frozen[field], ensure_ascii=False))
    pieces.extend(option["evidence"] for option in frozen["options"] if option["true"])
    pieces.append("Complete independent true set: " + ",".join(frozen["true_option_ids"]) + ".")
    if not (key_matches and truths_match and misconceptions_typed):
        pieces.append("The released key, truth labels or misconception fields disagree with this frozen evaluation; no independent truth was normalized to match them.")
    questions.append({
        "question_id": identifier,
        "task_fidelity": assessment["task_fidelity"],
        "redundancy": assessment["redundancy"],
        "answer_leakage": assessment["answer_leakage"],
        "mathematics": {
            "verdict": "pass" if key_matches and truths_match and misconceptions_typed else "revise",
            "independent_solution": " ".join(pieces),
            "correct": frozen["true_option_ids"],
            "option_checks": option_checks,
        },
    })

if questions[:6] != data["protected_question_reviews"]:
    raise RuntimeError("protected six question reviews changed")
if len(sources) != 34 or len(questions) != 18:
    raise RuntimeError("unexpected report record counts")
if set(new_by_id) != {row["id"] for row in plan["question_assessments"]}:
    raise RuntimeError("affected assessment partition mismatch")
if data["new_figures_count"] or data["figure_checks"] or data["new_figure_reviews"]:
    raise RuntimeError("unexpected figure scope")

verdicts = [row["coverage"]["verdict"] for row in sources]
for question in questions:
    verdicts.extend(question[field]["verdict"] for field in ("task_fidelity", "redundancy", "answer_leakage", "mathematics"))
outcome = "blocked" if "blocked" in verdicts else "revise" if "revise" in verdicts else "pass"
review = {
    "schema": "s10y-choice-review-v1",
    "seed_sha256": data["seed_sha256"],
    "draft_sha256": data["draft_sha256"],
    "reviewer": plan["reviewer"],
    "source_reviews": sources,
    "figure_checks": data["figure_checks"],
    "new_figure_reviews": data["new_figure_reviews"],
    "question_reviews": questions,
    "outcome": outcome,
}
save_new("review.json", review)
summary = {
    "schema": "stemrobin1846/affected12-comparison-summary@1",
    "outcome": outcome,
    "original_question_reviews_exactly_reused": 6,
    "new_question_reviews": 12,
    "protected_six_canonical_sha256": digest(protected),
    "new_option_checks": sum(len(row["mathematics"]["option_checks"]) for row in questions[6:]),
    "comparison_counts": dict(comparison_counts),
    "source_review_count": len(sources),
    "source_solution_strings_unchanged": sum(
        current["independent_solution"] == prior["independent_solution"]
        for current, prior in zip(sources, data["prior_source_reviews"])
    ),
    "source_solution_strings_extended_from_fixed_ten_premise": len(plan["source_solution_overrides"]),
    "source_coverage_records_reassessed": len(plan["source_coverage"]),
    "source_coverage_records_exactly_reused": len(sources) - len(plan["source_coverage"]),
    "source_coverage_verdict_counts": dict(Counter(row["coverage"]["verdict"] for row in sources)),
    "question_verdict_counts": {
        field: dict(Counter(row[field]["verdict"] for row in questions))
        for field in ("task_fidelity", "redundancy", "answer_leakage", "mathematics")
    },
    "author_candidate_edits": 0,
    "new_validation_runs_at_build": 0,
}
save_new("comparison-summary.json", summary)
print(json.dumps(summary, ensure_ascii=False, indent=2))
