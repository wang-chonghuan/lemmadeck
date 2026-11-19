import datetime
import hashlib
import json
from pathlib import Path
import subprocess
import sys


REPO = Path("/Users/yong/.codex/worktrees/stemrobin-184-resume/lemmadeck")
ROOT = REPO / ".tmp/stemrobin-184-resume/n13-source57-count-diagnosis"


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main():
    if Path.cwd() != REPO:
        raise RuntimeError("Wrong cwd")
    marker = ROOT / "INVOCATION.json"
    command = [
        ".claude/skills/ld-s10y-lesson/.venv/bin/python",
        ".tmp/stemrobin-184-resume/n13-source57-count-diagnosis/diagnose.py",
    ]
    started = datetime.datetime.now(datetime.timezone.utc).isoformat()
    with marker.open("x", encoding="utf-8") as handle:
        json.dump({"command": command, "cwd": str(REPO), "startedUtc": started,
                   "scope": "read-only unchanged counting API; no finalizer"},
                  handle, indent=2)
        handle.write("\n")
    result = subprocess.run(command, cwd=REPO, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    stdout = ROOT / "diagnostic.stdout.txt"
    stderr = ROOT / "diagnostic.stderr.txt"
    stdout.write_bytes(result.stdout)
    stderr.write_bytes(result.stderr)
    (ROOT / "diagnostic.exit.txt").write_text(str(result.returncode) + "\n", encoding="ascii")
    receipt = {
        "command": command, "cwd": str(REPO), "startedUtc": started,
        "endedUtc": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "exitCode": result.returncode,
        "stdout": {"path": str(stdout), "sha256": sha(stdout), "bytes": len(result.stdout)},
        "stderr": {"path": str(stderr), "sha256": sha(stderr), "bytes": len(result.stderr)},
        "diagnoseScriptSha256": sha(ROOT / "diagnose.py"),
        "captureScriptSha256": sha(ROOT / "capture_diagnostic.py"),
        "newImages": 0, "canonicalEdits": 0, "finalizerInvocations": 0,
    }
    (ROOT / "diagnostic-receipt.json").write_text(
        json.dumps(receipt, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(receipt, indent=2))
    if result.returncode:
        sys.stdout.buffer.write(result.stdout)
        sys.stderr.buffer.write(result.stderr)
    else:
        data = json.loads(result.stdout)
        print(json.dumps({
            "nativeBandCount": data["nativeBandCount"],
            "blockPrintedLines": data["blockPrintedLines"],
            "nativeBands": data["nativeBands"],
            "roiComponents": [c for c in data["roiComponents"] if c["inkPixels"] >= 10],
        }, ensure_ascii=False, indent=2))
    return result.returncode


if __name__ == "__main__":
    sys.exit(main())
