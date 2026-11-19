"""Freeze current author-rendering outputs and their hash/usage ledgers."""

from pathlib import Path
import json
import hashlib


ROOT = Path("/Users/yong/.codex/worktrees/d9b1/lemmadeck")
OWN = Path(__file__).resolve().parent


def load(path):
    return json.loads(path.read_text(encoding="utf-8"))


def reference(path):
    return {"path": str(path), "sha256": hashlib.sha256(path.read_bytes()).hexdigest()}


def save(path, value):
    with path.open("x", encoding="utf-8") as handle:
        handle.write(json.dumps(value, ensure_ascii=False, indent=2) + "\n")


assert Path.cwd() == ROOT
assert not (OWN / "author-rendering-final.json").exists()
for entry in load(OWN / "hashes.json")["files"]:
    assert reference(Path(entry["path"]))["sha256"] == entry["sha256"], entry["path"]
binding = load(OWN / "binding-cap2-FIRST.json")
outputs = []
for entry in binding["figures"]:
    figure = entry["figure"]
    folder = OWN / figure
    first = load(folder / "spec-bound-FIRST.json")
    current_path = folder / "spec-bound-REPAIR-1.json"
    current = load(current_path)
    assert current["source"] == first["source"]
    assert current["assertions"] == first["assertions"]
    assert current["canvas"] == first["canvas"]
    assert reference(Path(current["source"]["image"]["path"]))["sha256"] == current["source"]["image"]["sha256"]
    context = load(folder / "context-bound-FIRST.json")
    assert current["source"]["authoritativeText"] == context["sourceAuthoritativeText"]
    report_path = folder / f"{figure}-REPAIR-1.render.json"
    report = load(report_path)
    svg_path = folder / f"{figure}-REPAIR-1.svg"
    assert report["status"] == "pass" and not report["collisions"]
    assert report["spec"]["sha256"] == reference(current_path)["sha256"]
    assert report["output"]["svg"]["sha256"] == reference(svg_path)["sha256"]
    preview_receipt_path = folder / "preview-width640-REPAIR-1-receipt.json"
    preview_receipt = load(preview_receipt_path)
    preview_path = folder / f"{figure}-width640-REPAIR-1.png"
    assert preview_receipt["preview"]["sha256"] == reference(preview_path)["sha256"]
    assert preview_receipt["metrics"]["minimumTextPx"] >= 16
    outputs.append({
        "figure": figure, "status": "author-rendering-complete",
        "spec": reference(current_path), "context": reference(folder / "context-bound-FIRST.json"),
        "svg": reference(svg_path), "render": reference(report_path),
        "fullPreview": reference(folder / f"{figure}-full-REPAIR-1.png"),
        "width640Preview": reference(preview_path),
        "renderReceipt": reference(folder / "render-REPAIR-1-receipt.json"),
        "previewReceipt": reference(preview_receipt_path),
        "repairHistory": reference(folder / "label-layout-REPAIR-1.json"),
        "sourceRawPng": reference(Path(current["source"]["image"]["path"])),
        "measuredMinTextPx": preview_receipt["metrics"]["minimumTextPx"],
        "independentApproval": False,
    })
save(OWN / "author-rendering-final.json", {
    "status": "author-rendering-complete", "figures": outputs,
    "frozenTemplateBinding": reference(OWN / "binding-cap2-FIRST.json"),
    "historicalCap1Blocker": reference(OWN / "cap2-FIRST-blocker.json"),
    "labelSearchExecutionFailures": [
        reference(OWN / "label-solver-FIRST-execution-failure.json"),
        reference(OWN / "label-solver-SECOND-execution-failure.json"),
    ],
    "authorImageObservations": {
        "opened": [entry["width640Preview"] for entry in outputs],
        "count": 3, "noObviousRasterOrClippingFailure": True,
        "labelPlacementCaution": "Some tick numerals changed sides; fig-57 y=-2 is farther left, at its exact y anchor. Independent reviewer decides instructional association.",
        "independentReview": False,
    },
    "durableOutputsPromoted": False, "reviewAt1Created": False,
    "parentBoundary": "Finalize edition, validate explicit frozen text equality/assets, arrange independent figure review and rebind output metadata before promotion.",
})
save(OWN / "ledger-cap2.json", {
    "ticket": "STEMROBIN-182", "checkout": str(ROOT), "ownedDirectory": str(OWN),
    "historicalLedger": reference(OWN / "ledger.json"),
    "authorCapabilitiesCompleted": ["ld-s10y-image cap1", "ld-s10y-image cap2"],
    "images": {"originals": 3, "currentWidthPreviews": 3, "reopens": 0, "crops": 0,
               "failedOutputLoads": 0, "otherPayloads": 0,
               "batchTotal": 6, "batchLimit": 8, "contextTotal": 6, "contextLimit": 24},
    "standaloneValidatorRuns": 3, "cap2StandaloneValidatorRuns": 0,
    "rendererRuns": 6, "rendererBuiltinValidations": 6, "rendererRunsPerFigure": 2,
    "failedFirstRenderCandidates": 3, "passedRepairedCandidates": 3,
    "layoutRepairCandidates": 3, "labelSearchInvocations": 3,
    "labelSearchExecutionFailures": 2, "widthPreviewRun": 1,
    "generatedFullPngFiles": 6, "generatedWidthPngFiles": 3,
    "buildContextRuns": 0, "pixelProbeRuns": 2,
    "generationCalls": 0, "generationSpend": 0, "networkCalls": 0,
    "durableWrites": 0, "templateWrites": 0, "appWrites": 0,
    "dependencyChanges": 0, "databaseCalls": 0, "publishes": 0, "commits": 0,
    "independentFigureApproval": False, "selfApproval": False,
})
save(OWN / "hashes-cap2.json", {
    "schema": "STEMROBIN-182/offline-author-hashes@1",
    "files": [
        {**reference(path), "bytes": path.stat().st_size}
        for path in sorted(OWN.rglob("*")) if path.is_file()
    ],
    "excludes": ["hashes-cap2.json (self-hash)"],
})
print(json.dumps({
    "status": "author-rendering-complete",
    "figures": [{key: entry[key] for key in ("figure", "svg", "render", "width640Preview", "measuredMinTextPx")}
                for entry in outputs],
    "finalManifest": reference(OWN / "author-rendering-final.json"),
    "hashLedger": reference(OWN / "hashes-cap2.json"),
    "imagesLoaded": 6, "independentApproval": False,
}, indent=2))
