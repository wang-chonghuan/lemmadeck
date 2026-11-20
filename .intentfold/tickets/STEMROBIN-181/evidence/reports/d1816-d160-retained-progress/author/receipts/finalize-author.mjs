import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

const cwd = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck'
assert.equal(process.cwd(), cwd)
const author = path.join(cwd, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d160-fig11-classification-author')
const outputs = path.join(cwd, '.tmp/STEMROBIN-181/d1816-d160/figures/fig-11')
const bind = (file) => {
  const bytes = fs.readFileSync(file)
  return { path: file, bytes: bytes.length, sha256: crypto.createHash('sha256').update(bytes).digest('hex') }
}
const read = (file) => JSON.parse(fs.readFileSync(file))
const write = (file, data) => fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, { flag: 'wx' })
const inputPath = path.join(author, 'input-freeze.json')
assert.equal(bind(inputPath).sha256, 'e843ad8637a9559ee4f238912f4fadd469a180c8af614b29c39901fd79c19398')
const input = read(inputPath)
const immutableInputs = [...Object.values(input).filter((value) => value?.path), ...input.nativeContractFiles]
for (const item of immutableInputs) assert.deepEqual(bind(item.path), item)
const originalFailure = read(input.originalFailure.path)
assert.deepEqual(bind(originalFailure.nativeReceipt.path), originalFailure.nativeReceipt)
const inheritedFailureCopy = bind(path.join(author, 'receipts/D160-inherited-D153-first-failure.json'))
const inheritedRawCopy = bind(path.join(author, 'receipts/D160-inherited-D153-native-001-raw.json'))
assert.equal(inheritedFailureCopy.sha256, input.originalFailure.sha256)
assert.equal(inheritedRawCopy.sha256, originalFailure.nativeReceipt.sha256)
const selected = Object.fromEntries([
  ['spec', 'candidate-02.spec.json'],
  ['svg', 'candidate-02.svg'],
  ['render', 'candidate-02.render.json'],
  ['preview', 'candidate-02.preview.png'],
].map(([key, name]) => [key, bind(path.join(outputs, name))]))
const render = read(selected.render.path)
assert.equal(render.status, 'pass')
assert.equal(render.spec.sha256, selected.spec.sha256)
assert.equal(render.output.svg.sha256, selected.svg.sha256)
assert.deepEqual(render.collisions, [])
assert.deepEqual(render.displayChecks, [{ width: 640, minTextPx: 16, measuredMinPx: 18, failures: [], status: 'pass' }])
const renderReceiptPath = path.join(author, 'receipts/D160-native-001-fig-11-render.json')
const validationReceiptPath = path.join(author, 'receipts/D160-native-002-fig-11-validate.json')
const renderReceipt = read(renderReceiptPath)
const validationReceipt = read(validationReceiptPath)
for (const receipt of [renderReceipt, validationReceipt]) {
  assert.equal(receipt.exitCode, 0)
  assert.equal(receipt.input.sha256, selected.spec.sha256)
  assert.deepEqual(bind(receipt.stdout.path), receipt.stdout)
  assert.deepEqual(bind(receipt.stderr.path), receipt.stderr)
}
assert.ok(renderReceipt.finishedAt <= validationReceipt.startedAt)
assert.equal(renderReceipt.browserClosedByRendererFinally, true)
const validation = read(validationReceipt.stdout.path)
assert.equal(validation.status, 'pass')
assert.deepEqual(validation.errors, [])
const sourceFirstPath = path.join(author, 'inventories/fig-11.source-first.json')
const proofPath = path.join(author, 'inventories/fig-11.structural-proof.json')
const proof = read(proofPath)
assert.equal(proof.status, 'pass')
assert.equal(proof.candidate.sha256, selected.spec.sha256)
assert.deepEqual(bind(sourceFirstPath), proof.sourceFirstInventory)
assert.equal(proof.oneRepair.total, 1)
const budget = {
  inheritedFig11ContentRepairs: 0,
  freshFig11ContentRepairs: 1,
  totalFig11ContentRepairs: 1,
  maximumTotalFig11ContentRepairs: 1,
  freshBatchImageOpens: 2,
  freshContextImageOpens: 2,
  historicalD153ImageOpens: 4,
  cumulativeImageOpensIncludingHistorical: 6,
  parentImageOpens: 0,
  maximumFreshBatchImageOpens: 8,
  maximumContextImageOpens: 24,
  paidCalls: 0,
}
const report = {
  schema: 'D160/fig11-classification-author-report@1',
  batch: 'D160',
  ticket: 'STEMROBIN-181',
  figure: 'fig-11',
  status: 'authorready',
  role: 'AUTHOR, not approver',
  finish: 'review',
  grill: 'self',
  invocation: 'continuation of the same STEMROBIN-181 invocation',
  inputFreeze: bind(inputPath),
  classification: {
    justifiedFromFreshSourcePixels: true,
    actualStructure: 'finite projected point-edge graph',
    axisAligned2DGridObserved: false,
    nativeRequirement: 'pointRelationships',
    noRealGridWaived: true,
    noInvisibleOrSurrogateGridAdded: true,
    noSourceGeometryRegularization: true,
    finiteSlotsRetained: '3 layers; 3 rows and 3 columns each; visible row counts front 3/3/3, middle 3/3/3, rear 3/2/3',
    counts: proof.counts,
    all26PointsMappedToWhollyInGroupNativeRelationships: true,
    supplementalProof: bind(proofPath),
    freshSourceInventory: bind(sourceFirstPath),
    occlusion: proof.occlusion,
  },
  repair: proof.oneRepair,
  selected,
  evidence: {
    firstNativeCall: 'render_spec.mjs, after actual spec change; it internally invokes the immutable native draft validator',
    render: { status: render.status, receipt: bind(renderReceiptPath), collisions: render.collisions, displayChecks: render.displayChecks },
    subsequentExplicitNativeValidation: { status: validation.status, stage: validation.stage, errors: validation.errors, receipt: bind(validationReceiptPath), rawOutput: bind(validationReceipt.stdout.path) },
    browserClosed: true,
    freshImageOpenLog: [
      { ordinal: 1, path: input.sourceImage.path, sha256: input.sourceImage.sha256, purpose: 'original source classification before baseline reuse or patching' },
      { ordinal: 2, path: selected.preview.path, sha256: selected.preview.sha256, purpose: 'first repaired native render preview; author inspection only' },
    ],
    authorVisualObservation: 'The new preview retains the three irregular projected layers, both marker appearances, the two rear-left dashed portions and overlapping rod continuations. No separately visible marker is added at the rear central slot. English title, anonymous ion legend and projection qualification have clear margins. This observation is not independent approval or a native review artifact.',
    fullApprovedBilingualTextPreservedExactlyAgainstInputFigureContext: true,
    nativeContextsReplayed: false,
    textScienceAndSourcePageReviewsReplayed: false,
  },
  selfGrill: [
    { question: 'Is this dropping an actual axis-aligned source grid?', answer: 'No. The original reopened pixels show offset, overlapping point-bearing rods, not a bounded axis-aligned 2D grid.' },
    { question: 'Can the native group pass while omitting a source point or losing finite slots?', answer: 'Every observed point is mapped to wholly in-group native relationships. Supplemental executed assertions check all 26 exact source slots, appearance counts, every one of 52 connector endpoints and projected displacements, and the absent separate rear-center marker.' },
    { question: 'Was an ideal site, hidden marker or ideal 3D coordinate introduced?', answer: 'No. Original point and segment object data and all 105 original assertions are unchanged. The existing literal terminal remains only an uncalibrated projected rod terminal.' },
    { question: 'Was the one content repair followed by a second content repair or validation replay of the old candidate?', answer: 'No. One new candidate was generated, then first rendered and explicitly validated once. No post-validation spec edits occurred.' },
  ],
  budgets: budget,
  originalFailures: [{
    batch: 'D153',
    status: 'HOLD',
    stage: 'draft-validation',
    error: 'source.inventory[0]: gridDimensions requirement needs a mapped grid',
    failure: input.originalFailure,
    rawNativeReceipt: originalFailure.nativeReceipt,
    preservedFailureCopy: inheritedFailureCopy,
    preservedRawReceiptCopy: inheritedRawCopy,
    originalCandidate: input.originalSpec,
    readonlyD160Baseline: input.baseline,
    inheritedContentRepairAttempted: false,
    originalBytesStillMatch: true,
  }],
  immutableInputsRechecked: immutableInputs,
  boundaries: {
    independentApproval: false,
    nativeReviewWritten: false,
    promotionAuthorized: false,
    canonicalPromotions: 0,
    productAcceptance: false,
    ticketClosure: false,
    dbOrPublisherCalls: 0,
    commitsPushesDeploysMerges: 0,
    peerMessages: 0,
    modelOverrides: 0,
    sourceSchemaValidatorSharedToolsChanged: false,
    fig12SourceHold: 'unchanged; not opened or edited',
    allOtherFigures: 'out of scope; not opened or edited',
    portraitGeneration: 'unauthorized; not attempted',
    D154: 'sole independent source-count reviewer for 8/9; not contacted or displaced',
    D156: 'author for 13/14; disjoint and untouched',
    parentCollection: 'pending parent consumption; this author does not collect, approve, or close D160',
  },
  nextOwner: 'Parent may collect this hash-bound authorready candidate for the separately authorized review; no approval or promotion is claimed here.',
}
const reportPath = path.join(author, 'report.json')
write(reportPath, report)
const ownedEvidence = [
  sourceFirstPath,
  proofPath,
  path.join(author, 'inventories/repair-and-prove.mjs'),
  path.join(author, 'receipts/capture-native.mjs'),
  path.join(author, 'receipts/finalize-author.mjs'),
  inheritedFailureCopy.path,
  inheritedRawCopy.path,
  renderReceiptPath,
  validationReceiptPath,
  renderReceipt.stdout.path,
  renderReceipt.stderr.path,
  validationReceipt.stdout.path,
  validationReceipt.stderr.path,
].map(bind)
const authorFreeze = {
  schema: 'D160/author-freeze@1',
  batch: 'D160',
  ticket: 'STEMROBIN-181',
  figure: 'fig-11',
  status: 'authorready',
  role: 'author',
  approval: false,
  finish: 'review',
  grill: 'self',
  inputFreeze: bind(inputPath),
  report: bind(reportPath),
  selected,
  evidence: ownedEvidence,
  preservedImmutableInputs: immutableInputs,
  preservedOriginalNativeFailureReceipt: originalFailure.nativeReceipt,
  nativeTools: [
    ...input.nativeContractFiles,
    bind(path.join(cwd, '.agents/skills/ld-s10y-image/scripts/render_spec.mjs')),
  ],
  budgets: budget,
  frozenAt: new Date().toISOString(),
  noApprovalPromotionClosure: true,
}
const freezePath = path.join(author, 'author-freeze.json')
write(freezePath, authorFreeze)
console.log(JSON.stringify({ status: 'authorready', selected, report: bind(reportPath), authorFreeze: bind(freezePath), budgets: budget, originalFailures: originalFailure.errors, browserClosed: true }, null, 2))
