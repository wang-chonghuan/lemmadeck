import assert from 'node:assert/strict'
import fs from 'node:fs'
import { O, S, SOURCE, hash, read, bind, write, command } from './author.mjs'
import { CURRENT, verifyCurrent } from './rebind.mjs'

const current = verifyCurrent()
const context = read(`${O}/context-rebind.json`)
const display = read(`${O}/receipts/actual-inline-display.json`)
const geometry = read(`${O}/receipts/geometric-relationships.json`)
const pixels = read(`${O}/receipts/raster-nonblank.json`)
assert.equal(display.status, 'pass')
assert.equal(geometry.status, 'pass')
assert.equal(pixels.status, 'pass')
const observationsById = {
  'fig-73': 'Fresh source and final preview: one narrow plate, seven parallel front traces and five rightward rays are complete at 640px and 295px. All 35 crossings remain visible; rays meet the plate and cross the fronts normally. There are no labelled dots, numeric ticks or extra axes. Uniform straight spacing is declared modern rectification, not new given data. No clipping, overlap, black or blank rendering.',
  'fig-74': 'Fresh source and final preview: one tray frame with water surface, front/right walls and two underside support tabs; one thin contacting diagonal rod with a handle entering from the left. Sixteen parallel wave traces remain ordered three left/thirteen right of the rod. The handle occludes the left traces and meets the rod. The straightened first right-hand wave replaces the source bent tip as declared rectification. No motion arrows, added labels, data ticks or deep submerged rod. Both actual widths remain distinct and readable.',
  'fig-75': 'Fresh source and final preview: one dark source sphere with its small white lighting patch, one dashed alternate-radius outline, four solid concentric wavefront circles and eight arrows pointing radially outward. All 32 front/ray crossings are complete and concentric sections remain distinct at 640px and 295px. Dashed phase outline uses two native semicircles and is not two new fronts. Exact circularity and uniform arrow reach are declared rectification. No added values, inward arrows, labels, clipping or broken raster.',
}
const imageOpens = Object.keys(SOURCE).map((id, i) => ({
  ordinal: i + 1, figure: id, path: `${read(`${O}/${id}/source-inventory.json`).source.path}`,
  method: 'functions.view_image', detail: 'original', fresh: true,
  purpose: 'Canonical source PNG opened before inventory, dimensions and hashes.',
}))
for (const [i, preview] of display.previews.entries()) {
  assert.equal(hash(preview.screenshot.path), preview.screenshot.sha256)
  imageOpens.push({
    ordinal: i + 4, figure: preview.figure, path: preview.screenshot.path,
    method: 'functions.view_image', detail: 'original', fresh: true,
    purpose: 'One final preview per figure, showing actual 640px and 295px unmodified SVG inline media.',
    observations: observationsById[preview.figure],
  })
}
write('author-observations.json', {
  schema: 'ld-s10y-image/bounded-author-observations@1',
  status: 'AUTHOR-OBSERVED-PASS-NOT-INDEPENDENT-APPROVAL',
  imageOpens, imageOpenCount: 6, batchLimit: 8, contextLimit: 24, spareImagesUnused: 2,
  sourceReopens: 0, extraPreviewOpens: 0, sourcePagesOpened: 0,
  geometryRepairsUsed: { 'fig-73': 0, 'fig-74': 0, 'fig-75': 0 },
  labelGate: 'No source/output labels: minTextPx is a declared contract, not a measured minimum; native measuredMinPx=null is legitimate.',
  currentTextAuthority: bind(CURRENT),
  previousNativeReportsRetained: true,
  unchangedVisualGeometryGatesRerun: false,
  independentApproval: false, canonicalPromotion: false,
  wholeCardApproval: false, appOrOfflineLessonOpened: false,
})

const figures = []
for (const figure of context.figures) {
  const { id, stage } = figure
  const spec = read(`${stage}/${id}.spec.json`)
  const render = read(`${stage}/${id}.render.json`)
  assert.equal(render.status, 'pass')
  assert.equal(render.spec.sha256, hash(`${stage}/${id}.spec.json`))
  assert.equal(render.output.svg.sha256, hash(`${stage}/${id}.svg`))
  assert.equal(render.spec.path, `${id}.spec.json`)
  assert.equal(render.output.svg.path, `${id}.svg`)
  assert.equal(hash(`${stage}/${id}.svg`), hash(`${O}/${id}/initial/${id}.svg`))
  const expectedText = current.outputs.map(item => ({
    lesson: current.card, text: fs.readFileSync(item.prose.path, 'utf8'),
  }))
  assert.deepEqual(spec.source.authoritativeText, expectedText)
  const authorReviewName = `${id}.author-review.json`
  assert(!fs.existsSync(`${stage}/${authorReviewName}`))
  const review = command(`${id}-record-author-only-review`, 'python3', [
    `${S}/scripts/record_review.py`, '--spec', `${id}.spec.json`, '--render', `${id}.render.json`,
    '--output', authorReviewName, '--status', 'pass', '--notes',
    `AUTHOR-ONLY bounded observation, not independent figure/SCI/ZHEN approval and not promotion. Current full ZH/EN is bound to repair-freeze SHA256 234f22abbc69b624a4207ac9ac74d1397e70633e17a5297252b9148aed590296. ${observationsById[id]} Actual native SVG media widths 640 and 295 measured in an isolated headed browser, not the app or whole card. Source/spec/render/output hashes are current. Independent figure gates and affected text ZHEN remain pending.`,
  ], stage)
  assert.equal(review.status, 0, review.stdout + review.stderr)
  const authorRecord = read(`${stage}/${authorReviewName}`)
  assert.equal(authorRecord.status, 'pass')
  assert.equal(authorRecord.spec.sha256, hash(`${stage}/${id}.spec.json`))
  assert.equal(authorRecord.render.sha256, hash(`${stage}/${id}.render.json`))
  assert.equal(authorRecord.outputs.svg.sha256, hash(`${stage}/${id}.svg`))
  const inventory = read(`${O}/${id}/source-inventory.json`)
  const preview = display.previews.find(item => item.figure === id)
  figures.push({
    id, mode: 'deterministic', renderer: render.renderer, source: spec.source.image,
    exactSourceDimensions: { width: SOURCE[id].width, height: SOURCE[id].height },
    sourceFacts: inventory.sourceFacts,
    sourceInventory: bind(`${O}/${id}/source-inventory.json`),
    geometryDefinition: bind(`${O}/${id}/geometry-definition.json`),
    nativeOutputs: {
      spec: bind(`${stage}/${id}.spec.json`), svg: bind(`${stage}/${id}.svg`),
      render: bind(`${stage}/${id}.render.json`), authorOnlyReview: bind(`${stage}/${authorReviewName}`),
    },
    nativeStatus: render.status, canvas: spec.canvas, display: spec.display,
    nativeObjectCount: render.objects, nativeAssertionCount: spec.assertions.length,
    labelCount: render.labels, measuredMinimumLabelPx: null,
    collisions: render.collisions, displayChecks: render.displayChecks,
    preview, actualPreviewOpened: true, previewOpenOrdinal: imageOpens.find(item => item.ordinal > 3 && item.figure === id).ordinal,
    initialOutputsRetained: figure.initial,
    initialFinalSvgByteIdentical: true, contextOnlyRebind: true,
    nativeRenderInvocations: 2, targetedGeometryRepairs: 0, geometryGateRuns: 1, visualGateRuns: 1,
    independentFigureApproval: 'pending', promotable: false,
    downstreamContractNotPromoted: {
      id, spec: `figures/${id}.spec.json`, svg: `figures/${id}.svg`,
      render: `figures/${id}.render.json`, review: `figures/${id}.review.json`,
      independentReviewNotAuthored: true,
    },
  })
}
verifyCurrent()
const preservation = []
for (const item of [...read(`${O}/context/input-bindings.json`).snapshots, ...context.snapshots]) {
  assert.equal(hash(item.frozen.path), item.frozen.sha256)
  if (item.original.path.includes('/context/') || item.original.path.includes('/frozen/')
    || item.original.path.includes('/ld-s10y-image/') || item.original.path.endsWith('/repair-freeze.json')) {
    assert.equal(hash(item.original.path), item.original.sha256)
  }
  preservation.push(item)
}
for (const figure of context.figures) {
  for (const item of figure.initial) assert.equal(hash(item.path), item.sha256)
}
write('preservation.json', {
  status: 'pass', allSourcePNGsUnchanged: true, currentFreezeAndFrozenTextUnchanged: true,
  initialSpecsSVGsReportsRetainedBytewise: true, priorContextSnapshotsRetainedBytewise: true,
  textAuthorLiveENChanges: 'Authorized separate worker changes to blocks 5 and 17; checked against current repair freeze, not reverted or falsely asserted unchanged.',
  snapshots: preservation, writesOutsideOwnedRoot: 0,
})
const artifacts = [
  'author.mjs', 'rebind.mjs', 'inspect.mjs', 'freeze.mjs', 'build-state.json',
  'context-rebind.json', 'context/input-bindings.json', 'author-observations.json', 'preservation.json',
  'receipts/geometric-relationships.json', 'receipts/actual-inline-display.json', 'receipts/raster-nonblank.json',
].map(file => bind(`${O}/${file}`))
const nativeCommandReceipts = fs.readdirSync(`${O}/receipts`)
  .filter(file => file.endsWith('.json')).sort().map(file => bind(`${O}/receipts/${file}`))
const freeze = write('author-freeze.json', {
  schema: 'ld-s10y-image/bounded-figure-author-freeze@1',
  ticket: 'STEMROBIN-181', card: 'phy10-c1-s5-n40', frozenAt: new Date().toISOString(),
  status: 'AUTHOR-FROZEN-CURRENT-FULL-ZHEN-NATIVE-PASS-INDEPENDENT-FIGURE-GATES-PENDING',
  ownedRoot: O,
  authoritativeText: {
    previousFreeze: context.previousFreeze, currentFreeze: context.currentFreeze,
    frozenFullProse: current.outputs.map(record => ({ language: record.language, prose: record.prose, templates: record.frozenTemplates })),
    embeddedVerbatimCompleteZHEN: true, boundBeforeFinalNativeRender: true,
    authorWordsChangedByFigureAuthor: false, contextOnlyRebind: true,
    separateTextRepairs: { enBlocks: [5, 17], geometryChanged: false, countedAsGeometryRepair: false },
    nativeTextStatus: current.nativeStatus, localizedDigitsResolvedSeparately: true,
    inheritedSCI: current.inheritedSCI, affectedZHEN: current.affectedZHENReview,
  },
  figures, imageOpens, imageOpenCount: 6, imageBatchLimit: 8, imageContextLimit: 24,
  nativeRenderInvocations: 6, initialRenderInvocations: 3, authorizedContextRebindRenderInvocations: 3,
  geometryGateRunsPerFigure: 1, visualGateRunsPerFigure: 1, unchangedGeometryVisualGatesRerun: false,
  targetedRepairsUsed: 0, targetedRepairsAllowedPerFigure: 1, initialAttemptsRetained: true,
  authorOnlyRecordReviewCalls: 3, generatedSVGHandEdits: 0, externalImageGenerationCalls: 0,
  artifacts, nativeCommandReceipts,
  boundaries: {
    setupUpdates: 0, gitOperations: 0, databaseOperations: 0, ticketBackendOperations: 0,
    messagesSent: 0, appOrToolsEdits: 0, charterEdits: 0, canonicalEdits: 0,
    dependencyChanges: 0, sourcePagesOpened: 0, appOrWholeCardOpened: false,
    allPersistentWritesInsideOwnedRoot: true,
  },
  gates: {
    nativeFigureSpec: 'pass', nativeRender: 'pass', authorGeometryAndVisual: 'pass',
    inheritedTextSCI: 'PASS per supplied repair freeze; not rerun by this author',
    affectedTextZHEN: 'pending', independentFigureReview: 'pending',
    independentFigureSCI: 'pending', promotion: false, fullCardApproval: false,
    fullAdaptFinalizeAndOfflineRender: 'not performed; separately authorized downstream phase',
    sharedFigure64: 'not owned or authored in this task',
  },
})
console.log(JSON.stringify({ status: read(freeze.path).status, authorFreeze: freeze,
  sourceDimensions: figures.map(f => ({ id: f.id, ...f.exactSourceDimensions, inventory: f.sourceFacts })),
  imagesOpened: imageOpens.length, geometryRepairs: 0 }))
