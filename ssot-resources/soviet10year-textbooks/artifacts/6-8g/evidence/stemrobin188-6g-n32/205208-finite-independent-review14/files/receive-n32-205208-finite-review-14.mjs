import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { tmp, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'
import { retainCurrent6g } from './retain-current-6g-evidence-03.mjs'

const manifestFile = path.join(tmp, 'n32-205-first-208-binding-finite-grading-review-14/manifest.json')
assert.equal(hash(manifestFile), 'ecfded2e7fac8b7f44df93407e73d86c4c39391c07740b90e0a847768c2e6e62')
const manifest = read(manifestFile)
assert.equal(hash(manifest.report.path), 'b59439bd81abf590404cafd2df7856435f5abf7c98673922cf419deb1a33142b')
assert.deepEqual(manifest.activeExecSessions, [])
assert.equal(manifest.A.status, 'PASS')
assert.equal(manifest.B.status, 'PASS_AFFECTED_BINDING_ONLY')
assert.equal(manifest.C.status, 'PASS_AFFECTED_FINITE_AUTO_EXACT_ONLY')
assert.equal(manifest.imageLedger.chargedAttempts, 4)
const references = [bind(manifestFile), manifest.report, ...manifest.ownOutputBindings]
function bindings(value) {
  if (!value || typeof value !== 'object') return
  if (value.path && value.sha256 && path.isAbsolute(value.path)) references.push(value)
  for (const child of Object.values(value)) bindings(child)
}
for (const scope of ['independentFirstLocks', 'A', 'B', 'C']) bindings(manifest[scope])
for (const item of new Map(references.map(item => [item.path, item])).values())
  assert.equal(hash(item.path), item.sha256, item.path)
for (const field of ['first', 'inventory'])
  assert.equal(fs.statSync(manifest.independentFirstLocks[field].path).mode & 0o777, 0o444)
const own = path.join(tmp, 'receive-n32-205208-finite-review-14')
fs.mkdirSync(own)
const recordFile = path.join(own, 'record.json')
const record = {
  status: 'FIG205_FIRST_FULL_PASS_FIG208_BINDING_PASS_FOUR_FINITE_GRADING_PASS',
  manifest: bind(manifestFile), report: manifest.report,
  fig205Current: manifest.A.currentOutputBindings,
  fig205Revision: 2, fig208Revision: 2, fig208NewGeometryRevisions: 0,
  finiteGradingOnlyRevisions: manifest.C.gradingOnlyRevisions,
  proofRevisions: manifest.C.preservedProofRevisions,
  oldFIRSTsFailuresAndUNKNOWNPreserved: true,
  imageLedger: manifest.imageLedger,
  noProducerReplay: true, noEditorReplay: true, promotionPerformed: false,
  fullNineFinalizationPerformed: false, parentImageLoads: 0, wholeLessonApproved: false,
  firstReceptionFailure: {
    exitCode: 1, toolChunk: 'c96c3e',
    cause: 'Incorrect generic PASS equality rejected the actual qualified affected PASS status before any writes.',
    originalScript: bind(path.join(tmp, 'receive-n32-205208-finite-review-14.FIRSTFAIL.mjs')),
    producerOrReviewReplayed: false,
  },
}
save(recordFile, record)
references.push(bind(recordFile), bind(path.join(tmp, 'receive-n32-205208-finite-review-14.mjs')),
  record.firstReceptionFailure.originalScript)
console.log(JSON.stringify(retainCurrent6g(
  'evidence/stemrobin188-6g-n32/205208-finite-independent-review14', references,
  [
    'evidence/stemrobin188-6g-n32/fig205-label-revision2-author13/retention.json',
    'evidence/stemrobin188-6g-n32/208-text-binding-revision2-13/retention.json',
    'evidence/stemrobin188-6g-n32/finite-grading-revision1-14/retention.json',
    'evidence/stemrobin188-6g-n32/independent-nineanswers-text-207208-review12/retention.json',
  ], record)))
