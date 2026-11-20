import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck'
assert.equal(process.cwd(), repo)
const lane = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d181-n12-figures17-19-review')
const load = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
const bind = (file) => {
  const absolute = path.isAbsolute(file) ? file : path.join(repo, file)
  const bytes = fs.readFileSync(absolute)
  return { path: absolute, bytes: bytes.length, sha256: crypto.createHash('sha256').update(bytes).digest('hex') }
}
const writeNew = (name, value) => fs.writeFileSync(path.join(lane, name), `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
const interpretation = load(path.join(lane, 'independent-interpretation.json'))
const sourceOnly = load(path.join(lane, 'source-only.json'))
const afterInventory = load(path.join(lane, 'after-inventory.json'))
const before = load(path.join(lane, 'binding-audit-before.json'))
const after = load(path.join(lane, 'binding-audit-after.json'))
assert.equal(before.status, 'pass')
assert.equal(after.status, 'pass')
assert.equal(after.nativeReviews.length, 2)
assert.equal(interpretation.usage.actualImageOpens, 4)
assert.equal(interpretation.usage.parentImageOpens, 0)
assert.equal(bind(path.join(lane, 'input-freeze.json')).sha256, '583d083bfa604a05d09d3b92fb39a75f854e00abe01a52949bb44b10f9418c5a')
for (const record of after.verifiedBindings) assert.equal(bind(record.path).sha256, record.sha256)
for (const native of after.nativeReviews) {
  assert.equal(native.exitCode, 0)
  assert.equal(load(native.review.path).status, 'pass')
  for (const name of ['review', 'receipt', 'stdout', 'stderr']) assert.equal(bind(native[name].path).sha256, native[name].sha256)
}
const figures = Object.fromEntries(Object.entries(interpretation.figures).map(([id, semantic]) => {
  const native = after.nativeReviews.find((record) => record.figure === id)
  const outputs = afterInventory.selected.find((record) => record.figure === id)
  const source = sourceOnly.sourceImages.find((record) => record.figure === id)
  return [id, {
    ...semantic,
    independentFigureApproval: true,
    independentReviewPassCount: 1,
    currentSource: source.image,
    currentOutputs: outputs.candidate,
    reusedValidation: outputs.validation,
    reusedRendering: outputs.rendering,
    currentSVGEvidence: after.figures[id],
    nativeReview: native,
    nativeRecordReviewCalls: 1,
    nativeRecordReviewEmbeddedIntegrityValidations: 1,
    standaloneValidationReplays: 0,
    rendererReplays: 0,
    contentRepairBudgetReset: false,
    promotion: false
  }]
}))
const usage = {
  ...interpretation.usage,
  nativeRecordReviewCalls: 2,
  nativeRecordReviewEmbeddedIntegrityValidations: 2,
  nativeRecordReviewRetries: 0,
  scopedBindingAuditInvocations: 3,
  successfulScopedBindingAudits: 2,
  independentCurrentSVGArithmeticChecks: 2,
  reviewHelperTechnicalFailures: 1,
  reviewerFigurePasses: 2,
  reviewerFigureFails: 0,
  reviewerFigureHolds: 0,
  svgXMLInspectionCommands: 1
}
const evidence = {
  inputFreeze: bind(path.join(lane, 'input-freeze.json')),
  sourceOnly: bind(path.join(lane, 'source-only.json')),
  afterInventory: bind(path.join(lane, 'after-inventory.json')),
  sourceInventory: bind(path.join(lane, 'independent-source-inventory.json')),
  interpretation: bind(path.join(lane, 'independent-interpretation.json')),
  preReviewBindingAudit: bind(path.join(lane, 'binding-audit-before.json')),
  postReviewBindingAudit: bind(path.join(lane, 'binding-audit-after.json')),
  auditScript: bind(path.join(lane, 'audit-bindings.py')),
  finalizer: bind(path.join(lane, 'finalize-review.mjs')),
  skill: bind(path.join(repo, '.agents/skills/ld-s10y-image/SKILL.md')),
  qualityGate: bind(path.join(repo, '.agents/skills/ld-s10y-image/references/quality-gate.md')),
  nativeRecorder: bind(path.join(repo, '.agents/skills/ld-s10y-image/scripts/record_review.py')),
  nativeEmbeddedValidator: bind(path.join(repo, '.agents/skills/ld-s10y-image/scripts/validate_spec.py')),
  nativeReceiptRunner: bind(path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-recovery/run-native.mjs'))
}
const now = new Date().toISOString()
const report = {
  schema: 'STEMROBIN-181/D181-first-sole-independent-figure-review@1',
  ticket: 'STEMROBIN-181',
  batch: 'D181',
  role: interpretation.role,
  cwd: repo,
  recordedAt: now,
  status: 'first_sole_figure_review_complete_pass_awaiting_parent_collection',
  verdict: 'pass',
  scope: interpretation.scope,
  independence: interpretation.independence,
  evidence,
  hashBoundAuthorInput: afterInventory,
  originalLesson: sourceOnly.originalLesson,
  currentFullBilingualText: sourceOnly.currentText,
  reusedIndependentTextPass: sourceOnly.independentTextReview,
  figures,
  nativeReviews: after.nativeReviews,
  usage,
  protectedFrozenBindingsVerifiedUnchanged: after.verifiedBindings.length,
  protectedBindings: after.verifiedBindings,
  fig18HoldBindings: after.fig18HoldBindings,
  fig18Verdict: 'HOLD_unchanged_outside_review_scope',
  protected: interpretation.protected,
  originalFailuresPreserved: true,
  contentRepairs: {
    'fig-17': figures['fig-17'].repairs,
    'fig-19': figures['fig-19'].repairs,
    actualBatchTotal: 0,
    budgetNeverReset: true,
    repairsAuthorizedInThisReviewLane: false
  },
  helperTechnicalFailure: {
    command: ['env', 'PYTHONDONTWRITEBYTECODE=1', 'python3', '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d181-n12-figures17-19-review/audit-bindings.py', 'before'],
    cwd: repo,
    exitCode: 1,
    exactException: "KeyError: 'ld-fig-17_ld-src17-fluid'",
    cause: 'Review helper assumed raw-path IDs. Current renderer uses raw-path layer order and data-label-id for text.',
    resolution: 'Changed only the new D181 helper lookup; first subsequent audit passed.',
    contentRepair: false,
    imagesDisplayed: 0,
    nativeProducerReplay: false
  },
  writeBoundary: {
    manualAndReportWrites: lane,
    nativeReceiptDirectories: after.nativeReviews.map((record) => path.dirname(record.receipt.path)),
    otherWrites: [],
    authoredFrozenInputsMutated: false,
    chmodCalls: 0
  },
  limitations: interpretation.limitations,
  paidCalls: 0,
  parentImageOpens: 0,
  actualImageOpens: 4,
  wholeCourseApproved: false,
  completeCoursesAdded: 0,
  canonicalPromotions: 0,
  productAcceptance: false,
  formalHandoff: false,
  closure: false,
  next: 'Wait for parent collection and closure. No messaging, promotion, application acceptance, formal handoff or closure performed by D181.'
}
writeNew('report.json', report)
const reviewFreeze = {
  schema: 'STEMROBIN-181/D181-review-freeze@1',
  ticket: 'STEMROBIN-181',
  batch: 'D181',
  cwd: repo,
  frozenAt: now,
  status: report.status,
  verdict: 'pass',
  inputFreeze: evidence.inputFreeze,
  report: bind(path.join(lane, 'report.json')),
  evidence,
  hashBoundInputsVerifiedUnchanged: after.verifiedBindings,
  currentFullBilingualText: sourceOnly.currentText,
  figureBindings: Object.fromEntries(Object.entries(figures).map(([id, figure]) => [id, {
    verdict: figure.verdict,
    currentSource: figure.currentSource,
    currentOutputs: figure.currentOutputs,
    nativeReview: figure.nativeReview,
    repairs: figure.repairs,
    imageOpens: figure.imageOpens,
    firstNativeRecordReviewCalls: 1
  }])),
  nativeReviews: after.nativeReviews,
  fig18HoldBindings: after.fig18HoldBindings,
  fig18HoldUnchanged: true,
  protected: interpretation.protected,
  usage,
  frozenInputsImmutable: true,
  chmodCalls: 0,
  paidCalls: 0,
  parentImageOpens: 0,
  actualImageOpens: 4,
  wholeCourseApproved: false,
  productAcceptance: false,
  formalHandoff: false,
  canonicalPromotions: 0,
  completeCoursesAdded: 0,
  next: report.next
}
writeNew('review-freeze.json', reviewFreeze)
console.log(JSON.stringify({
  report: bind(path.join(lane, 'report.json')),
  reviewFreeze: bind(path.join(lane, 'review-freeze.json')),
  nativeReviews: after.nativeReviews.map(({ figure, review, receipt }) => ({ figure, review, receipt })),
  actualImageOpens: 4,
  contentRepairsActual: 0,
  paidCalls: 0,
  parentImageOpens: 0,
  verdict: 'pass',
  waitingForParentCollection: true
}, null, 2))
