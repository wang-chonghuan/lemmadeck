import hashlib
import json
import math
import sys
import xml.etree.ElementTree as ET
from pathlib import Path


CWD = Path("/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck")
assert Path.cwd() == CWD
LANE = CWD / ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d193-n20-figures30-31-author"
FIGURE = sys.argv[1]
assert FIGURE in {"fig-30", "fig-31"}
ATTEMPT = CWD / ".tmp/STEMROBIN-181/d1816-d193/figures" / FIGURE / "attempt-1"
OUT = ATTEMPT / "geometry-current.json"
assert not OUT.exists()


def receipt(file):
    file = Path(file).resolve()
    data = file.read_bytes()
    return {"path": str(file), "bytes": len(data), "sha256": hashlib.sha256(data).hexdigest()}


first = json.loads((ATTEMPT / "geometry-observations.json").read_text())
assert [c["id"] for c in first["checks"] if c["status"] != "pass"] == ["semantic-stroke-palette"]
svg = ET.parse(ATTEMPT / f"{FIGURE}.svg").getroot()
parents = {child: parent for parent in svg.iter() for child in parent}
nodes = list(svg.iter())
by_id = {node.attrib["id"]: node for node in nodes if "id" in node.attrib}


def hidden(node):
    while node is not None:
        if node.attrib.get("display") == "none" or "visibility: hidden" in node.attrib.get("style", ""):
            return True
        node = parents.get(node)
    return False


def in_defs(node):
    while node is not None:
        if node.tag.endswith("}defs"):
            return True
        node = parents.get(node)
    return False


visible = [n for n in nodes if not hidden(n) and not in_defs(n)]
nonsemantic = [n.attrib for n in visible if n.attrib.get("stroke") not in (None, "none") and "var(--ld-figure-" not in n.attrib["stroke"]]
inherited_markers = []
for node in nodes:
    if not node.tag.endswith("}marker") or node.attrib.get("stroke") != "context-stroke":
        continue
    identifier = node.attrib["id"]
    users = [n for n in visible if any(f"#{identifier}" in n.attrib.get(field, "") for field in ("marker-start", "marker-mid", "marker-end"))]
    inherited_markers.append({
        "marker": identifier,
        "referencingVisibleNodes": [n.attrib.get("id") for n in users],
        "referenceStrokes": [n.attrib.get("stroke") for n in users],
        "semanticInheritance": all("var(--ld-figure-" in n.attrib.get("stroke", "") for n in users),
        "qualification": "Materialized semantic arrowhead polygons may make the old defs marker unused; an unused defs marker renders no color."
    })
passed = not nonsemantic and all(item["semanticInheritance"] for item in inherited_markers)
palette_check = {
    "id": "semantic-stroke-palette", "status": "pass" if passed else "fail",
    "observed": {
        "visibleInstructionalStrokesUseSemanticVariables": not nonsemantic,
        "nonsemanticVisibleStrokes": nonsemantic,
        "hiddenConstructionNodesExcluded": sum(hidden(n) for n in nodes),
        "contextStrokeMarkers": inherited_markers
    },
    "recovery": "Failed assertion only: corrected visibility and SVG marker-inheritance scope. Candidate bytes unchanged; all other passed first checks reused without execution."
}
checks = [palette_check if c["id"] == "semantic-stroke-palette" else c for c in first["checks"]]
new_checks = []

# This adds the previously unexecuted all-landmark source-comparison check;
# it does not rerun any passed first checker or native renderer.
if FIGURE == "fig-31":
    model = json.loads((ATTEMPT / "drawing-model.json").read_text())
    inventory = json.loads((LANE / "fig-31.source-inventory.json").read_text())
    x0, y0, period = model["originX"], model["originY"], model["periodDrawingPx"]
    landmarks = []
    for fact in inventory["facts"]:
        identifier = fact["id"]
        if identifier not in {"source-charge-curve", "source-current-curve"}:
            continue
        is_charge = identifier == "source-charge-curve"
        amplitude = model["chargeAmplitudeDrawingPx" if is_charge else "currentAmplitudeDrawingPx"]
        for kind in ("positiveExtrema", "negativeExtrema", "zeroCrossings"):
            for source_x, source_y in fact["approximatePixelLandmarksNotCalibration"][kind]:
                if is_charge:
                    phase = {"positiveExtrema": 0, "negativeExtrema": 0.5, "zeroCrossings": 0.25}[kind]
                else:
                    phase = {"positiveExtrema": 0.75, "negativeExtrema": 0.25, "zeroCrossings": 0}[kind]
                spacing = period / 2 if kind == "zeroCrossings" else period
                base = x0 + phase * period
                modern_x = base + round((source_x - base) / spacing) * spacing
                angle = 2 * math.pi * (modern_x - x0) / period
                modern_y = y0 - (amplitude * math.cos(angle) if is_charge else -amplitude * math.sin(angle))
                landmarks.append({
                    "curve": identifier, "kind": kind, "sourcePixel": [source_x, source_y],
                    "modernScreen": [modern_x, modern_y],
                    "dxDrawingPx": abs(modern_x - source_x),
                    "dyDrawingPxAfter24PxVerticalPadding": abs(modern_y - source_y - 24)
                })
    new_checks.append({
        "id": "all-independently-inventoried-source-zeros-and-extrema",
        "status": "pass" if all(item["dxDrawingPx"] <= 10 and item["dyDrawingPxAfter24PxVerticalPadding"] <= 10 for item in landmarks) else "fail",
        "observed": landmarks,
        "qualification": "Ten drawing-pixel tolerance applies only to recorded scan landmarks and explicitly justified smoothing/leveling; no calibrated physical values, ticks, or queried numerical data are invented."
    })
checks.extend(new_checks)
result = {
    "schema": "d193/author-geometry-current@1", "figure": FIGURE, "role": "author",
    "independentReview": False,
    "status": "pass" if all(c["status"] == "pass" for c in checks) else "HOLD",
    "firstFailedEvidence": receipt(ATTEMPT / "geometry-observations.json"),
    "firstFailedCommands": receipt(LANE / "geometry-first-command-receipts.json"),
    "recoveryScript": receipt(Path(__file__)),
    "candidateSpec": receipt(ATTEMPT / "spec.json"),
    "candidateSvg": receipt(ATTEMPT / f"{FIGURE}.svg"),
    "candidateUnchangedSinceFirstChecker": receipt(ATTEMPT / "spec.json") == first["spec"] and receipt(ATTEMPT / f"{FIGURE}.svg") == first["svg"],
    "checks": checks,
    "reusedPassedFirstChecks": len(first["checks"]) - 1,
    "failedPaletteAssertionExecutions": 2,
    "newNonreplayedSourceLandmarkChecks": len(new_checks),
    "producerReplays": 0,
    "nativeValidationReplays": 0,
    "fullGeometryCheckerReplays": 0,
    "contentRepairs": 0,
    "productSurfaceVerified": False
}
OUT.write_text(json.dumps(result, ensure_ascii=True, indent=2) + "\n")
print(json.dumps({"figure": FIGURE, "status": result["status"], "failed": [c["id"] for c in checks if c["status"] != "pass"], "candidateChanged": not result["candidateUnchangedSinceFirstChecker"], "output": str(OUT)}))
sys.exit(0 if result["status"] == "pass" else 1)
