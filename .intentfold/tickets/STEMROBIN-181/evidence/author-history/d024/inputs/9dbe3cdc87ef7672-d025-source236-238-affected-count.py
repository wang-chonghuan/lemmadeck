"""Recount the two affected margins using already captured figure boxes."""

import json
import sys
from pathlib import Path

sys.dont_write_bytecode = True
sys.path.insert(0, str(Path(".claude/skills/ld-s10y-lesson/tools").resolve()))
import blocks
import layout
import p2c
from PIL import Image

payload = json.load(sys.stdin)
initial = json.loads(Path(payload["initialCounts"]).read_text())
results = []
for item in payload["pages"]:
    page = item["page"]
    assert page in [236, 238]
    previous = next(row for row in initial["pages"] if row["pdf_page"] == page)
    meta, parsed = blocks.load(Path(item["candidate"]))
    assert meta["page"] == page and meta["printed_page"] == page - 9
    with Image.open(previous["source_png"]) as image:
        ink = layout.ink_mask(image)
        masked = ink.copy()
        for figure in previous["figures"]:
            x, y, width, height = figure["native_memory_snap_box"]
            masked[max(0, y):y + height, max(0, x):x + width] = False
        columns = ink.any(axis=0).nonzero()[0]
        content_width = int(columns[-1] - columns[0] + 1) if columns.size else image.width
        bands = p2c._counting_line_bands(meta, masked, content_width)
    rows = blocks.printed_lines(parsed)
    assert rows == previous["candidate_rows"] == 19
    results.append({
        "pdf_page": page, "candidate": item["candidate"],
        "candidate_rows": rows, "native_masked_rows": len(bands),
        "native_minus_candidate": len(bands) - rows,
        "counting": meta["counting"], "figures": previous["figures"],
        "native_masked_bands": [[int(a), int(b)] for a, b in bands],
        "unchangedFigureGeometryReused": True, "newSnapCalls": 0,
    })
print(json.dumps({
    "status": "affected-native-counts-not-independent-approval",
    "pages": results, "sourceWrites": 0, "imageOpens": 0,
}, ensure_ascii=False, indent=2))
