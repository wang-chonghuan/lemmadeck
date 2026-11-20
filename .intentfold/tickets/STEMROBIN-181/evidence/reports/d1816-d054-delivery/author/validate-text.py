import json
import subprocess
import sys
from pathlib import Path

sys.dont_write_bytecode = True
ROOT = Path("/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck")
assert Path.cwd() == ROOT
sys.path.insert(0, str(ROOT / ".claude/skills/ld-s10y-lesson/tools"))
import edition
import mathcheck

OWN = ROOT / ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d054-n14-author"
BOOK = ROOT / ".tmp/STEMROBIN-181/d1816-d054/n14-root/10p"
WORK = ROOT / ".tmp/STEMROBIN-181/d1816-d054/n14-work/adapt/10p"
LESSON = "phy10-c1-s2-n14"

def save(name, data):
    edition.dump(OWN / name, data)

def native_flow(target, suffix):
    command = ["node", str(ROOT / ".claude/skills/ld-s10y-lesson/tools/prose_flow.mjs"), "--json", str(target)]
    run = subprocess.run(command, cwd=ROOT, capture_output=True, text=True)
    save(suffix + ".receipt.json", {
        "role": "AUTHOR", "cwd": str(ROOT), "command": command, "exitCode": run.returncode,
        "stdout": run.stdout, "stderr": run.stderr,
    })
    assert run.returncode == 0, run.stderr
    flow = json.loads(run.stdout)
    save(suffix + ".json", flow)
    return flow

if "--normalize" in sys.argv:
    for locale, name in [("zh", "modern-us-neutral"), ("en", "modern-us-neutral-en")]:
        target = WORK / name / "lessons" / LESSON / "lesson.template.json"
        doc = edition.load(target)
        before = edition.sha256(target)
        edition.normalize_lesson_layout(doc)
        edition.dump(target, doc)
        save(locale + "-native-normalize.json", {
            "role": "AUTHOR", "nativeFunction": "normalize_lesson_layout",
            "beforeSha256": before, "sha256": edition.sha256(target),
            "adaptFinalizeCalled": False, "contentRepair": False,
        })
        flow = native_flow(target, locale + "-prose-flow-before-anchors")
        print(json.dumps({"locale": locale, "paragraphs": flow["paragraphs"]}, ensure_ascii=False))
    sys.exit(0)

results = []
all_errors = []
profile = edition.load(ROOT / ".claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json")
for locale, name in [("zh", "modern-us-neutral"), ("en", "modern-us-neutral-en")]:
    target_dir = WORK / name / "lessons" / LESSON
    target = target_dir / "lesson.template.json"
    doc = edition.load(target)
    raw_path = BOOK / "lessons" / LESSON / "lesson.json"
    raw = edition.load(raw_path)
    ex_path = BOOK / "lessons" / LESSON / "exercises.json"
    exercises = edition.load(target_dir / "exercises.template.json")
    errors = edition.validate_source(BOOK, doc["source"], raw_path, "lesson")
    errors += edition.validate_source(BOOK, exercises["source"], ex_path, "exercises")
    errors += edition.validate_lesson_identity(raw, doc)
    assert len(doc["prose"]) == len(raw["prose"]) == 19
    assert sum(x["kind"] == "p" for x in doc["prose"]) == 15
    assert doc["exercise_count"] == exercises["count"] == 0 and exercises["exercises"] == []
    assert doc["errata"] == [] and doc["locale"] == locale
    assert [x["id"] for x in doc["figures"]] == ["fig-18", "fig-19"]
    blocks, katex_items = [], []
    for index, (source, candidate) in enumerate(zip(raw["prose"], doc["prose"])):
        assert candidate["source_text"] == source["text"]
        for field in ("kind", "id", "printed_page", "source_refs"):
            assert candidate.get(field) == source.get(field), (index, field)
        assert edition.same_figure_label(source.get("label"), candidate.get("label"), locale)
        source_math = [x.group(0) for x in edition.MATH.finditer(source["text"])]
        modern_math = [x.group(0) for x in edition.MATH.finditer(candidate["text"])]
        assert source_math == modern_math, (index, source_math, modern_math)
        block_errors = edition.validate_text(
            source["text"], candidate["text"], candidate["changes"], candidate["numeric_changes"],
            f"{locale}.prose[{index}]", profile["forbidden_terms"] + profile["forbidden_person_names"],
            candidate["historical_entities"],
        )
        if candidate["kind"] == "p":
            assert edition.normalize_prose_layout(candidate["text"]) == candidate["text"], index
            if locale == "en":
                assert not edition.NON_ENGLISH_FIGURE_SCRIPT.search(candidate["text"])
                assert "translation" in candidate["changes"]
        errors += block_errors + mathcheck.check_delimiters(candidate["text"])
        for tex, display in mathcheck.find_math_spans(candidate["text"]):
            katex_items.append({"id": f"{locale}-{index}", "field": "text", "tex": tex, "display": display})
        blocks.append({"index": index, "kind": candidate["kind"], "sourceRefs": candidate["source_refs"],
                       "sourceMath": source_math, "modernMath": modern_math, "errors": block_errors})
    command = ["node", str(ROOT / ".claude/skills/ld-s10y-lesson/tools/katex_check.js")]
    run = subprocess.run(command, cwd=ROOT, input=json.dumps(katex_items), capture_output=True, text=True)
    save(locale + "-katex.receipt.json", {"command": command, "cwd": str(ROOT), "exitCode": run.returncode,
                                       "stdout": run.stdout, "stderr": run.stderr, "role": "AUTHOR"})
    assert run.returncode == 0, run.stderr
    errors += [str(x) for x in json.loads(run.stdout) if not x.get("ok")]
    flow = native_flow(target, locale + "-prose-flow-final")
    contract, flow_errors = edition.prose_flow_contract(doc["prose"], doc["section_breaks"])
    assert contract == flow
    errors += flow_errors
    assert len(flow["boundaries"]) == len(doc["section_breaks"]) == 3
    results.append({"locale": locale, "status": "pass" if not errors else "fail",
                    "template": {"path": str(target), "sha256": edition.sha256(target)},
                    "blocks": blocks, "paragraphCount": len(flow["paragraphs"]),
                    "nativeAnchors": flow["boundaries"], "errors": errors})
    all_errors += errors
report = {"schema": "STEMROBIN-181/d054-native-text-checks@1", "role": "AUTHOR",
          "status": "pass" if not all_errors else "fail", "locales": results,
          "sourceEntries": 19, "proseEntries": 15, "figures": 2, "questions": 0,
          "independentReview": "pending", "adaptFinalizeCalled": False, "offlineLessonRenderCalled": False,
          "nativeContracts": ["validate_source", "validate_lesson_identity", "same_figure_label",
                              "validate_text", "math_signature", "prose_number_signature",
                              "normalize_lesson_layout", "prose_flow_contract", "prose_flow.mjs", "katex_check.js"]}
save("native-text-validation.json", report)
print(json.dumps(report, ensure_ascii=False))
sys.exit(2 if all_errors else 0)
