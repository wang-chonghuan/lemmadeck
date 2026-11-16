"""Normalize and freeze only the authorized six-block n61 prose candidate."""

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
import mathcheck


CARD = "phy9-c2-s2-n61"
BOOK = ROOT / "ssot-resources/soviet10year-textbooks/artifacts/9p"
WORK = ROOT / ".tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons" / CARD
TMP = Path(__file__).resolve().parent
LESSON = WORK / "lesson.template.json"
EXERCISES = WORK / "exercises.template.json"
FIGURES = WORK / "figures.template.json"
BEFORE = TMP / "9p-n61-before-authoring.lesson.template.json"
FREEZE = TMP / "9p-n61-prose-freeze.json"
EXPECTED = {
    "source_lesson": "edbd8933134e3b3288f9379f2107da613912f40be90038af78ebc748a373dfa9",
    "source_markdown": "3302a1a7dfb9a10c7249b24cd7491cbe85903beeaea508fd0f07f822e64baf2d",
    "source_exercises": "d8d2302bae72d8f06d87fb4b9bb3bc346f249a5206f5f7287a148155d2398d9b",
    "prepared_lesson": "b58738ff060cf6f9121576e407d1967ad105c82616d2d3b92bcc6ecb446b5cb8",
    "exercises_template": "18bbe1fb47dfd48514292ced8fa5e2985d3768619ac28fb9f160f678f7f95789",
    "figures_template": "2d90d25d56a234510798a78716b1610618088cb6b9c9ccd27624db3760dfc974",
}
TOPICS = [
    "Frictional transfer, signed electron charge and combined-system charge; zero total requires initially zero total, not merely electrification.",
    "Charge-isolated system boundary, signed total conservation and distinction from internal motion, particle number or energy-isolation conditions.",
    "Original sum and equation8-1 unchanged; algebraic signs and initial total interpreted without adding an equation.",
    "Particle creation/transformation and annihilation examples; no universal pair-only or individually-neutral-product claim, and no particle-number conservation.",
    "Original explanatory footnote remains source-bound to its tenth-grade curriculum reference, not an invented current task.",
    "Experimental support and basic charge property retained; the original ignorance sentence is explicitly historical, with no invented modern theorem or formula.",
]


def binding(file):
    return {"path": file.relative_to(ROOT).as_posix(), "sha256": edition.sha256(file)}


def guard():
    for file, key in (
        (BOOK / "lessons" / CARD / "lesson.json", "source_lesson"),
        (BOOK / "lessons" / CARD / "lesson.md", "source_markdown"),
        (BOOK / "lessons" / CARD / "exercises.json", "source_exercises"),
        (BEFORE, "prepared_lesson"),
        (EXERCISES, "exercises_template"),
        (FIGURES, "figures_template"),
    ):
        if edition.sha256(file) != EXPECTED[key]:
            raise SystemExit(f"Concurrent input change: {file.relative_to(ROOT)}")


def normalize():
    guard()
    lesson = edition.load(LESSON)
    edition.normalize_lesson_layout(lesson)
    flow, errors = edition.prose_flow_contract(lesson["prose"], [])
    if errors:
        raise SystemExit(json.dumps(errors, ensure_ascii=False))
    boundaries = []
    for block_index in (1, 3, 5):
        first = next(
            paragraph for paragraph in flow["paragraphs"]
            if paragraph["blockIndex"] == block_index
            and paragraph["paragraphInBlock"] == 0
        )
        position = first["index"]
        if position <= 0:
            raise SystemExit("A concept-start paragraph has no preceding paragraph.")
        boundaries.append({
            "before": flow["paragraphs"][position - 1]["text"],
            "after": first["text"],
        })
    lesson["section_breaks"] = boundaries
    edition.dump(LESSON, lesson)
    print("Native normalization and adjacent final-paragraph anchors written only to n61 template.")


def freeze():
    guard()
    if FREEZE.exists():
        raise SystemExit("Preserve existing author freeze; no overwrite.")
    lesson = edition.load(LESSON)
    before = edition.load(BEFORE)
    source_path = BOOK / "lessons" / CARD / "lesson.json"
    source_exercises_path = source_path.with_name("exercises.json")
    raw = edition.load(source_path)
    raw_exercises = edition.load(source_exercises_path)
    exercises = edition.load(EXERCISES)
    profile_path = TOOLS.parent / "profiles/modern-us-neutral.json"
    profile = edition.load(profile_path)
    forbidden = profile["forbidden_terms"] + profile["forbidden_person_names"]
    errors = edition.validate_source(BOOK, lesson["source"], source_path, "lesson")
    errors += edition.validate_source(
        BOOK, exercises["source"], source_exercises_path, "exercises"
    )
    errors += edition.validate_identity_fields(raw, lesson, edition.IDENTITY_FIELDS, "lesson")
    if lesson["source"]["data"] != raw or exercises["source"]["data"] != raw_exercises:
        errors.append("A source snapshot differs from its canonical source.")
    for key in before:
        if key not in ("prose", "section_breaks") and lesson.get(key) != before[key]:
            errors.append(f"Unexpected lesson field change: {key}")
    if len(raw["prose"]) != 6 or len(lesson["prose"]) != 6:
        errors.append("Six source blocks were not retained.")
    if lesson["figures"] or lesson["exercise_count"] != 0:
        errors.append("Source zero figures/tasks were not retained.")
    if raw_exercises["count"] != 0 or raw_exercises["exercises"]:
        errors.append("Source tasks are not empty.")
    if exercises["count"] != 0 or exercises["exercises"]:
        errors.append("Written tasks were invented.")
    if edition.load(FIGURES)["figures"]:
        errors.append("Figure placeholders were invented.")
    normalized = copy.deepcopy(lesson)
    edition.normalize_lesson_layout(normalized)
    if normalized != lesson:
        errors.append("Native prose normalization is not stable.")
    corrections, errata_errors = edition.validate_errata(
        BOOK, raw, raw_exercises, lesson, exercises
    )
    errors += errata_errors
    if corrections or lesson["errata"]:
        errors.append("Unexpected mathematical erratum or correction.")
    coverage = []
    for index, (original, modern) in enumerate(zip(raw["prose"], lesson["prose"])):
        label = f"lesson.prose[{index}]"
        for key in before["prose"][index]:
            if key not in ("text", "changes") and modern.get(key) != before["prose"][index][key]:
                errors.append(f"{label}: unexpected field change: {key}")
        if modern["source_text"] != original["text"]:
            errors.append(f"{label}: source_text changed.")
        text_errors = edition.validate_text(
            original["text"], modern["text"], modern["changes"],
            modern["numeric_changes"], label, forbidden, modern["historical_entities"],
        )
        errors += text_errors
        math_source = edition.math_signature(original["text"])
        math_modern = edition.math_signature(modern["text"])
        numbers_source = edition.number_signature(original["text"])
        numbers_modern = edition.number_signature(modern["text"])
        if math_source != math_modern or numbers_source != numbers_modern:
            errors.append(f"{label}: math or nonmath-number drift.")
        coverage.append({
            "target": label, "source_refs": original["source_refs"],
            "kind": original["kind"], "label": original["label"],
            "source_text_unchanged": modern["source_text"] == original["text"],
            "source_math_signature": math_source, "modern_math_signature": math_modern,
            "source_number_signature": numbers_source, "modern_number_signature": numbers_modern,
            "changes": modern["changes"], "topic": TOPICS[index], "text_errors": text_errors,
        })
    flow, flow_errors = edition.prose_flow_contract(
        lesson["prose"], lesson["section_breaks"]
    )
    errors += flow_errors
    outline = subprocess.run(
        ["node", str(TOOLS / "prose_flow.mjs"), str(LESSON)],
        capture_output=True, text=True, check=True,
    )
    for boundary in lesson["section_breaks"]:
        token = json.dumps(boundary, ensure_ascii=False, separators=(",", ":"))
        if f"break: {token}" not in outline.stdout:
            errors.append("A boundary differs from the native adjacent-paragraph CLI output.")
    math_errors, math_warnings = mathcheck.collect_and_check(
        [{"id": f"lesson.prose[{index}]", "text": block["text"]}
         for index, block in enumerate(lesson["prose"])],
        lambda block: [("text", block["text"])],
    )
    errors += math_errors
    guard()
    report = {
        "ticket": "STEMROBIN-181", "batch": "D017", "lesson": CARD,
        "role": "modern-prose-author-only",
        "status": "author-frozen-awaiting-independent-science-review" if not errors else "author-structural-blocked",
        "bindings": {
            "template": binding(LESSON), "source": binding(source_path),
            "sourceMarkdown": binding(source_path.with_name("lesson.md")),
            "sourceExercises": binding(source_exercises_path),
            "sourcePage": binding(BOOK / "pages/0152/page.json"),
            "before": binding(BEFORE), "exercisesTemplate": binding(EXERCISES),
            "figuresTemplate": binding(FIGURES), "helper": binding(Path(__file__).resolve()),
            "nativeEdition": binding(TOOLS / "edition.py"),
            "nativeProseFlow": binding(TOOLS / "prose_flow.mjs"),
            "nativeHtmlFragment": binding(TOOLS / "htmlfrag.js"), "profile": binding(profile_path),
        },
        "prepare": {
            "command": ".claude/skills/ld-s10y-lesson/.venv/bin/python -B .claude/skills/ld-s10y-lesson/tools/p2c.py adapt-prepare --book 9p --edition modern-us-neutral --lesson phy9-c2-s2-n61",
            "invocations": 1, "exitCode": 0, "sourceBlocks": 6, "tasks": 0, "figures": 0,
        },
        "preparedBaseline": EXPECTED,
        "sourceBlocks": 6, "normalizedParagraphs": len(flow.get("paragraphs", [])),
        "mathFragments": sum(len(item["source_math_signature"]) for item in coverage),
        "tasks": 0, "figures": 0, "coverage": coverage,
        "sectionBreaks": lesson["section_breaks"], "resolvedBoundaries": flow.get("boundaries", []),
        "fullAuthoritativeTextSha256": hashlib.sha256(
            "\n\n".join([lesson["printed_title"], *[block["text"] for block in lesson["prose"]]]).encode()
        ).hexdigest(),
        "nativeAuthorCheck": {
            "status": "pass" if not errors else "fail",
            "scope": "One source/identity/text/formula/number/errata and final prose_flow author check, not an independent science gate.",
            "errors": errors, "mathWarnings": math_warnings,
            "normalizationStable": normalized == lesson,
            "sourceSnapshotRefsOrderAndOriginalEquationPreserved": not errors,
            "exerciseAndFigureTemplatesByteUnchanged": True,
        },
        "authorScienceContextForMain": [
            "Initial-neutrality and charge-isolated-system qualifiers replace the original unconditional zero-total claim.",
            "Equal-opposite pair creation/annihilation remains an illustrative possibility, not a universal restriction on particle processes or individual products.",
            "The final sentence about unknown cause remains a scoped historical attribution, not a current universal claim. No modern numerical reference value, theorem or new equation added.",
        ],
        "sourceErrataAdded": [], "confirmedQuantitativeSourceErrors": [],
        "independentScience": "pending Main's unique gate",
        "limits": "Six-block author-only candidate. No source/pixel review, invented tasks/figures, answer/choice read, SCI self-approval, finalize/publish, app/tool/dependency/DB/git/browser change.",
        "inFlightProcesses": [],
    }
    edition.dump(FREEZE, report)
    print(f"author_structural={'PASS' if not errors else 'FAIL'} blocks=6 paragraphs={report['normalizedParagraphs']} math={report['mathFragments']} tasks=0 figures=0 errors={json.dumps(errors, ensure_ascii=False)}")
    print(f"freeze={FREEZE.relative_to(ROOT)} sha256={edition.sha256(FREEZE)}")
    print(f"template_sha256={edition.sha256(LESSON)}")
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
