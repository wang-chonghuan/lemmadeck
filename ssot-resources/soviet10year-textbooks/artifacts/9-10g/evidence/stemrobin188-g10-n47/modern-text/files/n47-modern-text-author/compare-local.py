"""Offline author evidence; no pipeline finalization, image access, or approval."""

from __future__ import annotations

import copy
import hashlib
import json
import re
import stat
import sys
from datetime import datetime, timezone
from pathlib import Path

REPO = Path("/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck")
OWN = REPO / ".intentfold/tickets/STEMROBIN-188/tmp/n47-modern-text-author"
TOOLS = REPO / ".claude/skills/ld-s10y-lesson/tools"
if Path.cwd() != REPO:
    raise RuntimeError("Unexpected cwd")
sys.dont_write_bytecode = True
sys.path.insert(0, str(TOOLS))

from edition import (  # noqa: E402
    math_signature,
    normalize_numbered_subparts,
    normalize_prose_layout,
    number_signature,
    validate_numbered_subpart_layout,
    validate_text,
)
from mathcheck import check_delimiters, find_math_spans  # noqa: E402


def sha(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def object_sha(value: object) -> str:
    return sha(json.dumps(value, ensure_ascii=False, sort_keys=True,
                          separators=(",", ":")).encode("utf-8"))


def load(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def write_new(relative: str, data: bytes, mode: int = 0o644) -> Path:
    destination = (OWN / relative).resolve()
    if not destination.is_relative_to(OWN):
        raise RuntimeError("Write outside author root")
    destination.parent.mkdir(parents=True, exist_ok=True)
    with destination.open("xb") as handle:
        handle.write(data)
    destination.chmod(mode)
    return destination


def json_new(relative: str, value: object, mode: int = 0o644) -> Path:
    return write_new(relative, (json.dumps(value, ensure_ascii=False, indent=2)
                               + "\n").encode("utf-8"), mode)


def delta(before: object, after: object, prefix: str = "") -> list[dict]:
    if before == after:
        return []
    if isinstance(before, dict) and isinstance(after, dict):
        result = []
        for key in sorted(before.keys() | after.keys()):
            if key not in before or key not in after:
                result.append({"path": f"{prefix}/{key}", "beforePresent": key in before,
                               "afterPresent": key in after,
                               "before": before.get(key), "after": after.get(key)})
            else:
                result.extend(delta(before[key], after[key], f"{prefix}/{key}"))
        return result
    return [{"path": prefix, "before": before, "after": after}]


def lexical_signature(text: str) -> str:
    # Only sentence periods and whitespace outside math are ignorable.
    # All words, quantifiers, requests, other signs and complete TeX spans remain.
    spans = list(re.finditer(r"\$\$(.+?)\$\$|\$([^$]+?)\$", text, re.S))
    pieces = []
    start = 0
    for match in spans:
        pieces.append(re.sub(r"\s+", "", text[start:match.start()]).replace(".", "。"))
        pieces.append(match.group())
        start = match.end()
    pieces.append(re.sub(r"\s+", "", text[start:]).replace(".", "。"))
    return "".join(pieces)


before = load(OWN / "bindings-before.json")
raw_lesson = load(OWN / "before/raw/lesson.json")
raw_exercises = load(OWN / "before/raw/exercises.json")
lesson_template = load(OWN / "before/templates/lesson.template.json")
exercises_template = load(OWN / "before/templates/exercises.template.json")
figures_template = load(OWN / "before/templates/figures.template.json")
profile = load(REPO / ".claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json")
forbidden = profile["forbidden_terms"] + profile["forbidden_person_names"]
candidate_lesson = load(OWN / "candidate/lesson.json")
candidate_exercises = load(OWN / "candidate/exercises.json")
outputs = []
for name in ("lesson", "exercises"):
    candidate = OWN / f"candidate/{name}.json"
    data = candidate.read_bytes()
    first = write_new(f"FIRST-candidate/{name}.json", data, 0o444)
    outputs.append({"path": str(candidate), "sha256": sha(data), "bytes": len(data),
                    "firstCandidate": str(first), "firstCandidateSha256": sha(data),
                    "firstCandidateMode": "0444"})

after_bindings = []
for binding in before["bindings"]:
    current = Path(binding["path"]).read_bytes()
    after_bindings.append({
        **binding, "sha256After": sha(current), "bytesAfter": len(current),
        "unchanged": sha(current) == binding["sha256"],
        "snapshotUnchanged": (sha(Path(binding["snapshot"]).read_bytes()) == binding["sha256"]
                              if binding["snapshot"] else None),
        "snapshotModeAfter": (f"{stat.S_IMODE(Path(binding['snapshot']).stat().st_mode):04o}"
                              if binding["snapshot"] else None),
    })
json_new("bindings-after.json", {
    "schema": "stemrobin188-n47-author-input-bindings@1",
    "cwd": str(REPO), "capturedAt": datetime.now(timezone.utc).isoformat(),
    "bindings": after_bindings, "candidateFiles": outputs,
    "imagesOpened": 0, "pageBindingsRehashedHere": False,
}, 0o444)

records = []
errors = []


def compare_object(raw: dict, template: dict, candidate: dict, target: str,
                   is_exercise: bool) -> None:
    differences = delta(template, candidate)
    allowed = {"text", "changes", "lines"} if is_exercise else {"text", "changes"}
    restored_template = copy.deepcopy(candidate)
    for field in allowed:
        if field in template:
            restored_template[field] = copy.deepcopy(template[field])
        else:
            restored_template.pop(field, None)
    restored_raw = copy.deepcopy(candidate)
    for field in ("source_text", "changes", "numeric_changes", "historical_entities"):
        restored_raw.pop(field, None)
    restored_raw["text"] = raw["text"]
    if is_exercise:
        restored_raw["lines"] = copy.deepcopy(raw["lines"])
    text_errors = validate_text(
        raw["text"], candidate["text"], candidate["changes"],
        candidate["numeric_changes"], target, forbidden,
        candidate["historical_entities"],
    )
    delimiters = check_delimiters(candidate["text"])
    subpart_errors = (validate_numbered_subpart_layout(candidate["text"])
                      if is_exercise else [])
    raw_math = find_math_spans(raw["text"])
    modern_math = find_math_spans(candidate["text"])
    raw_signature = math_signature(normalize_numbered_subparts(raw["text"]))
    modern_signature = math_signature(normalize_numbered_subparts(candidate["text"]))
    raw_numbers = number_signature(normalize_numbered_subparts(raw["text"]))
    modern_numbers = number_signature(normalize_numbered_subparts(candidate["text"]))
    lexical_before = lexical_signature(raw["text"])
    lexical_after = lexical_signature(candidate["text"])
    flags = {
        "fullTemplateObjectPreservedOutsideAllowedFields": restored_template == template,
        "fullRawObjectRecoveredExactly": restored_raw == raw,
        "sourceTextLiteralEqualsRaw": candidate["source_text"] == raw["text"],
        "allWordsConditionsAndRequestsExactIgnoringOnlyPeriodsAndWhitespace":
            lexical_before == lexical_after,
        "mathSpansByteExact": raw_math == modern_math,
        "repoMathSignatureExact": raw_signature == modern_signature,
        "repoNumberSignatureExact": raw_numbers == modern_numbers,
        "noNumericChanges": candidate["numeric_changes"] == [],
        "noInventedHistoricalMappings": candidate["historical_entities"] == [],
        "noMathCorrection": "math-correction" not in candidate["changes"],
        "textValidatorNoErrors": not text_errors,
        "delimitersNoErrors": not delimiters,
        "numberedSubpartsNoErrors": not subpart_errors,
        "allDifferencePathsAllowed": all(
            entry["path"].split("/")[1] in allowed for entry in differences),
    }
    if is_exercise:
        flags["linesExactlyMatchCompleteText"] = candidate["lines"] == candidate["text"].splitlines()
        prefix = re.match(r"^\d+(?:[°*])?\.", raw["text"])
        flags["printedPrefixLiteralRetainedOnce"] = bool(
            prefix and candidate["text"].startswith(prefix.group() + " ")
            and candidate["text"].count(prefix.group() + " ") == 1)
        flags["noDoublePeriodPrefix"] = not re.match(r"^\d+(?:[°*])?\.\s*\.", candidate["text"])
        flags["repoLayoutIdempotent"] = normalize_numbered_subparts(candidate["text"]) == candidate["text"]
    elif raw["kind"] == "p":
        flags["repoLayoutIdempotent"] = normalize_prose_layout(candidate["text"]) == candidate["text"]
    else:
        flags["figurePlaceholderOrCaptionFullObjectUnchanged"] = candidate == template

    failures = [f"{target}: {name}" for name, result in flags.items() if result is not True]
    failures += text_errors + delimiters + subpart_errors
    errors.extend(failures)
    records.append({
        "target": target, "kind": "exercise" if is_exercise else raw["kind"],
        "number": raw.get("number"),
        "sourceRefs": raw.get("pages") if is_exercise else raw.get("source_refs"),
        "rawObjectSha256": object_sha(raw),
        "sourceSnapshotObjectSha256": object_sha(raw),
        "templateObjectSha256": object_sha(template),
        "candidateObjectSha256": object_sha(candidate),
        "restoredTemplateObjectSha256": object_sha(restored_template),
        "restoredRawObjectSha256": object_sha(restored_raw),
        "modifiedTextVsTemplate": candidate["text"] != template["text"],
        "modifiedTextVsRaw": candidate["text"] != raw["text"],
        "templateToCandidateFullObjectDelta": differences,
        "comparisonFlags": flags,
        "lexicalSignatureBeforeSha256": object_sha(lexical_before),
        "lexicalSignatureAfterSha256": object_sha(lexical_after),
        "mathSpansBefore": raw_math, "mathSpansAfter": modern_math,
        "repoMathSignatureBefore": raw_signature, "repoMathSignatureAfter": modern_signature,
        "repoNumberSignatureBefore": raw_numbers, "repoNumberSignatureAfter": modern_numbers,
        "localErrors": failures,
        "independentSemanticReview": False,
    })


for index, raw in enumerate(raw_lesson["prose"]):
    compare_object(raw, lesson_template["prose"][index], candidate_lesson["prose"][index],
                   f"lesson.prose[{index}]", False)
for index, raw in enumerate(raw_exercises["exercises"]):
    compare_object(raw, exercises_template["exercises"][index], candidate_exercises["exercises"][index],
                   f"exercises.exercises[{index}]", True)

lesson_top_template = {key: value for key, value in lesson_template.items() if key != "prose"}
lesson_top_candidate = {key: value for key, value in candidate_lesson.items() if key != "prose"}
exercises_top_template = {key: value for key, value in exercises_template.items() if key != "exercises"}
exercises_top_candidate = {key: value for key, value in candidate_exercises.items() if key != "exercises"}
figure_ids = [item["id"] for item in raw_lesson["figures"]]
prose_figure_ids = [item["id"] for item in candidate_lesson["prose"] if item["kind"] == "fig"]
exercise_figure_ids = [item["id"] for exercise in candidate_exercises["exercises"]
                      for item in exercise["figures"]]
global_flags = {
    "all17InputsUnchanged": all(item["unchanged"] for item in after_bindings),
    "all5FullObjectSnapshotsByteExactAnd0444": all(
        item["snapshotUnchanged"] and item["snapshotModeAfter"] == "0444"
        for item in after_bindings if item["snapshot"]),
    "allBeforePrerequisitesTrue": all(before["prereqs"].values()),
    "all33ObjectsCompared": len(records) == 33,
    "proseCount27Retained": len(candidate_lesson["prose"]) == 27,
    "exerciseCount6Retained": len(candidate_exercises["exercises"]) == 6,
    "lessonTopLevelFullObjectUnchanged": lesson_top_candidate == lesson_top_template,
    "exerciseTopLevelFullObjectUnchanged": exercises_top_candidate == exercises_top_template,
    "lessonSourceFullDataEqualsOriginal": candidate_lesson["source"]["data"] == raw_lesson,
    "exercisesSourceFullDataEqualsOriginal": candidate_exercises["source"]["data"] == raw_exercises,
    "source49Through54ExactOrder": [item["source_number"] for item in candidate_exercises["exercises"]]
                                    == [str(number) for number in range(49, 55)],
    "sevenFigureIds16Through22Exact": figure_ids == [f"fig-g10-{number}" for number in range(16, 23)],
    "allFigureTemplateContractsRetained": [item["id"] for item in figures_template["figures"]] == figure_ids,
    "sixProsePlaceholdersPlusOneExerciseFigure": prose_figure_ids + exercise_figure_ids == figure_ids,
    "sixProseCaptionsRetained": len([item for item in candidate_lesson["prose"] if item["kind"] == "cap"]) == 6,
    "allN47RefsWithinStrictExtent": all(
        169 <= int(ref[1:5]) <= 172 and (int(ref[1:5]) != 172 or int(ref.split("#")[1]) < 12)
        for record in records for ref in record["sourceRefs"]),
    "chapterAndN47HeadingIdentityLiteral": (
        candidate_lesson["chapter"] == raw_lesson["chapter"]
        and candidate_lesson["printed_title"] == raw_lesson["printed_title"]),
    "noErrataInvented": candidate_lesson["errata"] == lesson_template["errata"] == [],
    "noSectionBreaksInvented": candidate_lesson["section_breaks"] == lesson_template["section_breaks"] == [],
    "definitionEmphasisAndTextLiteral": candidate_lesson["prose"][15] == lesson_template["prose"][15],
    "contains170LiteralRetained": "存在包含在这个子集里的直线" in candidate_lesson["prose"][14]["text"],
    "49GlyphLiteralAndUnknownNotReinterpreted": (
        candidate_exercises["exercises"][0]["source_text"] == raw_exercises["exercises"][0]["text"]
        and candidate_exercises["exercises"][0]["text"].startswith("49°. ")),
}
errors.extend(f"global: {name}" for name, result in global_flags.items() if result is not True)
counts = {
    "objectsCompared": len(records), "proseObjects": 27, "textProseObjects": 15,
    "proseFigurePlaceholders": 6, "proseCaptions": 6, "exercises": 6, "figureReferenceContracts": 7,
    "actuallyModifiedProseVsInputTemplate": sum(
        record["modifiedTextVsTemplate"] for record in records if record["kind"] != "exercise"),
    "actuallyModifiedExercisesVsInputTemplate": sum(
        record["modifiedTextVsTemplate"] for record in records if record["kind"] == "exercise"),
    "totalModifiedProseVsRawIncludingPreparedLayout": sum(
        record["modifiedTextVsRaw"] for record in records if record["kind"] != "exercise"),
    "totalModifiedExercisesVsRawIncludingPreparedLayout": sum(
        record["modifiedTextVsRaw"] for record in records if record["kind"] == "exercise"),
    "formulaSpans": sum(len(record["mathSpansAfter"]) for record in records),
    "numericCultureChanges": 0, "wordingChanges": 0, "mathCorrections": 0,
    "candidateAuthoringRounds": 1, "contentRepairCount": 0,
    "authorComparisonInvocations": 1, "authorComparisonErrors": len(errors),
    "authorExecutionFailuresBeforeComparison": 1, "technicalRecoveryCount": 1,
    "nativeAdaptPrepareInvocationsThisAuthor": 0, "inheritedSuccessfulNativePrepare": 1,
    "nativeFinalize": 0, "nativeRender": 0, "imagesOpened": 0, "imagesGenerated": 0,
    "paidCalls": 0, "networkCalls": 0, "agentsDispatched": 0,
}
json_new("all33-object-comparison.json", {
    "schema": "stemrobin188-n47-author-whole-object-comparison@1",
    "authority": "local-author-mechanical-only-not-independent-PASS",
    "wholeObjectHashEncoding": "SHA256 of UTF8 sorted-key compact JSON, not file-byte SHA",
    "allowedFields": {"prose": ["text", "changes"], "exercises": ["text", "lines", "changes"]},
    "globalFlags": global_flags, "records": records, "counts": counts, "errors": errors,
    "formulaParseOrRenderInvoked": False,
    "delimitersCheckedUsing": "mathcheck.check_delimiters",
    "mathSignatureUsing": "edition.math_signature(normalize_numbered_subparts(text))",
    "numberSignatureUsing": "edition.number_signature(normalize_numbered_subparts(text))",
}, 0o444)

holds = [
    {"scope": "original SOURCE FIRST and REVISE", "status": "PRESERVED",
     "reason": "Inherited durable manifest remains byte-identical; no prior review-card bodies read or rewritten."},
    {"scope": "source 170 contains/包含", "status": "INHERITED-SCOPED-PIXEL-RESULT-ONLY",
     "reason": "Existing admission says independent pixels settled the lexical locus; text literal remains 包含. No new source approval here."},
    {"scope": "source 172 exercise 49 raised circle", "status": "EXACT-GLYPH-UNKNOWN-HOLD",
     "reason": "Raised-circle role/contour result is inherited only. Literal 49°. is retained; no star, degree, difficulty, or convention inference."},
    {"scope": "all-ink and local source HOLDs", "status": "HOLD-PRESERVED",
     "reason": "Readable scoped admission does not approve whole-page all-ink. Existing local HOLDs are not closed by this author."},
    {"scope": "modern figure geometry and semantic review", "status": "NOT-AUTHORIZED-HOLD",
     "reason": "Seven source-reference contracts retained; no pictures, FigureSpecs, SVGs, or image payloads opened/edited/generated."},
    {"scope": "independent modern text approval", "status": "PENDING-COLLECTION-CLOSURE",
     "reason": "Local object/token evidence is not independent source, semantic, render, or promotion approval."},
]
limitations = [
    "No native adapt prepare/finalize/render, source admission, promotion, retention or publication.",
    "No independent semantic review, source-pixel review, browser proof, product verification or renderer execution.",
    f"Exact {counts['formulaSpans']} TeX spans plus delimiter checks were compared; independent KaTeX parse/renderability was not executed under the no-render boundary.",
    "Source page/PDF/image hashes are inherited references, not independently rehashed or reopened here.",
    "Definition block retains original bold and ASCII periods literally; its punctuation was not redesigned.",
    "Candidate .changes uses punctuation for sentence-stop normalization and layout for line breaks; no cultural or numerical modernization was needed.",
    "No actual mathematical source was flattened: differing ABCDEF in prose and ABCDFE in exercise 54, equality chain, perpendicular relation, conditions and all subrequests remain exact.",
    "Prior review-card bodies, N48 content, answers and choices were not read; inherited historical failure/repair totals were not recomputed or reset.",
    "No Git, ticket backend, messages, credentials, .env, DB, models, paid/network/install calls, app edits or other writers' changes touched.",
]
report = {
    "schema": "stemrobin188-n47-modern-text-author-report@1",
    "ticket": "STEMROBIN-188", "assignment": "SAME188-6 / N47 MODERN TEXT AUTHOR ONLY",
    "book": "9-10g", "lesson": "geo910-c2-s2-n47", "edition": "modern-us-neutral",
    "status": "candidate-for-collection-closure" if not errors else "local-author-comparison-failure",
    "independentPASSClaimed": False, "semanticReviewApproval": False, "published": False,
    "cwd": str(REPO), "writeRoot": str(OWN),
    "readerJobStory": "学习者阅读原有 N47 多面形、多面体定义与练习，理解条件并完成原有全部请求。",
    "readerQuestion": "N47 原文中的多面形、多面体及六道练习完整地说了什么？",
    "contentStructure": "Frozen 27 prose objects and 6 exercises; no deletion, new prompt or solution.",
    "scope": {"chapterStartIncluded": "p0169#1", "N47Heading": "p0169#2",
              "rightBoundaryExcluded": "p0172#12", "physicalPages": [169, 170, 171, 172],
              "sourceExercises": [49, 50, 51, 52, 53, 54], "sourceFigures": [16, 17, 18, 19, 20, 21, 22]},
    "rawFileSha256BeforeAndAfter": [
        {"role": item["role"], "path": item["path"], "before": item["sha256"],
         "after": item["sha256After"], "unchanged": item["unchanged"]}
        for item in after_bindings if item["role"].startswith("raw-")],
    "candidateFiles": outputs, "counts": counts, "globalFlags": global_flags,
    "evidence": {
        "bindingsBefore": str(OWN / "bindings-before.json"),
        "bindingsAfter": str(OWN / "bindings-after.json"),
        "all33Objects": str(OWN / "all33-object-comparison.json"),
        "firstExecutionFailure": str(OWN / "preflight-failure-01.json"),
        "snapshotCommand": str(OWN / "commands/snapshot-01/command.json"),
        "comparisonCommand": str(OWN / "commands/compare-01/command.json"),
        "comparisonStdout": str(OWN / "commands/compare-01/stdout.txt"),
        "comparisonStderr": str(OWN / "commands/compare-01/stderr.txt"),
    },
    "figureContractsOnly": figures_template["figures"],
    "inheritedSourceStatus": before["inheritedSourceStatus"],
    "firstCandidatePreserved": True,
    "actualExecutionFailures": [load(OWN / "preflight-failure-01.json")],
    "actualAuthorComparisonFailures": errors,
    "repairCountersReset": False, "holds": holds, "limitations": limitations,
    "stop": "Stop for collection closure. No native finalization, independent PASS, image payload or promotion.",
}
json_new("report.json", report)

lines = [
    "# N47 Modern Text Author",
    "",
    f"Status: {report['status']}. Local author comparisons only; no independent PASS or semantic approval.",
    "",
    "## Complete Candidates",
    f"- Lesson: `{outputs[0]['path']}`",
    f"  SHA-256: `{outputs[0]['sha256']}`",
    f"- Exercises: `{outputs[1]['path']}`",
    f"  SHA-256: `{outputs[1]['sha256']}`",
    "- Immutable originals/templates: `before/`; first authored full candidates: `FIRST-candidate/` (0444).",
    "",
    "## Scope And Counts",
    "- Included chapter p0169#1 and N47 p0169#2; ended strictly before p0172#12.",
    "- 27 prose objects = 15 text objects + 6 figure placeholders + 6 captions; 6 exercises 49-54.",
    "- Seven figure-reference contracts 16-22; zero image payloads or figure-authoring changes.",
    f"- This author modified {counts['actuallyModifiedProseVsInputTemplate']} prose texts and "
    f"{counts['actuallyModifiedExercisesVsInputTemplate']} exercise texts versus exact prepared templates.",
    f"- Versus raw, including existing prepare layout: {counts['totalModifiedProseVsRawIncludingPreparedLayout']} "
    f"prose texts and {counts['totalModifiedExercisesVsRawIncludingPreparedLayout']} exercise texts.",
    "- Wording, numeric-culture and math corrections: 0. Sentence punctuation and complete-sentence layout only.",
    f"- {counts['formulaSpans']} formula spans exact; every object compared with existing math/number-signature functions.",
    "",
    "## Raw SHA Bindings",
]
for binding in report["rawFileSha256BeforeAndAfter"]:
    lines.extend([f"- {binding['role']}: before `{binding['before']}`;",
                  f"  after `{binding['after']}`; unchanged: {str(binding['unchanged']).lower()}."])
lines.extend([
    "- Full 17-input before/after receipts: `bindings-before.json`, `bindings-after.json`.",
    "- `source.data`, every literal `source_text`, all identities, numbering, roles, source refs and figure contracts retained.",
    "",
    "## All 33 Objects",
    "| Object | Role | Modified vs template | Full object + text/math/number checks |",
    "| --- | --- | --- | --- |",
])
for record in records:
    result = "no local errors" if not record["localErrors"] else "LOCAL ERROR"
    lines.append(f"| {record['target']} | {record['kind']} | "
                 f"{str(record['modifiedTextVsTemplate']).lower()} | {result} |")
lines.extend([
    "",
    "- Complete per-object hashes, all field deltas, lexical guards, math spans/signatures and non-math numeric tokens: `all33-object-comparison.json`.",
    "",
    "## Actual Commands And Failures",
    "- `node .intentfold/tickets/STEMROBIN-188/tmp/n47-modern-text-author/local-author.mjs snapshot` (recorded exit 0).",
    "- `node .intentfold/tickets/STEMROBIN-188/tmp/n47-modern-text-author/local-author.mjs compare` runs existing venv Python `-B compare-local.py`; exact command/stdout/stderr are retained.",
    "- All commands and subprocesses use the exact authorized repository cwd.",
    "- Initial `rg --files` exit 2: author output directory absent. Preserved in `preflight-failure-01.json`; recovered by creating only this root.",
    f"- Author comparison errors: {len(errors)}; candidate authoring rounds: 1; content repairs: 0; technical recovery: 1.",
    "- No previous producer/review was rerun and no historical repair or failure counter was reset.",
    "",
    "## Holds And Limitations",
])
for hold in holds:
    lines.append(f"- {hold['scope']}: {hold['status']}. {hold['reason']}")
for limitation in limitations:
    lines.append(f"- {limitation}")
if errors:
    lines.extend(["", "## Local Errors"] + [f"- {error}" for error in errors])
lines.extend(["", "Stop for collection closure. No independent PASS, image payloads or promotion.", ""])
write_new("report.md", "\n".join(lines).encode("utf-8"))
summary = {
    "status": report["status"], "counts": counts, "globalFlags": global_flags,
    "localErrors": errors, "candidateFiles": outputs,
    "reportJSON": str(OWN / "report.json"), "reportMD": str(OWN / "report.md"),
    "independentPASSClaimed": False, "stoppedForCollectionClosure": True,
}
print(json.dumps(summary, ensure_ascii=False, indent=2))
sys.exit(0 if not errors else 1)
