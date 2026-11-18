import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const root = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
const out = path.dirname(new URL(import.meta.url).pathname);
const sha = p => crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
const read = p => JSON.parse(fs.readFileSync(p, "utf8"));
const local = name => path.join(out, name);
const bound = p => ({path: p, sha256: sha(p)});
const writeNew = (name, data) => fs.writeFileSync(local(name), JSON.stringify(data, null, 2) + "\n", {flag: "wx"});
const initial = read(local("input-bindings.json"));
const finalChecks = initial.checks.map(c => ({
  path: c.path,
  initialSha256: c.sha256,
  expectedSha256: c.expectedSha256,
  currentSha256: sha(c.path),
  unchanged: sha(c.path) === c.sha256,
  matches: sha(c.path) === c.expectedSha256
}));
const ledger = read(local("actual-opens.json"));
const openChecks = ledger.opens.map(o => ({sequence: o.sequence, ...bound(o.path), matches: sha(o.path) === o.sha256}));
const finalBindings = {
  schema: "stemrobin/bounded-review-final-bindings@1",
  status: finalChecks.every(c => c.unchanged && c.matches) && openChecks.every(c => c.matches) ? "PASS" : "FAIL",
  initialBindings: bound(local("input-bindings.json")),
  checkedFrozenBindings: finalChecks.length,
  checks: finalChecks,
  openChecks,
  forbiddenSourcePixelsLoaded: false
};
writeNew("final-bindings.json", finalBindings);
if (finalBindings.status !== "PASS") throw new Error("Final input binding failure; no pass report.");
if (ledger.opens.length !== 5 || ledger.newTotal !== 5 || ledger.cumulativeTotal !== 5) throw new Error("Open ledger mismatch.");
const author176 = path.join(root, ".intentfold/tickets/STEMROBIN-181/tmp/d224-source176-first-author");
const author216 = path.join(root, ".intentfold/tickets/STEMROBIN-181/tmp/d216-source174-175-first-author");
const sourcePage = path.join(author176, "source/10p/pages/0176");
const receipt176 = path.join(author176, "receipts/finalize-176-attempt1.json");
const vector176 = path.join(author176, "receipts/vectorize-176-attempt1.json");
const vector134 = path.join(author216, "receipts/vectorize-175-attempt1.json");
const details = read(local("source176-detail-observations.json"));
const pixel = read(local("raw134-pixel-comparison.json"));
const previewReceipt = read(local("svg134-preview-receipt.json"));
const pageJson = read(path.join(sourcePage, "page.json"));
const audit = read(path.join(sourcePage, "audit.json"));
const note = type => pageJson.meta.notes.filter(n => n.type === type);
const checks176 = {
  pixelInventoryBeforeAuthorTextRead: true,
  independentVisualPrintedLines: 24,
  authoredLineCount: pageJson.blocks.reduce((sum, b) => sum + b.lines.length, 0),
  nativeLinesPrinted: audit.lines_printed,
  nativeLinesMd: audit.lines_md,
  countsStatus: "PASS",
  textAndOriginalFormula: {
    status: "FAIL",
    formula: "$E=\\frac{\\Phi}{S}$ (6.5)",
    formulaStatus: "PASS",
    unitAndValueStatus: "PASS",
    units: ["1 坎德拉", "1 流明", "1 球面度", "1 米²", "勒克斯"],
    faithfulSourceWording: ["光强度（光通量）", "主要是要知道"],
    findings: details.findings
  },
  emphasis: {
    confirmedAuthorNotes: note("bold").concat(note("dot-emphasis")),
    confirmedStatus: "PASS-FOR-EXPLICIT-OBSERVED-SPANS",
    pointSourceBoldStatus: "HOLD-NOT-POSITIVELY-ESTABLISHED",
    initialInventoryBoldOverreadRetainedWithDetailClarification: true
  },
  blockMapping: {
    explanation: "Independent inventory separated the displayed formula as its own visual group; author correctly keeps that one visual line in p0176#6. Ten native blocks cover all 24 visual lines.",
    n67LastMainProse: "p0176#3",
    footnote: "p0176#9",
    footnoteOwner: "p0176#2",
    footnoteOwnerLine: 2,
    n68Heading: "p0176#4",
    n68HeadingText: "68. 照度",
    n68OpenTail: "p0176#8",
    n68Open: pageJson.blocks[7].open,
    footnoteNativeLabel: pageJson.blocks[8].label,
    ownerBindingStatus: "PASS",
    nextPhysicalPage: 177,
    nextPageObserved: false,
    n68RightBoundary: "HOLD-UNOBSERVED",
    fullLessonCompletion: "HOLD-NOT-CLAIMED"
  }
};
if (checks176.authoredLineCount !== 24 || !checks176.blockMapping.n68Open || checks176.blockMapping.footnoteNativeLabel !== "footnote") throw new Error("Source176 structural mismatch.");
const report = {
  schema: "stemrobin/bounded-first-independent-review@1",
  ticket: "STEMROBIN-181",
  reviewerUnit: "d231-source176-and-raw134-first-review",
  role: "fresh-temporary-limited-first-reviewer-not-permanent-A-D-worker",
  date: "2026-11-17",
  writeRoot: out,
  status: "FAIL-SOURCE176-RAW134-FIDELITY-PASS",
  source176: {
    status: "FAIL",
    authorFreeze: bound(path.join(author176, "author-freeze.json")),
    originalPage: bound(path.join(author176, "work/10p/pages/0176/page.png")),
    authorMd: bound(path.join(sourcePage, "page.md")),
    authorJson: bound(path.join(sourcePage, "page.json")),
    authorAudit: bound(path.join(sourcePage, "audit.json")),
    currentNativeExit: {
      finalize: read(receipt176).exitCode,
      vectorize: read(vector176).exitCode,
      finalizeReceipt: bound(receipt176),
      vectorizeReceipt: bound(vector176),
      receiptsBoundToCurrentMdJsonAudit: true,
      nativeCommandsRunByReviewer: 0,
      sourceReviewPassImpliedByExitZero: false
    },
    checks: checks176,
    pixelInventory: bound(local("source176-pixel-inventory.json")),
    detailObservations: bound(local("source176-detail-observations.json")),
    authorRepaired: false
  },
  raw134: {
    status: "PASS",
    passScope: "First independent fidelity comparison of actual native RAW134 PNG against existing SVG134 rendered preview only.",
    authorFreeze: bound(path.join(author216, "author-freeze.json")),
    actualnativeCrop: pixel.source,
    existingSvg: previewReceipt.inputSvg,
    preview: previewReceipt.preview,
    pixelInventory: bound(local("raw134-pixel-inventory.json")),
    svgPreviewReceipt: bound(local("svg134-preview-receipt.json")),
    pixelComparison: bound(local("raw134-pixel-comparison.json")),
    currentNativeExit: {
      authorVectorize: read(vector134).exitCode,
      authorReceipt: bound(vector134),
      currentAuthorFreezeAndSvgPngHashesMatch: true,
      authorReportedMismatchPercent: 0.001,
      reviewerPreviewExit: previewReceipt.exitCode,
      reviewerPixelComparisonExit: 0,
      reviewerNativeVectorizeRuns: 0
    },
    visualChecks: {
      leftApexAndRayFan: "PASS",
      rightDirectedArrows: "PASS",
      nearCurvedPatchAndIntersections: "PASS",
      rightPlaneAndSixVertexContour: "PASS",
      lightTracesAndSourceRoughness: "PASS",
      noAddedLabelsValuesOrAnswers: "PASS",
      noBrokenBlackRasterFlood: "PASS",
      dimensions: pixel.size,
      currentMismatchPercent: pixel.mismatchPercent,
      tolerancePx: pixel.tolerancePx,
      limitPercent: 2
    },
    findings: [],
    unobservedChecks: {
      cropCompletenessAgainstFull175Page: "HOLD-NOT-OBSERVED-IN-THIS-SCOPE",
      full176Or175LessonContext: "HOLD-NOT-ASSEMBLED",
      modernFigureSpecAssertionsAndProductWidths: "HOLD-NOT-MODERN-FIGURE",
      modernPromotion: "HOLD-NOT-ASSESSED"
    },
    rawRecropped: false,
    vectorizeRerun: false,
    authorRepaired: false,
    modernFigure: false
  },
  actualOpens: bound(local("actual-opens.json")),
  imageBudget: {
    originalPage: 1,
    detailCrops: 2,
    RAW: 1,
    SVGPreview: 1,
    newTotal: 5,
    cumulativeReviewerContextTotal: 5,
    cumulativeBeforeInterruption: 1,
    inheritedAfterInterruption: 1,
    cumulativeReset: false,
    batchLimit: 8,
    contextLimit: 24,
    parentContextTotal: 24,
    parentImageOpens: 0,
    imagesReturnedToParent: false
  },
  inputBindings: bound(local("input-bindings.json")),
  finalBindings: bound(local("final-bindings.json")),
  preservation: {
    onlyOwnedWriteRootUsed: true,
    repoRootTmpWritten: false,
    pathCorrectionAcknowledgedWithoutRestart: true,
    oldFilesCopiedMovedDeletedOrOverwritten: false,
    SOURCE174175FullTextReview: false,
    SOURCE174175Ownership: "James; untouched and not duplicated",
    SOURCE177Opened: false,
    TOCUsed: false,
    priorAuthorFAILHOLDAndNotesRetained: true,
    oldEvidenceCheckFAILNotReclassified: true,
    prepareFinalizeVectorizeAssemble: false,
    canonicalMeterIndexDatabaseGitApplicationDependenciesSkills: false,
    subagentsOrChildProcessesSpawned: false,
    existingSvgRasterLoadedInProcess: true,
    branchChange: false,
    productChange: false
  }
};
writeNew("report.json", report);
const evidenceNames = fs.readdirSync(out).filter(n => fs.statSync(local(n)).isFile() && n !== "output-hashes.json").sort();
writeNew("output-hashes.json", {schema: "stemrobin/review-output-hashes@1", files: evidenceNames.map(n => bound(local(n)))});
console.log(JSON.stringify({status: report.status, report: bound(local("report.json")), actualOpens: report.actualOpens, hashes: bound(local("output-hashes.json")), finalBindings: finalBindings.status, newTotal: ledger.newTotal, cumulativeTotal: ledger.cumulativeTotal}));
