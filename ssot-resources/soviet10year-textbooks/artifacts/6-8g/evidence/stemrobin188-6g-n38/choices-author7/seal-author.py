"""Seal only this author's explicitly created files and record their hashes."""

import hashlib
import json
from pathlib import Path


own = Path(__file__).resolve().parent
names = [
    "seed.json", "draft.json", "SOURCE-SOLVING.md", "view-only.json",
    "AUTHOR-RECORD.md", "AUTHOR-COUNTS.json", "INITIAL-FAILURES.json",
    "STRUCTURAL-RESULT.json", "structural.stdout", "structural.stderr",
    "CAPTURE-RESULT.json", "capture-canonical.mjs", "finish-author.py",
    "seal-author.py",
]
for figure in ("238", "232", "233", "234"):
    names.extend([f"fig-{figure}-full.png", f"fig-{figure}-wrapper.html"])
records = []
for name in names:
    file = own / name
    data = file.read_bytes()
    file.chmod(0o444)
    entry = {
        "name": name,
        "path": str(file),
        "sha256": hashlib.sha256(data).hexdigest(),
        "mode": format(file.stat().st_mode & 0o777, "04o"),
    }
    if name in ("seed.json", "draft.json", "view-only.json"):
        encoded = json.dumps(json.loads(data), sort_keys=True, ensure_ascii=True,
                             separators=(",", ":")).encode()
        entry["canonical_json_sha256"] = hashlib.sha256(encoded).hexdigest()
    records.append(entry)
target = own / "HASHES.json"
with target.open("x") as stream:
    json.dump({
        "status": "AUTHOR_ONLY",
        "owned_root": str(own),
        "files": records,
        "manifest_note": "This manifest does not recursively hash itself.",
    }, stream, indent=2)
    stream.write("\n")
target.chmod(0o444)
print(json.dumps({
    "status": "AUTHOR_ONLY",
    "sealed_file_count": len(records) + 1,
    "all_recorded_modes": sorted({record["mode"] for record in records}),
    "author_record_sha256": next(record["sha256"] for record in records
                                 if record["name"] == "AUTHOR-RECORD.md"),
    "hash_manifest_sha256": hashlib.sha256(target.read_bytes()).hexdigest(),
    "hash_manifest_mode": format(target.stat().st_mode & 0o777, "04o"),
}, indent=2))
