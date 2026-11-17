"""Capture bounded command evidence and byte hashes inside this new scratch only."""
import argparse
import ast
import difflib
import hashlib
import json
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[4]
PRODUCTION = ROOT / ".claude/skills/ld-s10y-lesson/tools/assemble.py"
LAYOUT = ROOT / ".claude/skills/ld-s10y-lesson/tools/layout.py"
TOC = ROOT / "ssot-resources/soviet10year-textbooks/toc/10c/zh.json"
BOOK = ROOT / "ssot-resources/soviet10year-textbooks/artifacts/10c"
INITIAL = BOOK / "evidence/batch012-source164-affected168-first114-assembly/assembly114-initial"
FROZEN_LAYOUT = "899ea25c2ede96a1f8c60eec3b5565e22f967e2c345d34d8255a11dc21d88a73"
ENTRY_PRODUCTION = "c07b159fa5e9ddb07a79763e66de6cf454922aab509501f7b70b66f2a83eb0dd"


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def save_json(name, value):
    path = HERE / name
    assert not path.exists(), f"refuse to overwrite evidence: {path}"
    path.write_text(json.dumps(value, indent=2, sort_keys=True) + "\n", encoding="ascii")


def protected_hashes():
    paths = [LAYOUT, TOC]
    for page in range(168, 172):
        directory = BOOK / f"pages/{page:04d}"
        assert directory.is_dir(), f"missing immutable page: {directory}"
        page_files = [path for path in directory.rglob("*") if path.is_file()]
        assert page_files, f"empty immutable page: {directory}"
        paths.extend(page_files)
    assert INITIAL.is_dir(), "retained initial assembly missing"
    paths.extend(path for path in INITIAL.rglob("*") if path.is_file())
    hashes = {str(path.relative_to(ROOT)): sha(path) for path in sorted(paths)}
    assert hashes[str(LAYOUT.relative_to(ROOT))] == FROZEN_LAYOUT, "layout freeze mismatch"
    return hashes


def capture(phase, expected_exit):
    command = [sys.executable, "-B", str(HERE / "check_heading.py"), "--phase", phase]
    started = datetime.now(timezone.utc).isoformat()
    result = subprocess.run(command, cwd=ROOT, capture_output=True, check=False)
    for stream, content in (("stdout", result.stdout), ("stderr", result.stderr)):
        path = HERE / f"{phase}.{stream}.txt"
        assert not path.exists(), f"refuse to overwrite command stream: {path}"
        path.write_bytes(content)
    save_json(f"{phase}.command.json", {
        "argv": command, "cwd": str(ROOT), "started_utc": started,
        "finished_utc": datetime.now(timezone.utc).isoformat(),
        "exit": result.returncode, "expected_exit": expected_exit,
        "stdout_path": str(HERE / f"{phase}.stdout.txt"),
        "stderr_path": str(HERE / f"{phase}.stderr.txt"),
        "production_sha256": sha(PRODUCTION),
        "script_sha256": sha(HERE / "check_heading.py"),
    })
    print(f"{phase}: actual command exit={result.returncode}; expected={expected_exit}")
    assert result.returncode == expected_exit, f"unexpected {phase} exit"
    if phase == "reproduce":
        assert b"AssertionError: reported-header/match:" in result.stderr


def without_pattern(text):
    module = ast.parse(text)
    module.body = [
        node for node in module.body
        if not (isinstance(node, ast.Assign)
                and any(isinstance(target, ast.Name) and target.id == "SEC_NUM"
                        for target in node.targets))
    ]
    return ast.dump(module, include_attributes=False)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("phase", choices=("baseline", "reproduce", "finish"))
    args = parser.parse_args()
    if args.phase == "baseline":
        assert sha(PRODUCTION) == ENTRY_PRODUCTION, "production changed since inspection"
        snapshot = HERE / "assemble.before.py.txt"
        assert not snapshot.exists()
        snapshot.write_bytes(PRODUCTION.read_bytes())
        save_json("baseline.json", {
            "time_utc": datetime.now(timezone.utc).isoformat(),
            "production_sha256": sha(PRODUCTION),
            "protected_sha256": protected_hashes(),
            "invocation": {"argv": [sys.executable, "-B", str(Path(__file__).resolve()), "baseline"],
                           "cwd": str(ROOT)},
        })
        print(f"baseline: parser={sha(PRODUCTION)}; protected files frozen")
        return
    baseline = json.loads((HERE / "baseline.json").read_text(encoding="ascii"))
    assert protected_hashes() == baseline["protected_sha256"], "immutable file drift"
    if args.phase == "reproduce":
        assert sha(PRODUCTION) == baseline["production_sha256"]
        capture("reproduce", 1)
        return
    before = (HERE / "assemble.before.py.txt").read_text(encoding="utf-8")
    after = PRODUCTION.read_text(encoding="utf-8")
    assert before != after, "parser patch absent"
    assert without_pattern(before) == without_pattern(after), "non-parser code changed"
    diff = "".join(difflib.unified_diff(
        before.splitlines(keepends=True), after.splitlines(keepends=True),
        fromfile="before/.claude/skills/ld-s10y-lesson/tools/assemble.py",
        tofile="after/.claude/skills/ld-s10y-lesson/tools/assemble.py",
    ))
    assert not (HERE / "assemble.diff").exists()
    (HERE / "assemble.diff").write_text(diff, encoding="utf-8")
    capture("focused", 0)
    assert protected_hashes() == baseline["protected_sha256"], "immutable file drift"
    save_json("result.json", {
        "scope": "bounded heading parser only; not lesson or full-book acceptance",
        "production_before_sha256": baseline["production_sha256"],
        "production_after_sha256": sha(PRODUCTION),
        "layout_sha256": sha(LAYOUT),
        "protected_sha256": baseline["protected_sha256"],
        "protected_files_unchanged": True,
        "non_SEC_NUM_AST_unchanged": True,
        "test_surface": "AST-isolated SEC_NUM; match/fullmatch capture tuples",
        "old_tests_run": False,
        "assembly_or_source_operations_run": False,
        "model_images": 0,
        "invocation": {"argv": [sys.executable, "-B", str(Path(__file__).resolve()), "finish"],
                       "cwd": str(ROOT)},
    })
    complete = diff
    for name in ("check_heading.py", "evidence.py", "README.md"):
        text = (HERE / name).read_text(encoding="utf-8")
        complete += "".join(difflib.unified_diff(
            [], text.splitlines(keepends=True), fromfile="/dev/null",
            tofile=str((HERE / name).relative_to(ROOT)),
        ))
    assert not (HERE / "complete.diff").exists()
    (HERE / "complete.diff").write_text(complete, encoding="utf-8")
    hashes = {
        str(path.relative_to(HERE)): sha(path)
        for path in sorted(HERE.rglob("*")) if path.is_file()
    }
    save_json("freeze.json", {"algorithm": "sha256", "files": hashes,
                              "excluded_self": "freeze.json"})
    print(f"finished: parser={sha(PRODUCTION)}; freeze.json={sha(HERE / 'freeze.json')}")


if __name__ == "__main__":
    main()
