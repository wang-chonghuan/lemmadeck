import datetime
import hashlib
import json
import os
from pathlib import Path

ROOT = Path("/Users/yong/.codex/worktrees/d9b1/lemmadeck")
assert Path.cwd() == ROOT
B = Path(".intentfold/tickets/STEMROBIN-182/tmp/resume182-11")
OWN = B / "n36-choice-review-affected"
freeze_path = OWN / "03-view-freeze.json"
freeze = json.loads(freeze_path.read_bytes())
assert hashlib.sha256((OWN / "view-analysis.json").read_bytes()).hexdigest() == freeze["evidence"]["byte_sha256"]
path = B / "n36-choice-repaired/draft.json"
raw = path.read_bytes()
draft = json.loads(raw)
digest = hashlib.sha256(
    json.dumps(draft, sort_keys=True, ensure_ascii=True, separators=(",", ":")).encode()
).hexdigest()
assert digest == freeze["draft_canonical_sha256"], "Repaired snapshot changed after blind view freeze"
repair_path = B / "n36-choice-repaired/affected-repair.json"
repair_raw = repair_path.read_bytes()
repair = json.loads(repair_raw)
record = {
    "stage": 3,
    "disclosed_at_utc": datetime.datetime.now(datetime.timezone.utc).isoformat(),
    "cwd": str(ROOT),
    "prior_receipt_byte_sha256": hashlib.sha256(freeze_path.read_bytes()).hexdigest(),
    "draft": {
        "path": str(path),
        "byte_sha256": hashlib.sha256(raw).hexdigest(),
        "canonical_sha256": digest,
    },
    "affected_repair": {
        "path": str(repair_path),
        "byte_sha256": hashlib.sha256(repair_raw).hexdigest(),
    },
    "source_and_view_frozen_before_key_comparison": True,
    "new_image_opens": 0,
}
output = OWN / "04-internal-disclosure.json"
with output.open("x", encoding="utf-8") as stream:
    json.dump(record, stream, indent=2)
    stream.write("\n")
os.chmod(output, 0o444)
affected = {"q774-line-graphical", "q774-reciprocal-graphical"}
print(json.dumps(record, indent=2))
print(json.dumps({
    "questions": [row for row in draft["questions"] if row["id"] in affected],
    "coverage": [row for row in draft["coverage"] if row["source_number"] == "774"],
    "new_figures": draft["new_figures"],
    "affected_repair": repair,
}, ensure_ascii=False, indent=2))
