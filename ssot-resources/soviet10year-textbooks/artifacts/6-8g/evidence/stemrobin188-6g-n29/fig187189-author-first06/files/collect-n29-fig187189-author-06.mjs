import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { repo, tmp, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'
import { retainCurrent6g } from './retain-current-6g-evidence-03.mjs'

const own = path.join(tmp, 'n29-fig187189-author-first-06')
const reportFile = path.join(own, 'Report.json')
assert.equal(hash(reportFile), 'b43e57d42f1975e968f34e43afaf0c02e9b965af81d920d3c0c72b4e3114a567')
const report = read(reportFile)
assert.equal(report.status,
  'AUTHOR_ONLY_PARTIAL_DELIVERY_188189_READY_FOR_INDEPENDENT_REVIEW_187_LOCAL_HOLD')
assert.equal(report.ownsessions, 0)
const references = new Map([[reportFile, bind(reportFile)]])
function add(item) {
  assert.equal(hash(item.path), item.sha256, item.path)
  references.set(item.path, { path: item.path, sha256: item.sha256 })
}
function addBindings(value) {
  if (!value || typeof value !== 'object') return
  if (value.path && value.sha256) add(value)
  else for (const child of Object.values(value)) addBindings(child)
}
addBindings(report.sourceAndModernTextBindings)
add(report.imageLedger.binding)
add(report.modernAdditionsAndUnknowns)
add(report.authorVisualEvidence)
add(report.repairs.binding)
for (const figure of report.figures) {
  for (const item of [figure.source, figure.sourceFIRST.inventory,
    figure.sourceFIRST.seal, figure.spec, figure.svg, figure.render]) add(item)
  assert.equal(fs.statSync(figure.sourceFIRST.inventory.path).mode & 0o777, 0o444)
  assert.ok(figure.sourceFIRST.actualSealedAt < figure.sourceFIRST.candidateAuthorshipAt)
  add(figure.nativeValidation.standaloneDraftReceipt)
  if (figure.physicalWidthTests.binding) {
    add(figure.physicalWidthTests.binding)
    add(figure.physicalWidthTests.contact)
  }
  const render = read(figure.render.path)
  assert.equal(render.status, figure.id === 'fig-187' ? 'fail' : 'pass')
}
const receiptFacts = report.receiptManifest.map(item => {
  add(item.binding)
  const actual = read(item.binding.path)
  assert.equal(actual.cwd, repo)
  assert.equal(actual.exitCode, item.exitCode)
  assert.deepEqual(actual.argv, item.argv)
  for (const stream of Object.values(actual.streams)) add(stream)
  return { stage: item.stage, execution: bind(item.binding.path),
    exitCode: actual.exitCode, replayed: false }
})
const historicalSnapshots = []
for (const item of report.exactFailureSnapshots) {
  if (!item.path) {
    addBindings(item)
    continue
  }
  add(item)
  const saved = read(item.path)
  for (const pair of saved.preserved) {
    assert.equal(pair.snapshot.sha256, pair.original.sha256)
    add(pair.snapshot)
    assert.equal(fs.statSync(pair.snapshot.path).mode & 0o777, 0o444)
    historicalSnapshots.push({ historical: pair.original, actual: pair.snapshot })
  }
}
const collectionRoot = path.join(tmp, 'n29-fig187189-author-collection-06')
fs.mkdirSync(collectionRoot)
const collectionFile = path.join(collectionRoot, 'collection.json')
save(collectionFile, {
  status: 'AUTHOR_ONLY_N29_188189_READY_187_NATIVE_COLLISION_HOLD',
  report: bind(reportFile), receiptFacts,
  figures: report.figures.map(figure => ({
    id: figure.id, status: figure.status, source: figure.source,
    FIRST: figure.sourceFIRST, spec: figure.spec, svg: figure.svg, render: figure.render,
    display: figure.display, nativeValidation: figure.nativeValidation,
    physicalWidthTests: figure.physicalWidthTests, authorVisual: figure.authorVisual,
    sourceSpecificGeometry: figure.sourceSpecificGeometry,
  })),
  imageLedger: report.imageLedger, counters: report.nativeStageCounters,
  localHolds: report.localHolds, localUnknowns: report.localUnknowns,
  modernAdditionsAndUnknowns: report.modernAdditionsAndUnknowns,
  repairs: report.repairs, historicalSnapshots,
  readOnlyDiscoveryFailure: report.readOnlyDiscoveryFailure,
  originalsAndFailedOutputsNotReplacedByLatestWorkingHashes: true,
  independentReviewPending: true, authorChecksNotIndependentApproval: true,
  completedChildReportsAllOwnSessionsEnded: true,
  parentImageLoads: 0, published: false, wholeLessonApproved: false,
})
add(bind(collectionFile))
const repairFile = path.join(collectionRoot, 'fig187-repair-author-input.json')
const failed = report.figures.find(figure => figure.id === 'fig-187')
save(repairFile, {
  status: 'AUTHOR_ONLY_AFFECTED_FIG187_LABEL_LAYOUT_REPAIR_REQUIRED',
  figure: 'fig-187', source: failed.source,
  candidateModernText: report.sourceAndModernTextBindings.candidateText,
  originalContext: report.sourceAndModernTextBindings.context,
  sourceFIRST: failed.sourceFIRST, failedSpec: failed.spec,
  failedSvg: failed.svg, failedRender: failed.render,
  originalReport: bind(reportFile), collection: bind(collectionFile),
  originalFailureSnapshots: report.exactFailureSnapshots,
  nativeCollisions: failed.nativeValidation.collisions, priorRepairs: report.repairs,
  preserveSourceGeometryLabelsGivensAndCaseOrder: true,
  scope: 'Repair only fig187 label layout in a new writable copy. Do not alter188189 or any prose. Panel-reference text discrepancy remains for the text owner.',
  sourceNativeReviewMustNotBeReplayed: true,
  priorChargedImagesRemain: report.imageLedger.chargedLoads,
  newFreshAuthorContextMaxImages: 8, parentPermanentImages: 24,
  native187NotApproved: true, wholeLessonApproved: false, published: false,
})
add(bind(repairFile))
const crossReferenceFile = path.join(collectionRoot, 'text-panel-cross-reference-note.json')
save(crossReferenceFile, {
  status: 'AUTHOR_REPORTED_MODERN_PANEL_CROSS_REFERENCE_HOLD',
  report: bind(reportFile),
  candidateText: report.sourceAndModernTextBindings.candidateText,
  figure187Spec: failed.spec,
  reportedIssue: report.localHolds[1],
  modernLabels: ['(a)', '(b)', '(c)'],
  panelMapping: 'Left/middle/right only; source Unicode glyph identity not established.',
  noTextEdited: true, noIndependentImageApproval: true,
  reviewOnlyAfterIndependentSourceFIRST: true,
})
add(bind(crossReferenceFile))
const collector = path.join(tmp, 'collect-n29-fig187189-author-06.mjs')
add(bind(collector))
const retained = retainCurrent6g(
  'evidence/stemrobin188-6g-n29/fig187189-author-first06',
  [...references.values()],
  [
    'evidence/stemrobin188-6g-n29/assembly-and-prepare-first06/retention.json',
    'evidence/stemrobin188-6g-n29/text-and-answers-author-first06/retention.json',
  ],
  {
    status: 'AUTHOR_ONLY_N29_188189_READY_187_NATIVE_COLLISION_HOLD',
    figures: [187, 188, 189], chargedImages: 8, actualImagePayloads: 5,
    failedVectorAttemptsConservativelyCharged: 3, nativeRenderFailures: 3,
    nativeRenderRepairs: 2, sourceReopens: 0, standaloneDraftCalls: 3,
    successfulNativeRenderCalls: 2, successfulStagesReplayed: 0,
    originalFailedSpecSvgRenderSnapshotsRetained: true, native187StillHOLD: true,
    source189GlyphIdentityUnknown: true, modern189LabelsExplicitProseAdditionsOnly: true,
    panelCrossReferenceHoldSeparate: true, readOnlyDiscoveryDiagnostics: 1,
  },
)
console.log(JSON.stringify({
  collection: bind(collectionFile), retained,
  repairAuthorInput: bind(repairFile), textCrossReference: bind(crossReferenceFile),
}))
