import datetime
import json
import pathlib
import subprocess
import sys


root = pathlib.Path(__file__).resolve().parent
label, *argv = sys.argv[1:]
started = datetime.datetime.now(datetime.timezone.utc).isoformat()
result = subprocess.run(argv, cwd=pathlib.Path.cwd(), capture_output=True)
finished = datetime.datetime.now(datetime.timezone.utc).isoformat()
for suffix, payload in (("stdout", result.stdout), ("stderr", result.stderr)):
    with (root / f"{label}.{suffix}.txt").open("xb") as stream:
        stream.write(payload)
record = {
    "argv": argv,
    "cwd": str(pathlib.Path.cwd()),
    "started": started,
    "finished": finished,
    "exit_code": result.returncode,
    "stdout_path": str(root / f"{label}.stdout.txt"),
    "stderr_path": str(root / f"{label}.stderr.txt"),
    "stdout": result.stdout.decode("utf-8"),
    "stderr": result.stderr.decode("utf-8"),
}
with (root / f"{label}.command.json").open("x") as stream:
    json.dump(record, stream, ensure_ascii=False, indent=2)
    stream.write("\n")
sys.stdout.buffer.write(result.stdout)
sys.stderr.buffer.write(result.stderr)
sys.exit(result.returncode)
