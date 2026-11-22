"""Copy protected objects, bind manual extensions, capture one validator run."""

import copy
import datetime
import hashlib
import json
import pathlib
import shutil
import subprocess
import sys
import time
import traceback


ROOT = pathlib.Path("/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck")
AUTHOR = ROOT / ".tmp/stemrobin-184-six/n88-choice-author02"
BASE = AUTHOR / "repair01"
OWN = AUTHOR / "repair02"
BASIS = ROOT / ".tmp/stemrobin-184-six/n88-choice-branch-basis"
AFFECTED = {str(n) for n in range(222, 231)} | {"232"}
BASE_MANIFEST_SHA = (
    "128e8dcc1988989edb0f919884017f08ae1b90bf692e0b0b86f07996ea5cb988"
)
BASE_DRAFT_SHA = (
    "f6cd487ea5bf372586a449b879b76dfd194e7429a60ddec3a8d2ed909de0bda1"
)
BASE_CANONICAL_SHA = (
    "6dd80d378e1574cbcfc07ff822fe15a973ccd43386985d826559a9d990876320"
)


def digest(value):
    payload = json.dumps(
        value, sort_keys=True, ensure_ascii=True, separators=(",", ":")
    ).encode("utf-8")
    return hashlib.sha256(payload).hexdigest()


def load(path):
    return json.loads(path.read_bytes())


def evidence(path, canonical=False):
    payload = path.read_bytes()
    record = {
        "path": str(path),
        "bytes": len(payload),
        "sha256": hashlib.sha256(payload).hexdigest(),
    }
    if canonical:
        record["canonical_sha256"] = digest(json.loads(payload))
    return record


def write(path, value):
    with path.open("x", encoding="utf-8") as handle:
        json.dump(value, handle, ensure_ascii=True, indent=2)
        handle.write("\n")


def require(condition, message):
    if not condition:
        raise RuntimeError(message)


def utc():
    return datetime.datetime.now(datetime.timezone.utc).isoformat()


def bind_protected():
    require(
        evidence(BASE / "manifest.json")["sha256"] == BASE_MANIFEST_SHA,
        "Repair01 manifest bytes changed",
    )
    prior = load(BASE / "manifest.json")
    protected = [evidence(BASE / "manifest.json")]
    for record in prior["files"]:
        actual = evidence(pathlib.Path(record["path"]))
        require(actual["sha256"] == record["sha256"], "Repair01 artifact changed")
        protected.append(actual)
    require(
        evidence(BASE / "draft.json")["sha256"] == BASE_DRAFT_SHA,
        "Protected fifteen-question draft bytes changed",
    )
    require(
        digest(load(BASE / "draft.json")) == BASE_CANONICAL_SHA,
        "Protected fifteen-question canonical digest changed",
    )
    prior_preservation = load(BASE / "preservation.json")
    for record in [
        prior_preservation["original_draft"],
        prior_preservation["source_freeze"],
        *prior_preservation["source_solutions"],
    ]:
        actual = evidence(pathlib.Path(record["path"]))
        require(actual["sha256"] == record["sha256"], "Original author freeze changed")
        protected.append(actual)
    extended_freeze = load(OWN / "derivation-freeze.json")
    derivation = evidence(OWN / extended_freeze["file"], canonical=True)
    require(
        derivation["sha256"] == extended_freeze["sha256"]
        and derivation["canonical_sha256"] == extended_freeze["canonical_sha256"],
        "Affected extension changed after its pre-option freeze",
    )
    for record in extended_freeze["new_semantic_inputs"]:
        require(
            evidence(pathlib.Path(record["path"]))["sha256"] == record["sha256"],
            "Released definition basis changed",
        )
    return protected, prior


def assemble():
    protected, prior = bind_protected()
    base = load(BASE / "draft.json")
    additions = load(OWN / "additions.json")
    require(
        set(additions) == {"schema", "questions", "coverage_replacements"},
        "Unexpected additions fields",
    )
    replacement = {
        entry["source_number"]: entry
        for entry in additions["coverage_replacements"]
    }
    require(
        len(additions["coverage_replacements"]) == 10
        and set(replacement) == AFFECTED,
        "Replacement scope is not exactly the ten branch-held sources",
    )
    cited = set()
    for question in additions["questions"]:
        require(
            set(question["source_numbers"]) <= AFFECTED,
            "Branch addition cites an unreleased source",
        )
        cited.update(question["source_numbers"])
    require(cited == AFFECTED, "An affected mathematical unit is absent")
    require(
        len(base["questions"]) == 15 and base["new_figures"] == [],
        "Unexpected protected base shape",
    )
    # Copy already authored JSON objects; this operation creates no question text.
    result = copy.deepcopy(base)
    result["questions"].extend(copy.deepcopy(additions["questions"]))
    result["coverage"] = [
        copy.deepcopy(replacement.get(entry["source_number"], entry))
        for entry in base["coverage"]
    ]
    require(
        result["questions"][:15] == base["questions"],
        "A protected question object changed",
    )
    changed = [
        before["source_number"]
        for before, after in zip(base["coverage"], result["coverage"])
        if before != after
    ]
    require(set(changed) == AFFECTED, "Unaffected coverage changed")
    require(
        len(result["coverage"]) == 34
        and all(entry["question_ids"] for entry in result["coverage"]),
        "The full selected source scope lacks authored links",
    )
    ids = [question["id"] for question in result["questions"]]
    require(len(ids) == len(set(ids)), "Question ID collision")
    write(OWN / "draft.json", result)
    draft = evidence(OWN / "draft.json", canonical=True)
    changed_views = {
        "schema": "n88-repair02-all-new-keyfree-views-v1",
        "seed_sha256": result["seed_sha256"],
        "draft_sha256": draft["canonical_sha256"],
        "relative_to": "original_six_question_objects",
        "new_relative_original_six_count": len(result["questions"]) - 6,
        "repair01_preserved_new_question_count": 9,
        "repair02_branch_question_count": len(additions["questions"]),
        "questions": [
            {
                "id": question["id"],
                "source_numbers": copy.deepcopy(question["source_numbers"]),
                "view": copy.deepcopy(question["view"]),
            }
            for question in result["questions"][6:]
        ],
    }
    write(OWN / "all-new-keyfree-views.json", changed_views)
    preservation = {
        "schema": "n88-repair02-mechanical-preservation-v1",
        "base_draft": evidence(BASE / "draft.json", canonical=True),
        "base_manifest": evidence(BASE / "manifest.json"),
        "protected_prior_files": protected,
        "all_protected_prior_bytes_unchanged": True,
        "protected_question_objects": [
            {
                "id": question["id"],
                "canonical_sha256": digest(question),
                "object_equal": True,
            }
            for question in base["questions"]
        ],
        "protected_question_count": 15,
        "protected_option_count": sum(
            len(question["view"]["options"]) for question in base["questions"]
        ),
        "changed_coverage_sources": changed,
        "unaffected_coverage": [
            {
                "source_number": entry["source_number"],
                "canonical_sha256": digest(entry),
                "object_equal": True,
            }
            for entry in base["coverage"]
            if entry["source_number"] not in AFFECTED
        ],
        "unaffected_coverage_count": 24,
        "prior_review_exit_code_reported": 3,
        "prior_review_report_binding": prior["original_review_report"],
        "old_holds_erased_retroactively": False,
        "producer_replayed": False,
        "source_solving_replayed": False,
        "semantic_review_performed": False,
    }
    write(OWN / "preservation.json", preservation)
    snapshot = {
        "schema": "n88-repair02-author-snapshot-freeze-v1",
        "frozen_at_utc": utc(),
        "phase": "completed_changed_views_before_first_structural",
        "draft": draft,
        "all_new_keyfree_views": evidence(
            OWN / "all-new-keyfree-views.json", canonical=True
        ),
        "manual_additions": evidence(OWN / "additions.json", canonical=True),
        "derivation_freeze": evidence(OWN / "derivation-freeze.json", canonical=True),
        "extended_derivations": evidence(
            OWN / "branch-derivations.json", canonical=True
        ),
        "preservation": evidence(OWN / "preservation.json", canonical=True),
        "report": evidence(OWN / "report.md"),
        "added_math_source_count": 10,
        "branch_question_count": len(additions["questions"]),
        "branch_option_count": sum(
            len(question["view"]["options"]) for question in additions["questions"]
        ),
        "total_question_count": len(result["questions"]),
        "total_option_count": sum(
            len(question["view"]["options"]) for question in result["questions"]
        ),
        "keyfree_question_count": len(changed_views["questions"]),
        "keyfree_option_count": sum(
            len(question["view"]["options"]) for question in changed_views["questions"]
        ),
        "semantic_review": "not_performed_requires_separate_parent_release",
    }
    write(OWN / "snapshot-freeze.json", snapshot)
    print(json.dumps(snapshot, indent=2))
    print("SNAPSHOT_FREEZE", json.dumps(evidence(OWN / "snapshot-freeze.json")))
    return 0


def validate():
    snapshot = load(OWN / "snapshot-freeze.json")
    for field in (
        "draft", "all_new_keyfree_views", "manual_additions", "derivation_freeze",
        "extended_derivations", "preservation", "report",
    ):
        record = snapshot[field]
        require(
            evidence(pathlib.Path(record["path"]))["sha256"] == record["sha256"],
            "Completed authored snapshot changed after freeze",
        )
    protected, prior = bind_protected()
    original = load(AUTHOR / "first-structural-execution.json")
    argv = list(original["argv"])
    require(
        argv.count("--draft") == 1 and "--review" not in argv,
        "Unexpected original structural argv",
    )
    argv[argv.index("--draft") + 1] = str(OWN / "draft.json")
    require(original["cwd"] == str(ROOT), "Original cwd does not match R")
    started = {
        "argv": argv,
        "cwd": original["cwd"],
        "resolved_interpreter": shutil.which(argv[0]),
        "runner_interpreter": sys.executable,
        "started_at_utc": utc(),
        "invocation_count": 1,
    }
    write(OWN / "first-structural-started.json", started)
    begin = time.monotonic()
    completed = subprocess.run(
        argv, cwd=original["cwd"], stdout=subprocess.PIPE,
        stderr=subprocess.PIPE, check=False,
    )
    ended = utc()
    elapsed = time.monotonic() - begin
    for name, payload in (
        ("first-structural.stdout.txt", completed.stdout),
        ("first-structural.stderr.txt", completed.stderr),
    ):
        with (OWN / name).open("xb") as handle:
            handle.write(payload)
    receipt = {
        "schema": "n88-repair02-first-structural-execution-v1",
        **started,
        "finished_at_utc": ended,
        "elapsed_seconds": elapsed,
        "exit_code": completed.returncode,
        "original_receipt": evidence(
            AUTHOR / "first-structural-execution.json", canonical=True
        ),
        "argv_change_from_original": "draft_path_only",
        "review_argument_supplied": False,
        "draft": evidence(OWN / "draft.json", canonical=True),
        "snapshot_freeze": evidence(OWN / "snapshot-freeze.json", canonical=True),
        "stdout": evidence(OWN / "first-structural.stdout.txt"),
        "stderr": evidence(OWN / "first-structural.stderr.txt"),
        "failure_preserved": completed.returncode != 0,
        "retry_count": 0,
        "dependents_stopped_on_failure": completed.returncode != 0,
        "semantic_review": "not_run",
        "validator_process": "exited",
    }
    write(OWN / "first-structural-execution.json", receipt)
    # Preservation and execution inventory are not a semantic dependent stage.
    for record in protected:
        require(
            evidence(pathlib.Path(record["path"]))["sha256"] == record["sha256"],
            "A protected prior artifact changed during validation",
        )
    for field in ("draft", "all_new_keyfree_views", "extended_derivations"):
        record = snapshot[field]
        require(
            evidence(pathlib.Path(record["path"]))["sha256"] == record["sha256"],
            "Validator changed an immutable repair02 artifact",
        )
    manifest = {
        "schema": "n88-repair02-author-manifest-v1",
        "owned_root": str(OWN),
        "phase": (
            "first_structural_passed_await_changed_semantic_release"
            if completed.returncode == 0
            else "first_structural_failed_dependents_stopped"
        ),
        "first_structural_exit_code": completed.returncode,
        "first_structural_receipt": evidence(
            OWN / "first-structural-execution.json", canonical=True
        ),
        "base_repair01_manifest": evidence(BASE / "manifest.json"),
        "base_repair01_draft": evidence(BASE / "draft.json", canonical=True),
        "base_repair01_producer_or_passed_check_replayed": False,
        "original_review_exit_code_reported": 3,
        "original_review_report_binding": prior["original_review_report"],
        "prior_holds_and_failures_preserved": True,
        "new_definition_basis": [
            evidence(BASIS / "definition.json", canonical=True),
            evidence(BASIS / "reviewer/report.md"),
        ],
        "new_premise_visible_in_affected_stems": True,
        "new_premise_added_to_seed_or_concept_blocks": False,
        "seed_canonical_sha256": (
            "30115b36ab2c48c291b2801fd805665a9fd57991028ec75a16f5825ac1c92896"
        ),
        "draft": evidence(OWN / "draft.json", canonical=True),
        "keyfree_views": evidence(OWN / "all-new-keyfree-views.json", canonical=True),
        "extended_derivations": evidence(OWN / "branch-derivations.json", canonical=True),
        "selected_source_count": 34,
        "represented_source_count": 34,
        "changed_source_units_this_repair": sorted(AFFECTED, key=int),
        "changed_source_count_this_repair": 10,
        "new_branch_question_count": snapshot["branch_question_count"],
        "new_branch_option_count": snapshot["branch_option_count"],
        "total_question_count": snapshot["total_question_count"],
        "total_option_count": snapshot["total_option_count"],
        "preserved_question_objects": 15,
        "preserved_option_objects": 60,
        "preserved_unaffected_coverage_objects": 24,
        "keyfree_questions_relative_original_six": snapshot["keyfree_question_count"],
        "keyfree_options_relative_original_six": snapshot["keyfree_option_count"],
        "new_figures": 0,
        "new_images": 0,
        "source_solving_replay": False,
        "capacity_losses": [
            "Independent written inverse evaluations, comparisons and numerical sums are not demonstrated.",
            "226: independent production of the threshold proof is not demonstrated.",
            "232: independent construction and writing of the all-real identity proof are not demonstrated.",
            "All inherited proof and drawing construction losses are unchanged; no drawing or writing credit is claimed.",
        ],
        "semantic_review": "not_performed_requires_separate_parent_release",
        "semantic_approval": False,
        "with_review_validator_invocations": 0,
        "first_structural_invocation_count": 1,
        "retry_count": 0,
        "whole_defence_or_publish": False,
        "process_state": "all_invoked_processes_exited_no_background_sessions",
        "ledger": {
            "parent_budget": "24/24 permanently spent",
            "carried_charges": 74,
            "paid_generation": 0,
            "hidden_fees": "UNKNOWN",
            "completed_approved": 0,
        },
        "files": [
            evidence(path, canonical=path.suffix == ".json")
            for path in sorted(OWN.iterdir())
            if path.is_file()
        ],
        "manifest_self_hash": "hash final bytes externally",
    }
    write(OWN / "manifest.json", manifest)
    print(json.dumps(receipt, indent=2))
    print("STDOUT_BEGIN")
    sys.stdout.flush()
    sys.stdout.buffer.write(completed.stdout)
    sys.stdout.flush()
    print("\nSTDOUT_END\nSTDERR_BEGIN")
    sys.stdout.flush()
    sys.stdout.buffer.write(completed.stderr)
    sys.stdout.flush()
    print("\nSTDERR_END")
    print("ACTUAL_RECEIPT", json.dumps(evidence(OWN / "first-structural-execution.json")))
    print("MANIFEST", json.dumps(evidence(OWN / "manifest.json")))
    return completed.returncode


def main():
    require(
        len(sys.argv) == 2 and sys.argv[1] in ("assemble", "validate"),
        "Specify exactly assemble or validate",
    )
    return assemble() if sys.argv[1] == "assemble" else validate()


if __name__ == "__main__":
    try:
        sys.exit(main())
    except Exception:
        failure = {
            "stage": sys.argv[1:] or ["unknown"],
            "failed_at_utc": utc(),
            "traceback": traceback.format_exc(),
            "dependents_stopped": True,
            "retry_authorized": False,
        }
        path = OWN / "first-technical-failure.json"
        if not path.exists():
            write(path, failure)
        print(failure["traceback"], file=sys.stderr)
        sys.exit(1)
