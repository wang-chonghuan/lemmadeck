"""Use native text helpers without finalization, rendering or independent review."""
import json
import re
import sys
from pathlib import Path

folder = Path(__file__).resolve().parent
repo = Path.cwd()
sys.path.insert(0, str(repo / ".claude/skills/ld-s10y-lesson/tools"))
import edition
import mathcheck

payload = json.load(sys.stdin)
if payload["mode"] == "normalize":
    for document in payload["documents"]:
        edition.normalize_lesson_layout(document["lesson"])
        edition.normalize_exercise_layout(document["exercises"])
    print(json.dumps(payload["documents"], ensure_ascii=False))
    raise SystemExit(0)

assert payload["mode"] == "validate"
card = "phy10-c1-s4-n36"
profile = edition.load(repo / ".claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json")
forbidden = profile["forbidden_terms"] + profile["forbidden_person_names"]
expected_prose_refs = [
    ["p0101#4"], ["p0101#5"], ["p0101#6"], ["p0101#7", "p0102#1"],
    ["p0102#2"], ["p0102#3"], ["p0102#4"], ["p0102#5"],
]
expected_question_refs = [[f"p0102#{index}"] for index in range(7, 11)]
literal_numbers = lambda text: re.findall(r"-?\d+(?:\.\d+)?", text)
math_tokens = lambda text: [match.group(0) for match in edition.MATH.finditer(text)]
reports = []
errors = []
for language in ("zh", "en"):
    book = folder / language / "root/10p"
    work = folder / language / "work/adapt/10p/modern-us-neutral/lessons" / card
    raw_path = book / "lessons" / card / "lesson.json"
    raw_exercises_path = raw_path.parent / "exercises.json"
    raw = edition.load(raw_path)
    raw_exercises = edition.load(raw_exercises_path)
    lesson = edition.load(work / "lesson.template.json")
    exercises = edition.load(work / "exercises.template.json")
    figures = edition.load(work / "figures.template.json")
    language_errors = edition.validate_source(book, lesson["source"], raw_path, "lesson")
    language_errors += edition.validate_source(
        book, exercises["source"], raw_exercises_path, "exercises"
    )
    language_errors += edition.validate_identity_fields(
        raw, lesson, edition.IDENTITY_FIELDS, f"{language}.lesson"
    )
    assert lesson["schema"] == edition.LESSON_SCHEMA
    assert exercises["schema"] == edition.EXERCISES_SCHEMA
    assert figures["schema"] == edition.FIGURES_SCHEMA
    assert lesson["source"]["data"] == raw
    assert exercises["source"]["data"] == raw_exercises
    assert lesson["language"] == exercises["language"] == language
    assert len(lesson["prose"]) == len(raw["prose"]) == 8
    assert exercises["count"] == raw_exercises["count"] == raw["exercise_count"] == 4
    assert lesson["figures"] == raw["figures"] == figures["figures"] == []
    assert lesson["errata"] == []
    assert lesson["title"] == "苏联电气化的成就和远景"
    assert lesson["printed_title"] == "36. 苏联电气化的成就和远景"
    authoritative = edition._authoritative_source_targets(book, raw, raw_exercises)
    declared = edition._source_target_map(raw, raw_exercises)
    assert authoritative == declared
    assert lesson["prose"][3]["source_refs"] == ["p0101#7", "p0102#1"]
    source_target_texts = {
        ref: text for ref, targets in authoritative.items() for text in targets.values()
    }
    checks = []
    math_blocks = []
    for index, (source, modern) in enumerate(zip(raw["prose"], lesson["prose"])):
        assert modern["source_refs"] == expected_prose_refs[index]
        for field in ("kind", "id", "label", "printed_page", "source_refs"):
            assert modern.get(field) == source.get(field), (language, index, field)
        assert modern["source_text"] == source["text"]
        assert modern["numeric_changes"] == []
        assert edition.normalize_prose_layout(modern["text"]) == modern["text"]
        assert math_tokens(source["text"]) == math_tokens(modern["text"])
        assert literal_numbers(source["text"]) == literal_numbers(modern["text"])
        assert re.search(r"<(?:span|input|button|textarea|select)\b", modern["text"]) is None
        assert "原教材" in modern["text"] if language == "zh" else "textbook" in modern["text"]
        language_errors += edition.validate_text(
            source["text"], modern["text"], modern["changes"], modern["numeric_changes"],
            f"{language}.prose[{index}]", forbidden, modern["historical_entities"]
        )
        checks.append({
            "source_refs": modern["source_refs"],
            "exactSourceText": True, "identityPreserved": True,
            "sourceLiteralNumbers": literal_numbers(source["text"]),
            "modernLiteralNumbers": literal_numbers(modern["text"]),
            "sourceMathTokens": math_tokens(source["text"]),
            "modernMathTokens": math_tokens(modern["text"]),
            "historical_entities": modern["historical_entities"],
        })
        math_blocks.append({"id": f"{language}.prose[{index}]", "text": modern["text"]})
    question_checks = []
    for index, (source, modern) in enumerate(
        zip(raw_exercises["exercises"], exercises["exercises"])
    ):
        language_errors += edition.validate_identity_fields(
            source, modern,
            ("number", "source_number", "group", "group_id", "pages", "figure_refs", "figures"),
            f"{language}.exercises[{index}]"
        )
        assert modern["pages"] == expected_question_refs[index]
        assert modern["source_text"] == source["text"]
        assert modern["number"] == modern["source_number"] == str(index + 1)
        assert modern["group"] == "问题" and modern["group_id"] == "g1"
        assert modern["lines"] == modern["text"].splitlines()
        assert modern["numeric_changes"] == []
        assert math_tokens(source["text"]) == math_tokens(modern["text"]) == []
        assert literal_numbers(source["text"]) == literal_numbers(modern["text"])
        assert modern["text"].endswith("？" if language == "zh" else "?")
        assert re.search(r"<(?:input|button|textarea|select)\b", modern["text"]) is None
        assert not any(key in modern for key in (
            "answer", "answerKey", "answers", "interaction", "choices",
            "choiceSet", "correct_index", "solution", "readonly", "readOnly"
        ))
        language_errors += edition.validate_text(
            source["text"], modern["text"], modern["changes"], modern["numeric_changes"],
            f"{language}.exercises[{index}]", forbidden, modern["historical_entities"]
        )
        language_errors += edition.validate_numbered_subpart_layout(modern["text"])
        question_checks.append({
            "number": modern["number"], "source_number": modern["source_number"],
            "group": modern["group"], "group_id": modern["group_id"],
            "pages": modern["pages"], "source_text": modern["source_text"],
            "text": modern["text"], "unsolved": True, "answerFieldsAbsent": True,
        })
        math_blocks.append({"id": f"{language}.exercises[{index}]", "text": modern["text"]})
    language_errors += edition.validate_figure_references(
        lesson["prose"], exercises["exercises"], figures["figures"]
    )
    math_errors, warnings = mathcheck.collect_and_check(
        math_blocks, lambda block: [("text", block["text"])]
    )
    language_errors += math_errors
    display = edition.load(folder / language / "question-display.json")
    assert display["mode"] == "read-only"
    assert display["legacyInputInteractions"] is False
    assert display["independentAnswers"] == display["choiceCreation"] == "pending"
    assert len(display["questions"]) == 4
    for shown, modern in zip(display["questions"], exercises["exercises"]):
        assert shown["text"] == modern["text"]
        assert shown["source_text"] == modern["source_text"]
        assert shown["pages"] == modern["pages"]
    translations = edition.load(folder / "historical-bindings.json")
    for item in translations["entities"]:
        assert item["source_term"] in source_target_texts[item["source_refs"][0]]
        block = lesson["prose"][item["prose_index"]]
        assert item[language] in block["text"], (language, item)
    for item in translations["quantities"]:
        source = raw["prose"][item["prose_index"]]["text"]
        modern = lesson["prose"][item["prose_index"]]["text"]
        assert item["source"] in source
        assert item[language] in modern, (language, item)
    reports.append({
        "language": language, "errors": language_errors,
        "sourceProseObjects": 8, "sourceQuestions": 4, "sourceFigures": 0,
        "prose": checks, "questions": question_checks, "katexWarnings": warnings,
        "authoritativeSourceRefsMatched": True,
        "strictIdentityPreserved": True, "nativeNumericAndMathChecks": True,
        "rawChineseQuantityTranslationsBound": True,
        "historicalEntityTranslationsBound": True,
        "readonlyDisplaySidecarOnly": True,
    })
    errors += language_errors
print(json.dumps({
    "schema": "ld-s10y-lesson/bounded-text-check@1",
    "ticket": "STEMROBIN-181", "card": card,
    "status": "pass" if not errors else "fail",
    "languages": reports, "errors": errors,
    "adaptFinalizeRun": False, "renderRun": False,
    "sourceSubstantiveReplay": False, "independentSCIApproval": False,
    "independentAnswers": "pending", "choiceCreation": "pending",
    "imagesOpened": 0, "wholeCardComplete": False,
    "scope": "One bilingual author text check using native source, identity, text, number, math and figure-reference helpers. No independent SOURCE or SCI review.",
}, ensure_ascii=False, indent=2))
raise SystemExit(1 if errors else 0)
