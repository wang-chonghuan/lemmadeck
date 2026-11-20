import copy
import hashlib
import json
import re
import sys
from pathlib import Path

REPO = Path("/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck")
assert Path.cwd() == REPO
sys.path.insert(0, str(REPO / ".claude/skills/ld-s10y-lesson/tools"))
from edition import normalize_lesson_layout, prose_flow_contract

OUT = REPO / ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d295-native-layout"
OUT.mkdir(parents=True, exist_ok=True)


def binding(file):
    raw = file.read_bytes()
    return {"path": str(file), "bytes": len(raw), "sha256": hashlib.sha256(raw).hexdigest()}


def save(file, value):
    file.parent.mkdir(parents=True, exist_ok=True)
    with file.open("x") as stream:
        stream.write(json.dumps(value, ensure_ascii=False, indent=2) + "\n")


def compact(text):
    return re.sub(r"\s+", "", text)


changes = []
for edition in ["modern-us-neutral", "modern-us-neutral-en"]:
    for number in [17, 18, 19]:
        work = "d1816-d287/work" if number == 19 else "d1816-d276/source-work"
        file = REPO / f".tmp/STEMROBIN-181/{work}/adapt/10p/{edition}/lessons/phy10-c1-s3-n{number}/lesson.template.json"
        old = json.loads(file.read_text())
        before = binding(file)
        old_flow, errors = prose_flow_contract(old["prose"], old["section_breaks"])
        assert not errors, errors
        new = copy.deepcopy(old)
        normalize_lesson_layout(new)
        normalized_flow, errors = prose_flow_contract(new["prose"], [])
        assert not errors, errors
        for source, target in zip(old["prose"], new["prose"]):
            assert compact(source["text"]) == compact(target["text"])
            for key in set(source) | set(target):
                if key not in {"text", "changes"}:
                    assert source.get(key) == target.get(key), key
        old_paragraphs = old_flow["paragraphs"]
        new_paragraphs = normalized_flow["paragraphs"]
        assert compact("\n".join(item["text"] for item in old_paragraphs)) == compact(
            "\n".join(item["text"] for item in new_paragraphs)
        )
        positions = {}
        offset = 0
        for index, paragraph in enumerate(new_paragraphs):
            positions[offset] = index
            offset += len(compact(paragraph["text"]))
        old_offset = 0
        old_breaks = {item["index"] for item in old_flow["boundaries"]}
        new_breaks = []
        for index, paragraph in enumerate(old_paragraphs):
            if index in old_breaks:
                assert old_offset in positions, "Concept boundary moved inside a paragraph"
                target = positions[old_offset]
                assert target > 0
                new_breaks.append({"before": new_paragraphs[target - 1]["text"],
                                   "after": new_paragraphs[target]["text"]})
            old_offset += len(compact(paragraph["text"]))
        new["section_breaks"] = new_breaks
        flow, errors = prose_flow_contract(new["prose"], new["section_breaks"])
        assert not errors, errors
        assert len(flow["boundaries"]) == len(old_flow["boundaries"])
        if number == 19:
            assert new == old, "Recovered Chinese/new English N19 must stay byte-content equivalent"
        original = OUT / "before" / edition / f"n{number}.json"
        save(original, old)
        changed = new != old
        if changed:
            file.write_text(json.dumps(new, ensure_ascii=False, indent=2) + "\n")
        changes.append({"lesson": old["id"], "edition": edition, "before": before,
                        "original": binding(original), "after": binding(file),
                        "changed": changed, "wordingAndFormulasChanged": False,
                        "conceptPositionsChanged": False,
                        "oldParagraphs": len(old_paragraphs), "newParagraphs": len(new_paragraphs),
                        "boundaries": flow["boundaries"]})

result = OUT / "result.json"
save(result, {"batch": "D295", "status": "pass", "changes": changes,
              "newContentReviews": 0, "N19ExactRecoveryPreserved": True,
              "wordingAndFormulasChanged": False, "conceptPositionsChanged": False,
              "sourceSnapshotsChanged": False, "databaseWrites": False,
              "completeCoursesAdded": 0, "paidCalls": 0})
print(json.dumps({"result": binding(result)}))
