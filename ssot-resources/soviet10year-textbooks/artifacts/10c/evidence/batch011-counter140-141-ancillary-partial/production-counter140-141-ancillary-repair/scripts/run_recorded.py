#!/usr/bin/env python3
"""Byte-exact command evidence for the bounded ancillary-row repair."""
import argparse
from datetime import datetime, timezone
import hashlib
import json
from pathlib import Path
import subprocess
import sys

OWNED = Path(__file__).resolve().parents[1]
ROOT = OWNED.parents[4]


def sha(data):
    return hashlib.sha256(data).hexdigest()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("label")
    parser.add_argument("argv", nargs=argparse.REMAINDER)
    args = parser.parse_args()
    argv = args.argv[1:] if args.argv[:1] == ["--"] else args.argv
    if not argv:
        parser.error("command required")
    commands = OWNED / "commands"
    commands.mkdir(exist_ok=True)
    path = commands / (args.label + ".json")
    if path.exists():
        raise SystemExit("Existing command evidence must not be overwritten")
    started = datetime.now(timezone.utc).isoformat()
    result = subprocess.run(argv, cwd=ROOT, capture_output=True, check=False)
    streams = {}
    for name, data in (("stdout", result.stdout), ("stderr", result.stderr)):
        output = OWNED / (args.label + "." + name)
        output.write_bytes(data)
        streams[name] = str(output)
        streams[name + "_sha256"] = sha(data)
    path.write_text(json.dumps({
        "argv": argv, "invocation_argv": sys.orig_argv, "cwd": str(ROOT),
        "started_utc": started, "finished_utc": datetime.now(timezone.utc).isoformat(),
        "exit_code": result.returncode, "runner_sha256": sha(Path(__file__).read_bytes()),
        **streams,
    }, indent=2) + "\n", encoding="ascii")
    sys.stdout.buffer.write(result.stdout)
    sys.stderr.buffer.write(result.stderr)
    return result.returncode


if __name__ == "__main__":
    raise SystemExit(main())
