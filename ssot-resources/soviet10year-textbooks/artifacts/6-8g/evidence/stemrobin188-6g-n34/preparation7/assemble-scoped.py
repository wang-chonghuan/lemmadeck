import sys
from pathlib import Path

repo, book, work = map(Path, sys.argv[1:])
assert Path.cwd() == repo
sys.path.insert(0, str(repo / ".claude/skills/ld-s10y-lesson/tools"))
import assemble

stream = assemble.load_stream(book)
refs = {block["ref"]: block for block in stream}
left, right = "p0159#5", "p0161#7"
assert refs[left]["kind"] == "h2"
assert "".join(refs[left]["lines"]) == "\u00a72. \u5e73\u79fb"
assert refs[right]["kind"] == "h3"
assert "".join(refs[right]["lines"]) == "35. \u65b9\u5411"
start = next(i for i, block in enumerate(stream) if block["ref"] == left)
end = next(i for i, block in enumerate(stream) if block["ref"] == right)
selected = stream[start:end]
assert [block["ref"] for block in selected if block["kind"] == "h2"] == [left]
assert [block["ref"] for block in selected if block["kind"] == "h3"] == ["p0159#6"]
assert not any(block["kind"] == "h1" for block in selected)
assert [block["label"] for block in selected if block["kind"] == "ex"] == [
    "446", "447", "448", "449"
]
assert [block["id"] for block in selected if block["kind"] == "fig"] == [
    "tbl-p0160-01", "fig-213"
]
assert refs["p0160#7"]["kind"] == refs["p0161#1"]["kind"] == "p"
assert refs["p0160#7"]["open"] and refs["p0161#1"]["cont"]
assert not refs["p0161#1"]["open"]
assert selected[-1]["ref"] == "p0161#6" and not selected[-1]["open"]
ancestor = refs["p0149#2"]
assert ancestor["kind"] == "h1"
assert "".join(ancestor["lines"]) == "\u7b2c\u4e09\u7ae0 \u5e73\u884c\u548c\u5e73\u79fb"

# Keep every source block intact; native assembly alone performs the object join.
status = assemble.run(
    book,
    repo / "ssot-resources/soviet10year-textbooks/toc/6-8g/zh.json",
    repo / ".claude/skills/ld-s10y-lesson/profiles/soviet-cn.json",
    strict=True,
    work=work,
    exercise_numbering="book",
    stream=[ancestor, *selected],
)
sys.exit(status)
