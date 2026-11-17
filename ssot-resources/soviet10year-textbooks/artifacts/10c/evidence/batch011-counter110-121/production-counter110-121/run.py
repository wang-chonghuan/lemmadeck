import datetime
import json
import subprocess
import sys

from diagnose import OUT, ROOT

label, *command = sys.argv[1:]
path = OUT / "commands" / label
if path.exists():
    raise RuntimeError(f"Refuse to overwrite command record {path}")
path.mkdir(parents=True)
started = datetime.datetime.now(datetime.timezone.utc).isoformat()
result = subprocess.run(command, cwd=ROOT, capture_output=True)
(path / "stdout.txt").write_bytes(result.stdout)
(path / "stderr.txt").write_bytes(result.stderr)
(path / "command.json").write_text(json.dumps({
    "command": command, "cwd": str(ROOT), "started": started,
    "ended": datetime.datetime.now(datetime.timezone.utc).isoformat(),
    "exit_code": result.returncode,
}, indent=2) + "\n")
sys.stdout.buffer.write(result.stdout)
sys.stderr.buffer.write(result.stderr)
sys.exit(result.returncode)
