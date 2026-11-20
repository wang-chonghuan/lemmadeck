import json
import sys
from pathlib import Path

sys.dont_write_bytecode = True
ROOT = Path("/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck")
assert Path.cwd() == ROOT
sys.path.insert(0, str(ROOT / ".claude/skills/ld-s10y-lesson/tools"))
import edition

EVIDENCE = ROOT / ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d050-n13-author"
BOOK = ROOT / ".tmp/STEMROBIN-181/d1816-d050/n13-root/10p"
WORK = ROOT / ".tmp/STEMROBIN-181/d1816-d050/n13-work/adapt/10p"
LESSON = "phy10-c1-s2-n13"
TARGET = WORK / "modern-us-neutral-en/lessons" / LESSON
TEMPLATE = TARGET / "lesson.template.json"
reuse = edition.load(ROOT / ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d050-n13-reuse/bindings.json")
assert edition.sha256(WORK / "modern-us-neutral/lessons" / LESSON / "lesson.template.json") == reuse["passedZhTemplate"]["sha256"]
assert edition.sha256(BOOK / "lessons" / LESSON / "lesson.json") == reuse["source"]["sha256"]


def validate_templates():
    modern = edition.load(TEMPLATE)
    raw_path = BOOK / "lessons" / LESSON / "lesson.json"
    raw = edition.load(raw_path)
    exercises = edition.load(TARGET / "exercises.template.json")
    raw_exercises_path = BOOK / "lessons" / LESSON / "exercises.json"
    errors = edition.validate_source(BOOK, modern["source"], raw_path, "lesson")
    errors += edition.validate_source(BOOK, exercises["source"], raw_exercises_path, "exercises")
    errors += edition.validate_lesson_identity(raw, modern)
    assert len(modern["prose"]) == len(raw["prose"]) == 14
    assert len([block for block in modern["prose"] if block["kind"] == "p"]) == 12
    assert modern["exercise_count"] == exercises["count"] == 0
    assert exercises["exercises"] == []
    assert modern["errata"] == []
    assert modern["locale"] == "en"
    assert modern["edition"] == "modern-us-neutral-en"
    assert [figure["id"] for figure in modern["figures"]] == ["fig-17"]
    profile = edition.load(ROOT / ".claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json")
    forbidden = profile["forbidden_terms"] + profile["forbidden_person_names"]
    blocks = []
    for index, (source, candidate) in enumerate(zip(raw["prose"], modern["prose"])):
        label = f"lesson.prose[{index}]"
        assert candidate["source_text"] == source["text"]
        for field in ("kind", "id", "printed_page", "source_refs"):
            assert candidate.get(field) == source.get(field), (label, field)
        assert edition.same_figure_label(source.get("label"), candidate.get("label"), modern["locale"])
        block_errors = edition.validate_text(
            source["text"], candidate["text"], candidate["changes"],
            candidate["numeric_changes"], label, forbidden,
            candidate["historical_entities"],
        )
        if candidate["kind"] == "p":
            assert not edition.NON_ENGLISH_FIGURE_SCRIPT.search(candidate["text"])
            assert "translation" in candidate["changes"]
            assert candidate["text"] == edition.normalize_prose_layout(candidate["text"])
        assert edition.math_signature(candidate["text"]) == edition.math_signature(source["text"])
        source_spans = [match.group(0) for match in edition.MATH.finditer(source["text"])]
        modern_spans = [match.group(0) for match in edition.MATH.finditer(candidate["text"])]
        assert source_spans == modern_spans
        errors += block_errors
        blocks.append({
            "index": index, "kind": candidate["kind"],
            "sourceRefs": candidate["source_refs"],
            "sourceMathSpans": source_spans, "modernMathSpans": modern_spans,
            "sourceNumbersAndReferences": str(edition.prose_number_signature(source["text"])),
            "modernNumbersAndReferences": str(edition.prose_number_signature(candidate["text"])),
            "errors": block_errors,
        })
    flow, flow_errors = edition.prose_flow_contract(modern["prose"], modern["section_breaks"])
    errors += flow_errors
    assert len(modern["section_breaks"]) == len(flow.get("boundaries", [])) == 2
    native_cli = edition.subprocess.run(
        ["node", str(ROOT / ".claude/skills/ld-s10y-lesson/tools/prose_flow.mjs"), "--json", str(TEMPLATE)],
        cwd=ROOT, text=True, capture_output=True,
    )
    assert native_cli.returncode == 0, native_cli.stderr
    assert json.loads(native_cli.stdout) == flow
    (EVIDENCE / "en-prose-flow-final.json").write_text(
        json.dumps(flow, ensure_ascii=False, indent=2) + "\n", encoding="utf-8",
    )
    result = {
        "schema": "STEMROBIN-181/d050-n13-native-validate-templates@1",
        "role": "AUTHOR",
        "cwd": str(ROOT),
        "status": "pass" if not errors else "fail",
        "errors": errors,
        "entries": len(modern["prose"]),
        "proseEntries": 12,
        "blocks": blocks,
        "nativeProseFlow": flow,
        "nativeContracts": [
            "validate_source", "validate_lesson_identity", "validate_text",
            "same_figure_label", "math_signature", "prose_number_signature",
            "normalize_prose_layout", "prose_flow_contract", "prose_flow.mjs",
        ],
        "scope": "English text template author checks only. ZH/raw passed stages reused, not rereviewed. No figure manifest validation, finalization, edition render, or publication.",
        "sourceReassembly": False,
        "independentReview": False,
    }
    print(json.dumps(result, ensure_ascii=False))
    return 2 if errors else 0


if "--normalize-en-layout" in sys.argv:
    modern = edition.load(TEMPLATE)
    before = edition.sha256(TEMPLATE)
    edition.normalize_lesson_layout(modern)
    edition.dump(TEMPLATE, modern)
    flow, errors = edition.prose_flow_contract(modern["prose"], [])
    assert not errors, errors
    report = {
        "role": "AUTHOR",
        "action": "Native normalize_lesson_layout formatting of the owned English template before choosing text anchors.",
        "beforeSha256": before,
        "afterSha256": edition.sha256(TEMPLATE),
        "nativeProseFlow": flow,
        "authorTextChanged": False,
        "editionFinalizeCalled": False,
    }
    print(json.dumps(report, ensure_ascii=False, indent=2))
else:
    sys.exit(validate_templates())
