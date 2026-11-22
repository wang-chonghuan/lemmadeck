"""Capture one S4 native finalization without changing shared tool behavior."""

import contextlib
import hashlib
import io
import json
import os
from pathlib import Path
import subprocess
import sys
import traceback

REPO = Path("/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck")
OWN = REPO / ".intentfold/tickets/STEMROBIN-188/tmp/appendix-s4-finish-01"
RECEIPTS = OWN / "receipts"
TOOLS = REPO / ".claude/skills/ld-s10y-lesson/tools"
WORK = REPO / ".intentfold/tickets/STEMROBIN-188/tmp/appendix-s4-source-repair-02/work"

assert Path.cwd() == REPO
assert not (RECEIPTS / "adapt-finalize-native.command.json").exists()
sys.path.insert(0, str(TOOLS))
import edition


def save(name, value):
    target = RECEIPTS / name
    data = value if isinstance(value, str) else json.dumps(value, indent=2) + "\n"
    with target.open("x", encoding="utf-8") as handle:
        handle.write(data)
    target.chmod(0o444)
    return {
        "path": str(target),
        "sha256": hashlib.sha256(target.read_bytes()).hexdigest(),
    }


requests = []
completed = []


def guard(event, values):
    if event != "subprocess.Popen":
        return
    executable, argv, requested_cwd, _ = values
    effective = Path(requested_cwd or os.getcwd()).resolve()
    requests.append({
        "executable": str(executable), "argv": list(argv),
        "requestedCwd": str(effective), "allowed": effective == REPO,
    })
    if effective != REPO:
        raise RuntimeError("NESTED_CWD_BLOCKED: " + str(effective))


def capture(frame, event, result):
    if (
        event != "return"
        or frame.f_code.co_name != "run"
        or Path(frame.f_code.co_filename).resolve() != Path(subprocess.__file__).resolve()
        or not isinstance(result, subprocess.CompletedProcess)
    ):
        return
    index = len(completed) + 1
    streams = {}
    for name in ("stdout", "stderr"):
        text = getattr(result, name)
        if text is not None:
            if isinstance(text, bytes):
                text = text.decode("utf-8")
            streams[name] = save(f"nested-{index:02d}.{name}", text)
    completed.append({
        "argv": result.args, "exitCode": result.returncode,
        "cwd": str(Path(frame.f_locals.get("kwargs", {}).get("cwd") or os.getcwd()).resolve()),
        "streams": streams, "capturedStreams": len(streams) == 2,
    })


argv = [
    str(TOOLS / "edition.py"), "finalize", "--book", "9-10g",
    "--edition", "modern-us-neutral", "--lesson", "geo910-appendix-s4",
    "--root", str(REPO / "ssot-resources/soviet10year-textbooks/artifacts"),
    "--work", str(WORK),
]
sys.argv = argv
sys.addaudithook(guard)
stdout, stderr = io.StringIO(), io.StringIO()
exception = None
with contextlib.redirect_stdout(stdout), contextlib.redirect_stderr(stderr):
    sys.setprofile(capture)
    try:
        status = edition.main()
    except BaseException as error:
        status = error.code if isinstance(error, SystemExit) and isinstance(error.code, int) else 1
        exception = {"type": type(error).__name__, "message": str(error)}
        traceback.print_exc()
    finally:
        sys.setprofile(None)
receipt = {
    "command": sys.executable, "argv": [str(Path(__file__).resolve())],
    "cwd": str(REPO), "entry": "edition.main", "nativeArgv": argv,
    "exitCode": status, "exception": exception,
    "streams": {
        "stdout": save("adapt-finalize-native.stdout", stdout.getvalue()),
        "stderr": save("adapt-finalize-native.stderr", stderr.getvalue()),
    },
    "nestedRequests": requests, "nestedCompleted": completed,
    "sharedToolsModifiedOrMonkeypatched": False,
}
binding = save("adapt-finalize-native.command.json", receipt)
print(json.dumps({"status": status, "nativeReceipt": binding}))
raise SystemExit(status)
