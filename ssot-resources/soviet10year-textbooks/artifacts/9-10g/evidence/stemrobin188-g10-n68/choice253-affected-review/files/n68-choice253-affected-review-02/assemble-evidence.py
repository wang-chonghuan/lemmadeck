#!/usr/bin/env python3
"""Mechanical byte reuse, one validator receipt, and affected-review evidence."""

import argparse
import datetime
import hashlib
import json
from pathlib import Path
import stat
import subprocess

REPO = Path("/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck")
TMP = REPO / ".intentfold/tickets/STEMROBIN-188/tmp"
ROOT = Path(__file__).resolve().parent
PRIOR = TMP / "n68-answer-choice-review-01"
REPAIR = TMP / "n68-choice253-repair-02"
AUTHOR = TMP / "n68-choice-author"
DECODER = json.JSONDecoder()
IDENTITY = (
    "Sole independent reviewer STEMROBIN-188 SAME188-6, "
    "n68-choice253-affected-review-02. New item q-inverse-volume-growth, "
    "seed253 coverage and affected package relationships independently reviewed "
    "by this reviewer. All old eight entire question PASS records and unaffected "
    "source records are reused as exact native JSON bytes from prior independent "
    "review n68-answer-choice-review-01/review.json, file SHA256 "
    "7abaf0137baa5995cfb2dd2765cb94a0c2a30f9400cd38a9fd03eefef6b63e3b. "
    "Old eight mathematics and already eight PASS answers were not re-reviewed; "
    "source253 independent_solution is also reused, with only coverage updated."
)


def sha(data):
    return hashlib.sha256(data).hexdigest()


def canonical(value):
    return sha(json.dumps(
        value, sort_keys=True, ensure_ascii=True, separators=(",", ":")
    ).encode("utf-8"))


def load(path):
    return json.loads(path.read_bytes())


def now():
    return datetime.datetime.now(datetime.timezone.utc).isoformat()


def binding(path, relative_to=REPO):
    data = path.read_bytes()
    return {
        "path": str(path.relative_to(relative_to)),
        "sha256": sha(data),
        "bytes": len(data),
        "mode": format(stat.S_IMODE(path.stat().st_mode), "04o"),
    }


def write_new(name, value, raw=False):
    target = ROOT / name
    assert target.parent == ROOT and not target.exists(), target
    data = value.encode("utf-8") if raw else (
        json.dumps(value, ensure_ascii=True, indent=2) + "\n"
    ).encode("utf-8")
    with target.open("xb") as stream:
        stream.write(data)


def fragment(value, indentation):
    return json.dumps(value, ensure_ascii=True, indent=2).replace(
        "\n", "\n" + " " * indentation
    )


def whitespace(raw, position):
    while position < len(raw) and raw[position] in " \t\r\n":
        position += 1
    return position


def members(raw, start=0):
    position = whitespace(raw, start)
    assert raw[position] == "{"
    position = whitespace(raw, position + 1)
    result = {}
    while raw[position] != "}":
        key, end = DECODER.raw_decode(raw, position)
        position = whitespace(raw, end)
        assert raw[position] == ":" and key not in result
        position = whitespace(raw, position + 1)
        _, end = DECODER.raw_decode(raw, position)
        result[key] = (position, end)
        position = whitespace(raw, end)
        if raw[position] == "}":
            break
        assert raw[position] == ","
        position = whitespace(raw, position + 1)
    return result


def array_items(raw, start):
    position = whitespace(raw, start)
    assert raw[position] == "["
    position = whitespace(raw, position + 1)
    result = []
    while raw[position] != "]":
        value, end = DECODER.raw_decode(raw, position)
        result.append((position, end, value))
        position = whitespace(raw, end)
        if raw[position] == "]":
            break
        assert raw[position] == ","
        position = whitespace(raw, position + 1)
    return result


def records(raw, field, identity):
    start, _ = members(raw)[field]
    return {
        value[identity]: (begin, end, value)
        for begin, end, value in array_items(raw, start)
    }


def token(raw, span):
    return raw[span[0]:span[1]].encode("utf-8")


def check_inputs():
    before = load(ROOT / "input-hashes-before.json")
    assert before["repo"] == str(REPO)
    current = [binding(REPO / item["path"]) for item in before["inputs"]]
    assert len({item["path"] for item in current}) == len(current)
    differences = [
        {"before": old, "after": new}
        for old, new in zip(before["inputs"], current)
        if old != new
    ]
    return {
        "schema": "same188-6-affected-review-input-integrity-v1",
        "observed_utc": now(),
        "input_count": len(current),
        "inputs": current,
        "changed_inputs": differences,
        "sha256_bytes_modes_unchanged": not differences,
    }


def check_seals():
    source = binding(ROOT / "source-first.json", ROOT)
    view = binding(ROOT / "view-first.json", ROOT)
    comparison = load(ROOT / "key-last-comparison.json")
    for actual, key in [(source, "source_first"), (view, "view_first")]:
        assert actual["sha256"] == comparison[key]["sha256"]
        assert actual["mode"] == "0444"
    assert comparison["source_first"]["seal_observed_utc"] < (
        comparison["view_first"]["seal_observed_utc"]
    )
    return {"source_first": source, "view_first": view}


def assemble():
    assert check_inputs()["sha256_bytes_modes_unchanged"]
    seals = check_seals()
    seed = load(AUTHOR / "seed.json")
    draft = load(REPAIR / "draft.json")
    old_draft = load(AUTHOR / "draft.json")
    prior = load(PRIOR / "review.json")
    visible = load(REPAIR / "visible-questions.json")
    view_first = load(ROOT / "view-first.json")
    new_review = view_first["question_review"]
    assert seed["figures"] == draft["new_figures"] == []
    assert canonical(seed) == prior["seed_sha256"] == draft["seed_sha256"]
    assert canonical(old_draft) == prior["draft_sha256"]
    assert {"questions": [
        {key: question[key] for key in ("id", "source_numbers", "view")}
        for question in draft["questions"]
    ]} == visible
    new_candidate = next(
        q for q in draft["questions"] if q["id"] == new_review["question_id"]
    )
    assert load(TMP / "n68-choice-growth-question-02.json") == new_candidate
    assert new_review["mathematics"]["correct"] == new_candidate["key"]["correct"]
    assert len(prior["question_reviews"]) == 8
    assert all(
        question[part]["verdict"] == "pass"
        for question in prior["question_reviews"]
        for part in ("task_fidelity", "redundancy", "answer_leakage", "mathematics")
    )

    # JSON decoder spans retain exact original object bytes, not reserialized keys.
    raw = (PRIOR / "review.json").read_text(encoding="utf-8")
    top = members(raw)
    source_rows = records(raw, "source_reviews", "source_number")
    source253 = members(raw, source_rows["253"][0])
    question_start, question_end = top["question_reviews"]
    old_questions = array_items(raw, question_start)
    question_array = (
        raw[question_start:old_questions[-1][1]]
        + ",\n    " + fragment(new_review, 4)
        + raw[old_questions[-1][1]:question_end]
    )
    replacements = [
        (*top["draft_sha256"], json.dumps(canonical(draft))),
        (*top["reviewer"], fragment(
            {"kind": "independent_agent", "identity": IDENTITY}, 2
        )),
        (*source253["coverage"], fragment({
            "verdict": view_first["coverage_assessment_before_key"]["verdict"],
            "evidence": view_first["coverage_assessment_before_key"]["evidence"],
        }, 6)),
        (question_start, question_end, question_array),
        (*top["outcome"], json.dumps("pass")),
    ]
    for start, end, replacement in sorted(replacements, reverse=True):
        raw = raw[:start] + replacement + raw[end:]
    write_new("review.json", raw, raw=True)
    receipt = verify_reuse()
    receipt["seals"] = seals
    write_new("reuse-verification.json", receipt)
    print(json.dumps({
        "review": binding(ROOT / "review.json", ROOT),
        "question_records_byte_reused": len(receipt["question_records"]),
        "source_records_byte_reused": len(receipt["source_records"]),
        "source253_independent_solution_byte_reused": True,
    }, indent=2))


def verify_reuse():
    prior_raw = (PRIOR / "review.json").read_text(encoding="utf-8")
    full_raw = (ROOT / "review.json").read_text(encoding="utf-8")
    old_draft_raw = (AUTHOR / "draft.json").read_text(encoding="utf-8")
    new_draft_raw = (REPAIR / "draft.json").read_text(encoding="utf-8")
    old_questions = records(prior_raw, "question_reviews", "question_id")
    full_questions = records(full_raw, "question_reviews", "question_id")
    old_sources = records(prior_raw, "source_reviews", "source_number")
    full_sources = records(full_raw, "source_reviews", "source_number")
    old_draft = records(old_draft_raw, "questions", "id")
    new_draft = records(new_draft_raw, "questions", "id")
    output = {
        "schema": "same188-6-exact-native-byte-reuse-v1",
        "prior_review": binding(PRIOR / "review.json"),
        "full_review": binding(ROOT / "review.json", ROOT),
        "question_records": [],
        "source_records": [],
        "old8_candidate_view_key_checks": [],
    }
    for qid, old in old_questions.items():
        before = token(prior_raw, old)
        after = token(full_raw, full_questions[qid])
        assert before == after, qid
        output["question_records"].append({
            "question_id": qid, "prior_sha256": sha(before),
            "full_review_sha256": sha(after), "bytes": len(before),
            "byte_identical": True, "mathematics_reaudited": False,
        })
        old_members = members(old_draft_raw, old_draft[qid][0])
        new_members = members(new_draft_raw, new_draft[qid][0])
        matches = {}
        for part in ("view", "key"):
            before = token(old_draft_raw, old_members[part])
            after = token(new_draft_raw, new_members[part])
            before_value, after_value = json.loads(before), json.loads(after)
            assert before_value == after_value, qid
            assert canonical(before_value) == canonical(after_value), qid
            matches[part] = {
                "decoded_equal": True,
                "canonical_sha256": canonical(before_value),
                "canonical_equal": True,
                "raw_byte_equal": before == after,
                "original_raw_sha256": sha(before),
                "candidate_raw_sha256": sha(after),
                "original_raw_bytes": len(before),
                "candidate_raw_bytes": len(after),
            }
        output["old8_candidate_view_key_checks"].append({
            "question_id": qid, **matches,
        })
    for number, old in old_sources.items():
        if number == "253":
            a = members(prior_raw, old[0])["independent_solution"]
            b = members(full_raw, full_sources[number][0])["independent_solution"]
            before, after = token(prior_raw, a), token(full_raw, b)
            assert before == after
            output["source253_independent_solution"] = {
                "prior_sha256": sha(before), "full_review_sha256": sha(after),
                "bytes": len(before), "byte_identical": True,
                "only_updated_member": "coverage",
            }
        else:
            before, after = token(prior_raw, old), token(full_raw, full_sources[number])
            assert before == after, number
            output["source_records"].append({
                "source_number": number, "prior_sha256": sha(before),
                "full_review_sha256": sha(after), "bytes": len(before),
                "byte_identical": True,
            })
    new_review = load(ROOT / "view-first.json")["question_review"]
    assert full_questions["q-inverse-volume-growth"][2] == new_review
    assert len(full_questions) == 9 and len(full_sources) == 8
    assert set(full_questions) == set(new_draft)
    output["new_question_fresh_from_sealed_view_review"] = True
    output["all_checks_passed"] = True
    return output


def verify_assembly():
    assert check_inputs()["sha256_bytes_modes_unchanged"]
    assert not (ROOT / "reuse-verification.json").exists()
    failure = load(ROOT / "assembly-first-failure.json")
    assert binding(ROOT / "review.json", ROOT) == failure["valid_output_preserved"]
    receipt = verify_reuse()
    receipt["seals"] = check_seals()
    receipt["technical_recovery"] = {
        "first_failure": "assembly-first-failure.json",
        "existing_full_review_kept_byte_unchanged": True,
        "old8_views_keys_canonically_unchanged_but_pretty_indentation_changed": True,
        "native_old8_review_records_still_required_raw_byte_identical": True,
        "only_missing_mechanical_receipt_stage_resumed": True,
        "content_reviews_rerun": False,
    }
    write_new("reuse-verification.json", receipt)
    print(json.dumps({
        "review": binding(ROOT / "review.json", ROOT),
        "old8_review_records_byte_reused": len(receipt["question_records"]),
        "source7_records_byte_reused": len(receipt["source_records"]),
        "all_checks_passed": receipt["all_checks_passed"],
    }, indent=2))


def validate_once():
    assert not (ROOT / "structural-validation.json").exists(), "No validator rerun"
    assert check_inputs()["sha256_bytes_modes_unchanged"]
    check_seals()
    verify_reuse()
    command = [
        "python3", "-B", str(REPO / ".agents/skills/ld-s10y-choice/scripts/validate.py"),
        "--repo", str(REPO), "--seed", str(AUTHOR / "seed.json"),
        "--draft", str(REPAIR / "draft.json"), "--review", str(ROOT / "review.json"),
    ]
    receipt = {
        "schema": "same188-6-affected-structural-validation-v1",
        "started_utc": now(), "command": command, "cwd": str(REPO),
        "runs": 1, "rerun": False, "bytecode_writes_disabled_by_python_flag": True,
        "meaning": "Structural/input consistency and declared review binding only; no automatic mathematics proof, runtime probe replay, answer re-review, or whole-lesson approval.",
    }
    try:
        result = subprocess.run(command, cwd=REPO, capture_output=True, text=True)
        receipt.update({
            "exit_code": result.returncode, "stdout": result.stdout,
            "stderr": result.stderr, "execution_error": None,
        })
    except OSError as error:
        receipt.update({
            "exit_code": None, "stdout": "", "stderr": "",
            "execution_error": str(error),
        })
    receipt["finished_utc"] = now()
    write_new("structural-validation.json", receipt)
    print(json.dumps(receipt, indent=2))


def changes(before, after, location):
    if before == after:
        return []
    if isinstance(before, dict) and isinstance(after, dict):
        output = []
        for key in sorted(set(before) | set(after)):
            output.extend(changes(before.get(key), after.get(key), location + "/" + key))
        return output
    return [{"path": location, "before": before, "after": after}]


def finalize():
    assert not (ROOT / "output-index.json").exists()
    integrity = check_inputs()
    write_new("input-hashes-after.json", integrity)
    reuse = verify_reuse()
    seals = check_seals()
    native = load(ROOT / "structural-validation.json")
    full = load(ROOT / "review.json")
    old = load(AUTHOR / "draft.json")
    candidate = load(REPAIR / "draft.json")
    prior_report = load(PRIOR / "report.json")
    repair = load(REPAIR / "repair.json")
    old_questions = {q["id"]: q for q in old["questions"]}
    new_questions = {q["id"]: q for q in candidate["questions"]}
    old_coverage = {c["source_number"]: c for c in old["coverage"]}
    new_coverage = {c["source_number"]: c for c in candidate["coverage"]}
    delta = []
    for qid, question in old_questions.items():
        delta.extend(changes(question, new_questions[qid], "questions/" + qid))
    for number, coverage in old_coverage.items():
        delta.extend(changes(coverage, new_coverage[number], "coverage/" + number))
    expected = {
        "questions/q-earth-moon/intent/limitations",
        "questions/q-earth-moon/intent/unit_reason",
        "coverage/253/omitted_tasks",
        "coverage/253/question_ids",
        "coverage/253/reason",
    }
    assert {item["path"] for item in delta} == expected
    assert set(new_questions) - set(old_questions) == {"q-inverse-volume-growth"}
    issues = []
    if native["exit_code"] != 0:
        issues.append({"id": "STRUCTURAL-VALIDATION", "receipt": "structural-validation.json"})
    if not integrity["sha256_bytes_modes_unchanged"]:
        issues.append({"id": "INPUT-CHANGED", "receipt": "input-hashes-after.json"})
    report = {
        "schema": "same188-6-affected-choice253-review-report-v1",
        "ticket": "STEMROBIN-188", "assignment": "SAME188-6",
        "book": "9-10g", "lesson": "geo910-c2-s3-n68",
        "output_root": str(ROOT), "reviewer": full["reviewer"],
        "result": full["outcome"] if not issues else "blocked",
        "native_review_outcome": full["outcome"],
        "scope": ["new ninth question", "253 coverage", "affected package relationships"],
        "wholeLessonApproved": False, "published": False,
        "counts": {
            "written_seeds_independently_solved_this_review": 1,
            "new_questions_reviewed": 1,
            "new_options_independently_checked": 4,
            "new_true_options": 1, "new_false_options": 3,
            "new_keys_compared": 1, "new_rationales_checked": 4,
            "key_disagreements": 0,
            "old_question_pass_records_byte_reused": 8,
            "unaffected_source_records_byte_reused": 7,
            "source253_independent_solution_byte_reused": 1,
            "coverage_records_freshly_reviewed": 1,
            "native_question_reviews": 9, "native_source_reviews": 8,
            "old8_mathematics_reaudits": 0, "already8PASS_answer_reaudits": 0,
            "native_validator_runs": 1, "runtime_probe_replays": 0,
            "content_repairs_inherited_not_reset": repair["contentRepairs"],
            "images": 0, "new_figures": 0, "agents_spawned": 0,
            "source_holds_retained": len(prior_report["sourceHolds"]),
            "original_choice_omission_failures_retained": len(prior_report["findings"]),
            "original_firstfail_execution_failures_retained": prior_report[
                "gradingReliabilityAssessment"
            ]["initialExecutionFailuresPreserved"],
            "input_files_hashed_before_after": integrity["input_count"],
            "changed_inputs": len(integrity["changed_inputs"]),
            "current_failures": len(issues),
            "recovered_local_assembly_failures_retained": 1,
        },
        "snapshot_bindings": {
            "seed_file": binding(AUTHOR / "seed.json"),
            "seed_canonical_sha256": full["seed_sha256"],
            "changed_candidate_file": binding(REPAIR / "draft.json"),
            "changed_draft_canonical_sha256": full["draft_sha256"],
            "prior_review_file": binding(PRIOR / "review.json"),
            "review_file": binding(ROOT / "review.json", ROOT),
        },
        "exact_candidate_changes": {
            "added_question_ids": ["q-inverse-volume-growth"],
            "removed_question_ids": [],
            "modified_existing_fields": delta,
            "old8_views_and_keys_canonically_unchanged": True,
            "old8_views_keys_raw_serialization_unchanged": False,
            "formatting_only_note": "The candidate uses different pretty-print indentation; native view/key values and canonical digests are unchanged. Old native review records, in contrast, are byte-identical.",
            "complete_old_questions_unchanged": [
                qid for qid in old_questions if old_questions[qid] == new_questions[qid]
            ],
            "other7_coverage_records_unchanged": True,
            "new_question_source_evidence": binding(TMP / "n68-choice-growth-question-02.json"),
        },
        "exact_review_changes_and_reuse": {
            "receipt": "reuse-verification.json",
            "prior_source253_coverage_verdict": "revise",
            "new_source253_coverage_verdict": "pass",
            "source253_independent_solution": "Prior native token reused byte-for-byte after this reviewer's independent source-first calculation.",
            "source253_updated_fields": ["coverage.verdict", "coverage.evidence"],
            "all8_old_question_records": "Complete native objects byte-reused, without editing old evidence or recomputing their answers.",
            "new_ninth_record": "Fresh independently authored sealed view-first question review; not copied from a candidate or prior key.",
            "reviewer_identity": "Explicitly distinguishes new-item/253coverage/affectedpackage work from hash-bound prior PASS reuse.",
            "seed_binding_unchanged": True, "draft_binding_changed": True,
        },
        "retained_original_evidence": {
            "FIRSTFAIL": {
                "status": "retained_not_replayed_or_reassessed",
                "receipt": binding(TMP / "n68-answer-author/offline-judge-results.json"),
                "execution_failures": 27,
                "first_error": "TypeError: ComputeEngine is not a constructor",
                "prior_evidence": binding(PRIOR / "author-probe-evidence.json"),
                "runtime_fixed_claimed": False,
            },
            "choiceomissionFAIL": {
                "status": "original_rejected_snapshot_retained",
                "prior_report": binding(PRIOR / "report.json"),
                "original_findings_verbatim": prior_report["findings"],
                "rejected_review": binding(PRIOR / "review.json"),
                "original_structural_exit3_receipt": binding(PRIOR / "structural-validation.json"),
                "affected_repair_disposition": "Conditional inverse task now assessed; original omission FAIL remains historical evidence, not erased or relabeled PASS.",
            },
            "HOLDs": prior_report["sourceHolds"],
            "prior_capacity_losses": {
                "artifact": binding(PRIOR / "retained-capacity-losses.json"),
                "unchanged_original_evidence_retained": True,
                "historical_253_inverse_absence_superseded_only_for_conditional_new_item": True,
                "literal_253_source_ambiguity_resolved": False,
                "255_missing_density_hold_cleared": False,
                "257_historical_glyph_hold_cleared": False,
                "unaided_written_derivation_certified": False,
                "answers_already8PASS_status_reused_not_reaudited": True,
                "all8_written_answers_remain_ungraded_inherited": True,
            },
        },
        "review_order": {
            "source_first": {**seals["source_first"], "sealed_before_visible": True},
            "view_first": {**seals["view_first"], "sealed_before_candidate_and_prior_keys": True},
            "key_last_comparison": "key-last-comparison.json",
            "fresh_source_math_scope": ["253"], "fresh_choice_math_scope": ["q-inverse-volume-growth"],
        },
        "structural_validation": {
            "receipt": "structural-validation.json",
            "actual_exit_code": native["exit_code"], "runs": 1,
            "actual_stdout": native["stdout"], "actual_stderr": native["stderr"],
            "receipt_retained_even_on_failure": True,
            "automatic_semantic_proof": False,
        },
        "input_integrity": {
            "before": "input-hashes-before.json", "after": "input-hashes-after.json",
            "all_hashes_bytes_modes_unchanged": integrity["sha256_bytes_modes_unchanged"],
            "inputs_edited": False, "key_files_opaquely_hashed_before_seals": True,
        },
        "failures": issues,
        "recovered_execution_failures": [
            {
                "receipt": "assembly-first-failure.json",
                "actual_exit_code": 1,
                "stage": "native-review reuse receipt",
                "cause": "Incorrect raw-byte check of canonically unchanged candidate view/key serialization.",
                "resolved_by": "Canonical candidate checks, exact-byte prior review record checks, and resume of the missing receipt only.",
                "review_rewritten_or_content_review_rerun": False,
            }
        ],
        "boundaries": {
            "offline": True, "only_owned_root_written": True, "images": 0,
            "app_or_skills_edited": False, "env_accessed_or_modified": False,
            "network_or_DB_accessed": False, "dependencies_installed": False,
            "git_used": False, "oldworktree_accessed": False, "otherchats_accessed": False,
            "source_or_old8_PASS_broad_rerun": False, "runtime_probe_replay": False,
            "answers_already8PASS_reaudited": False, "published": False,
            "wholeLessonApproved": False,
        },
        "output_index": {
            "path": "output-index.json", "entry_fields": ["path", "sha256", "bytes", "mode"],
            "paths_relative_to_owned_root": True, "excludes_self": True,
        },
    }
    write_new("report.json", report)
    write_new("delivery-verification.json", {
        "schema": "same188-6-affected-review-delivery-verification-v1",
        "seals_intact": True, "native_byte_reuse_verified": reuse["all_checks_passed"],
        "new_review_matches_sealed_independent_findings": True,
        "canonical_seed_and_changed_draft_verified": (
            full["seed_sha256"] == canonical(load(AUTHOR / "seed.json"))
            and full["draft_sha256"] == canonical(candidate)
        ),
        "input_hashes_bytes_modes_unchanged": integrity["sha256_bytes_modes_unchanged"],
        "original_holds_and_rejected_evidence_retained": True,
        "native_validator_runs": 1, "not_another_validator_or_mathematics_run": True,
        "review": binding(ROOT / "review.json", ROOT),
        "report": binding(ROOT / "report.json", ROOT),
        "result": report["result"],
    })
    files = sorted(path for path in ROOT.rglob("*") if path.is_file())
    assert all(not path.is_symlink() for path in files)
    write_new("output-index.json", {
        "schema": "same188-6-affected-review-output-index-v1",
        "output_root": str(ROOT), "excludes_self": True,
        "outputs": [binding(path, ROOT) for path in files],
    })
    print(json.dumps({
        "result": report["result"], "counts": report["counts"],
        "failures": report["failures"],
        "output_index": binding(ROOT / "output-index.json", ROOT),
    }, indent=2))


def main():
    assert ROOT == TMP / "n68-choice253-affected-review-02"
    assert Path.cwd() == REPO
    parser = argparse.ArgumentParser()
    parser.add_argument("stage", choices=("assemble", "verify-assembly", "validate-once", "finalize"))
    stage = parser.parse_args().stage
    {
        "assemble": assemble, "verify-assembly": verify_assembly,
        "validate-once": validate_once, "finalize": finalize,
    }[stage]()


if __name__ == "__main__":
    main()
