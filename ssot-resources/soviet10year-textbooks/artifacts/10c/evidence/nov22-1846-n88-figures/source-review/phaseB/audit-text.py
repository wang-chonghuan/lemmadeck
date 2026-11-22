"""Read serialized candidate mathematics only; print evidence without writing inputs."""

import hashlib
import json
import math
import re
import sys
import xml.etree.ElementTree as ET
from pathlib import Path


ROOT = Path("/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck")
CANDIDATE = ROOT / ".tmp/stemrobin-184-six/n88-fig38-41-author/candidate"
PHASE_A = ROOT / ".tmp/stemrobin-184-six/n88-fig38-41-review/phaseA"
MANIFEST_HASH = "50ba897fe6bb4122e1bbcec9d7f09a9d1eb43ff27880309aea8065d6bedc0340"
NUMBER = r"[-+]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][-+]?\d+)?"
TOKEN = re.compile(r"[ML]|" + NUMBER)


def read_json(path):
    return json.loads(path.read_text())


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def require(condition, message):
    if not condition:
        raise ValueError(message)


def near(a, b, tolerance=2e-9):
    return abs(a - b) <= tolerance


def path_nodes(text):
    # Strictly consume the actual M/L grammar; do not execute producer code.
    matches = list(TOKEN.finditer(text))
    previous = 0
    for match in matches:
        require(not text[previous:match.start()].strip(" \t\r\n,"),
                "Unexpected serialized path syntax")
        previous = match.end()
    require(not text[previous:].strip(" \t\r\n,"), "Trailing path syntax")
    tokens = [match.group() for match in matches]
    require(len(tokens) % 3 == 0, "Incomplete path node")
    nodes = []
    for offset in range(0, len(tokens), 3):
        require(tokens[offset] == ("M" if offset == 0 else "L"),
                "Unexpected move, closure, or nonlinear path command")
        nodes.append((float(tokens[offset + 1]), float(tokens[offset + 2])))
    return nodes


def visible(element, parents):
    current = element
    while current is not None:
        style = current.get("style", "")
        if (current.tag.rsplit("}", 1)[-1] in ("defs", "clipPath")
                or current.get("display") == "none"
                or "visibility: hidden" in style
                or "display: none" in style):
            return False
        current = parents.get(current)
    return True


def ids_in(value):
    found = []
    if isinstance(value, dict):
        if "id" in value:
            found.append(value["id"])
        for item in value.values():
            found.extend(ids_in(item))
    elif isinstance(value, list):
        for item in value:
            found.extend(ids_in(item))
    return found


def audit_figure(entry, lesson):
    number = int(entry["figure"].split("-")[1])
    directory = CANDIDATE / ("fig" + str(number))
    spec = read_json(directory / "spec.json")
    basis = read_json(directory / "mathematical-basis.json")
    context = read_json(directory / "context.json")
    render = read_json(directory / "render.json")
    inventory = read_json(PHASE_A / (entry["figure"] + ".inventory.json"))
    bindings = [entry["context"], entry["spec"], entry["mathematicalBasis"],
                entry["validation"]["receipt"], entry["render"]["receipt"],
                entry["render"]["report"], entry["render"]["svg"],
                entry["render"]["preview"]]
    for binding in bindings:
        require(sha(Path(binding["path"])) == binding["sha256"],
                "Input hash mismatch: " + binding["path"])
    require(spec["source"]["image"]["sha256"] == inventory["source_sha256"],
            "Frozen source hash differs")
    prose_text = [item["text"] for item in lesson["prose"] if item["kind"] == "p"]
    require([item["text"] for item in spec["source"]["authoritativeText"]] == prose_text,
            "Embedded authoritative text differs from released prose")
    for item in context["lessons"]:
        for group in item["prose"]:
            require(all(text in [p["text"] for p in lesson["prose"]]
                        for text in group["nearbyText"]), "Context text differs")
    require(render["spec"]["sha256"] == sha(directory / "spec.json"),
            "Render spec binding differs")
    require(render["output"]["svg"]["sha256"] ==
            sha(directory / (entry["figure"] + ".svg")), "Render SVG binding differs")

    canvas = spec["canvas"]
    xmin, ymax, xmax, ymin = canvas["boundingBox"]
    sx = canvas["width"] / (xmax - xmin)
    sy = canvas["height"] / (ymax - ymin)
    require(canvas["keepAspectRatio"] is False, "Unexpected coordinate fitting")
    svg = ET.fromstring((directory / (entry["figure"] + ".svg")).read_text())
    parents = {child: parent for parent in svg.iter() for child in parent}
    require(float(svg.get("width")) == canvas["width"], "SVG width differs")
    require(float(svg.get("height")) == canvas["height"], "SVG height differs")
    layer = next(e for e in svg.iter()
                 if e.get("id") == "ld-" + entry["figure"] + "-raw-path-layer")
    scale = re.fullmatch(r"scale\((" + NUMBER + r")\s+(" + NUMBER + r")\)",
                         layer.get("transform", ""))
    require(scale is not None and near(float(scale[1]), sx)
            and near(float(scale[2]), sy), "Raw-path transform differs")
    curves = [o for o in spec["objects"] if o["type"] == "svgPath"]
    emitted = list(layer)
    require(len(curves) == len(emitted), "Emitted curve count differs")
    require(len(curves) == (5 if number == 39 else 1), "Wrong branch count")
    curve_results = []
    all_nodes = []
    for index, (curve, output, declared) in enumerate(zip(curves, emitted, basis["curves"])):
        require(output.get("d") == curve["d"], "Emitted path text differs")
        require(output.get("fill") == "none", "Curve unexpectedly filled")
        raw = path_nodes(curve["d"])
        nodes = [(u + xmin, ymax - v) for u, v in raw]
        require(len(nodes) == (2049 if number == 40 else 1025), "Unexpected sampling count")
        require(all(math.isfinite(x) and math.isfinite(y)
                    and xmin < x < xmax and ymin < y < ymax for x, y in nodes),
                "Nonfinite or out-of-canvas curve")
        require(all(b[0] > a[0] and b[1] < a[1]
                    for a, b in zip(nodes, nodes[1:])), "Curve order is not descending")
        k = index - 2 if number == 39 else 0
        inverse = number == 40
        if inverse:
            require(declared["domain"] == "all real x", "Wrong inverse domain")
            require(declared["range"]["openInterval"] == [0, math.pi],
                    "Wrong inverse range")
            require(all(0 < y < math.pi for x, y in nodes), "Inverse range endpoint")
            residual = max(abs(y - (math.pi / 2 - math.atan(x))) for x, y in nodes)
            reflected_residual = max(abs(math.cos(y) / math.sin(y) - x)
                                     for x, y in nodes)
            require(near(nodes[0][0], -5.25) and near(nodes[-1][0], 5.25),
                    "Unexpected inverse plot window")
        else:
            expected_domain = [k * math.pi, (k + 1) * math.pi]
            require(declared["domain"]["openInterval"] == expected_domain,
                    "Wrong branch domain")
            require(declared["range"] == "all real y", "Wrong cotangent range")
            require(all(expected_domain[0] < x < expected_domain[1] for x, y in nodes),
                    "Curve reaches a pole or leaves its branch")
            residual = max(abs(y - math.cos(x) / math.sin(x)) for x, y in nodes)
            reflected_residual = None
            require(near(nodes[0][1], 3.2) and near(nodes[-1][1], -3.2),
                    "Unexpected cotangent plot window")
            zero = min(nodes, key=lambda p: abs(p[1]))
            require(near(zero[1], 0) and near(zero[0], (k + 0.5) * math.pi),
                    "Wrong serialized zero")
        require(residual < 2e-9, "Serialized equation residual too large")
        require(declared["endpointMarkers"] is False
                and declared["truncationIsAuthorChosenPlotWindowNotFunctionEndpoint"],
                "Unexpected endpoint semantics")
        errors = []
        steps = []
        for a, b in zip(nodes, nodes[1:]):
            steps.append(b[0] - a[0] if inverse else a[1] - b[1])
            for t in (0.25, 0.5, 0.75):
                x = a[0] + t * (b[0] - a[0])
                y = a[1] + t * (b[1] - a[1])
                errors.append(abs(y - (math.pi / 2 - math.atan(x))) * sy
                              if inverse else abs(x - (math.atan2(1, y) + k * math.pi)) * sx)
        # Both parameter functions have |second derivative| <= 9/(8*sqrt(3)).
        bound = (9 / (8 * math.sqrt(3))) * max(steps) ** 2 / 8 * (sy if inverse else sx)
        require(max(errors) < 0.01 and bound < 0.01, "Polyline approximation is too coarse")
        all_nodes.append(nodes)
        curve_results.append({
            "id": curve["id"], "nodes": len(nodes), "branch_k": None if inverse else k,
            "first": nodes[0], "last": nodes[-1],
            "maximum_serialized_equation_residual": residual,
            "maximum_reflected_cotangent_residual": reflected_residual,
            "maximum_quarter_midpoint_error_canvas_px": max(errors),
            "analytic_interpolation_bound_canvas_px": bound,
            "finite_strictly_inside": True, "strictly_descending": True
        })

    objects = {o["id"]: o for o in spec["objects"]}
    point_objects = [o for o in spec["objects"] if o["type"] == "point"]
    visible_dots = [e for e in svg.iter()
                    if e.tag.rsplit("}", 1)[-1] in ("ellipse", "circle")
                    and visible(e, parents)]
    require(len(point_objects) == len(visible_dots) == (2 if number == 41 else 0),
            "Extra, missing, or hidden point marker")
    labels = [e for e in svg.iter() if e.tag.rsplit("}", 1)[-1] == "text"
              and visible(e, parents)]
    expected_labels = {o["id"] + "-label": o["text"]
                       for o in spec["objects"] if o["type"] == "text"}
    require({e.get("data-label-id"): "".join(e.itertext()) for e in labels}
            == expected_labels, "Emitted labels differ")
    require(len(labels) == {38: 5, 39: 13, 40: 5, 41: 9}[number], "Wrong label count")
    require(not any(e.tag.rsplit("}", 1)[-1] in ("image", "foreignObject", "script")
                    for e in svg.iter()), "Unexpected embedded content")
    arrowheads = [e for e in svg.iter() if e.get("data-arrowhead-for")
                  and visible(e, parents)]
    require(len(arrowheads) == 2, "Extra or missing arrowhead")

    def resolve(value):
        return objects[value]["at"] if isinstance(value, str) else value

    def screen(point):
        return ((point[0] - xmin) * sx, (ymax - point[1]) * sy)

    for o in spec["objects"]:
        if o["type"] != "segment":
            continue
        line = next(e for e in svg.iter()
                    if e.get("id") == "ld-" + entry["figure"] + "_ld-" + o["id"])
        for end, prefix in (("from", "1"), ("to", "2")):
            px, py = screen(resolve(o[end]))
            require(near(float(line.get("x" + prefix)), px)
                    and near(float(line.get("y" + prefix)), py), "Segment endpoint differs")
        require(bool(line.get("stroke-dasharray")) == bool(o.get("dash")),
                "Solid/dashed distinction differs")
    for dot in point_objects:
        shape = next(e for e in visible_dots
                     if e.get("id") == "ld-" + entry["figure"] + "_ld-" + dot["id"])
        px, py = screen(dot["at"])
        require(near(float(shape.get("cx")), px) and near(float(shape.get("cy")), py),
                "Dot center differs")

    extra = {}
    if number == 39:
        offsets = []
        for index, nodes in enumerate(all_nodes):
            offset = (index - 2) * math.pi
            offsets.append(max(abs((p[0] - q[0]) - offset)
                               for p, q in zip(nodes, all_nodes[2])))
            require(all(near(p[1], q[1]) for p, q in zip(nodes, all_nodes[2])),
                    "Translated branch ordinates differ")
        require(max(offsets) < 2e-9, "Periodic branch geometry differs")
        expected_guides = [-2 * math.pi, -math.pi, math.pi, 2 * math.pi, 3 * math.pi]
        guides = [o for o in spec["objects"] if o["type"] == "segment"]
        require([o["from"][0] for o in guides] == expected_guides
                and all(o["from"][0] == o["to"][0] and o.get("dash") for o in guides),
                "Five pole guides differ")
        extra["maximum_periodic_offset_residual"] = max(offsets)
    if number == 41:
        meetings = []
        for suffix, level in (("upper", 1.5), ("lower", -1.2)):
            point = objects["f41-point-" + suffix + "-foot"]["at"]
            projection = objects["f41-projection-" + suffix]
            a, b = resolve(projection["from"]), resolve(projection["to"])
            expected_x = math.atan2(1, level)
            require(near(point[0], expected_x) and point[1] == 0, "Wrong foot")
            require(near(a[0], expected_x) and near(b[0], expected_x)
                    and sorted([a[1], b[1]]) == sorted([0, level]),
                    "Wrong projection")
            node = min(all_nodes[0], key=lambda p: abs(p[1] - level))
            error = max(abs(node[0] - expected_x), abs(node[1] - level))
            require(error < 2e-9, "Curve misses level/projection junction")
            meetings.append({"level_modern_choice": level, "foot": point,
                             "curve_meeting": [expected_x, level],
                             "serialized_meeting_error": error})
        upper, lower = [item["foot"][0] for item in meetings]
        require(0 < upper < math.pi / 2 < lower < math.pi, "Foot ordering differs")
        extra["two_level_meetings"] = meetings
        extra["foot_horizontal_separation"] = lower - upper

    for group in spec["source"]["inventory"]:
        require(all(i in objects for i in group["objects"]), "Unresolved object mapping")
        require(all(i in {a["id"] for a in spec["assertions"]}
                    for i in group["assertions"]), "Unresolved assertion mapping")
    return {
        "figure": entry["figure"], "status": "TEXT_AUDIT_PASS_NOT_APPROVAL",
        "source_sha256_from_sealed_phaseA": inventory["source_sha256"],
        "phaseA_inventory_sha256": sha(PHASE_A / (entry["figure"] + ".inventory.json")),
        "frozen_source_ids": ids_in(inventory), "bindings": bindings,
        "serialized_svg_dimensions_text_only": [canvas["width"], canvas["height"]],
        "native_png_counts": "UNKNOWN",
        "text_px_at_declared_640_media": min(float(e.get("font-size")) for e in labels)
                                         * 640 / canvas["width"],
        "labels": list(expected_labels.values()), "visible_point_shapes": len(visible_dots),
        "visible_axis_arrowheads": len(arrowheads), "curves": curve_results,
        "additional_relationship_checks": extra,
        "existing_validation_exit": read_json(Path(entry["validation"]["receipt"]["path"]))["exitCode"],
        "existing_render_exit": read_json(Path(entry["render"]["receipt"]["path"]))["exitCode"],
        "existing_render_status_technical_only": render["status"]
    }


def main():
    require(Path.cwd() == ROOT, "Exact cwd required")
    require(sha(CANDIDATE / "hash-manifest.json") == MANIFEST_HASH,
            "Released candidate manifest differs")
    manifest = read_json(CANDIDATE / "hash-manifest.json")
    lesson = read_json(Path(manifest["release"]["lesson"]["path"]))
    exercises = read_json(Path(manifest["release"]["exercises"]["path"]))
    for name in ("lesson", "exercises"):
        item = manifest["release"][name]
        require(sha(Path(item["path"])) == item["sha256"], "Released text hash differs")
    require(len(lesson["prose"]) == 34 and len(exercises["exercises"]) == 34,
            "Modern text object coverage differs")
    require(all(not e["figure_refs"] and not e["figures"] for e in exercises["exercises"]),
            "Unexpected exercise figure reference")
    results = [audit_figure(entry, lesson) for entry in manifest["entries"]]
    print(json.dumps({
        "schema": "n88-independent-phaseB-text-audit@1",
        "candidate_manifest_sha256": MANIFEST_HASH,
        "modern_prose_objects_read": len(lesson["prose"]),
        "modern_prose_paragraphs_read": sum(p["kind"] == "p" for p in lesson["prose"]),
        "modern_task_texts_read": len(exercises["exercises"]),
        "png_views_or_decodes_by_this_script": 0,
        "png_hashing": "Opaque candidate preview bytes only, no original reads",
        "render_or_browser_or_converter_or_native_operations": 0,
        "writes": 0, "figures": results
    }, indent=2, ensure_ascii=True))


if __name__ == "__main__":
    try:
        main()
    except Exception as error:
        print(json.dumps({"status": "TEXT_AUDIT_FAILURE", "error": str(error)}))
        sys.exit(1)
