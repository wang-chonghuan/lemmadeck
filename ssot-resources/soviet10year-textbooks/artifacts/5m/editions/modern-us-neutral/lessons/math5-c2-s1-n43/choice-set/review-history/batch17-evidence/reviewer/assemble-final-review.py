"""Assemble the contract review from frozen reasoning; no validation command."""

import hashlib
import json
from pathlib import Path

OUT = Path(__file__).resolve().parent
TMP = OUT.parent
REPO = TMP.parents[3]


def load(path):
    return json.loads(path.read_text())


def digest(value):
    encoded = json.dumps(value, sort_keys=True, ensure_ascii=True, separators=(",", ":")).encode()
    return hashlib.sha256(encoded).hexdigest()


def file_fact(path):
    data = path.read_bytes()
    return {
        "path": str(path.relative_to(REPO)),
        "bytes": len(data),
        "sha256": hashlib.sha256(data).hexdigest(),
    }


seed_path = TMP / "5m-n43/seed.json"
draft_path = TMP / "5m-n43/draft.json"
view_path = TMP / "5m-n43/view.json"
seed = load(seed_path)
draft = load(draft_path)
view = load(view_path)
source = load(OUT / "source-solutions.json")
pure = load(OUT / "viewchecks.json")
comparison = load(OUT / "final-comparison.json")
frozen = {
    "source-solutions.json": "afd909669ee80e23d1cd002690f70b10097faf5f14bb2d6e99c3ad2bccd58bff",
    "viewchecks.json": "8964e08c41cf4e5adb585963a18d7614f187802c086e5ae2983a8efb37aadffb",
    "findings.json": "78600aef71ab7a38e9b8e63c12fddb7814b3c28274db2abf4f2c58fd943c005a",
}
for name, expected in frozen.items():
    if file_fact(OUT / name)["sha256"] != expected:
        raise RuntimeError(f"Frozen pure-view record changed: {name}")
if file_fact(seed_path)["sha256"] != pure["binding"]["seed_file_sha256"]:
    raise RuntimeError("Seed changed since independent source solve.")
projection = {
    "questions": [
        {"id": q["id"], "source_numbers": q["source_numbers"], "view": q["view"]}
        for q in draft["questions"]
    ]
}
if projection != view or file_fact(view_path)["sha256"] != pure["binding"]["view_file_sha256"]:
    raise RuntimeError("Current draft view differs from the frozen reviewed view.")
author_questions = {entry["id"]: entry for entry in draft["questions"]}
for entry in pure["question_reviews"]:
    key = author_questions[entry["question_id"]]["key"]
    if set(key["correct"]) != set(entry["mathematics"]["correct"]):
        raise RuntimeError("Author key differs from the manually compared frozen true set.")
    truths = {item["option_id"]: item["truth"] for item in key["rationales"]}
    if truths != {item["option_id"]: item["truth"] for item in entry["mathematics"]["option_checks"]}:
        raise RuntimeError("Author rationale truth differs from the manually compared frozen truth.")

loss = comparison["loss_registration_finding"]
affected = set(loss["empty_question_limitations"] + loss["model_only_question_limitations"])
question_reviews = []
for entry in pure["question_reviews"]:
    result = {key: value for key, value in entry.items() if key != "source_numbers"}
    if entry["question_id"] in affected:
        result["task_fidelity"] = {
            "verdict": "revise",
            "evidence": entry["task_fidelity"]["evidence"] + " "
            + "After authorized internal comparison: " + loss["evidence"],
        }
    question_reviews.append(result)

source_reviews = [
    {
        "source_number": entry["source_number"],
        "independent_solution": json.dumps(entry["independent_solution"], ensure_ascii=False),
        "coverage": {
            "verdict": "pass",
            "evidence": entry["coverage_expectations"] + " "
            + comparison["coverage_comparison"]["evidence"],
        },
    }
    for entry in source["source_reviews"]
]
review = {
    "schema": "s10y-choice-review-v1",
    "seed_sha256": digest(seed),
    "draft_sha256": digest(draft),
    "reviewer": pure["reviewer"],
    "source_reviews": source_reviews,
    "figure_checks": [],
    "new_figure_reviews": [],
    "question_reviews": question_reviews,
    "outcome": comparison["outcome"],
}
trace = []
for entry in seed["trace"]:
    fact = file_fact(REPO / entry["path"])
    trace.append({**fact, "seed_trace_sha256": entry["sha256"], "matches": fact["sha256"] == entry["sha256"]})
findings = {
    "schema": "s10y-choice-independent-final-findings-v1",
    "seed": file_fact(seed_path),
    "draft": file_fact(draft_path),
    "view": file_fact(view_path),
    "seed_sha256": digest(seed),
    "draft_sha256": digest(draft),
    "source_trace_hashes": trace,
    "frozen_pure_view_records": [file_fact(OUT / name) for name in frozen],
    "counts": comparison["counts"],
    "key_comparisons": 12,
    "rationale_comparisons": 37,
    "mathematics_outcome": comparison["mathematics_outcome"],
    "findings": [loss],
    "internal_comparison": file_fact(OUT / "final-comparison.json"),
    "review_path": str((OUT / "final-review.json").relative_to(REPO)),
    "outcome": comparison["outcome"],
    "execution": "Artifact assembly and contract-required SHA-256 snapshot binding only. No validate.py/canonical command, author modification, or source-content re-solve.",
}
for name, payload in [("final-review.json", review), ("final-findings.json", findings)]:
    with (OUT / name).open("x") as handle:
        handle.write(json.dumps(payload, ensure_ascii=False, indent=2) + "\n")
print(json.dumps({
    "review": file_fact(OUT / "final-review.json"),
    "findings": file_fact(OUT / "final-findings.json"),
    "seed_sha256": digest(seed),
    "draft_sha256": digest(draft),
    "author_seed_binding_matches": draft["seed_sha256"] == digest(seed),
    "all_source_trace_hashes_match": all(entry["matches"] for entry in trace),
    "outcome": review["outcome"],
}, indent=2))
