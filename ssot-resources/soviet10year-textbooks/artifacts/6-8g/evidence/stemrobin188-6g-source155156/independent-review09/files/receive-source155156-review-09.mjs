import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { repo, tmp, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'
import { retainCurrent6g } from './retain-current-6g-evidence-03.mjs'

assert.equal(process.cwd(), repo)
const reviewer = path.join(tmp, 'source155156-and151-affected-independent-review-09')
const reportFile = path.join(reviewer, 'report.json')
const manifestFile = path.join(reviewer, 'owned-manifest.json')
assert.equal(hash(reportFile), '73bd2d8662d959da9bcb217763d54f511624fee00f4dd5fec29bd59a660bd575')
assert.equal(hash(manifestFile), 'c878f173c1965aa73432a243c79bc7128c7761a12ec15ec570b973f802fa258d')
const report = read(reportFile)
assert.deepEqual(report.pages.map(item => item.source), ['REVISE', 'PASS'])
assert.equal(report.affected151.source, 'PASS')
assert.equal(report.affected151.totalExactReplacements, 3)
assert.equal(report.affected151.allOtherStructuredLeavesIncludingMetaSourceRenderNotesBoxesAndFlagsUnchanged, true)
assert.equal(report.limits.allOwnExecCallsEnded, true)
assert.deepEqual(report.limits.activeSessions, [])
const refs = [bind(reportFile), bind(manifestFile)]
for (const item of [...read(manifestFile).files, ...read(manifestFile).inputBindings]) {
  assert.equal(hash(item.path), item.sha256)
  refs.push(bind(item.path))
}
assert.equal(fs.statSync(report.first.path).mode & 0o777, 0o444)
const own = path.join(tmp, 'receive-source155156-review-09')
fs.mkdirSync(own)
const record = {
  status: 'SOURCE155_REVISE_156_PASS_151_ENCODING_AFFECTED_PASS_RECEIVED',
  report: bind(reportFile), pages: report.pages, figures: report.figures,
  boundaryReview: report.boundaryReview, affected151: report.affected151,
  strictRuleReadOrderingHold: report.first.ruleReadOrdering,
  allHoldsAndFirstFailuresPreserved: true, parentImageLoads: 0,
  sourceProducerReplays: 0, published: false, wholeLessonApproved: false,
}
const file = path.join(own, 'record.json')
save(file, record)
refs.push(bind(file), bind(path.join(tmp, 'receive-source155156-review-09.mjs')))
const retained = retainCurrent6g('evidence/stemrobin188-6g-source155156/independent-review09', refs, [
  'evidence/stemrobin188-6g-source155156/author-first09/retention.json',
  'evidence/stemrobin188-6g-source151/unknown-encoding-repair09/retention.json',
], record)
const current151 = path.join(tmp, 'n31-draft-first-09/artifacts/6-8g/pages/0151/page.json')
assert.equal(hash(current151), report.affected151.afterSha256)
const admissionFile = path.join(tmp, 'n31-draft-first-09/admission.json')
save(admissionFile, {
  status: 'PASS_AFFECTED151_ENCODING_ONLY', review: bind(reportFile),
  current151: bind(current151), affectedScope: 'Three UNKNOWN subscript encodings only',
  originalSubscriptIdentityHold: true,
  strictRuleReadOrderingHold: report.first.ruleReadOrdering,
  readableSourcePASSReused: true, source155NotAdmittedByThisRecord: true,
  wholeSourcePageOrLessonApproved: false, parentImageLoads: 0, published: false,
})
console.log(JSON.stringify({ record: bind(file), retained, admission: bind(admissionFile) }))
