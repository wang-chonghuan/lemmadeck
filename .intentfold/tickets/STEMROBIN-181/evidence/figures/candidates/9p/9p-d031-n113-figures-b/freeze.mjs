import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const own = path.dirname(fileURLToPath(import.meta.url))
const repo = path.resolve(own, '../../..')
const freezeFile = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d031-n113-figures-b-author-freeze.json')
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: path.resolve(file), sha256: hash(file), bytes: fs.statSync(file).size })
const dimensions = file => {
  const buffer = fs.readFileSync(file)
  assert.equal(buffer.subarray(0, 8).toString('hex'), '89504e470d0a1a0a')
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) }
}
const inputs = read(path.join(own, 'input-bindings.json'))
for (const binding of Object.values(inputs).filter(v => v?.path)) assert.equal(hash(binding.path), binding.sha256)
assert.equal(inputs.science.sha256, 'a737213742ab0bb257fe29a829b7c75f1e16d1bfcee376870208add938906fe7')
const inventory = read(path.join(own, 'source-inventory.json'))
const findings = read(path.join(own, 'author-pixel-findings.json'))
assert.equal(findings.status, 'author-pass')
assert.equal(findings.batchClosedToFurtherImageOpens, true)
assert.equal(findings.imageLedger.length, findings.imageOpenCounts.total)
assert.ok(findings.imageLedger.length <= 8)
const ledger = {
  schema: 'ld-s10y-image/bounded-image-ledger@1',
  freshBatch: true, figures: ['fig-231', 'fig-232'], maximumImageOpens: 8,
  ...findings.imageOpenCounts,
  opens: findings.imageLedger.map(entry => ({
    ...entry, ...bind(path.join(repo, entry.path)), tool: 'functions.view_image',
  })),
  batchClosedToFurtherImageOpens: true,
  noOtherImageBatchRunInThisAuthorTurn: true,
}
fs.writeFileSync(path.join(own, 'image-open-ledger.json'), `${JSON.stringify(ledger, null, 2)}\n`, { flag: 'wx' })
const figures = inventory.figures.map(observed => {
  const out = path.join(own, observed.id, 'initial')
  const specFile = path.join(out, 'spec.json'), renderFile = path.join(out, 'render.json')
  const svgFile = path.join(out, `${observed.id}.svg`), reviewFile = path.join(out, 'author-review.json')
  const widthFile = path.join(out, 'width-preview-report.json'), assertionsFile = path.join(out, 'author-assertions.json')
  const spec = read(specFile), render = read(renderFile), review = read(reviewFile), width = read(widthFile)
  for (const record of [render, review, width, read(assertionsFile)]) assert.equal(record.status, 'pass')
  assert.equal(render.spec.sha256, hash(specFile))
  assert.equal(review.spec.sha256, hash(specFile))
  assert.equal(review.render.sha256, hash(renderFile))
  assert.equal(review.source.sha256, spec.source.image.sha256)
  assert.equal(width.spec.sha256, hash(specFile))
  assert.equal(width.render.sha256, hash(renderFile))
  for (const binding of Object.values(render.output)) assert.equal(hash(binding.path), binding.sha256)
  assert.deepEqual(spec.assets, [])
  assert.equal(spec.objects.filter(o => o.type === 'image').length, 0)
  const source = path.join(repo, observed.sourcePNG)
  assert.equal(hash(source), observed.sha256)
  const normalPNG = path.join(out, `${observed.id}.normal-preview-640.png`)
  const nativePNG = path.join(out, `${observed.id}.native.png`)
  const mobilePNG = path.join(out, `${observed.id}.mobile-container.png`)
  assert.deepEqual(dimensions(normalPNG), { width: 640, height: spec.canvas.height })
  assert.deepEqual(dimensions(nativePNG), dimensions(normalPNG))
  const actualWidths = width.measurements.map(m => {
    assert.equal(m.status, 'pass')
    assert.equal(m.metrics.actualMediaWidth, 640)
    assert.equal(m.metrics.actualMediaHeight, spec.canvas.height)
    assert.ok(m.metrics.minTextPx >= 16)
    assert.equal(m.metrics.reachedScrollEnd, true)
    return {
      viewport: m.viewport, container: m.container, status: m.status,
      actualMediaWidth: m.metrics.actualMediaWidth, actualMediaHeight: m.metrics.actualMediaHeight,
      containerWidth: m.metrics.containerWidth, containerClientWidth: m.metrics.containerClientWidth,
      exerciseBodyWidth: m.metrics.exerciseBodyWidth,
      actualMinimumTextPx: m.metrics.minTextPx,
      horizontalScrollMax: m.metrics.maxScroll, reachedScrollEnd: m.metrics.reachedScrollEnd,
    }
  })
  const finding = findings.figures.find(f => f.id === observed.id)
  return {
    id: observed.id, status: 'author-pass', authorPass: true,
    pendingIndependent: true, independentPixelPending: true, mode: 'deterministic',
    finalBindings: {
      source: bind(source), context: bind(path.join(own, observed.id, 'complete-context.json')),
      lesson: inputs.lesson, english: inputs.english, exercises: inputs.exercises, englishExercises: inputs.englishExercises,
      spec: bind(specFile), render: bind(renderFile), svg: bind(svgFile),
      authorReview: bind(reviewFile), widthEvidence: bind(widthFile), authorAssertions: bind(assertionsFile),
      sourceInventory: bind(path.join(own, 'source-inventory.json')), science: inputs.science,
    },
    applicableExercises: observed.id === 'fig-232' ? ['2'] : [],
    display: spec.display,
    sourceInventory: observed,
    dimensionsReceipt: {
      source: { ...bind(source), ...dimensions(source) },
      canvas: spec.canvas,
      native: { ...bind(nativePNG), ...dimensions(nativePNG) },
      normal: { ...bind(normalPNG), ...dimensions(normalPNG), alsoFullResolution: true },
      mobileContainerCrop: { ...bind(mobilePNG), ...dimensions(mobilePNG) },
    },
    widthReceipts: actualWidths,
    repairCounts: { totalTargetedRepairs: 0, geometryRepairs: 0, artworkRegenerations: 0, measurementRepairs: 0 },
    initialHistory: {
      draftValidation: bind(path.join(out, 'draft-validation.json')),
      renderCommand: bind(path.join(out, 'render-command.json')),
      repairHistory: bind(path.join(out, 'repair-history.json')),
      initialFailure: null, initialOutputsRetainedUnmodified: true,
    },
    findings: finding.findings, sourceUncertainty: finding.sourceUncertainty,
  }
})
const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
  const file = path.join(dir, entry.name)
  assert.ok(!entry.isSymbolicLink(), 'No scratch asset symlinks in frozen author files')
  return entry.isDirectory() ? walk(file) : [file]
})
const frozenFiles = walk(own).sort().map(bind)
const payload = {
  schema: 'ld-s10y-image/bounded-author-freeze@1',
  ticket: 'STEMROBIN-181', card: 'phy9-c2-s4-n113', edition: 'modern-us-neutral',
  authorDate: '2026-11-17', role: 'figure-author-only', sameActiveInvocation: true,
  status: 'author-pass-independent-pixel-pending', authorPass: true, pendingIndependent: true,
  ownedRoot: own, ownedFreeze: freezeFile, frozenFiles, figures,
  sourceInventory: bind(path.join(own, 'source-inventory.json')),
  completeContextBindings: inputs,
  scienceReusedWithoutResearchOrReplay: inputs.science,
  authorPixelFindings: bind(path.join(own, 'author-pixel-findings.json')),
  imageLedger: ledger, imageLedgerBinding: bind(path.join(own, 'image-open-ledger.json')),
  repairCounts: Object.fromEntries(figures.map(f => [f.id, f.repairCounts])),
  widthReceipts: Object.fromEntries(figures.map(f => [f.id, { binding: f.finalBindings.widthEvidence, measurements: f.widthReceipts }])),
  dimensionsReceipts: Object.fromEntries(figures.map(f => [f.id, f.dimensionsReceipt])),
  changedPaths: [...frozenFiles.map(b => b.path), freezeFile],
  actions: {
    imageOpens: 6, imageReopens: 0, imageCropsOpened: 2, layerOpens: 0, repairImageOpens: 0,
    nativeGeometryRendersPerFigure: 1, targetedRepairs: 0, initialFailures: 0,
    generatedImages: 0, scratchAssetDependencies: 0,
    nativeValidator: true, nativeRenderer: true, nativeRecordReview: true, actualHeadedWidthChecks: true,
    independentReviews: 0, freshSCI: 0, scienceReplay: 0, setupRestarts: 0,
    sharedArtifactsTemplatesEvidenceMetersToolsWrites: 0, promotion: 0, commits: 0, database: 0, deploys: 0,
  },
  limits: {
    independentFigureApproval: false, fullCardCompletion: false, promotion: false, publication: false,
    widthEvidenceScope: 'Headed native lesson/exercise CSS author-candidate preview. The actual figure and exercise-body widths were measured separately. This is not running-product or full-card acceptance.',
    batchClosedToFurtherImages: true, noHybridArtworkRequired: true,
    noFailureEvidenceDiscarded: true,
  },
}
assert.ok(!fs.existsSync(freezeFile))
fs.writeFileSync(freezeFile, `${JSON.stringify(payload, null, 2)}\n`, { flag: 'wx' })
for (const file of frozenFiles) assert.equal(hash(file.path), file.sha256)
console.log(JSON.stringify({
  freeze: bind(freezeFile), status: payload.status, frozenFiles: frozenFiles.length,
  imageOpens: ledger.total, targetedRepairs: 0, ownedRoot: own,
}, null, 2))
