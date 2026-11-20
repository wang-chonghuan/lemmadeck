#!/usr/bin/env python3
"""Read frozen inputs and prove relationships on the selected SVG, not witnesses."""

import hashlib
import json
import math
import re
import struct
import sys
import xml.etree.ElementTree as ET
from pathlib import Path


ROOT = Path("/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck")
OWN = ROOT / ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d143-n8-figure-review"
INPUT = ROOT / ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d143-n8-figure-review-input"
NS = "{http://www.w3.org/2000/svg}"
checks = []
bindings = {}


def load(path):
    return json.loads(Path(path).read_text(encoding="utf-8"))


def digest(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def check(name, passed, evidence):
    checks.append({"id": name, "status": "pass" if passed else "fail", "evidence": evidence})


def bind(record):
    path = Path(record["path"])
    if not path.is_absolute():
        path = ROOT / path
    data = path.read_bytes()
    current = {"path": str(path), "bytes": len(data), "sha256": hashlib.sha256(data).hexdigest()}
    bindings[str(path)] = current
    check("hash:" + path.name, current["sha256"] == record["sha256"]
          and ("bytes" not in record or len(data) == record["bytes"]), current)


def bind_records(value):
    if isinstance(value, dict):
        if "path" in value and "sha256" in value:
            bind(value)
        else:
            for nested in value.values():
                bind_records(nested)
    elif isinstance(value, list):
        for nested in value:
            bind_records(nested)


def points(d):
    number = r"[-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?"
    pattern = re.compile(rf"([ML])\s*({number})[\s,]+({number})")
    result = []
    end = 0
    for match in pattern.finditer(d):
        if d[end:match.start()].strip():
            raise ValueError("Unexpected SVG path syntax")
        command, x, y = match.groups()
        if command != ("M" if not result else "L"):
            raise ValueError("Expected one connected M/L polyline")
        result.append((float(x), float(y)))
        end = match.end()
    if d[end:].strip() or len(result) < 2:
        raise ValueError("Incomplete SVG path")
    return result


def png_size(path):
    data = Path(path).read_bytes()
    if data[:8] != b"\x89PNG\r\n\x1a\n" or data[12:16] != b"IHDR":
        raise ValueError("Expected PNG")
    return struct.unpack(">II", data[16:24])


if Path.cwd() != ROOT:
    raise SystemExit("Explicit repository cwd required")

freeze = load(INPUT / "input-freeze.json")
check("input-freeze-identity", digest(INPUT / "input-freeze.json") ==
      "744cf35a707383e8c050dff1658ce1f4249047ab69bf83d56476be32677bb960",
      {"sha256": digest(INPUT / "input-freeze.json")})
bind_records(freeze)
source = load(INPUT / "source-only.json")
visible = load(INPUT / "visible-text.json")
candidate = load(INPUT / "candidate-only.json")
bind_records(source)
bind_records(visible)
bind_records(candidate)
selected = candidate["selected"]
spec = load(selected["spec"]["path"])
construction = load(selected["construction"]["path"])
render = load(selected["render"]["path"])
bind_records(spec["source"]["image"])
bind_records(render["spec"])
bind_records(render["output"])
check("source-png-identical-across-locators",
      spec["source"]["image"]["sha256"] == source["sourceImage"]["sha256"] ==
      selected["source"]["sha256"], {"sha256": selected["source"]["sha256"]})
check("authoritative-bilingual-text-exact",
      [entry["text"] for entry in spec["source"]["authoritativeText"]] ==
      [visible["languages"][lang]["fullText"] for lang in ("zh", "en")],
      {"languages": ["zh", "en"], "purpose": "Figure compatibility only"})
check("selected-candidate2-and-existing-render",
      selected["candidate"] == 2 and render["status"] == "pass"
      and render["spec"]["sha256"] == digest(selected["spec"]["path"]),
      {"candidate": selected["candidate"], "renderStatus": render["status"],
       "authorAssertionsNotUsedForApproval": True})

svg = ET.parse(selected["svg"]["path"]).getroot()
objects = {obj["id"]: obj for obj in spec["objects"]}
nodes = {node.get("id"): node for node in svg.iter() if node.get("id")}
raw_layer = nodes["ld-fig-05-raw-path-layer"]
raw_nodes = list(raw_layer)
path_objects = [obj for obj in spec["objects"] if obj["type"] == "svgPath"]
check("svg-raw-paths-exactly-current-spec",
      len(raw_nodes) == len(path_objects) == 8
      and all(node.tag == NS + "path" and node.get("d") == obj["d"]
              for node, obj in zip(raw_nodes, path_objects)),
      {"matchedPaths": len(raw_nodes), "matching": "Exact d bytes and ordered layer"})
check("one-unscaled-shared-frame",
      svg.get("viewBox") == "0 0 640 520"
      and raw_layer.get("transform") == "scale(1 1)"
      and spec["canvas"]["boundingBox"] == [0, 520, 640, 0]
      and len([obj for obj in spec["objects"] if obj["type"] == "arrow"]) == 2,
      {"viewBox": svg.get("viewBox"), "rawTransform": raw_layer.get("transform")})

force = nodes["ld-fig-05_ld-force-axis"]
distance = nodes["ld-fig-05_ld-distance-axis"]
zero = float(distance.get("y1"))
axis_x = float(force.get("x1"))
r0 = objects["equilibrium-label"]["at"][0]
check("actual-axes-and-equilibrium-anchor",
      zero == float(distance.get("y2")) == 260
      and axis_x == float(force.get("x2")) == 55
      and float(force.get("y2")) < zero < float(force.get("y1"))
      and float(distance.get("x1")) < axis_x < r0 < float(distance.get("x2"))
      and objects["equilibrium-label"]["at"] == [300, 260],
      {"zeroY": zero, "axisX": axis_x, "equilibriumX": r0,
       "arrowheads": [node.get("data-arrowhead-for") for node in svg.iter()
                     if node.get("data-arrowhead-for")]})

paths = {obj["id"]: points(node.get("d")) for obj, node in zip(path_objects, raw_nodes)}
by_x = {name: dict(path) for name, path in paths.items()}
rep = by_x["repulsion-curve"]
attr = by_x["attraction-curve"]
net = by_x["net-curve"]
common = sorted(set(rep) & set(attr) & set(net))
sum_errors = [abs((zero - net[x]) - ((zero - rep[x]) + (zero - attr[x])))
              for x in common]
check("signed-sum-on-actual-svg",
      len(common) > 1000 and max(sum_errors) <= 1.1e-6
      and all(b - a == 0.25 for a, b in zip(common, common[1:])),
      {"commonVertexCount": len(common), "domainPx": [common[0], common[-1]],
       "maxSignedSumResidualPx": max(sum_errors),
       "continuousPolylineProof": "Aligned linear segments bound residual by endpoint residuals"})
check("all-three-signed-curves",
      all(y < zero for y in rep.values()) and all(y > zero for y in attr.values())
      and all(y < zero for x, y in net.items() if x < r0)
      and net[r0] == zero and all(y > zero for x, y in net.items() if x > r0),
      {"repulsionVertices": len(rep), "attractionVertices": len(attr),
       "netVertices": len(net), "netZeroVertices": [x for x, y in net.items() if y == zero],
       "betweenVertexProof": "Linear interpolation cannot introduce another sign crossing"})
check("same-r0-equal-component-magnitudes",
      zero - rep[r0] == attr[r0] - zero == 130 and net[r0] == zero,
      {"repulsionScreenY": rep[r0], "attractionScreenY": attr[r0],
       "netScreenY": net[r0], "allAtScreenX": r0})

# These are screen-only regularizations, independently reconstructed from the vertices.
m = construction["magnitudePx"]
a = construction["attractionDecayPx"]
b = construction["differenceDecayPx"]
q = construction["tailRatio"]


def components(x):
    t = x - r0
    magnitude = m * math.exp(-t / a)
    ratio = q + (1 - q) * math.exp(-t / b)
    return magnitude * ratio, -magnitude, magnitude * (ratio - 1)


model_errors = {}
for name, index in (("repulsion-curve", 0), ("attraction-curve", 1), ("net-curve", 2)):
    model_errors[name] = max(abs((zero - y) - components(x)[index])
                             for x, y in paths[name])
check("construction-bound-to-every-actual-vertex",
      m > 0 and a > 0 and b > 0 and 0 < q < 1
      and max(model_errors.values()) <= 5.1e-7,
      {"maxResidualPxByCurve": model_errors,
       "independentReconstruction": [
           "t=x-r0; A=m*exp(-t/a), rho=q+(1-q)*exp(-t/b)",
           "R=A*rho; signed attraction=-A; N=A*(rho-1)"
       ], "meaning": "Screen construction, not a named physical force law"})
check("asymptotic-zero-not-finite-cutoff", True,
      {"algebra": "A,R tend to zero for t->infinity because a,b>0. For every finite "
       "t>0, 0<rho<1: R>0, attraction<0, N<0. No clamp, piecewise zero or finite root.",
       "drawnTailScreenForce": {name: zero - values[max(values)]
                               for name, values in (("repulsion", rep), ("attraction", attr), ("net", net))},
       "scope": "An analytically certified schematic continuation beyond a finite displayed domain"})
turn_x = r0 + b * math.log(1 + a / b)
maximum_y = max(net, key=net.get)
ys = list(net.values())
min_index = list(net).index(maximum_y)
check("rounded-negative-net-trough-and-rising-tail",
      maximum_y > r0 and abs(maximum_y - turn_x) <= 0.25
      and all(v < w for v, w in zip(ys[:min_index], ys[1:min_index + 1]))
      and all(v > w for v, w in zip(ys[min_index:], ys[min_index + 1:])),
      {"analyticTroughX": turn_x, "svgTroughX": maximum_y,
       "svgTroughSignedForcePx": zero - net[maximum_y]})
check("short-distance-repulsion-grows-faster", True,
      {"algebra": "For t<=0 rho>=1. |dR/dx|=A*rho/a+A*(1-q)*exp(-t/b)/b > A/a="
       "|d(-A)/dx|. At r0 the net slope is -m*(1-q)/b<0.",
       "coordinateConvention": "Increasing screen x means increasing separation"})

thick = paths["net-equilibrium-thick-segment"]
first, last = thick[0], thick[-1]
chord_error = max(abs(y - (first[1] + (last[1] - first[1]) *
                                (x - first[0]) / (last[0] - first[0])))
                  for x, y in thick)
check("source-local-thick-segment",
      all(net.get(x) == y for x, y in thick)
      and first[0] < r0 < last[0] and first[1] < zero < last[1]
      and last[0] - first[0] == 6 and chord_error < 2
      and objects["net-equilibrium-thick-segment"]["strokeWidth"] >
      objects["net-curve"]["strokeWidth"],
      {"domainPx": [first[0], last[0]], "vertexCount": len(thick),
       "maxChordDeviationPx": chord_error, "strokeWidthsPx": [6, 2.8],
       "localOnly": True})

guides = ["guide-left-upper", "guide-left-lower", "guide-right-upper", "guide-right-lower"]
check("source-dashed-guide-junctions",
      paths[guides[0]][0] == (55, 135) and paths[guides[1]][0] == (55, 385)
      and paths[guides[0]][-1] == paths[guides[1]][-1] == (180, 260)
      and paths[guides[2]][0] == paths[guides[3]][0] == (180, 260)
      and paths[guides[2]][-1] == paths[guides[3]][-1] == (420, 260)
      and all(x == u and y + v == 520
              for upper, lower in ((guides[0], guides[1]), (guides[2], guides[3]))
              for (x, y), (u, v) in zip(paths[upper], paths[lower])),
      {"leftJunctionPx": [180, 260], "rightJunctionPx": [420, 260],
       "rightExtremaPx": [[300, 135], [300, 385]],
       "interpretation": "Unlabelled dashed source guides, not additional forces"})
check("actual-solid-dash-emphasis-styles",
      all(node.get("stroke-dasharray") == "9,9" for node in raw_nodes[:4])
      and all(node.get("stroke-dasharray") is None for node in raw_nodes[4:])
      and [float(node.get("stroke-width")) for node in raw_nodes[4:]] == [2.2, 2.2, 2.8, 6]
      and all(node.get("stroke", "").startswith("var(--ld-figure-") for node in raw_nodes),
      {"guideDash": "9,9", "forceCurvesSolid": True,
       "sourceStyleDistinctionsPreserved": True})
leader_errors = {}
for name, curve in (("repulsion", rep), ("attraction", attr), ("net", net)):
    node = nodes["ld-fig-05_ld-" + name + "-callout-leader"]
    x, y = float(node.get("x2")), float(node.get("y2"))
    leader_errors[name] = abs(curve[x] - y)
check("actual-leaders-hit-correct-curves", max(leader_errors.values()) < 1e-9,
      {"endpointResidualPx": leader_errors})
check("finite-paths-fit-unclipped-canvas",
      all(float(node.get("stroke-width")) / 2 <= x <= 640 - float(node.get("stroke-width")) / 2
          and float(node.get("stroke-width")) / 2 <= y <= 520 - float(node.get("stroke-width")) / 2
          for obj, node in zip(path_objects, raw_nodes) for x, y in paths[obj["id"]]),
      {"canvasPx": [640, 520], "includesStrokeFootprint": True,
       "shortDistanceCurveBeginnings": "Intentional finite plotted domain; no canvas clipping"})

texts = list(svg.iter(NS + "text"))
expected_labels = ["F", "r", "0", "r\u2080", "Repulsion", "Attraction", "Net force"]
actual_labels = ["".join(node.itertext()) for node in texts]
check("actual-english-labels-and-readable-size",
      actual_labels == expected_labels
      and all(float(node.get("font-size")) >= 16 for node in texts)
      and not any(node.get("transform") for node in texts)
      and not nodes["ld-fig-05-label-layer"].get("transform")
      and spec["display"] == {"purpose": "instructional", "layout": "scroll",
                              "widths": [640], "minTextPx": 16},
      {"visibleLabels": actual_labels, "minActualFontPxAt640": min(float(node.get("font-size"))
       for node in texts), "noInventedUnitsNumbersNamedLawsOrScratchText": True})
check("no-extra-semantic-raster-or-script-layer",
      not any(node.tag in {NS + "image", NS + "foreignObject", NS + "script"}
              for node in svg.iter()),
      {"scope": "Actual SVG, not metadata text"})
sizes = {key: list(png_size(selected[key]["path"]))
         for key in ("preview", "mobileScrollStart", "mobileScrollEnd")}
check("supplied-preview-dimensions", sizes == {
    "preview": [640, 520], "mobileScrollStart": [390, 844], "mobileScrollEnd": [390, 844]},
    {"sizesPx": sizes, "visualOpens": 4, "newRenders": 0})

payload = {
    "schema": "independent-svg-geometry-proof@1",
    "independent": True,
    "reviewerIsAuthor": False,
    "status": "pass" if all(row["status"] == "pass" for row in checks) else "fail",
    "proofScript": {"path": str(Path(__file__).resolve()), "sha256": digest(__file__)},
    "inputs": list(bindings.values()),
    "checks": checks,
    "limitations": [
        "Screen regularization certifies qualitative relationships, not physical force values.",
        "Supplied mobile images are inspected evidence, not a replayed live-product acceptance check.",
        "Author native validate/render and supplementary checker were not invoked.",
        "Offline source/semantic/visual review only; scratch metadata is not durable promotion."
    ]
}
output = OWN / "independent-geometry.json"
if output.exists():
    raise SystemExit("Refusing to overwrite existing proof evidence")
output.write_text(json.dumps(payload, ensure_ascii=True, indent=2) + "\n", encoding="utf-8")
print(json.dumps({"status": payload["status"], "checkCount": len(checks),
                  "failedChecks": [row for row in checks if row["status"] != "pass"],
                  "output": str(output), "sha256": digest(output)}, indent=2))
sys.exit(0 if payload["status"] == "pass" else 1)
