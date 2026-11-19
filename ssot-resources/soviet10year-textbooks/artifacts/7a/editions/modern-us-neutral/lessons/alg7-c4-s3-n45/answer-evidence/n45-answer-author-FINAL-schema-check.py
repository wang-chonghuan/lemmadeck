"""Invoke only the existing pure answer-draft validator, never its CLI stages."""

import importlib.util
import json
import sys
from pathlib import Path

sys.dont_write_bytecode = True
working = Path(__file__).resolve().parent
owner = working.parent
repo = owner.parents[5]
assert str(repo) == "/Users/yong/.codex/worktrees/d9b1/lemmadeck"
tool_path = repo / ".claude/skills/ld-s10y-answer/tools/lesson_answers.py"
spec = importlib.util.spec_from_file_location("n45_draft_validator", tool_path)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
profile = json.loads(module.MODERN_US_PROFILE.read_text())
forbidden = profile.get("forbidden_terms", []) + profile.get("forbidden_person_names", [])
exercise_path = owner.parent / "n45-source-stage/artifacts/7a/editions/modern-us-neutral/lessons/alg7-c4-s3-n45/exercises.json"
draft, errors = module.validate_lesson(
    working / "answer-keys.json",
    exercise_path,
    "7a",
    "alg7-c4-s3-n45",
    "modern-us-neutral",
    forbidden,
)
assert draft["status"] == "draft"
receipt = {
    "schema": "stemrobin-182/pure-answer-draft-validation@1",
    "status": "pass" if not errors else "fail",
    "validator": str(tool_path.relative_to(repo)) + ":validate_lesson",
    "method": "Import existing pure function with bytecode writes disabled.",
    "errors": errors,
    "answerCount": len(draft["answers"]),
    "ungraded": sum(a["grading"] == "ungraded" for a in draft["answers"]),
    "parts": sum(len(a["parts"]) for a in draft["answers"]),
    "cliPrepareInvoked": False,
    "cliFinalizeInvoked": False,
    "mathliveOrKeyboardInvoked": False,
    "publicationInvoked": False,
}
output = working / "schema-check.json"
assert owner in output.parents
output.write_text(json.dumps(receipt, indent=2) + "\n")
print(json.dumps(receipt, indent=2))
if errors:
    raise SystemExit(1)
