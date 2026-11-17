#!/usr/bin/env python3
"""Record read-only diagnostic commands and their byte-exact output."""
import argparse
import hashlib
import json
import os
from pathlib import Path
import subprocess
import sys
from datetime import datetime, timezone

OWNED = Path(__file__).resolve().parents[1]
ROOT = OWNED.parents[4]


def sha256(data):
    return hashlib.sha256(data).hexdigest()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("label")
    parser.add_argument("argv", nargs=argparse.REMAINDER)
    args = parser.parse_args()
    argv = args.argv
    if argv and argv[0] == "--":
        argv = argv[1:]
    if not argv:
        parser.error("a command is required")
    command_dir = OWNED / "commands"
    command_dir.mkdir(exist_ok=True)
    record_path = command_dir / (args.label + ".json")
    if record_path.exists():
        raise SystemExit("Refusing to replace existing record: " + str(record_path))
    started = datetime.now(timezone.utc).isoformat()
    result = subprocess.run(argv, cwd=ROOT, capture_output=True, check=False)
    stdout_path = OWNED / (args.label + ".stdout")
    stderr_path = OWNED / (args.label + ".stderr")
    stdout_path.write_bytes(result.stdout)
    stderr_path.write_bytes(result.stderr)
    record = {
        "argv": argv,
        "invocation_argv": sys.orig_argv,
        "runner_executable": sys.executable,
        "cwd": str(ROOT),
        "started_utc": started,
        "finished_utc": datetime.now(timezone.utc).isoformat(),
        "exit_code": result.returncode,
        "stdout": str(stdout_path),
        "stdout_sha256": sha256(result.stdout),
        "stderr": str(stderr_path),
        "stderr_sha256": sha256(result.stderr),
        "runner_sha256": sha256(Path(__file__).read_bytes()),
    }
    record_path.write_text(json.dumps(record, indent=2) + "\n", encoding="ascii")
    sys.stdout.buffer.write(result.stdout)
    sys.stderr.buffer.write(result.stderr)
    return result.returncode


if __name__ == "__main__":
    raise SystemExit(main())
