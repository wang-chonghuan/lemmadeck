import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { tmp, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'
import { retainCurrent6g } from './retain-current-6g-evidence-03.mjs'

const root = path.join(tmp, 'source165166-first-and163164-affected-review-12')
const manifestFile = path.join(root, 'result-manifest.json')
assert.equal(hash(manifestFile), '1c2a7f976b017614850f9ce1a50ad1ac39630c33c55458af19eab74f4b5a63ed')
const manifest = read(manifestFile)
assert.deepEqual(manifest.activeExecSessions, [])
const reportFile = path.join(root, 'report.json')
assert.equal(hash(reportFile), '9e850db80d60027abc17aeba83cee842ce762b9ab6f09f800e886e63255c2887')
const report = read(reportFile)
assert.deepEqual(report.activeExecSessions, [])
assert.equal(report.scopeA.defects.length, 2)
assert.ok(report.scopeB.disposition.startsWith('PASS_AFFECTED_ONLY'))
assert.equal(report.counters.currentFreshChargedImageAttempts, 7)
const sourceManifest = manifest.sourceAndStreamBindingsManifest
assert.equal(hash(sourceManifest.path), sourceManifest.sha256)
const references = [
  bind(manifestFile), ...manifest.files, sourceManifest,
  ...read(sourceManifest.path).files,
]
for (const item of new Map(references.map(item => [item.path, item])).values())
  assert.equal(hash(item.path), item.sha256, item.path)
for (const file of [report.scopeA.FIRST.path, report.scopeA.FIRST.inventory.path])
  assert.equal(fs.statSync(file).mode & 0o777, 0o444)
const own = path.join(tmp, 'receive-source165166-and163164-affected-13')
fs.mkdirSync(own)
const record = {
  status: report.status, report: bind(reportFile),
  scopeA: {
    pages: [165, 166], defects: report.scopeA.defects,
    nativeFailures: [report.scopeA.page165.nativeError, report.scopeA.page166.nativeError],
    nativeRows: [report.scopeA.page165.nativeRows, report.scopeA.page166.nativeRows],
    figures: report.scopeA.figures, boundaries: report.scopeA.boundaries,
  },
  scopeB: {
    pages: [163, 164], disposition: report.scopeB.disposition,
    checks: report.scopeB.checks, native: report.scopeB.native,
    crop217218PASSReused: report.scopeB.crop217218PASSReused,
    identitiesStillUNKNOWN: true, noFurtherAffectedReviewRequiredForUnchanged163164: true,
  },
  counters: report.counters, originalFIRSTsFailuresAndUnknownsPreserved: true,
  noNativeOrCropReplays: true, parentImageLoads: 0, wholeLessonApproved: false,
}
const recordFile = path.join(own, 'record.json')
save(recordFile, record)
references.push(bind(recordFile), bind(path.join(tmp, 'receive-source165166-and163164-affected-13.mjs')))
console.log(JSON.stringify(retainCurrent6g(
  'evidence/stemrobin188-6g-source165166/independent-review13',
  references,
  [
    'evidence/stemrobin188-6g-source165166/author-first12/retention.json',
    'evidence/stemrobin188-6g-source163164/affected-repair12/retention.json',
    'evidence/stemrobin188-6g-source163164/independent-review12/retention.json',
  ],
  record,
)))
