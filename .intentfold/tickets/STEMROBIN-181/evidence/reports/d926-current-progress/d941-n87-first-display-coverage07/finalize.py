import hashlib
import json
import os
from datetime import datetime, timezone
from pathlib import Path


R = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
OUT = R / ".intentfold/tickets/STEMROBIN-181/tmp/d941-n87-first-display-coverage07"
FREEZE_SHA = "73fcc98e4786fbe54333ba63e5f58a657d965483935e02f83fa0e5769f10437b"


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def write_json(path, value):
    with path.open("x", encoding="ascii") as stream:
        json.dump(value, stream, indent=2, ensure_ascii=True)
        stream.write("\n")


assert Path.cwd() == R
assert OUT.resolve() == OUT
assert sha(OUT / "freeze.json") == FREEZE_SHA
freeze = json.loads((OUT / "freeze.json").read_text())
observations = json.loads((OUT / "observations.json").read_text())
assert freeze["imagesLoadedAtFreeze"] == 0
assert len(freeze["recipes"]) == len(observations["recipes"]) == 8
assert [item["recipeId"] for item in freeze["recipes"]] == [
    item["recipeId"] for item in observations["recipes"]
]
assert len(list(OUT.glob("*.png"))) == 8

for binding in freeze["inputBindings"] + freeze["nativeContextBindings"]:
    assert sha(Path(binding["path"])) == binding["sha256"]
for binding in freeze["recipes"]:
    assert sha(Path(binding["source"]["path"])) == binding["source"]["sha256"]
    assert sha(Path(binding["crop"]["path"])) == binding["crop"]["sha256"]
    assert binding["scale"] == 1 and not binding["resized"]

closed_at = datetime.now(timezone.utc).isoformat()
report = {
    "schema": "stemrobin181/offline-bounded-display-review@1",
    "ticket": "STEMROBIN-181",
    "assignment": freeze["assignment"],
    "card": "phy10-c2-s3-n87",
    "reviewStage": "FIRST",
    "batchId": "full-coverage-7",
    "reviewedAt": closed_at,
    "repository": str(R),
    "scratch": str(OUT),
    "freeze": {"path": str(OUT / "freeze.json"), "sha256": FREEZE_SHA},
    "inputBindings": freeze["inputBindings"],
    "nativeContextBindings": freeze["nativeContextBindings"],
    "coordinateSystem": freeze["coordinateSystem"],
    "localizationBasis": "Finding regions are approximate crop-local CSS-pixel bounds, estimated from the single original-detail inspection. Recipe rectangles and hashes are exact.",
    "inspectionMethod": "Exactly one functions.view_image call per frozen crop, detail=original, in frozen recipe order. No source screenshot, resized copy, extra crop or reopen was loaded.",
    "batchVerdict": observations["batchVerdict"],
    "verdictScope": observations["verdictScope"],
    "blockingFindings": observations["blockingFindings"],
    "minorFindings": observations["minorFindings"],
    "fullDISPLAY": False,
    "completeCard": False,
    "domPASSIsNotVisualPASS": True,
    "scopeLimits": [
        "Only the assigned full-coverage-7 eight rectangles were inspected.",
        "Mobile lesson rows 6752 through 11362 were observed; rows 0 through 6751 were not.",
        "The entire English desktop exercises PNG was observed.",
        "English mobile exercises rows 0 through 843 were observed; rows 844 through 1011 were not.",
        "Other locales, lesson regions, choices, answers, figures and prior batches were not visually reviewed.",
        "Native English lesson/exercises were context only; no SCI, figure-semantic or translation verdict was replayed.",
        "Visible controls were not activated. No live browser or rendering acceptance is claimed.",
    ],
    "recipes": [
        {
            **binding,
            **observation,
            "sourceSha256": binding["source"]["sha256"],
            "cropSha256": binding["crop"]["sha256"],
            "imageLoads": 1,
            "detail": "original",
            "fullDISPLAY": False,
            "completeCard": False,
        }
        for binding, observation in zip(freeze["recipes"], observations["recipes"])
    ],
    "prohibitedActionsPerformed": {
        "git": False,
        "indexOrMeterWrite": False,
        "canonicalPromotion": False,
        "paidGeneration": False,
        "databaseOrPublisher": False,
        "deploy": False,
        "testsOrBuild": False,
        "backendOrIntentFoldCapability": False,
        "supervisorOrOtherChat": False,
        "newWorktree": False,
        "nativeProducerOrRender": False,
        "browserOrCapture": False,
    },
}
usage = {
    "schema": "stemrobin181/offline-bounded-display-usage@1",
    "ticket": "STEMROBIN-181",
    "assignment": freeze["assignment"],
    "batchId": "full-coverage-7",
    "recordedAt": closed_at,
    "imagesLoaded": 8,
    "actualImageLoads": 8,
    "imageLoadsThisContext": 8,
    "imageLoadsAtFreeze": 0,
    "maximumBatchImageLoads": 8,
    "maximumContextImageLoads": 24,
    "remainingBatchImageLoads": 0,
    "materializedCrops": 8,
    "originalScreenshotModelLoads": 0,
    "extraCropLoads": 0,
    "reopens": 0,
    "resizedImageLoads": 0,
    "basis": "Eight successful functions.view_image calls, each detail=original, once per listed recipe, after immutable freeze; no other image loads in this context.",
    "loads": [
        {
            "sequence": index + 1,
            "recipeId": binding["recipeId"],
            "path": binding["crop"]["path"],
            "sha256": binding["crop"]["sha256"],
            "tool": "functions.view_image",
            "detail": "original",
            "loads": 1,
            "reopens": 0,
            "successful": True,
        }
        for index, binding in enumerate(freeze["recipes"])
    ],
    "inputTokens": None,
    "cachedInputTokens": None,
    "outputTokens": None,
    "imageTokens": None,
    "totalTokens": None,
    "costUsd": None,
    "tokensAndCostBasis": "Unknown: no authoritative per-turn token or billing telemetry is available. Not estimated and not represented as zero.",
    "paidGenerationCalls": 0,
    "browserCalls": 0,
    "captureCalls": 0,
    "nativeProducerCalls": 0,
    "renderCalls": 0,
    "testsOrBuildCalls": 0,
    "backendCalls": 0,
    "otherChatCalls": 0,
    "dependencyInstalls": 0,
    "fullDISPLAY": False,
    "completeCard": False,
}
write_json(OUT / "report.json", report)
write_json(OUT / "usage.json", usage)
os.chmod(OUT / "report.json", 0o444)
os.chmod(OUT / "usage.json", 0o444)
assert sha(OUT / "freeze.json") == FREEZE_SHA
files = sorted(path for path in OUT.iterdir() if path.is_file() and path.name != "SHA256SUMS")
with (OUT / "SHA256SUMS").open("w", encoding="ascii") as stream:
    for path in files:
        stream.write(f"{sha(path)}  {path.name}\n")
os.chmod(OUT / "SHA256SUMS", 0o444)
for line in (OUT / "SHA256SUMS").read_text().splitlines():
    digest, name = line.split("  ", 1)
    assert sha(OUT / name) == digest
print(json.dumps({
    "artifacts": [
        {"path": str(OUT / name), "sha256": sha(OUT / name)}
        for name in ["report.json", "usage.json", "freeze.json", "SHA256SUMS"]
    ],
    "batchVerdict": report["batchVerdict"],
    "imageLoads": usage["actualImageLoads"],
    "fullDISPLAY": False,
    "completeCard": False,
    "allManifestHashesVerified": True,
}, indent=2))
