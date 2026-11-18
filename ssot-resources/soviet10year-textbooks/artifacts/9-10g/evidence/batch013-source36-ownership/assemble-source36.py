"""Assemble only the closed section 36, retaining original page/block refs."""
import json
import shutil
import sys
from pathlib import Path

REPO = Path("/Users/yong/.codex/worktrees/a07e/lemmadeck")
assert Path.cwd().resolve() == REPO
TOOLS = REPO / ".claude/skills/ld-s10y-lesson/tools"
sys.path.insert(0, str(TOOLS))
import assemble
import blocks

SOURCE = REPO / "ssot-resources/soviet10year-textbooks/artifacts/9-10g"
TEMP = REPO / ".tmp/ld-s10y-lesson/batch013-source36"
BOOK = TEMP / "9-10g"
WORK = TEMP / "work/9-10g"
LESSON = "geo910-c1-s3-n36"
assert not BOOK.exists(), "reuse passed assembly instead of rebuilding it"
assert not (SOURCE / "lessons" / LESSON).exists()
stream = []
for page in range(121, 124):
    document = json.loads((SOURCE / "pages" / f"{page:04d}" / "page.json").read_text())
    for index, block in enumerate(document["blocks"], 1):
        stream.append({
            **block, "page": page, "printed_page": document["meta"]["printed_page"],
            "ref": f"p{page:04d}#{index}",
        })
start = next(index for index, block in enumerate(stream)
             if block["kind"] == "h3" and blocks.text_of(block).startswith("§36."))
end = next(index for index, block in enumerate(stream)
           if block["kind"] == "h3" and blocks.text_of(block).startswith("§37."))
stream = stream[start:end]
for block in stream:
    if block["kind"] != "fig":
        continue
    page = f'{block["page"]:04d}'
    directory = WORK / "pages" / page / "figures"
    directory.mkdir(parents=True, exist_ok=True)
    figure_work = (
        REPO / ".tmp/s10y-source/batch013-ownership122/candidate-work/9-10g"
        if block["page"] == 122
        else REPO / ".tmp/ld-s10y-lesson/9-10g"
    )
    for suffix in (".png", ".svg"):
        source = figure_work / "pages" / page / "figures" / (block["id"] + suffix)
        assert source.is_file(), source
        shutil.copyfile(source, directory / source.name)
result = assemble.run(
    BOOK, REPO / "ssot-resources/soviet10year-textbooks/toc/9-10g/zh.json",
    TOOLS.parent / "profiles/soviet-cn.json", work=WORK, stream=stream,
)
assert result == 0, "failed assembly remains evidence; do not retain it as approved"
index = json.loads((BOOK / "book.json").read_text())
assert [row["card_id"] for row in index["lessons"]] == [LESSON]
assert not index["audit"]["errors"], index["audit"]["errors"]
exercises = json.loads((BOOK / "lessons" / LESSON / "exercises.json").read_text())["exercises"]
numbers = [int(exercise["number"]) for exercise in exercises]
assert numbers and numbers[0] == 331
assert numbers == list(range(numbers[0], numbers[-1] + 1))
assert not any("标着 open 没接上" in warning for warning in index["audit"]["warnings"])
shutil.copytree(BOOK / "lessons" / LESSON, SOURCE / "lessons" / LESSON)
retained_figures = []
for source in sorted((BOOK / "figures").iterdir()):
    target = SOURCE / "figures" / source.name
    if target.exists():
        assert target.read_bytes() == source.read_bytes(), target
    else:
        shutil.copyfile(source, target)
    retained_figures.append(source.name)
print(json.dumps({
    "status": "raw-lesson-retained", "lesson": LESSON, "exercises": numbers,
    "figures": retained_figures, "book": str(BOOK),
    "next_boundary_excluded": "geo910-c1-s3-n37", "complete_modern_lesson": False,
}))
