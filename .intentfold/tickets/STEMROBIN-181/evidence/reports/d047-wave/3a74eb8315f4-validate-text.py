import copy
import hashlib
import json
import re
import sys
from pathlib import Path

repo = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
folder = Path(__file__).resolve().parent
assert folder == repo / ".intentfold/tickets/STEMROBIN-181/tmp/d044-10p-n40-author"
assert Path.cwd() == repo
sys.path.insert(0, str(repo / ".claude/skills/ld-s10y-lesson/tools"))
import assemble
import edition
import mathcheck

card = "phy10-c1-s5-n40"
relative = Path("work/adapt/10p/modern-us-neutral/lessons") / card
figure_reference = re.compile(r"(?:\u56fe\s*|Figure\s+)(\d+)")
section_reference = re.compile(r"(?:\u7b2c\s*|Section\s+)(\d+)(?:\s*\u8282)?")
profile = edition.load(repo / ".claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json")
forbidden = profile["forbidden_terms"] + profile["forbidden_person_names"]


def sentence_lines(text):
    return [line.strip() for line in text.splitlines() if line.strip()]


def complete_line(line):
    return bool(re.search(r"[.!?\u3002\uff01\uff1f](?:\*\*)?$", line))


if sys.argv[1:2] == ["--normalize"]:
    target = Path(sys.argv[2]).resolve()
    assert target.is_relative_to(folder)
    before = edition.load(target)
    normalized = copy.deepcopy(before)
    edition.normalize_lesson_layout(normalized)
    print(json.dumps({
        "native_api": "edition.normalize_lesson_layout",
        "document": normalized,
        "changes": [
            {
                "index": index,
                "source_refs": block["source_refs"],
                "before": before["prose"][index]["text"],
                "after": block["text"],
                "incomplete_normalized_lines": [
                    line for line in sentence_lines(block["text"]) if not complete_line(line)
                ],
            }
            for index, block in enumerate(normalized["prose"])
            if block["kind"] == "p" and (
                block["text"] != before["prose"][index]["text"]
                or any(not complete_line(line) for line in sentence_lines(block["text"]))
            )
        ],
    }, ensure_ascii=False, indent=2))
    raise SystemExit(0)

reports = []
author_errors = []
native_errors = []
for language in ("zh", "en"):
    book = folder / language / "root/10p"
    raw_path = book / "lessons" / card / "lesson.json"
    exercises_path = raw_path.parent / "exercises.json"
    template = folder / language / relative / "lesson.template.json"
    raw = edition.load(raw_path)
    raw_exercises = edition.load(exercises_path)
    lesson = edition.load(template)
    exercises = edition.load(template.parent / "exercises.template.json")
    figures = edition.load(template.parent / "figures.template.json")
    language_errors = edition.validate_source(book, lesson["source"], raw_path, "lesson")
    language_errors += edition.validate_source(
        book, exercises["source"], exercises_path, "exercises")
    assert lesson["source"]["data"] == raw
    assert exercises["source"]["data"] == raw_exercises
    assert lesson["language"] == language
    assert len(raw["prose"]) == len(lesson["prose"]) == 22
    assert [item["kind"] for item in raw["prose"]].count("p") == 16
    assert [item["kind"] for item in raw["prose"]].count("fig") == 3
    assert [item["kind"] for item in raw["prose"]].count("cap") == 3
    assert raw["number"] == "40"
    assert raw["start_page"] == 112 and raw["start_printed"] == 102
    assert [item["id"] for item in raw["figures"]] == ["fig-73", "fig-74", "fig-75"]
    assert lesson["figures"] == raw["figures"]
    assert [item["id"] for item in figures["figures"]] == [
        "fig-73", "fig-74", "fig-75", "fig-64",
    ]
    assert raw_exercises["count"] == exercises["count"] == lesson["exercise_count"] == 0
    assert raw_exercises["exercises"] == exercises["exercises"] == []
    assert lesson["errata"] == []
    for field in edition.IDENTITY_FIELDS:
        assert lesson.get(field) == raw.get(field), field

    # Reuse native assembly in memory to check joins, footnote identity, and the n41 boundary.
    stream = assemble.load_stream(book)
    merged, merge_warnings = assemble.merge_across_pages(stream)
    candidate = next(item for item in assemble.cut_lessons(merged) if item["number"] == "40")
    candidate["prose"], candidate["exercises"] = assemble.split_lesson(candidate, "lesson")
    assert [item.get("spans") or [item["ref"]] for item in candidate["prose"]] == [
        item["source_refs"] for item in raw["prose"]
    ]
    assert candidate["exercises"] == []
    assert raw["prose"][-1]["source_refs"] == ["p0115#2"]
    assert raw["prose"][19]["label"] == "footnote"
    assert raw["prose"][19]["source_refs"] == ["p0114#10"]
    assert not any(
        ref.startswith("p0115#") and ref not in {"p0115#1", "p0115#2"}
        for block in raw["prose"] for ref in block["source_refs"]
    )
    corrections, errata_errors = edition.validate_errata(
        book, raw, raw_exercises, lesson, exercises)
    language_errors += errata_errors
    assert corrections == {}
    shared_ids, shared_errors = edition.validate_shared_prose_figures(book, lesson["prose"])
    language_errors += shared_errors
    assert shared_ids == {"fig-64"}
    language_errors += edition.validate_figure_references(
        lesson["prose"], exercises["exercises"], figures["figures"])
    assert lesson["prose"][3]["figures"] == [{
        "id": "fig-64", "label": "Figure 64" if language == "en" else "\u56fe 64",
    }]
    assert all(not item.get("figures") for i, item in enumerate(lesson["prose"]) if i != 3)

    signatures = []
    text_blocks = []
    language_native_errors = []
    for index, (source, modern) in enumerate(zip(raw["prose"], lesson["prose"])):
        assert modern["source_text"] == source["text"]
        for field in ("kind", "id", "label", "printed_page", "source_refs"):
            assert modern.get(field) == source.get(field), (index, field)
        current_native = edition.validate_text(
            source["text"], modern["text"], modern["changes"], modern["numeric_changes"],
            f"{language}.prose[{index}]", forbidden, modern["historical_entities"])
        language_native_errors += current_native
        assert edition.math_signature(source["text"]) == edition.math_signature(modern["text"]) == []
        assert figure_reference.findall(source["text"]) == figure_reference.findall(modern["text"])
        assert section_reference.findall(source["text"]) == section_reference.findall(modern["text"])
        source_quantities = edition.number_signature(
            section_reference.sub("", figure_reference.sub("", source["text"])))
        modern_quantities = edition.number_signature(
            section_reference.sub("", figure_reference.sub("", modern["text"])))
        assert source_quantities == modern_quantities == []
        assert modern["numeric_changes"] == []
        assert modern["historical_entities"] == []
        assert "<" not in modern["text"] and "$" not in modern["text"]
        if modern["kind"] == "fig":
            assert modern["text"] == ""
        elif modern["kind"] == "p":
            if edition.normalize_prose_layout(modern["text"]) != modern["text"]:
                language_errors.append(f"{language}.prose[{index}]: native normalization is not idempotent")
            for line in sentence_lines(modern["text"]):
                if not complete_line(line):
                    language_errors.append(
                        f"{language}.prose[{index}]: line is not a full sentence: {line}")
        if language == "en":
            assert not re.search(r"[\u3400-\u9fff]", modern["text"])
        signatures.append({
            "source_refs": source["source_refs"],
            "math": edition.math_signature(modern["text"]),
            "source_native_number_tokens": edition.number_signature(source["text"]),
            "modern_native_number_tokens": edition.number_signature(modern["text"]),
            "source_figure_references": figure_reference.findall(source["text"]),
            "modern_figure_references": figure_reference.findall(modern["text"]),
            "source_section_references": section_reference.findall(source["text"]),
            "modern_section_references": section_reference.findall(modern["text"]),
            "non_reference_numbers": modern_quantities,
            "numeric_changes": modern["numeric_changes"],
            "native_text_errors": current_native,
        })
        text_blocks.append({"id": str(index), "text": modern["text"]})
    assert "\u2460" in lesson["prose"][18]["text"]
    assert lesson["prose"][19]["text"].startswith("\u2460")
    flow, flow_errors = edition.prose_flow_contract(lesson["prose"], lesson["section_breaks"])
    language_errors += flow_errors
    assert len(lesson["section_breaks"]) == len(flow.get("resolvedBreaks", [])) == 7
    sentence_groups = [
        {
            "paragraph_index": paragraph["index"],
            "block_index": paragraph["blockIndex"],
            "sentence_count": len(sentence_lines(paragraph["text"])),
            "all_lines_complete": all(complete_line(line) for line in sentence_lines(paragraph["text"])),
        }
        for paragraph in flow.get("paragraphs", [])
    ]
    assert all(1 <= item["sentence_count"] <= 3 for item in sentence_groups)
    assert all(item["all_lines_complete"] for item in sentence_groups)
    math_errors, warnings = mathcheck.collect_and_check(
        text_blocks, lambda block: [("text", block["text"])])
    language_errors += math_errors
    # Native errors remain unfiltered, including unchanged reference tokenization failures.
    native_errors += language_native_errors
    author_errors += language_errors
    reports.append({
        "language": language, "template": str(template),
        "template_sha256": hashlib.sha256(template.read_bytes()).hexdigest(),
        "source_snapshot_identity": "pass",
        "raw_objects": 22, "prose_objects": 16, "figure_objects": 3, "caption_objects": 3,
        "explanatory_footnotes": 1, "tasks": 0,
        "native_shared_prose_figures": {"ids": sorted(shared_ids), "errors": shared_errors},
        "native_normalization": "idempotent",
        "native_flow": flow, "sentence_groups": sentence_groups,
        "signatures": signatures, "author_errors": language_errors,
        "native_text_errors": language_native_errors, "katex_errors": math_errors,
        "katex_warnings": warnings, "source_stream_warnings": merge_warnings,
    })

print(json.dumps({
    "schema": "ld-s10y-lesson/bounded-text-check@1", "card": card,
    "status": "fail" if native_errors or author_errors else "pass",
    "author_integrity_status": "fail" if author_errors else "pass",
    "native_text_status": "fail" if native_errors else "pass",
    "languages": reports, "author_errors": author_errors,
    "native_text_errors": native_errors,
    "native_text_limitation": (
        "The installed number_signature treats digits adjacent to Chinese word characters "
        "(including \u56fe64 and \u7b2c11\u8282) differently from the same unchanged numbers in "
        "Figure 64 and Section 11. All native errors are retained. Exact ordered figure/section "
        "references and non-reference quantities are checked separately, not used to override "
        "native failure. No false numeric_changes or typography workaround is declared."
    ),
    "scope": "Native source, identity, errata, text, math/number signatures, KaTeX, normalization, prose-flow and shared-prose binding checks only; no figure pixels or full figure gates.",
    "adapt_finalize_run": False, "render_run": False, "images_opened": 0,
    "independent_science_approval": False, "bilingual_approval": False, "figure_approval": False,
}, ensure_ascii=False, indent=2))
raise SystemExit(1 if native_errors or author_errors else 0)
