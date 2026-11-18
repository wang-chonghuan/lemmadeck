import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

const repo = '/Users/yong/.codex/worktrees/a07e/lemmadeck'
assert.equal(process.cwd(), repo)
const batch = path.join(repo, '.tmp/s10y-image/batch014-n36-133134')
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'))
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const record = p => ({ path: path.resolve(p), sha256: hash(p) })
const ledger = read(path.join(batch, 'image-ledger.json'))
const offline = read(path.join(batch, 'offline-display-check.json'))
assert.equal(ledger.count, 6)
assert.equal(ledger.events.length, ledger.count)
assert(ledger.count <= ledger.limit)
assert.equal(offline.status, 'pass')
const figures = []
for (const id of [133, 134]) {
  const dir = path.join(batch, `fig-${id}`)
  const current = path.join(dir, 'r1')
  const spec = read(path.join(current, 'spec.json'))
  const context = read(path.join(dir, 'context.json'))
  const render = read(path.join(current, 'render.json'))
  const review = read(path.join(current, 'self-review.json'))
  const repair = read(path.join(current, 'repair-check.json'))
  const spatial = read(path.join(dir, 'spatial-check.json'))
  const source = path.join(repo, spec.source.image.path)
  assert.equal(hash(source), spec.source.image.sha256)
  assert.equal(hash(source), context.sourceImage.sha256)
  for (const input of context.contextProvenance.templates) assert.equal(hash(input.path), input.sha256)
  assert.equal(render.status, 'pass')
  assert.equal(review.schema, 'ld-s10y-image/review@1')
  assert.equal(review.status, 'pass')
  assert(review.notes.includes('AUTHOR SELF-CHECK ONLY'))
  assert.equal(review.spec.sha256, hash(path.join(current, 'spec.json')))
  assert.equal(review.render.sha256, hash(path.join(current, 'render.json')))
  assert.equal(review.outputs.svg.sha256, hash(path.join(current, 'figure.svg')))
  assert.equal(review.source.sha256, hash(source))
  assert.equal(render.spec.sha256, hash(path.join(current, 'spec.json')))
  assert.equal(render.output.svg.sha256, hash(path.join(current, 'figure.svg')))
  assert.equal(repair.currentSpec.sha256, hash(path.join(current, 'spec.json')))
  assert.equal(repair.reusedSpatialCheck.sha256, hash(path.join(dir, 'spatial-check.json')))
  assert.equal(spatial.status, 'pass')
  assert.equal(read(path.join(dir, 'render.json')).status, 'fail')
  assert.equal(read(path.join(dir, 'self-review.json')).status, 'fail')
  const png = fs.readFileSync(path.join(current, 'full-preview.png'))
  assert.equal(png.readUInt32BE(16), 640)
  assert.equal(png.readUInt32BE(20), 560)
  const observations = offline.observations.filter(item => item.figure === spec.id)
  assert.equal(observations.length, 4)
  figures.push({
    figure: spec.id, lesson: 'geo910-c1-s3-n36', exercise: id === 133 ? '335' : '336',
    status: 'author-pass; independent parent gate pending',
    reviewerRole: 'author-self', independentReview: false,
    mode: 'deterministic', renderer: 'JSXGraph', FigureSpec: 'ld-s10y-image/figure-spec@2',
    currentRevision: 'r1',
    source: record(source),
    sourceOwnershipReview: 'Existing corrected crop ownership PASS accepted from direct user instruction; not repeated.',
    current: Object.fromEntries([
      ['spec', 'spec.json'], ['svg', 'figure.svg'], ['render', 'render.json'],
      ['preview', 'full-preview.png'], ['selfReview', 'self-review.json'], ['repair', 'repair-check.json'],
      ['validationCall', 'validate.call.json'], ['renderCall', 'render.call.json'], ['reviewCall', 'review.call.json'],
    ].map(([name, filename]) => [name, record(path.join(current, filename))])),
    context: record(path.join(dir, 'context.json')),
    rawBuilderContext: record(path.join(dir, 'context.builder.json')),
    sourceFirstInventory: record(path.join(dir, 'source-inventory.json')),
    sourceMath: {
      model: record(path.join(dir, 'spatial-model.json')),
      evidence: record(path.join(dir, 'spatial-check.json')),
      checks: spatial.checks.length, status: 'pass',
      scope: 'Spatial givens and existence of a faithful affine projection. Initial full 3D checks are reused through the hash-bound label-only repair, not rerun or represented as independent.',
      keyRelations: id === 133 ? [
        'ABCD is spatially coplanar and rectangular; MA is normal to two independent plane directions.',
        'All eight source segments solid; M/A endpoint junction marks retained.',
        'MC and AD cross only in projection, with no new point or label at that crossing.',
      ] : [
        'ABC has three equal spatial side lengths, without false projected-length equality.',
        'MN is spatially normal; N is top, M bottom; M remains inside the triangle projection below AC.',
        'MN and AC cross only in projection, unmarked; no requested learner construction is added.',
      ],
    },
    sourceVisualCulturalSelfCheck: {
      status: 'pass', sourceOpenedOnce: true, failedPreviewOpenedOnce: true, currentFullPreviewOpenedOnce: true,
      geometry: 'Source positions, endpoints, unmarked projected crossings, standalone marker ownership and solid/dashed styles match.',
      labels: 'Five source-bound English mathematical letters; source-side ownership preserved.',
      cultural: 'No cultural wording, Cyrillic, Chinese visible labels, flags, symbols, archival texture or semantic artwork.',
      answerSafety: 'No numeric dimensions/answers, tick marks, right-angle solution marks, new perpendicular constructions or distractor art.',
      regularization: 'Exact straight segments and affine relationships replace scan imperfections, not the underlying source composition.',
    },
    display: {
      layout: 'scroll', purpose: 'instructional', declaredWidths: [640], minTextPxRequired: 16,
      rendererMeasuredMinPx: 32, pngDimensions: [640, 560],
      offlineEvidence: record(path.join(batch, 'offline-display-check.json')),
      browserMode: 'headless offline harness', viewportCases: [[1440, 960], [390, 844]],
      themes: ['neutral', 'accent'], observations: observations.map(o => ({
        viewport: o.viewport, theme: o.theme, actualMediaWidthPx: o.actualMediaWidthPx,
        containerWidthPx: o.figureContainerWidthPx, minTextPx: o.fontPx,
        scrollEndReached: o.overflow.reachedEnd, maxScroll: o.overflow.maxScroll, status: o.status,
      })),
      acceptanceBoundary: 'Not a headed/live product, final modern lesson, print or PDF acceptance pass.',
    },
    actualUsageInThisAuthorBatch: {
      figureRendererInvocations: 2, failedRenders: 1, passedRenders: 1,
      figureContentRepairs: 1, repairScope: 'Upper endpoint label offset only, 10px north.',
      validatorCLIInvocations: 2,
      standardReviewRecordings: 2, failedAuthorReviews: 1, passedAuthorReviews: 1,
      originalImageOpens: 1, failedPreviewImageOpens: 1, repairedPreviewImageOpens: 1,
      currentContextImages: 3, paidCalls: 0,
      historicalUsage: 'Earlier contexts/source-ownership totals were not provided numerically; not reset or claimed zero.',
    },
    preservedInitialFailure: Object.fromEntries([
      ['spec', 'spec.json'], ['svg', 'figure.svg'], ['render', 'render.json'],
      ['preview', 'full-preview.png'], ['selfReview', 'self-review.json'],
      ['renderCall', 'render.call.json'], ['failedReviewCall', 'failed-review.call.json'],
    ].map(([name, filename]) => [name, record(path.join(dir, filename))])),
    failureReason: `Initial ${id === 133 ? 'M' : 'N'} upper label padded box overlaps endpoint-dot footprint; score 23.746849060058594.`,
    contextRecovery: {
      originalFailure: record(path.join(dir, 'durable-context-failure.json')),
      recoveredCall: record(path.join(dir, 'context-call.json')),
      method: 'Existing build_context.py against batch-local symlinks to the complete authoritative adaptation templates and corrected durable crop. Only the symlink source path is normalized to its durable target in context.json.',
      templateInputs: context.contextProvenance.templates,
    },
  })
}
const report = {
  schema: 'ld-s10y-image/bounded-author-report@1',
  authorization: 'Same184-3 continuation, fresh bounded fig-133/fig-134 AUTHOR only; no durable promotion.',
  generatedAt: new Date().toISOString(), workdir: repo, ownedRoot: batch,
  status: 'author-pass; parent-arranged independent gate pending',
  scope: { book: '9-10g', edition: 'modern-us-neutral', lesson: 'geo910-c1-s3-n36', figures: ['fig-133', 'fig-134'] },
  figures,
  actualBatchUsage: {
    imageLimit: 8, imagesLoadedIntoCurrentContext: 6,
    originalsOpened: 2, failedFullPreviewsOpened: 2, repairedFullPreviewsOpened: 2, reopens: 0,
    JSXGraphRendererInvocations: 4, failedRenders: 2, passedRenders: 2,
    SVGsGenerated: 4, PNGsGenerated: 4, figureContentRepairs: 2,
    figureRepairsById: { 'fig-133': 1, 'fig-134': 1 },
    validatorCLIInvocations: 4, standardReviewRecordings: 4,
    contextBuilderInvocations: 4, originalDurableLookupFailures: 2, recoveredBuilderPasses: 2,
    fullSpatialCheckerInvocations: 1, spatialFiguresChecked: 2, spatialAssertionsPassed: 28,
    offlineBrowserHarnessInvocations: 2, offlineHarnessFailures: 1, offlineHarnessPasses: 1,
    offlineVerificationScriptRepairs: 1, finalOfflineDOMObservations: 8,
    additionalOfflinePNGsGenerated: 0, extraImagesLoadedForOfflineDOMChecks: 0,
    paidCalls: 0, paidAmount: 0, imageCounterResets: 0,
    historicalUsagePolicy: ledger.historicalUsage,
  },
  evidence: {
    imageLedger: record(path.join(batch, 'image-ledger.json')),
    offlineDisplay: record(path.join(batch, 'offline-display-check.json')),
    offlineDisplayCall: record(path.join(batch, 'offline-display.call.json')),
    retainedOfflineFailure: record(path.join(batch, 'offline-display-failure.json')),
    retainedFailedOfflineScript: record(path.join(batch, 'offline-display-check.failed.mjs')),
  },
  limitations: [
    'Author self-review, not an independent review. The parent must arrange its gate; neither durable promotion nor final product approval is implied.',
    'Only these two figure assets were authored. No edition manifest edits, lesson finalization/edition validation, complete offline lesson rendering, headed/live product check or print/PDF acceptance.',
    'Fixed scroll media was checked using actual app CSS in an offline headless exercise-container harness. Inline/mobile-size contracts are not claimed because these specs use scroll, not inline.',
    'Separate spatial realization checks supplement the existing 2D FigureSpec validator; projected angles and lengths are never asserted as planar Euclidean authority.',
    'Source observed pixel anchors are approximate composition evidence, not mathematical distances. Private 3D coordinates are one compatible realization, not textbook numerical givens or answer annotations.',
    'Two durable-context lookup failures and the verification-selector failure have faithful retrospective receipts; they are labelled as summaries, not invented raw captures. Subsequent calls were captured directly.',
    'No image history was cleared. Earlier contexts historical numeric usage was not supplied; preexisting evidence and historical repair counts remain untouched.',
  ],
  boundary: {
    authoredFilesOnlyInsideOwnedBatch: true, existingUnrelatedWorkPreserved: true,
    correctedSourceHashesUnchanged: true, authoritativeTemplateHashesUnchanged: true,
    sourceAcquisition: false, wholePageReview: false, ownershipReviewRepeated: false,
    durablePromotion: false, manifestEdits: false, answerOrChoiceWork: false,
    envAccess: false, DBAccess: false, publishOrInstall: false,
    paidWeb: false, GitOperations: false, chatsOrDescendantsOrMessages: false,
    imagesReturnedToParent: false, returnFormat: 'text only; paths and SHA-256s',
  },
}
const reportPath = path.join(batch, 'report.json')
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2) + '\n', { flag: 'wx' })
console.log(JSON.stringify({
  status: report.status, report: record(reportPath),
  current: figures.map(f => ({ figure: f.figure, files: f.current })),
  counts: report.actualBatchUsage,
}, null, 2))
