#!/usr/bin/env python3
"""Read frozen figure inputs; write only this review's bounded evidence."""

import hashlib
import json
import math
import struct
import xml.etree.ElementTree as ET
from pathlib import Path


W = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
T = W / ".intentfold/tickets/STEMROBIN-181/tmp"
E = T / "d042-9p-fig303-independent-evidence"
A = T / "d042-9p-fig303-author"
expected_roots = {
    A / "author-freeze.json": "785df51c8b6869e55d50fba2099104f89a672e7f341f6aa0de1ab413309a043a",
    T / "d042-9p-n134-text-repair/repair-freeze.json": "9da166b8de42e7c673f219fae54a6a77ee4546536932838b7580bf31e07b3aef",
    T / "d042-9p-n134-science-affected-review.json": "a58a7b6efcb070bb7c20d572ea6480c32cab43bd6980ec127973ca8bd3293e76",
}
checked = []
errors = []


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def load(path):
    return json.loads(path.read_text(encoding="utf-8"))


def check(condition, message):
    if not condition:
        errors.append(message)


def binding(path, expected, location):
    absolute = (W / path).resolve()
    actual = sha(absolute) if absolute.is_file() else None
    checked.append({
        "location": location,
        "path": str(absolute),
        "expectedSha256": expected,
        "actualSha256": actual,
        "matches": expected == actual,
    })
    check(actual == expected, f"Hash mismatch: {location}: {absolute}")


def walk(value, location):
    if isinstance(value, dict):
        if isinstance(value.get("path"), str):
            expected = value.get("sha256", value.get("expectedSha256"))
            if isinstance(expected, str):
                binding(value["path"], expected, location)
        for key, child in value.items():
            walk(child, f"{location}.{key}")
    elif isinstance(value, list):
        for index, child in enumerate(value):
            walk(child, f"{location}[{index}]")


for root, expected in expected_roots.items():
    binding(root, expected, root.name)
    walk(load(root), root.name)

author = load(A / "author-freeze.json")
spec = load(A / "fig-303.spec.json")
render = load(A / "fig-303.render.json")
pixels = load(A / "preview/pixel-check.json")
walk(spec["source"]["image"], "currentSpec.source.image")
walk(render, "currentRender")
walk(pixels, "previewBindings")
check(Path(spec["source"]["image"]["path"]).is_absolute(), "Source path is not absolute.")
check(
    Path(spec["source"]["image"]["path"]).resolve()
    == (W / "ssot-resources/soviet10year-textbooks/artifacts/9p/figures/fig-303.png").resolve(),
    "Spec does not reference the actual canonical9p source.",
)
check(spec["id"] == render["figure"] == "fig-303", "Figure identity mismatch.")
check(spec["mode"] == render["mode"] == "deterministic", "Incorrect rendering mode.")
check(render["status"] == "pass", "Native render did not pass.")
check(not render["collisions"], "Native label collisions.")
check(render["spec"]["sha256"] == sha(A / "fig-303.spec.json"), "Stale render spec.")
validation = load(A / "commands/initial-spec-validation.json")
native = load(A / "commands/initial-native-render.json")
validation_result = json.loads(validation["stdout"])
check(validation["exitCode"] == 0 and validation_result["status"] == "pass"
      and not validation_result["errors"], "Frozen native spec validation did not pass.")
check(native["exitCode"] == 0 and "PASS: fig-303" in native["stdout"],
      "Frozen native renderer command did not pass.")
science = load(T / "d042-9p-n134-science-affected-review.json")
check(science["effectiveSCI"] == science["effectiveZHEN"] == "PASS",
      "Affected SCI/ZHEN disposition is not PASS.")
check(science["repairFreeze"]["actualSha256"]
      == expected_roots[T / "d042-9p-n134-text-repair/repair-freeze.json"],
      "Affected science review is not bound to the current repair.")

text_bindings = []
for record in author["authoritativeText"]["languages"]:
    normalized = load(Path(record["prose"]["path"]))
    text = "\n\n".join(
        str(item.get("text") or item.get("label") or "")
        for item in normalized["prose"]
        if item.get("text") or item.get("label")
    )
    actual_text = spec["source"]["authoritativeText"][record["sourceAuthoritativeTextIndex"]]
    digest = hashlib.sha256(text.encode("utf-8")).hexdigest()
    check(actual_text["text"] == text, f"Complete current {record['language']} prose not bound.")
    check(digest == record["textSha256"], f"Text hash mismatch: {record['language']}.")
    text_bindings.append({
        "language": record["language"],
        "prosePath": record["prose"]["path"],
        "completeProseMatchesVerbatim": actual_text["text"] == text,
        "textSha256": digest,
    })

objects = {item["id"]: item for item in spec["objects"]}
assertions = {item["id"]: item for item in spec["assertions"]}
check(len(objects) == len(spec["objects"]), "Duplicate object IDs.")
check(len(assertions) == len(spec["assertions"]), "Duplicate assertion IDs.")
for group in spec["source"]["inventory"]:
    check(all(name in objects for name in group["objects"]),
          f"Unresolved inventory objects: {group['id']}.")
    check(all(name in assertions for name in group["assertions"]),
          f"Unresolved inventory assertions: {group['id']}.")

loop_checks = []
for panel, origin in [("a", [300, 850]), ("b", [300, 290])]:
    points = objects[f"fig303{panel}-loop"]["points"]
    sym = assertions[f"fig303{panel}-loop-opposite-vertices"]
    covered = {tuple(pair[side]) for pair in sym["pairs"] for side in ["a", "b"]}
    check(covered == {tuple(point) for point in points}, f"Incomplete {panel} symmetry coverage.")
    check(all(math.dist(
        [(pair["a"][0] + pair["b"][0]) / 2, (pair["a"][1] + pair["b"][1]) / 2],
        origin) < 1e-5 for pair in sym["pairs"]), f"Incorrect {panel} symmetry.")
    translated = [(x - origin[0], y - origin[1]) for x, y in points]
    area = abs(sum(
        p[0] * q[1] - q[0] * p[1]
        for p, q in zip(translated, translated[1:] + translated[:1])
    )) / 2
    crossings = [[], []]
    for p, q in zip(translated, translated[1:] + translated[:1]):
        for axis in [0, 1]:
            if p[axis] == 0:
                crossings[axis].append(p[1 - axis])
            elif p[axis] * q[axis] < 0:
                fraction = -p[axis] / (q[axis] - p[axis])
                crossings[axis].append(p[1 - axis] + fraction * (q[1 - axis] - p[1 - axis]))
    remanence, coercivity = [sorted(set(round(v, 6) for v in values)) for values in crossings]
    check(len(remanence) == len(coercivity) == 2
          and remanence[0] < 0 < remanence[1]
          and coercivity[0] < 0 < coercivity[1], f"Incorrect {panel} branch crossings.")
    check(len(points) == 192 and len(sym["pairs"]) == 96, f"Incorrect {panel} contour count.")
    loop_checks.append({
        "panel": panel,
        "definingVertices": len(points),
        "oppositePairs": len(sym["pairs"]),
        "allVerticesCoveredByNativeSymmetryAssertion": covered == {tuple(p) for p in points},
        "IInterceptsDrawingUnits": remanence,
        "B0InterceptsDrawingUnits": coercivity,
        "enclosedAreaDrawingUnits": area,
        "saturationBoundsDrawingUnits": {
            "xMin": min(x for x, y in translated),
            "xMax": max(x for x, y in translated),
            "yMin": min(y for x, y in translated),
            "yMax": max(y for x, y in translated),
        },
    })
comparisons = {
    "upperCoercivitySmaller": abs(loop_checks[0]["B0InterceptsDrawingUnits"][0])
                             < abs(loop_checks[1]["B0InterceptsDrawingUnits"][0]),
    "upperRemanenceSmaller": abs(loop_checks[0]["IInterceptsDrawingUnits"][0])
                            < abs(loop_checks[1]["IInterceptsDrawingUnits"][0]),
    "upperAreaSmaller": loop_checks[0]["enclosedAreaDrawingUnits"]
                       < loop_checks[1]["enclosedAreaDrawingUnits"],
    "equalSaturationExtents": loop_checks[0]["saturationBoundsDrawingUnits"]
                             == loop_checks[1]["saturationBoundsDrawingUnits"],
}
check(all(comparisons.values()), "Qualitative soft/hard comparison failed.")

svg = ET.parse(A / "fig-303.svg").getroot()
ns = {"s": "http://www.w3.org/2000/svg"}
labels = svg.findall(".//s:text", ns)
check(svg.attrib["viewBox"] == "0 0 640 1160", "Unexpected SVG screen frame.")
check(len(labels) == render["labels"] == 8, "Incorrect rendered label count.")
check(not svg.findall(".//s:tspan", ns), "Nested font sizing needs a separate display check.")
check(not svg.findall(".//s:foreignObject", ns) and not svg.findall(".//s:script", ns),
      "Unexpected foreignObject or script in SVG.")
label_evidence = []
for node in labels:
    text = "".join(node.itertext())
    check(node.attrib.get("transform") is None, "Unexpected label-local transform.")
    check("var(--ld-figure-ink" in node.attrib.get("fill", ""), "Nonsemantic label color.")
    check(all(ord(character) < 128 or character == "\u2080" for character in text),
          "Unexpected cultural label leakage.")
    label_evidence.append({
        "id": node.attrib["data-label-id"],
        "text": text,
        "nativeFontSizePx": float(node.attrib["font-size"]),
        "actualDisplayFontSizePx": {
            str(width): float(node.attrib["font-size"]) * width / 640
            for width in [316, 640]
        },
    })
display_evidence = []
for width in [316, 640]:
    actual_min = min(item["actualDisplayFontSizePx"][str(width)] for item in label_evidence)
    native_record = next(item for item in render["displayChecks"] if item["width"] == width)
    check(actual_min >= 16 and native_record["status"] == "pass"
          and not native_record["failures"]
          and abs(actual_min - native_record["measuredMinPx"]) < 1e-6,
          f"Readability or screen-transform mismatch at {width}px.")
    display_evidence.append({
        "widthPx": width,
        "nativeScreenCTMReportedMinimumPx": native_record["measuredMinPx"],
        "independentlyReconciledMinimumFontPx": actual_min,
        "status": "pass" if actual_min >= 16 else "fail",
        "measurementBasis": "Untransformed 36px SVG text multiplied by actual width/640, reconciled with frozen native browser screen CTM. B-subscript-zero is a Unicode glyph in that same text run, not a separately reduced font.",
    })
check(spec["display"] == {
    "purpose": "instructional", "layout": "inline", "minTextPx": 16,
    "widths": [316, 640], "maxWidthPx": 640,
}, "Incorrect display contract.")
check(len(svg.findall(".//s:marker", ns)) == 5, "Incorrect source arrowhead count.")
png_dimensions = []
for path, expected in [
    (Path(spec["source"]["image"]["path"]), (375, 1061)),
    (A / "preview/fig-303.native.png", (640, 1160)),
    (A / "preview/fig-303.mobile-316.png", (316, 573)),
]:
    header = path.read_bytes()[:24]
    check(header[:8] == b"\x89PNG\r\n\x1a\n", f"Not PNG: {path}.")
    dimensions = struct.unpack(">II", header[16:24])
    check(dimensions == expected, f"Unexpected PNG dimensions: {path}.")
    png_dimensions.append({"path": str(path), "width": dimensions[0], "height": dimensions[1]})

output = E / "binding-and-geometry-check.json"
payload = {
    "schema": "ld-s10y-image/independent-figure-binding-check@1",
    "status": "pass" if not errors else "fail",
    "method": "Read-only hashes, structured complete-prose binding, frozen native-pass receipts, XML font/screen-frame inspection and independent in-memory contour arithmetic. No source page, native geometry rerender, SCI replay, app or dependency operations.",
    "bindingOccurrencesChecked": len(checked),
    "uniqueBoundFilesChecked": len({item["path"] for item in checked}),
    "bindings": checked,
    "failures": errors,
    "currentSourceResolvesAbsolute": spec["source"]["image"]["path"],
    "nativeSpecStatus": validation_result["status"],
    "nativeRenderStatus": render["status"],
    "affectedScienceConsumed": {"effectiveSCI": science["effectiveSCI"],
                                "effectiveZHEN": science["effectiveZHEN"],
                                "replayed": False},
    "currentCompleteTextBindings": text_bindings,
    "loopGeometry": loop_checks,
    "qualitativeComparisons": comparisons,
    "coordinateMeaning": "Drawing units only. These are not source numeric givens, material constants or physical loss values.",
    "labels": label_evidence,
    "actualDisplayChecks": display_evidence,
    "pngDimensions": png_dimensions,
    "pixelDecoderOrImageViewerInvokedByThisCommand": False,
    "nativeGeometryRerendered": False,
    "wholeCardDisplayVerified": False,
}
with output.open("x", encoding="utf-8") as handle:
    json.dump(payload, handle, ensure_ascii=True, indent=2)
    handle.write("\n")
print(json.dumps({
    "status": payload["status"],
    "path": str(output),
    "sha256": sha(output),
    "bindingOccurrencesChecked": len(checked),
    "uniqueBoundFilesChecked": payload["uniqueBoundFilesChecked"],
    "failures": errors,
    "currentCompleteTextBindings": text_bindings,
    "loopGeometry": loop_checks,
    "actualDisplayChecks": display_evidence,
}, indent=2))
raise SystemExit(0 if not errors else 1)
