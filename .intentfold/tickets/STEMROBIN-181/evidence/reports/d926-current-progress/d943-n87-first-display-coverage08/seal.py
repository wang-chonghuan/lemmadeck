import hashlib
import json
from datetime import datetime, timezone
from pathlib import Path


ROOT = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
OUT = ROOT / ".intentfold/tickets/STEMROBIN-181/tmp/d943-n87-first-display-coverage08"
EXPECTED_FREEZE = "2f8b888d3ee574ccbf0897ed3528420b583da046700a0376bcc9df1e7ba0e814"


def sha256(path):
    with path.open("rb") as stream:
        return hashlib.file_digest(stream, "sha256").hexdigest()


def read_json(path):
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path, data):
    assert path.parent == OUT
    with path.open("w", encoding="utf-8") as stream:
        json.dump(data, stream, indent=2, ensure_ascii=True)
        stream.write("\n")
    path.chmod(0o444)


assert Path.cwd() == ROOT
assert sha256(OUT / "freeze.json") == EXPECTED_FREEZE
freeze = read_json(OUT / "freeze.json")
for item in freeze["inputs"] + freeze["sources"] + freeze["context"]:
    assert sha256(Path(item["path"])) == item["sha256"], item["path"]
for target in freeze["targets"]:
    assert sha256(Path(target["path"])) == target["sha256"]
    assert Path(target["path"]).parent == OUT
assert len(list(OUT.glob("*.png"))) == len(freeze["targets"]) == 8
assert all(Path(target["path"]).stat().st_mode & 0o222 == 0 for target in freeze["targets"])

report = read_json(OUT / "report.json")
usage = read_json(OUT / "usage.json")
ids = [target["recipeId"] for target in freeze["targets"]]
assert [target["recipeId"] for target in report["targets"]] == ids
assert [load["recipeId"] for load in usage["loads"]] == ids
assert sum(load["imageLoads"] for load in usage["loads"]) == usage["actualImageLoads"] == 8
assert report["imageLoads"] == 8
assert report["fullDISPLAY"] is False and report["completeCard"] is False
assert usage["tokens"] is None and usage["costUsd"] is None
binding_keys = (
    "path", "sha256", "source", "sourceDimensions", "crop", "dimensions",
    "locale", "surface", "viewport", "criterion", "nativeScale", "resized", "recipeExact",
)
for target, frozen, load in zip(report["targets"], freeze["targets"], usage["loads"]):
    assert target["imageLoads"] == load["imageLoads"] == 1
    target.update({key: frozen[key] for key in binding_keys})
    target["fullDISPLAY"] = False
    target["completeCard"] = False
    load.update({
        "path": frozen["path"],
        "sha256": frozen["sha256"],
        "detail": "original",
        "tool": "functions.view_image",
        "successful": True,
    })
report.update({
    "reviewRecordedAt": datetime.now(timezone.utc).isoformat(),
    "freeze": {"path": str(OUT / "freeze.json"), "sha256": EXPECTED_FREEZE},
    "inputBindings": freeze["inputs"],
    "contextBindings": freeze["context"],
    "sourceBindings": freeze["sources"],
    "hashVerification": "All requested input, source, context and frozen crop hashes matched at sealing.",
    "writeScope": str(OUT),
})
usage["freeze"] = report["freeze"]
write_json(OUT / "report.json", report)
write_json(OUT / "usage.json", usage)

paths = sorted(path for path in OUT.iterdir() if path.is_file() and path.name != "SHA256SUMS")
with (OUT / "SHA256SUMS").open("w", encoding="ascii") as stream:
    for path in paths:
        stream.write(f"{sha256(path)}  {path.name}\n")
(OUT / "SHA256SUMS").chmod(0o444)
assert sha256(OUT / "freeze.json") == EXPECTED_FREEZE
for line in (OUT / "SHA256SUMS").read_text(encoding="ascii").splitlines():
    expected, name = line.split("  ", 1)
    assert sha256(OUT / name) == expected
print(json.dumps({
    "batchVerdict": report["batchVerdict"],
    "fullDISPLAY": False,
    "completeCard": False,
    "actualImageLoads": usage["actualImageLoads"],
    "sealedFiles": len(paths),
    "artifacts": [
        {"path": str(OUT / name), "sha256": sha256(OUT / name)}
        for name in ("report.json", "usage.json", "freeze.json", "SHA256SUMS")
    ],
}, indent=2))
