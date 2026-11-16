"""n74 prose snapshot, native layout and one author structural freeze only."""

import copy
import json
from pathlib import Path
import re
import shutil
import subprocess
import sys

ROOT = Path.cwd()
TMP = Path(__file__).resolve().parent
TOOLS = ROOT / ".claude/skills/ld-s10y-lesson/tools"
sys.path.insert(0, str(TOOLS))
import edition

CARD = "phy9-c2-s2-n74"
BOOK = ROOT / "ssot-resources/soviet10year-textbooks/artifacts/9p"
SOURCE = BOOK / "lessons" / CARD
WORK = ROOT / ".tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons" / CARD
BEFORE = TMP / "9p-n74-before"
NAMES = ("lesson.template.json", "exercises.template.json", "figures.template.json")
STARTS = ("**电势**", "**电势差**", "**电势差的单位**")


def bind(file):
    return {"path": file.relative_to(ROOT).as_posix(), "sha256": edition.sha256(file)}


def new_json(file, value):
    assert not file.exists(), f"Preserve existing evidence: {file}"
    edition.dump(file, value)


def snapshot():
    assert not BEFORE.exists()
    assert not (TMP / "9p-n74-prose-freeze.json").exists()
    BEFORE.mkdir()
    record = {"lesson": CARD, "templates": {}, "source": {}}
    for name in NAMES:
        shutil.copyfile(WORK / name, BEFORE / name)
        record["templates"][name] = {**bind(BEFORE / name), "original": bind(WORK / name)}
        assert record["templates"][name]["sha256"] == record["templates"][name]["original"]["sha256"]
    for name in ("lesson.json", "lesson.md", "exercises.json"):
        record["source"][name] = bind(SOURCE / name)
    new_json(BEFORE / "bindings.json", record)
    print(json.dumps(record, ensure_ascii=False, indent=2))


def inputs():
    record = edition.load(BEFORE / "bindings.json")
    for name, item in record["templates"].items():
        assert edition.sha256(BEFORE / name) == item["sha256"]
    for item in record["source"].values():
        assert edition.sha256(ROOT / item["path"]) == item["sha256"]
    raw = edition.load(SOURCE / "lesson.json")
    raw_exercises = edition.load(SOURCE / "exercises.json")
    assert len(raw["prose"]) == 25
    assert raw["exercise_count"] == raw_exercises["count"] == 0
    assert raw["figures"] == [] and raw_exercises["exercises"] == []
    return record, edition.load(BEFORE / "lesson.template.json"), raw, raw_exercises


def layout():
    _, before, raw, _ = inputs()
    lesson = edition.load(WORK / "lesson.template.json")
    assert lesson["source"] == before["source"] and lesson["source"]["data"] == raw
    assert lesson["section_breaks"] == []
    for original, modern in zip(raw["prose"], lesson["prose"]):
        assert modern["source_text"] == original["text"]
        modern["changes"] = (
            ["wording", "conditions", "layout"] if modern["text"] != original["text"] else ["layout"]
        )
    edition.normalize_lesson_layout(lesson)
    edition.dump(WORK / "lesson.template.json", lesson)
    result = subprocess.run(
        ["node", str(TOOLS / "prose_flow.mjs"), str(WORK / "lesson.template.json")],
        capture_output=True, text=True, check=True,
    )
    evidence = TMP / "9p-n74-native-prose-flow.txt"
    assert not evidence.exists()
    evidence.write_text(result.stdout)
    candidates = [
        json.loads(line.split("break: ", 1)[1])
        for line in result.stdout.splitlines() if line.startswith("    break: ")
    ]
    boundaries = []
    for start in STARTS:
        matches = [item for item in candidates if item["after"].startswith(start)]
        assert len(matches) == 1, start
        boundaries.append(matches[0])
    lesson["section_breaks"] = boundaries
    edition.dump(WORK / "lesson.template.json", lesson)
    print(result.stdout)
    print("Copied three actual native adjacent-paragraph boundaries.")


def freeze():
    target = TMP / "9p-n74-prose-freeze.json"
    assert not target.exists(), "One author structural check; never rerun frozen gate"
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
    assert len(lesson["prose"]) == len(raw["prose"])
    assert lesson["figures"] == before["figures"] == []
    assert lesson["errata"] == before["errata"] == []
    for name in ("exercises.template.json", "figures.template.json"):
        assert edition.sha256(WORK / name) == record["templates"][name]["sha256"]
    coverage = []
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
        source_atoms = [match.group(0) for match in edition.MATH.finditer(original["text"])]
        modern_atoms = [match.group(0) for match in edition.MATH.finditer(modern["text"])]
        outside_digits = lambda text: re.findall(r"\d+", edition.MATH.sub("", text))
        same_math = source_atoms == modern_atoms
        same_digits = outside_digits(original["text"]) == outside_digits(modern["text"])
        if not same_math:
            errors.append(f"{label}: exact original math atom drift")
        if not same_digits:
            errors.append(f"{label}: nonmath number order drift")
        coverage.append({
            "block": index + 1, "source_refs": original["source_refs"],
            "source_snapshot_identity_retained": True,
            "exact_math_atoms_retained": same_math,
            "math_atom_count": len(source_atoms),
            "nonmath_number_sequence_retained": same_digits,
        })
    normalized = copy.deepcopy(lesson)
    edition.normalize_lesson_layout(normalized)
    if normalized != lesson:
        errors.append("Native prose normalization is not stable")
    flow, flow_errors = edition.prose_flow_contract(lesson["prose"], lesson["section_breaks"])
    errors += flow_errors
    assert len(lesson["section_breaks"]) == len(STARTS)
    assert [dict(before=item["before"], after=item["after"]) for item in flow["boundaries"]] == lesson["section_breaks"]
    unchanged_equation = "$A=-(E_{P_2}-E_P)=-q(U_2-U_1)=-q\\Delta U$"
    assert unchanged_equation in lesson["prose"][11]["text"]
    assert "起点的电势能" in lesson["prose"][11]["text"]
    paths = {
        "sourceLesson": SOURCE / "lesson.json", "sourceMarkdown": SOURCE / "lesson.md",
        "sourceExercises": SOURCE / "exercises.json", "lessonTemplate": WORK / "lesson.template.json",
        "exercisesTemplate": WORK / "exercises.template.json", "figuresTemplate": WORK / "figures.template.json",
        "beforeBindings": BEFORE / "bindings.json", "helper": Path(__file__).resolve(),
        "nativeProseFlow": TMP / "9p-n74-native-prose-flow.txt",
        "nativeEdition": TOOLS / "edition.py", "nativeHtmlFragment": TOOLS / "htmlfrag.js",
        "nativeFlowTool": TOOLS / "prose_flow.mjs", "profile": profile_file,
        "lessonSkill": TOOLS.parent / "SKILL.md",
        "textContract": TOOLS.parent / "references/edition-text-contract.md",
    }
    report = {
        "ticket": "STEMROBIN-181", "batch": "D019", "lesson": CARD,
        "role": "modern-prose-author-only",
        "status": "author-frozen-awaiting-independent-science" if not errors else "author-structural-blocked",
        "bindings": {key: bind(file) for key, file in paths.items()},
        "before": record["templates"],
        "sourcePages": [bind(BOOK / "pages" / f"{page:04d}" / "page.json") for page in (184, 185, 186)],
        "sourceBlocks": 25, "modernParagraphs": len(flow["paragraphs"]),
        "sourceTasks": 0, "modernTasks": 0, "sourceFigures": [], "modernFigures": [],
        "sourceCoverage": coverage, "sectionBreaks": lesson["section_breaks"],
        "nativeAuthorCheck": {
            "invocations": 1, "status": "pass" if not errors else "fail", "errors": errors,
            "scope": "Source/identity/text/errata/normalization/prose-flow author structure only, not independent SCI.",
            "normalizedLayoutStable": normalized == lesson,
            "zeroTaskAndZeroFigureTemplatesUnwritten": True,
        },
        "equation8_25": {
            "source_ref": "p0185#5", "original": unchanged_equation,
            "modernMathIdentical": True,
            "unindexedSecondTerm": "E_P",
            "interpretation": "This equation explicitly uses the unindexed second energy term for starting energy.",
            "newErratumOrMathCorrection": False,
        },
        "authorConditions": [
            "Fixed electrostatic sources, negligible probe disturbance, nonzero signed charge and a common energy reference.",
            "Electric-field work only; energy conservation alone is not treated as proof that all fields are conservative.",
            "Uniform plate-field model, ignored edge effects and the distance direction fixed from negative to positive plate.",
            "Potential is a scalar with a chosen reference; potential differences and their specified endpoint order are reference-independent.",
            "Lighting/current illustration scoped to circuit portions treated by the electrostatic model, not arbitrary induction or source-internal work.",
            "Original SI/CGSE unit formulas preserved; the printed conversion is explicitly approximate.",
        ],
        "errata": [],
        "prepareRepeated": False, "affectedCorrectionsUsed": 0,
        "remaining": ["Main-delegated independent SCI", "Main finalization and surface checks"],
        "noIndependentScienceApproval": True,
        "noSourceDurableFigureFinalizeRenderBrowserDBGitOrFullChecks": True,
        "inFlightProcesses": [],
    }
    new_json(target, report)
    print(json.dumps({
        "freeze": bind(target), "status": report["status"],
        "template": bind(WORK / "lesson.template.json"),
        "sourceBlocks": 25, "modernParagraphs": report["modernParagraphs"],
        "sectionBreaks": len(lesson["section_breaks"]), "errors": errors,
    }, ensure_ascii=False, indent=2))
    if errors:
        raise SystemExit(1)


if sys.argv[1:] == ["snapshot"]:
    snapshot()
elif sys.argv[1:] == ["layout"]:
    layout()
elif sys.argv[1:] == ["freeze"]:
    freeze()
else:
    raise SystemExit("Expected snapshot, layout or freeze only")
