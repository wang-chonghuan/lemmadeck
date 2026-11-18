from contextlib import redirect_stderr, redirect_stdout
from pathlib import Path
import argparse
import hashlib
import json
import os
import shutil
import sys
import traceback


REPO = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
OWN = REPO / ".intentfold/tickets/STEMROBIN-181/tmp/d741-source227228-first-author"
SKILL = REPO / ".claude/skills/ld-s10y-lesson"
ROOT = OWN / "root"
WORK = OWN / "work"
REPORTS = OWN / "reports"
PREPARED = REPO / ".intentfold/tickets/STEMROBIN-181/tmp/d740-source227228-first-preparation/work"


def sha(path):
    return hashlib.file_digest(path.open("rb"), "sha256").hexdigest()


parser = argparse.ArgumentParser()
parser.add_argument("--stage", choices=("finalize", "vectorize"), required=True)
parser.add_argument("--page", type=int, choices=(227, 228), required=True)
args = parser.parse_args()
if Path.cwd().resolve() != REPO:
    raise SystemExit("The shell cwd must be the sole authorized checkout.")
sys.path.insert(0, str(SKILL / "tools"))
import blocks
import p2c
from production import validate_book, validate_output_owner

# The CLI workspace validator runs Git. Use the existing native stage functions
# directly, retaining book/output checks and exact cwd without any Git command.
if p2c.REPO != REPO:
    raise SystemExit("Native tool checkout mismatch.")
for marker in (".intentfold/readme.md", ".intentfold/project.json", ".claude/skills/ld-s10y-lesson/tools/p2c.py"):
    if not (REPO / marker).is_file():
        raise SystemExit(f"Missing checkout marker: {marker}")
if json.loads((REPO / ".intentfold/project.json").read_text())["project"] != "lemmadeck":
    raise SystemExit("Wrong project.")
validate_book(REPO, "10p")
page_dir = ROOT / "10p/pages" / f"{args.page:04d}"
work_page = WORK / "10p/pages" / f"{args.page:04d}"
for path in (ROOT / "10p", WORK / "10p", page_dir, work_page, REPORTS):
    validate_output_owner(REPO, path)

REPORTS.mkdir(parents=True, exist_ok=True)
receipt_path = REPORTS / f"p{args.page:04d}-{args.stage}.json"
if receipt_path.exists():
    raise SystemExit(f"Native stage already attempted; refusing replay: {receipt_path}")
if args.stage == "vectorize":
    dependency = json.loads((REPORTS / f"p{args.page:04d}-finalize.json").read_text())
    if dependency.get("exit_code") != 0:
        raise SystemExit("Dependent stage stopped: finalize did not pass.")
    audit = json.loads((page_dir / "audit.json").read_text())
    if audit["errors"]:
        raise SystemExit("Dependent stage stopped: native audit has errors.")

if args.stage == "finalize":
    work_page.mkdir(parents=True, exist_ok=True)
    source_png = PREPARED / "10p/pages" / f"{args.page:04d}/page.png"
    if (work_page / "page.png").exists():
        raise SystemExit("Refusing to overwrite existing prepared input.")
    meta, before_blocks = blocks.load(page_dir / "page.md")
    if sha(source_png) != meta["render"]["sha256"]:
        raise SystemExit("Prepared source render hash mismatch.")
    shutil.copy2(source_png, work_page / "page.png")
    snapshot = REPORTS / f"p{args.page:04d}-literal-authored.md"
    if snapshot.exists():
        raise SystemExit("Refusing to overwrite literal source evidence.")
    shutil.copy2(page_dir / "page.md", snapshot)

native_tmp = WORK / "native-tmp"
native_tmp.mkdir(parents=True, exist_ok=True)
os.environ["TMPDIR"] = str(native_tmp)
os.environ["PYTHONDONTWRITEBYTECODE"] = "1"
import tempfile
tempfile.tempdir = str(native_tmp)
namespace = argparse.Namespace(
    book="10p", page=args.page, root=str(ROOT), work=str(WORK),
    books=str(REPO / "ssot-resources/soviet10year-textbooks/sources"),
    pdf=None, series=None, turdsize=2,
)
receipt = {
    "stage": args.stage,
    "page": args.page,
    "book": "10p",
    "cwd": str(REPO),
    "tool": str(SKILL / "tools/p2c.py"),
    "tool_sha256": sha(SKILL / "tools/p2c.py"),
    "native_function": f"p2c.cmd_{args.stage}",
    "arguments": vars(namespace),
    "cli_workspace_git_probe_omitted": True,
    "native_calls": 1,
    "status": "started",
    "exit_code": None,
}
with receipt_path.open("x") as stream:
    json.dump(receipt, stream, indent=2)
    stream.write("\n")
stdout = REPORTS / f"p{args.page:04d}-{args.stage}.stdout.txt"
stderr = REPORTS / f"p{args.page:04d}-{args.stage}.stderr.txt"
exit_code = 1
try:
    with stdout.open("x") as output, stderr.open("x") as errors:
        with redirect_stdout(output), redirect_stderr(errors):
            exit_code = getattr(p2c, f"cmd_{args.stage}")(namespace)
except BaseException:
    with stderr.open("a") as errors:
        traceback.print_exc(file=errors)
receipt.update(
    status="passed" if exit_code == 0 else "failed",
    exit_code=exit_code,
    stdout=str(stdout),
    stdout_sha256=sha(stdout),
    stderr=str(stderr),
    stderr_sha256=sha(stderr),
)
if args.stage == "finalize" and (page_dir / "page.json").exists():
    after_meta, after_blocks = blocks.load(page_dir / "page.md")
    key_fields = ("kind", "label", "owner_exercise", "cont", "open", "samerow", "lines")
    receipt["literal_text_and_flags_preserved"] = [
        {key: block[key] for key in key_fields} for block in before_blocks
    ] == [{key: block[key] for key in key_fields} for block in after_blocks]
    receipt["audit"] = str(page_dir / "audit.json")
    receipt["audit_sha256"] = sha(page_dir / "audit.json")
    receipt["page_md_sha256"] = sha(page_dir / "page.md")
    receipt["page_json_sha256"] = sha(page_dir / "page.json")
    if not receipt["literal_text_and_flags_preserved"] and exit_code == 0:
        receipt["status"] = "evidence_failure"
        exit_code = 1
        receipt["exit_code"] = exit_code
receipt_path.write_text(json.dumps(receipt, ensure_ascii=False, indent=2) + "\n")
print(stdout.read_text(), end="")
if stderr.stat().st_size:
    print(stderr.read_text(), file=sys.stderr, end="")
print(json.dumps(receipt, ensure_ascii=False))
raise SystemExit(exit_code)
