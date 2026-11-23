import json
import shutil
import sys
from pathlib import Path

repo = Path("/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-181")
assert Path.cwd() == repo
sys.path.insert(0, str(repo / ".agents/skills/ld-s10y-choice/scripts"))
from prepare import ARTIFACTS, digest, file_hash, load_json, prepare_seed
from validate import validate

ticket = repo / ".intentfold/tickets/STEMROBIN-181"
card = "phy10-c2-s4-n101"
edition = "modern-us-neutral-en"
prior = ticket / "evidence/reports/d1297-n101-t11-readiness/n101"
ready = load_json(prior / "readiness.json")
assert ready["ZHEN"] == "PASS-FIRST-PLUS-AFFECTED-INDEPENDENT"
native = load_json(ticket / "tmp/d1816-d1878-n101-en-native/result.json")
target = repo / ARTIFACTS / "10p/editions" / edition / "lessons" / card
target.mkdir(parents=True, exist_ok=False)
for item in native["products"]:
    source = Path(item["path"])
    assert file_hash(source) == item["sha256"]
    shutil.copyfile(source, target / source.name)
old_seed = load_json(prior / "choice/seed.json")
old_draft = load_json(prior / "en/choice/draft.json")
old_review = load_json(prior / "en/choice/review.json")
assert old_draft["seed_sha256"] == digest(old_seed)
assert old_review["seed_sha256"] == digest(old_seed)
assert old_review["draft_sha256"] == digest(old_draft)
assert old_review["outcome"] == "pass"
numbers = [row["number"] for row in old_seed["exercises"]]
blocks = [row["block"] for row in old_seed["concepts"]]
assert numbers == ["1", "2", "3", "4"]
assert old_seed["figures"] == []
chinese = prepare_seed(repo, "10p", card, numbers, blocks, [])
assert {k: v for k, v in old_seed.items() if k != "trace"} == {
    k: v for k, v in chinese.items() if k != "trace"
}
approved_en = load_json(prior / "en/native/exercises.json")
approved_zh = load_json(repo / ARTIFACTS / "10p/editions/modern-us-neutral/lessons" /
                        card / "exercises.json")
for en, zh in zip(approved_en["exercises"], approved_zh["exercises"], strict=True):
    assert en["number"] == zh["number"]
    assert en["source_text"] == zh["source_text"]
    assert en["pages"] == zh["pages"]
seed = prepare_seed(repo, "10p", card, numbers, blocks, [], edition=edition)
assert [row["text"] for row in seed["exercises"]] == [
    row["text"] for row in approved_en["exercises"]
]
approved_prose = load_json(prior / "en/native/lesson.json")["prose"]
assert [row["text"] for row in seed["concepts"]] == [
    approved_prose[block]["text"] for block in blocks
]
assert {k: v for k, v in seed.items() if k not in {"trace", "exercises", "concepts"}} == {
    k: v for k, v in old_seed.items() if k not in {"trace", "exercises", "concepts"}
}
draft = {**old_draft, "seed_sha256": digest(seed)}
review = {**old_review, "seed_sha256": digest(seed), "draft_sha256": digest(draft)}
assert validate(repo, seed, draft, review, edition=edition) == "pass"
out = ticket / "tmp/d1816-d1879-n101-en-choice-provenance"
out.mkdir(parents=True, exist_ok=False)
for name, document in (("seed", seed), ("draft", draft), ("review", review)):
    (out / f"{name}.json").write_text(json.dumps(document, ensure_ascii=False, indent=2) + "\n")
report = {
    "card": card,
    "edition": edition,
    "status": "APPROVED_BILINGUAL_SOURCE_EN_REBINDING_WITH_UNCHANGED_CHOICES_PASS",
    "choiceDirectory": str(out),
    "existingBilingualReadiness": {"path": str(prior / "readiness.json"),
                                  "sha256": file_hash(prior / "readiness.json")},
    "originalSharedChineseSeed": {"path": str(prior / "choice/seed.json"),
                                  "sha256": file_hash(prior / "choice/seed.json")},
    "originalEnglishCandidateAndReview": [
        {"path": str(prior / f"en/choice/{name}.json"),
         "sha256": file_hash(prior / f"en/choice/{name}.json")}
        for name in ("draft", "review")
    ],
    "changes": ["seed.exercises.text and five seed.concepts.text to approved English counterparts",
                "seed.trace", "draft.seed_sha256", "review seed/draft provenance hashes"],
    "allQuestionViewsIntentsKeysAndCoverageUnchanged": True,
    "independentReviewFindingsUnchanged": True,
    "sourceLanguageEquivalenceUsesExistingZHENReview": True,
    "questionIdentitiesAndOriginalSourceBindingsUnchanged": True,
    "contentReviewsReplayed": False,
    "choiceQuestions": 4,
    "choiceOptions": 13,
    "databaseWrites": 0,
    "paidCalls": 0,
}
(out / "result.json").write_text(json.dumps(report, indent=2) + "\n")
print(json.dumps({"card": card, "status": report["status"], "out": str(out)}))
