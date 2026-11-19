"""Preserve FIRST task metadata and record the affected-only counting correction."""

from collections import Counter
from datetime import datetime, timezone
import json
from stage import OWN, ROOT, REL, read, sha, digest, write, run, CHOICE
import sys


def replace_owned(name, value):
    with (OWN / name).open("w", encoding="utf-8") as stream:
        json.dump(value, stream, ensure_ascii=True, indent=2)
        stream.write("\n")


source = read(OWN / "source-solutions.json")
before = [s["solution"] for s in source["sources"]]
correction = read(OWN / "task-count-correction.json")
for s in source["sources"]:
    if s["source_number"] in correction["corrected_sources"]:
        s.update(correction["corrected_sources"][s["source_number"]])
assert before == [s["solution"] for s in source["sources"]]
assert sum(s["source_task_count"] for s in source["sources"]) == 76
source["stage"] = "counted projection of immutable pre-options source solutions"
source["source_solution_content_changes"] = False
source["first_frozen_file_sha256"] = sha(OWN / "source-solutions.json")
write("source-solutions-counted.json", source)

task_map = read(OWN / "task-coverage.json")
write("task-coverage-FIRST.json", task_map)
items = read(OWN / "author-items.json")
by_id = {item["id"]: item for item in items}
for mapping in task_map["mapping"]:
    mapping["source_task_ids"] = by_id[mapping["question_id"]]["task_ids"]
for s in source["sources"]:
    actual = [task for m in task_map["mapping"] if m["source_number"] == s["source_number"]
              for task in m["source_task_ids"]]
    assert Counter(actual) == Counter(s["task_ids"]), s["source_number"]
task_map["source_count_by_original"] = {
    s["source_number"]: s["source_task_count"] for s in source["sources"]
}
task_map["correction_receipt"] = str(REL / "task-count-correction.json")
task_map["given_and_supplemental_graph_context"] = "exact given domain and full range/proof retained, not counted as extra requested tasks"
replace_owned("task-coverage.json", task_map)

draft_hash_before = sha(OWN / "draft.json")
views_hash_before = sha(OWN / "reviewer-views.json")
run("structural-validation-count-repair.json", [
    sys.executable, str(CHOICE / "validate.py"), "--repo", ".",
    "--seed", str(REL / "seed.json"), "--draft", str(REL / "draft.json"),
])
assert sha(OWN / "draft.json") == draft_hash_before
assert sha(OWN / "reviewer-views.json") == views_hash_before
freeze = read(OWN / "solve-freeze.json")
for file in freeze["files"]:
    assert sha(ROOT / file["path"]) == file["sha256"], file["path"]
inputs = read(OWN / "input-hashes.json")["inputs"]
preservation = [
    {"path": entry["path"], "original_sha256": entry["sha256"],
     "current_sha256": sha(ROOT / entry["path"]),
     "unchanged": sha(ROOT / entry["path"]) == entry["sha256"]}
    for entry in inputs
]
assert all(entry["unchanged"] for entry in preservation)
write("preservation.json", {
    "checked_at": datetime.now(timezone.utc).isoformat(),
    "owned_write_directory": str(OWN),
    "all_authorized_inputs_unchanged": True,
    "frozen_pre_option_solutions_unchanged": True,
    "count_repair_changed_solution_prose": False,
    "count_repair_changed_draft_or_views": False,
    "checks": preservation,
    "statement": "No unrelated workspace diff was reverted or used as input. "
                 "No writes outside this owned scratch directory.",
})
write("author-status.json", {
    "status": "author_draft_ready_for_independent_review",
    "source_originals": 14, "requested_source_tasks": 76,
    "questions": 24, "single": 20, "multiple": 4,
    "seed_sha256": digest(read(OWN / "seed.json")),
    "draft_sha256": digest(read(OWN / "draft.json")),
    "structural_exit_code": 0,
    "semantic_review": "not performed or approved",
    "self_PASS": False,
    "first_metadata_error_preserved": True,
    "figure_loads": 2, "new_figures": 0, "new_renders": 0,
    "network": 0, "db": 0, "app": 0, "dependencies": 0,
    "integration": 0, "publishing": 0, "durable_writes": 0, "commits": 0,
})
files = sorted(p for p in OWN.iterdir() if p.is_file() and p.name != "hashes.json")
write("hashes.json", {
    "seed_canonical_sha256": digest(read(OWN / "seed.json")),
    "draft_canonical_sha256": digest(read(OWN / "draft.json")),
    "reviewer_views_canonical_sha256": digest(read(OWN / "reviewer-views.json")),
    "files": [{"path": str(p.relative_to(ROOT)), "sha256": sha(p)} for p in files],
})
print("Author draft recorded: 14 originals, 76 requested tasks, 24 questions. "
      "Count correction retained; frozen mathematics/draft/views unchanged; "
      "independent semantic review pending.")
