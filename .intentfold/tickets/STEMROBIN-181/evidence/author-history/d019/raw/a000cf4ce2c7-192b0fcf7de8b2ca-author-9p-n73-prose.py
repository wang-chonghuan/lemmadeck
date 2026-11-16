"""Normalize and freeze n73 prose; structural author checks only."""

import copy
import json
from pathlib import Path
import re
import subprocess
import sys

ROOT = Path.cwd()
TMP = Path(__file__).resolve().parent
TOOLS = ROOT / ".claude/skills/ld-s10y-lesson/tools"
sys.path.insert(0, str(TOOLS))
import edition

CARD = "phy9-c2-s2-n73"
BOOK = ROOT / "ssot-resources/soviet10year-textbooks/artifacts/9p"
SOURCE = BOOK / "lessons" / CARD
WORK = ROOT / ".tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons" / CARD
BEFORE = TMP / "9p-n73-before"
FREEZE = TMP / "9p-n73-prose-freeze.json"
NAMES = ("lesson.template.json", "exercises.template.json", "figures.template.json")
STARTS = ("**匀强电场中的功**", "**功与电势能变化**", "**电势能零点**")


def bind(file):
    return {"path": file.relative_to(ROOT).as_posix(), "sha256": edition.sha256(file)}


def fresh_json(file, value):
    assert not file.exists(), f"Preserve existing evidence: {file}"
    edition.dump(file, value)


def snapshot():
    assert not BEFORE.exists() and not FREEZE.exists()
    BEFORE.mkdir()
    record = {"lesson": CARD, "templates": {}, "source": {}, "helper": bind(Path(__file__).resolve())}
    for name in NAMES:
        active, saved = WORK / name, BEFORE / name
        saved.write_bytes(active.read_bytes())
        assert edition.sha256(saved) == edition.sha256(active)
        record["templates"][name] = {
            **bind(saved), "originalPath": active.relative_to(ROOT).as_posix(),
        }
    for name in ("lesson.json", "lesson.md", "exercises.json"):
        record["source"][name] = bind(SOURCE / name)
    fresh_json(BEFORE / "bindings.json", record)
    print(json.dumps(record, ensure_ascii=False, indent=2))


def inputs():
    record = edition.load(BEFORE / "bindings.json")
    for item in [*record["templates"].values(), *record["source"].values()]:
        assert edition.sha256(ROOT / item["path"]) == item["sha256"], item["path"]
    return (
        record, edition.load(BEFORE / NAMES[0]),
        edition.load(SOURCE / "lesson.json"), edition.load(SOURCE / "exercises.json"),
    )


def layout():
    assert not FREEZE.exists()
    _, before, raw, _ = inputs()
    lesson = edition.load(WORK / NAMES[0])
    assert lesson["source"] == before["source"] and lesson["source"]["data"] == raw
    assert lesson["section_breaks"] == []
    edition.normalize_lesson_layout(lesson)
    edition.dump(WORK / NAMES[0], lesson)
    result = subprocess.run(
        ["node", str(TOOLS / "prose_flow.mjs"), str(WORK / NAMES[0])],
        capture_output=True, text=True, check=True,
    )
    evidence = TMP / "9p-n73-native-prose-flow.txt"
    assert not evidence.exists()
    evidence.write_text(result.stdout)
    candidates = [
        json.loads(line.split("break: ", 1)[1])
        for line in result.stdout.splitlines() if line.startswith("    break: ")
    ]
    boundaries = []
    for start in STARTS:
        matches = [boundary for boundary in candidates if boundary["after"].startswith(start)]
        assert len(matches) == 1, f"Native adjacent boundary is not unique: {start}"
        boundaries.append(matches[0])
    lesson["section_breaks"] = boundaries
    edition.dump(WORK / NAMES[0], lesson)
    print(result.stdout)
    print("Copied native adjacent-paragraph anchors; no hand-counted boundaries.")


def freeze():
    assert not FREEZE.exists(), "One author structural check; do not overwrite its freeze."
    record, before, raw, raw_exercises = inputs()
    lesson = edition.load(WORK / NAMES[0])
    exercises = edition.load(WORK / NAMES[1])
    profile_file = TOOLS.parent / "profiles/modern-us-neutral.json"
    profile = edition.load(profile_file)
    forbidden = profile["forbidden_terms"] + profile["forbidden_person_names"]
    errors = edition.validate_source(BOOK, lesson["source"], SOURCE / "lesson.json", "lesson")
    errors += edition.validate_source(BOOK, exercises["source"], SOURCE / "exercises.json", "exercises")
    errors += edition.validate_identity_fields(raw, lesson, edition.IDENTITY_FIELDS, "lesson")
    corrections, errata_errors = edition.validate_errata(BOOK, raw, raw_exercises, lesson, exercises)
    errors += errata_errors
    assert lesson["source"] == before["source"] and lesson["source"]["data"] == raw
    assert len(raw["prose"]) == len(lesson["prose"]) == 22
    assert raw["exercise_count"] == raw_exercises["count"] == exercises["count"] == 0
    assert raw_exercises["exercises"] == exercises["exercises"] == []
    assert lesson["figures"] == before["figures"] == raw["figures"]
    assert len(lesson["figures"]) == 2
    assert lesson["errata"] == before["errata"] == []
    for name in NAMES[1:]:
        assert edition.sha256(WORK / name) == record["templates"][name]["sha256"], name
    mappings = []
    for index, (original, modern) in enumerate(zip(raw["prose"], lesson["prose"])):
        label = f"lesson.prose[{index}]"
        errors += edition.validate_identity_fields(
            original, modern, ("kind", "id", "label", "printed_page", "source_refs"), label,
        )
        assert modern["source_text"] == original["text"]
        errors += edition.validate_text(
            original["text"], modern["text"], modern["changes"], modern["numeric_changes"],
            label, forbidden, modern["historical_entities"], corrections.get(label),
            modern.get("notation_changes"),
        )
        math_atoms = lambda text: [match.group(0) for match in edition.MATH.finditer(text)]
        digits = lambda text: re.findall(r"\d+", edition.MATH.sub("", text))
        source_math, modern_math = math_atoms(original["text"]), math_atoms(modern["text"])
        source_digits, modern_digits = digits(original["text"]), digits(modern["text"])
        if source_math != modern_math:
            errors.append(f"{label}: exact source math atom drift")
        if source_digits != modern_digits:
            errors.append(f"{label}: exact literal numeric token drift")
        if original["kind"] in ("fig", "cap"):
            assert modern == before["prose"][index], f"Figure/caption block changed: {label}"
        mappings.append({
            "target": label, "kind": original["kind"], "source_refs": original["source_refs"],
            "source_text": original["text"], "modern_text": modern["text"],
            "source_math": source_math, "modern_math": modern_math,
            "exact_math_atoms_unchanged": source_math == modern_math,
            "source_literal_digits_outside_math": source_digits,
            "modern_literal_digits_outside_math": modern_digits,
            "literal_numeric_tokens_unchanged": source_digits == modern_digits,
            "changes": modern["changes"], "numeric_changes": modern["numeric_changes"],
            "historical_entities": modern["historical_entities"],
        })
    normalized = copy.deepcopy(lesson)
    edition.normalize_lesson_layout(normalized)
    if normalized != lesson:
        errors.append("Native normalization is not stable")
    flow, flow_errors = edition.prose_flow_contract(lesson["prose"], lesson["section_breaks"])
    errors += flow_errors
    assert len(lesson["section_breaks"]) == len(STARTS)
    assert [
        {"before": boundary["before"], "after": boundary["after"]}
        for boundary in flow["boundaries"]
    ] == lesson["section_breaks"]
    output = (
        f"author_structural={'PASS' if not errors else 'FAIL'} card={CARD} "
        f"source_blocks=22 modern_paragraphs={len(flow['paragraphs'])} tasks=0 "
        f"source_figures=2 section_breaks={len(lesson['section_breaks'])} "
        f"errors={json.dumps(errors, ensure_ascii=False)}"
    )
    pages = sorted({int(ref.split("#")[0][1:]) for block in raw["prose"] for ref in block["source_refs"]})
    paths = {
        "sourceLesson": SOURCE / "lesson.json", "sourceMarkdown": SOURCE / "lesson.md",
        "sourceExercises": SOURCE / "exercises.json", "lessonTemplate": WORK / NAMES[0],
        "exercisesTemplate": WORK / NAMES[1], "figuresTemplate": WORK / NAMES[2],
        "beforeBindings": BEFORE / "bindings.json", "helper": Path(__file__).resolve(),
        "nativeProseFlowEvidence": TMP / "9p-n73-native-prose-flow.txt",
        "lessonSkill": TOOLS.parent / "SKILL.md",
        "textContract": TOOLS.parent / "references/edition-text-contract.md",
        "nativeEdition": TOOLS / "edition.py", "nativeProseFlow": TOOLS / "prose_flow.mjs",
        "nativeHtmlFragment": TOOLS / "htmlfrag.js", "profile": profile_file,
    }
    report = {
        "ticket": "STEMROBIN-181", "batch": "D019", "lesson": CARD,
        "role": "modern-prose-author-only",
        "status": "author-frozen-awaiting-independent-science" if not errors else "author-structural-blocked",
        "bindings": {key: bind(file) for key, file in paths.items()},
        "before": record["templates"],
        "sourcePages": [bind(BOOK / "pages" / f"{page:04d}" / "page.json") for page in pages],
        "prepare": {"performedByMain": True, "repeatedByThisAuthor": False},
        "sourceBlocks": 22, "modernParagraphs": len(flow["paragraphs"]),
        "originalTasks": 0, "modernTasks": 0, "sourceFigures": raw["figures"],
        "mapping": mappings, "sectionBreaks": lesson["section_breaks"], "nativeProseFlow": flow,
        "boundaries": {
            "firstSourceRefs": raw["prose"][0]["source_refs"],
            "lastSourceRefs": raw["prose"][-1]["source_refs"],
            "sourcePhysicalPages": pages, "sourcePrintedPages": [page - 9 for page in pages],
            "allSourceBlocksRetainedInOrder": True, "unit73Complete": True,
        },
        "nativeAuthorCheck": {
            "command": ".claude/skills/ld-s10y-lesson/.venv/bin/python -B .intentfold/tickets/STEMROBIN-181/tmp/author-9p-n73-prose.py freeze",
            "invocations": 1, "status": "pass" if not errors else "fail", "output": output, "errors": errors,
            "scope": "Source/identity/registered-errata/text/math/number/normalization/anchors only; not an independent science or figure gate.",
            "sourceSnapshotsRefsMathNumbersUnchanged": not errors,
            "zeroTaskExerciseTemplateBytesUnchanged": True,
            "figuresTemplateBytesUnchangedAndNotAuthored": True,
            "figureCaptionProseBlocksUnchanged": True,
        },
        "changeRationale": [
            "Treat electrostatic potential energy as interaction energy of the charge/source system, not an isolated charge property.",
            "Contextualize the source's atomic/chemical and nuclear examples: microscopic binding needs quantum mechanics, and reactor release is not simply depletion of stored electrostatic energy.",
            "Specify a fixed external static field, negligible probe disturbance, and neglect of radiation/self-field effects.",
            "Use the central region between large parallel fixed-source plates as an approximately uniform field; preserve source plate signs, orientation, point identities and all original formulas.",
            "For arbitrary paths, sum signed field-parallel displacement, not unsigned total length; construction staircases are not asserted particle trajectories.",
            "Distinguish electric work from external work; identify kinetic-energy change only under the stated energy-transfer assumptions.",
            "Retain closed-path zero work, arbitrary potential-energy reference, signed charge and negative potential values with the source zero convention.",
            "Leave both figure placeholders/captions and the empty written-task template untouched; no new formulas, numeric data or errata.",
        ],
        "errata": lesson["errata"], "blockers": errors,
        "remaining": ["Main independent SCI", "Main-assigned figure authorship/gates", "Main finalization and surfaces"],
        "runningCommandsAtFreeze": [],
    }
    fresh_json(FREEZE, report)
    print(output)
    print(json.dumps({"freeze": bind(FREEZE), "lessonTemplate": bind(WORK / NAMES[0])}, indent=2))
    if errors:
        raise SystemExit(2)


if __name__ == "__main__":
    assert len(sys.argv) == 2 and sys.argv[1] in ("snapshot", "layout", "freeze")
    {"snapshot": snapshot, "layout": layout, "freeze": freeze}[sys.argv[1]]()
