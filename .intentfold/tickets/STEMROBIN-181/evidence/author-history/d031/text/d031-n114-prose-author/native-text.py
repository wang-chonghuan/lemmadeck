"""Owned wrapper for native paragraph normalization and text signatures only."""
import json
import sys
from pathlib import Path

sys.path.insert(0, ".claude/skills/ld-s10y-lesson/tools")
import edition

payload = json.load(sys.stdin)
mode = payload["mode"]
if mode == "normalize":
    documents = payload["documents"]
    for document in documents:
        edition.normalize_lesson_layout(document)
    print(json.dumps({"documents": documents}, ensure_ascii=False))
elif mode == "validate":
    book = Path(payload["book"])
    lesson = payload["lesson"]
    exercises = payload["exercises"]
    english = payload["english"]
    source = lesson["source"]["data"]
    profile = payload["profile"]
    forbidden = profile["forbidden_terms"] + profile["forbidden_person_names"]
    errors = edition.validate_source(
        book, lesson["source"], book / lesson["source"]["path"], "lesson"
    )
    errors += edition.validate_source(
        book, exercises["source"], book / exercises["source"]["path"], "exercises"
    )
    errors += edition.validate_identity_fields(
        source, lesson, edition.IDENTITY_FIELDS, "lesson"
    )
    assert len(source["prose"]) == len(lesson["prose"]) == len(english["prose"])
    assert exercises["count"] == source["exercise_count"] == 0
    assert exercises["source"]["data"]["exercises"] == exercises["exercises"] == []
    assert lesson["errata"] == []
    checks = []
    for original, modern, translated in zip(
        source["prose"], lesson["prose"], english["prose"]
    ):
        for field in ("kind", "id", "label", "printed_page", "source_refs"):
            assert original.get(field) == modern.get(field) == translated.get(field), field
        assert modern["source_text"] == translated["source_text"] == original["text"]
        errors += edition.validate_text(
            original["text"], modern["text"], modern["changes"],
            modern["numeric_changes"], ",".join(modern["source_refs"]),
            forbidden, modern["historical_entities"]
        )
        literal_numbers = lambda text: [
            match.group() for match in __import__("re").finditer(
                r"-?\d+(?:\.\d+)?", edition.MATH.sub("", text)
            )
        ]
        source_literals = literal_numbers(original["text"])
        assert source_literals == literal_numbers(modern["text"])
        assert source_literals == literal_numbers(translated["text"])
        source_math = edition.math_signature(original["text"])
        assert source_math == edition.math_signature(modern["text"])
        assert source_math == edition.math_signature(translated["text"])
        checks.append({
            "source_refs": original["source_refs"],
            "sourceMath": source_math,
            "chineseMath": edition.math_signature(modern["text"]),
            "englishMath": edition.math_signature(translated["text"]),
            "sourceNativeNumbers": edition.number_signature(original["text"]),
            "chineseNativeNumbers": edition.number_signature(modern["text"]),
            "sourceLiteralNumbers": source_literals,
            "chineseLiteralNumbers": literal_numbers(modern["text"]),
            "englishLiteralNumbers": literal_numbers(translated["text"]),
        })
    print(json.dumps({
        "errors": errors, "signatures": checks, "sourceTasks": 0,
        "mathAtoms": sum(len(item["sourceMath"]) for item in checks),
        "scope": "Mechanical author source-snapshot/identity/text/signature checks; no source re-review, SCI, figure or display approval."
    }, ensure_ascii=False))
else:
    raise ValueError(mode)
