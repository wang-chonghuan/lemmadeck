import datetime
import hashlib
import json
import os
import stat
import subprocess
import sys
import time
from pathlib import Path


ROOT = Path("/Users/yong/.codex/worktrees/d9b1/lemmadeck")
BASE = ROOT / ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13"
OWNED = BASE / "n46-choice-review"
SEED = BASE / "n46-choice-author/seed.json"
DRAFT = BASE / "n46-choice-author/draft-repair.json"
REVIEW = OWNED / "review.json"
VALIDATOR = ROOT / ".agents/skills/ld-s10y-choice/scripts/validate.py"
STDOUT = OWNED / "validation.stdout.txt"
STDERR = OWNED / "validation.stderr.txt"
RECEIPT = OWNED / "validation-receipt.json"
SUMMARY = OWNED / "stage3-summary.json"
CLAIM = OWNED / "validation-once.claim.json"


def file_hash(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def canonical_hash(value):
    raw = json.dumps(value, sort_keys=True, ensure_ascii=True, separators=(",", ":"))
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()


def freeze_json(path, value):
    assert path.resolve().parent == OWNED.resolve()
    with path.open("x", encoding="utf-8") as output:
        json.dump(value, output, ensure_ascii=True, indent=2)
        output.write("\n")
    os.chmod(path, 0o444)


for path in (STDOUT, STDERR, RECEIPT, SUMMARY, CLAIM):
    assert not path.exists(), ("one-run receipt already exists", str(path))
for path in (
    REVIEW, OWNED / "stage3-comparison.json",
    OWNED / "stage3-coverage.json", OWNED / "stage3-bindings.json",
):
    assert stat.S_IMODE(path.stat().st_mode) == 0o444

command = [
    sys.executable,
    "-B",
    str(VALIDATOR.relative_to(ROOT)),
    "--repo", ".",
    "--seed", str(SEED.relative_to(ROOT)),
    "--draft", str(DRAFT.relative_to(ROOT)),
    "--review", str(REVIEW.relative_to(ROOT)),
]
before = {
    "validator": file_hash(VALIDATOR),
    "seed": file_hash(SEED),
    "draft": file_hash(DRAFT),
    "review": file_hash(REVIEW),
}
assert before["seed"] == "8861433b0e48930f4d2295f9b7a6a9365630f4d713030704b25892eb5e200b5f"
assert before["draft"] == "37841750cfcb0b84b6e19c00dd3b83a571d50f7e055e002e2a66133c9aff65e1"
assert before["review"] == "30ea6ba63c4ac8534ebb52665ddc3cfafa71a098a230bb25f566bb4c5f01cd68"
freeze_json(CLAIM, {
    "schema": "STEMROBIN-182/choice-validation-one-run-claim@1",
    "command": command,
    "cwd": str(ROOT),
    "before_sha256": before,
    "claimed_at_utc": datetime.datetime.now(datetime.timezone.utc).isoformat(),
})
start = time.monotonic()
result = subprocess.run(
    command,
    cwd=ROOT,
    capture_output=True,
    check=False,
    env={**os.environ, "PYTHONDONTWRITEBYTECODE": "1"},
)
elapsed = time.monotonic() - start
for path, raw in ((STDOUT, result.stdout), (STDERR, result.stderr)):
    with path.open("xb") as output:
        output.write(raw)
    os.chmod(path, 0o444)
after = {
    "validator": file_hash(VALIDATOR),
    "seed": file_hash(SEED),
    "draft": file_hash(DRAFT),
    "review": file_hash(REVIEW),
}
receipt = {
    "schema": "STEMROBIN-182/choice-canonical-validation-receipt@1",
    "command": command,
    "cwd": str(ROOT),
    "invocations": 1,
    "exit_code": result.returncode,
    "elapsed_seconds": elapsed,
    "before_sha256": before,
    "after_sha256": after,
    "inputs_unchanged": before == after,
    "stdout": {"path": str(STDOUT), "sha256": file_hash(STDOUT), "bytes": len(result.stdout)},
    "stderr": {"path": str(STDERR), "sha256": file_hash(STDERR), "bytes": len(result.stderr)},
    "outcome": "pass" if result.returncode == 0 and before == after else "revise",
}
freeze_json(RECEIPT, receipt)
review = json.loads(REVIEW.read_bytes())
comparison = json.loads((OWNED / "stage3-comparison.json").read_bytes())
coverage = json.loads((OWNED / "stage3-coverage.json").read_bytes())
stage2 = json.loads((OWNED / "stage2-summary.json").read_bytes())
artifacts = []
for name in (
    "review.json", "stage3-comparison.json", "stage3-coverage.json",
    "stage3-bindings.json", "stage3-assessments.json", "validation-receipt.json",
    "validation.stdout.txt", "validation.stderr.txt", "validation-once.claim.json",
    "assemble-stage3.py", "validate-stage3-once.py",
):
    path = OWNED / name
    os.chmod(path, 0o444)
    entry = {"path": str(path), "file_sha256": file_hash(path), "mode": "0444"}
    if path.suffix == ".json":
        entry["canonical_sha256"] = canonical_hash(json.loads(path.read_bytes()))
    artifacts.append(entry)
summary = {
    "schema": "STEMROBIN-182/choice-stage3-summary@1",
    "ticket": "STEMROBIN-182",
    "lesson": "alg7-c4-s3-n46",
    "scope": "Authorized Stage3 only: disclosed author key/rationale/misconception comparison against frozen Stage2. No repeat source solving, view review or image work.",
    "results": {
        "canonical_semantic_outcome": review["outcome"],
        "key_rationale_comparison": comparison["outcome"],
        "coverage_comparison": coverage["outcome"],
        "validation": receipt["outcome"],
        "validation_exit_code": result.returncode,
        "handoff_outcome": "pass" if review["outcome"] == "pass" and receipt["outcome"] == "pass" else "revise",
        "counts": {
            "source_exercises": 10, "source_tasks_reused": 41,
            "question_keys": 26, "option_rationales": 114,
            "incorrect_misconception_paths": 73, "correct_null_misconceptions": 41,
            "figures": 0, "validator_invocations": 1,
        },
        "definite_semantic_defects": [],
    },
    "reuse": {
        "source_tasks": 41, "visible_questions": 26, "option_judgments": 114,
        "source_re_solved": False, "stage2_view_semantics_repeated": False,
        "images_opened": 0, "standalone_structure_validation_repeated": False,
        "snapshot_equality_only": "The disclosed final draft's id/source_numbers/view projection exactly equals the frozen Stage2 projection; semantic checks were copied, not rerun.",
    },
    "comparison_observations": [
        "Every author key and per-option truth equals the frozen independent set; no true set was normalized to the author.",
        "Every false alternative has a concrete stated error that reproduces its offered value, incomplete set or invalid inference. All 41 correct alternatives have null misconceptions.",
        "q14-o1 remains false despite a true opposite-sign conclusion because its stated product -7 omits division by 3; the author refutation agrees.",
        "q16-o1 is a local sign-comparison mistake about 7-5sqrt(2), retaining the correctly computed actual discriminant rather than replacing the radical throughout the equation.",
        "q26-o3's one-sided subtraction, q26-o4's one-sided removal of a square and q26-o5's OR interval operation each produce the displayed nonempty false solution set.",
        "The canonical review directly contains source solutions, gate evidence and per-option mathematics plus incorrect-path checks, without transient paths.",
    ],
    "recognition_capacity_losses_retained": stage2["capacity_losses_for_later_handoff"],
    "historical_process_exceptions": {
        "stage2_disclosure": stage2["process_disclosure"],
        "stage2_verification_failure_and_recovery": stage2["verification"]["technical_recovery"],
        "stage3_author_key_read_authorized_only_after_stage2_parent_receipt": True,
    },
    "validation": receipt,
    "artifacts": artifacts,
    "freeze": {"mode": "0444", "summary_self_hash": "Reported externally after freeze."},
    "not_done": ["DB access", "App edits", "Dependency changes", "Network or model calls", "Git operations", "Other-chat operations", "Source edits", "New images", "Author draft repair"],
    "stop": "Stage3 offline handoff only; no further production or validation rerun authorized.",
}
freeze_json(SUMMARY, summary)
assert all(stat.S_IMODE(Path(item["path"]).stat().st_mode) == 0o444 for item in artifacts)
assert stat.S_IMODE(SUMMARY.stat().st_mode) == 0o444
print(json.dumps({
    "handoff_outcome": summary["results"]["handoff_outcome"],
    "validator_exit_code": result.returncode,
    "validator_invocations": 1,
    "stdout": result.stdout.decode("utf-8", errors="replace"),
    "stderr": result.stderr.decode("utf-8", errors="replace"),
    "review_file_sha256": file_hash(REVIEW),
    "review_canonical_sha256": canonical_hash(review),
    "summary_path": str(SUMMARY),
    "summary_file_sha256": file_hash(SUMMARY),
    "summary_canonical_sha256": canonical_hash(summary),
    "receipt_file_sha256": file_hash(RECEIPT),
    "stdout_sha256": file_hash(STDOUT),
    "stderr_sha256": file_hash(STDERR),
    "mode": "0444",
}, indent=2))
