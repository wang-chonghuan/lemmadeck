import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
excluded = {"output-index.json", "output-index.sha256"}
paths = sorted(p for p in ROOT.rglob("*") if p.is_file() and p.name not in excluded)
assert all(p.suffix in (".json", ".py", ".sha256", ".txt") for p in paths)
records = [
    {"path": p.relative_to(ROOT).as_posix(),
     "sha256": hashlib.sha256(p.read_bytes()).hexdigest(),
     "bytes": p.stat().st_size}
    for p in paths
]
index = {"schema": "stemrobin188-review-output-index@1", "outputs": records,
         "selfExcluded": sorted(excluded)}
with (ROOT / "output-index.json").open("x") as out:
    json.dump(index, out, indent=2)
    out.write("\n")
digest = hashlib.sha256((ROOT / "output-index.json").read_bytes()).hexdigest()
with (ROOT / "output-index.sha256").open("x") as out:
    out.write(f"{digest}  output-index.json\n")
assert all(hashlib.sha256((ROOT / r["path"]).read_bytes()).hexdigest() == r["sha256"]
           and (ROOT / r["path"]).stat().st_size == r["bytes"] for r in records)
assert {r["path"] for r in records} == {
    p.relative_to(ROOT).as_posix() for p in ROOT.rglob("*")
    if p.is_file() and p.name not in excluded
}
print(json.dumps({"outputRoot": str(ROOT), "outputs": len(records),
                  "allOutputHashesAndBytesVerified": True, "indexSHA256": digest}, indent=2))
