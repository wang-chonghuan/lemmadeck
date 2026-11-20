import json
import sys
from pathlib import Path

REPO = Path("/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck")
OWNED = REPO / ".intentfold/tickets/STEMROBIN-188/tmp/n44-answer-author"
if Path.cwd() != REPO:
    raise RuntimeError("wrong cwd")
sys.path.insert(0, str(REPO / ".claude/skills/ld-s10y-answer/tools"))
import lesson_answers

work = OWNED / "work/9-10g/modern-us-neutral/lessons/geo910-c2-s1-n44"
candidate = work / "answer-keys.template.json"
exercises_path = REPO / "ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/modern-us-neutral/lessons/geo910-c2-s1-n44/exercises.json"
document, failures = lesson_answers.validate_lesson(
    candidate,
    exercises_path,
    "9-10g",
    "geo910-c2-s1-n44",
    "modern-us-neutral",
)
exercises = json.loads(exercises_path.read_text())["exercises"]
prepared = json.loads((work / "answer-keys.prepared-original.json").read_text())
if document.get("status") != "draft":
    failures.append("candidate must remain draft")
if len(document["answers"]) != 7:
    failures.append("exactly seven answers required")
for answer, original, exercise in zip(document["answers"], prepared["answers"], exercises):
    label = answer["exercise"]
    for field in ("exercise", "prompt", "figureEvidence", "historical_entities"):
        if answer.get(field) != original.get(field):
            failures.append(f"{label}: prepared {field} changed")
    for key, source in (("sourceNumber", "source_number"), ("groupId", "group_id"), ("group", "group")):
        if answer.get(key) != exercise.get(source):
            failures.append(f"{label}: {key} differs from modern exercise")
    if answer.get("groupPrompt", "missing") is not None:
        failures.append(f"{label}: no separate group-level prompt exists")
    if answer.get("source") != "derived" or "bookRaw" in answer:
        failures.append(f"{label}: missing-book source must be derived without bookRaw")
    for part in answer["parts"]:
        if not part.get("label"):
            failures.append(f"{label}: every graded quantity needs a label")
        for value in part["expected"]:
            if any(token in value for token in ("abs(", "sqrt(", "sin(", "cos(", "tan(", "acos(")):
                failures.append(f"{label}: programming function notation in expected")
parts = [part for answer in document["answers"] for part in answer["parts"]]
summary = {
    "autoExercises": [a["exercise"] for a in document["answers"] if a["grading"] == "auto"],
    "ungradedExercises": [a["exercise"] for a in document["answers"] if a["grading"] == "ungraded"],
    "gradedParts": len(parts),
    "exactParts": sum(p["judge"] == "exact" for p in parts),
    "numericParts": sum(p["judge"] == "numeric" for p in parts),
    "expressionParts": sum(p["judge"] == "expression" for p in parts),
}
if summary != {
    "autoExercises": ["17", "18", "19", "20"],
    "ungradedExercises": ["16", "21", "22"],
    "gradedParts": 10,
    "exactParts": 3,
    "numericParts": 7,
    "expressionParts": 0,
}:
    failures.append("grading coverage differs from independently authored plan")
print(json.dumps({
    "status": "technical-structure-ok" if not failures else "technical-structure-fail",
    "validator": "existing validate_lesson plus identity/coverage checks; no cmd_finalize",
    "candidate": str(candidate),
    "summary": summary,
    "failures": failures,
    "semanticReview": "pending",
    "mathLive": "not run",
}, ensure_ascii=False, indent=2))
sys.exit(2 if failures else 0)
