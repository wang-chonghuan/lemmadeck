import argparse
import collections
import json
import sys
from pathlib import Path

CWD = Path("/Users/yong/.codex/worktrees/d9b1/lemmadeck")
assert Path.cwd() == CWD
sys.path.insert(0, str(CWD / ".claude/skills/ld-s10y-lesson/tools"))
import edition
import mathcheck

parser = argparse.ArgumentParser()
parser.add_argument("--normalize", action="store_true")
parser.add_argument("working", type=Path)
args = parser.parse_args()
working = args.working.resolve()
author = working.parents[1]
assert author == CWD / ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13/n45-modern-author"
lesson_path = working / "lesson.template.json"
exercises_path = working / "exercises.template.json"
lesson = edition.load(lesson_path)
exercises = edition.load(exercises_path)
figures = edition.load(working / "figures.template.json")
prepared = author.parent / "n45-adapt-work/PREPARED/alg7-c4-s3-n45"
raw_lesson = lesson["source"]["data"]
raw_exercises = exercises["source"]["data"]
assert lesson["source"] == edition.load(prepared / "lesson.template.json")["source"]
assert exercises["source"] == edition.load(prepared / "exercises.template.json")["source"]
assert figures == edition.load(prepared / "figures.template.json")
assert edition.sha256(working / "figures.template.json") == edition.sha256(prepared / "figures.template.json")
assert lesson["errata"] == []
if args.normalize:
    edition.normalize_lesson_layout(lesson)
    edition.normalize_exercise_layout(exercises)
    edition.dump(lesson_path, lesson)
    edition.dump(exercises_path, exercises)

profile = edition.load(CWD / ".claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json")
forbidden = profile["forbidden_terms"] + profile["forbidden_person_names"]
errors = edition.validate_identity_fields(raw_lesson, lesson, edition.IDENTITY_FIELDS, "lesson")
assert len(lesson["prose"]) == len(raw_lesson["prose"]) == 19
assert exercises["count"] == len(exercises["exercises"]) == 19
assert [item["number"] for item in exercises["exercises"]] == [str(n) for n in range(873, 892)]
rows = []
math_items = []
for index, (source, modern) in enumerate(zip(raw_lesson["prose"], lesson["prose"], strict=True)):
    label = f"prose[{index}]"
    for field in ("kind", "id", "label", "printed_page", "source_refs"):
        assert source[field] == modern[field], (label, field)
    assert modern["source_text"] == source["text"]
    assert modern["numeric_changes"] == []
    assert modern["historical_entities"] == []
    errors += edition.validate_text(source["text"], modern["text"], modern["changes"],
                                    modern["numeric_changes"], label, forbidden,
                                    modern["historical_entities"])
    original_spans = mathcheck.find_math_spans(source["text"])
    modern_spans = mathcheck.find_math_spans(modern["text"])
    assert original_spans == modern_spans, f"Exact TeX changed: {label}"
    assert edition.number_signature(source["text"]) == edition.number_signature(modern["text"])
    errors += mathcheck.check_delimiters(modern["text"])
    for tex, display in modern_spans:
        math_items.append({"id": label, "field": "text", "tex": tex, "display": display})
    rows.append({"target": label, "source_refs": source["source_refs"],
                 "mathSpans": len(original_spans), "exactTeXPreserved": True,
                 "nonMathNumbers": edition.number_signature(source["text"]),
                 "numbersPreserved": True})
part_counts = []
for source, modern in zip(raw_exercises["exercises"], exercises["exercises"], strict=True):
    label = f"exercise[{source['number']}]"
    errors += edition.validate_identity_fields(source, modern,
        ("number", "source_number", "group", "group_id", "figure_refs", "figures", "pages"), label)
    assert modern["source_text"] == source["text"]
    assert modern["numeric_changes"] == []
    assert modern["historical_entities"] == []
    errors += edition.validate_text(source["text"], modern["text"], modern["changes"],
                                    modern["numeric_changes"], label, forbidden,
                                    modern["historical_entities"], source_lines=source["lines"])
    original_spans = mathcheck.find_math_spans(source["text"])
    modern_spans = mathcheck.find_math_spans(modern["text"])
    assert original_spans == modern_spans, f"Exact TeX changed: {label}"
    assert edition.number_signature(source["text"]) == edition.number_signature(modern["text"])
    errors += edition.validate_numbered_subpart_layout(modern["text"])
    errors += mathcheck.check_delimiters(modern["text"])
    assert modern["lines"] == modern["text"].splitlines()
    markers = [line[0] for line in modern["lines"] if len(line) > 1 and line[1] == ")"]
    assert markers == list("abcdefghijklmnopqrstuvwxyz"[:len(markers)])
    if markers:
        assert len(modern["lines"]) == len(markers) + 1
    assert "\u3000" not in modern["text"]
    for tex, display in modern_spans:
        math_items.append({"id": label, "field": "text", "tex": tex, "display": display})
    part_counts.append({"number": source["number"], "subparts": len(markers)})
    rows.append({"target": label, "source_refs": source["pages"],
                 "mathSpans": len(original_spans), "exactTeXPreserved": True,
                 "nonMathNumbers": edition.number_signature(source["text"]),
                 "numbersPreserved": True, "subparts": len(markers),
                 "sourceConditionsAndTaskRetained": True})
assert sum(item["subparts"] for item in part_counts) == 44
checks = mathcheck.katex_validate(math_items)
errors += [item.get("fatal") or f"{item.get('id')}: {item.get('error')}"
           for item in checks if item.get("fatal") or not item.get("ok")]
assert not errors, errors
summary = {
    "schema": "stemrobin182/n45-text-preservation@1",
    "selected": ["alg7-c4-s3-n45"], "textOnlyPass": True,
    "rawProseBlocks": 19, "proseKinds": dict(collections.Counter(item["kind"] for item in lesson["prose"])),
    "originals": 19, "originalRange": [873, 891], "latinSubparts": 44,
    "mathSpans": len(math_items), "katexPass": len(checks),
    "exactTeXPreserved": True, "allNonMathNumbersPreserved": True,
    "sourceSnapshotsAndRefsPreserved": True, "numericChanges": 0, "mathCorrections": 0,
    "conditionsPreserved": [
        "First example: ignore air resistance, v0=40, h=60, g approximately 10 with source footnote retained.",
        "Second example: 5 hours, downstream 42 km/upstream 20 km, flow 2 km/h, x>2, and (x+2)(x-2) != 0 retained.",
        "All work-rate, speed, distance, numerator/denominator, integer, and triangle conditions unchanged.",
        "889: f(x)=3, f(x)>3, f(x)<3 and domain [-1.5,6] unchanged; figure 60 remains with 889.",
        "890: natural numbers not exceeding 20 and remainder on division by 6 unchanged.",
        "891: A(x), B(x^2), both a/b source panels, and requested 1,-x,1/x,sqrt(x) positions retained; no geometry inferred."
    ],
    "contextualChanges": [{"exercise": "885", "from": "女打字员", "to": "打字员",
                           "onlyGenderNeutralization": True}],
    "figureEntriesUnchanged": True, "figureIds": [item["id"] for item in figures["figures"]],
    "imagesOpened": 0, "adaptFinalizeRun": False, "modernFigureApproval": False,
    "sourceReviewRerun": False, "published": False, "rows": rows,
}
target = author / "text-preservation.json"
assert not target.exists(), target
edition.dump(target, summary)
print(json.dumps({key: value for key, value in summary.items() if key != "rows"}, ensure_ascii=False, indent=2))
