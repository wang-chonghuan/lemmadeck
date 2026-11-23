"""Offline execution receipts for this source-author assignment only."""
import hashlib
import json
import os
from pathlib import Path
import subprocess
import sys
from datetime import datetime, timezone

ROOT = Path(__file__).resolve().parent
REPO = ROOT.parents[4]


def digest(path):
    with path.open("rb") as stream:
        return hashlib.file_digest(stream, "sha256").hexdigest()


def save(path, value):
    with path.open("x", encoding="utf-8") as stream:
        json.dump(value, stream, ensure_ascii=False, indent=2)
        stream.write("\n")


def main():
    if Path.cwd().resolve() != REPO:
        raise SystemExit("Wrong checkout cwd")
    mode, name, *args = sys.argv[1:]
    if mode == "freeze":
        entries = []
        for item in args:
            path = Path(item).resolve()
            if not path.is_relative_to(ROOT):
                raise SystemExit("Freeze outside owned root")
            path.chmod(0o444)
            stat = path.stat()
            entries.append({
                "path": str(path), "sha256": digest(path),
                "stat": {"mode": oct(stat.st_mode & 0o777), "size": stat.st_size,
                         "mtime_ns": stat.st_mtime_ns, "ctime_ns": stat.st_ctime_ns,
                         "inode": stat.st_ino},
            })
        value = {"cwd": str(Path.cwd()), "argv": sys.argv,
                 "frozen_at": datetime.now(timezone.utc).isoformat(),
                 "exitCode": 0, "files": entries}
        save(ROOT / f"{name}.FIRSTlock.json", value)
        print(json.dumps(value, ensure_ascii=False, indent=2))
        return 0
    if mode != "run" or not args:
        raise SystemExit("Usage: receipt.py run NAME EXEC ARGS; freeze NAME FILES")
    stdout = ROOT / f"{name}.stdout"
    stderr = ROOT / f"{name}.stderr"
    started = datetime.now(timezone.utc).isoformat()
    with stdout.open("xb") as output, stderr.open("xb") as errors:
        completed = subprocess.run(args, cwd=REPO, stdout=output, stderr=errors,
                                   check=False)
    value = {
        "cwd": str(Path.cwd()), "argv": args, "exitCode": completed.returncode,
        "started_at": started, "ended_at": datetime.now(timezone.utc).isoformat(),
        "streams": {
            "stdout": {"path": str(stdout), "sha256": digest(stdout),
                       "bytes": stdout.stat().st_size},
            "stderr": {"path": str(stderr), "sha256": digest(stderr),
                       "bytes": stderr.stat().st_size},
        },
    }
    save(ROOT / f"{name}.receipt.json", value)
    print(json.dumps(value, ensure_ascii=False, indent=2))
    return completed.returncode


if __name__ == "__main__":
    sys.exit(main())
