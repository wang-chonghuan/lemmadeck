import json
import sys
from pathlib import Path

sys.path.insert(0, sys.argv[1])
import edition

payload = json.load(sys.stdin)
book = Path(payload["book"])
lesson = payload["lesson"]
exercises = payload["exercises"]
raw_lesson = lesson["source"]["data"]
raw_exercises = exercises["source"]["data"]
corrections, errors = edition.validate_errata(
    book, raw_lesson, raw_exercises, lesson, exercises
)
checks = []
for language, modern_lesson, modern_exercises in (
    ("zh", lesson, exercises),
    ("en", payload["englishLesson"], payload["englishExercises"]),
):
    for index, (raw, modern) in enumerate(zip(raw_lesson["prose"], modern_lesson["prose"])):
        target = f"lesson.prose[{index}]"
        item_errors = edition.validate_text(
            raw["text"], modern["text"], modern["changes"], modern["numeric_changes"],
            target, [], modern["historical_entities"], corrections.get(target),
        )
        errors.extend(f"{language}: {error}" for error in item_errors)
        checks.append({
            "language": language,
            "target": target,
            "source_refs": raw["source_refs"],
            "math": edition.math_signature(modern["text"]),
            "sourceNonFormulaNumbers": edition.number_signature(raw["text"]),
            "modernNonFormulaNumbers": edition.number_signature(modern["text"]),
            "errors": item_errors,
        })
    for index, (raw, modern) in enumerate(zip(raw_exercises["exercises"], modern_exercises["exercises"])):
        target = f"exercises[{index}]"
        item_errors = edition.validate_text(
            raw["text"], modern["text"], modern["changes"], modern["numeric_changes"],
            target, [], modern["historical_entities"], corrections.get(target),
        )
        errors.extend(f"{language}: {error}" for error in item_errors)
        checks.append({
            "language": language,
            "target": target,
            "pages": raw["pages"],
            "math": edition.math_signature(modern["text"]),
            "sourceNonFormulaNumbers": edition.number_signature(raw["text"]),
            "modernNonFormulaNumbers": edition.number_signature(modern["text"]),
            "errors": item_errors,
        })
print(json.dumps({
    "scope": "Only card113's authored source/errata/formula/number text bindings. Not adapt-finalize, image validation, SCI or display approval.",
    "nativeHelpers": ["edition.validate_errata", "edition.validate_text"],
    "status": "TEXT_BINDINGS_PASS" if not errors else "TEXT_BINDINGS_FAIL",
    "corrections": corrections,
    "checks": checks,
    "errors": errors,
}, ensure_ascii=False, indent=2))
sys.exit(1 if errors else 0)
