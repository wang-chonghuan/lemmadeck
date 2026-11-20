import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck'
const own = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d139-n17-fig23-author')
assert.equal(process.cwd(), repo)
const read = name => JSON.parse(fs.readFileSync(path.join(own, name), 'utf8'))
const write = (name, value) => fs.writeFileSync(path.join(own, name), JSON.stringify(value, null, 2) + '\n', { flag: 'wx' })
const binding = p => {
  const absolute = path.resolve(repo, p)
  const bytes = fs.readFileSync(absolute)
  return { path: absolute, bytes: bytes.length, sha256: crypto.createHash('sha256').update(bytes).digest('hex') }
}
const artifact = name => binding(path.join(own, name))
const input = read('input-freeze.json')
const history = read('preserved-history.json')
assert.deepEqual(artifact('input-freeze.json'), history.input)
const inputs = {}
for (const [key, value] of Object.entries(input)) {
  if (!value?.path || !value?.sha256) continue
  inputs[key] = binding(value.path)
  assert.equal(inputs[key].sha256, value.sha256, key)
  assert.equal(inputs[key].bytes, value.bytes, key)
}
assert.deepEqual(binding(history.original0.spec.path), history.original0.spec)
const spec = read('spec.current.json')
const native = read('native1.validation.json')
const render = read('fig-23.render.json')
const previews = read('preview-receipt.json')
const geometry = read('source-geometry-comparison.json')
const geometryPixels = read('geometry-pixels.json')
const diagnostic = read('mobile-geometry-diagnostic.json')
const changes = read('changed-fields.json')
assert.equal(native.status, 'pass')
assert.equal(render.status, 'pass')
assert.equal(render.collisions.length, 0)
assert.equal(render.objects, 1444)
assert.equal(render.spec.sha256, artifact('spec.current.json').sha256)
assert.equal(render.output.svg.sha256, artifact('fig-23.svg').sha256)
assert.deepEqual(spec.source.authoritativeText, input.authoritativeText)
assert.equal(geometry.existingGeometryDeepEqual, true)
assert.equal(diagnostic.allDeltasLocalToExistingSourceCenterDisks, true)
assert.ok(diagnostic.differences.every(pixel => pixel.before.slice(0, 3).every((value, channel) => value === pixel.after[channel])))

const imageLedger = {
  schema: 'd139-image-ledger@1',
  batch: 'D139',
  ticket: 'STEMROBIN-181',
  maximumBatchOpens: 8,
  maximumContextOpens: 24,
  parentImagesFromInput: input.permissions.parentImages,
  actualBatchImageOpens: 4,
  actualCurrentContextImageOpens: 4,
  opens: [
    { sequence: 1, kind: 'original-source-full', ...inputs.originalSource, sourceFirst: true, observedBeforeOldCandidateGeometry: true, observations: artifact('source-first-inventory.json') },
    { sequence: 2, kind: 'native-render-full', ...artifact('fig-23.full.png'), width: 640, height: 924 },
    { sequence: 3, kind: 'actual-output-640px', ...artifact('fig-23.w640.png'), width: 640, height: 924 },
    { sequence: 4, kind: 'actual-output-331px', ...artifact('fig-23.w331.png'), width: 331, height: 478 },
  ],
  imageOpenTool: 'functions.view_image',
  crops: 0,
  oldCandidateImageOpens: 0,
  otherFigureImageOpens: 0,
  sourceReopens: 0,
  fullAnd640AreSeparateOpensEvenIfIdenticalBytes: true,
  generatedScreenshotsOrInMemoryDiagnosticRastersNotLoadedIntoContext: 'No extra image payloads loaded; XML/raster diagnostics returned JSON only.',
  historicalImageUsageReset: false,
  historicalImageOpenCount: 'Not supplied as a complete numeric count; original author record retained by exact hash, never replaced with this batch count.',
  newPaidCalls: 0,
}
write('image-ledger.json', imageLedger)

const labelRepairs = ['a', 'b', 'c'].map(panel => {
  const id = `${panel}-parameter-1`
  const object = spec.objects.find(o => o.id === id)
  return {
    objectId: id,
    renderLabelId: `${id}-label`,
    text: object.text,
    changedField: 'labelPlacement.offset',
    before: null,
    after: [0, 10],
    unchangedAnchor: object.at,
    units: 'output pixels, not a physical measurement',
  }
})
const widthObservations = previews.previews.map(preview => ({
  preview: binding(preview.path),
  actualMediaWidth: preview.media.width,
  minimumFinalTextPx: Math.min(...preview.labels.map(label => label.finalFontPx)),
  volumeToPanelGaps: ['a', 'b', 'c'].map(panel => {
    const volume = preview.labels.find(label => label.id === `${panel}-parameter-1-label`)
    const title = preview.labels.find(label => label.id === `panel-${panel}-label`)
    return { panel, actualUnpaddedVerticalGapPx: volume.y - title.y - title.height }
  }),
}))
const evidence = Object.fromEntries([
  'source-first-inventory.json', 'preserved-history.json',
  'spec.native0.json', 'native0.validation.json', 'native0.receipt.json',
  'spec.current.json', 'native1.validation.json', 'native1.receipt.json',
  'fig-23.svg', 'fig-23.render.json', 'fig-23.full.png', 'render1.receipt.json',
  'fig-23.w640.png', 'fig-23.w331.png', 'preview-receipt.json',
  'geometry-pixels.json', 'mobile-geometry-diagnostic.json',
  'source-geometry-comparison.json', 'source-point-bindings.json',
  'changed-fields.json', 'image-ledger.json',
].map(name => [name, artifact(name)]))
write('report.json', {
  schema: 'd139-fig23-author-report@1',
  batch: 'D139',
  ticket: 'STEMROBIN-181',
  lesson: input.lesson,
  figure: 'fig-23',
  role: 'author-only-existing-candidate-label-collision-recovery',
  status: 'AUTHOR_SUCCESS_AWAITING_SOLE_INDEPENDENT_REVIEW',
  notIndependentApproval: true,
  parentCommitFromInput: input.parentCommit,
  input: artifact('input-freeze.json'),
  inputs,
  sourceFirstInventory: artifact('source-first-inventory.json'),
  sourceFirstSequence: 'Original PNG opened as image 1; independent inventory saved before oldCandidate geometry was read. Old FigureSpec and original failure were inspected only afterwards.',
  authority: input.permissions.ordinaryReversibleRepair,
  inheritedProseScienceReview: {
    binding: inputs.inheritedProseReview,
    sourceLesson: inputs.unchangedNativeSourceLesson,
    matchingShaConfirmed: true,
    repeated: false,
    authoritativeText: 'Complete frozen modern text deep-equals old/current spec; no course text edited.',
  },
  oldFailures: {
    original0: history.original0,
    originalDraftRepair: inputs.originalDraftRepair,
    original1: history.original1,
    originalRenderStatus: 'fail',
    collisions: input.collisions,
    firstFailureArtifactsUnchanged: true,
    independentFigureApprovalBeforeThisBatch: 'none',
  },
  native: {
    status: native.status,
    stage: native.stage,
    errors: native.errors,
    initialCurrentContractFailure: artifact('native0.validation.json'),
    initialCurrentContractReceipt: artifact('native0.receipt.json'),
    recoveredCurrentContract: artifact('native1.validation.json'),
    receipt: artifact('native1.receipt.json'),
    recovery: 'Declare actual source pointRelationships; map every source-center point to true wholly in-group displacement assertions. Bind existing circle centers to identical named coordinates; no validator, schema, count or tolerance changes.',
    originalObjectCount: 1432,
    retainedOriginalObjects: 1432,
    additionalSourceCenterPoints: 12,
    currentObjectCount: 1444,
    originalCircleCountAssertionUnchanged: spec.assertions.find(assertion => assertion.type === 'objectCount'),
    pointBindings: artifact('source-point-bindings.json'),
  },
  render: {
    status: render.status,
    collisions: render.collisions,
    labels: render.labels,
    renderer: render.renderer,
    displayChecks: render.displayChecks,
    receipt: artifact('render1.receipt.json'),
    output: artifact('fig-23.svg'),
    report: artifact('fig-23.render.json'),
    fullPreview: artifact('fig-23.full.png'),
    attemptsThisBatch: 1,
    layoutRepairsThisBatch: 1,
    generatedSvgHandEdited: false,
  },
  changedFields: {
    exactFieldDiff: artifact('changed-fields.json'),
    exactFieldDiffEntries: changes.length,
    layoutOnly: labelRepairs,
    contractAndProvenanceOnly: 'Inventory requires/mappings, 12 source-center point aliases, equal-coordinate circle references, named-point assertion references, and 11 true in-group displacement assertions. Existing path/SHA bindings were already correct and remain unchanged.',
    physicalGeometryOrValuesChanged: false,
    sourceTextOrUnitsChanged: false,
    otherLabelsChanged: false,
  },
  sourceGeometryDeepComparison: {
    evidence: artifact('source-geometry-comparison.json'),
    existingGeometryDeepEqual: true,
    exclusions: 'Text positions/labelPlacement and metadata; named point references resolved to their exact inherited coordinates.',
    additionalObjectsDisclosed: 12,
    rawObjectArrayDeepEqual: false,
    meaning: 'All 1432 original objects are retained; their resolved non-label geometry is deeply identical. Twelve point bindings represent existing opaque source-role center disks, not new apparatus or scale readings.',
    actualRasterComparison: geometryPixels.comparisons,
    exact640PixelEquality: true,
    exact331PixelEquality: false,
    mobileDiagnostic: artifact('mobile-geometry-diagnostic.json'),
    mobileDifference: '14 alpha-only edge rasterization deltas, maximum channel delta 12, all local to inherited hose-port or thermometer-bulb center disks. No changed RGB value or moved contour. This exact-equality failure is disclosed, not relabelled as a pass.',
  },
  authorVisualObservations: {
    status: 'collision-layout-usable-by-author-observation-only',
    imageLedger: artifact('image-ledger.json'),
    actualImagesOpened: 4,
    full: 'Actual native full PNG opened. Three complete apparatus views remain: a outside the bath at upper left, b in a bath at upper right with expanded bellows, c below in a bath with compressed bellows. Rods, side rulers, thermometers, hose connections, bath outlines, supports and qualitative gauge-pointer directions remain visible. No new scale numbers, units, force/process arrows or artwork appear.',
    desktop640: 'Actual SVG output at 640px opened. All a/b/c panel letters and p/V/T symbols are readable. The three volume labels no longer touch their panel letters; each retains its own state row and subscript/prime. Thin regularized apparatus contours render normally on white, not as a black or blank raster.',
    mobile331: 'Actual SVG output at 331px opened. All 12 labels remain readable without overlap or clipping. The apparatus panels and differing bellows states/pointer directions remain distinguishable. Instrument details are schematic at this width; no numerical reading is claimed.',
    measurements: widthObservations,
    limitation: 'These are bounded author pixel observations, not independent figure, scientific, cultural or complete-course approval.',
  },
  unresolvedSourceAndOtherHolds: input.holdsNotWaived,
  sourceAmbiguity: 'Tiny gauge glyphs, individual scale values/units and complete tiny tick counts remain unresolved from the actual original full PNG; no numeric scale reading fabricated. This does not block the unrelated legal label-layout repair.',
  portraitHold: 'N17 retained paid portrait bytes remain missing; not opened, replaced, repurchased or newly generated.',
  usage: {
    historical: history.historicalUsage,
    thisBatch: { nativeContractDiagnosticAttempts: 1, nativeContractRepairs: 1, nativeRecoveredValidationAttempts: 1, renderAttempts: 1, renderLabelRepairs: 1, imageOpens: 4, paidCalls: 0, independentReviews: 0 },
    cumulativeKnownRenderAttempts: 2,
    cumulativeKnownRenderLabelRepairs: 1,
    historicalFailureOrRevisionUsageReset: false,
  },
  evidence,
  outgoingPeerOrSupervisorMessages: 0,
  independentReviewFileCreated: false,
  canonicalPromotion: false,
  databaseWrites: false,
  networkCalls: false,
  gitCommands: false,
  otherFiguresOrCourseTextEdited: false,
  publisherDeployMergeClosure: false,
  ownership: own,
  finalDisposition: 'Parent may collect this changed author candidate and start the sole independent review. Native and collision render pass do not promote it. Review must retain source-scale uncertainty, the 331px alpha-delta disclosure and all unrelated holds.',
  runningCommands: [],
})
const files = fs.readdirSync(own).filter(name => name !== 'author-freeze.json').sort()
const artifacts = Object.fromEntries(files.map(name => [name, artifact(name)]))
write('author-freeze.json', {
  schema: 'd139-author-freeze@1',
  batch: 'D139',
  ticket: 'STEMROBIN-181',
  status: 'AUTHOR_SUCCESS_AWAITING_SOLE_INDEPENDENT_REVIEW',
  inputParentOwnedImmutable: artifact('input-freeze.json'),
  externalImmutableInputs: inputs,
  original0: history.original0.spec,
  currentSpec: artifact('spec.current.json'),
  currentSvg: artifact('fig-23.svg'),
  currentRender: artifact('fig-23.render.json'),
  report: artifact('report.json'),
  imageLedger: artifact('image-ledger.json'),
  sourceFirstInventory: artifact('source-first-inventory.json'),
  artifacts,
  selfHash: 'Not embedded to avoid a circular hash; the author return supplies the exact file SHA-256.',
  independentReview: 'not-performed; no ld-s10y-image/review@1 created',
  promotion: 'not-performed',
})
console.log(JSON.stringify({
  status: 'AUTHOR_SUCCESS_AWAITING_SOLE_INDEPENDENT_REVIEW',
  report: artifact('report.json'),
  imageLedger: artifact('image-ledger.json'),
  authorFreeze: artifact('author-freeze.json'),
  currentSpec: artifact('spec.current.json'),
  currentSvg: artifact('fig-23.svg'),
  currentRender: artifact('fig-23.render.json'),
  native: native.status,
  render: render.status,
  collisions: render.collisions.length,
  imageOpens: 4,
}, null, 2))
