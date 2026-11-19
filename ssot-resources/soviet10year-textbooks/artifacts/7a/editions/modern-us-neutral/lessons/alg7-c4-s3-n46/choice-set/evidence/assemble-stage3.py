import copy
import hashlib
import json
import os
from pathlib import Path


ROOT = Path("/Users/yong/.codex/worktrees/d9b1/lemmadeck")
BASE = ROOT / ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13"
OWNED = BASE / "n46-choice-review"
INPUTS = {
    "stage1": BASE / "n46-n47-modern-review/source-solutions.json",
    "seed": BASE / "n46-choice-author/seed.json",
    "draft": BASE / "n46-choice-author/draft-repair.json",
    "visible": BASE / "n46-choice-author/reviewer-view-repair.json",
    "checks": OWNED / "stage2-checks.json",
    "truths": OWNED / "stage2-truths.json",
    "stage2_summary": OWNED / "stage2-summary.json",
    "assessments": OWNED / "stage3-assessments.json",
}
EXPECTED = {
    "stage1": "c2ff0e265e0f7c6a374689470298c7705906eb297c1b98d8d7845f6b8b41539c",
    "seed": "8861433b0e48930f4d2295f9b7a6a9365630f4d713030704b25892eb5e200b5f",
    "draft": "37841750cfcb0b84b6e19c00dd3b83a571d50f7e055e002e2a66133c9aff65e1",
    "visible": "0aea6e16d0edf4b3e109e6581d2c52cf1c4a2b497eb61669354fba30306c2418",
    "checks": "3c7319ea5caf85ad758d40d5256477de178f761c6a3aaa89729943ec477b1df2",
    "truths": "e459f826b69f0ffc99b249b13911380280a08bc6d54d59513cc0baf79f62c875",
    "stage2_summary": "150b30186ed19aac2d455bb940f7a9bb57e23835677bb63fa9e1ec9c14f9abb0",
}


def digest(value):
    raw = json.dumps(value, sort_keys=True, ensure_ascii=True, separators=(",", ":"))
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()


def freeze_json(name, value):
    path = OWNED / name
    assert path.resolve().parent == OWNED.resolve()
    with path.open("x", encoding="utf-8") as output:
        json.dump(value, output, ensure_ascii=True, indent=2)
        output.write("\n")
    os.chmod(path, 0o444)
    return {
        "path": str(path),
        "file_sha256": hashlib.sha256(path.read_bytes()).hexdigest(),
        "canonical_sha256": digest(value),
        "mode": "0444",
    }


data = {}
bindings = []
for name, path in INPUTS.items():
    raw = path.read_bytes()
    file_hash = hashlib.sha256(raw).hexdigest()
    if name in EXPECTED:
        assert file_hash == EXPECTED[name], (name, "snapshot changed")
    data[name] = json.loads(raw)
    bindings.append({
        "role": name,
        "path": str(path),
        "file_sha256": file_hash,
        "canonical_sha256": digest(data[name]),
    })

draft = data["draft"]
checks = data["checks"]
truths = data["truths"]
assessment = data["assessments"]
questions = draft["questions"]
projection = [
    {field: question[field] for field in ("id", "source_numbers", "view")}
    for question in questions
]
# Snapshot equality permits reuse; this is not another semantic view review.
assert projection == data["visible"]["questions"], "Stage2 view binding changed"
assert not draft["new_figures"] and not data["seed"]["figures"]
assert draft["seed_sha256"] == digest(data["seed"])
assert [q["id"] for q in questions] == [
    q["question_id"] for q in checks["question_checks"]
] == [q["question_id"] for q in truths["question_reviews"]]

canonical_questions = []
question_comparisons = []
false_ids = set()
for question, gates, frozen in zip(
    questions, checks["question_checks"], truths["question_reviews"]
):
    math = copy.deepcopy(frozen["mathematics"])
    key = question["key"]
    assert set(key["correct"]) == set(math["correct"]), question["id"]
    assert len(key["correct"]) == len(math["correct"]), question["id"]
    rationales = {r["option_id"]: r for r in key["rationales"]}
    assert len(rationales) == len(key["rationales"])
    assert set(rationales) == {o["option_id"] for o in math["option_checks"]}
    option_comparisons = []
    for option in math["option_checks"]:
        rationale = rationales[option["option_id"]]
        assert rationale["truth"] == option["truth"], option["option_id"]
        if option["truth"] == "incorrect":
            false_ids.add(option["option_id"])
            assert rationale["misconception"]
            path_evidence = assessment["incorrect_path_checks"][option["option_id"]]
            misconception_check = {"verdict": "pass", "evidence": path_evidence}
            comparison_evidence = (
                "Author truth and refutation agree with the frozen independent "
                "judgment. Incorrect procedure checked: " + path_evidence
            )
        else:
            assert rationale["misconception"] is None
            misconception_check = {
                "verdict": "pass",
                "evidence": "Correct alternative has null misconception; no false procedure is attributed to it.",
            }
            comparison_evidence = (
                "The disclosed author's correct derivation agrees with these "
                "frozen independent values and logical conditions: " + option["evidence"]
            )
        option_comparisons.append({
            "option_id": option["option_id"],
            "independent_truth": option["truth"],
            "author_truth": rationale["truth"],
            "author_derivation": rationale["derivation"],
            "author_misconception": rationale["misconception"],
            "rationale_check": {"verdict": "pass", "evidence": comparison_evidence},
            "incorrect_path_check": misconception_check,
        })
        option["evidence"] += " Author comparison: " + comparison_evidence
    extra = assessment["additional_author_solution_checks"].get(question["id"], "")
    question_comparisons.append({
        "question_id": question["id"],
        "frozen_correct": frozen["mathematics"]["correct"],
        "author_correct": key["correct"],
        "key_check": {
            "verdict": "pass",
            "evidence": "Exact set and all per-option truths agree with the frozen independent judgments.",
        },
        "source_solution_check": {
            "verdict": "pass",
            "author_solution": question["intent"]["source_solution"],
            "evidence": frozen["mathematics"]["independent_solution"] + (" " + extra if extra else ""),
        },
        "author_unit_reason": question["intent"]["unit_reason"],
        "author_limitations": question["intent"]["limitations"],
        "reused_fidelity_evidence": gates["task_fidelity"]["evidence"],
        "option_comparisons": option_comparisons,
    })
    canonical_questions.append({
        "question_id": question["id"],
        "task_fidelity": copy.deepcopy(gates["task_fidelity"]),
        "redundancy": copy.deepcopy(gates["redundancy"]),
        "answer_leakage": copy.deepcopy(gates["answer_leakage"]),
        "mathematics": math,
    })
assert false_ids == set(assessment["incorrect_path_checks"]) and len(false_ids) == 73
assert sum(len(q["option_comparisons"]) for q in question_comparisons) == 114

source_lesson = next(
    item for item in data["stage1"]["lessons"] if item["id"] == "alg7-c4-s3-n46"
)
coverage_by_number = {row["source_number"]: row for row in draft["coverage"]}
source_reviews = []
coverage_comparisons = []
for exercise, frozen_coverage in zip(
    source_lesson["exercises"], checks["independent_pure_coverage"]
):
    number = exercise["number"]
    assert number == frozen_coverage["source_number"]
    author_coverage = coverage_by_number[number]
    assert author_coverage["question_ids"] == [
        link["question_id"] for link in frozen_coverage["question_links"]
    ]
    retained_fields = (
        "D", "derivation", "answer", "roots", "viete_check",
        "equation", "verification", "solution_set",
    )
    parts = []
    for task in exercise["tasks"]:
        solution = {field: task[field] for field in retained_fields if field in task}
        parts.append(task["label"] + ": " + json.dumps(solution, ensure_ascii=True, sort_keys=True))
    source_solution = (
        "Previously frozen independent source solution, reused without re-solving. "
        + exercise.get("method", "") + " " + "; ".join(parts)
    )
    evidence = (
        frozen_coverage["evidence"] + " Declared recognition-capacity losses: "
        + " ".join(frozen_coverage["capacity_losses"])
        + " Author coverage declares these as loss of written production, not "
        "missing mathematical subparts. All linked question identities agree."
    )
    source_reviews.append({
        "source_number": number,
        "independent_solution": source_solution,
        "coverage": {"verdict": "pass", "evidence": evidence},
    })
    coverage_comparisons.append({
        "source_number": number,
        "task_ids": frozen_coverage["task_ids"],
        "independent_question_links": frozen_coverage["question_links"],
        "author_question_ids": author_coverage["question_ids"],
        "author_declared_omitted_tasks": author_coverage["omitted_tasks"],
        "author_reason": author_coverage["reason"],
        "essential_missing_mathematical_tasks": [],
        "retained_reviewer_capacity_losses": frozen_coverage["capacity_losses"],
        "verdict": "pass",
        "evidence": evidence,
    })
assert len(source_reviews) == 10
assert sum(len(row["task_ids"]) for row in coverage_comparisons) == 41

review = {
    "schema": "s10y-choice-review-v1",
    "seed_sha256": digest(data["seed"]),
    "draft_sha256": digest(draft),
    "reviewer": {
        "kind": "independent_agent",
        "identity": "Codex n46 reviewer; independent frozen Stage2 judgments, subsequent authorized Stage3 author comparison; disclosed embedded-mapping exposure retained separately",
    },
    "source_reviews": source_reviews,
    "figure_checks": [],
    "new_figure_reviews": [],
    "question_reviews": canonical_questions,
    "outcome": "pass",
}
serialized = json.dumps(review, ensure_ascii=True)
for forbidden in (str(ROOT), "/Users/", "/.tmp/", "/.intentfold/"):
    assert forbidden not in serialized, ("transient canonical evidence", forbidden)

artifacts = []
artifacts.append(freeze_json("review.json", review))
artifacts.append(freeze_json("stage3-comparison.json", {
    "schema": "STEMROBIN-182/choice-stage3-comparison@1",
    "lesson": "alg7-c4-s3-n46",
    "reviewer": review["reviewer"],
    "method": assessment["method"],
    "questions": question_comparisons,
    "counts": {"question_keys": 26, "rationales": 114, "incorrect_paths": 73, "correct_null_misconceptions": 41},
    "outcome": "pass",
}))
artifacts.append(freeze_json("stage3-coverage.json", {
    "schema": "STEMROBIN-182/choice-stage3-coverage-comparison@1",
    "sources": coverage_comparisons,
    "package_checks_reused": checks["package_checks"],
    "capacity_loss_assessment": assessment["coverage_loss_assessment"],
    "counts": {"source_exercises": 10, "source_tasks": 41},
    "outcome": "pass",
}))
artifacts.append(freeze_json("stage3-bindings.json", {
    "schema": "STEMROBIN-182/choice-stage3-historical-bindings@1",
    "ticket": "STEMROBIN-182",
    "cwd": str(ROOT),
    "inputs": bindings,
    "stage2_exceptions_retained": {
        "process_disclosure": data["stage2_summary"]["process_disclosure"],
        "verification_recovery": data["stage2_summary"]["verification"]["technical_recovery"],
    },
    "reuse": {
        "source_tasks": 41,
        "visible_questions": 26,
        "visible_option_judgments": 114,
        "view_snapshot_equal_to_frozen_projection": True,
        "source_re_solved": False,
        "stage2_semantic_review_repeated": False,
        "figures_opened": 0,
    },
    "canonical_evidence": "Substantive solutions, gate evidence and wrong-procedure checks are materialized directly in review.json. Historical paths exist only in sidecars.",
    "outputs": artifacts,
}))
print(json.dumps({"outcome": review["outcome"], "artifacts": artifacts}, indent=2))
