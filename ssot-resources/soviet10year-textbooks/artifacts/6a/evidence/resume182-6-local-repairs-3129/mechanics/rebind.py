import copy
import json
import sys
from pathlib import Path

ROOT = Path("/Users/yong/.codex/worktrees/stemrobin-182-six-3129/lemmadeck")
assert Path.cwd() == ROOT
OUT = ROOT / ".tmp/ld-s10y-lesson/resume182-6-3129/local-repairs-FIRST"
sys.path.insert(0, str(ROOT / ".agents/skills/ld-s10y-choice/scripts"))
from prepare import prepare_seed, digest, load_json
from validate import validate
sys.path.insert(0, str(ROOT / ".claude/skills/ld-s10y-lesson/tools"))
import edition
sys.path.insert(0, str(ROOT / ".claude/skills/ld-s10y-answer/tools"))
import lesson_answers

results = []
native = load_json(OUT / "native-check-FIRST.json")
assert all(not row["errors"] for row in native["results"])
for book, lesson in [("6a", "alg6-c2-s1-n8"), ("8a", "alg8-c3-s3-n20")]:
    directory = ROOT / f"ssot-resources/soviet10year-textbooks/artifacts/{book}/editions/modern-us-neutral/lessons/{lesson}"
    before = OUT / "before" / book
    seed = load_json(before / "choice-set/seed.json")
    draft = load_json(before / "choice-set/draft.json")
    review = load_json(before / "choice-set/review.json")
    current = prepare_seed(ROOT, book, lesson,
                           [item["number"] for item in seed["exercises"]],
                           [item["block"] for item in seed["concepts"]],
                           seed["source"]["concept_figure_ids"])
    for key in ["source", "concepts", "figures"]:
        assert current[key] == seed[key]
    old_exercises = {item["number"]: item for item in seed["exercises"]}
    changed_sources = [item["number"] for item in current["exercises"]
                       if item != old_exercises[item["number"]]]
    assert changed_sources == (["188"] if book == "6a" else [])
    draft["seed_sha256"] = digest(current)
    review["seed_sha256"] = digest(current)
    review["draft_sha256"] = digest(draft)
    if book == "6a":
        review["reviewer"] = {
            "kind": "self_review",
            "identity": "182-6 local repair parent; informed affected-only self-review, not blind or independent. Only written188 changed; all 15 choice views/keys and unchanged original independent approvals inherited. Fresh independent repair review remains PENDING because spawn returned agent thread limit reached; old paused reviewers untouched."
        }
        for row in review["source_reviews"]:
            if row["source_number"] == "188":
                row["independent_solution"] += (
                    " 本次父受影响自审补充（非新独立解）：把输入集合限定为射线确有AB内交点的圆周点后，每个输入存在交点；O不在AB所在直线上，射线至多交该直线一点，故交点唯一。整圆的普遍存在性仍为假。"
                )
                row["coverage"]["evidence"] += (
                    " 现代题面已改为判断整圆并补问限制输入集合；现有选择题保留整圆判断与三像任务，限制输入集合的证明仍在书面题/标准答案中，未冒称选择题覆盖新增证明。"
                )
    else:
        review["reviewer"]["identity"] += (
            " 182-6 local repair refreshed lesson trace hash only: all selected concepts, exercises, figures, questions and keys remain byte-equivalent; no new choice approval inferred for the separate unselected proof supplement."
        )
    assert draft["questions"] == load_json(before / "choice-set/draft.json")["questions"]
    assert draft["coverage"] == load_json(before / "choice-set/draft.json")["coverage"]
    assert validate(ROOT, current, draft, review) == "pass"
    for name, value in [("seed.json", current), ("draft.json", draft), ("review.json", review)]:
        edition.dump(directory / "choice-set" / name, value)
    audit = load_json(directory / "adaptation.audit.json")
    lesson_doc = load_json(directory / "lesson.json")
    exercises_doc = load_json(directory / "exercises.json")
    audit["changedProseBlocks"] = sum(item["text"] != item["source_text"] for item in lesson_doc["prose"])
    audit["changedExercises"] = sum(item["text"] != item["source_text"] for item in exercises_doc["exercises"])
    audit["affectedRepair"] = {
        "scope": "written exercise188" if book == "6a" else "p0114#4 proof supplement",
        "nativeEditionValidation": "pass",
        "independentContentReview": "pending",
        "priorSourceAndFigureApprovalsReused": True,
    }
    edition.dump(directory / "adaptation.audit.json", audit)
    if book == "6a":
        answer_doc, errors = lesson_answers.validate_lesson(
            directory / "answer-keys.json", directory / "exercises.json", book, lesson,
            "modern-us-neutral",
        )
        assert not errors, errors
        answer188 = next(item for item in answer_doc["answers"] if item["exercise"] == "188")
        assert answer188["grading"] == "ungraded" and not answer188["parts"]
        old_answers = load_json(before / "answer-keys.json")
        assert [item for item in answer_doc["answers"] if item["exercise"] != "188"] == [
            item for item in old_answers["answers"] if item["exercise"] != "188"]
        answer_audit = load_json(directory / "answer-keys.audit.json")
        answer_audit["affectedRepair"] = {
            "exercise": "188", "nativeStructureValidation": "pass",
            "unchangedExactInputChecksReused": True,
            "newMathLiveOrPaidCalls": 0, "independentContentReview": "pending",
        }
        edition.dump(directory / "answer-keys.audit.json", answer_audit)
    results.append({"book": book, "lesson": lesson, "changedSources": changed_sources,
                    "choiceViewsAndKeysUnchanged": True, "nativeChoiceBinding": "pass",
                    "independentRepairReview": "pending"})
edition.dump(OUT / "binding-check-FIRST.json", {"results": results})
print(json.dumps(results, ensure_ascii=False))
