import copy
import hashlib
import json
from pathlib import Path
import sys

REPO = Path("/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck")
assert Path.cwd() == REPO
TMP = REPO / ".intentfold/tickets/STEMROBIN-188/tmp"
OWN = TMP / "source320-heading-repair-02"
sys.path.insert(0, str(REPO / ".claude/skills/ld-s10y-lesson/tools"))
import blocks


def binding(file):
    return {"path": str(file), "sha256": hashlib.sha256(file.read_bytes()).hexdigest()}


source = TMP / "source319320-author/artifacts/9-10g/pages/0320"
before = json.loads((source / "page.json").read_text())
after = copy.deepcopy(before)
heading = after["blocks"][6]
assert heading["kind"] == "h2"
assert "".join(heading["lines"]) == "韦尔提出的几何公理体系"
heading["kind"] = "h3"
assert after["meta"] == before["meta"]
assert blocks.printed_lines(after["blocks"]) == 23
for index, (old, new) in enumerate(zip(before["blocks"], after["blocks"])):
    if index == 6:
        assert {k: v for k, v in old.items() if k != "kind"} == {
            k: v for k, v in new.items() if k != "kind"
        }
    else:
        assert old == new
md = blocks.dump(after["meta"], after["blocks"], 320)
meta, parsed = blocks.parse(md)
assert meta == before["meta"]
assert [{k: v for k, v in item.items() if k != "id"} for item in parsed] == [
    {k: v for k, v in item.items() if k != "id"} for item in after["blocks"]
]
target = OWN / "artifacts/9-10g/pages/0320"
target.mkdir(parents=True, exist_ok=False)
with (target / "page.md").open("x") as handle:
    handle.write(md)
with (target / "page.json").open("x") as handle:
    json.dump(after, handle, ensure_ascii=False, indent=2)
    handle.write("\n")
record = {
    "status": "STRUCTURAL_HEADING_REPAIR_AFFECTED_REVIEW_PENDING",
    "ref": "p0320#7",
    "change": {"kind": {"before": "h2", "after": "h3"}},
    "basis": binding(TMP / "source317320-FIRST-review-01/review.json"),
    "reason": "Observed independent Weyl appendix; native h3 opens its TOC card. Internal groups remain prose.",
    "original": [binding(source / name) for name in ("page.md", "page.json", "audit.json")],
    "candidate": [binding(target / name) for name in ("page.md", "page.json")],
    "unchanged": ["all words", "all formulas", "all flags", "all metadata", "all exercise blocks"],
    "printedLines": 23,
    "nativeAuditReuse": "Original23/23 audit unchanged; no new audit or native finalize claim.",
    "nativeFinalizerReplays": 0,
    "imageLoads": 0,
    "structuralRevisions": 1,
    "wholeLessonApproved": False,
    "corePromoted": False,
}
with (OWN / "repair.json").open("x") as handle:
    json.dump(record, handle, ensure_ascii=False, indent=2)
    handle.write("\n")
print(json.dumps({"repair": binding(OWN / "repair.json")}))
