import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const own = path.dirname(fileURLToPath(import.meta.url))
const repo = path.resolve(own, '../../..')
const freezeFile = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d031-n113-figures-a-author-freeze.json')
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: path.resolve(file), sha256: hash(file), bytes: fs.statSync(file).size })
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const verify = record => {
  assert.equal(hash(record.path), record.sha256, record.path)
  if (record.bytes != null) assert.equal(fs.statSync(record.path).size, record.bytes)
}
const inputs = read(path.join(own, 'input-bindings.json'))
for (const record of Object.values(inputs).filter(v => v?.path)) verify(record)
assert.equal(inputs.science.sha256, 'a737213742ab0bb257fe29a829b7c75f1e16d1bfcee376870208add938906fe7')
const ledger = read(path.join(own, 'image-open-ledger.json'))
assert.equal(ledger.imageOpens, ledger.entries.length)
assert.equal(ledger.imageOpens, 7)
assert.ok(ledger.imageOpens <= 8 && ledger.batchClosedToFurtherImageOpens)
assert.deepEqual(ledger.entries.map(e => e.ordinal), [1, 2, 3, 4, 5, 6, 7])
for (const entry of ledger.entries) verify(entry)
const findingsFile = path.join(own, 'author-pixel-findings.json')
const findings = read(findingsFile)
assert.equal(findings.status, 'author-pass')
const figures = []
for (const finding of findings.figures) {
  const id = finding.id, initial = path.join(own, id, 'initial')
  const final = id === 'fig-229' ? path.join(own, id, 'final') : initial
  const specFile = path.join(final, 'spec.json'), renderFile = path.join(final, 'render.json')
  const reviewFile = path.join(final, 'author-review.json')
  const spec = read(specFile), render = read(renderFile), review = read(reviewFile)
  assert.equal(render.status, 'pass')
  assert.equal(render.spec.sha256, hash(specFile))
  assert.equal(review.status, 'pass')
  assert.equal(review.spec.sha256, hash(specFile))
  assert.equal(review.render.sha256, hash(renderFile))
  assert.equal(spec.source.image.sha256, hash(spec.source.image.path))
  assert.equal(spec.mode, finding.mode)
  const widthFile = path.join(own, id, id === 'fig-229' ? 'repair-1' : 'initial', 'width-preview-report.json')
  const widths = read(widthFile)
  assert.equal(widths.status, 'pass')
  const assertionsFile = path.join(own, id, id === 'fig-229' ? 'repair-1' : 'initial', 'author-assertions.json')
  assert.equal(read(assertionsFile).status, 'pass')
  const media = Object.fromEntries(Object.entries(render.output).map(([name, record]) => {
    const file = path.resolve(repo, record.path)
    assert.equal(hash(file), record.sha256)
    return [name, bind(file)]
  }))
  const bindings = {
    source: bind(spec.source.image.path), context: bind(path.join(own, id, 'complete-context.json')),
    lesson: inputs.lesson, english: inputs.english,
    exercises: inputs.exercises, englishExercises: inputs.englishExercises,
    spec: bind(specFile), render: bind(renderFile), ...media,
    authorReview: bind(reviewFile), widthEvidence: bind(widthFile),
    authorAssertions: bind(assertionsFile), science: inputs.science,
  }
  if (id === 'fig-229') {
    for (const asset of render.assets) {
      assert.ok(!asset.path.includes('.tmp/') && !asset.path.includes('/tmp/'))
      assert.ok(!asset.metadata.path.includes('.tmp/') && !asset.metadata.path.includes('/tmp/'))
      assert.equal(hash(path.resolve(repo, asset.path)), asset.sha256)
      assert.equal(hash(path.resolve(repo, asset.metadata.path)), asset.metadata.sha256)
    }
    bindings.sourceArtwork = bind(path.resolve(repo, spec.assets[0].path))
    bindings.generation = bind(path.resolve(repo, spec.assets[0].metadata))
    bindings.pathOnlyBinding = bind(path.join(final, 'path-only-rebinding.json'))
    bindings.finalWidthEvidenceBinding = bind(path.join(final, 'width-evidence-binding.json'))
    bindings.repairSummary = bind(path.join(own, id, 'repair-summary.json'))
  }
  figures.push({
    id, status: 'author-pass', mode: spec.mode, independentPixelPending: true,
    finalBindings: bindings, bindings, applicableExercises: [],
    exerciseContext: 'Both solved examples read in full in both languages. Neither references this figure; bindings are context/provenance only. Example 2 uses fig-232.',
    actualDimensions: { source: read(path.join(own, 'source-inventory.json')).figures.find(f => f.id === id).dimensions, native: { width: 640, height: 520 }, normal: { width: 640, height: 520 } },
    display: spec.display,
    actualWidthEvidence: widths.measurements.map(m => ({
      viewport: m.viewport, status: m.status, actualMediaWidth: m.metrics.actualMediaWidth,
      actualMediaHeight: m.metrics.actualMediaHeight, containerWidth: m.metrics.containerWidth,
      actualMinimumTextPx: m.metrics.minTextPx, horizontalScrollMax: m.metrics.maxScroll,
      reachedScrollEnd: m.metrics.reachedScrollEnd,
    })),
    repairCounts: finding.repairCounts, findings: finding.findings,
    sourceUncertainty: finding.sourceUncertainty || null,
    initialHistory: {
      spec: bind(path.join(initial, 'spec.json')), render: bind(path.join(initial, 'render.json')),
      authorReview: bind(path.join(initial, 'author-review.json')),
      draftValidation: bind(path.join(initial, 'draft-validation.json')),
      repairHistory: bind(path.join(initial, 'repair-history.json')),
      ...(id === 'fig-229' ? { preservedInitialWidthFailure: bind(path.join(initial, 'width-preview-report.json')) } : {}),
    },
  })
}
const walk = directory => fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
  const file = path.join(directory, entry.name)
  assert.ok(!entry.isSymbolicLink(), 'No external symlink in owned freeze')
  return entry.isDirectory() ? walk(file) : [file]
})
const frozenFiles = walk(own).sort().map(bind)
const externalRecords = new Map()
const inspect = value => {
  if (!value || typeof value !== 'object') return
  if (value.path && value.sha256) {
    const file = path.resolve(repo, value.path)
    const record = { ...value, path: file }
    verify(record)
    if (!file.startsWith(`${own}/`)) externalRecords.set(file, bind(file))
  }
  for (const child of Object.values(value)) if (child && typeof child === 'object') inspect(child)
}
inspect(inputs)
inspect(figures)
const receiptFile = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d031-n113-artwork-retention.json')
assert.equal(hash(receiptFile), '26232d42532539bb264fb6ffaa7682e6634bf00720e4b1cb3c592eb59131821d')
inspect({ receipt: bind(receiptFile), retained: read(receiptFile) })
for (const file of frozenFiles) verify(file)
const payload = {
  schema: 'ld-s10y-image/bounded-author-freeze@1', ticket: 'STEMROBIN-181',
  card: 'phy9-c2-s4-n113', edition: 'modern-us-neutral', authorDate: '2026-11-16',
  status: 'author-pass-independent-pixel-pending', role: 'figure-author-only',
  ownedRoot: own, ownedFreeze: freezeFile, sameActiveInvocation: true,
  frozenFiles, frozenFileCount: frozenFiles.length,
  externalInputBindingsVerified: [...externalRecords.values()].sort((a, b) => a.path.localeCompare(b.path)),
  inputs, figures, independentPixelPending: true, authorPixelFindings: bind(findingsFile),
  completeReads: { chineseLessonObjects: 13, englishLessonObjects: 13, chineseSolvedExamples: 2, englishSolvedExamples: 2, exactEnglishPathsResolvedFromSCI: true },
  sourceInventory: bind(path.join(own, 'source-inventory.json')),
  imageOpenLedger: { ...bind(path.join(own, 'image-open-ledger.json')), ...ledger },
  repairCounts: Object.fromEntries(figures.map(f => [f.id, f.repairCounts])),
  retainedAssetReceipt: bind(receiptFile),
  changedPaths: [...frozenFiles.map(f => f.path), freezeFile],
  actions: {
    imageOpens: 7, generatedImages: 1, targetedArtRegenerations: 0,
    nativeGeometryRendersPerFigure: 1, nativeGeometryRepairs: 0,
    widthCheckerRepairs: 1, initialFailurePreserved: true,
    pathOnlyFinalBinding: true, nativeRendersForPathRebinding: 0,
    pixelReopensForPathRebinding: 0, freshGeometryAssertionsForPathRebinding: 0,
    independentReviews: 0, freshSCI: 0, scienceReplay: 0, setupRestarts: 0,
    sharedArtifactsTemplatesMetersToolsWrites: 0, evidenceWritesByAuthor: 0,
    commits: 0, database: 0, deploys: 0, promotion: 0,
  },
  limits: {
    independentFigureApproval: false, independentScienceApproval: false,
    runningProductOrOfflineFullCardAcceptance: false, fullCardCompletion: false,
    promotion: false, publication: false, batchClosedToFurtherImages: true,
    sourceSpecRenderReviewHashesReferToExactCandidates: true,
    hybridPublishedShape: 'Separate rendered artwork and SVG overlay; composite PNG is preview only.',
    coordinationProvenance: 'Parent-agent coordination; not a human statement.',
  },
}
assert.ok(!fs.existsSync(freezeFile), 'Do not overwrite a prior freeze')
fs.writeFileSync(freezeFile, `${JSON.stringify(payload, null, 2)}\n`, { flag: 'wx' })
const frozen = read(freezeFile)
for (const record of frozen.frozenFiles) verify(record)
for (const record of frozen.externalInputBindingsVerified) verify(record)
console.log(JSON.stringify({
  status: frozen.status, freeze: bind(freezeFile), frozenFiles: frozen.frozenFileCount,
  figures: figures.map(f => ({ id: f.id, mode: f.mode, spec: f.bindings.spec, render: f.bindings.render })),
  imageOpens: 7, independentPixelPending: true,
}, null, 2))
