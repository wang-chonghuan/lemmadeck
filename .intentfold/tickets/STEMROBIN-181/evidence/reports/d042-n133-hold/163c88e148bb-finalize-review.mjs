import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const W = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const T = path.join(W, '.intentfold/tickets/STEMROBIN-181');
const E = path.join(T, 'tmp/d040-9p-fig300-independent-evidence');
const reportPath = path.join(T, 'tmp/d040-9p-fig300-independent-review.json');
const gatePath = path.join(E, 'fig-300.review.json');
const hash = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const bind = (file) => ({ path: file, sha256: hash(file) });
const load = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const save = (file, payload) => fs.writeFileSync(file, `${JSON.stringify(payload, null, 2)}\n`);
const auditPath = path.join(E, 'binding-audit-receipt.json');
const widthsPath = path.join(E, 'width-pixel-receipt.json');
const observationsPath = path.join(E, 'visual-observations.json');
const inventoryPath = path.join(E, 'source-inventory.json');
const audit = load(auditPath);
const widths = load(widthsPath);
const observations = load(observationsPath);
const spec = load(audit.inputs.spec.path);
const openedPixels = [
  { order: 1, kind: 'canonical-original', ...bind(audit.inputs.source.path), width: 804, height: 410, independentView: 'functions.view_image original' },
  { order: 2, kind: 'original-dial-crop', ...bind(path.join(E, 'source-dial-3x.png')), width: 720, height: 690, independentView: 'functions.view_image original', cropSourceRectangle: [550, 85, 240, 230], nearestNeighborScale: 3 },
  { order: 3, kind: 'candidate-full-resolution-and-640px-media', ...bind(path.join(E, 'candidate-640px.png')), width: 640, height: 1000, independentView: 'functions.view_image original' },
  { order: 4, kind: 'candidate-316px-media', ...bind(path.join(E, 'candidate-316px.png')), width: 316, height: 494, cssHeightPx: 493.75, independentView: 'functions.view_image original' },
];
for (const record of Object.values(audit.inputs)) assert.equal(hash(record.path), record.sha256, record.path);
for (const record of audit.frozenRecords) assert.equal(hash(record.path), record.sha256, record.path);
assert.equal(observations.status, 'fail');
assert.equal(observations.imageCount, openedPixels.length);
assert.equal(audit.ticks.independentSourceCount, 11);
assert.equal(audit.ticks.currentCandidateCount, 9);
assert.equal(widths.checks.length, 2);
for (const check of widths.checks) {
  assert(check.minimumScreenTextPx >= 16);
  assert.equal(check.clippedLabels.length, 0);
  assert.equal(check.overlaps.length, 0);
  assert.equal(hash(check.output.path), check.output.sha256);
}
const recorderPath = path.join(W, '.agents/skills/ld-s10y-image/scripts/record_review.py');
const recorderReceiptPath = path.join(E, 'record-review-receipt.json');
save(recorderReceiptPath, {
  schema: 'ld-s10y-image/conditional-recorder-receipt@1',
  installedRecorder: bind(recorderPath),
  currentSpec: audit.inputs.spec,
  currentRender: audit.inputs.render,
  intendedOutput: gatePath,
  called: false,
  commandExecuted: false,
  exitCode: null,
  status: 'skipped-failed-independent-gate',
  reason: 'The user authorized the installed approval recorder only if independent review PASS. Source fidelity failed, so no --status pass call or approval receipt was fabricated.',
  failureArtifactMethod: 'Reviewer-authored hash-bound status:fail record at the requested output path; not a native approval-recorder result.',
});
const gate = {
  schema: 'ld-s10y-image/review@1',
  figure: 'fig-300',
  status: 'fail',
  reviewedAt: new Date().toISOString(),
  source: bind(audit.inputs.source.path),
  spec: bind(audit.inputs.spec.path),
  render: bind(audit.inputs.render.path),
  outputs: { svg: bind(audit.inputs.svg.path) },
  notes: 'Independent source fidelity FAIL: original dial has 11 ticks, current candidate has nine. Other inspected media/English/topology gates pass. Full-card display remains pending. No additional repair, renderer invocation or promotion. Installed record_review.py was not called because the conditional PASS requirement was not met.',
  creationMethod: 'Independent reviewer-authored failure record, not installed recorder output or approval.',
  findingIds: observations.findings.map((finding) => finding.id),
  openedPixels,
  inventory: bind(inventoryPath),
  observations: bind(observationsPath),
  bindingAudit: bind(auditPath),
  widthEvidence: bind(widthsPath),
  recorderReceipt: bind(recorderReceiptPath),
  fullCardDisplay: 'pending',
  canonicalPromotionApproved: false,
};
save(gatePath, gate);
const evidence = fs.readdirSync(E).filter((name) => name !== 'final-hash-receipt.json' && name !== 'fig-300.review.json').sort().map((name) => bind(path.join(E, name)));
const report = {
  schema: 'ld-s10y-image/bounded-independent-modern-review@1',
  ticket: 'STEMROBIN-181',
  figure: 'fig-300',
  reviewDate: '2026-11-17',
  status: 'FAIL-INDEPENDENT-SOURCE-FIDELITY',
  decision: {
    sourceFidelity: 'FAIL',
    independentFigureGate: 'FAIL',
    currentSpecValidation: 'PASS',
    currentRenderReport: 'PASS',
    pathBindingReversibility: 'PASS',
    svgUnchanged: 'PASS',
    mathematicalApparatusTopology: 'PASS',
    englishMediaLegibility: 'PASS',
    visibleClippingAndLabelOverlap: 'PASS',
    answerLeakageAndCulturalLeakage: 'PASS',
    fullCardDisplay: 'PENDING-NOT-REVIEWED',
    canonicalIntegrationAndPromotion: 'NOT-PERFORMED-NOT-APPROVED',
    unresolvedFindingIds: ['FIG300-001'],
    nativeApprovalRecorderCalled: false,
  },
  owner: { report: reportPath, evidenceDirectory: E, onlyThesePathsWritten: true },
  inputBindings: audit.inputs,
  authoritativeText: {
    files: audit.textBindings,
    completeCurrentBilingualProseRead: true,
    completeProseAndCaptionsMatchSpecSnapshot: true,
    affectedScienceGate: audit.inputs.affectedScience,
    affectedScienceStatus: 'PASS-AFFECTED-SCI-ZHEN-ONLY',
    scienceNotReapprovedByThisFigureReview: true,
    removableCore: 'Declared prose-derived modern addition, not original-source pixel fact.',
    englishPrintedTitleSnapshot: 'The spec retains the original printed title as provenance; all current visible figure labels are English. Full-card title localization is not reapproved here.',
  },
  provenanceAndReversibility: {
    specChanges: audit.specChanges,
    renderChanges: audit.renderChanges,
    reversibility: audit.reversibility,
    geometryObjectsAssertionsCanvasDisplayInventoryUnchanged: true,
    originalFrozenRecordsVerified: audit.frozenRecordCountVerified,
    authorRenderRerunForPathBinding: false,
    reviewerRenderRerun: false,
    limitation: 'Byte equality and reversible metadata changes prove unchanged candidate lineage, not source fidelity. The tick defect was already in the frozen author candidate.',
  },
  independentSourceInventory: bind(inventoryPath),
  sourceRequirementComparison: [
    { source: 'battery polarity/source', candidate: ['primary-negative', 'primary-positive', 'primary-battery-short-plate', 'primary-battery-long-plate'], status: 'pass' },
    { source: 'primary circuit and open knife switch', candidate: ['primary-left-return-wire-*', 'primary-right-return-wire-*', 'primary-battery-switch-wire-1', 'primary-switch-pivot', 'primary-switch-contact', 'primary-switch-blade'], assertions: ['primary-switch-gap'], status: 'pass' },
    { source: 'shared coaxial coil frame and mechanical support', candidate: ['coil-top-flange', 'coil-lower-flange', 'coil-left-body', 'coil-right-body', 'secondary-insulating-band', 'support-block'], assertions: ['coils-shared-vertical-axis', 'support-below-coils', 'secondary-over-primary-center'], status: 'pass' },
    { source: 'two independent secondary leads and separated meter terminals', candidate: ['secondary-upper-return-wire-*', 'secondary-lower-return-wire-*', 'secondary-meter-left-terminal', 'secondary-meter-right-terminal'], assertions: ['meter-terminal-separation'], status: 'pass' },
    { source: 'framed galvanometer, mechanism, zero pointer and unsigned 5/0/5 labels', candidate: ['meter-frame', 'meter-foot', 'meter-internal-mechanism', 'meter-internal-coil-*', 'meter-pivot', 'meter-pointer', 'meter-left-five', 'meter-zero', 'meter-right-five'], assertions: ['meter-pointer-at-central-zero'], status: 'pass' },
    { source: 'eleven source dial ticks', candidate: audit.ticks.candidateIds, actualCandidateCount: 9, missingIntermediateMarks: 2, assertions: 'Nine connects assertions cover the nine authored ticks but no source-derived eleven-tick completeness assertion exists.', status: 'fail' },
    { source: 'prose-derived core and modern English labels, separate from pixel facts', candidate: ['core-exposed-rod', 'core-hidden-left', 'core-hidden-right', 'core-removable-label', 'core-material-label'], assertions: ['removable-core-coaxial', 'core-into-primary-bore'], status: 'pass' },
  ],
  geometryAndTopologyEvidence: { inventoryReferences: audit.sourceGroups, topology: audit.topology, ticks: audit.ticks, nativeValidation: bind(path.join(E, 'native-validation-receipt.json')) },
  pixelEvidence: {
    independent: true,
    browser: widths.browser,
    method: widths.method,
    currentSvgHash: widths.svg.sha256,
    actualMediaWidthsPx: [316, 640],
    fullResolution: '640x1000; native resolution equals the 640px media check, so the same image was opened once for both.',
    widths: widths.checks.map((check) => ({
      viewport: check.viewport,
      media: check.media,
      screenshotPixels: check.pixels,
      minimumScreenTextPx: check.minimumScreenTextPx,
      labelCount: check.labelCount,
      clippedLabels: check.clippedLabels,
      labelOverlaps: check.overlaps,
      clippedVisibleShapeBoxes: check.clippedShapeBoxes,
      output: check.output,
    })),
    openedPixels,
    imageCount: openedPixels.length,
    imageLimit: 8,
    reopens: 0,
    sourceOriginalViews: 1,
    sourceCropViews: 1,
    candidateViews: 2,
    uninspectedAuthorImagesNotLoadedOrReused: true,
    foregroundBrowserUsed: false,
    fullCardDisplay: 'pending; exact-media fixtures are not full-card approval',
  },
  observations: observations.observations,
  findings: observations.findings.map((finding) => ({
    ...finding,
    candidateTickJsonPointers: spec.objects.flatMap((object, index) => /^meter-scale-tick-\d+$/.test(object.id) ? [`/objects/${index}`] : []),
  })),
  repairBudget: audit.repairBudget,
  gate: bind(gatePath),
  gateCreation: 'Reviewer-authored failure record; installed native recorder conditional PASS branch was not entered.',
  recorderReceipt: bind(recorderReceiptPath),
  evidence,
  exclusions: {
    canonicalPromotion: false,
    indexOrMeterWrites: false,
    databaseAccess: false,
    gitCommands: false,
    fullTestsOrBuild: false,
    setupOrUpdate: false,
    grill: false,
    externalMessages: false,
    ticketBackend: 'Read-only GET used to read live STEMROBIN-181; no comment/state/message sent.',
    authorOrParentChanges: false,
    jsxGraphRendererInvocations: 0,
    additionalRepairs: 0,
  },
};
save(reportPath, report);
const receipt = {
  report: bind(reportPath),
  gate: bind(gatePath),
  status: report.status,
  imageCount: openedPixels.length,
  recordReviewCalled: false,
  fullCardDisplay: 'pending',
};
save(path.join(E, 'final-hash-receipt.json'), receipt);
console.log(JSON.stringify(receipt, null, 2));
