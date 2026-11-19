import copy
import hashlib
import json
import re
from datetime import datetime, timezone
from decimal import Decimal
from pathlib import Path

ROOT = Path("/Users/yong/.codex/worktrees/d9b1/lemmadeck")
BASE = ROOT / ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13"
FIRST = BASE / "n41-answer-author"
OWNER = FIRST / "RECOVERY1"
SOURCE = BASE / "n41-table-cell-source"
NORMALIZED = BASE / "n41-n42-normalized-binding"
LESSON = "alg7-c4-s2-n41"
STATUS = "AUTHOR_COMPLETE_PENDING_INDEPENDENT_REVIEW"
assert Path.cwd() == ROOT
assert Path(__file__).resolve().parent == OWNER

inputs = {}


def require(condition, message):
    if not condition:
        raise AssertionError(message)


def sha(data):
    return hashlib.sha256(data).hexdigest()


def read(path):
    path = Path(path)
    require(path.suffix not in [".png", ".jpg", ".pdf", ".svg"], "No image reads")
    data = path.read_bytes()
    inputs[str(path)] = {"path": str(path), "sha256": sha(data), "bytes": len(data)}
    return data


def load(path):
    return json.loads(read(path))


def record(path):
    return inputs[str(path)]


def verify_records(records):
    for item in records:
        path = Path(item["path"])
        require(sha(read(path)) == item["sha256"], "Hash mismatch: " + str(path))
        if "mode" in item:
            require(format(path.stat().st_mode & 0o777, "04o") == item["mode"], "Mode mismatch: " + str(path))
        if "bytes" in item:
            require(len(read(path)) == item["bytes"], "Size mismatch: " + str(path))


def pointer(document, locator):
    require(locator.startswith("#/"), "Invalid JSON pointer")
    for part in locator[2:].split("/"):
        part = part.replace("~1", "/").replace("~0", "~")
        document = document[int(part)] if isinstance(document, list) else document[part]
    return document


def write_new(path, data):
    require(path.parent == OWNER, "Write outside owner")
    with path.open("xb") as handle:
        handle.write(data)


def write_json(path, document):
    write_new(path, (json.dumps(document, ensure_ascii=False, indent=2) + "\n").encode("utf-8"))


def encoded_string(value):
    return json.dumps(value, ensure_ascii=False)


def replace_once(text, old, new):
    require(text.count(old) == 1, "Expected one exact replacement: " + old[:80])
    return text.replace(old, new, 1)


first_manifest = load(FIRST / "freeze-manifest.json")
require(sha(read(FIRST / "freeze-manifest.json")) == "e47e433ffe8d917b1398a9f9592bbbf0424c96a373e33ada11bff507d02f2221", "FIRST manifest differs")
verify_records(first_manifest["outputs"])
first_bytes = read(FIRST / (LESSON + ".answer-keys.frozen.json"))
first_keys = json.loads(first_bytes)
first_checks = load(FIRST / "author-checks.json")
first_binding = load(FIRST / "source-and-task-binding.json")
require(record(FIRST / (LESSON + ".answer-keys.frozen.json"))["sha256"] == "c801f23efe4385c47de1850822f22c95d1a7966cb31cebde06ec7d63b4a217c0", "FIRST keys differ")

normal_freeze = load(NORMALIZED / "freeze-receipt.json")
verify_records(normal_freeze["outputs"])
normal_report = load(NORMALIZED / "binding-review.json")
require(normal_report["status"] == normal_freeze["status"] == "PASS", "Normalized binding did not pass")
normal_n41 = next(item for item in normal_report["lessons"] if item["lesson"] == LESSON)
require(normal_n41["FIRSTModernTextPASSReused"] and normal_n41["durableOutputsMatchExistingNormalizersAndReady"], "Missing approved FIRST reuse")

source_freeze = load(SOURCE / "freeze-receipt.json")
require(source_freeze["sourceOnly"] and not source_freeze["answerApproval"], "Disclosure is not source-only")
verify_records(source_freeze["files"])
captures = load(SOURCE / "source-captures.json")
read(SOURCE / "source-report.md")
require(captures["status"] == "SOURCE_ONLY_LOOKUP_CAPTURE_COMPLETE_FOR_8_TASKS", "Incomplete source capture")

adapt = BASE / "n41-n43-adapt-work/adapt/7a/modern-us-neutral/lessons" / LESSON
durable = ROOT / "ssot-resources/soviet10year-textbooks/artifacts/7a/editions/modern-us-neutral/lessons" / LESSON
current_lesson = load(adapt / "lesson.template.json")
current_exercises = load(adapt / "exercises.template.json")
durable_lesson = load(durable / "lesson.json")
durable_exercises = load(durable / "exercises.json")
read(durable / "adaptation.audit.json")
verify_records(normal_n41["outputHashes"])
normal_inputs = {item["path"]: item["sha256"] for item in normal_report["boundInputs"]}
for path in [adapt / "lesson.template.json", adapt / "exercises.template.json"]:
    require(record(path)["sha256"] == normal_inputs[str(path)], "Template changed after normalized binding")
require(record(adapt / "exercises.template.json")["sha256"] == first_binding["source"]["exerciseSha256"] == captures["exerciseAuthority"]["sha256"], "Exercise authority differs")
require(current_exercises["exercises"] == durable_exercises["exercises"], "n41 normalized exercise content changed")
require(durable_lesson["status"] == durable_exercises["status"] == "ready", "Final normalized sources are not ready")

task_ids = ["835.c", "835.d", "835.e", "843.a", "843.b", "843.c", "843.d", "843.e"]
require(first_manifest["pendingLookupTasks"] == task_ids, "Unexpected FIRST held scope")
require([item["id"] for item in captures["tasks"]] == task_ids, "Disclosed task scope differs")
require(sum(item["count"] for item in first_binding["tasks"]) == 80, "FIRST task total differs")
require(len(first_checks["checks"]) == 80, "FIRST mathematical check coverage differs")
source_tasks = {item["id"]: item for item in captures["tasks"]}
source_exercises = {item["number"]: item for item in durable_exercises["exercises"]}
cells = {item["argumentAddressInferredFromProse"]: item for item in captures["distinctCells"]}
require(set(cells) == {"3", "5", "7", "10"}, "Unexpected distinct cell scope")
locator_receipt = load(OWNER / "check-failure-receipt.json")
load(OWNER / "check-failure-2-receipt.json")
effective_pointers = {}
for cell in cells.values():
    require(cell["table"] == "IV" and cell["mainColumnExact"] == "0", "Wrong source cell address")
    require(cell["correctionCellExact"] is None and cell["correctionColumnExact"] is None, "Unexpected correction")
    require(cell["correctionStatus"] == "NOT_REQUIRED_NOT_A_PRINTED_ZERO", "No invented zero correction")
    require(not cell["computedSquareRootUsedForSourceString"] and not cell["numericAnswerProduced"], "Computed source value")
    capture_path = Path(cell["capturePath"])
    capture_document = load(capture_path)
    require(record(capture_path)["sha256"] == cell["captureSha256"], "Literal capture hash differs")
    effective_pointer = cell["capturePointer"]
    if cell["id"] == "IV-root-10":
        require(effective_pointer == locator_receipt["locatorRefinement"]["declaredLocator"], "Unexpected root-10 locator")
        require(pointer(capture_document, effective_pointer) == locator_receipt["locatorRefinement"]["declaredLocatorValue"], "Root-10 main object differs")
        effective_pointer = locator_receipt["locatorRefinement"]["literalStringLocator"]
    require(pointer(capture_document, effective_pointer) == cell["mainCellExact"], "Literal cell pointer mismatch")
    effective_pointers[cell["id"]] = effective_pointer

decimal_cells = {argument: Decimal(cell["mainCellExact"].replace(",", ".")) for argument, cell in cells.items()}
require({argument: str(value) for argument, value in decimal_cells.items()} == {"3": "1.732", "5": "2.236", "7": "2.646", "10": "3.162"}, "Printed cell disclosure mismatch")
arithmetic = {
    "835.c": (2 * decimal_cells["3"], r"2\cdot1.732=3.464", "2*1.732", "3.464"),
    "835.d": (14 * decimal_cells["5"], r"14\cdot2.236=31.304", "14*2.236", "31.304"),
    "835.e": (decimal_cells["3"], "1.732", "1.732", "1.732"),
    "843.a": (decimal_cells["5"] + decimal_cells["3"], "2.236+1.732=3.968", "2.236+1.732", "3.968"),
    "843.b": (decimal_cells["10"] - decimal_cells["7"], "3.162-2.646=0.516", "3.162-2.646", "0.516"),
    "843.c": (decimal_cells["5"] + 2, "2.236+2=4.236", "2.236+2", "4.236"),
    "843.d": (6 - 2 * decimal_cells["7"], r"6-2\cdot2.646=0.708", "6-2*2.646", "0.708"),
    "843.e": (9 + 4 * decimal_cells["5"], r"9+4\cdot2.236=17.944", "9+4*2.236", "17.944"),
}
for task_id, (value, latex, operation, expected) in arithmetic.items():
    require(format(value, ".3f") == expected and value == Decimal(expected), "Finite table arithmetic mismatch: " + task_id)
    task = source_tasks[task_id]
    exercise = source_exercises[task["exercise"]]
    require(exercise["lines"][task["lineIndex"]] == task["originalLineExact"], "Actual current source line mismatch: " + task_id)
    require(exercise["pages"] == task["exerciseRefs"], "Source references changed: " + task_id)
    require(task["sourceLookupCoverage"] == "COMPLETE" and task["finalDecimalAnswer"] is None, "Disclosure supplied an answer")
    require([item["argumentAddressInferredFromProse"] for item in task["lookups"]] == task["arguments"], "Lookup address mismatch")
    for lookup in task["lookups"]:
        require(lookup["mainCellExact"] == cells[lookup["argumentAddressInferredFromProse"]]["mainCellExact"], "Per-task cell mismatch")

# Change only the eight unfinished lookup suffixes and obsolete 835/843 notices.
candidate = copy.deepcopy(first_keys)
by_exercise = {item["exercise"]: item for item in candidate["answers"]}
convention = "报告约定：先精确化简，再代入已审读的三位小数表值，列出表值运算结果（保留三位小数）。这些数是查表近似值，不保证原式真值按三位小数舍入也得到同一结果。"
for exercise_id in ["835", "843"]:
    answer = by_exercise[exercise_id]
    lines = answer["displayAnswer"].splitlines()
    for task_id in task_ids:
        if not task_id.startswith(exercise_id + "."):
            continue
        label = task_id.split(".")[1] + ") "
        matches = [i for i, line in enumerate(lines) if line.startswith(label)]
        require(len(matches) == 1, "Missing exact answer line: " + task_id)
        index = matches[0]
        require(lines[index].endswith("$。"), "Unexpected FIRST line ending")
        lines[index] = lines[index][:-2] + r"\approx" + arithmetic[task_id][1] + "$。"
    if exercise_id == "835":
        require(len(lines) == 8, "Unexpected FIRST 835 notice layout")
        lines[0] = "先合并同类根式，查表得 $\\sqrt2\\approx1.414$、$\\sqrt3\\approx1.732$、$\\sqrt5\\approx2.236$。"
        lines[-1] = convention
        answer["notes"] = "Six tasks, all exact simplifications retained. RECOVERY1 completes only 835.c/d/e using newly disclosed literal Table IV sqrt(3)=1,732 and sqrt(5)=2,236 main cells. FIRST 835.a/b/f lookup results and lines are unchanged. Table-substitution reporting convention is explicit; no true-value rounding, tie or error guarantee."
    else:
        require(len(lines) == 8, "Unexpected FIRST 843 notice layout")
        lines[-1] = "查表得 $\\sqrt2\\approx1.414$、$\\sqrt3\\approx1.732$、$\\sqrt5\\approx2.236$、$\\sqrt7\\approx2.646$、$\\sqrt{10}\\approx3.162$。" + convention
        answer["notes"] = "Six tasks, all exact conjugate simplifications retained. RECOVERY1 completes only 843.a/b/c/d/e using disclosed Table IV sqrt(3),sqrt(5),sqrt(7),sqrt(10) main cells; no corrections required. FIRST 843.f and its sqrt(2)-based result 14.070 are unchanged. Results report finite printed-cell substitution, not guaranteed true-value rounding or a Bradis tie/error policy."
    answer["displayAnswer"] = "\n".join(lines)

first_by_exercise = {item["exercise"]: item for item in first_keys["answers"]}
require([item["exercise"] for item in candidate["answers"]] == [str(i) for i in range(834, 851)], "Original coverage differs")
for answer in candidate["answers"]:
    require(answer["source"] == "derived" and answer["grading"] == "ungraded" and answer["parts"] == [], "Ticket grading contract")
    require(answer["displayAnswer"].strip(), "Missing specific standard answer")
    require(not re.search(r"HOLD|待补|尚缺|missing reviewed", answer["displayAnswer"] + answer["notes"], re.I), "Incomplete answer placeholder")
    if answer["exercise"] not in ["835", "843"]:
        require(answer == first_by_exercise[answer["exercise"]], "Unaffected answer changed")
    else:
        before_lines = first_by_exercise[answer["exercise"]]["displayAnswer"].splitlines()
        after_lines = answer["displayAnswer"].splitlines()
        for old_line in before_lines:
            if not re.match(r"^[a-f]\) \$", old_line):
                continue
            new_line = next(line for line in after_lines if line.startswith(old_line[:3]))
            task_id = answer["exercise"] + "." + old_line[0]
            if task_id in task_ids:
                require(new_line.split(r"\approx")[0] == old_line[:-2], "Existing exact algebra changed")
            else:
                require(new_line == old_line, "Completed lookup changed")
require({key: value for key, value in candidate.items() if key != "answers"} == {key: value for key, value in first_keys.items() if key != "answers"}, "Answer document metadata changed")

candidate_text = first_bytes.decode("utf-8")
for exercise_id in ["835", "843"]:
    for field in ["displayAnswer", "notes"]:
        candidate_text = replace_once(candidate_text, encoded_string(first_by_exercise[exercise_id][field]), encoded_string(by_exercise[exercise_id][field]))
candidate_bytes = candidate_text.encode("utf-8")
require(json.loads(candidate_bytes) == candidate, "Candidate bytes disagree")
require(len(first_binding["tasks"]) == len(candidate["answers"]) == 17, "Task coverage mismatch")

frozen_at = datetime.now(timezone.utc).isoformat()
candidate_path = OWNER / (LESSON + ".answer-keys.json")
frozen_path = OWNER / (LESSON + ".answer-keys.frozen.json")
source_bindings = {
    "currentAdaptLesson": record(adapt / "lesson.template.json"),
    "currentAdaptExercises": record(adapt / "exercises.template.json"),
    "finalNormalizedLesson": record(durable / "lesson.json"),
    "finalNormalizedExercises": record(durable / "exercises.json"),
    "finalNormalizedAudit": record(durable / "adaptation.audit.json"),
    "normalizationReview": record(NORMALIZED / "binding-review.json"),
    "normalizationFreeze": record(NORMALIZED / "freeze-receipt.json"),
}
totals = {
    "exercises": 17, "mathematicalTasks": 80, "lookupObligations": 12,
    "reusedCompletedLookupObligations": 4, "newCompletedLookupObligations": 8,
    "completedLookupObligations": 12, "pendingLookupObligations": 0,
    "newDistinctMainCells": 3, "reusedMainCellsForAffectedTasks": 1,
    "affectedLookupOccurrences": 10, "correctionCellsRequired": 0,
    "FIRSTImageLoads": 4, "newImageLoads": 0,
}
limits = {
    "imagesReopened": False, "passedSolvesRerun": False, "otherAnswerOrChoiceFilesRead": False,
    "otherAnswerReviewResultsRead": False, "network": False, "DB": False, "app": False,
    "paidCalls": 0, "dependenciesInstalled": False, "finalizerRerun": False,
    "publish": False, "productionWrites": False, "commit": False,
}
first_reuse = {
    "candidate": record(FIRST / (LESSON + ".answer-keys.frozen.json")),
    "checks": record(FIRST / "author-checks.json"),
    "binding": record(FIRST / "source-and-task-binding.json"),
    "manifest": record(FIRST / "freeze-manifest.json"),
    "exactNonTableAndFigureSolves": "All FIRST solves reused without rerun; 15 unaffected answer objects unchanged; only eight lookup suffixes plus 835/843 notices and notes changed.",
    "completedLookupTasks": ["835.a", "835.b", "835.f", "843.f"],
    "allCompletedLookupLinesUnchanged": True,
    "allExactAlgebraLinesUnchanged": True,
    "unaffectedAnswerBytesPreserved": True,
    "historicalProseSha256": first_binding["source"]["lessonSha256"],
}
report_convention = {
    "method": "Simplify exactly first (FIRST work), substitute the disclosed finite printed main cells, then perform exact decimal arithmetic.",
    "display": "Three decimal places in the finite-cell arithmetic results; no extra rounding was needed.",
    "distinction": "Table-based approximations are not asserted to equal true-radical values rounded to three decimal places.",
    "sqrtByCalculatorUsed": False,
    "fabricatedCellsOrCorrections": False,
    "universalBradisTiePolicyClaimed": False,
    "trueValueLastDigitOrErrorGuaranteeClaimed": False,
}
provenance = {
    "schema": "ld-s10y-answer/author-recovery-source-and-tasks@1",
    "ticket": "STEMROBIN-182", "lesson": LESSON, "recovery": "RECOVERY1",
    "role": "AUTHOR affected-only completion, not independent review",
    "status": STATUS, "frozenAt": frozen_at,
    "sourceAuthority": "Current source exercises and final normalized binding; source cells disclosed by parent under existing human ticket authorization, not prior author answers.",
    "sources": source_bindings, "FIRSTReuse": first_reuse,
    "sourceDisclosure": {
        "captures": record(SOURCE / "source-captures.json"),
        "report": record(SOURCE / "source-report.md"),
        "freeze": record(SOURCE / "freeze-receipt.json"),
        "verifiedSourceReceiptFileHashesAndModes": True,
        "literalCellPointersVerified": True,
        "effectiveLiteralStringPointers": effective_pointers,
        "root10MainObjectLocatorRefinement": record(OWNER / "check-failure-receipt.json"),
        "sourceCellCorrectionsRequired": False,
        "cells": list(cells.values()),
        "imageHashesInheritedFromSourceFreezeWithoutImageReads": True,
    },
    "lessonChangeBinding": {
        "FIRSTModernTextPASSReused": True, "normalizedBindingPASSReused": True,
        "textFormulasSourceIdentitiesUnchanged": True,
        "onlyTemplateChanges": normal_n41["firstTemplateToCurrentLessonChanges"],
        "anchorBinding": normal_n41["anchorBinding"],
        "exerciseHashUnchanged": True,
        "normalizationNotAnswerGateApproval": True,
    },
    "tasks": first_binding["tasks"], "totals": totals,
    "affectedOnlyTasks": task_ids, "pendingLookupTasks": [],
    "reportingConvention": report_convention,
    "figureReuse": {
        "FIRSTEvidence": record(FIRST / "source-and-task-binding.json"),
        "newImageLoads": 0, "missingFigureFactsInFIRST": [],
        "fig57Notice": "Parent disclosed ASSOCIATION-2 independent visual PASS; only tick font/placement changed, source coordinates unchanged. Report not opened and solves not rerun.",
        "newIndependentFigureApprovalClaimed": False,
    },
    "limits": limits, "independentApproval": False,
    "independentReviewerStillRequired": True, "overallGate2Completed": False,
}
first_check_by_id = {item["id"]: item for item in first_checks["checks"]}
affected_checks = []
for task_id in task_ids:
    value, latex, operation, expected = arithmetic[task_id]
    task = source_tasks[task_id]
    affected_checks.append({
        "id": task_id,
        "sourceExerciseLine": task["originalLineExact"],
        "sourceExerciseBinding": source_bindings["finalNormalizedExercises"],
        "exactSolve": {
            "FIRSTCheckReusedNotRerun": True,
            "FIRSTResult": first_check_by_id[task_id]["evidence"]["result"],
            "FIRSTCheckPath": str(FIRST / "author-checks.json"),
            "FIRSTCheckSha256": record(FIRST / "author-checks.json")["sha256"],
            "candidateExactStepsUnchanged": True,
        },
        "lookupCells": [{"id": cell["id"], "printed": cell["mainCellExact"], "capturePath": cell["capturePath"], "captureSha256": cell["captureSha256"], "declaredPointer": cell["capturePointer"], "literalStringPointer": effective_pointers[cell["id"]]} for cell in task["lookups"]],
        "arithmetic": operation, "exactFiniteDecimalResult": str(value),
        "displayResult": expected, "candidateLatexSuffix": r"\approx" + latex,
        "authorArithmeticCheck": "checked using Decimal on literal finite cells",
        "lookupStatus": "completed", "sourceLookupCoverage": "COMPLETE",
        "correctionStatus": "not-required; no invented zero",
        "completeness": "Specific exact answer and table-based approximation displayed.",
        "independentApproval": False,
    })
checks = {
    "schema": "ld-s10y-answer/author-recovery-checks@1",
    "ticket": "STEMROBIN-182", "lesson": LESSON,
    "status": STATUS, "frozenAt": frozen_at, "recovery": "RECOVERY1",
    "role": "Affected-only AUTHOR checks, not a self-independent PASS",
    "totals": totals, "perExerciseTaskCounts": first_binding["tasks"],
    "FIRSTChecksReusedWithoutRerun": first_reuse,
    "affectedChecks": affected_checks, "reportingConvention": report_convention,
    "coverage": {
        "all17OriginalsSpecificStandardAnswers": True,
        "all80MathematicalTasksCoveredByFIRST": True,
        "all12LookupObligationsCompleted": True, "newLookupChecks": 8,
        "duplicateOrMissingExercises": [], "pendingLookupTasks": [],
        "placeholderAnswers": [], "allDerivedUngradedPartsEmpty": True,
        "onlyChangedAnswerFields": ["/answers/1/displayAnswer", "/answers/1/notes", "/answers/9/displayAnswer", "/answers/9/notes"],
    },
    "sources": source_bindings, "independentApproval": False,
    "independentReviewerStillRequired": True, "overallGate2Completed": False,
    "limits": limits,
}
standard_answers = (
    "# n41 RECOVERY1 Standard Answers\n\n"
    "AUTHOR candidate only; independent review remains required. "
    "All 17 originals are derived and ungraded with empty parts. "
    "FIRST exact/non-table/figure solves are retained without rerun. "
    "The eight added lookups use only frozen source cells.\n\n"
    + "\n\n".join("## " + answer["exercise"] + "\n\n" + answer["displayAnswer"] for answer in candidate["answers"])
    + "\n"
)

for item in inputs.values():
    require(sha(Path(item["path"]).read_bytes()) == item["sha256"], "Input changed during recovery: " + item["path"])
write_new(candidate_path, candidate_bytes)
write_new(frozen_path, candidate_bytes)
write_json(OWNER / "source-and-task-binding.json", provenance)
write_json(OWNER / "author-checks.json", checks)
write_new(OWNER / "standard-answers.md", standard_answers.encode("utf-8"))
binding = {
    "schema": "ld-s10y-answer/author-recovery-binding@1",
    "ticket": "STEMROBIN-182", "lesson": LESSON, "recovery": "RECOVERY1",
    "status": STATUS, "frozenAt": frozen_at,
    "candidate": {"path": str(candidate_path), "sha256": sha(candidate_bytes)},
    "frozen": {"path": str(frozen_path), "sha256": sha(candidate_bytes)},
    "authorChecks": {"path": str(OWNER / "author-checks.json"), "sha256": sha((OWNER / "author-checks.json").read_bytes())},
    "provenance": {"path": str(OWNER / "source-and-task-binding.json"), "sha256": sha((OWNER / "source-and-task-binding.json").read_bytes())},
    "standardAnswers": {"path": str(OWNER / "standard-answers.md"), "sha256": sha((OWNER / "standard-answers.md").read_bytes())},
    "sources": source_bindings, "FIRSTManifest": first_reuse["manifest"],
    "sourceCellFreeze": record(SOURCE / "freeze-receipt.json"),
    "totals": totals, "independentApproval": False,
    "independentReviewerStillRequired": True, "overallGate2Completed": False,
    "finalizerRun": False, "publish": False,
}
write_json(OWNER / "author-binding.json", binding)
output_paths = [
    candidate_path, frozen_path, OWNER / "source-and-task-binding.json",
    OWNER / "author-checks.json", OWNER / "standard-answers.md",
    OWNER / "author-binding.json", Path(__file__).resolve(),
    OWNER / "check-failure-receipt.json",
    OWNER / "check-failure-2-receipt.json",
]
manifest = {
    "schema": "ld-s10y-answer/author-recovery-freeze@1",
    "ticket": "STEMROBIN-182", "lesson": LESSON, "recovery": "RECOVERY1",
    "status": STATUS, "frozenAt": frozen_at, "hashAlgorithm": "SHA-256",
    "outputs": [{"path": str(path), "sha256": sha(path.read_bytes()), "bytes": len(path.read_bytes()), "mode": "0444"} for path in output_paths],
    "boundInputs": list(inputs.values()), "sources": source_bindings,
    "totals": totals, "FIRSTFrozenBytesPreserved": True,
    "inputHashesRecheckedUnchangedBeforeFreeze": True,
    "sourceReceiptHashesValidated": True, "normalizedReceiptHashesValidated": True,
    "independentApproval": False, "independentReviewerStillRequired": True,
    "overallGate2Completed": False, "limits": limits,
}
manifest_path = OWNER / "freeze-manifest.json"
write_json(manifest_path, manifest)
for path in output_paths + [manifest_path]:
    path.chmod(0o444)
    require(path.stat().st_mode & 0o777 == 0o444, "Not frozen: " + str(path))
for item in manifest["outputs"] + manifest["boundInputs"]:
    require(sha(Path(item["path"]).read_bytes()) == item["sha256"], "Final hash validation failed: " + item["path"])
require(candidate_path.read_bytes() == frozen_path.read_bytes(), "Frozen candidate differs")
print(json.dumps({
    "status": STATUS, "totals": totals,
    "candidate": binding["frozen"], "checks": binding["authorChecks"],
    "provenance": binding["provenance"], "binding": {"path": str(OWNER / "author-binding.json"), "sha256": sha((OWNER / "author-binding.json").read_bytes())},
    "manifest": {"path": str(manifest_path), "sha256": sha(manifest_path.read_bytes())},
    "FIRSTBytesPreserved": True, "independentReviewerStillRequired": True,
}, ensure_ascii=False, indent=2))
