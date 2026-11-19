import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { chmodSync, existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const R = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
const O = path.join(R, ".intentfold/tickets/STEMROBIN-181/tmp/d883-source236-first-independent-review");
const sha = (file) => createHash("sha256").update(readFileSync(file)).digest("hex");
const json = (file) => JSON.parse(readFileSync(file, "utf8"));
const put = (name, value) => {
  const file = path.join(O, name);
  assert.equal(existsSync(file), false);
  writeFileSync(
    file,
    typeof value === "string" ? value : `${JSON.stringify(value, null, 2)}\n`,
    { flag: "wx" },
  );
};
assert.equal(process.cwd(), R);
const baseFile = path.join(O, "report.json");
const baseFreeze = path.join(O, "freeze.json");
const baseHash = "8551665c1e209c96a80d7556bca73522ad3d4023033105ec1fb075db1fac978c";
const baseFreezeHash = "47f3d895be17eabaa501897b1cf0f0f2c45517fad639459674b173fe3523d734";
assert.equal(sha(baseFile), baseHash);
assert.equal(sha(baseFreeze), baseFreezeHash);
const base = json(baseFile);
assert.equal(base.status, "HOLD");
assert.equal(base.usage.imageLoadsCumulativeInContext, 5);
assert.equal(base.review.fullPageComparisonPasses, 1);
const rasterReceiptFile = path.join(O, "portrait-svg-raster.receipt.json");
const raster = json(rasterReceiptFile);
assert.equal(raster.exit, 0);
assert.equal(raster.rasterInvocationsThisScope, 1);
assert.equal(sha(raster.vectorReceipt), raster.vectorReceiptSha256);
assert.equal(raster.vectorReceiptSha256, "00c7be33a631b44069bc5ec456db046b540cf70d64690764e5046f357d6ab14a");
assert.equal(sha(raster.sourcePng.path), raster.sourcePng.sha256);
assert.equal(sha(raster.vectorPng.path), raster.vectorPng.sha256);
assert.equal(sha(raster.svg.path), raster.svg.sha256);
assert.equal(sha(raster.raster.path), raster.raster.sha256);
const parentReceipt = json(raster.vectorReceipt);
assert.equal(parentReceipt.exit, 0);
assert.equal(parentReceipt.portraitApproval, false);
assert.equal(parentReceipt.sourceOrFinalizeReplays, 0);
assert.equal(parentReceipt.stdout.includes("不匹配 0.006%"), true);

const scopedFile = path.join(O, "portrait-svg-first-review.json");
const vectorReview = {
  schema: "source-portrait-first-independent-svg-review@1",
  assignment: "d883 FIRST SOURCE236 portrait SVG scoped review after parent d891 missing FIRST vector stage",
  root: R,
  ownedWriteRoot: O,
  recordedAt: new Date().toISOString(),
  book: "10p",
  physicalPage: 236,
  sourceFigureRef: "p0236#4",
  figureId: "tbl-p0236-01",
  scope: "FIRST raw portrait SVG fidelity only, against already independently observed portrait PNG",
  status: "PASS",
  independentReview: true,
  sourceProseApproval: false,
  wholeSourceStatus: "HOLD",
  completeCard: false,
  priorSourceAndPngObservations: {
    report: baseFile,
    reportSha256: baseHash,
    freeze: baseFreeze,
    freezeSha256: baseFreezeHash,
    rowReview: path.join(O, "row-review.json"),
    rowReviewSha256: sha(path.join(O, "row-review.json")),
    sourceFullRowReviewPasses: 1,
    observationsPreservedWithoutRepeating: true,
    portraitPngOriginalImageLoadOrder: 5,
  },
  pipelineHistory: {
    ownsUnnumberedPortrait: true,
    ownedPortraitBlock: 4,
    numbered206207UnownedDoesNotMeanNoOwnedFigure: true,
    absentSvgWasNotPass: true,
    vectorStageOriginallyMissing: true,
    missingFirstStageCompletedByParentD891: true,
    noNeedToRepeatSourceOrProseReview: true,
  },
  parentVectorStage: {
    receipt: raster.vectorReceipt,
    receiptSha256: raster.vectorReceiptSha256,
    exit: 0,
    mismatchPercentReported: 0.006,
    firstStageInvocationsReported: 1,
    sameSourcePngHashVerified: true,
    sourceOrFinalizeReplays: 0,
    paidCalls: 0,
    parentReceiptNotTreatedAsIndependentVisualApproval: true,
  },
  bindings: {
    originalObservedPng: raster.sourcePng,
    vectorInputPng: raster.vectorPng,
    svg: raster.svg,
    svgRaster: { ...raster.raster, width: 341, height: 467 },
    rasterReceipt: { path: rasterReceiptFile, sha256: sha(rasterReceiptFile) },
  },
  independentVisualObservation: {
    imageLoadOrder: 6,
    svgRasterLoads: 1,
    comparisonReference: "d870 PNG already loaded at order5 and retained in this same bounded context; not reopened",
    headHairAndWhiteHairDetailsPreserved: true,
    foreheadEyebrowsEyesNoseMouthAndChinPreserved: true,
    earJawAndNeckContoursPreserved: true,
    collarCravatCoatAndLowerBustPreserved: true,
    blackWhiteTopologyAndProportionsPreserved: true,
    cleanWhiteMargins: true,
    noClipping: true,
    noAdjacentProseCaptionOrFooter: true,
    noInventedLabelsOrFigureNumber: true,
    visibleSmoothing: "Expected contour smoothing at vector edges; no source-fidelity defect found.",
    nativeMismatchMetricNotSoleApprovalBasis: true,
    findings: [],
  },
  ownership: {
    owner: "adjacent 菲涅耳 small-type biography",
    sourceOwnerRefs: ["p0236#5", "p0236#6"],
    caption: null,
    printedFigureNumber: null,
    exerciseOwner: null,
    noSource237Inference: true,
    notModernEditionFigureApproval: true,
  },
  usage: {
    inheritedImageLoadsInContext: 5,
    newImageLoadsThisSvgScope: 1,
    cumulativeImageLoadsInContext: 6,
    batches: 1,
    maximumImagesInBatch: 6,
    batchLimit: 8,
    contextLimit: 24,
    noPngSourcePageOrProseReopen: true,
    newRasterInvocations: 1,
    reviewerVectorizeInvocations: 0,
    reviewerFinalizeInvocations: 0,
    sourceProseReviewReplays: 0,
    contentRepairs: 0,
    paidCalls: 0,
    hostUsage: "unknown",
  },
  stop: {
    onlyD883WriteRootUsed: true,
    noSourceProseRepair: true,
    noCanonicalIndexMeterGitDatabasePublisherDeployBrowserOrChats: true,
    noSource237Read: true,
    noOtherStageAuthorizedByThisPass: true,
  },
};
put("portrait-svg-first-review.json", vectorReview);
const cumulativeLoads = [
  ...base.usage.loads,
  {
    order: 6,
    batch: 1,
    path: raster.raster.path,
    sha256: raster.raster.sha256,
    kind: "FIRST portrait SVG raster only; compared with already-observed PNG",
  },
];
const current = {
  ...base,
  schema: "source-page-first-independent-review-current@1",
  recordedAt: new Date().toISOString(),
  currentScope: "preserved FIRST 26-row SOURCE/PNG review plus separately completed FIRST portrait SVG scoped review",
  priorFrozenSourceReport: {
    path: baseFile,
    sha256: baseHash,
    freeze: baseFreeze,
    freezeSha256: baseFreezeHash,
    originalBytesAndHistoryPreserved: true,
  },
  sourceStatus: "SOURCE_HOLD",
  status: "HOLD",
  sourceApproval: false,
  native: {
    ...base.native,
    status: "FINALIZE_PASS_REUSED_SOURCE_FIDELITY_HOLD",
    portraitVectorStage: {
      status: "FIRST_EXECUTION_COMPLETE_BY_PARENT_D891",
      receipt: raster.vectorReceipt,
      receiptSha256: raster.vectorReceiptSha256,
      invocationsParentReported: 1,
      reviewerReplays: 0,
      mismatchPercentReported: 0.006,
    },
  },
  ownership: {
    ...base.ownership,
    ownedFiguresCount: 1,
    unnumberedPortrait: {
      ...base.ownership.unnumberedPortrait,
      svg: raster.svg,
      svgRaster: raster.raster,
      svgStatus: "FIRST_SCOPED_PASS",
      rawPortraitPngAndSvgFidelityStatus: "PASS",
      svgReview: scopedFile,
      svgReviewSha256: sha(scopedFile),
      absentSvgWasNotAcceptedAsPass: true,
    },
  },
  history: {
    ...base.history,
    missingFirstPortraitVector: "Originally missing despite an owned unnumbered portrait; no absence-as-PASS. Parent d891 executes once, then d883 FIRST scoped SVG review PASS.",
    sourceAndPngHistoryNotRewritten: true,
  },
  usage: {
    ...base.usage,
    imageLoadsThisContext: 6,
    imageLoadsCumulativeInContext: 6,
    maximumImagesInBatch: 6,
    loads: cumulativeLoads,
    svgRasterInvocations: 1,
    sourceProseReviewReplays: 0,
    newSvgScopeImageLoads: 1,
  },
  evidence: {
    ...base.evidence,
    priorSourceFreeze: baseFreeze,
    svgReview: scopedFile,
    svgRasterReceipt: rasterReceiptFile,
    freeze: path.join(O, "freeze-with-svg.json"),
  },
};
assert.equal(current.review.rowsComparedToCandidate, 26);
assert.equal(current.review.fullPageComparisonPasses, 1);
assert.equal(current.review.findingsCount, 11);
assert.equal(current.usage.imageLoadsCumulativeInContext, 6);
put("report.current.json", current);
put("report.current.md", `# d883 Current FIRST Review: SOURCE HOLD / Portrait PNG+SVG PASS

The original FIRST 26-row SOURCE/PNG report and freeze are retained byte-for-byte.
The complete prose review was not repeated. SOURCE remains HOLD: two word/name
glyph errors plus nine filled dots still transcribed as U+3002.

The exact six d870 substitutions independently PASS. Native 26/26 is reused,
with no finalize replay.

SOURCE236 does own the unnumbered portrait p0236#4, tbl-p0236-01. Absence of
numbered RAW206/207 was never proof of absence of an owned figure or of SVG PASS.
Parent d891 completed this missing FIRST portrait-vector stage once (exit0,
reported mismatch0.006%). Receipt, PNG and SVG hashes are verified.

The one FIRST SVG raster was visually compared with the already observed PNG:
hair, face, ear/jaw, collar/cravat, coat and lower bust are preserved; no clipping
or neighboring text is present. FIRST raw portrait SVG scoped result: PASS.
This does not approve SOURCE prose, a complete card or any modern edition.

Images: original SOURCE, existing top detail, middle detail, lower detail,
portrait PNG, then SVG raster = 6 loads in one batch, within 8/batch and
24/context. No original page/prose/PNG reopen occurred for the SVG scope.

Current aggregate: report.current.json
Preserved original: report.json and freeze.json
FIRST SVG scoped evidence: portrait-svg-first-review.json
Current freeze: freeze-with-svg.json

No repair, vector/finalize replay, canonical/index/meter/Git/DB/publisher/deploy/
browser/other-chat action or SOURCE237 read was performed.
`);
assert.equal(sha(baseFile), baseHash);
assert.equal(sha(baseFreeze), baseFreezeHash);
const files = readdirSync(O).sort().map((name) => path.join(O, name));
const hashes = Object.fromEntries(files.map((file) => [file, sha(file)]));
put("freeze-with-svg.json", {
  schema: "source-page-first-independent-review-with-svg-freeze@1",
  recordedAt: new Date().toISOString(),
  root: R,
  ownedWriteRoot: O,
  status: "HOLD",
  sourceStatus: "SOURCE_HOLD",
  rawPortraitPngStatus: "PASS_RETAINED",
  rawPortraitSvgStatus: "FIRST_SCOPED_PASS",
  sourceApproval: false,
  independentReview: true,
  originalSourceReport: { path: baseFile, sha256: baseHash },
  originalSourceFreeze: { path: baseFreeze, sha256: baseFreezeHash },
  currentReportSha256: hashes[path.join(O, "report.current.json")],
  svgScopedReportSha256: hashes[scopedFile],
  parentFirstVectorReceipt: {
    path: raster.vectorReceipt,
    sha256: raster.vectorReceiptSha256,
  },
  sourcePngSha256: raster.sourcePng.sha256,
  svgSha256: raster.svg.sha256,
  svgRasterSha256: raster.raster.sha256,
  hashes,
  fullSourceRowComparisonPasses: 1,
  sourceRowsCompared: 26,
  imageLoadsCumulative: 6,
  oneBatchLoads: 6,
  batchLimit: 8,
  contextLimit: 24,
  noSourceProseReviewReplay: true,
  permissions: "New d883 files frozen 0444; existing FIRST files preserved.",
});
const originallyFrozen = new Set(Object.keys(json(baseFreeze).hashes));
originallyFrozen.add(baseFreeze);
for (const name of readdirSync(O)) {
  const file = path.join(O, name);
  if (!originallyFrozen.has(file)) chmodSync(file, 0o444);
}
console.log(JSON.stringify({
  sourceStatus: "HOLD",
  rowsReviewedOnce: 26,
  exactSixRepair: "PASS",
  portraitPng: "PASS retained",
  portraitSvg: "FIRST scoped PASS",
  images: "6/8 batch; 6/24 context",
  originalSourceReportUnchanged: sha(baseFile) === baseHash,
  paths: {
    currentReport: path.join(O, "report.current.json"),
    firstSvgReview: scopedFile,
    currentFreeze: path.join(O, "freeze-with-svg.json"),
  },
  hashes: {
    currentReport: sha(path.join(O, "report.current.json")),
    firstSvgReview: sha(scopedFile),
    currentFreeze: sha(path.join(O, "freeze-with-svg.json")),
    originalSourceReport: baseHash,
    parentVectorReceipt: raster.vectorReceiptSha256,
    svg: raster.svg.sha256,
  },
}, null, 2));
