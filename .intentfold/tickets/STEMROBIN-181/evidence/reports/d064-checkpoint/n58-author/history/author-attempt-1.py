#!/usr/bin/env python3
"""One isolated native preparation and source-bound bilingual text authoring."""

from __future__ import annotations

import copy
import hashlib
import json
import os
import shutil
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

sys.dont_write_bytecode = True
OWN = Path(__file__).resolve().parents[1]
REPO = OWN.parents[4]
RAW = OWN.parent / "d062-source154-155/root"
TOOLS = REPO / ".claude/skills/ld-s10y-lesson/tools"
sys.path.insert(0, str(TOOLS))
import edition

LESSON = "phy10-c1-s6-n58"
EDITION = "modern-us-neutral"
CONSUMED = REPO / ".intentfold/tickets/STEMROBIN-181/evidence/reports/d062-source154-155-consumed.json"
CONSUMED_HASH = "53ae897ccc69f953abb5bc2346e3af681224fead7ece574957336485afb9a694"
PROFILE = TOOLS.parent / "profiles/modern-us-neutral.json"
ENV = {**os.environ, "PYTHONDONTWRITEBYTECODE": "1"}


def digest(file):
    return hashlib.sha256(file.read_bytes()).hexdigest()


def load(file):
    return json.loads(file.read_text(encoding="utf-8"))


def owned(file):
    if not file.resolve().is_relative_to(OWN):
        raise RuntimeError(f"Write outside owned directory: {file}")


def dump(file, value, *, new=True):
    owned(file)
    file.parent.mkdir(parents=True, exist_ok=True)
    with file.open("x" if new else "w", encoding="utf-8") as handle:
        json.dump(value, handle, ensure_ascii=False, indent=2)
        handle.write("\n")


def record(file):
    return {"path": str(file), "sha256": digest(file), "bytes": file.stat().st_size}


def snapshot(source, target):
    owned(target)
    target.parent.mkdir(parents=True, exist_ok=True)
    if target.exists():
        raise RuntimeError(f"Refuse to overwrite snapshot: {target}")
    shutil.copyfile(source, target)
    assert digest(source) == digest(target)
    return {**record(target), "original": record(source), "exactCopy": True}


def template_dir(locale):
    return OWN / "work" / locale / "adapt/10p" / EDITION / "lessons" / LESSON


def run_recorded(name, command):
    started = OWN / "work/receipts" / f"{name}.started.json"
    dump(started, {
        "command": command, "cwd": str(REPO),
        "startedAt": datetime.now(timezone.utc).isoformat(),
        "scope": "Isolated n58 author workflow only; preserve failures without retry.",
    })
    try:
        result = subprocess.run(command, cwd=REPO, env=ENV, text=True, capture_output=True)
        receipt = {
            "command": command, "cwd": str(REPO),
            "exitCode": result.returncode,
            "stdout": result.stdout, "stderr": result.stderr,
            "finishedAt": datetime.now(timezone.utc).isoformat(),
            "status": "pass" if result.returncode == 0 else "FAIL-preserved-no-retry",
        }
    except Exception as error:
        dump(OWN / "work/receipts" / f"{name}.json", {
            "command": command, "status": "FAIL-preserved-no-retry",
            "exception": repr(error),
        })
        raise
    dump(OWN / "work/receipts" / f"{name}.json", receipt)
    if result.returncode:
        raise RuntimeError(f"{name} failed; receipt preserved, no replay")
    return result


def prepare():
    assert digest(CONSUMED) == CONSUMED_HASH
    consumed = load(CONSUMED)
    assert consumed["status"] == "PASS-source-consumed"
    assert consumed["sourceCandidate"]["card"] == LESSON
    assert consumed["sourceCandidate"]["SOURCE"] == "PASS-complete-range"
    assert consumed["sourceCandidate"]["RAW"] == "PASS-owned-fig114"
    bindings = [snapshot(CONSUMED, OWN / "work/source-consumed.json")]
    for name in ["lesson", "exercises"]:
        file = RAW / "10p/lessons" / LESSON / f"{name}.json"
        assert digest(file) == consumed["sourceCandidate"][name]["sha256"]
    output_hashes = {item["path"]: item["sha256"] for item in consumed["outputs"]}
    selected = [Path("book.json")]
    selected += [
        Path(f"pages/{page:04}/{name}")
        for page in [154, 155]
        for name in ["page.json", "page.md", "audit.json"]
    ]
    selected += [
        Path("lessons") / LESSON / name
        for name in ["lesson.json", "lesson.md", "exercises.json"]
    ]
    selected += [Path("figures/fig-114.png"), Path("figures/fig-114.svg")]
    for relative in selected:
        file = RAW / "10p" / relative
        canonical = f"ssot-resources/soviet10year-textbooks/artifacts/10p/{relative.as_posix()}"
        if canonical in output_hashes:
            assert digest(file) == output_hashes[canonical], relative
        bindings.append(snapshot(file, OWN / "root/10p" / relative))
    source = load(OWN / "root/10p/lessons" / LESSON / "lesson.json")
    exercises = load(OWN / "root/10p/lessons" / LESSON / "exercises.json")
    assert source["exercise_count"] == exercises["count"] == 0
    assert exercises["exercises"] == []
    assert len(source["prose"]) == 7
    assert [block["source_refs"] for block in source["prose"]] == [
        ["p0154#2"], ["p0154#3"], ["p0154#4"], ["p0154#5"],
        ["p0154#6"], ["p0154#7"], ["p0155#1"],
    ]
    assert source["figures"] == [{"id": "fig-114", "label": "图 114", "page": 154}]
    tools = [
        TOOLS / "p2c.py", TOOLS / "edition.py", TOOLS / "prose_flow.mjs",
        TOOLS / "htmlfrag.js", TOOLS.parent / "references/edition-text-contract.md",
        PROFILE,
    ]
    dump(OWN / "work/native-tools-before.json", [record(file) for file in tools])
    command = [
        sys.executable, str(TOOLS / "p2c.py"), "adapt-prepare",
        "--book", "10p", "--edition", EDITION, "--lesson", LESSON,
        "--root", str(OWN / "root"), "--work", str(OWN / "work/zh"),
    ]
    result = run_recorded("adapt-prepare-once", command)
    for name in ["lesson.template.json", "exercises.template.json", "figures.template.json"]:
        snapshot(template_dir("zh") / name, template_dir("en") / name)
        snapshot(template_dir("zh") / name, OWN / "work/prepared" / name)
    dump(OWN / "work/prepare-receipt.json", {
        "status": "prepared-isolated-author-only",
        "nativePrepareInvocations": 1, "command": command, "exitCode": result.returncode,
        "stdout": result.stdout, "stderr": result.stderr,
        "enTemplateBasis": "Exact clone of the single stock adapt-prepare output.",
        "sourceBindings": bindings,
        "identity": {key: source[key] for key in edition.IDENTITY_FIELDS},
        "sourceSpanIncludingTitle": ["p0154#1", "p0155#1"],
        "sourceWrittenExercises": 0,
        "rawFigureBytesCopiedOnly": True,
        "imageOpens": 0, "cumulativeImageCount": 24,
        "sourceReviewReplayed": False, "sourceAssemblyReplayed": False,
    })
    print(result.stdout, end="")


def author():
    content = load(OWN / "work/text-authoring.json")
    source = load(OWN / "root/10p/lessons" / LESSON / "lesson.json")
    entries = []
    for locale in ["zh", "en"]:
        directory = template_dir(locale)
        document = load(directory / "lesson.template.json")
        for index, (block, proposal) in enumerate(zip(document["prose"], content["blocks"], strict=True)):
            assert block["source_refs"] == [proposal["source_ref"]]
            block["text"] = proposal[locale]
            block["changes"] = list(proposal["changes"])
            if locale == "en" and block["text"] != block["source_text"]:
                block["changes"] = list(dict.fromkeys(["translation", *block["changes"]]))
            block["numeric_changes"] = []
            block["historical_entities"] = []
            block["change_reason"] = proposal["reason"]
        edition.normalize_lesson_layout(document)
        dump(directory / "lesson.template.json", document, new=False)
        outline, errors = edition.prose_flow_contract(document["prose"], [])
        assert not errors, errors
        anchors = []
        for ref in content["sectionStarts"]:
            target = next(i for i, block in enumerate(document["prose"]) if ref in block["source_refs"])
            paragraph = next(p for p in outline["paragraphs"] if p["blockIndex"] == target)
            previous = outline["paragraphs"][paragraph["index"] - 1]
            anchors.append({"before": previous["text"], "after": paragraph["text"]})
        bound_flow, errors = edition.prose_flow_contract(document["prose"], anchors)
        assert not errors, errors
        document["section_breaks"] = [
            {"before": item["before"], "after": item["after"]}
            for item in bound_flow["boundaries"]
        ]
        assert document["section_breaks"] == anchors
        dump(directory / "lesson.template.json", document, new=False)
        dump(OWN / "work/text-evidence" / f"prose-flow-{locale}.json", {
            "method": "Existing Python normalize_lesson_layout first, then existing JavaScript prose_flow.mjs final adjacent-paragraph anchors.",
            "input": record(directory / "lesson.template.json"),
            "sectionStartSourceRefs": content["sectionStarts"],
            "outlineBeforeBoundaries": outline, "proseFlow": bound_flow,
        })
        for index, (block, proposal) in enumerate(zip(document["prose"], content["blocks"], strict=True)):
            entries.append({
                "locale": locale, "target": f"lesson.prose[{index}]",
                "source_refs": block["source_refs"],
                "source_text": block["source_text"], "modern_text": block["text"],
                "changes": block["changes"], "reason": proposal["reason"],
                "physicalQualifications": proposal["physicalQualifications"],
                "retainedConcepts": proposal["retainedConcepts"],
                "sourceMathSignature": edition.math_signature(block["source_text"]),
                "modernMathSignature": edition.math_signature(block["text"]),
                "sourceNumberSignature": edition.prose_number_signature(block["source_text"]),
                "modernNumberSignature": edition.prose_number_signature(block["text"]),
                "numeric_changes": [], "formula_changes": [], "notation_changes": [],
                "historical_entities": [], "independentSCI": "pending", "independentZHEN": "pending",
            })
        figures = load(directory / "figures.template.json")
        figures["authoring_status"] = "HOLD-modernfigure-imagebudget24"
        figures["promotable"] = False
        figures["hold"] = {
            "figure": "fig-114", "reason": "Cumulative image-open budget is exhausted at 24/24.",
            "rawSourceStatus": "Inherited RAW PASS only; not a modern figure gate.",
            "modernFigureAuthored": False, "modernFigureRendered": False,
            "modernFigureVisuallyOpened": False, "modernFigureApproved": False,
            "modernSpecCreated": False, "referenceOmitted": False,
        }
        assert len(figures["figures"]) == 1 and figures["figures"][0]["id"] == "fig-114"
        dump(directory / "figures.template.json", figures, new=False)
    dump(OWN / "work/change-register.json", {
        "status": "author-draft-SCI-ZHEN-pending", "lesson": LESSON,
        "entries": entries,
        "mathCorrections": [], "numericChanges": [], "notationChanges": [],
        "historicalEntities": [],
        "basis": "Exact owned source blocks only; author-supplied scope qualifications and corresponding translation, with no external factual expansion.",
        "externalReferencesFetched": False,
    })
    dump(OWN / "work/display-overlay.en.json", {
        "schema": "d063/lesson-display-overlay@1", "lesson": LESSON,
        "locale": "en", "status": "draft", "displayTitle": content["displayTitleEn"],
        "nativeTitle": source["title"], "nativeIdentityChanged": False,
        "lessonTemplate": record(template_dir("en") / "lesson.template.json"),
        "installed": False,
        "scope": "Separate proposed English display overlay only; no native identity, application or database change.",
    })
    print("Both locale texts normalized; real adjacent-paragraph anchors bound; fig114 HOLD retained.")


def check_text():
    raw_dir = OWN / "root/10p/lessons" / LESSON
    source = load(raw_dir / "lesson.json")
    exercise_source = load(raw_dir / "exercises.json")
    profile = load(PROFILE)
    reports, errors = {}, []
    for locale in ["zh", "en"]:
        directory = template_dir(locale)
        document = load(directory / "lesson.template.json")
        exercises = load(directory / "exercises.template.json")
        figures = load(directory / "figures.template.json")
        local = edition.validate_identity_fields(source, document, edition.IDENTITY_FIELDS, f"{locale}.lesson")
        local += edition.validate_source(OWN / "root/10p", document["source"], raw_dir / "lesson.json", f"{locale}.source")
        local += edition.validate_source(OWN / "root/10p", exercises["source"], raw_dir / "exercises.json", f"{locale}.exercise-source")
        assert document["source"]["data"] == source
        assert exercises["source"]["data"] == exercise_source
        assert document["status"] == exercises["status"] == figures["status"] == "draft"
        assert document["exercise_count"] == exercises["count"] == 0
        assert exercises["exercises"] == []
        assert len(source["prose"]) == len(document["prose"]) == 7
        assert source["figures"] == document["figures"]
        for index, (old, modern) in enumerate(zip(source["prose"], document["prose"], strict=True)):
            local += edition.validate_identity_fields(
                old, modern, ("kind", "id", "label", "printed_page", "source_refs"),
                f"{locale}.prose[{index}]",
            )
            assert modern["source_text"] == old["text"]
            local += edition.validate_text(
                old["text"], modern["text"], modern["changes"],
                modern["numeric_changes"], f"{locale}.prose[{index}]",
                profile.get("forbidden_terms", []), modern["historical_entities"],
            )
            if old["kind"] == "p":
                assert edition.normalize_prose_layout(modern["text"]) == modern["text"]
        flow, flow_errors = edition.prose_flow_contract(document["prose"], document["section_breaks"])
        local += flow_errors
        assert len(flow["boundaries"]) == len(document["section_breaks"]) == 3
        prepared_figures = load(OWN / "work/prepared/figures.template.json")
        assert figures["figures"] == prepared_figures["figures"]
        assert figures["authoring_status"] == "HOLD-modernfigure-imagebudget24"
        assert not figures["promotable"]
        for suffix, binding in figures["figures"][0]["source"].items():
            assert digest(OWN / "root/10p" / binding["path"]) == binding["sha256"]
        assert not (OWN / "root/10p/editions" / EDITION / figures["figures"][0]["spec"]).exists()
        reports[locale] = {
            "input": record(directory / "lesson.template.json"),
            "exerciseInput": record(directory / "exercises.template.json"),
            "figureInput": record(directory / "figures.template.json"),
            "identityPreserved": True, "embeddedSourceSnapshotExact": True,
            "sourceProseBlocks": 7, "originalExerciseCount": 0,
            "mathAndNumericSignaturesPreserved": not local,
            "ownedFigureReferencesPreserved": True,
            "sectionBreaks": document["section_breaks"], "errors": local,
        }
        errors += local
    native_before = load(OWN / "work/native-tools-before.json")
    for item in native_before:
        assert digest(Path(item["path"])) == item["sha256"]
    dump(OWN / "work/text-evidence/structure-text-check.json", {
        "status": "pass" if not errors else "HOLD-text-structure",
        "nativeFunctions": ["validate_identity_fields", "validate_source", "validate_text", "prose_flow_contract"],
        "invocationsPerLocale": 1, "locales": reports, "errors": errors,
        "nativeToolsUnchanged": True,
        "scope": "Text structure, source identity, formula/numeric preservation and proseFlow only; no full-object or figure validator, SCI/ZHEN, adapt-finalize or display.",
    })
    print(json.dumps({"status": "pass" if not errors else "HOLD-text-structure", "errors": errors}))
    if errors:
        raise SystemExit(2)


def freeze():
    frozen = OWN / "frozen"
    assert not frozen.exists(), "Freeze once; amendments need a separate path."
    check = load(OWN / "work/text-evidence/structure-text-check.json")
    assert digest(CONSUMED) == CONSUMED_HASH
    candidates = {}
    for locale in ["zh", "en"]:
        candidates[locale] = {}
        for name in ["lesson", "exercises", "figures"]:
            file = template_dir(locale) / f"{name}.template.json"
            key = {"lesson": "input", "exercises": "exerciseInput", "figures": "figureInput"}[name]
            assert digest(file) == check["locales"][locale][key]["sha256"]
            candidates[locale][name] = snapshot(file, frozen / locale / file.name)
    inputs = {
        "consumption": snapshot(CONSUMED, frozen / "inputs/source-consumed.json"),
        "rawLesson": snapshot(OWN / "root/10p/lessons" / LESSON / "lesson.json", frozen / "inputs/lesson.json"),
        "rawExercises": snapshot(OWN / "root/10p/lessons" / LESSON / "exercises.json", frozen / "inputs/exercises.json"),
        "rawLessonMarkdown": snapshot(OWN / "root/10p/lessons" / LESSON / "lesson.md", frozen / "inputs/lesson.md"),
        "pages": [], "rawFigures": [],
    }
    for page in [154, 155]:
        for name in ["page.json", "page.md", "audit.json"]:
            inputs["pages"].append(snapshot(
                OWN / f"root/10p/pages/{page:04}/{name}",
                frozen / f"inputs/pages/{page:04}/{name}",
            ))
    for suffix in ["png", "svg"]:
        inputs["rawFigures"].append(snapshot(
            OWN / f"root/10p/figures/fig-114.{suffix}",
            frozen / f"inputs/raw-figures/fig-114.{suffix}",
        ))
    evidence = {}
    for name in [
        "source-consumed.json", "prepare-receipt.json", "text-authoring.json",
        "change-register.json", "display-overlay.en.json", "native-tools-before.json",
        "text-evidence/prose-flow-zh.json", "text-evidence/prose-flow-en.json",
        "text-evidence/structure-text-check.json",
    ]:
        evidence[name] = snapshot(OWN / "work" / name, frozen / "evidence" / name)
    receipts = {}
    for file in sorted((OWN / "work/receipts").glob("*.json")):
        receipts[file.name] = snapshot(file, frozen / "receipts" / file.name)
    prepared = {}
    for file in sorted((OWN / "work/prepared").glob("*.json")):
        prepared[file.name] = snapshot(file, frozen / "prepared" / file.name)
    tool = snapshot(Path(__file__), frozen / "author-tools/author.py")
    source = load(OWN / "root/10p/lessons" / LESSON / "lesson.json")
    manifest = OWN / "author-freeze.json"
    dump(manifest, {
        "schema": "d063/n58-text-author-freeze@1", "ticket": "STEMROBIN-181",
        "lesson": LESSON, "edition": EDITION,
        "createdAt": datetime.now(timezone.utc).isoformat(),
        "author": "Carson", "role": "bilingual-modern-text-author-only",
        "status": "author-text-draft-frozen-SCI-ZHEN-pending-modernfigure-HOLD",
        "inputBindings": inputs,
        "sourceScope": {
            "firstBlockIncludingTitle": "p0154#1", "lastBlock": "p0155#1",
            "physicalPages": [154, 155], "originalProseBlocks": 7,
            "sourceReview": "Inherited consumed SOURCE complete-range PASS and RAW fig114 PASS only; no replay.",
            "originalWrittenTasks": 0, "newExercises": 0, "newChoices": 0,
            "newAnswers": 0, "newInteractions": 0,
            "consumptionCountersChanged": False,
        },
        "nativeIdentity": {key: source[key] for key in edition.IDENTITY_FIELDS},
        "textCandidates": candidates,
        "textState": {
            "status": "author-candidate-only",
            "structure": check["status"],
            "independentSCI": "pending", "independentZHEN": "pending",
            "numericChanges": [], "formulaChanges": [], "notationChanges": [],
            "historicalEntities": [],
            "layout": "Existing Python normalization followed by JavaScript final-paragraph boundary binding.",
            "sectionBoundaryCountPerLocale": 3,
            "nativeIdentityOrTitleChanged": False,
            "englishDisplayTitle": "Amplitude Modulation",
            "englishTitleOverlay": evidence["display-overlay.en.json"],
            "overlayInstalled": False,
            "sourceOwnedFMTailPreserved": True,
            "changeRegister": evidence["change-register.json"],
        },
        "figureState": {
            "id": "fig-114", "status": "HOLD-modernfigure-imagebudget24",
            "referencePreserved": True, "modernPromotable": False,
            "rawPASSIsNotModernApproval": True,
            "modernSpecCreated": False, "modernFigureAuthored": False,
            "modernFigureGenerated": False, "modernFigureRendered": False,
            "modernFigureVisuallyOpened": False, "modernFigureApproved": False,
            "rawCopies": "Exact input-byte snapshots only; no image decoding, viewing or processing.",
        },
        "nativeStages": {
            "sourcePrepareFinalizeVectorizeOrAssembleInvocations": 0,
            "adaptPrepareInvocations": 1, "textStructureChecksPerLocale": 1,
            "adaptFinalizeInvocations": 0, "nativeLessonRenderInvocations": 0,
            "figureRenderInvocations": 0, "displayChecks": 0, "SCIReplay": 0,
            "wholeProjectTests": 0, "publishPromotionOrDatabaseOperations": 0,
        },
        "budget": {
            "inheritedCumulativeImageCount": 24, "newImageOpens": 0,
            "cumulativeImageCount": 24, "maximum": 24, "remaining": 0,
            "imagesGeneratedOrRendered": 0,
        },
        "evidence": evidence, "nativeReceipts": receipts,
        "originalPreparedTemplates": prepared, "authorTool": tool,
        "pending": [
            "Independent SCI review of the exact frozen scientific qualifications.",
            "Independent ZHEN review of the exact frozen bilingual texts.",
            "Modern fig114 authoring and independent review remain HOLD-imagebudget24.",
            "Any later authorized finalization and display gates; not performed here."
        ],
        "notClaimed": {
            "independentApproval": False, "fullObjectApproval": False,
            "nativeFinalized": False, "displayPASS": False,
            "productReady": False, "complete": False,
        },
        "boundary": {
            "onlyOwnedOutputWritten": str(OWN), "canonicalWrites": False,
            "databaseAccess": False, "gitOperations": False,
            "newAgentsWorktreesOrBranches": False, "browserOrDesktopUse": False,
            "olderStageReruns": False, "oldAnswersChoicesInteractionsRead": False,
            "sharedToolsOrDependenciesModified": False,
            "priorFAILHOLDBytesModified": False, "rollbackOrCleanup": False,
        },
    })
    sha = digest(manifest)
    hash_file = OWN / "author-freeze.sha256"
    owned(hash_file)
    with hash_file.open("x", encoding="ascii") as handle:
        handle.write(f"{sha}  author-freeze.json\n")
    print(json.dumps({
        "authorFreeze": record(manifest),
        "status": "author-draft-frozen-not-approved",
        "textStructure": check["status"], "modernFigure": "HOLD-modernfigure-imagebudget24",
        "imageBudget": {"newOpens": 0, "cumulative": 24, "maximum": 24},
    }, indent=2))


if __name__ == "__main__":
    {"prepare": prepare, "author": author, "check-text": check_text, "freeze": freeze}[sys.argv[1]]()
