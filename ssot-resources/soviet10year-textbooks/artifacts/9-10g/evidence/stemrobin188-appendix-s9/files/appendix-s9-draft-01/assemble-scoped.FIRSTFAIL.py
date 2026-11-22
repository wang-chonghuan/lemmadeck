import hashlib
import json
from pathlib import Path
import shutil
import sys

REPO = Path("/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck")
assert Path.cwd() == REPO
TMP = REPO / ".intentfold/tickets/STEMROBIN-188/tmp"
OWN = TMP / "appendix-s9-draft-01"
sys.path.insert(0, str(REPO / ".claude/skills/ld-s10y-lesson/tools"))
import assemble


def binding(file):
    return {"path": str(file), "sha256": hashlib.sha256(file.read_bytes()).hexdigest()}


book = OWN / "artifacts/9-10g"
inputs = []
for page in (320, 321, 322):
    root = TMP / ("source319320-author" if page == 320 else "source321322-author")
    source = root / f"artifacts/9-10g/pages/{page:04d}"
    target = book / f"pages/{page:04d}"
    target.mkdir(parents=True, exist_ok=False)
    for name in ("page.md", "page.json"):
        file = source / name
        shutil.copyfile(file, target / name)
        inputs.append(binding(file))
stream = assemble.load_stream(book)
start = next(i for i, block in enumerate(stream)
             if block["kind"] == "h3" and "韦尔提出的几何公理体系" in "".join(block["lines"]))
selected = stream[start:]
assert not any(block["kind"] in ("h1", "h2", "h3") for block in selected[1:])
assert not any(block["kind"] in ("ex", "fig") for block in selected)
boundary = TMP / "source323324-author/artifacts/9-10g/pages/0323/page.json"
boundary_block = assemble.load_stream(book, [(boundary, json.loads(boundary.read_text()))])[0]
assert boundary_block["kind"] == "h1"
assert "".join(boundary_block["lines"]) == "答案和提示"
ancestor = TMP / "source302-author/artifacts/9-10g/pages/0302/page.json"
heading = assemble.load_stream(book, [(ancestor, json.loads(ancestor.read_text()))])[0]
assert heading["kind"] == "h1" and heading["ref"] == "p0302#1"
status = assemble.run(
    book, REPO / "ssot-resources/soviet10year-textbooks/toc/9-10g/zh.json",
    REPO / ".claude/skills/ld-s10y-lesson/profiles/soviet-cn.json",
    strict=True, work=OWN / "work/9-10g", exercise_numbering="book",
    stream=[heading, *selected],
)
record = {
    "status": "RAW_SCOPED_DRAFT_SOURCE_REVIEW_PENDING" if status == 0 else "RAW_ASSEMBLY_FAILED",
    "lesson": "geo910-appendix-s9", "inputs": inputs,
    "selectedRefs": [block["ref"] for block in selected],
    "sourceStart": selected[0]["ref"], "excludedRightBoundary": "p0323#1",
    "boundarySource": binding(boundary),
    "sourceReviewPending": [320, 321, 322, "323-title-only"],
    "bookAnswersIncluded": False, "sourceFinalizerReplays": 0, "imageLoads": 0,
    "wholeLessonApproved": False, "corePromoted": False, "published": False,
}
if status == 0:
    lesson_dir = book / "lessons/geo910-appendix-s9"
    lesson = json.loads((lesson_dir / "lesson.json").read_text())
    exercises = json.loads((lesson_dir / "exercises.json").read_text())
    record.update(
        proseBlocks=len(lesson["prose"]), exercises=len(exercises["exercises"]),
        outputs=[binding(lesson_dir / name) for name in ("lesson.json", "lesson.md", "exercises.json")],
    )
with (OWN / "report.json").open("x") as handle:
    json.dump(record, handle, ensure_ascii=False, indent=2)
    handle.write("\n")
print(json.dumps({"exitCode": status, "report": binding(OWN / "report.json")}))
sys.exit(status)
