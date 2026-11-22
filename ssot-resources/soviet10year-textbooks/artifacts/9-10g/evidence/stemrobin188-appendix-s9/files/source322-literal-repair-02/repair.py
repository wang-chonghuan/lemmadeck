import copy
import hashlib
import json
from pathlib import Path
import sys

REPO = Path("/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck")
assert Path.cwd() == REPO
TMP = REPO / ".intentfold/tickets/STEMROBIN-188/tmp"
OWN = TMP / "source322-literal-repair-02"
sys.path.insert(0, str(REPO / ".claude/skills/ld-s10y-lesson/tools"))
import blocks


def binding(file):
    return {"path": str(file), "sha256": hashlib.sha256(file.read_bytes()).hexdigest()}


review_path = TMP / "source321322-boundary-affected-FIRST-review-01/review.json"
source = TMP / "source321322-author/artifacts/9-10g/pages/0322"
before = json.loads((source / "page.json").read_text())
after = copy.deepcopy(before)
edits = []
for block_index, line_index, old, new in (
    (2, 0, "只有 $k=l=m=0$ 时等式", "只在 $k=l=m=0$ 时等式"),
    (9, 1, "基础的，由 A·H·柯尔", "基础的、由 A·H·柯尔"),
):
    text = after["blocks"][block_index]["lines"][line_index]
    assert text.count(old) == 1
    changed = text.replace(old, new)
    after["blocks"][block_index]["lines"][line_index] = changed
    edits.append({
        "ref": f"p0322#{block_index + 1}", "line": line_index + 1,
        "before": text, "after": changed,
    })
assert before["meta"] == after["meta"]
assert blocks.printed_lines(after["blocks"]) == 22
for old, new in zip(before["blocks"], after["blocks"]):
    assert {k: v for k, v in old.items() if k != "lines"} == {
        k: v for k, v in new.items() if k != "lines"
    }
md = blocks.dump(after["meta"], after["blocks"], 322)
meta, parsed = blocks.parse(md)
assert meta == after["meta"]
assert parsed == after["blocks"]
target = OWN / "artifacts/9-10g/pages/0322"
target.mkdir(parents=True, exist_ok=False)
with (target / "page.md").open("x") as handle:
    handle.write(md)
with (target / "page.json").open("x") as handle:
    json.dump(after, handle, ensure_ascii=False, indent=2)
    handle.write("\n")
record = {
    "status": "TWO_LITERAL_REPAIRS_AFFECTED_REVIEW_PENDING",
    "sourceReview": binding(review_path), "edits": edits,
    "original": [binding(source / name) for name in ("page.md", "page.json", "audit.json")],
    "candidate": [binding(target / name) for name in ("page.md", "page.json")],
    "unchangedMetaFlagsFormulas": True, "printedLines": 22,
    "nativeFinalizerReplays": 0, "imageLoads": 0, "contentRevisions": 1,
    "nativeAuditReuse": "Original22/22 audit unchanged; this is not a new native finalize.",
    "wholeLessonApproved": False,
}
with (OWN / "repair.json").open("x") as handle:
    json.dump(record, handle, ensure_ascii=False, indent=2)
    handle.write("\n")
print(json.dumps({"repair": binding(OWN / "repair.json")}))
