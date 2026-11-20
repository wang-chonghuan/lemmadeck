#!/usr/bin/env python3
"""One bounded author check using only selected existing pure text helpers."""

import ast
import json
import re
import sys
from pathlib import Path

sys.dont_write_bytecode = True
root = Path(__file__).resolve().parent
repo = root.parents[4]
manifest = json.loads((root.parent / "n62-modern-text-author-inputs-01/manifest.json").read_text())
plan = json.loads((root / "authoring-plan.json").read_text())
helper_path = repo / ".claude/skills/ld-s10y-lesson/tools/edition.py"
names = {
    "MATH", "NUMBER", "PART_MARKER", "LATIN_PARTS", "CYRILLIC_PARTS",
    "number_signature", "masked_math", "nesting_depths",
    "normalize_prose_layout", "marker_order", "normalize_numbered_subparts",
    "validate_numbered_subpart_layout", "validate_identity_fields",
}
tree = ast.parse(helper_path.read_text(), filename=str(helper_path))
selected = []
for node in tree.body:
    if isinstance(node, ast.FunctionDef) and node.name in names:
        selected.append(node)
    elif isinstance(node, ast.Assign) and any(
        isinstance(target, ast.Name) and target.id in names for target in node.targets
    ):
        selected.append(node)
namespace = {"re": re}
exec(compile(ast.Module(body=selected, type_ignores=[]), str(helper_path), "exec"), namespace)

lesson = json.loads((root / "FIRST/lesson.template.json").read_text())
exercises = json.loads((root / "FIRST/exercises.template.json").read_text())
raw_lesson = json.loads(Path(manifest["rawLesson"]["path"]).read_text())
raw_exercises = json.loads(Path(manifest["rawExercises"]["path"]).read_text())
profile = json.loads((repo / ".claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json").read_text())
forbidden = profile["forbidden_terms"] + profile["forbidden_person_names"]
literal_math = lambda text: [match.group() for match in namespace["MATH"].finditer(text)]
part_marker = re.compile(r"(?<!\d)([12]°?\))")


def subparts(text):
    matches = list(part_marker.finditer(namespace["masked_math"](text)))
    return [
        {
            "marker": match.group(1),
            "text": text[match.start():matches[index + 1].start() if index + 1 < len(matches) else len(text)].strip(),
            "math_tokens": literal_math(text[match.end():matches[index + 1].start() if index + 1 < len(matches) else len(text)]),
        }
        for index, match in enumerate(matches)
    ]


objects = []
global_errors = []
if len(lesson["prose"]) != 13 or len(exercises["exercises"]) != 7 or len(plan["objects"]) != 20:
    global_errors.append("The bounded candidate must contain exactly 13 prose objects and 7 exercises.")
if lesson["source"]["data"] != raw_lesson or exercises["source"]["data"] != raw_exercises:
    global_errors.append("Raw source snapshots changed.")
for document, raw in [(lesson, raw_lesson), (exercises, raw_exercises)]:
    fields = tuple(key for key in raw if key not in ("prose", "exercises"))
    global_errors.extend(namespace["validate_identity_fields"](raw, document, fields, "document"))
if lesson["errata"] != [] or lesson["section_breaks"] != []:
    global_errors.append("Initial candidate must have no new errata or precomputed anchors.")

for authored in plan["objects"]:
    target = authored["target"]
    if target.startswith("prose["):
        index = int(target[6:-1])
        before = raw_lesson["prose"][index]
        after = lesson["prose"][index]
    else:
        number = target.split(":")[1]
        before = next(item for item in raw_exercises["exercises"] if item["number"] == number)
        after = next(item for item in exercises["exercises"] if item["number"] == number)
    errors = []
    fields = tuple(key for key in before if key not in ("text", "lines"))
    errors.extend(namespace["validate_identity_fields"](before, after, fields, target))
    source_math = literal_math(before["text"])
    modern_math = literal_math(after["text"])
    source_numbers = namespace["number_signature"](before["text"])
    modern_numbers = namespace["number_signature"](after["text"])
    if source_math != modern_math:
        errors.append("Ordered delimited math tokens must be literally equal, without normalization.")
    if source_numbers != modern_numbers:
        errors.append("All ordered non-math numeric tokens must remain equal.")
    if after["source_text"] != before["text"]:
        errors.append("Immutable source_text changed.")
    if after["text"] != authored["text"] or after["changes"] != authored["changes"]:
        errors.append("Candidate differs from the apply_patch-authored text/change plan.")
    if after["numeric_changes"] != [] or after["historical_entities"] != []:
        errors.append("No numeric changes or historical entities are authorized.")
    if before["text"] != after["text"] and not after["changes"]:
        errors.append("Changed text requires a change declaration.")
    if before["text"] == after["text"] and after["changes"]:
        errors.append("Unchanged slots/captions require empty changes.")
    if any(re.search(r"[、，；。？！：]", token) for token in modern_math):
        errors.append("Chinese punctuation must stay outside math.")
    if any(term in after["text"] for term in forbidden) or re.search(r"[\u0400-\u04ff]", after["text"]):
        errors.append("Modern neutral profile violation.")
    layout = None
    source_parts = []
    modern_parts = []
    prefix = None
    if target.startswith("prose[") and after["kind"] == "p":
        layout = namespace["normalize_prose_layout"](after["text"])
        if layout != after["text"]:
            errors.append("Prose candidate is not in the existing pure helper's canonical layout.")
    elif target.startswith("exercise:"):
        layout = namespace["normalize_numbered_subparts"](after["text"])
        errors.extend(namespace["validate_numbered_subpart_layout"](after["text"]))
        prefix = re.match(r"^\d+[°*]?\.", before["text"]).group()
        if after["text"].splitlines()[0] != prefix:
            errors.append("Literal exercise/star/raised-circle prefix must occupy its own line.")
        if after["lines"] != after["text"].splitlines():
            errors.append("Exercise lines must match its authored text.")
        source_parts = subparts(before["text"])
        modern_parts = subparts(after["text"])
        if [(part["marker"], part["math_tokens"]) for part in source_parts] != [
            (part["marker"], part["math_tokens"]) for part in modern_parts
        ]:
            errors.append("Subpart marker identity/order or per-subpart math changed.")
        for part in modern_parts:
            if "\n" in part["text"] or not any(
                line.startswith(part["marker"] + " ") for line in after["lines"]
            ):
                errors.append("Every complete natural subpart must occupy one separate line.")
    objects.append({
        "target": target,
        "status": "PASS" if not errors else "FAIL",
        "errors": errors,
        "source_text": before["text"],
        "authored_text": after["text"],
        "changes": after["changes"],
        "semantic_change_mapping": authored["semantic_mapping"],
        "math_tokens": {"before": source_math, "after": modern_math, "literal_equal": source_math == modern_math},
        "numeric_tokens": {"before": source_numbers, "after": modern_numbers, "literal_equal": source_numbers == modern_numbers},
        "identity_fields": fields,
        "identity_before": {key: before[key] for key in fields},
        "identity_after": {key: after[key] for key in fields},
        "source_refs": before.get("source_refs", before.get("pages", [])),
        "figure_refs": before.get("figure_refs", []),
        "prefix": prefix,
        "subparts": {"before": source_parts, "after": modern_parts},
        "pure_layout": layout,
        "numeric_changes": [],
        "historical_entities": [],
        "author_semantic_approval": False,
    })

report = {
    "schema": "stemrobin188-n62-focused-author-check@1",
    "status": "FAIL" if global_errors or any(item["errors"] for item in objects) else "PASS",
    "purpose": "Initial focused author preservation/layout check only; not independent semantic review.",
    "helper": str(helper_path),
    "pure_helper_names": sorted(names),
    "helper_loading": "AST-select only the named pure constants/functions; no module imports, source parser, native pipeline, KaTeX or image execution.",
    "objects": objects,
    "global_errors": global_errors,
    "author_self_semantic_approval": False,
    "independent_review_needed": True,
}
print(json.dumps(report, ensure_ascii=False, indent=2))
sys.exit(0 if report["status"] == "PASS" else 1)
