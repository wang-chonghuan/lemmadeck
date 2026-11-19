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
OWN = B / "n36-choice-review-affected"
freeze = json.loads((OWN / "05-review-freeze.json").read_bytes())
disclosure = json.loads((OWN / "04-internal-disclosure.json").read_bytes())
source = json.loads((OWN / "01-source-inheritance.json").read_bytes())


def byte_hash(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def write_once(path, value):
    with path.open("x", encoding="utf-8") as stream:
        json.dump(value, stream, indent=2)
        stream.write("\n")
    os.chmod(path, 0o444)


review_path = OWN / "review.json"
seed_path = B / "n36-choice-repaired/seed.json"
draft_path = B / "n36-choice-repaired/draft.json"
assert byte_hash(review_path) == freeze["review"]["byte_sha256"]
assert byte_hash(seed_path) == source["seed"]["byte_sha256"]
assert byte_hash(draft_path) == disclosure["draft"]["byte_sha256"]
assert byte_hash(B / "n36-choice-review-FIRST/review.json") == "35f58d9c9b25e17f9cef78643147b6579948d4f8de9300b75b69c717778033ed"
assert not any((OWN / name).exists() for name in (
    "validation-invocation.json", "06-validation.json",
    "validate.log", "validate.stdout.log", "validate.stderr.log",
)), "Affected validator may be invoked only once"
args = [
    "python3", ".agents/skills/ld-s10y-choice/scripts/validate.py",
    "--repo", ".",
    "--seed", str(seed_path),
    "--draft", str(draft_path),
    "--review", str(review_path),
]
started = datetime.datetime.now(datetime.timezone.utc).isoformat()
invocation_path = OWN / "validation-invocation.json"
write_once(invocation_path, {
    "started_at_utc": started, "cwd": str(ROOT), "command": args,
    "invocation_count": 1, "repeat_forbidden": True,
    "review_byte_sha256": byte_hash(review_path),
})
process = subprocess.run(args, cwd=ROOT, capture_output=True, check=False)
finished = datetime.datetime.now(datetime.timezone.utc).isoformat()
stdout_path = OWN / "validate.stdout.log"
stderr_path = OWN / "validate.stderr.log"
for path, raw in ((stdout_path, process.stdout), (stderr_path, process.stderr)):
    with path.open("xb") as stream:
        stream.write(raw)
    os.chmod(path, 0o444)
log = (
    f"cwd: {ROOT}\ncommand: {shlex.join(args)}\n"
    f"started_at_utc: {started}\nfinished_at_utc: {finished}\n"
    f"exit_code: {process.returncode}\nstdout:\n"
).encode() + process.stdout + b"\nstderr:\n" + process.stderr
log_path = OWN / "validate.log"
with log_path.open("xb") as stream:
    stream.write(log)
os.chmod(log_path, 0o444)
receipt = {
    "stage": "validation",
    "started_at_utc": started, "finished_at_utc": finished,
    "cwd": str(ROOT),
    "prior_receipt_byte_sha256": byte_hash(OWN / "05-review-freeze.json"),
    "invocation": {"path": str(invocation_path), "byte_sha256": byte_hash(invocation_path)},
    "command": args, "invocation_count": 1,
    "exit_code": process.returncode,
    "stdout": process.stdout.decode("utf-8"),
    "stderr": process.stderr.decode("utf-8"),
    "review_byte_sha256": byte_hash(review_path),
    "seed_byte_sha256": byte_hash(seed_path),
    "draft_byte_sha256": byte_hash(draft_path),
    "new_image_opens": 0,
    "logs": [
        {"path": str(path), "byte_sha256": byte_hash(path)}
        for path in (log_path, stdout_path, stderr_path)
    ],
}
write_once(OWN / "06-validation.json", receipt)
print(log.decode("utf-8"))
print(json.dumps(receipt, indent=2))
sys.exit(process.returncode)
