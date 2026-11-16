"""One native in-memory author measurement per page; no crops or approval."""

import json
import platform
import sys
from pathlib import Path

ROOT = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
OUT = Path(__file__).resolve().parent
TOOLS = ROOT / ".claude/skills/ld-s10y-lesson/tools"
sys.dont_write_bytecode = True
sys.path.insert(0, str(TOOLS))

import blocks
import layout
import numpy
import PIL
import scipy
from PIL import Image

assert not (OUT / "author-counts.stdout.json").exists(), "Count already attempted."
observations = json.loads((OUT / "author-observations.json").read_text())
results = []
for expected in observations["pages"]:
    page = expected["pdf_page"]
    candidate = OUT / expected["candidate"]
    meta, parsed = blocks.load(candidate)
    source = ROOT / f".tmp/ld-s10y-lesson/9p/pages/{page:04d}/page.png"
    with Image.open(source) as image:
        ink = layout.ink_mask(image)
        masked = ink.copy()
        figures = []
        sequence = 0
        for index, block in enumerate(parsed, 1):
            if block["kind"] != "fig":
                continue
            sequence += 1
            box, snap = layout.snap(ink, block["box"])
            x, y, width, height = box
            masked[max(0, y):y + height, max(0, x):x + width] = False
            figures.append({
                "id": blocks.fig_id(block["label"], page, sequence),
                "ref": f"p{page:04d}#{index}", "label": block["label"],
                "rough_box": block["box"], "native_memory_snap_box": box,
                "native_snap": snap, "crop_written": False, "geometry_approved": False,
            })
        columns = ink.any(axis=0).nonzero()[0]
        content_width = int(columns[-1] - columns[0] + 1) if columns.size else image.width
        bands = layout.line_bands(masked, content_width)
        dimensions = list(image.size)
    block_rows = [
        len(block["lines"]) + sum(line.count(blocks.WRAP) for line in block["lines"])
        for block in parsed
    ]
    candidate_rows = blocks.printed_lines(parsed)
    results.append({
        "pdf_page": page, "printed_page": meta["printed_page"],
        "candidate": str(candidate), "source_png": str(source), "dimensions_px": dimensions,
        "visually_authored_printed_rows": expected["visually_authored_printed_rows"],
        "physical_rows_per_block_before_samerow": block_rows,
        "block_rows_match_author": block_rows == expected["physical_rows_per_block_before_samerow"],
        "candidate_rows": candidate_rows, "native_masked_rows": len(bands),
        "native_minus_candidate": len(bands) - candidate_rows,
        "native_count_matches_author": len(bands) == candidate_rows == expected["visually_authored_printed_rows"],
        "native_masked_bands": [[int(a), int(b)] for a, b in bands],
        "figures": figures, "counting_overrides": meta.get("counting"),
        "open_cont_boundaries": [
            {"ref": f"p{page:04d}#{i}", "kind": block["kind"], "label": block["label"],
             "open": block["open"], "cont": block["cont"],
             "first_line": block["lines"][0], "last_line": block["lines"][-1]}
            for i, block in enumerate(parsed, 1)
            if block["open"] or block["cont"]
        ],
        "calls_per_page": {
            "page_png_deterministic_decode": 1, "blocks_load": 1,
            "blocks_printed_lines": 1, "layout_ink_mask": 1, "layout_line_bands": 1,
            "layout_snap": len(figures),
        },
    })
print(json.dumps({
    "schema": "STEMROBIN-181/source-author-native-counts@1",
    "role": "author-instrumentation-not-independent-SCI-SOURCE-review",
    "runtime": {
        "executable": str(Path(sys.executable).resolve()),
        "invoked_executable": sys.executable,
        "version": sys.version, "platform": platform.platform(),
        "dont_write_bytecode": sys.dont_write_bytecode,
        "dependencies": {
            module.__name__: {"version": module.__version__, "entrypoint": str(Path(module.__file__).resolve())}
            for module in (PIL, numpy, scipy)
        },
        "native_helpers": [str(Path(module.__file__).resolve()) for module in (blocks, layout)],
    },
    "pages": results, "source_writes": False, "crop_writes": False,
    "geometry_approval": False, "self_SCI_SOURCE_review": False,
    "model_visible_image_opens_added": 0,
}, ensure_ascii=False, indent=2))
