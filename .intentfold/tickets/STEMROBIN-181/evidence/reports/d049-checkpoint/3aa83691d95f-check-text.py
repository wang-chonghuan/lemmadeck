import hashlib
import json
import re
import sys
from pathlib import Path

repo = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
folder = Path(__file__).resolve().parent
assert folder == repo / ".intentfold/tickets/STEMROBIN-181/tmp/d049-10p-n43-author"
assert Path.cwd() == repo
assert len(sys.argv) == 2 and sys.argv[1] in ("en", "zh")
language = sys.argv[1]
sys.path.insert(0, str(repo / ".claude/skills/ld-s10y-lesson/tools"))
import assemble
import edition
import mathcheck

card = "phy10-c1-s5-n43"
relative = Path("adapt/10p/modern-us-neutral/lessons") / card
profile = edition.load(repo / ".claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json")
forbidden = profile["forbidden_terms"] + profile["forbidden_person_names"]
authored = edition.load(folder / "texts.json")
reference_pattern = re.compile(r"(?:图\s*|Figures?\s+)(\d+)(?!\d)", re.I)
quantity_pattern = re.compile(r"(?<![0-9.])-?[0-9]+(?:\.[0-9]+)?(?![0-9.])")
stage_errors = {
    "source": [], "identity": [], "native_text": [],
    "math": [], "katex": [], "flow": [], "author_reference_diagnostics": [],
}


def check(condition, message, target):
    if not condition:
        target.append(message)


def references(text):
    return reference_pattern.findall(text)


def quantities(text):
    without_math = edition.MATH.sub("", text)
    without_references = edition.SECTION_REFERENCE.sub(
        "", edition.FIGURE_REFERENCE.sub("", without_math))
    return quantity_pattern.findall(without_references)


book = folder / language / "root/10p"
raw_path = book / "lessons" / card / "lesson.json"
exercises_path = raw_path.parent / "exercises.json"
template = folder / "native" / language / "lesson.template.json"
raw = edition.load(raw_path)
exercises_raw = edition.load(exercises_path)
lesson = edition.load(template)
exercises = edition.load(template.parent / "exercises.template.json")
figures = edition.load(template.parent / "figures.template.json")
stage_errors["source"] += edition.validate_source(book, lesson["source"], raw_path, "lesson")
stage_errors["source"] += edition.validate_source(
    book, exercises["source"], exercises_path, "exercises")
check(lesson["source"]["data"] == raw, "Incomplete raw source snapshot.", stage_errors["source"])
check(lesson["language"] == language, "Incorrect language.", stage_errors["identity"])
stage_errors["identity"] += edition.validate_identity_fields(
    raw, lesson, edition.IDENTITY_FIELDS, "lesson")
check(raw["figures"] == lesson["figures"], "Raw figure identities changed.", stage_errors["identity"])
check(len(raw["prose"]) == len(lesson["prose"]) == len(authored) == 14,
      "Expected exactly 14 raw prose objects.", stage_errors["identity"])
check([item["id"] for item in figures["figures"]] == ["fig-81", "fig-82"],
      "Figure placeholder inventory changed.", stage_errors["identity"])
check(exercises_raw["count"] == exercises["count"] == 0
      and exercises_raw["exercises"] == exercises["exercises"] == [],
      "Expected zero source and modern exercises.", stage_errors["identity"])
check(lesson["errata"] == [], "Unexpected errata.", stage_errors["math"])

# Reconstruct source joins read-only, without invoking assembly or source finalization.
stream = assemble.load_stream(book)
merged, merge_warnings = assemble.merge_across_pages(stream)
candidate = next(item for item in assemble.cut_lessons(merged) if item["number"] == "43")
candidate["prose"], candidate["exercises"] = assemble.split_lesson(candidate, "lesson-group")
reconstructed = [item.get("spans") or [item["ref"]] for item in candidate["prose"]]
check(reconstructed == [item["source_refs"] for item in raw["prose"]],
      "Source page-stream joins do not match the raw lesson.", stage_errors["source"])
check(raw["prose"][0]["source_refs"] == ["p0120#4"]
      and raw["prose"][-1]["source_refs"] == ["p0122#2"],
      "Source lesson endpoints changed.", stage_errors["source"])
check(not any("p0122#3" in item["source_refs"] for item in raw["prose"]),
      "Next lesson heading leaked into n43.", stage_errors["source"])
check(candidate["exercises"] == [], "Unexpected reconstructed tasks.", stage_errors["source"])

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
    expected_text = edition.normalize_prose_layout(author[language]) if source["kind"] == "p" \
        else author[language]
    check(modern["text"] == expected_text, f"{label}: differs from authored text.",
          stage_errors["identity"])
    native_errors = edition.validate_text(
        source["text"], modern["text"], modern["changes"], modern["numeric_changes"],
        label, forbidden, modern["historical_entities"],
        notation_changes=modern.get("notation_changes"))
    # Diagnostics never filter or replace a native failure.
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
    source_quantities = quantities(source["text"])
    modern_quantities = quantities(modern["text"])
    check(source_quantities == modern_quantities, f"{label}: non-reference quantity changed.",
          stage_errors["author_reference_diagnostics"])
    source_native_quantities, source_native_refs = edition.prose_number_signature(source["text"])
    modern_native_quantities, modern_native_refs = edition.prose_number_signature(modern["text"])
    signatures.append({
        "source_refs": source["source_refs"],
        "source_math": source_math, "modern_math": modern_math,
        "source_native_number_tokens": edition.number_signature(source["text"]),
        "modern_native_number_tokens": edition.number_signature(modern["text"]),
        "source_native_quantities": source_native_quantities,
        "modern_native_quantities": modern_native_quantities,
        "source_native_references": {key: sorted(value) for key, value in source_native_refs.items()},
        "modern_native_references": {key: sorted(value) for key, value in modern_native_refs.items()},
        "source_figure_references": source_references,
        "modern_figure_references": modern_references,
        "source_non_reference_numbers": source_quantities,
        "modern_non_reference_numbers": modern_quantities,
        "native_text_errors": native_errors,
        "numeric_changes": modern["numeric_changes"],
    })
    text_blocks.append({"id": label, "text": modern["text"]})

flow, flow_errors = edition.prose_flow_contract(lesson["prose"], lesson["section_breaks"])
stage_errors["flow"] += flow_errors
check(len(lesson["section_breaks"]) == 4
      and all(isinstance(item, dict) and set(item) == {"before", "after"}
              for item in lesson["section_breaks"]),
      "Expected four native-flow boundary objects, not integer indices.", stage_errors["flow"])
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
errors = [error for values in stage_errors.values() for error in values]
print(json.dumps({
    "schema": "ld-s10y-lesson/bounded-text-check@1",
    "card": card, "language": language, "status": "fail" if errors else "pass",
    "native_text_status": "fail" if stage_errors["native_text"] else "pass",
    "template": str(template),
    "template_sha256": hashlib.sha256(template.read_bytes()).hexdigest(),
    "raw_prose_objects": 14, "prose_objects": 10, "figure_objects": 2, "caption_objects": 2,
    "source_merge_warnings": merge_warnings,
    "paragraphs": flow, "paragraph_checks": paragraph_checks,
    "signatures": signatures, "stage_errors": stage_errors,
    "stage_statuses": {name: "fail" if values else "pass" for name, values in stage_errors.items()},
    "errors": errors, "katex_warnings": warnings,
    "number_signature_diagnosis": {
        "pattern": edition.NUMBER.pattern,
        "examples": [
            {
                "text": text,
                "legacy_tokens": edition.number_signature(text),
                "native_quantities": edition.prose_number_signature(text)[0],
                "diagnostic_quantities": quantities(text),
            }
            for text in ("图81", "Figure 81", "第43节", "Section 43", "3500赫兹", "3500 Hz")
        ],
        "gate_errors_filtered": False,
        "numeric_changes_fabricated": False,
        "source_rewritten": False,
        "typography_workaround": False,
        "diagnostic_reference_comparison_is_not_a_native_pass": True,
    },
    "scope": "Native source/identity/text/math/numbers/KaTeX/prose-flow subset plus author-only reference and digit diagnostics. Every native error contributes to FAIL; no image/spec/render/publication checks.",
    "adapt_finalize_run": False, "render_run": False, "images_opened": 0,
    "independent_science_approval": False, "bilingual_approval": False, "figure_approval": False,
}, ensure_ascii=False, indent=2))
raise SystemExit(1 if errors else 0)
