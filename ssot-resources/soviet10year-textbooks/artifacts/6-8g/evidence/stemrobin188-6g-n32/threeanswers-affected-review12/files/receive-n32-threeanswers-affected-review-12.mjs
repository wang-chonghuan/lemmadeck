import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { tmp, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'
import { retainCurrent6g } from './retain-current-6g-evidence-03.mjs'

const root = path.join(tmp, 'n32-threeanswers-affected-review-12')
const manifestFile = path.join(root, 'manifest.json')
assert.equal(hash(manifestFile), '44f1e70dd2d01c6b59bd625e441eec68a1206bd57892aa5a9635b6d958c7ce66')
const manifest = read(manifestFile)
assert.equal(hash(manifest.report.path), '0025607a15a80f1871253bbace00149b587da756dc4920c3c18bcdad72067e19')
assert.deepEqual(manifest.activeExecSessions, [])
assert.equal(manifest.status, 'AFFECTED_REVIEW_COMPLETE_440_PROOF_FAIL')
const references = [bind(manifestFile), bind(manifest.report.path), ...manifest.actualReadInputs]
for (const item of references) assert.equal(hash(item.path), item.sha256, item.path)
const record = {
  status: manifest.status, report: manifest.report,
  perExercise: manifest.newEvidence.perExercise,
  scope: manifest.scope, currentImageLedger: manifest.currentImageLedger,
  source437438ProofsPASSReusable: true,
  source440ProofFAILRevision1Preserved: true, secondContentRevisionNotAuthorized: true,
  originalFIRSTsFailuresAndUnknownsPreserved: true,
  noProducerReplays: true, parentImageLoads: 0, wholeLessonApproved: false,
}
const own = path.join(tmp, 'receive-n32-threeanswers-affected-review-12')
fs.mkdirSync(own)
const recordFile = path.join(own, 'record.json')
save(recordFile, record)
references.push(bind(recordFile), bind(path.join(tmp, 'receive-n32-threeanswers-affected-review-12.mjs')))
console.log(JSON.stringify(retainCurrent6g(
  'evidence/stemrobin188-6g-n32/threeanswers-affected-review12', references,
  ['evidence/stemrobin188-6g-n32/independent-nineanswers-text-207208-review12/retention.json',
    'evidence/stemrobin188-6g-n32/threeanswers-affected-repair12/retention.json'],
  record,
)))
