"""Normalize and freeze the complete n65 prose author candidate, without approval."""

import argparse
import copy
import json
from pathlib import Path
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[4]
TMP = Path(__file__).resolve().parent
TOOLS = ROOT / ".claude/skills/ld-s10y-lesson/tools"
sys.path.insert(0, str(TOOLS))
import edition

CARD = "phy9-c2-s2-n65"
BOOK = ROOT / "ssot-resources/soviet10year-textbooks/artifacts/9p"
SOURCE = BOOK / "lessons" / CARD
WORK = ROOT / ".tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons" / CARD
BEFORE = TMP / "9p-n65-before"
EXPECTED = {
    "lesson.template.json": "29aa3d24635d2756a421fed84b984f5c5cd77488a1163461ed787f8cadd16d14",
    "exercises.template.json": "73b468a81dc5fc27fead3629f8a9fd1b09444fae02c262747747b941db7a5b16",
    "figures.template.json": "75eb8e8e6cd4593607237fa5a65f9ae273cbafc57f4bbebb473c9ba0f4b604d0",
    "book.template.json": "2717a1c550dada64bfeb0e3c6c4212a5d273f61617e3355ae82d95899cf89928",
}
SECTION_STARTS = [
    "**局域作用与场**", "**超距作用与经典近似**",
    "**静态现象与接触力**", "**力的规律与传播机制**",
]
HISTORICAL = {
    "p0163#7": ["麦克斯韦"],
    "p0163#8": ["牛顿"],
    "p0164#6": ["库仑", "安培"],
}
FLOW_PATH = TMP / "9p-n65-prose-flow-author.json"
CHECK_PATH = TMP / "9p-n65-author-check.json"
FREEZE_PATH = TMP / "9p-n65-prose-freeze.json"


def binding(file):
    return {"path": file.relative_to(ROOT).as_posix(), "sha256": edition.sha256(file)}


def inputs():
    for name, expected in EXPECTED.items():
        assert edition.sha256(BEFORE / name) == expected, f"Before bytes changed: {name}"
    for name in ("exercises.template.json", "figures.template.json"):
        assert edition.sha256(WORK / name) == EXPECTED[name], f"Concurrent edit: {name}"
    before = edition.load(BEFORE / "lesson.template.json")
    raw = edition.load(SOURCE / "lesson.json")
    raw_exercises = edition.load(SOURCE / "exercises.json")
    assert edition.sha256(SOURCE / "lesson.json") == before["source"]["sha256"]
    assert edition.sha256(SOURCE / "exercises.json") == edition.load(BEFORE / "exercises.template.json")["source"]["sha256"]
    return before, raw, raw_exercises


def layout():
    assert not FREEZE_PATH.exists() and not FLOW_PATH.exists(), "Do not repeat author layout"
    before, raw, _ = inputs()
    lesson = edition.load(WORK / "lesson.template.json")
    assert lesson["source"] == before["source"]
    assert len(lesson["prose"]) == len(raw["prose"]) == 14
    assert lesson["section_breaks"] == []
    for index, (original, modern) in enumerate(zip(raw["prose"], lesson["prose"])):
        assert modern["source_text"] == original["text"]
        assert modern["source_refs"] == original["source_refs"]
        if original["kind"] in ("fig", "cap"):
            assert modern == before["prose"][index]
            continue
        assert modern["text"] != original["text"]
        modern["changes"] = ["wording", "layout", "conditions"]
        modern["historical_entities"] = [
            {
                "term": term,
                "reason": "Real historical physicist named in this exact source block; retained without inventing a quotation, date or exclusive priority claim.",
            }
            for term in HISTORICAL.get(original["source_refs"][0], [])
        ]
    edition.normalize_lesson_layout(lesson)
    edition.dump(WORK / "lesson.template.json", lesson)
    result = subprocess.run(
        ["node", str(TOOLS / "prose_flow.mjs"), str(WORK / "lesson.template.json")],
        capture_output=True, text=True, check=True,
    )
    candidates = [
        json.loads(line.split("break: ", 1)[1])
        for line in result.stdout.splitlines() if line.startswith("    break: ")
    ]
    boundaries = []
    for start in SECTION_STARTS:
        matches = [item for item in candidates if item["after"].startswith(start)]
        assert len(matches) == 1, f"Native boundary not unique: {start}"
        boundaries.append(matches[0])
    lesson["section_breaks"] = boundaries
    edition.dump(WORK / "lesson.template.json", lesson)
    edition.dump(FLOW_PATH, {
        "ticket": "STEMROBIN-181", "batch": "D018", "lesson": CARD,
        "role": "native-author-layout-only-not-review",
        "command": ["node", str(TOOLS / "prose_flow.mjs"), str(WORK / "lesson.template.json")],
        "invocations": 1, "exitCode": result.returncode, "output": result.stdout,
        "copiedBoundaries": boundaries, "template": binding(WORK / "lesson.template.json"),
    })
    print(result.stdout)
    print("Copied four native boundary objects; figures/exercises untouched.")


def freeze():
    assert not FREEZE_PATH.exists() and not CHECK_PATH.exists(), "Do not repeat the initial author check"
    before, raw, raw_exercises = inputs()
    lesson = edition.load(WORK / "lesson.template.json")
    exercises = edition.load(WORK / "exercises.template.json")
    figure_template = edition.load(WORK / "figures.template.json")
    profile_path = TOOLS.parent / "profiles/modern-us-neutral.json"
    profile = edition.load(profile_path)
    forbidden = profile["forbidden_terms"] + profile["forbidden_person_names"]
    errors = edition.validate_source(BOOK, lesson["source"], SOURCE / "lesson.json", "lesson")
    errors += edition.validate_source(BOOK, exercises["source"], SOURCE / "exercises.json", "exercises")
    errors += edition.validate_identity_fields(raw, lesson, edition.IDENTITY_FIELDS, "lesson")
    assert lesson["source"] == before["source"] and lesson["source"]["data"] == raw
    assert exercises["source"]["data"] == raw_exercises
    assert lesson["schema"] == edition.LESSON_SCHEMA
    assert lesson["edition"] == "modern-us-neutral" and lesson["status"] == "draft"
    assert len(lesson["prose"]) == len(raw["prose"]) == 14
    assert raw["exercise_count"] == raw_exercises["count"] == exercises["count"] == 0
    assert raw_exercises["exercises"] == exercises["exercises"] == []
    assert raw["figures"] == lesson["figures"] == before["figures"]
    assert lesson["errata"] == edition.source_errata(BOOK, raw, raw_exercises) == []
    mapping = []
    for index, (original, modern) in enumerate(zip(raw["prose"], lesson["prose"])):
        label = f"lesson.prose[{index}]"
        errors += edition.validate_identity_fields(
            original, modern, ("kind", "id", "label", "printed_page", "source_refs"), label
        )
        assert modern["source_text"] == original["text"]
        errors += edition.validate_text(
            original["text"], modern["text"], modern["changes"], modern["numeric_changes"],
            label, forbidden, modern["historical_entities"],
        )
        source_atoms = [match.group(0) for match in edition.MATH.finditer(original["text"])]
        modern_atoms = [match.group(0) for match in edition.MATH.finditer(modern["text"])]
        assert source_atoms == modern_atoms
        assert edition.number_signature(original["text"]) == edition.number_signature(modern["text"])
        if original["kind"] in ("fig", "cap"):
            assert modern == before["prose"][index]
        mapping.append({
            "target": label, "kind": original["kind"], "source_refs": original["source_refs"],
            "source_text_unchanged": True, "exactMathAtomsUnchanged": True,
            "source_math": source_atoms, "modern_math": modern_atoms,
            "source_numbers": edition.number_signature(original["text"]),
            "modern_numbers": edition.number_signature(modern["text"]),
            "changes": modern["changes"], "numeric_changes": modern["numeric_changes"],
            "historical_entities": modern["historical_entities"],
        })
    normalized = copy.deepcopy(lesson)
    edition.normalize_lesson_layout(normalized)
    assert normalized == lesson, "Native normalization is not stable"
    flow, flow_errors = edition.prose_flow_contract(lesson["prose"], lesson["section_breaks"])
    errors += flow_errors
    flow_record = edition.load(FLOW_PATH)
    assert flow_record["template"] == binding(WORK / "lesson.template.json")
    assert lesson["section_breaks"] == flow_record["copiedBoundaries"]
    assert len(lesson["section_breaks"]) == 4
    assert [dict(before=item["before"], after=item["after"]) for item in flow["boundaries"]] == lesson["section_breaks"]
    check = {
        "ticket": "STEMROBIN-181", "batch": "D018", "lesson": CARD,
        "role": "native-prose-author-structural-check-only",
        "status": "no-mechanical-findings" if not errors else "author-structural-blocked",
        "invocations": 1, "errors": errors,
        "sourceBlocks": len(raw["prose"]), "modernParagraphs": len(flow["paragraphs"]),
        "tasks": len(exercises["exercises"]), "sourceFigures": len(raw["figures"]),
        "sectionBreaks": len(lesson["section_breaks"]),
        "sourceSnapshotsIdentityRefsOrderUnchanged": True,
        "exactMathAndNumericDataUnchanged": True,
        "exerciseAndFigureTemplatesByteUnchanged": True,
        "figureAndCaptionBlocksUnchanged": True,
        "sectionBreaksCopiedFromNativeCliObjects": True,
        "no_science_fidelity_or_figure_approval": True,
        "template": binding(WORK / "lesson.template.json"),
    }
    edition.dump(CHECK_PATH, check)
    if errors:
        print(json.dumps(check, ensure_ascii=False, indent=2))
        raise SystemExit(1)
    paths = {
        "source": SOURCE / "lesson.json", "sourceMarkdown": SOURCE / "lesson.md",
        "sourceExercises": SOURCE / "exercises.json",
        "template": WORK / "lesson.template.json",
        "exercisesTemplate": WORK / "exercises.template.json",
        "figuresTemplate": WORK / "figures.template.json",
        "helper": Path(__file__).resolve(), "nativeEdition": TOOLS / "edition.py",
        "nativeP2c": TOOLS / "p2c.py", "nativeProseFlow": TOOLS / "prose_flow.mjs",
        "nativeHtmlFragment": TOOLS / "htmlfrag.js",
        "textContract": TOOLS.parent / "references/edition-text-contract.md",
        "lessonSkill": TOOLS.parent / "SKILL.md", "profile": profile_path,
        "sourceTOC": ROOT / "ssot-resources/soviet10year-textbooks/toc/9p/zh.json",
        "sourceManifest": ROOT / "ssot-resources/soviet10year-textbooks/sources/manifest.json",
        "providedScienceReferenceNotes": TMP / "d018-n65-science-reference-notes.json",
        "nativeAuthorLayoutRecord": FLOW_PATH, "nativeAuthorCheckRecord": CHECK_PATH,
    }
    pages = sorted({
        int(ref.split("#")[0][1:])
        for item in raw["prose"] for ref in item["source_refs"]
    })
    assert pages == [162, 163, 164, 165]
    source_figures = []
    for figure in figure_template["figures"]:
        assert figure["id"] in {item["id"] for item in raw["figures"]}
        source_bindings = {}
        for kind, item in figure["source"].items():
            assert edition.sha256(BOOK / item["path"]) == item["sha256"]
            source_bindings[kind] = binding(BOOK / item["path"])
        source_figures.append({
            "id": figure["id"], "label": figure["label"], "source": source_bindings,
            "placeholdersUnchanged": True, "newFigureAuthoringRenderingOrPixelGate": False,
        })
    report = {
        "ticket": "STEMROBIN-181", "batch": "D018", "lesson": CARD,
        "role": "modern-prose-author-only",
        "status": "author-frozen-awaiting-main-unique-independent-science",
        "bindings": {key: binding(file) for key, file in paths.items()},
        "before": {name: binding(BEFORE / name) for name in EXPECTED},
        "sourcePages": [binding(BOOK / "pages" / f"{page:04d}" / "page.json") for page in pages],
        "sourcePageAudits": [binding(BOOK / "pages" / f"{page:04d}" / "audit.json") for page in pages],
        "sourceScope": {
            "unit65Complete": True, "sourcePages": pages,
            "mainIntegratedPrefixThrough166": True, "unresolved167NotReadOrIntegratedByAuthor": True,
            "sourceProseBlocks": 14, "sourceTasks": 0,
            "sourceBoundariesNotRechecked": True,
        },
        "prepare": {
            "invocations": 1, "exitCode": 0,
            "command": ".claude/skills/ld-s10y-lesson/.venv/bin/python -B .claude/skills/ld-s10y-lesson/tools/p2c.py adapt-prepare --book 9p --edition modern-us-neutral --lesson phy9-c2-s2-n65",
            "output": "[adapt-prepare] phy9-c2-s2-n65: 正文 14 块, 题 0 道, 图 2 张 -> .tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons/phy9-c2-s2-n65\n  完成后写入 ssot-resources/soviet10year-textbooks/artifacts/9p/editions/modern-us-neutral/lessons/phy9-c2-s2-n65\n",
            "templateDidNotExistBeforePrepare": True, "noRepeatedPrepare": True,
        },
        "sourceBlocks": 14, "modernParagraphs": len(flow["paragraphs"]), "tasks": 0,
        "sourceFigures": raw["figures"], "originalFigureBindings": source_figures,
        "mapping": mapping, "errata": lesson["errata"],
        "sectionBreaks": lesson["section_breaks"], "nativeProseFlow": flow,
        "nativeAuthorCheck": {**check, "record": binding(CHECK_PATH)},
        "authorRepair": {"used": 0, "maximum": 1, "initialCheckHadMechanicalFindings": False},
        "changeRationale": [
            "Distinguish the measured magnitude law from the process and causal timing of an interaction.",
            "Keep the three door-control examples while separating real elastic, pressure and electrical response from instantaneous rigid-link transmission.",
            "Treat air/sound as a mechanical-medium example, not evidence that electromagnetic propagation needs a mechanical ether.",
            "Describe fields using position/time physical quantities and local measurable effects; vacuum electromagnetic propagation requires no intermediate material charges or currents.",
            "Retain only source-named Maxwell/Newton/Coulomb/Ampere historical attribution; invent no date, quotation or exclusive discovery claim.",
            "Separate the classical Newtonian instantaneous calculation approximation from an assertion of arbitrary-distance instantaneous causal influence.",
            "Qualify paper/wood static magnet examples by weak magnetic material and fixed geometry; they do not establish propagation speed.",
            "Qualify contact forces and thread tension by microscopic electromagnetic/quantum effects and material structure; no literal-empty-gap or universal instantaneous-action inference from the original diagram.",
            "Preserve the valid scope of static force laws while distinguishing changing/moving sources, propagation delay, velocity and acceleration.",
        ],
        "referenceReuse": {
            "providedNotesActuallyRead": True, "notes": binding(paths["providedScienceReferenceNotes"]),
            "newNetworkOrBrowserFetch": False,
            "notScienceApproval": True, "noNewFormulaConstantOrHistoricalPriorityImported": True,
        },
        "independentScience": "Pending Main unique independent SCI; author has not approved scientific correctness.",
        "blockers": [],
        "unresolved": [
            "Main unique independent SCI is pending; author structural checks do not approve the scientific qualifications.",
            "Both original figure placeholders remain pending their separately assigned modern figure workflow; no drawing or pixel review performed here.",
        ],
        "preservation": {
            "sourceDataSourceTextMathNumericValuesIdentityRefsAndOrderUnchanged": True,
            "allOriginalProseFiguresAndCaptionRetained": True,
            "noExerciseAddedOrSourceProseConvertedToTask": True,
            "source167AndFrozenSource164_167CandidatesNotModified": True,
            "prior64ArchivalRecoveryRetainedUnchanged": True,
            "D017RetentionNotRun": True,
        },
        "prohibitedActionsPerformed": [],
        "limits": "No source/SCI/figure gate, figure authoring, finalize/render/promotion, source/tool/app/DB/git/browser writes or whole-project tests.",
        "inFlightProcesses": [],
    }
    edition.dump(FREEZE_PATH, report)
    print(json.dumps({
        "freeze": binding(FREEZE_PATH), "template": binding(WORK / "lesson.template.json"),
        "status": report["status"], "sourceBlocks": 14,
        "modernParagraphs": report["modernParagraphs"], "tasks": 0, "sourceFigures": 2,
        "sectionBreaks": 4, "authorCheckInvocations": 1, "repairsUsed": 0,
        "blockers": [], "unresolved": report["unresolved"], "inFlightProcesses": [],
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("action", choices=("layout", "freeze"))
    if parser.parse_args().action == "layout":
        layout()
    else:
        freeze()
