import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { repo, tmp, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'
import { retainCurrent6g } from './retain-current-6g-evidence-03.mjs'

assert.equal(process.cwd(), repo)
const author = path.join(tmp, 'source6g159160-author-first-09')
const reportFile = path.join(author, 'Report.json')
const manifestFile = path.join(author, 'Manifest.json')
const checksums = path.join(author, 'Manifest.sha256')
assert.equal(hash(reportFile), 'b83541a6de4c182f3b48152b8029178948e087066b7e6760b9e82ef5ffa8c1c1')
assert.equal(hash(manifestFile), 'f8a3a0fe6acc5913a15a0483c4e0177da98c6fa51f9b60582924d92c6980f753')
assert.equal(hash(checksums), '0fe0b1702aa6fc00e504e9d98a4c7309abe7c8c9835d79a2efeaa7cae0796a4c')
const report = read(reportFile)
assert.equal(report.role, 'AUTHOR_ONLY')
assert.deepEqual(report.scope.physical_pages, [159, 160])
assert.equal(report.execution.all_owned_exec_calls_completed, true)
assert.deepEqual(report.execution.owned_running_exec_sessions, [])
const refs = [bind(reportFile), bind(manifestFile), bind(checksums)]
for (const item of read(manifestFile).files) {
  assert.ok(item.path.startsWith(author + path.sep))
  assert.equal(hash(item.path), item.sha256)
  refs.push(bind(item.path))
}
for (const page of report.pages) {
  const receiptFile = path.join(author, page.finalize.receipt)
  assert.equal(hash(receiptFile), page.finalize.receipt_sha256)
  const receipt = read(receiptFile)
  assert.equal(receipt.cwd, repo)
  assert.equal(receipt.exitCode, page.finalize.exitCode)
  assert.equal(page.finalize.attempts, 1)
  for (const stream of Object.values(receipt.streams))
    assert.equal(hash(stream.path), stream.sha256)
  assert.equal(fs.statSync(path.join(author, page.finalize.pre_finalize_snapshot)).mode & 0o777, 0o444)
}
for (const item of report.source_FIRST.files)
  assert.equal(fs.statSync(path.join(author, item.path)).mode & 0o777, 0o444)
const own = path.join(tmp, 'receive-source159160-author-09')
fs.mkdirSync(own)
const record = {
  status: 'SOURCE159160_AUTHOR_ONLY_RECEIVED_SOURCE160_GLYPH_FAILURE_PRESERVED',
  report: bind(reportFile), pages: report.pages,
  boundaryFacts: report.actual_boundary_facts, imageUsage: report.image_usage,
  preparationAttributionCorrection: 'Duration1585ms was parent-supplied tool output, not human evidence; original report retained unchanged.',
  independentSourcePending: true, originalFailuresAndGlyphHoldsPreserved: true,
  sourceProducerReplays: 0, parentImageLoads: 0, wholeLessonApproved: false, published: false,
}
const file = path.join(own, 'record.json')
save(file, record)
refs.push(bind(file), bind(path.join(tmp, 'receive-source159160-author-09.mjs')))
const retained = retainCurrent6g('evidence/stemrobin188-6g-source159160/author-first09', refs, [], record)
console.log(JSON.stringify({ record: bind(file), retained }))
