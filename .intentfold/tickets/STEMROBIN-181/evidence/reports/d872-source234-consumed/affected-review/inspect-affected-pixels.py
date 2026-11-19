"""Reviewer-only source/crop measurements. Never invoke production helpers."""
from pathlib import Path
import json
import numpy as np
from PIL import Image
from scipy import ndimage

R = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
T = R / ".intentfold/tickets/STEMROBIN-181"
O = T / "tmp/d861-source234-two-spaces-crop-affected-review"
A = T / "tmp/d834-source234-first-author"
C = T / "tmp/d857-source234-text-crop-repair"
assert Path.cwd() == R
SOURCE = A / "work/10p/pages/0234/page.png"
RAW = C / "work/10p/pages/0234/figures/fig-204.png"
RASTER = O / "raw204-repaired-svg-review.png"
source_image = Image.open(SOURCE).convert("RGB")
source_rgb = np.asarray(source_image)
source = np.asarray(source_image.convert("L")) < 128
raw_image = Image.open(RAW).convert("RGB")
raw_rgb = np.asarray(raw_image)
raw = np.asarray(raw_image.convert("L")) < 128
svg = np.asarray(Image.open(RASTER).convert("L")) < 128
rect = [798, 1417, 1281, 1689]
region = [798, 1417, 80, 16]
x0, y0, x1, y1 = rect
original_crop = source_rgb[y0:y1, x0:x1]
expected = original_crop.copy()
expected[0:16, 0:80] = 255
assert raw_image.size == (483, 272)
assert np.array_equal(raw_rgb, expected), "Crop differs outside approved copy-only exclusion"
crop_ink = source[y0:y1, x0:x1]
excluded = np.zeros_like(crop_ink)
excluded[:16, :80] = True
removed = crop_ink & excluded
assert int(removed.sum()) == 547
connected, _ = ndimage.label(crop_ink)
removed_ids = set(connected[removed].tolist())
retained_ids = set(connected[crop_ink & ~excluded].tolist())
assert removed_ids and not (removed_ids & retained_ids), "Source stroke severed"

# Source components are classified by their position in the inspected schematic.
roi = [790, 1380, 1290, 1730]
rx0, ry0, rx1, ry1 = roi
labels, _ = ndimage.label(source[ry0:ry1, rx0:rx1])
components = []
figure = np.zeros_like(crop_ink)
neighbor_text = np.zeros_like(crop_ink)
for label, bounds in enumerate(ndimage.find_objects(labels), 1):
    if bounds is None:
        continue
    yy, xx = bounds
    local = labels[bounds] == label
    area = int(local.sum())
    if area < 2:
        continue
    bx, by = rx0 + xx.start, ry0 + yy.start
    bw, bh = xx.stop - xx.start, yy.stop - yy.start
    is_figure = by >= 1430 and by + bh <= 1681
    semantic = "figure" if is_figure else ("caption" if by >= 1689 else "prose")
    components.append({"pixels": area, "sourceBoxXYWH": [bx, by, bw, bh], "owner": semantic})
    gx, gy = max(bx, x0), max(by, y0)
    hx, hy = min(bx + bw, x1), min(by + bh, y1)
    if gx < hx and gy < hy:
        target = figure if is_figure else neighbor_text
        target[gy-y0:hy-y0, gx-x0:hx-x0] |= local[gy-by:hy-by, gx-bx:hx-bx]
assert int(figure.sum()) == 7086
assert int((figure & excluded).sum()) == 0
assert int((figure & raw).sum()) == 7086
assert int((figure & ~raw).sum()) == 0
assert int((neighbor_text & raw).sum()) == 0
assert int(raw.sum()) == 7088
assert int((raw & ~figure).sum()) == 2
expected_parts = {
    (806, 1430, 459, 251): ("star, arc, radius/arrow, horizontal ray, patch, B dot", 5993),
    (948, 1474, 20, 26): ("R", 251),
    (818, 1503, 23, 23): ("S", 200),
    (1252, 1521, 21, 29): ("B", 263),
    (1145, 1523, 16, 17): ("a", 162),
    (1140, 1573, 18, 25): ("b", 217),
}
figure_parts = [item for item in components if item["owner"] == "figure"]
assert len(figure_parts) == len(expected_parts)
for item in figure_parts:
    name, count = expected_parts[tuple(item["sourceBoxXYWH"])]
    assert item["pixels"] == count
    item["semantic"] = name
    item["pngPreservation"] = "EXACT_ALL_SOURCE_INK_RETAINED"
assert svg.shape == raw.shape
window = np.ones((3, 3), dtype=bool)
svg_d = ndimage.binary_dilation(svg, structure=window)
raw_d = ndimage.binary_dilation(raw, structure=window)
missing = int((raw & ~svg_d).sum())
extra = int((svg & ~raw_d).sum())
percent = 100 * (missing + extra) / int(raw.sum())
assert percent < 0.02
yy, xx = np.indices(raw.shape)
prose_zone = (xx + x0 < 950) & (yy + y0 < 1440)
caption_zone = yy + y0 >= 1685
assert int((raw & prose_zone).sum()) == 0
assert int((raw & caption_zone).sum()) == 0
assert int((svg & prose_zone).sum()) == 0
assert int((svg & caption_zone).sum()) == 0
ys, xs = np.nonzero(raw)
edges = [int(xs.min()), int(ys.min()), int(raw.shape[1]-1-xs.max()),
         int(raw.shape[0]-1-ys.max())]
assert edges == [8, 13, 8, 8]
detail = O / "source234-raw204-region-review.png"
assert not detail.exists()
source_image.crop(tuple(roi)).resize((1000, 700), Image.Resampling.NEAREST).save(detail)
result = {
    "schema": "source234-affected-crop-pixels@1", "status": "PASS",
    "source": str(SOURCE), "repairedPNG": str(RAW), "svgReviewRaster": str(RASTER),
    "sourceRegionReview": str(detail), "threshold": 128,
    "sourceRectXYXYExclusive": rect, "cropSize": list(raw_image.size),
    "excludeTextRegionXYWH": region,
    "exactSourceCopyExceptAuthorizedWhiteRectangle": True,
    "removedProseInkPixels": int(removed.sum()), "removedFigureInkPixels": 0,
    "connectedComponentGuardIndependent": {
        "status": "PASS", "removedIds": sorted(removed_ids),
        "retainedIds": sorted(retained_ids), "intersection": []
    },
    "substantiveSourceFigureInk": 7086, "retainedSubstantiveFigureInk": 7086,
    "missingSubstantiveFigureInkPNG": 0, "twoRetainedSourceSpecks": 2,
    "proseInkPNG": 0, "captionInkPNG": 0, "proseInkSVG": 0, "captionInkSVG": 0,
    "whiteEdgesLTRB": edges, "sourceROI": roi, "sourceComponents": components,
    "svgVersusPNG": {
        "tolerancePx": 1, "sourceInk": int(raw.sum()), "svgInk": int(svg.sum()),
        "missingInkPx": missing, "extraInkPx": extra, "mismatchPercent": percent,
        "disposition": "REPRESENTATION_PASS_NOT_PIXEL_IDENTICAL",
        "note": "All 7086 substantive source pixels are exact in PNG. SVG preserves the same schematic at native vector tolerance."
    }
}
target = O / "pixel-inspection.json"
assert not target.exists()
target.write_text(json.dumps(result, indent=2) + "\n")
print(json.dumps({key: result[key] for key in [
    "status", "substantiveSourceFigureInk", "retainedSubstantiveFigureInk",
    "removedProseInkPixels", "proseInkPNG", "captionInkPNG", "proseInkSVG",
    "captionInkSVG", "whiteEdgesLTRB", "svgVersusPNG", "sourceRegionReview"
]}, indent=2))
