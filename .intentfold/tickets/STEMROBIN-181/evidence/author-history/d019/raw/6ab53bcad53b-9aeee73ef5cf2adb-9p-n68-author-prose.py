"""n68 author-only binding, native layout proposal and one structural freeze."""

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

CARD = "phy9-c2-s2-n68"
BOOK = ROOT / "ssot-resources/soviet10year-textbooks/artifacts/9p"
SOURCE = BOOK / "lessons" / CARD
WORK = ROOT / ".tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons" / CARD
BEFORE = TMP / "9p-n68-before"
NAMES = ("lesson.template.json", "exercises.template.json", "figures.template.json")
SECTION_STARTS = (
    "**观察电场的排列图样**",
    "**不同电荷分布的电力线**",
    "**静电电力线的连续性和疏密**",
)


def bind(file):
    return {"path": str(file.resolve()), "sha256": edition.sha256(file)}


def new_json(file, value):
    assert not file.exists(), f"Preserve existing evidence: {file}"
    edition.dump(file, value)


def snapshot():
    assert not BEFORE.exists()
    assert not (TMP / "9p-n68-prose-freeze.json").exists()
    BEFORE.mkdir()
    record = {"lesson": CARD, "templates": {}, "source": {}, "helper": bind(Path(__file__).resolve())}
    for name in NAMES:
        active, saved = WORK / name, BEFORE / name
        saved.write_bytes(active.read_bytes())
        assert edition.sha256(saved) == edition.sha256(active)
        record["templates"][name] = {**bind(saved), "original": str(active)}
    for name in ("lesson.json", "lesson.md", "exercises.json"):
        record["source"][name] = bind(SOURCE / name)
    new_json(BEFORE / "bindings.json", record)
    print(json.dumps(record, ensure_ascii=False, indent=2))


def inputs():
    record = edition.load(BEFORE / "bindings.json")
    for item in record["templates"].values():
        assert edition.sha256(Path(item["path"])) == item["sha256"]
    for item in record["source"].values():
        assert edition.sha256(Path(item["path"])) == item["sha256"]
    before = edition.load(BEFORE / "lesson.template.json")
    raw = edition.load(SOURCE / "lesson.json")
    exercises = edition.load(SOURCE / "exercises.json")
    assert raw["exercise_count"] == exercises["count"] == 0
    assert exercises["exercises"] == []
    assert len(raw["prose"]) == 17 and len(raw["figures"]) == 6
    return record, before, raw, exercises


def layout():
    assert not (TMP / "9p-n68-prose-freeze.json").exists()
    _, before, raw, _ = inputs()
    lesson = edition.load(WORK / "lesson.template.json")
    assert lesson["source"] == before["source"] and lesson["source"]["data"] == raw
    assert lesson["section_breaks"] == []
    normalized = copy.deepcopy(lesson)
    edition.normalize_lesson_layout(normalized)
    flow_result = subprocess.run(
        ["node", str(TOOLS / "prose_flow.mjs"), "--stdin"],
        input=json.dumps(normalized, ensure_ascii=False),
        text=True, capture_output=True, check=True,
    )
    flow = json.loads(flow_result.stdout)
    anchors = []
    for start in SECTION_STARTS:
        matches = [item for item in flow["paragraphs"] if item["text"].startswith(start)]
        assert len(matches) == 1, f"Concept start not unique: {start}"
        index = matches[0]["index"]
        assert index > 0
        anchors.append({"before": flow["paragraphs"][index - 1]["text"], "after": matches[0]["text"]})
    normalized["section_breaks"] = anchors
    proposed = TMP / "9p-n68-native-layout-proposal.json"
    evidence = TMP / "9p-n68-native-prose-flow.json"
    new_json(proposed, normalized)
    new_json(evidence, {
        "role": "native-layout-proposal-not-science-review",
        "template_before_layout": bind(WORK / "lesson.template.json"),
        "native_flow": flow,
        "concept_starts": list(SECTION_STARTS),
        "adjacent_anchors_from_native_outline": anchors,
        "normalized_texts": [
            {"index": index, "source_refs": block["source_refs"], "text": block["text"]}
            for index, block in enumerate(normalized["prose"]) if block["kind"] == "p"
        ],
        "active_template_not_written_by_helper": True,
    })
    print(json.dumps(edition.load(evidence), ensure_ascii=False, indent=2))


def freeze():
    destination = TMP / "9p-n68-prose-freeze.json"
    assert not destination.exists(), "Do not repeat the one author structural freeze"
    record, before, raw, raw_exercises = inputs()
    lesson = edition.load(WORK / "lesson.template.json")
    exercises = edition.load(WORK / "exercises.template.json")
    proposal = edition.load(TMP / "9p-n68-native-layout-proposal.json")
    profile_file = TOOLS.parent / "profiles/modern-us-neutral.json"
    profile = edition.load(profile_file)
    forbidden = profile["forbidden_terms"] + profile["forbidden_person_names"]
    errors = edition.validate_source(BOOK, lesson["source"], SOURCE / "lesson.json", "lesson")
    errors += edition.validate_source(BOOK, exercises["source"], SOURCE / "exercises.json", "exercises")
    errors += edition.validate_identity_fields(raw, lesson, edition.IDENTITY_FIELDS, "lesson")
    assert lesson == proposal, "Manual active template must exactly match native layout proposal"
    assert lesson["source"] == before["source"] and lesson["source"]["data"] == raw
    assert {key: value for key, value in lesson.items() if key not in ("prose", "section_breaks")} == {
        key: value for key, value in before.items() if key not in ("prose", "section_breaks")
    }
    assert exercises == edition.load(BEFORE / "exercises.template.json")
    for name in ("exercises.template.json", "figures.template.json"):
        assert edition.sha256(WORK / name) == record["templates"][name]["sha256"], name
    assert len(lesson["prose"]) == len(raw["prose"]) == 17
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
            notation_changes=modern.get("notation_changes"),
        )
        original_math = [match.group(0) for match in edition.MATH.finditer(original["text"])]
        modern_math = [match.group(0) for match in edition.MATH.finditer(modern["text"])]
        digits = lambda text: re.findall(r"\d+", edition.MATH.sub("", text))
        if original_math != modern_math:
            errors.append(f"{label}: exact math atom drift")
        if digits(original["text"]) != digits(modern["text"]):
            errors.append(f"{label}: literal nonmath digit drift")
        if original["kind"] in ("fig", "cap"):
            assert modern == before["prose"][index], f"Placeholder changed: {label}"
        mappings.append({
            "target": label, "kind": original["kind"], "source_refs": original["source_refs"],
            "source_text": original["text"], "modern_text": modern["text"],
            "source_snapshot_unchanged": True,
            "source_math": original_math, "modern_math": modern_math,
            "exact_math_atoms_unchanged": original_math == modern_math,
            "source_number_signature": edition.number_signature(original["text"]),
            "modern_number_signature": edition.number_signature(modern["text"]),
            "source_literal_digits_outside_math": digits(original["text"]),
            "modern_literal_digits_outside_math": digits(modern["text"]),
            "changes": modern["changes"], "numeric_changes": modern["numeric_changes"],
            "historical_entities": modern["historical_entities"],
        })
    normalized = copy.deepcopy(lesson)
    edition.normalize_lesson_layout(normalized)
    if normalized != lesson:
        errors.append("Native normalization is not stable")
    flow, flow_errors = edition.prose_flow_contract(lesson["prose"], lesson["section_breaks"])
    errors += flow_errors
    if [dict(before=item["before"], after=item["after"]) for item in flow.get("boundaries", [])] != lesson["section_breaks"]:
        errors.append("Section anchors do not match resolved native adjacent paragraphs")
    output = (
        f"author_structural={'PASS' if not errors else 'FAIL'} card={CARD} "
        f"source_blocks=17 modern_paragraphs={len(flow.get('paragraphs', []))} "
        f"tasks=0 source_figures=6 section_breaks={len(lesson['section_breaks'])} "
        f"errors={json.dumps(errors, ensure_ascii=False)}"
    )
    paths = {
        "sourceLesson": SOURCE / "lesson.json", "sourceMarkdown": SOURCE / "lesson.md",
        "sourceExercises": SOURCE / "exercises.json", "lessonTemplate": WORK / "lesson.template.json",
        "exercisesTemplate": WORK / "exercises.template.json", "figuresTemplate": WORK / "figures.template.json",
        "helper": Path(__file__).resolve(), "beforeBindings": BEFORE / "bindings.json",
        "nativeLayoutProposal": TMP / "9p-n68-native-layout-proposal.json",
        "nativeProseFlowEvidence": TMP / "9p-n68-native-prose-flow.json",
        "lessonSkill": TOOLS.parent / "SKILL.md",
        "textContract": TOOLS.parent / "references/edition-text-contract.md",
        "profile": profile_file, "nativeEdition": TOOLS / "edition.py",
        "nativeProseFlow": TOOLS / "prose_flow.mjs", "nativeHtmlFragment": TOOLS / "htmlfrag.js",
    }
    source_pages = sorted({int(ref.split("#")[0][1:]) for block in raw["prose"] for ref in block["source_refs"]})
    report = {
        "ticket": "STEMROBIN-181", "batch": "D019", "lesson": CARD,
        "role": "modern-prose-author-only",
        "status": "author-frozen-awaiting-independent-science" if not errors else "author-structural-blocked",
        "bindings": {key: bind(file) for key, file in paths.items()},
        "before": record["templates"],
        "sourcePages": [bind(BOOK / "pages" / f"{page:04d}" / "page.json") for page in source_pages],
        "prepare": {"performedByMain": True, "repeatedByThisAuthor": False},
        "sourceBlocks": 17, "modernParagraphs": len(flow.get("paragraphs", [])),
        "originalTasks": 0, "modernTasks": 0, "sourceFigures": raw["figures"],
        "exactSourceMathAtomCount": sum(len(item["source_math"]) for item in mappings),
        "mapping": mappings, "sectionBreaks": lesson["section_breaks"], "nativeProseFlow": flow,
        "boundaries": {
            "firstSourceRefs": raw["prose"][0]["source_refs"],
            "lastSourceRefs": raw["prose"][-1]["source_refs"],
            "sourcePhysicalPages": source_pages,
            "sourcePrintedPages": [page - 9 for page in source_pages],
            "allSourceBlocksRetainedInOrder": True, "unit68Complete": True,
            "sourceGateRepeated": False,
        },
        "nativeAuthorCheck": {
            "command": ".claude/skills/ld-s10y-lesson/.venv/bin/python -B .intentfold/tickets/STEMROBIN-181/tmp/9p-n68-author-prose.py freeze",
            "invocations": 1, "status": "pass" if not errors else "fail",
            "output": output, "errors": errors,
            "scope": "Current author source/text/identity/math/number/normalization/prose-flow structure only; no independent science or source pixel review",
            "sourceSnapshotsAndReferencesUnchanged": True,
            "exactMathAtomsAndLiteralNumbersUnchanged": not errors,
            "zeroTaskExerciseTemplateBytesUnchanged": True,
            "allSixFigureAndCaptionPlaceholdersUnchanged": True,
            "figuresTemplateBytesUnchanged": True,
            "activeTemplateManualEditsByApplyPatchOnly": True,
        },
        "changeRationale": [
            "Define oriented electric field lines only at nonzero-field points, with the tangent direction matching the local field.",
            "Distinguish field diagrams from material threads and from charge trajectories; drawing count is a representational choice.",
            "Retain Faraday with a source-bound historical declaration, and attribute the elastic-thread image to the original historical account.",
            "Retain original quinine/hair/castor-oil qualitative demonstration as historical material context, with no medicine recommendation or required unsupervised experiment.",
            "Keep all charge-distribution figure references and condition uniform-field approximation on large parallel plates, uniform intervening medium and negligible edge effects.",
            "Restrict nonclosed/nonintersecting statements to the electrostatic and nonzero continuous-field scope; include charge or infinity endpoints rather than physical diagram-frame endpoints.",
            "Use consistent drawing rules for qualitative density comparisons and scope near-charge field-strength comparisons to the isolated spherical model, not every charged object.",
            "Retain17 source blocks in order,6 source figure placeholders and0 tasks; add no formula, numerical data or source erratum."
        ],
        "errata": [],
        "remaining": ["Main independent science gate", "Separate six-figure author/review work", "Main native finalization and surface verification"],
        "blockers": errors,
        "noIndependentScienceSourceOrFigureApproval": True,
        "noFinalizeRenderBrowserDBIndexGitOrSharedToolChanges": True,
        "inFlightProcesses": [],
    }
    new_json(destination, report)
    print(output)
    print(f"freeze={destination} sha256={edition.sha256(destination)}")
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
