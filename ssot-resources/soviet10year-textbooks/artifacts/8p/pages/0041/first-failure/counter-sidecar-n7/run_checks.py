import argparse
import hashlib
import json
from pathlib import Path
import os
import subprocess
import sys

from diagnose import ROOT, SCRATCH, load_layout, page_input
from test_counter import REQUIRED_ROWS, SUSPECT_ROWS


def main():
    if Path.cwd() != ROOT:
        raise SystemExit("Unexpected working directory")
    parser = argparse.ArgumentParser()
    parser.add_argument("--layout", required=True)
    parser.add_argument("--label", required=True)
    args = parser.parse_args()
    destination = SCRATCH / args.label
    destination.mkdir()
    layout_path = ROOT / args.layout
    snapshots = {}
    for name, source in (
        ("layout.py", layout_path),
        ("test_counter.py", SCRATCH / "test_counter.py"),
        ("run_checks.py", Path(__file__)),
    ):
        data = source.read_bytes()
        with (destination / name).open("xb") as stream:
            stream.write(data)
        snapshots[name] = hashlib.sha256(data).hexdigest()
    layout = load_layout(destination / "layout.py")
    ink, width, _, _ = page_input()
    controls = {
        "actual_required_rows": list(REQUIRED_ROWS),
        "original": layout.line_bands(ink, width),
        "actual_pixel_row_deletions": [],
        "margin_pixel_deletions": [],
    }
    for first, last in REQUIRED_ROWS:
        control = ink.copy()
        control[first:last + 1] = False
        bands = layout.line_bands(control, width)
        controls["actual_pixel_row_deletions"].append({
            "deleted": [first, last], "required_count": 18,
            "actual_count": len(bands), "bands": bands,
        })
    for regions in ((SUSPECT_ROWS[0],), (SUSPECT_ROWS[1],), SUSPECT_ROWS):
        control = ink.copy()
        for first, last in regions:
            control[first - 4:last + 4] = False
        bands = layout.line_bands(control, width)
        controls["margin_pixel_deletions"].append({
            "deleted": regions, "required_count": 19,
            "actual_count": len(bands), "bands": bands,
        })
    with (destination / "controls.json").open("x") as stream:
        json.dump(controls, stream, indent=2)
        stream.write("\n")
    command = [sys.executable, str(destination / "test_counter.py")]
    env = dict(os.environ, PYTHONDONTWRITEBYTECODE="1",
               COUNTER_LAYOUT=str(destination / "layout.py"),
               PYTHONPATH=str(SCRATCH))
    run = subprocess.run(command, cwd=ROOT, env=env, capture_output=True)
    for name, data in (("stdout", run.stdout), ("stderr", run.stderr)):
        with (destination / f"test.{name}").open("xb") as stream:
            stream.write(data)
    receipt = {
        "role": "counter candidate test; no finalize or source approval",
        "cwd": str(ROOT), "argv": command, "exit_code": run.returncode,
        "layout_sha256": snapshots["layout.py"],
        "snapshot_sha256": snapshots,
        "lines_printed": len(controls["original"]), "required_rows": 19,
        "pixel_deletion_control_count": len(REQUIRED_ROWS),
        "margin_deletion_control_count": 3,
        "stdout": str(destination / "test.stdout"),
        "stderr": str(destination / "test.stderr"),
    }
    with (destination / "receipt.json").open("x") as stream:
        json.dump(receipt, stream, indent=2)
        stream.write("\n")
    print(json.dumps(receipt, indent=2))
    print(run.stderr.decode(), end="")
    return run.returncode


if __name__ == "__main__":
    raise SystemExit(main())
