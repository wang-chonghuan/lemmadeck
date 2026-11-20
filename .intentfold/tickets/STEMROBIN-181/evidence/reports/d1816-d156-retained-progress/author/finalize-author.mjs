import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

const cwd = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck'
assert.equal(process.cwd(), cwd)
const evidence = path.join(cwd, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d156-n9-crystal-appearance-author')
const outputRoot = path.join(cwd, '.tmp/STEMROBIN-181/d1816-d156/figures')
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const binding = file => ({ path: file, bytes: fs.statSync(file).size, sha256: hash(file) })
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const write = (file, value) => {
  assert.ok(file.startsWith(`${evidence}/`))
  assert.ok(!fs.existsSync(file), `Preserve existing output: ${file}`)
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`)
}
const freezePath = path.join(evidence, 'input-freeze.json')
assert.equal(hash(freezePath), 'e171d8d5193c6cd81d8db9055f7800c626c217b72b095d8115d31887465f82bb')
const input = read(freezePath)
const currentInputs = new Map([[freezePath, binding(freezePath)]])
function verify(value) {
  if (!value || typeof value !== 'object') return
  if (value.path && value.sha256) {
    const actual = binding(value.path)
    assert.equal(actual.sha256, value.sha256, value.path)
    if (value.bytes !== undefined) assert.equal(actual.bytes, value.bytes, value.path)
    currentInputs.set(value.path, actual)
  }
  for (const child of Object.values(value)) verify(child)
}
verify(input)
for (const item of input.contexts) verify(read(item.path))
verify(read(input.immutableSharedCarrier.path))
const beforeFile = fs.readdirSync(evidence).find(name => name.startsWith('D156-') && name.endsWith('.bindings-before.json'))
const before = read(path.join(evidence, beforeFile))
for (const prior of before.currentInputs) {
  assert.equal(hash(prior.path), prior.sha256, `Immutable input changed since native authoring: ${prior.path}`)
}
const contexts = input.contexts.map(item => read(item.path))
for (const context of contexts) {
  for (const language of ['zh', 'en']) {
    const template = read(context.languages[language].binding.path)
    assert.deepEqual(template.prose, context.languages[language].blocks)
    const text = template.prose.filter(block => block.kind !== 'fig').map(block => block.text || block.label || '').filter(Boolean).join('\n\n')
    assert.equal(text, context.languages[language].fullText)
  }
}
const sourceFirst = read(path.join(evidence, 'source-first.json'))
const displayFile = fs.readdirSync(evidence).find(name => name.startsWith('D156-display-') && name.endsWith('.receipt.json'))
const display = read(path.join(evidence, displayFile))
assert.equal(display.status, 'pass')
assert.equal(display.browserClosed, true)
const imagePaths = [
  { figure: 'fig-13', kind: 'original-source', path: contexts[0].sourceImage.path },
  { figure: 'fig-14', kind: 'original-source', path: contexts[1].sourceImage.path },
  { figure: 'fig-13', kind: 'source-2x-inspection', path: path.join(outputRoot, 'fig-13/source-inspection-2x.png') },
  { figure: 'fig-13', kind: 'initial-native-preview', path: path.join(outputRoot, 'fig-13/fig-13.preview.png') },
  { figure: 'fig-13', kind: 'single-repair-native-preview', path: path.join(outputRoot, 'fig-13/fig-13.repair-01.preview.png') },
  { figure: 'fig-13', kind: 'desktop-640px-media', path: path.join(outputRoot, 'fig-13/fig-13.repair-01.desktop.png') },
  { figure: 'fig-13', kind: 'mobile-scroll-start', path: path.join(outputRoot, 'fig-13/fig-13.repair-01.mobile.png') },
  { figure: 'fig-13', kind: 'mobile-scroll-end', path: path.join(outputRoot, 'fig-13/fig-13.repair-01.mobile-scroll-end.png') }
]
const actualImageOpens = imagePaths.map((image, index) => ({ ordinal: index + 1, tool: 'functions.view_image', figure: image.figure, kind: image.kind, ...binding(image.path) }))
const inputs = [...currentInputs.values()]
function allFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(directory, entry.name)
    return entry.isDirectory() ? allFiles(file) : [file]
  }).sort()
}
const outputFiles = allFiles(outputRoot).map(binding)
const evidenceFiles = allFiles(evidence).filter(file => !currentInputs.has(file)).map(binding)
const receipts = evidenceFiles.filter(item => item.path.endsWith('.receipt.json'))
const initialRender = read(path.join(outputRoot, 'fig-13/fig-13.render.json'))
const currentRender = read(path.join(outputRoot, 'fig-13/fig-13.repair-01.render.json'))
for (const render of [initialRender, currentRender]) {
  assert.equal(hash(path.resolve(cwd, render.spec.path)), render.spec.sha256)
  assert.equal(hash(path.resolve(cwd, render.output.svg.path)), render.output.svg.sha256)
}
const thirteen = {
  figure: 'fig-13', status: 'HOLD_SOURCE_OCCLUSION_REPAIR_EXHAUSTED', mode: 'deterministic',
  source: contexts[0].sourceImage, durableSource: contexts[0].durableSourceImage,
  inventory: binding(path.join(evidence, 'fig-13.inventory.json')),
  sourceFirst: binding(path.join(evidence, 'source-first.json')),
  selectedPaths: [], selectedOutputs: [], selectedSpec: null,
  retainedRejectedCandidate: {
    spec: binding(path.join(outputRoot, 'fig-13/fig-13.repair-01.spec.json')),
    svg: binding(path.join(outputRoot, 'fig-13/fig-13.repair-01.svg')),
    render: binding(path.join(outputRoot, 'fig-13/fig-13.repair-01.render.json')),
    preview: binding(path.join(outputRoot, 'fig-13/fig-13.repair-01.preview.png'))
  },
  initialCandidate: {
    spec: binding(path.join(outputRoot, 'fig-13/fig-13.spec.json')),
    svg: binding(path.join(outputRoot, 'fig-13/fig-13.svg')),
    render: binding(path.join(outputRoot, 'fig-13/fig-13.render.json')),
    preview: binding(path.join(outputRoot, 'fig-13/fig-13.preview.png'))
  },
  authorCheck: binding(path.join(evidence, 'fig-13.final-author-check.json')),
  repairs: { used: 1, maximum: 1, remaining: 0 },
  failures: ['D156-F13-01', 'D156-F13-02'],
  nativeValidationCalls: 2, nativeRenderCalls: 2,
  nativeStatuses: { initialValidation: 'pass', initialRender: initialRender.status, repairedValidation: 'pass', repairedRender: currentRender.status },
  authorVisualStatus: 'fail', actualImageOpens: 7,
  display: { purpose: 'instructional', layout: 'scroll', widths: [640], minTextPx: 16 },
  measuredMinimumTextPx: currentRender.displayChecks[0].measuredMinPx,
  inventoryCounts: { sites: 17, connectionsWithConnects: 42, unmarkedMiddleJunctions: 7 },
  sourceCountIndependentApproval: false
}
const fourteen = {
  figure: 'fig-14', status: 'HOLD_APPROVAL_GENERATION_NOT_AUTHORIZED', mode: 'generated',
  source: contexts[1].sourceImage, durableSource: contexts[1].durableSourceImage,
  inventory: binding(path.join(evidence, 'source-first.json')),
  modeHold: binding(path.join(outputRoot, 'fig-14/fig-14.mode-hold.json')),
  selectedPaths: [], selectedOutputs: [], selectedSpec: null,
  reason: sourceFirst.figures['fig-14'].reason,
  repairs: { used: 0, maximum: 1, remaining: 1 },
  failures: [], actualImageOpens: 1,
  nativeValidationCalls: 0, nativeRenderCalls: 0, generationCalls: 0,
  display: { purpose: 'instructional', layout: 'scroll', widths: [640], minTextPx: 16 },
  approvalRequired: 'Semantic artwork generation for the actual multi-crystal cluster; no request for an invented regular solid.'
}
const counters = {
  actualImageOpens: 8, actualContextImageOpens: 8, maximumBatchImageOpens: 8, maximumContextImageOpens: 24,
  viewImageCalls: 9, failedViewImageCallsWithoutImageLoaded: 1, parentImageOpens: 0,
  contentRepairs: 1, technicalRecoveries: 3,
  nativeContextCallsByD156: 0, nativeValidationCalls: 4, nativeRenderCalls: 2,
  nativeRecordReviewCalls: 0, nativeFinalizers: 0, paidCalls: 0, generationCalls: 0,
  sourcePageReviewsReplayed: 0, textReviewsReplayed: 0, checkerReviewsReplayed: 0,
  databaseCalls: 0, publisherCalls: 0, canonicalPromotions: 0,
  originalTasks: 0, completeCoursesAdded: 0, courseCount: 0,
  peerMessages: 0, supervisorMessages: 0, commits: 0, pushes: 0, merges: 0, deployments: 0, closures: 0, modelOverrides: 0
}
const reportPath = path.join(evidence, 'report.json')
const authorFreezePath = path.join(evidence, 'author-freeze.json')
write(reportPath, {
  schema: 'STEMROBIN-181/D156-author-report@1', batch: 'D156', ticket: 'STEMROBIN-181',
  book: '9p', lesson: 'phy9-c1-s1-n9', role: 'bounded first author',
  finish: 'review', grill: 'self', sameAuthorizedInvocation: true,
  createdAt: new Date().toISOString(), status: 'AUTHOR_COMPLETE_WITH_HOLDS',
  inputFreeze: binding(freezePath), inputsVerifiedCurrent: true, immutableBindingsUnchanged: true,
  completeApprovedZHENText: 'Both figure contexts match full approved edition blocks and fullText, not the caption-only native near-text context.',
  sourceFirstOriginalsOpenedBeforeDraftOrReuse: true,
  figures: [thirteen, fourteen], counters, actualImageOpenLedger: actualImageOpens,
  technicalFailures: [...sourceFirst.technicalFailures, read(path.join(evidence, 'D156-T03.preflight-failure.receipt.json'))],
  preservedContentFailures: [
    binding(path.join(evidence, 'fig-13.first-visual-failure.json')),
    binding(path.join(evidence, 'fig-13.final-author-check.json'))
  ],
  displayReceipt: binding(path.join(evidence, displayFile)),
  displayScreenshotsActuallyInspected: true, browserClosed: true,
  nativeRendererBrowsersClosed: 'Each successful native render exits through its existing finally browser.close().',
  currentInputHashes: inputs, currentOutputHashes: outputFiles,
  currentEvidenceHashes: evidenceFiles, runNativeReceipts: receipts,
  independentApproval: false, promotableFigures: [], retainedSelectedPaths: [],
  authorFreezePath,
  scope: 'Only D156 evidence and fig-13/fig-14 output directories written. Shared root/work, original inputs, carriers and templates unmodified.',
  otherOwners: 'D153 fig11/12, D149 fig6/7 retained HOLD, D151 fig8/9 retained HOLD and D154 fig8/9 independent source-count review untouched; no messages or replays.',
  limitations: [
    'Fig13 native mathematical/layout checks pass but author semantic visual check fails after its one allowed repair. No selected valid output.',
    'Fig14 is a natural faceted crystal cluster, not a measured regular solid; semantic artwork generation is not authorized.',
    'Artifact headless display checks do not substitute for independent review or assembled lesson/product acceptance.',
    'No physical 3D measurements inferred from either source projection. No additional images may be opened in this bounded batch.'
  ]
})
write(authorFreezePath, {
  schema: 'STEMROBIN-181/D156-author-freeze@1', batch: 'D156', ticket: 'STEMROBIN-181',
  createdAt: new Date().toISOString(), status: 'AUTHOR_COMPLETE_WITH_HOLDS',
  immutableInputFreeze: binding(freezePath), report: binding(reportPath),
  figures: [thirteen, fourteen], selectedPaths: [], promotableFigures: [],
  currentInputHashes: inputs, currentOutputHashes: outputFiles,
  currentEvidenceHashes: evidenceFiles, actualImageOpenLedger: actualImageOpens,
  counters, browserClosed: true, independentApproval: false,
  contentRepairBudgetExhaustedFor: ['fig-13'],
  hashConvention: 'This freeze binds report and existing inputs/outputs/evidence. Its own SHA256 is returned from the actual file after writing; self-hashing and circular report/freeze hashes are intentionally not fabricated.'
})
console.log(JSON.stringify({ status: 'AUTHOR_COMPLETE_WITH_HOLDS', report: binding(reportPath), authorFreeze: binding(authorFreezePath), figures: [thirteen.status, fourteen.status], counters, verifiedInputCount: inputs.length }))
