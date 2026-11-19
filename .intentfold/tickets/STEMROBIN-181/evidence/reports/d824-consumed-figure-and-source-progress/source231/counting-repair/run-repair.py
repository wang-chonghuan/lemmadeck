import difflib
import hashlib
import json
import os
import shutil
import subprocess
import sys
from pathlib import Path

REPO = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
BASE = REPO / ".intentfold/tickets/STEMROBIN-181/tmp/d816-source231-counting-repair"
AUTHOR = REPO / ".intentfold/tickets/STEMROBIN-181/tmp/d797-source231-first-author"
REVIEW = REPO / ".intentfold/tickets/STEMROBIN-181/tmp/d808-source231-raw201202-first-review"
TOOLS = REPO / ".claude/skills/ld-s10y-lesson/tools"
PYTHON = REPO / ".claude/skills/ld-s10y-lesson/.venv/bin/python"
ORIGINAL_LAYOUT_HASH = "59dd8aeedf0950585df7247b82def7cb96e0422cdca5ed42fe70579ed210a0ee"
NATIVE_DEPENDENCIES = {"p2c.py", "blocks.py", "normalize.py", "mathcheck.py", "production.py"}


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def dump(path, value):
    path.write_text(json.dumps(value, indent=2, ensure_ascii=True) + "\n")


def files_under(root):
    return sorted(path for path in root.rglob("*") if path.is_file())


def frozen_hashes():
    files = files_under(AUTHOR) + files_under(REVIEW)
    # Unrelated workers may edit renderers; only finalize's dependencies are bound.
    files += [TOOLS / name for name in sorted(NATIVE_DEPENDENCIES)]
    files += [REPO / ".claude/skills/ld-s10y-lesson/profiles/soviet-cn.json"]
    return {str(path): sha(path) for path in files if path != TOOLS / "layout.py"}


def assert_frozen():
    expected = json.loads((BASE / "baseline.json").read_text())["preserved_sha256"]
    expected = {
        path: value for path, value in expected.items()
        if not Path(path).is_relative_to(TOOLS) or Path(path).name in NATIVE_DEPENDENCIES
    }
    assert frozen_hashes() == expected, "Original evidence or unowned native code changed"


def run_once(name, command):
    directory = BASE / name
    directory.mkdir()
    dump(directory / "started.json", {"command": command, "cwd": str(REPO)})
    result = subprocess.run(
        command, cwd=REPO, capture_output=True,
        env={**os.environ, "PYTHONDONTWRITEBYTECODE": "1"},
    )
    (directory / "stdout.txt").write_bytes(result.stdout)
    (directory / "stderr.txt").write_bytes(result.stderr)
    dump(directory / "receipt.json", {
        "command": command, "cwd": str(REPO), "exit": result.returncode,
        "layout_sha256": sha(TOOLS / "layout.py"),
        "stdout_sha256": sha(directory / "stdout.txt"),
        "stderr_sha256": sha(directory / "stderr.txt"),
    })
    sys.stdout.buffer.write(result.stdout)
    sys.stderr.buffer.write(result.stderr)
    print(f"RECORDED_EXIT={result.returncode}", flush=True)
    return result.returncode


def baseline():
    assert not (BASE / "baseline.json").exists()
    assert sha(TOOLS / "layout.py") == ORIGINAL_LAYOUT_HASH
    freeze = json.loads((AUTHOR / "freeze.json").read_text())
    for relative, expected in freeze["sha256_relative_to_base"].items():
        assert sha(AUTHOR / relative) == expected, relative
    report = json.loads((REVIEW / "report.json").read_text())
    diagnostics = json.loads((REVIEW / "diagnostics.json").read_text())
    trace = json.loads((REVIEW / "counting-trace.json").read_text())
    assert report["SOURCE231"]["independently_visible_text_rows"] == 19
    assert report["SOURCE231"]["candidate_content_defects"] == []
    assert diagnostics["footnote_projection_fragments"] == [
        [1755, 1797], [1813, 1852], [1863, 1892],
    ]
    assert trace["after_gap_merge_before_join"]["footnote_bands"] == [[1755, 1892]]
    shutil.copy2(TOOLS / "layout.py", BASE / "layout.before.py")
    dump(BASE / "baseline.json", {
        "layout_sha256": ORIGINAL_LAYOUT_HASH,
        "preserved_sha256": frozen_hashes(),
        "source_review_rows": report["SOURCE231"]["rows"],
        "original_finalize_receipt": str(AUTHOR / "FIRST/receipt.json"),
        "actual_image_opens": 0,
    })
    return run_once("DIAGNOSTIC-FIRST", [
        str(PYTHON), "-B", str(BASE / "inspect-counting.py"),
    ])


def focused():
    assert_frozen()
    return run_once("FOCUSED-FIRST", [
        str(PYTHON), "-B", str(BASE / "focused-checks.py"),
    ])


def native():
    assert_frozen()
    assert json.loads((BASE / "FOCUSED-FIRST/receipt.json").read_text())["exit"] == 0
    assert not (BASE / "NATIVE-RETRY").exists(), "Sole native retry already used"
    assert not (BASE / "root").exists() and not (BASE / "work").exists()
    for name in ("root", "work"):
        shutil.copytree(AUTHOR / name, BASE / name)
        for path in [BASE / name] + sorted((BASE / name).rglob("*")):
            if not path.is_symlink():
                path.chmod(path.stat().st_mode | (0o700 if path.is_dir() else 0o600))
    dump(BASE / "copied-inputs.json", {
        str(path.relative_to(BASE)): sha(path)
        for name in ("root", "work") for path in files_under(BASE / name)
    })
    return run_once("NATIVE-RETRY", [
        str(PYTHON), "-B", str(BASE / "run-finalize.py"),
        "--book", "10p", "--page", "231",
        "--root", str(BASE / "root"), "--work", str(BASE / "work"),
    ])


def report():
    assert_frozen()
    focused_receipt = json.loads((BASE / "FOCUSED-FIRST/receipt.json").read_text())
    native_receipt = json.loads((BASE / "NATIVE-RETRY/receipt.json").read_text())
    assert focused_receipt["exit"] == native_receipt["exit"] == 0
    first_audit = json.loads((AUTHOR / "FIRST/outputs/audit.json").read_text())
    page_dir = BASE / "root/10p/pages/0231"
    audit = json.loads((page_dir / "audit.json").read_text())
    assert (first_audit["lines_printed"], first_audit["lines_md"]) == (18, 19)
    assert audit["lines_printed"] == audit["lines_md"] == 19
    assert audit["errors"] == []
    permitted_audit = {"lines_printed", "lines_md", "errors"}
    assert {
        key: value for key, value in audit.items() if key not in permitted_audit
    } == {
        key: value for key, value in first_audit.items() if key not in permitted_audit
    }
    copied = json.loads((BASE / "copied-inputs.json").read_text())
    changed_copies = [
        relative for relative, expected in copied.items()
        if sha(BASE / relative) != expected
    ]
    assert changed_copies == ["root/10p/pages/0231/audit.json"], changed_copies
    old_page = json.loads((AUTHOR / "FIRST/outputs/page.json").read_text())
    new_page = json.loads((page_dir / "page.json").read_text())
    assert old_page == new_page, "Content, sourceRefs, footnote or figcrops changed"
    before = (BASE / "layout.before.py").read_text()
    after = (TOOLS / "layout.py").read_text()
    patch = "".join(difflib.unified_diff(
        before.splitlines(keepends=True), after.splitlines(keepends=True),
        fromfile=".claude/skills/ld-s10y-lesson/tools/layout.py",
        tofile=".claude/skills/ld-s10y-lesson/tools/layout.py",
    ))
    (BASE / "layout.patch").write_text(patch)
    output_files = files_under(BASE / "root") + files_under(BASE / "work")
    native_written = [
        page_dir / "page.md", page_dir / "page.json", page_dir / "audit.json",
        BASE / "work/10p/pages/0231/figures/fig-202.png",
    ]
    (BASE / "summary.md").write_text(
        "# STEMROBIN-181/181-3 bounded source231 counting repair\n\n"
        "Native PASS: 19 printed rows / 19 Markdown rows, exit 0. Exactly one "
        "finalize retry, in writable scratch copies of d797 root/work.\n\n"
        "Code: remove the short-width restriction from small-font prose "
        "continuation detection; apply that detector to the second joining "
        "pass. Covering-fraction-rule rejection is unchanged. No page/path "
        "special case, counting override, transcription deletion or rewrap.\n\n"
        "Focused FIRST: seven independently expected cases PASS, covering "
        "source231, short and full-length small-font continuations (both merge "
        "passes), three prose rows, and tall/nested single-row fractions.\n\n"
        "Exact footnote projection spans: 1755..1797, 1813..1852, 1863..1892. "
        "Exact returned component-inclusive bands: 1755..1798, 1812..1853, "
        "1862..1892. These one-pixel component fringes were already recorded "
        "by d808 before repair; no synthetic boundary remains.\n\n"
        "All copied input/output bytes except root/10p/pages/0231/audit.json "
        "are unchanged. Page JSON and Markdown are byte-identical: content, "
        "source references, footnote identity, figures and crop metadata "
        "unchanged. Audit changes ONLY lines_printed 18 -> 19 and errors -> []. "
        "Original d797 FIRST and d808 evidence remain unchanged.\n\n"
        "Receipts: FOCUSED-FIRST/receipt.json; NATIVE-RETRY/receipt.json; "
        "original d797/FIRST/receipt.json (exit 1, 18/19). The first launcher "
        "failure is separately preserved in HARNESS-FIRST-FAILED.json: it "
        "stopped before checks on an unrelated concurrent renderer edit; "
        "the guard was narrowed and that edit was not touched.\n\n"
        f"Layout SHA256: {sha(TOOLS / 'layout.py')}\n\n"
        f"Patch SHA256: {sha(BASE / 'layout.patch')}\n\n"
        "report.json contains exact paths, output hashes and assertions; "
        "hashes.json binds every scratch file. Actual images 0; paid calls 0; "
        "Git/DB/publish/deploy/agent/worktree/message operations 0. No prepare, "
        "vectorize, review replay, canonical/index/meter writes, whole-project "
        "tests or build. Stop after this repair.\n"
    )
    result = {
        "status": "PASS-NATIVE-COUNT-REPAIR",
        "code_changed_path": str(TOOLS / "layout.py"),
        "layout_before_sha256": ORIGINAL_LAYOUT_HASH,
        "layout_after_sha256": sha(TOOLS / "layout.py"),
        "patch_path": str(BASE / "layout.patch"),
        "patch_sha256": sha(BASE / "layout.patch"),
        "native_outputs_sha256": {str(path): sha(path) for path in output_files},
        "native_written_outputs_sha256": {str(path): sha(path) for path in native_written},
        "changed_candidate_copies": changed_copies,
        "page_json_byte_identical": True,
        "page_markdown_byte_identical": True,
        "source_refs_footnote_figcrops_unchanged": True,
        "original_author_and_first_outputs_unchanged": True,
        "audit_printed_md": [19, 19],
        "audit_changed_fields": ["lines_printed", "errors"],
        "focused_results": json.loads((BASE / "FOCUSED-FIRST/stdout.txt").read_text()),
        "focused_receipt": str(BASE / "FOCUSED-FIRST/receipt.json"),
        "preserved_first_launcher_failure": str(BASE / "HARNESS-FIRST-FAILED.json"),
        "native_retry_receipt": str(BASE / "NATIVE-RETRY/receipt.json"),
        "native_entry": "Unchanged p2c.cmd_finalize; CLI Git-root probe not invoked",
        "preserved_failed_first_receipt": str(AUTHOR / "FIRST/receipt.json"),
        "preserved_failed_first_receipt_sha256": sha(AUTHOR / "FIRST/receipt.json"),
        "created_scratch_paths": [
            str(path) for path in files_under(BASE)
        ] + [str(BASE / "report.json"), str(BASE / "hashes.json")],
        "usage": {
            "actual_images": 0, "paid_calls": 0, "finalize_retry_calls": 1,
            "prepare_calls": 0, "vectorize_calls": 0, "replayed_reviews": 0,
            "whole_project_tests": 0, "builds": 0, "git_calls": 0,
            "database_calls": 0, "publishes": 0, "deploys": 0,
            "agents": 0, "worktree_operations": 0, "other_messages": 0,
        },
    }
    dump(BASE / "report.json", result)
    print(json.dumps(result, indent=2))
    dump(BASE / "hashes.json", {
        str(path): sha(path) for path in files_under(BASE)
        if path != BASE / "hashes.json"
    })
    return 0


handlers = {"baseline": baseline, "focused": focused, "native": native, "report": report}
raise SystemExit(handlers[sys.argv[1]]())
