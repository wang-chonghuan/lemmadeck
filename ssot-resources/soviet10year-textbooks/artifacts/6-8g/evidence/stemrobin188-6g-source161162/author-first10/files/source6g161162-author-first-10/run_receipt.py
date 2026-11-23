import datetime
import hashlib
import json
import os
from pathlib import Path
import subprocess
import sys


REPO = Path("/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck")
OWN = Path(__file__).resolve().parent


def binding(path):
    data = path.read_bytes()
    return {
        "path": str(path),
        "bytes": len(data),
        "sha256": hashlib.sha256(data).hexdigest(),
        "mode": f"{path.stat().st_mode & 0o777:04o}",
    }


def main():
    if Path.cwd() != REPO:
        raise SystemExit("Receipt runner requires the exact repository cwd")
    run_id, *argv = sys.argv[1:]
    if not run_id or not argv or "/" in run_id:
        raise SystemExit("Expected a run ID and explicit argv")
    evidence = OWN / "evidence" / "commands"
    evidence.mkdir(parents=True, exist_ok=True)
    receipt_path = evidence / f"{run_id}.json"
    if receipt_path.exists():
        raise SystemExit("Refusing to repeat a recorded call")
    start = datetime.datetime.now(datetime.timezone.utc).isoformat()
    result = subprocess.run(argv, cwd=REPO, capture_output=True, check=False)
    end = datetime.datetime.now(datetime.timezone.utc).isoformat()
    streams = {}
    for name, data in (("stdout", result.stdout), ("stderr", result.stderr)):
        path = evidence / f"{run_id}.{name}.txt"
        with path.open("xb") as stream:
            stream.write(data)
        os.chmod(path, 0o444)
        streams[name] = binding(path)
    receipt = {
        "schema": "source-author/execution-receipt@1",
        "run_id": run_id,
        "argv": argv,
        "cwd": str(REPO),
        "exit_status": result.returncode,
        "started_at": start,
        "ended_at": end,
        "streams": streams,
        "semantic_approval": False,
    }
    with receipt_path.open("x", encoding="utf-8") as stream:
        json.dump(receipt, stream, ensure_ascii=False, indent=2)
        stream.write("\n")
    os.chmod(receipt_path, 0o444)
    print(json.dumps({"receipt": binding(receipt_path), **receipt}, ensure_ascii=False))
    if result.stdout:
        print(result.stdout.decode("utf-8", errors="replace")[:12000], end="")
    if result.stderr:
        print(result.stderr.decode("utf-8", errors="replace")[:12000], end="", file=sys.stderr)
    return result.returncode


if __name__ == "__main__":
    sys.exit(main())
