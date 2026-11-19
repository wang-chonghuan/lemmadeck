import hashlib
import json
from pathlib import Path
import subprocess
import sys


REPO = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
AUTHOR = REPO / ".intentfold/tickets/STEMROBIN-181/tmp/d1273-source274277-first-author"
WORK = REPO / ".intentfold/tickets/STEMROBIN-181/tmp/d1271-source274277-first-preparation/work"
PYTHON = REPO / ".claude/skills/ld-s10y-lesson/.venv/bin/python"
TOOL = REPO / ".claude/skills/ld-s10y-lesson/tools/p2c.py"


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


page = int(sys.argv[1])
if page not in (274, 275, 276, 277) or Path.cwd() != REPO:
    raise SystemExit("Wrong page or cwd")
pdir = AUTHOR / "root/10p/pages" / f"{page:04d}"
calls = pdir / "native"
calls.mkdir(exist_ok=True)
attempt = len(list(calls.glob("*.receipt.json"))) + 1
prefix = f"finalize.{attempt:04d}"
input_path = calls / f"{prefix}.input.md"
stdout_path = calls / f"{prefix}.stdout"
stderr_path = calls / f"{prefix}.stderr"
input_path.write_bytes((pdir / "page.md").read_bytes())
command = [
    str(PYTHON), str(TOOL), "finalize", "--book", "10p", "--page", str(page),
    "--root", str(AUTHOR / "root"), "--work", str(WORK),
]
result = subprocess.run(command, cwd=REPO, capture_output=True)
stdout_path.write_bytes(result.stdout)
stderr_path.write_bytes(result.stderr)
outputs = {}
for name in ("page.md", "page.json", "audit.json"):
    path = pdir / name
    if path.exists():
        snapshot = calls / f"finalize.{attempt:04d}.output.{name}"
        snapshot.write_bytes(path.read_bytes())
        outputs[name] = {"path": str(snapshot), "sha256": sha(snapshot)}
receipt = {
    "cwd": str(REPO), "argv": command, "returncode": result.returncode,
    "input_sha256": sha(input_path),
    "stdout_sha256": sha(stdout_path),
    "stderr_sha256": sha(stderr_path),
    "tool_sha256": sha(TOOL), "outputs": outputs,
}
(calls / f"{prefix}.receipt.json").write_text(
    json.dumps(receipt, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
)
print(result.stdout.decode(), end="")
print(result.stderr.decode(), end="", file=sys.stderr)
print(json.dumps({"page": page, "attempt": attempt, "returncode": result.returncode}))
raise SystemExit(result.returncode)
