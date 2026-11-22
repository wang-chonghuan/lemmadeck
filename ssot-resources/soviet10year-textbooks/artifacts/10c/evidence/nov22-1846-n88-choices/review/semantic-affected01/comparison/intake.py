import hashlib
import json
from pathlib import Path


ROOT = Path("/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck")
OWN = ROOT / ".tmp/stemrobin-184-six/n88-choice-review/semantic-affected01/comparison"
BASE = ROOT / ".tmp/stemrobin-184-six"


def digest(value):
    data = json.dumps(value, sort_keys=True, ensure_ascii=True, separators=(",", ":"))
    return hashlib.sha256(data.encode("utf-8")).hexdigest()


def load_bound(path, expected):
    raw = path.read_bytes()
    actual = hashlib.sha256(raw).hexdigest()
    if actual != expected:
        raise RuntimeError(f"input hash mismatch: {path}: {actual}")
    return json.loads(raw), {"path": str(path), "bytes": len(raw), "sha256": actual}


draft, draft_binding = load_bound(
    BASE / "n88-choice-author02/repair02/recovery01/draft.json",
    "2fdb7491e95aaf2a3b08aa89ba8ca73d380c11c1b342e72c01a863833af32d3f",
)
draft_binding["canonical_sha256"] = digest(draft)
if draft_binding["canonical_sha256"] != "b5ee448de26147fd9c5085b8bb4d2b3a62f2fff32d2ec604319502af9d7ccff6":
    raise RuntimeError("draft canonical digest does not match blind snapshot")

prior, prior_binding = load_bound(
    BASE / "n88-choice-review/semantic/review.json",
    "060c8276d4a003f692d85d1cf13fbeb2292de195d79fce624dc05bd5676ba771",
)
truths, truth_binding = load_bound(
    BASE / "n88-choice-review/semantic-affected01/blind/option-truths.json",
    "e84f24f6b283a34b1b92f627ed2705dbb92c971e6bcfcddafbc785ee277fdec4",
)
receipt, receipt_binding = load_bound(
    BASE / "n88-choice-author02/repair02/recovery01/structural-recovery-execution.json",
    "b38630ef1b6db568693488dbc0ff15a731ab72f4e6a7349cc41a2945464872cf",
)

old_ids = [row["question_id"] for row in prior["question_reviews"]]
new_ids = [row["id"] for row in truths["questions"]]
if len(old_ids) != 6 or len(new_ids) != 12 or set(old_ids) & set(new_ids):
    raise RuntimeError("unexpected protected/new review partition")
questions = {row["id"]: row for row in draft["questions"]}
if set(questions) != set(old_ids) | set(new_ids):
    raise RuntimeError("draft question set differs from protected6 plus blind12")

new_questions = []
for identifier in new_ids:
    row = questions[identifier]
    frozen = next(item for item in truths["questions"] if item["id"] == identifier)
    if list(map(int, row["source_numbers"])) != frozen["source_numbers"]:
        raise RuntimeError(f"source mapping changed: {identifier}")
    option_ids = [option["id"] for option in row["view"]["options"]]
    if option_ids != [option["id"] for option in frozen["options"]]:
        raise RuntimeError(f"option identifiers changed: {identifier}")
    new_questions.append({
        "id": identifier,
        "source_numbers": row["source_numbers"],
        "intent": row["intent"],
        "key": row["key"],
        "option_ids": option_ids,
    })

payload = {
    "schema": "stemrobin1846/affected-key-comparison-intake@1",
    "bindings": {
        "draft": draft_binding,
        "prior_review": prior_binding,
        "blind_truths": truth_binding,
        "structural_receipt": receipt_binding,
    },
    "seed_sha256": draft["seed_sha256"],
    "draft_sha256": draft_binding["canonical_sha256"],
    "new_questions": new_questions,
    "coverage": draft["coverage"],
    "protected_question_reviews": prior["question_reviews"],
    "prior_source_reviews": prior["source_reviews"],
    "figure_checks": prior["figure_checks"],
    "new_figure_reviews": prior["new_figure_reviews"],
    "blind_truths": truths["questions"],
    "validator_receipt": receipt,
    "new_figures_count": len(draft["new_figures"]),
}
with (OWN / "intake.json").open("x", encoding="utf-8") as handle:
    json.dump(payload, handle, ensure_ascii=False, indent=2)
    handle.write("\n")

display = {
    "bindings": payload["bindings"],
    "protected_question_ids_only": old_ids,
    "new_figures_count": payload["new_figures_count"],
    "new_questions": new_questions,
    "coverage": draft["coverage"],
    "prior_coverage_only": [
        {"source_number": row["source_number"], "coverage": row["coverage"]}
        for row in prior["source_reviews"]
    ],
}
print(json.dumps(display, ensure_ascii=False, indent=2))
