import hashlib
import importlib.util
import json
from pathlib import Path
import subprocess
import sys
import time

ROOT = Path("/Users/yong/.codex/worktrees/stemrobin-184-resume/lemmadeck")
OUT = ROOT / ".tmp/stemrobin-184-resume/n12-answer-runtime"
assert Path.cwd().resolve() == ROOT
assert not OUT.exists(), "Do not replay a completed official finalizer"
OUT.mkdir()
TOOL = ROOT / ".claude/skills/ld-s10y-answer/tools/lesson_answers.py"
spec = importlib.util.spec_from_file_location("n12_official_answers", TOOL)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
original_run = subprocess.run
results = []


def capture_run(command, *args, **kwargs):
    started = time.monotonic_ns()
    result = original_run(command, *args, **kwargs)
    index = len(results) + 1
    stdout = result.stdout or ""
    stderr = result.stderr or ""
    (OUT / f"child-{index}.stdout").write_text(stdout)
    (OUT / f"child-{index}.stderr").write_text(stderr)
    results.append({
        "command": [str(part) for part in command],
        "actual_exit": result.returncode,
        "duration_ns": time.monotonic_ns() - started,
        "stdout": f"child-{index}.stdout",
        "stderr": f"child-{index}.stderr",
        "stdout_sha256": hashlib.sha256(stdout.encode()).hexdigest(),
        "stderr_sha256": hashlib.sha256(stderr.encode()).hexdigest(),
    })
    return result


# Preserve the official return values while retaining its otherwise discarded gate reports.
subprocess.run = capture_run
sys.argv = [str(TOOL), "finalize", "--book", "9c", "--edition",
            "modern-us-neutral", "--lesson", "ana9-c3-s1-n12"]
exit_code = None
failure = None
try:
    exit_code = module.main()
except BaseException as error:
    failure = {"type": type(error).__name__, "message": str(error)}
    raise
finally:
    subprocess.run = original_run
    (OUT / "receipt.json").write_text(json.dumps({
        "schema": "n12-official-answer-finalizer-runtime-custody@1",
        "tool": str(TOOL),
        "tool_sha256": hashlib.sha256(TOOL.read_bytes()).hexdigest(),
        "argv": sys.argv,
        "invocations": 1,
        "official_actual_exit": exit_code,
        "exception": failure,
        "children": results,
        "capture_semantics": "Same official main; original subprocess.run results returned unchanged. Only completed captured stdout/stderr retained; no gate or finalizer replay.",
        "parent_images": "Permanent24/24; zero image opens/payloads.",
    }, indent=2) + "\n")
sys.exit(exit_code)
