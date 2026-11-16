"""Scoped n71 author snapshots, native flow and one read-only text check."""

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

CARD = "phy9-c2-s2-n71"
BOOK = ROOT / "ssot-resources/soviet10year-textbooks/artifacts/9p"
SOURCE = BOOK / "lessons" / CARD
WORK = ROOT / ".tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons" / CARD
BEFORE = TMP / "9p-n71-before"
TARGET = TMP / "9p-n71-prose-freeze.json"
NAMES = ("lesson.template.json", "exercises.template.json", "figures.template.json")
STARTS = (
    "**电介质中的电场**",
    "**验电器的定性演示**",
    "**原子和分子的电性质**",
    "**离子对与电偶极子**",
    "**分子电介质的两类**",
)


def bind(file):
    return {"path": file.relative_to(ROOT).as_posix(), "sha256": edition.sha256(file)}


def save_new(file, value):
    assert not file.exists(), f"Preserve existing evidence: {file}"
    edition.dump(file, value)


def snapshot():
    assert not BEFORE.exists() and not TARGET.exists()
    BEFORE.mkdir()
    record = {"lesson": CARD, "templates": {}, "source": {}, "helper": bind(Path(__file__).resolve())}
    for name in NAMES:
        active, saved = WORK / name, BEFORE / name
        saved.write_bytes(active.read_bytes())
        assert edition.sha256(saved) == edition.sha256(active)
        record["templates"][name] = {
            **bind(saved), "metadata": {"original": active.relative_to(ROOT).as_posix()},
        }
    for name in ("lesson.json", "lesson.md", "exercises.json"):
        record["source"][name] = bind(SOURCE / name)
    save_new(BEFORE / "bindings.json", record)
    print(json.dumps(record, ensure_ascii=False, indent=2))


def inputs():
    record = edition.load(BEFORE / "bindings.json")
    for name, item in record["templates"].items():
        assert edition.sha256(BEFORE / name) == item["sha256"]
    for item in record["source"].values():
        assert edition.sha256(ROOT / item["path"]) == item["sha256"], f"Source drift: {item['path']}"
    assert edition.sha256(Path(__file__).resolve()) == record["helper"]["sha256"]
    return record, edition.load(BEFORE / "lesson.template.json"), edition.load(SOURCE / "lesson.json")


def layout():
    assert not TARGET.exists()
    _, before, raw = inputs()
    lesson = edition.load(WORK / "lesson.template.json")
    assert lesson["source"] == before["source"] and lesson["source"]["data"] == raw
    assert lesson["section_breaks"] == []
    for original, modern in zip(raw["prose"], lesson["prose"]):
        assert modern["source_text"] == original["text"]
        if modern["text"] != original["text"]:
            modern["changes"] = ["wording", "layout", "conditions"]
    edition.normalize_lesson_layout(lesson)
    edition.dump(WORK / "lesson.template.json", lesson)
    result = subprocess.run(
        ["node", str(TOOLS / "prose_flow.mjs"), str(WORK / "lesson.template.json")],
        text=True, capture_output=True, check=True,
    )
    evidence = TMP / "9p-n71-native-prose-flow.txt"
    assert not evidence.exists()
    evidence.write_text(result.stdout)
    candidates = [
        json.loads(line.split("break: ", 1)[1])
        for line in result.stdout.splitlines() if line.startswith("    break: ")
    ]
    boundaries = []
    for start in STARTS:
        matches = [item for item in candidates if item["after"].startswith(start)]
        assert len(matches) == 1, f"Native boundary not unique: {start}"
        boundaries.append(matches[0])
    lesson["section_breaks"] = boundaries
    edition.dump(WORK / "lesson.template.json", lesson)
    print(result.stdout)
    print("Copied five native boundary objects; no hand-counted indices.")


def freeze():
    assert not TARGET.exists(), "Do not repeat author structural check or overwrite evidence"
    record, before, raw = inputs()
    lesson = edition.load(WORK / "lesson.template.json")
    exercises = edition.load(WORK / "exercises.template.json")
    raw_exercises = edition.load(SOURCE / "exercises.json")
    profile_file = TOOLS.parent / "profiles/modern-us-neutral.json"
    profile = edition.load(profile_file)
    forbidden = profile["forbidden_terms"] + profile["forbidden_person_names"]
    errors = edition.validate_source(BOOK, lesson["source"], SOURCE / "lesson.json", "lesson")
    errors += edition.validate_source(BOOK, exercises["source"], SOURCE / "exercises.json", "exercises")
    errors += edition.validate_identity_fields(raw, lesson, edition.IDENTITY_FIELDS, "lesson")
    _, errata_errors = edition.validate_errata(BOOK, raw, raw_exercises, lesson, exercises)
    errors += errata_errors
    assert lesson["source"] == before["source"] and lesson["source"]["data"] == raw
    assert raw_exercises["count"] == raw["exercise_count"] == exercises["count"] == 0
    assert raw_exercises["exercises"] == exercises["exercises"] == []
    assert edition.sha256(WORK / "exercises.template.json") == record["templates"]["exercises.template.json"]["sha256"]
    assert len(lesson["prose"]) == len(raw["prose"]) == 21
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
        a = [m.group(0) for m in edition.MATH.finditer(original["text"])]
        b = [m.group(0) for m in edition.MATH.finditer(modern["text"])]
        digits = lambda text: re.findall(r"\d+", edition.MATH.sub("", text))
        da, db = digits(original["text"]), digits(modern["text"])
        if a != b:
            errors.append(f"{label}: exact source math atom drift")
        if da != db:
            errors.append(f"{label}: literal nonmath digit drift")
        if original["kind"] in ("fig", "cap"):
            assert modern == before["prose"][index], f"Figure/caption changed: {label}"
        mappings.append({
            "target": label, "kind": original["kind"], "source_refs": original["source_refs"],
            "source_text": original["text"], "modern_text": modern["text"],
            "source_math": a, "modern_math": b, "exactMathUnchanged": a == b,
            "sourceLiteralDigits": da, "modernLiteralDigits": db,
            "exactLiteralDigitsUnchanged": da == db,
            "changes": modern["changes"], "numeric_changes": modern["numeric_changes"],
        })
    for token in ("一百万圈", "一百万次"):
        assert raw["prose"][8]["text"].count(token) == lesson["prose"][8]["text"].count(token) == 1
    for token in ("一个价电子", "七个价电子", "NaCl"):
        assert raw["prose"][13]["text"].count(token) == lesson["prose"][13]["text"].count(token)
    normalized = copy.deepcopy(lesson)
    edition.normalize_lesson_layout(normalized)
    if normalized != lesson:
        errors.append("Native normalization is not stable")
    flow, flow_errors = edition.prose_flow_contract(lesson["prose"], lesson["section_breaks"])
    errors += flow_errors
    assert len(lesson["section_breaks"]) == len(STARTS)
    assert [dict(before=b["before"], after=b["after"]) for b in flow["boundaries"]] == lesson["section_breaks"]
    output = (
        f"author_structural={'PASS' if not errors else 'FAIL'} card={CARD} "
        f"source_blocks=21 modern_paragraphs={len(flow['paragraphs'])} tasks=0 "
        f"source_figures=6 section_breaks=5 errors={json.dumps(errors, ensure_ascii=False)}"
    )
    paths = {
        "sourceLesson": SOURCE / "lesson.json", "sourceMarkdown": SOURCE / "lesson.md",
        "sourceExercises": SOURCE / "exercises.json", "lessonTemplate": WORK / NAMES[0],
        "exercisesTemplate": WORK / NAMES[1], "figuresTemplate": WORK / NAMES[2],
        "helper": Path(__file__).resolve(), "beforeBindings": BEFORE / "bindings.json",
        "nativeProseFlowEvidence": TMP / "9p-n71-native-prose-flow.txt",
        "lessonSkill": TOOLS.parent / "SKILL.md",
        "textContract": TOOLS.parent / "references/edition-text-contract.md",
        "profile": profile_file, "nativeEdition": TOOLS / "edition.py",
        "nativeProseFlow": TOOLS / "prose_flow.mjs", "nativeHtmlFragment": TOOLS / "htmlfrag.js",
    }
    pages = sorted({int(ref.split("#")[0][1:]) for p in raw["prose"] for ref in p["source_refs"]})
    report = {
        "ticket": "STEMROBIN-181", "batch": "D019", "lesson": CARD,
        "role": "modern-prose-author-only",
        "status": "author-frozen-awaiting-independent-science" if not errors else "author-structural-blocked",
        "bindings": {key: bind(file) for key, file in paths.items()},
        "before": record["templates"],
        "sourcePages": [bind(BOOK / "pages" / f"{page:04d}" / "page.json") for page in pages],
        "prepare": {"performedByMain": True, "repeatedByThisAuthor": False},
        "sourceBlocks": 21, "modernParagraphs": len(flow["paragraphs"]), "originalTasks": 0,
        "modernTasks": 0, "sourceFigures": raw["figures"], "mapping": mappings,
        "sectionBreaks": lesson["section_breaks"], "nativeProseFlow": flow,
        "boundaries": {
            "firstSourceRefs": raw["prose"][0]["source_refs"], "lastSourceRefs": raw["prose"][-1]["source_refs"],
            "sourcePhysicalPages": pages, "sourcePrintedPages": [p - 9 for p in pages],
            "allSourceBlocksRetainedInOrder": True, "unit71Complete": True,
            "sourcePixelsOrPriorSourceGatesRepeated": False,
        },
        "nativeAuthorCheck": {
            "command": "env PYTHONDONTWRITEBYTECODE=1 .claude/skills/ld-s10y-lesson/.venv/bin/python -B .intentfold/tickets/STEMROBIN-181/tmp/author-9p-n71-prose.py freeze",
            "invocations": 1, "status": "pass" if not errors else "fail", "output": output,
            "errors": errors, "scope": "Read-only native source/identity/errata/text/math/number/normalization/prose-flow checks; no SCI or figure readiness gate.",
            "sourceSnapshotsRefsMathAndNumericTokensUnchanged": not errors,
            "zeroTaskExerciseTemplateBytesUnchanged": True,
            "allSixFigureAndCaptionBlocksUnchanged": True,
            "figuresTemplateNotWrittenByThisAuthor": True,
            "figuresTemplateBytesMatchBeforeAtFreeze": edition.sha256(WORK / NAMES[2]) == record["templates"][NAMES[2]]["sha256"],
        },
        "routing": {
            "canonicalTitle": raw["printed_title"],
            "topic": "Dielectrics and the source's two molecular types, not the adjacent hollow-conductor shielding unit.",
            "noOtherLessonOrShieldingUnitImported": True,
        },
        "changeRationale": [
            "Describe bound charges and polarization, distinguish ideal static conductor equilibrium from possible fields inside dielectrics.",
            "Scope the retained inverse-permittivity factors to a fixed-charge homogeneous linear isotropic macrostatic model with neglected boundaries and local effects.",
            "Distinguish total and polarization fields: opposition is conditional, while superposition permits general vector changes.",
            "Keep the original electroscope observation read-only; specify isolation, no contact or leakage, charge redistribution and coexistence of electrical and mechanical forces.",
            "Retain original hydrogen times and counts as a classical source account without claiming measured quantum orbits or adopting the printed nominal counts as an exact calculation.",
            "Use unperturbed ground-state hydrogen as the symmetric charge-density example, not a universal statement about every atomic state.",
            "Retain NaCl valence data and the illustrated isolated ion-pair/dipole idealization; distinguish it from the solid ionic lattice.",
            "State the molecular permanent-dipole classification under no external field and do not call it an exhaustive classification of ionic solids.",
        ],
        "sourceModelCaveats": [{
            "target": "lesson.prose[8]",
            "source_refs": raw["prose"][8]["source_refs"],
            "retainedMath": ["$10^{-16}$", "$10^{-9}$"],
            "retainedCountPhrases": ["一百万圈", "一百万次"],
            "issue": "The source presents a classical circulation picture and nominal time/count wording, not a modern quantum trajectory. Nominal division of the printed time values cannot be adopted as an exact derivation of the stated count; the first time is itself introduced as an order of magnitude.",
            "authorTreatment": "Preserve all source numbers and explicit count phrases with attribution and a model/precision caveat; assert no corrected numerical value or formula.",
            "mathOrNumericTokensChanged": False, "registeredErratumInvented": False,
            "independentScienceDecisionPending": True,
        }],
        "errata": lesson["errata"], "blockers": errors,
        "remaining": ["Main independent SCI", "Separate figure authorship/gates for128-133", "Main native finalization and surface verification"],
        "noIndependentScienceSourceOrFigureApproval": True,
        "noFinalizeFigureRenderIndexBrowserNetworkDBGitOrSharedToolChanges": True,
        "inFlightProcesses": [],
    }
    save_new(TARGET, report)
    print(output)
    print(f"freeze={TARGET.relative_to(ROOT)} sha256={edition.sha256(TARGET)}")
    if errors:
        raise SystemExit(1)


if __name__ == "__main__":
    assert len(sys.argv) == 2
    {"snapshot": snapshot, "layout": layout, "freeze": freeze}[sys.argv[1]]()
