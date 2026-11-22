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


first = ticket / "tmp/d1816-d966-n74-missing-en"
review_file = ticket / "tmp/d1816-d967-n74-first-en-independent-review/report.json"
assert bind(review_file)["sha256"] == "6ca8764bcf190ab48411bc0915fdba6603728293d150b5620cf8fdaccf363786"
review = edition.load(review_file)
assert review["status"] == "REVISE"
assert [finding["id"] for finding in review["findings"]] == ["D967-F1", "D967-F2"]
draft_file = first / "en.lesson.draft.json"
assert bind(draft_file)["sha256"] == review["candidate"]["draftSha256"]
original = edition.load(draft_file)
candidate = copy.deepcopy(original)
for pointer, value in review["findings"][0]["necessaryCorrection"].items():
    candidate[pointer[1:]] = value
bad = review["findings"][1]["exactBadSubstring"]
stable_replacement = "field. **The electric potential"
assert candidate["prose"][3]["text"].count(bad) == 1
candidate["prose"][3]["text"] = candidate["prose"][3]["text"].replace(bad, stable_replacement)

# A line-leading strong opener is moved by the current normalizer. Keeping it
# inline restores the same definition emphasis without changing paragraph shape.
text = candidate["prose"][3]["text"]
assert edition.normalize_prose_layout(text) == text
assert text.count("**") == original["prose"][3]["text"].count("**") == 2
assert text.replace("**", "").split() == original["prose"][3]["text"].replace("**", "").split()
expected = copy.deepcopy(original)
for key in ["section", "title", "printed_title"]:
    expected[key] = candidate[key]
expected["prose"][3]["text"] = text
assert expected == candidate
flow, errors = edition.prose_flow_contract(candidate["prose"], candidate["section_breaks"])
assert not errors, errors
old_flow = edition.load(first / "en.prose-flow.json")
assert len(flow["paragraphs"]) == len(old_flow["paragraphs"]) == 30
changed = []
for index, (before, after) in enumerate(zip(old_flow["paragraphs"], flow["paragraphs"])):
    if before != after:
        changed.append(index)
        assert {**before, "text": after["text"]} == after
assert changed == [5]
assert {**old_flow, "paragraphs": flow["paragraphs"]} == flow
out = ticket / "tmp/d1816-d970-n74-two-text-findings"
out.mkdir()
candidate_file = out / "en.lesson.draft.json"
flow_file = out / "en.prose-flow.json"
save(candidate_file, candidate)
save(flow_file, flow)
report_file = out / "correction.json"
save(report_file, {
    "task": "D970", "card": "phy9-c2-s2-n74",
    "status": "TWO_TEXT_FINDINGS_CORRECTED_AFFECTED_NATIVE_PASS_REVIEW_PENDING",
    "firstReview": bind(review_file), "originalCandidate": bind(draft_file),
    "candidate": bind(candidate_file), "flow": bind(flow_file),
    "changedPointers": ["/section", "/title", "/printed_title", "/prose/3/text"],
    "changedFlowParagraphs": [5], "fullObjects": 25, "flowParagraphs": 30,
    "normalizerStableAffectedText": True,
    "markupCorrection": {
        "bad": bad, "replacement": stable_replacement,
        "deviationFromSuggestedNewline": "Inline opener avoids the current native line-leading-closing rule. Only the preceding newline becomes a space; words, definition and paragraph shape are unchanged.",
    },
    "allWordsMathematicalTokensNumericGivensAndOtherFieldsUnchanged": True,
    "originalCandidateAndFailuresPreserved": True,
    "historicalSourceAndChineseReviewReplayed": False,
    "parentNewImages": 0, "newCompleteCourses": 0, "newSourcePages": 0,
    "fullCourseApproval": False,
})
print(json.dumps({"report": bind(report_file), "candidate": bind(candidate_file),
                  "flow": bind(flow_file), "status": "PASS"}))
