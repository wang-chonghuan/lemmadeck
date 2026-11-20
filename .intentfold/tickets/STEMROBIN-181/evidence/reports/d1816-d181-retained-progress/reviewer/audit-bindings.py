"""Inspect scoped frozen evidence and SVG structure without running producers."""

import hashlib
import json
import os
from pathlib import Path
import re
import struct
import sys
import xml.etree.ElementTree as ET


REPO = Path("/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck")
LANE = REPO / ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d181-n12-figures17-19-review"
assert Path.cwd() == REPO
stage = sys.argv[1]
assert stage in ("before", "after")


def load(path):
    return json.loads(Path(path).read_text())


def bind(path):
    path = Path(path)
    if not path.is_absolute():
        path = REPO / path
    data = path.read_bytes()
    return {"path": str(path), "bytes": len(data), "sha256": hashlib.sha256(data).hexdigest()}


records = {}


def collect(value):
    if isinstance(value, dict):
        if isinstance(value.get("path"), str) and re.fullmatch(r"[0-9a-f]{64}", value.get("sha256", "")):
            absolute = Path(value["path"])
            if not absolute.is_absolute():
                absolute = REPO / absolute
            assert absolute.is_relative_to(REPO), absolute
            old = records.get(str(absolute))
            assert not old or old["sha256"] == value["sha256"], absolute
            records[str(absolute)] = {**value, "path": str(absolute)}
        for child in value.values():
            collect(child)
    elif isinstance(value, list):
        for child in value:
            collect(child)


freeze_path = LANE / "input-freeze.json"
assert bind(freeze_path)["sha256"] == "583d083bfa604a05d09d3b92fb39a75f854e00abe01a52949bb44b10f9418c5a"
freeze = load(freeze_path)
source_only = load(LANE / "source-only.json")
after = load(LANE / "after-inventory.json")
author_report = load(after["authorReport"]["path"])
author_freeze = load(after["authorFreeze"]["path"])
geometry = load(author_report["evidence"]["authorGeometry"]["path"])
collect([freeze, source_only, after, author_report, author_freeze, geometry])
collect({"path": str(freeze_path), "sha256": bind(freeze_path)["sha256"]})

# Preserve the separate fig18 HOLD manifest without interpreting its source image.
hold_root = REPO / ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d180-n12-gauge-figure18-author"
hold_collection = load(hold_root / "parent-collected.json")
assert hold_collection["verdict"] == "hold"
collect(hold_collection)
hold_files = [bind(hold_root / name) for name in ("parent-collected.json", "report.json", "author-freeze.json", "source-first-inventory.json", "uncertainty-assessment.json")]
collect(hold_files)
if stage == "after":
    before = load(LANE / "binding-audit-before.json")
    collect(before["verifiedBindings"])
    collect(before["fig18HoldBindings"])

verified = []
for absolute, expected in sorted(records.items()):
    actual = bind(absolute)
    assert actual["sha256"] == expected["sha256"], f"Changed frozen binding: {absolute}"
    if "bytes" in expected:
        assert actual["bytes"] == expected["bytes"], absolute
    verified.append(actual)

figures = {}
for selected in after["selected"]:
    figure = selected["figure"]
    candidate = selected["candidate"]
    spec = load(candidate["spec"]["path"])
    render = load(candidate["render"]["path"])
    root = ET.parse(candidate["svg"]["path"]).getroot()
    assert root.attrib["width"] == "640"
    assert render["status"] == "pass" and not render["collisions"]
    assert render["spec"]["sha256"] == bind(candidate["spec"]["path"])["sha256"]
    assert render["output"]["svg"]["sha256"] == bind(candidate["svg"]["path"])["sha256"]
    nodes = {node.get("id"): node for node in root.iter() if node.get("id")}
    visible = []

    def walk(node, hidden=False):
        tag = node.tag.rsplit("}", 1)[-1]
        style = node.get("style", "").replace(" ", "")
        hidden = hidden or tag == "defs" or node.get("display") == "none" or node.get("visibility") == "hidden" or "visibility:hidden" in style or "display:none" in style
        if not hidden and tag in ("path", "line", "text", "polygon", "circle", "rect", "image"):
            visible.append(node)
        for child in node:
            walk(child, hidden)

    walk(root)
    colors = []
    for node in visible:
        for attribute in ("stroke", "fill"):
            color = node.get(attribute)
            if color and color != "none":
                assert color.startswith("var(--ld-figure-") or color in ("context-stroke", "context-fill"), (figure, attribute, color)
                colors.append(color)
    labels = ["".join(node.itertext()) for node in visible if node.tag.rsplit("}", 1)[-1] == "text"]
    expected_labels = ["h"] if figure == "fig-17" else ["p", "V", "0", "t1", "t2", "t2 > t1"]
    assert sorted(labels) == sorted(expected_labels), (figure, labels)
    assert not any(node.tag.rsplit("}", 1)[-1] == "image" for node in visible)
    raw_paths = list(nodes[f"ld-{figure}-raw-path-layer"])
    raw_objects = [obj for obj in spec["objects"] if obj["type"] == "svgPath"]
    assert len(raw_paths) == len(raw_objects)
    for obj, node in zip(raw_objects, raw_paths):
        assert node.get("d") == obj["d"], obj["id"]
    label_nodes = {node.get("data-label-id"): node for node in visible if node.get("data-label-id")}
    for obj in spec["objects"]:
        if obj["type"] == "svgPath":
            continue
        if obj["type"] == "text":
            node = label_nodes[f"{obj['id']}-label"]
            assert float(node.get("font-size").removesuffix("px")) >= 16
        else:
            assert f"ld-{figure}_ld-{obj['id']}" in nodes
    preview_bytes = Path(candidate["preview"]["path"]).read_bytes()
    assert preview_bytes[:8] == b"\x89PNG\r\n\x1a\n"
    width, height = struct.unpack(">II", preview_bytes[16:24])
    assert (width, height) == (640, spec["canvas"]["height"])
    binding = load(candidate["textBinding"]["path"])
    for text_record in binding["approvedText"]:
        lesson = load(text_record["path"])
        full_text = "\n\n".join(block["text"] for block in lesson["prose"] if block.get("text"))
        full_sha = hashlib.sha256(full_text.encode()).hexdigest()
        assert full_sha == text_record["fullTextSHA256"], text_record["language"]
        current = [entry for entry in spec["source"]["authoritativeText"] if entry["lesson"] == f"phy9-c1-s2-n12/{text_record['language']}/current-approved"]
        assert len(current) == 1 and current[0]["text"] == full_text
        assert lesson["exercise_count"] == 0
    figures[figure] = {
        "candidate": candidate,
        "svgVisibleLabels": labels,
        "svgVisibleColorValues": sorted(set(colors)),
        "svgVisibleRasterImages": 0,
        "svgPathsMatchSpecExactly": True,
        "nativeRenderEvidenceReused": selected["rendering"],
        "nativeValidationEvidenceReused": selected["validation"],
        "previewDimensions": [width, height],
        "fullBilingualTextBindingMatches": True,
        "sourceOpens": 1,
        "candidatePreviewOpens": 1,
        "actualImageOpens": 2
    }

# This is independent current-output arithmetic, not a replay of the native
# validator, renderer, context builder or author's geometry-check script.
s19 = load(after["selected"][1]["candidate"]["spec"]["path"])
origin_x = next(obj for obj in s19["objects"] if obj["id"] == "src19-p-axis")["from"][0]
origin_y = s19["canvas"]["height"] - next(obj for obj in s19["objects"] if obj["id"] == "src19-V-axis")["from"][1]
curve_checks = []
for obj in s19["objects"]:
    if obj["type"] != "svgPath":
        continue
    pairs = re.findall(r"([ML])(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)", obj["d"])
    assert len(pairs) > 100
    points = [(float(x) - origin_x, origin_y - float(y)) for _, x, y in pairs]
    assert all(v > 0 and p > 0 for v, p in points)
    products = [v * p for v, p in points]
    k = sum(products) / len(products)
    residual = max(abs(value - k) for value in products)
    assert residual < 0.00001
    slopes = []
    for (v1, p1), (v2, p2) in zip(points, points[1:]):
        assert v2 > v1 and p2 < p1
        slopes.append((p2 - p1) / (v2 - v1))
    assert all(b >= a - 1e-6 for a, b in zip(slopes, slopes[1:]))
    step = max(b[0] - a[0] for a, b in zip(points, points[1:]))
    error_bound = (2 * k / points[0][0] ** 3) * step ** 2 / 8
    assert error_bound < 0.003
    curve_checks.append({"id": obj["id"], "nodes": len(points), "uncalibratedLayoutK": k, "maxPVResidual": residual, "interpolationErrorBoundPx": error_bound, "minV": points[0][0], "maxV": points[-1][0], "positiveDecreasingConvex": True})
assert len(curve_checks) == 2
low, high = curve_checks
assert high["uncalibratedLayoutK"] > low["uncalibratedLayoutK"]
assert high["minV"] >= low["minV"] and high["maxV"] == low["maxV"]
figures["fig-19"]["independentCurrentPathArithmetic"] = {"curves": curve_checks, "sameVolumeOrdering": "For every shared V>0, (K2-K1)/V>0; K values are layout-only, not source readings or temperature ratios."}

native_reviews = []
if stage == "after":
    for figure in ("fig-17", "fig-19"):
        review_path = LANE / f"{figure}.review.json"
        review = load(review_path)
        assert review["schema"] == "ld-s10y-image/review@1" and review["status"] == "pass"
        candidate = figures[figure]["candidate"]
        for key in ("spec", "render"):
            assert review[key]["sha256"] == candidate[key]["sha256"]
        assert review["outputs"]["svg"]["sha256"] == candidate["svg"]["sha256"]
        assert review["source"]["sha256"] == load(candidate["spec"]["path"])["source"]["image"]["sha256"]
        receipt_dir = REPO / f".intentfold/tickets/STEMROBIN-181/tmp/d1816-recovery/native/d181-{figure.replace('-', '')}-first-record-review"
        receipt = load(receipt_dir / "receipt.json")
        assert receipt["cwd"] == str(REPO) and receipt["exitCode"] == 0
        assert "record_review.py" in " ".join(receipt["command"])
        native_reviews.append({"figure": figure, "review": bind(review_path), "receipt": bind(receipt_dir / "receipt.json"), "stdout": bind(receipt_dir / "stdout.txt"), "stderr": bind(receipt_dir / "stderr.txt"), "command": receipt["command"], "exitCode": receipt["exitCode"]})

payload = {
    "schema": "STEMROBIN-181/D181-scoped-binding-svg-audit@1",
    "stage": stage,
    "status": "pass",
    "cwd": str(REPO),
    "producerStageReplays": 0,
    "actualImagesDisplayedByThisAudit": 0,
    "verifiedBindings": verified,
    "figures": figures,
    "fig18HoldBindings": hold_files,
    "fig18VerdictUnchanged": "hold",
    "nativeReviews": native_reviews,
    "source1870307N5N9": "Not opened, reviewed or written; all writes stay in D181 lane and its named first-review receipt directories."
}
output = LANE / f"binding-audit-{stage}.json"
with output.open("x") as handle:
    json.dump(payload, handle, indent=2)
    handle.write("\n")
print(json.dumps({"status": "pass", "stage": stage, "verifiedBindings": len(verified), "curveChecks": curve_checks, "output": bind(output)}))
