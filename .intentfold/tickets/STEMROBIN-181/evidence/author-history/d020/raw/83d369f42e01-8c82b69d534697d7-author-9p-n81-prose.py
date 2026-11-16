"""n81 prose-only snapshot, one native layout/flow and one structural freeze."""

from collections import Counter
import hashlib
import json
from pathlib import Path
import re
import subprocess
import sys

sys.dont_write_bytecode = True
ROOT = Path.cwd()
TMP = Path(__file__).resolve().parent
TOOLS = ROOT / ".claude/skills/ld-s10y-lesson/tools"
sys.path.insert(0, str(TOOLS))
import edition

CARD = "phy9-c2-s2-n81"
BOOK = ROOT / "ssot-resources/soviet10year-textbooks/artifacts/9p"
WORK = ROOT / ".tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons" / CARD
BEFORE = TMP / "9p-n81-before"
FLOW = TMP / "9p-n81-native-prose-flow.txt"
FREEZE = TMP / "9p-n81-prose-freeze.json"
NAMES = ("lesson.template.json", "exercises.template.json", "figures.template.json")
PAGES = (200, 201, 202)
STARTS = ("**电势差与电容**", "**实验检验**", "**大电容与击穿**")
NATIVE = ("edition.py", "htmlfrag.js", "prose_flow.mjs")


def bind(file):
    return {"path": file.relative_to(ROOT).as_posix(), "sha256": edition.sha256(file)}


def new_json(file, value):
    assert not file.exists(), f"Preserve existing evidence: {file}"
    edition.dump(file, value)


def declared_source(template):
    source = template["source"]
    return {
        "path": (BOOK / source["path"]).relative_to(ROOT).as_posix(),
        "sha256": source["sha256"],
    }


def snapshot():
    assert BEFORE.is_dir(), "All three templates must be copied before authoring"
    assert not FLOW.exists() and not FREEZE.exists()
    record = {"lesson": CARD, "templates": {}, "source": {}, "pages": {}, "native": {}}
    for name in NAMES:
        record["templates"][name] = {**bind(BEFORE / name), "original": bind(WORK / name)}
        assert record["templates"][name]["sha256"] == record["templates"][name]["original"]["sha256"]
    lesson = edition.load(BEFORE / "lesson.template.json")
    exercises = edition.load(BEFORE / "exercises.template.json")
    record["source"] = {
        "lesson.json": declared_source(lesson),
        "exercises.json": declared_source(exercises),
    }
    gate_file = TMP / "d020-source200-203-finalization.json"
    gate = edition.load(gate_file)
    assert gate["status"] == "pass-approved-pages-only"
    record["approvedSourceFinalization"] = bind(gate_file)
    refs = [ref for block in lesson["source"]["data"]["prose"] for ref in block["source_refs"]]
    for page in PAGES:
        approved = next(item for item in gate["pages"] if item["pdfPage"] == page)
        page_json = BOOK / "pages" / f"{page:04d}" / "page.json"
        assert bind(page_json) == approved["pageJson"]
        record["pages"][str(page)] = {
            "pageJson": bind(page_json),
            "pageMarkdown": bind(page_json.with_suffix(".md")),
            "source_refs": [ref for ref in refs if int(ref[1:5]) == page],
            "basis": "Approved source text and Main's adapt-prepared snapshot; no images opened",
        }
    context_gate_file = TMP / "d020-source196-199-finalization.json"
    context_gate = edition.load(context_gate_file)
    assert context_gate["status"] == "pass-approved-pages-only"
    approved_context = next(item for item in context_gate["pages"] if item["pdfPage"] == 199)
    context_page = BOOK / "pages/0199/page.json"
    assert bind(context_page) == approved_context["pageJson"]
    record["context199"] = {
        "pageJson": bind(context_page),
        "pageMarkdown": bind(context_page.with_suffix(".md")),
        "approvedFinalization": bind(context_gate_file),
        "scope": "Text-only context: near parallel plates and equal opposite charges; no figures imported",
    }
    definition = edition.load(BOOK / "pages/0200/page.json")["blocks"][3]
    record["definition836"] = {
        "source_ref": "p0200#4",
        "sourceText": "".join(definition["lines"]),
        "scope": "Original capacitance definition read as context; no new math atom or source_ref added",
    }
    record["native"] = {name: bind(TOOLS / name) for name in NATIVE}
    record["reusedAuthorPatterns"] = {
        name: bind(TMP / name)
        for name in ("author-9p-n79-prose.py", "author-9p-n76-prose.py")
    }
    new_json(BEFORE / "bindings.json", record)
    print(json.dumps(record, ensure_ascii=False, indent=2))


def inputs():
    record = edition.load(BEFORE / "bindings.json")
    for name, item in record["templates"].items():
        assert edition.sha256(BEFORE / name) == item["sha256"]
    bound = list(record["native"].values()) + [record["approvedSourceFinalization"]]
    bound += [item for page in record["pages"].values() for item in (page["pageJson"], page["pageMarkdown"])]
    bound += [record["context199"][key] for key in ("pageJson", "pageMarkdown", "approvedFinalization")]
    for item in bound:
        assert edition.sha256(ROOT / item["path"]) == item["sha256"], item["path"]
    before = edition.load(BEFORE / "lesson.template.json")
    raw = before["source"]["data"]
    raw_exercises = edition.load(BEFORE / "exercises.template.json")["source"]["data"]
    assert len(raw["prose"]) == 17
    assert Counter(item["kind"] for item in raw["prose"]) == {"p": 15, "fig": 1, "cap": 1}
    assert raw["exercise_count"] == raw_exercises["count"] == 0
    assert raw_exercises["exercises"] == []
    assert [item["id"] for item in raw["figures"]] == ["fig-152"]
    refs = [ref for item in raw["prose"] for ref in item["source_refs"]]
    assert len(refs) == len(set(refs)) == 19
    assert set(int(ref[1:5]) for ref in refs) == set(PAGES)
    return record, before, raw, raw_exercises


def read_flow():
    text = FLOW.read_text(encoding="utf-8")
    native, marker, binding = text.partition("\nAUTHOR-NATIVE-BINDING: ")
    assert marker
    record = json.loads(binding)
    paragraphs = [
        {"index": int(match[1]), "text": match[2].rstrip("\n")}
        for match in re.finditer(
            r"^\[(\d+)\] (.*?)(?=^    break: |^\[\d+\] |\Z)",
            native, re.MULTILINE | re.DOTALL,
        )
    ]
    candidates = [
        json.loads(line.split("break: ", 1)[1])
        for line in native.splitlines() if line.startswith("    break: ")
    ]
    assert [item["index"] for item in paragraphs] == list(range(len(paragraphs)))
    assert candidates == [
        {"before": left["text"], "after": right["text"]}
        for left, right in zip(paragraphs, paragraphs[1:])
    ]
    return record, paragraphs, candidates


def layout():
    record, before, raw, _ = inputs()
    assert not FLOW.exists() and not FREEZE.exists(), "Native layout/flow runs once"
    lesson = edition.load(WORK / "lesson.template.json")
    assert lesson["source"] == before["source"]
    assert lesson["section_breaks"] == []
    assert len(lesson["prose"]) == len(raw["prose"])
    for index, (original, modern) in enumerate(zip(raw["prose"], lesson["prose"])):
        assert modern["source_text"] == original["text"]
        if original["kind"] != "p":
            assert modern == before["prose"][index]
    edition.normalize_lesson_layout(lesson)
    edition.dump(WORK / "lesson.template.json", lesson)
    normalized_input = bind(WORK / "lesson.template.json")
    result = subprocess.run(
        ["node", str(TOOLS / "prose_flow.mjs"), str(WORK / "lesson.template.json")],
        capture_output=True, text=True, check=True,
    )
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
    binding = {
        "normalizedInput": normalized_input,
        "finalLesson": bind(WORK / "lesson.template.json"),
        "normalizationInvocations": 1, "proseFlowInvocations": 1,
        "native": record["native"], "copiedBoundaryObjects": boundaries,
        "normalizedProse": lesson["prose"], "stderr": result.stderr,
    }
    FLOW.write_text(
        result.stdout + "\nAUTHOR-NATIVE-BINDING: "
        + json.dumps(binding, ensure_ascii=False) + "\n", encoding="utf-8",
    )
    print(result.stdout)
    print(f"Copied {len(boundaries)} actual native adjacent-paragraph boundary objects.")


def freeze():
    assert not FREEZE.exists(), "One author structural check; never rerun frozen gate"
    record, before, raw, raw_exercises = inputs()
    lesson = edition.load(WORK / "lesson.template.json")
    exercises = edition.load(WORK / "exercises.template.json")
    figures = edition.load(WORK / "figures.template.json")
    before_exercises = edition.load(BEFORE / "exercises.template.json")
    profile_file = TOOLS.parent / "profiles/modern-us-neutral.json"
    profile = edition.load(profile_file)
    forbidden = profile["forbidden_terms"] + profile["forbidden_person_names"]
    errors = edition.validate_identity_fields(raw, lesson, edition.IDENTITY_FIELDS, "lesson")
    assert lesson["source"] == before["source"] and lesson["source"]["data"] == raw
    assert exercises["source"] == before_exercises["source"]
    for template in (before, before_exercises):
        source = template["source"]
        source_bytes = (json.dumps(source["data"], ensure_ascii=False, indent=2) + "\n").encode()
        assert hashlib.sha256(source_bytes).hexdigest() == source["sha256"]
    assert len(lesson["prose"]) == len(raw["prose"])
    assert lesson["figures"] == before["figures"] == raw["figures"]
    assert [item["id"] for item in figures["figures"]] == ["fig-152"]
    assert lesson["errata"] == before["errata"] == []
    assert lesson["exercise_count"] == exercises["count"] == raw_exercises["count"] == 0
    assert exercises["exercises"] == raw_exercises["exercises"] == []
    for name in ("exercises.template.json", "figures.template.json"):
        assert edition.sha256(WORK / name) == record["templates"][name]["sha256"]
    assert {key: value for key, value in lesson.items() if key not in ("prose", "section_breaks")} == {
        key: value for key, value in before.items() if key not in ("prose", "section_breaks")
    }
    native, paragraphs, candidates = read_flow()
    assert native["finalLesson"] == bind(WORK / "lesson.template.json")
    assert native["native"] == record["native"] and native["normalizedProse"] == lesson["prose"]
    assert native["normalizationInvocations"] == native["proseFlowInvocations"] == 1
    assert lesson["section_breaks"] == native["copiedBoundaryObjects"]
    positions = [candidates.index(item) for item in lesson["section_breaks"]]
    assert positions == sorted(set(positions)) and len(positions) == len(STARTS)
    normalized_bytes = (
        json.dumps({**lesson, "section_breaks": []}, ensure_ascii=False, indent=2) + "\n"
    ).encode()
    assert hashlib.sha256(normalized_bytes).hexdigest() == native["normalizedInput"]["sha256"]
    coverage = []
    remaining_paragraphs = iter(paragraphs)
    for index, (original, modern) in enumerate(zip(raw["prose"], lesson["prose"])):
        label = f"lesson.prose[{index}]"
        errors += edition.validate_identity_fields(
            original, modern, ("kind", "id", "label", "printed_page", "source_refs"), label,
        )
        assert {
            key: value for key, value in modern.items() if key not in ("text", "changes")
        } == {
            key: value for key, value in before["prose"][index].items()
            if key not in ("text", "changes")
        }
        assert modern["source_text"] == original["text"]
        assert modern["numeric_changes"] == modern["historical_entities"] == []
        errors += edition.validate_text(
            original["text"], modern["text"], modern["changes"], modern["numeric_changes"],
            label, forbidden, modern["historical_entities"],
        )
        source_atoms = [match.group(0) for match in edition.MATH.finditer(original["text"])]
        modern_atoms = [match.group(0) for match in edition.MATH.finditer(modern["text"])]
        source_numbers = re.findall(r"\d+", edition.MATH.sub("", original["text"]))
        modern_numbers = re.findall(r"\d+", edition.MATH.sub("", modern["text"]))
        all_source_numbers = re.findall(r"\d+", original["text"])
        all_modern_numbers = re.findall(r"\d+", modern["text"])
        source_fig_refs = edition.assemble.FIGREF.findall(original["text"])
        modern_fig_refs = edition.assemble.FIGREF.findall(modern["text"])
        if source_atoms != modern_atoms:
            errors.append(f"{label}: exact original math atom drift")
        if source_numbers != modern_numbers or all_source_numbers != all_modern_numbers:
            errors.append(f"{label}: original numeric sequence drift")
        if source_fig_refs != modern_fig_refs:
            errors.append(f"{label}: textual figure reference drift")
        actual_paragraphs = []
        if modern["kind"] == "p":
            for text in modern["text"].split("\n\n"):
                item = next(remaining_paragraphs)
                assert item["text"] == text
                actual_paragraphs.append(item)
        else:
            assert modern == before["prose"][index], "Figure/caption slot must stay unchanged"
        coverage.append({
            "block": index + 1, "kind": original["kind"],
            "id": original["id"], "label": original["label"],
            "printed_page": original["printed_page"], "source_refs": original["source_refs"],
            "sourceText": original["text"], "modernText": modern["text"],
            "sourceSnapshotIdentityRetained": modern["source_text"] == original["text"],
            "exactMathAtomsRetained": source_atoms == modern_atoms,
            "mathAtoms": source_atoms, "mathAtomCount": len(source_atoms),
            "nonmathNumbers": source_numbers, "allNumbers": all_source_numbers,
            "fullOriginalNumericSequenceRetained": all_source_numbers == all_modern_numbers,
            "figureRefs": source_fig_refs, "figureRefsRetained": source_fig_refs == modern_fig_refs,
            "nativeParagraphs": actual_paragraphs, "nativeParagraphCount": len(actual_paragraphs),
            "changes": modern["changes"],
        })
    assert next(remaining_paragraphs, None) is None
    paths = {
        "lessonTemplate": WORK / "lesson.template.json",
        "exercisesTemplate": WORK / "exercises.template.json",
        "figuresTemplate": WORK / "figures.template.json",
        "beforeBindings": BEFORE / "bindings.json", "helper": Path(__file__).resolve(),
        "nativeProseFlow": FLOW, "profile": profile_file,
        "lessonSkill": TOOLS.parent / "SKILL.md",
        "textContract": TOOLS.parent / "references/edition-text-contract.md",
    }
    report = {
        "ticket": "STEMROBIN-181", "batch": "D020", "lesson": CARD,
        "role": "modern-prose-author-only",
        "status": "author-frozen-awaiting-independent-science" if not errors else "author-structural-blocked",
        "bindings": {
            "sourceLesson": record["source"]["lesson.json"],
            "sourceExercises": record["source"]["exercises.json"],
            **{key: bind(file) for key, file in paths.items()},
        },
        "before": record["templates"], "sourcePages": record["pages"],
        "approvedSourceFinalization": record["approvedSourceFinalization"],
        "context199": record["context199"], "definition836": record["definition836"],
        "sourceBindingBasis": "Main's prepared snapshot, embedded canonical hashes and approved text-page hashes; no source gate repeated",
        "nativeTools": record["native"], "reusedAuthorPatterns": record["reusedAuthorPatterns"],
        "sourceBlocks": 17, "sourceProseBlocks": 15,
        "sourceFigureBlocks": 1, "sourceCaptionBlocks": 1,
        "modernParagraphs": len(paragraphs),
        "sourceRefs": [ref for block in raw["prose"] for ref in block["source_refs"]],
        "sourceRefCount": 19, "sourceMathAtoms": sum(item["mathAtomCount"] for item in coverage),
        "sourceTasks": 0, "modernTasks": 0,
        "sourceFigures": ["fig-152"], "modernFigures": ["fig-152"],
        "sourceCoverage": coverage, "nativeParagraphs": paragraphs,
        "sectionBreaks": lesson["section_breaks"],
        "nativeAuthorCheck": {
            "invocations": 1, "status": "pass" if not errors else "fail", "errors": errors,
            "scope": "Prepared snapshot/identity/text and hash-bound single native layout/flow only; no independent SCI",
            "normalizationInvocations": 1, "proseFlowInvocations": 1,
            "normalizationEvidenceBoundToUnchangedProse": True,
            "actualAdjacentBoundaryObjectsCopied": True,
            "zeroTaskExerciseAndFigureTemplatesUnwritten": True,
            "proseFigureAndCaptionBlocksUnmodified": True,
            "embeddedSourceHashesVerified": True,
            "fullOriginalNumericSequencesRetained": all(
                item["fullOriginalNumericSequenceRetained"] for item in coverage
            ),
        },
        "authorConditions": [
            {"source_refs": ["p0200#9", "p0201#1", "p0201#2"],
             "condition": "Finite, identical, facing parallel plates; lateral dimensions much larger than separation; neglect fringing and approximate the gap field as uniform. Equal opposite electrode free charges; static equilibrium; gap entirely filled by a linear homogeneous isotropic dielectric."},
            {"source_refs": ["p0201#3", "p0201#4", "p0201#5"],
             "condition": "Dimensionless relative permittivity distinguished from dimensional vacuum permittivity; signed free surface charge density and equal opposite electrode charges; both gap fields point from positive to negative plate. Exact source math atoms retained."},
            {"source_refs": ["p0201#6", "p0201#7", "p0201#8", "p0201#9"],
             "condition": "Along-field endpoint potential difference is used in magnitude. Cancel nonzero charge; zero-charge limit follows the same linear relation. Charge-independence only at fixed geometry, dielectric and unaltered external/measurement conditions within the model."},
            {"source_refs": ["p0201#10", "p0201#11"],
             "condition": "Original SI and CGSE formulas remain distinct, with their own charge/potential/length units; no setting dimensional SI vacuum permittivity to a unitless value or mixing units."},
            {"source_refs": ["p0201#12", "p0202#1"],
             "condition": "Only source-described movable plates, electrometer grounded case/rod, and charging rod retained. Charging ends before changing separation; insulated electrode free charge approximately conserved, leakage negligible, overlap/medium fixed and connection/environment effects negligible or controlled. Observed voltage change supports the formula's trend, not an exact universal apparatus-free measurement."},
            {"source_refs": ["p0202#4"],
             "condition": "Inserting the source's organic-glass example is a qualitative comparison at approximately fixed electrode charge, separation and overlap. No unsupported assertion that the pictured slab fills the gap; the simple full-fill formula is restricted to complete filling."},
            {"source_refs": ["p0202#5", "p0202#6"],
             "condition": "Large capacitance comes from geometry/relative dielectric response within insulation limits; Earth comparison is the original ideal isolated conducting-sphere estimate. Large stored charge means opposite electrode charges, not net capacitor charge; fixed-voltage capacitance advantage does not deny fixed-capacitance charge increase with voltage. Breakdown exceeds the assumed linear insulating regime and may damage the capacitor."},
        ],
        "errata": [], "prepareRepeated": False, "affectedCorrectionsUsed": 0,
        "unresolvedIssues": [
            "Independent SCI has not run",
            "Modern figure work and Main finalization/surface checks remain outside this author's scope",
        ],
        "outsideSourceAssumptions": {
            "page199": "Approved text-only context; no figure, math atom or source_ref imported. Definition (8-36) actually resides at p0200#4.",
            "page203": "Approval consumed only from Main's finalization record; no page203 text or image opened or imported",
            "reference818": "Original cross-reference retained; no external or unapproved source page reopened",
            "adjacentLessons": "No n80 history or n82 content imported; figure152 and caption remain in their original slots",
        },
        "noIndependentScienceApproval": True,
        "noDurableWritesFigureFinalizeRenderImageBrowserDBGitSharedToolOrFullChecks": True,
        "inFlightProcesses": [],
    }
    new_json(FREEZE, report)
    print(json.dumps({
        "freeze": bind(FREEZE), "status": report["status"],
        "template": bind(WORK / "lesson.template.json"),
        "sourceBlocks": 17, "sourceProseBlocks": 15, "sourceRefs": 19,
        "sourceMathAtoms": report["sourceMathAtoms"], "modernParagraphs": len(paragraphs),
        "paragraphCounts": [item["nativeParagraphCount"] for item in coverage],
        "sectionBreaks": lesson["section_breaks"], "errors": errors,
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
