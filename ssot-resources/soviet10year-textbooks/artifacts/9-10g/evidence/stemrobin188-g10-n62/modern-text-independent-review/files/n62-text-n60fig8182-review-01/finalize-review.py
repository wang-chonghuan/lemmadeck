import hashlib
import json
import stat
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent
TMP = ROOT.parent

def read(path):
    return json.loads(Path(path).read_text())

def ref(path):
    p = Path(path)
    return {"path": str(p), "sha256": hashlib.sha256(p.read_bytes()).hexdigest(),
            "bytes": p.stat().st_size}

def write(name, data):
    with (ROOT / name).open("x") as out:
        json.dump(data, out, indent=2, ensure_ascii=True)
        out.write("\n")

main = read(TMP / "n62-text-n60fig8182-review-inputs-01/manifest.json")
tm = read(main["modernText"]["path"])
ctx = read(main["figure82Context"]["path"])
author_input = read(TMP / "n62-modern-text-author-inputs-01/manifest.json")
author_report = read(tm["authorReport"]["path"])
figure_author = read(main["figureAuthorReport"]["path"])
notes = read(ROOT / "semantic-review-notes.json")
text_ev = read(ROOT / "n62-literal-comparison-evidence.json")
figure_ev = read(ROOT / "figure82-relationship-evidence.json")
before = read(ROOT / "input-bindings-before.json")
after = read(ROOT / "input-bindings-after.json")
seal = read(ROOT / "first-seal-evidence.json")
assert before["allExpectedMatch"] and after["allExpectedMatch"] and after["unchangedFromBefore"]
assert text_ev["status"] == figure_ev["status"] == "PASS"
assert len(notes["n62"]["coverage"]) == len(text_ev["objects"]) == 20
assert [n["target"] for n in notes["n62"]["coverage"]] == [n["target"] for n in text_ev["objects"]]
assert all(n["status"] == "PASS" for n in notes["n62"]["coverage"])
assert notes["figure82"]["contentStatus"] == "PASS"
for record in seal["files"]:
    p = ROOT / record["path"]
    assert stat.S_IMODE(p.stat().st_mode) == 0o444
    assert ref(p)["sha256"] == record["sha256"]

shared = {
    "ticket": "STEMROBIN-188", "assignment": "SAME188-6", "book": "9-10g",
    "role": "SOLE INDEPENDENT REVIEWER, NOT author",
    "inputBindingsBefore": ref(ROOT / "input-bindings-before.json"),
    "inputBindingsAfter": ref(ROOT / "input-bindings-after.json"),
    "allInputHashesMatchAndUnchanged": True,
    "wholeLessonApproved": False, "published": False, "promoted": False,
    "templatesApplied": False, "record_reviewCalled": False,
    "formalProjectChecks": 0,
}
text = {
    **shared,
    "schema": "stemrobin188-modern-text-independent-review@1",
    "lesson": "geo910-c2-s3-n62", "edition": "modern-us-neutral",
    "status": "pass", "contentStatus": "PASS",
    "scope": "FIRST COMPLETE N62 modern TEXT comparison only, all 20 objects against assembled raw lesson/exercises. Not source re-approval, new parser/layout/render approval, figure review or publication.",
    "candidates": tm["candidates"],
    "rawLesson": tm["rawLesson"], "rawExercises": tm["rawExercises"],
    "sourceAdmissionReusedUnchanged": tm["sourceAdmission"],
    "literalEvidence": ref(ROOT / "n62-literal-comparison-evidence.json"),
    "coverage": {
        "required": 20, "reviewed": 20, "pass": 20, "fail": 0, "unreviewed": 0,
        "proseObjects": 13, "paragraphObjects": 7, "figureSlots": 3, "captions": 3,
        "exerciseObjects": 7, "exerciseNumbers": [str(n) for n in range(216, 223)],
        "orderedMathSpansCompared": sum(len(o["orderedMathSpans"]["raw"]) for o in text_ev["objects"]),
        "checks": ["full meaning", "ordered literal math spans", "numbers and number words",
                   "units", "given conditions", "requested operations", "source and figure refs",
                   "subpart markers and natural order", "prefix and complete subpart lines",
                   "changes metadata", "source snapshot/hash binding", "section break anchors"],
        "objects": [
            {**observation, "literalComparison": literal}
            for observation, literal in zip(notes["n62"]["coverage"], text_ev["objects"])
        ],
    },
    "globalChecks": text_ev["globalChecks"],
    "unitsAndNumberWords": notes["n62"]["unitsAndNumberWords"],
    "metadataReview": notes["n62"]["metadata"],
    "specialBindings": text_ev["specialBindings"],
    "sectionBreaks": {
        "status": "PASS", "reviewed": 2,
        "boundSavedFlow": tm["savedFlow"],
        "boundActualStdout": text_ev["inputs"][-1],
        "comparisons": text_ev["sectionBreaks"],
        "actualStdoutAllParagraphsAndBoundariesExact": True,
        "finalTemplateDiffersFromFIRSTOnlyBySelectedAnchors": True,
        "genuineConceptSwitchesConfirmed": True,
        "proseFlowLayoutParserNativeProducerRunsByReviewer": 0,
        "savedProducerInvocation": ref(TMP / "n62-modern-text-author/prose-flow-initial-01/command.json"),
    },
    "sourceHolds": {
        "status": "HOLD_UNCHANGED",
        "boundManifest": ref(TMP / "n62-modern-text-author-inputs-01/manifest.json"),
        "json_pointer": "/sourceHolds",
        "exactInheritedRecords": author_input["sourceHolds"],
        "noSourceImagesReopened": True,
        "noHistoricalSourceGlyphFontPunctuationEmphasisRaisedMarkerHoldCleared": True,
        "currentScopeDoesNotEraseHistoricPartialBoundaryHold": True,
    },
    "additionalHolds": [
        {"id": "H-N62-POST-ANCHOR-LAYOUT", "status": "HOLD", "reason": "Exact saved anchors and meaning reviewed, not a new rendered/parser/native approval."},
        {"id": "H-N62-FIGURE-ACCEPTANCE", "status": "HOLD", "reason": "Three figure slots and captions retained as text only. No figure89/90/91 source or candidate image opened."},
        {"id": "H-N62-WHOLE-LESSON-INTEGRATION", "status": "HOLD", "reason": "No complete lesson, product, ownership/shared display, global source or publication approval."},
    ],
    "history": {
        "source224OriginalCropFIRSTFAIL": "PRESERVED",
        "source224RepairsUsed": 1, "source224RepairLimit": 1,
        "source212ProceduralFAIL": "PRESERVED; no repeated source review",
        "authorContentRepairs": author_report["counters"]["content_repairs_used"],
        "authorContentRepairLimit": author_report["counters"]["content_repair_limit"],
        "reviewerContentRepairs": 0,
        "authorFileDiscoveryTechnicalFAIL": {
            "status": "PRESERVED_NOT_CONTENT_FAIL",
            "failedCalls": author_report["counters"]["technical_failed_file_discovery_calls"],
            "recoveries": author_report["counters"]["technical_file_discovery_recoveries"],
            "record": ref(TMP / "n62-modern-text-author/technical-read-01/command.json"),
            "stdout": ref(TMP / "n62-modern-text-author/technical-read-01/stdout.txt"),
            "stderr": ref(TMP / "n62-modern-text-author/technical-read-01/stderr.txt"),
            "exactReceipt": read(TMP / "n62-modern-text-author/technical-read-01/command.json"),
            "recovery": "Only the failed directory discovery stage recovered by author; valid first-directory inventory reused. No rerun by reviewer.",
        },
    },
    "findings": [],
    "answersReadOrCreated": False, "N63OrSource225Compared": False,
    "textSourceImagesOpened": 0, "producerChecksExecuted": 0,
}
assert text["history"]["authorContentRepairs"] == 0
assert text["history"]["authorContentRepairLimit"] == 1
write("n62-modern-text-review.json", text)

figure = {
    **shared,
    "schema": "stemrobin188-current-draft-independent-figure-review@1",
    "lesson": "geo910-c2-s3-n60", "figure": "fig-g10-82",
    "status": "pass", "contentStatus": "PASS",
    "scope": "FIRST independent comparison of ORIGINAL82, full relevant authoritative N60 context and current draft-01/saved snapshot only. Limited source-fidelity comparison with historical glyph/font HOLDs; not durable canonical review recording or promotion.",
    "source": main["figure82Source"], "context": main["figure82Context"],
    "currentDraft": main["figure82CurrentDraft"],
    "FIRST": {
        "inventory": ref(ROOT / "original82-first-inventory.json"),
        "hashFile": ref(ROOT / "original82-first-inventory.sha256"),
        "sealEvidence": ref(ROOT / "first-seal-evidence.json"),
        "actualInventoryMode": "0444", "actualHashFileMode": "0444",
        "actualModesEstablishedBeforeAnyManifestContextCandidateOrReceipt": True,
        "orderingEvidence": "Seal tool completed and returned actual mode/hash records before manifest-reading parallel tool call.",
    },
    "relationshipEvidence": ref(ROOT / "figure82-relationship-evidence.json"),
    "coverage": {
        "panels": 2, "baseEllipses": 2, "netCircles": 2, "rectangleEdges": 4,
        "visibleCurves": 5, "visibleSemanticSegments": 9, "visibleTextLabels": 6,
        "independentInventoryGroups": 7, "groupsReviewed": 7,
        "unmarkedLoci": 14, "lociCoveredByGroupContainedMultiPointRelations": 14,
        "semanticEdgesBoundToConnects": 9, "nativeAssertionsRead": 28,
        "objectCountSubstitution": False,
        "groups": notes["figure82"]["inventoryGroupMapping"],
        "allPanelCircleNetConnectivityLabelVisibilityDetailsCompared": True,
        "N60Context": figure_ev["contextCoverage"],
    },
    "visual": notes["figure82"]["visual"],
    "geometryRegularization": notes["figure82"]["geometryRegularization"],
    "glyphBinding": {
        "sourceVisual": "C-like open curved glyph",
        "sourceCodepoint": None, "sourceLatinCyrillicIdentityResolved": False,
        "renderToken": "U+0043 as C-shaped visual proxy only",
        "conventionalCircumferenceMeaningAssigned": False,
        "panelMarks": "Modern a)/b) transliteration only, not source codepoint claim",
    },
    "checks": figure_ev["checks"],
    "savedNativeEvidence": {
        "status": "PASS_REUSED_NOT_RERUN",
        "receipt": ref(TMP / "n60-fig8182-author/fig-g10-82/draft-01/native.commands.json"),
        "render": main["figure82CurrentDraft"]["render"],
        "savedDisplayChecks": figure_ev["savedDisplayChecksReused"],
        "snapshot": main["figure82CurrentDraft"]["snapshot"],
        "snapshotOpensThisReviewer": 1,
        "newProductFrameOpens": 0,
        "nativePASSNotSubstituteForThisIndependentComparison": True,
        "productSurfaceOrWholeLessonApproved": False,
    },
    "sourceHolds": {
        "status": "HOLD_UNCHANGED", "boundContext": main["figure82Context"],
        "json_pointer": "/sourceHolds", "exactInheritedRecords": ctx["sourceHolds"],
    },
    "holds": notes["figure82"]["holds"],
    "findings": [],
    "contentRepairs": figure_author["counters"]["figure82ContentRepairs"],
    "contentRepairLimit": 1, "reviewerRepairs": 0,
    "dependentFigureStagesStoppedOnFailure": "No new figure82 content FAIL established. All unrequested validator/render/recording/promotion stages unexecuted.",
    "originalOpens": 1, "snapshotOpens": 1, "optionalDiagnostics": 0,
    "rerenders": 0, "validatorRuns": 0, "assetsPromoted": False,
}
assert figure["contentRepairs"] == 0
assert len(figure_ev["mappedNativeAssertionDefinitions"]) == 28
write("n60-figure82-review.json", figure)

failure_path = main["source81FailureStateOnly"]["failure"]["path"]
failure = read(failure_path)
source81 = {
    "status": "FAIL", "unchanged": True, "carryForwardOnly": True,
    "boundFailure": main["source81FailureStateOnly"]["failure"],
    "exactFailureRecord": failure,
    "firstNativeFailure": ref(TMP / "n60-fig8182-author/fig-g10-81/FIRST.native-fail.json"),
    "currentFailedSpecBindingOnly": main["source81FailureStateOnly"]["currentSpec"],
    "reason": notes["figure81"]["reason"],
    "soleLabelOffsetRepairUsed": 1, "repairLimit": 1, "remainingRepairs": 0,
    "nativePASSIsNotSourceFidelity": True,
    "original81ImageOpens": 0, "failedSnapshotImageOpens": 0,
    "newIndependentReview": False, "newAcceptance": False, "newRepair": False,
    "failureCleared": False, "promoted": False,
}
assert failure["actualSpecRepairsAlreadyUsed"] == 1 and failure["remainingRepairs"] == 0
ledger = {
    "schema": "review-image-load-ledger@1",
    "entries": [
        {"ordinal": 1, "scope": "figure82", "kind": "ORIGINAL82 alone before FIRST seal",
         "tool": "functions.view_image", **main["figure82Source"],
         "usable": True, "failed": False, "reopen": False},
        {"ordinal": 2, "scope": "figure82", "kind": "current draft-01 snapshot after FIRST seal and bindings",
         "tool": "functions.view_image", **main["figure82CurrentDraft"]["snapshot"],
         "usable": True, "failed": False, "reopen": False},
    ],
    "planned": 2, "actualBatchLoads": 2, "actualContextLoads": 2,
    "inheritedImagePayloads": 0, "failedLoads": 0, "reopens": 0,
    "optionalSource82Diagnostics": 0, "optionalDiagnosticsLimit": 2,
    "batchLimit": 8, "contextLimit": 24,
    "textSourceImageLoads": 0, "figure81ImageLoads": 0,
    "newProductFrames": 0,
    "note": "Binary hash reads do not load images into model context. Historical source/draft images were never viewed. No parent image-bearing history loaded.",
}
write("image-ledger.json", ledger)
ordering = {
    "schema": "observed-FIRST-tool-order@1",
    "steps": [
        {"ordinal": 1, "toolResult": "edf85a", "action": "Only blind intake read initially."},
        {"ordinal": 2, "toolResult": "23188c", "action": "ORIGINAL82 SHA256 matched intake."},
        {"ordinal": 3, "action": "functions.view_image ORIGINAL82 alone; image ledger ordinal1."},
        {"ordinal": 4, "action": "Independent literal inventory authored without manifest/context/spec/text. Preseal correction clarified four rounded boundary contours, not three."},
        {"ordinal": 5, "toolResult": "ebbe92", "action": "seal-first.py actually chmod inventory AND digest0444, then stat+hash both; returned before manifest open.", "seal": seal},
        {"ordinal": 6, "toolResult": "85c3b7", "action": "afterOriginalFIRSTSealed manifest opened for the first time, in parallel with local contracts."},
        {"ordinal": 7, "toolResult": "050001", "action": "Nested complete N62 modern text manifest opened."},
        {"ordinal": 8, "toolResult": "703709", "action": "181 input bindings matched before independent content comparison."},
        {"ordinal": 9, "action": "Current snapshot opened once; image ledger ordinal2. No diagnostic or reopen."},
        {"ordinal": 10, "toolResult": "f3775b", "action": "Own comparison scripts produced first complete text/relationship evidence without producer checks."},
        {"ordinal": 11, "toolResult": "c3ec7f", "action": "181 after bindings matched and unchanged; FIRST modes and hashes still0444."},
    ],
    "actualModesBeforeManifestNotMerelyFileNames": True,
    "note": "Tool-result suffixes identify observed execution order, not invented wall-clock timestamps. The seal's real UTC/mode/stat values are retained.",
}
write("first-ordering-evidence.json", ordering)

counts = {
    "n62ObjectsRequired": 20, "n62ObjectsReviewed": 20,
    "n62ProseObjectsReviewed": 13, "n62ExercisesReviewed": 7,
    "sectionBreaksCompared": 2,
    "firstFigure82Reviews": 1, "firstCompleteN62TextReviews": 1,
    "figure81NewReviews": 0,
    "reviewerContentRepairs": 0,
    "n62AuthorContentRepairs": 0, "n62AuthorContentRepairLimit": 1,
    "figure82AuthorContentRepairs": 0, "figure82AuthorContentRepairLimit": 1,
    "figure81AuthorContentRepairs": 1, "figure81RemainingRepairs": 0,
    "source224OriginalCropFIRSTFAILsPreserved": 1, "source224RepairsUsed": 1,
    "n62AuthorTechnicalFailedDiscoveryCallsPreserved": 1,
    "n62AuthorTechnicalDiscoveryRecoveriesPreserved": 1,
    "reviewerTechnicalFailedCalls": 0, "reviewerTechnicalRecoveries": 0,
    "ownFirstLiteralComparisonInvocations": 1,
    "unaffectedPASSComparisonReruns": 0,
    "reviewerImageLoads": 2, "failedImageLoads": 0, "imageReopens": 0,
    "optionalSource82DiagnosticLoads": 0, "parentImagePayloadLoads": 0,
    "newProductFrames": 0, "sourceTextImageLoads": 0, "figure81ImageLoads": 0,
    "proseFlowLayoutParserNativeProducerChecks": 0,
    "renders": 0, "validatorRuns": 0, "recordReviewCalls": 0,
    "formalProjectChecks": 0, "modelServiceCalls": 0, "paidCalls": 0,
    "networkCalls": 0, "dependencyChanges": 0, "credentialReads": 0,
    "DBOrBackendCalls": 0, "peerMessages": 0, "descendants": 0,
    "gitWritesCommitsPushes": 0, "publicationMergeDeployClosure": 0,
    "candidateSourceCoreCharterEdits": 0,
    "openExecSessions": 0,
}
report = {
    **shared,
    "schema": "stemrobin188-disjoint-independent-review-report@1",
    "status": "completed-scoped-review-with-preserved-FAIL-and-HOLD",
    "completedAtUTC": datetime.now(timezone.utc).isoformat(),
    "outputRoot": str(ROOT),
    "scopeVerdicts": {
        "N62ModernText": {"status": "PASS", "coverage": "20/20; 13 prose objects + 7 exercises216-222", "holds": "All historical source and unexecuted layout/figure/integration HOLDs unchanged"},
        "N60Figure82CurrentDraft": {"status": "PASS", "coverage": "2 panels, 7 independent groups, 14 unmarked loci, 9 semantic edges, 2 net circles, 2 base ellipses, 6 labels", "holds": "C-like glyph/meaning/codepoint, panel codepoints, fine font/ink and product/promotion remain HOLD"},
        "N60Figure81FailureCarryForward": {"status": "FAIL", "coverage": "Textual existing failure record only; no new source/snapshot review", "unchanged": True},
    },
    "outputs": {
        "n62ModernText": ref(ROOT / "n62-modern-text-review.json"),
        "n60Figure82": ref(ROOT / "n60-figure82-review.json"),
        "imageLedger": ref(ROOT / "image-ledger.json"),
        "firstOrdering": ref(ROOT / "first-ordering-evidence.json"),
        "semanticNotes": ref(ROOT / "semantic-review-notes.json"),
    },
    "source81failureunchanged": True,
    "source81FailureState": source81,
    "FIRST": figure["FIRST"],
    "bindingCoverage": {"files": len(before["records"]), "beforeExpectedMatch": True,
                        "afterExpectedMatch": True, "unchanged": True},
    "holds": {
        "N62ExactInheritedRecords": author_input["sourceHolds"],
        "N60ExactInheritedRecords": ctx["sourceHolds"],
        "figure82LocalHolds": notes["figure82"]["holds"],
        "source224OriginalCropFIRSTFAILAndRepair1of1": "PRESERVED_UNCHANGED",
        "noHistoricalHoldErasedOrRetroactivelyCleared": True,
        "broaderApproval": "HOLD",
    },
    "counts": counts,
    "imageLedger": ledger,
    "technicalEvidence": {
        "ownLiteralComparisonReceipt": ref(ROOT / "compare-evidence.command.json"),
        "afterBindingReceipt": ref(ROOT / "bind-inputs-after.command.json"),
        "authorFailedDiscoveryAndRecovery": text["history"]["authorFileDiscoveryTechnicalFAIL"],
        "displayTruncation": "Some combined shell displays were truncated with exit0; required JSON values were subsequently accessed structurally by reviewer-owned read-only scripts or focused sed. This is not a content failure or a rerun of passed producer checks.",
    },
    "forbiddenActionsPerformed": [],
    "previousReviewer": "Anscombe completed, CLOSED and collected as stated by user; not contacted or reopened.",
    "parentProtocol": "Parent COLLECTS and CLOSES this reviewer before reading outputs. Return external index SHA and terse text only, no image payload.",
    "index": {"path": "output-index.json", "digestPath": "output-index.sha256",
              "outputsFields": ["path(relative)", "sha256", "bytes"],
              "selfExclude": ["output-index.json", "output-index.sha256"],
              "include": "Reviewer scripts and evidence only; no dependencies, PDF, runtime or duplicated input assets"},
}
write("report.json", report)
print(json.dumps({
    "scopeVerdicts": {key: value["status"] for key, value in report["scopeVerdicts"].items()},
    "bindings": len(before["records"]), "allUnchanged": True,
    "FIRSTInventoryAndHashMode": "0444 before manifest, still0444",
    "images": 2, "reviewerRepairs": 0,
    "wholeLessonApproved": False, "published": False, "promoted": False,
}, indent=2))
