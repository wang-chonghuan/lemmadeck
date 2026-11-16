"""Scoped native prose preparation and hash-bound author freeze for lesson 59."""

import argparse
import copy
import hashlib
import json
from pathlib import Path
import subprocess
import sys


ROOT = Path(__file__).resolve().parents[4]
TOOLS = ROOT / ".claude/skills/ld-s10y-lesson/tools"
sys.path.insert(0, str(TOOLS))
import edition


CARD = "phy9-c2-s2-n59"
BOOK = ROOT / "ssot-resources/soviet10year-textbooks/artifacts/9p"
SCRATCH = ROOT / ".tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons" / CARD
TMP = Path(__file__).resolve().parent
LESSON = SCRATCH / "lesson.template.json"
EXERCISES = SCRATCH / "exercises.template.json"
FIGURES = SCRATCH / "figures.template.json"
SOURCE_LESSON = BOOK / "lessons" / CARD / "lesson.json"
SOURCE_EXERCISES = SOURCE_LESSON.with_name("exercises.json")
ORIGINAL_IMAGE = BOOK / "figures/fig-103.png"
BASELINE = {
    "prepared_lesson": "030066c0caeb630d4d64eb07467ebce725779287ba0122ca23c6554b7977ede5",
    "exercises_template": "af2e2289a219dfc784eaae35e22b0ddcf76f44675a9677a1682918b514cc7baf",
    "figures_template": "75e4d68b07310b21f3e000798c8ef2f6d6ecf63cd63188d94d681a49df84d89d",
    "source_lesson": "bf73cbc767e15a30d720cdbcc4db40800ef0ce31566dce69de4c2a068e2cd12b",
    "source_exercises": "1c6e277b4b3f42d84c5581268573fa03baa9bb19ed22aaa3550f0d9700dace85",
    "original_figure": "7e8378d46ac0db305a92901b594ff53c484a0456a5e36fb225cfb18ca0648885",
}
RATIONALES = {
    "p0147#3": "Introduce charge as a physical property without creating an exercise.",
    "p0147#4": "Keep fig103; distinguish the old circular atom schematic from measured quantum motion.",
    "p0147#5": "Retain the original figure block identity with no modern artwork authoring.",
    "p0147#6": "Retain the original caption and its exact figure number.",
    "p0147#8": "Charge is a property, not a detachable fluid.",
    "p0147#9": "Distinguish fundamental and composite particles, massless photons and Newtonian limits.",
    "p0147#10": "Limit inverse-square electrostatics; preserve 10^39 as electron-proton order of magnitude.",
    "p0148#2": "Specify the field, motion, distance and medium conditions when relating charge to force.",
    "p0148#3": "An intrinsic charge need not produce a nonzero net force in every environment.",
    "p0148#4": "Limit like/unlike attraction rules to static point charges rather than all extended bodies.",
    "p0148#5": "Charge-sign convention does not make electrons and protons identical particles.",
    "p0148#6": "Remove the exclusive electron/proton stability claim and universal lifetime claim.",
    "p0149#2": "Keep the neutron-proton mass ordering; identify both as composite particles.",
    "p0149#3": "Retain source historical names; limit integer net charge to isolated ordinary atomic matter.",
    "p0149#4": "Define positive e by the electron's charge magnitude, not a minimum for every particle.",
    "p0149#9": "Preserve the 1/3 math token; modernize quark evidence, fractional charge and confinement.",
}


def bind(path):
    return {"path": path.relative_to(ROOT).as_posix(), "sha256": edition.sha256(path)}


def text_hash(text):
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def guard():
    for path, name in (
        (SOURCE_LESSON, "source_lesson"),
        (SOURCE_EXERCISES, "source_exercises"),
        (EXERCISES, "exercises_template"),
        (FIGURES, "figures_template"),
        (ORIGINAL_IMAGE, "original_figure"),
    ):
        if edition.sha256(path) != BASELINE[name]:
            raise SystemExit(f"Concurrent input change: {path.relative_to(ROOT)}")


def normalize():
    guard()
    lesson = edition.load(LESSON)
    edition.normalize_lesson_layout(lesson)
    edition.dump(LESSON, lesson)
    print("Native normalize_lesson_layout completed only the n59 lesson template.")


def freeze():
    guard()
    output_path = TMP / "9p-n59-prose-freeze.json"
    if output_path.exists():
        raise SystemExit("Refusing to overwrite an existing author freeze.")
    raw = edition.load(SOURCE_LESSON)
    raw_exercises = edition.load(SOURCE_EXERCISES)
    lesson = edition.load(LESSON)
    exercises = edition.load(EXERCISES)
    figures = edition.load(FIGURES)
    profile_path = TOOLS.parent / "profiles/modern-us-neutral.json"
    profile = edition.load(profile_path)
    forbidden = profile["forbidden_terms"] + profile["forbidden_person_names"]
    errors = edition.validate_source(BOOK, lesson["source"], SOURCE_LESSON, "lesson")
    errors += edition.validate_source(BOOK, exercises["source"], SOURCE_EXERCISES, "exercises")
    errors += edition.validate_identity_fields(raw, lesson, edition.IDENTITY_FIELDS, "lesson")
    corrections, errata_errors = edition.validate_errata(
        BOOK, raw, raw_exercises, lesson, exercises
    )
    errors += errata_errors
    if lesson["source"]["data"] != raw or exercises["source"]["data"] != raw_exercises:
        errors.append("Canonical source snapshots changed.")
    if len(raw["prose"]) != 16 or len(lesson["prose"]) != len(raw["prose"]):
        errors.append("The sixteen canonical blocks were not retained.")
    if lesson.get("figures") != raw["figures"]:
        errors.append("Original figure ownership changed.")
    if lesson.get("schema") != edition.LESSON_SCHEMA or lesson.get("edition") != "modern-us-neutral":
        errors.append("Lesson schema or edition mismatch.")
    if lesson.get("status") != "draft" or exercises.get("status") != "draft":
        errors.append("Author candidates must remain drafts.")
    if raw["exercise_count"] != 0 or raw_exercises["count"] != 0 or exercises["count"] != 0:
        errors.append("Zero original tasks were not preserved.")
    if raw_exercises["exercises"] or exercises["exercises"]:
        errors.append("Invented exercise tasks.")
    normalized = copy.deepcopy(lesson)
    edition.normalize_lesson_layout(normalized)
    if normalized != lesson:
        errors.append("Native prose normalization is not stable.")
    mapping = []
    for index, (source, modern) in enumerate(zip(raw["prose"], lesson["prose"])):
        label = f"lesson.prose[{index}]"
        errors += edition.validate_identity_fields(
            source, modern, ("kind", "id", "label", "printed_page", "source_refs"), label
        )
        if source["text"] != modern["source_text"]:
            errors.append(f"{label}: source_text drift.")
        errors += edition.validate_text(
            source["text"], modern["text"], modern["changes"], modern["numeric_changes"],
            label, forbidden, modern["historical_entities"], corrections.get(label),
        )
        source_math = edition.math_signature(source["text"])
        modern_math = edition.math_signature(modern["text"])
        source_numbers = edition.number_signature(source["text"])
        modern_numbers = edition.number_signature(modern["text"])
        if source_math != modern_math or source_numbers != modern_numbers:
            errors.append(f"{label}: source math or number signature changed.")
        if source["kind"] in {"fig", "cap"} and modern != {
            **source, "source_text": source["text"], "changes": [],
            "numeric_changes": [], "historical_entities": [],
        }:
            errors.append(f"{label}: source figure/caption block changed.")
        mapping.append({
            "target": label,
            "source_refs": source["source_refs"],
            "kind": source["kind"],
            "label": source["label"],
            "source_text_sha256": text_hash(source["text"]),
            "modern_text_sha256": text_hash(modern["text"]),
            "source_text_preserved": source["text"] == modern["source_text"],
            "source_math": source_math,
            "modern_math": modern_math,
            "source_numbers": source_numbers,
            "modern_numbers": modern_numbers,
            "changes": modern["changes"],
            "numeric_changes": modern["numeric_changes"],
            "historical_entities": modern["historical_entities"],
            "rationale": RATIONALES[source["source_refs"][0]],
        })
    flow, flow_errors = edition.prose_flow_contract(lesson["prose"], lesson["section_breaks"])
    errors += flow_errors
    actual_outline = subprocess.run(
        ["node", str(TOOLS / "prose_flow.mjs"), str(LESSON)],
        capture_output=True, text=True, check=True,
    )
    for boundary in lesson["section_breaks"]:
        native_object = json.dumps(boundary, ensure_ascii=False, separators=(",", ":"))
        if f"break: {native_object}" not in actual_outline.stdout:
            errors.append("Section anchors do not match native adjacent-paragraph output.")

    # Reproduce the numeric-addition contract failure without inserting an invalid value into the draft.
    value_source = raw["prose"][14]["text"]
    intended_value_text = lesson["prose"][14]["text"] + "\n基本电荷的正值严格等于 1.602176634 × 10^-19 C。"
    value_errors = edition.validate_text(
        value_source, intended_value_text, ["wording", "conditions", "context-number"],
        [], "lesson.prose[14].reference-value-addition", forbidden, [],
    )
    blockers = []
    if value_errors:
        blockers.append({
            "id": "exact-elementary-charge-reference-addition",
            "target": "lesson.prose[14]",
            "source_refs": raw["prose"][14]["source_refs"],
            "required_value": "e = 1.602176634 × 10^-19 C, positive and exact",
            "reference": bind(TMP / "d017-science-reference-notes.json"),
            "native_api": "edition.validate_text / number_signature",
            "source_number_signature": edition.number_signature(value_source),
            "intended_number_signature": edition.number_signature(intended_value_text),
            "actual_native_errors": value_errors,
            "contract": "numeric_changes replaces a from value already present in source; no supported additive value declaration.",
            "template_action": "Retained the positive e definition without the new numeric value; did not disguise numbers as words, add math wrappers, invent errata, or patch tools.",
            "required_followup": "Main must resolve the authorized numeric-addition contract or revise the requirement before counting this card complete.",
        })
    structural_status = "PASS" if not errors else "FAIL"
    output = (
        f"author_structural={structural_status} card={CARD} "
        f"blocks={len(lesson['prose'])} paragraphs={len(flow.get('paragraphs', []))} "
        f"tasks={exercises['count']} figures={len(lesson['figures'])} "
        f"section_breaks={len(lesson['section_breaks'])} "
        f"blockers={len(blockers)} errors={json.dumps(errors, ensure_ascii=False)}"
    )
    report = {
        "ticket": "STEMROBIN-181",
        "batch": "D017",
        "role": "modern-prose-author-only",
        "card": CARD,
        "status": "blocked-reference-value-addition" if blockers else (
            "blocked-structural" if errors else "frozen-pending-independent-science"
        ),
        "author_structural_status": structural_status,
        "complete": not errors and not blockers,
        "bindings": {
            "source_lesson": bind(SOURCE_LESSON),
            "source_markdown": bind(SOURCE_LESSON.with_name("lesson.md")),
            "source_exercises": bind(SOURCE_EXERCISES),
            "lesson_template": bind(LESSON),
            "exercises_template": bind(EXERCISES),
            "figures_template": bind(FIGURES),
            "original_figure_png": bind(ORIGINAL_IMAGE),
            "helper": bind(Path(__file__).resolve()),
            "native_edition": bind(TOOLS / "edition.py"),
            "native_prose_flow": bind(TOOLS / "prose_flow.mjs"),
            "native_htmlfrag": bind(TOOLS / "htmlfrag.js"),
            "profile": bind(profile_path),
            "text_contract": bind(TOOLS.parent / "references/edition-text-contract.md"),
            "existing_reference_notes": bind(TMP / "d017-science-reference-notes.json"),
        },
        "prepared_baseline": BASELINE,
        "prepare": {
            "command": ".claude/skills/ld-s10y-lesson/.venv/bin/python -B .claude/skills/ld-s10y-lesson/tools/p2c.py adapt-prepare --book 9p --edition modern-us-neutral --lesson phy9-c2-s2-n59",
            "exit_code": 0,
            "output": "[adapt-prepare] phy9-c2-s2-n59: 正文 16 块, 题 0 道, 图 1 张 -> .tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons/phy9-c2-s2-n59",
            "invocations": 1,
        },
        "native_author_checks": {
            "command": ".claude/skills/ld-s10y-lesson/.venv/bin/python -B .intentfold/tickets/STEMROBIN-181/tmp/author-9p-n59-prose.py freeze",
            "exit_code": 0 if not errors else 1,
            "output": output,
            "errors": errors,
            "source_snapshots_and_math_preserved": not errors,
            "normalization_stable": normalized == lesson,
            "unchanged_exercises_and_figures_templates": True,
            "bound_errata": lesson["errata"],
            "prose_flow": flow,
            "section_breaks": lesson["section_breaks"],
            "figure_native_gate": "not requested; figure manifest placeholders unchanged",
        },
        "source_preservation_mapping": mapping,
        "source_figure_observation": {
            "actual_png_opened": True,
            "role": "prose author source inventory, not independent figure approval",
            "central_nucleus": {"count": 1, "solid_black": True, "adjacent_plus_mark": True},
            "circular_schematic_lines": 2,
            "electron_markers": {"total": 7, "inner": 2, "outer": 5, "hollow_with_minus_marks": True},
            "axis_scale_or_measured_readings": False,
            "prose_limit": "Old atom-model schematic; circles are not measured electron paths and sizes are not to scale.",
            "modern_figure_authored": False,
            "placeholder_manifest": figures,
        },
        "routing_clarification": {
            "p0149#7": "The atom-number typo belongs to source lesson60, not the sixteen n59 blocks. No n60 correction, source ref, erratum or charge-conservation unit was inserted into n59.",
            "source_10_power_39": "Retained exactly and described only as an approximate electron-proton static-electric/Newtonian-gravity order of magnitude. No new 2.3e39 reading added.",
        },
        "blockers": blockers,
        "independent_science_or_figure_approval": False,
        "finalize_or_promotion": False,
        "in_flight_processes": [],
    }
    edition.dump(output_path, report)
    print(output)
    if blockers:
        print("reference_value_addition=BLOCKED " + json.dumps(value_errors, ensure_ascii=False))
    print(f"freeze={output_path.relative_to(ROOT)} sha256={edition.sha256(output_path)}")
    if errors:
        raise SystemExit(1)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("action", choices=("normalize", "freeze"))
    action = parser.parse_args().action
    if action == "normalize":
        normalize()
    else:
        freeze()
