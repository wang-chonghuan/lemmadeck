"""Capture the single authorized validator run; never generate choice content."""

import hashlib
import json
import pathlib
import subprocess
import sys


ROOT = pathlib.Path("/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck")
OWN = ROOT / ".tmp/stemrobin-184-six/n88-choice-author02"
SEED = ROOT / (
    ".tmp/stemrobin-184-six/n88-choice-source/repo/"
    ".tmp/stemrobin-184-six/n88-choice-source/repo/"
    ".tmp/n88-seed/seed.json"
)
SHADOW = ROOT / ".tmp/stemrobin-184-six/n88-choice-source/repo"
ARGV = [
    "python3",
    str(ROOT / ".agents/skills/ld-s10y-choice/scripts/validate.py"),
    "--repo",
    str(SHADOW),
    "--seed",
    str(SEED),
    "--draft",
    str(OWN / "draft.json"),
]


def canonical_sha256(value):
    payload = json.dumps(
        value, sort_keys=True, ensure_ascii=True, separators=(",", ":")
    ).encode("utf-8")
    return hashlib.sha256(payload).hexdigest()


def file_evidence(path, canonical=False):
    payload = path.read_bytes()
    result = {
        "path": str(path),
        "bytes": len(payload),
        "sha256": hashlib.sha256(payload).hexdigest(),
    }
    if canonical:
        result["canonical_sha256"] = canonical_sha256(json.loads(payload))
    return result


def write_generated_json(path, value):
    with path.open("x", encoding="utf-8") as handle:
        json.dump(value, handle, ensure_ascii=True, indent=2)
        handle.write("\n")


def main():
    # Exclusive evidence creation prevents accidental replay of this invocation.
    marker = OWN / "first-structural-started.json"
    write_generated_json(
        marker,
        {"argv": ARGV, "cwd": str(ROOT), "invocation_count": 1},
    )
    frozen = json.loads((OWN / "source-freeze.json").read_bytes())
    for entry in frozen["files"]:
        actual = file_evidence(OWN / entry["path"])
        if actual["sha256"] != entry["sha256"]:
            raise RuntimeError("Frozen own solution bytes changed before execution")
    pre_draft = file_evidence(OWN / "draft.json", canonical=True)
    # This is the only validator subprocess. It is synchronous and has no review.
    completed = subprocess.run(
        ARGV,
        cwd=ROOT,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        check=False,
    )
    stdout_path = OWN / "first-structural.stdout.txt"
    stderr_path = OWN / "first-structural.stderr.txt"
    for path, payload in (
        (stdout_path, completed.stdout),
        (stderr_path, completed.stderr),
    ):
        with path.open("xb") as handle:
            handle.write(payload)
    evidence = {
        "schema": "n88-first-structural-execution-v1",
        "argv": ARGV,
        "cwd": str(ROOT),
        "exit_code": completed.returncode,
        "invocation_count": 1,
        "review_argument_supplied": False,
        "draft_before_run": pre_draft,
        "stdout": file_evidence(stdout_path),
        "stderr": file_evidence(stderr_path),
        "failure_preserved": completed.returncode != 0,
        "semantic_review": "not_run_not_authorized",
        "stage": "first_structural_only",
    }
    execution_path = OWN / "first-structural-execution.json"
    write_generated_json(execution_path, evidence)
    owned_files = [
        file_evidence(path, canonical=path.suffix == ".json")
        for path in sorted(OWN.iterdir())
        if path.is_file()
    ]
    for entry in frozen["files"]:
        actual = file_evidence(OWN / entry["path"])
        if actual["sha256"] != entry["sha256"]:
            raise RuntimeError("Frozen own solution bytes changed during execution")
    draft = json.loads((OWN / "draft.json").read_bytes())
    manifest = {
        "schema": "n88-bounded-author-manifest-v1",
        "owned_root": str(OWN),
        "seed": file_evidence(SEED, canonical=True),
        "phase": "author_and_first_structural_finished",
        "first_structural_exit_code": completed.returncode,
        "first_structural_execution": file_evidence(execution_path, canonical=True),
        "source_record_count": 34,
        "draft_question_count": len(draft["questions"]),
        "coverage_source_count": len(draft["coverage"]),
        "represented_source_count": sum(
            bool(entry["question_ids"]) for entry in draft["coverage"]
        ),
        "fully_omitted_source_count": sum(
            not entry["question_ids"] for entry in draft["coverage"]
        ),
        "new_figure_count": len(draft["new_figures"]),
        "draft": file_evidence(OWN / "draft.json", canonical=True),
        "frozen_solutions_unchanged": True,
        "semantic_review": "not_run_not_authorized",
        "semantic_approval": False,
        "review_artifact": None,
        "retries": 0,
        "prepare_replayed": False,
        "author_replayed": False,
        "trace_reads_by_author": 0,
        "raw_shadow_semantic_reads_by_author": 0,
        "generated_question_content": False,
        "process_state": "validator_exited_no_background_sessions",
        "ledger": {
            "carried_charges": 74,
            "paid_generation_this_invocation": 0,
            "hidden_fees": "UNKNOWN",
            "completed_approved": 0,
            "parent_budget_used": 24,
            "parent_budget_total": 24,
            "parent_budget_state": "permanently_exhausted",
        },
        "files": owned_files,
        "manifest_self_hash": "not_embedded; hash the final bytes externally",
    }
    manifest_path = OWN / "manifest.json"
    write_generated_json(manifest_path, manifest)
    print(json.dumps(evidence, ensure_ascii=True, indent=2))
    print("STDOUT_BEGIN")
    sys.stdout.flush()
    sys.stdout.buffer.write(completed.stdout)
    sys.stdout.flush()
    print("\nSTDOUT_END")
    print("STDERR_BEGIN")
    sys.stdout.flush()
    sys.stdout.buffer.write(completed.stderr)
    sys.stdout.flush()
    print("\nSTDERR_END")
    print("MANIFEST", json.dumps(file_evidence(manifest_path), ensure_ascii=True))
    return completed.returncode


if __name__ == "__main__":
    sys.exit(main())
