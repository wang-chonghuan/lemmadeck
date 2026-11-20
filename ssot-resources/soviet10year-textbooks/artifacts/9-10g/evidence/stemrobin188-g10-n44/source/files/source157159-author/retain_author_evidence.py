"""Retain bounded page-author inputs and receipts without changing pipeline tools."""
from __future__ import annotations

import hashlib
import json
import shutil
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

REPO = Path("/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck")
OWNED = REPO / ".intentfold/tickets/STEMROBIN-188/tmp/source157159-author"
PYTHON = REPO / ".claude/skills/ld-s10y-lesson/.venv/bin/python"
TOOL = REPO / ".claude/skills/ld-s10y-lesson/tools/p2c.py"


def entry(path):
    return {
        "path": str(path),
        "bytes": path.stat().st_size,
        "sha256": hashlib.sha256(path.read_bytes()).hexdigest(),
    }


def dump(path, value):
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def main():
    page = int(sys.argv[1])
    if page not in (157, 158, 159) or Path.cwd() != REPO:
        raise SystemExit("Wrong page or cwd")
    attempt = sys.argv[2] if len(sys.argv) > 2 else "first"
    if attempt not in ("first", "repair1"):
        raise SystemExit("Only first finalization and one targeted repair are allowed")
    pdir = OWNED / "artifacts/9-10g/pages" / f"{page:04d}"
    work = OWNED / "work/9-10g/pages" / f"{page:04d}"
    evidence = OWNED / "evidence" / f"{page:04d}" / attempt
    evidence.mkdir(parents=True, exist_ok=False)
    shutil.copy2(pdir / "page.md", evidence / "author-input.md")
    command = [
        str(PYTHON), str(TOOL), "finalize", "--book", "9-10g",
        "--page", str(page), "--root", str(OWNED / "artifacts"),
        "--work", str(OWNED / "work"),
    ]
    started = datetime.now(timezone.utc).isoformat()
    result = subprocess.run(command, cwd=REPO, capture_output=True)
    (evidence / "stdout.txt").write_bytes(result.stdout)
    (evidence / "stderr.txt").write_bytes(result.stderr)
    retained = []
    for name in ("page.md", "page.json", "audit.json"):
        path = pdir / name
        if path.exists():
            snapshot = evidence / name
            shutil.copy2(path, snapshot)
            retained.append(entry(snapshot))
    figures = []
    for path in sorted((work / "figures").glob("*.png")):
        snapshot = evidence / path.name
        shutil.copy2(path, snapshot)
        durable = pdir / "figures" / path.name
        durable.parent.mkdir(exist_ok=True)
        shutil.copy2(path, durable)
        figures.append({
            "working": entry(path),
            "receipt_snapshot": entry(snapshot),
            "durable": entry(durable),
        })
    source = pdir / "page.png"
    shutil.copy2(work / "page.png", source)
    receipt = {
        "schema": "bounded-source-author/finalize-receipt@1",
        "page": page, "attempt": attempt, "cwd": str(REPO),
        "argv": command, "started_utc": started,
        "finished_utc": datetime.now(timezone.utc).isoformat(),
        "exit_code": result.returncode,
        "author_input": entry(evidence / "author-input.md"),
        "source": entry(source),
        "prepared_inputs": [
            entry(work / name)
            for name in ("page.png", "page.grid.png", "layout.json", "page.template.md")
        ],
        "tool": entry(TOOL),
        "routed_tools": [
            entry(TOOL.parent / name)
            for name in ("blocks.py", "layout.py", "normalize.py", "mathcheck.py")
        ],
        "stdout": entry(evidence / "stdout.txt"),
        "stderr": entry(evidence / "stderr.txt"),
        "output_snapshots": retained, "figures": figures,
        "author_repair_count": int(attempt == "repair1"),
        "source_approval": False, "independent_review": False,
    }
    dump(evidence / "receipt.json", receipt)
    sys.stdout.buffer.write(result.stdout)
    sys.stderr.buffer.write(result.stderr)
    print(json.dumps({"receipt": str(evidence / "receipt.json"), "exit_code": result.returncode}))
    return result.returncode


if __name__ == "__main__":
    raise SystemExit(main())
