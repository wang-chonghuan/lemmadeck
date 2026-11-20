"""Observe unchanged page-159 line detection; never alter counting or exclusions."""
import json
import sys
from pathlib import Path

REPO = Path("/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck")
OWNED = REPO / ".intentfold/tickets/STEMROBIN-188/tmp/source157159-author"
if Path.cwd() != REPO:
    raise SystemExit("Wrong cwd")
sys.path.insert(0, str(REPO / ".claude/skills/ld-s10y-lesson/tools"))
import blocks
import layout
from PIL import Image

source = OWNED / "work/9-10g/pages/0159/page.png"
image = Image.open(source)
ink = layout.ink_mask(image)
columns = ink.any(axis=0).nonzero()[0]
width = int(columns[-1] - columns[0] + 1)
bands = []
for index, (top, bottom) in enumerate(layout.line_bands(ink, width), 1):
    rows, cols = ink[top:bottom].nonzero()
    bands.append({
        "band": index, "y": [int(top), int(bottom)],
        "ink_pixels": int(len(rows)),
        "x": [int(cols.min()), int(cols.max())] if len(cols) else None,
    })
meta, parsed = blocks.load(OWNED / "artifacts/9-10g/pages/0159/page.md")
authored = [
    {"block": index, "kind": block["kind"], "label": block["label"],
     "lines": block["lines"], "printed_lines": blocks.printed_lines([block])}
    for index, block in enumerate(parsed, 1)
]
crop = OWNED / "evidence/0159/first/lower-source-crop.png"
box = [100, 1860, 1400, 2126]
image.crop(tuple(box)).save(crop)
result = {
    "source": str(source), "source_sha256": layout.sha256_file(source),
    "algorithm": "Unmodified layout.ink_mask + layout.line_bands",
    "content_width": width, "bands": bands,
    "lines_printed": len(bands), "lines_md": blocks.printed_lines(parsed),
    "authored": authored, "count_exclusions": meta.get("count_exclusions", []),
    "crop": {"path": str(crop), "source_box_ltrb": box,
             "sha256": layout.sha256_file(crop), "bytes": crop.stat().st_size},
    "finalize_rerun": False, "author_repair_count": 0,
}
text = json.dumps(result, ensure_ascii=False, indent=2) + "\n"
(OWNED / "evidence/0159/first/count-diagnostic.json").write_text(text, encoding="utf-8")
print(text, end="")
