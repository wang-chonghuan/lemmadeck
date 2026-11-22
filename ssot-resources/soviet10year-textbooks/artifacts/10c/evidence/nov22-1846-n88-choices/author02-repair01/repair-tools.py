"""Mechanically bind manual additions and capture one structural invocation."""

import copy
import datetime
import hashlib
import json
import pathlib
import shutil
import subprocess
import sys
import time


ROOT = pathlib.Path("/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck")
AUTHOR = ROOT / ".tmp/stemrobin-184-six/n88-choice-author02"
OWN = AUTHOR / "repair01"
REPORT = ROOT / ".tmp/stemrobin-184-six/n88-choice-review/semantic/report.md"
AFFECTED = {str(n) for n in range(204, 215)} | {"231"}
HOLDS = {str(n) for n in range(222, 231)} | {"232"}
ORIGINAL_DRAFT_SHA = (
    "b65fbf8da1b310e2e3113fa28ee66d8aacd1dc61626b4059b2db0c7e974dfa8e"
)
REPORT_SHA = (
    "ec9c784b086921917bfc6a40d4beb664b4ecf63cb1ddee38dc168b5ec3696392"
)


def canonical_sha(value):
    payload = json.dumps(
        value, sort_keys=True, ensure_ascii=True, separators=(",", ":")
    ).encode("utf-8")
    return hashlib.sha256(payload).hexdigest()


def evidence(path, canonical=False):
    payload = path.read_bytes()
    record = {
        "path": str(path),
        "bytes": len(payload),
        "sha256": hashlib.sha256(payload).hexdigest(),
    }
    if canonical:
        record["canonical_sha256"] = canonical_sha(json.loads(payload))
    return record


def load(path):
    return json.loads(path.read_bytes())


def write_json(path, value):
    with path.open("x", encoding="utf-8") as handle:
        json.dump(value, handle, ensure_ascii=True, indent=2)
        handle.write("\n")


def stamp():
    return datetime.datetime.now(datetime.timezone.utc).isoformat()


def require(condition, message):
    if not condition:
        raise RuntimeError(message)


def unchanged_originals():
    require(
        evidence(AUTHOR / "draft.json")["sha256"] == ORIGINAL_DRAFT_SHA,
        "Original six-question draft bytes changed",
    )
    require(evidence(REPORT)["sha256"] == REPORT_SHA, "Intaken review changed")
    frozen = load(AUTHOR / "source-freeze.json")
    for record in frozen["files"]:
        require(
            evidence(AUTHOR / record["path"])["sha256"] == record["sha256"],
            "Frozen source-solution bytes changed",
        )
    return frozen


def assemble():
    unchanged_originals()
    original = load(AUTHOR / "draft.json")
    additions = load(OWN / "additions.json")
    require(
        set(additions) == {"schema", "questions", "coverage_replacements"},
        "Unexpected additions fields",
    )
    replacements = {
        record["source_number"]: record
        for record in additions["coverage_replacements"]
    }
    require(
        len(additions["coverage_replacements"]) == 12
        and set(replacements) == AFFECTED,
        "Coverage replacement scope is not exactly the twelve released sources",
    )
    cited = set()
    for question in additions["questions"]:
        require(
            set(question["source_numbers"]) <= AFFECTED,
            "A new question cites an unreleased source",
        )
        cited.update(question["source_numbers"])
    require(cited == AFFECTED, "An affected source lacks an authored question")
    require(original["new_figures"] == [], "Unexpected existing figures")
    repaired = copy.deepcopy(original)
    # Content is copied from manual JSON; no question or option is synthesized.
    repaired["questions"].extend(copy.deepcopy(additions["questions"]))
    repaired["coverage"] = [
        copy.deepcopy(replacements.get(record["source_number"], record))
        for record in original["coverage"]
    ]
    ids = [question["id"] for question in repaired["questions"]]
    require(len(ids) == len(set(ids)), "Question identifier collision")
    require(
        repaired["questions"][:6] == original["questions"],
        "A retained question object changed",
    )
    changed = [
        before["source_number"]
        for before, after in zip(original["coverage"], repaired["coverage"])
        if before != after
    ]
    require(set(changed) == AFFECTED, "An unaffected coverage object changed")
    require(len(repaired["coverage"]) == 34, "Selected coverage scope changed")
    write_json(OWN / "draft.json", repaired)
    draft_record = evidence(OWN / "draft.json", canonical=True)
    views = {
        "schema": "n88-affected-choice-views-v1",
        "seed_sha256": repaired["seed_sha256"],
        "draft_sha256": draft_record["canonical_sha256"],
        "affected_source_numbers": sorted(AFFECTED, key=int),
        "questions": [
            {
                "id": question["id"],
                "source_numbers": copy.deepcopy(question["source_numbers"]),
                "view": copy.deepcopy(question["view"]),
            }
            for question in additions["questions"]
        ],
    }
    write_json(OWN / "affected-views.json", views)
    preservation = {
        "schema": "n88-repair01-mechanical-preservation-v1",
        "original_draft": evidence(AUTHOR / "draft.json", canonical=True),
        "preserved_question_objects": [
            {
                "id": question["id"],
                "canonical_sha256": canonical_sha(question),
                "object_unchanged": True,
            }
            for question in original["questions"]
        ],
        "preserved_question_count": 6,
        "preserved_old_option_count": sum(
            len(question["view"]["options"]) for question in original["questions"]
        ),
        "changed_coverage_source_numbers": changed,
        "unaffected_coverage_count": 22,
        "unaffected_coverage_objects_equal": True,
        "branch_holds": [
            {
                "source_number": record["source_number"],
                "canonical_sha256": canonical_sha(record),
                "object_unchanged": True,
            }
            for record in original["coverage"]
            if record["source_number"] in HOLDS
        ],
        "source_freeze": evidence(AUTHOR / "source-freeze.json", canonical=True),
        "source_solutions": [
            evidence(AUTHOR / name)
            for name in ("source-solutions.md", "source-solutions.json")
        ],
        "intaken_report": evidence(REPORT),
        "prior_review_validator_exit_code_reported": 3,
        "prior_review_and_failures_modified": False,
        "selected_source_count": 34,
        "source_solution_reauthoring": False,
        "new_figures": 0,
        "new_images": 0,
        "semantic_review_performed": False,
    }
    write_json(OWN / "preservation.json", preservation)
    frozen = {
        "schema": "n88-repair01-author-snapshot-freeze-v1",
        "frozen_at_utc": stamp(),
        "phase": "manual_additions_assembled_before_first_structural",
        "draft": draft_record,
        "manual_additions": evidence(OWN / "additions.json", canonical=True),
        "affected_views": evidence(OWN / "affected-views.json", canonical=True),
        "preservation": evidence(OWN / "preservation.json", canonical=True),
        "report": evidence(OWN / "report.md"),
        "new_question_count": len(additions["questions"]),
        "new_option_count": sum(
            len(question["view"]["options"]) for question in additions["questions"]
        ),
        "total_question_count": len(repaired["questions"]),
        "affected_source_count": 12,
        "preserved_question_count": 6,
        "branch_hold_count": 10,
        "semantic_review": "not_performed_await_parent_release_to_same_Euclid",
        "visible_projection_is_review_authorization": False,
    }
    write_json(OWN / "snapshot-freeze.json", frozen)
    print(json.dumps(frozen, ensure_ascii=True, indent=2))
    print("SNAPSHOT_FREEZE", json.dumps(evidence(OWN / "snapshot-freeze.json")))
    return 0


def validate():
    frozen = load(OWN / "snapshot-freeze.json")
    for field in ("draft", "manual_additions", "affected_views", "preservation", "report"):
        record = frozen[field]
        require(
            evidence(pathlib.Path(record["path"]))["sha256"] == record["sha256"],
            "Repaired authored snapshot changed after freezing",
        )
    unchanged_originals()
    original_receipt = load(AUTHOR / "first-structural-execution.json")
    argv = list(original_receipt["argv"])
    require(argv.count("--draft") == 1, "Original receipt has ambiguous draft")
    require("--review" not in argv, "Original receipt includes review")
    argv[argv.index("--draft") + 1] = str(OWN / "draft.json")
    require(original_receipt["cwd"] == str(ROOT), "Original cwd differs")
    start = {
        "argv": argv,
        "cwd": original_receipt["cwd"],
        "resolved_interpreter": shutil.which(argv[0]),
        "runner_interpreter": sys.executable,
        "started_at_utc": stamp(),
        "invocation_count": 1,
    }
    write_json(OWN / "first-structural-started.json", start)
    begin = time.monotonic()
    completed = subprocess.run(
        argv,
        cwd=original_receipt["cwd"],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        check=False,
    )
    finished = stamp()
    elapsed = time.monotonic() - begin
    for name, payload in (
        ("first-structural.stdout.txt", completed.stdout),
        ("first-structural.stderr.txt", completed.stderr),
    ):
        with (OWN / name).open("xb") as handle:
            handle.write(payload)
    receipt = {
        "schema": "n88-repair01-first-structural-execution-v1",
        **start,
        "finished_at_utc": finished,
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
        "semantic_review": "not_run_not_released",
        "validator_process": "exited",
    }
    write_json(OWN / "first-structural-execution.json", receipt)
    # Only preservation/inventory evidence follows; no semantic dependent runs.
    unchanged_originals()
    require(
        evidence(OWN / "draft.json")["sha256"] == frozen["draft"]["sha256"],
        "Validator changed repaired draft bytes",
    )
    require(
        evidence(OWN / "affected-views.json")["sha256"]
        == frozen["affected_views"]["sha256"],
        "Affected visible freeze changed",
    )
    manifest = {
        "schema": "n88-repair01-author-manifest-v1",
        "owned_root": str(OWN),
        "phase": (
            "first_structural_passed_await_affected_semantic_release"
            if completed.returncode == 0
            else "first_structural_failed_dependents_stopped"
        ),
        "first_structural_exit_code": completed.returncode,
        "first_structural_receipt": evidence(
            OWN / "first-structural-execution.json", canonical=True
        ),
        "original_review_report": evidence(REPORT),
        "original_review_validator_exit_code_reported": 3,
        "original_review_failures_preserved": True,
        "draft": evidence(OWN / "draft.json", canonical=True),
        "affected_views": evidence(OWN / "affected-views.json", canonical=True),
        "source_scope": 34,
        "changed_math_source_units": sorted(AFFECTED, key=int),
        "changed_math_source_count": 12,
        "new_question_count": frozen["new_question_count"],
        "new_option_count": frozen["new_option_count"],
        "total_question_count": frozen["total_question_count"],
        "total_option_count": 24 + frozen["new_option_count"],
        "preserved_question_objects": 6,
        "preserved_option_objects": 24,
        "unaffected_coverage_objects_preserved": 22,
        "represented_source_count": 24,
        "branch_hold_count": 10,
        "branch_hold_sources": sorted(HOLDS, key=int),
        "parent_later_basis_update_applied": False,
        "source_freeze_unchanged": True,
        "source_reasoning_reauthored": False,
        "new_images": 0,
        "new_figures": 0,
        "capacity_losses": [
            "Eight repaired proof sources: independent construction and writing of proofs are not demonstrated.",
            "Four repaired circle sources: drawing, visual placement and labeling are not demonstrated.",
            "231: independent production of the inverse theorem's difference-quotient proof is not demonstrated.",
            "Existing six questions' limitations and all unaffected coverage losses remain unchanged.",
        ],
        "semantic_review": "not_run_await_same_Euclid_affected_release",
        "semantic_approval": False,
        "review_validator_invocations_this_repair": 0,
        "structural_validator_invocations_this_repair": 1,
        "successful_checks_repeated": False,
        "retry_count": 0,
        "process_state": "all_invoked_processes_exited_no_background_sessions",
        "ledger": {
            "carried_charges": 74,
            "paid_generation": 0,
            "hidden_fees": "UNKNOWN",
            "completed_approved": 0,
            "parent_budget": "24/24 permanently exhausted",
        },
        "files": [
            evidence(path, canonical=path.suffix == ".json")
            for path in sorted(OWN.iterdir())
            if path.is_file()
        ],
        "manifest_self_hash": "hash final manifest bytes externally",
    }
    write_json(OWN / "manifest.json", manifest)
    print(json.dumps(receipt, ensure_ascii=True, indent=2))
    print("STDOUT_BEGIN")
    sys.stdout.flush()
    sys.stdout.buffer.write(completed.stdout)
    sys.stdout.flush()
    print("\nSTDOUT_END\nSTDERR_BEGIN")
    sys.stdout.flush()
    sys.stdout.buffer.write(completed.stderr)
    sys.stdout.flush()
    print("\nSTDERR_END")
    print("MANIFEST", json.dumps(evidence(OWN / "manifest.json")))
    return completed.returncode


def main():
    if len(sys.argv) != 2 or sys.argv[1] not in ("assemble", "validate"):
        raise RuntimeError("Specify exactly assemble or validate")
    return assemble() if sys.argv[1] == "assemble" else validate()


if __name__ == "__main__":
    sys.exit(main())
