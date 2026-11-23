import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { tmp, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'
import { retainCurrent6g } from './retain-current-6g-evidence-03.mjs'

const root = path.join(tmp, 'source159-period-affected-review-11')
const reportFile = path.join(root, 'report.json')
const manifestFile = path.join(root, 'manifest.json')
assert.equal(hash(reportFile), '29a73a9d6f73fea4eeb490ca7cee01f23b5b986287f494f9218b9df4fbf56d4f')
assert.equal(hash(manifestFile), '23982f791b143b32f16912f088e514b94bcae2c288b23f5ba4434a793b495ad0')
const report = read(reportFile)
const manifest = read(manifestFile)
assert.equal(report.status, 'SOURCE159_PERIOD_AFFECTED_PASS_SOURCE160_MECHANICAL_FAIL_HOLDS_PRESERVED')
assert.equal(report.reviewCompleted, true)
assert.equal(report.execution.activeExecSessions.length, 0)
assert.equal(report.execution.image0, true)
assert.equal(report.wholeLessonApproved, false)
assert.equal(report.source160FinalizationApproved, false)
const references = [bind(reportFile), bind(manifestFile), ...manifest.inputs]
for (const reference of references)
  assert.equal(hash(reference.path), reference.sha256, reference.path)
const own = path.join(tmp, 'receive-source159-affected-review-11')
fs.mkdirSync(own)
const record = {
  status: report.status, report: bind(reportFile), scope: report.scope,
  affectedRepair: report.affectedRepair, mechanical159: report.mechanical159,
  preservedEvidence: report.preservedEvidence,
  reusedIndependentEvidence: report.reusedIndependentEvidence,
  originalFIRSTAndAllUnknownsPreserved: true,
  producerReplays: 0, imageLoads: 0, source160FinalizationApproved: false,
}
const recordFile = path.join(own, 'record.json')
save(recordFile, record)
references.push(bind(recordFile), bind(path.join(tmp, 'receive-source159-affected-review-11.mjs')))
console.log(JSON.stringify(retainCurrent6g(
  'evidence/stemrobin188-6g-source159160/period-affected-review11', references,
  ['evidence/stemrobin188-6g-source159160/author-first09/retention.json',
    'evidence/stemrobin188-6g-source159160/independent-review10/retention.json',
    'evidence/stemrobin188-6g-source159160/period-repair11/retention.json'], record,
)))
