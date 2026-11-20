import hashlib
import json
import stat
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent
TMP = ROOT.parent
REPO = TMP.parents[3]
phase = sys.argv[1]
assert phase in ("before", "after")
intake_path = TMP / "n62-text-n60fig8182-review-inputs-01/blind-intake.json"
intake = json.loads(intake_path.read_text())
seal = json.loads((ROOT / "first-seal-evidence.json").read_text())
for sealed in seal["files"]:
    p = ROOT / sealed["path"]
    assert stat.S_IMODE(p.stat().st_mode) == 0o444
    assert hashlib.sha256(p.read_bytes()).hexdigest() == sealed["sha256"]

expected = {}
locations = {}
conflicts = []

def collect(value, origin):
    if isinstance(value, dict):
        p, digest = value.get("path"), value.get("sha256")
        if isinstance(p, str) and p.startswith("/") and isinstance(digest, str):
            if p in expected and expected[p] != digest:
                conflicts.append({"path": p, "first": expected[p], "other": digest})
            expected[p] = digest
            locations.setdefault(p, []).append(origin)
        for key, child in value.items():
            collect(child, origin + "/" + key)
    elif isinstance(value, list):
        for i, child in enumerate(value):
            collect(child, origin + f"/{i}")

collect(intake, "blind-intake")
main_path = Path(intake["afterOriginalFIRSTSealed"]["path"])
main = json.loads(main_path.read_text())
collect(main, "main-review-manifest")
text_path = Path(main["modernText"]["path"])
text = json.loads(text_path.read_text())
collect(text, "complete-N62-review-manifest")
supplemental = [
    TMP / "n62-modern-text-author-inputs-01/manifest.json",
    TMP / "n60-modern-text-review-inputs-01/manifest.json",
    Path(main["figure82Context"]["path"]),
]
for p in supplemental:
    collect(json.loads(p.read_text()), p.name + ":" + str(p.parent.name))
contracts = [
    ".agents/skills/ld-s10y-image/SKILL.md",
    ".agents/skills/ld-s10y-image/references/quality-gate.md",
    ".agents/skills/ld-s10y-image/references/figure-spec.md",
    ".claude/skills/ld-s10y-lesson/SKILL.md",
    ".claude/skills/ld-s10y-lesson/references/production-resume.md",
    ".claude/skills/ld-s10y-lesson/references/edition-text-contract.md",
]
for p in [intake_path, *supplemental, *(REPO / p for p in contracts)]:
    if str(p) not in expected:
        expected[str(p)] = None
        locations[str(p)] = ["supplemental-contract-or-intake"]
records = []
for name in sorted(expected):
    p = Path(name)
    try:
        info = p.stat()
        actual = hashlib.sha256(p.read_bytes()).hexdigest()
        records.append({
            "path": name,
            "expectedSha256": expected[name],
            "sha256": actual,
            "bytes": info.st_size,
            "mode": f"{stat.S_IMODE(info.st_mode):04o}",
            "match": expected[name] is None or actual == expected[name],
            "origins": locations[name],
            "imageHashOnlyNotImageLoad": p.suffix.lower() in (".png", ".jpg", ".jpeg"),
        })
    except OSError as exc:
        records.append({"path": name, "match": False, "error": str(exc)})
result = {
    "schema": "independent-review-input-bindings@1",
    "phase": phase,
    "atUTC": datetime.now(timezone.utc).isoformat(),
    "firstSealsActual0444Verified": True,
    "manifestReadOnlyAfterFIRSTSeal": True,
    "nestedN62ManifestReadComplete": True,
    "conflicts": conflicts,
    "records": records,
    "allExpectedMatch": not conflicts and all(r["match"] for r in records),
    "note": "Binary image hashing is not visual opening; source81 and all historical snapshots remain unopened.",
}
if phase == "after":
    before = json.loads((ROOT / "input-bindings-before.json").read_text())
    first = {r["path"]: r for r in before["records"]}
    result["unchangedFromBefore"] = (
        first.keys() == {r["path"] for r in records}
        and all(r.get("sha256") == first[r["path"]].get("sha256") for r in records)
    )
out = ROOT / f"input-bindings-{phase}.json"
with out.open("x") as handle:
    json.dump(result, handle, indent=2)
    handle.write("\n")
print(json.dumps({
    "phase": phase,
    "files": len(records),
    "allExpectedMatch": result["allExpectedMatch"],
    "unchangedFromBefore": result.get("unchangedFromBefore"),
    "failures": [r for r in records if not r["match"]],
    "conflicts": conflicts,
}, indent=2))
sys.exit(0 if result["allExpectedMatch"] and result.get("unchangedFromBefore", True) else 1)
