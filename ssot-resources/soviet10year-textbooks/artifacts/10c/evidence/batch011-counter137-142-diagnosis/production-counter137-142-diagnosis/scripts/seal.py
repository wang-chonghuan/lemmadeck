#!/usr/bin/env python3
"""Verify unchanged inputs and command streams, then seal this owned bundle."""
import hashlib
import json
from pathlib import Path
import sys
from datetime import datetime, timezone

OWNED = Path(__file__).resolve().parents[1]
ROOT = OWNED.parents[4]


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main():
    frozen = json.loads((OWNED / "032-input-freeze-before.stdout").read_text())
    checks = []
    for item in frozen["inputs"]:
        path = Path(item["path"])
        actual = digest(path)
        if actual != item["sha256"]:
            raise SystemExit("Frozen input changed: " + str(path))
        checks.append({"path": str(path), "sha256": actual, "unchanged": True})
    # The initial bootstrap tool call returned an empty stderr stream.
    (OWNED / "000-pwd.stderr").write_bytes(b"")
    for record_path in sorted((OWNED / "commands").glob("*.json")):
        record = json.loads(record_path.read_text())
        if record_path.stem == "000-pwd":
            for stream in ("stdout", "stderr"):
                stream_path = OWNED / record[stream]
                record[stream] = str(stream_path)
                record[stream + "_sha256"] = digest(stream_path)
            record["invocation_argv"] = ["pwd"]
        else:
            record.setdefault("invocation_argv", [
                "python3",
                ".intentfold/tickets/STEMROBIN-184/tmp/production-counter137-142-diagnosis/scripts/run_recorded.py",
                record_path.stem,
                "--",
                *record["argv"],
            ])
        for stream in ("stdout", "stderr"):
            if digest(Path(record[stream])) != record[stream + "_sha256"]:
                raise SystemExit("Recorded stream changed: " + str(record_path))
        record_path.write_text(json.dumps(record, indent=2) + "\n", encoding="ascii")
    report = OWNED / "report.md"
    report_sha = digest(report)
    hashes = OWNED / "hashes"
    hashes.mkdir(exist_ok=True)
    command_path = OWNED / "commands/099-freeze.json"
    if command_path.exists():
        raise SystemExit("Refusing to replace an existing seal")
    timestamp = datetime.now(timezone.utc).isoformat()
    excluded = {hashes / "SHA256SUMS", hashes / "manifest.json"}
    outputs = [
        {"path": str(path), "relative_path": str(path.relative_to(OWNED)),
         "size": path.stat().st_size, "sha256": digest(path)}
        for path in sorted(OWNED.rglob("*")) if path.is_file() and path not in excluded
    ]
    sums = hashes / "SHA256SUMS"
    sums.write_text("".join(
        item["sha256"] + "  " + item["relative_path"] + "\n" for item in outputs
    ), encoding="ascii")
    manifest = hashes / "manifest.json"
    manifest.write_text(json.dumps({
        "status": "FROZEN_WAIT",
        "report_path": str(report),
        "report_sha256": report_sha,
        "inputs_unchanged": checks,
        "outputs": outputs,
        "sha256sums_sha256": digest(sums),
        "seal_command_record": str(command_path),
        "exclusions": [
            "manifest self-hash returned separately; no circular self-hash",
            "099-freeze command and streams are created after manifest hashing and self-record their exact stream hashes plus manifest SHA",
        ],
    }, indent=2) + "\n", encoding="ascii")
    manifest_sha = digest(manifest)
    stdout = (
        f"FROZEN\nreport_sha256 {report_sha}\n"
        f"manifest_sha256 {manifest_sha}\ninput_files_unchanged {len(checks)}\nWAIT\n"
    )
    stdout_path = OWNED / "099-freeze.stdout"
    stderr_path = OWNED / "099-freeze.stderr"
    stdout_path.write_bytes(stdout.encode("ascii"))
    stderr_path.write_bytes(b"")
    command_path.write_text(json.dumps({
        "argv": sys.orig_argv,
        "cwd": str(ROOT),
        "started_utc": timestamp,
        "exit_code": 0,
        "stdout": str(stdout_path),
        "stdout_sha256": digest(stdout_path),
        "stderr": str(stderr_path),
        "stderr_sha256": digest(stderr_path),
        "script_sha256": digest(Path(__file__)),
        "manifest_sha256": manifest_sha,
        "input_integrity": checks,
        "seal_note": "Exact complete command stdout; final self-record and streams are outside the manifest to avoid a recursive digest.",
    }, indent=2) + "\n", encoding="ascii")
    for item in outputs:
        if digest(Path(item["path"])) != item["sha256"]:
            raise SystemExit("Output changed during sealing: " + item["path"])
    # Seal only this task's newly owned files and directories.
    for path in OWNED.rglob("*"):
        if path.is_file():
            path.chmod(0o444)
    for path in sorted(
        [path for path in OWNED.rglob("*") if path.is_dir()],
        key=lambda path: len(path.parts), reverse=True,
    ):
        path.chmod(0o555)
    OWNED.chmod(0o555)
    sys.stdout.write(stdout)


if __name__ == "__main__":
    main()
