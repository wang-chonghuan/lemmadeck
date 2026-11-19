import datetime
import hashlib
import json
import os
from pathlib import Path
import shlex
import subprocess
import sys

ROOT = Path("/Users/yong/.codex/worktrees/d9b1/lemmadeck")
assert Path.cwd() == ROOT
B = Path(".intentfold/tickets/STEMROBIN-182/tmp/resume182-11")
OWN = B / "n36-choice-review-FIRST"
receipt_path = OWN / "06-validation.json"
stdout_path = OWN / "validate.stdout.log"
stderr_path = OWN / "validate.stderr.log"
log_path = OWN / "validate.log"
assert not any(path.exists() for path in (
    receipt_path, stdout_path, stderr_path, log_path
)), "The FIRST review validator must not run twice"
freeze = json.loads((OWN / "05-review-freeze.json").read_bytes())
review_path = OWN / "review.json"
assert hashlib.sha256(review_path.read_bytes()).hexdigest() == freeze["review_byte_sha256"]
args = [
    "python3",
    ".agents/skills/ld-s10y-choice/scripts/validate.py",
    "--repo", ".",
    "--seed", str(B / "n36-author/seed.json"),
    "--draft", str(B / "n36-author/draft.json"),
    "--review", str(review_path),
]
started = datetime.datetime.now(datetime.timezone.utc).isoformat()
process = subprocess.run(args, cwd=ROOT, capture_output=True, check=False)
finished = datetime.datetime.now(datetime.timezone.utc).isoformat()
for path, data in (
    (stdout_path, process.stdout), (stderr_path, process.stderr)
):
    with path.open("xb") as stream:
        stream.write(data)
log = (
    f"cwd: {ROOT}\ncommand: {shlex.join(args)}\n"
    f"started_at_utc: {started}\nfinished_at_utc: {finished}\n"
    f"exit_code: {process.returncode}\nstdout:\n"
).encode() + process.stdout + b"\nstderr:\n" + process.stderr
with log_path.open("xb") as stream:
    stream.write(log)
record = {
    "stage": "validation",
    "started_at_utc": started,
    "finished_at_utc": finished,
    "cwd": str(ROOT),
    "prior_receipt_byte_sha256": hashlib.sha256(
        (OWN / "05-review-freeze.json").read_bytes()
    ).hexdigest(),
    "command": args,
    "invocation_count": 1,
    "exit_code": process.returncode,
    "stdout": process.stdout.decode("utf-8"),
    "stderr": process.stderr.decode("utf-8"),
    "review_byte_sha256": hashlib.sha256(review_path.read_bytes()).hexdigest(),
    "log_path": str(log_path),
    "log_byte_sha256": hashlib.sha256(log).hexdigest(),
    "stdout_path": str(stdout_path),
    "stdout_byte_sha256": hashlib.sha256(process.stdout).hexdigest(),
    "stderr_path": str(stderr_path),
    "stderr_byte_sha256": hashlib.sha256(process.stderr).hexdigest(),
}
with receipt_path.open("x", encoding="utf-8") as stream:
    json.dump(record, stream, indent=2)
    stream.write("\n")
for path in (receipt_path, stdout_path, stderr_path, log_path):
    os.chmod(path, 0o444)
print(log.decode("utf-8"))
print(json.dumps(record, indent=2))
sys.exit(process.returncode)
