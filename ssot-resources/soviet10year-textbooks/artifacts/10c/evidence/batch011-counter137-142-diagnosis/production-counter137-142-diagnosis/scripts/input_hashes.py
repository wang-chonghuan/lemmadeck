#!/usr/bin/env python3
"""Hash only the remaining frozen diagnostic inputs; page 137 has transferred."""
import hashlib
import json
from pathlib import Path

OWNED = Path(__file__).resolve().parents[1]
ROOT = OWNED.parents[4]
paths = [
    ROOT / ".claude/skills/ld-s10y-lesson/tools/layout.py",
    ROOT / ".claude/skills/ld-s10y-lesson/tools/p2c.py",
    ROOT / ".intentfold/tickets/STEMROBIN-184/tmp/production-source10c136-139-review/source-first.md",
    ROOT / ".intentfold/tickets/STEMROBIN-184/tmp/production-source10c136-139-review/stage-b.md",
    ROOT / ".intentfold/tickets/STEMROBIN-184/tmp/production-source10c140-143-review/source-first.md",
    ROOT / ".intentfold/tickets/STEMROBIN-184/tmp/production-source10c140-143-review/source-comparison.md",
]
for page in (140, 141, 142):
    prepared = ROOT / (
        ".intentfold/tickets/STEMROBIN-184/tmp/production-source10c140-143/"
        f"10c/pages/{page:04d}"
    )
    paths.extend(prepared / name for name in ("page.png", "layout.json"))
    durable = ROOT / f"ssot-resources/soviet10year-textbooks/artifacts/10c/pages/{page:04d}"
    paths.extend(durable / name for name in ("page.md", "page.json", "audit.json"))
    first = ROOT / (
        ".intentfold/tickets/STEMROBIN-184/tmp/"
        f"production-source10c140-143-first-finalize/{page:04d}"
    )
    paths.extend(first / name for name in
                 ("command.json", "stdout.txt", "stderr.txt", "audit.json", "page.md", "page.json"))

print(json.dumps({
    "transferred_137": "Parent owns the separator metadata decision; no further page 137 access or revalidation",
    "inputs": [{
        "path": str(path),
        "sha256": hashlib.sha256(path.read_bytes()).hexdigest(),
        "size": path.stat().st_size,
    } for path in paths],
}, indent=2))
