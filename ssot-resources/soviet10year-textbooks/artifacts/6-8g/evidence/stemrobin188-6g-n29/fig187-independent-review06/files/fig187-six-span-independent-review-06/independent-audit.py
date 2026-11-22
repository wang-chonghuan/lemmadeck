#!/usr/bin/env python3
"""Read-only source-derived checks of FIG187 spec and actual SVG, without replay."""

import json
import math
import sys
import xml.etree.ElementTree as ET
from pathlib import Path

root = Path(__file__).resolve().parent
repo = Path.cwd()
m = json.loads((root.parent / "fig187-six-span-independent-FIRST-inputs-06/post-FIRST/candidates.json").read_text())
s = json.loads(Path(m["candidates"]["spec"]["path"]).read_text())
svg = ET.parse(m["candidates"]["svg"]["path"]).getroot()
objects = {o["id"]: o for o in s["objects"]}
elements = {e.get("id"): e for e in svg.iter() if e.get("id")}
assertions = {a["id"]: a for a in s["assertions"]}
failures = []
checks = []


def check(condition, message):
    checks.append({"check": message, "pass": bool(condition)})
    if not condition:
        failures.append(message)


def point(ref):
    return objects[ref]["at"] if isinstance(ref, str) else ref


def distance(a, b):
    return math.dist(point(a), point(b))


def cross(a, b, c):
    a, b, c = point(a), point(b), point(c)
    return (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])


def near(a, b, tolerance=1e-7):
    if isinstance(a, (list, tuple)):
        return math.dist(a, b) <= tolerance
    return abs(a - b) <= tolerance


left, top, right, bottom = s["canvas"]["boundingBox"]
width, height = s["canvas"]["width"], s["canvas"]["height"]
sx, sy = width / (right - left), height / (top - bottom)


def px(ref):
    x, y = point(ref)
    return [(x - left) * sx, (top - y) * sy]


def element(oid):
    return elements["ld-fig-187_ld-" + oid]


def line_px(oid):
    e = element(oid)
    return [
        [float(e.get("x1")), float(e.get("y1"))],
        [float(e.get("x2")), float(e.get("y2"))]
    ]


def visible(e):
    return e.get("display") != "none" and "visibility: hidden" not in e.get("style", "") and float(e.get("stroke-opacity", "1")) > 0


check(near(sx, sy), "canvas mapping preserves circle aspect ratio")
check(not any(e.get("transform") for e in svg.iter()), "actual SVG has no secondary transform, including raw-path scale")
check(s["id"] == "fig-187", "exact figure scope")
check(s["display"] == {"layout": "scroll", "widths": [640], "purpose": "instructional", "minTextPx": 16}, "fixed640 instructional display contract")

# Evaluate the declared relationships independently, without invoking validation.
assertion_results = []
for a in s["assertions"]:
    t, tol = a["type"], a.get("tolerance", 1e-7)
    result = False
    if t == "distance":
        result = near(distance(a["a"], a["b"]), a["value"], tol)
    elif t == "pointOnCircle":
        result = near(distance(a["point"], a["center"]), a["radius"], tol)
    elif t in ("pointOnLine", "collinear"):
        refs = [a["a"], a["b"], a["point"] if t == "pointOnLine" else a["c"]]
        result = abs(cross(*refs)) <= tol
    elif t == "perpendicular":
        p, q, r, u = [point(a[k]) for k in ("a", "b", "c", "d")]
        result = abs((q[0] - p[0]) * (u[0] - r[0]) + (q[1] - p[1]) * (u[1] - r[1])) <= tol
    elif t == "connects":
        o = objects[a["arrow"]]
        result = near(point(o["from"]), point(a["from"]), tol) and near(point(o["to"]), point(a["to"]), tol)
    elif t == "displacement":
        p, q = point(a["from"]), point(a["to"])
        result = near([q[0] - p[0], q[1] - p[1]], [a["dx"], a["dy"]], tol)
    check(result, "independent assertion evaluation: " + a["id"])
    assertion_results.append({"id": a["id"], "type": t, "pass": result})

# Match every non-text geometry object to its actual emitted SVG element.
geometry_results = []
for o in s["objects"]:
    if o["type"] == "text":
        continue
    e = element(o["id"])
    tag = e.tag.rsplit("}", 1)[-1]
    check(visible(e), "actual visible geometry: " + o["id"])
    check(e.get("stroke", "").startswith("var(--ld-figure-ink"), "semantic ink stroke: " + o["id"])
    check(not e.get("stroke-dasharray"), "source solid geometry retained: " + o["id"])
    if o["type"] == "segment":
        actual = line_px(o["id"])
        expected = [px(o["from"]), px(o["to"])]
        check(tag == "line" and all(near(a, b) for a, b in zip(actual, expected)), "actual SVG endpoint mapping: " + o["id"])
        pad = float(e.get("stroke-width").removesuffix("px")) / 2
        bounds = [min(p[0] for p in actual) - pad, min(p[1] for p in actual) - pad, max(p[0] for p in actual) + pad, max(p[1] for p in actual) + pad]
    else:
        center = [float(e.get("cx")), float(e.get("cy"))]
        expected = px(o["at"] if o["type"] == "point" else o["center"])
        check(tag == "ellipse" and near(center, expected), "actual SVG circle/point center: " + o["id"])
        rx, ry = float(e.get("rx")), float(e.get("ry"))
        if o["type"] == "circle":
            check(near(rx, o["radius"] * sx) and near(ry, o["radius"] * sy), "actual SVG circle radius: " + o["id"])
        pad = float(e.get("stroke-width").removesuffix("px")) / 2
        bounds = [center[0] - rx - pad, center[1] - ry - pad, center[0] + rx + pad, center[1] + ry + pad]
    check(all(math.isfinite(v) for v in bounds) and bounds[0] >= 0 and bounds[1] >= 0 and bounds[2] <= width and bounds[3] <= height, "actual entire stroke footprint on canvas: " + o["id"])
    geometry_results.append({"id": o["id"], "tag": tag, "bounds": bounds})

panels = []
for panel, expected_sign, count, foot in [
    ("left", "h > r", 0, "B"),
    ("middle", "h = r", 1, "A"),
    ("right", "h < r", 2, "B")
]:
    O, A, F = [panel + "-" + x for x in ("O", "A", foot)]
    r, h = distance(O, A), distance(O, F)
    p = objects[panel + "-p"]
    P, Q = point(p["from"]), point(p["to"])
    check(near(P[0], Q[0]) and near(P[0], point(F)[0]), panel + " vertical p passes through correct foot")
    check(near(point(O)[1], point(A)[1]) and near(point(O)[1], point(F)[1]), panel + " source horizontal lengths")
    check(point(O)[0] < point(A)[0], panel + " A is rightmost radial endpoint")
    discriminant = r * r - h * h
    actual_count = 0 if discriminant < -1e-7 else 1 if abs(discriminant) <= 1e-7 else 2
    check(actual_count == count, panel + " derived actual circle/p intersection count")
    if panel == "left":
        check(point(O)[0] < point(A)[0] < point(F)[0], "left O,A,B betweenness and positive exterior gap")
    if panel == "right":
        check(point(O)[0] < point(F)[0] < point(A)[0], "right O,B,A betweenness and interior foot")
        ydiff = math.sqrt(discriminant)
        for direction, delta in [("upper", ydiff), ("lower", -ydiff)]:
            oid = "right-" + direction + "-crossing"
            check(near(point(oid), [point(F)[0], point(O)[1] + delta]), "right unlabelled " + direction + " actual derived crossing")
            check(not objects[oid].get("label"), "right " + direction + " crossing not misleadingly labelled B")
    check(objects[panel + "-comparison"]["text"] == expected_sign, panel + " comparison agrees with derived geometry")
    check(objects[panel + "-panel"]["text"] == {"left": "(a)", "middle": "(b)", "right": "(c)"}[panel], panel + " modern panel order")
    check(min(P[1], Q[1]) < point(O)[1] - r and max(P[1], Q[1]) > point(O)[1] + r, panel + " p extends beyond circle vertically")
    panels.append({"panel": panel, "O": point(O), "A": point(A), "foot": point(F), "r": r, "h": h, "h_over_r": h / r, "intersection_count": actual_count, "discriminant": discriminant, "actual_svg_center": px(O), "actual_svg_radius": r * sx})

spans = []
suffixes = ["-start-tick", "", "-notch-left", "-notch-right", "-stem-right", "-end-tick"]
for panel, measure, end in [
    ("left", "h", "B"), ("left", "r", "A"),
    ("middle", "h", "A"), ("middle", "r", "A"),
    ("right", "h", "B"), ("right", "r", "A")
]:
    oid = panel + "-" + measure + "-bracket"
    parts = [oid + suffix for suffix in suffixes]
    lines = [line_px(part) for part in parts]
    start, finish = px(panel + "-O"), px(panel + "-" + end)
    verts = [lines[0][0]] + [line[1] for line in lines]
    check(all(near(lines[i][1], lines[i + 1][0]) for i in range(5)), oid + " six pieces form one continuous bracket")
    check(near(verts[0][0], start[0]) and near(verts[-1][0], finish[0]), oid + " actual endpoint projections attach to source interval")
    check(near(verts[0][1], verts[-1][1]) and near(abs(verts[0][1] - start[1]), 3), oid + " endpoint ticks stop adjacent to length without ambiguous extension")
    check(near(min(v[0] for v in verts), start[0]) and near(max(v[0] for v in verts), finish[0]), oid + " exact intended horizontal extent")
    check(near(verts[3][0], (start[0] + finish[0]) / 2), oid + " central notch belongs to its measured interval")
    check(all(v[1] < start[1] if measure == "h" else v[1] > start[1] for v in verts), oid + " h above / r below length")
    a = assertions[oid + "-source-span"]
    check(near(point(a["from"])[0], point(panel + "-O")[0]) and near(point(a["to"])[0], point(panel + "-" + end)[0]) and near(a["dx"], distance(panel + "-O", panel + "-" + end)), oid + " assertion span actually corresponds to source points")
    spans.append({"id": oid, "source_interval": [panel + "-O", panel + "-" + end], "actual_svg_vertices": verts, "projected_length_px": finish[0] - start[0], "fixed640_length_px": (finish[0] - start[0]) * 2 / 3, "fixed640_stroke_px": 0.8})

expected_labels = [o.get("label") if o["type"] == "point" else o.get("text") for o in s["objects"]]
expected_labels = [text for text in expected_labels if text]
texts = [e for e in svg.iter() if e.tag.endswith("}text")]
check(["".join(e.itertext()) for e in texts] == expected_labels, "all actual SVG labels agree, in panel order, without extra source/cultural text")
check(all(float(e.get("font-size")) * 2 / 3 >= 16 for e in texts), "all actual SVG text reaches minimum16 at fixed640")

lesson = json.loads(Path(m["candidates"]["modernTextCandidate"]["path"]).read_text())
check(all(a["text"] in [p["text"] for p in lesson["prose"]] for a in s["source"]["authoritativeText"]), "exact spec provenance matches current authoritative N29 prose")
for group in s["source"]["inventory"]:
    check("pointRelationships" in group["requires"], group["id"] + " requires substantive point relationships")
    check(all(x in objects for x in group["objects"]) and all(x in assertions for x in group["assertions"]), group["id"] + " all mapped objects/assertions resolve")
    point_ids = {x for x in group["objects"] if objects[x]["type"] == "point"}
    covered = set()
    for aid in group["assertions"]:
        a = assertions[aid]
        refs = {v for k, v in a.items() if k not in ("id", "type") and isinstance(v, str) and v in objects and objects[v]["type"] == "point"}
        if refs and refs <= point_ids:
            covered |= refs
    check(covered == point_ids, group["id"] + " every point covered by in-group relationship")

b = json.loads(Path(m["candidates"]["contact"]["path"].replace("contact.png", "bounds.json")).read_text())
windows = []
for v in b["measurements"]:
    check(v["mediaWidth"] == 640 and v["clientWidth"] == v["viewportWidth"], "retained display media/container distinction")
    check(v["scrollLeft"] == (640 - v["clientWidth"] if v["phase"] == "end" else 0), "retained actual scroll endpoint")
    check(all(x["fontCssPx"] >= 16 for x in v["labels"]), "retained display all labels >=16")
    for bracket in v["bracketResults"]:
        for edge in bracket["segments"]:
            check(edge["finite"] and edge["visible"] and edge["insideMedia"] and edge["nativeEndpointError"] < 1e-7 and edge["endpointError"] < 1e-7, "retained display geometry " + edge["id"])
    windows.append({k: v[k] for k in ("viewportWidth", "phase", "mediaWidth", "clientWidth", "scrollLeft", "scrollWidth")})
pixels = json.loads(Path(m["candidates"]["contact"]["path"].replace("contact.png", "pixel-evidence.json")).read_text())
samples = [sample for bracket in pixels["pixelEvidence"] for part in bracket["parts"] for sample in part["samples"]]
check(len(samples) == 108 and all(x["inkPixelsIn3x3"] > 0 for x in samples), "reuse108 retained positive ink samples, no pixel reload")

print(json.dumps({
    "schema": "FIG187/independent-source-and-actual-SVG-audit@1",
    "status": "pass" if not failures else "fail",
    "method": "Independent scalar mathematics and XML attribute inspection; no source, renderer, validator or browser replay; no raster reload",
    "panels": panels, "six_spans": spans, "assertions": assertion_results,
    "actual_geometry": geometry_results, "labels": expected_labels,
    "retained_windows": windows, "retained_positive_ink_samples": len(samples),
    "checks": checks, "failures": failures
}, indent=2))
sys.exit(1 if failures else 0)
