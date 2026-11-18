#!/usr/bin/env python3
"""Bounded, offline evidence checks for the four explicitly assigned figures."""

import copy
import hashlib
import json
import math
from pathlib import Path
import re
import sys
import xml.etree.ElementTree as ET


CWD = Path("/Users/yong/.codex/worktrees/a07e/lemmadeck")
ROOT = CWD / ".tmp/s10y-image/batch014-independent131134"
TEXT_ROOT = CWD / ".tmp/ld-s10y-lesson/adapt/9-10g/modern-us-neutral/lessons/geo910-c1-s3-n36"
TOL = 1e-7


def load(path):
    return json.loads(Path(path).read_text(encoding="utf-8"))


def record(path):
    path = Path(path).resolve()
    return {"path": str(path), "sha256": hashlib.sha256(path.read_bytes()).hexdigest()}


def write_new(name, value):
    with (ROOT / name).open("x", encoding="utf-8") as stream:
        json.dump(value, stream, indent=2, ensure_ascii=True)
        stream.write("\n")


def sub(a, b):
    return [x - y for x, y in zip(a, b)]


def add(a, b):
    return [x + y for x, y in zip(a, b)]


def scale(a, value):
    return [x * value for x in a]


def dot(a, b):
    return sum(x * y for x, y in zip(a, b))


def norm(a):
    return math.sqrt(dot(a, a))


def near(a, b):
    return norm(sub(a, b)) < TOL


def cross(a, b):
    return [a[1] * b[2] - a[2] * b[1],
            a[2] * b[0] - a[0] * b[2],
            a[0] * b[1] - a[1] * b[0]]


def cross2(a, b):
    return a[0] * b[1] - a[1] * b[0]


def intersection(a, b, c, d):
    u, v, w = sub(b, a), sub(d, c), sub(c, a)
    denominator = cross2(u, v)
    if abs(denominator) < TOL:
        raise ValueError("Expected a nonparallel projected crossing")
    return cross2(w, v) / denominator, cross2(w, u) / denominator


def project(model, point):
    projection = model["projection"]
    if "rows" in projection:
        screen = add(projection["origin"], [dot(row, point) for row in projection["rows"]])
        return [screen[0], (model["height"] - screen[1]) / model["verticalScale"]]
    return add(projection["offset"],
               [sum(point[j] * projection["columns"][j][i] for j in range(3))
                for i in range(2)])


def main():
    if Path.cwd().resolve() != CWD:
        raise SystemExit("Wrong cwd")
    if len(sys.argv) > 1 and sys.argv[1] == "finalize":
        return finalize()
    if len(sys.argv) > 1 and sys.argv[1] == "recover-arrowheads":
        return recover_arrowheads()
    observations = load(ROOT / "observations.json")
    inventory = load(ROOT / "source-inventory.json")
    lesson = load(TEXT_ROOT / "lesson.template.json")
    exercises = load(TEXT_ROOT / "exercises.template.json")
    reports = [
        CWD / ".tmp/s10y-image/batch014-n36-131132/report.json",
        CWD / ".tmp/s10y-image/batch014-n36-133134/report.json",
    ]
    author_reports = [load(path) for path in reports]
    evidence = {
        "schema": "s10y-independent-current-evidence@1",
        "cwd": str(CWD),
        "scope": ["fig-131", "fig-132", "fig-133", "fig-134"],
        "method": "Independent source/text-derived conditions and fresh arithmetic; author statuses are not semantic approval.",
        "inputs": [record(ROOT / name) for name in ["source-inventory.json", "observations.json", "verify.py"]]
                  + [record(TEXT_ROOT / name) for name in ["lesson.template.json", "exercises.template.json"]]
                  + [record(path) for path in reports],
        "figures": [],
        "findings": [],
    }

    for index, number in enumerate(range(131, 135)):
        figure = f"fig-{number}"
        author = author_reports[0 if number < 133 else 1]["figures"][index % 2]
        author_dir = Path(author["spec"]["path"]).parent if number < 133 else Path(author["current"]["spec"]["path"]).parent
        spec_path, render_path = author_dir / "spec.json", author_dir / "render.json"
        preview_path = author_dir / ("preview.png" if number < 133 else "full-preview.png")
        model_path = Path(author["model"]["path"] if number < 133 else author["sourceMath"]["model"]["path"])
        spec, render, model = load(spec_path), load(render_path), load(model_path)
        objects = {obj["id"]: obj for obj in spec["objects"]}
        points = {key: obj["at"] for key, obj in objects.items() if obj["type"] == "point"}
        assertions = {item["id"]: item for item in spec["assertions"]}
        result = {
            "figure": figure,
            "selectedRevision": author_dir.name,
            "source": record(spec["source"]["image"]["path"]),
            "spec": record(spec_path),
            "render": record(render_path),
            "svg": record(author_dir / "figure.svg"),
            "preview": record(preview_path),
            "model": record(model_path),
            "checks": [],
            "hashBindings": [],
            "assertionsReused": len(assertions),
        }
        checks = result["checks"]

        def check(name, condition, detail=None):
            entry = {"id": name, "status": "pass" if condition else "fail"}
            if detail is not None:
                entry["detail"] = detail
            checks.append(entry)
            if not condition:
                evidence["findings"].append({"figure": figure, **entry})

        def bind(value, origin):
            if isinstance(value, dict):
                if "path" in value and "sha256" in value:
                    try:
                        actual = record(value["path"])
                        current = actual["sha256"] == value["sha256"]
                    except OSError as error:
                        actual, current = {"error": str(error)}, False
                    result["hashBindings"].append({"origin": origin, "expected": value, "actual": actual, "current": current})
                    check(f"binding:{origin}", current)
                for key, child in value.items():
                    if key not in {"path", "sha256"}:
                        bind(child, f"{origin}.{key}")
            elif isinstance(value, list):
                for i, child in enumerate(value):
                    bind(child, f"{origin}[{i}]")

        if number < 133:
            for key in ["source", "context", "model", "spec", "render", "svg", "preview", "authorReview", "sourceSpatial"]:
                bind(author[key], f"author-report.{key}")
            display_path = Path(author_reports[0]["displayCheck"]["path"])
            bind(author_reports[0]["displayCheck"], "author-report.displayCheck")
            bind(author_reports[0]["concurrentInputChecks"][:2], "author-report.authoritative-templates")
        else:
            for key in ["source", "current", "context", "sourceFirstInventory", "sourceMath"]:
                bind(author[key], f"author-report.{key}")
            bind(author["contextRecovery"]["templateInputs"][:2], "author-report.authoritative-templates")
            bind(author["display"]["offlineEvidence"], "author-report.display")
            display_path = Path(author["display"]["offlineEvidence"]["path"])
            repair = load(author_dir / "repair-check.json")
            bind(repair, "label-only-repair")
            prior = load(repair["priorSpec"]["path"])
            normalized = copy.deepcopy(spec)
            for obj in normalized["objects"]:
                if obj["id"] == ("M" if number == 133 else "N"):
                    obj["labelPlacement"]["offset"][1] = -14
            check("independent-label-only-bridge", normalized == prior,
                  "The complete current spec differs only in the documented upper-label offset; the prior spatial evidence is not claimed current without this bridge.")
            bind(model["provenance"], "model-provenance")
            bind(load(author["sourceMath"]["evidence"]["path"]), "author-spatial-evidence")

        bind(spec["source"]["image"], "spec.source")
        bind(render["spec"], "render.spec")
        bind(render["output"], "render.output")
        check("source-first-inventory-hash", result["source"]["sha256"] == inventory["figures"][index]["source"]["sha256"])
        check("current-render-pass-and-id", render["status"] == "pass" and render["figure"] == figure and spec["id"] == figure)
        check("current-render-no-collisions", render["collisions"] == [])
        check("preview-provenance-same-render-call", (
            lambda call: call["exitCode"] == 0
            and str(preview_path) in (call.get("command", []) if isinstance(call.get("command"), list) else call["args"])
            and str(spec_path) in (call.get("command", []) if isinstance(call.get("command"), list) else call["args"])
        )(load(author_dir / "render.call.json")),
            "Report hashes bind the PNG; the successful renderer call produces the SVG and complete PNG together. No independent rerender or screenshot is claimed.")
        validation_call = load(author_dir / "validate.call.json")
        validation = json.loads(validation_call["stdout"])
        check("existing-assertion-validation-pass", validation_call["exitCode"] == 0 and validation["status"] == "pass" and validation["errors"] == [])
        actual_texts = {block["text"] for block in lesson["prose"] if block["kind"] == "p"}
        actual_texts.update(item["text"] for item in exercises["exercises"])
        supplied = [item["text"] for item in spec["source"]["authoritativeText"]]
        required = {block["text"] for block in lesson["prose"] if block["kind"] == "p"}
        if number < 133:
            required.update(item["text"] for item in exercises["exercises"])
        else:
            required.add(next(item["text"] for item in exercises["exercises"] if item["number"] == str(number + 202)))
        check("authoritative-text-exact", set(supplied) <= actual_texts and required <= set(supplied))
        for mapping in observations["figures"][index]["sourceMapping"]:
            check("independent-inventory-map:" + mapping["objects"][0],
                  all(key in objects for key in mapping["objects"])
                  and all(key in assertions for key in mapping["assertions"]), mapping["facts"])

        expected_labels = {
            131: ["A", "B", "C", "m", "\u03b1"],
            132: ["A", "B", "C", "M", "N", "m", "\u03b1"],
            133: ["A", "B", "C", "D", "M"],
            134: ["A", "B", "C", "M", "N"],
        }[number]
        svg = ET.parse(author_dir / "figure.svg").getroot()
        nodes = {node.attrib["id"]: node for node in svg.iter() if "id" in node.attrib}
        texts = [node for node in svg.iter() if node.tag.rsplit("}", 1)[-1] == "text"]
        labels = ["".join(node.itertext()) for node in texts]
        check("exact-rendered-english-math-labels", sorted(labels) == sorted(expected_labels))
        check("no-artwork-script-or-external-payload", not any(
            node.tag.rsplit("}", 1)[-1] in {"script", "image", "foreignObject"} for node in svg.iter()))
        check("semantic-ink-paper-roles", "--ld-figure-ink" in (author_dir / "figure.svg").read_text()
              and render["theme"]["output"] == "css-variables"
              and all(obj.get("stroke", "ink") == "ink" for obj in spec["objects"]))
        check("fixed-actual-width-and-text-size", spec["display"]["purpose"] == "instructional"
              and spec["display"]["layout"] == "scroll" and spec["display"]["widths"] == [640]
              and all(float(node.attrib["font-size"]) >= 16 for node in texts)
              and all(item["status"] == "pass" and item["measuredMinPx"] >= 16 for item in render["displayChecks"]))
        expected_markers = {131: {"A", "B", "C"}, 132: {"M"}, 133: {"M", "A"}, 134: {"M", "N"}}[number]
        check("source-junction-and-marker-ownership", {
            key for key, obj in objects.items() if obj["type"] == "point" and obj.get("visible", True)
        } == expected_markers)
        expected_edges = {
            131: {"abc-top", "abc-left", "abc-right", "abc-base", "AC", "AB", "m-front", "m-back", "m-right-angle-1", "m-right-angle-2"},
            132: {"m-carrier", "AC", "AB", "CB", "MN"},
            133: {"AB", "BC", "CD", "DA", "MA", "MB", "MC", "MD"},
            134: {"AB", "BC", "CA", "MN"},
        }[number]
        edges = {key for key, obj in objects.items() if obj["type"] in {"segment", "line", "arrow"}}
        check("exact-source-edge-set", edges == expected_edges)
        dash_ids = {"m-back", "alpha-back"} if number == 131 else set()
        check("source-solid-dashed-set", {key for key, obj in objects.items() if obj.get("dash", 0)} == dash_ids)
        for key in expected_edges | ({"alpha-front", "alpha-back"} if number == 131 else {"alpha-outline"} if number == 132 else set()):
            node = nodes.get(f"ld-{figure}_ld-{key}")
            check(f"rendered-edge:{key}", node is not None and node.attrib.get("display") != "none")
            if node is not None:
                check(f"rendered-dash:{key}", bool(node.attrib.get("stroke-dasharray")) == (key in dash_ids))
        arrows = {key for key, obj in objects.items() if obj["type"] == "arrow"}
        check("exact-source-direction-arrow-set", arrows == ({"AC", "AB", "CB", "MN"} if number == 132 else set()))
        for key in arrows:
            node = nodes[f"ld-{figure}_ld-{key}"]
            check("destination-arrowhead:" + key, bool(node.attrib.get("marker-end")) and not node.attrib.get("marker-start"))

        display = load(display_path)
        bind(display.get("productCss", display.get("css")), "existing-display.css")
        bind(display.get("inputs", display.get("sources")), "existing-display.current-outputs")
        if number < 133:
            display_cases = [case for viewport in display["viewports"] for case in viewport["checks"] if case["figure"] == figure]
            display_ok = len(display_cases) == 2 and all(case["mediaWidth"] == 640 and case["minTextPx"] >= 16
                and case["scrollEndReachable"] and not case["collisions"] for case in display_cases)
        else:
            display_cases = [case for case in display["observations"] if case["figure"] == figure]
            display_ok = len(display_cases) == 4 and all(case["actualMediaWidthPx"] == 640 and case["fontPx"] >= 16
                and case["overflow"]["reachedEnd"] and all(label["insideCanvas"] for label in case["labels"]) for case in display_cases)
        check("existing-hash-current-display-evidence", display["status"] == "pass" and display_ok,
              "Reused mechanical DOM/scroll checks only; no independent browser or full lesson acceptance.")

        spatial_start = len(checks)
        check("all-spatial-points-project-to-current-spec", set(model["points"]) == set(points)
              and all(near(project(model, p), points[key]) for key, p in model["points"].items()))
        p = model["points"]
        if number < 133:
            normal = model["alpha"]["normal"]
            ac, ab, cb = sub(p["A"], p["C"]), sub(p["B"], p["A"]), sub(p["B"], p["C"])
            check("nondegenerate-spatial-normal-and-oblique", norm(ac) > TOL and norm(cb) > TOL and norm(cross(ac, normal)) < TOL)
            check("alpha-membership-and-orthogonal-foot", abs(dot(normal, p["C"])) < TOL
                  and abs(dot(normal, p["B"])) < TOL and abs(dot(normal, p["A"])) > TOL)
            check("AB-orthogonal-projection-is-CB", near(sub(ab, scale(normal, dot(ab, normal) / dot(normal, normal))), cb))
            if number == 131:
                direction = model["m"]["direction"]
                i = model["m"]["intersection"]
                check("m-in-alpha-and-beyond-B", abs(dot(direction, normal)) < TOL and abs(dot(i, normal)) < TOL
                      and abs(i[1]) < TOL and i[0] > p["B"][0])
                products = [dot(direction, vector) for vector in [ac, ab, cb]]
                check("m-spatial-perpendicular-to-AC-AB-CB", all(abs(value) < TOL for value in products), {"dotProducts": products})
                u, v = model["markerOffsets"]
                corner = add(add(i, u), v)
                marker_segments = [(add(i, u), corner), (corner, add(i, v))]
                check("source-angle-marker-spatial-orthogonal-rays", abs(dot(u, v)) < TOL and norm(u) > TOL and norm(v) > TOL)
                check("source-angle-marker-current-projection", all(
                    near(project(model, a), objects[f"m-right-angle-{j}"]["from"])
                    and near(project(model, b), objects[f"m-right-angle-{j}"]["to"])
                    for j, (a, b) in enumerate(marker_segments, 1)))
                check("m-front-back-current-projection", near(project(model, model["m"]["front"]), objects["m-front"]["from"])
                      and near(project(model, i), objects["m-front"]["to"])
                      and near(project(model, i), objects["m-back"]["from"])
                      and near(project(model, model["m"]["back"]), objects["m-back"]["to"]))
            else:
                mn = sub(p["N"], p["M"])
                check("M-N-in-alpha-and-m-nondegenerate", abs(dot(normal, p["M"])) < TOL
                      and abs(dot(normal, p["N"])) < TOL and norm(mn) > TOL)
                check("generic-m-no-added-perpendicular-premise", abs(dot(mn, cb)) > TOL)
                check("scalar-product-normal-component-consistent", abs(dot(mn, ac)) < TOL and abs(dot(mn, ab) - dot(mn, cb)) < TOL)
                distances = {key: norm(sub(points[key], objects["alpha-outline"]["center"])) for key in ["C", "B", "M", "N"]}
                check("all-in-plane-display-points-inside-alpha", all(value < objects["alpha-outline"]["radius"] for value in distances.values()), distances)
        else:
            base1 = sub(p["B"], p["A"])
            base2 = sub(p["D" if number == 133 else "C"], p["A"])
            plane_normal = cross(base1, base2)
            normal_vector = sub(p["M"], p["A" if number == 133 else "N"])
            check("spatial-base-and-normal-nondegenerate", norm(plane_normal) > TOL and norm(normal_vector) > TOL)
            check("base-coplanar", all(abs(dot(sub(p[key], p["A"]), plane_normal)) < TOL
                  for key in (["A", "B", "C", "D"] if number == 133 else ["A", "B", "C", "N"])))
            products = [dot(normal_vector, base1), dot(normal_vector, base2)]
            check("normal-to-two-independent-spatial-plane-directions", all(abs(value) < TOL for value in products), {"dotProducts": products})
            if number == 133:
                check("rectangle-given-spatial-orthogonality-and-opposite-sides", abs(dot(base1, base2)) < TOL
                      and near(sub(p["C"], p["D"]), base1) and near(sub(p["C"], p["B"]), base2))
                first, second = ["M", "C"], ["A", "D"]
            else:
                squared = [dot(sub(p[a], p[b]), sub(p[a], p[b])) for a, b in [("A", "B"), ("B", "C"), ("C", "A")]]
                check("equilateral-given-in-space-not-screen", max(squared) - min(squared) < TOL, {"squaredSpatialSides": squared})
                first, second = ["M", "N"], ["A", "C"]
                area = cross2(sub(points["B"], points["A"]), sub(points["C"], points["A"]))
                bary_b = cross2(sub(points["M"], points["A"]), sub(points["C"], points["A"])) / area
                bary_c = cross2(sub(points["B"], points["A"]), sub(points["M"], points["A"])) / area
                check("source-endpoint-order-and-M-screen-interior", points["N"][1] > points["M"][1] > points["A"][1]
                      and points["N"][0] == points["M"][0] and bary_b > 0 and bary_c > 0 and bary_b + bary_c < 1)
            t, u = intersection(*(points[key] for key in first + second))
            spatial1 = add(p[first[0]], scale(sub(p[first[1]], p[first[0]]), t))
            spatial2 = add(p[second[0]], scale(sub(p[second[1]], p[second[0]]), u))
            crossing = add(points[first[0]], scale(sub(points[first[1]], points[first[0]]), t))
            check("source-projection-only-crossing", 0 < t < 1 and 0 < u < 1
                  and norm(sub(spatial1, spatial2)) > TOL and all(not near(crossing, anchor) for anchor in points.values()),
                  {"segments": [first, second], "parameters": [t, u], "spatialSeparation": norm(sub(spatial1, spatial2))})
        result["independentlyRecomputedSpatialChecks"] = len(checks) - spatial_start
        result["status"] = "pass" if all(item["status"] == "pass" for item in checks) else "fail"
        evidence["figures"].append(result)
    evidence["status"] = "pass" if not evidence["findings"] else "fail"
    evidence["counterSummary"] = {
        "figures": 4,
        "checks": sum(len(item["checks"]) for item in evidence["figures"]),
        "hashBindings": sum(len(item["hashBindings"]) for item in evidence["figures"]),
        "spatialChecks": sum(item["independentlyRecomputedSpatialChecks"] for item in evidence["figures"]),
        "existingAssertions": sum(item["assertionsReused"] for item in evidence["figures"]),
    }
    write_new("evidence.json", evidence)
    print(json.dumps({"status": evidence["status"], **evidence["counterSummary"], "findings": evidence["findings"]}, indent=2))
    return 0 if evidence["status"] == "pass" else 1


def recover_arrowheads():
    evidence = load(ROOT / "evidence.json")
    original = record(ROOT / "evidence.json")
    initial_script = record(ROOT / "verify.initial.py")
    initial_binding = next(item for item in evidence["inputs"] if item["path"] == str(ROOT / "verify.py"))
    if initial_script["sha256"] != initial_binding["sha256"]:
        raise SystemExit("Initial checker preservation failed")
    result = next(item for item in evidence["figures"] if item["figure"] == "fig-132")
    for key in ["source", "spec", "render", "svg", "preview", "model"]:
        if record(result[key]["path"])["sha256"] != result[key]["sha256"]:
            raise SystemExit(f"Changed input during technical recovery: {key}")
    spec = load(result["spec"]["path"])
    objects = {item["id"]: item for item in spec["objects"]}
    svg = ET.parse(result["svg"]["path"]).getroot()
    groups = {node.attrib["data-arrowhead-for"]: node for node in svg.iter()
              if "data-arrowhead-for" in node.attrib}
    ids = ["AC", "AB", "CB", "MN"]
    recovery = {
        "schema": "s10y-independent-technical-recovery@1",
        "failedEvidence": original,
        "failedCheckerPreserved": initial_script,
        "currentChecker": record(ROOT / "verify.py"),
        "rendererArrowheadContract": record(CWD / ".agents/skills/ld-s10y-image/scripts/materialize_arrowheads.mjs"),
        "cause": "The initial check expected marker-end attributes. The existing renderer intentionally materializes them into data-arrowhead-for groups and removes marker-end.",
        "scope": "Only the four failed fig-132 destination-arrowhead checks. All passed source, hash, math and visual stages reused, with current asset hashes checked.",
        "checks": [],
        "imageOpens": 0,
        "rerenders": 0,
        "assetChanges": 0
    }
    expected_group_ids = {f"ld-fig-132_ld-{key}" for key in ids}
    recovery["checks"].append({
        "id": "exact-materialized-arrowhead-group-set",
        "status": "pass" if set(groups) == expected_group_ids else "fail"
    })
    for key in ids:
        group = groups.get(f"ld-fig-132_ld-{key}")
        okay = group is not None
        detail = {}
        if group is not None:
            match = re.fullmatch(
                r"translate\(([^ ]+) ([^)]+)\) rotate\(([^)]+)\) scale\(([^)]+)\) translate\(([^ ]+) ([^)]+)\)",
                group.attrib.get("transform", "")
            )
            okay = match is not None
            if match:
                x, y, angle, factor, rx, ry = [float(value) for value in match.groups()]
                angle = math.radians(angle)
                local = [(10 + rx) * factor, (5 + ry) * factor]
                tip = [x + math.cos(angle) * local[0] - math.sin(angle) * local[1],
                       y + math.sin(angle) * local[0] + math.cos(angle) * local[1]]
                start_anchor = objects[objects[key]["from"]]["at"]
                end_anchor = objects[objects[key]["to"]]["at"]
                bb = spec["canvas"]["boundingBox"]
                width, height = spec["canvas"]["width"], spec["canvas"]["height"]
                def screen(anchor):
                    return [(anchor[0] - bb[0]) * width / (bb[2] - bb[0]),
                            (bb[1] - anchor[1]) * height / (bb[1] - bb[3])]
                start, destination = screen(start_anchor), screen(end_anchor)
                axis = [math.cos(angle), math.sin(angle)]
                error = norm(sub(tip, destination))
                child_paths = [node.attrib.get("d") for node in group
                               if node.tag.rsplit("}", 1)[-1] == "path"]
                okay = (factor > 0 and error < 0.2 and dot(axis, sub(destination, start)) > 0
                        and child_paths == ["M 0,0 L 10,5 L 0,10 z"]
                        and "--ld-figure-ink" in group.attrib.get("fill", "")
                        and group.attrib.get("opacity") == "1")
                detail = {"computedTriangleTip": tip, "sourceDestinationScreen": destination,
                          "tipDistancePx": error, "visibleTrianglePath": child_paths}
        replacement = {"id": "destination-arrowhead:" + key,
                       "status": "pass" if okay else "fail", "detail": detail}
        recovery["checks"].append(replacement)
        result["checks"] = [replacement if item["id"] == replacement["id"] else item for item in result["checks"]]
    result["status"] = "pass" if all(item["status"] == "pass" for item in result["checks"]) else "fail"
    evidence["findings"] = [{"figure": figure["figure"], **item} for figure in evidence["figures"]
                            for item in figure["checks"] if item["status"] == "fail"]
    recovery["status"] = "pass" if all(item["status"] == "pass" for item in recovery["checks"]) else "fail"
    write_new("arrowhead-recovery.json", recovery)
    evidence["inputs"] = [record(ROOT / "verify.py") if item["path"] == str(ROOT / "verify.py") else item
                          for item in evidence["inputs"]]
    evidence["inputs"].extend([original, initial_script, record(ROOT / "arrowhead-recovery.json"),
                               recovery["rendererArrowheadContract"]])
    evidence["technicalRecovery"] = record(ROOT / "arrowhead-recovery.json")
    evidence["status"] = "pass" if not evidence["findings"] and recovery["status"] == "pass" else "fail"
    write_new("current-evidence.json", evidence)
    print(json.dumps({"status": evidence["status"], "recovery": recovery,
                      "currentEvidence": record(ROOT / "current-evidence.json")}, indent=2))
    return 0 if evidence["status"] == "pass" else 1


def finalize():
    evidence = load(ROOT / "current-evidence.json")
    bindings = list(evidence["inputs"])
    for figure in evidence["figures"]:
        bindings.extend(figure[key] for key in ["source", "spec", "render", "svg", "preview", "model"])
        bindings.extend(item["expected"] for item in figure["hashBindings"])
    stale = [item for item in bindings if record(item["path"])["sha256"] != item["sha256"]]
    reviews = []
    for figure in evidence["figures"]:
        path = ROOT / f'{figure["figure"]}.review.json'
        if not path.exists():
            reviews.append({"figure": figure["figure"], "status": "missing"})
            continue
        review = load(path)
        current = review["schema"] == "ld-s10y-image/review@1" and review["figure"] == figure["figure"]
        current = current and all(review[key]["sha256"] == figure[key]["sha256"] for key in ["source", "spec", "render"])
        current = current and review["outputs"]["svg"]["sha256"] == figure["svg"]["sha256"]
        reviews.append({"figure": figure["figure"], "status": review["status"] if current else "stale", "review": record(path)})
    passed = evidence["status"] == "pass" and not stale and all(item["status"] == "pass" for item in reviews)
    report = {
        "schema": "s10y-independent-bounded-figure-report@1",
        "ticket": "STEMROBIN-184",
        "invocation": "worker184-3",
        "cwd": str(CWD),
        "ownedRoot": str(ROOT),
        "status": "INDEPENDENT_FIGURE_PASS" if passed else "INDEPENDENT_FIGURE_FAIL",
        "scope": evidence["scope"],
        "role": "Independent source-first source/math/visual/cultural gate; author self-reviews not adopted as independent.",
        "evidence": record(ROOT / "current-evidence.json"),
        "preservedTechnicalFailure": record(ROOT / "evidence.json"),
        "technicalRecovery": record(ROOT / "arrowhead-recovery.json"),
        "sourceInventory": record(ROOT / "source-inventory.json"),
        "observations": record(ROOT / "observations.json"),
        "authoritativeTemplates": evidence["inputs"][3:5],
        "figures": [
            {**{key: item[key] for key in ["figure", "selectedRevision", "source", "spec", "render", "svg", "preview", "model", "status"]},
             **reviews[index]}
            for index, item in enumerate(evidence["figures"])
        ],
        "findings": evidence["findings"],
        "staleInputs": stale,
        "counters": {
            "sourceOriginalOpens": 4,
            "currentFullPreviewOpens": 4,
            "totalImageOpens": 8,
            "imageLimit": 8,
            "remainingImageAllowance": 0,
            "reopens": 0,
            "crops": 0,
            "additionalScreenshots": 0,
            "imagePayloadHandoffs": 0,
            "independentEvidenceRuns": 1,
            "targetedArrowheadRecoveryRuns": 1,
            "targetedRecoveryChecks": 5,
            "finalHashBindingRuns": 1,
            "standardReviewRecorderCalls": sum("review" in item for item in reviews),
            "recorderInternalRenderedValidationCalls": sum("review" in item for item in reviews),
            **evidence["counterSummary"],
            "rerenders": 0,
            "assetRepairs": 0,
            "browserRuns": 0,
            "networkCalls": 0,
            "paidCalls": 0,
            "installs": 0,
            "promotions": 0,
            "sharedManifestOrTemplateEdits": 0,
            "sourceOwnershipOrPageReviews": 0,
            "technicalReadFailures": 1,
            "technicalCheckerFalseFailures": 1,
            "diagnosticSearchNoMatches": 2,
            "expectedNewRootAbsenceChecks": 1,
            "historicalAuthorUsageReset": False
        },
        "preservation": "All selected and prior failed author assets/reports remain untouched. Only this independent root was written.",
        "technicalReadReceipt": {
            "command": "rg -n 'preview|screenshot|writeFile|output|sha256' .agents/skills/ld-s10y-image/scripts/render_spec.mjs .tmp/s10y-image/batch014-n36-133134/author.mjs",
            "exitCode": 2,
            "reason": "The guessed author.mjs filename does not exist; valid renderer output was retained.",
            "recovery": "rg --files identified the actual author-specs.mjs. Current render.call.json files and renderer source supplied the needed preview provenance; no successful stage was rerun."
        },
        "limitations": [
            "No source122 ownership/page review; existing independent transfer PASS accepted from direct instruction.",
            "Full lesson assembly, headed/live browser acceptance, print/PDF layout acceptance and promotion stay with the parent.",
            "Temporary metadata names author scratch outputs. A later durable promotion changes bindings and must use current durable evidence.",
            "The independent script recomputes only spatial givens and projections, not answers or requested learner constructions.",
            "Existing mechanical display evidence is reused with hashes; no new browser or screenshot acceptance is claimed.",
            "Historical image/repair/paid-call totals are not reset. This invocation counts only its own fresh bounded image context."
        ],
        "forbiddenActionsPerformed": []
    }
    write_new("report.json", report)
    own_files = sorted(path for path in ROOT.iterdir() if path.is_file() and path.name != "manifest.json")
    manifest = {
        "schema": "s10y-independent-evidence-manifest@1",
        "cwd": str(CWD),
        "ownedRoot": str(ROOT),
        "scope": evidence["scope"],
        "status": report["status"],
        "files": [record(path) for path in own_files],
        "externalInputs": evidence["inputs"],
        "selectedAssets": [
            {key: figure[key] for key in ["figure", "source", "spec", "render", "svg", "preview", "model"]}
            for figure in evidence["figures"]
        ],
        "note": "Independent scratch-evidence manifest only; not a lesson, edition, promotion or publication manifest."
    }
    write_new("manifest.json", manifest)
    print(json.dumps({"status": report["status"], "report": record(ROOT / "report.json"),
                      "manifest": record(ROOT / "manifest.json"), "reviews": reviews,
                      "counters": report["counters"]}, indent=2))
    return 0 if passed else 1


if __name__ == "__main__":
    raise SystemExit(main())
