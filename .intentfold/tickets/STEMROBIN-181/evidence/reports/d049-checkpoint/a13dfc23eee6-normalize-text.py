import json
import sys
from pathlib import Path

repo = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
folder = Path(__file__).resolve().parent
assert folder == repo / ".intentfold/tickets/STEMROBIN-181/tmp/d049-10p-n43-author"
assert Path.cwd() == repo
sys.path.insert(0, str(repo / ".claude/skills/ld-s10y-lesson/tools"))
import edition

document = json.load(sys.stdin)
changes = []
for block in document["prose"]:
    if block["kind"] != "p":
        continue
    before = block["text"]
    block["text"] = edition.normalize_prose_layout(before)
    changes.append({
        "source_refs": block["source_refs"],
        "before": before,
        "after": block["text"],
    })
print(json.dumps({
    "document": document,
    "normalizer": "edition.normalize_prose_layout",
    "changes": changes,
}, ensure_ascii=False, indent=2))
