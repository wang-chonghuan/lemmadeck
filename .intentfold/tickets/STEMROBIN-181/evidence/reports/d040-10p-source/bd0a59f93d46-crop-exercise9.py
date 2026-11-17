from pathlib import Path

from PIL import Image


workspace = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
author = workspace / ".intentfold/tickets/STEMROBIN-181/tmp/d039-10p-source100-103-author"
evidence = workspace / "tmp/d039-10p-source100-103-evidence"
source = author / "work/10p/pages/0103/page.png"
output = evidence / "physical-103-exercise9.png"
box = (200, 1100, 1410, 1330)

if output.exists():
    raise SystemExit("Evidence crop already exists; do not overwrite.")

with Image.open(source) as page:
    page.crop(box).save(output)

print(output)
print(f"Source pixels only; half-open crop box: {box}")
