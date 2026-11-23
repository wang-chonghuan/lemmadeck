import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { tmp, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'
import { retainCurrent6g } from './retain-current-6g-evidence-03.mjs'

const root = path.join(tmp, 'source161162-independent-review-11')
const reportFile = path.join(root, 'report.json')
const manifestFile = path.join(root, 'manifest.json')
assert.equal(hash(reportFile), '48e78c8654c6b0197ab4dbbf656669e36c53df59fbaae7940372c7585aca7472')
assert.equal(hash(manifestFile), 'b6df2269357e6c36c9d94b521167b3a9f02064e803e55482492f636b189f4ee3')
const report = read(reportFile)
const manifest = read(manifestFile)
assert.equal(report.independent_source_review_performed, true)
assert.equal(report.reviewer_counters.exec_sessions_returned_or_left_running, 0)
assert.equal(report.reviewer_counters.charged_images_total, 6)
assert.equal(fs.statSync(report.FIRST.path).mode & 0o777, 0o444)
assert.deepEqual(report.source_verdicts.map(v => v.original_native_exit), [1, 0])
const references = [bind(reportFile), bind(manifestFile),
  ...manifest.all_owned_files_except_manifest, ...manifest.referenced_files]
for (const reference of references)
  assert.equal(hash(reference.path), reference.sha256, reference.path)
const own = path.join(tmp, 'receive-source161162-review-11')
fs.mkdirSync(own)
const record = {
  status: report.status, report: bind(reportFile), first: report.FIRST,
  sourceVerdicts: report.source_verdicts,
  defectsAndAffectedActions: report.defects_and_safe_affected_actions,
  localBoundaries: report.local_boundaries,
  counters: report.reviewer_counters, originalReceipts: report.receipts,
  originalFailuresAndGlyphIdentityHoldsPreserved: true,
  source161RepairsPending: true, wholeLessonApproved: false,
  modernAssetsPromoted: false, parentImageLoads: 0, producerReplays: 0,
}
const recordFile = path.join(own, 'record.json')
save(recordFile, record)
references.push(bind(recordFile), bind(path.join(tmp, 'receive-source161162-review-11.mjs')))
console.log(JSON.stringify(retainCurrent6g(
  'evidence/stemrobin188-6g-source161162/independent-review11', references,
  ['evidence/stemrobin188-6g-source161162/author-first10/retention.json'], record,
)))
