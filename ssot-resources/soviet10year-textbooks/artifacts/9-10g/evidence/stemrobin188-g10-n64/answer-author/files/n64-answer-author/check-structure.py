import hashlib
import json
import os
import sys
from pathlib import Path

sys.dont_write_bytecode = True
root = Path(__file__).resolve().parent
repo = root.parents[4]
sys.path.insert(0, str(repo / ".claude/skills/ld-s10y-answer/tools"))
import lesson_answers

candidate = root / "answer-keys.candidate.json"
exercise_path = repo / (
    "ssot-resources/soviet10year-textbooks/artifacts/9-10g/"
    "editions/modern-us-neutral/lessons/geo910-c2-s3-n64/exercises.json"
)
profile_path = repo / ".claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json"
profile = json.loads(profile_path.read_text())
document, errors = lesson_answers.validate_lesson(
    candidate,
    exercise_path,
    "9-10g",
    "geo910-c2-s3-n64",
    "modern-us-neutral",
    profile["forbidden_terms"] + profile["forbidden_person_names"],
)
template_path = root / (
    "work/9-10g/modern-us-neutral/lessons/"
    "geo910-c2-s3-n64/answer-keys.template.json"
)
template = json.loads(template_path.read_text())
exercises = json.loads(exercise_path.read_text())["exercises"]
if [entry["prompt"] for entry in template["answers"]] != [
    entry["text"] for entry in exercises
]:
    errors.append("Prepared template prompts differ from current modern exercises.")
if any(entry.get("figureEvidence") for entry in template["answers"]):
    errors.append("Unexpected figureEvidence: visual inspection would be required.")
if any(entry.get("figure_refs") for entry in exercises):
    errors.append("Unexpected exercise figure references.")
for source, answer in zip(template["answers"], document["answers"]):
    if "bookRaw" in source and answer.get("bookRaw") != source["bookRaw"]:
        errors.append(f"{answer['exercise']}: template bookRaw was not preserved.")
    if "bookRaw" not in source and answer.get("source") != "derived":
        errors.append(f"{answer['exercise']}: source must be derived.")
report = {
    "status": "fail" if errors else "pass",
    "scope": "One call to validate_lesson; not cmd_finalize, not an independent review.",
    "candidate": str(candidate),
    "candidateSha256": hashlib.sha256(candidate.read_bytes()).hexdigest(),
    "candidateMode": f"{candidate.stat().st_mode & 0o7777:04o}",
    "exerciseInput": str(exercise_path),
    "exerciseInputSha256": hashlib.sha256(exercise_path.read_bytes()).hexdigest(),
    "validator": str(Path(lesson_answers.__file__).resolve()),
    "validatorSha256": hashlib.sha256(Path(lesson_answers.__file__).read_bytes()).hexdigest(),
    "answerCount": len(document["answers"]),
    "auto": sum(a["grading"] == "auto" for a in document["answers"]),
    "ungraded": sum(a["grading"] == "ungraded" for a in document["answers"]),
    "errors": errors,
    "python": sys.version,
    "pid": os.getpid(),
}
(root / "structure-check.FIRST.json").write_text(
    json.dumps(report, ensure_ascii=False, indent=2) + "\n"
)
print(json.dumps(report, ensure_ascii=False, indent=2))
sys.exit(2 if errors else 0)
