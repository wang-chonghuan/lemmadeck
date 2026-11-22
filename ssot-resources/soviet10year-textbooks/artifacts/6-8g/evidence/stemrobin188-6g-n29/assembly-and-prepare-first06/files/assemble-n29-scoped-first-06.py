import json
from pathlib import Path
import sys

REPO = Path("/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck")
assert Path.cwd() == REPO
sys.path.insert(0, str(REPO / ".claude/skills/ld-s10y-lesson/tools"))
import assemble

own = REPO / ".intentfold/tickets/STEMROBIN-188/tmp/n29-draft-first-06"
book = own / "artifacts/6-8g"
stream = assemble.load_stream(book)
by_ref = {block["ref"]: block for block in stream}
ancestor, section = by_ref["p0068#1"], by_ref["p0132#6"]
left_ref, right_ref = "p0135#4", "p0138#4"
start = next(i for i, block in enumerate(stream) if block["ref"] == left_ref)
end = next(i for i, block in enumerate(stream) if block["ref"] == right_ref)
assert start < end
assert ancestor["kind"] == "h1" and section["kind"] == "h2"
assert "".join(section["lines"]) == "§4. 圆周"
assert by_ref[left_ref]["kind"] == "h3"
assert "".join(by_ref[left_ref]["lines"]) == "29. 直线和圆周的相关位置"
assert by_ref[right_ref]["kind"] == "h3"
assert "".join(by_ref[right_ref]["lines"]) == "30. 作图问题"
selected = stream[start:end]
assert [block["ref"] for block in selected if block["kind"] == "h3"] == [left_ref]
assert not any(block["kind"] in ("h1", "h2") for block in selected)
status = assemble.run(
    book,
    REPO / "ssot-resources/soviet10year-textbooks/toc/6-8g/zh.json",
    REPO / ".claude/skills/ld-s10y-lesson/profiles/soviet-cn.json",
    strict=True,
    work=own / "work/6-8g",
    exercise_numbering="book",
    stream=[ancestor, section, *selected],
)
if status == 0:
    index = json.loads((book / "book.json").read_text())
    assert [lesson["id"] for lesson in index["lessons"]] == ["geo68-c2-s4-n29"]
    assert index["audit"]["errors"] == []
    exercises = json.loads((book / "lessons/geo68-c2-s4-n29/exercises.json").read_text())
    assert [item["number"] for item in exercises["exercises"]] == [
        str(number) for number in range(364, 373)
    ]
print(json.dumps({
    "nativeExitCode": status,
    "status": "N29_FIRST_SELECTED_RAW_ASSEMBLY_ONLY",
    "boundaries": [left_ref, right_ref],
    "selectedBlocks": len(selected),
    "localOpaqueMarkersAndDamagedLabelsPreserved": True,
    "N28OrN30Assembled": False,
    "wholeModernLessonApproved": False,
    "published": False,
}))
sys.exit(status)
