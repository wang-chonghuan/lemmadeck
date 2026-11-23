"""Retain the bounded source author's first facts and real native receipts."""
from __future__ import annotations

import argparse
import hashlib
import json
import os
import shutil
import subprocess
from pathlib import Path

REPO = Path("/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188")
OWNED = REPO / ".intentfold/tickets/STEMROBIN-188/tmp/source6g175176-author7"
PYTHON = REPO / ".claude/skills/ld-s10y-lesson/.venv/bin/python"
PRODUCER = REPO / ".claude/skills/ld-s10y-lesson/tools/p2c.py"
BOOKS = REPO / "ssot-resources/soviet10year-textbooks/sources"
VERIFIED = {
    "0175": {
        "page.png": "7c23e84f1def17e8d28ac87fe54f6849e9d2127829492417bb58b63143dd7247",
        "page.grid.png": "9b752daf813317b84e4a9a8a7bffeb2e6d564cab569e31a239839fd5fe224a7a",
        "layout.json": "de2d35c8e32752f957887f2e8be5e45356423f3347f59bc7c91f35ec163a8449",
        "page.template.md": "cfcebad4cc67ac4b860738e307ed4ee876c0d5e71d030570983e59a780a57ee1",
    },
    "0176": {
        "page.png": "0a383b5ba73c18c4b9a5422fbf18cf3eef6c05491e45a8ef5266f9dac3b8a092",
        "page.grid.png": "30c2553c15e8a914ffae99f803da77b29899ac91376f92546229ae1b189761d0",
        "layout.json": "0d2ec1fa0648f77aca65b02a29c908a8a7b6d786abd8f6c39a910c664cd21f69",
        "page.template.md": "efe91b1db1d390c87768f59dd32ef1042188e2bdd88d2a38eff54a7410a8cebb",
    },
}


def binding(path: Path) -> dict:
    return {
        "path": str(path),
        "sha256": hashlib.sha256(path.read_bytes()).hexdigest(),
        "bytes": path.stat().st_size,
    }


def save_json(path: Path, value: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n",
                    encoding="utf-8")


def first() -> None:
    if (OWNED / "FIRST.json").exists():
        raise RuntimeError("First evidence already exists; never replace it")
    inputs, pages = {}, {}
    for page in ("0175", "0176"):
        canonical = REPO / ".tmp/ld-s10y-lesson/6-8g/pages" / page
        copied = OWNED / "work/6-8g/pages" / page
        copied.mkdir(parents=True, exist_ok=True)
        inputs[page] = []
        for name, expected in VERIFIED[page].items():
            target = copied / name
            shutil.copyfile(canonical / name, target)
            inputs[page].append({
                "canonical_path": str(canonical / name),
                "verified_once_sha256": expected,
                "owned_input": binding(target),
            })
            if inputs[page][-1]["owned_input"]["sha256"] != expected:
                raise RuntimeError(f"Input changed during copy: {canonical / name}")
            target.chmod(0o444)
        candidate = OWNED / f"artifacts/6-8g/pages/{page}/page.md"
        snapshot = OWNED / f"first/{page}.page.md"
        if snapshot.exists():
            if snapshot.read_bytes() != candidate.read_bytes():
                raise RuntimeError("First175 snapshot differs before execution")
        else:
            shutil.copyfile(candidate, snapshot)
        observation = OWNED / f"first/{page}.observations.md"
        pages[page] = {
            "first_candidate": binding(snapshot),
            "first_observations": binding(observation),
            "printed_page": int(page) - 10,
            "block_body_rows": 26 if page == "0175" else 21,
            "actual_samerow_subtractions": 2 if page == "0175" else 1,
            "actual_unique_text_rows": 24 if page == "0175" else 20,
            "separate_nontext_separator": page == "0176",
        }
        snapshot.chmod(0o444)
        observation.chmod(0o444)
    save_json(OWNED / "FIRST.json", {
        "schema": "s10y-bounded-source-author-first@1",
        "ticket": "STEMROBIN-188",
        "status": "AUTHOR_ONLY",
        "finish": "review/offline",
        "cwd": str(REPO),
        "write_root": str(OWNED),
        "book": "6-8g",
        "scope_physical": [175, 176],
        "inputs": inputs,
        "pages": pages,
        "first_md": binding(OWNED / "FIRST.md"),
        "native_outputs_at_first_seal": [],
        "actual_image_loads_at_first_seal": [
            {"order": 1, "page": 175, "path": str(REPO / ".tmp/ld-s10y-lesson/6-8g/pages/0175/page.grid.png")},
            {"order": 2, "page": 176, "path": str(REPO / ".tmp/ld-s10y-lesson/6-8g/pages/0176/page.grid.png")},
        ],
        "batch_image_count_at_first_seal": 2,
        "context_image_count_at_first_seal": 2,
        "batch_cap": 8,
        "context_cap": 24,
        "content_revisions_at_first_seal": 0,
        "technical_recovery_attempts_at_first_seal": 0,
        "source_approval_claim": False,
        "continuity174": {
            "basis": "caller text only; transport escaping understood",
            "canonical174_json_read": False,
            "image_or_figure_read": False,
            "transparent_footnote": True,
        },
    })
    (OWNED / "FIRST.md").chmod(0o444)
    (OWNED / "FIRST.json").chmod(0o444)
    print(json.dumps({"first": binding(OWNED / "FIRST.json"),
                      "first_md": binding(OWNED / "FIRST.md")}, indent=2))


def finalize(page: int) -> None:
    if page not in (175, 176):
        raise RuntimeError("Page outside author scope")
    if not (OWNED / "FIRST.json").is_file():
        raise RuntimeError("First seal missing")
    first_meta = json.loads((OWNED / "FIRST.json").read_text(encoding="utf-8"))
    for item in first_meta["pages"].values():
        for key in ("first_candidate", "first_observations"):
            path = Path(item[key]["path"])
            if path.stat().st_mode & 0o222:
                raise RuntimeError("First evidence not sealed")
    receipt_dir = OWNED / f"native/{page:04d}/attempt1"
    if receipt_dir.exists():
        raise RuntimeError("Native first attempt already exists; no rerun")
    receipt_dir.mkdir(parents=True)
    candidate = OWNED / f"artifacts/6-8g/pages/{page:04d}/page.md"
    argv = [
        str(PYTHON), "-B", str(PRODUCER), "finalize",
        "--book", "6-8g", "--page", str(page),
        "--root", str(OWNED / "artifacts"),
        "--work", str(OWNED / "work"),
        "--books", str(BOOKS),
    ]
    before = binding(candidate)
    started = {
        "cwd": str(REPO), "argv": argv,
        "candidate_before_normalization": before,
        "first_candidate": first_meta["pages"][f"{page:04d}"]["first_candidate"],
        "producer": binding(PRODUCER),
        "python_invoked": str(PYTHON),
        "python_resolved": str(PYTHON.resolve()),
        "execution_status": "started",
    }
    save_json(receipt_dir / "invocation.json", started)
    environment = dict(os.environ)
    environment["PYTHONDONTWRITEBYTECODE"] = "1"
    result = subprocess.run(argv, cwd=REPO, env=environment, capture_output=True)
    stdout = receipt_dir / "stdout.txt"
    stderr = receipt_dir / "stderr.txt"
    stdout.write_bytes(result.stdout)
    stderr.write_bytes(result.stderr)
    outputs = []
    for path in sorted((OWNED / f"artifacts/6-8g/pages/{page:04d}").glob("*")):
        if path.is_file():
            outputs.append(binding(path))
    for path in sorted((OWNED / f"work/6-8g/pages/{page:04d}/figures").glob("*.png")):
        outputs.append(binding(path))
    receipt = {
        **started, "execution_status": "finished", "exit_code": result.returncode,
        "streams": {"stdout": binding(stdout), "stderr": binding(stderr)},
        "outputs_after_native": outputs,
        "semantic_approval": False,
        "content_revision_attempt": 0,
        "technical_recovery_attempt": 0,
    }
    save_json(receipt_dir / "receipt.json", receipt)
    for path in receipt_dir.iterdir():
        path.chmod(0o444)
    print(json.dumps({"page": page, "exit_code": result.returncode,
                      "receipt": binding(receipt_dir / "receipt.json"),
                      "stdout": result.stdout.decode("utf-8", errors="replace"),
                      "stderr": result.stderr.decode("utf-8", errors="replace")}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    if Path.cwd().resolve() != REPO:
        raise RuntimeError("Wrong cwd")
    parser = argparse.ArgumentParser()
    parser.add_argument("stage", choices=("first", "finalize"))
    parser.add_argument("--page", type=int)
    arguments = parser.parse_args()
    if arguments.stage == "first":
        first()
    else:
        finalize(arguments.page)
