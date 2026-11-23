import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { repo, tmp, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'
import { retainCurrent6g } from './retain-current-6g-evidence-03.mjs'

assert.equal(process.cwd(), repo)
const author = path.join(tmp, 'source6g157158-author-first-09')
const reportFile = path.join(author, 'Report.json')
const manifestFile = path.join(author, 'manifest.json')
assert.equal(hash(reportFile), 'c2b3a4f1e6c980732d64b5b8e332214a05f72898b404342f16808a480215cff4')
assert.equal(hash(manifestFile), '949292e88d1e50528b272ee054d69e1ff72373cdc9ee81e05049181c4fca748b')
const report = read(reportFile)
assert.equal(report.status, 'AUTHOR_ONLY')
assert.equal(report.preservation.own_exec_sessions_running, 0)
assert.deepEqual(report.scope.physical_pages, [157, 158])
const refs = [bind(reportFile), bind(manifestFile)]
for (const item of read(manifestFile).files) {
  assert.ok(item.path.startsWith(author + path.sep))
  assert.equal(hash(item.path), item.sha256)
  refs.push(bind(item.path))
}
for (const page of report.pages) {
  for (const item of [page.source_first, page.pre_finalize_snapshot]) {
    const file = path.join(author, item.path)
    assert.equal(hash(file), item.sha256)
    assert.equal(fs.statSync(file).mode & 0o777, 0o444)
  }
  const receiptFile = path.join(author, page.finalize.execution)
  assert.equal(hash(receiptFile), page.finalize.execution_sha256)
  const receipt = read(receiptFile)
  assert.equal(receipt.cwd, repo)
  assert.equal(receipt.exitCode, 0)
  assert.equal(page.finalize.invocations, 1)
  assert.equal(page.finalize.machine_lines_printed, page.finalize.machine_lines_md)
  for (const stream of Object.values(receipt.streams))
    assert.equal(hash(stream.path), stream.sha256)
}
const own = path.join(tmp, 'receive-source157158-author-09')
fs.mkdirSync(own)
const record = {
  status: 'SOURCE157158_AUTHOR_ONLY_RECEIVED_INDEPENDENT_SOURCE_PENDING',
  report: bind(reportFile), pages: report.pages, counters: report.image_counters,
  boundaryFacts: report.boundary_facts,
  sealedEvidenceOnly: 'Source-FIRST and pre-finalize snapshots are0444; working page.md/json remain0644, contrary to the overbroad final text.',
  sourceProducerReplays: 0, preparationReplayed: false,
  wholeLessonApproved: false, parentImageLoads: 0, published: false,
}
const file = path.join(own, 'record.json')
save(file, record)
refs.push(bind(file), bind(path.join(tmp, 'receive-source157158-author-09.mjs')))
const retained = retainCurrent6g('evidence/stemrobin188-6g-source157158/author-first09', refs, [], record)
console.log(JSON.stringify({ record: bind(file), retained }))
