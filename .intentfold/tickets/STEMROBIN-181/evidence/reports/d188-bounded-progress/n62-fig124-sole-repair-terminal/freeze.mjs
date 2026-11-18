import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const out = path.dirname(fileURLToPath(import.meta.url))
const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'))
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const bind = p => ({ path: p, sha256: hash(p), bytes: fs.statSync(p).size })
const file = name => path.resolve(out, name)
const write = (name, value) => {
  const p = file(name)
  assert(p.startsWith(`${out}/`))
  fs.writeFileSync(p, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
  return bind(p)
}
const request = read(file('request.json'))
assert.equal(path.resolve(repo, request.writeDirectory), out)
const priorPath = path.resolve(repo, request.priorAuthor)
const prior = read(priorPath)
const old = prior.figures.find(f => f.id === 'fig-124')
const source = path.resolve(repo, request.source.path)
const stem = 'fig-124.repaired'
const currentSpec = file(`${stem}.spec.json`)
const currentSVG = file(`${stem}.svg`)
const currentRender = file(`${stem}.render.json`)
const currentInventory = file(`${stem}.source.inventory.json`)
const contextPath = path.resolve(repo, request.authoritativeContext)
const crop = path.resolve(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d112-n62-source-geometry-review/fig-124-racks-support-crop.png')
const nativePreview = file(`${stem}.preview-native-960.png`)
const scrollPreview = file(`${stem}.preview-scroll-640.png`)
const before = read(file('inputs-before.json'))
const comparisons = before.files.map(f => ({
  path: f.path, beforeSha256: f.sha256, after: bind(f.path), unchanged: hash(f.path) === f.sha256,
}))
assert(comparisons.every(f => f.unchanged), 'A protected input changed; do not freeze a preservation claim')
assert.equal(hash(source), request.source.sha256)
const spec = read(currentSpec)
const originalSpec = read(old.spec.path)
assert.deepEqual(spec.source.authoritativeText, read(contextPath).authoritativeText)
assert.deepEqual(spec.source.authoritativeText, originalSpec.source.authoritativeText)
assert(!spec.objects.some(o => o.id === 'central-foreground-occlusion'))
const removed = new Set(read(currentInventory).removedObjects)
for (const o of originalSpec.objects.filter(o => !removed.has(o.id))) {
  assert.deepEqual(spec.objects.find(n => n.id === o.id), o)
}
const render = read(currentRender)
assert.equal(render.spec.sha256, hash(currentSpec))
assert.equal(render.output.svg.sha256, hash(currentSVG))
assert.equal(render.status, 'pass')
const commands = ['build', 'draft', 'render', 'preview640'].map(action => {
  const receiptPath = file(`${action}.receipt.json`)
  const receipt = read(receiptPath)
  assert.equal(receipt.exitCode, 0)
  for (const output of receipt.outputs) assert.equal(hash(output.path), output.sha256)
  return {
    action, receipt: bind(receiptPath), command: receipt.command,
    cwd: receipt.cwd || repo, exitCode: receipt.exitCode,
    signal: receipt.signal ?? null, error: receipt.error ?? null,
    startedAt: receipt.startedAt, finishedAt: receipt.finishedAt,
    localRepairNumber: 1, sourceFidelityOrIndependentPASS: false,
  }
})
const dimensions = p => {
  const data = fs.readFileSync(p)
  assert.equal(data.subarray(1, 4).toString(), 'PNG')
  return [data.readUInt32BE(16), data.readUInt32BE(20)]
}
const imagePaths = [source, old.previews.scroll640.path, crop, nativePreview, scrollPreview]
const kinds = ['original-source-PNG', 'prior-first-FAIL-640-preview', 'sole-necessary-source-detail',
  'repaired-native-960-full-preview', 'repaired-scroll-640-full-preview']
const opens = imagePaths.map((p, i) => ({
  ...bind(p), kind: kinds[i], dimensionsPx: dimensions(p),
  opened: true, actualOpenTool: 'functions.view_image', detail: 'original',
  batchOrdinal: i + 1, contextOrdinal: i + 1,
}))
assert.deepEqual(dimensions(nativePreview), [960, 760])
assert.deepEqual(dimensions(scrollPreview), [640, 506])
const ledger = write('image-ledger.json', {
  schema: 'STEMROBIN-181/sole-repair-image-ledger@1',
  ticket: request.ticket, batch: request.batch, card: request.card,
  freshContext: true, forkContext: false, entryContextImageCount: 0,
  opens, imagesOpened: 5, batchImageCount: 5, contextImageCount: 5,
  originalSourceOpens: 1, priorFailedPreviewOpens: 1, necessarySourceDetailOpens: 1,
  repairedFullPreviewOpens: 2, repairedPreviewDimensionsPx: [[960, 760], [640, 506]],
  additionalCropCreated: false,
  sourceDetailReused: { ...bind(crop), originalBoxLTRBExclusive: [14, 12, 543, 376],
    scale: 2, method: 'Prior Pillow NEAREST crop; no new cleaning, thresholding or line completion' },
  limits: { newImages: 5, batch: 8, context: 24 },
  noMoreImagesAllowedByThisRequest: true, compactionReset: false,
  returnImages: false, parentOpens: 0, imagesReturnedToParent: 0,
})
const integrity = write('integrity.json', {
  schema: 'STEMROBIN-181/sole-repair-integrity@1',
  protectedFileCount: comparisons.length, comparisons,
  allProtectedInputsUnchanged: true,
  retainedSpecObjectsEqual: true, authoritativeTextEqual: true,
  sourceSha256MatchesRequest: true, originalFailedOutputOverwritten: false,
  sourceSpecRenderOutputBindingsMatch: true,
  measurementScope: 'Prior-freeze bindings and listed inputs only; no Git or whole-repository inspection',
})
const findings = [
  {
    id: 'd182-fig124-visible-mesh-still-incomplete',
    status: 'FAIL',
    priorFinding: 'd119-fig124-visible-mesh-incomplete',
    observedAtWidthsPx: [960, 640],
    observation: 'Both repaired previews show longer open curves and local far-edge oblique strokes, but the inclined face remains a sparse comb/zigzag rather than the source-visible crossing mesh. Several curves have isolated inner tips, and sizeable source-visible open-cell regions have no corresponding crossing strokes. This one repair does not restore the instructional structure.',
    pathsAreNotApprovedSourceFidelity: true,
    consequence: 'Second visual result fails; terminal HOLD with no further local repair.',
  },
  {
    id: 'd182-fig124-fabricated-plate-removed',
    status: 'LOCAL-DEFECT-REMOVED-NOT-FIGURE-PASS',
    priorFinding: 'd119-fig124-occlusion-looks-like-solid-plate',
    observation: 'The broad opaque central polygon is absent at both widths. Two narrow heavy pivot-region strokes do not read as a new solid panel.',
    limitation: 'Removing the invented plate reveals an empty lower-central rack/support region; this is not evidence that the source-visible foreground has been reconstructed.',
  },
  {
    id: 'd182-fig124-visible-path-correspondence-unresolved',
    status: 'HOLD',
    priorFinding: 'd119-fig124-visible-bracing-path-correspondence',
    observation: 'The sole source-detail open supports localized line families and nine curved neighborhoods, not the complete path mapping attempted by the drawing. The implemented approximate zigzag/curve endpoints are unapproved author localization. Dense central-front visible ink and terminal/local mesh details remain unresolved and omitted. The lower rack has a large blank area and visibly isolated strokes where the source has overlapping structure.',
    hiddenGeometryReconstructionRequired: false,
    notRequired: ['Concealed cells or ribs', 'Exact whole-face counts', 'All-member engineering graph', 'Unprinted dimensions', 'Invisible pivot mechanism'],
    consequence: 'Preserve genuine source uncertainty; do not reinterpret a native pass as a visual or semantic pass.',
  },
]
const report = write('report.json', {
  schema: 'STEMROBIN-181/modern-figure-author-report@1',
  ticket: request.ticket, batch: request.batch, card: request.card,
  role: request.role, status: 'AUTHOR-TERMINAL-HOLD-AFTER-SOLE-LOCAL-REPAIR',
  scope: 'Only fig124 first failed candidate local FigureSpec repair; no permanent A-D production role',
  request: bind(file('request.json')), priorAuthor: bind(priorPath),
  priorFindings: bind(path.resolve(repo, request.priorFindings)),
  authoritativeContext: bind(contextPath),
  sourceGeometryReview: bind(path.resolve(repo, request.sourceGeometryReview)),
  source: bind(source), inventory: bind(currentInventory),
  spec: bind(currentSpec), svg: bind(currentSVG), render: bind(currentRender),
  previews: { native960: opens[3], scroll640: opens[4] },
  authorVisual: 'SECOND-RESULT-FAIL',
  nativeStatus: 'PASS-MECHANICAL-ONLY',
  nativeRender: { status: render.status, objects: render.objects, labels: render.labels,
    collisions: render.collisions, displayChecks: render.displayChecks },
  findings, commands,
  initCommand: { command: [process.execPath, file('repair.mjs'), 'init'],
    exitCode: 0, observedToolExit: true, output: bind(file('inputs-before.json')) },
  repairUsage: { previousLocalRepairs: 0, additionalLocalRepairsUsed: 1,
    totalLocalRepairsUsed: 1, maximumAdditionalLocalRepairs: 1,
    remainingLocalRepairs: 0, nativeRenderInvocations: 1,
    disposition: 'terminal-HOLD-no-further-repair', secondSpecEditOrRenderPerformed: false },
  imageAccounting: { freshContext: true, forkContext: false,
    entryCumulative: 0, imagesOpened: 5, batchCumulative: 5, contextCumulative: 5,
    sourcePNG: 1, old640Preview: 1, necessarySourceDetail: 1, repairedFullPreviews: 2,
    imageLedger: ledger, newImageMaximum: 5, batchMaximum: 8, contextMaximum: 24,
    compactionReset: false, returnImages: false },
  preservation: { allPriorFreezeBindingsUnchanged: true, protectedFileCount: comparisons.length,
    originalSourceUnchanged: true, oldFig124FAILAndHOLDBindingsUnchanged: true,
    fig123CandidateAndReviewBindingsUnchanged: true, frozenTextBindingsUnchanged: true,
    retainedSpecObjectValuesUnchanged: true, integrity,
    wholeRepositoryByteSnapshotNotPerformed: true },
  reviewAt1Written: false, independentPASSIssued: false,
  sourceObservationIsModernPASS: false, promotable: false, wholeCardApproval: false,
  promotionOrPublicationPerformed: false, newExercises: 0,
  fig123OrTextReviewReplayPerformed: false, t16WorkPerformed: false,
  newPermanentWorkers: 0, nestedAgents: 0, newBranches: 0, newWorktrees: 0,
  paidCalls: 0, newEngines: 0, newDependencies: 0,
  meterIndexGitDBDeploymentOperations: 0,
  prohibitedOperationsPerformed: [],
  authorConclusion: 'One local attempt is exhausted. The opaque-plate defect is removed, but visible source structure still fails. Preserve the first FAIL and all prior HOLD bytes; freeze this failed second candidate as terminal HOLD. No repair or image reopen is authorized by this request.',
})
const authorFreeze = write('author-freeze.json', {
  schema: 'STEMROBIN-181/modern-figure-author-freeze@1',
  ticket: request.ticket, batch: request.batch, card: request.card,
  role: request.role, writableScope: out,
  status: 'AUTHOR-TERMINAL-HOLD-AFTER-SOLE-LOCAL-REPAIR',
  request: bind(file('request.json')), priorAuthor: bind(priorPath),
  priorFindings: bind(path.resolve(repo, request.priorFindings)),
  context: bind(contextPath), sourceGeometryReview: bind(path.resolve(repo, request.sourceGeometryReview)),
  figures: [{
    id: 'fig-124', role: request.role, status: 'AUTHOR-TERMINAL-HOLD',
    source: bind(source), spec: bind(currentSpec), sourceInventory: bind(currentInventory),
    outputs: { svg: bind(currentSVG) }, render: bind(currentRender),
    previews: { native960: opens[3], scroll640: opens[4] },
    nativeStatus: 'PASS-MECHANICAL-ONLY', authorVisual: 'SECOND-RESULT-FAIL',
    sourceFidelityConfirmed: false, independentReview: 'NOT-PASSED',
    localRepairsUsed: 1, allowedLocalRepairs: 1, remainingLocalRepairs: 0,
    terminalHOLD: true, furtherRepairAllowed: false, promotable: false,
    sourceRefs: old.sourceRefs,
  }],
  reusedFig123: {
    source: 'Existing parent-owned fig123 PASS is reused without reopen or replay',
    priorAuthorBinding: bind(priorPath),
    candidateSpec: old.id === 'fig-124' ? prior.figures.find(f => f.id === 'fig-123').spec : null,
    authorIssuedNewPASS: false, changed: false,
  },
  report, imageLedger: ledger, integrity,
  inputsBefore: bind(file('inputs-before.json')),
  commands, commandExitCodes: { init: 0, build: 0, draft: 0, render: 0, preview640: 0 },
  helperScripts: [bind(file('repair.mjs')), bind(file('freeze.mjs'))],
  imageCounts: { entryCumulative: 0, imagesOpened: 5, cumulative: 5,
    sourcePNG: 1, oldFailed640Preview: 1, necessarySourceDetail: 1, repairedPreviews: 2 },
  limits: { newImages: 5, batch: 8, context: 24 },
  firstFig124FAILPreserved: true, oldHOLDBytesPreserved: true,
  allProtectedInputsUnchanged: true, authoritativeTextModified: false,
  reviewAt1Written: false, independentPASSIssued: false,
  promotable: false, wholeCardApproval: false,
  imagesReturned: false, compactionReset: false,
  parentT16Touched: false, prohibitedOperationsPerformed: [],
})
console.log(JSON.stringify({
  status: 'AUTHOR-TERMINAL-HOLD-AFTER-SOLE-LOCAL-REPAIR',
  report, authorFreeze, spec: bind(currentSpec), svg: bind(currentSVG),
  render: bind(currentRender), imageCount: 5, protectedFilesUnchanged: comparisons.length,
  nativeCommandExits: commands.map(c => ({ action: c.action, exitCode: c.exitCode })),
}, null, 2))
