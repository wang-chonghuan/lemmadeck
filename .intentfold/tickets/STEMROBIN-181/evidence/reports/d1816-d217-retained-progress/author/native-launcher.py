"""Run unchanged repository tools with scoped cwd and retained subprocess evidence."""
import json
import os
from pathlib import Path
import runpy
import subprocess
import sys
import tempfile
import time

REPO = Path("/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck")
AUTHOR = REPO / ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d217-10p-source74-76-author"
RECEIPTS = Path(os.environ["D217_RECEIPT_DIR"]).resolve()
if Path.cwd() != REPO or not RECEIPTS.is_relative_to(AUTHOR):
    raise SystemExit("D217 cwd/evidence ownership violation")
RECEIPTS.mkdir(parents=True, exist_ok=True)
original_run = subprocess.run
sequence = 0


def scoped_run(command, *args, **kwargs):
    global sequence
    sequence += 1
    name = RECEIPTS / f"subprocess-{sequence:02d}"
    requested_cwd = kwargs.get("cwd")
    kwargs["cwd"] = str(REPO)
    start = time.time()
    result = original_run(command, *args, **kwargs)
    for field in ("stdout", "stderr"):
        value = getattr(result, field)
        if value is not None:
            data = value.encode("utf-8") if isinstance(value, str) else value
            name.with_suffix(f".{field}").write_bytes(data)
    name.with_suffix(".receipt.json").write_text(
        json.dumps({
            "command": list(command),
            "cwd": str(REPO),
            "nativeRequestedCwd": str(requested_cwd) if requested_cwd else None,
            "cwdOnlyOverride": True,
            "startedAtUnix": start,
            "finishedAtUnix": time.time(),
            "exitCode": result.returncode,
        }, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    return result


class RetainedTemporaryDirectory:
    def __init__(self, *args, **kwargs):
        kwargs["dir"] = str(RECEIPTS)
        self.name = tempfile.mkdtemp(*args, **kwargs)

    def __enter__(self):
        return self.name

    def __exit__(self, *args):
        return False


subprocess.run = scoped_run
tempfile.TemporaryDirectory = RetainedTemporaryDirectory
tool = Path(sys.argv[1]).resolve()
allowed = {
    REPO / ".claude/skills/ld-s10y-lesson/tools/p2c.py",
}
if tool not in allowed:
    raise SystemExit("D217 tool outside authorized native stages")
sys.argv = sys.argv[1:]
runpy.run_path(str(tool), run_name="__main__")
