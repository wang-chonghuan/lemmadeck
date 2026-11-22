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


before_file = ticket / "tmp/d1816-d970-n74-two-text-findings/en.lesson.draft.json"
source_file = repo / "ssot-resources/soviet10year-textbooks/artifacts/9p/lessons/phy9-c2-s2-n74/lesson.json"
candidate = edition.load(before_file)
source = edition.load(source_file)
before = copy.deepcopy(candidate)
candidate["section"] = source["section"]
assert {**before, "section": candidate["section"]} == candidate
errors = edition.validate_lesson_identity(source, candidate)
assert not errors, errors
toc_home = repo / "ssot-resources/soviet10year-textbooks/toc/9p"


def entries(node):
    result = [node] if node.get("id") and node.get("title") else []
    for key in ["contents", "lessons", "topics"]:
        for child in node.get(key, []):
            result.extend(entries(child))
    return result


zh = entries(edition.load(toc_home / "zh.json"))
en = {node["id"]: node["title"] for node in entries(edition.load(toc_home / "en.json"))}
matches = [node for node in zh if node["title"].split() == source["section"].split()]
assert len(matches) == 1, matches
display_section = en[matches[0]["id"]]
assert display_section == before["section"] == "Chapter 8. Electrostatics"
out = ticket / "tmp/d1816-d973-n74-source-section-reconciliation"
out.mkdir()
candidate_file = out / "en.lesson.draft.json"
save(candidate_file, candidate)
report_file = out / "reconciliation.json"
save(report_file, {
    "task": "D973", "card": "phy9-c2-s2-n74",
    "status": "SOURCE_SECTION_IDENTITY_RECONCILED_METADATA_REVIEW_PENDING",
    "before": bind(before_file), "candidate": bind(candidate_file), "source": bind(source_file),
    "failedNative": bind(ticket / "tmp/d1816-recovery/native/d971-n74-en-adapt-finalize-first/receipt.json"),
    "changedPointers": ["/section"],
    "sourceIdentitySection": candidate["section"], "renderedEnglishSection": display_section,
    "englishToc": bind(toc_home / "en.json"), "chineseToc": bind(toc_home / "zh.json"),
    "existingContract": {
        "identity": "edition.validate_lesson_identity permits title/chapter/printed_title localization but preserves section as source identity.",
        "render": "render_lesson.js metadataLabel maps section by the Chinese/English TOC id; it does not display the machine section verbatim for English.",
        "identityFile": bind(repo / ".claude/skills/ld-s10y-lesson/tools/edition.py"),
        "rendererFile": bind(repo / ".claude/skills/ld-s10y-lesson/tools/render_lesson.js"),
    },
    "affectedIdentityNative": "PASS",
    "nativeGateBypassed": False, "skillsEdited": False, "sourceBytesChanged": False,
    "englishTextTitleChapterPrintedTitleAndFlowUnchanged": True,
    "fullCourseApproval": False, "parentNewImages": 0, "newCompleteCourses": 0, "newSourcePages": 0,
})
print(json.dumps({"report": bind(report_file), "candidate": bind(candidate_file), "status": "PASS"}))
