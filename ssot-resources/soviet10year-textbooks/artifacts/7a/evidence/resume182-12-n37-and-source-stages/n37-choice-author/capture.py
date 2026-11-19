"""Keep first command receipts without replacing earlier evidence."""
import hashlib
import json
from pathlib import Path
import subprocess
import sys
from datetime import datetime, timezone

ROOT = Path("/Users/yong/.codex/worktrees/d9b1/lemmadeck")
OUT = ROOT / ".intentfold/tickets/STEMROBIN-182/tmp/resume182-12/n37-choice-author"
name, *command = sys.argv[1:]
receipt = OUT / "receipts" / f"{name}.json"
if Path.cwd() != ROOT or receipt.exists():
    raise SystemExit("Wrong cwd or existing receipt; refusing overwrite")
receipt.parent.mkdir(parents=True, exist_ok=True)
result = subprocess.run(command, cwd=ROOT, capture_output=True, text=True)
data = {
    "command": command, "cwd": str(ROOT),
    "finished_utc": datetime.now(timezone.utc).isoformat(),
    "exit_code": result.returncode, "stdout": result.stdout, "stderr": result.stderr,
}
receipt.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n")
print(json.dumps({"receipt": str(receipt), "sha256": hashlib.sha256(receipt.read_bytes()).hexdigest(), **data}, ensure_ascii=False, indent=2))
raise SystemExit(result.returncode)
