"""Scoped execution evidence for this source-author-only batch."""

import hashlib
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import time

OWN = Path(__file__).resolve().parent
REPO = OWN.parents[4]


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def info(path):
    st = path.stat()
    return {
        "path": str(path),
        "sha256": sha(path),
        "bytes": st.st_size,
        "mode": format(st.st_mode & 0o777, "04o"),
        "mtime_ns": st.st_mtime_ns,
    }


def save(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n")


def bootstrap():
    allowed = (
        "page.png", "page.grid.png", "layout.json", "page.template.md",
        "prepare.0001.stdout", "prepare.0001.stderr",
    )
    inputs = []
    for page in (157, 158):
        source = REPO / ".tmp/ld-s10y-lesson/6-8g/pages" / f"{page:04d}"
        target = OWN / "work/6-8g/pages" / f"{page:04d}"
        target.mkdir(parents=True, exist_ok=False)
        for name in allowed:
            src = source / name
            dst = target / name
            shutil.copy2(src, dst)
            assert sha(src) == sha(dst)
            inputs.append({"source": info(src), "copy": info(dst)})
    receipt = REPO / ".intentfold/tickets/STEMROBIN-188/tmp/prepare-source157158-09/execution.json"
    expected = "8ce603d0953085fdcfa2171171b2bb432b7cac5c6b535ece54bcdb3a49d9b443"
    assert sha(receipt) == expected
    streams = []
    for name in ("stdout.txt", "stderr.txt"):
        src = receipt.parent / name
        dst = OWN / "evidence/prepare" / name
        dst.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(src, dst)
        streams.append({"source": info(src), "copy": info(dst)})
    save(OWN / "input-manifest.json", {
        "status": "AUTHOR_ONLY", "prepare_replayed": False,
        "receipt": info(receipt), "inputs": inputs, "streams": streams,
    })
    print(json.dumps({"copied": len(inputs), "receipt_sha256": expected}))


def freeze(page):
    source = OWN / "source-first" / f"{page:04d}.md"
    source.chmod(0o444)
    assert (source.stat().st_mode & 0o777) == 0o444
    save(OWN / "evidence" / f"{page:04d}" / "source-first-freeze.json", {
        "status": "AUTHOR_ONLY", "action": "chmod 0444; stat; sha256",
        "frozen_before_typed_page_md": not (
            OWN / "artifacts/6-8g/pages" / f"{page:04d}" / "page.md"
        ).exists(),
        "file": info(source),
    })
    print(json.dumps(info(source)))


def finalize(page):
    folder = OWN / "evidence" / f"{page:04d}"
    folder.mkdir(parents=True, exist_ok=True)
    receipt = folder / "finalize.execution.json"
    assert not receipt.exists(), "One finalize invocation per page only."
    source = OWN / "source-first" / f"{page:04d}.md"
    assert (source.stat().st_mode & 0o777) == 0o444
    typed = OWN / "artifacts/6-8g/pages" / f"{page:04d}" / "page.md"
    snapshot = folder / "page.pre-finalize.md"
    shutil.copy2(typed, snapshot)
    snapshot.chmod(0o444)
    save(folder / "pre-finalize-snapshot.json", {
        "status": "AUTHOR_ONLY", "source_first": info(source),
        "typed_page": info(typed), "snapshot": info(snapshot),
    })
    python = REPO / ".claude/skills/ld-s10y-lesson/.venv/bin/python"
    p2c = REPO / ".claude/skills/ld-s10y-lesson/tools/p2c.py"
    argv = [
        str(python), str(p2c), "finalize", "--book", "6-8g",
        "--page", str(page), "--root", str(OWN / "artifacts"),
        "--work", str(OWN / "work"),
        "--books", str(REPO / "ssot-resources/soviet10year-textbooks/sources"),
    ]
    started = time.time_ns()
    with (folder / "finalize.stdout.txt").open("wb") as stdout:
        with (folder / "finalize.stderr.txt").open("wb") as stderr:
            result = subprocess.run(argv, cwd=REPO, stdout=stdout, stderr=stderr)
    elapsed = (time.time_ns() - started) / 1_000_000
    data = {
        "status": "AUTHOR_ONLY", "cwd": str(REPO), "argv": argv,
        "exitCode": result.returncode, "elapsed_ms": elapsed,
        "streams": {
            "stdout": info(folder / "finalize.stdout.txt"),
            "stderr": info(folder / "finalize.stderr.txt"),
        },
        "source_first": info(source), "snapshot": info(snapshot),
        "runtime": {"python": str(python), "p2c": info(p2c)},
    }
    save(receipt, data)
    print(json.dumps(data))


def manifest():
    paths = sorted(p for p in OWN.rglob("*") if p.is_file() and p.name != "manifest.json")
    save(OWN / "manifest.json", {
        "status": "AUTHOR_ONLY", "independent_review": False,
        "owned_root": str(OWN),
        "files": [info(p) for p in paths],
        "self_hash": "Reported externally; no recursive self-hash.",
    })
    print(json.dumps(info(OWN / "manifest.json")))


action = sys.argv[1]
if action == "bootstrap":
    bootstrap()
elif action == "freeze":
    freeze(int(sys.argv[2]))
elif action == "finalize":
    finalize(int(sys.argv[2]))
elif action == "manifest":
    manifest()
else:
    raise ValueError(action)
