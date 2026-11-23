import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { repo, tmp, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'
import { retainCurrent6g } from './retain-current-6g-evidence-03.mjs'

const own = path.join(tmp, 'source6g141142-author-first-05')
const reportFile = path.join(own, 'Report.json')
assert.equal(hash(reportFile), '9654c40143918070633405d8cad2c5e52b5cc1ab31298fbc2efb70645241a471')
const report = read(reportFile)
assert.equal(report.status, 'AUTHOR_ONLY')
assert.deepEqual(report.physical_pages, [141, 142])
assert.equal(report.constraints_observed.ongoing_owned_exec_sessions, 0)
const references = new Map([[reportFile, bind(reportFile)]])
const historicalCandidateBindings = []
function gather(value) {
  if (!value || typeof value !== 'object') return
  if (value.path && value.sha256) {
    assert.ok(value.path.startsWith(repo + '/'), value.path)
    assert.ok(!value.path.split('/').some(part =>
      ['.env', '.git', '.venv', 'node_modules'].includes(part)), value.path)
    const actual = hash(value.path)
    if (actual !== value.sha256) {
      const page = report.pages.find(item =>
        item.finalized['page.md'].path === value.path &&
        item.candidate_before_finalize.sha256 === value.sha256)
      assert.ok(page, value.path)
      assert.equal(hash(page.candidate_before_finalize.path), value.sha256)
      historicalCandidateBindings.push({ historical: value,
        exactHistoricalBytes: page.candidate_before_finalize,
        current: { path: value.path, sha256: actual } })
      references.set(page.candidate_before_finalize.path,
        { path: page.candidate_before_finalize.path, sha256: value.sha256 })
      return
    }
    references.set(value.path, { path: value.path, sha256: value.sha256 })
  }
  for (const child of Object.values(value)) gather(child)
}
for (const key of ['scope', 'pages', 'figure', 'receipt_bindings',
  'execution', 'image_ledger', 'failures', 'chronology']) gather(report[key])
const receipts = ['prepare141142', 'finalize141', 'finalize142'].map(name => {
  const file = path.join(own, 'receipts', name + '.json')
  const actual = read(file)
  assert.equal(actual.cwd, repo)
  assert.equal(actual.exit_code, 0)
  gather(actual.streams)
  return { receipt: bind(file), exitCode: 0, replayed: false }
})
for (const page of report.pages) {
  assert.equal(fs.statSync(page.FIRST.path).mode & 0o777, 0o444)
  assert.equal(fs.statSync(page.candidate_before_finalize.path).mode & 0o777, 0o444)
  const seal = read(page.FIRST_seal_receipt.path)
  const snapshot = read(page.candidate_snapshot_receipt.path)
  assert.ok(Date.parse(seal.stat_and_hash_completed_at) < Date.parse(snapshot.started_at))
}
for (const name of fs.readdirSync(own).filter(name => /\.(py|mjs)$/.test(name))) {
  const file = path.join(own, name)
  references.set(file, bind(file))
}
const collectionRoot = path.join(tmp, 'source141142-author-collection-05')
fs.mkdirSync(collectionRoot)
const collectionFile = path.join(collectionRoot, 'collection.json')
save(collectionFile, {
  status: 'AUTHOR_ONLY', report: bind(reportFile), physicalPages: [141, 142],
  actualFirstModes: '0444', receipts, counters: report.counters,
  boundaries: report.boundaries, holds: report.local_holds,
  incoming140AuthorOnlyNotHumanOrIndependentlyApproved: true,
  localHoldWordingCorrection: 'No independent141142 source reviewer is in flight yet; the current independent reviewer owns166167 only.',
  reportTruncatedByToolNotSourceFailure: true,
  parentProjectionFailure: { toolOutput: 'deaa5e', exitCode: 5,
    diagnosis: 'Optional absent receipts key passed to jq keys; actual receipt_bindings/execution projected next.',
    sourceOrProducerChanged: false },
  sourcePDF: report.source_pdf, sourcePDFReferenceOnly: true,
  historicalCandidateBindings,
  parentImageLoads: 0, wholeUnitApproved: false, promoted: false, published: false,
})
references.set(collectionFile, bind(collectionFile))
references.set(path.join(tmp, 'collect-source141142-author-05.mjs'),
  bind(path.join(tmp, 'collect-source141142-author-05.mjs')))
for (const name of ['failure-01.json', 'failed-collector-01.mjs']) {
  const file = path.join(tmp, 'source141142-collection-recovery-05', name)
  references.set(file, bind(file))
}
const retained = retainCurrent6g(
  'evidence/stemrobin188-6g-source141142/author-first05',
  [...references.values()], [],
  { status: 'AUTHOR_ONLY', physicalPages: [141, 142],
    chargedImages: 6, loadedImages: 5, imageRelatedFailure: 1,
    originalFailureAndFirstSealsPreserved: true, nativePrepareCalls: 1,
    nativeFinalizeCalls: 2, sourceContentRevisions: 0,
    sourcePDFAndRuntimeReferencesOnlyNoCopies: true,
    independentSourceReviewPending: true, wholeUnitApproved: false },
)
console.log(JSON.stringify({ collection: bind(collectionFile), retained,
  boundaries: report.boundaries, counters: report.counters }))
