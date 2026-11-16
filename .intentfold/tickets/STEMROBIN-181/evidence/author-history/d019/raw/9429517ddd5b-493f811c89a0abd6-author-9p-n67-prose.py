"""Snapshot, normalize and freeze n67 text only; no independent approval."""

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

CARD = "phy9-c2-s2-n67"
BOOK = ROOT / "ssot-resources/soviet10year-textbooks/artifacts/9p"
SOURCE = BOOK / "lessons" / CARD
WORK = ROOT / ".tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons" / CARD
BEFORE = TMP / "9p-n67-before"
NAMES = ("lesson.template.json", "exercises.template.json", "figures.template.json")
SECTION_STARTS = ("**电场强度**", "**点电荷的电场强度**", "**场的叠加原理**")


def bind(file):
    return {"path": file.relative_to(ROOT).as_posix(), "sha256": edition.sha256(file)}


def new_json(file, value):
    assert not file.exists(), f"Preserve existing evidence: {file}"
    edition.dump(file, value)


def snapshot():
    assert not BEFORE.exists(), "Do not replace before snapshots"
    assert not (TMP / "9p-n67-prose-freeze.json").exists()
    BEFORE.mkdir()
    record = {"lesson": CARD, "templates": {}, "source": {}, "helper": bind(Path(__file__).resolve())}
    for name in NAMES:
        active = WORK / name
        saved = BEFORE / name
        saved.write_bytes(active.read_bytes())
        assert edition.sha256(saved) == edition.sha256(active)
        record["templates"][name] = {
            **bind(saved), "metadata": {"original": active.relative_to(ROOT).as_posix()},
        }
    for name in ("lesson.json", "lesson.md", "exercises.json"):
        record["source"][name] = bind(SOURCE / name)
    new_json(BEFORE / "bindings.json", record)
    print(json.dumps(record, ensure_ascii=False, indent=2))


def inputs():
    record = edition.load(BEFORE / "bindings.json")
    for name, item in record["templates"].items():
        assert edition.sha256(BEFORE / name) == item["sha256"], f"Before snapshot drift: {name}"
    for item in record["source"].values():
        assert edition.sha256(ROOT / item["path"]) == item["sha256"], f"Source drift: {item['path']}"
    before = edition.load(BEFORE / "lesson.template.json")
    raw = edition.load(SOURCE / "lesson.json")
    raw_exercises = edition.load(SOURCE / "exercises.json")
    assert raw["exercise_count"] == raw_exercises["count"] == 0
    assert raw_exercises["exercises"] == []
    return record, before, raw, raw_exercises


def layout():
    assert not (TMP / "9p-n67-prose-freeze.json").exists()
    _, before, raw, _ = inputs()
    lesson = edition.load(WORK / "lesson.template.json")
    assert lesson["source"] == before["source"] and lesson["source"]["data"] == raw
    assert lesson["section_breaks"] == []
    assert len(lesson["prose"]) == len(raw["prose"])
    for index, (original, modern) in enumerate(zip(raw["prose"], lesson["prose"])):
        assert modern["source_text"] == original["text"]
        assert modern["source_refs"] == original["source_refs"]
        if original["kind"] in ("fig", "cap"):
            assert modern == before["prose"][index]
            continue
        if modern["text"] != original["text"]:
            modern["changes"] = ["wording", "layout", "conditions"]
    edition.normalize_lesson_layout(lesson)
    edition.dump(WORK / "lesson.template.json", lesson)
    result = subprocess.run(
        ["node", str(TOOLS / "prose_flow.mjs"), str(WORK / "lesson.template.json")],
        text=True, capture_output=True, check=True,
    )
    flow_evidence = TMP / "9p-n67-native-prose-flow.txt"
    assert not flow_evidence.exists()
    flow_evidence.write_text(result.stdout)
    candidates = [
        json.loads(line.split("break: ", 1)[1])
        for line in result.stdout.splitlines() if line.startswith("    break: ")
    ]
    boundaries = []
    for start in SECTION_STARTS:
        matches = [item for item in candidates if item["after"].startswith(start)]
        assert len(matches) == 1, f"Native paragraph boundary not unique: {start}"
        boundaries.append(matches[0])
    lesson["section_breaks"] = boundaries
    edition.dump(WORK / "lesson.template.json", lesson)
    print(result.stdout)
    print("Copied three native adjacent-paragraph anchors; no integer boundary authored.")


def freeze():
    target = TMP / "9p-n67-prose-freeze.json"
    assert not target.exists(), "Do not overwrite author freeze or rerun structural check"
    record, before, raw, raw_exercises = inputs()
    lesson = edition.load(WORK / "lesson.template.json")
    exercises = edition.load(WORK / "exercises.template.json")
    profile_file = TOOLS.parent / "profiles/modern-us-neutral.json"
    profile = edition.load(profile_file)
    forbidden = profile["forbidden_terms"] + profile["forbidden_person_names"]
    errors = edition.validate_source(BOOK, lesson["source"], SOURCE / "lesson.json", "lesson")
    errors += edition.validate_source(BOOK, exercises["source"], SOURCE / "exercises.json", "exercises")
    errors += edition.validate_identity_fields(raw, lesson, edition.IDENTITY_FIELDS, "lesson")
    _, errata_errors = edition.validate_errata(BOOK, raw, raw_exercises, lesson, exercises)
    errors += errata_errors
    assert lesson["source"] == before["source"] and lesson["source"]["data"] == raw
    assert exercises == edition.load(BEFORE / "exercises.template.json")
    assert edition.sha256(WORK / "exercises.template.json") == record["templates"]["exercises.template.json"]["sha256"]
    assert len(lesson["prose"]) == len(raw["prose"])
    assert raw["exercise_count"] == exercises["count"] == 0 and exercises["exercises"] == []
    assert lesson["figures"] == raw["figures"] == before["figures"]
    assert lesson["errata"] == before["errata"] == []
    mappings = []
    for index, (original, modern) in enumerate(zip(raw["prose"], lesson["prose"])):
        label = f"lesson.prose[{index}]"
        errors += edition.validate_identity_fields(
            original, modern, ("kind", "id", "label", "printed_page", "source_refs"), label,
        )
        assert modern["source_text"] == original["text"]
        errors += edition.validate_text(
            original["text"], modern["text"], modern["changes"], modern["numeric_changes"],
            label, forbidden, modern["historical_entities"],
        )
        original_math = [match.group(0) for match in edition.MATH.finditer(original["text"])]
        modern_math = [match.group(0) for match in edition.MATH.finditer(modern["text"])]
        literal_digits = lambda text: re.findall(r"\d+", edition.MATH.sub("", text))
        original_digits, modern_digits = literal_digits(original["text"]), literal_digits(modern["text"])
        if original_math != modern_math:
            errors.append(f"{label}: exact math atom drift")
        if original_digits != modern_digits:
            errors.append(f"{label}: literal nonmath numeric drift")
        if original["kind"] in ("fig", "cap"):
            assert modern == before["prose"][index], f"Figure/caption placeholder changed: {label}"
        mappings.append({
            "target": label, "kind": original["kind"], "source_refs": original["source_refs"],
            "source_text": original["text"], "modern_text": modern["text"],
            "source_snapshot_unchanged": True,
            "source_math": original_math, "modern_math": modern_math,
            "exact_math_atoms_unchanged": original_math == modern_math,
            "source_number_signature": edition.number_signature(original["text"]),
            "modern_number_signature": edition.number_signature(modern["text"]),
            "source_literal_digits_outside_math": original_digits,
            "modern_literal_digits_outside_math": modern_digits,
            "literal_digits_unchanged": original_digits == modern_digits,
            "changes": modern["changes"], "numeric_changes": modern["numeric_changes"],
            "historical_entities": modern["historical_entities"],
        })
    normalized = copy.deepcopy(lesson)
    edition.normalize_lesson_layout(normalized)
    if normalized != lesson:
        errors.append("Native lesson normalization is not stable")
    flow, flow_errors = edition.prose_flow_contract(lesson["prose"], lesson["section_breaks"])
    errors += flow_errors
    assert len(lesson["section_breaks"]) == len(SECTION_STARTS)
    assert [dict(before=item["before"], after=item["after"]) for item in flow["boundaries"]] == lesson["section_breaks"]
    output = (
        f"author_structural={'PASS' if not errors else 'FAIL'} card={CARD} "
        f"source_blocks={len(raw['prose'])} modern_paragraphs={len(flow['paragraphs'])} "
        f"tasks=0 source_figures=2 section_breaks={len(lesson['section_breaks'])} "
        f"errors={json.dumps(errors, ensure_ascii=False)}"
    )
    paths = {
        "sourceLesson": SOURCE / "lesson.json", "sourceMarkdown": SOURCE / "lesson.md",
        "sourceExercises": SOURCE / "exercises.json", "lessonTemplate": WORK / "lesson.template.json",
        "exercisesTemplate": WORK / "exercises.template.json", "figuresTemplate": WORK / "figures.template.json",
        "helper": Path(__file__).resolve(), "beforeBindings": BEFORE / "bindings.json",
        "nativeProseFlowEvidence": TMP / "9p-n67-native-prose-flow.txt",
        "lessonSkill": TOOLS.parent / "SKILL.md",
        "textContract": TOOLS.parent / "references/edition-text-contract.md",
        "profile": profile_file, "nativeEdition": TOOLS / "edition.py",
        "nativeProseFlow": TOOLS / "prose_flow.mjs", "nativeHtmlFragment": TOOLS / "htmlfrag.js",
    }
    source_pages = sorted({int(ref.split("#")[0][1:]) for block in raw["prose"] for ref in block["source_refs"]})
    figure_template_same = edition.sha256(WORK / "figures.template.json") == record["templates"]["figures.template.json"]["sha256"]
    report = {
        "ticket": "STEMROBIN-181", "batch": "D019", "lesson": CARD,
        "role": "modern-prose-author-only",
        "status": "author-frozen-awaiting-independent-science" if not errors else "author-structural-blocked",
        "bindings": {key: bind(file) for key, file in paths.items()},
        "before": record["templates"],
        "sourcePages": [bind(BOOK / "pages" / f"{page:04d}" / "page.json") for page in source_pages],
        "prepare": {"performedByMain": True, "repeatedByThisAuthor": False},
        "sourceBlocks": len(raw["prose"]), "modernParagraphs": len(flow["paragraphs"]),
        "originalTasks": 0, "modernTasks": 0, "sourceFigures": raw["figures"],
        "mapping": mappings, "sectionBreaks": lesson["section_breaks"], "nativeProseFlow": flow,
        "boundaries": {
            "firstSourceRefs": raw["prose"][0]["source_refs"],
            "lastSourceRefs": raw["prose"][-1]["source_refs"],
            "sourcePhysicalPages": source_pages, "sourcePrintedPages": [page - 9 for page in source_pages],
            "allSourceBlocksRetainedInOrder": True, "unit67Complete": True,
            "unit66OrPage167ApprovalClaimed": False,
        },
        "nativeAuthorCheck": {
            "command": ".claude/skills/ld-s10y-lesson/.venv/bin/python -B .intentfold/tickets/STEMROBIN-181/tmp/author-9p-n67-prose.py freeze",
            "invocations": 1, "status": "pass" if not errors else "fail",
            "output": output, "errors": errors,
            "scope": "Native source/identity/errata/text and prose-flow structural checks only; no figure readiness or independent science gate.",
            "sourceSnapshotsRefsMathNumbersUnchanged": not errors,
            "zeroTaskExerciseTemplateBytesUnchanged": True,
            "figureCaptionProseBlocksUnchanged": True,
            "figuresTemplateNotWrittenByThisAuthor": True,
            "figuresTemplateBytesMatchBeforeAtFreeze": figure_template_same,
        },
        "changeRationale": [
            "Keep the source's experimental origin of the field concept without claiming one force measurement determines every field property.",
            "Define electrostatics in a selected reference frame and distinguish time-dependent electric fields and induction without severing their relation to sources.",
            "Specify a small, nonzero test charge with negligible disturbance of the original source distribution, and separate electric force from other forces.",
            "Retain signed vector relations and explain positive/negative force directions without treating field strength magnitude as a signed scalar.",
            "Keep equation8-13 unchanged and explicitly select a positive test charge for F/q0; for negative probes, explain that magnitudes require the absolute charge.",
            "State the ideal homogeneous linear isotropic dielectric and neglected boundary/local-size conditions, and distinguish SI from the original CGSE convention.",
            "Interpret superposition as vector addition at one observation point for fixed source distributions in a linear electrostatic model, not absence of charge interactions.",
            "Retain both figure placeholders/captions, every source identity/reference, all exact math atoms and labels, and zero source tasks."
        ],
        "errata": lesson["errata"],
        "conditionalSourceFormula": {
            "target": "p0169#11",
            "original": "$E=\\frac{F}{q_0}=\\frac{|q|}{4\\pi\\varepsilon_0\\varepsilon r^2}$",
            "math_atom_changed": False,
            "positive_probe_condition_in": ["p0169#8", "p0169#10"],
            "negative_probe_magnitude_caveat_in": "p0169#10",
            "unqualified_negative_probe_reading_not_adopted": True,
            "registered_erratum_invented": False,
            "independent_science_decision_pending": True,
        },
        "remaining": ["Main independent science gate", "Independent figure authorship/gates for113/114", "Main native finalization and surface verification"],
        "blockers": errors,
        "sourceFiguresNotAuthored": True,
        "no_independent_science_source_or_figure_approval": True,
        "no_finalize_render_browser_db_promotion_commit_or_full_tests": True,
        "inFlightProcesses": [],
    }
    new_json(target, report)
    print(output)
    print(f"freeze={target.relative_to(ROOT)} sha256={edition.sha256(target)}")
    if errors:
        raise SystemExit(1)


if sys.argv[1:] == ["snapshot"]:
    snapshot()
elif sys.argv[1:] == ["layout"]:
    layout()
elif sys.argv[1:] == ["freeze"]:
    freeze()
else:
    raise SystemExit("Expected snapshot, layout or freeze")
