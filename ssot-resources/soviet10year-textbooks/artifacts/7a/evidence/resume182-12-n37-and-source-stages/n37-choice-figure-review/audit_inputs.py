#!/usr/bin/env python3
"""Offline, read-only mathematical and byte audit of the eight named candidates."""

import hashlib
import json
import math
from pathlib import Path
import struct
import xml.etree.ElementTree as ET


ROOT = Path("/Users/yong/.codex/worktrees/d9b1/lemmadeck")
OWNER = ROOT / ".intentfold/tickets/STEMROBIN-182/tmp/resume182-12/n37-choice-figure-review"
AUTHOR = ROOT / ".intentfold/tickets/STEMROBIN-182/tmp/resume182-12/n37-choice-author"
IDENTITY = "01a1f199-5b64-7701-ad3f-af3234bccc9e"
MODELS = {
    "fig-choice-n37-cubic-A": [(3, -1, 1), (3, 1, 1)],
    "fig-choice-n37-cubic-B": [(3, 1, 1), (3, -1, 1)],
    "fig-choice-n37-cubic-C": [(1, 1, 1), (1, -1, 1)],
    "fig-choice-n37-cubic-D": [(2, 1, 1), (2, -1, 1)],
    "fig-choice-n37-quadratic-A": [(2, -1, 1.73), (2, 1, 14.8)],
    "fig-choice-n37-quadratic-B": [(2, 1, 1), (2, -1, 1)],
    "fig-choice-n37-quadratic-C": [(2, -1, 1), (2, -1, 1)],
    "fig-choice-n37-quadratic-D": [(2, 1, 1.73), (2, -1, 14.8)],
}


def record(path):
    return {"path": str(path), "sha256": hashlib.sha256(path.read_bytes()).hexdigest()}


def close(a, b):
    if isinstance(a, (list, tuple)):
        return len(a) == len(b) and all(close(x, y) for x, y in zip(a, b))
    return math.isclose(a, b, rel_tol=1e-10, abs_tol=1e-8)


def main():
    assert Path.cwd().resolve() == ROOT
    requests_path = AUTHOR / "figure-requests.repair1.json"
    requests = json.loads(requests_path.read_text())
    assert [r["id"] for r in requests] == list(MODELS)
    seed_path = AUTHOR / "seed.json"
    seed = json.loads(seed_path.read_text())
    sources = {
        e["number"]: e["text"] for e in seed["exercises"]
        if e["number"] in ("794", "795")
    }
    audit = {
        "schema": "n37-choice-figure-input-audit@1",
        "reviewer": {"kind": "independent_agent", "identity": IDENTITY},
        "cwd": str(ROOT),
        "requests": record(requests_path),
        "seed": record(seed_path),
        "source_numbers_reviewed": list(sources),
        "image_opens_initial": 0,
        "image_opens_by_this_script": 0,
        "png_access": "Hash and IHDR dimensions only; no raster decode or visual open.",
        "scope": "Only authored-figure fidelity; no source/view/key/question/lesson gate.",
        "figures": [],
    }
    for request in requests:
        fid = request["id"]
        paths = {
            "spec": ROOT / request["spec_path"],
            "render": ROOT / request["render_path"],
            "svg": ROOT / request["svg_path"],
            "png": ROOT / request["preview_path"],
        }
        bindings = {name: record(path) for name, path in paths.items()}
        spec = json.loads(paths["spec"].read_text())
        render = json.loads(paths["render"].read_text())
        failures = []

        def check(condition, message):
            if not condition:
                failures.append(message)

        check(spec["id"] == fid and render["figure"] == fid, "Figure ID mismatch")
        check(spec["source"]["authoredBasis"] == request["basis"], "Basis mismatch")
        check(
            all(t["exercise"] == request["source_number"]
                and t["text"] == sources[t["exercise"]]
                for t in spec["source"]["authoritativeText"]),
            "Authoritative prose differs from focused seed",
        )
        check(render["status"] == "pass", "Current render is not pass")
        check(render["spec"]["sha256"] == bindings["spec"]["sha256"], "Stale spec hash")
        check(render["output"]["svg"]["sha256"] == bindings["svg"]["sha256"], "Stale SVG hash")
        check((ROOT / render["output"]["svg"]["path"]).resolve() == paths["svg"].resolve(),
              "Render names a different output")
        check(render["collisions"] == [], "Render reports collisions")
        canvas = spec["canvas"]
        check(canvas["boundingBox"] == [0, 420, 640, 0], "Unexpected canvas transform")
        header = paths["png"].read_bytes()[:24]
        check(header[:8] == b"\x89PNG\r\n\x1a\n" and header[12:16] == b"IHDR",
              "Invalid PNG header")
        dims = list(struct.unpack(">II", header[16:24]))
        check(dims == [canvas["width"], canvas["height"]], "PNG dimensions differ")
        svg = ET.parse(paths["svg"]).getroot()
        svg_objects = {e.get("id"): e for e in svg.iter() if e.get("id")}
        svg_labels = {e.get("data-label-id"): e for e in svg.iter()
                      if e.get("data-label-id")}
        objects = {o["id"]: o for o in spec["objects"]}
        assertions = {a["id"]: a for a in spec["assertions"]}
        panels = []
        for index, (power, sign, magnitude) in enumerate(MODELS[fid], 1):
            panel = f"panel-{index}"
            origin = [160 + (index - 1) * 320, 210]
            segments = [objects[f"{panel}-curve-{n}"] for n in range(64)]
            points = [segments[0]["from"]] + [s["to"] for s in segments]
            max_analytic_error = 0
            max_svg_error = 0
            for n, segment in enumerate(segments):
                sid = segment["id"]
                expected_from = [
                    origin[0] + 72 * (-1.5 + n * 3 / 64),
                    origin[1] + 40 * sign * (-1.5 + n * 3 / 64) ** power,
                ]
                expected_to = [
                    origin[0] + 72 * (-1.5 + (n + 1) * 3 / 64),
                    origin[1] + 40 * sign * (-1.5 + (n + 1) * 3 / 64) ** power,
                ]
                check(close(segment["from"], expected_from), f"{sid}: wrong start sample")
                check(close(segment["to"], expected_to), f"{sid}: wrong end sample")
                if n:
                    check(close(segments[n - 1]["to"], segment["from"]), f"{sid}: gap")
                for label, point, expected in (
                    ("start", segment["from"], expected_from),
                    ("end", segment["to"], expected_to),
                ):
                    max_analytic_error = max(max_analytic_error,
                                             *(abs(a - b) for a, b in zip(point, expected)))
                    assertion = assertions[f"{sid}-{label}-value"]
                    check(assertion["type"] == "displacement"
                          and close(assertion["from"], origin)
                          and close(assertion["to"], point)
                          and close([assertion["dx"], assertion["dy"]],
                                    [point[0] - origin[0], point[1] - origin[1]]),
                          f"{sid}: stale {label} canonical assertion")
                assertion = assertions[f"{sid}-connects"]
                check(assertion["type"] == "connects"
                      and assertion["arrow"] == sid
                      and close(assertion["from"], segment["from"])
                      and close(assertion["to"], segment["to"]),
                      f"{sid}: stale connectivity assertion")
                element = svg_objects.get(f"ld-{fid}_ld-{sid}")
                check(element is not None, f"{sid}: absent from SVG")
                if element is not None:
                    drawn = [float(element.get(k)) for k in ("x1", "y1", "x2", "y2")]
                    expected = [segment["from"][0], 420 - segment["from"][1],
                                segment["to"][0], 420 - segment["to"][1]]
                    max_svg_error = max(max_svg_error,
                                        *(abs(a - b) for a, b in zip(drawn, expected)))
                    check(close(drawn, expected), f"{sid}: SVG coordinates differ")
                    check(element.get("display") != "none"
                          and "hidden" not in element.get("style", ""),
                          f"{sid}: hidden SVG geometry")
            for axis, halfspan, tickvalue in (("x", 108, 1.5), ("y", 120, 3 * magnitude)):
                for word, direction in (("minus", -1), ("plus", 1)):
                    tick = objects[f"{panel}-{axis}-tick-{word}"]
                    midpoint = [(a + b) / 2 for a, b in zip(tick["from"], tick["to"])]
                    expected = origin.copy()
                    expected[0 if axis == "x" else 1] += direction * halfspan
                    check(close(midpoint, expected), f"{tick['id']}: misplaced tick")
                    label = objects[f"{panel}-{axis}-value-{word}"]
                    check(close(float(label["text"]), direction * tickvalue),
                          f"{label['id']}: incorrect scale label")
            title = objects[f"{panel}-y-title"]["text"]
            normalized = fid in ("fig-choice-n37-quadratic-B", "fig-choice-n37-quadratic-C")
            check(title == ("y/|a|" if normalized else "y"), f"{panel}: wrong vertical axis")
            check(objects[f"{panel}-zero"]["text"] == "Origin (0,0)",
                  f"{panel}: missing origin caption")
            check(any(close(p, origin) for p in points), f"{panel}: curve misses origin")
            inventory = next(i for i in spec["source"]["inventory"] if i["id"] == panel)
            check(all(s["id"] in inventory["objects"] for s in segments),
                  f"{panel}: incomplete curve inventory")
            check(all(f"{s['id']}-{suffix}" in inventory["assertions"]
                      for s in segments for suffix in ("connects", "start-value", "end-value")),
                  f"{panel}: incomplete curve assertion mapping")
            canonical = []
            for x in (-1.5, -1, 0, 1, 1.5):
                cx = origin[0] + 72 * x
                segment = next(s for s in segments
                               if s["from"][0] - 1e-8 <= cx <= s["to"][0] + 1e-8)
                fraction = (cx - segment["from"][0]) / (segment["to"][0] - segment["from"][0])
                cy = segment["from"][1] + fraction * (segment["to"][1] - segment["from"][1])
                canonical.append({
                    "x": x, "analytic_y": magnitude * sign * x ** power,
                    "drawn_interpolated_y": (cy - origin[1]) * magnitude / 40,
                    "interpolation_error_canvas_px": abs(cy - (origin[1] + 40 * sign * x ** power)),
                    "svg_screen_xy": [cx, 420 - cy],
                })
            panels.append({
                "id": panel, "heading": objects[f"{panel}-heading"]["text"],
                "independent_drawn_model": {"power": power, "sign": sign, "magnitude": magnitude},
                "origin_spec": origin, "origin_screen": [origin[0], 420 - origin[1]],
                "x_canvas_units_per_unit": 72, "vertical_canvas_units_per_y_unit": 40 / magnitude,
                "vertical_axis_title": title, "normalized_parameter_axis": normalized,
                "segments": 64, "unique_sample_nodes": 65,
                "sample_x_step": 3 / 64,
                "max_analytic_sample_error_canvas_px": max_analytic_error,
                "max_svg_endpoint_error_canvas_px": max_svg_error,
                "canonical_values": canonical,
                "curve_screen_bounds": [
                    min(p[0] for p in points), min(420 - p[1] for p in points),
                    max(p[0] for p in points), max(420 - p[1] for p in points),
                ],
                "finite_plot_window": [-1.5, 1.5],
                "domain_interpretation": "A sampled viewing window, not a domain restriction.",
            })
        labels = []
        for obj in spec["objects"]:
            if obj["type"] != "text":
                continue
            element = svg_labels.get(obj["id"] + "-label")
            check(element is not None, f"{obj['id']}: missing SVG label")
            if element is None:
                continue
            text = "".join(element.itertext())
            font = float(element.get("font-size"))
            check(text == obj["text"], f"{obj['id']}: SVG label text differs")
            check(close(font, obj["fontSize"]), f"{obj['id']}: SVG font differs")
            check(close([float(element.get("x")), float(element.get("y"))],
                        [obj["at"][0], 420 - obj["at"][1]]),
                  f"{obj['id']}: SVG label position differs")
            labels.append({"object": obj["id"], "text": text, "font_px": font,
                           "screen_xy": [float(element.get("x")), float(element.get("y"))]})
        display = spec["display"]
        check(display == {"layout": "scroll", "purpose": "instructional",
                          "minTextPx": 16, "widths": [640]}, "Unexpected display configuration")
        check(len(labels) == 16 and min(l["font_px"] for l in labels) >= 16,
              "Missing or undersized labels")
        check(all(d["status"] == "pass" and d["width"] == 640
                  and d["measuredMinPx"] >= display["minTextPx"]
                  and d["failures"] == [] for d in render["displayChecks"]),
              "Invalid current display evidence")
        audit["figures"].append({
            "figure_id": fid, "source_number": request["source_number"],
            "authored_basis": request["basis"], "bindings": bindings,
            "literal_figure_png_exists": (paths["png"].parent / "figure.png").exists(),
            "resolved_final_png": str(paths["png"]), "png_dimensions": dims,
            "render_status": render["status"], "display": display,
            "display_checks": render["displayChecks"],
            "panels": panels, "labels": labels, "failures": failures,
        })
    target = OWNER / "input-audit.json"
    assert not target.exists(), "Do not replace existing audit evidence"
    target.write_text(json.dumps(audit, indent=2, ensure_ascii=True) + "\n")
    for figure in audit["figures"]:
        print(figure["figure_id"], "PASS" if not figure["failures"] else "REVISE",
              "svg=" + figure["bindings"]["svg"]["sha256"],
              "png=" + figure["bindings"]["png"]["sha256"],
              "failures=" + str(figure["failures"]))


if __name__ == "__main__":
    main()
