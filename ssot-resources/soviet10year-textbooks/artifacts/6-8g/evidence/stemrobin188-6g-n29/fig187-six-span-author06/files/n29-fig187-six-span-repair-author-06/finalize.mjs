import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { inputPath, owned, read, record, repo, root, write } from './evidence.mjs'

const input = read(inputPath)
const delta = read(owned('repair-delta.json'))
const historical = read(owned('historical.json'))
const spec = read(owned('figures/fig-187.spec.json'))
const oldSpec = read(input.previousSpec.path)
const native = read(owned('figures/fig-187.render.json'))
const bounds = read(owned('display-repair01/fig-187.bounds.json'))
const pixel = read(owned('display-repair01/fig-187.pixel-evidence.json'))
const ledgerPath = owned('image-ledger.json')
const ledger = read(ledgerPath)
assert.equal(ledger.chargedImages, 8)
assert.equal(ledger.cumulativeChargedImages, 24)
assert.equal(ledger.events.filter((event) => event.kind === 'original-source-open').length, 1)
assert.equal(ledger.events.filter((event) => event.kind === 'single-contact-open').length, 1)
assert.equal(ledger.events.filter((event) => event.kind === 'generated-contact-component-view').length, 5)
assert.equal(ledger.events.filter((event) => event.kind === 'failed-display-check').length, 1)
assert.equal(record(owned('FIRST.json')).sha256, delta.first.sha256)
assert.equal(record(owned('FIRST.json')).mode, '0444')
assert.equal(record(owned('figures/fig-187.spec.json')).sha256, delta.currentSpec.sha256)
assert.equal(record(owned('figures/fig-187.svg')).sha256, native.output.svg.sha256)
assert.equal(record(owned('figures/fig-187.spec.json')).sha256, native.spec.sha256)
for (const key of ['source', 'previousSpec', 'previousSvg', 'previousRender', 'priorContext', 'report', 'collection', 'currentModernText']) {
  assert.equal(record(input[key].path).sha256, input[key].sha256, `drift in retained input: ${key}`)
}
assert.equal(record(input.visualFailure.evidence.path).sha256, input.visualFailure.evidence.sha256)
const firstsVerified = ['ownFirst', 'ownSeal', 'originalFirst', 'originalSeal'].map((key) => {
  const inherited = historical.inheritedFirstSeal[key]
  const actual = record(inherited.path)
  assert.equal(actual.sha256, inherited.sha256)
  assert.equal(actual.mode, '0444')
  return { role: key, actual, unchanged: true }
})
const failure = read(owned('failures/fig187-span-visibility-display/failure.json'))
for (const snapshot of failure.snapshots) {
  assert.equal(record(snapshot.snapshot.path).sha256, snapshot.snapshot.sha256)
  assert.equal(snapshot.snapshot.sha256, snapshot.original.sha256)
}
const originalCounterBytes = `${JSON.stringify(failure.receipt.counters, null, 2)}\n`
const counterSnapshot = owned('failures/fig187-span-visibility-display/image-ledger.at-call.json')
fs.writeFileSync(counterSnapshot, originalCounterBytes, { flag: 'wx', mode: 0o444 })
const diagnostic = read(owned('display/endpoint-diagnosis-detail.json'))
assert.equal(diagnostic.actualEndMatrixError, 0)
assert(diagnostic.actualEndRatioError > 1e-7)
assert.equal(native.status, 'pass')
assert.equal(bounds.status, 'pass')
assert.equal(pixel.status, 'pass')
assert(bounds.browserClosed && pixel.browserClosed)
ledger.actualImageToolOpens = 2
ledger.contactOpenCompleted = true
ledger.events.find((event) => event.kind === 'single-contact-open').status = 'actual functions.view_image open completed once; author inspected all5 component views'
ledger.events.filter((event) => event.kind === 'generated-contact-component-view').forEach((event) => {
  event.status = 'rasterized once as part of single contact; no separate component opens or raster crops'
})
ledger.actualRasterImagesGenerated = 1
ledger.actualImagePayloadsLoadedIntoThisContext = 2
ledger.conservativeContextCharge = 8
ledger.parentPermanentImageLoads = 24
ledger.parentNewImages = 0
fs.writeFileSync(ledgerPath, `${JSON.stringify(ledger, null, 2)}\n`)

const visual = {
  schema: 'STEMROBIN-188/six-span-author-visual-observation@1',
  status: 'AUTHOR_ONLY_SCOPED_VISUAL_PASS', notIndependentReview: true,
  source: record(input.source.path), currentSpec: record(owned('figures/fig-187.spec.json')),
  currentSvg: record(owned('figures/fig-187.svg')),
  contact: record(owned('display-repair01/fig-187.contact.png')),
  contactOpenedOnce: true, originalOpenedOnceBeforeFirstSeal: true,
  observations: [
    'At actual fixed640 media, all six bracket spans and endpoint ticks are visibly drawn. The central notches are preserved, not replaced by letters alone.',
    'Left upper h reaches O-to-B while lower r reaches O-to-A. Middle upper/lower brackets share O-to-A endpoints at tangent p. Right upper h reaches O-to-B inside the longer lower O-to-A radius.',
    'Exterior, tangent and secant cases remain in left/middle/right order. Circles, center points, A/B names, radial lines, vertical p lines and inequalities h > r / h = r / h < r are unchanged.',
    'Right h is still left-shifted by the inherited [-12,0] native-pixel offset, and B retains its above-left placement. The labels do not collide or cover the bracket span.',
    'The fixed640 full view shows all three panels. Actual300/358 start windows show the left panel and clip later content; end windows show the right panel without shrinking the media. Clipping at a scroll window boundary is expected, not missing geometry.',
    'English point/panel labels and mathematical h/r symbols remain legible. Native minimum text at640 is16px; no numerical givens were added.',
    'Modern candidate (a)/(b)/(c) references are synchronized only in four new spec provenance entries. Historical source glyph identity is not claimed and prose has not been edited.',
  ],
  executableEvidence: {
    bounds: record(owned('display-repair01/fig-187.bounds.json')),
    pixels: record(owned('display-repair01/fig-187.pixel-evidence.json')),
    all6Spans: true, all36EdgesFiniteInsideAndVisible: true, inkSamples: 108,
    nativeCoordinateTolerancePx: 1e-7, screenMatrixCoordinateTolerancePx: 1e-7,
  },
  inheritedOriginalVisualDefect: {
    evidence: input.visualFailure.evidence,
    nativePassDidNotClearIt: true,
    defect: 'Pixel-coordinate bracket paths were multiplied by raw-path scale(30,30), entirely outside the canvas.',
    repairedBy: 'Six bracket representations replaced by36 ordinary JSXGraph segments at the exact intended native pixel vertices.',
    inheritedFailurePreserved: true,
  },
  officialIndependentPass: false, canonicalPromotion: false,
  independentFigureApprovalPending: true, modernTextAffectedIndependentApprovalPending: true,
  lessonFinalized: false, wholeLessonApproved: false, published: false, sessions: 0,
}
const visualBinding = write('author-visual.json', visual)
const receipts = [
  'fig187-native-draft-validation',
  'fig187-native-render-repair04',
  'fig187-span-visibility-display',
  'fig187-span-visibility-display-repair01',
].map((name) => ({ binding: record(owned(`receipts/${name}.json`)), ...read(owned(`receipts/${name}.json`)) }))
assert.equal(receipts.filter((receipt) => receipt.argv.some((arg) => arg.endsWith('/render_spec.mjs'))).length, 1)
assert.equal(receipts[0].exitCode, 0)
assert.equal(receipts[1].exitCode, 0)
assert.equal(receipts[2].exitCode, 1)
assert.equal(receipts[3].exitCode, 0)
write('display-helper-repair.json', {
  classification: 'evidence helper numeric-comparison repair only; not a figure revision or native failure',
  firstFailedCall: record(owned('receipts/fig187-span-visibility-display.json')),
  failurePackage: record(owned('failures/fig187-span-visibility-display/failure.json')),
  capturedCountersAtCall: record(counterSnapshot),
  countersEncoding: 'Lossless JSON serialization of the counter object captured in the before-call receipt, with the same indentation/newline as the ledger writer.',
  concreteDiagnosis: record(owned('display/endpoint-diagnosis-detail.json')),
  originalScreenRatioErrorPx: diagnostic.actualEndRatioError,
  correctedSameMatrixErrorPx: 0,
  change: 'Use the root SVG actual screen matrix for intended endpoints, matching the browser Float32 SVGPoint path; separately assert raw native SVG endpoints.',
  tolerancesUnchanged: true, addedNativeCoordinateCheck: true,
  specSvgRendererUnchangedByEvidenceRepair: true,
  recoveredAffectedStageOnly: record(owned('receipts/fig187-span-visibility-display-repair01.json')),
  failedStageCharge: 1, nativeRerendersAfterEvidenceFailure: 0,
})
const collectOwned = (directory) => fs.readdirSync(directory, { withFileTypes: true })
  .flatMap((entry) => entry.isDirectory() ? collectOwned(path.join(directory, entry.name)) : [record(path.join(directory, entry.name))])
const manifest = collectOwned(root).sort((a, b) => a.path.localeCompare(b.path))
const report = {
  schema: 'STEMROBIN-188/six-bracket-span-author-report@1',
  status: 'AUTHOR_ONLY_FIG187_NATIVE_AND_SCOPED_VISUAL_PASS_INDEPENDENT_APPROVAL_PENDING',
  task: 'SAME188-6', ticket: 'STEMROBIN-188', figure: 'fig-187',
  createdAt: new Date().toISOString(), repository: repo, ownedRoot: root,
  authority: { installed: 'db613601', corresponding: '093a4baa', noSetupUpdateGrill: true, basis: 'direct human offline author-only authorization' },
  current: {
    input: record(inputPath), spec: record(owned('figures/fig-187.spec.json')),
    svg: record(owned('figures/fig-187.svg')), render: record(owned('figures/fig-187.render.json')),
    context: record(owned('context/fig-187.context.json')), source: record(input.source.path),
    modernTextCandidate: record(input.currentModernText.path), authorVisual: visualBinding,
    contact: record(owned('display-repair01/fig-187.contact.png')),
  },
  repair: {
    figureRepairOrdinalAcrossHistory: 4, repairedRepresentations: 6, replacementSegmentObjects: 36,
    spans: delta.spans, exactChangedSourceInventoryObjects: spec.source.inventory.map((after, index) => ({ before: oldSpec.source.inventory[index], after })),
    exactAddedAssertionObjects: delta.addedAssertionObjects, originalAssertionObjects: oldSpec.assertions,
    originalAssertionsUnchanged: true, nonBracketGeometryAndLabelsUnchanged: true,
    constraintsAndMin16pxUnchanged: true, noSourceSpanHidden: true, noNumericalGivensAdded: true,
    metadataOnlyDeltaSeparate: delta.metadataOnlyDelta, currentModernAnchorProjection: delta.currentModernAnchorProjection,
    proseEdited: false, sourcePanelGlyphIdentityClaimed: false, generatedSvgHandEdited: false,
    rendererOrCanonicalAssetsChanged: false, deltaEvidence: record(owned('repair-delta.json')),
  },
  native: {
    status: native.status, objects: native.objects, labels: native.labels, collisions: native.collisions,
    displayChecks: native.displayChecks, nativeRenderAttemptsThisFreshContext: 1,
    standaloneDraftValidationRuns: 1, rendererInternalDraftValidationIncluded: true,
    internalValidatorPassStreamsNotExposedByUnchangedRenderer: true,
    exactArgvCwdExitCodeAndStreams: receipts.slice(0, 2),
    priorPASSNotReplayed: true, sourceAndOtherFiguresNotRerendered: true,
  },
  authorVisual: visual,
  evidenceFailureAndRepair: {
    status: 'RECOVERED_EVIDENCE_HELPER_ONLY',
    ownFailedDisplayCalls: 1, ownNewNativeFailures: 0, ownNewVisualContentFailures: 0,
    retainedFailure: record(owned('failures/fig187-span-visibility-display/failure.json')),
    counterSnapshot: record(counterSnapshot), beforeCall: record(owned('receipts/fig187-span-visibility-display.before.json')),
    helperRepair: record(owned('display-helper-repair.json')),
    calls: receipts.slice(2),
    nativeSpecUnchangedDuringRecovery: true, changedStageOnly: true,
  },
  firstSeal: {
    currentFirst: record(owned('FIRST.json')), currentSealReceipt: record(owned('first-seal.receipt.json')),
    actualSealOrder: delta.seal.sequence, oldSpecReadAt: delta.oldSpecReadAt,
    oldSpecNotReadBeforeSealReceipt: true, oldSpecReadAfterSeal: true,
    currentFirstUnchangedAfterSeal: true, priorImmutableFirsts: firstsVerified,
    historicalFirstsAndThreeNativeFailuresRetainedInPlace: true,
  },
  imageLedger: ledger,
  cumulativeHistory: {
    before: { nativeFailures: 3, figureRepairs: 3, visualFailures: 1, conservativeImageCharges: 16 },
    added: { nativeRenderAttempts: 1, nativeFailures: 0, figureRepairs: 1, visualFailures: 0, evidenceDisplayFailures: 1, evidenceHelperRepairs: 1, conservativeImageCharges: 8 },
    after: { nativeRenderAttempts: 5, nativeFailures: 3, figureRepairs: 4, visualFailures: 1, conservativeImageCharges: 24 },
    reset: false, historicalBinding: record(owned('historical.json')),
    preservedThreeNativeFailureAndRepairReferences: historical.inherited,
    previousLabelOnlyRepair: { report: input.report, totals: historical.inheritedTotals },
    previousVisualFailure: input.visualFailure,
  },
  holds: [
    { scope: 'changed FIG187 candidate', status: 'INDEPENDENT_APPROVAL_PENDING', reason: 'Author-only native/visual evidence is not an official independent pass.' },
    { scope: 'current N29 modern panel-reference candidate', status: 'AFFECTED_INDEPENDENT_APPROVAL_PENDING', reason: 'The new four references plus3 anchors remain pending with their owner; metadata sync does not approve prose.' },
  ],
  remainingAuthorObservedFigureDefects: [],
  unaffected: { figures: ['186', '188', '189'], imagesOpened: 0, specsOpened: 0, edited: false, validatedOrRerendered: false, priorPassedEvidenceReusedByReferenceOnly: true },
  approvals: { authorOnly: true, officialIndependentPass: false, canonicalPromotion: false, lessonFinalized: false, wholeLessonApproved: false, published: false },
  sessions: 0, activeOwnExecSessions: 0, activeOwnBrowserSessions: 0, browserClosed: true,
  forbiddenActionsPerformed: { network: false, DB: false, Git: false, paid: false, publish: false, handoff: false, chatCoordination: false, wholeBookGates: false, setup: false, update: false, Grill: false, canonicalWrites: false, otherAgentEditsOrReverts: false },
  allOwnedEvidenceManifest: manifest,
  manifestScope: 'All existing files recursively under this owned root, excluding Report.json itself to avoid a recursive hash. A separate report.sha256 record binds the final report.',
}
const reportBinding = write('Report.json', report)
write('report.sha256.json', reportBinding)
console.log(JSON.stringify({
  status: report.status, report: reportBinding,
  specSha256: report.current.spec.sha256, svgSha256: report.current.svg.sha256,
  renderSha256: report.current.render.sha256, contextSha256: report.current.context.sha256,
  sourceSha256: report.current.source.sha256, allOwnedManifestEntries: manifest.length,
  nativePass: true, all6SpanStrokesVisible: true, authorOnly: true,
  historicalNativeFailures: 3, cumulativeFigureRepairs: 4,
  historicalVisualFailuresPreserved: 1, imageCharges: '8/8 fresh;24 cumulative;parent24/24 unchanged',
  sessions: 0,
}))
