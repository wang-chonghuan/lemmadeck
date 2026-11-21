import hashlib
import json
from pathlib import Path


ROOT = Path("/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck")
if Path.cwd() != ROOT:
    raise SystemExit("Wrong cwd")

SEED = ".tmp/stemrobin-184-six/n81-choice-source/seed.json"
LESSON = (
    "ssot-resources/soviet10year-textbooks/artifacts/10c/editions/"
    "modern-us-neutral/lessons/ana10-c6-s2-n81/lesson.json"
)
EXERCISES = (
    "ssot-resources/soviet10year-textbooks/artifacts/10c/editions/"
    "modern-us-neutral/lessons/ana10-c6-s2-n81/exercises.json"
)
paths = [SEED, LESSON, EXERCISES]
raw = {path: (ROOT / path).read_bytes() for path in paths}
data = {path: json.loads(raw[path]) for path in paths}
canonical = json.dumps(
    data[SEED], sort_keys=True, ensure_ascii=True, separators=(",", ":")
).encode("utf-8")
digest = hashlib.sha256(canonical).hexdigest()
assert digest == "c7440ae0b35ac66788bc7b7ed294ea30c24309852a8148b24d8a981bc842ea9b"
numbers = [str(number) for number in range(60, 69)]
seed = data[SEED]
exercises = data[EXERCISES]["exercises"]
assert [item["number"] for item in seed["exercises"]] == numbers
assert [item["number"] for item in exercises] == numbers
assert seed["figures"] == []
assert all(item["figure_ids"] == [] for item in seed["exercises"])
assert all(item["figure_refs"] == [] for item in exercises)
assert all(item["figures"] == [] for item in exercises)
assert all(item["group_id"] == "g1" for item in exercises)
assert len({item["group"] for item in exercises}) == 1
assert all(
    item["text"] == original["text"]
    for item, original in zip(seed["exercises"], exercises)
)
assert all(
    item["text"] == data[LESSON]["prose"][item["block"]]["text"]
    for item in seed["concepts"]
)
result = {
    "cwd": str(ROOT),
    "seed_canonical_sha256": digest,
    "input_byte_sha256": {
        path: hashlib.sha256(raw[path]).hexdigest() for path in paths
    },
    "source_numbers": numbers,
    "group_id": exercises[0]["group_id"],
    "group_text": exercises[0]["group"],
    "group_associations": [
        {
            "source_number": item["source_number"],
            "group_id": item["group_id"],
            "pages": item["pages"],
        }
        for item in exercises
    ],
    "concept_blocks": [item["block"] for item in seed["concepts"]],
    "zero_image_checks": "Seed figures, seed figure_ids, modern exercise figure_refs and figures are all empty.",
    "mathematical_proof_execution": False,
}
print(json.dumps(result, sort_keys=True, ensure_ascii=True, indent=2))
