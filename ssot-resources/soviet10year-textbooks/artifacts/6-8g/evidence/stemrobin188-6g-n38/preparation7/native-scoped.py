import argparse
import subprocess
import sys
from pathlib import Path
from types import SimpleNamespace

repo = Path("/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188")
assert Path.cwd() == repo
own = repo / (
    "ssot-resources/soviet10year-textbooks/artifacts/6-8g/evidence/"
    "stemrobin188-6g-n38/preparation7"
)
assert Path(__file__).resolve() == own / "native-scoped.py"
tools = repo / ".claude/skills/ld-s10y-lesson/tools"
sys.path.insert(0, str(tools))
stage = sys.argv[1]

if stage == "assemble":
    import assemble
    import mathcheck

    def local_math_run(argv, **kwargs):
        assert argv == ["node", str(mathcheck.TOOLS / "katex_check.js")]
        kwargs["cwd"] = str(repo)
        return subprocess.run(argv, **kwargs)

    mathcheck.subprocess = SimpleNamespace(run=local_math_run)
    book = own / "artifacts/6-8g"
    stream = assemble.load_stream(book)
    refs = {block["ref"]: block for block in stream}
    left, right = "p0174#1", "p0178#9"
    assert refs[left]["kind"] == refs[right]["kind"] == "h3"
    assert "".join(refs[left]["lines"]) == "38. \u591a\u8fb9\u5f62\u7684\u5185\u89d2\u548c"
    assert "".join(refs[right]["lines"]) == "\u7b2c\u4e09\u7ae0\u8865\u5145\u4e60\u9898"
    start = next(i for i, block in enumerate(stream) if block["ref"] == left)
    end = next(i for i, block in enumerate(stream) if block["ref"] == right)
    selected = stream[start:end]
    assert [block["ref"] for block in selected if block["kind"] == "h3"] == [left]
    assert all(174 <= block["page"] <= 178 for block in selected)
    ancestors = [refs["p0149#2"], refs["p0159#5"]]
    assert [block["kind"] for block in ancestors] == ["h1", "h2"]
    status = assemble.run(
        book,
        repo / "ssot-resources/soviet10year-textbooks/toc/6-8g/zh.json",
        repo / ".claude/skills/ld-s10y-lesson/profiles/soviet-cn.json",
        strict=True,
        work=own / "work/6-8g",
        exercise_numbering="book",
        stream=[*ancestors, *selected],
    )
elif stage in ("adapt-prepare", "edition-prepare"):
    import edition
    import p2c
    from production import validate_book, validate_lesson_owner, validate_output_owner

    parser = argparse.ArgumentParser()
    edition.common(parser)
    parser.add_argument("--force", action="store_true")
    args = parser.parse_args([
        "--book", "6-8g", "--edition", "modern-us-neutral",
        "--root", str(own / "artifacts"), "--work", str(own / "work"),
        "--lesson", "geo68-c3-s2-n38",
    ])
    validate_book(repo, args.book)
    validate_lesson_owner(Path(args.root) / args.book, args.lesson[0])
    for target in (Path(args.root) / args.book, edition.edition_dir(args),
                   edition.work_edition_dir(args)):
        assert target.is_relative_to(own)
        validate_output_owner(repo, target)

    def route_edition(argv):
        expected = [
            sys.executable, str(tools / "edition.py"), "prepare",
            "--book", args.book, "--edition", args.edition,
            "--root", args.root, "--work", args.work, "--lesson", args.lesson[0],
        ]
        assert argv == expected
        return subprocess.run(
            [sys.executable, "-B", str(own / "native-scoped.py"), "edition-prepare"],
            cwd=str(repo), check=False,
        )

    if stage == "adapt-prepare":
        p2c.subprocess = SimpleNamespace(run=route_edition)
        status = p2c.cmd_adapt_prepare(args)
    else:
        status = edition.cmd_prepare(args)
else:
    raise ValueError("Unknown scoped stage")
sys.exit(status)
