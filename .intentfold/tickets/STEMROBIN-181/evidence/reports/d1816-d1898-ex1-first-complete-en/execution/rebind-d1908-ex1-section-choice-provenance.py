import json
import sys
from pathlib import Path

repo = Path("/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-181")
assert Path.cwd() == repo
sys.path.insert(0, str(repo / ".agents/skills/ld-s10y-choice/scripts"))
from prepare import digest, file_hash, load_json, prepare_seed
from validate import validate

ticket = repo / ".intentfold/tickets/STEMROBIN-181"
original = ticket / "tmp/d1816-d1891-ex1-en-choice-review-inputs"
reviewer = ticket / "tmp/d1816-d1894-ex1-first-en-review"
out = ticket / "tmp/d1816-d1908-ex1-section-choice-provenance"
out.mkdir(parents=True, exist_ok=False)
old_seed = load_json(original / "seed.json")
seed = prepare_seed(repo, "9p", "phy9-c1-s1-t10",
                    [item["number"] for item in old_seed["exercises"]], [], [],
                    edition="modern-us-neutral-en")
assert {key: value for key, value in old_seed.items() if key != "trace"} == \
       {key: value for key, value in seed.items() if key != "trace"}
draft = load_json(original / "draft.json")
draft["seed_sha256"] = digest(seed)
review = load_json(reviewer / "review.json")
assert review["outcome"] == "pass"
review["seed_sha256"] = digest(seed)
review["draft_sha256"] = digest(draft)
validate(repo, seed, draft, review, edition="modern-us-neutral-en")
for name, document in (("seed", seed), ("draft", draft), ("review", review)):
    (out / f"{name}.json").write_text(json.dumps(document, ensure_ascii=False, indent=2) + "\n")
(out / "views.json").write_bytes((original / "views.json").read_bytes())
(out / "provenance.json").write_text(json.dumps({
    "card": "phy9-c1-s1-t10", "status": "UNCHANGED_CHOICES_REBOUND_TO_SECTION_METADATA_REPAIR",
    "original_review": {"path": str(reviewer / "review.json"),
                        "sha256": file_hash(reviewer / "review.json")},
    "original_seed": {"path": str(original / "seed.json"), "sha256": file_hash(original / "seed.json")},
    "rebound_seed": {"path": str(out / "seed.json"), "sha256": file_hash(out / "seed.json")},
    "rebound_draft": {"path": str(out / "draft.json"), "sha256": file_hash(out / "draft.json")},
    "rebound_review": {"path": str(out / "review.json"), "sha256": file_hash(out / "review.json")},
    "seed_trace_only_change": True, "all_selected_source_prose_and_figures_unchanged": True,
    "all_questions_keys_rationales_and_coverage_unchanged": True,
    "all_source_and_question_semantic_review_records_unchanged": True,
    "review_replayed": False, "new_semantic_approval": False,
    "english_metadata_affected_review_still_required": True,
    "validator": "official validate(seed, draft, review, edition=modern-us-neutral-en) passed",
    "imagesOpened": 0, "databaseWrites": 0, "paidCalls": 0,
}, indent=2) + "\n")
print(json.dumps({"card": "phy9-c1-s1-t10", "status": "UNCHANGED_CHOICE_PROVENANCE_REBOUND", "out": str(out)}))
