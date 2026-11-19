"""Validate bindings and freeze only this review's own outputs."""
import hashlib
import json
from datetime import datetime, timezone
from pathlib import Path

R = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
O = R / ".intentfold/tickets/STEMROBIN-181/tmp/d855-source235-first-independent-review"
assert Path.cwd() == R
assert O.is_dir() and not O.is_symlink()


def binding(path):
    data = path.read_bytes()
    return {
        "path": str(path),
        "bytes": len(data),
        "sha256": hashlib.sha256(data).hexdigest(),
    }


report = json.loads((O / "report.json").read_text())
findings = json.loads((O / "findings.json").read_text())
inputs = json.loads((O / "input-bindings.json").read_text())
assert report["statuses"] == findings["statuses"] == {
    "SOURCE": "HOLD", "RAW205": "PASS", "SVG205": "PASS"
}
assert report["usage"]["imageLoadsThisBatch"] == 5
for item in [inputs["candidateFreeze"], *inputs["candidateFiles"]]:
    assert binding(Path(item["path"]))["sha256"] == item["sha256"]
for item in inputs["currentToolBindings"]:
    assert binding(Path(item["path"]))["sha256"] == item["sha256"]
for ref in report["evidence"].values():
    if isinstance(ref, dict) and "sha256" in ref:
        assert binding(O / ref["file"])["sha256"] == ref["sha256"]

files = sorted(path for path in O.rglob("*") if path.is_file())
assert all(not path.is_symlink() for path in O.rglob("*"))
assert all(path.parent.resolve() == O.resolve() for path in files)
freeze = {
    "schema": "d855-source235-independent-review-freeze@1",
    "frozenAt": datetime.now(timezone.utc).isoformat(),
    "cwd": str(R),
    "writeRoot": str(O),
    "statuses": report["statuses"],
    "candidateFreeze": inputs["candidateFreeze"],
    "findings": binding(O / "findings.json"),
    "report": binding(O / "report.json"),
    "inputBindings": binding(O / "input-bindings.json"),
    "files": [binding(path) for path in files],
    "permissions": {"files": "0444", "directories": "0555"},
    "selfHash": "Returned by the freeze command; intentionally not recursive.",
    "authorization": "Review only; historical deviation and FIRST HOLD preserved; stop.",
}
with (O / "freeze.json").open("x", encoding="utf-8") as out:
    json.dump(freeze, out, ensure_ascii=False, indent=2)
    out.write("\n")
for path in files + [O / "freeze.json"]:
    path.chmod(0o444)
for path in sorted((p for p in O.rglob("*") if p.is_dir()), reverse=True):
    path.chmod(0o555)
O.chmod(0o555)
assert all(path.stat().st_mode & 0o777 == 0o444 for path in files + [O / "freeze.json"])
assert O.stat().st_mode & 0o777 == 0o555
print(json.dumps({
    "statuses": report["statuses"],
    "freeze": binding(O / "freeze.json"),
    "report": binding(O / "report.json"),
    "findings": binding(O / "findings.json"),
    "inputBindings": binding(O / "input-bindings.json"),
    "permissionsVerified": True,
    "candidateAndToolBindingsStillMatchReviewObservations": True,
}, indent=2))
