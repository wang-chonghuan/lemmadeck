"""Bind the eight-fragment repair to the frozen review, without re-solving."""

import copy
import hashlib
import json
from pathlib import Path

OUT = Path(__file__).resolve().parent
TMP = OUT.parent
REPO = TMP.parents[3]


def load(path):
    return json.loads(path.read_text())


def digest(value):
    data = json.dumps(value, sort_keys=True, ensure_ascii=True, separators=(",", ":")).encode()
    return hashlib.sha256(data).hexdigest()


def fact(path):
    data = path.read_bytes()
    return {
        "path": str(path.relative_to(REPO)),
        "bytes": len(data),
        "sha256": hashlib.sha256(data).hexdigest(),
    }


def differences(before, after, path=""):
    if type(before) is not type(after):
        return [path]
    if isinstance(before, dict):
        if before.keys() != after.keys():
            return [path]
        return [item for key in before for item in differences(before[key], after[key], f"{path}.{key}".lstrip("."))]
    if isinstance(before, list):
        if len(before) != len(after):
            return [path]
        return [item for index, pair in enumerate(zip(before, after)) for item in differences(*pair, f"{path}[{index}]")]
    return [] if before == after else [path]


old_review = load(OUT / "final-review.json")
old_findings = load(OUT / "final-findings.json")
delta_path = TMP / "5m-n43/local-loss-repair.json"
delta = load(delta_path)
before_path = TMP / "5m-n43/rejected-missing-local-loss/draft.json"
after_path = TMP / "5m-n43/draft.json"
before, after = load(before_path), load(after_path)
seed_path, view_path = TMP / "5m-n43/seed.json", TMP / "5m-n43/view.json"
assert fact(before_path)["sha256"] == old_findings["draft"]["sha256"] == delta["before"]["sha256"]
assert fact(after_path)["sha256"] == delta["after"]["sha256"]
assert digest(before) == old_review["draft_sha256"]
assert fact(seed_path) == old_findings["seed"]
assert fact(view_path) == old_findings["view"]
for frozen in old_findings["frozen_pure_view_records"]:
    assert fact(REPO / frozen["path"]) == frozen
assert fact(OUT / "final-review.json")["sha256"] == "ed0e4a5ddcb57f5cdf723ee9152fb2742a746cc4cf1e405052c17fcc71d89c20"
assert fact(OUT / "final-findings.json")["sha256"] == "9570d18667faedf3e54e68dae27587bf4e07ca07b73b25b70eb190ab149a6c16"

expected_indices = [0, 1, 4, 5, 8, 9, 10, 11]
expected_paths = {f"questions[{index}].intent.limitations" for index in expected_indices}
assert set(differences(before, after)) == expected_paths
assert set(change["path"] for change in delta["changes"]) == expected_paths
normalized_after = copy.deepcopy(after)
for index in expected_indices:
    normalized_after["questions"][index]["intent"]["limitations"] = before["questions"][index]["intent"]["limitations"]
assert normalized_after == before
for change in delta["changes"]:
    index = int(change["path"].split("[")[1].split("]")[0])
    assert before["questions"][index]["id"] == after["questions"][index]["id"] == change["question"]
    assert before["questions"][index]["intent"]["limitations"] == change["before"]
    assert after["questions"][index]["intent"]["limitations"] == change["after"]

judgments = {
    "two-smaller-fraction-comparisons": "Explicitly records that selecting the two smaller values does not establish independently producing both comparisons, and that one pair may suffice for elimination.",
    "two-larger-fraction-comparisons": "Explicitly records that selecting the two larger values does not establish independently computing and writing both comparisons, and that one pair may suffice for elimination.",
    "two-pipe-volume-fractions-and-less-water": "Retains the common-capacity clarification and adds the lost autonomous rate-model construction and full volume/comparison calculations; local elimination can reduce the performed work.",
    "two-equal-log-piece-lengths": "Retains the ideal equal-part model and adds the lost autonomous two-division and common-denominator comparison work; local elimination can reduce the performed work.",
    "two-negative-substitution-expression-values": "Explicitly records the lost autonomous expansion, negative-input substitution, and complete working for both expressions, including possible one-expression elimination.",
    "four-unequal-denominator-relation-records": "Explicitly records that choosing a four-relation record does not establish independently computing all four comparisons; one erroneous position can eliminate an entire candidate.",
    "fraction-from-numerator-denominator-sum-gap": "Explicitly distinguishes checking supplied numerator/denominator candidates from independently building and solving the sum/difference equations.",
    "negative-division-and-subtracted-bracket": "Explicitly records the lost autonomous quotient, product, bracket, and subtraction-of-a-negative working behind the final selected value.",
}
pure = load(OUT / "viewchecks.json")
frozen_questions = {entry["question_id"]: entry for entry in pure["question_reviews"]}
review = copy.deepcopy(old_review)
review["draft_sha256"] = digest(after)
review["outcome"] = "pass"
for entry in review["question_reviews"]:
    question_id = entry["question_id"]
    if question_id in judgments:
        entry["task_fidelity"] = copy.deepcopy(frozen_questions[question_id]["task_fidelity"])
        entry["task_fidelity"]["evidence"] += " Narrow repaired internal review: " + judgments[question_id]
        assert entry["task_fidelity"]["verdict"] == "pass"
for entry in review["source_reviews"]:
    old_note = "coverage.reason acknowledges production loss; the inconsistency is its absence from eight question-local limitations lists, not an omitted source problem."
    new_note = "coverage.reason acknowledges production loss; the eight formerly inconsistent question-local limitations now explicitly register that loss. No source problem was omitted."
    entry["coverage"]["evidence"] = entry["coverage"]["evidence"].replace(old_note, new_note)

findings = copy.deepcopy(old_findings)
findings.update({
    "draft": fact(after_path),
    "draft_sha256": digest(after),
    "findings": [],
    "outcome": "pass",
    "review_path": str((OUT / "revised-final-review.json").relative_to(REPO)),
    "prior_review": fact(OUT / "final-review.json"),
    "prior_findings": fact(OUT / "final-findings.json"),
    "preserved_before_draft": fact(before_path),
    "repair_delta": fact(delta_path),
    "changed_fields_verified": sorted(expected_paths),
    "repair_reviews": [
        {
            "question_id": change["question"],
            "before": change["before"],
            "after": change["after"],
            "verdict": "pass",
            "evidence": judgments[change["question"]],
        }
        for change in delta["changes"]
    ],
    "retained_frozen_judgment": "All 12 source solutions, 12 keys, 37 option truth/rationale comparisons, coverage and pure-view judgments are inherited unchanged from the frozen original independent comparison. Only eight repaired local loss fragments were re-reviewed.",
    "execution": "Bounded JSON delta equality and required SHA-256 snapshot binding only; no source or pure-view re-solve, repeated structural validation, canonical command, or author modification.",
})
for name, payload in [
    ("revised-final-review.json", review),
    ("revised-final-findings.json", findings),
]:
    with (OUT / name).open("x") as handle:
        handle.write(json.dumps(payload, ensure_ascii=False, indent=2) + "\n")
print(json.dumps({
    "review": fact(OUT / "revised-final-review.json"),
    "findings": fact(OUT / "revised-final-findings.json"),
    "draft_sha256": digest(after),
    "counts": findings["counts"],
    "changed_fields": len(expected_paths),
    "outcome": "pass",
}, indent=2))
