#!/usr/bin/env python3
"""Retain one native call and its outputs before allowing a dependent stage."""
import hashlib
import json
import shutil
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

R = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
A = R / ".intentfold/tickets/STEMROBIN-181/tmp/d922-source241-first-author"
P = R / ".claude/skills/ld-s10y-lesson/.venv/bin/python"
TOOL = R / ".claude/skills/ld-s10y-lesson/tools/p2c.py"
ROOT_PAGE = A / "root/10p/pages/0241"
WORK_PAGE = A / "work/10p/pages/0241"
PREPARED = R / ".intentfold/tickets/STEMROBIN-181/tmp/d917-source241-first-preparation/work/10p/pages/0241"
PREPARED_FILES = (
    "page.png", "page.grid.png", "layout.json", "page.template.md",
    "prepare.0001.stdout", "prepare.0001.stderr",
)


def digest(path):
    with path.open("rb") as stream:
        return hashlib.file_digest(stream, "sha256").hexdigest()


def write_json(path, value):
    with path.open("x", encoding="utf-8") as stream:
        json.dump(value, stream, ensure_ascii=False, indent=2)
        stream.write("\n")


def assert_success(stage):
    receipt = json.loads((A / "first" / stage / "receipt.json").read_text())
    if receipt["returncode"] != 0:
        raise RuntimeError(f"{stage} FIRST failed; dependent stages must stop")


def record_file(path):
    return {
        "path": str(path),
        "bytes": path.stat().st_size,
        "sha256": digest(path),
    }


def run(stage, command, workspace_guard, extra_outputs=()):
    if Path.cwd() != R:
        raise RuntimeError("all invocations require exact R cwd")
    directory = A / "first" / stage
    directory.mkdir(exist_ok=False)
    started = datetime.now(timezone.utc).isoformat()
    result = subprocess.run(command, cwd=R, capture_output=True, check=False)
    ended = datetime.now(timezone.utc).isoformat()
    (directory / "stdout").write_bytes(result.stdout)
    (directory / "stderr").write_bytes(result.stderr)
    # Native commands may rewrite page.md even on failure; preserve that result.
    for relative in ("root/10p/pages/0241", "work/10p/pages/0241/figures"):
        source = A / relative
        if source.is_dir():
            shutil.copytree(source, directory / relative)
    for source in extra_outputs:
        if source.is_file():
            target = directory / source.relative_to(A)
            if not target.exists():
                target.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(source, target)
    outputs = [record_file(path) for path in sorted(directory.rglob("*")) if path.is_file()]
    receipt = {
        "schema": "source-native-first-receipt@1",
        "ticket": "STEMROBIN-181",
        "author": "d922",
        "book": "10p",
        "page": 241,
        "stage": stage,
        "attempt": 1,
        "command": [str(part) for part in command],
        "cwd": str(R),
        "started_at_utc": started,
        "ended_at_utc": ended,
        "returncode": result.returncode,
        "status": "SUCCESS" if result.returncode == 0 else "FAILURE",
        "independent_review_status": "HOLD",
        "outputs": outputs,
        "workspace_guard": {
            "invoked_by_native_p2c": workspace_guard,
            "function": "production.validate_workspace",
            "read_only_command": ["git", "-C", str(R), "rev-parse", "--show-toplevel"],
            "independent_git_calls": 0,
        },
        "repair_attempts": 0,
        "stop_dependent_stages_on_failure": True,
    }
    write_json(directory / "receipt.json", receipt)
    for path in directory.rglob("*"):
        if path.is_file():
            path.chmod(0o444)
    print(result.stdout.decode("utf-8", errors="replace"), end="")
    if result.stderr:
        print(result.stderr.decode("utf-8", errors="replace"), file=sys.stderr, end="")
    print(json.dumps({"stage": stage, "returncode": result.returncode,
                      "receipt": str(directory / "receipt.json")}))
    return result.returncode


def main():
    action = sys.argv[1]
    if action == "finalize":
        for name in PREPARED_FILES:
            if digest(PREPARED / name) != digest(WORK_PAGE / name):
                raise RuntimeError(f"prepared copy drift: {name}")
        frozen = A / "first/author/root/10p/pages/0241/page.md"
        if digest(frozen) != digest(ROOT_PAGE / "page.md"):
            raise RuntimeError("author input differs from frozen FIRST")
        for base in (A / "first/author", A / "first/prepared"):
            for path in base.rglob("*"):
                if path.is_file():
                    path.chmod(0o444)
        return run("finalize", [
            P, TOOL, "finalize", "--book", "10p", "--page", "241",
            "--root", A / "root", "--work", A / "work",
        ], True)
    if action == "vectorize":
        assert_success("finalize")
        return run("vectorize", [
            P, TOOL, "vectorize", "--book", "10p", "--page", "241",
            "--root", A / "root", "--work", A / "work",
        ], True)
    if action == "preview":
        assert_success("vectorize")
        figure = sys.argv[2]
        if figure not in {"fig-210", "fig-211"}:
            raise RuntimeError("preview must belong to SOURCE241")
        if figure == "fig-211":
            assert_success("preview-fig-210")
        png = WORK_PAGE / "figures" / f"{figure}.svg.preview.png"
        if png.exists():
            raise RuntimeError("FIRST preview already exists")
        # p2c discards its temporary resvg preview; reuse its native renderer once.
        return run(f"preview-{figure}", [
            "node", R / ".claude/skills/ld-s10y-lesson/tools/svg_raster.js",
            WORK_PAGE / "figures" / f"{figure}.svg", png,
        ], False, (png,))
    if action == "seal":
        if Path.cwd() != R:
            raise RuntimeError("seal requires exact R cwd")
        source_copies = []
        for name in PREPARED_FILES:
            original = PREPARED / name
            copied = WORK_PAGE / name
            frozen = A / "first/prepared/work/10p/pages/0241" / name
            source_copies.append({
                "original": record_file(original),
                "copy": record_file(copied),
                "frozen": record_file(frozen),
                "byte_exact": digest(original) == digest(copied) == digest(frozen),
            })
        inputs = [
            A / "first/author/root/10p/pages/0241/page.md",
            A / "first/author/observations.author.first.json",
            TOOL,
            R / ".claude/skills/ld-s10y-lesson/tools/production.py",
            R / ".claude/skills/ld-s10y-lesson/tools/blocks.py",
            R / ".claude/skills/ld-s10y-lesson/tools/normalize.py",
            R / ".claude/skills/ld-s10y-lesson/tools/layout.py",
            R / ".claude/skills/ld-s10y-lesson/tools/mathcheck.py",
            R / ".claude/skills/ld-s10y-lesson/tools/vectorize.py",
            R / ".claude/skills/ld-s10y-lesson/tools/svg_raster.js",
            R / ".claude/skills/ld-s10y-lesson/profiles/soviet-cn.json",
            R / ".claude/skills/ld-s10y-lesson/SKILL.md",
            R / ".claude/skills/ld-s10y-lesson/references/production-resume.md",
            R / ".agents/skills/ld-s10y-image/SKILL.md",
        ]
        outputs = [path for path in sorted(A.rglob("*"))
                   if path.is_file() and path not in inputs
                   and "first/prepared/" not in str(path.relative_to(A))]
        value = {
            "schema": "source-first-hashes@1",
            "algorithm": "sha256",
            "ticket": "STEMROBIN-181",
            "author": "d922",
            "book": "10p",
            "page": 241,
            "status": "HOLD",
            "source_copies": source_copies,
            "all_prepared_copies_byte_exact": all(row["byte_exact"] for row in source_copies),
            "inputs": [record_file(path) for path in inputs],
            "outputs": [record_file(path) for path in outputs],
            "self_hash": "excluded; print external SHA256 after sealing",
            "pdf_hash": {
                "from_native_finalize_source_metadata": json.loads(
                    (ROOT_PAGE / "page.json").read_text()
                )["meta"]["source"],
                "source_pdf_not_copied_or_visually_opened": True,
            },
        }
        write_json(A / "hashes.first.json", value)
        print(json.dumps({
            "status": "HOLD",
            "hashes": record_file(A / "hashes.first.json"),
            "prepared_copies_byte_exact": value["all_prepared_copies_byte_exact"],
            "inputs": len(value["inputs"]),
            "outputs": len(value["outputs"]),
        }))
        return 0
    raise RuntimeError("unknown action")


if __name__ == "__main__":
    raise SystemExit(main())
