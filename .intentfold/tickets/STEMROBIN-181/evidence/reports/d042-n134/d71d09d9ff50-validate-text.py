import copy
import hashlib
import json
import sys
from pathlib import Path

repo = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
owned = repo / ".intentfold/tickets/STEMROBIN-181/tmp/d042-9p-n134-text-repair"
author = owned.parent / "d040-9p-n134-author"
assert Path(__file__).resolve().parent == owned
sys.path.insert(0, str(repo / ".claude/skills/ld-s10y-lesson/tools"))
import edition
import mathcheck

if sys.argv[1:] == ["--normalize"]:
    document = json.load(sys.stdin)
    edition.normalize_lesson_layout(document)
    print(json.dumps(document, ensure_ascii=False, indent=2))
    raise SystemExit(0)

assert sys.argv[1:] == ["--check"]
card = "phy9-c2-s7-n134"
profile = edition.load(repo / ".claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json")
forbidden = profile["forbidden_terms"] + profile["forbidden_person_names"]
reports = []
errors = []
raw = edition.load(author / "frozen/raw/lesson.json")
raw_exercises = edition.load(author / "frozen/raw/exercises.json")
raw_hash = hashlib.sha256((author / "frozen/raw/lesson.json").read_bytes()).hexdigest()
for language in ("zh", "en"):
    directory = owned / language
    template = directory / "lesson.template.json"
    lesson = edition.load(template)
    previous = edition.load(author / "frozen" / language / "lesson.template.json")
    exercises = edition.load(directory / "exercises.template.json")
    figures = edition.load(directory / "figures.template.json")
    book = author / ("root" if language == "zh" else "root-en") / "9p"
    language_errors = []
    for document, schema in (
        (lesson, edition.LESSON_SCHEMA),
        (exercises, edition.EXERCISES_SCHEMA),
        (figures, edition.FIGURES_SCHEMA),
    ):
        assert document["schema"] == schema
        assert document["status"] == "draft"
        assert document["edition"] == "modern-us-neutral"
    assert lesson["language"] == language
    assert lesson["source"] == previous["source"]
    assert lesson["source"]["data"] == raw
    assert lesson["source"]["sha256"] == raw_hash
    assert exercises["source"]["data"] == raw_exercises
    assert lesson["errata"] == previous["errata"] == []
    language_errors += edition.validate_source(
        book, lesson["source"], book / lesson["source"]["path"], "lesson")
    language_errors += edition.validate_source(
        book, exercises["source"], book / exercises["source"]["path"], "exercises")
    identity_errors = edition.validate_identity_fields(
        raw, lesson, edition.IDENTITY_FIELDS, "lesson")
    language_errors += identity_errors
    assert len(lesson["prose"]) == len(raw["prose"]) == 23
    assert sum(block["kind"] == "p" for block in lesson["prose"]) == 17
    assert sum(block["kind"] == "cap" for block in lesson["prose"]) == 3
    assert lesson["figures"] == raw["figures"] == previous["figures"]
    assert raw["exercise_count"] == exercises["count"] == 0
    assert exercises["exercises"] == []
    normalized = copy.deepcopy(lesson)
    edition.normalize_lesson_layout(normalized)
    assert normalized == lesson, "Native normalization must be idempotent"
    signatures = []
    for index, (source, modern, old) in enumerate(zip(
        raw["prose"], lesson["prose"], previous["prose"],
    )):
        assert modern["source_text"] == source["text"] == old["source_text"]
        assert modern["numeric_changes"] == old["numeric_changes"] == []
        assert modern["changes"] == old["changes"]
        assert modern["historical_entities"] == old["historical_entities"]
        language_errors += edition.validate_identity_fields(
            source, modern, ("kind", "id", "label", "printed_page", "source_refs"),
            f"{language}.prose[{index}]")
        language_errors += edition.validate_text(
            source["text"], modern["text"], modern["changes"], modern["numeric_changes"],
            f"{language}.prose[{index}]", forbidden, modern["historical_entities"])
        math_signature = edition.math_signature(modern["text"])
        number_signature = edition.number_signature(modern["text"])
        assert math_signature == edition.math_signature(source["text"])
        assert math_signature == edition.math_signature(old["text"])
        assert number_signature == edition.number_signature(source["text"])
        assert number_signature == edition.number_signature(old["text"])
        assert [match.group() for match in edition.MATH.finditer(modern["text"])] == [
            match.group() for match in edition.MATH.finditer(old["text"])
        ]
        signatures.append({
            "blockIndex": index, "source_refs": modern["source_refs"],
            "math": math_signature, "non_math_numbers": number_signature,
            "literalMathTokensUnchanged": True, "numeric_changes": [],
        })
    flow, flow_errors = edition.prose_flow_contract(lesson["prose"], lesson["section_breaks"])
    language_errors += flow_errors
    assert flow == edition.load(directory / "prose-flow.json")
    language_errors += edition.validate_figure_references(
        lesson["prose"], exercises["exercises"], figures["figures"])
    blocks = [{"id": str(index), "text": block["text"]}
              for index, block in enumerate(lesson["prose"])]
    math_errors, warnings = mathcheck.collect_and_check(
        blocks, lambda block: [("text", block["text"])])
    language_errors += math_errors
    reports.append({
        "language": language, "template": str(template),
        "template_sha256": hashlib.sha256(template.read_bytes()).hexdigest(),
        "nativeIdentityErrors": identity_errors, "identityExceptionApplied": False,
        "sourceSnapshotExact": True, "allSourceTextAndObjectIdentityExact": True,
        "nativeLayoutIdempotent": True, "objects": 23, "prose_objects": 17,
        "figure_objects": 3, "caption_objects": 3, "exercises": 0,
        "paragraphCount": len(flow["paragraphs"]),
        "resolvedSectionBreaks": flow["resolvedBreaks"], "signatures": signatures,
        "errors": language_errors, "katex_warnings": warnings,
    })
    errors += language_errors

print(json.dumps({
    "schema": "ld-s10y-lesson/bounded-text-repair-check@1", "card": card,
    "status": "pass" if not errors else "fail", "languages": reports, "errors": errors,
    "scope": "Native source snapshot and identity equality, text contract, literal formulas, numbers, references, normalized prose flow and KaTeX syntax only.",
    "nativeCandidateTitleFieldsPreserved": True, "displaySidecarNotApplied": True,
    "source_gate_replay": False, "source_reconstruction": False,
    "adapt_finalize_run": False, "render_run": False, "images_opened": 0,
    "independent_science_approval": False, "independent_bilingual_approval": False,
    "modern_figure_approval": False,
}, ensure_ascii=False, indent=2))
raise SystemExit(1 if errors else 0)
