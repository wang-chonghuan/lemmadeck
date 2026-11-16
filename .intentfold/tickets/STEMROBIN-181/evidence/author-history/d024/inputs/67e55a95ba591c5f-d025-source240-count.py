"""Read-only native count and memory geometry for one frozen source batch."""

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
results = []
for item in payload["pages"]:
    page = item["page"]
    meta, parsed = blocks.load(Path(item["candidate"]))
    assert meta["page"] == meta["source"]["pdf_page"] == page
    assert meta["printed_page"] == page - 9
    with Image.open(item["source"]) as image:
        ink = layout.ink_mask(image)
        masked = ink.copy()
        figures = []
        for index, block in enumerate(parsed, 1):
            if block["kind"] != "fig":
                continue
            box, snapped = layout.snap(ink, block["box"])
            x, y, width, height = box
            masked[max(0, y):y + height, max(0, x):x + width] = False
            figures.append({
                "id": blocks.fig_id(block["label"], page, len(figures) + 1),
                "ref": f"p{page:04d}#{index}",
                "label": block["label"], "rough_box": block["box"],
                "native_memory_snap_box": box, "native_snap": snapped,
                "crop_written": False, "geometry_approved": False,
            })
        columns = ink.any(axis=0).nonzero()[0]
        content_width = int(columns[-1] - columns[0] + 1) if columns.size else image.width
        bands = p2c._counting_line_bands(meta, masked, content_width)
        dimensions = list(image.size)
    candidate_rows = blocks.printed_lines(parsed)
    results.append({
        "pdf_page": page, "candidate": item["candidate"], "source_png": item["source"],
        "dimensions_px": dimensions, "candidate_rows": candidate_rows,
        "native_masked_rows": len(bands), "native_minus_candidate": len(bands) - candidate_rows,
        "native_count_matches_candidate": len(bands) == candidate_rows,
        "counting": meta.get("counting"),
        "physical_rows_per_block_before_samerow": [
            len(block["lines"]) + sum(line.count(blocks.WRAP) for line in block["lines"])
            for block in parsed
        ],
        "native_masked_bands": [[int(a), int(b)] for a, b in bands],
        "figures": figures,
        "blocks": [
            {"ref": f"p{page:04d}#{i}", "kind": block["kind"], "label": block["label"],
             "open": block["open"], "cont": block["cont"], "samerow": block["samerow"],
             "lines": block["lines"]}
            for i, block in enumerate(parsed, 1)
        ],
        "calls_per_page": {
            "decode": 1, "blocks_load": 1, "printed_lines": 1,
            "ink_mask": 1, "line_bands": 1, "snap": len(figures),
        },
    })
print(json.dumps({
    "status": "native-counts-not-independent-SOURCE-approval", "pages": results,
    "nativeCountInvocations": 1, "cropWrites": 0, "sourceWrites": 0, "imageOpens": 0,
}, ensure_ascii=False, indent=2))
