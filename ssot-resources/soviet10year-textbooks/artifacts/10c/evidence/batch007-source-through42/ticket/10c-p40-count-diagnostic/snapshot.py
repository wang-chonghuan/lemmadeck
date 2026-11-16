import hashlib
import json
import shutil
from pathlib import Path

ROOT = Path.cwd()
OUT = ROOT / ".intentfold/tickets/STEMROBIN-184/tmp/10c-p40-count-diagnostic"
CURRENT = ROOT / "ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0040"
FIRST = ROOT / ".intentfold/tickets/STEMROBIN-184/tmp/source-10c-p39-p42-evidence/0040"


def binding(path):
    raw = path.read_bytes()
    return {
        "path": str(path.relative_to(ROOT)),
        "sha256": hashlib.sha256(raw).hexdigest(),
        "bytes": len(raw),
    }


manifest = OUT / "before-handling-hashes.json"
if manifest.exists():
    raise RuntimeError("Existing snapshot is immutable; do not repeat handling")
entries = []
for name in ("page.md", "page.json", "audit.json"):
    for label, source in (
        ("current-triples", CURRENT / name),
        ("first-failed-triples", FIRST / "after-finalize/durable" / name),
    ):
        target = OUT / label / name
        target.parent.mkdir(parents=True, exist_ok=True)
        if target.exists():
            raise RuntimeError(f"Preserve existing snapshot: {target}")
        shutil.copy2(source, target)
        entries.append({"source": binding(source), "snapshot": binding(target)})
for name in ("finalize-run.json", "finalize.stdout.txt", "finalize.stderr.txt"):
    source = FIRST / name
    target = OUT / "first-results" / name
    target.parent.mkdir(parents=True, exist_ok=True)
    if target.exists():
        raise RuntimeError(f"Preserve existing snapshot: {target}")
    shutil.copy2(source, target)
    entries.append({"source": binding(source), "snapshot": binding(target)})
result = {
    "role": "before any page count diagnostic handling; raw-byte preservation only",
    "page": 40,
    "entries": entries,
    "current_equals_first_failed": {
        name: binding(CURRENT / name)["sha256"]
        == binding(FIRST / "after-finalize/durable" / name)["sha256"]
        for name in ("page.md", "page.json", "audit.json")
    },
}
manifest.write_text(json.dumps(result, indent=2) + "\n")
print(json.dumps({"manifest": binding(manifest), "current_equals_first_failed": result["current_equals_first_failed"]}, indent=2))
