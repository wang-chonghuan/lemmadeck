from pathlib import Path
import argparse

from PIL import Image


BASE = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
OWN = BASE / ".intentfold/tickets/STEMROBIN-181/tmp/d741-source227228-first-author"
PREPARED = BASE / ".intentfold/tickets/STEMROBIN-181/tmp/d740-source227228-first-preparation/work/10p/pages"

parser = argparse.ArgumentParser()
parser.add_argument("--page", type=int, choices=(227, 228), required=True)
parser.add_argument("--box", type=int, nargs=4, required=True)
args = parser.parse_args()
assert Path.cwd() == BASE
output = OWN / "reports/inspection" / f"p{args.page:04d}-detail.png"
output.parent.mkdir(parents=True, exist_ok=True)
if output.exists():
    raise SystemExit(f"Refusing to overwrite inspection evidence: {output}")
with Image.open(PREPARED / f"{args.page:04d}/page.png") as image:
    image.crop(tuple(args.box)).save(output)
print(output)
