import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import assert from "node:assert/strict";

const root = "/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck";
assert.equal(process.cwd(), root);
const dir = path.join(root, ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d161-fig11-independent-review");
const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const bind = (p) => {
  p = path.resolve(root, p);
  const bytes = fs.readFileSync(p);
  return { path: p, bytes: bytes.length, sha256: crypto.createHash("sha256").update(bytes).digest("hex") };
};
const expected = (b) => {
  const actual = bind(b.path);
  assert.equal(actual.bytes, b.bytes, `${b.path}: changed byte count`);
  assert.equal(actual.sha256, b.sha256, `${b.path}: changed hash`);
  return actual;
};
const start = bind(path.join(dir, "input-freeze.json"));
assert.equal(start.sha256, "2d2f3bcf358b37437e0fb3428932c1f239abf4f1fa686490ebf39d17f3c4bb5a");
const inputFreeze = read(start.path);
const sourceOnly = read(expected(inputFreeze.sourceOnly).path);
const after = read(expected(inputFreeze.afterInventory).path);
const authorFreeze = read(expected(after.authorFreeze).path);
const approved = read(expected(after.approvedBilingualText).path);
const comparison = read(path.join(dir, "current-comparison.json"));
const independentInventory = expected(comparison.independentInventory);
assert.equal(independentInventory.sha256, "62eaba5251cd60d3104c384fbac3eba35998ea780ce7197c821ec733892f66db");
assert.equal(comparison.mathematicalAndSlotComparison, "pass");
assert.equal(comparison.browserClosed, true);
assert.equal(comparison.browserEvidence.rearBottomCenterOcclusion.lineCrossesRearDisk, true);
assert.equal(comparison.browserEvidence.rearBottomCenterOcclusion.rearIsPaintedAfterNearLine, true);
assert.equal(fs.existsSync(path.join(dir, "fig-11.review.json")), false);

const inputBindings = [
  start,
  expected(inputFreeze.sourceOnly),
  expected(inputFreeze.afterInventory),
  expected(sourceOnly.sourceImage),
  expected(sourceOnly.originalLesson),
  expected(after.collectedAuthor),
  expected(after.authorReport),
  expected(after.authorFreeze),
  ...Object.values(after.selected).map(expected),
  expected(after.approvedBilingualText),
  expected(after.structuralProof),
  expected(after.authorSourceInventory),
  expected(after.nativeReviewTool),
  ...Object.values(approved.languages).map((x) => expected(x.binding)),
  expected(approved.independentTextReview),
  ...authorFreeze.nativeTools.map(expected),
  bind(path.join(root, ".agents/skills/ld-s10y-image/SKILL.md")),
  bind(path.join(root, ".agents/skills/ld-s10y-image/references/quality-gate.md"))
];
const receiptBindings = authorFreeze.evidence.filter((b) => b.path.includes("/receipts/") && !b.path.endsWith(".mjs")).map(expected);
receiptBindings.push(expected(authorFreeze.preservedOriginalNativeFailureReceipt));
const receiptDir = path.join(root, ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d160-fig11-classification-author/receipts");
const renderReceipt = read(path.join(receiptDir, "D160-native-001-fig-11-render.json"));
const validateReceipt = read(path.join(receiptDir, "D160-native-002-fig-11-validate.json"));
assert.equal(renderReceipt.ordinal, 1);
assert.equal(validateReceipt.ordinal, 2);
assert.ok(renderReceipt.finishedAt < validateReceipt.startedAt);
assert.equal(renderReceipt.exitCode, 0);
assert.equal(validateReceipt.exitCode, 0);
const unique = (bs) => [...new Map(bs.map((b) => [b.path, b])).values()];
const evidenceNames = ["source-inspection-3x.png", "independent-inventory.json", "compare-current.mjs", "current-svg-640.png", "current-comparison.json", "finalize-review.mjs"];
const evidenceBindings = evidenceNames.map((name) => bind(path.join(dir, name)));
const imageLedger = [
  { ordinal: 1, kind: "original PNG", binding: expected(sourceOnly.sourceImage), tool: "functions.view_image", beforeIndependentFreeze: true },
  { ordinal: 2, kind: "source-only 3x enlargement", binding: bind(path.join(dir, "source-inspection-3x.png")), tool: "functions.view_image", beforeIndependentFreeze: true },
  { ordinal: 3, kind: "immutable candidate saved preview", binding: expected(after.selected.preview), tool: "functions.view_image", beforeIndependentFreeze: false },
  { ordinal: 4, kind: "immutable SVG displayed in local headless artifact wrapper at 640px", binding: expected(after.selected.svg), tool: "local Playwright page.setContent", beforeIndependentFreeze: false },
  { ordinal: 5, kind: "640px artifact screenshot capture", binding: bind(path.join(dir, "current-svg-640.png")), tool: "local Playwright locator.screenshot", beforeIndependentFreeze: false },
  { ordinal: 6, kind: "640px artifact screenshot open", binding: bind(path.join(dir, "current-svg-640.png")), tool: "functions.view_image", beforeIndependentFreeze: false }
].map((x) => ({ ...x, chargedImageOpen: 1 }));
const nativeCounters = {
  scope: "fig-11 only; count explicit process invocations separately from internal validation",
  inheritedD153: { explicitDraftValidationCalls: 1, failedDraftValidationCalls: 1, renderCalls: 0, nativeReviewCalls: 0 },
  existingD160CurrentCandidate: { renderCalls: 1, rendererInternalDraftValidations: 1, subsequentExplicitDraftValidationCalls: 1, nativeReviewCalls: 0 },
  D161: { explicitDraftValidationCalls: 0, explicitRenderedValidationCalls: 0, renderCalls: 0, rendererInternalValidations: 0, recordReviewCalls: 0, recordReviewInternalRenderedValidations: 0, specRepairs: 0 },
  fig11ContentRepairsAlready: 1,
  maximumFig11ContentRepairs: 1,
  remainingAuthorizedFig11ContentRepairs: 0,
  paidCalls: 0,
  generationCalls: 0,
  modelOverrides: 0
};
const findings = [
  {
    id: "D161-F11-01",
    priority: "P2",
    category: "source-fidelity / projected geometry / occlusion",
    status: "HOLD",
    title: "Rear-bottom-center marker erases a nearer rod",
    independentSourceFact: "Frozen R-C-B marker at approximately [284,226] is partly covered on its right/lower side by the heavy nearer-right vertical rod. The enlarged source shows that foreground stroke in front of the rear marker.",
    candidateFact: "The SVG paints back-r2-c1 as an opaque white, complete open disk after column-front-2-1. At 640px its center is [415.1724,372.4138], radius 9px; the nearer rod crosses at x=418.4607, within that disk. The rear disk consequently masks the nearer rod rather than being partly masked by it.",
    consequence: "The rear site reads as an unobscured junction on the nearer vertical chain. This reverses the source depth/occlusion relationship in an instructional spatial lattice, despite correct nominal slots and endpoint assertions.",
    evidence: {
      independentInventory,
      sourceInspection: bind(path.join(dir, "source-inspection-3x.png")),
      currentSvg: expected(after.selected.svg),
      currentComparison: bind(path.join(dir, "current-comparison.json")),
      screenshot: bind(path.join(dir, "current-svg-640.png")),
      svgElementIds: ["ld-fig-11_ld-back-r2-c1", "ld-fig-11_ld-column-front-2-1"],
      comparisonField: "browserEvidence.rearBottomCenterOcclusion"
    },
    disposition: "No edit or new render: content repair allowance is exhausted. Native independent pass record must not be created. Parent decides the next authorized action."
  }
];
const report = {
  schema: "d161/figure-only-independent-review-report@1",
  batch: "D161",
  ticket: "STEMROBIN-181",
  figure: "fig-11",
  status: "HOLD",
  role: "sole fresh independent reviewer; not author and not whole-course approver",
  invocation: "same authorized STEMROBIN-181 invocation",
  finish: "review",
  grill: "self; setup, freshness and grill already satisfied, not replayed",
  question: "Source-fidelity, semantic, geometry, mathematical and cultural correctness and visual adequacy of the CURRENT fig-11",
  independentInventory,
  independentInventoryPreAuthorHash: independentInventory.sha256,
  chronology: [
    { order: 1, action: "Verified exact starting input-freeze SHA256 and direct source-only, after-inventory bytes/hash without displaying after-inventory contents." },
    { order: 2, action: "Read source-only; opened original fig-11 PNG first, then its source-only enlargement. No candidate or author rationale read." },
    { order: 3, action: "Saved independent inventory and printed its SHA256 before reading after-inventory.", confirmedAt: "2026-11-20T12:55:38.764Z", sha256: independentInventory.sha256 },
    { order: 4, action: "Only then read after-inventory, approved complete bilingual text for figure compatibility, author material, current spec and existing receipts." },
    { order: 5, action: "Inspected saved preview and immutable SVG at 640px. Compared every inventoried marker, finite slot and connector chain; inspected dash and occlusion. Browser closed in finally." },
    { order: 6, action: "Independent HOLD for the confirmed occlusion mismatch; no further content repair, native validation/render replay or record_review invocation." }
  ],
  inputBindings: unique(inputBindings),
  receiptBindings: unique(receiptBindings),
  outputBindings: evidenceBindings,
  sourceComparison: {
    basis: "All facts derived from D161 pre-author pixel inventory, not candidate or author inventory",
    subfigures: { source: 1, candidate: 1, status: "pass" },
    finiteSlots: { across: 3, vertical: 3, depth: 3, nominalTotal: 27, actualVisible: 26, unresolvedSlots: 1, candidateVisible: 26, status: "pass" },
    appearances: { sourceFilled: 13, sourceOpen: 13, candidateFilled: 13, candidateOpen: 13, status: "pass" },
    markerPositions: { compared: 26, maximumPerAxisDifferenceFromIndependentApproximatePixelCenters: 4, calibration: "2D source pixel coordinate inversion only; no physical 3D calibration", status: "pass" },
    connectors: { nominalAdjacentRelationships: 54, candidateSegments: 52, matchedSegments: 52, handling: "Two pairs of adjacent relationships span the unresolved rear central slot as continuous row/column strokes; one depth continuation terminates in the independently unresolved region without a visible marker.", status: "pass" },
    assertions: { connects: 52, projectedDisplacements: 52, whollyInGroupPointCoverage: "all 26 points and every mapped point in each finite-plane group", objectCountAloneUsedAsProof: false, status: "pass" },
    dashedRearLeftVertical: { sourceDefinitePortions: 2, candidateDashedSegments: 2, svgDash: "5,5", status: "pass" },
    unresolvedRearMiddleCenter: { separatelyVisibleMarkerAdded: false, endpointInFrozenUncertaintyRegion: true, hiddenPhysicalSiteInferred: false, status: "pass" },
    markerStyling: "Scan highlights, jagged rims and curved accents are simplified to flat filled/open disks; this does not create new marker classes. Apparent size still decreases with depth.",
    sharedFrame: { independentTwoDimensionalAxisAlignedGrid: false, surrogateGridAdded: false, sourceRegularizedToIdealLattice: false, status: "pass" },
    occlusion: { status: "HOLD", finding: "D161-F11-01" },
    labelsValuesAndCulture: { sourceLabels: 0, sourceNumericalGivens: 0, importedCyrillicOrChinese: false, flagsOrUniformsOrHistoricalTexture: false, status: "pass" }
  },
  verdicts: {
    overall: "HOLD",
    sourceFidelity: "HOLD: nearer/rear occlusion reversed at R-C-B",
    semantic: "HOLD for spatial-lattice depth interpretation; approved bilingual table-salt/ions compatibility otherwise passes",
    geometry: "HOLD for projected occlusion; positions, finite slots and connector relationships otherwise pass",
    mathematical: "PASS for source-bound finite slots and projected endpoint/displacement relationships; no measured 3D, ideal hidden site, charge assignment, angle, unit or answer asserted",
    cultural: "PASS: English additions only, no source cultural leakage",
    visual: "HOLD for instructional depth cue; otherwise nonblank, readable and unclipped at actual 640px media width",
    bilingualFigureCompatibility: "PASS: salt/ions title and anonymous ion classes do not contradict the approved full ZH/EN text; no science or translation re-review performed",
    nativeExistingDraftAndRender: "existing passes retained, not sufficient to approve source fidelity",
    independentFigureOnlyApproval: false,
    wholeCourseApproval: false,
    productAcceptance: false
  },
  findings,
  visualEvidence: {
    kind: "immutable local artifact inspection, not product acceptance",
    headless: true,
    widthPx: 640,
    heightPx: 720,
    nativeSavedPreviewInspected: expected(after.selected.preview),
    screenshot: bind(path.join(dir, "current-svg-640.png")),
    minimumMeasuredTextPx: 18,
    allFourLabelsInsideMediaBounds: true,
    browserClosed: true,
    productSurfaceVisited: false,
    mobileOrProductScrollAcceptanceClaimed: false,
    themes: "Saved neutral rendering only; no alternate-theme or print acceptance claimed"
  },
  nativeChronology: [
    { stage: "inherited D153 failed draft validation", replayed: false, receipt: expected(authorFreeze.preservedOriginalNativeFailureReceipt) },
    { stage: "D160 renderer, with internal draft validation", ordinal: 1, startedAt: renderReceipt.startedAt, finishedAt: renderReceipt.finishedAt, exitCode: renderReceipt.exitCode, replayed: false, receipt: bind(path.join(receiptDir, "D160-native-001-fig-11-render.json")), stdout: expected(renderReceipt.stdout), stderr: expected(renderReceipt.stderr) },
    { stage: "D160 explicit draft validation after rendering", ordinal: 2, startedAt: validateReceipt.startedAt, finishedAt: validateReceipt.finishedAt, exitCode: validateReceipt.exitCode, replayed: false, receipt: bind(path.join(receiptDir, "D160-native-002-fig-11-validate.json")), stdout: expected(validateReceipt.stdout), stderr: expected(validateReceipt.stderr) }
  ],
  nativeCounters,
  nativeReview: { created: false, status: null, binding: null, expectedPath: path.join(dir, "fig-11.review.json"), reason: "Independent HOLD; record_review.py not invoked" },
  imageLedger,
  imageCounters: { actualChargedOpens: 6, contextChargedOpens: 6, directImageToolOpens: 4, localArtifactDisplays: 1, screenshotCaptures: 1, parentImageOpens: 0, maximumActualOpens: 8, maximumContextOpens: 24, explanation: "Conservatively charges browser SVG display and screenshot capture as well as every image-tool open; no unlogged reopen or crop." },
  boundaries: {
    writesOnlyInD161Directory: true,
    immutableInputFilesChanged: false,
    immutableSpecRenderPreviewChanged: false,
    sourceSchemaNativeToolOrCarrierChanged: false,
    otherFiguresOpened: 0,
    otherFiguresEdited: 0,
    allOtherHolds: "unchanged by D161; not independently reopened or reviewed",
    parentImageOpens: 0,
    sourcePageReviewReplay: false,
    composedSCI_ZH_ENReviewReplay: false,
    setupFreshnessGrillReplay: false,
    databaseCalls: 0,
    publisherCalls: 0,
    generationCalls: 0,
    paidCalls: 0,
    newContentRepairs: 0,
    modelOverrides: 0,
    canonicalPromotions: 0,
    coursesAdded: 0,
    nativeFinalizationCalls: 0,
    productAcceptance: false,
    wholeProjectChecks: 0,
    commitPushDeployMergeClosureCalls: 0,
    peerOrSupervisorMessages: 0,
    formalHandoff: false,
    browserClosed: true
  },
  changedFiles: [...evidenceNames, "report.json", "review-freeze.json"].map((name) => path.join(dir, name)),
  nextOwner: "Parent alone collects and closes. Fig-11 stays HOLD; all other HOLDs remain unchanged.",
  reviewedAt: new Date().toISOString()
};
fs.writeFileSync(path.join(dir, "report.json"), JSON.stringify(report, null, 2) + "\n");
const reportBinding = bind(path.join(dir, "report.json"));
const freeze = {
  schema: "d161/figure-only-review-freeze@1",
  batch: "D161",
  ticket: "STEMROBIN-181",
  figure: "fig-11",
  status: "HOLD",
  independentFigureOnlyApproval: false,
  wholeCourseApproval: false,
  independentInventoryPreAuthorHash: independentInventory.sha256,
  independentInventory,
  originalInputFreeze: start,
  inputBindings: unique(inputBindings),
  receiptBindings: unique(receiptBindings),
  outputBindings: [...evidenceBindings, reportBinding],
  report: reportBinding,
  nativeReview: report.nativeReview,
  imageLedger,
  imageCounters: report.imageCounters,
  nativeCounters,
  nativeChronology: report.nativeChronology,
  findings,
  verdicts: report.verdicts,
  boundaries: report.boundaries,
  changedFiles: report.changedFiles,
  browserClosed: true,
  allCurrentInputBindingsVerifiedAtFreeze: true,
  frozenAt: new Date().toISOString(),
  selfHash: "External final response supplies this file's SHA256; no recursive self-binding."
};
fs.writeFileSync(path.join(dir, "review-freeze.json"), JSON.stringify(freeze, null, 2) + "\n");
console.log(JSON.stringify({ status: "HOLD", report: reportBinding, freeze: bind(path.join(dir, "review-freeze.json")), nativeReview: null, independentInventory, changedFiles: report.changedFiles, browserClosed: true }, null, 2));
