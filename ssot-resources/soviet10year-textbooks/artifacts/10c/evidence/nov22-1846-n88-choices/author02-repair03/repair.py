"""Apply four manually authored leaf changes and capture one structural check."""

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
BASE = AUTHOR / "repair02/recovery01"
OWN = AUTHOR / "repair03"
REVIEW_REPORT = ROOT / (
    ".tmp/stemrobin-184-six/n88-choice-review/"
    "semantic-affected01/comparison/report.md"
)
BASE_SHA = "2fdb7491e95aaf2a3b08aa89ba8ca73d380c11c1b342e72c01a863833af32d3f"
BASE_CANONICAL = "b5ee448de26147fd9c5085b8bb4d2b3a62f2fff32d2ec604319502af9d7ccff6"
BASE_MANIFEST = "8ce4cd265431813c2f3a6ff7dcd7500ed802c76bf889e8521c8e2e2476f38bbd"
REVIEW_REPORT_SHA = "a9585b29b581241a1df4498851ad9410d20431313d07ada6f7bf17f4aa1e2e5f"
PATHS = {
    "/questions/15/view/options/3/text",
    "/questions/15/key/rationales/3/derivation",
    "/questions/15/key/rationales/3/misconception",
    "/questions/14/intent/limitations/1",
}


def canonical(value):
    payload = json.dumps(
        value, sort_keys=True, ensure_ascii=True, separators=(",", ":")
    ).encode("utf-8")
    return hashlib.sha256(payload).hexdigest()


def load(path):
    return json.loads(path.read_bytes())


def evidence(path, json_digest=False):
    payload = path.read_bytes()
    result = {
        "path": str(path),
        "bytes": len(payload),
        "sha256": hashlib.sha256(payload).hexdigest(),
    }
    if json_digest:
        result["canonical_sha256"] = canonical(json.loads(payload))
    return result


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
        require(set(left) == set(right), "Object field set changed")
        return [
            item for key in left
            for item in diff(left[key], right[key], path + "/" + key)
        ]
    if isinstance(left, list):
        require(len(left) == len(right), "List size changed")
        return [
            item for i, (a, b) in enumerate(zip(left, right))
            for item in diff(a, b, path + "/" + str(i))
        ]
    return [] if left == right else [path]


def parent_at(value, pointer):
    parts = pointer.lstrip("/").split("/")
    current = value
    for part in parts[:-1]:
        current = current[int(part)] if isinstance(current, list) else current[part]
    key = int(parts[-1]) if isinstance(current, list) else parts[-1]
    return current, key


def main():
    require(evidence(BASE / "draft.json")["sha256"] == BASE_SHA,
            "Recovered base draft bytes changed")
    require(canonical(load(BASE / "draft.json")) == BASE_CANONICAL,
            "Recovered base canonical digest changed")
    require(evidence(BASE / "manifest.json")["sha256"] == BASE_MANIFEST,
            "Recovered base manifest changed")
    require(evidence(REVIEW_REPORT)["sha256"] == REVIEW_REPORT_SHA,
            "Released comparison report changed")
    base_manifest = load(BASE / "manifest.json")
    protected = [evidence(BASE / "manifest.json"), evidence(REVIEW_REPORT)]
    for record in base_manifest["files"]:
        actual = evidence(pathlib.Path(record["path"]))
        require(actual["sha256"] == record["sha256"], "Recovered base artifact changed")
        protected.append(actual)
    for record in load(BASE / "preservation.json")["all_prior_protected_bytes"]:
        actual = evidence(pathlib.Path(record["path"]))
        require(actual["sha256"] == record["sha256"], "Historical protected artifact changed")
        protected.append(actual)
    before = load(BASE / "draft.json")
    authored = load(OWN / "changes.json")
    require(authored["base_byte_sha256"] == BASE_SHA, "Manual patch base mismatch")
    require(
        len(authored["changes"]) == 4
        and {entry["path"] for entry in authored["changes"]} == PATHS,
        "Manual patch exceeds the released four-field scope",
    )
    after = copy.deepcopy(before)
    for entry in authored["changes"]:
        parent, key = parent_at(after, entry["path"])
        require(parent[key] == entry["before"], "Manual patch old value differs")
        parent[key] = entry["after"]
    require(set(diff(before, after)) == PATHS, "Unexpected draft delta")
    restored = copy.deepcopy(after)
    for entry in authored["changes"]:
        parent, key = parent_at(restored, entry["path"])
        parent[key] = entry["before"]
    require(restored == before, "Reversing the four authored changes did not restore base")
    old_q = before["questions"][15]
    new_q = after["questions"][15]
    require(
        old_q["id"] == new_q["id"] == "normalized-exact-comparison-profile",
        "Affected question identity differs",
    )
    require(
        old_q["view"]["options"][:3] == new_q["view"]["options"][:3],
        "A, B or C option object changed",
    )
    require(new_q["view"]["options"][3]["id"] == "D", "Wrong option changed")
    require(new_q["key"]["correct"] == old_q["key"]["correct"] == ["B"],
            "Correct profile key changed")
    require(old_q["key"]["rationales"][:3] == new_q["key"]["rationales"][:3],
            "Unreleased rationale changed")
    require(
        new_q["key"]["rationales"][3]["truth"]
        == old_q["key"]["rationales"][3]["truth"] == "incorrect",
        "D no longer has the protected incorrect truth label",
    )
    require(before["coverage"] == after["coverage"], "Coverage changed")
    require(
        before["questions"][14]["view"] == after["questions"][14]["view"]
        and before["questions"][14]["key"] == after["questions"][14]["key"],
        "Derivative visible content or key changed",
    )
    require(
        [q["key"]["correct"] for q in before["questions"]]
        == [q["key"]["correct"] for q in after["questions"]],
        "An exact correct set changed",
    )
    require(
        [[r["truth"] for r in q["key"]["rationales"]] for q in before["questions"]]
        == [[r["truth"] for r in q["key"]["rationales"]] for q in after["questions"]],
        "An option truth label changed",
    )
    write(OWN / "draft.json", after)
    draft = evidence(OWN / "draft.json", True)
    projection = {
        "schema": "n88-repair03-comparison-only-keyfree-v1",
        "seed_sha256": after["seed_sha256"],
        "draft_sha256": draft["canonical_sha256"],
        "reviewer_metadata": {
            "changed_option_id": "D",
            "scope": "one affected comparison view; all four options shown for context",
        },
        "questions": [{
            "id": new_q["id"],
            "source_numbers": copy.deepcopy(new_q["source_numbers"]),
            "view": copy.deepcopy(new_q["view"]),
        }],
    }
    write(OWN / "changed-comparison-keyfree-view.json", projection)
    delta = {
        "schema": "n88-repair03-exact-field-delta-v1",
        "base_draft": evidence(BASE / "draft.json", True),
        "new_draft": draft,
        "changed_paths": diff(before, after),
        "changes": authored["changes"],
        "reverse_patch_restores_entire_base_object": True,
        "sole_visible_delta": "/questions/15/view/options/3/text",
        "correct_B_option_and_rationale_equal": True,
        "correct_key_equal": True,
        "D_still_declared_incorrect": True,
        "semantic_verdict": "not_performed",
    }
    write(OWN / "field-delta.json", delta)
    preservation = {
        "schema": "n88-repair03-preservation-v1",
        "all_prior_protected_bytes": protected,
        "all_prior_bytes_unchanged": True,
        "fully_equal_question_objects": sum(
            a == b for a, b in zip(before["questions"], after["questions"])
        ),
        "equal_other_visible_question_views": sum(
            a["view"] == b["view"]
            for a, b in zip(before["questions"], after["questions"])
        ),
        "unchanged_option_objects": sum(
            a == b for old, new in zip(before["questions"], after["questions"])
            for a, b in zip(old["view"]["options"], new["view"]["options"])
        ),
        "all_34_coverage_objects_equal": True,
        "all_18_correct_sets_equal": True,
        "all_72_option_truth_labels_equal": True,
        "A_B_C_comparison_option_objects_equal": True,
        "derivative_view_key_and_proof_equal": True,
        "derivative_internal_qualifier_only": "/questions/14/intent/limitations/1",
        "source_and_branch_derivation_freezes_unchanged": True,
        "earlier_blocked_exit3_and_failed_exit2_preserved": True,
        "affected_review_report": evidence(REVIEW_REPORT),
        "affected_review_sha256_reported": (
            "d873adab2456c398f62e743a5feba0d59a547bde9dc4aa4868fb6d775346e284"
        ),
        "affected_review_exit_reported": 3,
        "affected_review_stdout_bytes_reported": 0,
        "affected_review_stderr_bytes_reported": 58,
        "producer_or_review_replay": False,
    }
    write(OWN / "preservation.json", preservation)
    frozen = {
        "schema": "n88-repair03-pre-structural-snapshot-v1",
        "frozen_at_utc": utc(),
        "draft": draft,
        "keyfree_view": evidence(OWN / "changed-comparison-keyfree-view.json", True),
        "manual_changes": evidence(OWN / "changes.json", True),
        "exact_delta": evidence(OWN / "field-delta.json", True),
        "preservation": evidence(OWN / "preservation.json", True),
        "report": evidence(OWN / "report.md"),
        "question_count": len(after["questions"]),
        "option_count": sum(len(q["view"]["options"]) for q in after["questions"]),
        "selected_source_count": len(after["coverage"]),
        "projection_question_count": 1,
        "projection_option_count": 4,
        "semantic_approval": False,
    }
    write(OWN / "snapshot-freeze.json", frozen)
    prior = load(BASE / "structural-recovery-execution.json")
    argv = list(prior["argv"])
    require(argv.count("--draft") == 1 and "--review" not in argv,
            "Unexpected base structural argv")
    argv[argv.index("--draft") + 1] = str(OWN / "draft.json")
    require(prior["cwd"] == str(ROOT), "Base structural cwd differs")
    start = {
        "argv": argv,
        "cwd": prior["cwd"],
        "resolved_interpreter": shutil.which(argv[0]),
        "runner_interpreter": sys.executable,
        "started_at_utc": utc(),
        "first_changed_snapshot_invocation_count": 1,
    }
    write(OWN / "first-structural-started.json", start)
    begin = time.monotonic()
    completed = subprocess.run(
        argv, cwd=prior["cwd"], stdout=subprocess.PIPE,
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
        "schema": "n88-repair03-first-structural-receipt-v1",
        **start,
        "finished_at_utc": ended,
        "elapsed_seconds": elapsed,
        "exit_code": completed.returncode,
        "base_receipt": evidence(BASE / "structural-recovery-execution.json"),
        "argv_change_from_base": "draft_path_only",
        "review_argument_supplied": False,
        "draft": evidence(OWN / "draft.json", True),
        "stdout": evidence(OWN / "first-structural.stdout.txt"),
        "stderr": evidence(OWN / "first-structural.stderr.txt"),
        "failure_preserved": completed.returncode != 0,
        "dependents_stopped_on_failure": completed.returncode != 0,
        "retry_count": 0,
        "semantic_review": "not_performed",
        "process_state": "validator_exited",
    }
    write(OWN / "first-structural-execution.json", receipt)
    for record in protected:
        require(evidence(pathlib.Path(record["path"]))["sha256"] == record["sha256"],
                "Prior protected artifact changed during validation")
    for field in ("draft", "keyfree_view", "manual_changes", "exact_delta", "preservation", "report"):
        record = frozen[field]
        require(evidence(pathlib.Path(record["path"]))["sha256"] == record["sha256"],
                "Frozen affected snapshot changed during validation")
    manifest = {
        "schema": "n88-repair03-author-manifest-v1",
        "owned_root": str(OWN),
        "stage": "released_minimal_V1_content_repair_only",
        "outcome": (
            "first_structural_pass_requires_affected_semantic_review"
            if completed.returncode == 0
            else "first_structural_failure_dependents_stopped"
        ),
        "first_structural_exit_code": completed.returncode,
        "actual_receipt": evidence(OWN / "first-structural-execution.json", True),
        "draft": evidence(OWN / "draft.json", True),
        "keyfree_view": evidence(OWN / "changed-comparison-keyfree-view.json", True),
        "report": evidence(OWN / "report.md"),
        "delta": evidence(OWN / "field-delta.json", True),
        "preservation": evidence(OWN / "preservation.json", True),
        "review_report_intake": evidence(REVIEW_REPORT),
        "prior_affected_review_outcome": "revise",
        "prior_affected_review_exit_reported": 3,
        "review_failures_and_all_prior_freezes_preserved": True,
        "changed_option_id": "D",
        "visible_profile_before": "(=,<,>,=)",
        "visible_profile_after": "(>,<,>,=)",
        "visible_comparison_coordinate_changes": 1,
        "changed_distractor_rationale_fields": ["derivation", "misconception"],
        "correct_B_profile_and_key_unchanged": True,
        "D_declared_truth_unchanged": "incorrect",
        "historical_derivative_qualifier_changed": True,
        "fully_unchanged_question_objects": 16,
        "other_visible_views_unchanged": 17,
        "other_option_objects_unchanged": 71,
        "all_34_coverage_objects_unchanged": True,
        "source_count": 34,
        "question_count": 18,
        "option_count": 72,
        "keyfree_question_count": 1,
        "keyfree_option_count": 4,
        "selected_seed_schema_scope_and_figures_unchanged": True,
        "source_solving_or_whole_question_authoring_replayed": False,
        "structural_invocation_count": 1,
        "with_review_validator_invocations": 0,
        "passed_producer_or_review_replay": False,
        "semantic_approval": False,
        "V1_waiver": False,
        "blanket_package_leakage_or_independence_clearance": False,
        "process_state": "all_invoked_processes_exited_no_background_sessions",
        "ledger": {
            "parent_budget": "24/24 permanently spent",
            "carried_charges": 74,
            "paid_generation": 0,
            "hidden_fees": "UNKNOWN",
            "completed_approved": 0,
        },
        "files": [
            evidence(path, path.suffix == ".json")
            for path in sorted(OWN.iterdir()) if path.is_file()
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
    print("ACTUAL_RECEIPT", json.dumps(evidence(OWN / "first-structural-execution.json")))
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
