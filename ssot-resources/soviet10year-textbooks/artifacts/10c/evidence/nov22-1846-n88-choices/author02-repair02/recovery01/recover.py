"""One-field reversible notation recovery and one structural invocation."""

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
BASE = ROOT / ".tmp/stemrobin-184-six/n88-choice-author02/repair02"
OWN = BASE / "recovery01"
DRAFT_SHA = "00ae9a1cbe7395d082025bde9c5bf863ae3881cc853311cfdd675b452ab14d22"
MANIFEST_SHA = "22e3523a94b22e3fb063bcfdff8446d4d58da2f62f918e1fbdb70b27b13e4e23"
QID = "normalized-nonstandard-comparison"
OID = "A"


def canonical(value):
    payload = json.dumps(
        value, sort_keys=True, ensure_ascii=True, separators=(",", ":")
    ).encode("utf-8")
    return hashlib.sha256(payload).hexdigest()


def load(path):
    return json.loads(path.read_bytes())


def evidence(path, json_digest=False):
    payload = path.read_bytes()
    record = {
        "path": str(path),
        "bytes": len(payload),
        "sha256": hashlib.sha256(payload).hexdigest(),
    }
    if json_digest:
        record["canonical_sha256"] = canonical(json.loads(payload))
    return record


def write(path, value):
    with path.open("x", encoding="utf-8") as handle:
        json.dump(value, handle, ensure_ascii=True, indent=2)
        handle.write("\n")


def require(value, message):
    if not value:
        raise RuntimeError(message)


def utc():
    return datetime.datetime.now(datetime.timezone.utc).isoformat()


def diff(left, right, path=""):
    if type(left) is not type(right):
        return [path]
    if isinstance(left, dict):
        require(set(left) == set(right), "An object field was added or removed")
        return [
            item for key in left
            for item in diff(left[key], right[key], path + "/" + key)
        ]
    if isinstance(left, list):
        require(len(left) == len(right), "A list size changed")
        return [
            item for index, (a, b) in enumerate(zip(left, right))
            for item in diff(a, b, path + "/" + str(index))
        ]
    return [] if left == right else [path]


def main():
    require(evidence(BASE / "manifest.json")["sha256"] == MANIFEST_SHA,
            "Failed manifest changed")
    require(evidence(BASE / "draft.json")["sha256"] == DRAFT_SHA,
            "Failed draft changed")
    base_manifest = load(BASE / "manifest.json")
    protected = [evidence(BASE / "manifest.json")]
    for record in base_manifest["files"]:
        actual = evidence(pathlib.Path(record["path"]))
        require(actual["sha256"] == record["sha256"], "Failed artifact changed")
        protected.append(actual)
    # Inherited protection is byte hashing only, not a source/content reread.
    inherited = load(BASE / "preservation.json")["protected_prior_files"]
    for record in inherited:
        actual = evidence(pathlib.Path(record["path"]))
        require(actual["sha256"] == record["sha256"], "Prior artifact changed")
        protected.append(actual)
    failed_receipt = load(BASE / "first-structural-execution.json")
    require(
        failed_receipt["exit_code"] == 2
        and failed_receipt["stderr"]["bytes"] == 53,
        "Inherited failed-stage receipt differs",
    )
    before = load(BASE / "draft.json")
    indices = [i for i, q in enumerate(before["questions"]) if q["id"] == QID]
    require(indices == [16], "Released question path differs")
    qi = indices[0]
    options = before["questions"][qi]["view"]["options"]
    indices = [i for i, option in enumerate(options) if option["id"] == OID]
    require(indices == [0], "Released option path differs")
    oi = indices[0]
    old_text = options[oi]["text"]
    require(old_text.count("<") == 4 and old_text.count(">") == 2,
            "Raw token count differs from the released target")
    require(r"\lt" not in old_text and r"\gt" not in old_text,
            "Existing relation commands would make reversal ambiguous")
    new_text = old_text.replace("<", r"\lt ").replace(">", r"\gt ")
    after = copy.deepcopy(before)
    after["questions"][qi]["view"]["options"][oi]["text"] = new_text
    target = f"/questions/{qi}/view/options/{oi}/text"
    require(diff(before, after) == [target], "Delta exceeds the one released field")
    reversed_copy = copy.deepcopy(after)
    reversed_copy["questions"][qi]["view"]["options"][oi]["text"] = (
        new_text.replace(r"\lt ", "<").replace(r"\gt ", ">")
    )
    require(reversed_copy == before, "Reversible notation identity failed")
    write(OWN / "draft.json", after)
    new_draft = evidence(OWN / "draft.json", json_digest=True)
    old_views = load(BASE / "all-new-keyfree-views.json")
    views = copy.deepcopy(old_views)
    views["draft_sha256"] = new_draft["canonical_sha256"]
    views["questions"] = [
        {
            "id": q["id"],
            "source_numbers": copy.deepcopy(q["source_numbers"]),
            "view": copy.deepcopy(q["view"]),
        }
        for q in after["questions"][6:]
    ]
    view_target = f"/questions/{qi - 6}/view/options/{oi}/text"
    require(
        set(diff(old_views, views)) == {"/draft_sha256", view_target},
        "Key-free projection has an unrelated delta",
    )
    write(OWN / "all-new-keyfree-views.json", views)
    delta = {
        "schema": "n88-recovery01-representation-delta-v1",
        "question_id": QID,
        "option_id": OID,
        "draft_json_pointer": target,
        "keyfree_json_pointer": view_target,
        "draft_differing_paths": diff(before, after),
        "projection_differing_paths": diff(old_views, views),
        "before_text": old_text,
        "after_text": new_text,
        "replacement": {"<": "\\lt ", ">": "\\gt "},
        "less_than_replacements": 4,
        "greater_than_replacements": 2,
        "reversing_notation_restores_entire_draft_object": True,
        "mathematical_claims_operands_and_relation_directions_changed": False,
        "semantic_review": "not_performed",
    }
    write(OWN / "representation-delta.json", delta)
    preservation = {
        "schema": "n88-recovery01-preservation-v1",
        "failed_draft": evidence(BASE / "draft.json", json_digest=True),
        "failed_manifest": evidence(BASE / "manifest.json"),
        "failed_receipt": evidence(BASE / "first-structural-execution.json"),
        "failed_exit_code": 2,
        "failed_stderr": evidence(BASE / "first-structural.stderr.txt"),
        "all_prior_protected_bytes": protected,
        "all_prior_protected_bytes_unchanged": True,
        "unchanged_question_count": 17,
        "unchanged_option_count": 71,
        "affected_question_only_changed_field": target,
        "keys_rationales_intents_stems_coverage_figures_seed_schema_equal": True,
        "source_derivation_freezes_unchanged": True,
        "mathematics_unchanged_evidence": (
            "Exactly one text path differs; the token-wise inverse notation "
            "substitution restores the complete failed draft object."
        ),
    }
    write(OWN / "preservation.json", preservation)
    frozen = {
        "schema": "n88-recovery01-pre-structural-freeze-v1",
        "frozen_at_utc": utc(),
        "draft": new_draft,
        "keyfree_views": evidence(OWN / "all-new-keyfree-views.json", True),
        "representation_delta": evidence(OWN / "representation-delta.json", True),
        "preservation": evidence(OWN / "preservation.json", True),
        "report": evidence(OWN / "report.md"),
        "question_count": len(after["questions"]),
        "option_count": sum(len(q["view"]["options"]) for q in after["questions"]),
        "keyfree_question_count": len(views["questions"]),
        "keyfree_option_count": sum(len(q["view"]["options"]) for q in views["questions"]),
        "selected_source_count": len(after["coverage"]),
        "semantic_approval": False,
    }
    write(OWN / "snapshot-freeze.json", frozen)
    argv = list(failed_receipt["argv"])
    require(argv.count("--draft") == 1 and "--review" not in argv,
            "Unexpected failed structural argv")
    argv[argv.index("--draft") + 1] = str(OWN / "draft.json")
    require(failed_receipt["cwd"] == str(ROOT), "Failed cwd differs from R")
    start = {
        "argv": argv,
        "cwd": failed_receipt["cwd"],
        "resolved_interpreter": shutil.which(argv[0]),
        "runner_interpreter": sys.executable,
        "started_at_utc": utc(),
        "recovery_invocation_count": 1,
    }
    write(OWN / "structural-recovery-started.json", start)
    begin = time.monotonic()
    completed = subprocess.run(
        argv, cwd=failed_receipt["cwd"], stdout=subprocess.PIPE,
        stderr=subprocess.PIPE, check=False,
    )
    ended = utc()
    elapsed = time.monotonic() - begin
    for name, payload in (
        ("structural-recovery.stdout.txt", completed.stdout),
        ("structural-recovery.stderr.txt", completed.stderr),
    ):
        with (OWN / name).open("xb") as handle:
            handle.write(payload)
    receipt = {
        "schema": "n88-recovery01-actual-structural-receipt-v1",
        **start,
        "finished_at_utc": ended,
        "elapsed_seconds": elapsed,
        "exit_code": completed.returncode,
        "failed_stage_receipt": evidence(BASE / "first-structural-execution.json"),
        "argv_change_from_failed_stage": "draft_path_only",
        "passed_stage_replayed": False,
        "review_argument_supplied": False,
        "draft": evidence(OWN / "draft.json", True),
        "stdout": evidence(OWN / "structural-recovery.stdout.txt"),
        "stderr": evidence(OWN / "structural-recovery.stderr.txt"),
        "failure_preserved": completed.returncode != 0,
        "dependents_stopped_on_failure": completed.returncode != 0,
        "unreleased_retry_count": 0,
        "semantic_review": "not_performed",
        "process_state": "validator_exited",
    }
    write(OWN / "structural-recovery-execution.json", receipt)
    for record in protected:
        require(evidence(pathlib.Path(record["path"]))["sha256"] == record["sha256"],
                "A protected prior byte snapshot changed during recovery")
    for field in ("draft", "keyfree_views", "representation_delta", "preservation", "report"):
        record = frozen[field]
        require(evidence(pathlib.Path(record["path"]))["sha256"] == record["sha256"],
                "An immutable recovery snapshot changed during validation")
    manifest = {
        "schema": "n88-recovery01-manifest-v1",
        "owned_root": str(OWN),
        "stage": "released_failed_structural_representation_recovery_only",
        "outcome": (
            "structural_pass_semantic_review_still_required"
            if completed.returncode == 0
            else "structural_failure_dependents_stopped"
        ),
        "structural_exit_code": completed.returncode,
        "actual_receipt": evidence(OWN / "structural-recovery-execution.json", True),
        "draft": evidence(OWN / "draft.json", True),
        "keyfree_views": evidence(OWN / "all-new-keyfree-views.json", True),
        "report": evidence(OWN / "report.md"),
        "delta": evidence(OWN / "representation-delta.json", True),
        "preservation": evidence(OWN / "preservation.json", True),
        "failed_base_draft": evidence(BASE / "draft.json", True),
        "failed_base_manifest": evidence(BASE / "manifest.json"),
        "failed_base_exit_code": 2,
        "failed_base_stderr_bytes": 53,
        "failed_evidence_unchanged": True,
        "sole_draft_delta": target,
        "representation_changes": {"less_than": 4, "greater_than": 2},
        "mathematical_claim_changes": 0,
        "other_question_objects_unchanged": 17,
        "other_option_objects_unchanged": 71,
        "keys_rationales_intents_coverage_seed_schema_unchanged": True,
        "source_scope": 34,
        "question_count": 18,
        "option_count": 72,
        "keyfree_question_count": 12,
        "keyfree_option_count": 48,
        "recovery_validator_invocation_count": 1,
        "with_review_validator_invocations": 0,
        "source_solving_or_authoring_replayed": False,
        "passed_stage_or_content_review_replayed": False,
        "tool_core_changed": False,
        "semantic_approval": False,
        "new_figures": 0,
        "process_state": "all_invoked_processes_exited_no_background_sessions",
        "ledger": {
            "parent_budget": "24/24 permanently spent",
            "carried_charges": 74,
            "paid_generation": 0,
            "hidden_fees": "UNKNOWN",
            "completed_approved": 0,
        },
        "files": [
            evidence(p, p.suffix == ".json")
            for p in sorted(OWN.iterdir()) if p.is_file()
        ],
        "manifest_self_hash": "hash final bytes externally",
    }
    write(OWN / "manifest.json", manifest)
    print(json.dumps(frozen, indent=2))
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
    print("ACTUAL_RECEIPT", json.dumps(evidence(OWN / "structural-recovery-execution.json")))
    print("MANIFEST", json.dumps(evidence(OWN / "manifest.json")))
    return completed.returncode


if __name__ == "__main__":
    try:
        sys.exit(main())
    except Exception:
        failure = {
            "failed_at_utc": utc(),
            "traceback": traceback.format_exc(),
            "dependents_stopped": True,
        }
        path = OWN / "first-technical-failure.json"
        if not path.exists():
            write(path, failure)
        print(failure["traceback"], file=sys.stderr)
        sys.exit(1)
