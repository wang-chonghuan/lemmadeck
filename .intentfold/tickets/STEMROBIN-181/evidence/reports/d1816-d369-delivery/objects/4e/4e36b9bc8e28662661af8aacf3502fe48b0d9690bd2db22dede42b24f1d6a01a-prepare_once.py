"""Retain one bounded preparation call; never retry or run downstream stages."""
import hashlib
import json
import os
from pathlib import Path
import signal
import subprocess
import time


REPO = Path("/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck")
EVIDENCE = REPO / ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d360-source395-397-first-author"
WORK = REPO / ".tmp/STEMROBIN-181/d1816-d360/source-work"
PYTHON = REPO / ".claude/skills/ld-s10y-lesson/.venv/bin/python"
TOOL = REPO / ".claude/skills/ld-s10y-lesson/tools/production.py"
COMMAND = [
    str(PYTHON), str(TOOL), "prepare-range", "--repo", str(REPO),
    "--book", "10p", "--first", "395", "--last", "397", "--work", str(WORK),
]


def sha(path):
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def save_once(path, value):
    with path.open("x", encoding="utf-8") as stream:
        json.dump(value, stream, ensure_ascii=False, indent=2)
        stream.write("\n")


def main():
    if Path.cwd().resolve() != REPO:
        raise RuntimeError("cwd must be the exact authorized checkout")
    EVIDENCE.mkdir(parents=True, exist_ok=True)
    stdout = EVIDENCE / "prepare-range.stdout"
    stderr = EVIDENCE / "prepare-range.stderr"
    receipt = {
        "schema": "STEMROBIN-181/prepare-call@1",
        "cwd": str(REPO),
        "command": COMMAND,
        "attempt": 1,
        "timeout_seconds": 240,
        "tool_sha256": sha(TOOL),
        "wrapper_sha256": sha(Path(__file__)),
        "stdout": str(stdout),
        "stderr": str(stderr),
        "started_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    }
    save_once(EVIDENCE / "prepare-call.started.json", receipt)
    start = time.monotonic()
    process = None
    try:
        with stdout.open("xb") as output, stderr.open("xb") as errors:
            process = subprocess.Popen(
                COMMAND, cwd=REPO, stdout=output, stderr=errors,
                env={**os.environ, "PYTHONDONTWRITEBYTECODE": "1"},
                start_new_session=True,
            )
            try:
                receipt["returncode"] = process.wait(timeout=240)
                receipt["status"] = "succeeded" if process.returncode == 0 else "failed"
            except subprocess.TimeoutExpired:
                os.killpg(process.pid, signal.SIGTERM)
                try:
                    process.wait(timeout=5)
                except subprocess.TimeoutExpired:
                    os.killpg(process.pid, signal.SIGKILL)
                    process.wait()
                receipt.update(status="timeout", returncode=process.returncode)
                errors.write(b"\nWrapper timeout after 240 seconds; process group stopped.\n")
    except Exception as error:
        receipt.update(status="failed", error=repr(error), returncode=None)
        if process is not None and process.poll() is None:
            os.killpg(process.pid, signal.SIGKILL)
            process.wait()
        with stderr.open("ab") as errors:
            errors.write((repr(error) + "\n").encode("utf-8"))
    finally:
        receipt["elapsed_seconds"] = round(time.monotonic() - start, 3)
        receipt["finished_at"] = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        receipt["stdout_sha256"] = sha(stdout) if stdout.exists() else None
        receipt["stderr_sha256"] = sha(stderr) if stderr.exists() else None
        save_once(EVIDENCE / "prepare-call.json", receipt)
        print(json.dumps(receipt, ensure_ascii=False, indent=2))
    return 0 if receipt.get("status") == "succeeded" else 1


if __name__ == "__main__":
    raise SystemExit(main())
