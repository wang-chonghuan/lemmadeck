import hashlib
import json
import sys
from pathlib import Path

repo = Path.cwd()
folder = Path(__file__).resolve().parent
sys.path.insert(0, str(repo / ".claude/skills/ld-s10y-lesson/tools"))
import edition
import mathcheck

card = "phy10-c1-s5-n39"
profile = edition.load(repo / ".claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json")
errors = []
reports = []
for language in ("zh", "en"):
    book = folder / language / "root/10p"
    directory = folder / language / "work/adapt/10p/modern-us-neutral/lessons" / card
    lesson_path = directory / "lesson.template.json"
    lesson = edition.load(lesson_path)
    exercises = edition.load(directory / "exercises.template.json")
    raw = edition.load(book / "lessons" / card / "lesson.json")
    raw_exercises = edition.load(book / "lessons" / card / "exercises.json")
    local_errors = edition.validate_source(book, lesson["source"],
                                          book / "lessons" / card / "lesson.json", "lesson")
    local_errors += edition.validate_source(
        book, exercises["source"], book / "lessons" / card / "exercises.json", "exercises")
    assert lesson["source"]["data"] == raw
    assert exercises["source"]["data"] == raw_exercises
    assert lesson["language"] == language
    assert len(lesson["prose"]) == len(raw["prose"]) == 12
    assert exercises["count"] == raw_exercises["count"] == 6
    for field in edition.IDENTITY_FIELDS:
        assert lesson.get(field) == raw.get(field), field
    text_blocks = []
    signatures = []
    for category, current, original in (
        ("prose", lesson["prose"], raw["prose"]),
        ("exercises", exercises["exercises"], raw_exercises["exercises"]),
    ):
        for index, (source, modern) in enumerate(zip(original, current)):
            assert modern["source_text"] == source["text"]
            fields = ("kind", "id", "label", "printed_page", "source_refs") if category == "prose" else (
                "number", "source_number", "group", "group_id", "pages", "figure_refs", "figures")
            for field in fields:
                assert modern.get(field) == source.get(field), (category, index, field)
            local_errors += edition.validate_text(
                source["text"], modern["text"], modern["changes"], modern["numeric_changes"],
                f"{language}.{category}[{index}]",
                profile["forbidden_terms"] + profile["forbidden_person_names"],
                modern.get("historical_entities"))
            text_blocks.append({"id": f"{category}[{index}]", "text": modern["text"]})
            signatures.append({
                "block": f"{category}[{index}]",
                "sourceNumbers": edition.number_signature(source["text"]),
                "modernNumbers": edition.number_signature(modern["text"]),
                "sourceMath": edition.math_signature(source["text"]),
                "modernMath": edition.math_signature(modern["text"]),
                "numeric_changes": modern["numeric_changes"],
            })
    shared, shared_errors = edition.validate_shared_prose_figures(book, lesson["prose"])
    assert shared == {"fig-70", "fig-71"}
    local_errors += shared_errors
    flow, flow_errors = edition.prose_flow_contract(lesson["prose"], lesson["section_breaks"])
    local_errors += flow_errors
    math_errors, warnings = mathcheck.collect_and_check(text_blocks, lambda row: [("text", row["text"])])
    local_errors += math_errors
    reports.append({
        "language": language, "template": str(lesson_path),
        "template_sha256": hashlib.sha256(lesson_path.read_bytes()).hexdigest(),
        "paragraphs": flow, "signatures": signatures, "errors": local_errors,
        "katex_warnings": warnings,
    })
    errors += local_errors
print(json.dumps({
    "ticket": "STEMROBIN-181", "card": card, "status": "pass" if not errors else "fail",
    "languages": reports, "errors": errors, "imagesOpened": 0, "independentSCI": False,
    "nativeFinalizeRun": False, "renderRun": False, "fullCardApproval": False,
}, ensure_ascii=False, indent=2))
raise SystemExit(1 if errors else 0)
