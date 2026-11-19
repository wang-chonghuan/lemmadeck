import json
import sys
from pathlib import Path

repo = Path("/Users/yong/.codex/worktrees/d9b1/lemmadeck")
assert Path.cwd() == repo
sys.path.insert(0, str(repo / ".claude/skills/ld-s10y-lesson/tools"))
import edition

source = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
selected = set(sys.argv[2:])
rows = [row for row in source["lessons"] if row["id"] in selected]
assert rows and {row["id"] for row in rows} == selected
book = Path("ssot-resources/soviet10year-textbooks/artifacts/7a")
edition.update_book_index(
    book,
    book / "editions/modern-us-neutral",
    Path(".claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json"),
    rows,
)
