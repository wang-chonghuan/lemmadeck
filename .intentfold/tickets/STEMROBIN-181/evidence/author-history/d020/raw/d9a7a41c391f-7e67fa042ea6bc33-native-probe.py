#!/usr/bin/env python3
"""Read-only source bindings, exact frozen crop comparisons and three counters."""

import hashlib
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[5]
TOOLS = ROOT / ".claude/skills/ld-s10y-lesson/tools"
sys.path.insert(0, str(TOOLS))

import blocks
import layout
import p2c

FREEZE = ROOT / (
    ".intentfold/tickets/STEMROBIN-181/tmp/"
    "9p-next-source-0196-0199/author-freeze.json"
)
EXPECTED_FREEZE = "89d490e90702e380a5640f2389cfd49e04b3841ce289c35b7363e6cb357200b1"
VISUAL_ROWS = {196: 23, 197: 18, 198: 24, 199: 20}
CONFIGS = {
    196: {
        "edge_margin_px": 120,
        "reason": (
            "Independent original-page inspection: the 120px left/right strips "
            "contain only scan-edge traces and the lower-right shadow, not "
            "printed words, equations or footer. Remove the non-text band "
            "y2160-2192 from the counting copy only."
        ),
    },
    198: {
        "edge_margin_px": 120,
        "reason": (
            "Independent original-page inspection: the 120px left/right strips "
            "contain scan-edge traces and the lower-right shadow, not printed "
            "words, the two conversion rows or footer. Remove the non-text "
            "band y2156-2180 from the counting copy only."
        ),
    },
    199: {
        "top_margin_px": 26,
        "reason": (
            "Independent original-page inspection: rows y0-25 contain the "
            "isolated top-right scan blemish and no printed text; the first "
            "printed row starts at y231. Clear y0-25 in the counting copy only."
        ),
    },
}


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def bindings(value, found):
    if not isinstance(value, (dict, list)):
        return
    if isinstance(value, dict):
        if "path" in value and "sha256" in value:
            path = ROOT / value["path"]
            actual = digest(path)
            assert actual == value["sha256"], f"Changed frozen binding: {path}"
            found[value["path"]] = actual
        children = value.values()
    else:
        children = value
    for child in children:
        bindings(child, found)


assert digest(FREEZE) == EXPECTED_FREEZE
freeze = json.loads(FREEZE.read_text())
before = {}
bindings(freeze, before)
observations = []
crop_checks = []
counter_calls = []
for page in freeze["pages"]:
    number = page["pdf_page"]
    source = ROOT / page["source"]["path"]
    draft = ROOT / page["draft"]["path"]
    meta, parsed = blocks.parse(draft.read_text())
    physical_rows = [
        len(block["lines"]) + sum(line.count(blocks.WRAP) for line in block["lines"])
        if block["kind"] in blocks.KINDS_TEXT else 0
        for block in parsed
    ]
    row_total = blocks.printed_lines(parsed)
    assert row_total == page["draft_printed_rows"]
    observations.append({
        "page": number,
        "draft": page["draft"],
        "source": page["source"],
        "blocks": len(parsed),
        "physical_block_rows_before_samerow": physical_rows,
        "printed_rows": row_total,
        "independent_visual_rows": VISUAL_ROWS[number],
        "counting_present_in_frozen_draft": "counting" in meta,
        "blank_text_blocks": [
            index + 1 for index, block in enumerate(parsed)
            if block["kind"] in blocks.KINDS_TEXT and not block["lines"]
        ],
    })
    with Image.open(source) as image:
        source_pixels = np.asarray(image).copy()
        ink = layout.ink_mask(image)
    masked = ink.copy()
    for figure in page["figures"]:
        x, y, width, height = figure["snapped_box"]
        masked[y:y + height, x:x + width] = False
        cx, cy, cw, ch = figure["exact_source_extraction_box_xywh"]
        assert [cx, cy, cw, ch] == [
            x - figure["padding_px"], y - figure["padding_px"],
            width + 2 * figure["padding_px"], height + 2 * figure["padding_px"],
        ]
        with Image.open(ROOT / figure["candidate"]["path"]) as candidate:
            candidate_pixels = np.asarray(candidate).copy()
            candidate_mode = candidate.mode
        expected = source_pixels[cy:cy + ch, cx:cx + cw]
        assert expected.shape == candidate_pixels.shape
        mismatched = int(np.count_nonzero(expected != candidate_pixels))
        assert mismatched == 0, f"Candidate pixels differ: {figure['id']}"
        crop_checks.append({
            "id": figure["id"],
            "source": page["source"],
            "candidate": figure["candidate"],
            "snapped_box_xywh": figure["snapped_box"],
            "source_extraction_box_xywh": [cx, cy, cw, ch],
            "padding_px": figure["padding_px"],
            "candidate_mode": candidate_mode,
            "candidate_dimensions_px": [cw, ch],
            "mismatched_pixel_channels": mismatched,
            "resnapping_or_crop_writes": False,
        })
    if number not in CONFIGS:
        continue
    columns = ink.any(axis=0).nonzero()[0]
    content_width = int(columns[-1] - columns[0] + 1) if columns.size else ink.shape[1]
    # The native validator is called exactly once for each affected page.
    config = CONFIGS[number]
    bands = p2c._counting_line_bands({"counting": config}, masked, content_width)
    counter_calls.append(number)
    actual_rows = len(bands)
    observations[-1]["single_native_counter_probe"] = {
        "config": config,
        "content_width": content_width,
        "calls": 1,
        "before_native_rows_author_evidence": page["native_count"],
        "after_native_rows_independently_measured": actual_rows,
        "allowed_delta": -1,
        "actual_delta": actual_rows - page["native_count"],
        "bands_y_inclusive": bands,
        "matches_draft": actual_rows == row_total,
        "matches_independent_visual_rows": actual_rows == VISUAL_ROWS[number],
    }

assert counter_calls == [196, 198, 199]
after = {}
bindings(freeze, after)
assert before == after
assert digest(FREEZE) == EXPECTED_FREEZE
print(json.dumps({
    "freeze_sha256": EXPECTED_FREEZE,
    "native_tools": {name: digest(TOOLS / name) for name in (
        "layout.py", "blocks.py", "p2c.py",
    )},
    "frozen_unique_bindings_verified_before_and_after": len(before),
    "counter_calls": counter_calls,
    "default_counter_calls": [],
    "pages": observations,
    "figure_pixel_checks": crop_checks,
    "source_or_draft_or_candidate_writes": False,
    "displayed_images": 0,
}, ensure_ascii=True, indent=2))
