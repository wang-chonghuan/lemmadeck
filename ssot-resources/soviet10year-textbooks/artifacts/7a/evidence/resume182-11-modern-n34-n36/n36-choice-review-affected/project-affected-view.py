import datetime
import hashlib
import json
import os
from pathlib import Path

ROOT = Path("/Users/yong/.codex/worktrees/d9b1/lemmadeck")
assert Path.cwd() == ROOT
B = Path(".intentfold/tickets/STEMROBIN-182/tmp/resume182-11")
OWN = B / "n36-choice-review-affected"
SOURCE = OWN / "01-source-inheritance.json"
source = json.loads(SOURCE.read_bytes())
assert source["source_content_unchanged"]
path = B / "n36-choice-repaired/draft.json"
raw = path.read_bytes()
draft = json.loads(raw)
affected = {"q774-line-graphical", "q774-reciprocal-graphical"}
projection = [
    {"id": row["id"], "view": row["view"]}
    for row in draft["questions"] if row["id"] in affected
]
assert {row["id"] for row in projection} == affected and len(projection) == 2
serialized = (json.dumps(projection, ensure_ascii=True, indent=2) + "\n").encode()
output = OWN / "learner-view.json"
with output.open("xb") as stream:
    stream.write(serialized)
os.chmod(output, 0o444)
receipt = {
    "stage": "2a",
    "projected_at_utc": datetime.datetime.now(datetime.timezone.utc).isoformat(),
    "cwd": str(ROOT),
    "prior_receipt_byte_sha256": hashlib.sha256(SOURCE.read_bytes()).hexdigest(),
    "draft": {
        "path": str(path),
        "byte_sha256": hashlib.sha256(raw).hexdigest(),
        "canonical_sha256": hashlib.sha256(
            json.dumps(draft, sort_keys=True, ensure_ascii=True, separators=(",", ":")).encode()
        ).hexdigest(),
    },
    "projection": {
        "path": str(output),
        "byte_sha256": hashlib.sha256(serialized).hexdigest(),
    },
    "question_count": 2,
    "option_count": sum(len(row["view"]["options"]) for row in projection),
    "allowed_disclosure": ["affected questions[].id", "affected questions[].view"],
    "internal_disclosure": False,
    "new_image_opens": 0,
}
receipt_path = OWN / "02-view-projection.json"
with receipt_path.open("x", encoding="utf-8") as stream:
    json.dump(receipt, stream, indent=2)
    stream.write("\n")
os.chmod(receipt_path, 0o444)
print(json.dumps(projection, ensure_ascii=False, indent=2))
print(json.dumps(receipt, indent=2))
