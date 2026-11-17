"""Reuse native edition normalization and text checks, without figure gates."""
import json
import re
import sys
from pathlib import Path

sys.path.insert(0, ".claude/skills/ld-s10y-lesson/tools")
import edition

payload = json.load(sys.stdin)
if payload["mode"] == "normalize":
    for document in payload["documents"]:
        edition.normalize_lesson_layout(document)
    print(json.dumps({"documents": payload["documents"]}, ensure_ascii=False))
elif payload["mode"] == "validate":
    book = Path(payload["book"])
    lesson, exercises, english = (
        payload["lesson"], payload["exercises"], payload["english"]
    )
    source = lesson["source"]["data"]
    forbidden = (
        payload["profile"]["forbidden_terms"]
        + payload["profile"]["forbidden_person_names"]
    )
    errors = edition.validate_source(
        book, lesson["source"], book / lesson["source"]["path"], "lesson"
    )
    errors += edition.validate_source(
        book, exercises["source"], book / exercises["source"]["path"], "exercises"
    )
    for document in (lesson, english):
        errors += edition.validate_identity_fields(
            source, document, edition.IDENTITY_FIELDS, "lesson"
        )
    assert len(source["prose"]) == len(lesson["prose"]) == len(english["prose"]) == 7
    assert exercises["count"] == source["exercise_count"] == 0
    assert exercises["source"]["data"]["exercises"] == exercises["exercises"] == []
    assert source["figures"] == lesson["figures"] == english["figures"]
    assert [figure["id"] for figure in source["figures"]] == ["fig-283"]
    assert lesson["errata"] == english["errata"] == []
    assert lesson["source"] == english["source"]
    expected_refs = [
        ["p0307#3"], ["p0307#4", "p0307#7"], ["p0307#5"], ["p0307#6"],
        ["p0307#8"], ["p0307#9"], ["p0307#10"]
    ]
    literal_numbers = lambda text: re.findall(
        r"-?\d+(?:\.\d+)?", edition.MATH.sub("", text)
    )
    math_tokens = lambda text: [match.group() for match in edition.MATH.finditer(text)]
    figure_refs = lambda text: re.findall(r"(?:图|Figure)\s*(\d+)", text)
    checks = []
    for index, (original, modern, translated) in enumerate(
        zip(source["prose"], lesson["prose"], english["prose"])
    ):
        for field in ("kind", "id", "label", "printed_page", "source_refs"):
            assert original.get(field) == modern.get(field) == translated.get(field), field
        assert modern["source_refs"] == expected_refs[index]
        assert modern["source_text"] == translated["source_text"] == original["text"]
        assert modern["numeric_changes"] == translated["numeric_changes"] == []
        for document in (modern, translated):
            errors += edition.validate_text(
                original["text"], document["text"], document["changes"],
                document["numeric_changes"], ",".join(document["source_refs"]),
                forbidden, document["historical_entities"]
            )
            assert literal_numbers(original["text"]) == literal_numbers(document["text"])
            assert math_tokens(original["text"]) == math_tokens(document["text"])
            assert figure_refs(original["text"]) == figure_refs(document["text"])
            if document["kind"] == "p":
                assert edition.normalize_prose_layout(document["text"]) == document["text"]
            assert re.search(r"<span|[\u0400-\u04ff]", document["text"]) is None
            assert not any(key in document for key in (
                "answer", "answerKey", "choiceSet", "choices", "correct_index", "interaction"
            ))
        if original["kind"] == "fig":
            assert modern["text"] == translated["text"] == original["text"] == ""
        checks.append({
            "kind": original["kind"], "source_refs": original["source_refs"],
            "sourceMath": edition.math_signature(original["text"]),
            "chineseMath": edition.math_signature(modern["text"]),
            "englishMath": edition.math_signature(translated["text"]),
            "exactSourceMathTokens": math_tokens(original["text"]),
            "sourceNativeNumbers": edition.number_signature(original["text"]),
            "chineseNativeNumbers": edition.number_signature(modern["text"]),
            "englishNativeNumbers": edition.number_signature(translated["text"]),
            "sourceLiteralNumbers": literal_numbers(original["text"]),
            "sourceFigureReferences": figure_refs(original["text"])
        })
    # Native historical declarations require the literal term in both texts.
    # English translation mappings are separate, source-bound assertions.
    assert lesson["prose"][0]["historical_entities"][0]["term"] == "法拉第"
    mapping = english["prose"][0]["historical_translation"]
    assert len(mapping) == 1
    assert mapping[0]["source_term"] in source["prose"][0]["text"]
    assert mapping[0]["translated_term"] in english["prose"][0]["text"]
    assert mapping[0]["source_refs"] == ["p0307#3"]
    assert all(not block["historical_entities"] for block in english["prose"])
    print(json.dumps({
        "errors": errors, "signatures": checks,
        "mathAtoms": sum(len(item["sourceMath"]) for item in checks),
        "sourceObjects": len(checks), "sourceParagraphObjects": 5,
        "sourceTasks": 0, "sourceFigures": 1, "sourceCaptions": 1,
        "historicalTranslation": mapping,
        "sourceApproval": False, "independentSCIApproval": False,
        "scope": "One native text-only author check; no SOURCE, RAW, SCI, figure, finalization, render or full-card approval."
    }, ensure_ascii=False))
    sys.exit(1 if errors else 0)
else:
    raise ValueError(payload["mode"])
