import hashlib
import json
import sys
from pathlib import Path


ROOT = Path("/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck")
if Path.cwd() != ROOT:
    raise SystemExit("Wrong cwd")

OWN = ".tmp/stemrobin-184-six/n81-choice-review/"
AUTHOR = ".tmp/stemrobin-184-six/n81-choice-author/"
DRAFT = AUTHOR + "draft.json"
AUTHOR_SOURCE = AUTHOR + "source-solutions.json"
AUTHOR_GROUP = AUTHOR + "source-group-binding.json"
RELEASE = ".tmp/stemrobin-184-six/n81-choice-key-release.json"
VISIBLE = ".tmp/stemrobin-184-six/n81-choice-visible.json"
SOURCE = OWN + "source-solutions.json"
GROUP = OWN + "source-group.json"
SEMANTICS = OWN + "stage2-fidelity.json"
MATH = OWN + "stage2-mathematics.json"
COMPARISON = OWN + "stage3-comparison.json"
STAGE1 = OWN + "STAGE1-MANIFEST.json"
STAGE2 = OWN + "STAGE2-MANIFEST.json"
SELF = OWN + "assemble-stage3-review.py"
OUTPUT = OWN + "review.json"
RECEIPT = OWN + "stage3-assembly.json"
if any((ROOT / path).exists() for path in [OUTPUT, RECEIPT]):
    raise SystemExit("Assembly outputs already exist; refusing overwrite")
paths = [
    DRAFT, AUTHOR_SOURCE, AUTHOR_GROUP, RELEASE, VISIBLE, SOURCE, GROUP,
    SEMANTICS, MATH, COMPARISON, STAGE1, STAGE2, SELF,
]
raw = {path: (ROOT / path).read_bytes() for path in paths}
hashes = {path: hashlib.sha256(raw[path]).hexdigest() for path in paths}
expected = {
    DRAFT: "243dcf7a6f75770062ebbef8ca5ef216a71ef91034608ccdb4dda156d06fd739",
    AUTHOR_SOURCE: "e35e161c27f9344cd7cec9c887f0a40b2c9727babbbc6855d4ffb6b050ffb0e1",
    AUTHOR_GROUP: "d12cae57e6dce3b6b6be909d8e5fa4f7e504b4051fa81c2e7f87b21694ed06b9",
    RELEASE: "f0d43442f0f62053fbbfee9d17f20ac6ef31c80a5e44d8ede72e6fa790fc22b2",
    VISIBLE: "36819ec780c305bfddba09ae302bc4309118814d373c24d81913f7472282eddc",
    SOURCE: "3f1021b1308bb04eb5f3f809af07449176a5e797df6bdd703f1e700ef8ac7237",
    GROUP: "ddc932f60e1234e6421721088a0790625fa18ff0a1be242bc9ca685e6db4ac1b",
    SEMANTICS: "57219af425b5d4a4dc596f44515c2539f55b6cf5ee70ecffa18c175c8beb1413",
    MATH: "9983059497aeb601e1ee9e03c185a1a0638b32a307f8510161526e75a905707c",
    STAGE1: "2928ea511c486eb8fa5f2718d3b9034a481600f41c07c2b19e8488f7bd65cad8",
    STAGE2: "f357993e3e605373ec79c69261952a5a166203735ab5bede3ea0fd2fe330ce33",
}
assert all(hashes[path] == digest for path, digest in expected.items())
data = {path: json.loads(raw[path]) for path in paths if path.endswith(".json")}
draft = data[DRAFT]
canonical = json.dumps(
    draft, sort_keys=True, ensure_ascii=True, separators=(",", ":")
).encode("utf-8")
draft_digest = hashlib.sha256(canonical).hexdigest()
assert draft_digest == "c0ec2b5ab0c36753815a0a0b9384011e5f21a31697a3e9c157309b85d640fb1a"
visible = data[VISIBLE]
projected = {
    "schema": visible["schema"],
    "seed_sha256": draft["seed_sha256"],
    "questions": [
        {key: question[key] for key in ["id", "source_numbers", "view"]}
        for question in draft["questions"]
    ],
    "coverage": draft["coverage"],
}
assert projected == visible
assert draft["new_figures"] == []
assert data[AUTHOR_GROUP]["exact_group_text"] == data[GROUP]["shared_group"]["exact_text"]
assert data[AUTHOR_GROUP]["source_file_sha256"] == data[GROUP]["authority"]["original_file_byte_sha256"]
assert data[AUTHOR_SOURCE]["source_group_binding"]["file_sha256"] == hashes[AUTHOR_GROUP]
source_rows = data[SOURCE]["solutions"]
author_source_rows = data[AUTHOR_SOURCE]["solutions"]
semantics = data[SEMANTICS]
mathematics = data[MATH]
comparison = data[COMPARISON]
numbers = [str(number) for number in range(60, 69)]
assert [row["source_number"] for row in source_rows] == numbers
assert [row["source_number"] for row in author_source_rows] == numbers
assert [row["source_number"] for row in comparison["source_comparisons"]] == numbers
assert len(draft["questions"]) == len(mathematics["question_reviews"]) == 9


def aggregate(verdicts):
    if "blocked" in verdicts:
        return "blocked"
    if "revise" in verdicts:
        return "revise"
    assert all(verdict == "pass" for verdict in verdicts)
    return "pass"


source_reviews = []
for source, coverage, compared in zip(
    source_rows, semantics["source_coverage"], comparison["source_comparisons"]
):
    assert source["source_number"] == coverage["source_number"] == compared["source_number"]
    source_reviews.append({
        "source_number": source["source_number"],
        "independent_solution": source["independent_solution"],
        "coverage": {
            "verdict": aggregate([coverage["verdict"], compared["verdict"]]),
            "evidence": coverage["evidence"] + " Stage3 exact source comparison: " + compared["evidence"],
        },
    })

question_reviews = []
option_count = 0
for draft_question, semantic, solved, compared in zip(
    draft["questions"], semantics["question_reviews"],
    mathematics["question_reviews"], comparison["question_comparisons"],
):
    question_id = draft_question["id"]
    assert question_id == semantic["question_id"] == solved["question_id"] == compared["question_id"]
    frozen_math = solved["mathematics"]
    assert frozen_math["correct"] == compared["frozen_correct"]
    assert draft_question["key"]["correct"] == compared["author_correct"]
    frozen_checks = frozen_math["option_checks"]
    rationales = draft_question["key"]["rationales"]
    comparisons = compared["option_checks"]
    assert len(frozen_checks) == len(rationales) == len(comparisons)
    option_checks = []
    for frozen, author, checked in zip(frozen_checks, rationales, comparisons):
        assert frozen["option_id"] == author["option_id"] == checked["option_id"]
        assert frozen["truth"] == checked["frozen_truth"]
        assert author["truth"] == checked["author_truth"]
        assert author["derivation"]
        if author["truth"] == "correct":
            assert author["misconception"] is None
        else:
            assert isinstance(author["misconception"], str) and author["misconception"]
        if checked["verdict"] == "pass":
            assert frozen["truth"] == author["truth"]
        option_checks.append({
            "option_id": frozen["option_id"],
            "truth": frozen["truth"],
            "evidence": frozen["evidence"] + " Stage3 exact rationale/misconception comparison: " + checked["evidence"],
        })
    if compared["verdict"] == "pass":
        assert frozen_math["correct"] == draft_question["key"]["correct"]
    option_count += len(option_checks)
    question_reviews.append({
        "question_id": question_id,
        "task_fidelity": {
            "verdict": aggregate([semantic["task_fidelity"]["verdict"], compared["verdict"]]),
            "evidence": semantic["task_fidelity"]["evidence"] + " Stage3 intent/coverage comparison: " + compared["coverage_and_limitations"],
        },
        "redundancy": semantic["redundancy"],
        "answer_leakage": semantic["answer_leakage"],
        "mathematics": {
            "verdict": aggregate(
                [frozen_math["verdict"], compared["verdict"]]
                + [item["verdict"] for item in comparisons]
            ),
            "independent_solution": frozen_math["independent_solution"],
            "correct": frozen_math["correct"],
            "option_checks": option_checks,
        },
    })
assert option_count == 38
verdicts = [comparison["outcome"], comparison["group_and_authority"]["verdict"]]
verdicts.extend(row["coverage"]["verdict"] for row in source_reviews)
for row in question_reviews:
    verdicts.extend(row[key]["verdict"] for key in [
        "task_fidelity", "redundancy", "answer_leakage", "mathematics"
    ])
review = {
    "schema": "s10y-choice-review-v1",
    "seed_sha256": draft["seed_sha256"],
    "draft_sha256": draft_digest,
    "reviewer": comparison["reviewer"],
    "source_reviews": source_reviews,
    "figure_checks": [],
    "new_figure_reviews": [],
    "question_reviews": question_reviews,
    "outcome": aggregate(verdicts),
}
output_bytes = (json.dumps(review, ensure_ascii=True, indent=2) + "\n").encode("utf-8")
(ROOT / OUTPUT).write_bytes(output_bytes)
receipt = {
    "schema": "n81-choice-stage3-mechanical-assembly-v1",
    "cwd": str(ROOT),
    "argv": ["python3", OWN + "assemble-stage3-review.py"],
    "exit_code": 0,
    "input_byte_sha256": hashes,
    "author_view_and_coverage_exactly_match_frozen_projection": True,
    "draft_canonical_sha256": draft_digest,
    "output": {
        "path": OUTPUT,
        "byte_sha256": hashlib.sha256(output_bytes).hexdigest(),
        "bytes": len(output_bytes),
        "schema": review["schema"],
        "outcome": review["outcome"],
    },
    "counts": {"source_reviews": 9, "question_reviews": 9, "option_checks": option_count},
    "semantic_comparison_authority": COMPARISON,
    "source_or_option_proof_replay": False,
    "images_opened_or_decoded": 0,
    "note": "Mechanical assembly only; independent solutions/truths are copied unchanged from frozen evidence, with manual Stage3 derivation-comparison evidence appended.",
}
(ROOT / RECEIPT).write_text(json.dumps(receipt, ensure_ascii=True, indent=2) + "\n", encoding="utf-8")
print(json.dumps(receipt, ensure_ascii=True, indent=2))
