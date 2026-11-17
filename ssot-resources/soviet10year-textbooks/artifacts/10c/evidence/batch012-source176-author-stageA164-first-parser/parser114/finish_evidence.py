"""Finish from retained focused streams plus new boundary-only checks."""
import json
import subprocess
import sys
from datetime import datetime, timezone

import evidence as E
from check_heading import REPRODUCTION, SOURCE_TITLE, TOC, walk


def main():
    baseline = json.loads((E.HERE / "baseline.json").read_text(encoding="ascii"))
    first_command = json.loads((E.HERE / "focused.command.json").read_text(encoding="ascii"))
    assert first_command["exit"] == 1
    assert first_command["script_sha256"] == E.sha(E.HERE / "check_heading.py")
    assert first_command["production_sha256"] == E.sha(E.PRODUCTION)
    assert "AssertionError: negative-wrong-triangle/match:" in (
        E.HERE / "focused.stderr.txt").read_text(encoding="ascii")
    rows = [
        json.loads(line)
        for line in (E.HERE / "focused.stdout.txt").read_text(encoding="ascii").splitlines()
    ]
    completed, failed = rows[:-1], rows[-1]
    assert len(completed) == 110
    assert all(row["expected"] == row["observed"] for row in completed)
    assert len({row["case"] for row in completed}) == 55
    assert failed["case"] == "negative-wrong-triangle" and failed["expected"] is None
    assert failed["observed"] == ["23", r"$\blacktriangle$. Title"]
    assert E.protected_hashes() == baseline["protected_sha256"], "immutable file drift"
    before = (E.HERE / "assemble.before.py.txt").read_text(encoding="utf-8")
    after = E.PRODUCTION.read_text(encoding="utf-8")
    assert E.without_pattern(before) == E.without_pattern(after), "non-parser code changed"
    command = [sys.executable, "-B", str(E.HERE / "check_boundary.py")]
    started = datetime.now(timezone.utc).isoformat()
    run = subprocess.run(command, cwd=E.ROOT, capture_output=True, check=False)
    for stream, content in (("stdout", run.stdout), ("stderr", run.stderr)):
        path = E.HERE / f"boundary.{stream}.txt"
        assert not path.exists()
        path.write_bytes(content)
    E.save_json("boundary.command.json", {
        "argv": command, "cwd": str(E.ROOT), "started_utc": started,
        "finished_utc": datetime.now(timezone.utc).isoformat(), "exit": run.returncode,
        "expected_exit": 0, "script_sha256": E.sha(E.HERE / "check_boundary.py"),
        "production_sha256": E.sha(E.PRODUCTION),
    })
    print(f"boundary: actual command exit={run.returncode}; expected=0")
    assert run.returncode == 0
    toc_matches = [
        item for item in walk(json.loads(TOC.read_text(encoding="utf-8")))
        if item.get("title") == SOURCE_TITLE
        and str(item.get("printedNumber")) == REPRODUCTION[2][0]
    ]
    assert len(toc_matches) == 1
    card = toc_matches[0]
    assert E.protected_hashes() == baseline["protected_sha256"], "immutable file drift"
    E.save_json("result.json", {
        "scope": "bounded regex recognition only; not lesson/full-book acceptance",
        "production_before_sha256": baseline["production_sha256"],
        "production_after_sha256": E.sha(E.PRODUCTION),
        "layout_sha256": E.sha(E.LAYOUT),
        "protected_sha256": baseline["protected_sha256"],
        "protected_files_unchanged": True, "non_SEC_NUM_AST_unchanged": True,
        "retained_successful_cases": 55, "retained_successful_match_assertions": 110,
        "new_boundary_cases": 2, "new_boundary_match_assertions": 4,
        "first_focused_exit": 1, "boundary_exit": run.returncode,
        "corrected_test_expectation": (
            "The first final negative wrongly rejected math in title after a valid "
            "whitespace separator. Production keeps this title unchanged; only the "
            "new expectation is corrected. The 55 successful cases were not rerun."
        ),
        "toc_entry": {key: card[key] for key in ("id", "title", "printedNumber", "page")},
        "toc_derivation": "unique supplied literal title + printedNumber, not slug",
        "old_tests_run": False, "source_or_assembly_operations_run": False,
        "model_images": 0,
        "invocation": {"argv": [sys.executable, "-B", str(E.HERE / "finish_evidence.py")],
                       "cwd": str(E.ROOT)},
    })
    complete = (E.HERE / "assemble.diff").read_text(encoding="utf-8")
    for name in ("check_heading.py", "evidence.py", "check_boundary.py",
                 "finish_evidence.py", "README.md"):
        text = (E.HERE / name).read_text(encoding="utf-8")
        complete += "".join(E.difflib.unified_diff(
            [], text.splitlines(keepends=True), fromfile="/dev/null",
            tofile=str((E.HERE / name).relative_to(E.ROOT)),
        ))
    assert not (E.HERE / "complete.diff").exists()
    (E.HERE / "complete.diff").write_text(complete, encoding="utf-8")
    hashes = {str(path.relative_to(E.HERE)): E.sha(path)
              for path in sorted(E.HERE.rglob("*")) if path.is_file()}
    E.save_json("freeze.json", {"algorithm": "sha256", "files": hashes,
                              "excluded_self": "freeze.json"})
    print(f"finished: parser={E.sha(E.PRODUCTION)}; freeze.json={E.sha(E.HERE / 'freeze.json')}")


if __name__ == "__main__":
    main()
