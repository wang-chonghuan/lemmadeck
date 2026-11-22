"""Capture the single authorized repair03 WITH REVIEW call without writing files."""

import base64
import datetime
import hashlib
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import time


ROOT = Path("/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck")
OWN = ROOT / ".tmp/stemrobin-184-six/n88-choice-review/semantic-affected02/comparison"
TOOL = ROOT / ".agents/skills/ld-s10y-choice/scripts/validate.py"
BASE_ARGV = [
    "python3",
    str(TOOL),
    "--repo",
    str(ROOT / ".tmp/stemrobin-184-six/n88-choice-source/repo"),
    "--seed",
    str(ROOT / ".tmp/stemrobin-184-six/n88-choice-source/repo/.tmp/stemrobin-184-six/n88-choice-source/repo/.tmp/n88-seed/seed.json"),
    "--draft",
    str(ROOT / ".tmp/stemrobin-184-six/n88-choice-author02/repair03/draft.json"),
]
ARGV = BASE_ARGV + ["--review", str(OWN / "review.json")]


def digest(data):
    return hashlib.sha256(data).hexdigest()


def stream(data):
    return {
        "bytes": len(data),
        "sha256": digest(data),
        "utf8": data.decode("utf-8", errors="strict"),
        "base64": base64.b64encode(data).decode("ascii"),
    }


if Path.cwd() != ROOT:
    raise SystemExit("STOP: incorrect root cwd")
if (OWN / "execution.json").exists():
    raise SystemExit("STOP: execution receipt already exists; no replay")
interpreter = shutil.which(BASE_ARGV[0])
if interpreter != "/Users/yong/.local/bin/python3":
    raise SystemExit("STOP: interpreter differs from structural receipt")
review_bytes = (OWN / "review.json").read_bytes()
if digest(review_bytes) != "a4bfcf305edc13f86e62c24ba7fdc9da83fc315225a332515929bfc02f366864":
    raise SystemExit("STOP: review binding differs")
tool_bytes = TOOL.read_bytes()
runner_bytes = Path(__file__).read_bytes()
env = os.environ.copy()
env["PYTHONDONTWRITEBYTECODE"] = "1"
started = datetime.datetime.now(datetime.timezone.utc).isoformat()
clock = time.perf_counter()
result = subprocess.run(
    ARGV,
    executable=interpreter,
    cwd=ROOT,
    env=env,
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
    check=False,
)
elapsed = time.perf_counter() - clock
finished = datetime.datetime.now(datetime.timezone.utc).isoformat()
receipt = {
    "schema": "n88-repair03-first-withreview-execution-v1",
    "cwd": str(ROOT),
    "base_structural_argv": BASE_ARGV,
    "argv": ARGV,
    "argv_change": "append --review and new owned review path only",
    "base_structural_receipt": {
        "path": str(ROOT / ".tmp/stemrobin-184-six/n88-choice-author02/repair03/first-structural-execution.json"),
        "sha256_previously_measured": "d0b1b35b605e1e8b52965d068e7eae9983b39ec5ca97eab070dccbcef1ba32d5",
        "actual_exit": 0,
        "replayed": False,
    },
    "resolved_interpreter": interpreter,
    "resolved_interpreter_realpath": str(Path(interpreter).resolve()),
    "runner_interpreter": sys.executable,
    "runner_python_version": sys.version,
    "tool": {"path": str(TOOL), "bytes": len(tool_bytes), "sha256": digest(tool_bytes)},
    "runner": {"path": str(Path(__file__)), "bytes": len(runner_bytes), "sha256": digest(runner_bytes)},
    "environment_override": {"PYTHONDONTWRITEBYTECODE": "1"},
    "review": {
        "path": str(OWN / "review.json"),
        "bytes": len(review_bytes),
        "sha256": digest(review_bytes),
        "canonical_sha256": "f6c02f4fe90db881b19d44209d4b5468c7ee13293225def9a85484af1cfa11bd",
    },
    "draft": {
        "path": BASE_ARGV[7],
        "bytes_previously_measured": 112278,
        "byte_sha256_previously_measured": "e9302682010ee45a932313c75c8cadc7c26fbe1e2bf9706462e26bf39cff2d16",
        "canonical_sha256_previously_measured": "a8e6f7ea8dfd8753f27802473a92e4ccc24585487f5a18e71c7a25448ab92052",
    },
    "seed_canonical_sha256": "30115b36ab2c48c291b2801fd805665a9fd57991028ec75a16f5825ac1c92896",
    "started_at_utc": started,
    "finished_at_utc": finished,
    "elapsed_seconds": elapsed,
    "exit_code": result.returncode,
    "stdout": stream(result.stdout),
    "stderr": stream(result.stderr),
    "process_state": "validator_exited",
    "first_repair03_withreview_invocation_count": 1,
    "retry_count": 0,
    "failure_preserved": result.returncode != 0,
    "dependents_stopped_on_failure": result.returncode != 0,
    "mechanical_result_not_semantic_proof": True,
}
print(json.dumps(receipt, ensure_ascii=True, indent=2))
raise SystemExit(result.returncode)
