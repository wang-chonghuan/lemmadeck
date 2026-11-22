import copy
import hashlib
import json
from pathlib import Path
import sys

REPO = Path("/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck")
assert Path.cwd() == REPO
TMP = REPO / ".intentfold/tickets/STEMROBIN-188/tmp"
OWN = TMP / "appendix-s9-text-rebind-02"
sys.path.insert(0, str(REPO / ".claude/skills/ld-s10y-lesson/tools"))
import edition


def binding(file):
    return {"path": str(file), "sha256": hashlib.sha256(file.read_bytes()).hexdigest()}


old_path = TMP / "appendix-s9-draft-02/work/adapt/9-10g/modern-us-neutral/lessons/geo910-appendix-s9/lesson.template.json"
target = TMP / "appendix-s9-draft-03/work/adapt/9-10g/modern-us-neutral/lessons/geo910-appendix-s9/lesson.template.json"
old = json.loads(old_path.read_text())
initial = json.loads(target.read_text())
current = copy.deepcopy(initial)
changes = (
    ("只有 $k=l=m=0$ 时等式", "只在 $k=l=m=0$ 时等式"),
    ("基础的，由 A·H·柯尔", "基础的、由 A·H·柯尔"),
)


def repaired(text):
    for before, after in changes:
        text = text.replace(before, after)
    return text


assert len(old["prose"]) == len(current["prose"]) == 28
for old_item, item in zip(old["prose"], current["prose"]):
    assert old_item["source_refs"] == item["source_refs"]
    assert repaired(old_item["source_text"]) == item["source_text"]
    item["text"] = repaired(old_item["text"])
    item["changes"] = copy.deepcopy(old_item["changes"])
    item["numeric_changes"] = copy.deepcopy(old_item["numeric_changes"])
    item["historical_entities"] = copy.deepcopy(old_item["historical_entities"])
current["section_breaks"] = [
    {key: repaired(value) for key, value in pair.items()}
    for pair in old["section_breaks"]
]
closing = current["prose"][-1]
assert closing["source_refs"] == ["p0322#10"]
closing["historical_entities"] = [{
    "term": "苏联",
    "reason": "p0322#10实际记录韦尔公理在苏联七、九年级几何课程中的教学史；保留原书历史国家和课程身份，不是虚构文化场景。",
}, {
    "term": "韦尔",
    "reason": "p0322#10及本课标题明确归属韦尔提出的几何公理体系；这是数学史人物，不能替换为虚构人物。",
}, {
    "term": "柯尔莫戈洛夫",
    "reason": "p0322#10实际说明柯尔莫戈洛夫公理体系与韦尔体系的关系；保持数学史人物身份及原印初始字母，不新增史实。",
}]
normalized = copy.deepcopy(current)
edition.normalize_lesson_layout(normalized)
assert [item["text"] for item in normalized["prose"]] == [
    item["text"] for item in current["prose"]
]
assert len(current["section_breaks"]) == 6
assert current["source"] == initial["source"]
OWN.mkdir(parents=True, exist_ok=True)
with (OWN / "fresh-prepared.template.json").open("x") as handle:
    handle.write(target.read_text())
with target.open("w") as handle:
    json.dump(current, handle, ensure_ascii=False, indent=2)
    handle.write("\n")
with (OWN / "normalized-lesson.json").open("x") as handle:
    json.dump(normalized, handle, ensure_ascii=False, indent=2)
    handle.write("\n")
record = {
    "status": "S9_SOURCE_REBOUND_LAYOUT_PRESERVED_HISTORY_DECLARED_REVIEW_PENDING",
    "oldAuthoredTemplate": binding(old_path),
    "freshPreparedSnapshot": binding(OWN / "fresh-prepared.template.json"),
    "currentTemplate": binding(target),
    "normalized": binding(OWN / "normalized-lesson.json"),
    "sourceRepair": binding(TMP / "source322-literal-repair-02/repair.json"),
    "scopedAssembly": binding(TMP / "appendix-s9-draft-03/report.json"),
    "changes": ["two independently requested source literal repairs", "fresh raw source snapshot and hash", "three source-bound historical-entity declarations"],
    "unchanged": ["all formulas", "all other words", "28 prose blocks", "six semantic anchors", "zero exercises", "zero figures", "original author layout"],
    "sourceFinalizerReplays": 0, "imageLoads": 0,
    "modernTextReviewPassed": False, "wholeLessonApproved": False,
}
with (OWN / "rebind.json").open("x") as handle:
    json.dump(record, handle, ensure_ascii=False, indent=2)
    handle.write("\n")
print(json.dumps({"rebind": binding(OWN / "rebind.json")}))
