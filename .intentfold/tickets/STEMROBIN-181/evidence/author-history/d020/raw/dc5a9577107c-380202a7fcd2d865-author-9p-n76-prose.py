"""n76 prose-only snapshot, one native layout/flow and one structural freeze."""

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

CARD = "phy9-c2-s2-n76"
BOOK = ROOT / "ssot-resources/soviet10year-textbooks/artifacts/9p"
SOURCE = BOOK / "lessons" / CARD
WORK = ROOT / ".tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons" / CARD
BEFORE = TMP / "9p-n76-before"
FLOW = TMP / "9p-n76-native-prose-flow.txt"
FREEZE = TMP / "9p-n76-prose-freeze.json"
NAMES = ("lesson.template.json", "exercises.template.json", "figures.template.json")
PAGES = (188, 189, 190, 191)
STARTS = (
    "**非匀强静电场的局部近似**",
    "**电场强度的单位**",
    "**等势面**",
    "**静电平衡导体**",
)
NATIVE = ("edition.py", "htmlfrag.js", "prose_flow.mjs")


def bind(file):
    return {"path": file.relative_to(ROOT).as_posix(), "sha256": edition.sha256(file)}


def new_json(file, value):
    assert not file.exists(), f"Preserve existing evidence: {file}"
    edition.dump(file, value)


def snapshot():
    assert not BEFORE.exists()
    assert not FLOW.exists() and not FREEZE.exists()
    BEFORE.mkdir()
    record = {"lesson": CARD, "templates": {}, "source": {}, "pages": {}, "native": {}}
    for name in NAMES:
        shutil.copyfile(WORK / name, BEFORE / name)
        record["templates"][name] = {**bind(BEFORE / name), "original": bind(WORK / name)}
        assert record["templates"][name]["sha256"] == record["templates"][name]["original"]["sha256"]
    for name in ("lesson.json", "lesson.md", "exercises.json"):
        record["source"][name] = bind(SOURCE / name)
    for page in PAGES:
        record["pages"][str(page)] = {
            name: bind(BOOK / "pages" / f"{page:04d}" / name)
            for name in ("page.json", "page.md")
        }
    record["native"] = {name: bind(TOOLS / name) for name in NATIVE}
    new_json(BEFORE / "bindings.json", record)
    print(json.dumps(record, ensure_ascii=False, indent=2))


def inputs():
    record = edition.load(BEFORE / "bindings.json")
    for name, item in record["templates"].items():
        assert edition.sha256(BEFORE / name) == item["sha256"]
    bound = list(record["source"].values()) + list(record["native"].values())
    bound += [item for page in record["pages"].values() for item in page.values()]
    for item in bound:
        assert edition.sha256(ROOT / item["path"]) == item["sha256"], item["path"]
    raw = edition.load(SOURCE / "lesson.json")
    raw_exercises = edition.load(SOURCE / "exercises.json")
    assert len(raw["prose"]) == 24
    assert Counter(item["kind"] for item in raw["prose"]) == {"p": 16, "fig": 4, "cap": 4}
    assert raw["exercise_count"] == raw_exercises["count"] == 0
    assert raw_exercises["exercises"] == []
    assert [item["id"] for item in raw["figures"]] == [
        "fig-140", "fig-141", "fig-142", "fig-143",
    ]
    refs = [ref for item in raw["prose"] for ref in item["source_refs"]]
    assert len(refs) == len(set(refs)) == 28
    assert set(int(ref[1:5]) for ref in refs) == set(PAGES)
    return record, edition.load(BEFORE / "lesson.template.json"), raw, raw_exercises


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
    assert lesson["figures"] == before["figures"] == raw["figures"]
    assert lesson["errata"] == before["errata"] == []
    assert lesson["exercise_count"] == exercises["count"] == 0 and exercises["exercises"] == []
    for name in ("exercises.template.json", "figures.template.json"):
        assert edition.sha256(WORK / name) == record["templates"][name]["sha256"]
    native, paragraphs, candidates = read_flow()
    assert native["finalLesson"] == bind(WORK / "lesson.template.json")
    assert native["native"] == record["native"]
    assert native["normalizedProse"] == lesson["prose"]
    assert native["normalizationInvocations"] == native["proseFlowInvocations"] == 1
    assert lesson["section_breaks"] == native["copiedBoundaryObjects"]
    indices = [candidates.index(item) for item in lesson["section_breaks"]]
    assert indices == sorted(set(indices)) and len(indices) == len(STARTS)
    normalized_input = {**lesson, "section_breaks": []}
    assert edition.sha256(WORK / "lesson.template.json") == native["finalLesson"]["sha256"]
    normalized_bytes = (json.dumps(normalized_input, ensure_ascii=False, indent=2) + "\n").encode()
    assert hashlib.sha256(normalized_bytes).hexdigest() == native["normalizedInput"]["sha256"]
    coverage = []
    remaining_paragraphs = iter(paragraphs)
    for index, (original, modern) in enumerate(zip(raw["prose"], lesson["prose"])):
        label = f"lesson.prose[{index}]"
        errors += edition.validate_identity_fields(
            original, modern, ("kind", "id", "label", "printed_page", "source_refs"), label,
        )
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
        source_fig_refs = edition.assemble.FIGREF.findall(original["text"])
        modern_fig_refs = edition.assemble.FIGREF.findall(modern["text"])
        if source_atoms != modern_atoms:
            errors.append(f"{label}: exact original math atom drift")
        if source_numbers != modern_numbers:
            errors.append(f"{label}: nonmath number order drift")
        if source_fig_refs != modern_fig_refs:
            errors.append(f"{label}: textual figure reference drift")
        actual_paragraphs = []
        if modern["kind"] == "p":
            # Assign the native tool's actual paragraphs to their preserved source block.
            for text in modern["text"].split("\n\n"):
                item = next(remaining_paragraphs)
                assert item["text"] == text
                actual_paragraphs.append(item)
        else:
            assert modern == before["prose"][index], "Figure/caption placeholder must stay byte-equivalent"
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
            "figureRefs": source_fig_refs,
            "figureRefsRetained": source_fig_refs == modern_fig_refs,
            "nativeParagraphs": actual_paragraphs,
            "nativeParagraphCount": len(actual_paragraphs),
            "changes": modern["changes"],
        })
    assert next(remaining_paragraphs, None) is None
    paths = {
        "sourceLesson": SOURCE / "lesson.json", "sourceMarkdown": SOURCE / "lesson.md",
        "sourceExercises": SOURCE / "exercises.json", "lessonTemplate": WORK / "lesson.template.json",
        "exercisesTemplate": WORK / "exercises.template.json", "figuresTemplate": WORK / "figures.template.json",
        "beforeBindings": BEFORE / "bindings.json", "helper": Path(__file__).resolve(),
        "nativeProseFlow": FLOW, "profile": profile_file,
        "lessonSkill": TOOLS.parent / "SKILL.md",
        "textContract": TOOLS.parent / "references/edition-text-contract.md",
    }
    report = {
        "ticket": "STEMROBIN-181", "batch": "D020", "lesson": CARD,
        "role": "modern-prose-author-only",
        "status": "author-frozen-awaiting-independent-science" if not errors else "author-structural-blocked",
        "bindings": {key: bind(file) for key, file in paths.items()},
        "before": record["templates"],
        "sourcePages": record["pages"],
        "nativeTools": record["native"],
        "sourceBlocks": len(raw["prose"]),
        "sourceProseBlocks": 16, "sourceFigureBlocks": 4, "sourceCaptionBlocks": 4,
        "modernParagraphs": len(paragraphs),
        "sourceRefs": [ref for block in raw["prose"] for ref in block["source_refs"]],
        "sourceRefCount": 28,
        "sourceMathAtoms": sum(item["mathAtomCount"] for item in coverage),
        "sourceTasks": 0, "modernTasks": 0,
        "sourceFigures": [item["id"] for item in raw["figures"]],
        "modernFigures": [item["id"] for item in lesson["figures"]],
        "sourceCoverage": coverage,
        "nativeParagraphs": paragraphs,
        "sectionBreaks": lesson["section_breaks"],
        "nativeAuthorCheck": {
            "invocations": 1, "status": "pass" if not errors else "fail", "errors": errors,
            "scope": "Source/identity/text/errata and hash-bound single native layout/flow evidence only; no independent SCI.",
            "normalizationInvocations": 1, "proseFlowInvocations": 1,
            "normalizationEvidenceBoundToUnchangedProse": True,
            "actualAdjacentBoundaryObjectsCopied": True,
            "zeroTaskExerciseAndFigureTemplatesUnwritten": True,
            "proseFigureAndCaptionBlocksUnmodified": True,
        },
        "authorConditions": [
            {"source_refs": ["p0188#5", "p0188#7", "p0188#12"],
             "condition": "Uniform electrostatic field; negligible probe disturbance; nonzero signed q, displacement along E, positive distance, signed work and cancellation of q."},
            {"source_refs": ["p0188#11", "p0188#14", "p0189#1"],
             "condition": "V=U1-U2 explicitly means starting potential minus ending potential; nonzero E points toward decreasing potential regardless of probe charge sign."},
            {"source_refs": ["p0189#2"],
             "condition": "A zero potential change along one direction fixes only that component; constant potential throughout a spatial region implies zero full E."},
            {"source_refs": ["p0189#3"],
             "condition": "Smooth nonsingular electrostatic region, sufficiently short along-field displacement, negligible magnitude/direction variation: local approximation, not finite-distance exactness."},
            {"source_refs": ["p0189#4", "p0189#5", "p0189#6", "p0189#7"],
             "condition": "Volt-per-metre definition uses along-field endpoint order; exact SI equality retained, historical static-unit conversion explicitly uses approximate constants without changing its math."},
            {"source_refs": ["p0189#8", "p0189#9", "p0190#7"],
             "condition": "Every local tangential displacement along one connected equipotential surface is transverse to E; normal direction specified where E is nonzero and the surface is smooth; point-charge example uses infinity reference."},
            {"source_refs": ["p0190#8", "p0191#1"],
             "condition": "Same connected conductor in electrostatic equilibrium; zero material-internal field, zero external tangential surface component; isolated undisturbed solid sphere, common infinity reference and radius substitution."},
        ],
        "errata": [], "prepareRepeated": False, "affectedCorrectionsUsed": 0,
        "unresolvedIssues": ["Independent SCI has not run", "Modern figures and Main finalization/surface checks remain outside this author's scope"],
        "outsideSourceAssumptions": {
            "page187": "Not reopened, resolved, approved or assumed; no n75 formula imported.",
            "page191AfterN76": "n77 material excluded; only p0191#1 belongs to this card.",
        },
        "noIndependentScienceApproval": True,
        "noSourceDurableFigureFinalizeRenderBrowserDBGitSharedToolOrFullChecks": True,
        "inFlightProcesses": [],
    }
    new_json(FREEZE, report)
    print(json.dumps({
        "freeze": bind(FREEZE), "status": report["status"],
        "template": bind(WORK / "lesson.template.json"),
        "sourceBlocks": report["sourceBlocks"], "sourceRefs": 28,
        "sourceMathAtoms": report["sourceMathAtoms"], "modernParagraphs": len(paragraphs),
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
