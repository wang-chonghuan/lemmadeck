import datetime
import hashlib
import json
import os
from pathlib import Path

ROOT = Path("/Users/yong/.codex/worktrees/d9b1/lemmadeck")
assert Path.cwd() == ROOT
B = Path(".intentfold/tickets/STEMROBIN-182/tmp/resume182-11")
OWN = B / "n36-choice-review-affected"
FIRST = B / "n36-choice-review-FIRST"


def digest(value):
    return hashlib.sha256(
        json.dumps(value, sort_keys=True, ensure_ascii=True, separators=(",", ":")).encode()
    ).hexdigest()


def byte_hash(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


source_path = FIRST / "source-solutions.json"
assert byte_hash(source_path) == "ca83f10b2007aebafc8a943883359d1b041565687e0d3b1bd3f88e6d46e72dcc"
source = json.loads(source_path.read_bytes())
solution = next(row for row in source["source_reviews"] if row["source_number"] == "774")
old_seed_path = B / "n36-author/seed.json"
seed_path = B / "n36-choice-repaired/seed.json"
old_seed = json.loads(old_seed_path.read_bytes())
seed = json.loads(seed_path.read_bytes())
assert {k: v for k, v in seed.items() if k != "trace"} == {
    k: v for k, v in old_seed.items() if k != "trace"
}, "Unexpected source content change; cannot inherit frozen solutions"
assert seed["trace"][1:] == old_seed["trace"][1:], "Lesson input trace changed"
exercise = next(row for row in seed["exercises"] if row["number"] == "774")

figure_review_path = B / "n36-774-figures-independent-FIRST.json"
assert byte_hash(figure_review_path) == "1e2ee7624db1578ffe1d8a4960bed583d228a7bfb929a5fa0f7293f17a9ca721"
figure_gate = json.loads(figure_review_path.read_bytes())
assert figure_gate["status"] == "pass"
assert len(figure_gate["new_figure_reviews"]) == 2
assert byte_hash(FIRST / "review.json") == "35f58d9c9b25e17f9cef78643147b6579948d4f8de9300b75b69c717778033ed"
record = {
    "stage": 1,
    "frozen_at_utc": datetime.datetime.now(datetime.timezone.utc).isoformat(),
    "cwd": str(ROOT),
    "seed": {
        "path": str(seed_path),
        "byte_sha256": byte_hash(seed_path),
        "canonical_sha256": digest(seed),
    },
    "source_content_unchanged": True,
    "source_path": str(source_path),
    "source_byte_sha256": byte_hash(source_path),
    "inherited_source_review": solution,
    "exercise": exercise,
    "definitions": source["definitions"],
    "source_resolved_by": "Reuse of independently solved source 774 frozen before the original draft, not a new solve of unrelated sources.",
    "inherited_figure_gate": {
        "path": str(figure_review_path),
        "byte_sha256": byte_hash(figure_review_path),
        "approved_svg_hashes": {
            row["figure_id"]: row["asset_sha256"]
            for row in figure_gate["new_figure_reviews"]
        },
    },
    "disclosure": "No repaired draft or affected-repair internals read before source inheritance freeze.",
    "new_image_opens": 0,
}
path = OWN / "01-source-inheritance.json"
with path.open("x", encoding="utf-8") as stream:
    json.dump(record, stream, indent=2)
    stream.write("\n")
os.chmod(path, 0o444)
print(json.dumps(record, ensure_ascii=False, indent=2))
