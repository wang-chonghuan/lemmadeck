import copy
import hashlib
import json
from datetime import datetime, timezone
from pathlib import Path
import xml.etree.ElementTree as ET


ROOT = Path("/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck")
BASE = ROOT / ".tmp/stemrobin-184-six"
OWN = BASE / "n81-fig13-minus-one-review"
CURRENT = BASE / "n81-fig13-y-label-recovery"
PRIOR = BASE / "n81-fig13-label-recovery"
TARGET = "y-tick-4-value"
LABEL = TARGET + "-label"
bindings = {}
cache = {}


def read(path):
    path = Path(path)
    if path not in cache:
        data = path.read_bytes()
        cache[path] = data
        bindings[str(path)] = {
            "path": str(path),
            "bytes": len(data),
            "sha256": hashlib.sha256(data).hexdigest(),
        }
    return cache[path]


def document(path):
    return json.loads(read(path))


def canonical(value):
    return json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=True)


def digest(value):
    return hashlib.sha256(canonical(value).encode()).hexdigest()


def check_binding(expected):
    path = Path(expected["path"])
    if not path.is_absolute():
        path = ROOT / path
    read(path)
    actual = bindings[str(path)]
    assert actual["sha256"] == expected["sha256"], str(path)
    if "bytes" in expected:
        assert actual["bytes"] == expected["bytes"], str(path)


def normalized_spec(spec):
    result = copy.deepcopy(spec)
    target = next(obj for obj in result["objects"] if obj["id"] == TARGET)
    target.pop("at")
    target.pop("labelPlacement")
    return result


def svg_tree(element):
    attrs = dict(element.attrib)
    if attrs.get("data-label-id") == LABEL:
        for field in ("x", "y", "text-anchor"):
            attrs.pop(field)
    return [element.tag, attrs, element.text, element.tail,
            [svg_tree(child) for child in element]]


def labels(tree):
    return {node.attrib["data-label-id"]: node
            for node in tree.iter() if "data-label-id" in node.attrib}


assert Path.cwd() == ROOT
started = datetime.now(timezone.utc).isoformat()
read(BASE / "n81-fig13-minus-one-review-scope.md")
intake = document(BASE / "n81-two-origin-review-intake.json")
closure = document(BASE / "n81-two-origin-review-closure.json")
assert closure["status"] == "ACTUAL_CLOSE_AGENT_COMPLETED"
assert closure["afterIntake"] is True
assert closure["agent"] == intake["agent"]
assert closure["at"] > intake["at"]
for name in ("RESULT.md", "comparison.json"):
    path = BASE / "n81-two-origin-affected-review" / name
    expected = next(item for item in intake["owned"]
                    if Path(item["path"]).name == name)
    check_binding(expected)
old_comparison = document(BASE / "n81-two-origin-affected-review/comparison.json")
for name in ("source13-freeze.md", "affected-review.md", "lesson.json", "exercises.json"):
    expected = next(item for item in old_comparison["bindings"]
                    if Path(item["path"]).name == name)
    check_binding(expected)
for name in ("spec.json", "fig-13.svg", "render.json"):
    expected = next(item for item in intake["candidates"]
                    if "n81-fig13-label-recovery/" in item["path"]
                    and Path(item["path"]).name == name)
    check_binding(expected)

before = document(PRIOR / "spec.json")
after = document(CURRENT / "spec.json")
old_target = next(obj for obj in before["objects"] if obj["id"] == TARGET)
new_target = next(obj for obj in after["objects"] if obj["id"] == TARGET)
assert new_target["text"] == "-1"
assert new_target["at"] == [0, -1]
assert new_target["labelPlacement"] == {"position": "E", "offset": [8, 0]}
assert normalized_spec(before) == normalized_spec(after)
old_svg = ET.fromstring(read(PRIOR / "fig-13.svg"))
new_svg = ET.fromstring(read(CURRENT / "fig-13.svg"))
assert svg_tree(old_svg) == svg_tree(new_svg)
old_labels, new_labels = labels(old_svg), labels(new_svg)
assert new_labels[LABEL].text == "-1"
assert new_labels[LABEL].attrib["font-size"] == "18"
for name in ("origin-editorial-label", "x-tick-0-value-label"):
    assert ET.tostring(old_labels[name]) == ET.tostring(new_labels[name])

render = document(CURRENT / "render.json")
assert render["status"] == "pass"
check_binding(render["spec"])
check_binding(render["output"]["svg"])
changes = document(CURRENT / "changes.json")
for name in ("intake", "previousSpec", "previousSvg", "previousRender", "candidate"):
    check_binding(changes[name])
display = document(CURRENT / "display-evidence.json")
check_binding(display["html"])
html = read(ROOT / display["html"]["path"])
assert read(CURRENT / "fig-13.svg") in html
capture_names = ["native640.png", "surface-1440.png", "surface-390.png"]
assert [Path(item["path"]).name for item in display["captures"]] == capture_names
for capture in display["captures"]:
    assert (ROOT / capture["path"]).parent == CURRENT
    check_binding(capture)

executions = []
for stem in ("fig13-minus-one-clearance-render",
             "fig13-minus-one-draft-offline-render",
             "fig13-minus-one-headed-capture"):
    path = BASE / "n81-n82-stages" / (stem + ".receipt.json")
    receipt = document(path)
    assert receipt["cwd"] == str(ROOT)
    assert receipt["exitCode"] == 0
    assert receipt["signal"] is None and receipt["launchError"] is None
    streams = {}
    for channel in ("stdout", "stderr"):
        check_binding(receipt[channel])
        streams[channel] = read(ROOT / receipt[channel]["path"]).decode()
    executions.append({
        "receipt": bindings[str(path)],
        "actualExecution": receipt,
        "streamsMatched": True,
        "stdout": streams["stdout"],
        "stderr": streams["stderr"],
    })
capture_stdout = json.loads(executions[-1]["stdout"])
check_binding(capture_stdout["evidence"])
assert capture_stdout["observations"] == display["observations"]

result = {
    "schema": "n81-fig13-minus-one/text-comparison@1",
    "status": "TEXT_COMPARISON_PASS_VISUAL_VERDICT_SEPARATE",
    "cwd": str(ROOT),
    "startedAt": started,
    "endedAt": datetime.now(timezone.utc).isoformat(),
    "priorWholeCandidateVerdict": intake["verdicts"]["fig-13"],
    "priorAcceptedOPi3": intake["fig13OPi3Display"],
    "actualPriorClosure": closure,
    "affectedObjectBefore": old_target,
    "affectedObjectAfter": new_target,
    "affectedSvgLabelBefore": dict(old_labels[LABEL].attrib),
    "affectedSvgLabelAfter": dict(new_labels[LABEL].attrib),
    "unaffectedSpecEquality": True,
    "unaffectedSpecSha256": digest(normalized_spec(after)),
    "unaffectedActualSvgTreeEquality": True,
    "unaffectedActualSvgTreeSha256": digest(svg_tree(new_svg)),
    "acceptedOPi3SpecAndSvgUnchanged": True,
    "currentSvgEmbeddedByteForByteInBoundDraftHtml": True,
    "sourceImageBindingInheritedNotRead": after["source"]["image"],
    "displayEvidence": display,
    "existingExecutions": executions,
    "bindings": list(bindings.values()),
    "limits": {
        "sourceImageByteReads": 0, "imagesViewedByHelper": 0,
        "programmaticRasterDecodes": 0, "newCaptures": 0,
        "newSolving": 0, "producerInvocations": 0,
        "inputWrites": 0, "parentPermanently": "24/24",
        "reviewerState": "OPEN",
    },
}
(OWN / "comparison.json").write_text(json.dumps(result, indent=2) + "\n")
print(json.dumps({
    "status": result["status"],
    "startedAt": result["startedAt"], "endedAt": result["endedAt"],
    "unaffectedSpecSha256": result["unaffectedSpecSha256"],
    "unaffectedActualSvgTreeSha256": result["unaffectedActualSvgTreeSha256"],
    "affectedObjectBefore": old_target, "affectedObjectAfter": new_target,
    "affectedSvgLabelAfter": result["affectedSvgLabelAfter"],
    "receiptsMatched": len(executions), "capturesByteHashesMatched": 3,
    "sourceImageByteReads": 0, "imagesViewed": 0,
    "output": str(OWN / "comparison.json"),
}, indent=2))
