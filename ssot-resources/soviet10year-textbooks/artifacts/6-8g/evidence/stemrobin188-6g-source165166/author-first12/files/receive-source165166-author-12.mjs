import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { repo, tmp, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'
import { retainCurrent6g } from './retain-current-6g-evidence-03.mjs'

const root = path.join(tmp, 'source6g165166-author-first-11')
const reportFile = path.join(root, 'report.json')
const manifestFile = path.join(root, 'manifest.json')
assert.equal(hash(reportFile), 'c83dfa4696151a8b38ec6f8358d134c2b78615aba346c0db3df7861ed3c1203f')
assert.equal(hash(manifestFile), '24d570851dc5f9a1ae27f17256f9921e4b3128b9c12aff70648324ec80fcf617')
const report = read(reportFile)
const manifest = read(manifestFile)
assert.deepEqual(report.activeExecSessionsAtAuthorFinish, [])
assert.equal(report.images.chargedRequests, 2)
assert.equal(report.counters.contentRevisionsUsed, 0)
const references = [...manifest.files, bind(reportFile), bind(manifestFile)]
for (const file of references) assert.equal(hash(file.path), file.sha256, file.path)
for (const first of report.FIRST) {
  for (const item of [first.FIRST, first.inventory]) {
    const file = path.join(root, item.path)
    assert.equal(fs.statSync(file).mode & 0o777, 0o444)
    assert.equal(hash(file), item.sha256)
  }
}
for (const page of report.pages) {
  const receipt = read(page.nativeReceipt.path)
  assert.equal(receipt.cwd, repo)
  assert.equal(receipt.exitCode, page.nativeExitCode)
  assert.equal(receipt.exitCode, 1)
  assert.ok(receipt.argv.includes('finalize'))
  assert.equal(receipt.argv[receipt.argv.indexOf('--page') + 1], String(page.physicalPage))
  for (const stream of Object.values(receipt.streams))
    assert.equal(hash(stream.path), stream.sha256)
}
const own = path.join(tmp, 'receive-source165166-author-12')
fs.mkdirSync(own)
const record = {
  status: 'SOURCE165166_AUTHOR_ONLY_NATIVE_FAILURES_RECEIVED',
  report: bind(reportFile), manifest: bind(manifestFile),
  FIRST: report.FIRST, boundaries: report.boundaries,
  pages: report.pages.map(page => ({
    physicalPage: page.physicalPage, nativeExitCode: page.nativeExitCode,
    nativeErrors: page.nativeErrors, nativePrintedRows: page.nativePrintedRows,
    nativeBlockRows: page.nativeBlockRows, contentRevisionsUsed: page.contentRevisionsUsed,
    nativeReceipt: page.nativeReceipt,
  })),
  images: report.images, counters: report.counters,
  originalFIRSTsUnknownsDraftsAndFailuresPreserved: true,
  independentReview: false, parentImageLoads: 0, producerReplays: 0,
}
const recordFile = path.join(own, 'record.json')
save(recordFile, record)
references.push(bind(recordFile), bind(path.join(tmp, 'receive-source165166-author-12.mjs')))
console.log(JSON.stringify(retainCurrent6g(
  'evidence/stemrobin188-6g-source165166/author-first12', references, [], record,
)))
