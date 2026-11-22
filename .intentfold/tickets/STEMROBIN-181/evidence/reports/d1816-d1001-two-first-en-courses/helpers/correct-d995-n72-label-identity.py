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


first_file = ticket / "tmp/d1816-d994-n72-first-missing-en/authored.json"
first = edition.load(first_file)
assert first["status"] == "FIRST_MISSING_EN_AUTHOR_NATIVE_FAIL"
candidate_file = Path(first["englishDraft"]["path"])
source_file = Path(first["source"]["path"])
assert bind(candidate_file) == first["englishDraft"]
assert bind(source_file) == first["source"]
failed = edition.load(candidate_file)
source = edition.load(source_file)
corrected = copy.deepcopy(failed)
affected = [1, 2, 4, 5, 6, 7, 11, 12]
assert first["errors"] == [
    f"en.prose[{index}].label is not the native supported localized source alias"
    for index in affected
]
out = ticket / "tmp/d1816-d995-n72-label-identity"
out.mkdir()
save(out / "inputs.freeze.json", {
    "firstReport": bind(first_file), "failedCandidate": bind(candidate_file),
    "source": bind(source_file), "englishFlow": first["englishFlow"],
    "affectedPointers": [f"/prose/{index}/label" for index in affected],
    "scope": "Only eight failed machine label aliases; no source or passed check replay.",
})
changes = []
errors = []
for index in affected:
    before = corrected["prose"][index]["label"]
    after = source["prose"][index]["label"]
    assert corrected["prose"][index]["kind"] in ("fig", "cap")
    corrected["prose"][index]["label"] = after
    changes.append({"pointer": f"/prose/{index}/label", "before": before, "after": after})
    if not edition.same_figure_label(after, corrected["prose"][index]["label"], "en"):
        errors.append(f"en.prose[{index}].label still violates native alias identity")
comparison = copy.deepcopy(corrected)
for index in affected:
    comparison["prose"][index]["label"] = failed["prose"][index]["label"]
assert comparison == failed
assert bind(candidate_file) == first["englishDraft"]
assert bind(source_file) == first["source"]
flow_file = Path(first["englishFlow"]["path"])
assert bind(flow_file) == first["englishFlow"]
result_file = out / "en.lesson.draft.json"
save(result_file, corrected)
report_file = out / "authored.json"
save(report_file, {
    "task": "D995", "card": first["card"],
    "status": "AFFECTED_ONLY_EIGHT_MACHINE_LABEL_IDENTITIES_PASS" if not errors else "FAIL",
    "firstFailedAuthor": bind(first_file), "failedCandidate": bind(candidate_file),
    "source": first["source"], "approvedZh": first["approvedZh"],
    "historicalZhNative": first["historicalZhNative"],
    "historicalZhScience": first["historicalZhScience"],
    "historicalFigureGate": first["historicalFigureGate"],
    "englishToc": first["englishToc"], "englishDraft": bind(result_file),
    "englishFlow": first["englishFlow"], "changes": changes, "errors": errors,
    "onlyEightLabelsChanged": True, "englishCaptionTextAndBodyReferencesUnchanged": True,
    "allPassedTextMathNumberFlowIdentityChecksReplayed": False,
    "sourceAndChineseBytesUnchanged": True, "firstFailurePreserved": True,
    "originalObjects": 13, "originalTasks": 0, "originalFigures": 4,
    "accessibilityLimitation": {
        "machineLabelsRetainSourceChinese": True,
        "reason": "Native alias accepts source labels verbatim, but its Figure N translation requires whitespace absent in these original source labels.",
        "rendererUsesMachineLabelForAriaAndAlt": True,
        "visibleCaptionsRemainEnglish": True,
        "completeEnglishAccessibilityApproval": False,
        "noSourceSpacingOrSkillModification": True,
    },
    "independentEnglishReview": "pending", "englishFigureTuplesStillPending": True,
    "fullCourseApproval": False, "parentNewImages": 0, "paidCalls": 0,
    "databaseWrites": 0, "newCompleteCourses": 0, "newSourcePages": 0,
})
print(json.dumps({"report": bind(report_file), "candidate": bind(result_file),
                  "status": "PASS" if not errors else "FAIL", "errors": errors}))
sys.exit(1 if errors else 0)
