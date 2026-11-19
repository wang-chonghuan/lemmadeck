import datetime
import hashlib
import json
import os
from pathlib import Path

ROOT = Path("/Users/yong/.codex/worktrees/d9b1/lemmadeck")
assert Path.cwd() == ROOT
OWN = Path(".intentfold/tickets/STEMROBIN-182/tmp/resume182-11/n36-choice-review-affected")
projection_path = OWN / "learner-view.json"
projection = json.loads(projection_path.read_bytes())
project_receipt = json.loads((OWN / "02-view-projection.json").read_bytes())
assert hashlib.sha256(projection_path.read_bytes()).hexdigest() == project_receipt["projection"]["byte_sha256"]
evidence_path = OWN / "view-analysis.json"
raw = evidence_path.read_bytes()
evidence = json.loads(raw)
rows = evidence["question_reviews"]
assert [row["question_id"] for row in rows] == [row["id"] for row in projection]
for visible, review in zip(projection, rows):
    math = review["mathematics"]
    assert [option["id"] for option in visible["view"]["options"]] == [
        option["option_id"] for option in math["option_checks"]
    ]
    assert set(math["correct"]) == {
        option["option_id"] for option in math["option_checks"] if option["truth"] == "correct"
    }
    assert visible["view"]["mode"] != "single" or len(math["correct"]) == 1
assert sum(len(row["mathematics"]["option_checks"]) for row in rows) == 8
os.chmod(evidence_path, 0o444)
record = {
    "stage": "2b",
    "frozen_at_utc": datetime.datetime.now(datetime.timezone.utc).isoformat(),
    "cwd": str(ROOT),
    "prior_receipt_byte_sha256": hashlib.sha256((OWN / "02-view-projection.json").read_bytes()).hexdigest(),
    "draft_canonical_sha256": project_receipt["draft"]["canonical_sha256"],
    "evidence": {
        "path": str(evidence_path),
        "byte_sha256": hashlib.sha256(raw).hexdigest(),
        "canonical_sha256": hashlib.sha256(
            json.dumps(evidence, sort_keys=True, ensure_ascii=True, separators=(",", ":")).encode()
        ).hexdigest(),
    },
    "frozen_checks": ["task_fidelity", "redundancy", "answer_leakage", "independent_complete_true_sets", "every_option", "source774_visible_coverage"],
    "question_count": 2,
    "option_count": 8,
    "internal_disclosure": False,
    "new_image_opens": 0,
}
receipt_path = OWN / "03-view-freeze.json"
with receipt_path.open("x", encoding="utf-8") as stream:
    json.dump(record, stream, indent=2)
    stream.write("\n")
os.chmod(receipt_path, 0o444)
print(json.dumps(record, indent=2))
