import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { repo, tmp, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'
import { retainCurrent6g } from './retain-current-6g-evidence-03.mjs'

const own = path.join(tmp, 'source6g139140-author-first-04')
const reportFile = path.join(own, 'Report.json')
assert.equal(hash(reportFile), 'd0cff8f0c27c9808146c779bd0c8668fae58eed48a1feba5c23e78f79c71937a')
const report = read(reportFile)
assert.equal(report.status, 'AUTHOR_ONLY')
assert.deepEqual(report.physical_range, [139, 140])
const references = new Map([[reportFile, bind(reportFile)]])
function gather(value) {
  if (!value || typeof value !== 'object') return
  if (value.path && value.sha256) {
    const file = path.resolve(repo, value.path)
    assert.ok(file.startsWith(repo + '/'), file)
    assert.ok(!file.split('/').some(part => ['.env', 'node_modules', '.git', '.venv'].includes(part)))
    assert.equal(hash(file), value.sha256, file)
    references.set(file, { path: file, sha256: value.sha256 })
  }
  for (const child of Object.values(value)) gather(child)
}
gather(report)
gather(read(report.receipt_manifest.path))
const receiptFacts = [report.preparation.receipt,
  ...report.pages.map(page => page.chronology.finalize_receipt)].map(item => {
  const actual = read(item.path)
  assert.equal(actual.cwd, repo)
  assert.equal(actual.exit_code, 0)
  gather(actual.streams)
  return { receipt: bind(item.path), exitCode: actual.exit_code, replayed: false }
})
for (const page of report.pages) {
  assert.equal(fs.statSync(page.FIRST.path).mode & 0o777, 0o444)
  assert.equal(fs.statSync(page.candidate_before_finalize.path).mode & 0o777, 0o444)
  assert.ok(Date.parse(page.chronology.first_stat_hash_completed_at) <
    fs.statSync(page.md.path).birthtimeMs)
}
for (const name of ['receipt.py', 'build_report.py']) {
  const file = path.join(own, name)
  references.set(file, bind(file))
}
const collectionRoot = path.join(tmp, 'source139140-author-collection-04')
fs.mkdirSync(collectionRoot)
const collectionFile = path.join(collectionRoot, 'collection.json')
save(collectionFile, {
  schema: 'same188/source-author-collection@1', status: 'AUTHOR_ONLY',
  report: bind(reportFile), pages: [139, 140], actualFirstModes: '0444',
  receiptFacts, counters: report.counters,
  authorBoundaries: report.boundaries, unresolved: report.unresolved_literals,
  incoming138StillAuthorOnly: true,
  independentReviewInputsDeferredUntil137138SourceContextAvailable: true,
  sourceReopensByParent: 0, wholeUnitApproved: false, promoted: false, published: false,
})
references.set(collectionFile, bind(collectionFile))
const scriptFile = path.join(tmp, 'collect-source139140-author-04.mjs')
references.set(scriptFile, bind(scriptFile))
const retained = retainCurrent6g(
  'evidence/stemrobin188-6g-source139140/author-first04',
  [...references.values()], [],
  { schema: 'same188/source-author-retention@1', status: 'AUTHOR_ONLY',
    pages: [139, 140], chargedImages: 7, loadedImages: 6,
    chargedDetailGenerationFailurePreserved: 1,
    nativePrepareInvocations: 1, nativeFinalizeInvocations: 2,
    authorContentRevisions: 0, nativeReplays: 0,
    sourcePDFAndRuntimeReferencesOnlyNoCopies: true },
)
console.log(JSON.stringify({ collection: bind(collectionFile), retained }))
