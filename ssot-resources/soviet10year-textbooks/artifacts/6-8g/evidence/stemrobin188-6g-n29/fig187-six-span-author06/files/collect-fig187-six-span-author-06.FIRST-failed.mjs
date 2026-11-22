import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { repo, tmp, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'
import { retainCurrent6g } from './retain-current-6g-evidence-03.mjs'

const own = path.join(tmp, 'n29-fig187-six-span-repair-author-06')
const reportFile = path.join(own, 'Report.json')
assert.equal(hash(reportFile), '9d0b6e23a2439670d51e7921f266170959cdcece6a5b7b47298f2ca134385f94')
const report = read(reportFile)
assert.equal(report.status, 'AUTHOR_ONLY_FIG187_NATIVE_AND_SCOPED_VISUAL_PASS_INDEPENDENT_APPROVAL_PENDING')
assert.equal(report.activeOwnExecSessions, 0)
assert.equal(report.activeOwnBrowserSessions, 0)
assert.equal(report.browserClosed, true)
assert.equal(report.native.status, 'pass')
assert.equal(report.authorVisual.status, 'AUTHOR_ONLY_SCOPED_VISUAL_PASS')
assert.equal(report.authorVisual.executableEvidence.all6Spans, true)
assert.equal(report.repair.repairedRepresentations, 6)
assert.equal(report.repair.replacementSegmentObjects, 36)
assert.equal(report.repair.nonBracketGeometryAndLabelsUnchanged, true)
const references = new Map([[reportFile, bind(reportFile)]])
function add(item) {
  assert.equal(hash(item.path), item.sha256, item.path)
  references.set(item.path, { path: item.path, sha256: item.sha256 })
}
function gather(value) {
  if (!value || typeof value !== 'object') return
  if (value.path && value.sha256) add(value)
  else for (const child of Object.values(value)) gather(child)
}
for (const item of report.allOwnedEvidenceManifest) {
  assert.ok(item.path.startsWith(own + '/'), item.path)
  add(item)
}
gather(report.current)
gather(report.firstSeal)
gather(report.repair.deltaEvidence)
gather(report.cumulativeHistory)
assert.equal(fs.statSync(report.firstSeal.currentFirst.path).mode & 0o777, 0o444)
assert.equal(report.firstSeal.oldSpecNotReadBeforeSealReceipt, true)
const receiptFacts = report.native.exactArgvCwdExitCodeAndStreams.map(item => {
  add(item.binding)
  const actual = read(item.binding.path)
  assert.equal(actual.cwd, repo)
  assert.equal(actual.exitCode, item.exitCode)
  assert.equal(item.exitCode, 0)
  gather(actual.streams)
  return { execution: item.binding, argv: item.argv, exitCode: item.exitCode, replayed: false }
})
gather(report.evidenceFailureAndRepair)
const collectionRoot = path.join(tmp, 'fig187-six-span-author-collection-06')
fs.mkdirSync(collectionRoot)
const collectionFile = path.join(collectionRoot, 'collection.json')
save(collectionFile, {
  status: 'FIG187_SIX_SPANS_AUTHOR_REPAIRED_INDEPENDENT_REVIEW_PENDING',
  report: bind(reportFile), current: report.current, firstSeal: report.firstSeal,
  receiptFacts, repair: {
    ordinal: report.repair.figureRepairOrdinalAcrossHistory,
    replacedRepresentations: report.repair.repairedRepresentations,
    segmentObjects: report.repair.replacementSegmentObjects,
    deltaEvidence: report.repair.deltaEvidence,
    spans: report.repair.spans.map(span => ({
      id: span.id, panel: span.panel, measure: span.measure, sourceInterval: span.sourceInterval,
    })),
    nonBracketGeometryAndLabelsUnchanged: report.repair.nonBracketGeometryAndLabelsUnchanged,
    originalAssertionsUnchanged: report.repair.originalAssertionsUnchanged,
    metadataOnlyDeltaSeparate: report.repair.metadataOnlyDeltaSeparate,
  },
  cumulativeHistory: report.cumulativeHistory,
  imageLedger: report.imageLedger, evidenceFailureAndRepair: report.evidenceFailureAndRepair,
  authorVisual: report.authorVisual, holds: report.holds, unaffected: report.unaffected,
  parentReadOnlyDiagnostic: {
    exitCode: 5, cause: 'jq attempted to index native exactArgvCwdExitCodeAndStreams array as object',
    resolution: 'Read array entries successfully; no producer replay or candidate change',
  },
  authorOnlyNotIndependentApproval: true, parentImageLoads: 0,
  rendererReplays: 0, wholeLessonApproved: false, promoted: false, published: false,
})
add(bind(collectionFile))
const queue = path.join(tmp, 'fig187-six-span-independent-FIRST-inputs-06')
fs.mkdirSync(path.join(queue, 'source-only'), { recursive: true })
fs.mkdirSync(path.join(queue, 'post-FIRST'))
const sourceOnlyFile = path.join(queue, 'source-only/originals.json')
save(sourceOnlyFile, {
  status: 'FIG187_ORIGINAL_PIXELS_AND_CURRENT_PROSE_FIRST',
  book: '6-8g', lesson: 'geo68-c2-s4-n29', figure: 'fig-187',
  source: report.current.source, modernProse: report.current.modernTextCandidate,
  requirement: 'Independently inventory all three panels from original pixels, seal FIRST by actual chmod0444/stat/hash, then access post-FIRST candidates.',
  noCandidateGeometryOrAuthorInventoryHere: true,
  expectedImageRequests: 2, maxChargedImages: 8, parentPermanentImageLoads: 24,
  modernPanelReferencesNotOriginalPixelUnicodeRecovery: true,
})
const postFile = path.join(queue, 'post-FIRST/candidates.json')
save(postFile, {
  status: 'READ_ONLY_AFTER_NEW_ACTUAL_INDEPENDENT_PIXEL_FIRST_SEAL',
  report: bind(reportFile), collection: bind(collectionFile),
  candidates: report.current, repair: read(collectionFile).repair,
  native: report.native, authorVisual: report.authorVisual,
  imageLedger: report.imageLedger, cumulativeHistory: report.cumulativeHistory,
  evidenceFailureAndRepair: report.evidenceFailureAndRepair, holds: report.holds,
  priorNativePASSNotSourceVisualApproval: true,
  scope: 'Only changed187: whole source/spec/output comparison, especially six h/r intervals, visible labels, inequalities and same three panels. No186188189 or nine-answer re-review.',
  expectedImageRequests: 2, rendererReplays: 0, parentImageLoads: 0,
  independentReviewPending: true, wholeLessonApproved: false, published: false,
})
add(bind(sourceOnlyFile))
add(bind(postFile))
const scriptFile = path.join(tmp, 'collect-fig187-six-span-author-06.mjs')
add(bind(scriptFile))
const retained = retainCurrent6g(
  'evidence/stemrobin188-6g-n29/fig187-six-span-author06',
  [...references.values()],
  [
    'evidence/stemrobin188-6g-n29/assembly-and-prepare-first06/retention.json',
    'evidence/stemrobin188-6g-n29/fig187189-author-first06/retention.json',
    'evidence/stemrobin188-6g-n29/fig187-label-repair-author06/retention.json',
    'evidence/stemrobin188-6g-n29/text-nine-keys-review-and-panel-repair06/retention.json',
  ],
  {
    status: 'FIG187_SIX_SPANS_AUTHOR_REPAIRED_INDEPENDENT_REVIEW_PENDING',
    freshChargedImages: 8, historicalImageCharges: 16, cumulativeConservativeImageCharges: 24,
    cumulativeNativeFailures: 3, cumulativeFigureRepairs: 4, cumulativeVisualFailures: 1,
    newEvidenceDisplayFailures: 1, newEvidenceHelperRepairs: 1,
    authorVisualNotIndependentApproval: true, originalFailuresAndFIRSTsPreserved: true,
  },
)
console.log(JSON.stringify({
  collection: bind(collectionFile), retained,
  sourceOnly: bind(sourceOnlyFile), postFIRST: bind(postFile),
}))
