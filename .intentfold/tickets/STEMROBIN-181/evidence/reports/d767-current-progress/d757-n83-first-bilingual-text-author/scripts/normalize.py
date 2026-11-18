"""One native lesson/exercise layout invocation per locale; no finalization."""

import json
import sys
from pathlib import Path

repo = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
assert Path.cwd() == repo
sys.path.insert(0, str(repo / ".claude/skills/ld-s10y-lesson/tools"))
from edition import normalize_exercise_layout, normalize_lesson_layout

payload = json.load(sys.stdin)
normalize_lesson_layout(payload["lesson"])
normalize_exercise_layout(payload["exercises"])
json.dump(payload, sys.stdout, ensure_ascii=False, indent=2)
sys.stdout.write("\n")
