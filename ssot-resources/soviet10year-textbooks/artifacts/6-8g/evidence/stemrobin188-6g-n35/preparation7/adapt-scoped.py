import argparse
import json
import subprocess
import sys
from pathlib import Path
from types import SimpleNamespace

repo = Path("/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188")
assert Path.cwd() == repo
own = repo / (
    "ssot-resources/soviet10year-textbooks/artifacts/6-8g/evidence/"
    "stemrobin188-6g-n35/preparation7"
)
assert Path(__file__).resolve() == own / "adapt-scoped.py"
tools = repo / ".claude/skills/ld-s10y-lesson/tools"
sys.path.insert(0, str(tools))
import edition
import p2c
from production import validate_book, validate_lesson_owner, validate_output_owner

stage = sys.argv[1]
assert stage in ("adapt-prepare", "edition-prepare")
parser = argparse.ArgumentParser()
edition.common(parser)
parser.add_argument("--force", action="store_true")
args = parser.parse_args(sys.argv[2:])
assert args.book == "6-8g" and args.edition == "modern-us-neutral"
assert args.lesson == ["geo68-c3-s2-n35"] and not args.force
assert Path(args.root) == own / "artifacts"
assert Path(args.work) == own / "work"
assert Path(args.profile) == tools.parent / "profiles/modern-us-neutral.json"
assert json.loads((repo / ".intentfold/project.json").read_text())["project"] == "lemmadeck"
assert (repo / ".intentfold/readme.md").is_file()
assert (tools / "p2c.py").is_file()
validate_book(repo, args.book)
validate_lesson_owner(Path(args.root) / args.book, args.lesson[0])
for target in (
    Path(args.root) / args.book,
    Path(args.work) / args.book,
    edition.edition_dir(args),
    edition.work_edition_dir(args),
    edition.work_edition_dir(args) / "lessons" / args.lesson[0],
):
    assert target.is_relative_to(own)
    validate_output_owner(repo, target)


def route_edition(argv):
    expected = [
        sys.executable, str(tools / "edition.py"), "prepare",
        "--book", args.book, "--edition", args.edition,
        "--root", args.root, "--work", args.work,
        "--lesson", args.lesson[0],
    ]
    assert argv == expected
    child_argv = [
        sys.executable, "-B", str(own / "adapt-scoped.py"),
        "edition-prepare", *argv[3:],
    ]
    result = subprocess.run(child_argv, cwd=str(repo), check=False)
    print(json.dumps({
        "nativeHandler": "edition.cmd_prepare",
        "nativeRequestedArgv": argv,
        "actualChildArgv": child_argv,
        "cwd": str(repo),
        "returncode": result.returncode,
    }), flush=True)
    return result


# Use the existing handlers, without their CLI-only Git workspace probe.
if stage == "adapt-prepare":
    p2c.subprocess = SimpleNamespace(run=route_edition)
    status = p2c.cmd_adapt_prepare(args)
else:
    status = edition.cmd_prepare(args)
sys.exit(status)
