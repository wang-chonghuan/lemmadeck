import datetime
import hashlib
import json
import os
from pathlib import Path

assert Path.cwd() == Path("/Users/yong/.codex/worktrees/d9b1/lemmadeck")
B = Path(".intentfold/tickets/STEMROBIN-182/tmp/resume182-11")
OWN = B / "n36-choice-review-FIRST"
receipt = json.loads((OWN / "03-view-freeze.json").read_bytes())
evidence = (OWN / "view-analysis.json").read_bytes()
assert hashlib.sha256(evidence).hexdigest() == receipt["evidence_byte_sha256"]
assert hashlib.sha256(
    (OWN / "02-view-projection.json").read_bytes()
).hexdigest() == receipt["prior_receipt_byte_sha256"]
os.chmod(OWN / "03-view-freeze.json", 0o444)
path = B / "n36-author/draft.json"
raw = path.read_bytes()
draft = json.loads(raw)
digest = hashlib.sha256(
    json.dumps(
        draft, sort_keys=True, ensure_ascii=True, separators=(",", ":")
    ).encode()
).hexdigest()
assert digest == receipt["draft_canonical_sha256"], "Draft changed after blind view freeze"
record = {
    "stage": 3,
    "disclosed_at_utc": datetime.datetime.now(datetime.timezone.utc).isoformat(),
    "prior_receipt_byte_sha256": hashlib.sha256(
        (OWN / "03-view-freeze.json").read_bytes()
    ).hexdigest(),
    "draft_path": str(path),
    "draft_byte_sha256": hashlib.sha256(raw).hexdigest(),
    "draft_canonical_sha256": digest,
    "source_and_view_frozen_before_disclosure": True,
}
output = OWN / "04-internal-disclosure.json"
with output.open("x", encoding="utf-8") as stream:
    json.dump(record, stream, indent=2)
    stream.write("\n")
os.chmod(output, 0o444)
print(json.dumps(record, indent=2))
print(json.dumps(draft, ensure_ascii=False, indent=2))
