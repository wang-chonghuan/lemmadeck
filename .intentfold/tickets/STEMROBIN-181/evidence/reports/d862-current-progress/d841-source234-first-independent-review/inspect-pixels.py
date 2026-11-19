"""Read frozen source/RAW pixels; write reviewer-only coordinate evidence."""
from pathlib import Path
import hashlib
import json
import os
from datetime import datetime, timezone

import numpy as np
from PIL import Image
from scipy import ndimage

R = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
O = R / ".intentfold/tickets/STEMROBIN-181/tmp/d841-source234-first-independent-review"
A = R / ".intentfold/tickets/STEMROBIN-181/tmp/d834-source234-first-author"
assert Path.cwd() == R
SOURCE = A / "work/10p/pages/0234/page.png"
RAW = A / "work/10p/pages/0234/figures/fig-204.png"
RASTER = O / "raw204-frozen-svg-review.png"


def save_image(image, name):
    target = O / name
    assert target.parent == O and not target.exists()
    image.save(target)
    return str(target)


def components(mask, origin):
    labels, _ = ndimage.label(mask)
    result = []
    for lab, bounds in enumerate(ndimage.find_objects(labels), 1):
        if bounds is None:
            continue
        yy, xx = bounds
        area = int((labels[bounds] == lab).sum())
        if area < 2:
            continue
        result.append({
            "pixels": area,
            "sourceBoxXYWH": [xx.start + origin[0], yy.start + origin[1],
                              xx.stop - xx.start, yy.stop - yy.start],
        })
    return result


def white_edges(mask):
    ys, xs = np.nonzero(mask)
    if not len(xs):
        return None
    return [int(xs.min()), int(ys.min()), int(mask.shape[1] - 1 - xs.max()),
            int(mask.shape[0] - 1 - ys.max())]


source_image = Image.open(SOURCE).convert("RGB")
source = np.asarray(source_image.convert("L")) < 128
raw_image = Image.open(RAW).convert("RGB")
raw = np.asarray(raw_image.convert("L")) < 128
got = np.asarray(Image.open(RASTER).convert("L")) < 128
core = [806, 1425, 467, 256]
x, y, w, h = core
raw_rect = [x - 12, y - 12, x + w + 12, y + h + 12]
exact = source_image.crop(raw_rect)
assert exact.size == raw_image.size
assert np.array_equal(np.asarray(exact), np.asarray(raw_image))
source_bottom = save_image(source_image.crop((140, 1360, 1340, 2070)), "source234-bottom-review.png")
source_terminal = save_image(source_image.crop((1060, 1935, 1340, 2030)), "source234-terminal-review.png")

roi = (790, 1380, 1290, 1730)
region_components = components(source[roi[1]:roi[3], roi[0]:roi[2]], (roi[0], roi[1]))
tests = []
for padding in range(13):
    rect = [x - padding, y - padding, x + w + padding, y + h + padding]
    mask = source[rect[1]:rect[3], rect[0]:rect[2]]
    # These regions are outside the source-first figure relationships:
    # neighboring row 17 at the upper left, and figure caption below the arc.
    prose = mask.copy()
    yy, xx = np.indices(mask.shape)
    prose &= (xx + rect[0] < 950) & (yy + rect[1] < 1440)
    caption = mask & (yy + rect[1] >= 1685)
    tests.append({
        "paddingPx": padding, "sourceRectXYXYExclusive": rect,
        "size": [rect[2] - rect[0], rect[3] - rect[1]],
        "neighboringProseInkPx": int(prose.sum()),
        "captionInkPx": int(caption.sum()),
        "whiteEdgesLTRB": white_edges(mask),
        "neighborComponents": components(prose, (rect[0], rect[1])),
        "captionComponents": components(caption, (rect[0], rect[1])),
    })
save_image(source_image.crop((x, y, x + w, y + h)), "padding0-diagnostic-only.png")
save_image(source_image.crop((x - 2, y - 2, x + w + 2, y + h + 2)), "padding2-diagnostic-only.png")

assert got.shape == raw.shape
source_d = ndimage.binary_dilation(raw, structure=np.ones((3, 3), dtype=bool))
got_d = ndimage.binary_dilation(got, structure=np.ones((3, 3), dtype=bool))
missing = int((raw & ~got_d).sum())
extra = int((got & ~source_d).sum())
ink_px = int(raw.sum())
report = {
    "schema": "source234-independent-pixels@1",
    "recordedAt": datetime.now(timezone.utc).isoformat(),
    "cwd": os.getcwd(), "threshold": 128,
    "source": {"path": str(SOURCE), "sha256": hashlib.sha256(SOURCE.read_bytes()).hexdigest(),
               "size": list(source_image.size)},
    "rawPNG": {"path": str(RAW), "sha256": hashlib.sha256(RAW.read_bytes()).hexdigest(),
               "size": list(raw_image.size), "exactSourceRectXYXYExclusive": raw_rect,
               "pixelIdenticalToSourceRectangle": True, "whiteEdgesLTRB": white_edges(raw)},
    "snappedCoreXYWH": core,
    "reviewOnlyEvidence": [source_bottom, source_terminal],
    "sourceROI": list(roi), "sourceComponentsInROI": region_components,
    "paddingDiagnosticsNotProductionCandidates": tests,
    "svgVersusFrozenPNG": {
        "raster": str(RASTER), "sourceInkPx": ink_px, "missingInkPx": missing,
        "extraInkPx": extra, "tolerancePx": 1,
        "mismatchRatio": (missing + extra) / ink_px,
        "mismatchPercent": 100 * (missing + extra) / ink_px,
        "note": "Agreement with a contaminated crop does not prove source fidelity.",
    },
}
target = O / "pixel-inspection.json"
assert not target.exists()
target.write_text(json.dumps(report, indent=2) + "\n")
print(json.dumps({
    "rawPNG": report["rawPNG"],
    "paddingSummary": [
        {k: entry[k] for k in ("paddingPx", "neighboringProseInkPx", "captionInkPx", "whiteEdgesLTRB")}
        for entry in tests
    ],
    "svgVersusFrozenPNG": report["svgVersusFrozenPNG"],
    "reviewOnlyEvidence": report["reviewOnlyEvidence"],
}, indent=2))
