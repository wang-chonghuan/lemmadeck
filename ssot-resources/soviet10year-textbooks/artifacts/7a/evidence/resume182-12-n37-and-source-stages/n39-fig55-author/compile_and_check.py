#!/usr/bin/env python3
"""Mechanically compile the sampled curve and check draft geometry, not render."""

import argparse
import hashlib
import json
import math
import subprocess
import sys
from pathlib import Path


ROOT = Path("/Users/yong/.codex/worktrees/d9b1/lemmadeck")
OWNED = Path(__file__).resolve().parent


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def load(path):
    return json.loads(path.read_text(encoding="utf-8"))


def lerp_calibration(value, pairs):
    for (a, b), (c, d) in zip(pairs, pairs[1:]):
        if a <= value <= c:
            return b + (d - b) * (value - a) / (c - a)
    raise ValueError(f"Calibration outside range: {value}")


def tangents(samples):
    h = [b[0] - a[0] for a, b in zip(samples, samples[1:])]
    delta = [(b[1] - a[1]) / width
             for a, b, width in zip(samples, samples[1:], h)]

    def end_tangent(h0, h1, d0, d1):
        value = ((2 * h0 + h1) * d0 - h0 * d1) / (h0 + h1)
        if value * d0 <= 0:
            return 0
        if d0 * d1 < 0 and abs(value) > 3 * abs(d0):
            return 3 * d0
        return value

    result = [end_tangent(h[0], h[1], delta[0], delta[1])]
    for i in range(1, len(samples) - 1):
        if delta[i - 1] * delta[i] <= 0:
            result.append(0)
        else:
            w1 = 2 * h[i] + h[i - 1]
            w2 = h[i] + 2 * h[i - 1]
            result.append((w1 + w2) /
                          (w1 / delta[i - 1] + w2 / delta[i]))
    result.append(end_tangent(h[-1], h[-2], delta[-1], delta[-2]))
    return result


def bezier(controls, t):
    return sum(weight * value for weight, value in zip(
        ((1 - t) ** 3, 3 * (1 - t) ** 2 * t,
         3 * (1 - t) * t ** 2, t ** 3), controls))


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--compile", action="store_true")
    args = parser.parse_args()
    if Path.cwd() != ROOT or not OWNED.is_relative_to(ROOT):
        raise SystemExit("Wrong cwd or ownership root")

    path = OWNED / "spec-draft.json"
    spec = load(path)
    inventory = load(OWNED / "source-inventory.json")
    context = load(OWNED / "context-FIRST.json")
    curve = next(obj for obj in spec["objects"] if obj["id"] == "source-curve")
    sample_records = curve["geometryProvenance"]["samples"]
    samples = [record["at"] for record in sample_records]
    if not all(a[0] < b[0] for a, b in zip(samples, samples[1:])):
        raise SystemExit("Samples must have increasing x")
    slopes = tangents(samples)
    segments = []
    for i, (a, b) in enumerate(zip(samples, samples[1:])):
        step = (b[0] - a[0]) / 3
        segments.append([
            a,
            [a[0] + step, a[1] + step * slopes[i]],
            [b[0] - step, b[1] - step * slopes[i + 1]],
            b,
        ])
    xmin, ymax, xmax, ymin = spec["canvas"]["boundingBox"]

    def screen(p):
        return [p[0] - xmin, ymax - p[1]]

    def numbers(values):
        return " ".join(format(value, ".10g") for value in values)

    commands = ["M " + numbers(screen(samples[0]))]
    commands.extend("C " + numbers([
        value for point in segment[1:] for value in screen(point)
    ]) for segment in segments)
    compiled = " ".join(commands)
    if args.compile:
        curve["d"] = compiled
        path.write_text(json.dumps(spec, ensure_ascii=False, indent=2) + "\n",
                        encoding="utf-8")

    checks = []

    def check(identifier, condition, detail):
        checks.append({"id": identifier, "pass": bool(condition), "detail": detail})

    check("path-is-compiled", curve["d"] == compiled,
          "Actual svgPath.d must equal the deterministic samples-to-cubic transform")
    check("current-source-hash",
          digest(Path(spec["source"]["image"]["path"])) ==
          spec["source"]["image"]["sha256"] == inventory["source"]["sha256"],
          "Source bytes are unchanged and all source hash references agree")
    text_source = context["provisionalTextSource"]
    template_path = Path(text_source["path"])
    lesson_path = Path(text_source["lessonTemplatePath"])
    text_items = load(template_path)["exercises"]
    relevant = [item for item in text_items
                if "fig-55" in item.get("figure_refs", [])]
    check("full-frozen-text",
          digest(template_path) == text_source["sha256AtRead"] ==
          curve["geometryProvenance"]["frozenExerciseTemplateSha256"]
          and digest(lesson_path) == text_source["lessonTemplateSha256"] ==
          curve["geometryProvenance"]["frozenLessonTemplateSha256"]
          and len(relevant) == 1 and str(relevant[0]["number"]) == "819"
          and spec["source"]["authoritativeText"][0]["text"] == relevant[0]["text"]
          and context["lessons"][0]["exercises"][0]["text"] == relevant[0]["text"],
          "Complete frozen 819 text and both template hashes match; edition binding still pending")
    objects = {obj["id"]: obj for obj in spec["objects"]}
    witnesses = {
        "construction-left": samples[0],
        "construction-maximum": [-2, 2],
        "construction-minimum": [2, -1],
        "construction-right": samples[-1],
    }
    check("path-witness-binding", all(
        objects[key]["at"] == value and value in samples
        for key, value in witnesses.items()),
        "Hidden witnesses are actual path knots, not detached surrogate checks")
    check("path-finite-domain", samples[0][0] == -6 and samples[-1][0] == 8
          and all(-6 <= point[0] <= 8 for s in segments for point in s),
          "No extension past text-specified finite endpoints [-6,8]")
    features = inventory["features"]
    for name, point in (("leftEndpoint", samples[0]),
                        ("rightEndpoint", samples[-1])):
        lo, hi = features[name]["yReadRange"]
        check(f"path-{name}-reading", lo <= point[1] <= hi,
              {"representative": point, "ordinateRange": [lo, hi]})

    monotonic = []
    zero_readings = []
    controls_inside = True
    for segment in segments:
        y = [point[1] for point in segment]
        a = -y[0] + 3 * y[1] - 3 * y[2] + y[3]
        b = 3 * y[0] - 6 * y[1] + 3 * y[2]
        c = -3 * y[0] + 3 * y[1]
        derivative_locations = [0, 1]
        if abs(a) > 1e-12 and 0 < -b / (3 * a) < 1:
            derivative_locations.append(-b / (3 * a))
        derivative_values = [
            3 * a * t * t + 2 * b * t + c for t in derivative_locations
        ]
        sign = 1 if y[-1] > y[0] else -1
        monotonic.append(all(sign * value >= -1e-9
                             for value in derivative_values))
        controls_inside &= all(
            xmin <= point[0] <= xmax and ymin <= point[1] <= ymax
            for point in segment
        )
        if y[0] * y[-1] < 0:
            lo, hi = 0, 1
            for _ in range(60):
                mid = (lo + hi) / 2
                value = bezier(y, mid)
                if (value > 0) == (y[0] > 0):
                    lo = mid
                else:
                    hi = mid
            zero_readings.append(bezier([point[0] for point in segment],
                                        (lo + hi) / 2))
    check("path-segment-monotonicity", all(monotonic),
          "Analytic quadratic-derivative sign check on every cubic, not screenshot inference")
    slope_signs = [1 if b[1] > a[1] else -1
                   for a, b in zip(samples, samples[1:])]
    turns = [samples[i] for i in range(1, len(samples) - 1)
             if slope_signs[i - 1] != slope_signs[i]]
    extrema_ok = len(turns) == 2
    for name, point in zip(("maximum", "minimum"), turns):
        f = features[name]
        extrema_ok &= (f["xReadRange"][0] <= point[0] <= f["xReadRange"][1]
                       and f["yReadRange"][0] <= point[1] <= f["yReadRange"][1])
    check("path-extrema-reading", extrema_ok and all(monotonic),
          {"pathExtremaRepresentatives": turns,
           "note": "Two direction changes only; positions lie in source reading neighborhoods"})
    ranges = [features[name]["xReadRange"]
              for name in ("zeroLeft", "zeroMiddle", "zeroRight")]
    check("path-query-crossings", len(zero_readings) == 3 and all(
        lo <= value <= hi for value, (lo, hi) in zip(zero_readings, ranges)),
        {"constructionOnlyCrossings": zero_readings, "sourceReadingRanges": ranges,
         "warning": "Computed interpolation crossings are NOT exact source givens or answers"})
    check("path-fits-canvas", controls_inside,
          "All cubic control hulls fit the mathematical canvas; pixel clipping awaits render")

    pixel_deltas = []
    calibration = inventory["calibration"]
    inverse_x = [[pixel, unit] for unit, pixel
                 in calibration["localIntegerXCentersNearCurve"]]
    for record in sample_records:
        if "sourcePixel" not in record:
            continue
        px, py = record["sourcePixel"]
        read_x = lerp_calibration(px, inverse_x)
        y0 = lerp_calibration(px, [[25, 265.5], [428, 263], [900, 258]])
        y3 = lerp_calibration(px, [[25, 82.5], [428, 83], [900, 76]])
        yminus1 = lerp_calibration(px, [[25, 327.5], [428, 323], [900, 317]])
        read_y = ((y0 - py) * 3 / (y0 - y3) if py <= y0
                  else (y0 - py) / (yminus1 - y0))
        delta = [record["at"][0] - read_x, record["at"][1] - read_y]
        pixel_deltas.append({"pixel": record["sourcePixel"],
                             "sample": record["at"],
                             "approximateLocalRead": [read_x, read_y],
                             "delta": delta})
    check("path-sample-pixel-calibration", all(
        max(abs(value) for value in item["delta"]) <= 0.15
        for item in pixel_deltas),
        {"maxCoordinateDeviation": max(
            abs(value) for item in pixel_deltas for value in item["delta"]),
         "tolerance": 0.15,
         "note": "Approximate local grid calibration, not precision beyond the raster"})

    xlabels = [(tick["at"], tick["label"]) for tick in objects["source-x-axis"]["ticks"]]
    expected_x = [-6, -5, -4, -3, -2, -1, 2, 3, 4, 5, 6, 7, 8]
    check("source-scale-labels",
          xlabels == [([value, 0], str(value)) for value in expected_x]
          and [(tick["at"], tick["label"]) for tick in objects["source-y-axis"]["ticks"]]
          == [([0, 2], "2"), ([0, 3], "3")],
          "Preserve source visible integer labels, without inserting x=1 or crossing labels")
    point_objects = [obj for obj in spec["objects"] if obj["type"] == "point"]
    text_objects = [obj for obj in spec["objects"] if obj["type"] == "text"]
    check("no-extra-markings",
          len(point_objects) == 4
          and all(obj.get("visible") is False and not obj.get("label")
                  for obj in point_objects)
          and {obj["text"] for obj in text_objects} == {"0", "x", "y"}
          and curve.get("dash", 0) == 0 and "fill" not in curve
          and len([obj for obj in spec["objects"] if obj["type"] == "svgPath"]) == 1,
          "No visible points, curve dash/fill, legend, sign shading, or answer labels")
    scaled_fonts = [(obj["id"], obj["fontSize"] * 640 / spec["canvas"]["width"])
                    for obj in spec["objects"] if "fontSize" in obj]
    check("display-minimum-text",
          spec["display"] == {"layout": "scroll", "purpose": "instructional",
                              "minTextPx": 16, "widths": [640]}
          and all(size >= 16 for _, size in scaled_fonts),
          {"computedCssTextPxAt640": scaled_fonts,
           "note": "Nominal sizing only; collisions, clipping, and actual product sizing await parent render"})

    result = subprocess.run(
        [sys.executable, str(ROOT / ".agents/skills/ld-s10y-image/scripts/validate_spec.py"),
         str(path), "--stage", "draft", "--json"],
        cwd=ROOT, text=True, capture_output=True, check=False,
    )
    check("standard-draft-validation", result.returncode == 0,
          json.loads(result.stdout) if result.stdout else result.stderr)
    (OWNED / "spec-validation-draft.json").write_text(result.stdout, encoding="utf-8")
    report = {
        "schema": "ld-s10y-image/cap1-draft-check@1",
        "status": "pass" if all(item["pass"] for item in checks) else "fail",
        "scope": "Offline source-bound draft geometry only; no render or semantic approval",
        "semanticApproval": False,
        "imagesLoaded": 1,
        "renders": 0,
        "sourceSha256": inventory["source"]["sha256"],
        "specSha256": digest(path),
        "inventorySha256": digest(OWNED / "source-inventory.json"),
        "contextSha256": digest(OWNED / "context-FIRST.json"),
        "checks": checks,
        "samplePixelCalibration": pixel_deltas,
        "pending": ["Parent finalized-edition text binding before FIRST render",
                    "Parent cap2 FIRST render", "Independent parent cap4"],
    }
    (OWNED / "draft-check.json").write_text(
        json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({key: report[key]
                      for key in ("status", "scope", "specSha256", "imagesLoaded")},
                     indent=2))
    failed = [item["id"] for item in checks if not item["pass"]]
    if failed:
        print("Failed: " + ", ".join(failed), file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
