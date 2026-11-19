import copy
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
AFFECTED = {"q774-line-graphical", "q774-reciprocal-graphical"}


def load(path):
    return json.loads(path.read_bytes())


def canonical(value):
    return json.dumps(value, sort_keys=True, ensure_ascii=True, separators=(",", ":")).encode()


def digest(value):
    return hashlib.sha256(canonical(value)).hexdigest()


def byte_hash(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def save(name, value):
    path = OWN / name
    with path.open("x", encoding="utf-8") as stream:
        json.dump(value, stream, indent=2)
        stream.write("\n")
    os.chmod(path, 0o444)
    return {"path": str(path), "byte_sha256": byte_hash(path), "canonical_sha256": digest(value)}


def changed_fields(before, after, prefix=""):
    if before == after:
        return []
    if isinstance(before, dict) and isinstance(after, dict):
        result = []
        for key in sorted(set(before) | set(after)):
            name = f"{prefix}.{key}" if prefix else key
            if key not in before or key not in after:
                result.append(name)
            else:
                result.extend(changed_fields(before[key], after[key], name))
        return result
    return [prefix]


source_receipt = load(OWN / "01-source-inheritance.json")
freeze = load(OWN / "03-view-freeze.json")
disclosure = load(OWN / "04-internal-disclosure.json")
assert byte_hash(OWN / "view-analysis.json") == freeze["evidence"]["byte_sha256"]
assert byte_hash(B / "n36-choice-repaired/seed.json") == source_receipt["seed"]["byte_sha256"]
assert byte_hash(B / "n36-choice-repaired/draft.json") == disclosure["draft"]["byte_sha256"]
assert byte_hash(B / "n36-choice-repaired/affected-repair.json") == disclosure["affected_repair"]["byte_sha256"]
assert byte_hash(FIRST / "review.json") == "35f58d9c9b25e17f9cef78643147b6579948d4f8de9300b75b69c717778033ed"
assert byte_hash(B / "n36-author/draft.json") == "1b169d2605d50f09cbbca25490b4cb5ea4220d803fb5678f6dcf2a811018f4a9"
assert byte_hash(B / "n36-774-figures-independent-FIRST.json") == "1e2ee7624db1578ffe1d8a4960bed583d228a7bfb929a5fa0f7293f17a9ca721"

seed = load(B / "n36-choice-repaired/seed.json")
old = load(B / "n36-author/draft.json")
new = load(B / "n36-choice-repaired/draft.json")
prior = load(FIRST / "review.json")
graph_gate = load(B / "n36-774-figures-independent-FIRST.json")
assert digest(new) == freeze["draft_canonical_sha256"] == disclosure["draft"]["canonical_sha256"]
assert digest(old) == prior["draft_sha256"]
assert digest(seed) == prior["seed_sha256"]
assert set(old) == set(new)
assert {k: v for k, v in old.items() if k not in ("questions", "coverage", "new_figures")} == {
    k: v for k, v in new.items() if k not in ("questions", "coverage", "new_figures")
}
assert [q["id"] for q in old["questions"]] == [q["id"] for q in new["questions"]]
old_q = {q["id"]: q for q in old["questions"]}
new_q = {q["id"]: q for q in new["questions"]}
changed_q = {qid for qid in new_q if new_q[qid] != old_q[qid]}
assert changed_q == AFFECTED
assert all(new_q[qid]["key"] == old_q[qid]["key"] for qid in new_q)
assert all(new_q[qid]["source_numbers"] == old_q[qid]["source_numbers"] for qid in new_q)
allowed = {
    "view.stem", "view.figure_ids",
    "intent.task", "intent.limitations", "intent.figure_observations",
}
question_deltas = []
for qid in [q["id"] for q in new["questions"] if q["id"] in AFFECTED]:
    fields = changed_fields(old_q[qid], new_q[qid])
    assert set(fields) <= allowed
    question_deltas.append({
        "question_id": qid, "changed_fields": fields,
        "old_canonical_sha256": digest(old_q[qid]),
        "new_canonical_sha256": digest(new_q[qid]),
        "key_unchanged": True, "options_unchanged": old_q[qid]["view"]["options"] == new_q[qid]["view"]["options"],
    })
old_c = {row["source_number"]: row for row in old["coverage"]}
new_c = {row["source_number"]: row for row in new["coverage"]}
assert set(old_c) == set(new_c)
assert [row["source_number"] for row in old["coverage"]] == [row["source_number"] for row in new["coverage"]]
changed_c = {number for number in new_c if new_c[number] != old_c[number]}
assert changed_c == {"774"}
assert old_c["774"]["question_ids"] == new_c["774"]["question_ids"]
assert set(changed_fields(old_c["774"], new_c["774"])) <= {"omitted_tasks", "reason"}
assert new_c["774"]["omitted_tasks"] and all(new_q[qid]["intent"]["limitations"] for qid in AFFECTED)

old_reviews = {row["question_id"]: row for row in prior["question_reviews"]}
unchanged = []
for qid in [q["id"] for q in new["questions"] if q["id"] not in AFFECTED]:
    assert all(old_reviews[qid][name]["verdict"] == "pass" for name in (
        "task_fidelity", "redundancy", "answer_leakage", "mathematics"
    ))
    unchanged.append({
        "question_id": qid, "question_canonical_sha256": digest(new_q[qid]),
        "inherited_review_canonical_sha256": digest(old_reviews[qid]),
        "all_checks": "pass", "inherited_verbatim": True,
    })
assert len(unchanged) == 19

prior_sources = {row["source_number"]: row for row in prior["source_reviews"]}
inherited_sources = []
for number in [row["source_number"] for row in prior["source_reviews"] if row["source_number"] != "774"]:
    assert prior_sources[number]["coverage"]["verdict"] == "pass"
    inherited_sources.append({
        "source_number": number, "coverage_record_canonical_sha256": digest(new_c[number]),
        "inherited_source_review_canonical_sha256": digest(prior_sources[number]),
        "inherited_verbatim": True,
    })
assert len(inherited_sources) == 15

approved = {row["id"]: row for row in graph_gate["figures"]}
new_figures = {row["id"]: row for row in new["new_figures"]}
assert set(new_figures) == set(approved) and len(new_figures) == 2
graph_bindings = []
for fid, figure in new_figures.items():
    path = Path(figure["path"])
    assert not path.is_absolute() and ".." not in path.parts
    assert path.resolve().is_relative_to(
        (ROOT / "ssot-resources/soviet10year-textbooks/artifacts/7a/editions/modern-us-neutral/lessons/alg7-c4-s2-n36/choice-set/figures").resolve()
    )
    assert figure["sha256"] == approved[fid]["svg"]["sha256"] == byte_hash(path)
    graph_bindings.append({
        "figure_id": fid, "retained_path": str(path),
        "retained_byte_sha256": byte_hash(path), "approved_svg_sha256": approved[fid]["svg"]["sha256"],
        "basis": figure["basis"], "new_image_opens": 0,
    })

inheritance = {
    "scope": "Unchanged records are copied, not semantically re-reviewed.",
    "prior_review": {
        "path": str(FIRST / "review.json"), "byte_sha256": byte_hash(FIRST / "review.json"),
        "outcome": "blocked, preserved",
    },
    "source_solution": source_receipt["source_path"],
    "source_solution_byte_sha256": source_receipt["source_byte_sha256"],
    "all_source_solutions_inherited": True,
    "unchanged_questions": unchanged,
    "unchanged_source_coverages": inherited_sources,
    "independent_figure_gate": source_receipt["inherited_figure_gate"],
    "figure_bindings": graph_bindings,
    "new_image_opens": 0,
}
delta = {
    "original_draft": {"path": str(B / "n36-author/draft.json"), "byte_sha256": byte_hash(B / "n36-author/draft.json"), "canonical_sha256": digest(old)},
    "repaired_draft": disclosure["draft"],
    "seed_unchanged": True,
    "changed_question_count": 2,
    "unchanged_question_count": 19,
    "question_deltas": question_deltas,
    "all_21_keys_and_rationales_unchanged": True,
    "all_options_unchanged": True,
    "coverage_delta": {
        "source_number": "774", "changed_fields": changed_fields(old_c["774"], new_c["774"]),
        "old_canonical_sha256": digest(old_c["774"]), "new_canonical_sha256": digest(new_c["774"]),
        "unchanged_source_coverage_count": 15,
    },
    "new_figure_count": 2, "figure_bindings": graph_bindings,
    "affected_repair_notice": disclosure["affected_repair"],
    "differences_independently_computed": True,
    "new_image_opens": 0,
}
inheritance_ref = save("inheritance.json", inheritance)
delta_ref = save("delta.json", delta)

blind = load(OWN / "view-analysis.json")
comparison_path = OWN / "internal-comparison.json"
comparison = load(comparison_path)
comparison_rows = {row["question_id"]: row for row in comparison["questions"]}
replacements = {}
for row in copy.deepcopy(blind["question_reviews"]):
    qid = row["question_id"]
    assert set(row["mathematics"]["correct"]) == set(new_q[qid]["key"]["correct"])
    rationales = {value["option_id"]: value for value in new_q[qid]["key"]["rationales"]}
    for option in row["mathematics"]["option_checks"]:
        oid = option["option_id"]
        assert option["truth"] == rationales[oid]["truth"]
        option["evidence"] += " Post-freeze author derivation/misconception comparison: " + comparison_rows[qid]["rationale_checks"][oid]
    row["mathematics"]["independent_solution"] += " Post-freeze intent comparison: " + comparison_rows[qid]["intent_check"]
    replacements[qid] = row

review = copy.deepcopy(prior)
review["seed_sha256"] = digest(seed)
review["draft_sha256"] = digest(new)
review["reviewer"] = {
    "kind": "independent_agent",
    "identity": "Codex independent n36 reviewer, not the question or graph author; affected-only source->view->key gate for the two 774 units, with frozen source solutions, 19 unchanged PASS records and prior independent 2/2 actual-image PASS inherited.",
}
review["question_reviews"] = [
    replacements[row["question_id"]] if row["question_id"] in AFFECTED else row
    for row in review["question_reviews"]
]
for row in review["source_reviews"]:
    if row["source_number"] == "774":
        row["coverage"] = comparison["source_774_coverage"]
review["figure_checks"] = []
for fid, figure in new_figures.items():
    observed = approved[fid]["findings"]
    image_evidence = " ".join(
        row["evidence"] for row in observed if row["check"] in {
            "grid, scales, domains and visible window",
            "actual-image completeness and intersection readability",
            "actual-image completeness and approximate intersection reading",
            "no answer markers or leakage",
            "hash binding, rendering and text size",
        }
    )
    review["figure_checks"].append({
        "figure_id": fid, "asset_path": figure["path"], "asset_sha256": figure["sha256"],
        "observation": "Inherited actual-image inspection from n36-774-figures-independent-FIRST.json: its complete 640x640 current preview was opened once in that prior independent gate; retained SVG bytes match exactly. No image is reopened in this affected review. " + image_evidence,
    })
review["new_figure_reviews"] = copy.deepcopy(graph_gate["new_figure_reviews"])
for row in review["new_figure_reviews"]:
    assert row["asset_sha256"] == new_figures[row["figure_id"]]["sha256"]

verdicts = [row["coverage"]["verdict"] for row in review["source_reviews"]]
for row in review["question_reviews"]:
    verdicts.extend(row[name]["verdict"] for name in ("task_fidelity", "redundancy", "answer_leakage", "mathematics"))
verdicts.extend(row["verdict"] for row in review["new_figure_reviews"])
review["outcome"] = "blocked" if "blocked" in verdicts else "revise" if "revise" in verdicts else "pass"
assert len(review["question_reviews"]) == 21 and len(review["source_reviews"]) == 16
assert sum(len(row["mathematics"]["option_checks"]) for row in review["question_reviews"]) == 96
review_ref = save("review.json", review)
os.chmod(comparison_path, 0o444)
record = {
    "stage": "3-complete",
    "frozen_at_utc": datetime.datetime.now(datetime.timezone.utc).isoformat(),
    "cwd": str(ROOT),
    "prior_receipt_byte_sha256": byte_hash(OWN / "04-internal-disclosure.json"),
    "inheritance": inheritance_ref, "delta": delta_ref,
    "internal_comparison": {"path": str(comparison_path), "byte_sha256": byte_hash(comparison_path)},
    "review": review_ref,
    "seed_sha256": digest(seed), "draft_sha256": digest(new),
    "source_count": 16, "question_count": 21, "option_count": 96,
    "affected_question_count": 2, "affected_option_count": 8,
    "inherited_question_count": 19, "inherited_option_count": 88,
    "affected_source_coverage_count": 1, "inherited_source_coverage_count": 15,
    "inherited_source_solution_count": 16,
    "new_figure_count": 2, "inherited_independent_figure_passes": 2,
    "independent_frozen_true_sets_changed": False,
    "frozen_view_verdicts_changed": False,
    "first_blocked_review_preserved": True,
    "new_image_opens": 0,
    "outcome": review["outcome"],
}
save("05-review-freeze.json", record)
print(json.dumps(record, indent=2))
