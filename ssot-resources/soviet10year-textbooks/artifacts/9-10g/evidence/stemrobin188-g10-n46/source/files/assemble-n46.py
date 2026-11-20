"""Assemble N46 only, keeping the full source pages and review-card boundary."""

import hashlib
import json
import sys
from pathlib import Path

REPO = Path("/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck")
assert Path.cwd() == REPO
sys.path.insert(0, str(REPO / ".claude/skills/ld-s10y-lesson/tools"))
import assemble
import p2c

BASE = REPO / ".intentfold/tickets/STEMROBIN-188/tmp/g10-n46"
BOOK = BASE / "artifacts/9-10g"
stream = assemble.load_stream(BOOK)
starts = [i for i, block in enumerate(stream) if block["ref"] == "p0163#5"]
ends = [i for i, block in enumerate(stream) if block["ref"] == "p0166#2"]
assert len(starts) == len(ends) == 1
assert starts[0] < ends[0]
assert stream[starts[0]]["kind"] == "h3"
assert stream[ends[0]]["kind"] == "exhead"
selected = stream[starts[0]:ends[0]]
assert {block["page"] for block in selected} == {163, 164, 165, 166}
print(json.dumps({
    "scope": "Only closed N46 objects, not the fourth-chapter review card",
    "first": selected[0]["ref"],
    "rightBoundaryExcluded": stream[ends[0]]["ref"],
    "selectedRefs": [block["ref"] for block in selected],
    "pages": [{
        "page": page,
        "sha256": hashlib.sha256((BOOK / f"pages/{page:04d}/page.json").read_bytes()).hexdigest(),
    } for page in (163, 164, 165, 166)],
    "chapterReviewApproved": False,
}, ensure_ascii=False))
raise SystemExit(assemble.run(
    BOOK,
    REPO / "ssot-resources/soviet10year-textbooks/toc/9-10g/zh.json",
    p2c.DEFAULT_PROFILE,
    work=BASE / "work/9-10g",
    exercise_numbering="book",
    stream=selected,
))
