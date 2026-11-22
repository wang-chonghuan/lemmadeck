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


first_file = ticket / "tmp/d1816-d988-n63-first-missing-en/authored.json"
first = edition.load(first_file)
assert first["status"] == "FIRST_MISSING_EN_AUTHOR_NATIVE_FAIL"
assert len(first["errors"]) == 1 and "historical_entities[0].term" in first["errors"][0]
before_file = Path(first["englishDraft"]["path"])
before = edition.load(before_file)
candidate = copy.deepcopy(before)
block = candidate["prose"][1]
assert len(block["historical_entities"]) == 1
declaration = block["historical_entities"][0]
assert declaration["term"] == "\u5e93\u4ed1"
declaration["source_term"] = declaration["term"]
declaration["term"] = "Coulomb"
assert "translation" not in block["changes"]
block["changes"].append("translation")
expected = copy.deepcopy(before)
expected["prose"][1]["historical_entities"] = copy.deepcopy(block["historical_entities"])
expected["prose"][1]["changes"] = copy.deepcopy(block["changes"])
assert candidate == expected
raw = edition.load(Path(first["source"]["path"]))
profile = edition.load(repo / ".claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json")
errors = edition.validate_text(
    raw["prose"][1]["text"], block["text"], block["changes"], block["numeric_changes"],
    "en.prose[1]", profile["forbidden_terms"] + profile["forbidden_person_names"],
    block["historical_entities"])
assert not errors, errors
out = ticket / "tmp/d1816-d989-n63-historical-name"
out.mkdir()
candidate_file = out / "en.lesson.draft.json"
save(candidate_file, candidate)
report_file = out / "authored.json"
save(report_file, {
    **first, "task": "D989", "status": "FIRST_MISSING_EN_AUTHOR_NATIVE_PASS",
    "firstFailure": bind(first_file), "englishDraft": bind(candidate_file),
    "changedPointers": ["/prose/1/historical_entities/0/term",
                        "/prose/1/historical_entities/0/source_term", "/prose/1/changes"],
    "affectedNativeStatus": "PASS", "errors": [],
    "allProseTextsMathNumbersFlowBoundariesErrataAndOtherFieldsUnchanged": True,
    "passedMathematicsErrataAndOtherBlockValidationsReplayed": False,
    "originalFailurePreserved": True, "independentEnglishReview": "pending",
})
print(json.dumps({"report": bind(report_file), "candidate": bind(candidate_file), "status": "PASS"}))
