import hashlib
import json
from pathlib import Path
import sys

REPO = Path("/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck")
assert Path.cwd() == REPO
TMP = REPO / ".intentfold/tickets/STEMROBIN-188/tmp"
OWN = TMP / "appendix-s9-finish-01"
CORE = REPO / "ssot-resources/soviet10year-textbooks/artifacts/9-10g"
SCOPED = TMP / "appendix-s9-draft-03/artifacts/9-10g"
LESSON = "geo910-appendix-s9"
sys.path.insert(0, str(REPO / ".claude/skills/ld-s10y-lesson/tools"))
import edition


def binding(file):
    return {"path": str(file), "sha256": hashlib.sha256(file.read_bytes()).hexdigest()}


before = json.loads((OWN / "source-index-before.json").read_text())
current = json.loads((CORE / "book.json").read_text())
previous_ids = [row["id"] for row in before["lessons"]]
current_ids = [row["id"] for row in current["lessons"]]
assert [value for value in current_ids if value != LESSON] == previous_ids
assert current_ids.count(LESSON) == 1
source_index_receipt = OWN / "source-reindex-01/command.json"
assert json.loads(source_index_receipt.read_text())["exitCode"] == 0
modern = CORE / "editions/modern-us-neutral"
scoped_modern = SCOPED / "editions/modern-us-neutral"
rows = json.loads((scoped_modern / "book.json").read_text())["lessons"]
assert len(rows) == 1 and rows[0]["id"] == LESSON
old_modern = json.loads((OWN / "edition-index-before.json").read_text())
old_rows = [row for row in old_modern["lessons"] if row["id"] != LESSON]
edition.update_book_index(
    CORE, modern,
    REPO / ".claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json",
    rows,
)
new_modern = json.loads((modern / "book.json").read_text())
assert [row for row in new_modern["lessons"] if row["id"] != LESSON] == old_rows
assert [row["id"] for row in new_modern["lessons"]].count(LESSON) == 1
record = {
    "status": "S9_NATIVE_READY_INDEX_ATTACHED_RENDER_DISPLAY_PENDING",
    "lesson": LESSON,
    "sourceIndex": binding(CORE / "book.json"),
    "editionIndex": binding(modern / "book.json"),
    "sourceIndexReceipt": binding(source_index_receipt),
    "sourceIndexOtherIDsUnchanged": True,
    "editionOtherRowsUnchanged": True,
    "sourceRebuild": False,
    "wholeBookCanonicalSourceApproved": False,
}
with (OWN / "index.json").open("x") as handle:
    json.dump(record, handle, ensure_ascii=False, indent=2)
    handle.write("\n")
print(json.dumps({"index": binding(OWN / "index.json")}))
