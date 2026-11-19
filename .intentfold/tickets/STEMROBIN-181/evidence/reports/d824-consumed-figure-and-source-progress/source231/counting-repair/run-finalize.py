import argparse
import json
import os
import sys
from pathlib import Path

REPO = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
BASE = REPO / ".intentfold/tickets/STEMROBIN-181/tmp/d816-source231-counting-repair"
TOOLS = REPO / ".claude/skills/ld-s10y-lesson/tools"
sys.path.insert(0, str(TOOLS))
import p2c
from production import validate_book, validate_output_owner

parser = argparse.ArgumentParser()
parser.add_argument("--book", required=True)
parser.add_argument("--page", type=int, required=True)
parser.add_argument("--root", required=True)
parser.add_argument("--work", required=True)
args = parser.parse_args()
assert Path.cwd() == REPO == p2c.REPO.resolve()
assert args.book == "10p" and args.page == 231
assert Path(args.root) == BASE / "root" and Path(args.work) == BASE / "work"
assert json.loads((REPO / ".intentfold/project.json").read_text())["project"] == "lemmadeck"
assert (REPO / ".intentfold/readme.md").is_file()
validate_book(REPO, args.book)
for directory in (
    Path(args.root) / args.book, Path(args.work) / args.book,
    p2c._page_dir(args, args.page), p2c._work_page_dir(args, args.page),
):
    validate_output_owner(REPO, directory)
    assert directory.is_relative_to(BASE) and directory.is_dir()

args.books = str(REPO / p2c.DEFAULT_BOOKS)
args.pdf = None
args.series = None


def boundary(event, values):
    if event == "open":
        path, mode, flags = values
        if isinstance(path, (str, bytes, os.PathLike)) and flags & (
            os.O_WRONLY | os.O_RDWR | os.O_APPEND | os.O_CREAT | os.O_TRUNC
        ):
            assert Path(os.fsdecode(path)).resolve().is_relative_to(BASE), (
                f"Native write outside authorized scratch: {path}"
            )
    elif event == "subprocess.Popen":
        executable, command, cwd, env = values
        assert command == ["node", str(TOOLS / "katex_check.js")], (
            f"Unexpected native subprocess: {command!r}"
        )


# Run the native finalizer itself, without the CLI's prohibited Git probe.
# Neither its counting function nor its output serialization is substituted.
sys.addaudithook(boundary)
raise SystemExit(p2c.cmd_finalize(args))
