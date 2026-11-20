import json
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent
script = sys.argv[1]
assert script in ("compare-evidence.py", "bind-inputs.py", "finalize-review.py")
args = sys.argv[2:]
name = script.removesuffix(".py") + ("-" + "-".join(args) if args else "")
cmd = [sys.executable, str(ROOT / script), *args]
started = datetime.now(timezone.utc).isoformat()
call = subprocess.run(cmd, cwd=ROOT.parent.parents[3], capture_output=True, text=True)
record = {
    "schema": "independent-review-call-receipt@1",
    "command": cmd, "cwd": str(ROOT.parent.parents[3]),
    "startedAtUTC": started,
    "finishedAtUTC": datetime.now(timezone.utc).isoformat(),
    "exitCode": call.returncode, "stdout": call.stdout, "stderr": call.stderr,
    "producerOrFormalProjectCheck": False,
}
with (ROOT / f"{name}.command.json").open("x") as out:
    json.dump(record, out, indent=2)
    out.write("\n")
print(call.stdout, end="")
print(call.stderr, end="", file=sys.stderr)
sys.exit(call.returncode)
