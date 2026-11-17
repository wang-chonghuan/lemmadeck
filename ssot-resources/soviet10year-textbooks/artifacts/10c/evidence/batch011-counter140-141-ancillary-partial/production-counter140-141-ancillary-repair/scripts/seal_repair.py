#!/usr/bin/env python3
"""Seal the incomplete repair without retrying any proof or native operation."""
from datetime import datetime, timezone
import hashlib
import json
from pathlib import Path
import sys

OWNED = Path(__file__).resolve().parents[1]
ROOT = OWNED.parents[4]


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main():
    before = json.loads((OWNED / "before/inputs.json").read_text())
    immutable = []
    for item in before["inputs"]:
        if not item["immutable"]:
            continue
        actual = sha(Path(item["path"]))
        if actual != item["sha256"]:
            raise SystemExit("Immutable input changed: " + item["path"])
        immutable.append({"path": item["path"], "sha256": actual, "unchanged": True})
    gate = json.loads((OWNED / "proof/gate.json").read_text())
    if sha(Path(gate["layout_path"])) != gate["layout_sha256"]:
        raise SystemExit("Patched layout changed after proof/native execution")
    for record_path in sorted((OWNED / "commands").glob("*.json")):
        record = json.loads(record_path.read_text())
        for stream in ("stdout", "stderr"):
            if sha(Path(record[stream])) != record[stream + "_sha256"]:
                raise SystemExit("Command stream changed: " + str(record_path))
    native = json.loads((OWNED / "native/140-result.json").read_text())
    if native["passed"] or native["lines_printed"] != 19 or native["full_page_count_calls"] != 1:
        raise SystemExit("Report and actual failure disagree")
    if (OWNED / "native/141-attempt.json").exists():
        raise SystemExit("The native fail-and-stop boundary was crossed")
    hashes = OWNED / "hashes"
    hashes.mkdir(exist_ok=True)
    manifest = hashes / "manifest.json"
    sums = hashes / "SHA256SUMS"
    if manifest.exists():
        raise SystemExit("An existing seal cannot be replaced")
    outputs = [{
        "path": str(path), "relative_path": str(path.relative_to(OWNED)),
        "size": path.stat().st_size, "sha256": sha(path),
    } for path in sorted(OWNED.rglob("*"))
        if path.is_file() and path not in (manifest, sums)]
    sums.write_text("".join(
        item["sha256"] + "  " + item["relative_path"] + "\n" for item in outputs
    ), encoding="ascii")
    report_sha = sha(OWNED / "report.md")
    manifest.write_text(json.dumps({
        "status": "STOPPED_NATIVE140_FAILURE_AWAITING_CONSUMPTION",
        "report_sha256": report_sha,
        "baseline_layout_sha256": before["baseline_layout_sha256"],
        "patched_layout_sha256": gate["layout_sha256"],
        "test_before_patch_sha256": before["new_test_authored_before_patch_sha256"],
        "immutable_inputs_unchanged": immutable,
        "proof_cases_passed_once": len(gate["proof_cases"]),
        "native_counts": {"140": {"actual": 19, "expected": 18, "passed": False},
                          "141": {"status": "NOT_RUN_FAIL_AND_STOP"}},
        "outputs": outputs, "sha256sums_sha256": sha(sums),
        "self_record_note": "Final command/streams outside this manifest to avoid circular hashing",
        "ownership": "await parent full-consumption notification before release",
    }, indent=2) + "\n", encoding="ascii")
    manifest_sha = sha(manifest)
    stdout = (
        f"FROZEN_INCOMPLETE_REPAIR\nreport_sha256 {report_sha}\n"
        f"manifest_sha256 {manifest_sha}\nlayout_sha256 {gate['layout_sha256']}\n"
        f"immutable_inputs_unchanged {len(immutable)}\n"
        "native140 FAIL 19 expected18; native141 NOT_RUN\n"
        "WAIT_FOR_PARENT_CONSUMPTION\n"
    )
    stdout_path = OWNED / "099-seal.stdout"
    stderr_path = OWNED / "099-seal.stderr"
    stdout_path.write_bytes(stdout.encode("ascii"))
    stderr_path.write_bytes(b"")
    (OWNED / "commands/099-seal.json").write_text(json.dumps({
        "argv": sys.orig_argv, "cwd": str(ROOT),
        "finished_utc": datetime.now(timezone.utc).isoformat(), "exit_code": 0,
        "stdout": str(stdout_path), "stdout_sha256": sha(stdout_path),
        "stderr": str(stderr_path), "stderr_sha256": sha(stderr_path),
        "script_sha256": sha(Path(__file__)), "manifest_sha256": manifest_sha,
        "no_counter_or_case_rerun": True,
    }, indent=2) + "\n", encoding="ascii")
    for item in outputs:
        if sha(Path(item["path"])) != item["sha256"]:
            raise SystemExit("Owned output changed during seal: " + item["path"])
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
