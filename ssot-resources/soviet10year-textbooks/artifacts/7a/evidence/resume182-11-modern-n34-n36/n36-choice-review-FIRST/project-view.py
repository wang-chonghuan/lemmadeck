import datetime
import hashlib
import json
import os
from pathlib import Path

ROOT = Path("/Users/yong/.codex/worktrees/d9b1/lemmadeck")
assert Path.cwd() == ROOT
B = Path(".intentfold/tickets/STEMROBIN-182/tmp/resume182-11")
OWN = B / "n36-choice-review-FIRST"


def canonical(value):
    return json.dumps(
        value, sort_keys=True, ensure_ascii=True, separators=(",", ":")
    ).encode("utf-8")


source_receipt = json.loads((OWN / "01-source-freeze.json").read_bytes())
source_raw = (OWN / "source-solutions.json").read_bytes()
assert hashlib.sha256(source_raw).hexdigest() == source_receipt["evidence_byte_sha256"]
os.chmod(OWN / "01-source-freeze.json", 0o444)

draft_path = B / "n36-author/draft.json"
raw = draft_path.read_bytes()
document = json.loads(raw)
# The reviewer receives only this allowlisted subtree, never internal fields.
projection = [{"id": item["id"], "view": item["view"]} for item in document["questions"]]
assert len(projection) == 21
output = OWN / "learner-view.json"
serialized = (json.dumps(projection, ensure_ascii=True, indent=2) + "\n").encode()
with output.open("xb") as stream:
    stream.write(serialized)
os.chmod(output, 0o444)
receipt = {
    "stage": "2a",
    "created_at_utc": datetime.datetime.now(datetime.timezone.utc).isoformat(),
    "cwd": str(ROOT),
    "prior_receipt_byte_sha256": hashlib.sha256(
        (OWN / "01-source-freeze.json").read_bytes()
    ).hexdigest(),
    "draft_path": str(draft_path),
    "draft_byte_sha256": hashlib.sha256(raw).hexdigest(),
    "draft_canonical_sha256": hashlib.sha256(canonical(document)).hexdigest(),
    "projection_path": str(output),
    "projection_byte_sha256": hashlib.sha256(serialized).hexdigest(),
    "projection_canonical_sha256": hashlib.sha256(canonical(projection)).hexdigest(),
    "question_count": len(projection),
    "allowed_disclosure": ["questions[].id", "questions[].view"],
    "internal_disclosure": False,
}
receipt_path = OWN / "02-view-projection.json"
with receipt_path.open("x", encoding="utf-8") as stream:
    json.dump(receipt, stream, ensure_ascii=True, indent=2)
    stream.write("\n")
os.chmod(receipt_path, 0o444)
print(json.dumps(projection, ensure_ascii=False, indent=2))
print("PROJECTION RECEIPT")
print(json.dumps(receipt, indent=2))
