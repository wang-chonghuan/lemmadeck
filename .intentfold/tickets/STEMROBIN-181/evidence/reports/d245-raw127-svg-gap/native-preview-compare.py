import hashlib
import json
from pathlib import Path

from PIL import Image, ImageChops


OUT = Path(__file__).resolve().parent
ROOT = OUT.parents[4]
RAW = ROOT / "ssot-resources/soviet10year-textbooks/artifacts/10p/figures/fig-127.png"
SVG = ROOT / ".intentfold/tickets/STEMROBIN-181/tmp/d129-source166-167-author/work/10p/pages/0166/figures/fig-127.svg"
RASTER = ROOT / ".intentfold/tickets/STEMROBIN-181/evidence/reports/d156-raw127/fig-127-original-svg-raster.png"
EXPECTED = {
    RAW: "082eae84a079e8c1ced01bbd1680d1e8c0c9819e9ee09d4d3b4f0c477727080d",
    SVG: "2ebe4bc0cded0ab963dfe68d13fb43cf8d8a759e9daf7cb70cfa2709727682a3",
    RASTER: "b7f026439724d364db5c05d29eed3a2b8b7d265dc56c468ada0bd1f51efd390a",
}
PREVIEW = OUT / "fig-127-existing-svg-native-white.png"
RECEIPT = OUT / "native-preview-receipt.json"
COMPARISON = OUT / "pixel-comparison.json"


def sha256(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


for source, expected in EXPECTED.items():
    if sha256(source) != expected:
        raise RuntimeError(f"Input hash mismatch: {source}")
for output in (PREVIEW, RECEIPT, COMPARISON):
    if output.exists():
        raise RuntimeError(f"Refusing to overwrite: {output}")

with Image.open(RAW) as image:
    raw = image.convert("RGB")
with Image.open(RASTER) as image:
    raster = image.convert("RGBA")
if raw.size != (378, 341) or raster.size != raw.size:
    raise RuntimeError("Native dimension mismatch; resizing is forbidden")

# Reuse the existing raster. Only its presentation background changes.
white = Image.new("RGBA", raster.size, (255, 255, 255, 255))
preview = Image.alpha_composite(white, raster).convert("RGB")
preview.save(PREVIEW, format="PNG")
receipt = {
    "schema": "native-existing-svg-raster-presentation@1",
    "status": "PASS-NATIVE-PRESENTATION-ONLY",
    "inputSvg": {"path": str(SVG), "sha256": EXPECTED[SVG]},
    "reusedRaster": {"path": str(RASTER), "sha256": EXPECTED[RASTER]},
    "output": {"path": str(PREVIEW), "sha256": sha256(PREVIEW)},
    "dimensions": [378, 341],
    "newSvgRasterizations": 0,
    "existingRasterizer": "bundled sharp, inherited from d156 receipt",
    "resvgRerenderNotNeededBecauseBoundRasterExists": True,
    "method": "Existing Pillow RGBA alpha composite over opaque white",
    "backgroundPresentationOnly": True,
    "resizeCropOrPathEdit": False,
    "sourceFilesChanged": False,
    "visualFidelityPassImplied": False,
}
RECEIPT.write_text(json.dumps(receipt, indent=2) + "\n", encoding="ascii")

raw_gray = raw.convert("L")
preview_gray = preview.convert("L")
raw_ink = raw_gray.point(lambda value: 255 if value < 128 else 0)
preview_ink = preview_gray.point(lambda value: 255 if value < 128 else 0)
raw_values = list(raw_ink.getdata())
preview_values = list(preview_ink.getdata())
width, height = raw.size
total = width * height
exact_binary_mismatch = sum(a != b for a, b in zip(raw_values, preview_values))
absolute_difference = ImageChops.difference(raw_gray, preview_gray)
histogram = absolute_difference.histogram()
mean_absolute_difference = sum(value * count for value, count in enumerate(histogram)) / total


def unmatched_foreground(source, target):
    count = 0
    for index, value in enumerate(source):
        if not value:
            continue
        x = index % width
        y = index // width
        has_neighbor = any(
            target[ny * width + nx]
            for ny in range(max(0, y - 1), min(height, y + 2))
            for nx in range(max(0, x - 1), min(width, x + 2))
        )
        if not has_neighbor:
            count += 1
    return count


missing = unmatched_foreground(raw_values, preview_values)
added = unmatched_foreground(preview_values, raw_values)
comparison = {
    "schema": "native-raw-svg-raster-pixel-comparison@1",
    "status": "METRICS-ONLY-NOT-VISUAL-APPROVAL",
    "raw": {"path": str(RAW), "sha256": EXPECTED[RAW]},
    "preview": {"path": str(PREVIEW), "sha256": sha256(PREVIEW)},
    "dimensions": [width, height],
    "totalPixels": total,
    "threshold": "Ink is grayscale < 128",
    "exactBinaryMismatchPixels": exact_binary_mismatch,
    "exactBinaryMismatchPercent": 100 * exact_binary_mismatch / total,
    "meanAbsoluteGrayscaleDifference": mean_absolute_difference,
    "rawInkPixels": sum(bool(value) for value in raw_values),
    "previewInkPixels": sum(bool(value) for value in preview_values),
    "onePixelNeighborhood": "Chebyshev radius 1, used only to describe antialias-edge correspondence",
    "rawInkWithoutPreviewNeighbor": missing,
    "previewInkWithoutRawNeighbor": added,
    "onePixelUnmatchedPercent": 100 * (missing + added) / total,
    "rawInkBounds": list(raw_ink.getbbox()),
    "previewInkBounds": list(preview_ink.getbbox()),
    "numericThresholdUsedAsSemanticOrVisualPass": False,
    "noDiffImageGenerated": True,
    "noResizeCropOrSvgRerender": True,
}
COMPARISON.write_text(json.dumps(comparison, indent=2) + "\n", encoding="ascii")
for source, expected in EXPECTED.items():
    if sha256(source) != expected:
        raise RuntimeError(f"Input changed during native processing: {source}")
print(json.dumps({"receipt": receipt, "comparison": comparison}, indent=2))
