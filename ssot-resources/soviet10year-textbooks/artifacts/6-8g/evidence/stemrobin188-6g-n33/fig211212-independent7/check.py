"""Read-only, affected-figure verification; writes only this directory's evidence."""

import json
import math
import re
import struct
import subprocess
import sys
import xml.etree.ElementTree as ET
from pathlib import Path


ROOT = Path("/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188")
OWN = ROOT / ".intentfold/tickets/STEMROBIN-188/tmp/n33-fig211212-independent7"
BOOK = ROOT / "ssot-resources/soviet10year-textbooks/artifacts/6-8g"
BIND = BOOK / "evidence/stemrobin188-6g-n33/resume7/figure-bindings"
AUTHOR = BOOK / "evidence/stemrobin188-6g-n33/fig211212-author7"
EXPECTED = {
    "fig-211": {
        "candidate": 2,
        "spec": "cc93d861fecd8de883d8fda21fa88ac2917a03239f17f6b321524134980c1a84",
        "svg": "86670cca5f1cd56dd7306b716b9b88a80dd009ca84b1389314bc17142e1f0852",
        "labels": ["P", "a", "b", "c"],
    },
    "fig-212": {
        "candidate": 1,
        "spec": "acfd848607ddc974df2892190de9d491506d794b6c11586c5a6ab5a07d84c402",
        "svg": "414801b284aef08384edc3f6a9e69290ae2e02d26a854b3235c19ead0a701693",
        "labels": ["K"],
    },
}
checks = []


def check(name, condition, details=None):
    checks.append({"id": name, "status": "pass" if condition else "fail",
                   "details": details})


def sub(a, b):
    return (a[0] - b[0], a[1] - b[1])


def dot(a, b):
    return a[0] * b[0] + a[1] * b[1]


def norm(a):
    return math.hypot(*a)


def line_membership(p, a, b):
    v, u = sub(b, a), sub(p, a)
    return abs(v[0] * u[1] - v[1] * u[0]) / norm(v), dot(u, v) / dot(v, v)


def screen(spec, point):
    left, top, right, bottom = spec["canvas"]["boundingBox"]
    return ((point[0] - left) / (right - left) * spec["canvas"]["width"],
            (top - point[1]) / (top - bottom) * spec["canvas"]["height"])


def arc_member(arc, point):
    c = arc["center"]
    radius = norm(sub(arc["start"], c))
    angles = [math.atan2(p[1] - c[1], p[0] - c[0])
              for p in (arc["start"], arc["end"], point)]
    span = (angles[1] - angles[0]) % math.tau
    progress = (angles[2] - angles[0]) % math.tau
    return abs(norm(sub(point, c)) - radius), progress / span


def cubic(p, t):
    s = 1 - t
    return tuple(s**3 * p[0][i] + 3*s*s*t*p[1][i] +
                 3*s*t*t*p[2][i] + t**3*p[3][i] for i in (0, 1))


def derivative(p, t):
    s = 1 - t
    return tuple(3*s*s*(p[1][i] - p[0][i]) +
                 6*s*t*(p[2][i] - p[1][i]) +
                 3*t*t*(p[3][i] - p[2][i]) for i in (0, 1))


def parse_cubics(element):
    tokens = re.findall(r"[MC]|[-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?",
                        element.attrib["d"])
    assert tokens.pop(0) == "M"
    start = (float(tokens.pop(0)), float(tokens.pop(0)))
    result = []
    while tokens:
        assert tokens.pop(0) == "C"
        points = [(float(tokens.pop(0)), float(tokens.pop(0))) for _ in range(3)]
        result.append([start, *points])
        start = points[-1]
    return result


def nearest(curves, target):
    best = (math.inf, None)
    for curve in curves:
        sample = min(range(101), key=lambda i: norm(sub(cubic(curve, i/100), target)))
        lo, hi = max(0, (sample-1)/100), min(1, (sample+1)/100)
        for _ in range(60):
            a, b = lo + (hi-lo)/3, hi - (hi-lo)/3
            if norm(sub(cubic(curve, a), target)) < norm(sub(cubic(curve, b), target)):
                hi = b
            else:
                lo = a
        t = (lo + hi) / 2
        distance = norm(sub(cubic(curve, t), target))
        if distance < best[0]:
            best = (distance, derivative(curve, t))
    return best


lesson = json.loads((ROOT / ".tmp/ld-s10y-lesson/adapt/6-8g/modern-us-neutral/"
                     "lessons/geo68-c3-s1-n33/lesson.template.json").read_text())
results = {}
for figure, expected in EXPECTED.items():
    spec_path = BIND / f"{figure}.spec.json"
    spec = json.loads(spec_path.read_text())
    render = json.loads((BIND / f"{figure}.render.json").read_text())
    candidate = AUTHOR / figure / f"candidate-{expected['candidate']}"
    validation = subprocess.run(
        [sys.executable, "-B", str(ROOT / ".agents/skills/ld-s10y-image/scripts/"
                                  "validate_spec.py"), str(spec_path),
         "--stage", "rendered", "--json"],
        cwd=ROOT, capture_output=True, text=True, check=False)
    payload = json.loads(validation.stdout)
    check(f"{figure}-spec-validation", validation.returncode == 0, payload)
    check(f"{figure}-render-hash-bindings",
          render["spec"]["sha256"] == expected["spec"] and
          render["output"]["svg"]["sha256"] == expected["svg"] and
          render["status"] == "pass")
    check(f"{figure}-current-text",
          all(item["text"] in [p["text"] for p in lesson["prose"]]
              for item in spec["source"]["authoritativeText"]))
    objects = {o["id"]: o for o in spec["objects"]}
    mapped = {o for group in spec["source"]["inventory"] for o in group["objects"]}
    check(f"{figure}-complete-object-map", mapped == set(objects),
          {"objects": len(objects), "mapped": len(mapped)})
    xml = ET.parse(candidate / f"{figure}.svg").getroot()
    visible = {e.attrib["id"]: e for e in xml.iter()
               if "id" in e.attrib and e.attrib.get("display") != "none" and
               "visibility: hidden" not in e.attrib.get("style", "")}
    labels = list(xml.iter("{http://www.w3.org/2000/svg}text"))
    check(f"{figure}-labels", [e.text for e in labels] == expected["labels"])
    sizes = [float(e.attrib["font-size"]) for e in labels]
    check(f"{figure}-minimum-text", min(sizes) * 352 / 640 >= 16,
          {"640": min(sizes), "358": min(sizes)*358/640,
           "352_contract": min(sizes)*352/640})
    shapes = []
    curves = {}
    for oid, obj in objects.items():
        if obj["type"] not in {"segment", "arc"}:
            continue
        element = visible[f"ld-{figure}_ld-{oid}"]
        if obj["type"] == "segment":
            a = (float(element.attrib["x1"]), float(element.attrib["y1"]))
            b = (float(element.attrib["x2"]), float(element.attrib["y2"]))
            check(f"{oid}-svg-binding",
                  norm(sub(a, screen(spec, obj["from"]))) < 1e-8 and
                  norm(sub(b, screen(spec, obj["to"]))) < 1e-8)
            shapes.extend((a, b))
        else:
            curves[oid] = parse_cubics(element)
            check(f"{oid}-svg-endpoints",
                  norm(sub(curves[oid][0][0], screen(spec, obj["start"]))) < 1e-8 and
                  norm(sub(curves[oid][-1][-1], screen(spec, obj["end"]))) < 1e-8)
            shapes.extend(cubic(c, i/100) for c in curves[oid] for i in range(101))
    width, height = spec["canvas"]["width"], spec["canvas"]["height"]
    check(f"{figure}-finite-geometry-unclipped",
          all(2 <= x <= width-2 and 2 <= y <= height-2 for x, y in shapes))
    for name, dims in (("desktop-640.png", (640, height)),
                       ("mobile-358.png", (358, round(height*358/640)))):
        with (candidate / name).open("rb") as handle:
            header = handle.read(24)
        measured = struct.unpack(">II", header[16:24])
        check(f"{figure}-{name}-dimensions",
              header[:8] == b"\x89PNG\r\n\x1a\n" and measured == dims, measured)
    results[figure] = {"spec": spec, "curves": curves}

s = results["fig-211"]["spec"]
o = {obj["id"]: obj for obj in s["objects"]}
p = o["src211-P"]["at"]
for name in ("b", "c"):
    trace = o[f"src211-{name}-trace"]
    distance, fraction = line_membership(p, trace["from"], trace["to"])
    check(f"src211-P-inside-finite-{name}", distance < 1e-8 and 0 < fraction < 1,
          {"distance": distance, "fraction": fraction})
baseline_y = o["src211-a-trace"]["from"][1]
check("src211-P-and-entire-b-c-above-a",
      p[1] > baseline_y and all(o[f"src211-{name}-trace"][end][1] > baseline_y
                               for name in ("b", "c") for end in ("from", "to")))
b = sub(o["src211-b-trace"]["to"], o["src211-b-trace"]["from"])
c = sub(o["src211-c-trace"]["to"], o["src211-c-trace"]["from"])
check("src211-b-c-distinct", abs(b[0]*c[1] - b[1]*c[0]) > 1)
check("src211-no-global-parallel-assertion",
      all(a["type"] != "parallel" for a in s["assertions"]))

s = results["fig-212"]["spec"]
o = {obj["id"]: obj for obj in s["objects"]}
k = o["src212-K"]["at"]
feet = {"left": (2.8, 1.5), "right": (7.4, 1.5)}
check("src212-distinct-feet-K-above", feet["left"] != feet["right"] and k[1] > 1.5)
for side, foot in feet.items():
    oid = f"src212-{side}-geodesic-trace"
    arc = o[oid]
    for label, point in (("K", k), ("foot", foot)):
        residual, fraction = arc_member(arc, point)
        check(f"{oid}-{label}-inside-actual-arc",
              residual < 1e-8 and 0 < fraction < 1,
              {"radial_residual": residual, "fraction": fraction})
        distance, tangent = nearest(results["fig-212"]["curves"][oid], screen(s, point))
        check(f"{oid}-{label}-on-rendered-path", distance < 0.05,
              {"distance_canvas_px": distance})
        if label == "foot":
            radial = sub(foot, arc["center"])
            check(f"{oid}-derived-baseline-perpendicular",
                  abs(radial[1]) < 1e-8 and abs(tangent[0])/norm(tangent) < 0.002,
                  {"rendered_vertical_tangent_relative_error":
                   abs(tangent[0])/norm(tangent)})
    check(f"{oid}-upper-continuation-and-lower-tail",
          min(arc["start"][1], arc["end"][1]) < 1.5 and
          max(arc["start"][1], arc["end"][1]) > k[1])
    top = o[f"src212-{side}-rightangle-top"]
    attachment = top["from"] if side == "left" else top["to"]
    distance, _ = nearest(results["fig-212"]["curves"][oid], screen(s, attachment))
    check(f"src212-{side}-corner-attached-to-curve", distance < 0.05,
          {"distance_canvas_px": distance})

evidence = {"status": "fail" if any(c["status"] == "fail" for c in checks) else "pass",
            "scope": ["fig-211", "fig-212"], "checks": checks,
            "image_loads": {"actual": 6, "batch_limit": 8, "context_limit": 24},
            "no_rerender": True, "no_promotion": True}
(OWN / "check-evidence.json").write_text(json.dumps(evidence, indent=2) + "\n")
print(json.dumps({"status": evidence["status"], "checks": len(checks),
                  "failures": [c for c in checks if c["status"] == "fail"]}, indent=2))
raise SystemExit(0 if evidence["status"] == "pass" else 1)
