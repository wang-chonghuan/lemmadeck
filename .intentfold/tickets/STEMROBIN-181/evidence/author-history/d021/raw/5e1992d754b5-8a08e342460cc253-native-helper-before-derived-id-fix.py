"""Bounded native metadata, assembly, and text functions; never image gates."""
import json
import sys
from pathlib import Path

sys.path.insert(0, ".claude/skills/ld-s10y-lesson/tools")
import assemble
import blocks
import edition
import p2c

payload = json.load(sys.stdin)
mode = payload["mode"]
book = Path(payload["book"])

if mode == "metadata":
    meta, parsed = blocks.parse(payload["md"])
    assert parsed == payload["page"]["blocks"]
    assert not meta["errata"]
    meta["errata"] = [payload["erratum"]]
    errors = p2c._validate_page_errata(meta, parsed, 207)
    assert not errors, errors
    md = blocks.dump(meta, parsed, 207)
    assert md.split("---", 2)[2] == payload["md"].split("---", 2)[2]
    page = {"meta": meta, "blocks": parsed}
    audit = payload["audit"]
    assert audit["errors"] == []
    audit["errata"] = len(meta["errata"])
    print(json.dumps({"md": md, "page": page, "audit": audit, "errors": errors},
                     ensure_ascii=False))
elif mode == "assembly":
    stream = assemble.load_stream(book)
    merged, messages = assemble.merge_across_pages(stream)
    candidates = assemble.cut_lessons(merged)
    numbering = payload["index"]["exercise_numbering"]
    for candidate in candidates:
        candidate["prose"], candidate["exercises"] = assemble.split_lesson(candidate, numbering)
    figure_errors, figure_messages = assemble.claim_figures(candidates, merged)
    assert not figure_errors, figure_errors
    toc_messages = assemble.check_toc(
        candidates, Path(payload["toc"]), "9p",
        {item["printed_page"] for item in stream if item.get("printed_page") is not None})
    matches = [item for item in candidates if item.get("card_id") == "phy9-c2-s2-n84"]
    assert len(matches) == 1
    candidate = matches[0]
    raw = payload["lesson"]
    for field in ("card_id", "chapter", "section", "number", "title", "printed_title",
                  "start_page", "start_printed", "figures"):
        assert candidate[field] == raw[field], field
    prose = [{"kind": item["kind"], "text": blocks.text_of(item), "id": item.get("id"),
              "label": item.get("label"), "printed_page": item.get("printed_page"),
              "source_refs": item.get("spans") or [item["ref"]]}
             for item in candidate["prose"]]
    assert prose == raw["prose"]
    rebuilt_exercises = {"lesson": raw["id"], "count": len(candidate["exercises"]),
                         "exercises": candidate["exercises"]}
    assert assemble.can_reuse_exercises(payload["exercises"], rebuilt_exercises)
    records = edition.source_errata(book, raw, payload["exercises"])
    assert len(records) == 1 and records[0]["target"] == "exercises[0]"
    assert records[0]["source"]["block"] == "p0207#8"
    print(json.dumps({"records": records, "proseBlocks": len(prose),
                     "tasks": len(candidate["exercises"]),
                     "rawLessonAndExerciseWritesRequired": False,
                     "functions": ["assemble.load_stream", "assemble.merge_across_pages",
                                   "assemble.cut_lessons", "assemble.split_lesson",
                                   "assemble.claim_figures", "assemble.check_toc",
                                   "blocks.text_of", "assemble.can_reuse_exercises",
                                   "edition.source_errata"],
                     "diagnosticsNotGateResults": messages + figure_messages + toc_messages},
                     ensure_ascii=False))
elif mode == "normalize":
    lesson, exercises = payload["lesson"], payload["exercises"]
    edition.normalize_lesson_layout(lesson)
    edition.normalize_exercise_layout(exercises)
    print(json.dumps({"lesson": lesson, "exercises": exercises}, ensure_ascii=False))
elif mode == "validate-text":
    lesson, exercises = payload["lesson"], payload["exercises"]
    raw_lesson, raw_exercises = lesson["source"]["data"], exercises["source"]["data"]
    profile = payload["profile"]
    forbidden = profile["forbidden_terms"] + profile["forbidden_person_names"]
    errors = []
    errors += edition.validate_source(book, lesson["source"],
                                      book / lesson["source"]["path"], "lesson")
    errors += edition.validate_source(book, exercises["source"],
                                      book / exercises["source"]["path"], "exercises")
    corrections, errata_errors = edition.validate_errata(
        book, raw_lesson, raw_exercises, lesson, exercises)
    errors += errata_errors
    for field in edition.IDENTITY_FIELDS:
        assert lesson.get(field) == raw_lesson.get(field), field
    assert len(lesson["prose"]) == len(raw_lesson["prose"])
    assert exercises["count"] == raw_exercises["count"]
    assert len(exercises["exercises"]) == len(raw_exercises["exercises"])
    for collection, originals, fields, prefix in (
        (lesson["prose"], raw_lesson["prose"],
         ("kind", "id", "label", "printed_page", "source_refs"), "lesson.prose"),
        (exercises["exercises"], raw_exercises["exercises"],
         ("number", "source_number", "group", "group_id", "pages", "figure_refs", "figures"),
         "exercises"),
    ):
        for index, (modern, original) in enumerate(zip(collection, originals)):
            label = f"{prefix}[{index}]"
            assert modern["source_text"] == original["text"], label
            for field in fields:
                assert modern.get(field) == original.get(field), (label, field)
            errors += edition.validate_text(
                original["text"], modern["text"], modern["changes"],
                modern["numeric_changes"], label, forbidden,
                modern["historical_entities"], corrections.get(label))
    print(json.dumps({"errors": errors, "corrections": corrections,
                     "sourceProseBlocks": len(raw_lesson["prose"]),
                     "sourceTasks": raw_exercises["count"],
                     "mathAtoms": sum(len(edition.math_signature(item["text"]))
                                      for item in lesson["prose"] + exercises["exercises"]),
                     "nonMathNumbers": sum(len(edition.number_signature(item["text"]))
                                           for item in lesson["prose"] + exercises["exercises"]),
                     "scope": "Native source, identity, references, math atoms, numeric declarations, and culture checks only. No SCI, figures, or prose-flow rerun."},
                     ensure_ascii=False))
else:
    raise ValueError(mode)
