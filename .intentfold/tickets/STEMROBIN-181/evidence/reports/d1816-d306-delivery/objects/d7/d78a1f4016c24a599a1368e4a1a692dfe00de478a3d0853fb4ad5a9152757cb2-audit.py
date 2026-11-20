"""Bounded read-only evidence audit; writes only this review directory."""

import hashlib
import json
import math
import re
import xml.etree.ElementTree as ET
from pathlib import Path


ROOT = Path("/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck")
OWN = ROOT / ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d291-fig26-review"
AUTHOR = ROOT / ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d282-fig26-author"
assert Path.cwd() == ROOT
assert Path(__file__).resolve().parent == OWN


def load(file):
    return json.loads(Path(file).read_text())


def sha(file):
    return hashlib.sha256(Path(file).read_bytes()).hexdigest()


def bind(file):
    file = Path(file).resolve()
    return {"path": str(file), "sha256": sha(file)}


def write(name, value):
    with (OWN / name).open("x") as stream:
        json.dump(value, stream, ensure_ascii=False, indent=2)
        stream.write("\n")


checks = []


def check(name, condition, evidence=None):
    checks.append({"id": name, "status": "pass" if condition else "fail", "evidence": evidence})


def same(a, b):
    return len(a) == len(b) and all(abs(x - y) < 1e-7 for x, y in zip(a, b))


author = load(AUTHOR / "report.json")
selected = author["selected"]
inputs = {"authorReport": bind(AUTHOR / "report.json")}
for name, entry in selected.items():
    inputs[name] = bind(entry["path"])
    check(f"selected-hash-{name}", inputs[name]["sha256"] == entry["sha256"])
check("requested-spec-hash", inputs["spec"]["sha256"] == "6c9cbd30227af1792bd17a1e69b3f25da15f143edf4fd28aa36b5193e3834a8e")
check("requested-svg-hash", inputs["svg"]["sha256"] == "acc2a961efcf17d90caa540e1a7532c2d9d0f8ac34baed173aa2875907264bf1")
spec = load(selected["spec"]["path"])
render = load(selected["render"]["path"])
preview = load(selected["previewReport"]["path"])
inventory = load(OWN / "source-inventory.json")
assessment = load(OWN / "assessment.json")
ledger = load(OWN / "image-ledger.json")
inputs["source"] = bind(spec["source"]["image"]["path"])
check("current-source-hash", inputs["source"]["sha256"] == spec["source"]["image"]["sha256"] == inventory["source"]["expectedSha256"])
check("inventory-source-path", inventory["source"]["path"] == inputs["source"]["path"])
check("render-binding", bind(ROOT / render["spec"]["path"]) == inputs["spec"] and bind(ROOT / render["output"]["svg"]["path"]) == inputs["svg"])
check("passed-native-render", render["status"] == "pass" and render["collisions"] == [])
check("preview-binding", all(bind(entry["path"]) == entry for entry in preview["inputs"]) and preview["preview"] == inputs["preview"])
check("passed-native-preview", preview["status"] == "pass" and preview["nativeRenderStatus"] == "pass")
check("no-preview-network", preview["requests"] == [])

templates = author["authoritativeText"]["sourceTemplates"]
full_text = []
counts = []
for entry in templates:
    actual = bind(entry["path"])
    inputs[load(entry["path"])["edition"]] = actual
    check("template-hash-" + load(entry["path"])["edition"], actual == entry, {"expected": entry, "current": actual})
    lesson = load(entry["path"])
    check("lesson-id-" + lesson["edition"], lesson["id"] == "phy10-c1-s3-n17")
    blocks = [block for block in lesson["prose"] if block["kind"] != "fig"]
    counts.append(len(blocks))
    full_text.extend({"lesson": lesson["id"], "text": block["text"]} for block in blocks)
    check("caption-footnote-" + lesson["edition"], any(block["kind"] == "cap" for block in blocks) and any(block.get("label") == "footnote" for block in blocks))
content_hash = hashlib.sha256(json.dumps(full_text, ensure_ascii=False, separators=(",", ":")).encode()).hexdigest()
bound_text = spec["source"]["authoritativeText"]
bound_content_hash = hashlib.sha256(json.dumps(bound_text, ensure_ascii=False, separators=(",", ":")).encode()).hexdigest()
differences = [{"index": index, "bound": old, "current": new, "whitespaceOnly": old["lesson"] == new["lesson"] and old["text"].split() == new["text"].split()} for index, (old, new) in enumerate(zip(bound_text, full_text)) if old != new]
check("complete-bilingual-text-binding", full_text == spec["source"]["authoritativeText"] and counts == [12, 12], {"counts": counts, "sha256": content_hash})
check("full-text-content-hash", content_hash == author["authoritativeText"]["contentSha256"])
context = load(selected["context"]["path"])
check("context-text-binding", context["authoritativeText"] == full_text and context["authoritativeTextSha256"] == content_hash)
check("frozen-context-to-spec-text-binding", context["authoritativeText"] == bound_text and context["authoritativeTextSha256"] == bound_content_hash)
check("current-and-bound-text-semantic-equivalence", len(bound_text) == len(full_text) and all(old["lesson"] == new["lesson"] and old["text"].split() == new["text"].split() for old, new in zip(bound_text, full_text)))

objects = {obj["id"]: obj for obj in spec["objects"]}
assertions = {assertion["id"]: assertion for assertion in spec["assertions"]}
source_groups = {group["id"]: group for group in spec["source"]["inventory"]}
check("unique-object-and-assertion-ids", len(objects) == len(spec["objects"]) and len(assertions) == len(spec["assertions"]))
for group in source_groups.values():
    check("source-inventory-ids-" + group["id"], all(ref in objects for ref in group["objects"]) and all(ref in assertions for ref in group["assertions"]))
for mapping in assessment["independentCoverage"]:
    check("independent-inventory-coverage-" + mapping["inventoryId"], mapping["inventoryId"] in {g["id"] for g in inventory["groups"]} and all(ref in source_groups for ref in mapping["sourceGroups"]) and all(ref in objects for ref in mapping["objects"]) and all(ref in assertions for ref in mapping["assertions"]), mapping)
check("complete-independent-groups", {m["inventoryId"] for m in assessment["independentCoverage"]} == {g["id"] for g in inventory["groups"]})
check("no-unaccounted-grid-or-labelled-points", not any(obj["type"] in ("grid", "point", "axis") for obj in objects.values()))
for obj in objects.values():
    if obj["type"] == "arrow" or obj["id"].endswith("-leader") or obj["id"] in ("axle-visible", "contact-left", "contact-right", "lead-left-attachment", "lead-right-attachment"):
        check("semantic-edge-coverage-" + obj["id"], any(a["type"] == "connects" and a["arrow"] == obj["id"] and same(a["from"], obj["from"]) and same(a["to"], obj["to"]) for a in assertions.values()))

svg = ET.parse(selected["svg"]["path"]).getroot()
elements = list(svg.iter())
ns = "{http://www.w3.org/2000/svg}"


def screen(point):
    return [point[0], spec["canvas"]["height"] - point[1]]


def visible(element):
    attrs = element.attrib
    return attrs.get("display") != "none" and "visibility: hidden" not in attrs.get("style", "") and attrs.get("opacity", "1") != "0"


def path_data(obj):
    return [float(n) for n in re.findall(r"[-+]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][-+]?\d+)?", obj["d"])]


def path_start(obj):
    return path_data(obj)[:2]


def path_end(obj):
    return path_data(obj)[-2:]


def rendered_arrow(obj):
    identity = "ld-fig-26_ld-" + obj["id"]
    lines = [e for e in elements if e.tag == ns + "line" and e.get("id") == identity and visible(e)]
    heads = [e for e in elements if e.get("data-arrowhead-for") == identity and visible(e)]
    if len(lines) != 1 or len(heads) != 1:
        return False
    line, head = lines[0], heads[0]
    start = [float(line.get("x1")), float(line.get("y1"))]
    end = [float(line.get("x2")), float(line.get("y2"))]
    values = [float(n) for n in re.findall(r"[-+]?(?:\d+(?:\.\d*)?|\.\d+)", head.get("transform", ""))]
    if len(values) != 6:
        return False
    x, y, angle, scale, tx, ty = values
    local_tip = [(10 + tx) * scale, (5 + ty) * scale]
    theta = math.radians(angle)
    tip = [x + local_tip[0] * math.cos(theta) - local_tip[1] * math.sin(theta), y + local_tip[0] * math.sin(theta) + local_tip[1] * math.cos(theta)]
    return same(start, screen(obj["from"])) and math.dist(end, [x, y]) < 0.001 and math.dist(tip, screen(obj["to"])) < 0.2 and any(e.get("d") == "M 0,0 L 10,5 L 0,10 z" for e in head)


def rendered_object(obj):
    if obj["type"] == "svgPath":
        return any(e.tag == ns + "path" and e.get("d") == obj["d"] and visible(e) for e in elements)
    if obj["type"] == "text":
        return any(e.tag == ns + "text" and "".join(e.itertext()) == obj["text"] and visible(e) for e in elements)
    if obj["type"] == "arrow":
        return rendered_arrow(obj)
    if obj["type"] == "segment":
        return any(e.tag == ns + "line" and e.get("id") == "ld-fig-26_ld-" + obj["id"] and visible(e) and same([float(e.get("x1")), float(e.get("y1"))], screen(obj["from"])) and same([float(e.get("x2")), float(e.get("y2"))], screen(obj["to"])) for e in elements)
    if obj["type"] == "polygon":
        pts = [screen(point) for point in obj["points"]]
        lines = [e for e in elements if e.tag == ns + "line" and visible(e)]
        return all(any(same([float(e.get("x1")), float(e.get("y1"))], a) and same([float(e.get("x2")), float(e.get("y2"))], b) for e in lines) for a, b in zip(pts, pts[1:] + pts[:1]))
    return False


mapped_ids = set(ref for mapping in assessment["independentCoverage"] for ref in mapping["objects"])
for ref in sorted(mapped_ids):
    check("visible-source-object-" + ref, rendered_object(objects[ref]))
labels = ["".join(e.itertext()) for e in elements if e.tag == ns + "text" and visible(e)]
check("output-labels-english-and-only-supported-pole", sorted(labels) == sorted(["N", "Magnet", "Coil", "Axle", "Contacts", "Leads"]))
check("svg-dimensions", svg.get("viewBox") == "0 0 420 660")
check("semantic-color-spec", all(obj.get(field) in (None, "ink", "muted", "accent", "accentSoft", "grid", "paper") for obj in objects.values() for field in ("stroke", "fill", "labelColor")))
check("semantic-color-svg-paths", all(e.get("stroke", "none") in ("none", "context-stroke") or e.get("stroke", "").startswith("var(--ld-figure-") for e in elements if e.tag == ns + "path" and e.get("d") in {obj["d"] for obj in objects.values() if obj["type"] == "svgPath"}))

# This checks the actual shaft line, not the tautological pointOnLine definition.
frame_center = [sum(p[i] for p in objects["frame-boundary"]["points"]) / 4 for i in (0, 1)]
axle = objects["axle-visible"]


def line_distance(point, a, b):
    return abs((b[0] - a[0]) * (point[1] - a[1]) - (b[1] - a[1]) * (point[0] - a[0])) / math.dist(a, b)


check("derived-frame-centre-on-real-axle-line", line_distance(frame_center, axle["from"], axle["to"]) < 1e-7, {"derivedCentre": frame_center})
for side in ("left", "right"):
    ellipse = path_data(objects[f"ring-{side}-end"])
    centre_screen = [(min(ellipse[0::2]) + max(ellipse[0::2])) / 2, (min(ellipse[1::2]) + max(ellipse[1::2])) / 2]
    check(f"derived-{side}-ring-centre-on-real-axle-line", line_distance(centre_screen, screen(axle["from"]), screen(axle["to"])) < 1e-7, centre_screen)
    attachment = objects[f"lead-{side}-attachment"]
    contact = objects[f"contact-{side}"]
    lead = objects[f"lead-{side}-curve"]
    check(f"{side}-contact-lead-continuity", same(contact["to"], attachment["from"]) and same(screen(attachment["to"]), path_start(lead)))
    check(f"{side}-lead-open-path", "Z" not in lead["d"].upper() and not same(path_start(lead), path_end(lead)))
    ring_bottom = path_data(objects[f"ring-{side}-body"])[-4:-2]
    check(f"{side}-contact-visible-outline-touch", math.dist(screen(contact["to"]), ring_bottom) <= (contact["strokeWidth"] + objects[f"ring-{side}-body"]["strokeWidth"]) / 2, {"distancePx": math.dist(screen(contact["to"]), ring_bottom)})
for index in (1, 2, 3):
    winding = path_data(objects[f"winding-run-{index}"])
    relation = assertions[f"winding-{index}"]
    check(f"winding-{index}-coordinates-bound-to-path", same(winding[:2], screen(relation["from"])) and same(winding[2:4], screen(relation["to"])))
separation = assertions["lead-end-separation"]
check("lead-end-separation-bound-to-real-paths", same(path_end(objects["lead-left-curve"]), screen(separation["from"])) and same(path_end(objects["lead-right-curve"]), screen(separation["to"])))
check("rotation-curve-tangent-arrow-continuity", same(path_end(objects["rotation-curve"]), screen(objects["rotation-tangent-base"]["from"])) and same(objects["rotation-tangent-base"]["to"], objects["rotation-tip"]["from"]) and objects["rotation-tip"]["to"][1] > objects["rotation-tip"]["from"][1])
check("frozen-whole-apparatus-scope", len(objects) == 37 and not any(obj["type"] == "image" for obj in objects.values()) and math.dist(path_end(objects["lead-left-curve"]), path_end(objects["lead-right-curve"])) > 40, "Frozen whole-object list and visual inspection support no meter/return circuit; objectCount(image=0) alone does not.")

check("required-widths", spec["display"]["widths"] == [420, 331] and [p["width"] for p in preview["previews"]] == [420, 331])
for item in preview["previews"]:
    width = item["width"]
    geometry = item["geometry"]
    check(f"reused-preview-labels-{width}", len(geometry["labels"]) == 6 and all(label["px"] >= 16 for label in geometry["labels"]) and geometry["outOfCanvas"] == [], geometry)
    pixels = next(row for row in preview["pixels"] if row["width"] == width)
    check(f"reused-preview-pixels-{width}", pixels["darkPixels"] > 0 and pixels["opaquePixels"] == pixels["area"], pixels)
for image in ledger["images"]:
    check("actual-image-hash-" + str(image["sequence"]), bind(image["path"]) == {"path": image["path"], "sha256": image["sha256"]})
check("bounded-actual-image-opens", ledger["totalImageOpens"] == sum(image["opens"] for image in ledger["images"]) == 2 and ledger["totalImageOpens"] <= 4)

native_names = ["d282-validate-affected-repair", "d282-render-affected-label-repair", "d282-preview-affected-label-repair"]
native_reuse = []
for name in native_names:
    call = next(call for call in author["nativeCallsBeforeClosing"] if call["name"] == name)
    check("native-receipt-" + name, call["exitCode"] == 0 and all(bind(call[key]["path"]) == call[key] for key in ("receipt", "stdout", "stderr")))
    native_reuse.append({"stage": name, "receipt": call["receipt"], "stdout": call["stdout"], "status": "pass", "rerun": False})
validation = load(next(item["stdout"]["path"] for item in native_reuse if item["stage"] == native_names[0]))
check("passed-native-draft-validation", validation["status"] == "pass" and validation["errors"] == [] and (ROOT / validation["spec"]).resolve() == Path(inputs["spec"]["path"]))
check("one-author-repair-already-used", author["nativeOutcome"]["contentRepairCount"] == 1)

status = "pass" if all(item["status"] == "pass" for item in checks) and assessment["status"] == "pass" else "fail"
audit = {"schema": "d291/bounded-binding-coverage-audit@1", "status": status, "checks": checks, "textDifferences": differences, "nativeStagesRerun": 0, "geometryRenders": 0, "imagesOpenedByCode": 0, "supersededFirstAudit": {"artifact": bind(OWN / "audit.first.json"), "reason": "Rotation-tip inspection corrected to include its native materialized arrowhead and shortened shaft, rather than treating the shaft endpoint as the intended arrow tip. The EN exact-text binding failures remain real."}}
write("audit.json", audit)
report = {
    "schema": "d291/independent-bounded-first-review@1",
    "ticket": "STEMROBIN-181",
    "review": "D291",
    "book": "10p",
    "lesson": "phy10-c1-s3-n17",
    "figure": "fig-26",
    "status": status,
    "candidateOnly": True,
    "workspace": str(ROOT),
    "ownedDirectory": str(OWN),
    "inputs": inputs,
    "authoritativeText": {"editions": ["modern-us-neutral", "modern-us-neutral-en"], "nonFigureEntriesPerEdition": counts, "totalEntries": len(bound_text), "boundContentSha256": bound_content_hash, "currentContentSha256": content_hash, "completeBoundTextRead": True, "captionAndFootnoteIncluded": True, "exactCurrentTextBinding": full_text == bound_text, "differences": differences, "expectedTemplates": templates},
    "independentSourceInventory": inventory,
    "sourceInventoryArtifact": bind(OWN / "source-inventory.json"),
    "independentCoverage": assessment["independentCoverage"],
    "sourceReview": assessment["sourceReview"],
    "inputBindingReview": assessment["inputBindingReview"],
    "mathReview": assessment["mathReview"],
    "visualReview": assessment["visualReview"],
    "culturalReview": assessment["culturalReview"],
    "findings": assessment["findings"],
    "blockingFindings": [item for item in assessment["findings"] if item["blocking"]],
    "codeEvidence": bind(OWN / "audit.json"),
    "code": bind(OWN / "audit.py"),
    "assessment": bind(OWN / "assessment.json"),
    "nativeReuse": native_reuse,
    "nativeReruns": 0,
    "previewEvidenceReuse": {"report": inputs["previewReport"], "png": inputs["preview"], "labelMeasurements": preview["previews"], "pixelChecks": preview["pixels"], "headless": preview["headless"], "productSurfaceMeasured": False},
    "actualImageLedger": ledger,
    "imageLedgerArtifact": bind(OWN / "image-ledger.json"),
    "honestLimits": assessment["honestLimits"],
    "forbiddenActionsPerformed": {"repair": False, "redraw": False, "canonicalOrScratchTemplateEdit": False, "reviewAt1Recording": False, "database": False, "publish": False, "deploy": False, "git": False, "fullTests": False, "paidCalls": False, "peerMessages": False, "ticketApi": False, "intentfoldCapabilityOrFreshness": False, "writesOutsideOwnedDirectory": False},
    "parentIntegration": "Candidate source/math/visual/cultural review passes, but overall integration fails on stale exact EN text binding. Reconcile that binding before durable rebinding, review@1 recording or promotion. No redraw is indicated or performed here."
}
write("report.json", report)
result = {
    "schema": "d291/hash-bound-selected@1",
    "ticket": "STEMROBIN-181",
    "figure": "fig-26",
    "status": status,
    "candidateOnly": True,
    "source": inputs["source"],
    **{key: inputs[key] for key in ("spec", "svg", "render", "preview", "previewReport")},
    "report": bind(OWN / "report.json"),
    "sourceInventory": bind(OWN / "source-inventory.json"),
    "audit": bind(OWN / "audit.json"),
    "imageLedger": bind(OWN / "image-ledger.json"),
    "reviewAt1Created": False
}
write("selected.json", result)
print(json.dumps({"status": status, "checks": len(checks), "failed": [item for item in checks if item["status"] == "fail"], "report": result["report"], "selected": bind(OWN / "selected.json")}, indent=2))
