import sys
from pathlib import Path

repo, book, work = map(Path, sys.argv[1:])
assert Path.cwd() == repo
sys.path.insert(0, str(repo / ".claude/skills/ld-s10y-lesson/tools"))
import assemble

stream = assemble.load_stream(book)
refs = {block["ref"]: block for block in stream}
left, right = "p0155#6", "p0159#5"
assert refs[left]["kind"] == "h3"
assert "".join(refs[left]["lines"]) == "33\u25bc\uff0e\u975e\u6b27\u51e0\u4f55\uff0e\u51e0\u4f55\u548c\u7269\u7406"
assert refs[right]["kind"] == "h2"
assert "".join(refs[right]["lines"]) == "\u00a72. \u5e73\u79fb"
start = next(i for i, block in enumerate(stream) if block["ref"] == left)
end = next(i for i, block in enumerate(stream) if block["ref"] == right)
selected = stream[start:end]
assert [block["ref"] for block in selected if block["kind"] == "h3"] == [left]
assert not any(block["kind"] in ("h1", "h2") for block in selected)
assert [block["label"] for block in selected if block["kind"] == "ex"] == [
    "441", "442", "443", "444", "445"
]
assert [block["id"] for block in selected if block["kind"] == "fig"] == [
    "fig-209", "fig-210", "fig-211", "fig-212"
]
assert not selected[-1].get("open")

# This saved teaching footnote belongs to exercise438, before the N33 boundary.
footnote = refs["p0155#8"]
assert footnote["kind"] == "foot" and footnote["owner_exercise"] == "438"
selected = [block for block in selected if block["ref"] != footnote["ref"]]
ancestors = [refs["p0149#2"], refs["p0149#3"]]
assert [block["kind"] for block in ancestors] == ["h1", "h2"]
assert "".join(ancestors[0]["lines"]) == "\u7b2c\u4e09\u7ae0 \u5e73\u884c\u548c\u5e73\u79fb"
assert "".join(ancestors[1]["lines"]) == "\u00a71. \u5e73 \u884c \u7ebf"

status = assemble.run(
    book,
    repo / "ssot-resources/soviet10year-textbooks/toc/6-8g/zh.json",
    repo / ".claude/skills/ld-s10y-lesson/profiles/soviet-cn.json",
    strict=True,
    work=work,
    exercise_numbering="book",
    stream=[*ancestors, *selected],
)
sys.exit(status)
