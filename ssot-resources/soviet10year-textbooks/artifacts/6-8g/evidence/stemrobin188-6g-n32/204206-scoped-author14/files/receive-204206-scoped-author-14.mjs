import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { tmp, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'
import { retainCurrent6g } from './retain-current-6g-evidence-03.mjs'

const root = path.join(tmp, 'n32-204206-scoped-repair-author-14')
const manifestFile = path.join(root, 'manifest.json')
assert.equal(hash(manifestFile), '65a5c7800d81fdd4b438ff0567c655a9a54d05bdece000a6acb36fd85a8c9e89')
const manifest = read(manifestFile)
assert.equal(hash(manifest.report.path), '6f52b5dd7a49063afc2f29748050bc12a20706e7535a73f920d9cc0ae5e9fc0a')
const report = read(manifest.report.path)
assert.deepEqual(manifest.activeExecSessions, [])
assert.equal(report.imageAttempts, 7)
assert.equal(report.figures[0].disposition, 'READY_FOR_SEPARATE_INDEPENDENT_REVIEW')
assert.equal(report.figures[1].disposition, 'HOLD')
const currentBindings = manifest.current.flatMap(figure => Object.values(figure)
  .filter(value => value && typeof value === 'object' && value.path && value.sha256))
const references = [bind(manifestFile), manifest.report, ...manifest.inputs,
  ...manifest.outputs, ...currentBindings]
for (const item of new Map(references.map(item => [item.path, item])).values())
  assert.equal(hash(item.path), item.sha256, item.path)
for (const group of manifest.firstLocks)
  for (const item of group.files) assert.equal(fs.statSync(item.path).mode & 0o777, 0o444)
const own = path.join(tmp, 'receive-204206-scoped-author-14')
fs.mkdirSync(own)
const record = {
  status: 'FIG204_REVISION1_AUTHOR_READY_FIG206_SEMANTIC_HOLD_DISPLAY_DIAGNOSED',
  report: manifest.report,
  current: manifest.current,
  displayDiagnosis: report.displayDiagnosis,
  imageAttempts: report.imageAttempts,
  revisionCounters: { '204': 1, '206': 1 },
  figure206NextRevision2Unused: true,
  currentMediaAuthorPassNotIndependentApproval: true,
  originalSemanticHoldsAnd206DisplayFailurePreserved: true,
  figure206ValidatorRenderReusedWithoutReplay: true,
  noWholeExistingPackageCopied: true, parentImageLoads: 0,
  wholeLessonApproved: false, independentApproval: false,
}
const recordFile = path.join(own, 'record.json')
save(recordFile, record)
references.push(bind(recordFile), bind(path.join(tmp, 'receive-204206-scoped-author-14.mjs')))
console.log(JSON.stringify(retainCurrent6g(
  'evidence/stemrobin188-6g-n32/204206-scoped-author14', references,
  ['evidence/stemrobin188-6g-n32/figures204206-author-first10/retention.json'],
  record)))
