import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'

const cwd = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck'
const owner = path.join(cwd, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d174-n12-figures17-19-author')
const figures = path.join(cwd, '.tmp/STEMROBIN-181/d1816-d174/figures')
const snapshotRoot = path.join(owner, 'frozen-output-snapshots')
assert.equal(process.cwd(), cwd)
assert(!fs.existsSync(snapshotRoot), 'Refuse an existing freeze')
const load = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
const bind = (file) => {
  const absolute = path.resolve(file)
  const bytes = fs.readFileSync(absolute)
  return { path: absolute, bytes: bytes.length, sha256: crypto.createHash('sha256').update(bytes).digest('hex') }
}
const verify = (file) => {
  const current = bind(file.path)
  assert.equal(current.bytes, file.bytes)
  assert.equal(current.sha256, file.sha256, `Changed binding: ${file.path}`)
  return current
}
const save = (file, value) => fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
const inputFreezePath = path.join(owner, 'input-freeze.json')
assert.equal(bind(inputFreezePath).sha256, 'a278e08cabb6db18a6bd37658f80b44f20aafae964161de3b97fde5f2d9cd9cb')
const inputFreeze = load(inputFreezePath)
const protectedBindings = [
  bind(inputFreezePath),
  ...inputFreeze.contexts.map(verify),
  verify(inputFreeze.textReview),
]
for (const draft of inputFreeze.drafts) {
  protectedBindings.push(...Object.values(draft).map(verify))
}
// Bind scoped originals only; the fig18 image is neither opened nor hashed.
for (const source of inputFreeze.sources) {
  if (/\/figures\/fig-18\./.test(source.path)) continue
  protectedBindings.push(verify(source))
}
const visualPath = path.join(owner, 'author-visual-observations.json')
const geometryPath = path.join(owner, 'author-geometry-evidence.json')
const visual = load(visualPath)
assert.equal(visual.usage.actualImageOpens, 4)
assert.equal(visual.usage.parentImageOpens, 0)
assert.equal(load(geometryPath).status, 'pass')
const receiptIds = [
  'd174-001-build-first-specs',
  'd174-002-fig17-first-validation',
  'd174-003-fig19-first-validation',
  'd174-004-fig17-first-render',
  'd174-005-fig19-first-render',
  'd174-006-focused-geometry-check',
]
const receipts = receiptIds.map((id) => {
  const file = path.join(owner, 'native', id, 'receipt.json')
  const receipt = load(file)
  assert.equal(receipt.exitCode, 0)
  assert.equal(receipt.cwd, cwd)
  receipt.inputs.forEach(verify)
  receipt.inputsAfter.forEach(verify)
  receipt.outputs.forEach(verify)
  verify(receipt.stdout)
  verify(receipt.stderr)
  return { id, ...bind(file), command: receipt.command, startedAt: receipt.startedAt, endedAt: receipt.endedAt, exitCode: receipt.exitCode }
})
const newOutputSnapshots = []
const snapshot = (source, relative) => {
  const destination = path.join(snapshotRoot, relative)
  fs.mkdirSync(path.dirname(destination), { recursive: true })
  fs.copyFileSync(source, destination, fs.constants.COPYFILE_EXCL)
  assert.equal(bind(destination).sha256, bind(source).sha256)
  fs.chmodSync(destination, 0o444)
  const item = { source: bind(source), snapshot: bind(destination), permission: '0444', byteIdentical: true }
  newOutputSnapshots.push(item)
  return item.snapshot
}
const perFigure = {}
for (const [id, validationId, renderId] of [
  ['fig-17', receiptIds[1], receiptIds[3]],
  ['fig-19', receiptIds[2], receiptIds[4]],
]) {
  const context = load(path.join(owner, `${id}.input-context.json`))
  Object.values(context.nativeContexts).forEach((input) => protectedBindings.push(verify(input)))
  protectedBindings.push(verify(context.sourceImage), verify(context.durableSourceImage))
  const candidateRoot = path.join(figures, id, 'candidate-1')
  const files = {}
  const snapshots = {}
  for (const [key, name] of [
    ['spec', `${id}.spec.json`],
    ['render', `${id}.render.json`],
    ['svg', `${id}.svg`],
    ['preview', `${id}.preview.png`],
    ['textBinding', `${id}.text-binding.json`],
  ]) {
    files[key] = bind(path.join(candidateRoot, name))
    snapshots[key] = snapshot(files[key].path, `${id}/${name}`)
  }
  const textBinding = load(files.textBinding.path)
  verify(textBinding.inputFreeze)
  verify(textBinding.inputContext)
  verify(textBinding.originalPixelInventory)
  verify(textBinding.spec)
  textBinding.approvedText.forEach(verify)
  const render = load(files.render.path)
  assert.equal(render.status, 'pass')
  assert.equal(render.spec.sha256, files.spec.sha256)
  assert.equal(render.output.svg.sha256, files.svg.sha256)
  const validationReceipt = path.join(owner, 'native', validationId, 'receipt.json')
  const renderReceipt = path.join(owner, 'native', renderId, 'receipt.json')
  const sourceInventory = bind(path.join(owner, `${id}.source-inventory.json`))
  perFigure[id] = {
    authorStatus: 'authorready',
    HOLD: null,
    candidate: 'candidate-1',
    selectedCandidateDirectory: candidateRoot,
    selectedCandidateFiles: files,
    frozenOutputSnapshots: snapshots,
    source: context.durableSourceImage,
    sourceCarrier: context.sourceImage,
    sourceInventory,
    frozenSourceInventory: snapshot(sourceInventory.path, `${id}/${id}.source-inventory.json`),
    inputContext: bind(path.join(owner, `${id}.input-context.json`)),
    approvedText: textBinding.approvedText,
    independentTextReview: context.independentTextReview,
    nativeContexts: context.nativeContexts,
    nativeContextsReplayed: false,
    classification: { purpose: 'instructional', renderMode: 'deterministic', independentDecisions: true },
    validation: { standaloneCalls: 1, embeddedValidatorCallsInRenderer: 1, status: 'pass', receipt: bind(validationReceipt), output: bind(path.join(owner, 'native', validationId, 'stdout.txt')) },
    rendering: { calls: 1, status: 'pass', receipt: bind(renderReceipt), report: files.render, minMeasuredTextPx: render.displayChecks[0].measuredMinPx, checkedWidths: [640] },
    authorVisualObservation: visual.figures[id],
    usage: { actualImageOpens: 2, originalOpens: 1, candidateOpens: 1, reopens: 0, crops: 0, paidCalls: 0, repairsInherited: 0, repairsActual: 0, repairsTOTAL: 0, repairsHardCap: 1 },
    independentFigureApproval: false,
    nativeRecordReview: false,
    promotionAuthorized: false,
  }
  if (id === 'fig-19') {
    const idealPath = path.join(candidateRoot, 'ideal-construction.json')
    perFigure[id].idealConstruction = bind(idealPath)
    perFigure[id].frozenIdealConstruction = snapshot(idealPath, `${id}/ideal-construction.json`)
  }
}
snapshot(geometryPath, 'author-geometry-evidence.json')
snapshot(visualPath, 'author-visual-observations.json')
for (const id of receiptIds) {
  for (const filename of ['receipt.json', 'stdout.txt', 'stderr.txt']) {
    snapshot(path.join(owner, 'native', id, filename), `native/${id}/${filename}`)
  }
}
const report = {
  schema: 'STEMROBIN-181/D174-first-N12-figures17-19-author-report@1',
  ticket: 'STEMROBIN-181',
  batch: 'D174',
  role: 'first_figure_author',
  recordedAt: new Date().toISOString(),
  cwd,
  scope: { book: '9p', lesson: 'phy9-c1-s2-n12', figures: ['fig-17', 'fig-19'], fig18Status: 'HOLD_unchanged_outside_scope', fig18OpenedOrEdited: false },
  status: 'authorready_awaiting_parent_collection_and_independent_review',
  inputFreeze: bind(inputFreezePath),
  protectedExistingBindings: [...new Map(protectedBindings.map((file) => [file.path, file])).values()],
  protectedInputsVerifiedUnchanged: true,
  figures: perFigure,
  evidence: { authorGeometry: bind(geometryPath), authorVisual: bind(visualPath), nativeReceipts: receipts },
  usage: {
    ...visual.usage,
    nativeContextsInheritedSucceeded: 4,
    nativeContextsReplayed: 0,
    nativeStandaloneValidationCalls: 2,
    nativeRendererCalls: 2,
    nativeEmbeddedValidationCalls: 2,
    nativeRecordReviewCalls: 0,
    authorGeometryCheckCalls: 1,
    setupFreshnessGrillReplays: 0,
    prepareCalls: 0,
    sourceReviewReplays: 0,
    textReviewReplays: 0,
    databaseCalls: 0,
    publisherCalls: 0,
    gitCommitPushDeployMergeClosureCalls: 0,
    peerMessages: 0,
    completeCoursesAdded: 0,
    canonicalPromotions: 0,
  },
  failedNativeStages: [],
  contentRepairBudgetNeverReset: true,
  freezePolicy: 'Only newly created D174 output snapshots receive chmod 0444. Existing input-freeze, contexts, shared root, work carriers and source assets remain untouched. Generated SVG and render metadata are never hand-edited.',
  temporaryAuthorOutputsOnly: true,
  publicationMetadataNotRebound: true,
  limitations: [
    'No independent figure approval, native record-review, course finalization, offline lesson rendering, product display/scroll acceptance, alternate-theme or print visual review, or promotion was performed.',
    '640 px is the inherited scroll-media display contract, checked by the native renderer and the one full-resolution candidate preview per figure. No new headed product measurement was claimed.',
    'fig19 curves are analytical text-justified ideal constructions with bounded polyline rasterization; source pixels provide only unscaled visual structure.',
    'No numeric calibration, temperature ratios, new states, apparatus readings or hidden topology were inferred.',
    'Inventory19 observation time is approximate; image-open order/counts are exact and native command receipts supply exact timestamps.',
  ],
  independentFigureApproval: false,
  courseApproval: false,
  promotion: false,
  productAcceptance: false,
  formalHandoff: false,
  closure: false,
  next: 'Await parent collection and closure. No peer messages or author closure actions.',
}
const reportPath = path.join(owner, 'report.json')
save(reportPath, report)
snapshot(reportPath, 'report.json')
const freeze = {
  schema: 'STEMROBIN-181/D174-author-freeze@1',
  ticket: 'STEMROBIN-181',
  batch: 'D174',
  cwd,
  frozenAt: new Date().toISOString(),
  status: report.status,
  inputFreeze: report.inputFreeze,
  report: bind(reportPath),
  figureBindings: perFigure,
  protectedExistingBindings: report.protectedExistingBindings,
  snapshots: newOutputSnapshots,
  evidence: report.evidence,
  usage: report.usage,
  independentFigureApproval: false,
  courseApproval: false,
  promotion: false,
  onlyNewOutputSnapshotsReadOnly: true,
  existingInputsOrCarriersChmod: false,
  fig18HoldUnchanged: true,
  next: report.next,
}
const freezePath = path.join(owner, 'author-freeze.json')
save(freezePath, freeze)
snapshot(freezePath, 'author-freeze.json')
console.log(JSON.stringify({
  report: bind(reportPath),
  authorFreeze: bind(freezePath),
  frozenAuthorFreeze: bind(path.join(snapshotRoot, 'author-freeze.json')),
  status: report.status,
  figures: Object.fromEntries(Object.entries(perFigure).map(([id, data]) => [id, { status: data.authorStatus, candidate: data.selectedCandidateFiles.svg, imageOpens: data.usage.actualImageOpens, repairsTOTAL: data.usage.repairsTOTAL }])),
  imageOpensTOTAL: 4,
  independentFigureApproval: false,
}))
