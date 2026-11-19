#!/usr/bin/env python3
"""Capture one authorized native attempt without replay or repair."""
from __future__ import annotations

import hashlib
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
from datetime import datetime, timezone

REPO = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
STAGE = REPO / ".intentfold/tickets/STEMROBIN-181/tmp/d912-source240-first-author"
PREP = REPO / ".intentfold/tickets/STEMROBIN-181/tmp/d911-source240-first-preparation/work/10p/pages/0240"
ROOT = STAGE / "root"
WORK = STAGE / "work"
PAGE = ROOT / "10p/pages/0240"
WPAGE = WORK / "10p/pages/0240"
PYTHON = REPO / ".claude/skills/ld-s10y-lesson/.venv/bin/python"
TOOL = REPO / ".claude/skills/ld-s10y-lesson/tools/p2c.py"


def stamp():
    return datetime.now(timezone.utc).isoformat()


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def save(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("x", encoding="utf-8") as stream:
        json.dump(value, stream, ensure_ascii=False, indent=2)
        stream.write("\n")


def snapshot(source, destination):
    destination.parent.mkdir(parents=True, exist_ok=True)
    if destination.exists():
        raise RuntimeError(f"Refusing to overwrite: {destination}")
    shutil.copyfile(source, destination)
    if digest(source) != digest(destination):
        raise RuntimeError("Snapshot byte mismatch")
    destination.chmod(0o444)
    return {"source": str(source), "snapshot": str(destination),
            "sha256": digest(destination), "bytes": destination.stat().st_size}


def initialize():
    if WORK.exists():
        raise RuntimeError("Preparation copy already exists; no replay")
    WPAGE.mkdir(parents=True)
    PAGE.mkdir(parents=True)
    (STAGE / "runtime").mkdir()
    rows = []
    for name in ("page.png", "page.grid.png", "page.template.md", "layout.json",
                 "prepare.0001.stdout", "prepare.0001.stderr"):
        src, dst = PREP / name, WPAGE / name
        shutil.copyfile(src, dst)
        dst.chmod(0o644)
        if digest(src) != digest(dst):
            raise RuntimeError(f"Preparation byte mismatch: {name}")
        rows.append({"source": str(src), "copy": str(dst),
                     "sha256": digest(src), "bytes": src.stat().st_size})
    save(STAGE / "preparation-copy.json",
         {"prepared_again": False, "copied_at": stamp(), "files": rows})
    print(json.dumps({"preparation_copy": "byte-exact", "files": len(rows)}))


def attempt(kind):
    if kind not in ("finalize", "vectorize"):
        raise RuntimeError("Only page-scoped native stages are authorized")
    prefix = STAGE / f"{kind}.0001"
    if prefix.with_suffix(".0001.receipt.json").exists():
        raise RuntimeError("Native attempt already exists")
    started = STAGE / f"{kind}.0001.started.json"
    if started.exists():
        raise RuntimeError("Native attempt already started; no replay")
    if kind == "vectorize":
        receipt = json.loads((STAGE / "finalize.0001.receipt.json").read_text())
        if receipt["returncode"] != 0:
            raise RuntimeError("First finalize failed; dependent stages forbidden")
        if not (WPAGE / "figures/fig-209.png").is_file():
            raise RuntimeError("No actual owned crop")
    author = None
    if kind == "finalize":
        author = snapshot(PAGE / "page.md", STAGE / "author/page.first.md")
    command = [str(PYTHON), str(TOOL), kind, "--book", "10p", "--page", "240",
               "--root", str(ROOT), "--work", str(WORK)]
    environment = dict(os.environ)
    environment["PYTHONDONTWRITEBYTECODE"] = "1"
    environment["TMPDIR"] = str(STAGE / "runtime")
    save(started, {"started_at": stamp(), "cwd": str(REPO), "command": command,
                   "author": author, "attempt": 1,
                   "environment": {"PYTHONDONTWRITEBYTECODE": "1",
                                   "TMPDIR": str(STAGE / "runtime")},
                   "native_internal_guard":
                       "p2c production.validate_workspace invokes read-only git rev-parse; "
                       "no independent Git command, mutation, or repository workflow."})
    out, err = STAGE / f"{kind}.0001.stdout", STAGE / f"{kind}.0001.stderr"
    with out.open("xb") as stdout, err.open("xb") as stderr:
        result = subprocess.run(command, cwd=REPO, env=environment,
                                stdout=stdout, stderr=stderr, check=False)
    evidence = STAGE / "native-first" / kind
    files = []
    if kind == "finalize":
        for name in ("page.md", "page.json", "audit.json"):
            path = PAGE / name
            if path.is_file():
                files.append(snapshot(path, evidence / name))
                path.chmod(0o444)
        for path in sorted((WPAGE / "figures").glob("*.png")):
            files.append(snapshot(path, evidence / "figures" / path.name))
            path.chmod(0o444)
    else:
        for path in sorted((WPAGE / "figures").glob("*.svg")):
            files.append(snapshot(path, evidence / "figures" / path.name))
            path.chmod(0o444)
    receipt = {
        "schema": "source240/first-native-receipt@1", "kind": kind,
        "attempt": 1, "command": command, "cwd": str(REPO),
        "finished_at": stamp(), "returncode": result.returncode,
        "stdout": {"path": str(out), "sha256": digest(out), "bytes": out.stat().st_size},
        "stderr": {"path": str(err), "sha256": digest(err), "bytes": err.stat().st_size},
        "outputs": files, "replayed": False, "repaired": False,
        "source_status": "HOLD", "full_card_status": "HOLD",
    }
    save(STAGE / f"{kind}.0001.receipt.json", receipt)
    for path in (started, out, err, STAGE / f"{kind}.0001.receipt.json"):
        path.chmod(0o444)
    print(json.dumps(receipt, ensure_ascii=False, indent=2))
    print(out.read_text(encoding="utf-8"))
    if err.stat().st_size:
        print(err.read_text(encoding="utf-8"), file=sys.stderr)
    return result.returncode


def freeze(images):
    receipts = {}
    for kind in ("finalize", "vectorize"):
        path = STAGE / f"{kind}.0001.receipt.json"
        if path.is_file():
            receipts[kind] = json.loads(path.read_text())
    usage = {
        "schema": "source240/first-usage@1",
        "preparation_runs_this_author": 0, "preparation_byte_exact_copies": 1,
        "author_candidates": 1,
        "finalize_attempts": int("finalize" in receipts),
        "vectorize_attempts": int("vectorize" in receipts),
        "global_vectorize_attempts": 0, "content_repairs": 0, "replays": 0,
        "images_this_batch": images, "images_in_context": images,
        "image_limit_batch": 8, "image_limit_context": 24,
        "paid_model_api_calls": 0, "paid_image_api_calls": 0,
        "prepare_reruns": 0, "assemble": 0, "promote": 0, "index": 0,
        "publish": 0, "database_calls": 0, "other_chats": 0,
        "whole_project_tests": 0, "independent_git_commands": 0,
        "native_internal_read_only_git_guard_calls": len(receipts),
        "meter_calls": 0, "source239_images_or_fulltext_reads": 0,
        "source241_reads": 0,
    }
    save(STAGE / "usage.first.json", usage)
    failed = any(row["returncode"] != 0 for row in receipts.values())
    save(STAGE / "first-observations.json", {
        "schema": "source240/first-observations@1", "frozen_at": stamp(),
        "ticket": "STEMROBIN-181", "successor": "successor181-3", "assignment": "d912",
        "book": "10p", "physical_source_page": 240, "printed_page": 230,
        "source_status": "HOLD", "full_card_status": "HOLD",
        "independent_review": "NOT RUN; required before source/full-card approval",
        "native_status": "FIRST FAILED; STOP" if failed else "FIRST PASS",
        "receipts": {kind: str(STAGE / f"{kind}.0001.receipt.json")
                     for kind in receipts},
        "inventory": str(STAGE / "inventory.first.md"),
        "author_snapshot": str(STAGE / "author/page.first.md"),
        "left_boundary": {
            "provided_source239_tail_only": "任何其他情况. 但事实并非如此. 光波获得了新的性质！",
            "source239_outgoing_open": False, "source240_first_block_cont": False,
            "source240_first_printed_row": "如果使光束通过与第一块",
        },
        "right_boundary": {
            "exact_visible_last_prose_row":
                "第一个假设是对光本身来说的. 光是横波. 但是由一般",
            "last_prose_open": True, "last_prose_cont": False,
            "following_source_not_read": 241,
            "no_invented_completion_or_punctuation": True,
        },
        "first_visual_observations":
            "Recorded once in inventory.first.md; PNG/SVG observations are author checks, "
            "not independent review or source approval.",
        "usage": str(STAGE / "usage.first.json"),
    })
    rows = []
    for path in sorted(STAGE.rglob("*")):
        if path.is_file() and "runtime" not in path.relative_to(STAGE).parts:
            rows.append({"path": str(path), "sha256": digest(path),
                         "bytes": path.stat().st_size})
    save(STAGE / "hashes.first.json", {"algorithm": "SHA-256", "files": rows})
    for row in rows:
        Path(row["path"]).chmod(0o444)
    (STAGE / "hashes.first.json").chmod(0o444)
    print(json.dumps({"hashes": str(STAGE / "hashes.first.json"),
                      "sha256": digest(STAGE / "hashes.first.json"),
                      "observations_sha256": digest(STAGE / "first-observations.json"),
                      "usage_sha256": digest(STAGE / "usage.first.json"),
                      "status": "HOLD"}, indent=2))


if __name__ == "__main__":
    if Path.cwd().resolve() != REPO:
        raise SystemExit("Wrong cwd; explicit authorized checkout required")
    mode = sys.argv[1]
    if mode == "copy-preparation":
        initialize()
    elif mode in ("finalize", "vectorize"):
        raise SystemExit(attempt(mode))
    elif mode == "freeze":
        freeze(int(sys.argv[2]))
    else:
        raise SystemExit("Unknown stage")
