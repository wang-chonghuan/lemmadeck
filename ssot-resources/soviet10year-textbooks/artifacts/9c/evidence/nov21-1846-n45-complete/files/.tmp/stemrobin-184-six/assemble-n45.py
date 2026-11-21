import json
import os
from pathlib import Path
import shutil
import sys

ROOT = Path("/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck")
assert Path.cwd() == ROOT
sys.path.insert(0, str(ROOT / ".claude/skills/ld-s10y-lesson/tools"))
import assemble
import blocks
import p2c

base = ROOT / ".tmp/stemrobin-184-six"
raw = ROOT / "ssot-resources/soviet10year-textbooks/artifacts/9c"
inputs = base / "n45-assembly-input/9c"
book = base / "n45-assembly/9c"
lesson = "ana9-c4-s2-n45"
if sys.argv[1:] == ["bind-request"]:
    progress = json.loads((base / "source-progress.json").read_text())
    assert progress["source166_active"]["native_status"] == "PASS"
    assert progress["source166_affected"]["closed"] is True
    owners = [str(number) for number in range(367, 374)]
    assert progress["source166_affected"]["requestScope"] == owners
    source = raw / "pages/0165"
    original_md = (source / "page.md").read_text()
    original_json = json.loads((source / "page.json").read_text())
    meta, body = blocks.parse(original_md)
    assert body == original_json["blocks"] and meta == original_json["meta"]
    request = [block for block in body
               if block.get("owner_exercise") == "367"]
    assert len(request) == 1
    assert request[0]["lines"] == [
        "利用第 $44$ 和 $45$ 小节中导出的公式，求下列各函数的",
        "导数：",
    ]
    before_lines = [block["lines"] for block in body]
    request[0]["owner_exercise"] = None
    request[0]["owner_exercises"] = owners
    assert [block["lines"] for block in body] == before_lines
    assert blocks.printed_lines(body) == original_json["meta"]["printed_lines"]
    working = base / "source165-request-working"
    assert not working.exists()
    working.mkdir()
    (working / "page.md").write_text(blocks.dump(meta, body, 165))
    (working / "page.json").write_text(json.dumps(
        {"meta": meta, "blocks": body}, ensure_ascii=False, indent=2) + "\n")
    for name in ("page.md", "page.json"):
        temporary = source / f".{name}.request-new"
        shutil.copy2(working / name, temporary)
        os.replace(temporary, source / name)
    print(json.dumps({"status": "REQUEST_OWNERSHIP_BOUND_367_373",
                      "page": 165, "owners": owners,
                      "body_lines_and_meta_unchanged": True,
                      "native_replays": 0, "raster_decodes": 0}))
    raise SystemExit(0)

if sys.argv[1:] == ["retain"]:
    index = json.loads((book / "book.json").read_text())
    assert [item["id"] for item in index["lessons"]] == [lesson]
    target = raw / "lessons" / lesson
    assert not target.exists()
    target.mkdir(parents=True)
    for name in ("lesson.json", "lesson.md", "exercises.json"):
        shutil.copy2(book / "lessons" / lesson / name, target / name)
    current_index = json.loads((raw / "book.json").read_text())
    assert not any(item["id"] == lesson for item in current_index["lessons"])
    current_index["lessons"].append(index["lessons"][0])
    current_index["pages"] = len(list((raw / "pages").glob("*/page.json")))
    (raw / "book.json").write_text(
        json.dumps(current_index, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({"status": "N45_RAW_TEXT_RETAINED", "lesson": lesson,
                      "raster_decodes": 0, "complete_lesson_delta": 0}))
    raise SystemExit(0)

assert sys.argv[1:] == []
assert not inputs.exists() and not book.exists()
progress = json.loads((base / "source-progress.json").read_text())
assert progress["source164165"]["native"]["closed"] is True
assert progress["source164165"]["independentMath"]["closed"] is True
assert progress["source166_active"]["closed"] is True
assert progress["source166_active"]["native_status"] == "PASS"
assert progress["source166_affected"]["closed"] is True
for page in (163, 164, 165, 166):
    source = raw / "pages" / f"{page:04d}"
    audit = json.loads((source / "audit.json").read_text())
    assert not audit["errors"]
    destination = inputs / "pages" / f"{page:04d}"
    destination.mkdir(parents=True)
    shutil.copy2(source / "page.json", destination / "page.json")
stream = assemble.load_stream(inputs)
start = next(i for i, block in enumerate(stream)
             if block["kind"] == "h3"
             and block["lines"] == ["45. 函数的积的导数"])
end = next(i for i, block in enumerate(stream[start + 1:], start + 1)
           if block["kind"] in ("h1", "h2", "h3"))
assert stream[end]["kind"] == "h3"
assert stream[end]["lines"][0].startswith("46.")
selected = stream[start:end]
assert any(block["kind"] == "ex" and block["label"] == "367"
           for block in selected)
assert [block["label"] for block in selected if block["kind"] == "ex"] == [
    str(number) for number in range(367, 375)
]
requests = [block for block in selected if block.get("owner_exercises")]
assert len(requests) == 1
assert requests[0]["owner_exercises"] == [str(number) for number in range(367, 374)]
assert not any(block["kind"] == "fig" for block in selected)
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
