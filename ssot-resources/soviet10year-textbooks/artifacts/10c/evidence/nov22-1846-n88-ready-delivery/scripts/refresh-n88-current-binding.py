import json
import sys
from pathlib import Path

ROOT = Path("/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck")
assert Path.cwd() == ROOT
sys.path.insert(0, str(ROOT / ".agents/skills/ld-s10y-choice/scripts"))
sys.path.insert(0, str(ROOT / ".claude/skills/ld-s10y-lesson/tools"))
from prepare import digest, file_hash, load_json, prepare_seed, write_seed
from edition import normalize_prose_layout

scratch = ROOT / ".tmp/stemrobin-184-six"
output = scratch / "n88-current-choice-binding"
assert not output.exists(), "Do not replay seed preparation or binding refresh"
output.mkdir()
old_paths = {
    "seed": scratch / "n88-choice-source/repo/.tmp/stemrobin-184-six/n88-choice-source/repo/.tmp/n88-seed/seed.json",
    "draft": scratch / "n88-choice-author02/repair03/draft.json",
    "review": scratch / "n88-choice-review/semantic-affected02/comparison/review.json",
}
old = {name: load_json(file) for name, file in old_paths.items()}
assert digest(old["seed"]) == old["draft"]["seed_sha256"]
assert digest(old["seed"]) == old["review"]["seed_sha256"]
assert digest(old["draft"]) == old["review"]["draft_sha256"]
concepts = [0, 1, 2, 8, 17, 25, 26, 27, 28, 29, 30, 31, 32, 33]
seed = prepare_seed(ROOT, "10c", "ana10-c6-s3-n88",
                    [str(number) for number in range(204, 238)], concepts, [])
write_seed(output / "seed.json", seed, ROOT)
assert seed["source"] == old["seed"]["source"]
assert seed["exercises"] == old["seed"]["exercises"]
assert seed["figures"] == old["seed"]["figures"] == []
assert len(seed["concepts"]) == len(old["seed"]["concepts"]) == 14
changed = []
for before, after in zip(old["seed"]["concepts"], seed["concepts"]):
    assert before["block"] == after["block"]
    assert normalize_prose_layout(before["text"]) == after["text"], after["block"]
    if before["text"] != after["text"]:
        changed.append(after["block"])

draft = {**old["draft"], "seed_sha256": digest(seed)}
review = {**old["review"], "seed_sha256": digest(seed), "draft_sha256": digest(draft)}
assert {key: value for key, value in draft.items() if key != "seed_sha256"} == \
       {key: value for key, value in old["draft"].items() if key != "seed_sha256"}
assert {key: value for key, value in review.items() if key not in {"seed_sha256", "draft_sha256"}} == \
       {key: value for key, value in old["review"].items() if key not in {"seed_sha256", "draft_sha256"}}
for name, document in [("draft", draft), ("review", review)]:
    write_seed(output / f"{name}.json", document, ROOT)
record = {
    "schema": "stemrobin1846/representation-only-choice-refresh@1",
    "cwd": str(ROOT), "sameInvocation": True,
    "original": {name: {"path": str(file), "sha256": file_hash(file),
                        "canonical_sha256": digest(old[name])}
                 for name, file in old_paths.items()},
    "current": {name: {"path": str(output / f"{name}.json"),
                       "sha256": file_hash(output / f"{name}.json"),
                       "canonical_sha256": digest(document)}
                for name, document in [("seed", seed), ("draft", draft), ("review", review)]},
    "changedConceptBlocks": changed,
    "conceptChangesExactlyNativeProseNormalization": True,
    "all34ExerciseProjectionsExactIncludingGroupPrefix": True,
    "allQuestionsOptionsRationalesCoverageSolutionsAndReviewsExact": True,
    "semanticOrDisplayReviewReplayed": False,
    "choiceRetentionInternalGate": "PENDING",
    "completedLessons": 0, "parentImageViews": 0, "paidCalls": 0,
}
write_seed(output / "binding-refresh.json", record, ROOT)
print(json.dumps({"path": str(output / "binding-refresh.json"),
                  "sha256": file_hash(output / "binding-refresh.json"),
                  "changedConceptBlocks": changed,
                  "seed_sha256": digest(seed), "draft_sha256": digest(draft)}))
