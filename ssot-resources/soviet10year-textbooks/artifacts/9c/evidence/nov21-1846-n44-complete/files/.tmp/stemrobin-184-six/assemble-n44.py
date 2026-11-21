import json
from pathlib import Path
import shutil
import sys

ROOT = Path("/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck")
assert Path.cwd() == ROOT
sys.path.insert(0, str(ROOT / ".claude/skills/ld-s10y-lesson/tools"))
import assemble
import p2c

base = ROOT / ".tmp/stemrobin-184-six"
native = base / "source162163-affected-native-nov21/native/9c"
book = base / "n44-assembly/9c"
if sys.argv[1:] == ["retain"]:
    target = ROOT / "ssot-resources/soviet10year-textbooks/artifacts/9c"
    files = []
    for page in (162, 163):
        directory = Path("pages") / f"{page:04d}"
        audit = json.loads((native / directory / "audit.json").read_text())
        assert audit["lines_printed"] == audit["lines_md"]
        assert not audit["errors"]
        files.extend((native, directory / name)
                     for name in ("page.md", "page.json", "audit.json"))
    lesson_dir = Path("lessons/ana9-c4-s2-n44")
    files.extend((book, lesson_dir / name)
                 for name in ("lesson.md", "lesson.json", "exercises.json"))
    for source_root, relative in files:
        source = source_root / relative
        destination = target / relative
        assert source.suffix in (".md", ".json")
        if destination.exists():
            assert destination.read_bytes() == source.read_bytes()
        else:
            destination.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(source, destination)
    print(json.dumps({"status": "RETAINED_EXACT_TEXT_ONLY", "files": len(files),
                      "lesson": "ana9-c4-s2-n44", "raster_decodes": 0}))
    raise SystemExit(0)
assert not book.exists()
book.mkdir(parents=True)
stream = assemble.load_stream(native)
start = next(i for i, block in enumerate(stream)
             if block["kind"] == "h3"
             and block["lines"] == ["44. 函数的和的导数"])
end = next(i for i, block in enumerate(stream[start + 1:], start + 1)
           if block["kind"] == "h3")
assert stream[end]["lines"] == ["45. 函数的积的导数"]
selected = stream[start:end]
assert [block["label"] for block in selected if block["kind"] == "ex"] == [
    "363", "364", "365", "366"
]
assert not any(block["kind"] == "fig" for block in selected)
result = assemble.run(
    book, ROOT / "ssot-resources/soviet10year-textbooks/toc/9c/zh.json",
    p2c.DEFAULT_PROFILE, strict=True, work=book / "work",
    exercise_numbering="book", stream=selected,
)
if result == 0:
    index = json.loads((book / "book.json").read_text())
    assert [lesson["id"] for lesson in index["lessons"]] == ["ana9-c4-s2-n44"]
raise SystemExit(result)
