"""Run the authorized with-review command once and retain its actual streams."""

import hashlib
import json
import os
from pathlib import Path
import subprocess
import sys


ROOT = Path("/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188")
OWN = ROOT / ".intentfold/tickets/STEMROBIN-188/tmp/n38-choices-independent7"
REPAIR = "ssot-resources/soviet10year-textbooks/artifacts/6-8g/evidence/stemrobin188-6g-n38/choices-repair7"
REVIEW = ".intentfold/tickets/STEMROBIN-188/tmp/n38-choices-independent7/review.json"
ARGV = [
    "python3",
    ".agents/skills/ld-s10y-choice/scripts/validate.py",
    "--repo",
    ".",
    "--seed",
    f"{REPAIR}/seed.json",
    "--draft",
    f"{REPAIR}/draft.json",
    "--review",
    REVIEW,
]
EXECUTION = OWN / "execution7.json"
STDOUT = OWN / "native-with-review7.stdout.txt"
STDERR = OWN / "native-with-review7.stderr.txt"


def sha256(data):
    return hashlib.sha256(data).hexdigest()


def main():
    if Path.cwd() != ROOT:
        raise RuntimeError("The sole authorized cwd is required.")
    if any(path.exists() for path in (EXECUTION, STDOUT, STDERR)):
        raise RuntimeError("Existing execution evidence prevents a repeated run.")
    review_bytes = (ROOT / REVIEW).read_bytes()
    review = json.loads(review_bytes)
    if review["outcome"] != "pass":
        raise RuntimeError("Do not run a known non-passing semantic review.")
    receipt = {
        "schema": "s10y-choice-native-execution7-v1",
        "cwd": str(ROOT),
        "argv": ARGV,
        "status": "started",
        "with_review_invocations": 1,
        "review_raw_sha256": sha256(review_bytes),
        "seed_canonical_sha256": review["seed_sha256"],
        "draft_canonical_sha256": review["draft_sha256"],
        "reviewer": review["reviewer"],
        "bytecode_writes_disabled": True,
        "semantic_scope": "Same-reviewer q04/q15 affected gate and q14 relation; all unaffected evidence reused.",
    }
    # The exclusive receipt is also the no-rerun marker if execution is interrupted.
    with EXECUTION.open("x", encoding="utf-8") as handle:
        json.dump(receipt, handle, ensure_ascii=True, indent=2)
        handle.write("\n")
    try:
        result = subprocess.run(
            ARGV,
            cwd=ROOT,
            env={**os.environ, "PYTHONDONTWRITEBYTECODE": "1"},
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            check=False,
        )
    except OSError as error:
        receipt.update(
            status="launch_failed",
            exit_code=None,
            launch_error=str(error),
            true_failures=[{"kind": "launch_failure", "evidence": str(error)}],
        )
        EXECUTION.write_text(json.dumps(receipt, ensure_ascii=True, indent=2) + "\n")
        raise
    STDOUT.write_bytes(result.stdout)
    STDERR.write_bytes(result.stderr)
    out_text = result.stdout.decode("utf-8")
    err_text = result.stderr.decode("utf-8")
    try:
        parsed_stdout = json.loads(out_text)
    except json.JSONDecodeError:
        parsed_stdout = None
    receipt.update(
        status="pass" if result.returncode == 0 else "failed",
        exit_code=result.returncode,
        stdout=out_text,
        stderr=err_text,
        stdout_path=str(STDOUT),
        stderr_path=str(STDERR),
        stdout_sha256=sha256(result.stdout),
        stderr_sha256=sha256(result.stderr),
        parsed_stdout=parsed_stdout,
        true_failures=[] if result.returncode == 0 else [
            {
                "kind": "native_nonzero_exit",
                "exit_code": result.returncode,
                "stdout": out_text,
                "stderr": err_text,
            }
        ],
        counters={
            "native_with_review_validator_runs": 1,
            "no_review_validator_runs": 0,
            "prepare_digest_only_runs": 1,
            "prepare_or_inspect_runs": 0,
            "separate_source_pipeline_extraction_runs": 0,
            "source_checks_inside_authorized_native_run": "Native validation performs its required source/asset binding check once; no separate or repeated source checker.",
            "original_sources_previously_solved": 18,
            "new_source_solves": 0,
            "unaffected_question_units_reused": 18,
            "option_truth_checks_reused_unchanged": 80,
            "affected_option_and_rationale_checks": 3,
            "correct_sets_unchanged": 20,
            "true_options": 25,
            "false_options": 58,
            "images_context_total": 4,
            "images_context_limit": 24,
            "image_batches_cumulative": 1,
            "images_largest_batch_cumulative": 4,
            "images_batch_limit": 8,
            "new_image_opens": 0,
            "image_reopens": 0,
            "image_crops": 0,
            "new_renders": 0,
            "new_figures": 0,
            "fig_235_opens": 0,
            "browser_or_native_ui_operations": 0,
            "network_or_paid_calls": 0,
            "dependency_installs": 0,
            "db_operations": 0,
            "git_operations": 0,
            "shared_or_canonical_edits": 0,
            "candidate_or_previous_review_edits": 0,
            "agents_or_messages": 0,
            "timers_or_automations": 0,
            "publication_operations": 0,
        },
    )
    EXECUTION.write_text(json.dumps(receipt, ensure_ascii=True, indent=2) + "\n")
    print(json.dumps(receipt, ensure_ascii=True, indent=2))
    return result.returncode


if __name__ == "__main__":
    sys.exit(main())
