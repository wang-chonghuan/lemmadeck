"""Serialize already-authored source reasoning; never solve or create options."""
import hashlib
import json
import re
import subprocess
from pathlib import Path

ROOT = Path.cwd()
BASE = ROOT / ".tmp/stemrobin-184-six/c6-resume"
AUTHOR = BASE / "author"
seed = json.loads((BASE / "seed.json").read_text())
markdown = (AUTHOR / "source-solving.md").read_text()
parts = re.split(r"^## (\d+)\n", markdown, flags=re.MULTILINE)
solutions = {parts[i]: parts[i + 1].strip() for i in range(1, len(parts), 2)}
assert set(solutions) == {str(n) for n in range(335, 392)}
assert len(seed["exercises"]) == 57
digest = subprocess.run(
    ["python3", ".agents/skills/ld-s10y-choice/scripts/prepare.py",
     "digest", str(BASE / "seed.json")],
    check=True, capture_output=True, text=True,
).stdout.strip()
assert digest == "975572b776f0d768d41ad48d2bc5f45c2c1ce80f6c6fa727171d7e39107fe5a8"
records = [{
    "source_number": ex["number"],
    "authoritative_conditions_and_tasks": ex["text"],
    "independent_solution": solutions[ex["number"]],
    "status": "solved",
    "held_units": [],
} for ex in seed["exercises"]]
value = {
    "schema": "stemrobin-184-independent-source-solving-v1",
    "seed_sha256": digest,
    "scope": "10c/ana10-c6-ex/335..391",
    "global_conditions_and_capacity_notes": parts[0].strip(),
    "source_records": records,
    "source_count": 57,
    "held_units": [],
    "option_construction_started": False,
    "review_status": "Independent semantic review not performed by author.",
}
out = AUTHOR / "source-solving.json"
assert not out.exists(), "Never overwrite a frozen source solution."
out.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n")
hashes = {
    name: hashlib.sha256((AUTHOR / name).read_bytes()).hexdigest()
    for name in ("source-solving.md", "source-solving.json")
}
receipt = AUTHOR / "source-freeze.json"
assert not receipt.exists()
receipt.write_text(json.dumps({
    "seed_sha256_official_prepare_digest": digest,
    "freeze_stage": "all_source_solving_complete_before_options",
    "source_count": 57,
    "file_sha256": hashes,
}, indent=2) + "\n")
print(json.dumps({"source_count": 57, "held_units": [], "file_sha256": hashes}))
