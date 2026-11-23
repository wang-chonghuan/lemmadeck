"""Capture one unchanged official validator invocation and its actual streams."""

import hashlib
import json
import os
from pathlib import Path
import subprocess
import sys
from datetime import datetime, timezone


ROOT = Path("/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-187")
CHOICES = ROOT / ".tmp/stemrobin-187/n60/choices"
FROZEN = {
    "reviewer-source-solutions.md": "f5540bd5bd419573bafcd5b8df717112612195e72b08553e1e5a10601e434c44",
    "reviewer-visible-checks.json": "6ad50eef5c4d7eb6a20b1a697f205806c52b4f6023e0a0d018681c84b4e029c5",
    "reviewer-notes.md": "af3b6e475c928f23d015dc12450467c601cf69a29dcc7a0c8b031e7e33725fb0",
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


def snapshot(name):
    path = CHOICES / name
    data = path.read_bytes()
    result = {"path": str(path), "sha256": sha256(data), "bytes": len(data)}
    if path.suffix == ".json":
        value = json.loads(data)
        canonical = json.dumps(
            value, sort_keys=True, ensure_ascii=True, separators=(",", ":")
        ).encode("utf-8")
        result["canonical_sha256"] = sha256(canonical)
    return result


def save_new(path, data):
    with path.open("xb") as stream:
        stream.write(data)
    return {"path": str(path), "sha256": sha256(data), "bytes": len(data)}


if Path.cwd() != ROOT:
    raise SystemExit("Incorrect execution cwd; validator not started.")

stdout_path = CHOICES / "stage3-validator.stdout.txt"
stderr_path = CHOICES / "stage3-validator.stderr.txt"
execution_path = CHOICES / "stage3-execution.json"
for path in (stdout_path, stderr_path, execution_path):
    if path.exists():
        raise SystemExit(f"Refusing existing execution file: {path}")

before = {
    name: snapshot(name)
    for name in ("seed.json", "draft.json", "review.json", *FROZEN)
}
for name, expected in FROZEN.items():
    if before[name]["sha256"] != expected:
        raise SystemExit(f"Frozen input mismatch; validator not started: {name}")

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
    "stage": "STAGE3",
    "invocations": 1,
    "cwd": str(ROOT),
    "argv": COMMAND,
    "environment_additions": {"PYTHONDONTWRITEBYTECODE": "1"},
    "started_at": started_at,
    "finished_at": finished_at,
    "exit_code": result.returncode,
    "stdout": stdout_record,
    "stderr": stderr_record,
    "inputs_before": before,
    "inputs_after": after,
    "input_bytes_unchanged": {
        name: before[name]["sha256"] == after[name]["sha256"] for name in before
    },
    "frozen_inputs_match_received_hashes": {
        name: after[name]["sha256"] == expected
        for name, expected in FROZEN.items()
    },
    "new_image_loads": 0,
    "cumulative_image_loads": 1,
}
execution_bytes = (json.dumps(record, indent=2) + "\n").encode("utf-8")
execution_record = save_new(execution_path, execution_bytes)
summary = {
    "execution": execution_record,
    "validator_exit_code": result.returncode,
    "stdout": stdout_record,
    "stderr": stderr_record,
    "input_bytes_unchanged": record["input_bytes_unchanged"],
    "frozen_inputs_match_received_hashes": record[
        "frozen_inputs_match_received_hashes"
    ],
}
print(json.dumps(summary, indent=2), flush=True)
if result.stdout:
    sys.stdout.buffer.write(result.stdout)
    sys.stdout.buffer.flush()
if result.stderr:
    sys.stderr.buffer.write(result.stderr)
    sys.stderr.buffer.flush()
raise SystemExit(result.returncode)
