import json
import sys
from pathlib import Path

ROOT = Path("/Users/yong/.codex/worktrees/stemrobin-182-six-3129/lemmadeck")
assert Path.cwd() == ROOT
sys.path.insert(0, str(ROOT / ".claude/skills/ld-s10y-lesson/tools"))
import edition
dump = edition.dump

profile = edition.load(ROOT / ".claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json")
out = ROOT / ".tmp/ld-s10y-lesson/resume182-6-3129/local-repairs-FIRST"
results = []
for book_id, lesson_id in [("6a", "alg6-c2-s1-n8"), ("8a", "alg8-c3-s3-n20")]:
    book = ROOT / "ssot-resources/soviet10year-textbooks/artifacts" / book_id
    modern = book / "editions/modern-us-neutral"
    target = modern / "lessons" / lesson_id
    lesson, exercises, figures, errors = edition.validate_lesson(book, modern, lesson_id, profile)
    changes = {}
    for name, value in [("lesson.json", lesson), ("exercises.json", exercises), ("figures.json", figures)]:
        current = edition.load(target / name)
        changes[name] = value != current
    results.append({"book": book_id, "lesson": lesson_id, "errors": errors,
                    "normalizationWouldChange": changes})
    if not errors:
        for name, value in [("lesson.json", lesson), ("exercises.json", exercises), ("figures.json", figures)]:
            dump(out / "normalized" / book_id / name, value)
dump(out / "native-check-FIRST.json", {"results": results})
print(json.dumps(results, ensure_ascii=False))
sys.exit(1 if any(row["errors"] for row in results) else 0)
