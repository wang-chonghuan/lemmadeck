import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { repo, tmp, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'
import { retainCurrent6g } from './retain-current-6g-evidence-03.mjs'

const root = path.join(tmp, 'n32-nineanswers-text-207208-independent-review-11')
const manifestFile = path.join(root, 'manifest.json')
assert.equal(hash(manifestFile), '2b4b6ebd485133eea4f402a68cd7eb39dd5ac64aab2ea2ba23f98be0889528b7')
const manifest = read(manifestFile)
assert.equal(hash(manifest.finalReport.path), '89251af2153a316cbb3855f77fa34fbe814828f4febaf762707197e71b833a85')
assert.deepEqual(manifest.activeExecSessions, [])
assert.equal(manifest.imageCounters.currentCharged, 6)
assert.equal(manifest.wholeLessonApproved, false)
assert.equal(fs.statSync(manifest.FIRST.path).mode & 0o777, 0o444)
const references = [...manifest.ownFiles, bind(manifestFile),
  ...manifest.referencedFiles.filter(item => item.actualSha256)
    .map(item => ({ path: item.path, sha256: item.actualSha256 }))]
for (const item of references) assert.equal(hash(item.path), item.sha256, item.path)
const receipt = read(path.join(root, 'prose-flow.execution.json'))
assert.equal(receipt.cwd, repo)
assert.equal(receipt.exitCode, 0)
for (const stream of Object.values(receipt.streams))
  assert.equal(hash(stream.path), stream.sha256)
const own = path.join(tmp, 'receive-n32-independent-review-12')
fs.mkdirSync(own)
const record = {
  status: manifest.status, report: manifest.finalReport, FIRST: manifest.FIRST,
  perExercise: manifest.perExercise, text: manifest.text, figures: manifest.figures,
  imageCounters: manifest.imageCounters, historicalCounters: manifest.historicalCounters,
  retainedOutsideScope: manifest.preservedOutsideScope,
  originalFIRSTsFailuresAndUnknownsPreserved: true,
  scopedPASSReusable: true, affectedRepairExercises: ['437', '438', '440'],
  wholeLessonApproved: false, producerReplays: 0, parentImageLoads: 0,
}
const recordFile = path.join(own, 'record.json')
save(recordFile, record)
references.push(bind(recordFile), bind(path.join(tmp, 'receive-n32-independent-review-12.mjs')))
console.log(JSON.stringify(retainCurrent6g(
  'evidence/stemrobin188-6g-n32/independent-nineanswers-text-207208-review12',
  references,
  ['assembly-and-prepare-first10', 'eightanswers-author-first10',
    'figures207208-author-first10', 'layout-author-first10',
    '438-author-mobile-recovery11'].map(name =>
    `evidence/stemrobin188-6g-n32/${name}/retention.json`),
  record,
)))
