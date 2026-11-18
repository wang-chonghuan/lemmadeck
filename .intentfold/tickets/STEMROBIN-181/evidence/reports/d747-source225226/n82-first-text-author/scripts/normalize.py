"""One layout pass per locale, using the edition's existing prose normalizer."""

import json
import sys
from pathlib import Path

repo = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
sys.path.insert(0, str(repo / ".claude/skills/ld-s10y-lesson/tools"))
from edition import normalize_prose_layout

lesson = json.load(sys.stdin)
for block in lesson["prose"]:
    if block["kind"] == "p":
        block["text"] = normalize_prose_layout(block["text"])
json.dump(lesson, sys.stdout, ensure_ascii=False, indent=2)
sys.stdout.write("\n")
