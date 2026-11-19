"""Quantify a proposed exclusion without saving any repaired PNG or SVG."""
from pathlib import Path
from datetime import datetime, timezone
import json
import numpy as np
from PIL import Image
from scipy import ndimage

R = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
O = R / ".intentfold/tickets/STEMROBIN-181/tmp/d841-source234-first-independent-review"
assert Path.cwd() == R
source_path = R / ".intentfold/tickets/STEMROBIN-181/tmp/d834-source234-first-author/work/10p/pages/0234/page.png"
source = np.asarray(Image.open(source_path).convert("L")) < 128
labels, _ = ndimage.label(source)
figure_boxes = [
    [806, 1430, 459, 251],
    [948, 1474, 20, 26],
    [818, 1503, 23, 23],
    [1252, 1521, 21, 29],
    [1145, 1523, 16, 17],
    [1140, 1573, 18, 25],
]
component_ids = {}
for lab, bounds in enumerate(ndimage.find_objects(labels), 1):
    if bounds is None:
        continue
    ys, xs = bounds
    box = (xs.start, ys.start, xs.stop - xs.start, ys.stop - ys.start)
    component_ids.setdefault(box, []).append(lab)
figure = np.zeros_like(source)
for box in figure_boxes:
    ids = component_ids[tuple(box)]
    assert len(ids) == 1
    figure |= labels == ids[0]
rect = [798, 1417, 1281, 1689]
exclusion = [798, 1417, 878, 1433]
ex = np.zeros_like(source)
ex[exclusion[1]:exclusion[3], exclusion[0]:exclusion[2]] = True
figure_overlap = int((figure & ex).sum())
assert figure_overlap == 0
prospective = source[rect[1]:rect[3], rect[0]:rect[2]].copy()
prospective[exclusion[1] - rect[1]:exclusion[3] - rect[1],
            exclusion[0] - rect[0]:exclusion[2] - rect[0]] = False
yy, xx = np.nonzero(prospective)
edges = [int(xx.min()), int(yy.min()),
         int(prospective.shape[1] - 1 - xx.max()),
         int(prospective.shape[0] - 1 - yy.max())]
terminal_roi = [1260, 1950, 1340, 2030]
terminal_labels, _ = ndimage.label(
    source[terminal_roi[1]:terminal_roi[3], terminal_roi[0]:terminal_roi[2]]
)
terminal_components = []
for lab, bounds in enumerate(ndimage.find_objects(terminal_labels), 1):
    yslice, xslice = bounds
    terminal_components.append({
        "boxXYWH": [terminal_roi[0] + xslice.start, terminal_roi[1] + yslice.start,
                    xslice.stop - xslice.start, yslice.stop - yslice.start],
        "inkPx": int((terminal_labels[bounds] == lab).sum()),
    })
report = {
    "schema": "source234-recommendation-measurement@1",
    "recordedAt": datetime.now(timezone.utc).isoformat(),
    "operation": "Numeric diagnostic only; no repaired PNG/SVG written and no producer run",
    "sourceFigureComponentsXYWH": figure_boxes,
    "sourceFigureInkPx": int(figure.sum()),
    "figureOnlyUnionBoxXYWH": [806, 1430, 467, 251],
    "topCropAt1433WouldLoseFigureInkPx": int(figure[:1433].sum()),
    "maximumCaptionFreePaddingOnExistingBox": 8,
    "proposedCropSourceRectXYXYExclusive": rect,
    "proposedNeighborProseOnlyExclusionXYXYExclusive": exclusion,
    "proposedExclusionFigureInkOverlapPx": figure_overlap,
    "proposedExclusionProseInkRemovedPx": int((source & ex).sum()),
    "prospectiveAfterExclusionInkPx": int(prospective.sum()),
    "prospectiveAfterExclusionWhiteEdgesLTRB": edges,
    "prospectiveRemainingInkBeyondSixFigureComponentsPx":
        int(prospective.sum()) - int(figure.sum()),
    "terminalROI": terminal_roi,
    "terminalComponents": terminal_components,
    "approval": "NONE; hypothetical mechanism needs separate authorization and affected RAW review",
    "firstFailedDiagnosticPreserved": "measurement-first-failure.json",
}
target = O / "recommendation-measurement.json"
assert not target.exists()
target.write_text(json.dumps(report, indent=2) + "\n")
print(json.dumps(report, indent=2))
