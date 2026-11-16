"""Normalize and freeze the n64 prose author candidate without finalization."""

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


CARD = "phy9-c2-s2-n64"
BOOK = ROOT / "ssot-resources/soviet10year-textbooks/artifacts/9p"
SOURCE = BOOK / "lessons" / CARD
WORK = ROOT / ".tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons" / CARD
BEFORE = TMP / "9p-n64-before"
EXPECTED = {
    "lesson.template.json": "e4879fe1a21a2e2ea9dccf93a45aa0cd6c8873ef9617309c97f7507e404ff4fd",
    "exercises.template.json": "f64c50f6fbf01de1426a4e497ea1d0e18ece3eb25b04037612ccc3700e8e83ed",
    "figures.template.json": "96ddce1f3955c4369f52cb17acc1b51ed8bf63fe5c560c0630a12600f829eab6",
}
CONDITIONS = {
    "p0158#2", "p0158#3", "p0158#5", "p0158#9", "p0158#10", "p0158#11",
    "p0159#2", "p0159#3", "p0159#4", "p0159#7", "p0159#8", "p0159#9",
    "p0159#10", "p0159#13", "p0160#3", "p0160#4", "p0160#6", "p0160#8",
    "p0160#10", "p0161#3", "p0161#4", "p0161#6", "p0161#7", "p0161#9",
}
SECTION_STARTS = ["**例题**", "2. 假设真空中", "3. 两个相同的小球", "4. 三个小带电体"]


def binding(path):
    return {"path": path.relative_to(ROOT).as_posix(), "sha256": edition.sha256(path)}


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
    assert not (TMP / "9p-n64-prose-freeze.json").exists()
    before, raw, _ = inputs()
    lesson = edition.load(WORK / "lesson.template.json")
    assert lesson["source"] == before["source"]
    assert len(lesson["prose"]) == len(raw["prose"]) == 42
    assert lesson["section_breaks"] == [], "Copy native boundaries only once"
    for original, modern in zip(raw["prose"], lesson["prose"]):
        assert modern["source_text"] == original["text"]
        assert modern["source_refs"] == original["source_refs"]
        if modern["kind"] in ("fig", "cap"):
            assert modern == before["prose"][raw["prose"].index(original)]
            continue
        if modern["text"] != original["text"]:
            modern["changes"] = ["wording", "layout"]
            if original["source_refs"][0] in CONDITIONS:
                modern["changes"].append("conditions")
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
    print(result.stdout)
    print("Copied four native boundary objects; figures/exercises untouched.")


def freeze():
    target = TMP / "9p-n64-prose-freeze.json"
    assert not target.exists(), "Do not overwrite frozen evidence"
    before, raw, raw_exercises = inputs()
    lesson = edition.load(WORK / "lesson.template.json")
    exercises = edition.load(WORK / "exercises.template.json")
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
    assert len(lesson["prose"]) == len(raw["prose"]) == 42
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
        assert source_atoms == modern_atoms, f"Exact math atom drift: {label}"
        if original["kind"] in ("fig", "cap"):
            assert modern == before["prose"][index], f"Figure/caption drift: {label}"
        mapping.append({
            "target": label, "kind": original["kind"], "source_refs": original["source_refs"],
            "source_text_unchanged": True, "exactMathAtomsUnchanged": True,
            "source_math": source_atoms, "modern_math": modern_atoms,
            "source_numbers": edition.number_signature(original["text"]),
            "modern_numbers": edition.number_signature(modern["text"]),
            "changes": modern["changes"], "numeric_changes": modern["numeric_changes"],
        })
    normalized = copy.deepcopy(lesson)
    edition.normalize_lesson_layout(normalized)
    assert normalized == lesson, "Native normalization is not stable"
    flow, flow_errors = edition.prose_flow_contract(lesson["prose"], lesson["section_breaks"])
    errors += flow_errors
    assert len(lesson["section_breaks"]) == len(SECTION_STARTS)
    assert [dict(before=item["before"], after=item["after"]) for item in flow["boundaries"]] == lesson["section_breaks"]
    output = (
        f"author_structural={'PASS' if not errors else 'FAIL'} card={CARD} blocks=42 "
        f"paragraphs={len(flow['paragraphs'])} tasks=0 source_figures=2 "
        f"worked_examples_in_prose=4 section_breaks={len(lesson['section_breaks'])} "
        f"errors={json.dumps(errors, ensure_ascii=False)}"
    )
    paths = {
        "source": SOURCE / "lesson.json", "sourceMarkdown": SOURCE / "lesson.md",
        "sourceExercises": SOURCE / "exercises.json",
        "template": WORK / "lesson.template.json",
        "exercisesTemplate": WORK / "exercises.template.json",
        "figuresTemplate": WORK / "figures.template.json",
        "helper": Path(__file__).resolve(), "nativeEdition": TOOLS / "edition.py",
        "nativeProseFlow": TOOLS / "prose_flow.mjs", "nativeHtmlFragment": TOOLS / "htmlfrag.js",
        "textContract": TOOLS.parent / "references/edition-text-contract.md", "profile": profile_path,
    }
    pages = sorted({int(ref.split("#")[0][1:]) for block in raw["prose"] for ref in block["source_refs"]})
    report = {
        "ticket": "STEMROBIN-181", "batch": "D018", "lesson": CARD,
        "role": "modern-prose-author-only",
        "status": "author-frozen-awaiting-independent-science" if not errors else "author-structural-blocked",
        "bindings": {key: binding(path) for key, path in paths.items()},
        "before": {name: binding(BEFORE / name) for name in EXPECTED},
        "sourcePages": [binding(BOOK / "pages" / f"{page:04d}" / "page.json") for page in pages],
        "prepare": {
            "invocations": 1, "exitCode": 0,
            "command": ".claude/skills/ld-s10y-lesson/.venv/bin/python -B .claude/skills/ld-s10y-lesson/tools/p2c.py adapt-prepare --book 9p --edition modern-us-neutral --lesson phy9-c2-s2-n64",
            "output": "[adapt-prepare] phy9-c2-s2-n64: 正文 42 块, 题 0 道, 图 2 张",
        },
        "sourceBlocks": 42, "modernParagraphs": len(flow["paragraphs"]), "tasks": 0,
        "sourceFigures": raw["figures"], "figureAuthoringPerformed": False,
        "workedExamples": {"count": 4, "remainInProse": True, "convertedToTasks": False},
        "mapping": mapping, "errata": lesson["errata"], "suspectedPrintErrors": [],
        "sectionBreaks": lesson["section_breaks"], "nativeProseFlow": flow,
        "nativeAuthorCheck": {
            "command": ".claude/skills/ld-s10y-lesson/.venv/bin/python -B .intentfold/tickets/STEMROBIN-181/tmp/author-9p-n64-prose.py freeze",
            "invocations": 1, "status": "pass" if not errors else "fail", "output": output, "errors": errors,
            "scope": "Author structural/text-contract check; not independent science approval.",
            "sourceSnapshotsIdentityRefsOrderUnchanged": True,
            "exactMathAtomsUnchanged": True,
            "exerciseAndFigureTemplatesByteUnchanged": True,
            "figureAndCaptionBlocksUnchanged": True,
            "sectionBreaksCopiedFromNativeCliObjects": True,
        },
        "changeRationale": [
            "Qualify the homogeneous isotropic linear electrostatic point-charge model, fixed material state and neglected boundary/cavity/leakage effects.",
            "Do not treat relative permittivity as universally constant; distinguish solid elastic constraints from an impossibility of studying electrostatic force.",
            "Retain all four worked examples, source units, values, equations, identities, references and figure/caption positions as prose.",
            "Distinguish total electrons from excess electrons and net charge in the neutral water example.",
            "Specify symmetric static suspension, tension direction, horizontal and vertical balance, and exact sine geometry without a small-angle approximation.",
            "Use magnitude formulas with explicit force directions for the three charges; separate electric resultant from holding constraints and internal-vector cancellation.",
        ],
        "independentScience": "Pending Main; no independent science gate performed.",
        "blockers": errors,
        "prohibitedActionsPerformed": [],
        "limits": "No source/tool/app/DB/git/browser edits, figure authoring, finalize/render/promotion or whole-project tests.",
        "inFlightProcesses": [],
    }
    edition.dump(target, report)
    print(output)
    print(f"freeze={target.relative_to(ROOT)} sha256={edition.sha256(target)}")
    if errors:
        raise SystemExit(1)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("action", choices=("layout", "freeze"))
    action = parser.parse_args().action
    if action == "layout":
        layout()
    else:
        freeze()
