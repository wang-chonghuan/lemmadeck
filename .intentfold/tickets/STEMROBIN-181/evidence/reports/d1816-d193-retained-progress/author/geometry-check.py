import hashlib
import json
import math
import os
import re
import sys
import xml.etree.ElementTree as ET
from pathlib import Path


CWD = Path("/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck")
assert Path.cwd() == CWD
LANE = CWD / ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d193-n20-figures30-31-author"
MEDIA = CWD / ".tmp/STEMROBIN-181/d1816-d193/figures"
FIGURE = sys.argv[1]
assert FIGURE in {"fig-30", "fig-31"}
ATTEMPT = MEDIA / FIGURE / "attempt-1"
OUT = ATTEMPT / "geometry-observations.json"
assert not OUT.exists()


def receipt(file):
    file = Path(file).resolve()
    data = file.read_bytes()
    return {"path": str(file), "bytes": len(data), "sha256": hashlib.sha256(data).hexdigest()}


spec = json.loads((ATTEMPT / "spec.json").read_text())
render = json.loads((ATTEMPT / f"{FIGURE}.render.json").read_text())
svg = ET.parse(ATTEMPT / f"{FIGURE}.svg").getroot()
objects = {obj["id"]: obj for obj in spec["objects"]}
checks = []


def check(identifier, condition, observed):
    checks.append({"id": identifier, "status": "pass" if condition else "fail", "observed": observed})


def close(a, b, tolerance=1e-5):
    return len(a) == len(b) and all(abs(x - y) <= tolerance for x, y in zip(a, b))


def xy(value):
    return objects[value]["at"] if isinstance(value, str) else value


check("native-render-pass", render["status"] == "pass", render["status"])
check("current-spec-hash", render["spec"]["sha256"] == receipt(ATTEMPT / "spec.json")["sha256"], render["spec"])
check("current-svg-hash", render["output"]["svg"]["sha256"] == receipt(ATTEMPT / f"{FIGURE}.svg")["sha256"], render["output"]["svg"])
check("media640-declared-and-native-checked", spec["display"]["widths"] == [640] and all(c["status"] == "pass" for c in render["displayChecks"]), render["displayChecks"])
check("instructional-scroll", spec["display"]["purpose"] == "instructional" and spec["display"]["layout"] == "scroll", spec["display"])
text_nodes = [node for node in svg.iter() if node.tag.endswith("}text")]
labels = ["".join(node.itertext()) for node in text_nodes]
check("no-source-language-label-leak", not any(re.search(r"[\u0400-\u04ff\u4e00-\u9fff]", text) for text in labels), labels)
check("no-hidden-script-or-raster-artwork", not any(node.tag.endswith(("}script", "}foreignObject", "}image")) for node in svg.iter()), "SVG only: no script, foreignObject, image, or semantic artwork layer.")
check("semantic-stroke-palette", all("var(--ld-figure-" in node.attrib["stroke"] for node in svg.iter() if node.attrib.get("stroke") not in (None, "none")), "All rendered non-none strokes resolve through semantic CSS variables.")

if FIGURE == "fig-30":
    lobes = [objects[f"source-coil-lobe-{n}"] for n in range(1, 5)]
    check("exactly-four-left-semicircles", len([o for o in objects.values() if o["type"] == "arc"]) == 4 and all(
        l["start"][0] == l["end"][0] == l["center"][0]
        and l["start"][1] - l["center"][1] == 25
        and l["center"][1] - l["end"][1] == 25
        for l in lobes
    ), [{"id": l["id"], "center": l["center"], "start": l["start"], "end": l["end"], "sweep": "Counterclockwise top to bottom through left half-plane."} for l in lobes])
    check("coil-adjacent-endpoints", all(close(a["end"], b["start"]) for a, b in zip(lobes, lobes[1:])), "All three internal coil joins coincide.")
    chain = ["source-left-upper-lead", "source-top-lead", "source-right-upper-lead"]
    check("upper-conductor-chain", all(close(xy(objects[a]["to"]), xy(objects[b]["from"])) for a, b in zip(chain, chain[1:]))
          and close(xy(objects[chain[0]]["from"]), lobes[0]["start"]),
          "Coil upper endpoint -> upper-left lead -> top wire -> upper-right lead -> upper plate.")
    chain = ["source-right-lower-lead", "source-bottom-lead", "source-left-lower-lead"]
    check("lower-conductor-chain", all(close(xy(objects[a]["to"]), xy(objects[b]["from"])) for a, b in zip(chain, chain[1:]))
          and close(xy(objects[chain[-1]]["to"]), lobes[-1]["end"]),
          "Lower plate -> lower-right lead -> bottom wire -> lower-left lead -> coil lower endpoint.")
    plates = [objects["source-upper-plate"], objects["source-lower-plate"]]
    check("capacitor-separated-and-not-shorted", plates[0]["from"][1] - plates[1]["from"][1] == 30 and all(
        p["from"][1] == p["to"][1] and p["from"][0] < 480 < p["to"][0] for p in plates
    ) and len([o for o in objects.values() if o["type"] == "segment"]) == 8,
          "Two 50-unit horizontal plates, 30-unit gap, eight segments total (six leads plus two plates), no plate-to-plate shunt.")
    check("only-two-nonanswer-component-additions", sorted(labels) == ["C", "L"], labels)
    check("no-dots-arrows-or-extra-apparatus", not any(o["type"] in {"point", "arrow", "image", "grid", "axis"} for o in objects.values()), "No polarity, switches, core, branch, current arrow, point marker or measured value.")
    # Validate the actual rendered arc geometry rather than object counts alone.
    arc_nodes = [n for n in svg.iter() if any(n.attrib.get("id", "").endswith(f"ld-source-coil-lobe-{k}") for k in range(1, 5))]
    check("four-nonempty-rendered-arcs", len(arc_nodes) == 4 and all(bool(n.attrib.get("d")) for n in arc_nodes), [n.attrib for n in arc_nodes])
    dimensions = (640, 520)
else:
    model = json.loads((ATTEMPT / "drawing-model.json").read_text())
    raw = next(node for node in svg.iter() if node.attrib.get("id") == "ld-fig-31-raw-path-layer")
    paths = list(raw)
    x0, y0, period = model["originX"], model["originY"], model["periodDrawingPx"]
    amplitude = {"source-charge-curve": model["chargeAmplitudeDrawingPx"], "source-current-curve": model["currentAmplitudeDrawingPx"]}
    ends = {"source-charge-curve": model["chargeEndX"], "source-current-curve": model["currentEndX"]}
    formulas = {
        "source-charge-curve": lambda x: amplitude["source-charge-curve"] * math.cos(2 * math.pi * (x - x0) / period),
        "source-current-curve": lambda x: -amplitude["source-current-curve"] * math.sin(2 * math.pi * (x - x0) / period)
    }
    check("two-rendered-curve-paths", len(paths) == 2, len(paths))
    parsed = {}
    for node, identifier in zip(paths, ["source-charge-curve", "source-current-curve"]):
        obj = objects[identifier]
        d = node.attrib["d"]
        tokens = re.findall(r"([ML])(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)", d)
        reconstructed = " ".join(f"{command}{x} {y}" for command, x, y in tokens)
        coords = [[float(x), float(y)] for _, x, y in tokens]
        parsed[identifier] = coords
        check(f"{identifier}-actual-svg-matches-spec", d == obj["d"] and reconstructed == d and coords == obj["screenVertices"], {"vertices": len(coords), "strictMLGrammar": reconstructed == d})
        check(f"{identifier}-finite-source-endpoints", close(coords[0], [x0, y0 - formulas[identifier](x0)]) and close(coords[-1], [ends[identifier], y0 - formulas[identifier](ends[identifier])]), {"start": coords[0], "end": coords[-1]})
        residual = max(abs(y - (y0 - formulas[identifier](x))) for x, y in coords)
        check(f"{identifier}-every-svg-vertex-on-approved-waveform", residual <= 1e-5, {"maxResidualDrawingPx": residual})
        dxs = [b[0] - a[0] for a, b in zip(coords, coords[1:])]
        check(f"{identifier}-monotonic-finite-time-and-dense-sampling", all(0 < dx <= 0.500001 for dx in dxs), {"maximumDx": max(dxs), "lastX": coords[-1][0]})
        check(f"{identifier}-solid-stroke", node.attrib.get("stroke-dasharray") is None and obj["dash"] == 0, dict(node.attrib))
        visible_lobes = sum(a[1] < b[1] > c[1] for a, b, c in zip(coords, coords[1:], coords[2:]))
        # Quarter-cycle samples explicitly verify all zeros and extrema without rendering point markers.
        landmarks = []
        for n in range(11):
            x = x0 + n * period / 4
            if x <= ends[identifier]:
                nearest = min(coords, key=lambda point: abs(point[0] - x))
                landmarks.append({"quarterIndex": n, "expected": [x, y0 - formulas[identifier](x)], "nearestSvgVertex": nearest})
        check(f"{identifier}-all-quarter-cycle-landmarks", all(abs(item["nearestSvgVertex"][0] - item["expected"][0]) <= 0.251 and abs(item["nearestSvgVertex"][1] - item["expected"][1]) <= 0.52 for item in landmarks), landmarks)
    qpath, ipath = parsed["source-charge-curve"], parsed["source-current-curve"]
    check("positive-max-charge-zero-current-origin-negative-first-current", qpath[0][1] == y0 - amplitude["source-charge-curve"] and ipath[0][1] == y0 and ipath[1][1] > y0 and qpath[1][1] > qpath[0][1], {"qOrigin": qpath[0], "iOrigin": ipath[0], "firstCurrentStep": ipath[1]})
    derivative_checks = []
    for index in range(1, 120):
        x = x0 + (ends["source-current-curve"] - x0) * index / 120
        h = 0.001
        derivative = (formulas["source-charge-curve"](x + h) - formulas["source-charge-curve"](x - h)) / (2 * h)
        signed_current = formulas["source-current-curve"](x)
        normalized_derivative = derivative / (amplitude["source-charge-curve"] * 2 * math.pi / period)
        normalized_current = signed_current / amplitude["source-current-curve"]
        derivative_checks.append(abs(normalized_derivative - normalized_current))
    check("normalized-derivative-phase-and-sign", max(derivative_checks) < 1e-7, {"samples": len(derivative_checks), "maxNormalizedResidual": max(derivative_checks), "qualification": "Normalized derivative sign/phase only. Separate visual scales are not a claim that drawing-pixel amplitudes have equal physical units."})
    check("source-finite-tail-order-and-sign", qpath[-1][0] == 880 and ipath[-1][0] == 831 and ipath[-1][0] < qpath[-1][0] and qpath[-1][1] > y0 and ipath[-1][1] > y0 and qpath[-1][1] < qpath[-2][1] and ipath[-1][1] < ipath[-2][1], {"chargeEnd": qpath[-1], "currentEnd": ipath[-1], "bothNegativeRising": True})
    inventory = json.loads((LANE / "fig-31.source-inventory.json").read_text())
    source_landmarks = []
    for fact in inventory["facts"]:
        identifier = fact["id"]
        if identifier not in formulas:
            continue
        data = fact["approximatePixelLandmarksNotCalibration"]
        for kind in ("start", "end"):
            source_point = data[kind]
            candidate_y = y0 - formulas[identifier](source_point[0])
            source_y_shifted = source_point[1] + 24
            source_landmarks.append({"curve": identifier, "landmark": kind, "sourcePixel": source_point, "modernScreenAtSameX": [source_point[0], candidate_y], "ordinateRegularizationPx": abs(candidate_y - source_y_shifted)})
    check("source-endpoint-ordinate-regularization-bounded", all(item["ordinateRegularizationPx"] <= 3 for item in source_landmarks), source_landmarks)
    expected_labels = ["Charge", "Current", "O", "q, i", "t"]
    check("only-source-identification-labels-translated", sorted(labels) == sorted(expected_labels), labels)
    for identifier, curve in [("source-charge-leader", "source-charge-curve"), ("source-current-leader", "source-current-curve")]:
        target = xy(objects[identifier]["to"])
        check(f"{identifier}-ends-on-correct-curve", abs(target[1] - (model["height"] - y0 + formulas[curve](target[0]))) <= 1e-6, target)
    check("charge-thicker-current-solid-independent-color-role", objects["source-charge-curve"]["strokeWidth"] > objects["source-current-curve"]["strokeWidth"] > 0 and objects["source-charge-curve"]["stroke"] == "ink" and objects["source-current-curve"]["stroke"] == "accent", {"chargeStrokeWidth": 5.5, "currentStrokeWidth": 2.8})
    dimensions = (model["width"], model["height"])

check("all-path-geometry-within-canvas", all(
    0 <= float(n.attrib.get("x", 0)) <= dimensions[0] and 0 <= float(n.attrib.get("y", 0)) <= dimensions[1]
    for n in text_nodes
), "Native validator covers finite JSXGraph coordinates; path vertices separately checked below where applicable.")
if FIGURE == "fig-31":
    check("every-actual-curve-vertex-inside-canvas", all(0 <= x <= dimensions[0] and 0 <= y <= dimensions[1] for coords in parsed.values() for x, y in coords), {"canvas": dimensions})

result = {
    "schema": "d193/author-geometry-observations@1",
    "figure": FIGURE, "role": "author", "independentReview": False,
    "status": "pass" if all(c["status"] == "pass" for c in checks) else "HOLD",
    "source": receipt(LANE / f"{FIGURE}.source-inventory.json"),
    "spec": receipt(ATTEMPT / "spec.json"),
    "svg": receipt(ATTEMPT / f"{FIGURE}.svg"),
    "render": receipt(ATTEMPT / f"{FIGURE}.render.json"),
    "checks": checks,
    "checksCount": len(checks),
    "checkerCalls": 1, "contentRepairs": 0,
    "productSurfaceVerified": False,
    "productSurfaceLimitation": "Author-only offline candidate. Native renderer measured media640 text; no lesson finalization, headed product surface, scroll interaction, or independent review was authorized."
}
OUT.write_text(json.dumps(result, ensure_ascii=True, indent=2) + "\n")
print(json.dumps({"figure": FIGURE, "status": result["status"], "checks": len(checks), "failed": [c["id"] for c in checks if c["status"] != "pass"], "output": str(OUT)}))
sys.exit(0 if result["status"] == "pass" else 1)
