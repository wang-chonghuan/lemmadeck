import json
import sys
from pathlib import Path

sys.path.insert(0, ".claude/skills/ld-s10y-lesson/tools")
import assemble

toc = [{"id": "exercise-card", "title": "练习 11", "page": 262}]
def block(kind, text, page, index, label=None):
    return {"kind": kind, "lines": [text], "page": page + 10,
            "printed_page": page, "ref": f"p{page + 10:04d}#{index}",
            "label": label}

stream = [
    block("h3", "101. 质能联系", 259, 1),
    block("exhead", "复习题", 262, 1),
    block("ex", "原课第一题", 262, 2, "1"),
    block("exhead", "**练习 11**", 262, 3),
    block("ex", "独立卡第一题", 262, 4, "1"),
]
lessons = assemble.cut_lessons(stream, toc)
assert len(lessons) == 2
assert lessons[0]["number"] == "101"
assert lessons[1]["number"] is None
assert lessons[1]["title"] == "练习 11"
assert lessons[1]["printed_title"] == "**练习 11**"
for lesson, expected_group in zip(lessons, ["复习题", "**练习 11**"]):
    prose, exercises = assemble.split_lesson(lesson, "lesson")
    assert prose == []
    assert len(exercises) == 1
    assert exercises[0]["group"] == expected_group
assert len(assemble.cut_lessons(stream)) == 1
wrong_page = [{**toc[0], "page": 261}]
assert len(assemble.cut_lessons(stream, wrong_page)) == 1
try:
    assemble.cut_lessons(stream, [toc[0], {**toc[0], "id": "duplicate"}])
except ValueError:
    pass
else:
    raise AssertionError("Ambiguous independent heading did not fail")

root = Path(".intentfold/tickets/STEMROBIN-181/tmp/d1263-n101-t11-first-preparation/root/10p")
assert json.loads((root / "lessons/phy10-c2-s4-n101/exercises.json").read_text())["count"] == 4
assert json.loads((root / "lessons/phy10-c2-s4-t11/exercises.json").read_text())["count"] == 3
assert json.loads((root / "lessons/phy10-c2-s4-t11/lesson.json").read_text())["prose"] == []
print("PASS: independent TOC exhead, ordinary group, no TOC, wrong page, ambiguity, actual 4+3 split")
