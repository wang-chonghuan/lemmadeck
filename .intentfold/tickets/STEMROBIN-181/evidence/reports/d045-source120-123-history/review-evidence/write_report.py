import hashlib
import json
from pathlib import Path


W = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
T = W / ".intentfold/tickets/STEMROBIN-181/tmp"
E = T / "d045-source120-123-review-evidence"
A = T / "d044-10p-source120-123-author"
R = T / "d045-source120-123-review.json"


def load(name):
    return json.loads((E / name).read_text())


def binding(path):
    return {
        "path": str(path),
        "sha256": hashlib.sha256(path.read_bytes()).hexdigest(),
    }


visual = load("independent-visual-observations.json")
source = load("source-text-line-bindings.json")
raw = load("raw-pixel-vector-check.json")
initial = load("integrity-initial.json")
final = load("integrity-final.json")
assert initial["authorFreeze"] == final["authorFreeze"]
assert initial["frozenInventory"] == final["frozenInventory"]
assert initial["toolBindings"] == final["toolBindings"]
assert final["allFrozenInventoryMatches"] and final["allFrozenToolBindingsMatch"]
assert visual["imageBudget"]["totalImageOpens"] == 8
assert visual["imageBudget"]["contextImageOpens"] == 8
assert source["totalRows"] == 94 and source["totalExercises"] == 0

pages = []
for observation in visual["pages"]:
    n = observation["physicalPage"]
    s = next(p for p in source["pages"] if p["physicalPage"] == n)
    r = next(p for p in raw["figures"] if p["physicalPage"] == n)
    inventory_pass = all(p["status"] == "PASS" for p in observation["rawInventory"])
    source_pass = (
        observation["sourceStatus"] == "PASS"
        and all(observation[key] == "PASS" for key in [
            "textCheck", "emphasisCheck", "headingCheck", "mathNumbersUnitsCheck",
            "captionCheck", "sourceObjectInventoryCheck",
        ])
        and s["mdJsonPass"] and s["rowPass"] and s["sourceImageBinding"]["matches"]
        and observation["independentPrintedRows"] == s["nativeRows"]
    )
    raw_pass = (
        observation["rawStatus"] == "PASS"
        and inventory_pass and r["allMechanicalPass"]
        and all(observation[key] == "PASS" for key in [
            "rawLeakageCheck", "rawCompletenessCheck", "rawClippingCheck",
        ])
    )
    assert source_pass and raw_pass
    pages.append({
        **observation,
        "sourceStatus": "SOURCE PASS" if source_pass else "SOURCE FAIL",
        "rawStatus": "RAW PASS" if raw_pass else "RAW FAIL",
        "sourcePass": source_pass,
        "rawPass": raw_pass,
        "sourceApprovalScope": f"Physical{n} SOURCE text, rows, emphasis, headings, quantities and source-object inventory only.",
        "sourceEvidence": s,
        "rawEvidence": r,
    })

evidence_names = [
    "check_frozen.py",
    "write_report.py",
    "independent-visual-observations.json",
    "integrity-initial.json",
    "integrity-final.json",
    "source-text-line-bindings.json",
    "raw-pixel-vector-check.json",
    "raw-pixel-vector-first-run.json",
    "integrity-first-run.json",
    "fig-81.resvg.png",
    "fig-82.resvg.png",
    "fig-83.resvg.png",
    "fig-84.resvg.png",
]
report = {
    "schema": "ld-s10y-lesson/independent-source-raw-review@1",
    "ticket": "STEMROBIN-181",
    "book": "10p",
    "reviewDate": "2026-11-17",
    "workspace": str(W),
    "scope": "Independent SOURCE plus RAW, physical pages120-123 and final native crops81-84 only.",
    "status": "PASS",
    "overallSourceStatus": "SOURCE PASS",
    "overallRawStatus": "RAW PASS",
    "sourceApproval": True,
    "sourceApprovalScope": "Only the four reviewed physical pages, not whole cards or upstream116.",
    "rawApproval": True,
    "rawApprovalScope": "Only the four hash-bound final native PNG/SVG bindings, exact pixel rectangles, source inventory and caption/prose exclusion.",
    "cardApproval": False,
    "modernApproval": False,
    "assemblyApproval": False,
    "publicationApproval": False,
    "physicalPages": [120, 121, 122, 123],
    "authorFreeze": final["authorFreeze"],
    "authorRepairCount": 0,
    "inherited119": {
        **final["upstream119"],
        "actualPriorPassReused": True,
        "pendingAtAuthorFreezeIsHistoricalNotCurrent": True,
        "prior116HoldDoesNotChange119Pass": True,
        "previousSource119ImageReviewRepeated": False,
        "join": "\u524d\u8005\u662f\u7531\u94a2\u8f68\u4f20\u5230\u8033\u4e2d\u7684",
    },
    "method": {
        "description": visual["method"],
        "imageBudget": visual["imageBudget"],
        "imageOpens": [
            {**i, **binding(A / i["relativePath"])} for i in visual["imageOpenOrder"]
        ],
        "imageOpenTool": "functions.view_image",
        "countConvention": visual["countConvention"],
        "visualVersusMechanical": "Source text and object completeness were independently read from source pixels. Exact pixel equality or vector determinism alone cannot approve source content.",
        "negativeControls": "Shifted source rectangles, one-pixel in-memory mutations and blank vector masks are rejected for every crop; no altered image was written or visually opened.",
        "officialFinalizeReruns": 0,
        "officialVectorizeReruns": 0,
        "resvgReadOnlyValidationRuns": 4,
        "resvgRerasterizations": 0,
        "initialCommandAndRasterHashesRetained": True,
        "resvgNewOutputsOnlyInsideOwnedEvidence": True,
        "resvgOutputImageOpens": 0,
        "externalResearch": False,
    },
    "totals": {
        "independentPrintedRows": 94,
        "nativeCountedRows": 94,
        "proposedRows": 94,
        "pageBlocks": 40,
        "nativePageFiles": 12,
        "sourcePageImageOpens": 4,
        "finalCropImageOpens": 4,
        "totalImageOpens": 8,
        "finalCrops": 4,
        "svgBindings": 4,
        "sourcePassPages": 4,
        "rawPassFigures": 4,
        "newWrittenExercises": 0,
        "provenDefects": 0,
        "holds": 0,
        "repairRecommendations": 0,
    },
    "pages": pages,
    "closureFacts": visual["closureFacts"],
    "nonexclusiveFigureReferences": visual["nonexclusiveFigureReferences"],
    "retainedSourceUncertainties": visual["retainedSourceUncertainties"],
    "provenDefects": visual["provenDefects"],
    "holds": visual["holds"],
    "repairRecommendations": visual["repairRecommendations"],
    "repairBudget": visual["repairBudget"],
    "toolBindingsUsed": final["toolBindings"],
    "editionPyObservation": {
        "initial": initial["editionPy"],
        "final": final["editionPy"],
        "usedForThisReview": False,
        "executed": False,
        "driftIsNotSourceFinalizeFailure": True,
        "note": "Do not re-finalize author content because an unrelated modern-edition normalizer changes.",
    },
    "integrity": {
        "all72FrozenInventoryHashesVerifiedInitiallyAndFinally": True,
        "frozenInventoryUnchanged": True,
        "all13AuthorBoundToolHashesMatchInitiallyAndFinally": True,
        "sourcePdfHashVerified": final["ancillaryBindings"][1],
        "authorCandidateEdits": 0,
        "scopeOfPreservationProof": "All72 frozen author inventory entries plus requested freeze and its bound source PDF, preparation and predecessor freeze; no global shared-worktree immutability claim.",
    },
    "evidenceBindings": [binding(E / name) for name in evidence_names],
    "writes": {
        "allowedEvidenceDirectory": str(E),
        "allowedReport": str(R),
        "candidateSourceAuthorAppToolsCharterEdits": 0,
        "gitOperations": 0,
        "databaseOperations": 0,
        "ticketEdits": 0,
        "ticketMessages": 0,
        "otherChatMessages": 0,
        "prepareFinalizeVectorizeAssemblyPromotionPublish": 0,
    },
    "limitations": [
        "Source fidelity does not endorse historical scientific accuracy or certify modern instructional language.",
        "Section45 is incomplete after123. No page124 text or pixel observation was made.",
        "Figure84 reference absence is limited to reviewed45 prose on122-123; no claim about the rest of45 or global figure ownership.",
        "Source/card closure facts do not approve full assembled cards, modern figures, application behavior or publication.",
        "No new repair was needed or performed; do not mutate the frozen candidate on this reviewer's behalf.",
    ],
}
R.write_text(json.dumps(report, ensure_ascii=True, indent=2) + "\n")
manifest = {
    "schema": "ld-s10y-lesson/review-file-hash@1",
    "report": binding(R),
    "authorFreeze": final["authorFreeze"],
    "evidenceBindings": report["evidenceBindings"],
}
(E / "report-hash.json").write_text(json.dumps(manifest, indent=2) + "\n")
print(json.dumps({
    "report": manifest["report"],
    "status": report["status"],
    "pages": [
        {"page": p["physicalPage"], "source": p["sourceStatus"], "raw": p["rawStatus"],
         "rows": [p["independentPrintedRows"], p["sourceEvidence"]["nativeRows"]]}
        for p in pages
    ],
    "imageOpens": 8,
    "recommendations": 0,
}, indent=2))
