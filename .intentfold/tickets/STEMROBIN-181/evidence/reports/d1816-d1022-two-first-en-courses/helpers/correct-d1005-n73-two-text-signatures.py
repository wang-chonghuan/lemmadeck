import copy
import hashlib
import json
import sys
from pathlib import Path

repo = Path("/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck")
assert Path.cwd() == repo
ticket = repo / ".intentfold/tickets/STEMROBIN-181"
sys.path.insert(0, str(repo / ".claude/skills/ld-s10y-lesson/tools"))
import edition


def bind(file):
    return {"path": str(file), "bytes": file.stat().st_size,
            "sha256": hashlib.sha256(file.read_bytes()).hexdigest()}


def save(file, data):
    with file.open("x") as stream:
        stream.write(json.dumps(data, ensure_ascii=False, indent=2) + "\n")


prepared_file = ticket / "tmp/d1816-d1002-n73-first-missing-en/prepared.json"
prepared = edition.load(prepared_file)
failed_file = ticket / "tmp/d1816-d1004-n73-first-missing-en/en.before-native.json"
failed = edition.load(failed_file)
lesson = copy.deepcopy(failed)
zh = edition.load(Path(prepared["approvedZh"]["path"]))
raw = edition.load(Path(prepared["source"]["path"]))
out = ticket / "tmp/d1816-d1005-n73-two-text-signatures"
out.mkdir()
save(out / "first-failure.json", {
    "task": "D1004", "status": "FIRST_AUTHOR_HELPER_ABORTED_ON_MATH_SIGNATURE",
    "failedCandidate": bind(failed_file),
    "nativeReceipt": bind(ticket / "tmp/d1816-recovery/native/d1004-n73-first-missing-en-author-native/receipt.json"),
    "firstAbortIndex": 18, "mathDifferenceIndices": [18, 21],
    "firstFailureExecChunk": "25bbc4", "structuredDiagnosisExecChunk": "7c41fe",
    "diagnosticParserFailureExecChunk": "0470f0",
    "diagnosticParserFailure": "Path-required edition.load was given a string; no bytes changed.",
    "fullAuthorHelperNativePassNotEstablished": True,
    "validationAt18NotCompletedAnd19Through21NotInvoked": True,
    "officialFullNativeFinalizationNotInvoked": True,
})
lesson["prose"][18]["text"] = (
    "**The zero of potential energy** Equation (8-22) chooses the surface of plate $B$ as the zero, so the potential energy is zero on plate $B$.\n"
    "As with gravitational potential energy, the zero can be chosen arbitrarily.\n"
    "Alternatively, at a position whose distance from plate $B$ is $d_0$, we can define $E_P=0$, giving"
)
before = lesson["prose"][21]["text"]
assert "and $d$ taken as the nonnegative distance to that plate" in before
lesson["prose"][21]["text"] = before.replace(
    "and $d$ taken as the nonnegative distance to that plate",
    "and the distance to that plate taken as nonnegative")
comparison = copy.deepcopy(lesson)
for index in [18, 21]:
    comparison["prose"][index]["text"] = failed["prose"][index]["text"]
assert comparison == failed
edition.normalize_lesson_layout(lesson)
flow, errors = edition.prose_flow_contract(lesson["prose"], [])
boundaries = []
for prefix in ["**Work in a uniform electric field", "**Work and the change", "**The zero of potential energy"]:
    matches = [index for index, paragraph in enumerate(flow["paragraphs"])
               if paragraph["text"].startswith(prefix)]
    assert len(matches) == 1 and matches[0] > 0
    index = matches[0]
    boundaries.append({"before": flow["paragraphs"][index - 1]["text"],
                       "after": flow["paragraphs"][index]["text"]})
lesson["section_breaks"] = boundaries
flow, flow_errors = edition.prose_flow_contract(lesson["prose"], boundaries)
errors.extend(flow_errors)
profile = edition.load(repo / ".claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json")
for index in [18, 19, 20, 21]:
    modern, approved, source = lesson["prose"][index], zh["prose"][index], raw["prose"][index]
    assert edition.math_signature(modern["text"]) == edition.math_signature(approved["text"])
    errors.extend(edition.validate_identity_fields(
        source, modern, ["kind", "id", "printed_page", "source_refs"], f"en.prose[{index}]"))
    errors.extend(edition.validate_text(
        source["text"], modern["text"], modern["changes"], modern["numeric_changes"],
        f"en.prose[{index}]", profile["forbidden_terms"] + profile["forbidden_person_names"],
        modern.get("historical_entities")))
candidate_file = out / "en.lesson.draft.json"
flow_file = out / "en.prose-flow.json"
save(candidate_file, lesson)
save(flow_file, flow)
toc_file = repo / "ssot-resources/soviet10year-textbooks/toc/9p/en.json"
report_file = out / "authored.json"
save(report_file, {
    "task": "D1005", "card": prepared["card"],
    "status": "FIRST_MISSING_EN_AUTHOR_AFFECTED_AND_UNVISITED_NATIVE_PASS" if not errors else "FAIL",
    "prepared": bind(prepared_file), "firstFailure": bind(out / "first-failure.json"),
    "source": prepared["source"], "approvedZh": prepared["approvedZh"],
    "englishToc": bind(toc_file), "englishDraft": bind(candidate_file), "englishFlow": bind(flow_file),
    "errors": errors, "textChanges": [18, 21], "affectedNativeIndices": [18, 21],
    "unfinishedFirstNativeIndices": [19, 20],
    "earlier0Through17HelperChecksReplayed": False,
    "wholeAuthorHelperNativePassClaimed": False,
    "officialFullNativeFinalizationAndIndependentEnglishReview": "pending",
    "sourceSectionAndUnspacedFigureMachineLabelsRetained": True,
    "visibleCaptionsEnglish": True, "completeEnglishAccessibilityApproval": False,
    "originalObjects": 22, "originalTasks": 0, "originalFigures": 2,
    "flowParagraphs": len(flow["paragraphs"]), "derivedConceptBoundaries": 3,
    "firstFailureAndCandidateUnchanged": True,
    "originalSourceZhAndFigureReviewReplayed": False, "alreadyCountedInD019": True,
    "englishFigureTuplesStillPending": True, "fullCourseApproval": False,
    "parentNewImages": 0, "newCompleteCourses": 0, "newSourcePages": 0,
})
print(json.dumps({"report": bind(report_file), "candidate": bind(candidate_file),
                  "status": "PASS" if not errors else "FAIL", "errors": errors}))
sys.exit(1 if errors else 0)
