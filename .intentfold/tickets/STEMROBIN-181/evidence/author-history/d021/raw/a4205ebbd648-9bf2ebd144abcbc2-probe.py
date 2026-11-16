"""Two fixed, source-inspection-authorized counting probes; no extraction writes."""

import hashlib
import json
import sys
from pathlib import Path

sys.dont_write_bytecode = True
ROOT = Path(__file__).resolve().parents[5]
OUT = Path(__file__).resolve().parent
FREEZE = ROOT / ".intentfold/tickets/STEMROBIN-181/tmp/9p-next-source-0204-0207/author-freeze.json"
FREEZE_SHA = "0cefcbb06e96ef22eee2c130d59cf752da54604722fefbf977664dd94c00effa"
sys.path.insert(0, str(ROOT / ".claude/skills/ld-s10y-lesson/tools"))

from PIL import Image
import blocks
import layout
import p2c


def binding(path):
    path = Path(path).resolve()
    return {
        "path": str(path.relative_to(ROOT)),
        "sha256": hashlib.sha256(path.read_bytes()).hexdigest(),
    }


def checked(item):
    path = ROOT / item["path"]
    assert binding(path) == item, f"Frozen bytes changed: {path}"
    return path


assert binding(FREEZE)["sha256"] == FREEZE_SHA
freeze = json.loads(FREEZE.read_text(encoding="utf-8"))
output = OUT / "configured-counter-probes.json"
assert not output.exists(), "Write-once probes must not be rerun"
for item in freeze["tools"].values():
    checked(item)

results = []
for number, independent_rows, extra_band in (
    (204, 17, [2149, 2177]),
    (206, 24, [2153, 2179]),
):
    page = next(item for item in freeze["pages"] if item["pdf_page"] == number)
    source = checked(page["source"])
    draft = checked(page["draft"])
    mask = checked(page["figure_masked_counting_copy"])
    meta, parsed = blocks.load(draft)
    assert "counting" not in meta
    reason = (
        f"Independently opened original PDF page {number}: the leftmost and "
        "rightmost 120 px contain scan-edge strokes, specks and the lower-right "
        "triangular shadow, but no owned source text, caption or page number. "
        f"The frozen extra band {extra_band} lies below the printed footer. "
        "Exclude only these side margins in the counting copy; preserve all "
        "source pixels, physical text rows, formula rows and figure rectangles."
    )
    config = {"edge_margin_px": 120, "reason": reason}
    with Image.open(source) as image:
        assert list(image.size) == page["dimensions_px"]
        source_ink = layout.ink_mask(image)
        columns = source_ink.any(axis=0).nonzero()[0]
        content_width = int(columns[-1] - columns[0] + 1)
    with Image.open(mask) as image:
        masked = layout.ink_mask(image)
    probe_meta = dict(meta, counting=config)
    bands = p2c._counting_line_bands(probe_meta, masked, content_width)
    actual_bands = [[int(top), int(bottom)] for top, bottom in bands]
    frozen_bands = page["native_bands"]
    results.append({
        "pdf_page": number,
        "source": page["source"],
        "draft": page["draft"],
        "figure_masked_counting_copy": page["figure_masked_counting_copy"],
        "source_dimensions_px": page["dimensions_px"],
        "content_width_px": content_width,
        "independent_physical_rows_including_footer": independent_rows,
        "draft_printed_rows": blocks.printed_lines(parsed),
        "baseline": {
            "provenance": "Frozen author native result, not rerun or treated as visual authority",
            "count": page["native_count"],
            "bands": frozen_bands,
            "extra_shadow_band": extra_band,
        },
        "configured_probe": {
            "entrypoint": "p2c._counting_line_bands",
            "calls_this_review": 1,
            "config": config,
            "excluded_x_half_open": [[0, 120], [1384, 1504]],
            "excluded_top_rows": 0,
            "count": len(actual_bands),
            "bands": actual_bands,
            "removed_exact_bands": [band for band in frozen_bands if band not in actual_bands],
            "added_exact_bands": [band for band in actual_bands if band not in frozen_bands],
            "matches_independent_physical_rows": len(actual_bands) == independent_rows,
        },
        "draft_configuration_applied": False,
        "source_or_crop_pixels_written": False,
    })
    checked(page["source"])
    checked(page["draft"])
    checked(page["figure_masked_counting_copy"])

report = {
    "schema": "STEMROBIN-181/source-configured-counter-probes@1",
    "ticket": "STEMROBIN-181",
    "role": "independent-SOURCE-review-only",
    "freeze": binding(FREEZE),
    "helper": binding(Path(__file__)),
    "native_tools": freeze["tools"],
    "configured_counter_calls_total": 2,
    "baseline_counter_calls_this_review": 0,
    "parameter_sweeps": 0,
    "top_margin_probes": 0,
    "image_outputs": 0,
    "pages": results,
}
with output.open("x", encoding="utf-8") as stream:
    stream.write(json.dumps(report, ensure_ascii=False, indent=2) + "\n")
print(json.dumps({"proof": binding(output), "pages": results}, ensure_ascii=False, indent=2))
