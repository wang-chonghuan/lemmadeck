import subprocess
import sys
from pathlib import Path
from types import SimpleNamespace

repo, book, work = map(Path, sys.argv[1:])
assert str(repo) == "/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188"
assert Path.cwd() == repo
own = repo / (
    "ssot-resources/soviet10year-textbooks/artifacts/6-8g/evidence/"
    "stemrobin188-6g-n35/preparation7"
)
assert book == own / "artifacts/6-8g"
assert work == own / "work/6-8g"
sys.path.insert(0, str(repo / ".claude/skills/ld-s10y-lesson/tools"))
import assemble
import mathcheck


def local_math_run(argv, **kwargs):
    assert argv == ["node", str(mathcheck.TOOLS / "katex_check.js")]
    kwargs["cwd"] = str(repo)
    return subprocess.run(argv, **kwargs)


# Preserve the native checker, but keep its subprocess in the sole authorized cwd.
mathcheck.subprocess = SimpleNamespace(run=local_math_run)
stream = assemble.load_stream(book)
refs = {block["ref"]: block for block in stream}
left, right = "p0161#7", "p0165#7"
assert refs[left]["kind"] == refs[right]["kind"] == "h3"
assert "".join(refs[left]["lines"]) == "35. \u65b9\u5411"
assert "".join(refs[right]["lines"]) == "36. \u5e73\u79fb"
start = next(i for i, block in enumerate(stream) if block["ref"] == left)
end = next(i for i, block in enumerate(stream) if block["ref"] == right)
selected = stream[start:end]
assert [block["ref"] for block in selected if block["kind"] == "h3"] == [left]
assert not any(block["kind"] in ("h1", "h2") for block in selected)
assert selected[-1]["ref"] == "p0165#6" and not selected[-1]["open"]
assert all(161 <= block["page"] <= 165 for block in selected)
assert refs["p0162#7"]["open"] and refs["p0163#1"]["cont"]
assert refs["p0164#6"]["open"] and refs["p0164#8"]["cont"]
assert refs["p0164#6"]["label"] == refs["p0164#8"]["label"] == "451"
assert refs["p0164#7"]["kind"] == "cap" and refs["p0164#7"]["samerow"]
ancestors = [refs["p0149#2"], refs["p0159#5"]]
assert [block["kind"] for block in ancestors] == ["h1", "h2"]
assert "".join(ancestors[0]["lines"]) == "\u7b2c\u4e09\u7ae0 \u5e73\u884c\u548c\u5e73\u79fb"
assert "".join(ancestors[1]["lines"]) == "\u00a72. \u5e73\u79fb"

# Source blocks are unchanged; only native assembly joins the two split objects.
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
