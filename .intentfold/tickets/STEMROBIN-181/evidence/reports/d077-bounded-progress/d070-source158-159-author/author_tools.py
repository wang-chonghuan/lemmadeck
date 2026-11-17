"""Bounded, exclusive command receipts for this two-page source-author batch."""
from __future__ import annotations

import hashlib
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
from datetime import datetime, timezone

BASE = Path(__file__).resolve().parent
REPO = BASE.parents[4]
PYTHON = REPO / ".claude/skills/ld-s10y-lesson/.venv/bin/python"
TOOL = REPO / ".claude/skills/ld-s10y-lesson/tools/p2c.py"
ROOT = BASE / "source"
WORK = BASE / "work"
PAGES = (158, 159)


def sha(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def write_new(path, value):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("x", encoding="utf-8") as stream:
        stream.write(json.dumps(value, ensure_ascii=False, indent=2) + "\n")


def snapshot(destination, paths):
    entries = []
    for path in paths:
        if not path.is_file():
            continue
        relative = path.relative_to(BASE)
        target = destination / relative
        target.parent.mkdir(parents=True, exist_ok=True)
        if target.exists():
            raise SystemExit(f"STOP existing snapshot: {target}")
        shutil.copyfile(path, target)
        entries.append({"path": str(relative), "sha256": sha(path),
                        "bytes": path.stat().st_size})
    return entries


def run(stage, page=None, attempt="initial"):
    if stage not in ("prepare", "finalize", "vectorize"):
        raise SystemExit("Only prepare/finalize/vectorize are authorized")
    if stage != "vectorize" and page not in PAGES:
        raise SystemExit("Only pages 158 and 159 are authorized")
    if stage == "vectorize" and page is not None:
        raise SystemExit("The one vectorize run covers this isolated two-page root")
    name = f"{stage}-{page:04d}-{attempt}" if page else f"{stage}-{attempt}"
    receipt = BASE / "receipts" / name
    receipt.mkdir(parents=True, exist_ok=False)
    pages = (page,) if page else PAGES
    if stage == "prepare":
        for number in pages:
            for folder in (WORK / "10p/pages" / f"{number:04d}",
                           ROOT / "10p/pages" / f"{number:04d}"):
                if folder.exists():
                    raise SystemExit(f"STOP existing page directory: {folder}")
    if stage == "vectorize":
        actual = sorted(p.name for p in (WORK / "10p/pages").iterdir())
        if actual != ["0158", "0159"]:
            raise SystemExit(f"STOP unexpected vectorize scope: {actual}")
        if list(WORK.rglob("*.svg")):
            raise SystemExit("STOP existing SVG")
    tracked = []
    for number in pages:
        tracked.extend((ROOT / "10p/pages" / f"{number:04d}").rglob("*"))
        tracked.extend((WORK / "10p/pages" / f"{number:04d}").rglob("*"))
    before = snapshot(receipt / "before", sorted(tracked))
    command = [str(PYTHON), str(TOOL), stage, "--book", "10p",
               "--root", str(ROOT), "--work", str(WORK)]
    if page:
        command.extend(["--page", str(page)])
    started = datetime.now(timezone.utc).isoformat()
    env = {**os.environ, "PYTHONDONTWRITEBYTECODE": "1"}
    result = subprocess.run(command, cwd=REPO, env=env, capture_output=True)
    for filename, data in (("stdout.txt", result.stdout), ("stderr.txt", result.stderr)):
        with (receipt / filename).open("xb") as stream:
            stream.write(data)
    tracked = []
    for number in pages:
        tracked.extend((ROOT / "10p/pages" / f"{number:04d}").rglob("*"))
        tracked.extend((WORK / "10p/pages" / f"{number:04d}").rglob("*"))
    after = snapshot(receipt / "after", sorted(tracked))
    record = {"stage": stage, "pages": list(pages), "attempt": attempt,
              "command": command, "cwd": str(REPO),
              "started_utc": started,
              "finished_utc": datetime.now(timezone.utc).isoformat(),
              "exit_code": result.returncode, "tool_sha256": sha(TOOL),
              "before": before, "after": after,
              "stdout_sha256": sha(receipt / "stdout.txt"),
              "stderr_sha256": sha(receipt / "stderr.txt")}
    write_new(receipt / "receipt.json", record)
    sys.stdout.write(result.stdout.decode("utf-8", errors="replace"))
    sys.stderr.write(result.stderr.decode("utf-8", errors="replace"))
    print(f"ACTUAL_EXIT={result.returncode} RECEIPT={receipt / 'receipt.json'}")
    return result.returncode


if __name__ == "__main__":
    stage = sys.argv[1]
    page = int(sys.argv[2]) if len(sys.argv) > 2 else None
    attempt = sys.argv[3] if len(sys.argv) > 3 else "initial"
    raise SystemExit(run(stage, page, attempt))
