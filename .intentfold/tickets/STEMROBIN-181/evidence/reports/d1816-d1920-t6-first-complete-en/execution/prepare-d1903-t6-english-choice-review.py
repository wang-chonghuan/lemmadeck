import json
import sys
from pathlib import Path

repo = Path("/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-181")
assert Path.cwd() == repo
sys.path.insert(0, str(repo / ".agents/skills/ld-s10y-choice/scripts"))
from prepare import digest, file_hash, load_json, prepare_seed
from validate import validate

ticket = repo / ".intentfold/tickets/STEMROBIN-181"
author = ticket / "tmp/d1816-d1900-t6-first-en-author"
card = "phy9-c1-s5-t6"
edition = "modern-us-neutral-en"
original = load_json(repo / "ssot-resources/soviet10year-textbooks/artifacts/9p/editions/"
                     "modern-us-neutral/lessons" / card / "choice-set/seed.json")
out = ticket / "tmp/d1816-d1903-t6-en-choice-review-inputs"
out.mkdir(parents=True, exist_ok=False)
seed = prepare_seed(repo, "9p", card, [item["number"] for item in original["exercises"]],
                    [item["block"] for item in original["concepts"]],
                    original["source"]["concept_figure_ids"], edition=edition)
draft = load_json(author / "draft.json")
draft["seed_sha256"] = digest(seed)
validate(repo, seed, draft, edition=edition)
for name, document in (("seed", seed), ("draft", draft)):
    (out / f"{name}.json").write_text(json.dumps(document, ensure_ascii=False, indent=2) + "\n")
(out / "views.json").write_text(json.dumps(
    [question["view"] for question in draft["questions"]], ensure_ascii=False, indent=2) + "\n")
(out / "result.json").write_text(json.dumps({
    "card": card, "edition": edition,
    "status": "ENGLISH_CHOICE_STRUCTURE_PASS_INDEPENDENT_REVIEW_REQUIRED",
    "seed": {"path": str(out / "seed.json"), "sha256": file_hash(out / "seed.json")},
    "draft": {"path": str(out / "draft.json"), "sha256": file_hash(out / "draft.json")},
    "views": {"path": str(out / "views.json"), "sha256": file_hash(out / "views.json")},
    "sourceQuestions": 11, "choiceQuestions": 6, "choiceOptions": 26,
    "originalSelectedSeedsAndCoverageLossesPreserved": True,
    "newApprovals": 0, "databaseWrites": 0, "paidCalls": 0,
}, indent=2) + "\n")
print(json.dumps({"card": card, "out": str(out), "status": "STRUCTURE_PASS_REVIEW_PENDING"}))
