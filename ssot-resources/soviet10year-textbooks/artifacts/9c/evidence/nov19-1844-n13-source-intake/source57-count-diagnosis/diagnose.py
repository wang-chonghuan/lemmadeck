import hashlib
import json
from pathlib import Path
import sys

import numpy as np
from PIL import Image
from scipy import ndimage


REPO = Path("/Users/yong/.codex/worktrees/stemrobin-184-resume/lemmadeck")
ROOT = REPO / ".tmp/stemrobin-184-resume/n13-source57-count-diagnosis"
TOOLS = REPO / ".claude/skills/ld-s10y-lesson/tools"
sys.path.insert(0, str(TOOLS))
import blocks as B
import layout


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def bounds(mask, offset_x=0, offset_y=0):
    ys, xs = np.nonzero(mask)
    if not len(xs):
        return None
    return [
        int(xs.min()) + offset_x, int(ys.min()) + offset_y,
        int(xs.max() - xs.min() + 1), int(ys.max() - ys.min() + 1),
    ]


def main():
    if Path.cwd() != REPO:
        raise RuntimeError("Wrong cwd")
    source = REPO / ".tmp/ld-s10y-lesson/9c/pages/0057/page.png"
    roi_root = REPO / ".tmp/stemrobin-184-resume/n13-source57-underbrace-roi"
    roi_path = roi_root / "underbraces-roi.png"
    roi_record = json.loads((roi_root / "roi-observations.json").read_text(encoding="utf-8"))
    page_root = REPO / "ssot-resources/soviet10year-textbooks/artifacts/9c/pages/0057"
    page = page_root / "page.md"
    audit = json.loads((page_root / "audit.json").read_text(encoding="utf-8"))
    prepared = json.loads((source.parent / "layout.json").read_text(encoding="utf-8"))
    meta, blocks = B.load(page)
    if meta.get("figures") or meta.get("count_exclusions") or audit["count_exclusions"]:
        raise RuntimeError("Unexpected figure or exclusions; no alternate counting permitted")
    if sha(source) != roi_record["source"]["sha256"]:
        raise RuntimeError("Source hash mismatch")
    if sha(roi_path) != roi_record["roi"]["sha256"]:
        raise RuntimeError("Frozen ROI hash mismatch")
    inputs = [
        source, roi_path, roi_root / "roi-observations.json",
        page, page_root / "audit.json", source.parent / "layout.json",
        TOOLS / "layout.py", TOOLS / "blocks.py",
    ]
    before = {str(p): sha(p) for p in inputs}
    x, y, w, h = roi_record["roi"]["actualRectXYWH"]

    # Numeric pixel inspection only: no new image, crop, render or visual open.
    with Image.open(source) as image, Image.open(roi_path) as roi_image:
        pixels = np.asarray(image.convert("RGB"))
        roi_pixels = np.asarray(roi_image.convert("RGB"))
        if not np.array_equal(pixels[y:y+h, x:x+w], roi_pixels):
            raise RuntimeError("Existing ROI is not an exact source-pixel subarray")
        ink = layout.ink_mask(image)
        roi_ink = layout.ink_mask(roi_image)
    masked = layout.counting_ink(ink, [])
    columns = ink.any(axis=0).nonzero()[0]
    content_width = int(columns[-1] - columns[0] + 1) if columns.size else ink.shape[1]
    native_bands = layout.line_bands(masked, content_width)
    band_records = []
    for number, (top, bottom) in enumerate(native_bands, 1):
        lo, hi = max(int(top), y), min(int(bottom) + 1, y + h)
        roi_slice = ink[lo:hi, x:x+w] if lo < hi else np.zeros((0, w), dtype=bool)
        band_records.append({
            "band": number,
            "yInclusive": [int(top), int(bottom)],
            "sourceInkBoxXYWH": bounds(ink[top:bottom+1], offset_y=int(top)),
            "sourceInkPixels": int(ink[top:bottom+1].sum()),
            "roiInkBoxXYWH": bounds(roi_slice, offset_x=x, offset_y=lo),
            "roiInkPixels": int(roi_slice.sum()),
        })

    labels, total = ndimage.label(roi_ink)
    components = []
    for component_id, slices in enumerate(ndimage.find_objects(labels), 1):
        if slices is None:
            continue
        rows, columns = slices
        mask = labels[slices] == component_id
        area = int(mask.sum())
        global_top, global_bottom = y + rows.start, y + rows.stop - 1
        components.append({
            "id": component_id,
            "roiBoxXYWH": [columns.start, rows.start,
                           columns.stop - columns.start, rows.stop - rows.start],
            "sourceBoxXYWH": [x + columns.start, global_top,
                              columns.stop - columns.start, rows.stop - rows.start],
            "inkPixels": area,
            "overlappingNativeBands": [
                n for n, (a, b) in enumerate(native_bands, 1)
                if global_top <= b and global_bottom >= a
            ],
        })
    logical_rows = []
    row = 0
    for block_number, block in enumerate(blocks, 1):
        for line_number, text in enumerate(block["lines"], 1):
            row += 1
            logical_rows.append({
                "mainRow": row, "block": block_number, "kind": block["kind"],
                "lineWithinBlock": line_number, "text": text,
                "existingWrapMarkers": text.count(B.WRAP),
            })
    after = {str(p): sha(p) for p in inputs}
    if after != before:
        raise RuntimeError("Input changed during measurement")
    result = {
        "kind": "unchanged-native-count-api-measurements",
        "apiCalls": ["layout.ink_mask", "layout.counting_ink(ink, [])",
                     "layout.line_bands(masked, native content_width)",
                     "blocks.load", "blocks.printed_lines"],
        "inputHashes": before,
        "inputHashesStableAfter": True,
        "sourceShapeHW": list(ink.shape),
        "contentWidth": content_width,
        "nativeBandCount": len(native_bands),
        "nativeBands": band_records,
        "preparedLayoutBands": prepared["line_bands"],
        "actualAudit": audit,
        "blockPrintedLines": B.printed_lines(blocks),
        "logicalMainRows": logical_rows,
        "existingRoiExactSourceSubarray": True,
        "existingRoiRectXYWH": [x, y, w, h],
        "roiComponentCount": int(total),
        "roiComponents": components,
        "semanticAssignment": "NOT inferred by this numeric measurement; mapping to follow from frozen observations and geometry",
        "contextImageUsage": {"used": 2, "limit": 4, "newVisualLoads": 0},
        "newImagesOrCropsCreated": 0,
        "canonicalEdits": 0,
        "finalizerInvocations": 0,
    }
    output = ROOT / "native-measurements.json"
    output.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
