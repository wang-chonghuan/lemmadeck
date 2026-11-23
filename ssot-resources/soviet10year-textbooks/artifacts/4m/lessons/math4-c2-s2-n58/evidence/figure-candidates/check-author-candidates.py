"""Check only the author's candidates and current supplied task text."""

import hashlib
import json
import math
import xml.etree.ElementTree as ET
from pathlib import Path

from PIL import Image


ROOT = Path("/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-187")
WORK = ROOT / ".tmp/stemrobin-187/n58/figures"
TEMPLATE = ROOT / ".tmp/ld-s10y-lesson/adapt/4m/modern-us-neutral/lessons/math4-c2-s2-n58/exercises.template.json"
OUTPUT = WORK / "author-candidate-check.json"
NS = {"svg": "http://www.w3.org/2000/svg"}


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def direction(vertex, point):
    return math.degrees(math.atan2(point[1] - vertex[1], point[0] - vertex[0]))


assert Path.cwd() == ROOT
assert not OUTPUT.exists(), "Do not overwrite evidence."
template = json.loads(TEMPLATE.read_text())
current = {
    str(item["number"]): item["text"]
    for item in template["exercises"]
    if str(item["number"]) in {"967", "974"}
}
assert set(current) == {"967", "974"}
fit = json.loads((WORK / "source-ray-fit.json").read_text())
checks = []
for stem, expected in [
    ("fig-222.repair1", ["A", "O", "M", "K", "P"]),
    ("tbl-p0216-01", ["0.35", "0.72", "1.14", "5.43", "0.68", "1.71"]),
]:
    spec_path = WORK / f"{stem}.spec.json"
    spec = json.loads(spec_path.read_text())
    report = json.loads((WORK / f"{stem}.render.json").read_text())
    bound_text = {item["exercise"]: item["text"] for item in spec["source"]["authoritativeText"]}
    assert bound_text == current, "Candidate text drift from current template."
    source = spec["source"]["image"]
    assert digest(ROOT / source["path"]) == source["sha256"]
    assert report["status"] == "pass" and report["collisions"] == []
    assert digest(spec_path) == report["spec"]["sha256"]
    assert digest(ROOT / report["output"]["svg"]["path"]) == report["output"]["svg"]["sha256"]
    assert spec["display"] == {
        "layout": "scroll", "purpose": "instructional", "minTextPx": 16, "widths": [640]
    }
    assert report["displayChecks"] == [{
        "width": 640, "minTextPx": 16, "measuredMinPx": 32,
        "failures": [], "status": "pass"
    }]
    svg = ET.parse(WORK / f"{stem}.svg").getroot()
    texts = svg.findall(".//svg:text", NS)
    assert ["".join(node.itertext()) for node in texts] == expected
    assert all(float(node.attrib["font-size"]) == 32 for node in texts)
    with Image.open(WORK / f"{stem}.normal640.png") as preview:
        rgb = preview.convert("RGB")
        assert rgb.size == (spec["canvas"]["width"], spec["canvas"]["height"])
        dark_pixels = sum(min(pixel) < 180 for pixel in rgb.getdata())
        assert dark_pixels > 2000, "Blank or broken preview."
        blank_cells = []
        if stem == "tbl-p0216-01":
            blank_cells = [(0, 0)] + [(r, c) for r in range(1, 4) for c in range(1, 4)]
            for r, c in blank_cells:
                for y in range(40 + r * 70 + 12, 40 + (r + 1) * 70 - 12):
                    for x in range(32 + c * 144 + 12, 32 + (c + 1) * 144 - 12):
                        assert min(rgb.getpixel((x, y))) >= 250, f"Nonblank cell {r},{c}"
            for x in (32, 176, 320, 464, 608):
                assert min(rgb.getpixel((x, 200))) < 180
            for y in (40, 110, 180, 250, 320):
                assert min(rgb.getpixel((600, y))) < 180
    checks.append({
        "candidate": stem,
        "currentTextMatches": True,
        "sourceSpecSvgHashesMatch": True,
        "renderStatus": report["status"],
        "labels": expected,
        "normalWidthPx": 640,
        "normalTextPx": 32,
        "nonblankPreviewDarkPixels": dark_pixels,
        "blankCornerAndNineInteriorCellsChecked": len(blank_cells) == 10,
    })

figure = json.loads((WORK / "fig-222.repair1.spec.json").read_text())
points = {item["id"][-1]: item["at"] for item in figure["objects"] if item["type"] == "point"}
angles = {name: direction(points["A"], points[name]) for name in ("O", "M", "K", "P")}
assert angles["O"] > angles["M"] > angles["K"] > angles["P"]
assert math.isclose(angles["K"] - angles["P"], fit["approximateSourceKAPDegrees"], abs_tol=1e-9)
assert not math.isclose(angles["K"] - angles["P"], 50, abs_tol=0.1)
assert math.isclose(angles["O"] - angles["K"], angles["K"] - angles["P"], abs_tol=1e-9)
assert math.isclose(angles["O"] - angles["M"], angles["M"] - angles["K"], abs_tol=1e-9)
assert len([item for item in figure["objects"] if item["type"] == "arc"]) == 1
first = json.loads((WORK / "fig-222.spec.json").read_text())
restored = json.loads(json.dumps(figure))
restored["objects"][0]["labelPlacement"]["offset"] = [12, -12]
assert first == restored
result = {
    "role": "author-only supplemental checks, NOT independent approval",
    "cwd": str(ROOT),
    "currentTemplate": {"path": str(TEMPLATE.relative_to(ROOT)), "sha256": digest(TEMPLATE)},
    "checks": checks,
    "clockwiseRayOrder": ["AO", "AM", "AK", "AP"],
    "ordinaryApproximateKAPDegrees": fit["approximateSourceKAPDegrees"],
    "textualBisectorsVerified": ["AK bisects OAP", "AM bisects OAK"],
    "contentRepairCount": 1,
    "repairScope": "Only A label x offset +12 to -12; original candidates retained.",
    "previewImagesGenerated": 3,
    "previewImagesVisuallyLoaded": 2,
    "contextImageLoads": 4,
    "independentReview": "not performed; promotion held",
}
OUTPUT.write_text(json.dumps(result, indent=2) + "\n", encoding="utf-8")
print(json.dumps(result, indent=2))
