import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import assert from "node:assert/strict";

const root = "/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck";
const ticketDir = path.join(root, ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d157-n9-liquid-flow-author");
const figureDir = path.join(root, ".tmp/STEMROBIN-181/d1816-d157/figures/fig-10");
const currentFreezePath = path.join(ticketDir, "input-freeze-current.json");
const reportPath = path.join(ticketDir, "report.json");
const authorFreezePath = path.join(ticketDir, "author-freeze.json");
const currentFreezeSha = "630c10ba858f8e6920cbd113a952aea7b566737d2d0938190d3e7eadb366334d";
const readJson = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const hash = (data) => crypto.createHash("sha256").update(data).digest("hex");

function bind(file, expected = null) {
  const absolutePath = path.resolve(root, file);
  const bytes = fs.readFileSync(absolutePath);
  const binding = { path: absolutePath, bytes: bytes.length, sha256: hash(bytes) };
  if (expected) {
    assert.equal(binding.bytes, expected.bytes, `Changed input bytes: ${absolutePath}`);
    assert.equal(binding.sha256, expected.sha256, `Changed input SHA256: ${absolutePath}`);
  }
  return binding;
}

function exclusiveJson(file, value) {
  assert.ok(file.startsWith(`${ticketDir}/`), "Output outside author scope");
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: "wx" });
}

assert.equal(process.cwd(), root, "Wrong checkout cwd");
assert.ok(!fs.existsSync(reportPath), "Existing report must not be overwritten");
assert.ok(!fs.existsSync(authorFreezePath), "Existing author freeze must not be overwritten");
const currentBinding = bind(currentFreezePath);
assert.equal(currentBinding.sha256, currentFreezeSha, "Wrong authoritative input freeze");
const current = readJson(currentFreezePath);
assert.deepEqual(current.figures, ["fig-10"]);
assert.equal(current.nativeContextCalls, 2);
const contextBinding = bind(current.contexts[0].path, current.contexts[0]);
const context = readJson(contextBinding.path);
assert.equal(context.figure, "fig-10");
const inventoryPath = path.join(figureDir, "source-inventory.json");
const inventory = readJson(inventoryPath);
assert.equal(inventory.status, "HOLD_SOURCE_AMBIGUITY");
assert.equal(inventory.imageOpensAtInventory, 5);

const inputs = [
  { role: "authoritative-current-input-freeze", ...currentBinding },
  { role: "original-historical-counter-mismatch-freeze", ...bind(current.initialMetadataMismatchPreserved.originalFreeze.path, current.initialMetadataMismatchPreserved.originalFreeze) },
  { role: "complete-author-input-context", ...contextBinding },
  { role: "original-source-png-opened-first", ...bind(context.sourceImage.path, context.sourceImage) },
  { role: "durable-original-source-png", ...bind(context.durableSourceImage.path, context.durableSourceImage) },
  { role: "unchanged-original-lesson", ...bind(context.originalLesson.path, context.originalLesson) },
  { role: "immutable-shared-carrier", ...bind(current.immutableSharedCarrier.path, current.immutableSharedCarrier) },
  { role: "reused-composed-SCI-ZH-EN-approval", ...bind(current.textReview.path, current.textReview) },
];
for (const locale of ["zh", "en"]) {
  inputs.push({ role: `complete-approved-${locale}-text`, ...bind(context.languages[locale].binding.path, context.languages[locale].binding) });
  inputs.push({ role: `reused-successful-native-${locale}-context`, ...bind(context.nativeContexts[locale].path, context.nativeContexts[locale]) });
}
const nativeReceipts = current.nativeContextReceipts.map((expected) => bind(expected.path, expected));
for (const receipt of nativeReceipts) {
  assert.equal(readJson(receipt.path).exitCode, 0);
  inputs.push({ role: "reused-successful-native-context-raw-receipt", ...receipt });
}
const textReview = readJson(current.textReview.path);
assert.equal(textReview.scienceVerdict, "pass");
assert.equal(textReview.zhVerdict, "pass");
assert.equal(textReview.enVerdict, "pass");
assert.equal(textReview.figureApproval, false);
for (const key of ["report", "freeze"]) {
  inputs.push({ role: `reused-text-review-${key}`, ...bind(textReview[key].path, textReview[key]) });
}

const contracts = [
  "AGENTS.md",
  ".intentfold/readme.md",
  ".agents/skills/ld-s10y-image/SKILL.md",
  ".agents/skills/ld-s10y-image/references/routing.md",
  ".agents/skills/ld-s10y-image/references/figure-spec.md",
  ".agents/skills/ld-s10y-image/references/quality-gate.md",
  ".claude/skills/ld-s10y-lesson/references/production-resume.md",
].map((file) => ({ role: "unchanged-authoring-contract", ...bind(file) }));
const unusedNativeToolBindings = [
  ".agents/skills/ld-s10y-image/assets/figure-spec.schema.json",
  ".agents/skills/ld-s10y-image/scripts/build_context.py",
  ".agents/skills/ld-s10y-image/scripts/validate_spec.py",
  ".agents/skills/ld-s10y-image/scripts/render_spec.mjs",
].map((file) => ({ role: "unchanged-native-contract-not-invoked-this-continuation", ...bind(file) }));
const evidenceFiles = [
  ["source-pixel-inventory-with-explicit-unresolved-groups", "source-inventory.json"],
  ["raw-inspection-execution-failures-and-recovery", "source-inspection/raw-receipts.json"],
  ["preserved-failed-distorted-source-derivative", "source-inspection/particles-4x.png"],
  ["valid-nearest-neighbor-source-crop", "source-inspection/particles-nearest-4x.png"],
  ["valid-left-source-crop", "source-inspection/particles-left-nearest-8x.png"],
  ["valid-right-source-crop", "source-inspection/particles-right-nearest-8x.png"],
  ["inspection-script-preserved-after-Pillow-import-failure", "source-inspection/crop_source.py"],
  ["source-half-inspection-script", "source-inspection/crop_halves.py"],
].map(([role, file]) => ({ role, ...bind(path.join(figureDir, file)) }));
evidenceFiles.push({ role: "scoped-hash-binding-writer", ...bind(path.join(ticketDir, "bind_author_evidence.mjs")) });

const counters = {
  nativeContextCallsInherited: 2,
  nativeContextCallsThisContinuation: 0,
  nativeContextCallsTotal: 2,
  historicalIncorrectContextClaim: 4,
  nativeDraftValidations: 0,
  nativeRenders: 0,
  nativeFinalizers: 0,
  nativeRecordReviewCalls: 0,
  passedStagesReplayed: 0,
  sourceTextNativeContextReplays: 0,
  firstFigureCandidates: 0,
  contentRepairsInherited: 0,
  contentRepairsThisContinuation: 0,
  contentRepairsTotal: 0,
  maximumContentRepairs: 1,
  actualImageOpensInheritedInFreshAuthorContext: 0,
  actualImageOpensThisContinuation: 5,
  actualImageOpensInFreshBatch: 5,
  actualImageOpensInCurrentContext: 5,
  maximumFreshBatchImageOpens: 8,
  maximumContextImageOpens: 24,
  originalImageOpens: 1,
  derivativeImageOpens: 4,
  failedDerivativeImageOpens: 1,
  modernDraftImageOpens: 0,
  renderPreviewImageOpens: 0,
  screenshotImageOpens: 0,
  parentImageOpens: 0,
  inspectionDerivativeCommands: 4,
  technicalRecoveryAttempts: 2,
  paidCalls: 0,
  generationCalls: 0,
  originalTasks: 0,
  completeCoursesAdded: 0,
  canonicalPromotions: 0,
  independentApprovalsThisAuthor: 0,
  peerSupervisorMessages: 0,
  wholeProjectChecks: 0,
};
const selection = { spec: null, svg: null, render: null, preview: null };
const preservedFailures = {
  initialFigureCandidate: null,
  repairedFigureCandidate: null,
  failedFigureCandidates: [],
  failedSourceDerivative: bind(path.join(figureDir, "source-inspection/particles-4x.png")),
  rawInspectionReceipts: bind(path.join(figureDir, "source-inspection/raw-receipts.json")),
  historicalInputMetadataMismatch: bind(current.initialMetadataMismatchPreserved.originalFreeze.path, current.initialMetadataMismatchPreserved.originalFreeze),
  note: "No modern figure candidate was created: unresolved source fidelity blocked drafting. The failed crop and execution receipt remain separate from content candidates; technical recovery did not reset counters.",
};
const changedPaths = [
  ...evidenceFiles.map((binding) => binding.path),
  reportPath,
  authorFreezePath,
];
const report = {
  schema: "STEMROBIN-181/D157-first-author-report@1",
  ticket: "STEMROBIN-181",
  batch: "D157",
  figure: "fig-10",
  role: "FIRST AUTHOR",
  date: "2026-11-20",
  sameAuthorizedInvocation: true,
  finish: "review",
  grill: "self; already satisfied, not repeated",
  setupFreshnessGrillReplayed: false,
  status: "HOLD",
  holdCode: "SOURCE_PARTICLE_ARROW_AND_OUTLET_AMBIGUITY",
  authorready: false,
  mode: "HOLD",
  displayPurpose: "instructional",
  reason: "The 278x451 original and bounded source crops leave the exact full/partial interior particle population, directed-arrow heads/endpoints, and central outlet closure unresolved. Deterministic geometry would invent source relationships. No reduced particle population, artificial closures, or paid fallback was used.",
  sourceInventory: bind(inventoryPath),
  fullTextConsidered: {
    locales: ["zh", "en"],
    completeContextTextRead: true,
    nearFigureCaptionOnly: false,
    meaning: "Qualitative biased local rearrangements under unbalanced driving. The weak-driving approximation concerns directional bias, not a calibrated probability or flow rate. Long action permits rearrangement but does not guarantee flow; balanced driving or constraints can prevent it. Short-time behavior depends on material-specific structural relaxation.",
    existingSCI_ZH_ENReviews: "Reused unchanged; not replayed. Their independent approval covers text only, not fig-10.",
    approvedTextChanged: false,
  },
  gates: {
    sourceFidelity: { status: "HOLD", evidence: bind(inventoryPath), exactSourceToObjectMappingComplete: false },
    nativeDraftValidation: { status: "NOT_RUN_DEPENDENT_STAGE_BLOCKED", reason: "No justified FigureSpec." },
    nativeRender: { status: "NOT_RUN_DEPENDENT_STAGE_BLOCKED", reason: "No successful draft validation." },
    authorModernVisual: { status: "NOT_RUN_DEPENDENT_STAGE_BLOCKED", reason: "No modern candidate or render preview." },
    independentFigureReview: { status: "NOT_PERFORMED_BY_AUTHOR", approval: false },
    promotion: { status: "NOT_AUTHORIZED_NOT_PERFORMED" },
  },
  inputs,
  contracts,
  unusedNativeToolBindings,
  selected: selection,
  selectedHashes: { spec: null, svg: null, render: null, preview: null },
  outputEvidenceBindings: evidenceFiles,
  reusedNativeContextRawReceipts: nativeReceipts,
  preservedFailures,
  imageOpenLedger: [
    { index: 1, kind: "original", ...bind(context.sourceImage.path, context.sourceImage), usedForSourceJudgment: true },
    { index: 2, kind: "failed-source-crop", ...bind(path.join(figureDir, "source-inspection/particles-4x.png")), usedForSourceJudgment: false },
    { index: 3, kind: "source-crop", ...bind(path.join(figureDir, "source-inspection/particles-nearest-4x.png")), usedForSourceJudgment: true },
    { index: 4, kind: "source-crop", ...bind(path.join(figureDir, "source-inspection/particles-left-nearest-8x.png")), usedForSourceJudgment: true },
    { index: 5, kind: "source-crop", ...bind(path.join(figureDir, "source-inspection/particles-right-nearest-8x.png")), usedForSourceJudgment: true },
  ],
  counters,
  browser: { opened: false, used: false, activeAuthorBrowserSessions: 0, closure: "NOT_APPLICABLE_NO_BROWSER_OPENED", closureCall: null },
  boundaries: {
    branchSwitchReset: false,
    DB: false,
    publishers: false,
    modelOverrides: false,
    commitPushDeployMergeClosure: false,
    peerSupervisorMessages: false,
    wholeProjectChecks: false,
    existingFilesChmod: false,
    originalFreezesContextsSnapshotsToolsSchemaEdited: false,
    independentApproval: false,
    nativeReviewRecorded: false,
    promotion: false,
    parentCollectsAndCloses: true,
  },
  changedPaths,
  independentApproval: false,
  promotionAuthorized: false,
};

// Hash checks bind existing approvals without executing any passed content stage.
exclusiveJson(reportPath, report);
const reportBinding = bind(reportPath);
const authorFreeze = {
  schema: "STEMROBIN-181/D157-author-freeze@1",
  ticket: "STEMROBIN-181",
  batch: "D157",
  figure: "fig-10",
  role: "FIRST AUTHOR",
  status: "HOLD",
  authorready: false,
  mode: "HOLD",
  currentAuthoritativeInputFreeze: currentBinding,
  inputs,
  contracts,
  unusedNativeToolBindings,
  report: reportBinding,
  selected: selection,
  selectedHashes: report.selectedHashes,
  outputEvidenceBindings: evidenceFiles,
  reusedNativeContextRawReceipts: nativeReceipts,
  preservedFailures,
  counters,
  browser: report.browser,
  sourceInventory: report.sourceInventory,
  approvedTextAndSourceUnchanged: true,
  currentExplicitBindingsChecked: true,
  bindingMethod: "Exact path/bytes/SHA256 for existing inputs and saved outputs. No self-hash/circular report-freeze binding; final freeze hash is emitted separately.",
  gates: report.gates,
  independentApproval: false,
  independentTextApprovalReusedOnly: true,
  nativeReviewRecorded: false,
  canonicalPromotions: 0,
  parentAloneCollectsAndCloses: true,
  changedPaths,
};
exclusiveJson(authorFreezePath, authorFreeze);
const freezeBinding = bind(authorFreezePath);
assert.equal(readJson(reportPath).status, "HOLD");
assert.equal(readJson(authorFreezePath).report.sha256, reportBinding.sha256);
console.log(JSON.stringify({
  status: "HOLD",
  report: reportBinding,
  authorFreeze: freezeBinding,
  selectedHashes: report.selectedHashes,
  actualImageOpens: counters.actualImageOpensInFreshBatch,
  nativeContextCallsTotal: counters.nativeContextCallsTotal,
  nativeDraftValidations: counters.nativeDraftValidations,
  nativeRenders: counters.nativeRenders,
  contentRepairsTotal: counters.contentRepairsTotal,
  bindingsChecked: inputs.length + contracts.length + unusedNativeToolBindings.length + evidenceFiles.length,
  changedPaths,
}, null, 2));
