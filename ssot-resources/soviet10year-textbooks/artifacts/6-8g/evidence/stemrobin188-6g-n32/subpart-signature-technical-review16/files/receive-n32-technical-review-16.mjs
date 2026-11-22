import assert from 'node:assert/strict'
import path from 'node:path'
import { tmp, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'
import { retainCurrent6g } from './retain-current-6g-evidence-03.mjs'

const file = path.join(tmp, 'n32-subpart-validator-technical-review-16/manifest.json')
assert.equal(hash(file), '1efbb1095e03454bef613be21f1c8b31a33d1058b091877016a68eaea5f1fdac')
const manifest = read(file)
assert.equal(manifest.status, 'COMPLETE_CHANGES_REQUESTED')
assert.deepEqual(manifest.activeExecSessions, [])
const references = [bind(file), ...Object.values(manifest.reviewedBindings),
  ...Object.values(manifest.artifacts)]
for (const item of references) assert.equal(hash(item.path), item.sha256, item.path)
const record = {
  status: 'N32_SUBPART_SIGNATURE_REPAIR1_INDEPENDENT_CHANGES_REQUESTED_RECEIVED',
  manifest: bind(file), findings: manifest.findings, report: manifest.artifacts.report,
  rejectedCode: manifest.reviewedBindings.afterCode,
  failedCounterexamples: manifest.artifacts.newExecutionReceipt,
  fourDemonstratedFailuresPreserved: true, furtherDependentNativeStagesHeld: true,
  parentImageLoads: 0, wholeLessonApproved: false, published: false,
}
const recordFile = path.join(tmp, 'n32-subpart-technical-review-received-16.json')
save(recordFile, record)
references.push(bind(recordFile), bind(path.join(tmp, 'receive-n32-technical-review-16.mjs')))
console.log(JSON.stringify(retainCurrent6g(
  'evidence/stemrobin188-6g-n32/subpart-signature-technical-review16', references,
  ['evidence/stemrobin188-6g-n32/modern-signature-technical-recovery16/retention.json'], record)))
