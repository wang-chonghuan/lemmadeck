import copy
import hashlib
import json
from pathlib import Path
import xml.etree.ElementTree as ET
from datetime import datetime, timezone


ROOT = Path("/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck")
BASE = ROOT / ".tmp/stemrobin-184-six"
OWN = BASE / "n81-two-origin-affected-review"
assert Path.cwd() == ROOT
started = datetime.now(timezone.utc).isoformat()
bindings = {}


def read(path):
    path = Path(path)
    if not path.is_absolute():
        path = ROOT / path
    data = path.read_bytes()
    bindings[str(path)] = {
        "path": str(path),
        "bytes": len(data),
        "sha256": hashlib.sha256(data).hexdigest(),
    }
    return data


def load(path):
    return json.loads(read(path))


def bound(item):
    read(item["path"])
    actual = bindings[str(ROOT / item["path"])]
    assert actual["sha256"] == item["sha256"], item["path"]
    if "bytes" in item:
        assert actual["bytes"] == item["bytes"], item["path"]
    return actual


def canonical(value):
    return json.dumps(value, sort_keys=True, separators=(",", ":"),
                      ensure_ascii=True).encode()


def digest(value):
    return hashlib.sha256(canonical(value)).hexdigest()


def tree(node):
    return [node.tag, dict(node.attrib), node.text, node.tail,
            [tree(child) for child in node]]


lesson_dir = ROOT / (
    "ssot-resources/soviet10year-textbooks/artifacts/10c/editions/"
    "modern-us-neutral/lessons/ana10-c6-s2-n81"
)
for name, expected in (
    ("lesson.json", "08f28c1f3356435f58a8eba12c7691abb2bf01836cdb0e7380068c9accb65ce6"),
    ("exercises.json", "7a2b399482b34db36025d408b362ed9fa0506876cda74a52276d2de2771e6988"),
):
    read(lesson_dir / name)
    assert bindings[str(lesson_dir / name)]["sha256"] == expected

read(BASE / "n81-two-origin-affected-review-scope.md")
for name in ("SKILL.md", "references/figure-spec.md", "references/quality-gate.md"):
    read(ROOT / ".agents/skills/ld-s10y-image" / name)

results = []
executions = []
for figure, review, documents, prior, fields, stages in (
    (13, "n81-origin-review",
     ("source13-freeze.md", "affected-review.md", "evidence-bindings.json"),
     "n81-origin-repair/fig-13",
     {"origin-editorial": ("labelPlacement",),
      "x-tick-0-value": ("at", "labelPlacement")},
     ("fig13-two-label-recovery-render", "fig13-recovery-draft-offline-render",
      "fig13-recovery-headed-capture")),
    (17, "n81-second-figure-review",
     ("source-freeze.md", "RESULT.md", "geometry-evidence.json"),
     "n81-second-render/fig-17/label-recovery",
     {"f17-origin-modern-O": ("fontSize", "labelPlacement")},
     ("fig17-origin-clearance-render", "fig17-recovery-draft-offline-render",
      "fig17-recovery-headed-capture")),
):
    intake = load(BASE / f"{review}-intake.json")
    closure = load(BASE / f"{review}-closure.json")
    assert intake["verdicts"][f"fig-{figure}"] == "FAIL"
    assert closure["status"] == "ACTUAL_CLOSE_AGENT_COMPLETED"
    assert closure["afterIntake"] and closure["agent"] == intake["agent"]
    for item in intake["owned"]:
        if Path(item["path"]).name in documents:
            bound(item)
    if figure == 17:
        bound(next(x for x in intake["owned"]
                   if Path(x["path"]).name == "inspection-first-failure.receipt.json"))

    current = BASE / f"n81-fig{figure}-label-recovery"
    old_spec = load(BASE / prior / "spec.json")
    new_spec = load(current / "spec.json")
    changes = load(current / "changes.json")
    for key in ("previousSpec", "previousSvg", "previousRender", "candidate", "intake"):
        bound(changes[key])
    old_remainder = copy.deepcopy(old_spec)
    new_remainder = copy.deepcopy(new_spec)
    deltas = []
    for old_object, new_object in zip(
            old_remainder["objects"], new_remainder["objects"], strict=True):
        assert old_object["id"] == new_object["id"]
        for field in fields.get(old_object["id"], ()):
            deltas.append({"object": old_object["id"], "field": field,
                           "before": old_object.get(field),
                           "after": new_object.get(field)})
            old_object.pop(field, None)
            new_object.pop(field, None)
    assert old_remainder == new_remainder, f"fig-{figure} unaffected spec changed"

    objects = {x["id"]: x for x in new_spec["objects"]}
    if figure == 13:
        assert objects["origin-editorial"]["at"] == [0, 0]
        assert objects["origin-editorial"]["labelPlacement"] == {
            "position": "NW", "offset": [-8, -10]}
        assert objects["x-tick-0-value"]["at"] == [
            objects["x-tick-0"]["from"][0], 0]
        assert objects["x-tick-0-value"]["labelPlacement"] == {
            "position": "SE", "offset": [8, 10]}
    else:
        assert objects["f17-origin-modern-O"]["at"] == [0, 0]
        assert objects["f17-origin-modern-O"]["visible"] is False
        assert objects["f17-origin-modern-O"]["fontSize"] == 26
        assert objects["f17-origin-modern-O"]["labelPlacement"] == {
            "position": "SW", "offset": [10, 6]}

    svg_bytes = read(current / f"fig-{figure}.svg")
    old_svg = ET.fromstring(read(BASE / prior / f"fig-{figure}.svg"))
    new_svg = ET.fromstring(svg_bytes)
    label_ids = {name + "-label" for name in fields}
    affected_labels = []
    for svg in (old_svg, new_svg):
        found = set()
        for node in svg.iter():
            if node.attrib.get("data-label-id") in label_ids:
                found.add(node.attrib["data-label-id"])
                if svg is new_svg:
                    affected_labels.append({
                        "id": node.attrib["data-label-id"],
                        "text": "".join(node.itertext()),
                        "emittedAttributes": dict(node.attrib),
                        "native640FontPx": (
                            float(node.attrib["font-size"]) * 640 /
                            new_spec["canvas"]["width"]),
                    })
                for attribute in ("x", "y", "text-anchor", "font-size"):
                    node.attrib.pop(attribute, None)
        assert found == label_ids
    assert tree(old_svg) == tree(new_svg), f"fig-{figure} unaffected SVG changed"

    render = load(current / "render.json")
    bound(render["spec"])
    bound(render["output"]["svg"])
    display = load(current / "display-evidence.json")
    bound(display["html"])
    html = read(display["html"]["path"])
    assert svg_bytes in html, f"fig-{figure} target SVG not embedded exactly"
    for capture in display["captures"]:
        bound(capture)  # Raw-byte hash only; no raster decoding.

    for stage in stages:
        receipt_path = BASE / "n81-n82-stages" / f"{stage}.receipt.json"
        receipt = load(receipt_path)
        stdout = bound(receipt["stdout"])
        stderr = bound(receipt["stderr"])
        assert receipt["cwd"] == str(ROOT)
        assert receipt["exitCode"] == 0
        assert receipt["signal"] is None and receipt["launchError"] is None
        if stage.endswith("headed-capture"):
            capture_stdout = load(receipt["stdout"]["path"])
            bound(capture_stdout["evidence"])
            assert capture_stdout["observations"] == display["observations"]
        executions.append({
            "receipt": bindings[str(receipt_path)],
            "recordedExecution": receipt,
            "streamBindingsMatch": True,
            "stdoutContent": read(stdout["path"]).decode(),
            "stderrContent": read(stderr["path"]).decode(),
        })

    results.append({
        "figure": f"fig-{figure}",
        "priorWholeCandidateVerdict": "FAIL",
        "scienceReuse": "PASS: unchanged-component equality; no new solving",
        "specUnaffectedSha256": digest(new_remainder),
        "priorSpecUnaffectedSha256": digest(old_remainder),
        "svgUnaffectedSha256": digest(tree(new_svg)),
        "priorSvgUnaffectedSha256": digest(tree(old_svg)),
        "deltas": deltas,
        "affectedLabels": affected_labels,
        "sourceImageBindingReusedNotRead": new_spec["source"]["image"],
        "priorIntake": bindings[str(BASE / f"{review}-intake.json")],
        "actualPriorClosure": closure,
        "candidateDirectory": str(current),
        "renderReportStatusNotVisualVerdict": render["status"],
        "displayEvidence": display,
    })

output = {
    "schema": "n81-two-origin-affected/text-comparison@1",
    "status": "TEXT_COMPARISON_PASS_VISUAL_REVIEW_NOT_YET_PERFORMED",
    "cwd": str(ROOT), "startedAt": started,
    "endedAt": datetime.now(timezone.utc).isoformat(),
    "figures": results, "existingExecutions": executions,
    "bindings": list(bindings.values()),
    "limits": {
        "inputWrites": 0, "sourceImageReads": 0, "pixelDecodes": 0,
        "imageViews": 0, "newSolving": 0, "producerReruns": 0,
        "network": 0, "spawn": 0,
        "priorVisualAndTechnicalFailuresPreserved": True,
        "parentPermanently": "24/24", "reviewerStatus": "OPEN",
    },
}
(OWN / "comparison.json").write_text(
    json.dumps(output, indent=2, ensure_ascii=True) + "\n")
print(json.dumps({
    "status": output["status"], "figures": results,
    "existingReceiptsMatched": len(executions),
    "output": str(OWN / "comparison.json"),
}, indent=2, ensure_ascii=True))
