"""Diagnostic-only ink-copy attribution; no finalizer or source/metadata writes."""

import json
import sys
from pathlib import Path

REPO = Path("/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184")
TOOLS = REPO / ".claude/skills/ld-s10y-lesson/tools"
sys.path.insert(0, str(TOOLS))

import layout
import numpy as np
from PIL import Image
from scipy import ndimage

OUT = Path(__file__).resolve().parent
PREPARED = REPO / ".tmp/stemrobin-184-six/n11-nov23-source4651/prepared/9c/pages"
PROPOSALS = {
    46: {
        "kind": "separator-rule",
        "box": [225, 2036, 470, 14],
        "reason": "Inspected thin footnote separator only; retain the instructional footnote below.",
    },
    48: {
        "kind": "scan-artifact",
        "box": [0, 811, 52, 71],
        "reason": "Inspected far-left blotch, wholly outside the prose and centered exercise heading.",
    },
    49: {
        "kind": "scan-artifact",
        "box": [1562, 843, 47, 45],
        "reason": "Far-right solid blotch identified in frozen source inventory and original connected-component pixels; no text or math in its bounds.",
    },
}


def bands_record(mask, content_width):
    bands = layout.line_bands(mask, content_width)
    return {"count": len(bands), "bands_y_inclusive": bands}


result = {
    "purpose": "pixel-only count attribution, not page finalization or approval",
    "coordinates": "zero-based source pixels; x,y,w,h; band endpoints inclusive",
    "no_expected_count_input": True,
    "proposals_applied_to_source_or_page_metadata": False,
    "internal_annotation_is_not_a_count_exclusion": True,
    "pages": [],
}
for page in (46, 47, 48, 49):
    source = PREPARED / f"{page:04d}/page.png"
    with Image.open(source) as image:
        ink = layout.ink_mask(image)
    labels, _ = ndimage.label(ink)
    columns = np.flatnonzero(ink.any(axis=0))
    content_width = int(columns[-1] - columns[0] + 1)
    if page == 47:
        # This strip was inspected; its exact ink extent derives the proposal.
        ys, xs = np.nonzero(ink[2334:])
        proposal = {
            "kind": "scan-artifact",
            "box": [
                int(xs.min()), 2334 + int(ys.min()),
                int(xs.max() - xs.min() + 1), int(ys.max() - ys.min() + 1),
            ],
            "reason": "Inspected bottom-edge scan trace below the footer, confined to the bottom 5% of the source page.",
        }
    else:
        proposal = PROPOSALS[page]
    masked = layout.counting_ink(ink, [proposal])
    record = {
        "page": page,
        "source": str(source),
        "source_sha256": layout.sha256_file(source),
        "proposal": proposal,
        "existing_exclusion_geometry_contract": "accepted by unchanged layout.counting_ink",
        "unaltered_native": bands_record(ink, content_width),
        "diagnostic_ink_copy_without_proposed_object": bands_record(masked, content_width),
    }
    print(
        f"{page:04d} proposal={proposal['kind']} {proposal['box']} "
        f"native={record['unaltered_native']['count']} "
        f"diagnostic_without_object={record['diagnostic_ink_copy_without_proposed_object']['count']}"
    )
    if page == 49:
        annotation_ids = [476, 479, 481, 482]
        annotation_pixels = np.isin(labels, annotation_ids)
        ys, xs = np.nonzero(annotation_pixels)
        annotation_box = [
            int(xs.min()), int(ys.min()),
            int(xs.max() - xs.min() + 1), int(ys.max() - ys.min() + 1),
        ]
        x, y, width, height = annotation_box
        other_box_ink = int(
            np.count_nonzero(
                ink[y:y + height, x:x + width]
                & ~annotation_pixels[y:y + height, x:x + width]
            )
        )
        no_annotation = masked.copy()
        no_annotation[annotation_pixels] = False
        record["annotation_attribution_only"] = {
            "not_an_allowable_exclusion_proposal": True,
            "source_component_ids": annotation_ids,
            "union_box": annotation_box,
            "ink_pixels": int(annotation_pixels.sum()),
            "other_ink_pixels_in_union_box": other_box_ink,
            "method": "remove only four crop-confirmed handwriting components from a temporary ink copy",
            "without_blotch_and_annotation": bands_record(no_annotation, content_width),
        }
        print(
            f"  annotation CCs={annotation_ids} union={annotation_box} "
            f"other_box_ink={other_box_ink} "
            f"diagnostic_without_blotch_and_handwriting="
            f"{record['annotation_attribution_only']['without_blotch_and_annotation']['count']}"
        )
    result["pages"].append(record)

with (OUT / "count-attribution.json").open("x", encoding="utf-8") as output:
    json.dump(result, output, ensure_ascii=False, indent=2)
    output.write("\n")
