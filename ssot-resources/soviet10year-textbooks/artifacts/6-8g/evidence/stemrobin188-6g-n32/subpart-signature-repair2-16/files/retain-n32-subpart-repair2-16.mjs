import assert from 'node:assert/strict'
import path from 'node:path'
import { repo, tmp, read, hash, bind } from './retain-scoped-evidence-02.mjs'
import { retainCurrent6g } from './retain-current-6g-evidence-03.mjs'

const own = path.join(tmp, 'n32-subpart-signature-repair2-16')
const recordFile = path.join(own, 'record.json')
const record = read(recordFile)
assert.equal(record.status, 'SUBPART_SIGNATURE_REPAIR2_TARGETED_TESTS_PASS_INDEPENDENT_REVIEW_PENDING')
const references = [bind(recordFile), record.currentCode, record.unchangedExercise,
  record.priorRejectedCode, record.priorRejectedReview,
  bind(path.join(tmp, 'check-n32-subpart-repair2-16.mjs')),
  bind(path.join(repo, '.claude/skills/ld-s10y-lesson/tests/test_subpart_label_signature.py')),
  bind(path.join(tmp, 'n32-modern-technical-recovery-16/test_subpart_label_signature.revision1.py')),
  bind(path.join(tmp, 'retain-n32-subpart-repair2-16.mjs'))]
for (const receipt of [record.tests, record.sourceContract]) {
  references.push(receipt)
  const actual = read(receipt.path)
  assert.equal(actual.exitCode, 0)
  for (const stream of Object.values(actual.streams)) references.push(stream)
}
for (const item of references) assert.equal(hash(item.path), item.sha256, item.path)
console.log(JSON.stringify(retainCurrent6g(
  'evidence/stemrobin188-6g-n32/subpart-signature-repair2-16', references,
  ['evidence/stemrobin188-6g-n32/subpart-signature-technical-review16/retention.json',
    'evidence/stemrobin188-6g-n32/modern-signature-technical-recovery16/retention.json'], record)))
