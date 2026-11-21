"""Read-only SVG mathematics and evidence binding; no raster decoder or renderer."""

import bisect
import hashlib
import json
import math
import re
import sys
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from html.parser import HTMLParser
from pathlib import Path


ROOT = Path("/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck")
OWN = ROOT / ".tmp/stemrobin-184-six/n81-second-figure-review"
BASE = ROOT / ".tmp/stemrobin-184-six/n81-second-render"
AUTHOR = ROOT / ".tmp/stemrobin-184-six/n81-n82-fig17-21-author"
STAGES = ROOT / ".tmp/stemrobin-184-six/n81-n82-stages"
LESSON = ROOT / (
    "ssot-resources/soviet10year-textbooks/artifacts/10c/"
    "editions/modern-us-neutral/lessons/ana10-c6-s2-n81/lesson.json"
)
EXPECTED = {
    17: {"reference": (1, 1, 0), "solid": (1, 20, 0)},
    18: {"reference": (1, 1, 0), "solid": (1, 2, 0)},
    19: {"reference": (1, 2, 0), "solid": (1, 2, 4)},
    20: {"reference": (1, 2, 4), "solid": (3, 2, 4)},
}
SOURCE_HASHES = {
    17: "2635c2d39c0b80b6e232ce9716e668a6a7d28f0ec5d1e94ac489bb7e4a7b148b",
    18: "128bc913f07c26f427d77d931f0810df6ac01b908f6701372c868e53e973118e",
    19: "0cbcd58f36f0eb90c458e5cb63da16c16e20e1d32f2ce7b9bc17994530641cdc",
    20: "458541c1db6511f9532eeccd1692304e9027c082eb89aab00b85d8a8c167321a",
}


def stamp():
    return datetime.now(timezone.utc).isoformat()


def digest(data):
    return hashlib.sha256(data).hexdigest()


def binding(path):
    data = path.read_bytes()
    return {"path": str(path), "bytes": len(data), "sha256": digest(data)}


def write_json(name, value):
    target = OWN / name
    assert target.parent == OWN
    target.write_text(json.dumps(value, indent=2, ensure_ascii=True) + "\n")


def local_name(element):
    return element.tag.rsplit("}", 1)[-1]


def parse_path(text):
    tokens = re.findall(r"[ML]|[-+]?(?:\d*\.?\d+)(?:[eE][-+]?\d+)?", text)
    assert re.sub(r"[ML]|[-+]?(?:\d*\.?\d+)(?:[eE][-+]?\d+)?|\s|,", "", text) == ""
    assert len(tokens) % 3 == 0
    points = []
    for i in range(0, len(tokens), 3):
        assert tokens[i] == ("M" if i == 0 else "L")
        points.append((float(tokens[i + 1]), float(tokens[i + 2])))
    assert len(points) > 2
    return points


def interpolate(points, x):
    xs = [p[0] for p in points]
    assert xs[0] - 1e-9 <= x <= xs[-1] + 1e-9
    i = min(max(bisect.bisect_right(xs, x) - 1, 0), len(xs) - 2)
    a, b = points[i], points[i + 1]
    return a[1] + (b[1] - a[1]) * (x - a[0]) / (b[0] - a[0])


class DraftProbe(HTMLParser):
    def __init__(self):
        super().__init__()
        self.figure = None
        self.layer = None
        self.layer_depth = 0
        self.active_text = None
        self.figures = {}

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "figure":
            self.figure = a.get("id") if a.get("id") in {
                "fig-17", "fig-18", "fig-19", "fig-20"
            } else None
            if self.figure:
                self.figures[self.figure] = {"attributes": a, "paths": [], "labels": []}
        if not self.figure:
            return
        if tag == "g" and self.layer:
            self.layer_depth += 1
        elif tag == "g" and a.get("id", "").endswith("-raw-path-layer"):
            self.layer = a
            self.layer_depth = 1
            self.figures[self.figure]["transform"] = a["transform"]
        if tag == "path" and self.layer:
            self.figures[self.figure]["paths"].append(a)
        if tag == "text" and a.get("data-label-id"):
            self.active_text = {"attributes": a, "text": ""}

    def handle_endtag(self, tag):
        if tag == "text" and self.active_text and self.figure:
            self.figures[self.figure]["labels"].append(self.active_text)
            self.active_text = None
        if tag == "g" and self.layer:
            self.layer_depth -= 1
            if self.layer_depth == 0:
                self.layer = None
        if tag == "figure":
            self.figure = None

    def handle_data(self, text):
        if self.active_text:
            self.active_text["text"] += text


def inspect():
    started = stamp()
    assert Path.cwd() == ROOT
    inputs = {}

    def bind(path):
        info = binding(path)
        inputs[str(path)] = info
        return info

    lesson = json.loads(LESSON.read_text())
    bind(LESSON)
    bind(LESSON.parent / "exercises.json")
    freeze = bind(OWN / "source-freeze.md")
    assert freeze["sha256"] == "381e68d6c4f451e1f1a37ee759f018a0e825b7fdb337380e87fb53ad7baa97a7"
    approved_prose = {item["text"] for item in lesson["prose"]}
    html_path = BASE / "preview/ana10-c6-s2-n81/text.html"
    html_info = bind(html_path)
    probe = DraftProbe()
    probe.feed(html_path.read_text())
    display = json.loads((BASE / "display-evidence.json").read_text())
    bind(BASE / "display-evidence.json")
    assert html_info["sha256"] == display["html"]["sha256"]
    for path in [
        BASE / "input-manifest.json",
        BASE / "label-recovery-manifest.json",
        BASE / "draft-preview-inputs.json",
        AUTHOR / "source-inventory.json",
        AUTHOR / "draft-decisions.json",
        AUTHOR / "author-numerics.json",
        AUTHOR / "RESULT.md",
        AUTHOR / "manifest.json",
        ROOT / ".tmp/stemrobin-184-six/n81-n82-fig17-21-intake.json",
    ]:
        bind(path)

    figures = []
    all_points = {}
    for n in [17, 18, 19, 20]:
        figure_id = f"fig-{n}"
        first = BASE / figure_id
        current = first / "label-recovery" if n in [17, 20] else first
        spec_path = current / "spec.json"
        svg_path = current / f"{figure_id}.svg"
        render_path = current / "render.json"
        spec = json.loads(spec_path.read_text())
        render = json.loads(render_path.read_text())
        spec_info, svg_info, render_info = map(bind, [spec_path, svg_path, render_path])
        assert render["spec"]["sha256"] == spec_info["sha256"]
        assert render["output"]["svg"]["sha256"] == svg_info["sha256"]
        assert spec["source"]["image"]["sha256"] == SOURCE_HASHES[n]
        assert all(p["text"] in approved_prose for p in spec["source"]["authoritativeText"])
        capture = bind(first / "native640.png")
        declared_capture = next(c for c in display["captures"] if c["figure"] == figure_id)
        assert capture["sha256"] == declared_capture["sha256"]
        root = ET.parse(svg_path).getroot()
        raw = next(e for e in root.iter() if e.get("id", "").endswith("-raw-path-layer"))
        scales = re.fullmatch(r"scale\(([^ ]+) ([^)]+)\)", raw.attrib["transform"])
        sx, sy = map(float, scales.groups())
        xmin, ymax, xmax, ymin = spec["canvas"]["boundingBox"]
        assert abs(sx - spec["canvas"]["width"] / (xmax - xmin)) < 1e-9
        assert abs(sy - spec["canvas"]["height"] / (ymax - ymin)) < 1e-9
        factor = 640 / spec["canvas"]["width"]
        svg_curves = list(raw)
        spec_curves = [o for o in spec["objects"] if o["type"] == "svgPath"]
        assert len(svg_curves) == len(spec_curves) == 2
        html_figure = probe.figures[figure_id]
        assert html_figure["transform"] == raw.attrib["transform"]
        assert html_figure["attributes"]["data-figure-layout"] == "scroll"
        curve_results = []
        for e, obj, html_curve in zip(svg_curves, spec_curves, html_figure["paths"]):
            assert e.attrib["d"] == obj["d"] == html_curve["d"]
            assert e.attrib["stroke"] == html_curve["stroke"]
            which = "reference" if "reference" in obj["id"] else "solid"
            a, omega, phase = EXPECTED[n][which]
            screen_points = parse_path(e.attrib["d"])
            points = [(x + xmin, ymax - y) for x, y in screen_points]
            assert all(b[0] > a_[0] for a_, b in zip(points, points[1:]))
            all_points[(n, which)] = points
            vertex_residual = max(abs(y - a * math.cos(omega * x + phase)) for x, y in points)
            interior_residual = 0
            for p, q in zip(points, points[1:]):
                for fraction in [0.125, 0.25, 0.5, 0.75, 0.875]:
                    x = p[0] + fraction * (q[0] - p[0])
                    y = p[1] + fraction * (q[1] - p[1])
                    interior_residual = max(interior_residual, abs(y - a * math.cos(omega * x + phase)))
            max_step = max(q[0] - p[0] for p, q in zip(points, points[1:]))
            bound = vertex_residual + a * omega * omega * max_step * max_step / 8
            assert bound * sy * factor < 0.03
            extrema = []
            zeros = []
            for k in range(-100, 101):
                x = (k * math.pi - phase) / omega
                if points[0][0] - 1e-10 <= x <= points[-1][0] + 1e-10:
                    extrema.append({
                        "x": x, "type": "maximum" if k % 2 == 0 else "minimum",
                        "actualY": interpolate(points, x), "expectedY": a * (-1 if k % 2 else 1),
                        "endpoint": abs(x - points[0][0]) < 1e-9 or abs(x - points[-1][0]) < 1e-9,
                    })
                z = ((k + 0.5) * math.pi - phase) / omega
                if points[0][0] - 1e-10 <= z <= points[-1][0] + 1e-10:
                    zeros.append({"x": z, "actualY": interpolate(points, z)})
            assert max(abs(v["actualY"] - v["expectedY"]) for v in extrema) < 1e-8
            assert max((abs(v["actualY"]) for v in zeros), default=0) < 1e-8
            dashed = e.get("stroke-dasharray")
            assert bool(dashed) == (which == "reference")
            endpoint_facts = []
            for index, adjacent in [(0, 1), (-1, -2)]:
                x, y = points[index]
                qx, qy = points[adjacent]
                endpoint_facts.append({
                    "x": x, "y": y, "polylineSlope": (qy - y) / (qx - x),
                    "analyticDerivative": -a * omega * math.sin(omega * x + phase),
                    "provenance": "Modern drawing cut only; not recovered source endpoint/domain",
                })
            curve_results.append({
                "object": obj["id"], "equationFromSourceFirstText": {"amplitude": a, "omega": omega, "phase": phase},
                "pathStringSha256": digest(e.attrib["d"].encode()),
                "vertices": len(points), "vertexResidualUser": vertex_residual,
                "interiorResidualUser": interior_residual, "continuousErrorBoundUser": bound,
                "continuousErrorBoundNative640Px": bound * sy * factor,
                "maxPhaseStep": omega * max_step, "extrema": extrema, "zeros": zeros,
                "endpointFacts": endpoint_facts, "dash": dashed,
                "strokeWidth": e.attrib["stroke-width"],
                "matchesSpecAndEmbeddedDraftPath": True,
                "withinCanvas": all(0 <= x * sx <= 960 and 0 <= y * sy <= spec["canvas"]["height"] for x, y in screen_points),
            })
        labels = []
        html_labels = {l["attributes"]["data-label-id"]: l for l in html_figure["labels"]}
        for e in root.iter():
            if local_name(e) != "text" or not e.get("data-label-id"):
                continue
            html_label = html_labels[e.attrib["data-label-id"]]
            text = "".join(e.itertext())
            assert html_label["text"] == text
            assert all(html_label["attributes"][k.lower()] == v for k, v in e.attrib.items())
            labels.append({
                "id": e.attrib["data-label-id"], "text": text,
                "native640Anchor": [float(e.attrib["x"]) * factor, float(e.attrib["y"]) * factor],
                "native640FontSize": float(e.attrib["font-size"]) * factor,
                "anchor": e.attrib["text-anchor"],
                "matchesEmbeddedDraft": True,
            })
        assert min(l["native640FontSize"] for l in labels) >= 16
        guides = []
        for obj in spec["objects"]:
            if "guide" not in obj["id"]:
                continue
            e = next(e for e in root.iter() if e.get("id") == f"ld-{figure_id}_ld-{obj['id']}")
            endpoints = [
                [float(e.attrib["x1"]) / sx + xmin, ymax - float(e.attrib["y1"]) / sy],
                [float(e.attrib["x2"]) / sx + xmin, ymax - float(e.attrib["y2"]) / sy],
            ]
            assert max(abs(v - exp) for point, exp_point in zip(endpoints, [obj["from"], obj["to"]]) for v, exp in zip(point, exp_point)) < 1e-10
            x, y = endpoints[-1]
            incidence = abs(interpolate(all_points[(n, "solid")], x) - y)
            assert incidence < 1e-8
            guides.append({
                "object": obj["id"], "outputEndpointsUser": endpoints,
                "solidCurveEndpointIncidenceResidual": incidence,
                "dash": e.attrib.get("stroke-dasharray"),
                "native640Endpoints": [[float(e.attrib[k]) * factor for k in pair] for pair in [("x1", "y1"), ("x2", "y2")]],
            })
        visible_points = [
            e.attrib for e in root.iter() if local_name(e) in ["ellipse", "circle"]
            and e.get("display") != "none" and "visibility: hidden" not in e.get("style", "")
        ]
        assert not visible_points
        objects_by_id = {o["id"]: o for o in spec["objects"]}
        assertions_by_id = {o["id"]: o for o in spec["assertions"]}
        assert all(set(group["objects"]) <= objects_by_id.keys() and set(group["assertions"]) <= assertions_by_id.keys() for group in spec["source"]["inventory"])
        changes = []
        if n in [17, 20]:
            original = json.loads((first / "spec.json").read_text())
            for key in ["source", "canvas", "display", "layout", "assertions"]:
                assert original[key] == spec[key]
            for before, after in zip(original["objects"], spec["objects"]):
                assert before["id"] == after["id"]
                for key in before.keys() | after.keys():
                    if before.get(key) != after.get(key):
                        changes.append({"object": after["id"], "field": key, "before": before.get(key), "after": after.get(key)})
                if after["type"] in ["svgPath", "axis", "arrow", "segment", "point"]:
                    assert before == after
            for name in ["spec.json", "render.json", f"{figure_id}.svg"]:
                bind(first / name)
            bind(current / "changes.json")
        figures.append({
            "figure": figure_id, "sourceHashFromFrozenReceipt": SOURCE_HASHES[n],
            "spec": spec_info, "svg": svg_info, "render": render_info, "capture": capture,
            "curves": curve_results, "guides": guides, "labels": labels,
            "visiblePointMarkers": len(visible_points), "recoveryChanges": changes,
            "displayRecordsSuppliedNotNewlyObserved": [o for o in display["observations"] if o["figure"] == figure_id],
            "authoritativeParagraphsMatchFullApprovedDraft": True,
        })
        for name in ["spec.json", "validation.execution.json", "validation.stdout.txt", "validation.stderr.txt"]:
            bind(AUTHOR / figure_id / name)

    f17_labels = figures[0]["labels"]
    origin = next(l for l in f17_labels if "origin" in l["id"])
    spec17 = json.loads((BASE / "fig-17/label-recovery/spec.json").read_text())
    xmin, ymax, xmax, ymin = spec17["canvas"]["boundingBox"]
    sx, sy = 640 / (xmax - xmin), (800 * 640 / 960) / (ymax - ymin)
    label_center_y = origin["native640Anchor"][1]
    user_y = ymax - label_center_y / sy
    points = all_points[(17, "solid")]
    target = -math.acos(user_y) / 20
    i = bisect.bisect_right([p[0] for p in points], target) - 1
    p, q = points[i], points[i + 1]
    actual_x = p[0] + (q[0] - p[0]) * (user_y - p[1]) / (q[1] - p[1])
    intersection = {
        "label": origin,
        "actualSolidPathAtLabelCenterYNative640": [(actual_x - xmin) * sx, label_center_y],
        "distanceLeftOfTextEndAnchorPx": origin["native640Anchor"][0] - (actual_x - xmin) * sx,
        "method": "Actual M/L path inverse interpolation plus emitted SVG text anchor, NOT font-outline or raster decoding",
        "visualFinding": "View 5 visibly shows the solid rising branch traversing O. Geometry locates it within the O glyph footprint; exact glyph bounds were not measured.",
    }
    relationships = []
    for n in [17, 18, 19, 20]:
        solid, reference = all_points[(n, "solid")], all_points[(n, "reference")]
        multiplier = 20 if n == 17 else 2 if n == 18 else 1
        shift = 2 if n == 19 else 0
        amplitude = 3 if n == 20 else 1
        lo = max(solid[0][0], (reference[0][0] - shift) / multiplier)
        hi = min(solid[-1][0], (reference[-1][0] - shift) / multiplier)
        residual = max(
            abs(interpolate(solid, x) - amplitude * interpolate(reference, multiplier * x + shift))
            for x in [lo + (hi - lo) * i / 200 for i in range(201)]
        )
        relationships.append({
            "figure": f"fig-{n}", "evaluations": 201, "overlapWindow": [lo, hi],
            "relation": f"solid(x) = {amplitude} * reference({multiplier}*x + {shift})",
            "maxActualPolylineResidualUser": residual,
        })
        assert residual < 0.00052

    receipts = []
    for name in [
        "fig17-first-new-render", "fig18-first-new-render", "fig19-first-new-render",
        "fig20-first-new-render", "fig17-label-recovery-render", "fig20-label-recovery-render",
        "all9-draft-offline-render", "second-draft-display-capture",
    ]:
        receipt_path = STAGES / f"{name}.receipt.json"
        record = json.loads(receipt_path.read_text())
        receipt_info = bind(receipt_path)
        assert record["cwd"] == str(ROOT)
        for stream in ["stdout", "stderr"]:
            stream_path = ROOT / record[stream]["path"]
            actual = bind(stream_path)
            assert actual["bytes"] == record[stream]["bytes"]
            assert actual["sha256"] == record[stream]["sha256"]
        receipts.append({"binding": receipt_info, "record": record})

    result = {
        "schema": "bounded-independent-svg-inspection@1",
        "startedAt": started, "endedAt": stamp(), "cwd": str(ROOT),
        "role": "FRESH INDEPENDENT IMAGE REVIEWER",
        "sourceFreeze": freeze, "figures": figures, "relationships": relationships,
        "figure17OriginCollision": intersection,
        "existingExecutionReceiptsChecked": receipts,
        "inputBindings": list(inputs.values()),
        "limits": {
            "producerGateInvocations": 0, "renderInvocations": 0, "newCaptures": 0,
            "rasterPixelDecodes": 0, "networkCalls": 0, "paidCalls": 0,
            "imageViewsAddedByThisScript": 0,
            "notProven": ["Uncaptured mobile/end/theme visuals", "modern finalization", "whole lesson acceptance", "source O/0 codepoints"],
        },
    }
    write_json("geometry-evidence.json", result)
    print(json.dumps({
        "status": "INSPECTION_COMPLETED_NOT_APPROVAL",
        "startedAt": started, "endedAt": result["endedAt"],
        "geometryEvidence": binding(OWN / "geometry-evidence.json"),
        "curves": sum(len(f["curves"]) for f in figures),
        "guides": sum(len(f["guides"]) for f in figures),
        "inputBindings": len(inputs),
        "figure17OriginCollision": intersection,
        "maxContinuousErrorNative640Px": max(c["continuousErrorBoundNative640Px"] for f in figures for c in f["curves"]),
    }, indent=2))


def manifest():
    assert Path.cwd() == ROOT
    path = OWN / "manifest.json"
    files = [binding(p) for p in sorted(OWN.rglob("*")) if p.is_file() and p != path]
    record = {
        "schema": "bounded-independent-review-self-excluded-manifest@1",
        "ticket": "STEMROBIN-184/184-6", "status": "OPEN_FOR_PARENT_INTAKE",
        "cwd": str(ROOT), "ownedDirectory": str(OWN),
        "selfExcluded": {"path": str(path), "reason": "Avoid circular self-hashing"},
        "files": files, "fileCountExcludingSelf": len(files),
        "bytesExcludingSelf": sum(f["bytes"] for f in files),
        "imagesIncludedInOwnedOutputs": 0, "parentPayload": "TEXT ONLY",
        "actualClosure": "PENDING_PARENT_INTAKE_AND_AUTHORIZED_ACTUAL_CLOSURE",
    }
    write_json("manifest.json", record)
    print(json.dumps({"manifest": binding(path), "filesExcludingSelf": len(files)}, indent=2))


if __name__ == "__main__":
    if sys.argv[1:] == ["--manifest"]:
        manifest()
    else:
        assert not sys.argv[1:]
        inspect()
