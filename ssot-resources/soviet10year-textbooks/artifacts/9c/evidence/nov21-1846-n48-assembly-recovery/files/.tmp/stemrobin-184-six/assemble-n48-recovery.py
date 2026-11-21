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
book = base / "n48-assembly-recovery/9c"
lesson = "ana9-c4-s2-n48"
progress = json.loads((base / "source-progress.json").read_text())
assert progress["n48"]["firstFailure"]
assert not book.exists() and not sys.argv[1:]


def bind(file):
    data = file.read_bytes()
    return {"path": str(file.relative_to(ROOT)), "bytes": len(data),
            "sha256": hashlib.sha256(data).hexdigest()}


references = progress["n48"]["firstFailure"]["sourceReferences"]
for reference in references:
    assert bind(ROOT / reference["path"]) == reference
stream = assemble.load_stream(base / "n48-assembly-input/9c")
start = next(i for i, block in enumerate(stream)
             if block["page"] == 169 and block["kind"] == "h3")
end = next(i for i, block in enumerate(stream[start + 1:], start + 1)
           if block["kind"] in ("h1", "h2", "h3"))
assert stream[start]["lines"] == ["48. 有理分式函数的导数"]
assert stream[end]["lines"] == ["49. 复合函数"]
selected = [dict(block) for block in stream[start:end]]
continuation = next(block for block in selected if block["ref"] == "p0171#1")
previous = next(block for block in selected if block["ref"] == "p0170#16")
assert previous["label"] == "387" and previous["open"] is True
assert continuation["kind"] == "ex" and continuation["cont"] is True
assert continuation["label"] is None and continuation["open"] is False
page171 = json.loads((raw / "pages/0171/page.json").read_text())
binding, = page171["meta"]["continuation_bindings"]
assert binding["sourceNumberOnThisPage"] is None
assert binding["predecessorPrintedExerciseNumber"] == "387"
assert binding["candidateBodyUnchanged"] is True
assert binding["predecessorCanonicalSha256"] == bind(raw / "pages/0170/page.md")["sha256"]

# Supply the already verified predecessor identity to the assembler's label matcher.
continuation["label"] = binding["predecessorPrintedExerciseNumber"]
book.mkdir(parents=True)
result = assemble.run(
    book, ROOT / "ssot-resources/soviet10year-textbooks/toc/9c/zh.json",
    p2c.DEFAULT_PROFILE, strict=True, work=book / "work",
    exercise_numbering="book", stream=selected,
)
if result == 0:
    exercises = json.loads((book / "lessons" / lesson / "exercises.json").read_text())
    assert [item["number"] for item in exercises["exercises"]] == [
        "382", "383", "384", "385", "386", "387"
    ]
    assert exercises["exercises"][-1]["pages"] == ["p0170#16", "p0171#1"]
    assert exercises["exercises"][-1]["lines"] == previous["lines"] + continuation["lines"]
    index = json.loads((book / "book.json").read_text())
    assert [item["id"] for item in index["lessons"]] == [lesson]
    assert not any("cont 接不上" in warning or "open 没接上" in warning
                   for warning in index["audit"]["warnings"])
    for reference in references:
        assert bind(ROOT / reference["path"]) == reference
    with (book / "continuation-identity.json").open("x") as output:
        json.dump({
            "status": "ASSEMBLY_IDENTITY_BRIDGE_ONLY_NO_NEW_SOURCE_INK",
            "sourceLabelOn171": None,
            "assemblyPredecessorIdentity": "387",
            "sourceReferences": references,
            "canonicalPageEdits": 0,
            "sharedToolEdits": 0,
            "sourceMathNativeGateReplays": 0,
            "source171Binding": binding,
            "boundary": "Heading49 and all outgoing n49 prose excluded",
            "completeLessonDelta": 0,
            "scientificApproval": False,
            "originalFirstFailurePreserved": True,
        }, output, ensure_ascii=False, indent=2)
        output.write("\n")
raise SystemExit(result)
