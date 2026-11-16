"""Bind the registered unit erratum and freeze the n63 author candidate only."""

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


CARD = "phy9-c2-s2-n63"
TMP = Path(__file__).resolve().parent
BOOK = ROOT / "ssot-resources/soviet10year-textbooks/artifacts/9p"
WORK = ROOT / ".tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons" / CARD
BEFORE = TMP / "9p-n63-before"
REGISTRY = TMP / "d018-n63-unit-erratum/registered.json"
REGISTRATION = TMP / "d018-n63-source-unit-erratum.json"
EXPECTED = {
    "lesson.template.json": "14ef724638d197f2e2258b554656c9810403f87d7ae0c8d819f884855d8dd6c8",
    "exercises.template.json": "0a3473e84b463e4ff0618949b764a58465a2c693ec2004b12f6d98f7d28ddbfe",
    "figures.template.json": "0e6af6382ac854a0e18b63fd63839da153ea354fb8ec0280e2164b0ab160c915",
}
SECTION_STARTS = [
    "可以利用库仑定律约定静电电荷单位",
    "国际单位制（SI）采用另一套单位约定",
    "用 SI 表示库仑定律时",
    "为简化后续公式",
    "因此，在 SI 中用真空介电常数",
]
RATIONALES = {
    "p0155#10": "Unit conventions change numerical expression, not physical laws.",
    "p0155#11": "Qualify charge leakage and obsolete material-standard analogy; positive e is the electron-charge magnitude; retain Coulomb's scientific-history identity.",
    "p0155#12": "State vacuum point-charge conditions and the simultaneous centimetre/dyne/electrostatic-unit convention.",
    "p0156#2": "Name the unit system and the force magnitude before equation8-3.",
    "p0156#3": "Preserve equation8-3 and its label; Chinese punctuation remains outside math.",
    "p0156#4": "Explain original CGSE terminology and the sign-versus-magnitude distinction.",
    "p0156#5": "Preserve the original rounded CGSE elementary-charge value.",
    "p0156#6": "Distinguish the historical wire-force ampere realization from present SI; retain the constant-current charge relation and qualify variable current.",
    "p0156#7": "Keep equation8-4 while explicitly describing its conversion as rounded.",
    "p0156#8": "Keep every distance, mass, charge, power, voltage and current comparison; qualify net-charge retention and distinguish transported charge from net charge.",
    "p0157#1": "Positive elementary-charge magnitude and rounded source value, without adding a new numeric definition.",
    "p0157#2": "Preserve equation8-5 and all digits.",
    "p0157#3": "Keep all original math tokens and state the SI unit of the Coulomb coefficient.",
    "p0157#4": "Retain the same vacuum charges and separation for the conversion example.",
    "p0157#5": "Retain the complete intermediate force formula; explain that its denominator converts and squares the same distance.",
    "p0157#6": "Retain the dyne/newton conversion and computed force; state the rounding convention.",
    "p0157#7": "Keep reference8-2, coefficient value and unit; qualify the computation's precision.",
    "p0157#8": "Retain the entire substituted force formula and all unit atoms.",
    "p0157#9": "Retain the transition in its original source position.",
    "p0157#10": "Preserve the numerical coefficient formula and unit, with an approximation explanation outside math.",
    "p0157#11": "Retain the introduction of the alternative coefficient form.",
    "p0157#12": "Preserve equation8-6.",
    "p0157#13": "Name vacuum permittivity and qualify its experimentally determined SI value and textbook precision.",
    "p0157#14": "Apply only the registered final-unit square; preserve every numerical value, equality and equation8-7 label.",
    "p0157#15": "Retain the introduction of the SI Coulomb-law form.",
    "p0157#16": "Preserve equation8-8; separate force magnitude from direction and state vacuum/static/point-charge conditions.",
}


def binding(path):
    return {"path": path.relative_to(ROOT).as_posix(), "sha256": edition.sha256(path)}


def checked_inputs():
    for name, expected in EXPECTED.items():
        assert edition.sha256(BEFORE / name) == expected, f"Before snapshot drift: {name}"
    for name in ("exercises.template.json", "figures.template.json"):
        assert edition.sha256(WORK / name) == EXPECTED[name], f"Concurrent edit: {name}"
    before = edition.load(BEFORE / "lesson.template.json")
    source = BOOK / "lessons" / CARD / "lesson.json"
    exercises = BOOK / "lessons" / CARD / "exercises.json"
    assert edition.sha256(source) == before["source"]["sha256"]
    assert edition.sha256(exercises) == edition.load(BEFORE / "exercises.template.json")["source"]["sha256"]
    raw = edition.load(source)
    raw_exercises = edition.load(exercises)
    records = edition.source_errata(BOOK, raw, raw_exercises)
    assert records == edition.load(REGISTRY), "Registry differs from current native source_errata"
    assert len(records) == 1
    record = copy.deepcopy(records[0])
    assert record["id"] == "p0157-vacuum-permittivity-unit-square"
    assert record["source"]["block"] == "p0157#14"
    assert record["corrected"] == ""
    page = BOOK / "pages/0157/page.json"
    assert edition.sha256(page) == record["source"]["sha256"]
    assert record["original"].count(r"=8.85\times10^{-12}\text{库仑}/") == 1
    record["corrected"] = record["original"].replace(
        r"=8.85\times10^{-12}\text{库仑}/",
        r"=8.85\times10^{-12}\text{库仑}^2/",
        1,
    )
    return before, raw, raw_exercises, record


def bind_and_layout():
    assert not (TMP / "9p-n63-prose-freeze.json").exists(), "Candidate already frozen"
    before, raw, _, correction = checked_inputs()
    lesson = edition.load(WORK / "lesson.template.json")
    assert lesson["source"] == before["source"]
    assert len(lesson["prose"]) == len(raw["prose"]) == 26
    assert lesson["errata"] == [], "Merge the native record only once"
    for source, modern in zip(raw["prose"], lesson["prose"]):
        assert modern["source_text"] == source["text"]
        assert modern["source_refs"] == source["source_refs"]
        modern["changes"] = ["wording", "conditions", "layout"]
        if source["source_refs"] == ["p0155#11"]:
            modern["changes"].append("history")
            modern["historical_entities"] = [{
                "term": "库仑",
                "reason": "The source's Coulomb-era statement is authentic scientific history; preserve the physicist's identity in this same source-bound block.",
            }]
        if correction["source"]["block"] in source["source_refs"]:
            assert modern["text"].count(correction["corrected"]) == 1
            modern["changes"].append("math-correction")
    lesson["errata"] = [correction]
    edition.normalize_lesson_layout(lesson)
    edition.dump(WORK / "lesson.template.json", lesson)
    result = subprocess.run(
        ["node", str(TOOLS / "prose_flow.mjs"), str(WORK / "lesson.template.json")],
        capture_output=True, text=True, check=True,
    )
    candidates = [
        json.loads(line.split("break: ", 1)[1])
        for line in result.stdout.splitlines()
        if line.startswith("    break: ")
    ]
    boundaries = []
    for start in SECTION_STARTS:
        matches = [item for item in candidates if item["after"].startswith(start)]
        assert len(matches) == 1, f"Native boundary is not unique: {start}"
        boundaries.append(matches[0])
    lesson["section_breaks"] = boundaries
    edition.dump(WORK / "lesson.template.json", lesson)
    print("Merged one native erratum, normalized prose, and copied five native boundary objects; no prepare repeated.")


def freeze():
    target = TMP / "9p-n63-prose-freeze.json"
    assert not target.exists(), "Do not overwrite an author freeze"
    before, raw, raw_exercises, correction = checked_inputs()
    lesson = edition.load(WORK / "lesson.template.json")
    exercises = edition.load(WORK / "exercises.template.json")
    figures = edition.load(WORK / "figures.template.json")
    profile_path = TOOLS.parent / "profiles/modern-us-neutral.json"
    profile = edition.load(profile_path)
    forbidden = profile["forbidden_terms"] + profile["forbidden_person_names"]
    errors = edition.validate_source(BOOK, lesson["source"], BOOK / "lessons" / CARD / "lesson.json", "lesson")
    errors += edition.validate_source(BOOK, exercises["source"], BOOK / "lessons" / CARD / "exercises.json", "exercises")
    errors += edition.validate_identity_fields(raw, lesson, edition.IDENTITY_FIELDS, "lesson")
    assert lesson["source"] == before["source"] and lesson["source"]["data"] == raw
    assert exercises["source"]["data"] == raw_exercises
    assert lesson["schema"] == edition.LESSON_SCHEMA
    assert lesson["edition"] == "modern-us-neutral" and lesson["status"] == "draft"
    assert len(raw["prose"]) == len(lesson["prose"]) == 26
    assert raw["exercise_count"] == exercises["count"] == 0
    assert raw_exercises["exercises"] == exercises["exercises"] == []
    assert raw["figures"] == lesson["figures"] == figures["figures"] == []
    assert lesson["errata"] == [correction]
    mapping = []
    for index, (source, modern) in enumerate(zip(raw["prose"], lesson["prose"])):
        label = f"lesson.prose[{index}]"
        errors += edition.validate_identity_fields(
            source, modern, ("kind", "id", "label", "printed_page", "source_refs"), label
        )
        assert modern["source_text"] == source["text"]
        corrections = [correction] if label == correction["target"] else []
        errors += edition.validate_text(
            source["text"], modern["text"], modern["changes"], modern["numeric_changes"],
            label, forbidden, modern["historical_entities"], corrections,
        )
        expected_math = source["text"]
        if corrections:
            expected_math = expected_math.replace(correction["original"], correction["corrected"], 1)
        mapping.append({
            "target": label,
            "source_refs": source["source_refs"],
            "source_text_unchanged": True,
            "source_math": edition.math_signature(source["text"]),
            "modern_math": edition.math_signature(modern["text"]),
            "matches_original_or_registered_atom": edition.math_signature(expected_math) == edition.math_signature(modern["text"]),
            "source_numbers": edition.number_signature(source["text"]),
            "modern_numbers": edition.number_signature(modern["text"]),
            "changes": modern["changes"],
            "historical_entities": modern["historical_entities"],
            "rationale": RATIONALES[source["source_refs"][0]],
        })
    normalized = copy.deepcopy(lesson)
    edition.normalize_lesson_layout(normalized)
    assert normalized == lesson, "Native normalization is not stable"
    flow, flow_errors = edition.prose_flow_contract(lesson["prose"], lesson["section_breaks"])
    errors += flow_errors
    assert len(lesson["section_breaks"]) == len(SECTION_STARTS)
    assert [dict(before=item["before"], after=item["after"]) for item in flow["boundaries"]] == lesson["section_breaks"]
    output = (
        f"author_structural={'PASS' if not errors else 'FAIL'} card={CARD} blocks=26 "
        f"paragraphs={len(flow['paragraphs'])} tasks=0 figures=0 "
        f"registered_atom_corrections=1 section_breaks={len(lesson['section_breaks'])} "
        f"errors={json.dumps(errors, ensure_ascii=False)}"
    )
    paths = {
        "source": BOOK / "lessons" / CARD / "lesson.json",
        "sourceMarkdown": BOOK / "lessons" / CARD / "lesson.md",
        "sourceExercises": BOOK / "lessons" / CARD / "exercises.json",
        "template": WORK / "lesson.template.json",
        "exercisesTemplate": WORK / "exercises.template.json",
        "figuresTemplate": WORK / "figures.template.json",
        "sourcePage": BOOK / "pages/0157/page.json",
        "sourceAudit": BOOK / "pages/0157/audit.json",
        "registeredErratum": REGISTRY,
        "registrationReport": REGISTRATION,
        "helper": Path(__file__).resolve(),
        "nativeEdition": TOOLS / "edition.py",
        "nativeProseFlow": TOOLS / "prose_flow.mjs",
        "nativeHtmlFragment": TOOLS / "htmlfrag.js",
        "profile": profile_path,
        "textContract": TOOLS.parent / "references/edition-text-contract.md",
    }
    report = {
        "ticket": "STEMROBIN-181", "batch": "D018", "lesson": CARD,
        "role": "modern-prose-author-only",
        "status": "author-frozen-awaiting-independent-science" if not errors else "author-structural-blocked",
        "bindings": {key: binding(path) for key, path in paths.items()},
        "before": {name: binding(BEFORE / name) for name in EXPECTED},
        "prepare": {
            "invocations": 1, "exitCode": 0,
            "command": ".claude/skills/ld-s10y-lesson/.venv/bin/python -B .claude/skills/ld-s10y-lesson/tools/p2c.py adapt-prepare --book 9p --edition modern-us-neutral --lesson phy9-c2-s2-n63",
            "output": "[adapt-prepare] phy9-c2-s2-n63: 正文 26 块, 题 0 道, 图 0 张",
            "alreadyPreparedBeforeRegistry": True,
            "registryMerge": "Existing native source_errata API only; cmd_prepare not repeated.",
        },
        "sourceBlocks": 26, "modernParagraphs": len(flow["paragraphs"]), "tasks": 0, "figures": 0,
        "mapping": mapping, "errata": lesson["errata"],
        "sectionBreaks": lesson["section_breaks"], "nativeProseFlow": flow,
        "nativeAuthorCheck": {
            "command": ".claude/skills/ld-s10y-lesson/.venv/bin/python -B .intentfold/tickets/STEMROBIN-181/tmp/author-9p-n63-prose.py freeze",
            "invocations": 1, "status": "pass" if not errors else "fail", "output": output, "errors": errors,
            "sourceSnapshotsIdentityRefsOrderAndNonmathNumbersUnchanged": not errors,
            "exerciseAndFigureTemplatesByteUnchanged": True,
            "sectionBreaksCopiedFromNativeCliObjects": True,
            "scope": "Author structural/text-contract check only, not independent science approval.",
        },
        "scientificModernization": [
            "Positive e is a magnitude; electron charge remains negative.",
            "CGSE and SI conventions are distinct; original rounded values and every equation label remain.",
            "Historical ampere realization is explicitly distinguished from present SI; no new numerical definition inserted.",
            "Large static net charge is qualified by material/environment constraints, unlike accumulated transported charge in a nearly neutral conductor.",
            "Only the registered final charge-unit square changes math; precision explanations stay outside math.",
            "Vacuum/static/point-charge conditions and force magnitude versus direction are explicit.",
        ],
        "independentScience": "Pending Main; source registry is not modern approval.",
        "prohibitedActionsPerformed": [],
        "limits": "No source pixel review, raw source/tool/other-card edits, finalize/render/promotion, independent SCI, figure work, DB or git writes.",
        "inFlightProcesses": [],
    }
    edition.dump(target, report)
    print(output)
    print(f"freeze={target.relative_to(ROOT)} sha256={edition.sha256(target)}")
    if errors:
        raise SystemExit(1)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("action", choices=("bind-and-layout", "freeze"))
    action = parser.parse_args().action
    if action == "bind-and-layout":
        bind_and_layout()
    else:
        freeze()
