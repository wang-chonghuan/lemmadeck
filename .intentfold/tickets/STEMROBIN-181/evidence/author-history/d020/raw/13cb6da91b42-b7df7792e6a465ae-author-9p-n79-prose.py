"""n79 prose-only snapshot, one native layout/flow and one structural freeze."""

from collections import Counter
import hashlib
import json
from pathlib import Path
import re
import shutil
import subprocess
import sys

sys.dont_write_bytecode = True
ROOT = Path.cwd()
TMP = Path(__file__).resolve().parent
TOOLS = ROOT / ".claude/skills/ld-s10y-lesson/tools"
sys.path.insert(0, str(TOOLS))
import edition

CARD = "phy9-c2-s2-n79"
BOOK = ROOT / "ssot-resources/soviet10year-textbooks/artifacts/9p"
WORK = ROOT / ".tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons" / CARD
BEFORE = TMP / "9p-n79-before"
FLOW = TMP / "9p-n79-native-prose-flow.txt"
FREEZE = TMP / "9p-n79-prose-freeze.json"
NAMES = ("lesson.template.json", "exercises.template.json", "figures.template.json")
PAGES = (198, 199)
STARTS = (
    "**静电单位制中的“厘米”**",
    "**法拉的量级与常用小单位**",
    "**真空介电常数的单位**",
)
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
    assert not BEFORE.exists()
    assert not FLOW.exists() and not FREEZE.exists()
    BEFORE.mkdir()
    record = {"lesson": CARD, "templates": {}, "source": {}, "pages": {}, "native": {}}
    for name in NAMES:
        shutil.copyfile(WORK / name, BEFORE / name)
        record["templates"][name] = {**bind(BEFORE / name), "original": bind(WORK / name)}
        assert record["templates"][name]["sha256"] == record["templates"][name]["original"]["sha256"]
    lesson = edition.load(BEFORE / "lesson.template.json")
    exercises = edition.load(BEFORE / "exercises.template.json")
    # Source bindings come only from Main's adapt-prepared snapshots; no source file is opened.
    record["source"] = {
        "lesson.json": declared_source(lesson),
        "exercises.json": declared_source(exercises),
    }
    refs = [ref for block in lesson["source"]["data"]["prose"] for ref in block["source_refs"]]
    record["pages"] = {
        str(page): {
            "source_refs": [ref for ref in refs if int(ref[1:5]) == page],
            "basis": "adapt-prepared lesson.source.data; source page not read",
        }
        for page in PAGES
    }
    record["native"] = {name: bind(TOOLS / name) for name in NATIVE}
    record["sourceRead"] = False
    new_json(BEFORE / "bindings.json", record)
    print(json.dumps(record, ensure_ascii=False, indent=2))


def inputs():
    record = edition.load(BEFORE / "bindings.json")
    for name, item in record["templates"].items():
        assert edition.sha256(BEFORE / name) == item["sha256"]
    for item in record["native"].values():
        assert edition.sha256(ROOT / item["path"]) == item["sha256"], item["path"]
    before = edition.load(BEFORE / "lesson.template.json")
    before_exercises = edition.load(BEFORE / "exercises.template.json")
    raw = before["source"]["data"]
    raw_exercises = before_exercises["source"]["data"]
    assert len(raw["prose"]) == 9
    assert Counter(item["kind"] for item in raw["prose"]) == {"p": 9}
    assert raw["exercise_count"] == raw_exercises["count"] == 0
    assert raw_exercises["exercises"] == []
    assert raw["figures"] == []
    refs = [ref for item in raw["prose"] for ref in item["source_refs"]]
    assert len(refs) == len(set(refs)) == 10
    assert set(int(ref[1:5]) for ref in refs) == set(PAGES)
    assert record["sourceRead"] is False
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
    assert lesson["source"] == before["source"] and lesson["source"]["data"] == raw
    assert lesson["section_breaks"] == []
    assert len(lesson["prose"]) == len(raw["prose"])
    for original, modern in zip(raw["prose"], lesson["prose"]):
        assert modern["source_text"] == original["text"]
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
        "normalizationInvocations": 1,
        "proseFlowInvocations": 1,
        "native": record["native"],
        "copiedBoundaryObjects": boundaries,
        "normalizedProse": lesson["prose"],
        "stderr": result.stderr,
    }
    FLOW.write_text(
        result.stdout + "\nAUTHOR-NATIVE-BINDING: "
        + json.dumps(binding, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    print(result.stdout)
    print(f"Copied {len(boundaries)} actual native adjacent-paragraph boundary objects.")


def freeze():
    assert not FREEZE.exists(), "One author structural check; never rerun frozen gate"
    record, before, raw, raw_exercises = inputs()
    lesson = edition.load(WORK / "lesson.template.json")
    exercises = edition.load(WORK / "exercises.template.json")
    figures = edition.load(WORK / "figures.template.json")
    profile_file = TOOLS.parent / "profiles/modern-us-neutral.json"
    profile = edition.load(profile_file)
    forbidden = profile["forbidden_terms"] + profile["forbidden_person_names"]
    errors = edition.validate_identity_fields(raw, lesson, edition.IDENTITY_FIELDS, "lesson")
    assert lesson["source"] == before["source"] and lesson["source"]["data"] == raw
    before_exercises = edition.load(BEFORE / "exercises.template.json")
    assert exercises["source"] == before_exercises["source"]
    for template in (before, before_exercises):
        source = template["source"]
        source_bytes = (json.dumps(source["data"], ensure_ascii=False, indent=2) + "\n").encode()
        assert hashlib.sha256(source_bytes).hexdigest() == source["sha256"]
    assert len(lesson["prose"]) == len(raw["prose"])
    assert lesson["figures"] == before["figures"] == raw["figures"] == figures["figures"] == []
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
    assert native["native"] == record["native"]
    assert native["normalizedProse"] == lesson["prose"]
    assert native["normalizationInvocations"] == native["proseFlowInvocations"] == 1
    assert lesson["section_breaks"] == native["copiedBoundaryObjects"]
    indices = [candidates.index(item) for item in lesson["section_breaks"]]
    assert indices == sorted(set(indices)) and len(indices) == len(STARTS)
    normalized_input = {**lesson, "section_breaks": []}
    normalized_bytes = (json.dumps(normalized_input, ensure_ascii=False, indent=2) + "\n").encode()
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
        outside_digits = lambda text: re.findall(r"\d+", edition.MATH.sub("", text))
        source_numbers, modern_numbers = outside_digits(original["text"]), outside_digits(modern["text"])
        all_source_numbers = re.findall(r"\d+", original["text"])
        all_modern_numbers = re.findall(r"\d+", modern["text"])
        source_fig_refs = edition.assemble.FIGREF.findall(original["text"])
        modern_fig_refs = edition.assemble.FIGREF.findall(modern["text"])
        if source_atoms != modern_atoms:
            errors.append(f"{label}: exact original math atom drift")
        if source_numbers != modern_numbers:
            errors.append(f"{label}: nonmath number order drift")
        if all_source_numbers != all_modern_numbers:
            errors.append(f"{label}: full original numeric sequence drift")
        if source_fig_refs != modern_fig_refs:
            errors.append(f"{label}: textual figure reference drift")
        actual_paragraphs = []
        for text in modern["text"].split("\n\n"):
            item = next(remaining_paragraphs)
            assert item["text"] == text
            actual_paragraphs.append(item)
        coverage.append({
            "block": index + 1,
            "kind": original["kind"],
            "id": original["id"],
            "label": original["label"],
            "printed_page": original["printed_page"],
            "source_refs": original["source_refs"],
            "sourceText": original["text"],
            "modernText": modern["text"],
            "sourceSnapshotIdentityRetained": modern["source_text"] == original["text"],
            "exactMathAtomsRetained": source_atoms == modern_atoms,
            "mathAtoms": source_atoms,
            "mathAtomCount": len(source_atoms),
            "nonmathNumbers": source_numbers,
            "nonmathNumberSequenceRetained": source_numbers == modern_numbers,
            "allNumbers": all_source_numbers,
            "fullOriginalNumericSequenceRetained": all_source_numbers == all_modern_numbers,
            "figureRefs": source_fig_refs,
            "figureRefsRetained": source_fig_refs == modern_fig_refs,
            "nativeParagraphs": actual_paragraphs,
            "nativeParagraphCount": len(actual_paragraphs),
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
        "before": record["templates"],
        "sourcePages": record["pages"],
        "sourceBindingBasis": "Main's adapt-prepared source snapshots; embedded canonical JSON hashes verified, durable sources not reopened.",
        "nativeTools": record["native"],
        "sourceBlocks": len(raw["prose"]),
        "sourceProseBlocks": 9, "sourceFigureBlocks": 0, "sourceCaptionBlocks": 0,
        "modernParagraphs": len(paragraphs),
        "sourceRefs": [ref for block in raw["prose"] for ref in block["source_refs"]],
        "sourceRefCount": 10,
        "sourceMathAtoms": sum(item["mathAtomCount"] for item in coverage),
        "sourceTasks": 0, "modernTasks": 0,
        "sourceFigures": [], "modernFigures": [],
        "sourceCoverage": coverage,
        "nativeParagraphs": paragraphs,
        "sectionBreaks": lesson["section_breaks"],
        "nativeAuthorCheck": {
            "invocations": 1, "status": "pass" if not errors else "fail", "errors": errors,
            "scope": "Adapt-prepared source snapshot/identity/text, empty errata and hash-bound single native layout/flow evidence only; no source reads or independent SCI.",
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
            {"source_refs": ["p0198#5", "p0198#6"],
             "condition": "Fixed conductor geometry, surrounding medium and external conductor positions; isolated conductor and common potential reference; capacitance defined by corresponding charge and potential increments."},
            {"source_refs": ["p0198#7"],
             "condition": "Historical electrostatic capacitance unit is the capacitance of an isolated conducting sphere in vacuum; centimetre here names a capacitance unit, not physical length."},
            {"source_refs": ["p0198#8", "p0198#9"],
             "condition": "Original unit-conversion math atoms and numerical order retained exactly; equality chain explicitly uses the original historical rounded charge/potential conversions, not an exact modern conversion."},
            {"source_refs": ["p0198#10", "p0199#1"],
             "condition": "Farad/solar-radius comparison belongs to an isolated conducting sphere in vacuum and historical approximate scales; 13 denotes the radius ratio, not an additional increase. Micro/picofarad powers are unchanged. Earth's 709 microfarads is the original ideal isolated-sphere estimate, not an environment-independent exact measurement."},
            {"source_refs": ["p0199#2", "p0199#3", "p0199#4"],
             "condition": "Isolated conducting sphere surrounded by a uniform linear isotropic dielectric; C and r belong to the same sphere, historical epsilon denotes dimensionless relative permittivity, epsilon_0 denotes vacuum permittivity. Original formula, including its ASCII terminal period, retained exactly; farad per metre is a unit conclusion, not dependence on the chosen sphere."},
        ],
        "errata": [], "prepareRepeated": False, "affectedCorrectionsUsed": 0,
        "unresolvedIssues": [
            "Independent SCI has not run",
            "Authoritative source revalidation and Main finalization/surface checks remain outside this author's scope",
        ],
        "outsideSourceAssumptions": {
            "pages198And199": "No source/image reads; only the ten n79 source_refs in Main's prepared source snapshot used.",
            "adjacentLessons": "No adjacent lesson or source-page content imported; historical formula references preserved without reopening them.",
        },
        "noIndependentScienceApproval": True,
        "noSourceDurableFigureFinalizeRenderBrowserDBGitSharedToolOrFullChecks": True,
        "inFlightProcesses": [],
    }
    new_json(FREEZE, report)
    print(json.dumps({
        "freeze": bind(FREEZE), "status": report["status"],
        "template": bind(WORK / "lesson.template.json"),
        "sourceBlocks": report["sourceBlocks"], "sourceRefs": report["sourceRefCount"],
        "sourceMathAtoms": report["sourceMathAtoms"], "modernParagraphs": len(paragraphs),
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
