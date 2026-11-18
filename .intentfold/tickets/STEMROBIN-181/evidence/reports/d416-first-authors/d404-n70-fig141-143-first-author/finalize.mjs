import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const own = path.dirname(fileURLToPath(import.meta.url))
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: file, sha256: hash(file), bytes: fs.statSync(file).size })
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const local = name => path.join(own, name)
const write = (name, value) => {
  const file = local(name)
  assert.ok(file.startsWith(`${own}/`))
  assert.ok(!fs.existsSync(file), 'Freeze is one-shot')
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
}
const files = directory => fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
  const file = path.join(directory, entry.name)
  return entry.isDirectory() ? files(file) : [file]
}).sort()
assert.ok(!fs.existsSync(local('author-freeze.json')))
const inputs = read(local('inputs.json'))
for (const record of inputs.records) {
  assert.equal(hash(record.original.path), record.original.sha256, 'Inputs must remain unchanged')
  assert.equal(hash(record.retained.path), record.retained.sha256, 'Retained input drift')
}
const observations = read(local('source-observations.json'))
const previewReport = read(local('preview-report.json'))
assert.deepEqual(previewReport.rows.map(row => [row.figure, row.width]), [
  ['fig-143', 640], ['fig-143', 331], ['fig-143', 342]
])
const initialOpens = read(local('actual-opens.json'))
assert.equal(initialOpens.count, 3)
fs.copyFileSync(local('actual-opens.json'), local('initial-actual-opens.json'), fs.constants.COPYFILE_EXCL)
const observedPreviews = previewReport.rows.map(row => ({
  ...row.png,
  actualOpenCount: 1,
  width: row.width,
  observation: 'Full PNG observed once with view_image; six incident right arrows, six reflected left arrows, shared central axis, O/F/P, mirror/backing, scope and not-to-scale labels visible. No crop or reopen.'
}))
const opens = {
  ...initialOpens,
  count: 6,
  batches: [
    ...initialOpens.batches,
    { batch: 2, purpose: 'final-PASS-author-width-previews', count: 3, files: observedPreviews }
  ],
  sourcesOpenedOnce: 3,
  finalWidthPNGsOpenedOnce: 3,
  imagePayloadReturnedToParent: false
}
fs.writeFileSync(local('actual-opens.json'), `${JSON.stringify(opens, null, 2)}\n`)
write('producer-observations.json', {
  schema: 'd404/producer-observations@1',
  status: 'AUTHOR_ONLY',
  inspected: observedPreviews,
  originalComparisons: {
    'fig-143': 'Author observation only: all seven incoming levels, six reflected paths and both sets of six arrows retained in one frame. O/F/P order retained. No focal-plane trace or dashed ray imported. Explicit paraxial and not-to-scale scope prevents a universal exact-focusing claim.',
    'fig-141': 'Not opened as rendered PNG because the sole repaired render still failed; terminal HOLD.',
    'fig-142': 'No rendered output: unresolved source details are explicit blocking inventory entries, not fabricated facts.'
  },
  noIndependentSCI: true,
  noIndependentFIG: true,
  noProductDISPLAY: true,
  fullCardStatus: 'HOLD'
})

const figureReports = ['fig-141', 'fig-142', 'fig-143'].map(id => {
  const dir = local(id)
  const initialSpec = local(`${id}/initial.spec.json`)
  const repairSpec = local(`${id}/repair.spec.json`)
  const repaired = fs.existsSync(repairSpec)
  const finalSpecPath = repaired ? repairSpec : initialSpec
  const renderPath = local(`${id}/${repaired ? 'repair' : 'initial'}.render.json`)
  const svgPath = local(`${id}/${repaired ? 'repair' : 'initial'}.svg`)
  const nativeReceipts = files(local('native')).filter(file => path.basename(file).startsWith(`${id}-`))
  const receipts = nativeReceipts.map(file => ({ ...bind(file), ...read(file) }))
  const firstDraft = receipts.find(receipt => receipt.name.endsWith('initial-draft'))
  const firstRender = receipts.find(receipt => receipt.name.endsWith('initial-render'))
  const render = fs.existsSync(renderPath) ? read(renderPath) : null
  const firstRenderReport = local(`${id}/initial.render.json`)
  const firstCollisions = fs.existsSync(firstRenderReport) ? read(firstRenderReport).collisions : []
  const authorOutcome = id === 'fig-143' ? 'RENDERED_AUTHOR_CANDIDATE' : 'HOLD'
  const contextRecord = inputs.records.find(record => record.original.path.endsWith(`/${id}.context.json`))
  const context = read(contextRecord.retained.path)
  const finalSpec = read(finalSpecPath)
  assert.deepEqual(finalSpec.source.authoritativeText, context.lessons.flatMap(lesson =>
    lesson.prose.flatMap(block => block.nearbyText.map(text => ({ lesson: lesson.lesson, text })))))
  assert.equal(finalSpec.source.image.path, context.sourceImage.path)
  assert.equal(finalSpec.source.image.sha256, context.sourceImage.sha256)
  assert.deepEqual(finalSpec.display.widths, [640, 331, 342])
  assert.equal(finalSpec.display.purpose, 'instructional')
  assert.equal(finalSpec.display.minTextPx, 16)
  if (render) {
    assert.equal(hash(finalSpecPath), render.spec.sha256)
    assert.equal(hash(svgPath), render.output.svg.sha256)
  }
  const sourceObservation = observations.figures.find(figure => figure.id === id)
  return {
    figure: id,
    status: 'AUTHOR_ONLY',
    authorOutcome,
    independentFIG: 'HOLD',
    DISPLAY: 'HOLD',
    card: 'HOLD',
    sourceContext: contextRecord,
    sourceImage: finalSpec.source.image,
    sourceInventory: finalSpec.source.inventory,
    originalPixelFacts: sourceObservation,
    modernTranslationsAndClarifications: sourceObservation.modernChanges,
    initialSpec: bind(initialSpec),
    finalSpec: bind(finalSpecPath),
    ...(repaired ? { soleRepair: bind(local(`${id}/repair.json`)) } : {}),
    render: render ? bind(renderPath) : null,
    SVG: fs.existsSync(svgPath) ? bind(svgPath) : null,
    nativeReceipts: nativeReceipts.map(bind),
    previewBindings: previewReport.rows.filter(row => row.figure === id),
    counters: {
      standaloneInitialDraftValidations: 1,
      standaloneRepairDraftValidations: repaired ? 1 : 0,
      rendererInvocations: repaired ? 2 : 1,
      successfulRendererResults: id === 'fig-143' ? 1 : 0,
      renderBrowserLaunches: id === 'fig-142' ? 0 : 2,
      soleSpecRepairs: repaired ? 1 : 0,
      repairLimit: 1,
      nativeRendererInternalDraftPreflights: repaired ? 2 : 1,
      previewPNGs: previewReport.rows.filter(row => row.figure === id).length,
      sourcePNGOpens: 1,
      widthPNGOpens: id === 'fig-143' ? 3 : 0,
      reopens: 0,
      crops: 0
    },
    firstFailure: {
      stage: firstDraft.exitCode !== 0 ? 'draft' : 'render',
      receipt: bind(firstDraft.exitCode !== 0 ? nativeReceipts.find(file => read(file).name === firstDraft.name) : nativeReceipts.find(file => read(file).name === firstRender.name)),
      initialDraftExitCode: firstDraft.exitCode,
      initialRenderExitCode: firstRender.exitCode,
      initialCollisions: firstCollisions,
      preserved: true
    },
    finalRendererStatus: render?.status ?? 'not-rendered-preflight-failed',
    terminalReason: id === 'fig-141'
      ? 'Second renderer result FAIL after the sole targeted repair: s141-half-R-text-label R/2 still collides with a geometry stroke. No second repair; failed SVG and receipts retained without author preview or promotion.'
      : id === 'fig-142'
        ? 'Original raster does not permit complete independent trace/fitting inventory. The draft and renderer preflight truthfully FAIL on required unresolved source content. No geometry/artwork fabricated, no repair attempted because a spec repair cannot supply missing source facts.'
        : 'Native draft/render and three measured headless widths PASS after one label repair; only an author candidate. Independent FIG review and native lesson/product DISPLAY acceptance have not run.',
    allFiles: files(dir).map(bind)
  }
})

const plannedFiles = [...files(own), local('report.json'), local('author-freeze.json')].sort()
write('report.json', {
  schema: 'd404/finite-first-figure-author-report@1',
  ticket: 'STEMROBIN-181',
  card: 'phy10-c2-s2-n70',
  book: '10p',
  scope: ['fig-141', 'fig-142', 'fig-143'],
  status: 'AUTHOR_ONLY',
  cardStatus: 'HOLD',
  independentFIG: 'HOLD',
  DISPLAY: 'HOLD',
  fullFIGPASS: false,
  SCIRepeated: false,
  ZHENRepeated: false,
  authority: inputs,
  figures: figureReports,
  actualOpens: bind(local('actual-opens.json')),
  cumulativeImageCount: 6,
  parentPermanentImageCount: 24,
  parentNewImageOpens: 0,
  sourceObservations: bind(local('source-observations.json')),
  producerObservations: bind(local('producer-observations.json')),
  previews: bind(local('preview-report.json')),
  nativeCommands: files(local('native')).map(file => ({ receipt: bind(file), ...read(file) })),
  previewCommand: previewReport.command,
  browserBoundary: {
    owningLaunchersInspectedBeforeUse: true,
    isolatedHeadlessOnly: true,
    browserLaunches: 5,
    sourceImageOpensUsedNoBrowser: true,
    noPersistentProfile: true,
    noCDP: true,
    noHeaded: true,
    noCUA: true,
    noBringToFront: true,
    noOSInput: true,
    allOwnedBrowsersClosed: true,
    sourceImagesCopiedNotReopened: true
  },
  prohibitionsObserved: {
    writesOutsideOwn: 0,
    permanentWorkers: 0,
    descendantAgentsOrChats: 0,
    newWorktrees: 0,
    newBranches: 0,
    gitCommands: 0,
    DBOperations: 0,
    paidImageGeneration: 0,
    canonicalEditionWrites: 0,
    stagePromotions: 0,
    nativeLessonFinalization: 0,
    fullProjectTestsOrBuilds: 0,
    generatedSVGHandEdits: 0,
    fontFloorLowerings: 0,
    imagePayloadsReturned: 0
  },
  filesChanged: plannedFiles,
  changedFileCount: plannedFiles.length,
  finish: 'Frozen first author evidence only. Stop; no further repairs, rendering, source or width image opens, or promotion.'
})
fs.chmodSync(local('report.json'), 0o444)
write('author-freeze.json', {
  schema: 'd404/author-freeze@1',
  status: 'AUTHOR_ONLY',
  card: 'HOLD',
  FIGIndependent: 'HOLD',
  DISPLAY: 'HOLD',
  frozenAt: new Date().toISOString(),
  ownershipRoot: own,
  sourceManifest: inputs.manifest,
  report: bind(local('report.json')),
  actualOpens: bind(local('actual-opens.json')),
  bindings: files(own).map(bind),
  frozenFileMode: '0444',
  changedFileCount: plannedFiles.length,
  selfHashStoredExternallyInFinalText: true
})
for (const file of files(own)) fs.chmodSync(file, 0o444)
assert.equal(fs.statSync(local('report.json')).mode & 0o777, 0o444)
assert.equal(fs.statSync(local('author-freeze.json')).mode & 0o777, 0o444)
for (const binding of read(local('author-freeze.json')).bindings) assert.equal(hash(binding.path), binding.sha256)
console.log(JSON.stringify({
  outcomes: figureReports.map(figure => ({ figure: figure.figure, status: figure.status, outcome: figure.authorOutcome })),
  filesChanged: plannedFiles.length,
  imageCount: 6,
  report: bind(local('report.json')),
  freeze: bind(local('author-freeze.json'))
}, null, 2))
