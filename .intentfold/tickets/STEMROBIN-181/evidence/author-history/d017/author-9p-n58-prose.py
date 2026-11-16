"""Normalize and freeze only the authorized phy9-c2-s1 prose candidate."""

import argparse
import copy
import json
from pathlib import Path
import subprocess
import sys


ROOT = Path(__file__).resolve().parents[4]
TOOLS = ROOT / ".claude/skills/ld-s10y-lesson/tools"
sys.path.insert(0, str(TOOLS))
import edition


CARD = "phy9-c2-s1"
BOOK = ROOT / "ssot-resources/soviet10year-textbooks/artifacts/9p"
TEMPLATE_DIR = ROOT / ".tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons" / CARD
TICKET_TMP = Path(__file__).resolve().parent
LESSON = TEMPLATE_DIR / "lesson.template.json"
EXERCISES = TEMPLATE_DIR / "exercises.template.json"
FIGURES = TEMPLATE_DIR / "figures.template.json"
EXPECTED = {
    "source_lesson": "469a5a60cf55024df3824100cab1afbfde74c4f4d42ba74a47568c2b740e9a4b",
    "source_exercises": "e3dfd1fa23bca2d1b7335534508ed15f224b1807123df3065856610bb53f2ca8",
    "prepared_lesson": "a9ca6995b9703731a318aa5f0ed178f08f274a0d4ecc7af6faad158a7a7ec79c",
    "exercises_template": "33015679abb8675bc6ef4ab7dba47582371822cbdca031e7ef4c86c3cf5b29f9",
    "figures_template": "e77254fb41c8302f4617e2aec916b13082e2d4736e348bb155c444084788dcfc",
}
RATIONALES = {
    "p0145#3": "Define classical electrodynamics without claiming mechanics never studies force origins.",
    "p0145#4": "Distinguish fundamental interactions from emergent contact and muscle forces.",
    "p0145#7": "Keep the footnote identity and limit the weak-interaction statement to certain transformations.",
    "p0145#5": "Explain free-fall weightlessness without removing gravity or denying long-term bodily effects.",
    "p0145#6": "Distinguish dominance, range, quantum structure and observable effects across scales.",
    "p0146#2": "Retain the sole unnumbered Maxwell portrait reference and empty figure text unchanged.",
    "p0146#3": "Keep Maxwell's identity and life dates; qualify the priority claim for statistical methods.",
    "p0146#4": "Keep Maxwell and Popov; distinguish early motors, full field theory and collaborative radio history.",
    "p0146#5": "Retain the role of electrical applications without an absolute civilization counterfactual.",
    "p0146#6": "Retain the learning aim without inventing an exercise.",
}


def binding(path):
    return {"path": path.relative_to(ROOT).as_posix(), "sha256": edition.sha256(path)}


def guarded_inputs():
    for path, key in (
        (BOOK / "lessons" / CARD / "lesson.json", "source_lesson"),
        (BOOK / "lessons" / CARD / "exercises.json", "source_exercises"),
        (EXERCISES, "exercises_template"),
        (FIGURES, "figures_template"),
    ):
        if edition.sha256(path) != EXPECTED[key]:
            raise SystemExit(f"Concurrent input change: {path.relative_to(ROOT)}")


def normalize():
    guarded_inputs()
    lesson = edition.load(LESSON)
    edition.normalize_lesson_layout(lesson)
    edition.dump(LESSON, lesson)
    print("Native normalize_lesson_layout: completed only lesson.template.json")


def freeze():
    guarded_inputs()
    report_path = TICKET_TMP / "9p-n58-prose-freeze.json"
    if report_path.exists():
        raise SystemExit("Freeze already exists; refusing to overwrite evidence.")
    source_lesson_path = BOOK / "lessons" / CARD / "lesson.json"
    source_exercises_path = BOOK / "lessons" / CARD / "exercises.json"
    raw = edition.load(source_lesson_path)
    raw_exercises = edition.load(source_exercises_path)
    lesson = edition.load(LESSON)
    exercises = edition.load(EXERCISES)
    profile_path = TOOLS.parent / "profiles/modern-us-neutral.json"
    profile = edition.load(profile_path)
    forbidden = profile["forbidden_terms"] + profile["forbidden_person_names"]
    errors = edition.validate_source(BOOK, lesson["source"], source_lesson_path, "lesson")
    errors += edition.validate_source(
        BOOK, exercises["source"], source_exercises_path, "exercises"
    )
    errors += edition.validate_identity_fields(raw, lesson, edition.IDENTITY_FIELDS, "lesson")
    if lesson["source"]["data"] != raw or exercises["source"]["data"] != raw_exercises:
        errors.append("Source snapshots differ from current canonical inputs.")
    if lesson.get("schema") != edition.LESSON_SCHEMA or lesson.get("edition") != "modern-us-neutral":
        errors.append("Lesson schema or edition changed.")
    if lesson.get("status") != "draft":
        errors.append("Candidate is not author-only draft.")
    if len(raw["prose"]) != 10 or len(lesson["prose"]) != len(raw["prose"]):
        errors.append("The ten native prose blocks were not retained.")
    if lesson.get("figures") != raw.get("figures"):
        errors.append("Portrait manifest changed.")
    if raw["exercise_count"] != 0 or exercises != {
        **raw_exercises,
        "schema": edition.EXERCISES_SCHEMA,
        "edition": "modern-us-neutral",
        "status": "draft",
        "source": exercises["source"],
    } or raw_exercises["count"] != 0 or raw_exercises["exercises"]:
        errors.append("Zero original tasks were not retained exactly.")
    if lesson.get("errata") != []:
        errors.append("Unexpected erratum in this formula-free card.")
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
        if modern.get("source_text") != source["text"]:
            errors.append(f"{label}: source_text changed.")
        errors += edition.validate_text(
            source["text"], modern["text"], modern["changes"], modern["numeric_changes"],
            label, forbidden, modern["historical_entities"],
        )
        source_math = edition.math_signature(source["text"])
        modern_math = edition.math_signature(modern["text"])
        source_numbers = edition.number_signature(source["text"])
        modern_numbers = edition.number_signature(modern["text"])
        if source_math != modern_math or source_numbers != modern_numbers:
            errors.append(f"{label}: math or number token drift.")
        if modern["numeric_changes"]:
            errors.append(f"{label}: unexpected numerical substitution.")
        if source["kind"] == "fig" and modern != {
            **source, "source_text": source["text"], "changes": [],
            "numeric_changes": [], "historical_entities": [],
        }:
            errors.append(f"{label}: original portrait block changed.")
        mapping.append({
            "target": label,
            "source_refs": source["source_refs"],
            "kind": source["kind"],
            "label": source["label"],
            "source_text_unchanged": modern.get("source_text") == source["text"],
            "source_math_tokens": source_math,
            "modern_math_tokens": modern_math,
            "source_number_tokens": source_numbers,
            "modern_number_tokens": modern_numbers,
            "changes": modern["changes"],
            "historical_entities": modern["historical_entities"],
            "rationale": RATIONALES[source["source_refs"][0]],
        })
    flow, flow_errors = edition.prose_flow_contract(lesson["prose"], lesson["section_breaks"])
    errors += flow_errors
    outline_run = subprocess.run(
        ["node", str(TOOLS / "prose_flow.mjs"), str(LESSON)],
        capture_output=True, text=True, check=True,
    )
    for section in lesson["section_breaks"]:
        actual_object = json.dumps(section, ensure_ascii=False, separators=(",", ":"))
        if f"break: {actual_object}" not in outline_run.stdout:
            errors.append("A section boundary was not copied from the native adjacent-paragraph output.")
    output = (
        f"author_structural={'PASS' if not errors else 'FAIL'} card={CARD} "
        f"blocks={len(lesson['prose'])} paragraphs={len(flow.get('paragraphs', []))} "
        f"tasks={exercises['count']} portraits={len(lesson['figures'])} "
        f"section_breaks={len(lesson['section_breaks'])} "
        f"errors={json.dumps(errors, ensure_ascii=False)}"
    )
    report = {
        "ticket": "STEMROBIN-181",
        "batch": "D017",
        "role": "modern-prose-author-only",
        "card": CARD,
        "printed_number": raw["number"],
        "status": "frozen-pending-independent-science" if not errors else "blocked",
        "native_author_structural_status": "PASS" if not errors else "FAIL",
        "bindings": {
            "source_lesson": binding(source_lesson_path),
            "source_markdown": binding(source_lesson_path.with_name("lesson.md")),
            "source_exercises": binding(source_exercises_path),
            "lesson_template": binding(LESSON),
            "exercises_template": binding(EXERCISES),
            "figures_template": binding(FIGURES),
            "helper": binding(Path(__file__).resolve()),
            "native_edition": binding(TOOLS / "edition.py"),
            "native_prose_flow": binding(TOOLS / "prose_flow.mjs"),
            "native_htmlfrag": binding(TOOLS / "htmlfrag.js"),
            "profile": binding(profile_path),
            "text_contract": binding(TOOLS.parent / "references/edition-text-contract.md"),
        },
        "prepared_baseline": EXPECTED,
        "prepare": {
            "command": ".claude/skills/ld-s10y-lesson/.venv/bin/python -B .claude/skills/ld-s10y-lesson/tools/p2c.py adapt-prepare --book 9p --edition modern-us-neutral --lesson phy9-c2-s1",
            "exit_code": 0,
            "output": "[adapt-prepare] phy9-c2-s1: 正文 10 块, 题 0 道, 图 1 张",
            "scope": "one new card only; already completed, not repeated",
        },
        "native_checks": {
            "command": ".claude/skills/ld-s10y-lesson/.venv/bin/python -B .intentfold/tickets/STEMROBIN-181/tmp/author-9p-n58-prose.py freeze",
            "exit_code": 0 if not errors else 1,
            "output": output,
            "errors": errors,
            "source_snapshot_identity_refs_math_numbers": "PASS" if not errors else "FAIL",
            "normalization_stable": normalized == lesson,
            "exercise_and_figure_templates_byte_unchanged": True,
            "prose_flow": flow,
            "section_breaks_copied_from_native_cli": lesson["section_breaks"],
        },
        "mapping": mapping,
        "portrait": {
            "id": "tbl-p0146-01",
            "label": "麦克斯韦肖像",
            "source_refs": ["p0146#2"],
            "identity": "J. C. 麦克斯韦",
            "status": "source reference retained; no image authoring or approval",
        },
        "pending": ["Main's unique independent science/text gate", "Any separately authorized modern portrait work"],
        "prohibited_actions_performed": [],
        "in_flight_processes": [],
    }
    edition.dump(report_path, report)
    print(output)
    print(f"freeze={report_path.relative_to(ROOT)} sha256={edition.sha256(report_path)}")
    if errors:
        raise SystemExit(1)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("action", choices=("normalize", "freeze"))
    args = parser.parse_args()
    if args.action == "normalize":
        normalize()
    else:
        freeze()
