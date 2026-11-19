import hashlib
import json
import os
import struct
from pathlib import Path


R = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
OUT = R / ".intentfold/tickets/STEMROBIN-181/tmp/d944-n87-first-display-coverage09"
FREEZE_SHA = "a442ecf458482619f9be84a539bbb7095aee283d73661625d29ea5ae4a8bc27a"


def sha256(path):
    with path.open("rb") as handle:
        return hashlib.file_digest(handle, "sha256").hexdigest()


assert Path.cwd() == R
assert Path(__file__).resolve() == OUT / "seal.py"
assert sha256(OUT / "freeze.json") == FREEZE_SHA
freeze = json.loads((OUT / "freeze.json").read_text(encoding="ascii"))
report = json.loads((OUT / "report.json").read_text(encoding="ascii"))
usage = json.loads((OUT / "usage.json").read_text(encoding="ascii"))
assert freeze["frozenBeforeInspection"] and freeze["modelImageLoadsAtFreeze"] == 0
assert len(freeze["targets"]) == len(report["targets"]) == len(usage["loads"]) == 8
assert report["freeze"]["sha256"] == FREEZE_SHA
assert report["batchId"] == usage["batchId"] == freeze["batchId"] == "full-coverage-9"
for frozen, target, load in zip(freeze["targets"], report["targets"], usage["loads"]):
    for key in ("recipeId", "path", "sha256", "source", "crop", "sourceBoxExclusive", "viewport"):
        assert target[key] == frozen[key], f"Binding mismatch: {frozen['recipeId']} {key}"
    assert load["recipeId"] == target["recipeId"]
    assert load["loadOrdinal"] == target["loadOrdinal"]
    assert load["detail"] == target["detail"] == "original"
    assert load["imageLoads"] == target["imageLoads"] == frozen["expectedImageLoads"] == 1
    assert target["verdict"] == "PASS" and not target["pageDefects"]
    path = Path(frozen["path"])
    assert path.parent == OUT and not path.is_symlink()
    assert sha256(path) == frozen["sha256"]
    with path.open("rb") as handle:
        header = handle.read(24)
    assert header[:8] == b"\x89PNG\r\n\x1a\n"
    assert struct.unpack(">II", header[16:24]) == (
        frozen["crop"]["width"], frozen["crop"]["height"]
    )
    assert frozen["scale"] == 1 and frozen["resizeOperations"] == 0
assert [target["loadOrdinal"] for target in report["targets"]] == list(range(1, 9))
assert report["method"]["imageLoads"] == usage["actualImageLoads"] == 8
assert report["method"]["imagesInThisReviewerContext"] == usage["imagesInThisReviewerContext"] == 8
for key in ("sourcePngModelLoads", "imageReopens", "extraCrops"):
    assert report["method"][key] == usage[key] == 0
for key in ("inputTokens", "cachedInputTokens", "outputTokens", "totalTokens", "imageTokens", "costUsd"):
    assert usage[key] is None
assert not report["fullDISPLAY"] and not report["completeCard"]
assert not usage["fullDISPLAY"] and not usage["completeCard"]
assert report["batchVerdict"] == "PASS" and report["pageDefectCount"] == 0
assert report["method"]["completeAssignedPixelsInspected"]
assert not report["method"]["prohibitedActionsExecuted"]
for binding in freeze["manifests"].values():
    assert sha256(Path(binding["path"])) == binding["sha256"]
for binding in freeze["contextBindings"]:
    assert sha256(Path(binding["path"])) == binding["sha256"]
for binding in {target["source"]["path"]: target["source"] for target in freeze["targets"]}.values():
    assert sha256(Path(binding["path"])) == binding["sha256"]
assert sha256(Path(freeze["materializer"]["path"])) == freeze["materializer"]["sha256"]

expected_names = {
    "materialize.py", "seal.py", "report.json", "usage.json", "freeze.json", "SHA256SUMS",
    *(Path(target["path"]).name for target in freeze["targets"]),
}
assert {path.name for path in OUT.iterdir()} == expected_names
assert len(list(OUT.glob("*.png"))) == 8
paths = sorted(path for path in OUT.iterdir() if path.name != "SHA256SUMS")
sums = OUT / "SHA256SUMS"
with sums.open("w", encoding="ascii") as handle:
    for path in paths:
        assert path.is_file() and not path.is_symlink()
        handle.write(f"{sha256(path)}  {path.name}\n")
for line in sums.read_text(encoding="ascii").splitlines():
    expected, name = line.split("  ", 1)
    assert sha256(OUT / name) == expected
for path in OUT.iterdir():
    os.chmod(path, 0o444)
print(json.dumps({
    "status": "SEALED-BOUNDED-ARTIFACTS",
    "batchVerdict": report["batchVerdict"],
    "imageLoads": usage["actualImageLoads"],
    "fullDISPLAY": False,
    "completeCard": False,
    "artifacts": [
        {"path": str(OUT / name), "sha256": sha256(OUT / name)}
        for name in ("report.json", "usage.json", "freeze.json", "SHA256SUMS")
    ],
}, indent=2))
