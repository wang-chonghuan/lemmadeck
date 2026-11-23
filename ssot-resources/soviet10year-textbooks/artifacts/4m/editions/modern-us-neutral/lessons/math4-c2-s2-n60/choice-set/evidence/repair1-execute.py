"""Capture one official repaired-review validation and affected-only evidence."""

import hashlib
import json
import os
from pathlib import Path
import subprocess
import sys
from datetime import datetime, timezone


ROOT = Path("/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-187")
CHOICES = ROOT / ".tmp/stemrobin-187/n60/choices"
AFFECTED = "n60-lines-angle-record"
MASKED_BEFORE = "ae3de613ac3661d3677c877e874a32820fc95ab5ed8d146bd379599231d86b32"
DRAFT_EXPECTED = "545162caa59dfde90f431f3bf545cf66c8d345f0a871fd909005c2383b27d31a"
FROZEN = {
    "reviewer-source-solutions.md": "f5540bd5bd419573bafcd5b8df717112612195e72b08553e1e5a10601e434c44",
    "reviewer-visible-checks.json": "6ad50eef5c4d7eb6a20b1a697f205806c52b4f6023e0a0d018681c84b4e029c5",
    "reviewer-notes.md": "af3b6e475c928f23d015dc12450467c601cf69a29dcc7a0c8b031e7e33725fb0",
    "repair1-visible-checks.json": "2b20aa064d08662c81abbf3ee7ab4f7f89280bdf2ec3c176b3b108bc7bb2f38e",
}
COMMAND = [
    "python3",
    ".agents/skills/ld-s10y-choice/scripts/validate.py",
    "--repo",
    ".",
    "--seed",
    ".tmp/stemrobin-187/n60/choices/seed.json",
    "--draft",
    ".tmp/stemrobin-187/n60/choices/draft.json",
    "--review",
    ".tmp/stemrobin-187/n60/choices/review.json",
]


def sha256(data):
    return hashlib.sha256(data).hexdigest()


def canonical_digest(value):
    return sha256(
        json.dumps(
            value, sort_keys=True, ensure_ascii=True, separators=(",", ":")
        ).encode("utf-8")
    )


def snapshot(name):
    path = CHOICES / name
    data = path.read_bytes()
    record = {"path": str(path), "sha256": sha256(data), "bytes": len(data)}
    if path.suffix == ".json":
        record["canonical_sha256"] = canonical_digest(json.loads(data))
    return record


def masked_review_digest(review):
    masked = dict(review)
    masked["draft_sha256"] = "AUTHORIZED_REPAIR_FIELD"
    masked["outcome"] = "AUTHORIZED_REPAIR_FIELD"
    masked["source_reviews"] = [
        dict(row, coverage="AUTHORIZED_REPAIR_FIELD")
        if row["source_number"] == "1018"
        else row
        for row in review["source_reviews"]
    ]
    masked["question_reviews"] = [
        {"question_id": row["question_id"], "authorized_affected_review": True}
        if row["question_id"] == AFFECTED
        else row
        for row in review["question_reviews"]
    ]
    return canonical_digest(masked)


def save_new(path, data):
    with path.open("xb") as stream:
        stream.write(data)
    return {"path": str(path), "sha256": sha256(data), "bytes": len(data)}


def json_bytes(value):
    return (json.dumps(value, indent=2) + "\n").encode("utf-8")


if Path.cwd() != ROOT:
    raise SystemExit("Incorrect cwd; official validator not started.")

evidence_path = CHOICES / "repair1-review-evidence.json"
stdout_path = CHOICES / "repair1-review-validator.stdout.txt"
stderr_path = CHOICES / "repair1-review-validator.stderr.txt"
execution_path = CHOICES / "repair1-review-execution.json"
for path in (evidence_path, stdout_path, stderr_path, execution_path):
    if path.exists():
        raise SystemExit(f"Refusing existing repair1 execution output: {path}")

before = {
    name: snapshot(name)
    for name in ("seed.json", "draft.json", "review.json", *FROZEN)
}
for name, expected in FROZEN.items():
    if before[name]["sha256"] != expected:
        raise SystemExit(f"Frozen input mismatch; validator not started: {name}")
if before["draft.json"]["sha256"] != DRAFT_EXPECTED:
    raise SystemExit("Repaired draft bytes mismatch; validator not started.")

review = json.loads((CHOICES / "review.json").read_bytes())
masked_after = masked_review_digest(review)
if masked_after != MASKED_BEFORE:
    raise SystemExit("Review changed outside authorized fields; validator not started.")

draft = json.loads((CHOICES / "draft.json").read_bytes())
projection = json.loads((CHOICES / "repair1-views.json").read_bytes())
unit = next(question for question in draft["questions"] if question["id"] == AFFECTED)
actual_projection = {
    "questions": [{name: unit[name] for name in ("id", "source_numbers", "view")}]
}
if actual_projection != projection:
    raise SystemExit("Affected projection mismatch; validator not started.")

affected_review = next(
    question for question in review["question_reviews"]
    if question["question_id"] == AFFECTED
)
evidence = {
    "stage": "repair1-affected-only",
    "status": "pass",
    "first_review_raw_sha256": "944fe4beba6384551bea9b0cb0ea00c4190a6d3ffba9653582501d0476866af5",
    "repaired_draft": before["draft.json"],
    "working_review": before["review.json"],
    "affected_projection": snapshot("repair1-views.json"),
    "visible_first_freeze": before["repair1-visible-checks.json"],
    "owner_change_check": snapshot("repair1-check.json"),
    "authorized_changes": [
        "draft_sha256",
        "outcome",
        "source_reviews[1018].coverage",
        "question_reviews[n60-lines-angle-record]",
    ],
    "masked_unauthorized_fields_sha256_before": MASKED_BEFORE,
    "masked_unauthorized_fields_sha256_after": masked_after,
    "all_other_review_fields_unchanged": masked_after == MASKED_BEFORE,
    "actual_affected_projection_matches": True,
    "affected_true_set": affected_review["mathematics"]["correct"],
    "affected_option_checks": affected_review["mathematics"]["option_checks"],
    "other_thirteen_questions_resolved_again": False,
    "original_1016_unconditional_status": "HOLD persists",
    "construction_production_limitation": "Written construction recognition does not demonstrate actual drawing, protractor use or accurate construction.",
    "new_images": 0,
    "cumulative_images": 1,
}
evidence_record = save_new(evidence_path, json_bytes(evidence))

environment = os.environ.copy()
environment["PYTHONDONTWRITEBYTECODE"] = "1"
started_at = datetime.now(timezone.utc).isoformat()
result = subprocess.run(
    COMMAND,
    cwd=ROOT,
    env=environment,
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
    check=False,
)
finished_at = datetime.now(timezone.utc).isoformat()
stdout_record = save_new(stdout_path, result.stdout)
stderr_record = save_new(stderr_path, result.stderr)
after = {name: snapshot(name) for name in before}
record = {
    "stage": "repair1",
    "invocations": 1,
    "cwd": str(ROOT),
    "argv": COMMAND,
    "environment_additions": {"PYTHONDONTWRITEBYTECODE": "1"},
    "started_at": started_at,
    "finished_at": finished_at,
    "exit_code": result.returncode,
    "stdout": stdout_record,
    "stderr": stderr_record,
    "affected_review_evidence": evidence_record,
    "inputs_before": before,
    "inputs_after": after,
    "input_bytes_unchanged": {
        name: before[name]["sha256"] == after[name]["sha256"] for name in before
    },
    "frozen_inputs_match_received_hashes": {
        name: after[name]["sha256"] == expected
        for name, expected in FROZEN.items()
    },
    "all_other_review_fields_unchanged": masked_after == MASKED_BEFORE,
    "new_image_loads": 0,
    "cumulative_image_loads": 1,
}
execution_record = save_new(execution_path, json_bytes(record))
print(
    json.dumps(
        {
            "execution": execution_record,
            "evidence": evidence_record,
            "validator_exit_code": result.returncode,
            "stdout": stdout_record,
            "stderr": stderr_record,
            "review": after["review.json"],
            "all_other_review_fields_unchanged": record[
                "all_other_review_fields_unchanged"
            ],
            "input_bytes_unchanged": record["input_bytes_unchanged"],
            "frozen_inputs_match_received_hashes": record[
                "frozen_inputs_match_received_hashes"
            ],
        },
        indent=2,
    ),
    flush=True,
)
if result.stdout:
    sys.stdout.buffer.write(result.stdout)
    sys.stdout.buffer.flush()
if result.stderr:
    sys.stderr.buffer.write(result.stderr)
    sys.stderr.buffer.flush()
raise SystemExit(result.returncode)
