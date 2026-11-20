import hashlib
import json
import math
import re
import struct
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from pathlib import Path


ROOT = Path("/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck")
OUT = ROOT / ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d290-fig2425-review"
AUTHOR = ROOT / ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d280-fig2425-author"
EXPECTED_FREEZE = "23a81bda0a04c582842da169ad888651910c39f100bb28658c7b84d56ada3552"
EXPECTED_INVENTORY = "c3bbbb9c86389257b6a356b36467655ce5f0b9917642c16733a7b9d39e0b9e82"


def load(path):
    return json.loads(Path(path).read_text())


def bind(path):
    path = Path(path)
    data = path.read_bytes()
    return {
        "path": str(path),
        "bytes": len(data),
        "sha256": hashlib.sha256(data).hexdigest(),
    }


def emit(name, value):
    (OUT / name).write_text(json.dumps(value, ensure_ascii=True, indent=2) + "\n")


def close(a, b, tolerance=0.00001):
    return abs(a - b) <= tolerance


freeze_binding = bind(AUTHOR / "output-freeze.json")
assert freeze_binding["sha256"] == EXPECTED_FREEZE
assert bind(OUT / "independent-inventory.json")["sha256"] == EXPECTED_INVENTORY
freeze = load(AUTHOR / "output-freeze.json")
frozen_files = []
for expected in freeze["files"]:
    actual = bind(expected["path"])
    actual["expectedSha256"] = expected["sha256"]
    actual["matches"] = actual["sha256"] == expected["sha256"]
    actual["bytesMatch"] = actual["bytes"] == expected["bytes"]
    assert actual["matches"] and actual["bytesMatch"], actual["path"]
    frozen_files.append(actual)

bindings = {
    "schema": "d290-hash-bindings@1",
    "createdAt": datetime.now(timezone.utc).isoformat(),
    "algorithm": "SHA-256",
    "authorOutputFreeze": freeze_binding,
    "expectedAuthorOutputFreezeSha256": EXPECTED_FREEZE,
    "allFrozenAuthorFilesMatch": True,
    "frozenAuthorFiles": frozen_files,
    "independentInventory": bind(OUT / "independent-inventory.json"),
    "reviewRules": [
        bind(ROOT / ".agents/skills/ld-s10y-image/SKILL.md"),
        bind(ROOT / ".agents/skills/ld-s10y-image/references/quality-gate.md"),
        bind(ROOT / ".agents/skills/ld-s10y-image/references/figure-spec.md"),
    ],
    "figures": {},
    "lessonContexts": [],
}
checks = {
    "schema": "d290-read-only-structure@1",
    "basis": "Existing JSON and SVG XML only. No renderer, browser, native runner, full tests, database, or Git invocation.",
    "figures": {},
}
input_freeze = load(AUTHOR / "input-freeze.json")
for draft in input_freeze["drafts"]:
    lesson = load(draft["path"])
    current = bind(draft["path"])
    current["authorInputFreezeFileSha256"] = draft["sha256"]
    current["wholeFileMatchesAuthorInputFreeze"] = current["sha256"] == draft["sha256"]
    blocks = [
        {"index": index, "kind": block["kind"], "source_refs": block.get("source_refs"), "text": block.get("text", "")}
        for index, block in enumerate(lesson["prose"])
        if block["kind"] != "fig"
    ]
    current["nonFigureTextBlocksExactlyMatchAuthorInputFreeze"] = blocks == draft["nonfigBlocks"]
    whitespace_normalized = [
        {**block, "text": re.sub(r"\s+", " ", block["text"]).strip()}
        for block in blocks
    ]
    frozen_whitespace_normalized = [
        {**block, "text": re.sub(r"\s+", " ", block["text"]).strip()}
        for block in draft["nonfigBlocks"]
    ]
    current["nonFigureTextMatchesIgnoringWhitespaceOnly"] = whitespace_normalized == frozen_whitespace_normalized
    assert current["nonFigureTextMatchesIgnoringWhitespaceOnly"]
    current["textBlockDifferences"] = [
        {
            "index": actual["index"],
            "kind": actual["kind"],
            "currentText": actual["text"],
            "frozenText": expected["text"],
            "whitespaceOnly": re.sub(r"\s+", " ", actual["text"]).strip() == re.sub(r"\s+", " ", expected["text"]).strip(),
        }
        for actual, expected in zip(blocks, draft["nonfigBlocks"])
        if actual != expected
    ]
    current["nonFigureTextProjectionSha256"] = hashlib.sha256(
        json.dumps(blocks, ensure_ascii=False, separators=(",", ":")).encode()
    ).hexdigest()
    current["sectionBreaks"] = lesson.get("section_breaks", [])
    current["exerciseCount"] = lesson["exercise_count"]
    bindings["lessonContexts"].append(current)

image_ledger = {
    "schema": "d290-actual-image-ledger@1",
    "limit": 7,
    "actualOpens": 7,
    "remaining": 0,
    "reopens": 0,
    "sourceOnlyDetailsCreated": 1,
    "originalsOpenedBeforeAnyAuthorSpecsReportsPreviews": True,
    "independentInventoryWrittenAfterOpen": 3,
    "entries": [],
    "notOpened": [
        "Both source-width previews (byte-identical to their full-width preview).",
        "No source-native browser image, new geometry render, candidate crop, or additional screenshot.",
    ],
}
opened = [
    (ROOT / "ssot-resources/soviet10year-textbooks/artifacts/10p/figures/fig-24.png", "original", "Independent axes, labels, sawtooth inventory"),
    (ROOT / "ssot-resources/soviet10year-textbooks/artifacts/10p/figures/fig-25.png", "original", "Independent CRT, graticule, damped-trace inventory"),
    (OUT / "fig-25.source-detail.png", "source-only-detail", "3x full source enlargement to count graticule tracks and distinguish rim fragments"),
    (AUTHOR / "fig-24/fig-24.full-width.png", "full-width", "640 px CSS-resolved existing SVG: axes, labels, trace topology"),
    (AUTHOR / "fig-25/fig-25.full-width.png", "full-width", "640 px CSS-resolved existing SVG: complete apparatus, tracks, extrema and tail"),
    (AUTHOR / "fig-24/fig-24.mobile331-scroll-end.png", "mobile-scroll-end", "331 px window over fixed 640 px media: final partial run, right arrow and t"),
    (AUTHOR / "fig-25/fig-25.mobile331-scroll-end.png", "mobile-scroll-end", "331 px window over fixed 640 px media: falling tail, right rim, mounting plate and fasteners"),
]
for index, (path, kind, purpose) in enumerate(opened, 1):
    entry = bind(path)
    header = path.read_bytes()[:24]
    assert header[:8] == b"\x89PNG\r\n\x1a\n"
    entry.update({
        "open": index,
        "tool": "functions.view_image",
        "kind": kind,
        "purpose": purpose,
        "sizePx": list(struct.unpack(">II", header[16:24])),
        "beforeAuthorReads": index <= 3,
    })
    image_ledger["entries"].append(entry)

for figure in ("fig-24", "fig-25"):
    directory = AUTHOR / figure
    spec = load(directory / "spec.json")
    render = load(directory / f"{figure}.render.json")
    preview = load(directory / "preview.json")
    source = ROOT / f"ssot-resources/soviet10year-textbooks/artifacts/10p/figures/{figure}.png"
    figure_bindings = {
        "source": bind(source),
        "spec": bind(directory / "spec.json"),
        "render": bind(directory / f"{figure}.render.json"),
        "svg": bind(directory / f"{figure}.svg"),
        "previewMetadata": bind(directory / "preview.json"),
        "openedPreviews": [
            bind(directory / f"{figure}.full-width.png"),
            bind(directory / f"{figure}.mobile331-scroll-end.png"),
        ],
    }
    assert spec["source"]["image"]["sha256"] == figure_bindings["source"]["sha256"]
    assert bind(spec["source"]["image"]["path"])["sha256"] == figure_bindings["source"]["sha256"]
    assert render["spec"]["sha256"] == figure_bindings["spec"]["sha256"]
    assert render["output"]["svg"]["sha256"] == figure_bindings["svg"]["sha256"]
    assert preview["sourceSvg"]["sha256"] == figure_bindings["svg"]["sha256"]
    assert not preview["svgChanged"] and preview["geometryRerenders"] == 0
    for image in preview["previews"]:
        assert bind(image["path"])["sha256"] == image["sha256"]
    assert spec["source"]["authoritativeText"] == input_freeze["authoritativeText"]
    objects = {obj["id"]: obj for obj in spec["objects"]}
    assertions = {item["id"]: item for item in spec["assertions"]}
    for group in spec["source"]["inventory"]:
        assert all(ref in objects for ref in group["objects"])
        assert all(ref in assertions for ref in group["assertions"])
    mapped = {ref for group in spec["source"]["inventory"] for ref in group["objects"]}
    assert mapped == set(objects)
    tree = ET.parse(directory / f"{figure}.svg").getroot()
    texts = [element for element in tree.iter() if element.tag.endswith("text")]
    mobile = next(image for image in preview["previews"] if image["variant"] == "mobile331-scroll-end")
    assert mobile["geometry"]["width"] == 640
    assert mobile["scroll"] == {"clientWidth": 331, "scrollWidth": 640, "start": 0, "end": 309, "expectedEnd": 309}
    label_sizes = [float(element.get("font-size")) for element in texts]
    assert all(size >= 16 for size in label_sizes)
    bindings["figures"][figure] = figure_bindings
    figure_checks = {
        "allSourceSpecRenderSvgPreviewHashBindingsMatch": True,
        "allInventoryReferencesResolve": True,
        "everySpecObjectMappedToSourceInventory": True,
        "existingRenderStatus": render["status"],
        "existingRenderCollisions": render["collisions"],
        "svgViewBox": tree.get("viewBox"),
        "visibleLabels": [element.text for element in texts],
        "visibleFontSizesPxAt640": label_sizes,
        "minVisibleFontSizePx": min(label_sizes) if label_sizes else None,
        "unlabelledFigureTextRequirement": "Not applicable" if not texts else None,
        "mobile": mobile["scroll"],
        "mobileMediaWidthPx": mobile["geometry"]["width"],
        "formalReviewRecorded": False,
    }
    if figure == "fig-24":
        rises = [obj for obj in spec["objects"] if obj["id"].startswith("s24-rise-")]
        resets = [obj for obj in spec["objects"] if obj["id"].startswith("s24-reset-")]
        assert len(rises) == 3 and len(resets) == 2
        assert all(obj["from"][0] < obj["to"][0] and obj["from"][1] < 150 < obj["to"][1] for obj in rises)
        assert all(obj["from"][0] == obj["to"][0] and obj["from"][1] == 270 and obj["to"][1] == 32 for obj in resets)
        assert rises[-1]["to"][1] < rises[0]["to"][1]
        assert [element.text for element in texts] == ["u\u209a", "O", "t"]
        figure_checks.update({
            "risingRuns": len(rises),
            "fullResets": len(resets),
            "risingRunBaselineCrossings": 3,
            "finalPartialEndpoint": rises[-1]["to"],
            "noFourthRunOrThirdReset": True,
            "axisExtensions": {"timeLeftOfOrigin": True, "timeRightOfTrace": True, "voltageAboveMaxima": True, "voltageBelowBaseline": True},
        })
    else:
        grid = objects["s25-core-grid"]
        grid_assertion = assertions["s25-core-12x12"]
        assert grid_assertion["type"] == "gridDimensions" and grid_assertion["grid"] == grid["id"]
        xmin, ymax, xmax, ymin = grid["bounds"]
        assert close((xmax - xmin) / grid["xStep"], grid_assertion["columns"])
        assert close((ymax - ymin) / grid["yStep"], grid_assertion["rows"])
        assert all(close(value, round(value)) for value in (
            (xmin - grid["xOffset"]) / grid["xStep"], (xmax - grid["xOffset"]) / grid["xStep"],
            (ymin - grid["yOffset"]) / grid["yStep"], (ymax - grid["yOffset"]) / grid["yStep"],
        ))
        pieces = {"v": {}, "h": {}}
        for element in tree.iter():
            ident = element.get("id", "")
            if not element.tag.endswith("line") or not ("s25-core-grid-" in ident or "s25-v-track-" in ident or "s25-h-track-" in ident):
                continue
            x1, y1, x2, y2 = [float(element.get(key)) for key in ("x1", "y1", "x2", "y2")]
            if close(x1, x2):
                direction, coordinate, interval = "v", round(x1, 6), sorted((y1, y2))
            else:
                assert close(y1, y2)
                direction, coordinate, interval = "h", round(y1, 6), sorted((x1, x2))
            pieces[direction].setdefault(coordinate, []).append(interval)
        assert len(pieces["v"]) == 19 and len(pieces["h"]) == 17
        cx, cy, radius = 320, 310, 212
        boundary_errors = []
        for direction, family in pieces.items():
            for coordinate, intervals in family.items():
                intervals.sort()
                for previous, following in zip(intervals, intervals[1:]):
                    assert close(previous[1], following[0]), (direction, coordinate, intervals)
                center_axis, center_span = (cx, cy) if direction == "v" else (cy, cx)
                extent = math.sqrt(radius * radius - (coordinate - center_axis) ** 2)
                error = max(abs(intervals[0][0] - (center_span - extent)), abs(intervals[-1][1] - (center_span + extent)))
                boundary_errors.append(error)
                assert error < 0.000002
        for direction in ("v", "h"):
            positions = sorted(pieces[direction])
            assert all(close(second - first, 22.6) for first, second in zip(positions, positions[1:]))
        graticule_group = next(group for group in spec["source"]["inventory"] if group["id"] == "s25-graticule")
        assert "gridDimensions" in graticule_group["requires"] and grid_assertion["id"] in graticule_group["assertions"]
        assert not any(assertions[ref]["type"] == "objectCount" for ref in graticule_group["assertions"])
        for obj in spec["objects"]:
            if obj["type"] != "segment":
                continue
            extent = assertions[obj["id"] + "-extent"]
            assert extent["from"] == obj["from"] and extent["to"] == obj["to"]
            assert close(extent["dx"], obj["to"][0] - obj["from"][0])
            assert close(extent["dy"], obj["to"][1] - obj["from"][1])
        trace = objects["s25-damped-trace"]
        svg_trace = [element for element in tree.iter() if element.tag.endswith("path") and element.get("d") == trace["d"]]
        assert len(svg_trace) == 1 and not svg_trace[0].get("stroke-dasharray")
        tokens = re.findall(r"[MC]|-?\d+(?:\.\d+)?", trace["d"])
        assert tokens.pop(0) == "M"
        start = [float(tokens.pop(0)), float(tokens.pop(0))]
        landmarks = [start]
        controls = [start]
        cubic_pieces = []
        while tokens:
            assert tokens.pop(0) == "C"
            values = [float(tokens.pop(0)) for _ in range(6)]
            first, second, end = values[:2], values[2:4], values[4:]
            assert landmarks[-1][0] < first[0] < second[0] < end[0]
            assert first[1] == landmarks[-1][1] and second[1] == end[1]
            cubic_pieces.append((landmarks[-1], first, second, end))
            controls.extend((first, second, end))
            landmarks.append(end)
        assert len(landmarks) == 10
        maximum_curve_radius = 0
        maximum_certified_radius = 0
        samples = 10000
        for cubic in cubic_pieces:
            derivative_bound = 3 * max(
                math.dist(first, second) for first, second in zip(cubic, cubic[1:])
            )
            sampled_radius = 0
            for index in range(samples + 1):
                t = index / samples
                weights = ((1 - t) ** 3, 3 * (1 - t) ** 2 * t, 3 * (1 - t) * t * t, t ** 3)
                point = [
                    sum(weight * control[axis] for weight, control in zip(weights, cubic))
                    for axis in (0, 1)
                ]
                sampled_radius = max(sampled_radius, math.hypot(point[0] - cx, point[1] - cy))
            maximum_curve_radius = max(maximum_curve_radius, sampled_radius)
            maximum_certified_radius = max(maximum_certified_radius, sampled_radius + derivative_bound / (2 * samples))
        assert maximum_certified_radius + trace["strokeWidth"] / 2 < radius
        extrema = ["trough" if landmarks[index][1] > landmarks[index - 1][1] and landmarks[index][1] > landmarks[index + 1][1] else "crest" for index in range(1, 9)]
        assert extrema == ["trough", "crest"] * 4
        trace_group = next(group for group in spec["source"]["inventory"] if group["id"] == "s25-damped-trace")
        assert len(trace_group["assertions"]) == 9
        for index, ref in enumerate(trace_group["assertions"]):
            assertion = assertions[ref]
            first, second = landmarks[index:index + 2]
            assert all(close(actual, expected) for actual, expected in zip(assertion["from"], (first[0], 704 - first[1])))
            assert all(close(actual, expected) for actual, expected in zip(assertion["to"], (second[0], 704 - second[1])))
        figure_checks.update({
            "gridDimensionsAssertion": grid_assertion,
            "finiteCoreBounds": grid["bounds"],
            "gridSteps": [grid["xStep"], grid["yStep"]],
            "absoluteUserSpacePhase": [grid["xOffset"], grid["yOffset"]],
            "coreTrackCounts": [13, 13],
            "completeSvgTrackCounts": [len(pieces["v"]), len(pieces["h"])],
            "completeSvgVerticalTrackX": sorted(pieces["v"]),
            "completeSvgHorizontalTrackScreenY": sorted(pieces["h"]),
            "coreCornersInsideCircle": math.hypot(xmax - cx, ymax - 394) < radius,
            "maximumSvgBoundaryEndpointErrorPx": max(boundary_errors),
            "noGapBetweenCoreAndExtensions": True,
            "allNonCorePiecesMappedToDisplacementAssertions": True,
            "gridGroupUsesObjectCount": False,
            "boundaryPointOnCircleAssertionCount": sum(assertions[ref]["type"] == "pointOnCircle" for ref in graticule_group["assertions"]),
            "tracePathMatchesSvgExactly": True,
            "traceSolid": True,
            "traceScreenLandmarks": landmarks,
            "traceExtremaSequence": extrema,
            "traceHasNoExtraInteriorExtrema": True,
            "allTraceControlPointsInsideScreen": all(math.hypot(point[0] - cx, point[1] - cy) < radius for point in controls),
            "visibleCurveMaximumSampledRadiusPx": maximum_curve_radius,
            "visibleCurveCertifiedRadiusUpperBoundPx": maximum_certified_radius,
            "curvePlusHalfStrokeCertifiedInsideScreen": True,
            "curveBoundaryMethod": "Cubic sampling at 10001 points per piece plus a derivative-norm bound for every between-sample interval; includes half the visible stroke width. This is read-only numerical analysis, not an image or geometry rerender.",
            "allTraceLandmarksBoundByMappedDisplacementAssertions": True,
            "finalTailFallsWithoutExtraCycle": landmarks[-1][1] > landmarks[-2][1],
            "calibrationLabelsOrAddedAxes": [],
        })
    checks["figures"][figure] = figure_checks

emit("hash-bindings.json", bindings)
emit("image-ledger.json", image_ledger)
emit("structural-checks.json", checks)
print(json.dumps({
    "frozenAuthorFilesVerified": len(frozen_files),
    "imagesOpened": image_ledger["actualOpens"],
    "contexts": [{key: value[key] for key in ("path", "sha256", "wholeFileMatchesAuthorInputFreeze", "nonFigureTextBlocksExactlyMatchAuthorInputFreeze")} for value in bindings["lessonContexts"]],
    "figures": checks["figures"],
    "generatedEvidence": [bind(OUT / name) for name in ("hash-bindings.json", "image-ledger.json", "structural-checks.json")],
}, ensure_ascii=True, indent=2))
