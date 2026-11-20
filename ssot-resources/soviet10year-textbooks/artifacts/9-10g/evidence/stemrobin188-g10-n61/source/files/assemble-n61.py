"""Assemble only admitted N61 between actual source topic headings."""

import hashlib
import json
import sys
from pathlib import Path

REPO = Path("/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck")
assert Path.cwd() == REPO
sys.path.insert(0, str(REPO / ".claude/skills/ld-s10y-lesson/tools"))
import assemble
import p2c

BASE = REPO / ".intentfold/tickets/STEMROBIN-188/tmp/g10-n61"
BOOK = BASE / "artifacts/9-10g"
admission = json.loads((BASE / "source-admission.json").read_text())
assert admission["status"] == "pass-for-readable-n61-source-only-with-local-holds"
for binding in admission["bindings"]:
    assert hashlib.sha256(Path(binding["path"]).read_bytes()).hexdigest() == binding["sha256"]
stream = assemble.load_stream(BOOK)
by_ref = {block["ref"]: block for block in stream}
assert len(by_ref) == len(stream)
starts = [i for i, block in enumerate(stream) if block["ref"] == "p0218#9"]
ends = [i for i, block in enumerate(stream) if block["ref"] == "p0222#1"]
assert len(starts) == len(ends) == 1 and starts[0] < ends[0]
selected = stream[starts[0]:ends[0]]
assert selected[0]["kind"] == by_ref["p0222#1"]["kind"] == "h3"
assert sum(b["kind"] in {"h2", "h3"} for b in selected) == 1
assert [b["id"] for b in selected if b["kind"] == "fig"] == [
    f"fig-g10-{number}" for number in range(83, 89)
]
assert [b["label"] for b in selected if b["kind"] == "ex"] == [
    "206", "207", "208", "209", "209", "210", "211", "212", "213", "214", "215",
]
assert all(b.get("numbering_scope") == "g10" for b in selected)
ancestor = by_ref["p0212#1"]
assert ancestor["kind"] == "h1"
assert ancestor["lines"] == ["第六章 旋转图形"]
print(json.dumps({
    "scope": "N61 only", "selectedRefs": [b["ref"] for b in selected],
    "first": "p0218#9", "rightBoundaryExcluded": "p0222#1",
    "incomingRecallJoin": ["p0218#12", "p0219#5"],
    "frustumDelimiterJoin": ["p0219#15", "p0220#5"],
    "exercise209Join": ["p0220#12", "p0221#1"],
    "N60Approved": False, "N62Approved": False,
}))
raise SystemExit(assemble.run(
    BOOK, REPO / "ssot-resources/soviet10year-textbooks/toc/9-10g/zh.json",
    p2c.DEFAULT_PROFILE, work=BASE / "work/9-10g",
    exercise_numbering="book", stream=[ancestor, *selected],
))
