"""Run existing text contracts without finalization, assembly, or output promotion."""
import copy
import json
import sys
from pathlib import Path

W = Path("/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck")
sys.path.insert(0, str(W / ".claude/skills/ld-s10y-lesson/tools"))
import edition

T = W / ".tmp/STEMROBIN-181/d1816-d057/n22-work/adapt/10p"
ID = "phy10-c1-s3-n22"
BOOK = W / ".tmp/STEMROBIN-181/d1816-d057/n22-root/10p"

def read(p):
    return json.loads(p.read_text())

reports = []
for name in ("modern-us-neutral", "modern-us-neutral-en"):
    folder = T / name / "lessons" / ID
    p = folder / "lesson.template.json"
    lesson = read(p)
    if sys.argv[1] == "normalize":
        before = copy.deepcopy(lesson)
        edition.normalize_lesson_layout(lesson)
        assert lesson["source"] == before["source"]
        assert [
            edition.math_signature(b["text"]) for b in lesson["prose"]
        ] == [
            edition.math_signature(b["text"]) for b in before["prose"]
        ]
        p.write_text(json.dumps(lesson, ensure_ascii=False, indent=2) + "\n")
        reports.append({"edition": name, "changedBlocks": [
            i for i, (a, b) in enumerate(zip(before["prose"], lesson["prose"]))
            if a["text"] != b["text"]
        ]})
        continue
    source = read(BOOK / "lessons" / ID / "lesson.json")
    exercises = read(folder / "exercises.template.json")
    figures = read(folder / "figures.template.json")
    errors = edition.validate_lesson_identity(source, lesson)
    errors += edition.validate_source(BOOK, lesson["source"],
        BOOK / "lessons" / ID / "lesson.json", "lesson")
    errors += edition.validate_source(BOOK, exercises["source"],
        BOOK / "lessons" / ID / "exercises.json", "exercises")
    errors += edition.validate_figure_references(lesson["prose"], [], figures["figures"])
    flow, flow_errors = edition.prose_flow_contract(lesson["prose"], lesson["section_breaks"])
    errors += flow_errors
    blocks = []
    for i, (raw, modern) in enumerate(zip(source["prose"], lesson["prose"])):
        label = f"lesson.prose[{i}]"
        block_errors = edition.validate_text(raw["text"], modern["text"],
            modern["changes"], modern["numeric_changes"], label, [],
            modern["historical_entities"])
        for field in ("kind", "id", "printed_page", "source_refs"):
            assert modern[field] == raw[field], (i, field)
        assert edition.same_figure_label(raw["label"], modern["label"], lesson.get("locale"))
        assert modern["source_text"] == raw["text"]
        errors += block_errors
        blocks.append({
            "index": i, "kind": raw["kind"], "sourceRefs": raw["source_refs"],
            "sourceMath": edition.math_signature(raw["text"]),
            "modernMath": edition.math_signature(modern["text"]),
            "sourceNumbers": edition.prose_number_signature(raw["text"])[0],
            "modernNumbers": edition.prose_number_signature(modern["text"])[0],
            "errors": block_errors,
        })
    assert len(lesson["prose"]) == len(source["prose"]) == 10
    assert exercises["count"] == 0 and exercises["exercises"] == []
    reports.append({"edition": name, "errors": errors, "blocks": blocks, "flow": flow,
        "nativeFullLessonValidation": "not invoked: independent review and promoted assets do not yet exist"})
print(json.dumps(reports, ensure_ascii=False, indent=2))
if sys.argv[1] != "normalize" and any(r["errors"] for r in reports):
    sys.exit(2)
