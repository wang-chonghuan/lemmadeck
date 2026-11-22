import assert from 'node:assert/strict'
import path from 'node:path'
import { tmp, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'
import { retainCurrent6g } from './retain-current-6g-evidence-03.mjs'

const file = path.join(tmp, 'n32-repair2-and-four-surfaces-independent-review-16/manifest.json')
assert.equal(hash(file), 'aa08186d786d905939f17fc07266dab5adc53ef5407e9406b7105b5a67e11838')
const manifest = read(file)
assert.equal(manifest.status, 'COMPLETE_CODE_CHANGES_REQUESTED_FOUR_OFFLINE_SURFACES_PASS')
assert.equal(manifest.partA.verdict, 'CHANGES_REQUESTED')
assert.equal(manifest.partB.verdict, 'FOUR_OFFLINE_SURFACES_PASS')
assert.ok(manifest.partB.surfaces.every(item => item.verdict === 'PASS'))
assert.deepEqual(manifest.activeExecSessions, [])
const references = [bind(file), ...Object.values(manifest.reviewedBindings),
  ...Object.values(manifest.artifacts),
  ...manifest.partB.surfaces.map(item => ({ path: item.screenshot, sha256: item.sha256 }))]
for (const item of references) assert.equal(hash(item.path), item.sha256, item.path)
const record = {
  status: 'N32_FOUR_OFFLINE_SURFACES_VISUAL_PASS_CODE_REPAIR2_COMPATIBILITY_HOLD',
  manifest: bind(file), codeReview: manifest.partA, surfaces: manifest.partB,
  imageLedger: manifest.imageCropLedger, testLedger: manifest.testLedger,
  clarification: 'Historical human-supplied result/authority wording refers to parent-agent-transmitted retained evidence, not new human authorization.',
  currentContentAndSurfacesUnchanged: true, furtherCodeRepairRequired: true,
  choiceSemanticAndChoiceDisplayPending: true,
  parentImageLoads: 0, wholeLessonApproved: false, published: false,
}
const recordFile = path.join(tmp, 'n32-repair2-surfaces-review-received-16.json')
save(recordFile, record)
references.push(bind(recordFile), bind(path.join(tmp, 'receive-n32-repair2-surfaces-review-16.mjs')))
console.log(JSON.stringify(retainCurrent6g(
  'evidence/stemrobin188-6g-n32/repair2-and-four-surfaces-review16', references,
  ['evidence/stemrobin188-6g-n32/subpart-signature-repair2-16/retention.json',
    'evidence/stemrobin188-6g-n32/surfaces15/retention.json'], record)))
