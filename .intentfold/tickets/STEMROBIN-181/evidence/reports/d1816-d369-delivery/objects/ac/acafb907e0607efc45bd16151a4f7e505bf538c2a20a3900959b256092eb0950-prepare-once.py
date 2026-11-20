"""Capture the single authorized preparation invocation without retrying it."""
import json
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

repo = Path.cwd().resolve()
evidence = Path(__file__).resolve().parent
receipt = evidence / "prepare-receipt.json"
if receipt.exists() or (evidence / "prepare.stdout").exists():
    raise SystemExit("Preparation receipt already exists; do not repeat.")
command = [
    str(repo / ".claude/skills/ld-s10y-lesson/.venv/bin/python"),
    str(repo / ".claude/skills/ld-s10y-lesson/tools/production.py"),
    "prepare-range", "--repo", ".", "--book", "10p",
    "--first", "389", "--last", "391",
    "--work", ".tmp/STEMROBIN-181/d1816-d331/source-work",
]
started = datetime.now(timezone.utc).isoformat()
result = subprocess.run(command, cwd=repo, capture_output=True, check=False)
(evidence / "prepare.stdout").write_bytes(result.stdout)
(evidence / "prepare.stderr").write_bytes(result.stderr)
record = {
    "schema": "stemrobin181/source-prepare-receipt@1",
    "author": "D331", "cwd": str(repo), "command": command,
    "started_utc": started,
    "finished_utc": datetime.now(timezone.utc).isoformat(),
    "stdout": str(evidence / "prepare.stdout"),
    "stderr": str(evidence / "prepare.stderr"),
    "exitCode": result.returncode, "invocations": 1,
    "note": "Existing production.py performs its internal read-only checkout-root validation; no separate Git command was invoked by the author.",
}
receipt.write_text(json.dumps(record, ensure_ascii=False, indent=2) + "\n")
sys.stdout.buffer.write(result.stdout)
sys.stderr.buffer.write(result.stderr)
print(json.dumps(record, ensure_ascii=False))
raise SystemExit(result.returncode)
