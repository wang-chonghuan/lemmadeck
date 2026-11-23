import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { repo, tmp, read, hash, bind } from './retain-scoped-evidence-02.mjs'
import { retainCurrent6g } from './retain-current-6g-evidence-03.mjs'

assert.equal(process.cwd(), repo)
const file = path.join(tmp, 'n30-errata-proposals-independent-review-18/manifest.json')
assert.equal(hash(file), 'eab0f779ec49b2a116e7ad9bafd2cfa4e7c3714b274e24e44a338942cac1bda8')
const manifest = read(file)
assert.equal(manifest.status, 'pass')
const refs = [bind(file)]
for (const item of [...manifest.files, ...manifest.inputBindings]) {
  assert.equal(hash(item.path), item.sha256, item.path)
  if (item.modeOctal === '0444') assert.equal(fs.statSync(item.path).mode & 0o777, 0o444)
  refs.push({ path: item.path, sha256: item.sha256 })
}
console.log(JSON.stringify(retainCurrent6g(
  'evidence/stemrobin188-6g-n30/errata-proposals-independent18',
  [...refs, bind(path.join(tmp, 'receive-n30-errata-approval-18.mjs'))],
  ['evidence/stemrobin188-6g-n30/errata-source-FIRST18/retention.json',
    'evidence/stemrobin188-6g-n30/text-author-first18/retention.json'],
  {
    status: 'EXACT_TWO_SOURCE_BOUND_ERRATA_INDEPENDENT_PASS',
    approvedIds: manifest.approvedIds, counts: manifest.imageCounts,
    registrationNotYetRun: true, wholeTextAndAnswersPending: true,
  },
)))
