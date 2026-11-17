import hashlib
import json
import sys
from pathlib import Path

folder = Path(__file__).resolve().parent
repo = Path.cwd()
sys.path.insert(0, str(repo / ".claude/skills/ld-s10y-lesson/tools"))
import edition
import mathcheck

card = "phy10-c1-s4-n35"
relative = Path("adapt/10p/modern-us-neutral/lessons") / card
profile = edition.load(repo / ".claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json")
forbidden = profile["forbidden_terms"] + profile["forbidden_person_names"]
reports = []
errors = []
for language, root_name, work_name in (("zh", "root", "work"), ("en", "root-en", "work-en")):
    book = folder / root_name / "10p"
    raw_path = book / "lessons" / card / "lesson.json"
    exercises_path = raw_path.parent / "exercises.json"
    raw = edition.load(raw_path)
    exercises_raw = edition.load(exercises_path)
    template = folder / work_name / relative / "lesson.template.json"
    lesson = edition.load(template)
    exercises = edition.load(template.parent / "exercises.template.json")
    language_errors = edition.validate_source(book, lesson["source"], raw_path, "lesson")
    language_errors += edition.validate_source(
        book, exercises["source"], exercises_path, "exercises")
    assert lesson["source"]["data"] == raw
    assert lesson["language"] == language
    assert len(raw["prose"]) == len(lesson["prose"]) == 12
    assert raw["figures"] == [{"id": "fig-63", "label": "图 63", "page": 100}]
    assert exercises_raw["count"] == exercises["count"] == 0
    assert exercises_raw["exercises"] == exercises["exercises"] == []
    assert lesson["errata"] == []
    for field in edition.IDENTITY_FIELDS:
        assert lesson.get(field) == raw.get(field), field
    text_blocks = []
    signatures = []
    for index, (source, modern) in enumerate(zip(raw["prose"], lesson["prose"])):
        assert modern["source_text"] == source["text"]
        for field in ("kind", "id", "label", "printed_page", "source_refs"):
            assert modern.get(field) == source.get(field), (index, field)
        language_errors += edition.validate_text(
            source["text"], modern["text"], modern["changes"], modern["numeric_changes"],
            f"{language}.prose[{index}]", forbidden, modern["historical_entities"])
        if modern["kind"] == "p":
            assert "\n" in modern["text"]
        signatures.append({
            "source_refs": source["source_refs"],
            "math": edition.math_signature(modern["text"]),
            "non_math_numbers": edition.number_signature(modern["text"]),
            "numeric_changes": modern["numeric_changes"],
        })
        text_blocks.append({"id": str(index), "text": modern["text"]})
    flow, flow_errors = edition.prose_flow_contract(lesson["prose"], lesson["section_breaks"])
    language_errors += flow_errors
    math_errors, warnings = mathcheck.collect_and_check(
        text_blocks, lambda block: [("text", block["text"])])
    language_errors += math_errors
    reports.append({
        "language": language, "template": str(template),
        "template_sha256": hashlib.sha256(template.read_bytes()).hexdigest(),
        "prose_blocks": len(lesson["prose"]), "paragraphs": flow,
        "signatures": signatures, "errors": language_errors, "katex_warnings": warnings,
    })
    errors += language_errors
print(json.dumps({
    "schema": "ld-s10y-lesson/bounded-text-check@1", "card": card,
    "status": "pass" if not errors else "fail",
    "languages": reports, "errors": errors,
    "scope": "Source snapshots, identity, text, math signatures, numbers, KaTeX syntax and prose flow only.",
    "adapt_finalize_run": False, "render_run": False, "images_opened": 0,
    "independent_science_approval": False, "figure_approval": False,
}, ensure_ascii=False, indent=2))
raise SystemExit(1 if errors else 0)
