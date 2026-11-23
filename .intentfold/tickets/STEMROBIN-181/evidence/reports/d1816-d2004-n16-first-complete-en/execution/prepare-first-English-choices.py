import json
import sys
from pathlib import Path

repo = Path("/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-181")
assert Path.cwd() == repo
sys.path.insert(0, str(repo / ".agents/skills/ld-s10y-choice/scripts"))
from prepare import digest, file_hash, load_json, prepare_seed
from validate import validate

config = load_json(Path(sys.argv[1]))
card, book = config["card"], config["book"]
author, out = Path(config["author"]), Path(config["out"])
edition = "modern-us-neutral-en"
original = load_json(repo / "ssot-resources/soviet10year-textbooks/artifacts" / book /
                     "editions/modern-us-neutral/lessons" / card / "choice-set/seed.json")
out.mkdir(parents=True, exist_ok=False)
seed = prepare_seed(repo, book, card, [item["number"] for item in original["exercises"]],
                    [item["block"] for item in original["concepts"]],
                    original["source"]["concept_figure_ids"], edition=edition)
draft = load_json(author / "draft.json")
extra_fields = set(draft) - {"schema", "seed_sha256", "new_figures", "questions", "coverage"}
assert extra_fields <= {"edition", "locale"}, "Unknown draft fields require a specific repair"
for field in extra_fields:
    del draft[field]
draft["seed_sha256"] = digest(seed)
validate(repo, seed, draft, edition=edition)
for name, document in (("seed", seed), ("draft", draft)):
    (out / f"{name}.json").write_text(json.dumps(document, ensure_ascii=False, indent=2) + "\n")
(out / "views.json").write_text(json.dumps(
    [question["view"] for question in draft["questions"]], ensure_ascii=False, indent=2) + "\n")
(out / "result.json").write_text(json.dumps({
    "card": card, "edition": edition,
    "status": "ENGLISH_CHOICE_STRUCTURE_PASS_INDEPENDENT_REVIEW_REQUIRED",
    "bindings": [{"path": str(out / f"{name}.json"), "sha256": file_hash(out / f"{name}.json")}
                 for name in ("seed", "draft", "views")],
    "choiceQuestions": len(draft["questions"]),
    "choiceOptions": sum(len(question["view"]["options"]) for question in draft["questions"]),
    "originalSelectedSeedsAndCoverageLossesPreserved": True,
    "removed_noncontract_header_fields": sorted(extra_fields),
    "original_author_draft_sha256": file_hash(author / "draft.json"),
    "newApprovals": 0, "databaseWrites": 0, "paidCalls": 0,
}, indent=2) + "\n")
print(json.dumps({"card": card, "out": str(out), "status": "STRUCTURE_PASS_REVIEW_PENDING"}))
