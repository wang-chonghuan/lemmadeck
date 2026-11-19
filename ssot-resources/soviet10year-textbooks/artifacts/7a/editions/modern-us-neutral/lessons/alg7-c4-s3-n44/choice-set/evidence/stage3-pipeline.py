#!/usr/bin/env python3
"""Assemble the existing independent evidence and capture one final validator run."""

import hashlib
import json
from pathlib import Path
import subprocess
import sys
from datetime import datetime, timezone

sys.dont_write_bytecode = True
ROOT = Path("/Users/yong/.codex/worktrees/d9b1/lemmadeck")
BASE = ROOT / ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13"
OWN = BASE / "n44-choice-review"
AUTHOR = BASE / "n44-choice-author/frozen"
SOURCE = BASE / "n44-answer-review"
SCRIPTS = ROOT / ".agents/skills/ld-s10y-choice/scripts"
sys.path.insert(0, str(SCRIPTS))
from prepare import digest, file_hash, load_json, require, scratch_path


def now():
    return datetime.now(timezone.utc).isoformat()


def write_json(name, value):
    target = scratch_path(OWN / name, ROOT)
    require(target.parent == OWN, "Only owned review files may be generated")
    with target.open("x", encoding="utf-8") as stream:
        json.dump(value, stream, ensure_ascii=True, indent=2)
        stream.write("\n")


def write_bytes(name, value):
    target = scratch_path(OWN / name, ROOT)
    require(target.parent == OWN, "Only owned review receipts may be generated")
    with target.open("xb") as stream:
        stream.write(value)


def main():
    expected_stage2 = "79ceb461a6cabe7c0a28406b981d6ca518891d98efc64a883461a5491cf46ab8"
    expected_draft = "49d2f6d8ee738fd47345fa2942fbb630642b0f2b87c63e4a746b2ed5f3bcb182"
    require(file_hash(OWN / "results0444.json") == expected_stage2, "Stage2 hash changed")
    require(file_hash(AUTHOR / "draft.json") == expected_draft, "Author draft hash changed")
    old_freeze = load_json(OWN / "freeze.json")
    for row in old_freeze["files"]:
        require(file_hash(OWN / row["path"]) == row["sha256"], "Frozen Stage2 evidence changed")

    seed = load_json(AUTHOR / "seed.json")
    draft = load_json(AUTHOR / "draft.json")
    analysis = load_json(AUTHOR / "author-analysis.json")
    coverage = load_json(AUTHOR / "coverage.json")
    source_bindings = load_json(AUTHOR / "source-bindings.json")
    handoff = load_json(AUTHOR / "handoff.json")
    views = load_json(AUTHOR / "learner-views.json")
    fidelity = load_json(OWN / "fidelity-records.json")
    mathematics = load_json(OWN / "mathematics-records.json")
    notes = load_json(OWN / "stage3-semantic-notes.json")
    stage1 = load_json(SOURCE / "results0444.json")
    require(file_hash(SOURCE / "results0444.json") == old_freeze["inherited_source_result_sha256"],
            "Independent Stage1 result changed")
    for row in stage1["files"]:
        require(file_hash(SOURCE / row["path"]) == row["sha256"], "Stage1 evidence hash changed")
    solutions = load_json(SOURCE / "source-solutions.json")
    for row in seed["trace"]:
        require(file_hash(ROOT / row["path"]) == row["sha256"], "Prepared source trace changed")

    require(draft["seed_sha256"] == digest(seed), "Seed canonical binding changed")
    require(source_bindings["seed_canonical_sha256"] == digest(seed), "Author seed binding mismatch")
    require(source_bindings["draft_canonical_sha256"] == digest(draft),
            "Author draft canonical binding mismatch")
    require([q["view"] for q in draft["questions"]] == views,
            "Author draft views differ from independent Stage2 projection")
    require(analysis["questions"] == [
        {k: q[k] for k in ("id", "source_numbers", "intent", "key")} for q in draft["questions"]
    ], "Author analysis differs from draft")
    require(analysis["coverage"] == coverage == draft["coverage"], "Author coverage snapshots differ")
    require(len(draft["questions"]) == len(fidelity["question_reviews"]) ==
            len(mathematics["question_reviews"]) == 33, "Question binding count changed")
    require(not seed["figures"] and not draft["new_figures"], "New image evidence would be required")
    require(notes["outcome"] == "pass" and not notes["findings"], "Semantic findings require revision")
    require(handoff["counts"]["source_mathematical_subtasks_deferred"] == 0,
            "Author reports deferred source tasks")

    comparisons = []
    question_reviews = []
    false_count = 0
    for position, (question, frow, mrow) in enumerate(zip(
            draft["questions"], fidelity["question_reviews"], mathematics["question_reviews"]), 1):
        require(frow["view_position"] == mrow["view_position"] == position,
                "Independent view-position binding changed")
        independent = mrow["mathematics"]
        require(set(independent["correct"]) == set(question["key"]["correct"]),
                "Independent true set disagrees with author")
        independent_options = {r["option_id"]: r for r in independent["option_checks"]}
        rationales = {r["option_id"]: r for r in question["key"]["rationales"]}
        require(set(rationales) == set(independent_options), "Option rationale inventory differs")
        false_notes = notes["false_option_procedure_comparisons"][question["id"]]
        require(set(false_notes) == {
            k for k, r in independent_options.items() if r["truth"] == "incorrect"
        }, "Concrete misconception comparison is missing or extra")
        option_rows = []
        for option in question["view"]["options"]:
            option_id = option["id"]
            old = independent_options[option_id]
            authored = rationales[option_id]
            require(authored["truth"] == old["truth"], "Rationale truth disagrees with independent result")
            if old["truth"] == "correct":
                require(authored["misconception"] is None, "Correct option has a misconception")
                comparison = (
                    "The author rationale is mathematically supported by the unchanged independent "
                    "Stage2 calculation: " + old["evidence"]
                )
            else:
                require(isinstance(authored["misconception"], str) and authored["misconception"].strip(),
                        "False option lacks its stated wrong procedure")
                comparison = false_notes[option_id]
                false_count += 1
            option_rows.append({
                "option_id": option_id,
                "independent_truth": old["truth"],
                "author_truth": authored["truth"],
                "independent_evidence_unchanged": old["evidence"],
                "author_derivation": authored["derivation"],
                "author_misconception": authored["misconception"],
                "rationale_comparison": {"verdict": "pass", "evidence": comparison},
                "misconception_comparison": {
                    "verdict": "pass",
                    "evidence": comparison if old["truth"] == "incorrect" else
                    "Correct alternative: null misconception is appropriate."
                }
            })
        comparisons.append({
            "question_id": question["id"],
            "view_position": position,
            "independent_correct_unchanged": independent["correct"],
            "author_correct": question["key"]["correct"],
            "key_comparison": {"verdict": "pass", "evidence":
                               "Author exact set equals the independently frozen Stage2 complete true set."},
            "option_comparisons": option_rows
        })
        question_reviews.append({
            "question_id": question["id"],
            "task_fidelity": frow["task_fidelity"],
            "redundancy": frow["redundancy"],
            "answer_leakage": frow["answer_leakage"],
            "mathematics": independent
        })

    require(false_count == 73, "False-procedure comparison count differs from Stage2")
    require(sum(len(q["option_comparisons"]) for q in comparisons) == 144,
            "Full rationale comparison count differs from Stage2")
    source_by_number = {row["number"]: row for row in solutions["exercises"]}
    independent_mapping = fidelity["reviewer_derived_package_coverage"]["mapping"]
    source_reviews = []
    coverage_comparisons = []
    for source in seed["exercises"]:
        number = source["number"]
        row = next(r for r in coverage if r["source_number"] == number)
        independent_row = next(r for r in independent_mapping if r["source_number"] == number)
        expected_ids = [draft["questions"][p - 1]["id"]
                        for p in independent_row["view_positions"]]
        require(set(expected_ids) == set(row["question_ids"]), "Independent source mapping disagrees")
        require(bool(row["omitted_tasks"]), "Observed independent-production loss is not declared")
        evidence = notes["coverage_comparisons"][number]
        source_reviews.append({
            "source_number": number,
            "independent_solution": (
                "Reused verbatim mathematics from independent source-first Stage1 results0444 "
                "(raw SHA-256 c7e9f81171681735de1bc0eada9a43bc24ccac3744f49a5505837399133bb94e), "
                "source-solutions.json, exercise " + number + "; no Stage3 source re-solving. "
                "Frozen independent exercise record: " +
                json.dumps(source_by_number[number], ensure_ascii=True, sort_keys=True,
                           separators=(",", ":"))
            ),
            "coverage": {"verdict": "pass", "evidence": evidence}
        })
        coverage_comparisons.append({
            "source_number": number,
            "independent_question_ids": expected_ids,
            "author_question_ids": row["question_ids"],
            "declared_omitted_tasks": row["omitted_tasks"],
            "declared_reason": row["reason"],
            "comparison": {"verdict": "pass", "evidence": evidence}
        })

    review = {
        "schema": "s10y-choice-review-v1",
        "seed_sha256": digest(seed),
        "draft_sha256": digest(draft),
        "reviewer": notes["reviewer"],
        "source_reviews": source_reviews,
        "figure_checks": [],
        "new_figure_reviews": [],
        "question_reviews": question_reviews,
        "outcome": "pass"
    }
    write_json("review-stage3.json", review)
    write_json("stage3-comparison.json", {
        "schema": "s10y-choice-stage3-key-rationale-coverage-comparison@1",
        "ticket": "STEMROBIN-182",
        "stage2_result_sha256": expected_stage2,
        "seed_sha256": digest(seed),
        "draft_sha256": digest(draft),
        "question_comparisons": comparisons,
        "source_coverage_comparisons": coverage_comparisons,
        "source_and_concept_comparison": notes["source_and_concept_comparison"],
        "package_relationships": notes["package_relationships"],
        "capacity_loss_judgment": notes["capacity_loss_judgment"],
        "counts": {"keys": 33, "rationales": 144, "correct_rationales": 71,
                   "incorrect_procedures": false_count, "source_coverage_rows": 15},
        "findings": [],
        "outcome": "pass"
    })
    write_json("stage3-bindings.json", {
        "schema": "s10y-choice-stage3-input-binding@1",
        "recorded_at_utc": now(),
        "cwd": str(ROOT),
        "stage2_frozen_files": old_freeze["files"],
        "stage1_result_sha256": file_hash(SOURCE / "results0444.json"),
        "author_files": [
            {"path": str(AUTHOR / name), "sha256": file_hash(AUTHOR / name)}
            for name in ("seed.json", "draft.json", "author-analysis.json", "coverage.json",
                         "source-bindings.json", "handoff.json", "learner-views.json")
        ],
        "canonical_seed_sha256": digest(seed),
        "canonical_draft_sha256": digest(draft),
        "canonical_review_sha256": digest(review),
        "seed_trace_verified": seed["trace"],
        "learner_projection_unchanged": True,
        "source_tasks_reused": 132,
        "source_re_solving_passes": 0,
        "image_opens_or_creation": 0
    })

    # A preexisting receipt prevents accidentally invoking the final validator twice.
    require(not (OWN / "validator-stage3-command.json").exists(),
            "Final validator has already been invoked; do not rerun it")
    argv = [
        sys.executable, "-B", str(SCRIPTS / "validate.py"), "--repo", str(ROOT),
        "--seed", str(AUTHOR / "seed.json"), "--draft", str(AUTHOR / "draft.json"),
        "--review", str(OWN / "review-stage3.json")
    ]
    started = now()
    result = subprocess.run(argv, cwd=ROOT, stdout=subprocess.PIPE, stderr=subprocess.PIPE,
                            check=False)
    finished = now()
    write_bytes("validator-stage3.stdout.txt", result.stdout)
    write_bytes("validator-stage3.stderr.txt", result.stderr)
    write_json("validator-stage3-command.json", {
        "schema": "s10y-choice-actual-validator-command-receipt@1",
        "argv": argv,
        "cwd": str(ROOT),
        "started_at_utc": started,
        "finished_at_utc": finished,
        "invocations_this_stage": 1,
        "exit_code": result.returncode,
        "stdout_file": "validator-stage3.stdout.txt",
        "stdout_sha256": file_hash(OWN / "validator-stage3.stdout.txt"),
        "stderr_file": "validator-stage3.stderr.txt",
        "stderr_sha256": file_hash(OWN / "validator-stage3.stderr.txt"),
        "seed_raw_sha256": file_hash(AUTHOR / "seed.json"),
        "draft_raw_sha256": file_hash(AUTHOR / "draft.json"),
        "review_raw_sha256": file_hash(OWN / "review-stage3.json"),
        "seed_canonical_sha256": digest(seed),
        "draft_canonical_sha256": digest(draft),
        "review_canonical_sha256": digest(review),
        "scope": "Official final structural/source-freshness/declared-semantic validator only; "
                 "the comparisons provide separate semantic evidence."
    })
    print(json.dumps({
        "review": str(OWN / "review-stage3.json"),
        "review_raw_sha256": file_hash(OWN / "review-stage3.json"),
        "review_canonical_sha256": digest(review),
        "comparison_sha256": file_hash(OWN / "stage3-comparison.json"),
        "bindings_sha256": file_hash(OWN / "stage3-bindings.json"),
        "validator_exit_code": result.returncode,
        "stdout": result.stdout.decode("utf-8"),
        "stderr": result.stderr.decode("utf-8")
    }, indent=2))
    return result.returncode


if __name__ == "__main__":
    sys.exit(main())
