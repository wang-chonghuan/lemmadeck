import hashlib
import json
import re
import sys
from pathlib import Path

repo = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
folder = Path(__file__).resolve().parent
assert folder == repo / ".intentfold/tickets/STEMROBIN-181/tmp/d044-10p-n38-author"
assert Path.cwd() == repo
sys.path.insert(0, str(repo / ".claude/skills/ld-s10y-lesson/tools"))
import assemble
import edition
import mathcheck

card = "phy10-c1-s5-n38"
relative = Path("adapt/10p/modern-us-neutral/lessons") / card
profile = edition.load(repo / ".claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json")
forbidden = profile["forbidden_terms"] + profile["forbidden_person_names"]
authored = edition.load(folder / "texts.json")
label_map = dict(zip("абвгде", "abcdef"))
reference_pattern = re.compile(r"(?:图\s*|Figure\s+)(\d+)([a-fабвгде]?)")
reports = []
errors = []


def references(text):
    return [
        {"number": number, "panel": label_map.get(suffix, suffix)}
        for number, suffix in reference_pattern.findall(text)
    ]


def check(condition, message, target):
    if not condition:
        target.append(message)


for language in ("zh", "en"):
    book = folder / language / "root/10p"
    raw_path = book / "lessons" / card / "lesson.json"
    exercises_path = raw_path.parent / "exercises.json"
    template = folder / language / "work" / relative / "lesson.template.json"
    raw = edition.load(raw_path)
    exercises_raw = edition.load(exercises_path)
    lesson = edition.load(template)
    exercises = edition.load(template.parent / "exercises.template.json")
    figures = edition.load(template.parent / "figures.template.json")
    stage_errors = {
        "source": [], "identity": [], "native_text": [],
        "math": [], "katex": [], "flow": [], "author_reference_diagnostics": [],
    }
    stage_errors["source"] += edition.validate_source(book, lesson["source"], raw_path, "lesson")
    stage_errors["source"] += edition.validate_source(
        book, exercises["source"], exercises_path, "exercises")
    check(lesson["source"]["data"] == raw, "Incomplete raw source snapshot.", stage_errors["source"])
    check(lesson["language"] == language, "Incorrect language.", stage_errors["identity"])
    stage_errors["identity"] += edition.validate_identity_fields(
        raw, lesson, edition.IDENTITY_FIELDS, "lesson")
    check(raw["figures"] == lesson["figures"], "Raw figure identities changed.", stage_errors["identity"])
    check(len(raw["prose"]) == len(lesson["prose"]) == len(authored) == 13,
          "Expected exactly 13 raw prose objects.", stage_errors["identity"])
    check([item["id"] for item in figures["figures"]] == ["fig-69", "fig-70", "fig-71"],
          "Figure placeholder inventory changed.", stage_errors["identity"])
    check(exercises_raw["count"] == exercises["count"] == 0
          and exercises_raw["exercises"] == exercises["exercises"] == [],
          "Expected zero source and modern exercises.", stage_errors["identity"])
    check(lesson["errata"] == [], "Unexpected errata.", stage_errors["math"])

    # Reconstruct source joins without running assembly or writing source artifacts.
    stream = assemble.load_stream(book)
    merged, merge_warnings = assemble.merge_across_pages(stream)
    candidate = next(item for item in assemble.cut_lessons(merged) if item["number"] == "38")
    candidate["prose"], candidate["exercises"] = assemble.split_lesson(candidate, "lesson-group")
    reconstructed = [item.get("spans") or [item["ref"]] for item in candidate["prose"]]
    check(reconstructed == [item["source_refs"] for item in raw["prose"]],
          "Source page-stream joins do not match the raw lesson.", stage_errors["source"])
    check(raw["prose"][0]["source_refs"] == ["p0107#5"]
          and raw["prose"][-1]["source_refs"] == ["p0110#2"],
          "Source lesson endpoints changed.", stage_errors["source"])
    check(not any("p0110#3" in item["source_refs"] for item in raw["prose"]),
          "Next lesson heading leaked into n38.", stage_errors["source"])

    text_blocks = []
    signatures = []
    for index, (source, modern, author) in enumerate(zip(raw["prose"], lesson["prose"], authored)):
        label = f"{language}.prose[{index}]"
        check(modern["source_text"] == source["text"], f"{label}: source_text changed.",
              stage_errors["source"])
        stage_errors["identity"] += edition.validate_identity_fields(
            source, modern, ("kind", "id", "label", "printed_page", "source_refs"), label)
        check(modern["source_refs"] == author["source_refs"],
              f"{label}: author binding changed.", stage_errors["source"])
        native_errors = edition.validate_text(
            source["text"], modern["text"], modern["changes"], modern["numeric_changes"],
            label, forbidden, modern["historical_entities"],
            notation_changes=modern.get("notation_changes"))
        # Keep every native failure. Diagnostics below never alter the gate result.
        stage_errors["native_text"] += native_errors
        source_math = edition.math_signature(source["text"])
        modern_math = edition.math_signature(modern["text"])
        check(source_math == modern_math, f"{label}: math signature changed.", stage_errors["math"])
        check(modern["numeric_changes"] == [], f"{label}: unexpected numeric_changes.",
              stage_errors["native_text"])
        check(not re.search(r"<(?:span|img|svg)\b", modern["text"], re.I),
              f"{label}: hand-authored markup.", stage_errors["flow"])
        if source["kind"] == "fig":
            check(modern["text"] == "", f"{label}: figure must remain an empty placeholder.",
                  stage_errors["identity"])
        if source["kind"] == "p":
            check(modern["text"] == edition.normalize_prose_layout(modern["text"]),
                  f"{label}: not native-normalized.", stage_errors["flow"])
        if language == "en":
            check(not re.search(r"[\u3400-\u4dbf\u4e00-\u9fff]", modern["text"]),
                  f"{label}: untranslated Chinese text.", stage_errors["identity"])
        source_references = references(source["text"])
        modern_references = references(modern["text"])
        check(source_references == modern_references, f"{label}: figure references changed.",
              stage_errors["author_reference_diagnostics"])
        source_quantities = edition.number_signature(reference_pattern.sub("", source["text"]))
        modern_quantities = edition.number_signature(reference_pattern.sub("", modern["text"]))
        check(source_quantities == modern_quantities, f"{label}: non-reference quantity changed.",
              stage_errors["author_reference_diagnostics"])
        declarations = author.get("subfigure_label_changes", [])
        check(modern.get("subfigure_label_changes", []) == declarations,
              f"{label}: label declarations differ from authored text.",
              stage_errors["author_reference_diagnostics"])
        for change in declarations:
            check(label_map.get(change["from"]) == change["to"]
                  and change["from"] in source["text"] and change["to"] in modern["text"]
                  and "notation" in modern["changes"],
                  f"{label}: invalid source-bound subfigure mapping.",
                  stage_errors["author_reference_diagnostics"])
        signatures.append({
            "source_refs": source["source_refs"],
            "source_math": source_math, "modern_math": modern_math,
            "source_native_number_tokens": edition.number_signature(source["text"]),
            "modern_native_number_tokens": edition.number_signature(modern["text"]),
            "source_figure_references": source_references,
            "modern_figure_references": modern_references,
            "source_non_figure_numbers": source_quantities,
            "modern_non_figure_numbers": modern_quantities,
            "native_text_errors": native_errors,
            "numeric_changes": modern["numeric_changes"],
            "subfigure_label_changes": declarations,
        })
        text_blocks.append({"id": label, "text": modern["text"]})
    flow, flow_errors = edition.prose_flow_contract(lesson["prose"], lesson["section_breaks"])
    stage_errors["flow"] += flow_errors
    check(len(lesson["section_breaks"]) == 3
          and all(isinstance(item, dict) and set(item) == {"before", "after"}
                  for item in lesson["section_breaks"]),
          "Expected three native-flow boundary objects, not integer indices.", stage_errors["flow"])
    paragraph_checks = []
    for paragraph in flow.get("paragraphs", []):
        lines = paragraph["text"].splitlines()
        complete = all(line.rstrip().endswith(("。", "！", "？", ".", "!", "?")) for line in lines)
        check(2 <= len(lines) <= 3 and complete,
              f"{language}: paragraph {paragraph['index']} must contain 2-3 complete sentences.",
              stage_errors["flow"])
        paragraph_checks.append({
            "source_refs": lesson["prose"][paragraph["blockIndex"]]["source_refs"],
            "paragraphInBlock": paragraph["paragraphInBlock"],
            "sentences": len(lines), "complete_sentences": complete,
        })
    math_errors, warnings = mathcheck.collect_and_check(
        text_blocks, lambda block: [("text", block["text"])])
    stage_errors["katex"] += math_errors
    language_errors = [error for values in stage_errors.values() for error in values]
    errors += language_errors
    reports.append({
        "language": language, "template": str(template),
        "template_sha256": hashlib.sha256(template.read_bytes()).hexdigest(),
        "raw_prose_objects": 13, "prose_objects": 7, "figure_objects": 3, "caption_objects": 3,
        "source_merge_warnings": merge_warnings,
        "paragraphs": flow, "paragraph_checks": paragraph_checks,
        "signatures": signatures, "stage_errors": stage_errors,
        "stage_statuses": {name: "fail" if values else "pass" for name, values in stage_errors.items()},
        "errors": language_errors, "katex_warnings": warnings,
    })

print(json.dumps({
    "schema": "ld-s10y-lesson/bounded-text-check@1",
    "card": card, "status": "fail" if errors else "pass",
    "native_text_status": "fail" if any(item["stage_errors"]["native_text"] for item in reports) else "pass",
    "languages": reports, "errors": errors,
    "number_signature_diagnosis": {
        "pattern": edition.NUMBER.pattern,
        "examples": [
            {"text": text, "tokens": edition.number_signature(text)}
            for text in ("图70", "Figure 70", "图71а", "Figure 71a")
        ],
        "cause": "Python Unicode word boundaries treat Chinese letters and Latin panel suffixes as word characters. Adjacent digits are excluded, but the same figure number surrounded by English spaces is included.",
        "gate_errors_filtered": False,
        "numeric_changes_fabricated": False,
        "source_rewritten": False,
        "typography_workaround": False,
        "diagnostic_reference_comparison_is_not_a_native_pass": True,
    },
    "scope": "Native source/identity/text/math/numbers/KaTeX/prose-flow subset plus author-only reference diagnostics. Every native error contributes to FAIL; no image/spec/render/publication checks.",
    "adapt_finalize_run": False, "render_run": False, "images_opened": 0,
    "independent_science_approval": False, "bilingual_approval": False, "figure_approval": False,
}, ensure_ascii=False, indent=2))
raise SystemExit(1 if errors else 0)
