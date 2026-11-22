"""Use the existing native normalizer, with no publication or source review."""

import json
import sys
from pathlib import Path

ROOT = Path("/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck")
TOOLS = ROOT / ".claude/skills/ld-s10y-lesson/tools"
if Path.cwd() != ROOT:
    raise SystemExit("wrong cwd")
sys.path.insert(0, str(TOOLS))
from edition import normalize_lesson_layout

document = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
normalize_lesson_layout(document)
print(json.dumps(document, ensure_ascii=False, indent=2))
