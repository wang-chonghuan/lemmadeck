import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import assert from "node:assert/strict";

const W = "/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck";
const T = ".intentfold/tickets/STEMROBIN-181/tmp";
const OUT = path.join(W, T, "d1816-d098-n128-layout-display-n129-affected-review");
assert.equal(process.cwd(), W);
const abs = (p) => path.isAbsolute(p) ? p : path.join(W, p);
const read = (p) => JSON.parse(fs.readFileSync(abs(p), "utf8"));
const bind = (p) => {
  const bytes = fs.readFileSync(abs(p));
  return {path: abs(p), sha256: crypto.createHash("sha256").update(bytes).digest("hex"), bytes: bytes.length};
};
const put = (name, data) => fs.writeFileSync(path.join(OUT, name), `${JSON.stringify(data, null, 2)}\n`, {flag: "wx"});
const displayPath = `${T}/d1816-d090-n128-display/result.json`;
const f128Path = `${T}/d1816-d090-n128-promotion/layout-display-author-freeze.json`;
const f129Path = `${T}/d1816-d096-n129-affected-author/author-freeze.json`;
const display = read(displayPath);
const f128 = read(f128Path);
const f129 = read(f129Path);
const structure = read(path.join(OUT, "structure-result.json"));
const preservation = read(path.join(OUT, "inspection-end.json"));
assert.equal(preservation.failures.length, 0);
assert.equal(preservation.allInputsByteIdentical, true);
assert.equal(structure.status, "PASS_STRUCTURE_SCOPES_ONLY");
const reused089 = read(f128.originalSCIAndGraphicsReview.path);
const reused095 = read(f128.affectedSCIAndLocalesReview.path);
const reused091Path = `${T}/d1816-d091-n129-first-review/report.json`;
const reused091 = read(reused091Path);
const technical = read(path.join(OUT, "reviewer-technical-failures.json"));
const observations = {
  "zh-desktop": {
    status: "PASS",
    clippingOverlap: "No page clipping or prose/math/figure/caption/section overlap observed.",
    readability: "Readable Chinese body text and equations; title, page metadata and formulas stay distinct.",
    placement: "Three dividers separate origin, sliding-conductor calculation, flux calculation and whole-loop conclusion. Both captions immediately follow their figures.",
    figureScroller: "Fig-290 is fully visible within desktop width; native 640px media and scroll-end reachability reused. Fig-291 also uses 640px.",
  },
  "en-desktop": {
    status: "PASS",
    clippingOverlap: "No clipping or overlap observed across the complete long page.",
    readability: "English prose wraps within the column; inline/display equations and references remain legible, with no crowding at section dividers.",
    placement: "Title and printed-page crumb are distinct; both figures/captions occur in order within the relevant explanations; final paragraph and zero-exercise control remain separate.",
    figureScroller: "Both figures fit the desktop column at saved 640px media widths; no new graphic interpretation made.",
  },
  "zh-mobile": {
    status: "PASS",
    clippingOverlap: "Text, equations, captions and dividers stay inside the 358px usable column without page overflow or overlap. Fig-290's offscreen left portion is intentional in-region scrolling.",
    readability: "Chinese title fits, body paragraphs and math wrap clearly; the longest displayed flux formula remains readable.",
    placement: "The two captions are below their media, section dividers precede the correct conceptual transitions, and the conclusion is separated from the zero-exercise control.",
    figureScroller: "Screenshot is at horizontal scroll end: right-side fig-290 content is reachable, left-side details are offscreen rather than squeezed. Saved native reachability and fixed640 labels >=18.66640625px reused; fig-291 fits358 labels >=19.01875px.",
  },
  "en-mobile": {
    status: "PASS",
    clippingOverlap: "Two-line title does not collide with the crumb. No prose, equation, caption or divider overlap observed; no page-wide horizontal overflow.",
    readability: "English paragraphs retain clear line spacing; formulas and citations remain readable even where a reference wraps. No omitted final text.",
    placement: "Figures and their centered captions are separate from surrounding prose; all three conceptual dividers and final zero-exercise control are visible.",
    figureScroller: "Fig-290 is captured at scroll end with its offscreen left-side content confined to the scroller; saved reachability and 640px label sizing reused. Fig-291 fits at358px without shrinking below the minimum.",
  },
};
const n128DisplayRecords = display.records.map((r) => ({
  id: r.id, locale: r.locale, edition: r.edition, viewport: r.viewport,
  status: observations[`${r.locale}-${r.viewport.name}`].status,
  lesson: r.lesson, html: r.html,
  screenshot: structuredClone(r.screenshot),
  observations: observations[`${r.locale}-${r.viewport.name}`],
  DOMAndMediaEvidence: "D090_PASS_REUSED_NO_RERUN",
  savedFigureMeasurements: structure.savedMedia.find((s) => s.locale === r.locale && s.viewport.name === r.viewport.name),
  noNewScienceOrGraphicApproval: true,
}));
const order = ["zh-desktop", "en-desktop", "zh-mobile", "en-mobile"];
const imageLedger = {
  freshReviewerImageHistory: true, batch: "D098-n128-four-surfaces",
  actualOpens: 4, maximumPerBatch: 8, maximumContext: 24, contextActualImages: 4,
  entries: order.map((key, i) => {
    const r = display.records.find((r) => `${r.locale}-${r.viewport.name}` === key);
    const bytes = fs.readFileSync(abs(r.screenshot.path));
    return {
      ordinal: i + 1, tool: "functions.view_image", count: 1,
      exactCallPath: abs(r.screenshot.path), screenshot: structuredClone(r.screenshot),
      locale: r.locale, viewport: r.viewport, inspectionScope: "OFFLINE_LAYOUT_PIXELS_ONLY",
      fullPagePNGDimensions: {width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20)},
      status: observations[key].status,
    };
  }),
  sourceImageOpens: 0, figureImageOpens: 0, reopens: 0, crops: 0, newRenders: 0,
  n129ImageOpens: 0, parentImagePayloadsReturned: 0,
};
const holds = [
  {
    id: "D096-R1-REGISTRATION", inheritedFinding: "D091-R1", status: "HOLD",
    target: "/prose/11/text", sourceRef: "p0318#5",
    localeCandidates: structure.n129.map((r) => ({locale: r.locale, candidate: r.candidate})),
    proposedTextVerdict: "PASS", supportedRegistration: false,
    reason: "Velocity correction is acceptable proposed text, but no supported source-bound prose-science registration route exists. Existing string-array changes acceptance is not authorization; mathematical errata requires formulas.",
  },
  {
    id: "D096-R2-REGISTRATION", inheritedFinding: "D091-R2", status: "HOLD",
    target: "/prose/12/text", sourceRef: "p0318#6",
    localeCandidates: structure.n129.map((r) => ({locale: r.locale, candidate: r.candidate})),
    proposedTextVerdict: "PASS", supportedRegistration: false,
    reason: "Entire historical explanatory chain is qualified in the proposal, but this new science-prose edit has no supported registration route. No invented changes token or schema is authorized.",
  },
  {
    id: "D091-R3", status: "HOLD", sourceRef: "p0318#2", figure: "fig-294",
    target: "source.inventory source-unclassified-cell-mark and corresponding unchanged two-segment geometry",
    specBindings: structure.contexts129.filter((c) => c.figure === "fig-294").map((c) => ({locale: c.locale, spec: c.spec, svg: c.svg})),
    reason: "First-cell thick angled mark remains unknown. No pixel inspection or new classification made; prior HOLD is unchanged.",
    forbiddenInferences: ["printed electrical annotation", "handwriting", "extra arrow", "polarity indicator"],
  },
];
const verdicts = {
  n128LayoutContext: "PASS", n128ZHDesktop: "PASS", n128ENDesktop: "PASS",
  n128ZHMobile: "PASS", n128ENMobile: "PASS",
};
const n129Affected = {
  verdicts: {
    proposedTextSCI: "PASS", proposedTextZH: "PASS", proposedTextEN: "PASS",
    proposedSourceAnchorFullTextBindings: "PASS",
    supportedRegistration: "HOLD", fig294Mark: "HOLD", promotion: "HOLD",
  },
  scope: "Affected proposed blocks11/12, source/anchor and six fulltext bindings only, zero images. No whole lesson or graphic rereview.",
  records: structure.n129,
  fullTextBindings: structure.contexts129,
  semanticFindings: [
    {
      repairId: "D091-R1", sourceRef: "p0318#5", pointer: "/prose/11/text",
      scientificQualification: "PASS_PROPOSED_TEXT_ONLY",
      localeFidelity: "PASS",
      reason: "Both locales explicitly replace gradual acquisition of acceleration with change of velocity over time under finite net force. The preserved braking statement is read under that adjacent finite-force qualification. Current-change analogy and work statements outside the changed sentence remain untouched.",
      evidence: "D091's already-reviewed source and primary-reference interpretation reused; proposal matches its affected-only requested correction.",
    },
    {
      repairId: "D091-R2", sourceRef: "p0318#6", pointer: "/prose/12/text",
      scientificQualification: "PASS_PROPOSED_TEXT_ONLY",
      localeFidelity: "PASS",
      reason: "Both locales attribute the whole self-field, Lenz/braking and inertia chain to the original historical classical account, state it is not established in this section, and limit the reliable conclusion to opposition to changing circuit current. No invented fraction or denial of electromagnetic contributions.",
      evidence: "D091's whole-chain qualification target and already-reviewed source text reused. This is not a new physical proof.",
    },
  ],
  inheritedGraphicStages: {
    report: bind(reused091Path),
    fig292: reused091.verdicts["fig-292"],
    fig293: reused091.verdicts["fig-293"],
    fig294: reused091.verdicts["fig-294"],
    newGraphicApproval: false,
  },
  nativeAffectedMechanicalValidation: bind(`${T}/d1816-d096-n129-affected-author/native-affected-text-validation.json`),
  registrationDecision: bind(`${T}/d1816-d096-n129-affected-author/source-bound-registration-decision.json`),
  persistentHolds: holds, promotable: false,
  supportedRegistrationRoute: false, schemaOrChangeTokensInvented: false,
  doesNotBlockIndependentlyReadyN128: true,
};
const report = {
  schema: "STEMROBIN-181/D098-scoped-independent-review@1",
  ticket: "STEMROBIN-181", batch: "D098", reviewer: "D098",
  reviewDate: "2026-11-20", reviewedAt: new Date().toISOString(),
  role: "SOLE_INDEPENDENT_REVIEWER_SAME_INVOCATION", finish: "review", grill: "self",
  workdir: W, writeOwnership: OUT, candidateAuthorshipByReviewer: false,
  invocationGate: {freshnessAndBackendSatisfiedByDirectInstruction: true, freshnessCalls: 0, backendCalls: 0},
  authority: {
    latestAuthorityComment: "830251c5-4c6f-48af-9bae-6e3a22118c80",
    saved181: bind(`${T}/d1816-recovery/native/d061-live181-read/stdout.txt`),
    saved179: bind(`${T}/d1816-recovery/native/d061-live179-comments-read/stdout.txt`),
    D097Collected115HashesVerifiedAndClosed: "DIRECT_USER_ATTESTATION_NOT_RERUN",
    parentImageContextAtDispatch: 24, noDescendants: true, noOtherChatMessages: true,
  },
  status: "N128_OFFLINE_BATCH_READY_N129_PROPOSED_TEXT_PASS_WITH_PERSISTENT_HOLDS",
  verdicts,
  approval: {
    n128OfflineBatchReady: Object.values(verdicts).every((v) => v === "PASS"),
    scope: "Frozen n128 layout/context plus four offline display surfaces; reused completed native and content stages.",
    n129Promotable: false, n129SupportedRegistration: false,
    productAcceptance: false, productionWrite: false, deployment: false,
    noNewScienceOrGraphicApprovalForN128: true,
  },
  frozenAuthors: {n128: bind(f128Path), n129: bind(f129Path)},
  n128LayoutContext: {
    status: "PASS", records: structure.n128, fullTextBindings: structure.contexts128,
    equivalence: "All 22 raw-entry identities/order/provenance retained per locale; before/after text changes are whitespace only, exact math spans unchanged. D095 reviewed prose is normalized-equivalent to current templates.",
    conceptualBoundaries: "Independent exact adjacent-pair derivation: ZH4/15/22 and EN3/12/18; original block/offset3:0,14:0,21:0 in each locale.",
    staleChangesCleared: {zh: [19], en: [17]},
    legitimateLayoutTagAdded: {zh: [], en: [9]},
    figurePlacement: "Two figures/two captions remain in source order and their explanatory contexts; all display entries retained; no exercises invented.",
    geometryOrSVGChanges: false,
  },
  n128DisplayRecords, imageLedger, n129Affected,
  reusableStages: {
    D089: {report: bind(f128.originalSCIAndGraphicsReview.path),
      graphic290: reused089.verdicts["fig-290"], graphic291: reused089.verdicts["fig-291"]},
    D095: {report: bind(f128.affectedSCIAndLocalesReview.path),
      reviewFreeze: bind(f128.affectedReviewFreeze.path),
      SCI: reused095.verdicts.SCI, ZH: reused095.verdicts.ZH, EN: reused095.verdicts.EN,
      context: reused095.verdicts.context},
    D090NativeAndDOM: {result: bind(displayPath), headless: true, offline: true,
      rerunsByD098: 0, exactBoundCurrentLessonHTMLScreenshotInputs: true},
  },
  originalFailuresPreserved: {
    n128ScienceFindings: {report: bind(f128.originalSCIAndGraphicsReview.path),
      originalVerdicts: {SCI: reused089.verdicts.SCI, ZH: reused089.verdicts.ZH, EN: reused089.verdicts.EN},
      resolution: "D095_AFFECTED_PASS_REUSED"},
    n128NativeFinalizers: f128.records.map((r) => ({
      locale: r.locale, originalFailure: r.affectedLayout.originalFailure,
      originalAudit: r.affectedLayout.originalAudit,
      status: "ORIGINAL_EXIT2_PRESERVED_RECOVERY_EXIT0_REUSED",
    })),
    n129OriginalFindings: {report: bind(reused091Path), actionableRepairs: reused091.actionableRepairs,
      originalVerdicts: reused091.verdicts, originalsNotEdited: true},
    inheritedCountsFailuresStages: bind(f129.inheritedStagesCountsFailures.path),
    countersReset: false,
  },
  reviewerTechnicalFailures: technical,
  focusedGrill: bind(path.join(OUT, "grill.md")),
  inspectionEvidence: {
    start: bind(path.join(OUT, "inspection-start.json")),
    supplementalStart: bind(path.join(OUT, "inspection-supplemental-start.json")),
    end: bind(path.join(OUT, "inspection-end.json")),
    structure: bind(path.join(OUT, "structure-result.json")),
    inputCount: preservation.inputCount, allFrozenClaimsExact: true, allInputsByteIdentical: true,
    distinction: "Input bindings may hash existing image/PDF bytes; only the four ledger entries were loaded as images. Passed source/science/graphic stages were not rereviewed.",
  },
  execution: {
    actualImageOpens: 4, reopensCropsRenders: 0, nativeFinalizers: 0,
    nativeAffectedValidatorsRerun: 0, DOMReruns: 0, nativeReviewRecordCalls: 0,
    externalResearchCalls: 0, DBCalls: 0, GitCalls: 0, deployments: 0,
    dependenciesModelsOrPurchasesChanged: false, otherWorkerFilesOrPermissionsChanged: false,
    descendants: 0, otherChatCalls: 0,
    structuredInspectionRuns: {hashSnapshots: 3, structuralComparisonAttempts: 3, successfulStructuralComparison: 1},
    sessionTokens: "unknown-not-provided", cost: "unknown-not-provided",
  },
};
put("report.json", report);
const ownFiles = [
  "inspect.mjs", "structure.mjs", "build-report.mjs", "structure-result.json",
  "inspection-start.json", "inspection-supplemental-start.json", "inspection-end.json",
  "reviewer-technical-failures.json", "grill.md", "report.json",
];
const freeze = {
  schema: "STEMROBIN-181/D098-independent-review-freeze@1",
  ticket: "STEMROBIN-181", reviewer: "D098", workdir: W, writeOwnership: OUT,
  frozenAt: new Date().toISOString(), report: bind(path.join(OUT, "report.json")),
  verdicts: report.verdicts, approval: report.approval,
  n129AffectedVerdicts: n129Affected.verdicts, persistentHolds: holds,
  frozenAuthors: report.frozenAuthors,
  reviewedAndCurrentInputs: preservation.inputs,
  beforeAfterBindings: preservation.beforeAfterBindings,
  allReviewedInputClaimsExact: preservation.failures.length === 0,
  allInputsByteIdenticalAcrossReview: preservation.allInputsByteIdentical,
  inspectionScriptsAndReviewOutputs: ownFiles.map((f) => bind(path.join(OUT, f))),
  imageLedger, focusedGrill: report.focusedGrill,
  originalFailuresAndPriorPassReferences: report.originalFailuresPreserved,
  freezePolicy: "Only D098-owned artifacts become read-only. No upstream file bytes or permissions changed. Freeze SHA256 is returned externally to avoid a self-hash.",
};
put("review-freeze.json", freeze);
for (const name of [...ownFiles, "review-freeze.json"]) fs.chmodSync(path.join(OUT, name), 0o444);
console.log(JSON.stringify({
  verdicts, n128OfflineBatchReady: report.approval.n128OfflineBatchReady,
  n129Affected: n129Affected.verdicts, imageOpens: 4,
  inputCount: preservation.inputCount, allInputsByteIdentical: true,
  report: bind(path.join(OUT, "report.json")), reviewFreeze: bind(path.join(OUT, "review-freeze.json")),
}, null, 2));
