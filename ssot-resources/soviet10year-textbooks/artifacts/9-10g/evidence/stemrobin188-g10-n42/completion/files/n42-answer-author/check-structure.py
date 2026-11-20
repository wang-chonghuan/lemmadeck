import hashlib
import importlib.util
import json
from pathlib import Path

cwd = Path("/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck")
assert Path.cwd() == cwd
owned = cwd / ".intentfold/tickets/STEMROBIN-188/tmp/n42-answer-author"
lesson = "geo910-c2-s1-n42"
core = cwd / "ssot-resources/soviet10year-textbooks/artifacts/9-10g"
edition_lesson = core / "editions/modern-us-neutral/lessons" / lesson
work = owned / "work/9-10g/modern-us-neutral/lessons" / lesson
candidate_path = work / "answer-keys.template.json"


def load(path):
    return json.loads(path.read_text())


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


spec = importlib.util.spec_from_file_location(
    "n42_lesson_answers",
    cwd / ".claude/skills/ld-s10y-answer/tools/lesson_answers.py",
)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
profile = load(cwd / ".claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json")
forbidden = profile["forbidden_terms"] + profile["forbidden_person_names"]
document, errors = module.validate_lesson(
    candidate_path, edition_lesson / "exercises.json",
    "9-10g", lesson, "modern-us-neutral", forbidden,
)
assert not errors, errors
assert document["status"] == "draft"
assert sha(candidate_path) == sha(work / "answer-keys.first-candidate.json")
source = load(core / "lessons" / lesson / "exercises.json")
edition = load(edition_lesson / "exercises.json")
prepared = load(work / "answer-keys.prepared-original.json")
expected_parts = [7, 3, 3, 0, 2, 2, 2]
coverage = []
for index, (answer, exercise, original, initial) in enumerate(zip(
    document["answers"], edition["exercises"], source["exercises"], prepared["answers"]
)):
    number = answer["exercise"]
    assert number == str(exercise["number"]) == str(original["number"])
    assert answer["sourceNumber"] == exercise["source_number"] == original["source_number"]
    assert answer["groupId"] == exercise["group_id"] == original["group_id"]
    assert answer["group"] == exercise["group"] == original["group"]
    assert answer["sourcePages"] == exercise["pages"] == original["pages"]
    assert answer["numberingScope"] == "g10"
    assert answer["prompt"] == exercise["text"] == initial["prompt"]
    assert answer["figureEvidence"] == initial["figureEvidence"] == []
    assert exercise["figure_refs"] == original["figure_refs"] == []
    assert answer["source"] == "derived" and "bookRaw" not in answer
    assert len(answer["parts"]) == expected_parts[index]
    assert answer["grading"] == ("ungraded" if number == "4" else "auto")
    assert all(part["judge"] == ("numeric" if number in {"5", "6"} else "exact")
               for part in answer["parts"])
    coverage.append({
        "exercise": number, "sourcePages": answer["sourcePages"],
        "numberingScope": answer["numberingScope"], "grading": answer["grading"],
        "gradedParts": len(answer["parts"]), "fullDisplayAnswer": bool(answer["displayAnswer"].strip()),
    })
assert len(document["answers"]) == source["count"] == edition["count"] == 7
assert len({a["exercise"] for a in document["answers"]}) == 7
print(json.dumps({
    "status": "author-structural-support-ok",
    "candidateSha256": sha(candidate_path),
    "sharedValidatorErrors": errors,
    "answerCount": 7, "autoExercises": 6, "ungradedExercises": 1,
    "gradedParts": 19, "exactParts": 15, "numericParts": 4,
    "exactExpectedValues": 18, "numericExpectedValues": 4,
    "coverage": coverage,
    "finalize": False, "independentSemanticPASS": False, "realMathLiveCheck": False,
}, indent=2))
