import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { repo, tmp, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'
import { retainCurrent6g } from './retain-current-6g-evidence-03.mjs'

const own = path.join(tmp, 'source6g149150-author-first-06')
const reportFile = path.join(own, 'report.json')
assert.equal(hash(reportFile), 'db1476328b15ac7b1d8a4ed9d278b5254ed093d7c8146725967c75bf51e7ea94')
const report = read(reportFile)
assert.equal(report.status, 'AUTHOR_ONLY')
assert.deepEqual(report.scope.physicalPages, [149, 150])
assert.equal(report.sessions.ownedExecSessionsStillRunning, 0)
assert.equal(report.sessions.ownedBrowserSessions, 0)
const references = new Map([[reportFile, bind(reportFile)]])
function add(item) {
  assert.ok(item.path.startsWith(own + '/'), item.path)
  assert.ok(!/\.(pdf|pyc|pem|key)$/i.test(item.path), item.path)
  assert.equal(hash(item.path), item.sha256, item.path)
  references.set(item.path, { path: item.path, sha256: item.sha256 })
}
for (const item of report.ownedFilesBeforeReport) add(item)
const receiptFacts = report.executionReceipts.map(item => {
  add(item.file)
  const actual = read(item.file.path)
  assert.deepEqual(actual, item.execution)
  assert.equal(actual.cwd ?? actual.workdir, repo)
  assert.equal(actual.exitCode ?? actual.exit_code ?? actual.returncode, 0)
  for (const stream of Object.values(actual.streams)) add(stream)
  return {
    receipt: bind(item.file.path), stage: actual.argv[3],
    argv: actual.argv, exitCode: 0, replayed: false,
  }
})
assert.equal(receiptFacts.filter(item => item.stage === 'prepare-range').length, 1)
assert.equal(receiptFacts.filter(item => item.stage === 'finalize').length, 2)
for (const page of report.pages) {
  assert.equal(page.lineReconciliation.printed, page.lineReconciliation.md)
  for (const item of [page.FIRST, page.candidatePrefinalize]) {
    add(item)
    assert.equal(fs.statSync(item.path).mode & 0o777, 0o444)
  }
  add(page.FIRSTSeal)
  add(page.candidateSeal)
  assert.equal(page.actualOrder.FIRSTBeforeCandidateCreation, true)
  assert.equal(page.actualOrder.candidateBeforeFinalize, true)
}
for (const item of report.addenda) {
  add(item)
  assert.equal(fs.statSync(item.path).mode & 0o777, 0o444)
}
const collectionRoot = path.join(tmp, 'source149150-author-collection-06')
fs.mkdirSync(collectionRoot)
const collectionFile = path.join(collectionRoot, 'collection.json')
save(collectionFile, {
  status: 'AUTHOR_ONLY_SOURCE149150_AWAITS_INDEPENDENT_REVIEW',
  report: bind(reportFile), scope: report.scope, receiptFacts,
  imageBudget: report.imageBudget, observedBoundaries: report.observedBoundaries,
  provenanceCorrection: {
    affectedReportFields: ['observedBoundaries.priorContext',
      'observedBoundaries.priorEncodingCautions', 'observedBoundaries.prior142And147148'],
    actual: 'Parent delegation supplied parent-collected Huygens AUTHOR_ONLY147148 text. It was not direct human-supplied source evidence or independent approval.',
    originalReportUnchanged: true,
  },
  pages: report.pages.map(page => ({
    physicalPage: page.physicalPage, printedPage: page.printedPage,
    lineReconciliation: page.lineReconciliation,
    FIRST: page.FIRST, candidatePrefinalize: page.candidatePrefinalize,
    crops: page.crops, actualOrder: page.actualOrder,
  })),
  revisions: report.revisions, failures: report.failures, addenda: report.addenda,
  parentReadOnlyDiagnostics: [{
    command: 'jq projection using snake-case execution_receipts on this camelCase report',
    exitCode: 5, stderr: 'Cannot iterate over null',
    observedInPrecedingContext: true, reconstructedReceipt: false,
    producerReplay: false, diagnosis: 'Projection schema mismatch; subsequent camelCase read succeeded.',
  }],
  completedChildReportsAllOwnSessionsEnded: true,
  independentReviewPending: true, sourceProducerReplays: 0,
  wholeLessonApproved: false, parentImageLoads: 0, published: false,
})
references.set(collectionFile, bind(collectionFile))
const collector = path.join(tmp, 'collect-source149150-author-06.mjs')
references.set(collector, bind(collector))
const retained = retainCurrent6g(
  'evidence/stemrobin188-6g-source149150/author-first06',
  [...references.values()], [],
  {
    status: 'AUTHOR_ONLY_SOURCE149150_AWAITS_INDEPENDENT_REVIEW',
    physicalPages: [149, 150], chargedImages: 7, originals: 2, nativeFigures: 2,
    detailCropViews: 3, gridsLoaded: 0, reopens: 0, nativePrepareCalls: 1,
    nativeFinalizeCalls: 2, productionFailures: 0, imageFailures: 0,
    contentRepairs: 0, helperRepairs: 0, readOnlyAuthorDiagnostics: 1,
    parentHistoricalProjectionDiagnostic: 1, provenanceCorrectionRecorded: true,
    actual149HeadingsAuthorOnly: report.observedBoundaries.actual149,
    nextUnitBoundaryUnknown: true, glyphAndProofMarkUnknownsPreserved: true,
    sourcePDFAndRuntimeNotCopied: true,
  },
)
console.log(JSON.stringify({ collection: bind(collectionFile), retained }))
