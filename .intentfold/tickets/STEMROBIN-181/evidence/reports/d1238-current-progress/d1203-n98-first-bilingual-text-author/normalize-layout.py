import json
import sys
from pathlib import Path

sys.dont_write_bytecode = True
repo = Path.cwd()
assert str(repo) == "/Users/yong/.codex/worktrees/00b1/lemmadeck"
tools = repo / ".claude/skills/ld-s10y-lesson/tools"
sys.path.insert(0, str(tools))
import edition

owned = repo / ".intentfold/tickets/STEMROBIN-181/tmp/d1203-n98-first-bilingual-text-author"
assert not (owned / "FIRST-candidate-freeze.json").exists()
results = []
for locale in ("zh", "en"):
    lesson_path = owned / locale / "lesson.template.json"
    exercises_path = owned / locale / "exercises.template.json"
    lesson = edition.load(lesson_path)
    exercises = edition.load(exercises_path)
    before = [block["text"] for block in lesson["prose"]]
    edition.normalize_lesson_layout(lesson)
    edition.normalize_exercise_layout(exercises)
    edition.dump(lesson_path, lesson)
    edition.dump(exercises_path, exercises)
    results.append({
        "locale": locale,
        "layoutChangedBlocks": sum(old != block["text"] for old, block in zip(before, lesson["prose"])),
        "operation": "Native deterministic authoring layout only; no finalize/render",
        "lesson": str(lesson_path), "exercises": str(exercises_path),
    })
print(json.dumps(results, ensure_ascii=False, indent=2))
