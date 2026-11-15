import hashlib
import json
import math
import re
from pathlib import Path
from xml.etree import ElementTree as ET


root = Path(".tmp/s10y-image/10c-fig02")
spec_path = root / "spec.json"
svg_path = root / "fig-02.svg"
spec = json.loads(spec_path.read_text())
objects = {obj["id"]: obj for obj in spec["objects"]}
curve = objects["sine-curve"]
tokens = re.findall(r"[MC]|[-+]?(?:\d*\.\d+|\d+\.?)(?:[eE][-+]?\d+)?", curve["d"])
assert tokens[0] == "M" and (len(tokens) - 3) % 7 == 0
point = [float(tokens[1]) - 3.1, 1.9 - float(tokens[2])]
segments = []
for index in range(3, len(tokens), 7):
    assert tokens[index] == "C"
    values = [float(value) for value in tokens[index + 1:index + 7]]
    points = [point] + [[values[j] - 3.1, 1.9 - values[j + 1]] for j in (0, 2, 4)]
    segments.append(points)
    point = points[-1]

def near(a, b, tolerance=1e-11):
    assert abs(a - b) < tolerance, (a, b)

def slope(a, b):
    return (b[1] - a[1]) / (b[0] - a[0])

max_h = 0
knots = [segments[0][0]] + [segment[-1] for segment in segments]
for a, b, c, d in segments:
    h = d[0] - a[0]
    assert h > 0
    max_h = max(max_h, h)
    near(b[0], a[0] + h / 3)
    near(c[0], a[0] + 2 * h / 3)
    near(a[1], math.sin(a[0]))
    near(d[1], math.sin(d[0]))
    near(slope(a, b), math.cos(a[0]))
    near(slope(c, d), math.cos(d[0]))

contacts = []
for x, expected_y, expected_slope in [(-math.pi / 2, -1, 0), (0, 0, 1), (math.pi / 2, 1, 0)]:
    knot = next(knot for knot in knots if abs(knot[0] - x) < 1e-12)
    near(knot[1], expected_y)
    adjacent = [segment for segment in segments if any(abs(end[0] - x) < 1e-12 for end in (segment[0], segment[-1]))]
    assert len(adjacent) == 2
    for a, b, c, d in adjacent:
        actual = slope(a, b) if abs(a[0] - x) < 1e-12 else slope(c, d)
        near(actual, expected_slope)
    contacts.append({"x": x, "y": expected_y, "leftAndRightSlope": expected_slope})

near(knots[0][0], -2.7)
near(knots[-1][0], 2.9)
near(slope(objects["origin-tangent"]["from"], objects["origin-tangent"]["to"]), 1)
assert all(abs(x - y) < 1e-12 for x, y in [objects["origin-tangent"]["from"], objects["origin-tangent"]["to"]])
assert objects["crest-tangent"]["from"][1] == objects["crest-tangent"]["to"][1] == 1
assert objects["origin"]["visible"] is False and objects["crest"]["visible"] is False
assert sum(obj["type"] == "segment" for obj in objects.values()) == 2
assert [objects[id]["text"] for id in ("x-label", "y-label", "origin-label")] == ["x", "y", "0"]
near(spec["canvas"]["width"] / 6.8, spec["canvas"]["height"] / 3.825)

svg = ET.parse(svg_path)
paths = [element for element in svg.iter() if element.tag.endswith("path") and element.get("d") == curve["d"]]
assert len(paths) == 1
parent = next(element for element in svg.iter() if paths[0] in list(element))
transform = parent.attrib["transform"]
numbers = [float(value) for value in re.findall(r"[-+]?(?:\d*\.\d+|\d+\.?)(?:[eE][-+]?\d+)?", transform)]
assert len(numbers) == 2 and transform.startswith("scale")
scale = spec["canvas"]["width"] / 6.8
for actual, expected in zip(numbers, [scale, scale]):
    near(actual, expected, 1e-9)

bound = max_h ** 4 / 384
report = {
    "status": "pass",
    "reviewer": "parent non-author, independent of author-math.mjs",
    "specSha256": hashlib.sha256(spec_path.read_bytes()).hexdigest(),
    "svgSha256": hashlib.sha256(svg_path.read_bytes()).hexdigest(),
    "segments": len(segments),
    "contacts": contacts,
    "maxKnotSpacing": max_h,
    "hermiteErrorBound": bound,
    "max640pxErrorBound": bound * scale,
    "basis": "Every serialized Bezier has linear x parameter, sine endpoint values and cosine endpoint slopes. Cubic Hermite remainder is sin''''(xi)*(x-a)^2*(x-b)^2/24, bounded by h^4/384. Exact knots and both one-sided slopes prove origin and crest tangency; the SVG contains that identical path under equal positive coordinate scaling.",
    "scope": "Curve/path/tangent mathematics only. Actual source and three media previews were visually inspected separately before this continuation.",
}
output = Path(".intentfold/tickets/STEMROBIN-184/tmp/10c-fig02-independent-math.json")
output.write_text(json.dumps(report, indent=2) + "\n")
print(json.dumps(report, indent=2))
