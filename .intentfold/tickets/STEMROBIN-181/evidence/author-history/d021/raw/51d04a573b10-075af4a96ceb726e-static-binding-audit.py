"""Read frozen bytes and XML only; never invoke native tools or load pixels."""

import hashlib
import json
import math
from pathlib import Path
import struct
import xml.etree.ElementTree as ET


ROOT = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
PROOF = ROOT / ".intentfold/tickets/STEMROBIN-181/tmp/9p-n84-figure-review-proof"
AUTHOR = ROOT / ".tmp/STEMROBIN-181/9p-d021-n84-fig160"
TEMPLATE = ROOT / ".tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons/phy9-c2-s2-n84"
EXPECTED_FREEZE = "548d053671c28b2d75f66f32b8c9503563b0b18c2e71b029b4b0a7c880ab698d"


def load(path):
    return json.loads(Path(path).read_text())


def binding(path):
    path = Path(path)
    data = path.read_bytes()
    return {"path": str(path), "sha256": hashlib.sha256(data).hexdigest(), "bytes": len(data)}


def records(value, origin):
    if isinstance(value, dict):
        if isinstance(value.get("path"), str) and isinstance(value.get("sha256"), str):
            yield origin, value
        for key, child in value.items():
            yield from records(child, f"{origin}.{key}")
    elif isinstance(value, list):
        for index, child in enumerate(value):
            yield from records(child, f"{origin}[{index}]")


errors = []
checks = []


def check(name, passed):
    checks.append({"check": name, "status": "pass" if passed else "fail"})
    if not passed:
        errors.append(name)


freeze = load(AUTHOR / "author-freeze.json")
context = load(freeze["context"]["path"])
spec = load(freeze["spec"]["path"])
render = load(freeze["render"]["path"])
construction = load(freeze["constructionBindings"]["path"])
preview = load(freeze["previewEvidence"]["path"])
lesson = load(TEMPLATE / "lesson.template.json")
exercises = load(TEMPLATE / "exercises.template.json")
page_path = ROOT / "ssot-resources/soviet10year-textbooks/artifacts/9p/pages/0207/page.json"
page = load(page_path)
text_freeze = load(freeze["textFreeze"]["path"])

check("requested author freeze SHA-256", binding(AUTHOR / "author-freeze.json")["sha256"] == EXPECTED_FREEZE)
verified = {}
for document_name, document in [
    ("freeze", freeze), ("context", context), ("construction", construction),
    ("spec", spec), ("render", render), ("previewEvidence", preview),
]:
    for origin, expected in records(document, document_name):
        path = Path(expected["path"])
        if not path.is_absolute():
            path = ROOT / path
        key = (str(path), expected["sha256"])
        if key not in verified:
            try:
                current = binding(path)
                passed = current["sha256"] == expected["sha256"]
                passed = passed and ("bytes" not in expected or current["bytes"] == expected["bytes"])
                verified[key] = {
                    **current, "expectedSha256": expected["sha256"],
                    "status": "pass" if passed else "fail", "origins": [],
                }
            except OSError as exc:
                verified[key] = {"path": str(path), "status": "fail", "error": str(exc), "origins": []}
            if verified[key]["status"] != "pass":
                errors.append(f"binding drift: {origin}")
        verified[key]["origins"].append(origin)

card = context["lessons"][0]
referencing = [item for item in exercises["exercises"] if "fig-160" in item["figure_refs"]]
expected_authority = [
    {"lesson": lesson["id"], "text": item["text"]}
    for item in lesson["prose"] if item.get("text")
] + [
    {"lesson": lesson["id"], "exercise": item["number"], "text": item["text"]}
    for item in referencing
]
check("full prose objects exact, without whitespace normalization", card["fullProse"] == lesson["prose"])
check("both full exercise objects exact, including embedded solutions", card["fullExercises"] == exercises["exercises"])
check("spec full relevant authority exact", spec["source"]["authoritativeText"] == expected_authority)
check("context full relevant authority exact", card["authoritativeText"] == expected_authority)
check("one figure-referencing example, example 2 unillustrated", [item["number"] for item in referencing] == ["1"] and not exercises["exercises"][1]["figure_refs"])
check("two source solution-bearing teaching examples preserved", exercises["count"] == 2 and all("解" in item["source_text"] and "解" in item["text"] for item in exercises["exercises"]))
check("context includes current registered errata", context["errata"] == lesson["errata"] == text_freeze["errata"])
erratum = lesson["errata"][0]
registered = page["meta"]["errata"][0]
check("single registered p0207 erratum identity", len(lesson["errata"]) == len(page["meta"]["errata"]) == 1 and erratum["id"] == registered["id"])
check("erratum exact block/original/reason", all(erratum.get(key) == registered.get(key) for key in ["id", "original", "reason"]) and erratum["source"]["block"] == registered["block"])
check("erratum source page and PDF metadata fidelity", erratum["source"]["sha256"] == binding(page_path)["sha256"] and erratum["source"]["pdf_sha256"] == page["meta"]["source"]["pdf_sha256"])
check("literal original retained in source block 8", erratum["original"] in "\n".join(page["blocks"][7]["lines"]))
check("registered C-to-C1 applied only in modern teaching text", erratum["corrected"] in exercises["exercises"][0]["text"] and erratum["original"] not in exercises["exercises"][0]["text"] and erratum["original"] in exercises["exercises"][0]["source_text"])
check("native render binds current spec and SVG", render["spec"]["sha256"] == binding(freeze["spec"]["path"])["sha256"] and render["output"]["svg"]["sha256"] == binding(freeze["svg"]["path"])["sha256"])
check("frozen native reports passed", render["status"] == "pass" and load(freeze["nativeValidation"]["path"])["status"] == "pass")
check("frozen invocations exited successfully", all(load(item["path"])["exitCode"] == 0 for item in freeze["nativeInvocations"]))

objects = {item["id"]: item for item in spec["objects"]}
assertions = {item["id"]: item for item in spec["assertions"]}
check("inventory references resolve", all(set(group["objects"]) <= objects.keys() and set(group["assertions"]) <= assertions.keys() for group in spec["source"]["inventory"]))
check("source inventory matches spec inventory", load(freeze["sourceInventory"]["path"])["inventory"] == spec["source"]["inventory"])

svg = ET.parse(freeze["svg"]["path"]).getroot()
xml_ids = {item.get("id"): item for item in svg.iter() if item.get("id")}
tag = lambda node: node.tag.rsplit("}", 1)[-1]
texts = [item for item in svg.iter() if tag(item) == "text"]
check("exact mathematical labels d, x, l; no formula or capacitance", ["".join(item.itertext()) for item in texts] == ["d", "x", "l"])
check("no script/image/foreignObject in SVG", not any(tag(item) in {"script", "image", "foreignObject"} for item in svg.iter()))
check("SVG size matches frozen canvas", [float(svg.get(key)) for key in ["width", "height"]] == [640, 1080])

def screen(point):
    return [point[0], 1080 - point[1]]


geometry = []
for item in spec["objects"]:
    if item["type"] == "text":
        element = next(node for node in texts if node.get("data-label-id") == f'{item["id"]}-label')
        passed = [float(element.get(key)) for key in ["x", "y"]] == screen(item["at"])
        passed = passed and float(element.get("font-size")) == item["fontSize"]
        geometry.append({"id": item["id"], "status": "pass" if passed else "fail", "screen": screen(item["at"])})
    else:
        element = xml_ids.get(f'ld-fig-160_ld-{item["id"]}')
        passed = element is not None
        if passed and item["type"] in {"segment", "arrow"}:
            start = [float(element.get(key)) for key in ["x1", "y1"]]
            end = [float(element.get(key)) for key in ["x2", "y2"]]
            expected_end = screen(item["to"])
            if item["type"] == "arrow":
                direction = [b - a for a, b in zip(screen(item["from"]), expected_end)]
                length = math.hypot(*direction)
                expected_end = [b - 18 * d / length for b, d in zip(expected_end, direction)]
            passed = start == screen(item["from"]) and end == expected_end
        elif passed and item["type"] == "polygon":
            points = [[float(value) for value in pair.split(",")] for pair in element.get("points").split()]
            passed = points == [screen(point) for point in item["points"]]
        geometry.append({"id": item["id"], "status": "pass" if passed else "fail"})
check("all 52 objects correspond to exact SVG geometry/text", len(geometry) == 52 and all(item["status"] == "pass" for item in geometry))
heads = [item for item in svg.iter() if item.get("data-arrowhead-for")]
check("six explicit arrowheads correspond to six source dimensions", len(heads) == 6 and {item.get("data-arrowhead-for") for item in heads} == {f'ld-fig-160_ld-{item["id"]}' for item in spec["objects"] if item["type"] == "arrow"})

visible = []
def traverse(node, hidden=False, definition=False):
    definition = definition or tag(node) in {"defs", "clipPath", "filter", "marker"}
    hidden = hidden or node.get("display") == "none" or "visibility: hidden" in node.get("style", "")
    if not hidden and not definition and tag(node) in {"line", "polygon", "path", "text"}:
        visible.append(node)
    for child in node:
        traverse(child, hidden, definition)


traverse(svg)
check("visible strokes/fills use semantic CSS roles", all(value in {"none", "context-stroke"} or value.startswith("var(--ld-figure-") for item in visible for key in ["stroke", "fill"] if (value := item.get(key)) is not None))
check("no visible junction dots", not any(tag(item) in {"circle", "ellipse"} and item.get("display") != "none" for item in svg.iter()))

widths = []
for item in preview["widths"]:
    png = Path(item["preview"]["path"]).read_bytes()
    dimensions = list(struct.unpack(">II", png[16:24]))
    check(f'width {item["width"]} PNG header', png[:8] == b"\x89PNG\r\n\x1a\n" and dimensions[0] == item["width"])
    text_checks = []
    for label in item["texts"]:
        bounds = label["bounds"]
        inside = bounds["x"] >= 0 and bounds["y"] >= 0 and bounds["x"] + bounds["width"] <= item["width"] and bounds["y"] + bounds["height"] <= item["height"]
        text_checks.append({"text": label["text"], "fontPx": label["px"], "bounds": bounds, "inside": inside})
    clear = all(a["bounds"]["x"] + a["bounds"]["width"] <= b["bounds"]["x"] or b["bounds"]["x"] + b["bounds"]["width"] <= a["bounds"]["x"] or a["bounds"]["y"] + a["bounds"]["height"] <= b["bounds"]["y"] or b["bounds"]["y"] + b["bounds"]["height"] <= a["bounds"]["y"] for index, a in enumerate(text_checks) for b in text_checks[index + 1:])
    check(f'width {item["width"]} existing text metrics >=16 and inside, no collisions', all(label["fontPx"] >= 16 and label["inside"] for label in text_checks) and clear)
    widths.append({"width": item["width"], "pngDimensions": dimensions, "minTextPx": item["minTextPx"], "textChecks": text_checks, "labelCollisions": not clear, "preview": binding(item["preview"]["path"])})
check("all declared widths inspected", spec["display"]["widths"] == [item["width"] for item in widths] == [640, 331, 342])

report = {
    "schema": "ld-s10y-image/static-binding-audit@1",
    "ticket": "STEMROBIN-181", "batch": "D021", "figure": "fig-160",
    "status": "pass" if not errors else "fail",
    "method": "Read-only JSON/SVG parsing and cryptographic hash/header inspection. No image decode/open, native validator, renderer, browser, promotion or repair.",
    "authorFreeze": binding(AUTHOR / "author-freeze.json"),
    "independentInventory": binding(PROOF / "independent-source-inventory.json"),
    "currentBindings": {
        "source": binding(freeze["source"]["path"]),
        "context": binding(TEMPLATE / "exercises.template.json"),
        "lesson": binding(TEMPLATE / "exercises.template.json"),
        "spec": binding(freeze["spec"]["path"]),
        "render": binding(freeze["render"]["path"]),
        "svg": binding(freeze["svg"]["path"]),
        "authorContext": binding(freeze["context"]["path"]),
        "prose": binding(TEMPLATE / "lesson.template.json"),
        "source207": binding(page_path),
    },
    "bindingRecordsVerified": len(verified),
    "verifiedBindings": list(verified.values()),
    "checks": checks, "errors": errors, "svgGeometry": geometry, "widthMetrics": widths,
    "counts": {"outerPlates": 2, "insertedFloatingMetalSlabs": 1, "totalConductors": 3, "terminals": 2, "textLabels": 3, "capacitanceLabels": 0, "dimensionArrows": 6, "objects": len(objects), "assertions": len(assertions), "fullProseBlocks": len(card["fullProse"]), "fullTeachingExamples": len(card["fullExercises"])},
    "legacyPromotionNotice": {
        "path": str(ROOT / ".intentfold/tickets/STEMROBIN-181/tmp/promote-d005-figure.mjs"),
        "inputShape": "Compatible: status, figures, contextKind=exercises, source/context/lesson/spec/render/svg bindings.",
        "executionNotPerformed": True,
        "mixedAuthorityEntries": len([item for item in expected_authority if "exercise" not in item]),
        "caveat": "The legacy D005 helper loops over prose authority entries as though all entries had an exercise ID; it needs a mixed-context-aware caller or scoped filtering before execution. Do not discard the full bound authority to work around it."
    },
    "writes": {"proofDirectoryOnly": True, "nativeRuns": 0, "browserRuns": 0, "repairs": 0, "promotions": 0, "imageOpens": 0},
}
destination = PROOF / "static-binding-audit.json"
with destination.open("x") as stream:
    json.dump(report, stream, indent=2, ensure_ascii=True)
    stream.write("\n")
print(json.dumps({"status": report["status"], "bindingRecordsVerified": len(verified), "checks": len(checks), "errors": errors, "output": binding(destination)}))
