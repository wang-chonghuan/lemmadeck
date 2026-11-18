"""Read-only crop and existing-SVG raster comparison; never traces or finalizes."""

import hashlib
import json
from pathlib import Path

import numpy as np
from PIL import Image

OWN = Path(__file__).resolve().parent
AUTHOR = OWN.parent / "d599-source207-first-author"
SOURCE = AUTHOR / "work/10p/pages/0207/page.png"
RAW = AUTHOR / "work/10p/pages/0207/figures/fig-181.png"
PREVIEW = OWN / "raw181-svg-preview.png"


def decode(file):
    with Image.open(file) as image:
        return np.asarray(image.convert("L"))


def file_facts(file):
    data = file.read_bytes()
    return {
        "path": str(file),
        "bytes": len(data),
        "sha256": hashlib.sha256(data).hexdigest(),
    }


def dilate(mask):
    result = mask.copy()
    for dy in range(-1, 2):
        for dx in range(-1, 2):
            if dy or dx:
                result |= np.roll(np.roll(mask, dy, axis=0), dx, axis=1)
    return result


page = decode(SOURCE)
raw = decode(RAW)
preview = decode(PREVIEW)
audit = json.loads((AUTHOR / "source/10p/pages/0207/audit.json").read_text())
x, y, width, height = audit["figures"][0]["box"]
padding = 12
expected_crop = page[y - padding:y + height + padding, x - padding:x + width + padding]
crop_shape_match = expected_crop.shape == raw.shape
crop_gray_differences = int(np.count_nonzero(expected_crop != raw)) if crop_shape_match else None
crop_ink_differences = int(np.count_nonzero((expected_crop < 128) != (raw < 128))) if crop_shape_match else None
same_size = raw.shape == preview.shape
source_ink = raw < 128
rendered_ink = preview < 128
missing = int(np.count_nonzero(source_ink & ~dilate(rendered_ink))) if same_size else None
extra = int(np.count_nonzero(rendered_ink & ~dilate(source_ink))) if same_size else None
ink_pixels = int(source_ink.sum())
ratio = (missing + extra) / ink_pixels if same_size and ink_pixels else None
raw_pass = crop_shape_match and crop_ink_differences == 0
svg_pass = same_size and ratio is not None and ratio <= 0.02
result = {
    "schema": "d606-read-only-pixel-comparison@1",
    "status": "PASS" if raw_pass and svg_pass else "FAIL",
    "decoder_reads_charged_to_ledger": [
        {"ordinal": 5, "path": str(SOURCE), "purpose": "Read-only native crop provenance"},
        {"ordinal": 6, "path": str(RAW), "purpose": "Read-only RAW crop equality and existing-SVG comparison"},
        {"ordinal": 7, "path": str(PREVIEW), "purpose": "Read-only raster fidelity of frozen SVG"},
    ],
    "new_visual_payloads": 0,
    "source": file_facts(SOURCE),
    "raw": file_facts(RAW),
    "preview": file_facts(PREVIEW),
    "crop": {
        "native_box_xywh": [x, y, width, height],
        "padding_px": padding,
        "source_crop_xyxy": [x - padding, y - padding, x + width + padding, y + height + padding],
        "shape_match": crop_shape_match,
        "grayscale_differing_pixels": crop_gray_differences,
        "threshold128_ink_differing_pixels": crop_ink_differences,
        "status": "PASS" if raw_pass else "FAIL",
    },
    "existing_svg_raster": {
        "raw_dimensions_wh": [int(raw.shape[1]), int(raw.shape[0])],
        "preview_dimensions_wh": [int(preview.shape[1]), int(preview.shape[0])],
        "source_ink_pixels": ink_pixels,
        "missing_pixels_beyond_1px_tolerance": missing,
        "extra_pixels_beyond_1px_tolerance": extra,
        "mismatch_ratio": ratio,
        "mismatch_percent": ratio * 100 if ratio is not None else None,
        "limit_ratio": 0.02,
        "edge_tolerance_px": 1,
        "mask_threshold": 128,
        "status": "PASS" if svg_pass else "FAIL",
        "interpretation": "Supports raw traced-source fidelity only, not modern semantic or product-display acceptance.",
    },
    "native_finalize_invocations": 0,
    "vectorize_invocations": 0,
    "source_pixel_writes": 0,
}
with (OWN / "pixel-comparison.json").open("x") as output:
    output.write(json.dumps(result, ensure_ascii=False, indent=2) + "\n")
print(json.dumps({"status": result["status"], "crop": result["crop"], "svg": result["existing_svg_raster"]}))
raise SystemExit(0 if raw_pass and svg_pass else 1)
