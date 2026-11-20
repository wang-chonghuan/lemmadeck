"""Assemble only the closed N47 source extent, including its chapter heading."""

import json
import sys
from pathlib import Path

REPO = Path("/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck")
assert Path.cwd() == REPO
sys.path.insert(0, str(REPO / ".claude/skills/ld-s10y-lesson/tools"))
import assemble
import p2c

BASE = REPO / ".intentfold/tickets/STEMROBIN-188/tmp/g10-n47"
BOOK = BASE / "artifacts/9-10g"
stream = assemble.load_stream(BOOK)
starts = [i for i, block in enumerate(stream) if block["ref"] == "p0169#1"]
ends = [i for i, block in enumerate(stream) if block["ref"] == "p0172#12"]
assert len(starts) == len(ends) == 1
assert starts[0] < ends[0]
assert stream[starts[0]]["kind"] == "h1"
assert stream[starts[0] + 1]["ref"] == "p0169#2"
assert stream[starts[0] + 1]["kind"] == "h3"
assert stream[ends[0]]["kind"] == "h3"
selected = stream[starts[0]:ends[0]]
assert {block["page"] for block in selected} == {169, 170, 171, 172}
print(json.dumps({
    "scope": "N47 only; no prior review card or N48",
    "first": selected[0]["ref"],
    "rightBoundaryExcluded": stream[ends[0]]["ref"],
    "selectedRefs": [block["ref"] for block in selected],
    "N48Approved": False,
}))
raise SystemExit(assemble.run(
    BOOK,
    REPO / "ssot-resources/soviet10year-textbooks/toc/9-10g/zh.json",
    p2c.DEFAULT_PROFILE,
    work=BASE / "work/9-10g",
    exercise_numbering="book",
    stream=selected,
))
