import hashlib
import json
import sys
from pathlib import Path

ROOT = Path("/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck")
assert Path.cwd() == ROOT
sys.path.insert(0, str(ROOT / ".claude/skills/ld-s10y-lesson/tools"))
import assemble
import p2c

base = ROOT / ".tmp/stemrobin-184-six"
raw = ROOT / "ssot-resources/soviet10year-textbooks/artifacts/9c"
book = base / "n48-assembly/9c"
inputs = base / "n48-assembly-input/9c"
lesson = "ana9-c4-s2-n48"
progress = json.loads((base / "source-progress.json").read_text())
assert progress["source169"]["review"]["closed"] is True
assert progress["source170"]["review"]["closed"] is True
assert progress["source170"]["repair"]["closed"] is True
assert progress["source170"]["repair"]["intake"]["nativeApproved"] is True
assert progress["source171"]["review"]["closed"] is True
assert progress["source171"]["review"]["approved"] is False
assert progress["source171"]["qualifiedFidelityAccepted"] is True
assert progress["source171"]["review"]["boundaryApproved"] is True
assert progress["source171"]["row18Crop"]["closed"] is True
assert progress["source171"]["canonical"]
assert not book.exists() and not inputs.exists()
assert not sys.argv[1:]


def bind(file):
    data = file.read_bytes()
    return {
        "path": str(file.relative_to(ROOT)),
        "bytes": len(data),
        "sha256": hashlib.sha256(data).hexdigest(),
    }


bindings = []
for page, lines in ((169, 23), (170, 19), (171, 24)):
    folder = raw / "pages" / f"{page:04d}"
    audit = json.loads((folder / "audit.json").read_text())
    assert not audit["errors"]
    assert audit["lines_printed"] == audit["lines_md"] == lines
    bindings.extend(bind(folder / name) for name in ("page.json", "page.md", "audit.json"))
    destination = inputs / "pages" / f"{page:04d}"
    destination.mkdir(parents=True)
    (destination / "page.json").symlink_to(folder / "page.json")

# Load the already retained text stream; this does not rerun page gates or copy inputs.
stream = assemble.load_stream(inputs)
start = next(i for i, block in enumerate(stream)
             if block["page"] == 169 and block["kind"] == "h3"
             and block["lines"] == ["48. 有理分式函数的导数"])
end = next(i for i, block in enumerate(stream[start + 1:], start + 1)
           if block["kind"] in ("h1", "h2", "h3"))
assert stream[end]["page"] == 171
assert stream[end]["lines"] == ["49. 复合函数"]
selected = stream[start:end]
assert {block["page"] for block in selected} == {169, 170, 171}
assert [block["label"] for block in selected
        if block["kind"] == "ex" and not block["cont"]] == [
    "382", "383", "384", "385", "386", "387"
]
assert not any(block["kind"] == "fig" for block in selected)
tail = next(i for i, block in enumerate(selected)
            if block["kind"] == "ex" and block["label"] == "387")
assert selected[tail]["open"] is True
assert selected[tail + 1]["kind"] == "foot"
assert selected[tail + 2]["kind"] == "ex"
assert selected[tail + 2]["label"] is None
assert selected[tail + 2]["cont"] is True
assert selected[tail + 2]["open"] is False
book.mkdir(parents=True)
result = assemble.run(
    book, ROOT / "ssot-resources/soviet10year-textbooks/toc/9c/zh.json",
    p2c.DEFAULT_PROFILE, strict=True, work=book / "work",
    exercise_numbering="book", stream=selected,
)
if result == 0:
    index = json.loads((book / "book.json").read_text())
    assert [item["id"] for item in index["lessons"]] == [lesson]
    exercises = json.loads((book / "lessons" / lesson / "exercises.json").read_text())
    assert [item["number"] for item in exercises["exercises"]] == [
        "382", "383", "384", "385", "386", "387"
    ]
    with (book / "source-bindings.json").open("x") as output:
        json.dump({
            "status": "N48_FIRST_RAW_TEXT_ASSEMBLY_ONLY_NOT_SCIENTIFIC_OR_LESSON_APPROVAL",
            "inputs": bindings,
            "nextHeadingExcluded": "49. 复合函数",
            "sourceGateReplays": 0,
            "mathematicsReplays": 0,
            "rasterDecodes": 0,
            "completeLessonDelta": 0,
            "scientificHolds": [
                "386 formula(1)/zero-power convention requires scoped interpretation",
                "387 graph-specific answer and shape proof not yet supplied",
            ],
            "allHistoricalFailHoldUnknownPreserved": True,
        }, output, ensure_ascii=False, indent=2)
        output.write("\n")
raise SystemExit(result)
