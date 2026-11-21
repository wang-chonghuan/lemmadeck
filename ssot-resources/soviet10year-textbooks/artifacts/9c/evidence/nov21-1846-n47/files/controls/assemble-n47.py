import json
import shutil
import sys
from pathlib import Path

ROOT = Path("/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck")
assert Path.cwd() == ROOT
sys.path.insert(0, str(ROOT / ".claude/skills/ld-s10y-lesson/tools"))
import assemble
import p2c

base = ROOT / ".tmp/stemrobin-184-six"
raw = ROOT / "ssot-resources/soviet10year-textbooks/artifacts/9c"
inputs = base / "n47-assembly-input/9c"
book = base / "n47-assembly/9c"
lesson = "ana9-c4-s2-n47"
progress = json.loads((base / "source-progress.json").read_text())
assert progress["source167"]["review"]["closed"] is True
assert progress["source167"]["review"]["approved"] is True
assert progress["source168"]["review"]["closed"] is True
assert progress["source168"]["countRepair"]["nativeStatus"] == "PASS14_14"
assert progress["source169"]["review"]["closed"] is True
assert progress["source169"]["review"]["approved"] is True
assert progress["source169"]["review"]["boundaryApproved"] is True
assert progress["source169"]["canonical"]

if sys.argv[1:] == ["retain"]:
    index = json.loads((book / "book.json").read_text())
    assert [item["id"] for item in index["lessons"]] == [lesson]
    target = raw / "lessons" / lesson
    assert not target.exists()
    target.mkdir()
    for name in ("lesson.json", "lesson.md", "exercises.json"):
        shutil.copy2(book / "lessons" / lesson / name, target / name)
    current = json.loads((raw / "book.json").read_text())
    assert not any(item["id"] == lesson for item in current["lessons"])
    current["lessons"].append(index["lessons"][0])
    current["pages"] = len(list((raw / "pages").glob("*/page.json")))
    (raw / "book.json").write_text(
        json.dumps(current, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({"status": "N47_RAW_TEXT_RETAINED", "lesson": lesson,
                      "raster_decodes": 0, "complete_lesson_delta": 0}))
    raise SystemExit(0)

assert sys.argv[1:] == []
assert not inputs.exists() and not book.exists()
for page, lines in ((167, 22), (168, 14), (169, 23)):
    source = raw / "pages" / f"{page:04d}"
    audit = json.loads((source / "audit.json").read_text())
    assert not audit["errors"]
    assert audit["lines_printed"] == audit["lines_md"] == lines
    destination = inputs / "pages" / f"{page:04d}"
    destination.mkdir(parents=True)
    shutil.copy2(source / "page.json", destination / "page.json")

stream = assemble.load_stream(inputs)
start = next(i for i, block in enumerate(stream)
             if block["kind"] == "h3"
             and block["lines"] == ["47. 商的导数"])
end = next(i for i, block in enumerate(stream[start + 1:], start + 1)
           if block["kind"] in ("h1", "h2", "h3"))
assert stream[end]["lines"] == ["48. 有理分式函数的导数"]
selected = stream[start:end]
assert [block["label"] for block in selected if block["kind"] == "ex"] == [
    "378", "379", "380", "381"
]
assert not any(block["kind"] == "fig" for block in selected)
assert selected[2]["kind"] == "p" and selected[2]["open"] is True
assert selected[3]["kind"] == "foot"
assert selected[4]["kind"] == "p" and selected[4]["cont"] is True
assert selected[2]["lines"][-1].endswith("这时")
assert selected[4]["lines"][0].startswith("$\\frac{\\Delta w(x)}{\\Delta x}")
book.mkdir(parents=True)
result = assemble.run(
    book, ROOT / "ssot-resources/soviet10year-textbooks/toc/9c/zh.json",
    p2c.DEFAULT_PROFILE, strict=True, work=book / "work",
    exercise_numbering="book", stream=selected,
)
if result == 0:
    index = json.loads((book / "book.json").read_text())
    assert [item["id"] for item in index["lessons"]] == [lesson]
raise SystemExit(result)
