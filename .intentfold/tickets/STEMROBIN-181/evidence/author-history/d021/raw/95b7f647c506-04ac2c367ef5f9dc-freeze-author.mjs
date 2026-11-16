import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const own = path.dirname(fileURLToPath(import.meta.url))
const repo = path.resolve(own, '../../..')
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: path.relative(repo, file), sha256: hash(file), bytes: fs.statSync(file).size })
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const authority = read(path.join(own, 'authority-bindings.json'))
const observationsFile = path.join(own, 'author-observations.json')
const observations = read(observationsFile)
assert.equal(observations.loadedImageTotal, 8)
assert.equal(observations.repairCount, 0)
for (const binding of authority.tools) {
  assert.equal(hash(path.join(repo, binding.original.path)), binding.original.sha256)
  assert.equal(hash(path.join(repo, binding.snapshot.path)), binding.snapshot.sha256)
}
for (const source of Object.values(authority.sources)) {
  assert.equal(hash(path.join(repo, source.original.path)), source.original.sha256)
  assert.equal(hash(path.join(repo, source.snapshot.path)), source.snapshot.sha256)
}
const liveContextObservations = {}
for (const [key, entry] of Object.entries(authority.authority)) {
  for (const file of [entry.proseFreeze.snapshot, entry.authorBoundTemplate.snapshot, entry.exercises.snapshot]) {
    assert.equal(hash(path.join(repo, file.path)), file.sha256)
  }
  const current = read(path.join(repo, entry.activeAtAuthorStart.path))
  liveContextObservations[key] = {
    activeTemplateAtFreeze: bind(path.join(repo, entry.activeAtAuthorStart.path)),
    fullProseUnchanged: JSON.stringify(current.prose) === JSON.stringify(entry.fullProse),
    authorBoundSnapshotRetained: entry.authorBoundTemplate.snapshot,
    rule: 'The full author-bound snapshot is authoritative for these figures. Any later SCI prose change requires an affected-context review; unrelated shared-display metadata need not change text.',
  }
}
const figures = []
for (const id of ['fig-158', 'fig-159']) {
  const out = path.join(own, id, 'initial')
  const specFile = path.join(out, 'spec.json')
  const renderFile = path.join(out, 'render.json')
  const svgFile = path.join(out, `${id}.svg`)
  const spec = read(specFile)
  const render = read(renderFile)
  const context = read(path.join(own, id, 'context.json'))
  const previewFile = path.join(out, 'width-previews.json')
  const previews = read(previewFile)
  const nativeCallsFile = path.join(out, 'native-calls.json')
  const nativeCalls = read(nativeCallsFile)
  assert.equal(read(path.join(own, id, 'context-call.json')).status, 'pass')
  assert.equal(nativeCalls.status, 'pass')
  assert.equal(read(path.join(out, 'draft-validation.json')).status, 'pass')
  assert.equal(read(path.join(out, 'rendered-validation.json')).status, 'pass')
  assert.equal(render.status, 'pass')
  assert.equal(render.spec.sha256, hash(specFile))
  assert.equal(render.output.svg.sha256, hash(svgFile))
  assert.equal(previews.status, 'pass')
  assert.deepEqual(spec.source.authoritativeText, context.authoritativeText)
  assert.deepEqual(spec.source.authoritativeText, id === 'fig-158'
    ? [...authority.authority.n80.authoritativeText, ...authority.authority.n83.authoritativeText]
    : authority.authority.n83.authoritativeText)
  const observation = observations.figures[id]
  assert.ok(['pass', 'fail'].includes(observation.status))
  const inspected = previews.checks.map(check => {
    const entry = observation.previews.find(preview => preview.widthPx === check.widthPx)
    assert.equal(entry.loads, 1)
    assert.equal(entry.status, observation.status)
    assert.equal(entry.sha256, check.preview.sha256)
    assert.equal(hash(path.join(repo, check.preview.path)), check.preview.sha256)
    return { ...check.preview, widthPx: check.widthPx, dimensionsPx: check.dimensionsPx, authorInspection: entry, actualFontMinPx: check.metrics.labels.length ? Math.min(...check.metrics.labels.map(label => label.actualFontPx)) : null }
  })
  figures.push({
    id, authorStatus: observation.status, independentApproval: 'not performed',
    bindings: {
      originalSource: authority.sources[id].original, exactSourceSnapshot: authority.sources[id].snapshot,
      fullContext: bind(path.join(own, id, 'context.json')),
      nativeContext: bind(path.join(own, id, 'context.native.json')),
      nativeContextCall: bind(path.join(own, id, 'context-call.json')),
      spec: bind(specFile), geometry: bind(path.join(out, 'geometry.json')),
      svg: bind(svgFile), render: bind(renderFile),
      draftValidation: bind(path.join(out, 'draft-validation.json')),
      renderedValidation: bind(path.join(out, 'rendered-validation.json')),
      nativeCalls: bind(nativeCallsFile), widthPreviewEvidence: bind(previewFile),
    },
    completeTextContext: spec.source.authoritativeText,
    sourceInventoryMaps: spec.source.inventory,
    nativeCalls: { contextBuilder: 1, explicitDraftValidation: 1, internalRendererDraftValidation: 1, nativeRender: 1, explicitRenderedValidation: 1, widthPreviewHarness: 1 },
    previews: inspected,
    authorObservations: observation,
    initialFailures: observation.initialFailures, repairHistory: observation.repairHistory,
    remainingAuthorIssues: observation.remainingAuthorIssues, targetedRepairCount: 0, repairLimit: 1,
  })
}
const walk = directory => fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
  const file = path.join(directory, entry.name)
  if (entry.isDirectory()) return walk(file)
  if (entry.isSymbolicLink()) return []
  if (entry.name === 'author-freeze.json') return []
  return [bind(file)]
})
const freeze = {
  schema: 'ld-s10y-image/author-freeze@1', ticket: 'STEMROBIN-181', batch: 'D021',
  lesson: 'phy9-c2-s2-n83', sharedLesson: 'phy9-c2-s2-n80',
  figures: ['fig-158', 'fig-159'], stage: 'figure-author',
  status: figures.every(item => item.authorStatus === 'pass') ? 'pass' : 'fail',
  role: 'source-inventory and deterministic author only',
  scope: 'Scratch-only author validation, native render, exact source/full prose snapshot binding and all six width-preview observations. This is NOT independent mathematical/cultural approval, SCI, promotion or product acceptance.',
  ownedRoot: own,
  bindings: {
    authority: bind(path.join(own, 'authority-bindings.json')),
    sourceInventory: bind(path.join(own, 'source-inventory.json')),
    authorObservations: bind(observationsFile),
    fullCorrectedN80: authority.authority.n80,
    fullAuthorBoundN83: authority.authority.n83,
  },
  sourceAndToolPreservation: 'Original PNG and shared builder/validator/renderer/contracts match captured hashes. Exact source, template and prose freeze bytes are copied under owned inputs; no source or template writes.',
  liveContextObservations,
  figureResults: figures,
  authorToolBindings: ['prepare.mjs', 'author.mjs', 'native-author-run.mjs', 'width-previews.mjs', 'freeze-author.mjs'].map(name => bind(path.join(own, name))),
  imageLedger: {
    originalLoads: 2, originalReopens: 0, crops: 0, previewLoads: 6,
    currentContextLoadedImageTotal: 8, batchMaximum: 8, lifetimeLoadedImageMaximum: 24,
    failedPathAttemptsWithoutPayload: 2, viewImageCallAttempts: 10,
    allEightLoadedImagesInspectedOnce: true, remainingImageAllowance: 0,
    meaning: 'The two ENOENT calls loaded no images; image budgets count actual image-bearing context loads.',
  },
  repairCount: 0, repairLimitPerFigure: 1, repairHistory: [],
  browserPolicy: { isolatedHeadless: true, allClosed: true, userWindow: false, userProfile: false, CDP: false, systemInput: false, PWDEBUGUnset: true, htmlAutoOpen: 'never' },
  independentModernGateRequired: true,
  independentReviewStatus: 'not performed by author',
  remainingAuthorIssues: figures.flatMap(item => item.remainingAuthorIssues.map(issue => ({ figure: item.id, ...issue }))),
  pendingHandoff: [
    'fig-159 is BLOCKED by an observed vector-accent missing-glyph box at all widths. No author pass or promotion.',
    'Fresh bounded author context may perform the one still-unused targeted local label repair; this context is exhausted and must not reopen or rerender.',
    'Fresh independent reviewer must inspect the exact resulting hashes; fig-158 author pass is not independent approval.',
    'If n83 SCI changes prose, retain this snapshot and rebind only affected context.',
    'Main owns shared n80 figure-display metadata; not written here'
  ],
  prohibitedOperationsPerformed: [],
  noPromotionNoRecordReviewNoSCIWriteNoTemplateWriteNoSourceWriteNoDBNoGitNoFullChecks: true,
  frozenFiles: walk(own),
}
fs.writeFileSync(path.join(own, 'author-freeze.json'), `${JSON.stringify(freeze, null, 2)}\n`, { flag: 'wx' })
console.log(JSON.stringify({
  status: freeze.status, freeze: bind(path.join(own, 'author-freeze.json')),
  figureStatuses: Object.fromEntries(figures.map(item => [item.id, item.authorStatus])),
  repairs: 0, loadedImages: 8, failedPathAttemptsWithoutPayload: 2,
  independentApproval: 'not performed', liveProseUnchanged: Object.fromEntries(Object.entries(liveContextObservations).map(([key, item]) => [key, item.fullProseUnchanged])),
}))
