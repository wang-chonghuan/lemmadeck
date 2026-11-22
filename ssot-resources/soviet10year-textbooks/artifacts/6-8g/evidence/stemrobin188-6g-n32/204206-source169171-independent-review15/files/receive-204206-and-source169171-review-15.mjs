import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { tmp, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'
import { retainCurrent6g } from './retain-current-6g-evidence-03.mjs'

const root = path.join(tmp, 'n32-204206-first-and-source169171-affected-review-14')
const manifestFile = path.join(root, 'manifest.json')
assert.equal(hash(manifestFile), '2c901cefe40562fbf91a8a8e56a54131089b65ce6fd333f6669137712176fa8b')
const manifest = read(manifestFile)
const report = manifest.outputs.find(item => item.name === 'report')
assert.equal(report.sha256, '870d70a4a82e9fd43c9775842552431044325a0fa4c5a00c6b28337d050c176e')
assert.equal(manifest.scopeA.fig204.status, 'PASS_SCOPED_OFFLINE_SOURCE_MATH_CULTURE_VISUAL_REVIEW')
assert.equal(manifest.scopeA.fig206.status, 'HOLD_LOCAL_ANNOTATION_AND_TRUE_RELATION_COVERAGE')
assert.equal(manifest.scopeB.status, 'PASS_EIGHT_SUBSTITUTIONS_AND_TWO_NOTES_ONLY')
assert.deepEqual(manifest.activeExecSessions, [])
assert.equal(manifest.chargedImageLedger.charged, 7)
assert.equal(manifest.revisionLedger.fig206NextUnused, 2)
const references = [bind(manifestFile), ...manifest.outputs, ...manifest.namedInputBindings]
for (const page of manifest.scopeB.pages)
  references.push(page.currentJSON, page.currentMD)
references.push(...manifest.scopeB.VoltaReusedLocks)
for (const item of new Map(references.map(item => [item.path, item])).values())
  assert.equal(hash(item.path), item.sha256, item.path)
for (const item of [...manifest.outputs, ...manifest.scopeB.VoltaReusedLocks])
  if (item.mode === '0444')
    assert.equal(fs.statSync(item.path).mode & 0o777, 0o444, item.path)

const own = path.join(tmp, 'receive-204206-and-source169171-review-15')
assert.ok(!fs.existsSync(own))
fs.mkdirSync(own)
const record = {
  status: 'FIG204_REVISION1_INDEPENDENT_PASS_FIG206_LOCAL_REPAIR_HOLD_SOURCE169171_AFFECTED_PASS',
  report, manifest: bind(manifestFile),
  figure204: manifest.scopeA.fig204, figure206: manifest.scopeA.fig206,
  display: manifest.scopeA.display, sourceAffected: manifest.scopeB,
  revisionLedger: manifest.revisionLedger,
  imageLedger: manifest.chargedImageLedger,
  parentImageLoads: 0, parentPermanentImages: '24/24',
  originalFIRSTsFailuresUNKNOWNAndCountersPreserved: true,
  producerParserNativeWidthEditorReplays: 0,
  canonicalPromotionPerformed: false, wholeLessonApproved: false,
}
const recordFile = path.join(own, 'record.json')
save(recordFile, record)
references.push(bind(recordFile), bind(path.join(tmp, 'receive-204206-and-source169171-review-15.mjs')))
console.log(JSON.stringify(retainCurrent6g(
  'evidence/stemrobin188-6g-n32/204206-source169171-independent-review15',
  references, [
    'evidence/stemrobin188-6g-n32/204206-scoped-author14/retention.json',
    'evidence/stemrobin188-6g-source169172/independent-review14/retention.json',
    'evidence/stemrobin188-6g-source169172/eight-defects-revision1-14/retention.json',
  ], record)))
