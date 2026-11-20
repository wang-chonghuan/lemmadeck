import copy
import sys
from pathlib import Path

sys.path.insert(0, str(Path(".claude/skills/ld-s10y-lesson/tools").resolve()))
from assemble import cut_lessons

card = {"id": "phy9-c2-s6-t11", "title": "练习 16", "page": 314}
heading = {
    "kind": "h3", "lines": ["131. 电流的能量"], "ref": "p0320#1",
    "page": 320, "printed_page": 311,
}


def rubric(text, page=314):
    return {
        "kind": "exhead", "lines": [text], "ref": "p0323#2",
        "page": 323, "printed_page": page,
    }


for text in ["练习 16", "练　习　16", "练 习 16", "**练　习　16**"]:
    blocks = [heading, rubric(text)]
    before = copy.deepcopy(blocks)
    lessons = cut_lessons(blocks, [card])
    assert len(lessons) == 2
    assert lessons[1]["printed_title"] == text
    assert lessons[1]["start_printed"] == 314
    assert lessons[1]["blocks"] == [blocks[1]]
    assert blocks == before

for text, page in [("例　题", 314), ("练习 17", 314), ("练习 16", 315)]:
    lessons = cut_lessons([heading, rubric(text, page)], [card])
    assert len(lessons) == 1
    assert lessons[0]["number"] == "131"
    assert lessons[0]["blocks"][0]["kind"] == "exhead"

try:
    cut_lessons([heading, rubric("练　习　16")], [
        card, {**card, "id": "ambiguous", "title": "练　习16"},
    ])
except ValueError as error:
    assert "多个目录卡片" in str(error)
else:
    raise AssertionError("Whitespace-equivalent ambiguous identities must fail")

print("PASS: four spacing variants, three nonmatches, ambiguity and immutable source blocks")
