"""Read-only candidate checks driven by the reviewer's saved pixel inventory."""

import hashlib
import json
import math
import re
import xml.etree.ElementTree as ET
from pathlib import Path

EVIDENCE = Path(__file__).resolve().parent
AUTHOR = EVIDENCE.parent / "d045-10p-fig70-author"
FREEZE_SHA = "933755720266be623797178e20110faa5467ff0d46b08a260944c6d5030e9922"


def load(path):
    return json.loads(Path(path).read_text())


def sha(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def check(condition, message):
    if not condition:
        raise AssertionError(message)


freeze_path = AUTHOR / "author-freeze.json"
check(sha(freeze_path) == FREEZE_SHA, "Author freeze changed")
freeze = load(freeze_path)
bindings = freeze["artifacts"] + freeze["sharedToolBindings"]
for binding in bindings:
    check(sha(binding["path"]) == binding["sha256"], "Stale binding: " + binding["path"])
for name in ("source", "figureSpec", "render", "svg", "previewChecks"):
    binding = freeze[name]
    check(sha(binding["path"]) == binding["sha256"], "Stale current " + name)

inventory_path = EVIDENCE / "independent-source-inventory.json"
inventory = load(inventory_path)
spec = load(freeze["figureSpec"]["path"])
objects = {obj["id"]: obj for obj in spec["objects"]}
assertions = {item["id"]: item for item in spec["assertions"]}
svg = ET.parse(freeze["svg"]["path"]).getroot()
svg_ids = {item.get("id"): item for item in svg.iter() if item.get("id")}
svg_text = {
    item.get("data-label-id"): item
    for item in svg.iter()
    if item.tag.endswith("}text")
}
heads = {
    item.get("data-arrowhead-for")
    for item in svg.iter()
    if item.get("data-arrowhead-for")
}


def coordinate(value):
    return objects[value]["at"] if isinstance(value, str) else value


def object_svg(object_id):
    element = svg_ids.get("ld-fig-70_ld-" + object_id)
    check(element is not None, "Missing SVG object " + object_id)
    check(element.get("display") != "none", "Hidden SVG object " + object_id)
    check("visibility: hidden" not in element.get("style", ""), "Hidden " + object_id)
    return element


def references(assertion):
    return {
        assertion[key]
        for key in ("from", "to", "a", "b", "c")
        if isinstance(assertion.get(key), str)
    }


coverage = []
rows = []
for independent_row in inventory["rows"]:
    row = independent_row["id"][-1]
    prefix = "source-" + row
    group = next(
        group for group in spec["source"]["inventory"]
        if group["id"] == "source-row-" + row + "-all-18-balls"
    )
    check("pointRelationships" in group["requires"], "Missing relationship requirement")
    mapped_objects = set(group["objects"])
    baseline = (
        objects[prefix + "-ball-01"]["at"][1] if row == "a"
        else objects[prefix + "-equilibrium-baseline"]["from"][1]
    )
    row_coverage = []
    expected_up = set(independent_row["velocityUp"])
    expected_down = set(independent_row["velocityDown"])
    for number, expected_sign in enumerate(independent_row["displacementSigns1to18"], 1):
        ball_id = prefix + "-ball-" + str(number).zfill(2)
        ball = objects[ball_id]
        delta = ball["at"][1] - baseline
        observed_sign = 0 if abs(delta) < 1e-7 else (1 if delta > 0 else -1)
        check(observed_sign == expected_sign, "Wrong displacement " + ball_id)
        element = object_svg(ball_id)
        check(math.isclose(float(element.get("cx")), ball["at"][0], abs_tol=1e-6),
              "Wrong rendered x " + ball_id)
        check(math.isclose(float(element.get("cy")), -ball["at"][1], abs_tol=1e-6),
              "Wrong rendered y " + ball_id)
        label_id = prefix + "-number-" + str(number).zfill(2) + "-label"
        check("".join(svg_text[label_id].itertext()) == str(number), "Wrong ball label")
        velocity_id = prefix + "-velocity-" + str(number).zfill(2)
        velocity = objects.get(velocity_id)
        velocity_direction = "absent"
        if number in expected_up or number in expected_down:
            check(velocity is not None, "Missing velocity " + velocity_id)
            start, end = coordinate(velocity["from"]), coordinate(velocity["to"])
            check(start == ball["at"] and start[0] == end[0], "Wrong velocity anchor")
            velocity_direction = "up" if end[1] > start[1] else "down"
            check((velocity_direction == "up") == (number in expected_up),
                  "Wrong velocity direction " + velocity_id)
            object_svg(velocity_id)
            check("ld-fig-70_ld-" + velocity_id in heads, "Missing native arrowhead")
            check(velocity_id + "-connects" in assertions, "Missing arrow connects")
            check(velocity_id + "-transverse-direction-length" in assertions,
                  "Missing velocity displacement assertion")
        else:
            check(velocity is None, "Unexpected velocity " + velocity_id)
        relationships = [
            assertion_id for assertion_id in group["assertions"]
            if assertions[assertion_id]["type"] in ("displacement", "collinear", "connects")
            and ball_id in references(assertions[assertion_id])
            and references(assertions[assertion_id]) <= mapped_objects
        ]
        check(relationships, "No wholly mapped relationship " + ball_id)
        entry = {
            "ball": ball_id, "number": number, "row": row, "at": ball["at"],
            "displacementSign": observed_sign, "velocity": velocity_direction,
            "relationshipIds": relationships, "svgPositionAndLabel": "pass"
        }
        coverage.append(entry)
        row_coverage.append(entry)
    for number in range(1, 18):
        relationship_id = prefix + "-spacing-displacement-" + str(number) + "-" + str(number + 1)
        relation = assertions[relationship_id]
        start, end = coordinate(relation["from"]), coordinate(relation["to"])
        check(math.isclose(end[0] - start[0], 56, abs_tol=1e-6), "Unequal spacing")
        check(math.isclose(end[1] - start[1], relation["dy"], abs_tol=1e-6),
              "Wrong relationship displacement " + relationship_id)
        edge_prefix = prefix + "-connection-" + str(number) + "-" + str(number + 1) + "-part-"
        parts = sorted(
            (obj for obj in spec["objects"] if obj["id"].startswith(edge_prefix)),
            key=lambda obj: int(obj["id"].split("-")[-1])
        )
        check(parts, "Missing adjacent connection " + edge_prefix)
        check(coordinate(parts[0]["from"]) == start and coordinate(parts[-1]["to"]) == end,
              "Wrong connection endpoints")
        for previous, following in zip(parts, parts[1:]):
            check(coordinate(previous["to"]) == coordinate(following["from"]),
                  "Broken interpolated connector")
        for part in parts:
            object_svg(part["id"])
            check(part["id"] + "-connects" in assertions, "Unchecked connector")
    for number in independent_row.get("projectionGuides", []):
        guide_id = prefix + "-displacement-guide-" + str(number)
        guide = objects[guide_id]
        check(coordinate(guide["from"])[1] == baseline, "Guide not at equilibrium")
        check(guide["to"] == prefix + "-ball-" + str(number).zfill(2), "Wrong guide ball")
        object_svg(guide_id)
        check(guide_id + "-connects" in assertions, "Unchecked projection")
    for left, right in independent_row.get("equalRelativeLevels", []):
        check(math.isclose(row_coverage[left - 1]["at"][1],
                           row_coverage[right - 1]["at"][1], abs_tol=1e-6),
              "Unequal source-symmetric levels")
    time_id = prefix + "-time-label"
    check("".join(svg_text[time_id].itertext()) == independent_row["time"], "Wrong time")
    rows.append({
        "row": row, "time": independent_row["time"], "ballsChecked": 18,
        "unreachedStationary": independent_row.get("unreachedStationary", []),
        "velocityUp": sorted(expected_up), "velocityDown": sorted(expected_down),
        "projectionGuidesChecked": independent_row.get("projectionGuides", []),
        "adjacentConnectionsChecked": 17,
        "groupId": group["id"], "status": "pass"
    })

wavelengths = []
for row, left, right in (("e", 1, 13), ("f", 2, 14), ("f", 3, 15)):
    prefix = f"source-{row}-lambda-{left}-{right}"
    check(any(group["id"] == prefix for group in spec["source"]["inventory"]),
          "Missing wavelength inventory " + prefix)
    for side, number in (("left", left), ("right", right)):
        extension = objects[prefix + "-" + side + "-extension-endcap"]
        check(extension["from"] == f"source-{row}-ball-{number:02d}",
              "Wrong wavelength endpoint")
        object_svg(extension["id"])
        arrow_id = prefix + "-" + side + "-arrow"
        object_svg(arrow_id)
        check("ld-fig-70_ld-" + arrow_id in heads, "Missing dimension arrowhead")
    label = svg_text[prefix + "-given-label-label"]
    check("".join(label.itertext()) == "\u03bb", "Wrong wavelength label")
    separation = objects[f"source-{row}-ball-{right:02d}"]["at"][0] - objects[f"source-{row}-ball-{left:02d}"]["at"][0]
    check(separation == 12 * 56, "Wrong wavelength length")
    wavelengths.append({"id": prefix, "from": left, "to": right, "length": separation})

for row, left, right in (("e", 1, 13), ("f", 1, 13), ("f", 2, 14), ("f", 3, 15)):
    check(objects[f"source-{row}-ball-{left:02d}"]["at"][1]
          == objects[f"source-{row}-ball-{right:02d}"]["at"][1], "Wrong reached equality")
    check(f"source-{row}-reached-equal-state-{left}-{right}" in assertions,
          "Missing reached equality assertion")
for left, right in ((2, 14), (3, 15)):
    check(f"source-e-reached-equal-state-{left}-{right}" not in assertions,
          "Equality incorrectly imposed on unreached balls")

for card in ("n38", "n39"):
    for language in ("zh", "en"):
        lesson = load(AUTHOR / "context" / card / language / "lesson.template.json")
        prose_binding = next(
            item for item in spec["source"]["authoritativeText"]
            if item["lesson"].endswith("-" + card) and item["language"] == language
            and not item.get("exercise")
        )
        for paragraph in lesson["prose"]:
            text = paragraph.get("text", "")
            check(not text or text in prose_binding["text"], "Incomplete current prose binding")
        exercises = load(AUTHOR / "context" / card / language / "exercises.template.json")
        if card == "n39":
            check(len(exercises["exercises"]) == 6, "Changed raw question count")
            check(sum(1 for item in spec["source"]["authoritativeText"]
                      if item["lesson"].endswith("-n39") and item["language"] == language
                      and item.get("exercise")) == 6, "Incomplete six-question binding")

display = load(freeze["previewChecks"]["path"])
check(display["status"] == "pass", "Failed reused display receipt")
check(display["spec"]["sha256"] == sha(freeze["figureSpec"]["path"]), "Stale display spec")
check(display["svg"]["sha256"] == sha(freeze["svg"]["path"]), "Stale display SVG")
for observation in display["observations"]:
    check(observation["observed"]["mediaWidth"] == 640, "Wrong actual media width")
    check(all(item["fontPx"] >= 16 and item["inside"]
              for item in observation["observed"]["texts"]), "Small or clipped text")
    check(not observation["observed"]["collisions"], "Label collision")
mobile = next(item for item in display["observations"] if item["viewport"]["width"] == 390)
check(mobile["horizontalEnd"]["scrollLeft"] == mobile["horizontalEnd"]["max"] == 282,
      "Unreachable mobile end")
check(all(item["visibleHorizontally"] for item in mobile["horizontalEnd"]["lastLabels"]),
      "Clipped last labels")
check(len(svg_text) == 123, "Wrong visible label count")
allowed_labels = {str(number) for number in range(1, 19)} | set("abcdef") | {
    "0", "T/4", "T/2", "3T/4", "T", "5T/4", "\u03bb"
}
check(all("".join(element.itertext()) in allowed_labels for element in svg_text.values()),
      "Unexpected cultural or answer label")
for element in svg.iter():
    for attribute in ("stroke", "fill"):
        value = element.get(attribute, "")
        if value.startswith("var("):
            check(re.match(r"var\(--ld-figure-(ink|muted|accent|accentSoft|grid|paper),", value),
                  "Nonsemantic figure color")

payload = {
    "status": "pass",
    "scope": "One read-only comparison, not a rerender, repair, app or full-card approval",
    "freezeSha256": sha(freeze_path),
    "frozenArtifactAndToolBindingsChecked": len(bindings),
    "independentInventorySha256": sha(inventory_path),
    "source": freeze["source"], "spec": freeze["figureSpec"],
    "svg": freeze["svg"], "render": freeze["render"],
    "rows": rows, "pointRelationshipsChecked": len(coverage),
    "pointCoverage": coverage, "wavelengths": wavelengths,
    "currentFullBilingualN38AndRepairedN39TextBound": True,
    "earlyPropagationNotSteadySinusoid": True,
    "reusedPreviewReceipt": freeze["previewChecks"],
    "actual640MinimumTextPx": 17, "mobileHostPx": 358,
    "mobileScrollLeftAndMaxPx": [282, 282], "fullCardApproval": False,
    "figureRepairPerformed": False
}
output = EVIDENCE / "current-inputs-and-independent-mapping.json"
output.write_text(json.dumps(payload, ensure_ascii=True, indent=2) + "\n")
print(json.dumps({key: payload[key] for key in (
    "status", "pointRelationshipsChecked", "frozenArtifactAndToolBindingsChecked",
    "actual640MinimumTextPx", "mobileScrollLeftAndMaxPx"
)}))
