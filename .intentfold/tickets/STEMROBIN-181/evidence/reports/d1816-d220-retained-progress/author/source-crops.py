"""Lossless source-only inspection windows; never a native or repair stage."""

import json
from pathlib import Path

from PIL import Image

REPO = Path("/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck")
assert Path.cwd() == REPO
AUTHOR = REPO / ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d220-10p-source77-79-author"
freeze = json.loads((AUTHOR / "input-freeze.json").read_text())
pages = {page["page"]: page for page in freeze["pages"]}
windows = [
    (77, "p77-threshold", (530, 430, 790, 510)),
    (77, "p77-graph", (812, 525, 1337, 1090)),
    (79, "p79-formulas", (190, 505, 1150, 1125)),
]
directory = AUTHOR / "inspection-crops"
directory.mkdir(exist_ok=True)
for number, name, box in windows:
    source = Path(pages[number]["original"]["path"])
    output = directory / f"{name}.png"
    with Image.open(source) as image:
        assert image.size == (1536, 2337)
        crop = image.crop(box)
        with output.open("xb") as destination:
            crop.save(destination, format="PNG")
    print(json.dumps({"source": str(source), "output": str(output), "boxLTRB": box}))
