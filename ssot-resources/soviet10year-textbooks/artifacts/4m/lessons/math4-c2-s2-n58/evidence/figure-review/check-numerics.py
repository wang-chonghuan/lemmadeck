"""Read-only numerical checks; emits text, never images or review JSON."""

import hashlib
import json
import math
import xml.etree.ElementTree as ET
from pathlib import Path

from PIL import Image


ROOT = Path("/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-187")
WORK = ROOT / ".tmp/stemrobin-187/n58/figures"
TEMPLATE = ROOT / ".tmp/ld-s10y-lesson/adapt/4m/modern-us-neutral/lessons/math4-c2-s2-n58/exercises.template.json"
assert Path.cwd() == ROOT


def load(path):
    return json.loads(path.read_text())


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def vec(a, b):
    return (b[0] - a[0], b[1] - a[1])


def cross(a, b):
    return a[0] * b[1] - a[1] * b[0]


def dot(a, b):
    return a[0] * b[0] + a[1] * b[1]


def norm(v):
    return math.hypot(*v)


def angle(v):
    return math.degrees(math.atan2(v[1], v[0]))


current = {
    str(item["number"]): item["text"]
    for item in load(TEMPLATE)["exercises"]
    if str(item["number"]) in {"967", "974"}
}
assert set(current) == {"967", "974"}
specs = {}
for stem, labels, size in [
    ("fig-222.repair1", ["A", "O", "M", "K", "P"], (640, 720)),
    ("tbl-p0216-01", ["0.35", "0.72", "1.14", "5.43", "0.68", "1.71"], (640, 360)),
]:
    spec = load(WORK / f"{stem}.spec.json")
    specs[stem] = spec
    report = load(WORK / f"{stem}.render.json")
    assert {item["exercise"]: item["text"] for item in spec["source"]["authoritativeText"]} == current
    source = spec["source"]["image"]
    assert digest(ROOT / source["path"]) == source["sha256"]
    assert report["spec"]["path"] == str((WORK / f"{stem}.spec.json").relative_to(ROOT))
    assert report["spec"]["sha256"] == digest(WORK / f"{stem}.spec.json")
    assert report["output"]["svg"]["path"] == str((WORK / f"{stem}.svg").relative_to(ROOT))
    assert report["output"]["svg"]["sha256"] == digest(WORK / f"{stem}.svg")
    assert report["status"] == "pass" and not report["collisions"]
    assert spec["display"] == {
        "layout": "scroll", "purpose": "instructional", "minTextPx": 16, "widths": [640]
    }
    assert report["displayChecks"] == [{
        "width": 640, "minTextPx": 16, "measuredMinPx": 32,
        "failures": [], "status": "pass"
    }]
    svg = ET.parse(WORK / f"{stem}.svg").getroot()
    texts = svg.findall(".//{http://www.w3.org/2000/svg}text")
    assert ["".join(item.itertext()) for item in texts] == labels
    assert all(float(item.attrib["font-size"]) == 32 for item in texts)
    with Image.open(WORK / f"{stem}.normal640.png") as image:
        assert image.size == size
        rgb = image.convert("RGB")
        dark = sum(min(rgb.getpixel((x, y))) < 180 for y in range(size[1]) for x in range(size[0]))
        assert dark > 2000
        # Blank canvas edges independently rule out boundary clipping of dark content.
        edge_dark = sum(
            min(rgb.getpixel((x, y))) < 180
            for y in range(size[1]) for x in range(size[0])
            if x < 4 or x >= size[0] - 4 or y < 4 or y >= size[1] - 4
        )
        assert edge_dark == 0
    print(f"{stem}: hashes/text/SVG labels/display PASS; size={size}; dark={dark}; edge_dark={edge_dark}; text=32px")

figure = specs["fig-222.repair1"]
objects = {item["id"]: item for item in figure["objects"]}
points = {key: value["at"] for key, value in objects.items() if value["type"] == "point"}


def point(value):
    return points[value] if isinstance(value, str) else value


checked = []
for relation in figure["assertions"]:
    kind = relation["type"]
    if kind == "connects":
        obj = objects[relation["arrow"]]
        assert obj["type"] == "segment"
        assert obj["from"] == relation["from"] and obj["to"] == relation["to"]
    elif kind == "displacement":
        actual = vec(point(relation["from"]), point(relation["to"]))
        assert norm(vec(actual, [relation["dx"], relation["dy"]])) < 1e-9
    elif kind == "collinear":
        a, b, c = (point(relation[key]) for key in ("a", "b", "c"))
        assert abs(cross(vec(a, b), vec(a, c))) < 1e-7
        assert dot(vec(a, b), vec(a, c)) > 0
    elif kind == "equalDistance":
        a, b, c, d = (point(relation[key]) for key in ("a", "b", "c", "d"))
        assert abs(norm(vec(a, b)) - norm(vec(c, d))) < 1e-9
    elif kind == "perpendicular":
        a, b, c, d = (point(relation[key]) for key in ("a", "b", "c", "d"))
        assert abs(dot(vec(a, b), vec(c, d))) / (norm(vec(a, b)) * norm(vec(c, d))) < 1e-12
    elif kind == "angleRegion":
        obj = objects[relation["object"]]
        vertex, a, b = (point(relation[key]) for key in ("vertex", "a", "b"))
        assert relation["region"] == "minor"
        if obj["type"] == "segment":
            assert obj["from"] == relation["vertex"]
            first, second, middle = (vec(vertex, item) for item in (a, b, point(obj["to"])))
            if cross(first, second) < 0:
                first, second = second, first
            assert cross(first, middle) > 0 and cross(middle, second) > 0
        else:
            assert obj["type"] == "arc" and point(obj["center"]) == vertex
            start, end = point(obj["start"]), point(obj["end"])
            assert abs(norm(vec(vertex, start)) - norm(vec(vertex, end))) < 1e-9
            for endpoint, ray in ((start, a), (end, b)):
                offset, direction = vec(vertex, endpoint), vec(vertex, ray)
                assert abs(cross(offset, direction)) < 1e-7
                assert 0 < dot(offset, direction) / dot(direction, direction) < 1
            sweep = (angle(vec(vertex, end)) - angle(vec(vertex, start))) % 360
            assert 0 < sweep < 180
    elif kind == "objectCount":
        assert sum(item["type"] == relation["objectType"] for item in objects.values()) == relation["count"]
    else:
        raise AssertionError(f"Unchecked relationship: {kind}")
    checked.append(relation["id"])

assert len(checked) == 20
inventory = figure["source"]["inventory"][0]
assert set(inventory["objects"]) == set(objects)
assert set(inventory["assertions"]) == set(checked)
assert inventory["requires"] == ["pointRelationships"]
for point_id in points:
    assert any(
        relation["type"] == "connects"
        and point_id in (relation["from"], relation["to"])
        and {relation["from"], relation["to"]} <= set(inventory["objects"])
        for relation in figure["assertions"]
    )
assert set(points) == {f"fig222-{name}" for name in "AOMKP"}
assert all(item.get("dash", 0) == 0 for item in objects.values() if item["type"] == "segment")
vertex = points["fig222-A"]
directions = {name: angle(vec(vertex, points[f"fig222-{name}"])) for name in "OMKP"}
assert directions["O"] > directions["M"] > directions["K"] > directions["P"]
kap = directions["K"] - directions["P"]
bisector_error = max(
    abs(directions["O"] - 2 * directions["K"] + directions["P"]),
    abs(directions["O"] - 2 * directions["M"] + directions["K"]),
)
assert bisector_error < 1e-9 and abs(kap - 50) > 0.5
assert not any(item["type"] == "text" for item in objects.values())
print(f"fig-222: all 20 relationships PASS; 5 points/4 solid rays/1 arc; clockwise AO/AM/AK/AP; hidden witnesses; bisector residual={bisector_error:.3g}deg; KAP={kap:.12f}deg")

# Independent source fit: K uses column medians; P uses row medians, not the author's fit.
with Image.open(ROOT / figure["source"]["image"]["path"]) as image:
    gray = image.convert("L")
    samples = []
    for x in range(135, 326):
        ys = [y for y in range(245, 311) if gray.getpixel((x, y)) < 100]
        assert ys
        samples.append((x, sorted(ys)[len(ys) // 2]))
    p_samples = []
    for y in range(325, 431):
        xs = [x for x in range(70, 151) if gray.getpixel((x, y)) < 100]
        assert xs
        p_samples.append((y, sorted(xs)[len(xs) // 2]))


def slope(samples):
    mean_x = sum(x for x, _ in samples) / len(samples)
    mean_y = sum(y for _, y in samples) / len(samples)
    return sum((x - mean_x) * (y - mean_y) for x, y in samples) / sum((x - mean_x) ** 2 for x, _ in samples)


k_slope = slope(samples)
p_inverse_slope = slope(p_samples)
source_kap = math.degrees(math.atan2(1, p_inverse_slope) - math.atan(k_slope))
assert 48 < source_kap < 50 and abs(source_kap - kap) < 0.25
print(f"Independent source fit: K columns={len(samples)}; P rows={len(p_samples)}; KAP={source_kap:.9f}deg; candidate-source delta={abs(source_kap - kap):.9f}deg; no calibration/dewarping")

table = specs["tbl-p0216-01"]
grid = next(item for item in table["objects"] if item["type"] == "grid")
assert grid["bounds"] == [32, 320, 608, 40]
assert (608 - 32) / grid["xStep"] == (320 - 40) / grid["yStep"] == 4
assert grid["xOffset"] == 32 and grid["yOffset"] == 40
expected = {(0, 1): "0.35", (0, 2): "0.72", (0, 3): "1.14", (1, 0): "5.43", (2, 0): "0.68", (3, 0): "1.71"}
actual = {}
for item in table["objects"]:
    if item["type"] != "text":
        continue
    x, y = item["at"]
    column, row = (x - 32) / 144, (320 - y) / 70
    assert column % 1 == row % 1 == 0.5
    actual[(int(row), int(column))] = item["text"]
assert actual == expected and len(table["objects"]) == 7
assert table["assertions"] == [
    {"id": "tbl974-4x4", "type": "gridDimensions", "grid": "tbl974-grid", "rows": 4, "columns": 4},
    {"id": "tbl974-six-given-labels", "type": "objectCount", "objectType": "text", "count": 6},
]
with Image.open(WORK / "tbl-p0216-01.normal640.png") as image:
    gray = image.convert("L")
    blank_cells = [(0, 0)] + [(r, c) for r in range(1, 4) for c in range(1, 4)]
    for row, column in blank_cells:
        assert all(
            gray.getpixel((x, y)) >= 250
            for x in range(32 + column * 144 + 5, 32 + (column + 1) * 144 - 5)
            for y in range(40 + row * 70 + 5, 40 + (row + 1) * 70 - 5)
        )
    border_samples = 0
    for x in (32, 176, 320, 464, 608):
        for y in range(40, 321):
            assert min(gray.getpixel((x + dx, y)) for dx in (-1, 0, 1)) < 180
            border_samples += 1
    for y in (40, 110, 180, 250, 320):
        for x in range(32, 609):
            assert min(gray.getpixel((x, y + dy)) for dy in (-1, 0, 1)) < 180
            border_samples += 1
print(f"Table: full 4x4; 6 exact cells; 10 blank interiors; all 10 grid boundaries continuous ({border_samples} samples); no plus/corner zero/results")

first = load(WORK / "fig-222.spec.json")
restored = json.loads(json.dumps(figure))
restored["objects"][0]["labelPlacement"]["offset"] = [12, -12]
assert first == restored
initial = load(WORK / "candidate-command-results.json")
repair = load(WORK / "repair1-command-results.json")
assert [item["exitCode"] for item in initial] == [0, 2, 0, 0]
assert [item["exitCode"] for item in repair] == [0, 0]
assert all("tbl-p0216-01" not in " ".join(item["argv"]) for item in repair)
assert load(WORK / "fig-222.render.json")["status"] == "fail"
print("Preserved stages: initial exits 0/2/0/0; repair exits 0/0; only A x-offset +12 -> -12; no table repeat; failed PNG never decoded")
print("NUMERICAL CHECKS PASS; no outputs written, no image payload emitted, no producer invoked")
