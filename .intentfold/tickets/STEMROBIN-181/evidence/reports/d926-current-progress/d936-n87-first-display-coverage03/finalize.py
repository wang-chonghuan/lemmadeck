import hashlib
import json
from datetime import datetime
from pathlib import Path


ROOT = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
OUT = ROOT / ".intentfold/tickets/STEMROBIN-181/tmp/d936-n87-first-display-coverage03"
OBSERVATIONS = [
    {
        "recipeId": "zh-exercises-390-coverage-1",
        "visibleContent": "Complete mobile exercise page: title, section heading, exercises 1-6 and return control.",
        "localizedObservations": [
            {"region": "Title and section heading, crop y=24..155", "observation": "Title fits the 390px crop with clear side margins; heading and rule do not collide."},
            {"region": "Exercise rows 1-6, crop y=176..630", "observation": "All six prompts are legible. Longer prompts wrap within their row; separators and line spacing keep rows distinct."},
            {"region": "Exercise 5, crop y=479..568", "observation": "Stacked 1/n fraction, italic n and parentheses fit inside the wrapped prompt without clipping or overlapping adjacent lines."},
            {"region": "Return control, crop y=683..723", "observation": "Arrow and label fit; control is separated from exercise 6."},
        ],
        "tileEdges": "This assigned recipe covers the entire 390x844 exercise source. No inference from unassigned images.",
    },
    {
        "recipeId": "zh-choices-1440-coverage-1",
        "visibleContent": "Desktop title; question 1 and A-D; question 2 and A-D; question 3 stem and beginning of A at the lower slice.",
        "localizedObservations": [
            {"region": "Main column, crop x=377..1063", "observation": "Title, question numbers, Latin option labels and body text have distinct aligned gutters and ample right margins."},
            {"region": "Questions 1-2, crop y=97..830", "observation": "Prompts and all eight option texts wrap cleanly; no visible clipping, overlap or inconsistent inter-option spacing."},
            {"region": "Question 3 stem, crop y=878..930", "observation": "Stem fits in two lines and remains separate from its number and option block."},
        ],
        "tileEdges": "Question 3 A crosses source y=960; its continuation is observed in assigned desktop coverage-2. The slice is not a page-clipping defect.",
    },
    {
        "recipeId": "zh-choices-1440-coverage-2",
        "visibleContent": "Question 3 A continuation and B-D; question 4 stem and A-D; question 5 stem and A-B plus beginning of C at the lower slice.",
        "localizedObservations": [
            {"region": "Question 3 option block, crop y=0..257", "observation": "Remaining option text follows the same hanging indent and line spacing as coverage-1; labels and prose stay separated."},
            {"region": "Question 4, crop y=304..681", "observation": "Long stem and options fit inside the desktop text column with clear rule and paragraph spacing."},
            {"region": "Question 5, crop y=728..925", "observation": "Inline lambda_water=lambda_air/n, subscripts, italic n and 1/n expressions are readable and fit without colliding with Chinese text."},
        ],
        "tileEdges": "Top slice continues question 3 A from coverage-1; question 5 C crosses source y=1920 into assigned coverage-3. Neither deliberate boundary is reported as clipping.",
    },
    {
        "recipeId": "zh-choices-1440-coverage-3",
        "visibleContent": "Question 5 C continuation and D; complete question 6 stem and A-F; bottom page whitespace.",
        "localizedObservations": [
            {"region": "Question 5 continuation, crop y=0..110", "observation": "Continuation and D align with the established option gutter; 1/n remains legible."},
            {"region": "Question 6, crop y=154..578", "observation": "All six Latin labels A-F are distinct and correctly spaced from their text. Long option lines wrap cleanly and stay inside the column."},
            {"region": "Final option and page bottom, crop y=555..686", "observation": "Final F text is fully visible, with unobstructed trailing whitespace; no end-of-page truncation."},
        ],
        "tileEdges": "Question 5 C at the top is the continuation from assigned coverage-2. The three desktop crops cover source y=0..2606 without a gap.",
    },
    {
        "recipeId": "zh-choices-390-coverage-1",
        "visibleContent": "Mobile title; complete question 1 and A-D; question 2 stem and A beginning.",
        "localizedObservations": [
            {"region": "Title, crop y=25..58", "observation": "The title fits within the 375px captured document width with visible right margin."},
            {"region": "Question 1, crop x=16..367 and y=81..613", "observation": "Number, stem, Latin labels and option text occupy distinct gutters; long text wraps within the narrow column without overlap."},
            {"region": "Question 2 stem and A beginning, crop y=661..844", "observation": "Rule and stem spacing are clear; A's hanging indent matches question 1."},
        ],
        "tileEdges": "Question 2 A continues across source y=844 into assigned mobile coverage-2; the lower slice is deliberate.",
    },
    {
        "recipeId": "zh-choices-390-coverage-2",
        "visibleContent": "Question 2 A continuation and B-D; question 3 stem and A-C plus D beginning.",
        "localizedObservations": [
            {"region": "Question 2 continuation and B-D, crop y=0..315", "observation": "Visible rows remain inside the narrow column; Latin labels are separate from wrapped text, with consistent inter-option spacing."},
            {"region": "Question 3 stem and A-C, crop y=365..765", "observation": "Stem and options wrap naturally; no glyphs collide with the question number, labels, separators or adjacent lines."},
            {"region": "Question 3 D beginning, crop y=787..844", "observation": "D label and visible text align with preceding options."},
        ],
        "tileEdges": "Top continues question 2 A from coverage-1. Question 3 D continues at source y=1688 into assigned coverage-3; this is slicing, not a layout fault.",
    },
    {
        "recipeId": "zh-choices-390-coverage-3",
        "visibleContent": "Question 3 D ending; complete question 4 and A-D; question 5 stem/formula beginning.",
        "localizedObservations": [
            {"region": "Question 3 D ending, crop y=0..22", "observation": "The ending follows the same hanging indent seen in coverage-2."},
            {"region": "Question 4, crop y=68..757", "observation": "The five-line stem and all four long options fit within the mobile column; labels, rules and wrapped lines do not overlap."},
            {"region": "Question 5 beginning, crop y=806..844", "observation": "Question number and first line including lambda_water and equality sign remain readable and within the right margin."},
        ],
        "tileEdges": "Question 5's formula continues onto the next text line and across source y=2532 into assigned coverage-4; the two assigned regions show the deliberate slice.",
    },
    {
        "recipeId": "zh-choices-390-coverage-4",
        "visibleContent": "Question 5 stem continuation and complete A-D; question 6 stem and A-B. Mobile question 6 C-F are not assigned or observed.",
        "localizedObservations": [
            {"region": "Question 5 stem continuation, crop y=0..109", "observation": "The lambda_air/n continuation is legible. Formula wrapping from coverage-3 fits the narrow column rather than overflowing it."},
            {"region": "Question 5 options A-D, crop y=132..527", "observation": "Italic n and 1/n expressions fit their lines, with readable subscripts and consistent spacing. No visible clipping or overlap."},
            {"region": "Question 6 stem and A-B, crop y=571..835", "observation": "Number, stem, A and B labels and their wrapped texts are separated and legible. B's last visible line ends before the crop boundary."},
        ],
        "tileEdges": "Source y=3376..4028 is deliberately unassigned and remains HOLD. No claim is made about mobile question 6 C-F or final page spacing there.",
    },
]


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def write_new(path, value):
    with path.open("x", encoding="ascii") as stream:
        json.dump(value, stream, indent=2, ensure_ascii=True)
        stream.write("\n")


assert Path.cwd().resolve() == ROOT
assert not (OUT / "report.json").exists(), "One-shot report already exists"
materialization = json.loads((OUT / "materialization.json").read_text())
assert [item["recipeId"] for item in OBSERVATIONS] == materialization["batch"]["recipeIds"]
assert len(list(OUT.glob("*.png"))) == 8
verdicts = []
for observation, crop in zip(OBSERVATIONS, materialization["crops"], strict=True):
    assert digest(Path(crop["path"])) == crop["sha256"]
    verdicts.append({
        **crop,
        **observation,
        "verdict": "PASS",
        "verdictScope": "Assigned crop pixels only; no semantic or answer-correctness review.",
        "imageLoads": 1,
        "imageTool": "functions.view_image",
        "imageDetail": "original",
        "coordinates": "Approximate crop-local pixels for localized observations; exact crop rectangle is recorded separately.",
        "criteria": {
            "promptAndLatinLabelReadability": "PASS",
            "formulaFitWhereVisible": "PASS",
            "clippingWithinObservedLayout": "PASS",
            "overlap": "PASS",
            "spacing": "PASS",
        },
        "localizedFindings": [],
    })

timestamp = datetime.now().astimezone().isoformat()
report = {
    "schema": "d936-n87-first-display-review-v1",
    "recordedAt": timestamp,
    "ticket": "STEMROBIN-181",
    "successor": "successor181-3",
    "assignment": "d936 FIRST n87 DISPLAY full-coverage-3 ONLY OFFLINE",
    "card": "phy10-c2-s3-n87",
    "repository": str(ROOT),
    "ownWritesOnly": str(OUT),
    "status": "HOLD",
    "batch": "full-coverage-3",
    "batchVerdict": "PASS",
    "batchVerdictScope": "All eight assigned crops inspected once; observed display layout only.",
    "DISPLAY": "HOLD",
    "fullDISPLAY": False,
    "completeCard": False,
    "sourceBinding": "PASS",
    "sourceScreenshotHashesVerifiedWithoutModelLoading": True,
    "inputs": materialization["inputs"],
    "sourceScreenshots": materialization["sources"],
    "nativeClientContext": {
        "locale": "zh",
        "questionCount": 6,
        "optionCount": 26,
        "optionCountsByQuestion": [4, 4, 4, 4, 4, 6],
        "contextLimitedTo": "d900 native zh lesson/exercises and d909 zh/client-views.json",
        "serverKeysRead": False,
        "semanticReviewPerformed": False,
        "semanticReviewReplays": 0,
    },
    "coverage": [
        {"surface": "zh-exercises-390", "sourceHeight": 844, "observedY": [0, 844], "observedExerciseCount": 6, "surfaceLayoutCoverage": "COMPLETE_WITHIN_CAPTURE"},
        {"surface": "zh-choices-1440", "sourceHeight": 2606, "observedY": [0, 2606], "observedQuestionStems": 6, "observedCompleteOptions": 26, "surfaceLayoutCoverage": "COMPLETE_WITHIN_CAPTURE"},
        {"surface": "zh-choices-390", "sourceHeight": 4028, "observedY": [0, 3376], "observedQuestionStems": 6, "observedCompleteOptions": 22, "unobservedY": [3376, 4028], "unobservedOptions": ["6.C", "6.D", "6.E", "6.F"], "surfaceLayoutCoverage": "PARTIAL", "unobservedVerdict": "HOLD"},
    ],
    "cropVerdicts": verdicts,
    "localizedFindings": [],
    "holdReasons": [
        "Mobile choices source y=3376..4028, including question 6 C-F and trailing page layout, was not loaded; remains HOLD.",
        "Other lesson/answers/English/figure-detail regions were not inspected in this batch; no independent verdict or full DISPLAY approval is claimed.",
        "Prior full-coverage-1, full-coverage-2 and figure-detail evidence was not reopened, imported as approval or semantically replayed.",
    ],
    "imageUsage": {
        "actualImagesLoaded": 8,
        "uniqueCropsLoaded": 8,
        "eachCropLoads": 1,
        "maximumBatchImages": 8,
        "currentContextImages": 8,
        "contextImagesBelow24": True,
        "originalScreenshotsLoaded": 0,
        "reopens": 0,
        "extraImages": 0,
        "recropsAfterLoading": 0,
        "imagePayloadReturned": False,
    },
    "prohibitedActionsPerformed": [],
    "candidateSpecHtmlEdits": 0,
    "nativeProducerCalls": 0,
    "renderBrowserRecaptureCalls": 0,
    "paidCalls": 0,
    "backendDatabasePublisherDeployCalls": 0,
    "gitIndexMeterPromoteActions": 0,
    "testsOrBuilds": 0,
    "supervisorOtherChatsNewWorktreeActions": 0,
    "othersPreserved": True,
}
write_new(OUT / "report.json", report)
write_new(OUT / "usage.json", {
    "schema": "d936-n87-first-display-usage-v1",
    "assignment": report["assignment"],
    "batch": report["batch"],
    "actualImages": 8,
    "imageLoads": 8,
    "uniqueImages": 8,
    "loadsPerCrop": {item["recipeId"]: 1 for item in verdicts},
    "sourceImagesLoaded": 0,
    "reopens": 0,
    "extraImages": 0,
    "recropsAfterLoad": 0,
    "maxBatchImages": 8,
    "contextImages": 8,
    "contextImageLimit": 24,
    "imagePayload": False,
    "paidCalls": 0,
    "nativeProducerCalls": 0,
    "nativeRenderReplays": 0,
    "semanticReviewReplays": 0,
    "inputTokens": None,
    "outputTokens": None,
    "totalTokens": None,
    "tokenCost": None,
    "tokenCostStatus": "unknown",
    "costUsd": None,
    "costStatus": "unknown",
    "usageSource": "Actual eight view_image invocations; token/cost telemetry unavailable and no meter invoked.",
})
files = sorted(path for path in OUT.iterdir() if path.is_file())
assert len(files) == 13
write_new(OUT / "freeze.json", {
    "schema": "d936-n87-first-display-freeze-v1",
    "recordedAt": timestamp,
    "repository": str(ROOT),
    "ownWritesOnly": str(OUT),
    "batch": report["batch"],
    "status": "HOLD",
    "batchVerdict": "PASS",
    "fullDISPLAY": False,
    "completeCard": False,
    "actualImages": 8,
    "tokenCost": None,
    "tokenCostStatus": "unknown",
    "inputs": materialization["inputs"],
    "sourceScreenshots": materialization["sources"],
    "files": [{"path": str(path), "sha256": digest(path)} for path in files],
    "checksumFile": str(OUT / "SHA256SUMS"),
    "checksumConvention": "SHA256SUMS includes freeze.json and all other owned files, but excludes itself; no circular hashes.",
    "fileMode": "0444 after finalization",
    "noImagePayload": True,
})
files = sorted(path for path in OUT.iterdir() if path.is_file())
checksum = OUT / "SHA256SUMS"
with checksum.open("x", encoding="ascii") as stream:
    for path in files:
        stream.write(f"{digest(path)}  {path}\n")
for path in [*files, checksum]:
    path.chmod(0o444)
print(json.dumps({
    "batchVerdict": "PASS",
    "DISPLAY": "HOLD",
    "completeCard": False,
    "actualImages": 8,
    "report": str(OUT / "report.json"),
    "reportSha256": digest(OUT / "report.json"),
    "freezeSha256": digest(OUT / "freeze.json"),
    "SHA256SUMS": str(checksum),
    "SHA256SUMSSha256": digest(checksum),
}, indent=2))
