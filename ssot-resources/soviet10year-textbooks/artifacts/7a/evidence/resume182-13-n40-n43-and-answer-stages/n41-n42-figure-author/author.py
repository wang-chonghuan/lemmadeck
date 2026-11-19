"""Materialize the explicitly authored frozen-template cap1 package, once."""

from pathlib import Path
import hashlib
import json
import math
import struct
import subprocess
import sys


ROOT = Path("/Users/yong/.codex/worktrees/d9b1/lemmadeck")
OWN = Path(__file__).resolve().parent
BATCH = OWN.parent
TEMPLATES = BATCH / "n41-n43-adapt-work/adapt/7a/modern-us-neutral/lessons"
STAGE = BATCH / "n41-n43-source-stage/artifacts/7a"
DURABLE = ROOT / "ssot-resources/soviet10year-textbooks/artifacts/7a"
FROZEN = {
    "alg7-c4-s2-n41": {
        "lesson": "6b68ee6d11ff12d03f8d2b03a982ddb08b1ea4992dacdb72499a2007b2182202",
        "exercises": "c9e95c8bbb123b3c06ce5620adc2d96b9794adf538d3a07a9beff8dd998bb3c3",
        "figures": "e7dc156e81f742817077d14f2546dd33250c10a78166903bced91cb523d1328d",
    },
    "alg7-c4-s3-n42": {
        "lesson": "4e2778f39555510c3dc14e451cee21440ee0afee5625ba6646b16b2d22f7bd61",
        "exercises": "abddf41c0a05a6fef5d5e4d3dc2e8ae79064c47b495bf1f573ac564a19381387",
        "figures": "ce1cd0c2bd237384d6522996ff52bb4534a2f6efa2537a3a9f352642e6ec66f6",
    },
}
SOURCE_HASHES = {
    56: "ef48757e77876673409fdc7a32efaad96ac64c92046c8b5583c4b78fca09b324",
    57: "27041b86de4e3b681a54d7d3ad916542199de60d4b769549ee9398636f7566e1",
    58: "a2983bfa283fa37d7b6d3f9171a61ceb3463b502bb47ab1263438405a834e600",
}


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def save(name, value):
    path = OWN / name
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("x", encoding="utf-8") as handle:
        handle.write(json.dumps(value, ensure_ascii=False, indent=2) + "\n")
    return path


def text(identifier, at, value, font=26):
    return {
        "id": identifier, "type": "text", "at": at, "text": value,
        "fontSize": font, "labelColor": "ink",
        "labelPlacement": {"position": "CENTER"},
    }


def group(identifier, description, objects, assertions, requires=None):
    result = {
        "id": identifier, "description": description,
        "objects": objects, "assertions": assertions,
    }
    if requires:
        result["requires"] = requires
    return result


def count(identifier, kind, value):
    return {"id": identifier, "type": "objectCount", "objectType": kind, "count": value}


def frame(bounds, step, xlabels, ylabels, columns, rows, font=26, width=960):
    xmin, ymax, xmax, ymin = bounds
    objects = [{
        "id": "source-grid", "type": "grid", "bounds": bounds,
        "xStep": step, "yStep": step, "xOffset": 0, "yOffset": 0,
        "stroke": "grid", "strokeWidth": 1.5,
    }]
    for axis, start, end, labels in (
        ("x", [xmin, 0], [xmax, 0], xlabels),
        ("y", [0, ymin], [0, ymax], ylabels),
    ):
        objects.append({
            "id": f"source-{axis}-axis", "type": "axis", "from": start, "to": end,
            "stroke": "ink", "strokeWidth": 2.6, "fontSize": font,
            "labelColor": "ink", "tickSize": 0.055,
            "ticks": [{
                "at": [value, 0] if axis == "x" else [0, value],
                "label": str(value),
                "labelPlacement": {
                    "position": "S" if axis == "x" else "W",
                    "offset": [0, font * 0.65] if axis == "x" else [-font * 0.55, 0],
                },
            } for value in labels],
        })
    objects.extend([
        {"id": "source-x-arrow", "type": "arrow", "from": [xmax - 0.75, 0],
         "to": [xmax - 0.05, 0], "stroke": "ink", "strokeWidth": 2.6},
        {"id": "source-y-arrow", "type": "arrow", "from": [0, ymax - 0.75],
         "to": [0, ymax - 0.05], "stroke": "ink", "strokeWidth": 2.6},
        text("source-x-label", [xmax - 0.5, 0.45], "x", font),
        text("source-y-label", [-0.55, ymax - 0.4], "y", font),
        text("source-origin-label", [-0.27, -0.42], "0", font),
    ])
    assertions = [
        {"id": "source-grid-dimensions", "type": "gridDimensions", "grid": "source-grid",
         "columns": columns, "rows": rows},
        count("one-shared-grid", "grid", 1),
        count("two-shared-axes", "axis", 2),
        {"id": "orthogonal-axes", "type": "perpendicular",
         "a": [xmin, 0], "b": [xmax, 0], "c": [0, ymin], "d": [0, ymax]},
        {"id": "x-arrow-direction", "type": "connects", "arrow": "source-x-arrow",
         "from": [xmax - 0.75, 0], "to": [xmax - 0.05, 0]},
        {"id": "y-arrow-direction", "type": "connects", "arrow": "source-y-arrow",
         "from": [0, ymax - 0.75], "to": [0, ymax - 0.05]},
        count("two-axis-arrows", "arrow", 2),
    ]
    inventory = [
        group("shared-frame", "All source traces remain on one coordinate grid and two axes.",
              ["source-grid", "source-x-axis", "source-y-axis"],
              ["one-shared-grid", "two-shared-axes", "orthogonal-axes"]),
        group("grid", f"{columns} columns by {rows} rows, step {step}, bounds {bounds}; scan skew is regularized, not deleted.",
              ["source-grid"], ["source-grid-dimensions"], ["gridDimensions"]),
        group("axes-and-scale", f"Right/up arrows; x tick labels {xlabels}, y tick labels {ylabels}, origin 0, axis names x/y. No additional numerals.",
              ["source-x-axis", "source-y-axis", "source-x-arrow", "source-y-arrow",
               "source-x-label", "source-y-label", "source-origin-label"],
              ["orthogonal-axes", "x-arrow-direction", "y-arrow-direction", "two-axis-arrows"]),
    ]
    return objects, assertions, inventory


def trace(objects, assertions, inventory, label, start, end, readings, label_at):
    identifier = f"source-trace-{label}"
    left, right = f"construction-{label}-start", f"construction-{label}-end"
    objects.extend([
        {"id": left, "type": "point", "at": start, "visible": False},
        {"id": right, "type": "point", "at": end, "visible": False},
        {"id": identifier, "type": "segment", "from": left, "to": right,
         "stroke": "ink", "strokeWidth": 4.2, "dash": 0},
        text(f"source-{label}-label", label_at, label),
    ])
    mapped = []
    for index, reading in enumerate(readings):
        point_id = f"construction-{label}-read-{index}"
        relation_id = f"{label}-source-reading-{index}"
        objects.append({"id": point_id, "type": "point", "at": reading, "visible": False})
        assertions.append({
            "id": relation_id, "type": "pointOnLine",
            "point": point_id, "a": left, "b": right, "tolerance": 1e-8,
        })
        mapped.append(relation_id)
    assertions.append({
        "id": f"{label}-boundary-displacement", "type": "displacement",
        "from": left, "to": right, "dx": end[0] - start[0], "dy": end[1] - start[1],
        "tolerance": 1e-8,
    })
    mapped.append(f"{label}-boundary-displacement")
    inventory.append(group(
        f"trace-{label}",
        f"Source solid trace {label} on the shared frame: boundary endpoints {start}, {end}; read-off constraints {readings}. Hidden witnesses and regular spacing are modern construction, not printed dots. No equation label is displayed.",
        [identifier, f"source-{label}-label"], mapped,
    ))


def basic_spec(number, objects, assertions, inventory, box, width, height, authoritative):
    return {
        "schema": "ld-s10y-image/figure-spec@2", "id": f"fig-{number}",
        "mode": "deterministic",
        "description": {
            56: "Exercise 848: identify three solid straight traces a/b/c on the original shared unit grid; do not display the equation-to-label answers.",
            57: "Exercise 849: read the equations of two solid straight traces a/b from their original shared unit grid; no answer equations or added coordinates.",
            58: "Worked graphical quadratic example: inspect y=x^2 and y=8-2x on one half-unit grid, intersections A/B and their dashed vertical x-axis projections.",
        }[number] + " Cap1 frozen-template draft; finalized text binding and cap2 FIRST rendering are pending, independent approval is not granted.",
        "source": {
            "image": {"path": str(STAGE / f"figures/fig-{number}.png"),
                      "sha256": SOURCE_HASHES[number]},
            "authoritativeText": authoritative, "inventory": inventory,
        },
        "canvas": {"width": width, "height": height, "boundingBox": box,
                   "background": "paper", "keepAspectRatio": True},
        "display": {"layout": "scroll", "purpose": "instructional",
                    "minTextPx": 16, "widths": [640]},
        "objects": objects, "assertions": assertions,
        "layout": {"minLabelGap": 4},
    }


def make_spec(number, authoritative):
    if number in (56, 57):
        bounds = [-24, 7, 12, -5] if number == 56 else [-11, 7, 25, -5]
        xlabels = [-4, -2, 2, 4] if number == 56 else [-4, -2, 2, 4, 6, 8, 10]
        objects, assertions, inventory = frame(
            bounds, 1, xlabels, [-4, -2, 2, 4], 36, 12)
        if number == 56:
            trace(objects, assertions, inventory, "a", [-14 / 3, -5], [10 / 3, 7],
                  [[0, 2], [2, 5]], [2.8, 5.7])
            trace(objects, assertions, inventory, "b", [-2.5, 7], [3.5, -5],
                  [[0, 2], [1, 0]], [-2.25, 5.7])
            trace(objects, assertions, inventory, "c", [-24, 3], [8, -5],
                  [[0, -3], [-12, 0]], [-14.5, 1.5])
        else:
            trace(objects, assertions, inventory, "a", [-11, -4.2], [25, 3],
                  [[0, -2], [10, 0]], [23.5, 3.7])
            trace(objects, assertions, inventory, "b", [-3, 7], [3, -5],
                  [[0, 1], [1, -1], [2, -3]], [-2.35, 4.5])
        assertions.append(count("solid-trace-count", "segment", 3 if number == 56 else 2))
        inventory.append(group(
            "absence-of-answer-markings", "No visible points, equations, legend, shading, or dashed curves. Only source trace letters and scale labels are printed.",
            [f"source-trace-{label}" for label in ("abc" if number == 56 else "ab")],
            ["solid-trace-count"],
        ))
        xmin, ymax, xmax, ymin = bounds
        return basic_spec(number, objects, assertions, inventory,
                          [xmin - 1, ymax + 1, xmax + 1, ymin - 1], 960, 354, authoritative)

    bounds = [-4.5, 17.5, 4.5, -2.5]
    objects, assertions, inventory = frame(
        bounds, 0.5, [-4, -3, -2, -1, 1, 2, 3],
        [-2, -1, *range(1, 17)], 18, 40, font=20, width=640)
    objects.extend([
        {"id": "source-A", "type": "point", "at": [-4, 16],
         "size": 1, "stroke": "ink", "fill": "ink", "strokeWidth": 1},
        {"id": "source-B", "type": "point", "at": [2, 4],
         "size": 1, "stroke": "ink", "fill": "ink", "strokeWidth": 1},
        {"id": "source-A-projection", "type": "segment",
         "from": "source-A", "to": [-4, 0], "stroke": "muted",
         "strokeWidth": 2, "dash": 2},
        {"id": "source-B-projection", "type": "segment",
         "from": "source-B", "to": [2, 0], "stroke": "muted",
         "strokeWidth": 2, "dash": 2},
        {"id": "source-line", "type": "segment", "from": [-4.5, 17],
         "to": [4.5, -1], "stroke": "ink", "strokeWidth": 3.5, "dash": 0},
        text("source-A-label", [-3.65, 16.4], "A", 22),
        text("source-B-label", [2.55, 4.05], "B", 22),
        text("source-line-equation", [-1.85, 14.35], "y = 8 - 2x", 20),
        text("source-parabola-equation", [2.4, 15.3], "y = x\u00b2", 20),
    ])
    # Each exact quadratic Bezier covers one half of y=x^2, with controls
    # inside the canvas. Raw path coordinates are x-xMin, yMax-y.
    radius = math.sqrt(17.5)
    graph_segments = [
        [[-radius, 17.5], [-radius / 2, 0], [0, 0]],
        [[0, 0], [radius / 2, 0], [radius, 17.5]],
    ]
    transform = lambda point: [point[0] + 5, 18 - point[1]]
    start = transform(graph_segments[0][0])
    path = f"M {start[0]:.12g} {start[1]:.12g}"
    for _, control, end in graph_segments:
        values = transform(control) + transform(end)
        path += " Q " + " ".join(f"{value:.12g}" for value in values)
    objects.append({
        "id": "source-parabola", "type": "svgPath", "d": path,
        "stroke": "ink", "strokeWidth": 3.5, "dash": 0,
        "geometryProvenance": {
            "basis": "Frozen n42 prose states y=x^2; original PNG supplies its finite visible extent and common half-unit frame.",
            "graphQuadraticSegments": graph_segments,
            "rawTransform": "x-xMin,yMax-y with canvas boundingBox [-5,18,5,-3]",
            "supplementalCheck": "draft-check-FIRST.json:parabola-path-and-given-values",
        },
    })
    assertions.extend([
        {"id": "A-to-B", "type": "displacement", "from": "source-A",
         "to": "source-B", "dx": 6, "dy": -12},
        {"id": "A-on-line", "type": "pointOnLine", "point": "source-A",
         "a": [-4.5, 17], "b": [4.5, -1]},
        {"id": "B-on-line", "type": "pointOnLine", "point": "source-B",
         "a": [-4.5, 17], "b": [4.5, -1]},
        {"id": "A-given-coordinate", "type": "displacement",
         "from": [0, 0], "to": "source-A", "dx": -4, "dy": 16},
        {"id": "B-given-coordinate", "type": "displacement",
         "from": [0, 0], "to": "source-B", "dx": 2, "dy": 4},
        {"id": "A-projection-vertical", "type": "perpendicular",
         "a": "source-A", "b": [-4, 0], "c": [-4, 0], "d": [0, 0]},
        {"id": "B-projection-vertical", "type": "perpendicular",
         "a": "source-B", "b": [2, 0], "c": [0, 0], "d": [2, 0]},
        count("one-parabola", "svgPath", 1),
        count("line-and-two-guides", "segment", 3),
        count("two-named-intersections", "point", 2),
    ])
    inventory.extend([
        group("solid-graphs", "Exactly one solid parabola y=x^2 and one solid line y=8-2x. Their original finite endpoints are preserved. The exact parabola path and its given values require the supplemental draft check, not merely hidden witnesses.",
              ["source-parabola", "source-line", "source-line-equation", "source-parabola-equation"],
              ["one-parabola", "A-on-line", "B-on-line"]),
        group("named-intersections", "A=(-4,16), B=(2,4), both on the line and exact parabola. The relative displacement is (6,-12). One-pixel explicit intersection markers are modern clarification, not claimed standalone source dots.",
              ["source-A", "source-B", "source-A-label", "source-B-label"],
              ["A-to-B", "A-on-line", "B-on-line", "A-given-coordinate",
               "B-given-coordinate", "two-named-intersections"], ["pointRelationships"]),
        group("vertical-projections", "Two source dashed vertical guides from A and B to x=-4 and x=2 on the same x-axis; no horizontal guides.",
              ["source-A-projection", "source-B-projection"],
              ["A-projection-vertical", "B-projection-vertical", "line-and-two-guides"]),
    ])
    return basic_spec(number, objects, assertions, inventory,
                      [-5, 18, 5, -3], 640, 1344, authoritative)


def main():
    if Path.cwd() != ROOT or OWN != BATCH / "n41-n42-figure-author":
        raise SystemExit("Exact checkout/ownership guard failed")
    if (OWN / "binding-FIRST.json").exists():
        raise SystemExit("FIRST package already exists; do not replay successful stages")
    frozen, parsed = [], {}
    for lesson, hashes in FROZEN.items():
        parsed[lesson] = {}
        for kind, expected in hashes.items():
            path = TEMPLATES / lesson / f"{kind}.template.json"
            actual = digest(path)
            if actual != expected:
                raise SystemExit(f"Frozen template changed: {path}; {actual}")
            parsed[lesson][kind] = json.loads(path.read_text(encoding="utf-8"))
            frozen.append({"path": str(path), "sha256": actual, "verified": True})
    missing = []
    for lesson in FROZEN:
        for root, purpose in ((DURABLE, "future-durable"), (STAGE, "isolated-finalized")):
            for kind in ("lesson", "exercises"):
                path = root / f"editions/modern-us-neutral/lessons/{lesson}/{kind}.json"
                missing.append({"path": str(path), "purpose": purpose, "exists": path.is_file()})
    if any(item["exists"] for item in missing):
        raise SystemExit("Finalized inputs appeared; stop and bind them explicitly before proceeding")
    binding = {
        "schema": "STEMROBIN-182/frozen-template-binding@1",
        "status": "blocked-finalized-text-binding",
        "reason": "The authoritative finalized lesson/exercises JSON paths do not exist. Templates are verified and usable for cap1, but they are not fake finalized editions.",
        "paths": missing, "frozenTemplates": frozen,
        "buildContextExecuted": False, "renderExecuted": False,
        "instruction": "Parent must bind current finalized authoritativeText before FIRST cap2 render; substantively changed text invalidates affected draft assumptions.",
    }
    save("binding-FIRST.json", binding)
    probe = subprocess.run(
        [str(ROOT / ".claude/skills/ld-s10y-lesson/.venv/bin/python"), str(OWN / "pixel_probe.py")],
        cwd=ROOT, capture_output=True, text=True,
    )
    if probe.returncode:
        save("pixel-probe-FIRST-receipt.json", {
            "exitCode": probe.returncode, "stdout": probe.stdout, "stderr": probe.stderr})
        raise SystemExit("Numerical pixel probe failed; FIRST receipt preserved")
    save("pixel-probe-FIRST.json", [json.loads(line) for line in probe.stdout.splitlines()])
    specs, checks = [], []
    for number in (56, 57, 58):
        lesson_id = "alg7-c4-s3-n42" if number == 58 else "alg7-c4-s2-n41"
        inputs = parsed[lesson_id]
        lesson, exercises, manifest = (inputs[key] for key in ("lesson", "exercises", "figures"))
        figure_id = f"fig-{number}"
        assert figure_id in {item["id"] for item in manifest["figures"]}
        owners = [
            item for item in exercises["exercises"]
            if figure_id in item.get("figure_refs", [])
            or figure_id in {figure["id"] for figure in item.get("figures", [])}
        ]
        if number == 58:
            assert not owners
            assert any(item["kind"] == "fig" and item["id"] == figure_id for item in lesson["prose"])
            authoritative = [
                {"lesson": lesson_id, "text": item["text"]}
                for item in lesson["prose"] if item["kind"] == "p" and item["text"]
            ]
        else:
            assert len(owners) == 1 and owners[0]["number"] == str(number + 792)
            assert not any(item.get("id") == figure_id for item in lesson["prose"])
            authoritative = [{
                "lesson": lesson_id, "exercise": item["number"], "text": item["text"]
            } for item in owners]
        image_path = STAGE / f"figures/{figure_id}.png"
        assert digest(image_path) == SOURCE_HASHES[number]
        png_header = image_path.read_bytes()[:24]
        assert png_header[:8] == b"\x89PNG\r\n\x1a\n"
        dimensions = struct.unpack(">II", png_header[16:24])
        context = {
            "schema": "ld-s10y-image/context@1", "book": "7a",
            "edition": "modern-us-neutral", "figure": figure_id,
            "textStatus": "FROZEN-TEMPLATE-TEXT-PROVISIONAL-FINALIZED-EDITION-PATH",
            "authoritativeRule": "Exact current modern text copied from hash-verified frozen templates. Original PNG supplies visual structure. No answers/choices read. Parent binds finalized edition text before FIRST rendering.",
            "sourceImage": {"path": str(image_path), "sha256": SOURCE_HASHES[number],
                            "width": dimensions[0], "height": dimensions[1]},
            "provisionalTextSources": [
                item for item in frozen if f"/{lesson_id}/" in item["path"]
            ],
            "futureFinalizedTextPaths": [
                item for item in missing if f"/{lesson_id}/" in item["path"]
            ],
            "sourceAuthoritativeText": authoritative,
            "lessons": [{
                "lesson": lesson_id, "title": lesson["printed_title"],
                "prose": [
                    {key: item.get(key) for key in ("kind", "id", "label", "text", "source_refs")}
                    for item in lesson["prose"]
                ],
                "exercises": [
                    {key: item.get(key) for key in ("number", "group", "text", "lines", "figure_refs", "figures")}
                    for item in exercises["exercises"]
                ],
                "figureManifest": manifest,
            }],
            "ownership": {"surface": "prose" if number == 58 else "exercise",
                          "exercises": [item["number"] for item in owners]},
            "readCounts": {"completeLessonProseBlocks": len(lesson["prose"]),
                           "completeExercises": len(exercises["exercises"])},
            "sourceFirstInventory": "../source-inventory-FIRST.md",
            "batchImagesLoaded": 3, "semanticApproval": False,
            "buildContextAttempt": {"executed": False, "reason": "User forbids known failed template-only build_context invocation."},
        }
        save(f"{figure_id}/context-FIRST.json", context)
        spec = make_spec(number, authoritative)
        spec_path = save(f"{figure_id}/spec-draft-FIRST.json", spec)
        specs.append(spec_path)
        save(f"{figure_id}/source-inventory.json", {
            "schema": "STEMROBIN-182/source-first-inventory@1",
            "figure": figure_id, "sourceImage": context["sourceImage"],
            "pixelObservation": "../source-inventory-FIRST.md",
            "numericalProbe": "../pixel-probe-FIRST.json",
            "mappedGroups": spec["source"]["inventory"],
            "modernAdditions": [
                "Ideal equal spacing replaces scan skew without changing grid count, coordinate values, or shared frame.",
                "Fixed English/mathematical label placement and semantic colors.",
                "Hidden straight-trace witnesses are not printed source points.",
            ] + (["Tiny A/B intersection markers clarify the named crossings; no standalone source dot is claimed."] if number == 58 else []),
            "independentReview": "not-performed",
        })
        assert spec["source"]["authoritativeText"] == authoritative
        result = subprocess.run(
            [sys.executable, str(ROOT / ".agents/skills/ld-s10y-image/scripts/validate_spec.py"),
             str(spec_path), "--stage", "draft", "--json"],
            cwd=ROOT, capture_output=True, text=True,
        )
        payload = json.loads(result.stdout)
        save(f"{figure_id}/spec-validation-draft-FIRST.json", payload)
        save(f"{figure_id}/validation-FIRST-receipt.json", {
            "command": result.args, "cwd": str(ROOT), "exitCode": result.returncode,
            "stdout": result.stdout, "stderr": result.stderr, "specSha256": digest(spec_path),
            "runCount": 1,
        })
        if result.returncode:
            raise SystemExit(f"{figure_id}: draft validation failed; FIRST outputs preserved")
        checks.append({"id": f"{figure_id}-canonical-draft-validation", "status": "pass"})
        assert all(obj.get("fontSize", 26) * 640 / spec["canvas"]["width"] >= 16
                   for obj in spec["objects"] if obj["type"] in ("text", "axis"))
        checks.append({"id": f"{figure_id}-declared-text-minimum",
                       "status": "pass", "note": "Arithmetic plan only; no rendered sizing or collision claim."})
    parabola_spec = json.loads(specs[-1].read_text(encoding="utf-8"))
    parabola = next(obj for obj in parabola_spec["objects"] if obj["id"] == "source-parabola")
    segments = parabola["geometryProvenance"]["graphQuadraticSegments"]
    maximum_error = 0
    for start, control, end in segments:
        for index in range(101):
            t = index / 100
            x, y = [
                (1 - t) ** 2 * start[axis] + 2 * t * (1 - t) * control[axis] + t ** 2 * end[axis]
                for axis in (0, 1)
            ]
            maximum_error = max(maximum_error, abs(y - x ** 2))
            assert -4.5 <= x <= 4.5 and 0 <= y <= 17.5 + 1e-10
    for x, y in ((-4, 16), (2, 4), (0, 0)):
        assert y == x ** 2
    assert maximum_error < 1e-10
    checks.append({"id": "parabola-path-and-given-values", "status": "pass",
                   "maxQuadraticError": maximum_error,
                   "note": "Exact frozen-prose function, not interpolation from an answer key. Canonical assertions alone do not assert point-on-svgPath."})
    save("draft-check-FIRST.json", {
        "status": "pass", "checks": checks, "semanticApproval": False,
        "renderedInspection": False,
    })
    plans = []
    for spec_path in specs:
        figure = spec_path.parent.name
        plans.append({
            "figure": figure, "status": "blocked-finalized-text-binding",
            "renderExecuted": False, "renderReport": None,
            "fullPreviewPng": None, "widthPreviewPng": None,
            "reason": "Parent must bind existing finalized authoritativeText first; no fake render evidence.",
            "afterParentBindingCommand": [
                "node", ".agents/skills/ld-s10y-image/scripts/render_spec.mjs",
                "--spec", str(spec_path.parent / "spec-bound.json"),
                "--svg", str(spec_path.parent / f"{figure}-FIRST.svg"),
                "--report", str(spec_path.parent / f"{figure}-FIRST.render.json"),
                "--png", str(spec_path.parent / f"{figure}-full-FIRST.png"),
            ],
            "declaredWidthPreviewPx": 640,
        })
    save("cap2-FIRST-blocker.json", {
        "schema": "STEMROBIN-182/cap2-execution-blocker@1",
        "status": "blocked", "bindingReceipt": "binding-FIRST.json",
        "figures": plans, "generationSpend": 0, "approval": False,
    })
    save("ledger.json", {
        "ticket": "STEMROBIN-182", "checkout": str(ROOT), "ownedDirectory": str(OWN),
        "offline": True, "authorCapabilities": ["ld-s10y-image cap1"],
        "cap2": "not-run: missing finalized text binding",
        "images": {"originals": 3, "reopens": 0, "crops": 0, "previews": 0,
                   "screenshots": 0, "other": 0, "batchTotal": 3, "batchLimit": 8,
                   "contextTotal": 3, "contextLimit": 24},
        "validatorRuns": 3, "validatorRunsPerFigure": 1,
        "rendererRuns": 0, "buildContextRuns": 0,
        "contentRevisionRuns": 0, "technicalRepairRuns": 0,
        "pixelProbeRuns": 2,
        "networkCalls": 0, "generationCalls": 0, "generationSpend": 0,
        "durableWrites": 0, "templateWrites": 0, "appWrites": 0,
        "dependencyChanges": 0, "databaseCalls": 0, "publishes": 0, "commits": 0,
        "independentReview": "not-performed", "selfApproval": False,
    })
    print(json.dumps({"status": "cap1-pass-cap2-blocked", "ownedDirectory": str(OWN),
                      "specs": [str(path) for path in specs], "imagesLoaded": 3}))


if __name__ == "__main__":
    main()
