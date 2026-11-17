import copy
import hashlib
import json
import sys
from pathlib import Path

folder = Path(__file__).resolve().parent
repo = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
assert folder == repo / ".intentfold/tickets/STEMROBIN-181/tmp/d040-9p-n134-author"
sys.path.insert(0, str(repo / ".claude/skills/ld-s10y-lesson/tools"))
import edition
import mathcheck

card = "phy9-c2-s7-n134"
profile = edition.load(repo / ".claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json")
forbidden = profile["forbidden_terms"] + profile["forbidden_person_names"]
reports = []
errors = []
expected_refs = {"p0327#9"}
for page, last in ((328, 10), (329, 10), (330, 7)):
    expected_refs.update(f"p{page:04d}#{index}" for index in range(1, last + 1))

for language, root, work in (("zh", "root", "work"), ("en", "root-en", "work-en")):
    book = folder / root / "9p"
    raw_path = book / "lessons" / card / "lesson.json"
    exercise_path = raw_path.parent / "exercises.json"
    raw = edition.load(raw_path)
    raw_exercises = edition.load(exercise_path)
    directory = folder / work / "adapt/9p/modern-us-neutral/lessons" / card
    template = directory / "lesson.template.json"
    lesson = edition.load(template)
    exercises = edition.load(directory / "exercises.template.json")
    figures = edition.load(directory / "figures.template.json")
    language_errors = []
    assert raw["id"] == card and raw["number"] == "134"
    assert raw["start_page"] == 327 and raw["start_printed"] == 318
    assert lesson["schema"] == edition.LESSON_SCHEMA
    assert exercises["schema"] == edition.EXERCISES_SCHEMA
    assert figures["schema"] == edition.FIGURES_SCHEMA
    for document in (lesson, exercises, figures):
        assert document["status"] == "draft"
        assert document["edition"] == "modern-us-neutral"
    assert lesson["language"] == language
    assert figures["lesson"] == card and exercises["lesson"] == card
    assert lesson["source"]["data"] == raw
    assert exercises["source"]["data"] == raw_exercises
    language_errors += edition.validate_source(book, lesson["source"], raw_path, "lesson")
    language_errors += edition.validate_source(
        book, exercises["source"], exercise_path, "exercises")
    language_errors += edition.validate_identity_fields(
        raw, lesson, edition.IDENTITY_FIELDS, "lesson")
    assert len(raw["prose"]) == len(lesson["prose"]) == 23
    assert sum(block["kind"] == "p" for block in raw["prose"]) == 17
    assert sum(block["kind"] == "cap" for block in raw["prose"]) == 3
    assert raw["figures"] == [
        {"id": "fig-301", "label": "图 301", "page": 329},
        {"id": "fig-302", "label": "图 302", "page": 329},
        {"id": "fig-303", "label": "图 303", "page": 330},
    ]
    assert [item["id"] for item in figures["figures"]] == [
        "fig-301", "fig-302", "fig-303"]
    assert raw["exercise_count"] == raw_exercises["count"] == exercises["count"] == 0
    assert raw_exercises["exercises"] == exercises["exercises"] == []
    assert lesson["errata"] == []
    target_refs = [ref for block in raw["prose"] for ref in block["source_refs"]]
    assert len(target_refs) == len(set(target_refs)) == len(expected_refs)
    assert set(target_refs) == expected_refs
    assert not any(ref.startswith("p0331#") for ref in target_refs)
    authority = edition._authoritative_source_targets(book, raw, raw_exercises)
    assert set(authority) == expected_refs
    for index, block in enumerate(raw["prose"]):
        reconstructed = {
            ref for ref, bindings in authority.items()
            if f"lesson.prose[{index}]" in bindings
        }
        assert reconstructed == set(block["source_refs"])
    corrections, errata_errors = edition.validate_errata(
        book, raw, raw_exercises, lesson, exercises)
    language_errors += errata_errors
    assert not corrections
    normalized = copy.deepcopy(lesson)
    edition.normalize_lesson_layout(normalized)
    assert normalized == lesson, "Frozen template must already have native prose layout."
    text_blocks = []
    signatures = []
    for index, (source, modern) in enumerate(zip(raw["prose"], lesson["prose"])):
        assert modern["source_text"] == source["text"]
        language_errors += edition.validate_identity_fields(
            source, modern, ("kind", "id", "label", "printed_page", "source_refs"),
            f"{language}.prose[{index}]")
        language_errors += edition.validate_text(
            source["text"], modern["text"], modern["changes"], modern["numeric_changes"],
            f"{language}.prose[{index}]", forbidden, modern["historical_entities"])
        assert edition.math_signature(modern["text"]) == edition.math_signature(source["text"])
        assert edition.number_signature(modern["text"]) == edition.number_signature(source["text"])
        assert modern["numeric_changes"] == []
        assert "<span" not in modern["text"] and "<svg" not in modern["text"]
        assert not edition.CYRILLIC.search(modern["text"])
        signatures.append({
            "kind": modern["kind"], "source_refs": source["source_refs"],
            "math": edition.math_signature(modern["text"]),
            "non_math_numbers": edition.number_signature(modern["text"]),
            "numeric_changes": modern["numeric_changes"],
        })
        text_blocks.append({"id": str(index), "text": modern["text"]})
    flow, flow_errors = edition.prose_flow_contract(lesson["prose"], lesson["section_breaks"])
    language_errors += flow_errors
    language_errors += edition.validate_figure_references(
        lesson["prose"], exercises["exercises"], figures["figures"])
    shared_ids, shared_errors = edition.validate_shared_prose_figures(book, lesson["prose"])
    language_errors += shared_errors
    assert shared_ids == set()
    math_errors, warnings = mathcheck.collect_and_check(
        text_blocks, lambda block: [("text", block["text"])])
    language_errors += math_errors
    for figure in figures["figures"]:
        source_figure = next(item for item in raw["figures"] if item["id"] == figure["id"])
        assert figure["label"] == source_figure["label"]
        for source_binding in figure["source"].values():
            source_file = book / source_binding["path"]
            assert hashlib.sha256(source_file.read_bytes()).hexdigest() == source_binding["sha256"]
    reports.append({
        "language": language, "template": str(template),
        "template_sha256": hashlib.sha256(template.read_bytes()).hexdigest(),
        "objects": 23, "prose_objects": 17, "figure_objects": 3,
        "caption_objects": 3, "exercises": 0, "section_breaks": len(lesson["section_breaks"]),
        "flow": flow, "signatures": signatures, "errors": language_errors,
        "katex_warnings": warnings, "authoritative_refs_reconstructed": True,
    })
    errors += language_errors

print(json.dumps({
    "schema": "ld-s10y-lesson/bounded-text-check@1", "card": card,
    "status": "pass" if not errors else "fail", "languages": reports, "errors": errors,
    "scope": "Current source snapshots, native source-reference reconstruction, identity, text, formulas, numbers, figure references, source figure hashes, KaTeX syntax and prose flow only.",
    "adapt_finalize_run": False, "render_run": False, "images_opened": 0,
    "independent_science_approval": False, "independent_bilingual_approval": False,
    "modern_figure_approval": False,
}, ensure_ascii=False, indent=2))
raise SystemExit(1 if errors else 0)
