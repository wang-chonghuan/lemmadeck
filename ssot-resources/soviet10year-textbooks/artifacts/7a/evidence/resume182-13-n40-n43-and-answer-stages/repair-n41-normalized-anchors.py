import copy
import hashlib
import json
import sys
from pathlib import Path

ROOT = Path("/Users/yong/.codex/worktrees/d9b1/lemmadeck")
assert Path.cwd() == ROOT
sys.path.insert(0, str(ROOT / ".claude/skills/ld-s10y-lesson/tools"))
import edition

BASE = ROOT / ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13"
target = BASE / "n41-n43-adapt-work/adapt/7a/modern-us-neutral/lessons/alg7-c4-s2-n41/lesson.template.json"
data = json.loads(target.read_text())
first = BASE / "n41-n42-modern-author/first-authored/alg7-c4-s2-n41/lesson.template.json"
baseline = json.loads(first.read_text())
assert data == baseline
flow, errors = edition.prose_flow_contract(data["prose"], data["section_breaks"])
assert not errors, errors
normalized = copy.deepcopy(data)
edition.normalize_lesson_layout(normalized)
new_flow, errors = edition.prose_flow_contract(normalized["prose"], [])
assert not errors, errors
original_indices = flow["resolvedBreaks"]
assert original_indices == [8, 16, 27]
block_pairs = [(flow["paragraphs"][i - 1]["blockIndex"],
                flow["paragraphs"][i]["blockIndex"]) for i in original_indices]
assert block_pairs == [(4, 5), (8, 9), (15, 16)]
indices = []
for before_block, after_block in block_pairs:
    matches = [i for i in range(1, len(new_flow["paragraphs"]))
               if new_flow["paragraphs"][i - 1]["blockIndex"] == before_block
               and new_flow["paragraphs"][i]["blockIndex"] == after_block]
    assert len(matches) == 1
    indices.append(matches[0])
data["section_breaks"] = [
    {"before": new_flow["paragraphs"][i - 1]["text"],
     "after": new_flow["paragraphs"][i]["text"]}
    for i in indices
]
check = copy.deepcopy(data)
edition.normalize_lesson_layout(check)
verified, errors = edition.prose_flow_contract(check["prose"], check["section_breaks"])
assert not errors, errors
assert verified["resolvedBreaks"] == indices
unchanged = copy.deepcopy(data)
unchanged["section_breaks"] = baseline["section_breaks"]
assert unchanged == baseline
with (BASE / "n41-anchor-repair.json").open("x") as output:
    json.dump({
        "first": {"path": str(first), "sha256": hashlib.sha256(first.read_bytes()).hexdigest()},
        "changed": "section_breaks only; original prose blocks and boundary block pairs preserved",
        "originalIndices": original_indices, "normalizedIndices": indices,
        "blockPairs": block_pairs, "before": baseline["section_breaks"], "after": data["section_breaks"],
        "normalizedProseReused": True, "imagesOpened": 0, "sourceMathReviewRepeated": False,
    }, output, ensure_ascii=False, indent=2)
    output.write("\n")
target.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n")
print(json.dumps({"status": "anchors-rebound", "indices": indices}))
