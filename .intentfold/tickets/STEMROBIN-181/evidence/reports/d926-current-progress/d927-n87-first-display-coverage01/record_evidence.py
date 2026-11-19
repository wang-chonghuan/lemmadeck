import hashlib
import json
from datetime import datetime, timezone
from pathlib import Path


ROOT = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
OUTPUT = ROOT / ".intentfold/tickets/STEMROBIN-181/tmp/d927-n87-first-display-coverage01"
EXPECTED_IDS = [
    *[f"zh-text-1440-coverage-{index}" for index in range(1, 7)],
    "zh-text-390-coverage-1",
    "zh-text-390-coverage-2",
]


def sha256(path):
    with path.open("rb") as stream:
        return hashlib.file_digest(stream, "sha256").hexdigest()


def write_json(path, value):
    with path.open("x", encoding="utf-8") as stream:
        json.dump(value, stream, indent=2, ensure_ascii=True)
        stream.write("\n")


def observation(text, local_box, classification="PASS"):
    return {
        "classification": classification,
        "localPixelBoxApprox": local_box,
        "finding": text,
    }


REVIEWS = [
    {
        "bodyRegion": "Lesson heading, printed page, introduction and surface-quality prose; start of fig-201.",
        "textReadability": "PASS",
        "mathBaseline": "PASS",
        "labels": "PASS-visible-fragment",
        "clipping": "PASS-in-region",
        "overlap": "PASS",
        "whitespace": "PASS",
        "figureVisibility": "PASS-with-adjacent-assigned-tile",
        "surfaceBody": "PASS-assigned-region",
        "findings": [
            observation(
                "Title, printed-page label and Chinese prose are sharp and readable. The central text column has consistent line spacing and clear section separation.",
                [377, 46, 1064, 858],
            ),
            observation(
                "The one-tenth fraction and 10^-6 exponents are distinguishable, aligned with their surrounding prose, and do not collide with adjacent lines.",
                [377, 552, 1057, 857],
            ),
            observation(
                "The Test surface label and the beginning of fig-201 are visible at the bottom. Its continuation is in assigned desktop coverage-2; the y=960 tile boundary is not a page defect.",
                [458, 904, 1002, 960],
                "INTENTIONAL-TILE-EDGE",
            ),
        ],
        "adjacentRecipeIdsUsed": ["zh-text-1440-coverage-2"],
    },
    {
        "bodyRegion": "Continuation and caption of fig-201, optical-coating introduction and refractive-index paragraph.",
        "textReadability": "PASS",
        "mathBaseline": "PASS",
        "labels": "PASS",
        "clipping": "PASS-in-region",
        "overlap": "PASS",
        "whitespace": "PASS",
        "figureVisibility": "PASS-with-adjacent-assigned-tile",
        "surfaceBody": "PASS-assigned-region",
        "findings": [
            observation(
                "The wedge and reference plate are visible, with readable Air wedge and Reference plate labels and a separate fig-201 caption. The upper edge continues coverage-1, rather than showing image-container clipping.",
                [459, 0, 1002, 268],
                "INTENTIONAL-TILE-EDGE",
            ),
            observation(
                "The optical-coating heading, numerical percentages and subsequent paragraphs remain readable, with clear gaps between paragraphs and no overlapping text.",
                [377, 326, 1063, 778],
            ),
            observation(
                "The n_film/n_glass prose subscripts are visibly distinct and clear of their neighboring characters. The refractive-index paragraph wraps within the column.",
                [377, 839, 1063, 931],
            ),
        ],
        "adjacentRecipeIdsUsed": ["zh-text-1440-coverage-1"],
    },
    {
        "bodyRegion": "Normal-incidence paragraph, full fig-202 and caption, wave-path and wavelength prose.",
        "textReadability": "PASS",
        "mathBaseline": "PASS",
        "labels": "PASS",
        "clipping": "PASS-in-region",
        "overlap": "PASS",
        "whitespace": "PASS",
        "figureVisibility": "PASS",
        "surfaceBody": "PASS-assigned-region",
        "findings": [
            observation(
                "Fig-202 is fully visible. Normal incidence, Incident, ray numbers 1/2, h, n_air, n_film, n_glass and All rays share one line. are legible and separated from the diagram and each other.",
                [416, 141, 984, 615],
            ),
            observation(
                "The figure caption is separate from the drawing and prose. Borders, h dimension and ray arrowheads are visible; no figure-boundary clipping or label collision is observed.",
                [415, 204, 985, 660],
            ),
            observation(
                "Prose beneath the figure, 2h, lambda subscripts and the inline reciprocal fraction are readable without collision with the next line.",
                [377, 685, 1064, 935],
            ),
        ],
        "adjacentRecipeIdsUsed": [],
    },
    {
        "bodyRegion": "Frequency prose, wavelength equation, phase footnote, equation (7.8), amplitude prose and beginning of green-light paragraph.",
        "textReadability": "PASS",
        "mathBaseline": "PASS",
        "labels": "PASS",
        "clipping": "PASS-in-region",
        "overlap": "PASS",
        "whitespace": "PASS",
        "figureVisibility": "NOT-APPLICABLE-no-figure-in-region",
        "surfaceBody": "PASS-assigned-region",
        "findings": [
            observation(
                "The standalone wavelength relation and equation (7.8) have readable fraction bars, numerator/denominator, subscripts and equation number; the surrounding baselines remain separate.",
                [377, 89, 497, 548],
            ),
            observation(
                "Circled footnote markers, refractive-index inequalities and pi are visible. All prose and the amplitude section retain regular line spacing without overlap.",
                [377, 145, 1064, 775],
            ),
            observation(
                "The green-light numerical line reaches the lower tile boundary. The residual subscript pixels at the top of assigned coverage-5 complete that line; this is intentional tiling, not document clipping.",
                [377, 939, 1064, 960],
                "INTENTIONAL-TILE-EDGE",
            ),
        ],
        "adjacentRecipeIdsUsed": ["zh-text-1440-coverage-5"],
    },
    {
        "bodyRegion": "Quarter-wave paragraph, source-footnote prose and names, film-thickness equation, residual-color and ice-crack paragraphs.",
        "textReadability": "PASS",
        "mathBaseline": "PASS",
        "labels": "PASS",
        "clipping": "PASS-in-region",
        "overlap": "PASS",
        "whitespace": "PASS",
        "figureVisibility": "NOT-APPLICABLE-no-figure-in-region",
        "surfaceBody": "PASS-assigned-region",
        "findings": [
            observation(
                "The small top-edge fragment belongs to the preceding green-light expression in coverage-4; the adjacent assigned tile supplies its readable main line.",
                [680, 0, 695, 4],
                "INTENTIONAL-TILE-EDGE",
            ),
            observation(
                "The quarter fraction, footnote marker, quoted footnote prose and historical names are readable. Line wraps and paragraph gaps are orderly, with no collision or interior cut-off.",
                [377, 35, 1064, 513],
            ),
            observation(
                "The h formula has distinct lambda_green and 4n_film fraction components. The color and ice-crack prose below it is legible and remains within the central column.",
                [377, 542, 1064, 916],
            ),
        ],
        "adjacentRecipeIdsUsed": ["zh-text-1440-coverage-4"],
    },
    {
        "bodyRegion": "Final energy-conservation and loss-model paragraphs, exercise link and bottom document whitespace.",
        "textReadability": "PASS",
        "mathBaseline": "NOT-APPLICABLE-no-math-expression-in-region",
        "labels": "PASS",
        "clipping": "PASS-in-region",
        "overlap": "PASS",
        "whitespace": "PASS",
        "figureVisibility": "NOT-APPLICABLE-no-figure-in-region",
        "surfaceBody": "PASS-assigned-region",
        "findings": [
            observation(
                "The final prose is fully visible, with consistent line spacing and a distinct gap before the exercise link. The final sentence is not truncated at the document end.",
                [377, 19, 1064, 217],
            ),
            observation(
                "The blue exercise link has readable text, exercise count 6 and right arrow, with no icon/text collision. Its behavior is not tested by this screenshot review.",
                [376, 279, 526, 320],
            ),
            observation(
                "The remaining bottom whitespace is an ordinary end-of-document margin, not a missing-body or loading-only region.",
                [377, 320, 1064, 413],
            ),
        ],
        "adjacentRecipeIdsUsed": [],
    },
    {
        "bodyRegion": "Mobile lesson heading, printed page, introduction and beginning of surface-quality section.",
        "textReadability": "PASS",
        "mathBaseline": "PASS",
        "labels": "PASS",
        "clipping": "PASS-in-region",
        "overlap": "PASS",
        "whitespace": "PASS-with-observation",
        "figureVisibility": "NOT-APPLICABLE-no-figure-in-region",
        "surfaceBody": "PASS-assigned-region",
        "findings": [
            observation(
                "The mobile heading fits on one line. Printed-page text, Chinese paragraphs and the bold surface-quality heading are readable, with distinct paragraph and section spacing.",
                [15, 28, 374, 769],
            ),
            observation(
                "Several body lines approach the captured right edge, leaving only a few pixels of white gutter versus the larger left gutter. Visible terminal glyphs remain readable; no cut glyph or horizontal text overlap is observed in this assigned tile.",
                [346, 118, 375, 639],
                "NON-BLOCKING-OBSERVATION",
            ),
            observation(
                "The one-tenth fraction and 10^-6 exponent near the bottom remain distinguishable and do not collide with the following baseline. The next paragraph continues in assigned mobile coverage-2.",
                [15, 778, 374, 838],
            ),
        ],
        "adjacentRecipeIdsUsed": ["zh-text-390-coverage-2"],
    },
    {
        "bodyRegion": "Mobile surface-quality continuation, complete fig-201/caption and opening of optical-coating section.",
        "textReadability": "PASS",
        "mathBaseline": "PASS",
        "labels": "PASS",
        "clipping": "PASS-in-region",
        "overlap": "PASS",
        "whitespace": "PASS-with-observation",
        "figureVisibility": "PASS",
        "surfaceBody": "PASS-assigned-region",
        "findings": [
            observation(
                "The surface-quality paragraphs and 10^-6 expression are legible with regular line spacing. Some terminal characters sit close to the right edge, but no clipped glyph or overlapping line is observed.",
                [15, 11, 375, 502],
                "NON-BLOCKING-OBSERVATION",
            ),
            observation(
                "Fig-201 is fully visible within the mobile width. Test surface, Air wedge and Reference plate labels are readable; the wedge, hatch marks and plate border are visible without clipping or label collision.",
                [48, 536, 353, 683],
            ),
            observation(
                "The fig-201 caption is separate from the figure and divider. The optical-coating heading and its opening sentence remain readable at the bottom of the assigned region.",
                [15, 712, 375, 843],
            ),
        ],
        "adjacentRecipeIdsUsed": ["zh-text-390-coverage-1"],
    },
]


def main():
    if Path.cwd().resolve() != ROOT:
        raise RuntimeError("Run only from the explicitly assigned worktree")
    manifest_path = OUTPUT / "materialization.json"
    manifest = json.loads(manifest_path.read_text())
    crops = manifest["crops"]
    if [item["recipeId"] for item in crops] != EXPECTED_IDS or len(REVIEWS) != 8:
        raise RuntimeError("Evidence is not the exact assigned eight-image batch")
    individual_reviews = []
    for index, (crop, review) in enumerate(zip(crops, REVIEWS), 1):
        if sha256(Path(crop["path"])) != crop["sha256"]:
            raise RuntimeError("Crop changed after its one visual load")
        item = {
            **crop,
            **review,
            "verdict": "PASS",
            "reviewScope": "DISPLAY pixels only, exact assigned recipe rectangle",
            "visualLoadOrdinal": index,
            "visualLoads": 1,
            "reopens": 0,
            "viewImageDetail": "original",
        }
        for finding in item["findings"]:
            left, top, right, bottom = finding["localPixelBoxApprox"]
            finding["documentPixelBoxApprox"] = [
                left + crop["crop"]["left"],
                top + crop["crop"]["top"],
                right + crop["crop"]["left"],
                bottom + crop["crop"]["top"],
            ]
        individual_reviews.append(item)

    timestamp = datetime.now(timezone.utc).isoformat()
    report = {
        "schema": "d927-n87-first-display-coverage01-review-v1",
        "ticket": "STEMROBIN-181",
        "assignment": "successor181-3",
        "review": "d927 FIRST n87 DISPLAY full-coverage-1 ONLY",
        "card": "phy10-c2-s3-n87",
        "repository": str(ROOT),
        "outputDirectory": str(OUTPUT),
        "recordedAtUTC": timestamp,
        "mode": "OFFLINE",
        "status": "ASSIGNED-REGIONS-DISPLAY-PASS-FULL-DISPLAY-HOLD",
        "batchId": "full-coverage-1",
        "batchVerdict": "PASS",
        "batchReviewComplete": True,
        "DISPLAY": "HOLD",
        "fullDISPLAY": False,
        "completeCard": False,
        "blockingPixelFindingsInAssignedRegions": [],
        "nonBlockingPixelFindings": [
            "Mobile prose in both assigned tiles has a narrow right gutter; observed terminal glyphs remain readable and uncut."
        ],
        "inputs": manifest["inputs"],
        "nativeTextContext": manifest["nativeTextContext"],
        "materialization": {
            "path": str(manifest_path),
            "sha256": sha256(manifest_path),
            "sourceHashesVerifiedBeforeDecode": True,
            "exactRecipeRectangles": True,
            "resizing": False,
            "sourceScreenshotsLoadedIntoModel": 0,
        },
        "coverage": {
            "reviewedFullCoverageRecipes": 8,
            "requiredFullCoverageRecipes": 77,
            "fullCoverageRecipesOutsideThisBatch": 69,
            "detailRecipesReviewedByThisBatch": 0,
            "requiredDetailRecipes": 8,
            "allEvidenceComposedByThisBatch": False,
            "globalGate": "Full DISPLAY and completeCard remain false until 77 full-coverage plus 8 detail results are composed and all blocking failures are resolved.",
            "surfaces": [
                {
                    "locale": "zh",
                    "surface": "text",
                    "viewport": {"width": 1440, "height": 960},
                    "capturedDocumentDimensions": {"width": 1425, "height": 5213},
                    "reviewedDocumentRectangle": {"left": 0, "top": 0, "width": 1425, "height": 5213},
                    "everyCapturedDocumentPixelReviewed": True,
                    "recipeCount": 6,
                    "scope": "Captured offline text surface only, not live app behavior.",
                },
                {
                    "locale": "zh",
                    "surface": "text",
                    "viewport": {"width": 390, "height": 844},
                    "capturedDocumentDimensions": {"width": 375, "height": 6933},
                    "reviewedDocumentRectangle": {"left": 0, "top": 0, "width": 375, "height": 1688},
                    "everyCapturedDocumentPixelReviewed": False,
                    "recipeCount": 2,
                    "scope": "Only the first 1688 captured CSS-pixel rows; later body and mobile fig-202 are unreviewed here.",
                },
            ],
        },
        "inheritedSemantics": {
            "SCI": "PASS-inherited-from-direct-user-instruction-not-re-reviewed",
            "figures": "PASS-inherited-from-direct-user-instruction-not-semantically-re-reviewed",
            "choices": "PASS-inherited-from-direct-user-instruction-not-re-reviewed",
        },
        "separateDetailEvidence": {
            "provenance": "Direct user instruction only; files and images not inspected.",
            "priorPASS": 6,
            "enMobileFAIL": 2,
            "mergedOrOverridden": False,
            "failuresRemainSeparateAndUnresolvedByThisBatch": True,
        },
        "tileEdgePolicy": {
            "intentionalRecipeEdgesAreNotPageDefects": True,
            "adjacentAssignedEvidenceUsedWithoutReopen": [
                ["zh-text-1440-coverage-1", "zh-text-1440-coverage-2"],
                ["zh-text-1440-coverage-4", "zh-text-1440-coverage-5"],
                ["zh-text-390-coverage-1", "zh-text-390-coverage-2"],
            ],
            "unassignedAdjacentTilesInspected": False,
        },
        "individualCropReviews": individual_reviews,
        "boundaries": {
            "allShellWorkdirExplicitR": True,
            "writesOnlyInAssignedScratch": True,
            "othersPreserved": True,
            "candidateContentSpecHTMLEdits": 0,
            "browserCalls": 0,
            "recaptures": 0,
            "nativeProducerCalls": 0,
            "gitOperations": 0,
            "indexMeterPromoteCalls": 0,
            "databasePublisherDeployCalls": 0,
            "paidCalls": 0,
            "testsBuildBackendCalls": 0,
            "supervisorOtherChatNewWorktreeCalls": 0,
            "imagePayloadsInTextualReport": False,
        },
        "stop": "Bounded textual report completed; no further image loads or production work authorized.",
    }
    usage = {
        "schema": "d927-n87-first-display-coverage01-usage-v1",
        "ticket": "STEMROBIN-181",
        "batchId": "full-coverage-1",
        "actualImagesLoaded": 8,
        "imagesLoadedIntoModel": 8,
        "uniqueAssignedCropsLoaded": 8,
        "sourceScreenshotsLoadedIntoModel": 0,
        "sourceScreenshotsDecodedByPillowForCroppingOnly": 2,
        "reopens": 0,
        "extraImages": 0,
        "maximumImagesPerBatch": 8,
        "maximumImagesPerContext": 24,
        "contextImageLoadsThisAssignment": 8,
        "actualImageLoadLedger": [
            {
                "ordinal": item["visualLoadOrdinal"],
                "recipeId": item["recipeId"],
                "path": item["path"],
                "sha256": item["sha256"],
                "tool": "functions.view_image",
                "detail": "original",
                "loads": 1,
            }
            for item in individual_reviews
        ],
        "tokenCost": None,
        "tokenCount": None,
        "tokenCostUnavailableReason": "The runtime exposes no per-batch token/cost accounting; not estimated.",
        "paidCalls": 0,
        "contentRevisions": 0,
        "recaptures": 0,
        "imagePayloadsIncluded": False,
    }
    report_path = OUTPUT / "report.json"
    usage_path = OUTPUT / "usage.json"
    write_json(report_path, report)
    write_json(usage_path, usage)
    payload_paths = [
        OUTPUT / "materialize_crops.py",
        OUTPUT / "record_evidence.py",
        manifest_path,
        report_path,
        usage_path,
        *[Path(item["path"]) for item in crops],
    ]
    frozen_files = [
        {"path": str(path), "sha256": sha256(path), "bytes": path.stat().st_size}
        for path in payload_paths
    ]
    freeze_path = OUTPUT / "freeze.json"
    write_json(
        freeze_path,
        {
            "schema": "d927-n87-first-display-coverage01-freeze-v1",
            "recordedAtUTC": timestamp,
            "batchId": "full-coverage-1",
            "batchVerdict": "PASS",
            "fullDISPLAY": False,
            "completeCard": False,
            "actualImagesLoaded": 8,
            "tokenCost": None,
            "inputBindings": manifest["inputs"],
            "nativeTextContext": manifest["nativeTextContext"],
            "files": frozen_files,
            "freezePolicy": "All listed evidence and checksum files made read-only; checksum manifests exclude themselves to avoid circular hashes.",
        },
    )
    checksummed_paths = [*payload_paths, freeze_path]
    checksum_text = "".join(
        f"{sha256(path)}  {path}\n" for path in checksummed_paths
    )
    checksum_path = OUTPUT / "SHA256SUMS"
    with checksum_path.open("x", encoding="ascii") as stream:
        stream.write(checksum_text)
    freeze_dir = OUTPUT / "freeze"
    freeze_dir.mkdir(exist_ok=False)
    nested_checksum_path = freeze_dir / "SHA256SUMS"
    with nested_checksum_path.open("x", encoding="ascii") as stream:
        stream.write(checksum_text)
    for path in [*checksummed_paths, checksum_path, nested_checksum_path]:
        path.chmod(0o444)
    print(
        json.dumps(
            {
                "report": str(report_path),
                "reportSha256": sha256(report_path),
                "usage": str(usage_path),
                "usageSha256": sha256(usage_path),
                "freeze": str(freeze_path),
                "freezeSha256": sha256(freeze_path),
                "SHA256SUMS": str(checksum_path),
                "freeze/SHA256SUMS": str(nested_checksum_path),
                "actualImagesLoaded": 8,
                "batchVerdict": "PASS",
                "DISPLAY": "HOLD",
                "fullDISPLAY": False,
                "completeCard": False,
                "tokenCost": None,
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
