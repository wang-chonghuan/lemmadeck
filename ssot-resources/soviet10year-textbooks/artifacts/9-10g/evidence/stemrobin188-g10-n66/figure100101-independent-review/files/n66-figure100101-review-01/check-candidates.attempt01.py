#!/usr/bin/env python3
"""Offline, text-only independent geometry and SVG audit for figures 100/101."""

import hashlib
import json
import math
import re
import sys
from pathlib import Path
from xml.etree import ElementTree as ET


SCOPE = Path(__file__).resolve().parent
MANIFEST = SCOPE.parent / "n66-figure100101-review-inputs-01/manifest.json"
manifest = json.loads(MANIFEST.read_text())
before = json.loads((SCOPE / "input-bindings.before.json").read_text())
author_path = next(item["path"] for item in manifest["inputs"]
                   if item["path"].endswith("/author-report.json"))
author = json.loads(Path(author_path).read_text())
collection_path = next(item["path"] for item in manifest["inputs"]
                       if item["path"].endswith("-collection-01.json"))
collection = json.loads(Path(collection_path).read_text())
known = {item["path"]: item for item in before["inputs"]}
byte_checks = []
for record in collection["outputs"] + author["inputBefore"]:
    if record["path"] in known:
        actual = known[record["path"]]
        ok = actual["bytes"] == record["bytes"] and actual["sha256"] == record["sha256"]
        byte_checks.append({"path": record["path"], "expectedBytes": record["bytes"],
                            "actualBytes": actual["bytes"], "pass": ok})

def numbers(value):
    return [float(token) for token in re.findall(r"[-+]?(?:\d*\.)?\d+(?:e[-+]?\d+)?", value)]

def cubic(points, t):
    return [sum(points[i][j] * math.comb(3, i) * t**i * (1-t)**(3-i)
                for i in range(4)) for j in range(2)]

def derivative_controls(points, coordinate):
    return [3 * (points[i+1][coordinate] - points[i][coordinate]) for i in range(3)]

def path_cubics(d):
    # These bound candidates use one absolute M followed by absolute C segments.
    tokens = re.findall(r"[A-Za-z]|[-+]?(?:\d*\.)?\d+(?:e[-+]?\d+)?", d)
    if tokens[0] != "M":
        raise ValueError("Expected absolute M")
    current = [float(tokens[1]), float(tokens[2])]
    result = []
    cursor = 3
    while cursor < len(tokens):
        if tokens[cursor] != "C":
            raise ValueError("Expected absolute C")
        values = [float(v) for v in tokens[cursor+1:cursor+7]]
        controls = [values[i:i+2] for i in range(0, 6, 2)]
        result.append([current, *controls])
        current = controls[-1]
        cursor += 7
    return result

def y_at_x(curves, x):
    curve = next(c for c in curves if c[0][0]-1e-6 <= x <= c[-1][0]+1e-6)
    lo, hi = 0.0, 1.0
    for _ in range(60):
        mid = (lo+hi)/2
        if cubic(curve, mid)[0] < x:
            lo = mid
        else:
            hi = mid
    return cubic(curve, (lo+hi)/2)[1]

results = []
for figure in manifest["figures"]:
    spec = json.loads(Path(figure["spec"]["path"]).read_text())
    render = json.loads(Path(figure["render"]["path"]).read_text())
    svg_path = Path(figure["svg"]["path"])
    tree = ET.parse(svg_path)
    svg = tree.getroot()
    elements = list(svg.iter())
    objects = {o["id"]: o for o in spec["objects"]}
    point_ids = {o["id"] for o in spec["objects"] if o["type"] == "point"}
    assertions = {a["id"]: a for a in spec["assertions"]}
    checks = {}
    inventory = []
    for group in spec["source"]["inventory"]:
        mapped = [assertions[a] for a in group["assertions"]]
        covered = set()
        for assertion in mapped:
            references = {value for value in assertion.values()
                          if isinstance(value, str) and value in point_ids}
            if references.issubset(set(group["objects"])):
                covered.update(references)
        expected_points = set(group["objects"]) & point_ids
        required = "pointRelationships" in group.get("requires", [])
        inventory.append({
            "group": group["id"], "allObjectsResolve": all(o in objects for o in group["objects"]),
            "allAssertionsResolve": all(a in assertions for a in group["assertions"]),
            "requiresPointRelationships": required, "mappedPoints": sorted(expected_points),
            "coveredPoints": sorted(expected_points & covered),
            "pass": not required or expected_points.issubset(covered),
        })
    paths = [e for e in elements if e.tag.rsplit("}", 1)[-1] == "path"]
    texts = [e for e in elements if e.tag.rsplit("}", 1)[-1] == "text"]
    visible_texts = ["".join(e.itertext()) for e in texts]
    svg_bytes = svg_path.read_bytes()
    checks["currentSpecHashInRender"] = render["spec"]["sha256"] == hashlib.sha256(
        Path(figure["spec"]["path"]).read_bytes()).hexdigest()
    checks["currentSvgHashInRender"] = render["output"]["svg"]["sha256"] == hashlib.sha256(
        svg_bytes).hexdigest()
    checks["renderPassNoCollisions"] = render["status"] == "pass" and not render["collisions"]
    checks["svg640Width"] = float(svg.attrib["width"].removesuffix("px")) == 640
    checks["svgLabelCount"] = len(texts) == figure["labelCount"]
    checks["noCyrillicOrCjkVisible"] = not any(re.search(r"[\u0400-\u052f\u4e00-\u9fff]", s)
                                           for s in visible_texts)
    checks["cssVariableInkPresent"] = b"var(--ld-figure-ink" in svg_bytes
    path_bindings = []
    segment_bindings = []
    for obj in spec["objects"]:
        if obj["type"] == "svgPath":
            candidates = [e for e in paths if e.get("d") == obj["d"]]
            dash_ok = len(candidates) == 1 and bool(candidates[0].get("stroke-dasharray")) == bool(obj["dash"])
            path_bindings.append({"object": obj["id"], "exactPathMatch": len(candidates) == 1,
                                  "solidDashedMatch": dash_ok})
        elif obj["type"] in ["segment", "arrow"]:
            candidates = [e for e in elements if e.get("id", "").endswith("_ld-" + obj["id"])]
            coords_ok = len(candidates) == 1 and all(
                abs(float(candidates[0].get(key, "nan")) - value) < 1e-5
                for key, value in zip(["x1", "y1", "x2", "y2"],
                                      [obj["from"][0], -obj["from"][1],
                                       obj["to"][0], -obj["to"][1]]))
            dash_ok = len(candidates) == 1 and bool(candidates[0].get("stroke-dasharray")) == bool(obj["dash"])
            segment_bindings.append({"object": obj["id"], "endpointMatch": coords_ok,
                                     "solidDashedMatch": dash_ok})
    checks["actualSvgPathsAndDashStylesMatchSpec"] = all(
        p["exactPathMatch"] and p["solidDashedMatch"] for p in path_bindings)
    checks["actualSvgSegmentsAndDashStylesMatchSpec"] = all(
        p["endpointMatch"] and p["solidDashedMatch"] for p in segment_bindings)
    checks["displayAtLeast16"] = all(c["measuredMinPx"] >= 16 and c["status"] == "pass"
                                   for c in render["displayChecks"])
    checks["allInventoryRequirementsCovered"] = all(g["pass"] and g["allObjectsResolve"]
                                                  and g["allAssertionsResolve"] for g in inventory)
    if spec["id"].endswith("100"):
        top = path_cubics(objects["f100-body-top"]["d"])
        bottom = path_cubics(objects["f100-body-bottom"]["d"])
        checks["bodyXIncreasingAndRadiusIncreasing"] = all(
            min(derivative_controls(c, 0)) > 0 and max(derivative_controls(c, 1)) < 0
            for c in top)
        checks["bodyTopBottomMirroredForRevolution"] = all(
            abs(t[i][0] - b[i][0]) < 1e-6 and abs(t[i][1] + b[i][1] - 440) < 1e-5
            for t, b in zip(top, bottom) for i in range(4))
        checks["actualStationRadii"] = all(
            abs(y_at_x(top, x) - y) < 1e-5
            for x, y in [(175, 175), (280, 125), (395, 90), (535, 55)])
        checks["innerSliceOuterContainment"] = all(
            90-1e-5 <= y_at_x(top, 280+115*i/1000) <= 125+1e-5
            for i in range(1001))
        checks["generatorEqualAxialExtent"] = all(
            objects[f"f100-{kind}-{side}-generator"]["from"][0] == 280
            and objects[f"f100-{kind}-{side}-generator"]["to"][0] == 395
            and objects[f"f100-{kind}-{side}-generator"]["from"][1]
            == objects[f"f100-{kind}-{side}-generator"]["to"][1]
            for kind in ["inner", "outer"] for side in ["top", "bottom"])
        diameter = objects["f100-b-oblique-diameter"]
        checks["bObliqueEndpointsOnRimAndThroughCenter"] = all(
            abs(((p[0]-535)/49.5)**2 + ((p[1]+220)/165)**2 - 1) < 1e-5
            for p in [diameter["from"], diameter["to"]]) and all(
                abs((diameter["from"][i]+diameter["to"][i])/2 - [535, -220][i]) < 1e-5
                for i in range(2))
        checks["sourceRelevantDashSolidStyles"] = (
            all(objects[f"f100-{p}-diameter"]["dash"] == 2 for p in ["a", "x", "dx"])
            and objects["f100-b-vertical-diameter"]["dash"] == 0
            and objects["f100-b-oblique-diameter"]["dash"] == 0
            and all(objects[f"f100-inner-{p}-generator"]["dash"] == 2
                    and objects[f"f100-outer-{p}-generator"]["dash"] == 0
                    for p in ["top", "bottom"]))
        details = {
            "stationOrder": ["a", "x", "x+Delta x", "b"],
            "schematicRadiiNotSourceNumbers": [45, 95, 130, 165],
            "equalCylinderAxialHeight": 115,
            "sampleCountForSliceContainment": 1001,
            "freeSvgPathsCheckedAgainstLiteralEndpointGeometry": True,
        }
    else:
        curves = path_cubics(objects["f101-upper-curve"]["d"])
        checks["curveEndpointsAtAAndB"] = (curves[0][0] == [210, 330]
                                          and curves[-1][-1] == [505, 330])
        checks["curveIncreasingX"] = all(min(derivative_controls(c, 0)) > 0 for c in curves)
        checks["nonmonotonePositiveInteriorSingleSummit"] = (
            max(derivative_controls(curves[0], 1)) == 0
            and min(derivative_controls(curves[0], 1)) < 0
            and min(derivative_controls(curves[1], 1)) == 0
            and max(derivative_controls(curves[1], 1)) > 0
            and curves[0][-1] == curves[1][0] == [350, 80])
        checks["guideMeetsActualSummitAndAxisAtC"] = (
            objects["f101-c-guide"]["from"] == objects["f101-c"]["at"] == [350, -330]
            and objects["f101-c-guide"]["to"] == [350, -80])
        hatch_numbers = numbers(objects["f101-region-hatches"]["d"])
        hatches = [hatch_numbers[i:i+4] for i in range(0, len(hatch_numbers), 4)]
        clearance = []
        for x1, y1, x2, y2 in hatches:
            for i in range(101):
                t = i/100
                x, y = x1+(x2-x1)*t, y1+(y2-y1)*t
                clearance.append(y-y_at_x(curves, x))
                if not (210-1e-4 <= x <= 505+1e-4 and y <= 330+1e-4):
                    raise ValueError("Hatching escapes the region")
        checks["hatchesContainedWithinCurveAndBaseline"] = min(clearance) >= -0.002
        checks["hatchesDescendRightWithUniformSlope"] = all(
            x2 > x1 and y2 > y1 and abs((y2-y1)/(x2-x1)-0.62) < 1e-5
            for x1, y1, x2, y2 in hatches)
        checks["allBoundariesSolid"] = all(objects[id]["dash"] == 0 for id in [
            "f101-upper-curve", "f101-x-axis", "f101-y-axis", "f101-c-guide"])
        details = {
            "stationOrder": ["a", "c", "b"], "hatchCount": len(hatches),
            "minimumSampledHatchCurveClearancePx": min(clearance),
            "summitSchematicNotOriginalNumericValue": [350, 80],
            "freeSvgPathsCheckedAgainstLiteralEndpointGeometry": True,
        }
    screens = []
    for item in manifest["screenshots"]:
        if item["figure"] != spec["id"]:
            continue
        geometry, scroll = item["geometry"], item["scroll"]
        endpoint = scroll["left"] == (scroll["total"]-scroll["client"] if item["position"] == "end" else 0)
        screens.append({
            "position": item["position"], "viewport": item["viewport"], "geometry": geometry,
            "scroll": scroll, "endpointEquationPass": endpoint,
            "textAtLeast16": min(geometry["textPx"]) >= 16,
            "fixedSvgWidth640": geometry["svgWidth"] == 640,
            "noDocumentHorizontalOverflow": geometry["documentWidth"] == item["viewport"]["width"],
            "measurementProvenance": "Provided hash-bound headless offline manifest, not a new product test",
        })
    checks["allBoundEndpointAndReadabilityChecks"] = all(
        s["endpointEquationPass"] and s["textAtLeast16"] and s["fixedSvgWidth640"]
        and s["noDocumentHorizontalOverflow"] for s in screens)
    results.append({
        "figure": spec["id"], "status": "pass" if all(checks.values()) else "fail",
        "checks": checks, "geometry": details, "inventoryCoverage": inventory,
        "svg": {"path": str(svg_path), "paths": len(paths), "labels": visible_texts,
                "dashedPathCount": sum(bool(e.get("stroke-dasharray")) for e in paths),
                "literalPathBindings": path_bindings, "segmentBindings": segment_bindings},
        "boundSurfaceChecks": screens,
        "limitation": "Literal SVG paths are checked independently here; native relational assertions alone do not prove path attachment.",
    })
payload = {
    "schema": "same188-6/independent-text-only-candidate-checks@1",
    "status": "pass" if all(r["status"] == "pass" for r in results)
              and all(c["pass"] for c in byte_checks) else "fail",
    "authorCollectionAndInputDeclaredByteChecks": byte_checks,
    "figures": results, "imageOpens": 0, "networkCalls": 0,
}
(SCOPE / "candidate-checks.json").write_text(json.dumps(payload, indent=2) + "\n")
print(json.dumps(payload, indent=2))
sys.exit(0 if payload["status"] == "pass" else 1)
