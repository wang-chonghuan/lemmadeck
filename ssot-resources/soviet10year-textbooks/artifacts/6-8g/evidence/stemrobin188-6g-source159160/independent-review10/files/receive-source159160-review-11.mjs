import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { repo, tmp, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'
import { retainCurrent6g } from './retain-current-6g-evidence-03.mjs'

const root = path.join(tmp, 'source159160-independent-review-10')
const reportFile = path.join(root, 'report.json')
const manifestFile = path.join(root, 'manifest.json')
assert.equal(hash(reportFile), 'ae0ae17e6c81a0434e70407e132491e4b04cf8ad8812c5cdfd988eedd559a6db')
assert.equal(hash(manifestFile), '1a916db429b8a19bc3022baa1c534335a8108f885cfd6f06aea054124b26c629')
const report = read(reportFile)
const manifest = read(manifestFile)
assert.deepEqual(report.defects.map(d => d.id),
  ['159-ex445-printed-period', '160-U25BC-mechanical'])
assert.equal(manifest.execution.activeExecSessions.length, 0)
assert.equal(fs.statSync(manifest.firstLock.path).mode & 0o777, 0o444)
const references = [bind(reportFile), bind(manifestFile),
  ...manifest.inputs, ...manifest.outputs]
for (const reference of references)
  assert.equal(hash(reference.path), reference.sha256, reference.path)
for (const item of manifest.receiptStreamBindings) {
  const receipt = read(item.receipt.path)
  assert.equal(receipt.cwd, repo)
  assert.equal(receipt.exitCode, item.exitCode)
  assert.deepEqual(receipt.argv, item.argv)
  for (const stream of Object.values(item.streams))
    assert.equal(hash(stream.path), stream.sha256)
}
const own = path.join(tmp, 'receive-source159160-review-11')
fs.mkdirSync(own)
const record = {
  status: report.status, report: bind(reportFile), defects: report.defects,
  holds: report.holds, scope: report.scope, counters: manifest.counters,
  actualFirstLock: manifest.firstLock,
  unchangedPASS: ['159 readable text except one445 period',
    '160 readable text and table', '213 source crop and ownership', '33 actual right boundary'],
  source159CorrectionNeeded: 'Only p0159#4 /blocks/3/lines/0 printed period',
  source160MechanicalFailPreserved: true, wholeLessonApproved: false,
  originalFIRSTFailuresAndCountersPreserved: true, parentImageLoads: 0,
  producerReplays: 0, published: false,
}
const recordFile = path.join(own, 'record.json')
save(recordFile, record)
references.push(bind(recordFile), bind(path.join(tmp, 'receive-source159160-review-11.mjs')))
console.log(JSON.stringify(retainCurrent6g(
  'evidence/stemrobin188-6g-source159160/independent-review10',
  references, ['evidence/stemrobin188-6g-source159160/author-first09/retention.json'], record,
)))
