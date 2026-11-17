#!/usr/bin/env python3
"""Read-only frozen-input audit; write only this reviewer's evidence."""

import hashlib
import json
import math
import struct
import xml.etree.ElementTree as ET
from pathlib import Path


W = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
T = W / ".intentfold/tickets/STEMROBIN-181/tmp"
E = T / "d042-9p-fig301-independent-evidence"
A = T / "d042-9p-fig301303-author"
F = A / "fig-301/repair-1"
EXPECTED = {
    A / "author-freeze.json":
        "fab35526ac1478850b8ab45b297d52ae044e220e5f7344aa1424139da04ed4f0",
    F / "fig-301.spec.json":
        "b8b9ec448a2e1dd02177a9300e28b46e8a02e388b542bb5c4f252ec05332726d",
    F / "fig-301.svg":
        "c4ca07f83213d2e72d36206aea9132da47ff52bba59ef4c398cf8b6eb714cde0",
    F / "fig-301.render.json":
        "200e9070076edb67bcd4aa45a29b482c632bfa78fa3a93e61d26a9d76a513d13",
    T / "d042-9p-n134-text-repair/repair-freeze.json":
        "9da166b8de42e7c673f219fae54a6a77ee4546536932838b7580bf31e07b3aef",
    T / "d042-9p-n134-science-affected-review.json":
        "a58a7b6efcb070bb7c20d572ea6480c32cab43bd6980ec127973ca8bd3293e76",
}
checks = []
failures = []


def sha(file):
    return hashlib.sha256(file.read_bytes()).hexdigest()


def read(file):
    return json.loads(file.read_text(encoding="utf-8"))


def check(condition, message):
    if not condition:
        failures.append(message)


def binding(file, expected, origin):
    file = Path(file)
    absolute = file if file.is_absolute() else W / file
    actual = sha(absolute) if absolute.is_file() else None
    record = {
        "declaredPath": str(file),
        "absolutePath": str(absolute.resolve()),
        "expectedSha256": expected,
        "actualSha256": actual,
        "matches": actual == expected,
        "origin": origin,
    }
    checks.append(record)
    check(record["matches"], f"Binding mismatch: {absolute} ({origin})")


def walk_bindings(value, origin):
    if isinstance(value, dict):
        if isinstance(value.get("path"), str) and isinstance(value.get("sha256"), str):
            binding(value["path"], value["sha256"], origin)
        for key, child in value.items():
            walk_bindings(child, f"{origin}.{key}")
    elif isinstance(value, list):
        for index, child in enumerate(value):
            walk_bindings(child, f"{origin}[{index}]")


for file, expected in EXPECTED.items():
    binding(file, expected, "user-supplied frozen identity")

freeze = read(A / "author-freeze.json")
text_freeze = read(T / "d042-9p-n134-text-repair/repair-freeze.json")
science = read(T / "d042-9p-n134-science-affected-review.json")
spec = read(F / "fig-301.spec.json")
render = read(F / "fig-301.render.json")
widths = read(F / "native-width-check.json")
for name, payload in [
    ("authorFreeze", freeze),
    ("textRepairFreeze", text_freeze),
    ("affectedSCIReview", science),
    ("finalSpec", spec),
    ("finalRender", render),
    ("nativeWidths", widths),
    ("repairProof", read(F / "repair-proof.json")),
]:
    walk_bindings(payload, name)

source = Path(spec["source"]["image"]["path"])
canonical = W / "ssot-resources/soviet10year-textbooks/artifacts/9p/figures/fig-301.png"
check(source.is_absolute(), "source.image.path is not absolute")
check(source.resolve(strict=True) == canonical.resolve(strict=True),
      "Source does not resolve to canonical 9p/fig-301.png")
check(spec["source"]["inventory"] == read(F / "source-inventory.json"),
      "Frozen source inventory differs from final FigureSpec")
check(science["effectiveSCI"] == "PASS" and science["effectiveZHEN"] == "PASS",
      "Consumed affected SCI/ZHEN is not pass")
check(freeze["targetedSpecRepairsUsed"] == 1, "Unexpected author repair count")
check(render["status"] == "pass" and widths["status"] == "PASS",
      "Frozen native checks do not pass")

expected_text = []
for language in ["zh", "en"]:
    prose = read(T / f"d042-9p-n134-text-repair/{language}/prose.json")
    expected_text.extend({
        "lesson": "phy9-c2-s7-n134",
        "language": language,
        "text": item["text"],
        "sourceRefs": item["source_refs"],
    } for item in prose["prose"])
check(spec["source"]["authoritativeText"] == expected_text,
      "FigureSpec does not contain exact current bilingual prose/reference authority")

root = ET.parse(F / "fig-301.svg").getroot()
ns = {"s": "http://www.w3.org/2000/svg"}
labels = root.findall(".//s:g[@id='ld-fig-301-label-layer']/s:text", ns)
actual_labels = [
    {"id": item.attrib["data-label-id"], "text": "".join(item.itertext()),
     "fontSize": float(item.attrib["font-size"]),
     "childElements": len(item)}
    for item in labels
]
check([item["text"] for item in actual_labels] == ["I", "B\u2080", "0"],
      "Actual SVG symbol sequence differs")
check(all(item["fontSize"] == 34 and item["childElements"] == 0
          for item in actual_labels),
      "Unexpected nested glyph scaling or unsupported symbol markup")
check(root.attrib["viewBox"] == "0 0 640 520", "Unexpected SVG viewBox")
fixture = (F / "native-width-fixture.html").read_text(encoding="utf-8")
check((F / "fig-301.svg").read_text(encoding="utf-8").strip() in fixture,
      "Native fixture does not embed exact current SVG bytes")
raw_paths = root.findall(".//s:g[@id='ld-fig-301-raw-path-layer']/s:path", ns)
check(len(raw_paths) == 1, "Actual SVG does not have one curve")
curve_object = next(item for item in spec["objects"] if item["type"] == "svgPath")
check(raw_paths[0].attrib["d"] == curve_object["d"], "SVG curve differs from spec")
check("stroke-dasharray" not in raw_paths[0].attrib, "Source solid curve became dashed")
check(raw_paths[0].attrib["fill"] == "none", "Unexpected filled curve")
check(all("var(--ld-figure-ink" in item.attrib["fill"] for item in labels),
      "Actual visible labels do not use semantic ink")
check("var(--ld-figure-ink" in raw_paths[0].attrib["stroke"],
      "Actual visible curve does not use semantic ink")

ids = {item["id"] for item in spec["objects"]}
assertion_ids = {item["id"] for item in spec["assertions"]}
check(len(ids) == len(spec["objects"]), "Duplicate object IDs")
check(len(assertion_ids) == len(spec["assertions"]), "Duplicate assertion IDs")
for group in spec["source"]["inventory"]:
    check(set(group["objects"]) <= ids, f"Unresolved inventory objects: {group['id']}")
    check(set(group["assertions"]) <= assertion_ids,
          f"Unresolved inventory assertions: {group['id']}")
axes = [item for item in spec["objects"] if item["type"] == "axis"]
check(len(axes) == 2 and all(item["ticks"] == [] for item in axes),
      "Wrong axis count or added scale ticks")

# Analytic inspection of the frozen path, not a renderer invocation.
tokens = curve_object["d"].split()
check(tokens[0] == "M" and tokens[3] == "C" and tokens[10] == "C"
      and len(tokens) == 17, "Unexpected frozen curve path structure")
start = [float(tokens[1]), float(tokens[2])]
first = [start] + [[float(tokens[i]), float(tokens[i + 1])]
                  for i in [4, 6, 8]]
second = [first[-1]] + [[float(tokens[i]), float(tokens[i + 1])]
                       for i in [11, 13, 15]]
check(start == [90, 442] and second[-1] == [450, 150],
      "Frozen path origin/endpoint differs")
check(first[-1] == second[0], "Curve pieces do not meet")
slopes = []
for control in [first, second]:
    for step in range(101):
        t = step / 100
        s = 1 - t
        d = [3 * (s * s * (control[1][axis] - control[0][axis])
                  + 2 * s * t * (control[2][axis] - control[1][axis])
                  + t * t * (control[3][axis] - control[2][axis]))
             for axis in [0, 1]]
        check(d[0] > 0 and d[1] < 0, "Curve reverses or becomes a flat plateau")
        slopes.append(-d[1] / d[0])
check(all(later <= earlier + 1e-10
          for earlier, later in zip(slopes, slopes[1:])),
      "Curve slope does not decrease")
origin = [90, 520 - 442]
endpoint = [450, 520 - 150]
offset = next(item for item in spec["assertions"]
              if item["id"] == "301-uncalibrated-curve-endpoint-offset")
check(offset["from"] == origin and offset["to"] == endpoint
      and offset["dx"] == 360 and offset["dy"] == 292,
      "Endpoint relationship assertion differs from actual SVG path")

image_dimensions = []
for file, expected_size in [
    (source, [492, 407]),
    (F / "fig-301.w316.png", [316, 257]),
    (F / "fig-301.native.png", [640, 520]),
]:
    header = file.read_bytes()[:24]
    check(header[:8] == b"\x89PNG\r\n\x1a\n", f"Not a PNG: {file}")
    size = list(struct.unpack(">II", header[16:24]))
    check(size == expected_size, f"Wrong pixel dimensions: {file}: {size}")
    image_dimensions.append({"path": str(file), "sha256": sha(file), "pixels": size})

clearance = []
for observed in widths["observations"]:
    width = observed["mediaWidth"]
    scale = width / 640
    check(observed["requestedWidth"] == width, "Width fixture is not actual size")
    check(observed["status"] == "PASS" and observed["overlapping"] == []
          and not observed["pageOverflow"], "Native width check failed")
    item_by_text = {item["text"]: item for item in observed["labels"]}
    for item in observed["labels"]:
        check(math.isclose(item["fontPxAtMediaWidth"], 34 * scale),
              "Native glyph font transform does not match SVG")
        check(item["fontPxAtMediaWidth"] >= 16 and not item["clipped"],
              "Clipped or subminimum font")
        check(sum(font["glyphCount"] for font in item["platformFonts"])
              == len(item["text"]), "Missing platform glyph")
    i_rect = item_by_text["I"]["rectangle"]
    zero_rect = item_by_text["0"]["rectangle"]
    b_rect = item_by_text["B\u2080"]["rectangle"]
    axis_x = 90 * scale
    axis_y = 442 * scale
    axis_half = 1.3 * scale
    values = {
        "width": width,
        "fontPx": 34 * scale,
        "I_to_verticalAxisPx":
            axis_x - axis_half - (i_rect["x"] + i_rect["width"]),
        "zero_to_verticalAxisPx":
            axis_x - axis_half - (zero_rect["x"] + zero_rect["width"]),
        "zero_below_horizontalAxisPx": zero_rect["y"] - axis_y - axis_half,
        "B0_below_positiveArrowFootprintPx": b_rect["y"] - (442 + 7.8) * scale,
        "B0_rightCanvasClearancePx": width - b_rect["x"] - b_rect["width"],
        "B0_bottomCanvasClearancePx":
            observed["mediaHeight"] - b_rect["y"] - b_rect["height"],
        "platformFonts": {text: item["platformFonts"]
                          for text, item in item_by_text.items()},
    }
    check(all(value > 0 for key, value in values.items()
              if key.endswith("Px")), "Nonpositive glyph/geometry clearance")
    clearance.append(values)

report = {
    "schema": "ld-s10y-image/independent-frozen-input-audit@1",
    "figure": "fig-301",
    "status": "PASS" if not failures else "FAIL",
    "method": "Read-only SHA-256, structured JSON/XML, PNG header sizes, exact "
              "text authority binding and analytic frozen-path inspection. "
              "No rendering, source-page review, SCI replay or input writes.",
    "hashBindingChecks": len(checks),
    "uniquePathHashPairs": len({(item["absolutePath"], item["expectedSha256"])
                                for item in checks}),
    "bindings": checks,
    "sourceAbsolute": source.is_absolute(),
    "sourceResolvedAbsolute": str(source.resolve()),
    "sourceCanonicalMatch": source.resolve() == canonical.resolve(),
    "currentBilingualTextExact": spec["source"]["authoritativeText"] == expected_text,
    "currentBilingualAuthorityItems": len(expected_text),
    "effectiveSCIConsumed": science["effectiveSCI"],
    "effectiveZHENConsumed": science["effectiveZHEN"],
    "SCIReplayed": False,
    "sourcePageReviewPerformed": False,
    "SVGSymbolGlyphs": actual_labels,
    "nativeFixtureEmbedsExactSVG": True,
    "imageDimensions": image_dimensions,
    "curve": {
        "screenOrigin": start, "screenEndpoint": second[-1],
        "userOrigin": origin, "userEndpoint": endpoint,
        "startSlope": slopes[0], "endSlope": slopes[-1],
        "positiveAndDecreasingSlope": True,
        "singleSolidPath": True, "noReturnBranchOrPlateauExtension": True,
        "unmeasuredRegularizationNotExperimentalCoordinates": True,
        "endpointAssertionBoundToActualPath": True,
    },
    "clearanceFromFrozenNativeMeasurements": clearance,
    "declaredWidths": spec["display"]["widths"],
    "otherDeclaredWidths": [],
    "nativeGeometryRerenderPerformed": False,
    "promotionPerformed": False,
    "wholeCardApproval": False,
    "failures": failures,
}
output = E / "input-audit.json"
if output.exists():
    raise SystemExit("Refusing to overwrite existing independent evidence")
output.write_text(json.dumps(report, ensure_ascii=True, indent=2) + "\n",
                  encoding="utf-8")
print(json.dumps({
    "status": report["status"],
    "hashBindingChecks": len(checks),
    "uniquePathHashPairs": report["uniquePathHashPairs"],
    "textAuthorityItems": len(expected_text),
    "clearance": clearance,
    "failures": failures,
    "output": str(output),
    "sha256": sha(output),
}, ensure_ascii=True, indent=2))
raise SystemExit(0 if not failures else 1)
