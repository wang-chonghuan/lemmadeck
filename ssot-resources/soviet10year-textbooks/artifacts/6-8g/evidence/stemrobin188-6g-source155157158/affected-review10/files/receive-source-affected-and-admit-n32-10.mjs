import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { tmp, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'
import { retainCurrent6g } from './retain-current-6g-evidence-03.mjs'

const root = path.join(tmp, 'source155157158-affected-review-10')
const reportFile = path.join(root, 'report.json')
const manifestFile = path.join(root, 'manifest.json')
assert.equal(hash(reportFile), 'cf23281b27304040e3cc4f3e33dc81b8a383879f15eac5fd7293b5ae5200fda7')
assert.equal(hash(manifestFile), 'cb2eb08a107e8d10cb12dffe6cbbdc39acf6fc9da8d0ecf3498b05b78672cb07')
const report = read(reportFile)
const manifest = read(manifestFile)
assert.equal(report.affected_status, 'PASS')
assert.deepEqual(report.changes.map(item => item.verdict), ['PASS', 'PASS', 'PASS', 'PASS'])
assert.equal(manifest.review_limits.running_exec_sessions, 0)
assert.equal(manifest.review_limits.page155_whole_N32_whole_N33_approved, false)
const refs = [bind(reportFile), bind(manifestFile)]
for (const item of [...manifest.owned_files, ...manifest.external_bindings]) {
  assert.equal(hash(item.path), item.sha256, item.path)
  refs.push(bind(item.path))
}
const own = path.join(tmp, 'receive-source-affected-and-admit-n32-10')
fs.mkdirSync(own)
const record = {
  status: 'FOUR_AFFECTED_SOURCE_CHANGES_PASS_RECEIVED', review: bind(reportFile),
  changes: report.changes, preservedHolds: report.preserved_holds_and_failures,
  priorFIRSTsFailuresAndUnchangedPASSReused: true,
  sourcePage155StillFailed: true, wholeLessonApproved: false, published: false,
  parentImageLoads: 0, sourceProducerReplays: 0,
}
const recordFile = path.join(own, 'record.json')
save(recordFile, record)
const admissionFile = path.join(tmp, 'n32-draft-first-10/admission.json')
const staged = read(path.join(tmp, 'n32-draft-first-10/staging.json'))
assert.equal(staged.rightExclusive, 'p0155#6')
assert.equal(staged.explicitOwnedFootnote, 'p0155#8 -> 438')
assert.equal(hash(path.join(tmp, 'n32-draft-first-10/artifacts/6-8g/pages/0155/page.json')),
  report.changes[3].after_candidate_sha256)
save(admissionFile, {
  status: 'PASS_METADATA_ONLY_N32_SCOPED_ADMISSION', review: bind(reportFile),
  left: staged.left, rightExclusive: staged.rightExclusive,
  explicitOwnedFootnote: staged.explicitOwnedFootnote,
  scope: 'Existing readable source PASS plus affected ownership/count PASS; only N32 blocks and owned438 footnote. Failed33 heading outside output, not deleted or repaired.',
  sourcePage155StillFailed: true, allGlyphAndPrintingRoleHoldsPreserved: true,
  strictRuleReadOrderingHoldPreserved: true, wholeN32Approved: false,
  sourceProducerReplays: 0, parentImageLoads: 0, published: false,
})
refs.push(bind(recordFile), bind(admissionFile), bind(path.join(tmp, 'receive-source-affected-and-admit-n32-10.mjs')))
const retained = retainCurrent6g('evidence/stemrobin188-6g-source155157158/affected-review10', refs, [
  'evidence/stemrobin188-6g-source157158/literal-repair10/retention.json',
  'evidence/stemrobin188-6g-source157158/independent-review09/retention.json',
  'evidence/stemrobin188-6g-source155/count-only-repair09/retention.json',
  'evidence/stemrobin188-6g-source155/footnote-owner-repair09/retention.json',
  'evidence/stemrobin188-6g-source155156/independent-review09/retention.json',
], record)
console.log(JSON.stringify({ record: bind(recordFile), admission: bind(admissionFile), retained }))
