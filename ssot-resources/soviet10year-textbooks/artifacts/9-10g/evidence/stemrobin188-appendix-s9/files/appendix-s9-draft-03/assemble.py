import hashlib
import json
from pathlib import Path
import shutil
import sys

REPO = Path("/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck")
assert Path.cwd() == REPO
TMP = REPO / ".intentfold/tickets/STEMROBIN-188/tmp"
OWN = TMP / "appendix-s9-draft-03"
sys.path.insert(0, str(REPO / ".claude/skills/ld-s10y-lesson/tools"))
import assemble


def binding(file):
    return {"path": str(file), "sha256": hashlib.sha256(file.read_bytes()).hexdigest()}


book = OWN / "artifacts/9-10g"
inputs = []
sources = {
    302: TMP / "source302-period-repair-02",
    320: TMP / "source320-heading-repair-02/artifacts/9-10g/pages/0320",
    321: TMP / "source321322-author/artifacts/9-10g/pages/0321",
    322: TMP / "source322-literal-repair-02/artifacts/9-10g/pages/0322",
}
for page, source in sources.items():
    target = book / f"pages/{page:04d}"
    target.mkdir(parents=True, exist_ok=False)
    for name in ("page.md", "page.json"):
        file = source / name
        shutil.copyfile(file, target / name)
        inputs.append(binding(file))
stream = assemble.load_stream(book)
start = next(i for i, block in enumerate(stream) if block["ref"] == "p0320#7")
selected = stream[start:]
heading = stream[0]
assert heading["kind"] == "h1" and heading["ref"] == "p0302#1"
assert "".join(heading["lines"]) == "附录"
assert selected[0]["kind"] == "h3"
assert not any(block["kind"] in ("h1", "h2", "h3", "fig", "ex") for block in selected[1:])
boundary_path = TMP / "source323324-author/artifacts/9-10g/pages/0323/page.json"
boundary = json.loads(boundary_path.read_text())["blocks"][0]
assert boundary["kind"] == "h1" and "".join(boundary["lines"]) == "答案和提示"
selected_stream = [heading, *selected]
status = assemble.run(
    book, REPO / "ssot-resources/soviet10year-textbooks/toc/9-10g/zh.json",
    REPO / ".claude/skills/ld-s10y-lesson/profiles/soviet-cn.json",
    strict=True, work=OWN / "work/9-10g", exercise_numbering="book",
    stream=selected_stream,
)
record = {
    "status": "S9_AFFECTED_SOURCE_DRAFT" if status == 0 else "RAW_ASSEMBLY_FAILED",
    "lesson": "geo910-appendix-s9", "inputs": inputs,
    "selectedRefs": [block["ref"] for block in selected],
    "ancestor": {
        "ref": "p0302#1", "kind": "h1", "text": "附录",
        "source": binding(book / "pages/0302/page.json"),
        "originalReview": binding(TMP / "source302-review-01/source-review.json"),
        "affectedReview": binding(TMP / "source302-period-affected-review-02/affected-review.json"),
        "streamBehavior": "h1 resets pending h2; next selected heading h3 p0320#7 opens S9.",
    },
    "sourceStart": "p0320#7", "excludedRightBoundary": "p0323#1",
    "boundarySource": binding(boundary_path),
    "reusedSourceReview": binding(TMP / "source321322-boundary-affected-FIRST-review-01/review.json"),
    "source322Repair": binding(TMP / "source322-literal-repair-02/repair.json"),
    "previousScopedDraft": binding(TMP / "appendix-s9-draft-02/report.json"),
    "bookAnswersIncluded": False, "sourceFinalizerReplays": 0, "imageLoads": 0,
    "scope": "Actual selected source stream, not a reconstruction of all intervening appendix pages.",
    "wholeLessonApproved": False, "corePromoted": False, "published": False,
}
if status == 0:
    lesson_dir = book / "lessons/geo910-appendix-s9"
    lesson = json.loads((lesson_dir / "lesson.json").read_text())
    exercises = json.loads((lesson_dir / "exercises.json").read_text())
    assert lesson["chapter"] == "附录" and lesson["section"] is None
    record.update(
        proseBlocks=len(lesson["prose"]), exercises=len(exercises["exercises"]),
        outputs=[binding(lesson_dir / name) for name in ("lesson.json", "lesson.md", "exercises.json")],
    )
with (OWN / "report.json").open("x") as handle:
    json.dump(record, handle, ensure_ascii=False, indent=2)
    handle.write("\n")
print(json.dumps({"exitCode": status, "report": binding(OWN / "report.json")}))
sys.exit(status)
