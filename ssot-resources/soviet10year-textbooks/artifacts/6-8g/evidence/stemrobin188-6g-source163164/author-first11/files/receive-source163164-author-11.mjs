import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { repo, tmp, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'
import { retainCurrent6g } from './retain-current-6g-evidence-03.mjs'

const root = path.join(tmp, 'source6g163164-author-first-11')
const manifestFile = path.join(root, 'MANIFEST.json')
assert.equal(hash(manifestFile), '79f75a85a37cff1dceff741d5b180b50241b69f57be181da9ec6d55ef86326f2')
const manifest = read(manifestFile)
assert.equal(manifest.ledger.source_author_active_sessions, 0)
assert.equal(manifest.ledger.charged_images, 2)
const references = [...manifest.files, bind(manifestFile)]
for (const reference of references)
  assert.equal(hash(reference.path), reference.sha256, reference.path)
for (const first of manifest.firstlocks) {
  for (const file of first.source.files) {
    assert.equal(fs.statSync(file.path).mode & 0o777, 0o444)
    assert.equal(hash(file.path), file.sha256)
  }
}
for (const [index, name] of ['prepare-range', 'finalize0163', 'finalize0164'].entries()) {
  const receipt = read(path.join(root, name + '.receipt.json'))
  const expected = manifest.actual_executions[index]
  assert.equal(receipt.cwd, repo)
  assert.equal(receipt.exitCode, expected.exitCode)
  assert.deepEqual(receipt.argv, expected.argv)
  for (const stream of Object.values(receipt.streams))
    assert.equal(hash(stream.path), stream.sha256)
}
const own = path.join(tmp, 'receive-source163164-author-11')
fs.mkdirSync(own)
const record = {
  status: 'SOURCE163164_NATIVE_PASS_AUTHOR_ONLY_RECEIVED',
  report: bind(path.join(root, 'REPORT.md')),
  firstlocks: manifest.firstlocks, actualExecutions: manifest.actual_executions,
  ledger: manifest.ledger,
  sourceInventories: [163, 164].map(page =>
    read(path.join(root, `source/0${page}.inventory.json`))),
  originalFIRSTsUnknownsAndUsagePreserved: true,
  independentReview: false, modernAssetsPromoted: false,
  wholeLessonApproved: false, parentImageLoads: 0, producerReplays: 0,
}
const recordFile = path.join(own, 'record.json')
save(recordFile, record)
references.push(bind(recordFile), bind(path.join(tmp, 'receive-source163164-author-11.mjs')))
console.log(JSON.stringify(retainCurrent6g(
  'evidence/stemrobin188-6g-source163164/author-first11', references, [], record,
)))
