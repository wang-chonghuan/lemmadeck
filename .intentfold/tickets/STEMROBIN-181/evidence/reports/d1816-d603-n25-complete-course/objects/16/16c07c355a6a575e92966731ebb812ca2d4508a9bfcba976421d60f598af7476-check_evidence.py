"""Read-only, hash-bound checks for the independent N25 semantic gate."""

import hashlib
import json
import math
from pathlib import Path
import re
import xml.etree.ElementTree as ET


ROOT = Path("/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck")
TICKET = ROOT / ".intentfold/tickets/STEMROBIN-181/tmp"
AUTHOR = TICKET / "d1816-d591-n25-bilingual-author"
FIGURES = TICKET / "d1816-d593-n25-figures-first"
REVIEW = TICKET / "d1816-d596-n25-first-review"
SOURCE = ROOT / ".tmp/STEMROBIN-181/d1816-d590/root/10p"


def document(path):
    return json.loads(path.read_text())


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def screen(point, height):
    return [point[0], height - point[1]]


def straight_path_samples(path):
    # These two current candidates contain only explicit absolute M/L samples.
    pattern = r"[ML]\s+(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)"
    assert not re.sub(pattern, "", path).strip()
    return [(float(x), float(y)) for x, y in re.findall(pattern, path)]


def interpolate(samples, x):
    for left, right in zip(samples, samples[1:]):
        if left[0] <= x <= right[0]:
            return left[1] + (right[1] - left[1]) * (
                (x - left[0]) / (right[0] - left[0])
            )
    raise AssertionError(f"Requested x={x} outside the actual curve extent")


raw_lesson_path = SOURCE / "lessons/phy10-c1-s3-n25/lesson.json"
raw_exercises_path = SOURCE / "lessons/phy10-c1-s3-n25/exercises.json"
raw_lesson = document(raw_lesson_path)
raw_exercises = document(raw_exercises_path)
page69 = document(SOURCE / "pages/0069/page.json")
assert len(raw_lesson["prose"]) == 23
assert raw_lesson["prose"][-1]["source_refs"] == ["p0069#8"]
assert page69["blocks"][8]["kind"] == "h3"
assert page69["blocks"][8]["lines"][0].startswith("26. ")
assert page69["blocks"][9]["open"] is True
assert raw_exercises["count"] == 0 and raw_exercises["exercises"] == []

source_inventory = document(REVIEW / "independent-source-inventory.json")
freeze = document(AUTHOR / "author-freeze.json")
for binding in freeze["bindings"]:
    assert sha(ROOT / binding["path"]) == binding["sha256"]

text_results = {}
lessons = {}
for locale in ("zh", "en"):
    lesson_path = AUTHOR / locale / "lesson.template.json"
    exercise_path = AUTHOR / locale / "exercises.template.json"
    lesson = document(lesson_path)
    exercises = document(exercise_path)
    lessons[locale] = lesson
    assert lesson["source"]["sha256"] == sha(raw_lesson_path)
    assert lesson["source"]["data"] == raw_lesson
    assert exercises["source"]["sha256"] == sha(raw_exercises_path)
    assert exercises["source"]["data"] == raw_exercises
    assert len(lesson["prose"]) == len(raw_lesson["prose"])
    assert lesson["exercise_count"] == exercises["count"] == 0
    assert exercises["exercises"] == []
    identity = ("kind", "id", "label", "printed_page", "source_refs")
    missing_notation = []
    for index, (original, modern) in enumerate(
        zip(raw_lesson["prose"], lesson["prose"])
    ):
        assert modern["source_text"] == original["text"]
        for field in identity:
            assert modern.get(field) == original.get(field)
        if r"\mathrm{m}" in modern["text"] and "notation" not in modern["changes"]:
            missing_notation.append({
                "prose_index_zero_based": index,
                "source_refs": modern["source_refs"],
                "modern_m_occurrences": modern["text"].count(r"\mathrm{m}"),
                "changes": modern["changes"],
            })
    text_results[locale] = {
        "lesson_sha256": sha(lesson_path),
        "exercises_sha256": sha(exercise_path),
        "source_snapshot_and_block_identity": "pass",
        "source_blocks": len(lesson["prose"]),
        "original_tasks": 0,
        "missing_notation_declarations": missing_notation,
    }

recovery_path = FIGURES / "preview-recovery.json"
recovery = document(recovery_path)
assert recovery["status"] == "pass" and recovery["svgRerendered"] is False
specs = {}
figure_results = {}
svg_namespace = "{http://www.w3.org/2000/svg}"
for identifier in ("fig-40", "fig-41", "fig-42"):
    spec_path = FIGURES / f"{identifier}.spec.json"
    render_path = FIGURES / f"{identifier}.render.json"
    svg_path = FIGURES / f"{identifier}.svg"
    preview_path = FIGURES / f"{identifier}.preview.png"
    spec = document(spec_path)
    render = document(render_path)
    specs[identifier] = spec
    assert render["status"] == "pass"
    assert render["spec"]["sha256"] == sha(spec_path)
    assert render["output"]["svg"]["sha256"] == sha(svg_path)
    assert spec["source"]["image"]["sha256"] == sha(
        ROOT / spec["source"]["image"]["path"]
    )
    assert spec["source"]["image"]["sha256"] == (
        source_inventory["figures"][identifier]["source_sha256"]
    )
    record = next(item for item in recovery["records"] if item["id"] == identifier)
    assert record["svgSHA"] == sha(svg_path)
    assert record["sha256"] == sha(preview_path)
    for locale in ("zh", "en"):
        authoritative = next(
            item for item in spec["source"]["authoritativeText"]
            if item["lesson"] == f"phy10-c1-s3-n25:{locale}"
        )
        assert authoritative["text"] == "\n\n".join(
            block["text"] for block in lessons[locale]["prose"] if block["text"]
        )
    object_ids = {item["id"] for item in spec["objects"]}
    assertion_ids = {item["id"] for item in spec["assertions"]}
    for group in spec["source"]["inventory"]:
        assert set(group["objects"]) <= object_ids
        assert set(group["assertions"]) <= assertion_ids
    tree = ET.parse(svg_path)
    svg_paths = list(tree.iter(f"{svg_namespace}path"))
    path_bindings = []
    for obj in spec["objects"]:
        if obj["type"] == "svgPath":
            matched = [element for element in svg_paths if element.get("d") == obj["d"]]
            assert len(matched) == 1
            actual = matched[0]
            assert float(actual.get("stroke-width").removesuffix("px")) == obj["strokeWidth"]
            assert "var(--ld-figure-ink" in actual.get("stroke", "")
            path_bindings.append({
                "object": obj["id"],
                "path_matches_spec": True,
                "stroke_width": obj["strokeWidth"],
                "solid": actual.get("stroke-dasharray") in (None, "", "none"),
            })
        if obj["type"] == "text":
            matched = [
                element for element in tree.iter(f"{svg_namespace}text")
                if element.get("data-label-id") == f"{obj['id']}-label"
            ]
            assert len(matched) == 1
            assert "".join(matched[0].itertext()) == obj["text"]
    figure_results[identifier] = {
        "hashes": {
            "source_png": spec["source"]["image"]["sha256"],
            "spec": sha(spec_path),
            "render": sha(render_path),
            "svg": sha(svg_path),
            "browser_preview_png": sha(preview_path),
        },
        "native_status": render["status"],
        "source_spec_render_svg_preview_bindings": "pass",
        "complete_current_authoritative_text": "pass",
        "inventory_id_resolution": "pass",
        "display_checks": render["displayChecks"],
        "svg_path_bindings": path_bindings,
        "native_assertion_types": sorted({item["type"] for item in spec["assertions"]}),
    }

objects40 = {obj["id"]: obj for obj in specs["fig-40"]["objects"]}
objects41 = {obj["id"]: obj for obj in specs["fig-41"]["objects"]}
assert sum(obj["type"] == "circle" for obj in objects40.values()) == 11
assert sum(name.startswith("external-terminal-") for name in objects40) == 4
assert sum(name.startswith("switch-contact-") for name in objects40) == 6
assert objects40["lamp-left-wire-1"]["to"] == [427, 175]
assert objects40["lamp-right-wire-1"]["from"] == [473, 175]
assert objects40["lamp-ring"]["center"] == [450, 175]
assert objects40["lamp-ring"]["radius"] == 23
assert objects40["coil"]["d"].startswith("M 563 185 ")
assert objects40["coil"]["d"].endswith("563 305")
assert screen(objects40["lamp-right-wire-1"]["to"], 360) == [563, 185]
assert screen(objects40["return-wire-3"]["to"], 360) == [563, 305]
for side in ("left", "right"):
    blade = objects40[f"{side}-switch-blade"]
    assert blade["from"][0] == blade["to"][0]
for position in ("upper", "lower"):
    coupling = objects40[f"mechanical-coupling-{position}"]
    assert coupling["dash"] == 2
    assert coupling["from"][0] == objects40["left-switch-blade"]["from"][0]
    assert coupling["to"][0] == objects40["right-switch-blade"]["from"][0]
assert objects41["coil"]["d"].startswith("M 75 75 ")
assert objects41["coil"]["d"].endswith("75 255")
assert screen(objects41["upper-wire-1"]["from"], 360) == [75, 75]
assert screen(objects41["lower-wire-1"]["from"], 360) == [75, 255]
assert objects41["upper-terminal"]["center"] != objects41["lower-terminal"]["center"]
figure_results["fig-40"]["independent_series_and_coupling_checks"] = "pass"
figure_results["fig-41"]["independent_coil_endpoint_and_terminal_checks"] = "pass"

objects42 = {obj["id"]: obj for obj in specs["fig-42"]["objects"]}
samples = {
    name: straight_path_samples(objects42[f"{name}-curve"]["d"])
    for name in ("current", "voltage")
}
baseline = screen(objects42["time-axis"]["from"], 360)[1]
assert baseline == 185
harmonic = {
    "current": lambda x: baseline - 60 * math.cos(2 * math.pi * (x - 90) / 440),
    "voltage": lambda x: baseline + 115 * math.sin(2 * math.pi * (x - 90) / 440),
}
for name in ("current", "voltage"):
    error = max(abs(y - harmonic[name](x)) for x, y in samples[name])
    assert error < 0.00002
    leader_end = screen(objects42[f"{name}-leader"]["to"], 360)
    assert abs(interpolate(samples[name], leader_end[0]) - leader_end[1]) < 0.01
quarter_samples = []
for fraction in (0, 0.25, 0.5, 0.75, 1):
    x = 90 + fraction * 440
    current = (baseline - interpolate(samples["current"], x)) / 60
    voltage = (baseline - interpolate(samples["voltage"], x)) / 115
    assert abs(current - math.cos(2 * math.pi * fraction)) < 0.0001
    assert abs(voltage + math.sin(2 * math.pi * fraction)) < 0.0001
    quarter_samples.append({
        "cycle_fraction": fraction,
        "x_px": x,
        "normalized_current": round(current, 6),
        "normalized_voltage": round(voltage, 6),
    })
assert samples["current"][-1][0] > samples["voltage"][-1][0]
assert samples["current"][-1][1] < baseline < samples["voltage"][-1][1]
assert samples["current"][-1][1] > samples["current"][-2][1]
assert samples["voltage"][-1][1] > samples["voltage"][-2][1]
figure_results["fig-42"]["independent_phase_label_endpoint_checks"] = {
    "status": "pass",
    "quarter_cycle_samples": quarter_samples,
    "current_endpoint_px": samples["current"][-1],
    "voltage_endpoint_px": samples["voltage"][-1],
    "both_end_descending": True,
    "leaders_hit_the_correct_curves": True,
    "source_weight_distinction_omitted": (
        objects42["current-curve"]["strokeWidth"] ==
        objects42["voltage-curve"]["strokeWidth"]
    ),
    "phase_not_covered_by_native_assertions": True,
    "supplement": "The assertions in this hash-bound read-only check verify the actual path samples, not an unattached ideal formula.",
}

for theta in (0, 0.31, math.pi / 2, math.pi, 3 * math.pi / 2, 2 * math.pi):
    inductance, omega, amplitude = 3, 5, 2
    derivative = -amplitude * omega * math.sin(theta)
    emf = -inductance * derivative
    voltage = -emf
    assert abs(voltage - inductance * omega * amplitude * math.cos(theta + math.pi / 2)) < 1e-12

print(json.dumps({
    "status": "observations-verified-not-a-promotion",
    "source_boundary": {
        "last_included": "p0069#8",
        "first_excluded": "p0069#9",
        "first_excluded_heading": page69["blocks"][8]["lines"][0],
        "original_tasks": 0,
    },
    "text": text_results,
    "figures": figure_results,
    "english_scientific_derivation_numeric_sanity": "pass",
    "preview_recovery_sha256": sha(recovery_path),
    "independent_source_inventory_sha256": sha(REVIEW / "independent-source-inventory.json"),
    "check_code_sha256": sha(Path(__file__)),
    "images_loaded_by_this_check": 0,
    "candidate_writes": 0,
}, indent=2))
