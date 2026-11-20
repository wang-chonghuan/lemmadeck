"""Read-only FIG23 inspection; writes deterministic evidence only in this directory."""

import copy
import hashlib
import json
import math
from pathlib import Path
import sys
import xml.etree.ElementTree as ET


ROOT = Path("/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck")
OWN = ROOT / ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d139-n17-fig23-review"
INPUT = OWN / "input-freeze.json"


def read_json(path):
    return json.loads(Path(path).read_text())


def absolute(path):
    path = Path(path)
    return path if path.is_absolute() else ROOT / path


def metadata(path):
    path = absolute(path)
    data = path.read_bytes()
    result = {
        "path": str(path),
        "bytes": len(data),
        "sha256": hashlib.sha256(data).hexdigest(),
    }
    if path.suffix == ".png":
        assert data[:8] == b"\x89PNG\r\n\x1a\n"
        result["width"] = int.from_bytes(data[16:20], "big")
        result["height"] = int.from_bytes(data[20:24], "big")
    return result


def save(name, value):
    path = OWN / name
    assert path.parent == OWN and path != INPUT
    path.write_text(json.dumps(value, indent=2, ensure_ascii=True) + "\n")


freeze = read_json(INPUT)
expected_input_sha = "4b00c9938b02dcec10541e5fe4cfa9e76d9d3195a82a3dc4dd78d9613975bbac"
assert metadata(INPUT)["sha256"] == expected_input_sha, "Parent input changed"
entries = {
    key: value
    for key, value in freeze.items()
    if isinstance(value, dict) and "path" in value and "sha256" in value
}
entries.update({f"preview-{i}": value for i, value in enumerate(freeze["previews"])})
input_bindings = []
for role, expected in entries.items():
    actual = metadata(expected["path"])
    actual["role"] = role
    actual["matchesFrozenSha"] = actual["sha256"] == expected["sha256"]
    actual["matchesFrozenBytes"] = actual["bytes"] == expected["bytes"]
    assert actual["matchesFrozenSha"] and actual["matchesFrozenBytes"], role
    input_bindings.append(actual)

if "--freeze" in sys.argv:
    report = read_json(OWN / "report.json")
    ledger = read_json(OWN / "image-ledger.json")
    assert report["independent"] and not report["reviewerIsAuthor"]
    assert report["actualImages"] == ledger["actualImages"] == 3
    assert report["semanticVerdict"] in ("pass", "revise", "hold")
    assert report["offlineVisualVerdict"] in ("pass", "revise", "hold")
    for binding in report["hashBindings"].values():
        assert metadata(binding["path"])["sha256"] == binding["sha256"]
    for image in ledger["sequence"]:
        assert metadata(image["path"])["sha256"] == image["sha256"]
    checks = read_json(OWN / "independent-checks.json")
    assert checks["allScopedMechanicalChecksPass"]
    own_names = (
        "source-first-inventory.json",
        "independent-check.py",
        "independent-checks.json",
        "independent-findings.json",
        "image-ledger.json",
        "report.json",
    )
    own_files = [metadata(OWN / name) for name in own_names]
    save("review-freeze.json", {
        "schema": "d139-independent-offline-review-freeze-v1",
        "ticket": "STEMROBIN-181",
        "batch": "D139",
        "lesson": "phy9-c1-s2-n17",
        "figure": "fig-23",
        "independent": True,
        "reviewerIsAuthor": False,
        "productAcceptance": False,
        "nativeReviewAt1Created": False,
        "durablePromotion": False,
        "parentCollectsAndCloses": True,
        "inputFreeze": metadata(INPUT),
        "inputs": input_bindings,
        "outputs": own_files,
        "semanticVerdict": report["semanticVerdict"],
        "offlineVisualVerdict": report["offlineVisualVerdict"],
        "actualImages": ledger["actualImages"],
        "remainingHolds": report["remainingHolds"],
        "hashConvention": "SHA-256 of exact file bytes; this freeze has no recursive self-hash. Its SHA is returned separately.",
        "authorFindingsUsedAsVerdict": False,
        "paidCalls": 0,
        "nativeStagesReplayed": False,
        "inputsUnchangedAtFreeze": True,
    })
    print(json.dumps({
        "report": metadata(OWN / "report.json"),
        "freeze": metadata(OWN / "review-freeze.json"),
        "ledger": metadata(OWN / "image-ledger.json"),
    }, indent=2))
    sys.exit(0)

spec = read_json(freeze["currentSpec"]["path"])
old = read_json(freeze["originalCandidate"]["path"])
render = read_json(freeze["currentRender"]["path"])
diagnostic = read_json(freeze["alphaOnlyDeltaDiagnostic"]["path"])
objects = {o["id"]: o for o in spec["objects"]}
old_objects = {o["id"]: o for o in old["objects"]}
points = {o["id"]: o["at"] for o in spec["objects"] if o["type"] == "point"}
assertions = {a["id"]: a for a in spec["assertions"]}
svg_root = ET.parse(freeze["currentSvg"]["path"]).getroot()
svg_elements = {
    e.get("id").removeprefix("ld-fig-23_ld-"): e
    for e in svg_root.iter() if e.get("id", "").startswith("ld-fig-23_ld-")
}


def resolve(value):
    if isinstance(value, str) and value in points:
        return points[value]
    if isinstance(value, list):
        return [resolve(v) for v in value]
    if isinstance(value, dict):
        return {key: resolve(v) for key, v in value.items()}
    return value


def normalized_object(obj):
    value = resolve(copy.deepcopy(obj))
    if value["type"] == "text":
        value.pop("at", None)
        value.pop("labelPlacement", None)
    return value


def close(a, b):
    return math.isclose(a, b, abs_tol=1e-7, rel_tol=1e-12)


aliases = []
added = [o for o in spec["objects"] if o["id"] not in old_objects]
for point in added:
    circle_id = point["id"].removesuffix("-source-point")
    circle, original = objects[circle_id], old_objects[circle_id]
    element, disk = svg_elements[point["id"]], svg_elements[circle_id]
    at = point["at"]
    exact = circle["center"] == point["id"] and at == original["center"]
    mapped = (
        close(float(element.get("cx")), at[0])
        and close(float(element.get("cy")), spec["canvas"]["height"] - at[1])
        and element.get("cx") == disk.get("cx")
        and element.get("cy") == disk.get("cy")
    )
    outer_radius = max(float(element.get("rx")), float(element.get("ry"))) + 0.05
    contained = outer_radius <= min(float(disk.get("rx")), float(disk.get("ry")))
    no_new_role = (
        point["type"] == "point" and point.get("visible") is True
        and not point.get("label") and point["stroke"] == point["fill"] == "ink"
        and element.get("fill") == disk.get("fill")
        and element.get("fill-opacity") == disk.get("fill-opacity") == "1"
    )
    aliases.append({
        "point": point["id"], "originalCircle": circle_id, "at": at,
        "svgCenter": [float(element.get("cx")), float(element.get("cy"))],
        "svgMarkerOuterRadius": outer_radius,
        "originalOpaqueDiskRadius": float(disk.get("rx")),
        "exactOriginalCenter": exact, "svgCenterMatches": mapped,
        "markerFootprintInsideExistingDisk": contained,
        "noNewLabelColorOrApparatusRole": no_new_role,
    })

coverage = []
for group in spec["source"]["inventory"]:
    point_ids = set(group["objects"]) & set(points)
    relations = []
    covered = set()
    for assertion_id in group["assertions"]:
        assertion = assertions[assertion_id]
        refs = {
            v for k, v in assertion.items()
            if k in ("from", "to", "a", "b", "c", "d", "point", "center")
            and isinstance(v, str) and v in points
        }
        if assertion["type"] != "objectCount" and len(refs) >= 2 and refs <= point_ids:
            covered.update(refs)
            row = {"id": assertion_id, "type": assertion["type"], "points": sorted(refs)}
            if assertion["type"] == "displacement":
                start, end = resolve(assertion["from"]), resolve(assertion["to"])
                actual = [end[i] - start[i] for i in (0, 1)]
                row["actualCanvasDelta"] = actual
                row["matchesDeclaredDelta"] = (
                    close(actual[0], assertion["dx"]) and close(actual[1], assertion["dy"])
                )
            relations.append(row)
    coverage.append({
        "group": group["id"], "requires": group.get("requires", []),
        "mappedPointIds": sorted(point_ids), "coveredPointIds": sorted(covered),
        "allMappedObjectIdsResolve": all(i in objects for i in group["objects"]),
        "allMappedAssertionIdsResolve": all(i in assertions for i in group["assertions"]),
        "everyPointCoveredWithinGroup": covered == point_ids,
        "relationships": relations,
    })

retained_geometry_changes = [
    o["id"] for o in old["objects"]
    if o["id"] not in objects or normalized_object(o) != normalized_object(objects[o["id"]])
]
raw_changes = [
    o["id"] for o in old["objects"] if o["id"] in objects and o != objects[o["id"]]
]
old_assertions = {a["id"]: a for a in old["assertions"]}
retained_assertion_changes = [
    i for i, a in old_assertions.items() if i not in assertions or resolve(a) != resolve(assertions[i])
]
svg_segment_mismatches = []
svg_segments_checked = 0
for obj in spec["objects"]:
    if obj["type"] != "segment":
        continue
    svg_segments_checked += 1
    e = svg_elements.get(obj["id"])
    start, end = resolve(obj["from"]), resolve(obj["to"])
    expected = (start[0], 924 - start[1], end[0], 924 - end[1])
    if e is None or not e.tag.endswith("}line") or not all(
        close(float(e.get(k)), v) for k, v in zip(("x1", "y1", "x2", "y2"), expected)
    ):
        svg_segment_mismatches.append(obj["id"])

state_geometry = []
for panel in "abc":
    bellows = objects[f"{panel}-bellows-body"]["points"]
    ys = [p[1] for p in bellows]
    pivot = resolve(objects[f"{panel}-gauge-pivot"]["center"])
    needle = objects[f"{panel}-gauge-needle"]
    tip_delta = [needle["to"][i] - pivot[i] for i in (0, 1)]
    bath = objects.get(f"{panel}-bath-left-wall")
    state_geometry.append({
        "panel": panel,
        "bellowsCanvasHeight": max(ys) - min(ys),
        "needleTipDeltaFromOwnPivot": tip_delta,
        "needleDirection": "upper-right" if tip_delta[1] > 0 else "lower-right",
        "rodEndsAtOwnJoint": objects[f"{panel}-operating-rod"]["to"] == points[f"{panel}-rod-plate-joint-source-point"],
        "bathPresent": bath is not None,
        "thermometerBulb": points[f"{panel}-thermometer-bulb-source-point"],
        "thermometerLeftOfBellows": points[f"{panel}-thermometer-bulb-source-point"][0] < min(p[0] for p in bellows) if bath else None,
        "numbersAreCanvasGeometryNotPhysicalReadings": True,
    })

text_nodes = [e for e in svg_root.iter() if e.tag.endswith("}text")]
label_rows = [
    {"id": e.get("data-label-id"), "text": "".join(e.itertext()),
     "fontSize": float(e.get("font-size")), "x": float(e.get("x")), "y": float(e.get("y"))}
    for e in text_nodes
]
diagnostic_rgb_changes = sum(d["before"][:3] != d["after"][:3] for d in diagnostic["differences"])
diagnostic_rows = []
for delta in diagnostic["differences"]:
    distances = []
    for point_id in delta["nearbyAliases"]:
        e = svg_elements[point_id]
        cx, cy = float(e.get("cx")) * 331 / 640, float(e.get("cy")) * 331 / 640
        distances.append(math.hypot(delta["x"] + 0.5 - cx, delta["y"] + 0.5 - cy))
    diagnostic_rows.append({
        "pixel": [delta["x"], delta["y"]],
        "alphaDelta": delta["after"][3] - delta["before"][3],
        "nearestNamedOriginalCenterDistanceMobilePx": min(distances),
        "aliases": delta["nearbyAliases"],
    })

result = {
    "schema": "d139-independent-scoped-checks-v1",
    "inputFreeze": metadata(INPUT),
    "inputBindings": input_bindings,
    "sourceFirstInventory": metadata(OWN / "source-first-inventory.json"),
    "nativeValidationOrRenderingExecuted": False,
    "sourceGeometryComparison": {
        "originalObjects": len(old["objects"]), "currentObjects": len(spec["objects"]),
        "originalObjectOrderRetained": [o["id"] for o in spec["objects"][:len(old["objects"])]] == [o["id"] for o in old["objects"]],
        "retainedGeometryChangesAfterExactReferenceResolution": retained_geometry_changes,
        "rawChangedOriginalObjectIds": raw_changes,
        "addedObjects": [o["id"] for o in added],
        "retainedAssertionsChangedAfterReferenceResolution": retained_assertion_changes,
        "canvasDisplayLayoutUnchanged": all(spec[k] == old[k] for k in ("canvas", "display", "layout")),
        "completeAuthoritativeTextMatchesOriginalAndParent": spec["source"]["authoritativeText"] == old["source"]["authoritativeText"] == freeze["authoritativeText"],
        "countsAloneAreNotPhysicsEvidence": True,
    },
    "aliases": aliases,
    "inGroupPointRelationships": coverage,
    "actualSvgSegments": {"checked": svg_segments_checked, "coordinateMismatches": svg_segment_mismatches},
    "qualitativeStateGeometry": state_geometry,
    "actualSvgLabels": label_rows,
    "inheritedRenderEvidence": {
        "status": render["status"], "collisions": render["collisions"],
        "displayChecks": render["displayChecks"], "replayed": False,
        "specAndSvgHashesMatch": render["spec"]["sha256"] == freeze["currentSpec"]["sha256"] and render["output"]["svg"]["sha256"] == freeze["currentSvg"]["sha256"],
    },
    "alphaDiagnosticInspection": {
        "basis": "Arithmetic and center-locality inspection of frozen parent diagnostic, not a new raster comparison or image open.",
        "differentPixels": diagnostic["differentPixels"],
        "recordedDifferenceCount": len(diagnostic["differences"]),
        "rgbChanges": diagnostic_rgb_changes,
        "maximumAbsoluteAlphaDelta": max(abs(d["after"][3] - d["before"][3]) for d in diagnostic["differences"]),
        "locations": diagnostic_rows,
        "pixelIdentityClaimed": False,
        "visualImpactJudgmentIsInIndependentFindings": True,
    },
}
result["allScopedMechanicalChecksPass"] = (
    len(added) == 12
    and not retained_geometry_changes and not retained_assertion_changes
    and result["sourceGeometryComparison"]["originalObjectOrderRetained"]
    and result["sourceGeometryComparison"]["canvasDisplayLayoutUnchanged"]
    and result["sourceGeometryComparison"]["completeAuthoritativeTextMatchesOriginalAndParent"]
    and all(all(row[k] for k in (
        "exactOriginalCenter", "svgCenterMatches", "markerFootprintInsideExistingDisk",
        "noNewLabelColorOrApparatusRole",
    )) for row in aliases)
    and all(row["everyPointCoveredWithinGroup"] for row in coverage)
    and all(r.get("matchesDeclaredDelta", True) for row in coverage for r in row["relationships"])
    and not svg_segment_mismatches
    and len(label_rows) == 12
    and diagnostic_rgb_changes == 0 and len(diagnostic_rows) == 14
    and result["inheritedRenderEvidence"]["specAndSvgHashesMatch"]
)
save("independent-checks.json", result)
print(json.dumps({
    "allScopedMechanicalChecksPass": result["allScopedMechanicalChecksPass"],
    "checkFile": metadata(OWN / "independent-checks.json"),
    "aliases": len(aliases),
    "svgSegmentsChecked": svg_segments_checked,
    "pointCoverageGroups": len(coverage),
    "retainedGeometryChanges": retained_geometry_changes,
    "retainedAssertionChanges": retained_assertion_changes,
    "alphaRGBChanges": diagnostic_rgb_changes,
}, indent=2))
if not result["allScopedMechanicalChecksPass"]:
    sys.exit(1)
