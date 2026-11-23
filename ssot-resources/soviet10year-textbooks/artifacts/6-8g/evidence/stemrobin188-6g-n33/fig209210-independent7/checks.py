"""Read-only checks for the two named figure candidates; no rendering."""

import hashlib
import json
import math
import struct
import xml.etree.ElementTree as ET
from pathlib import Path


ROOT = Path("/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188")
OWN = ROOT / ".intentfold/tickets/STEMROBIN-188/tmp/n33-fig209210-independent7"
BOOK = ROOT / "ssot-resources/soviet10year-textbooks/artifacts/6-8g"
AUTHOR = BOOK / "evidence/stemrobin188-6g-n33/fig209210-author7"
BINDINGS = BOOK / "evidence/stemrobin188-6g-n33/resume7/figure-bindings"
TEXT = ROOT / ".tmp/ld-s10y-lesson/adapt/6-8g/modern-us-neutral/lessons/geo68-c3-s1-n33"
EXPECTED_SEAL = "84760936ec9d9d167080983a3dc03f60247cff1d7e82ac5f67ccf51ba96c3705"
TOL = 1e-8


def read_json(path):
    return json.loads(path.read_text())


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def cross(a, b):
    return a[0] * b[1] - a[1] * b[0]


def sub(a, b):
    return [a[0] - b[0], a[1] - b[1]]


def angle(a, b):
    norm = math.hypot(*a) * math.hypot(*b)
    assert norm > 0
    cosine = sum(x * y for x, y in zip(a, b)) / norm
    return math.degrees(math.acos(max(-1, min(1, cosine))))


def png_dimensions(path):
    with path.open("rb") as handle:
        header = handle.read(24)
    assert header[:8] == b"\x89PNG\r\n\x1a\n"
    return list(struct.unpack(">II", header[16:24]))


assert Path.cwd() == ROOT
source_first = OWN / "SOURCE-FIRST.md"
assert source_first.stat().st_mode & 0o777 == 0o444
assert sha(source_first) == EXPECTED_SEAL
lesson = read_json(TEXT / "lesson.template.json")
display = read_json(AUTHOR / "display-evidence.json")
results = {"sourceFirstSeal": EXPECTED_SEAL, "figures": {}, "history": {}}

for figure, prose_index in [("fig-209", 0), ("fig-210", 5)]:
    spec_path = BINDINGS / f"{figure}.spec.json"
    render_path = BINDINGS / f"{figure}.render.json"
    svg_path = AUTHOR / f"{figure}.svg"
    spec, render = read_json(spec_path), read_json(render_path)
    old_spec = read_json(AUTHOR / f"{figure}.spec.json")
    old_render = read_json(AUTHOR / f"{figure}.render.json")
    assert spec["id"] == render["figure"] == figure
    assert spec["source"]["authoritativeText"] == [
        {"lesson": "geo68-c3-s1-n33", "text": lesson["prose"][prose_index]["text"]}
    ]
    source_path = BOOK / "figures" / f"{figure}.png"
    assert spec["source"]["image"]["path"] == str(source_path.relative_to(ROOT))
    assert spec["source"]["image"]["sha256"] == sha(source_path)
    for key in spec:
        if key != "source":
            assert spec[key] == old_spec[key], (figure, key)
    assert spec["source"]["inventory"] == old_spec["source"]["inventory"]
    for key in render:
        if key not in ("spec", "output"):
            assert render[key] == old_render[key], (figure, key)
    assert render["output"]["svg"]["sha256"] == old_render["output"]["svg"]["sha256"]
    assert render["spec"]["sha256"] == sha(spec_path)
    assert render["output"]["svg"]["sha256"] == sha(svg_path)
    assert render["status"] == "pass" and render["collisions"] == []
    for metadata_path in (render["spec"]["path"], render["output"]["svg"]["path"]):
        assert metadata_path.startswith(
            "ssot-resources/soviet10year-textbooks/artifacts/6-8g/editions/modern-us-neutral/figures/"
        )
        assert "/tmp/" not in metadata_path and "/.tmp/" not in metadata_path

    objects = {obj["id"]: obj for obj in spec["objects"]}
    assertions = {item["id"]: item for item in spec["assertions"]}
    assert len(objects) == len(spec["objects"])
    assert len(assertions) == len(spec["assertions"])
    for group in spec["source"]["inventory"]:
        assert all(name in objects for name in group["objects"])
        assert all(name in assertions for name in group["assertions"])

    def point(value):
        return objects[value]["at"] if isinstance(value, str) else value

    def on_line(p, a, b):
        return abs(cross(sub(p, a), sub(b, a))) <= TOL

    for item in spec["assertions"]:
        kind = item["type"]
        if kind == "connects":
            obj = objects[item["arrow"]]
            assert obj["type"] == "segment"
            assert point(obj["from"]) == point(item["from"])
            assert point(obj["to"]) == point(item["to"])
        elif kind == "pointOnLine":
            assert on_line(point(item["point"]), point(item["a"]), point(item["b"]))
        elif kind == "collinear":
            assert on_line(point(item["c"]), point(item["a"]), point(item["b"]))
        elif kind == "perpendicular":
            a = sub(point(item["b"]), point(item["a"]))
            b = sub(point(item["d"]), point(item["c"]))
            assert abs(sum(x * y for x, y in zip(a, b))) <= TOL
        elif kind == "distance":
            assert abs(math.dist(point(item["a"]), point(item["b"])) - item["value"]) <= TOL
        else:
            raise AssertionError(f"Unexamined assertion: {item['id']} / {kind}")

    xmin, ymax, xmax, ymin = spec["canvas"]["boundingBox"]
    for obj in objects.values():
        coords = [point(obj[k]) for k in ("at", "from", "to", "center", "start", "end") if k in obj]
        assert all(xmin <= x <= xmax and ymin <= y <= ymax for x, y in coords)
    assert spec["display"]["widths"] == [640, 358, 331]
    assert spec["display"]["purpose"] == "instructional"
    assert spec["display"]["layout"] == "inline"
    assert spec["display"]["minTextPx"] == 16
    for item in render["displayChecks"]:
        assert item["status"] == "pass" and item["failures"] == []
        assert item["measuredMinPx"] >= 16
        assert abs(item["measuredMinPx"] - 32 * item["width"] / 640) <= TOL

    xml = ET.parse(svg_path).getroot()
    texts = [element for element in xml.iter() if element.tag.rsplit("}", 1)[-1] == "text"]
    svg_labels = ["".join(element.itertext()) for element in texts]
    assert len(texts) == render["labels"]
    assert all("32px" in element.attrib.get("style", "") or element.attrib.get("font-size") in ("32", "32px")
               for element in texts)
    attribute_text = "\n".join(value for element in xml.iter() for value in element.attrib.values())
    assert "var(--ld-figure-ink" in attribute_text
    assert "var(--ld-figure-paper" in attribute_text
    assert not any(element.tag.rsplit("}", 1)[-1] in ("image", "script", "foreignObject")
                   for element in xml.iter())

    surfaces = []
    for record in display:
        if record["figure"] != figure:
            continue
        screenshot = AUTHOR / f"{figure}.{record['surface']}.png"
        assert record["input"]["sha256"] == sha(svg_path)
        assert record["screenshot"]["sha256"] == sha(screenshot)
        assert len(record["measurements"]["labels"]) == len(texts)
        assert all(item["insideMedia"] and item["px"] >= 16
                   for item in record["measurements"]["labels"])
        dimensions = png_dimensions(screenshot)
        measured = record["measurements"]["media"]
        assert dimensions[0] == measured["width"] == record["mediaWidth"]
        assert abs(dimensions[1] - measured["height"]) <= 0.5
        surfaces.append({
            "surface": record["surface"], "viewport": record["viewport"],
            "mediaWidth": record["mediaWidth"], "pngDimensions": dimensions,
            "minLabelPx": min(item["px"] for item in record["measurements"]["labels"]),
            "screenshotSha256": sha(screenshot),
        })
    assert len(surfaces) == 2

    if figure == "fig-209":
        assert sorted(svg_labels) == ["M", "a", "b", "c"]
        assert objects["M"]["visible"] is False
        M = point("M")
        ac = assertions["ac-on-a"]["point"]
        bc = assertions["bc-on-b"]["point"]
        bvec = sub(point(objects["b-solid"]["to"]), point(objects["b-solid"]["from"]))
        cvec = sub(point(objects["c-solid"]["to"]), point(objects["c-solid"]["from"]))
        assert abs(sum(x * y for x, y in zip(bvec, cvec))) > TOL
        assert M[1] < ac[1] == bc[1] and bc[0] > ac[0] == M[0]
        assert all(objects[name]["dash"] == 0 for name in ("a-solid", "b-solid", "c-solid"))
        facts = {"M": M, "acUnlabelled": ac, "bcUnlabelled": bc,
                 "bNotPerpendicularC": True, "allIncidencesChecked": True}
    else:
        assert sorted(svg_labels) == sorted(["N", "a₁", "a₂", "b", "α", "β"])
        assert objects["N"]["visible"] is False
        upper = objects["alpha-single-arc"]["center"]
        lower = objects["beta-inner-arc"]["center"]
        assert lower == objects["beta-outer-arc"]["center"]
        assert upper[1] > lower[1]
        up_b = sub(point(objects["b-solid"]["to"]), point(objects["b-solid"]["from"]))
        right_a1 = sub(point(objects["a1-dashed-beyond-N"]["to"]), lower)
        right_a2 = sub(point(objects["a2-dashed-beyond-N"]["to"]), upper)
        alpha = angle([-x for x in up_b], right_a2)
        beta = angle(up_b, right_a1)
        assert alpha + beta < 180
        for obj_name in ("alpha-single-arc", "beta-inner-arc", "beta-outer-arc"):
            arc = objects[obj_name]
            assert all(cross(up_b, sub(arc[key], arc["center"])) <= TOL
                       for key in ("start", "end"))
        assert cross(up_b, sub(point("N"), lower)) < -TOL
        assert cross(up_b, right_a1) < -TOL and cross(up_b, right_a2) < -TOL
        for line in ("a1", "a2"):
            solid = objects[f"{line}-solid"]
            before = objects[f"{line}-dashed-to-N"]
            after = objects[f"{line}-dashed-beyond-N"]
            assert solid["dash"] == 0 and before["dash"] == after["dash"] == 4
            assert point(solid["to"]) == point(before["from"])
            assert point(before["to"]) == point(after["from"]) == point("N")
            assert point(solid["to"])[0] < point("N")[0] < point(after["to"])[0]
        dash_arrays = sorted({element.attrib["stroke-dasharray"]
                              for element in xml.iter() if "stroke-dasharray" in element.attrib})
        facts = {
            "upperCrossing": upper, "lowerCrossing": lower, "N": point("N"),
            "alphaDegForAuditOnly": alpha, "betaDegForAuditOnly": beta,
            "strictSumDegForAuditOnly": alpha + beta, "strictBoundDeg": 180,
            "markedAnglesSameRightInteriorSide": True, "NOnSameRightSide": True,
            "dashedBeforeAndBeyondN": True, "svgDashArrays": dash_arrays,
            "numbersNotAddedToFigure": True,
        }
    results["figures"][figure] = {
        "status": "pass", "allDeclaredAssertionsChecked": len(assertions),
        "sourceInventoryReferencesResolve": True,
        "currentApprovedTextExactMatch": True,
        "authorGeometryLayoutObjectsAssertionsAndDisplayUnchanged": True,
        "renderNonBindingMetadataUnchanged": True,
        "specSha256": sha(spec_path), "renderSha256": sha(render_path),
        "svgSha256": sha(svg_path), "svgLabels": svg_labels,
        "svgRoot": xml.attrib, "display": surfaces, "facts": facts,
    }

history_names = [
    "execution.first-failure.json", "execution.first-display-failure.json",
    "execution.json", "display-evidence.json", "display-evidence.r2.json",
    "fig-209.r0.spec.json", "fig-210.r0.spec.json",
    "fig-210.r1.spec.json", "fig-210.r1.svg", "fig-210.r1.render.json",
    "fig-210.r2.spec.json", "fig-210.r2.svg", "fig-210.r2.render.json",
    "fig-210.r2.desktop.png", "fig-210.r2.mobile.png",
]
for name in history_names:
    results["history"][name] = {"sha256": sha(AUTHOR / name), "untouched": True}
execution = read_json(AUTHOR / "execution.json")
results["priorAuthorContentRevisions"] = execution["contentRevisions"]
results["priorAuthorFailures"] = [
    {"stage": failure.get("stage", "command"),
     "exitCode": failure.get("exitCode"),
     "message": failure.get("message", failure.get("stdout") or failure.get("stderr")),
     "figure": failure.get("figure")}
    for failure in execution["failures"]
]
print(json.dumps(results, ensure_ascii=False, indent=2))
