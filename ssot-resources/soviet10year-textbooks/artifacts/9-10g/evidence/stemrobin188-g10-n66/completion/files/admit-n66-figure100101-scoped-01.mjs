import assert from 'node:assert/strict'
import path from 'node:path'
import { repo, tmp, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'

assert.equal(process.cwd(), repo)
const reportPath = path.join(tmp, 'n66-figure100101-review-01/report.json')
const collectionPath = path.join(tmp, 'n66-figure100101-review-01-collection-01.json')
assert.equal(read(collectionPath).status, 'closed-agent-outputs-verified-once')
const report = read(reportPath)
assert.equal(report.status, 'hold')
assert.equal(report.boundedCandidateStatus, 'pass')
assert.deepEqual(report.figures.map(item => item.figure), ['fig-g10-100', 'fig-g10-101'])
assert.deepEqual(report.findings.map(item => item.id),
  ['SOURCE-GLYPHS-HOLD', 'STRICT-FIRST-PROCEDURE-HOLD', 'PROMOTION-PRODUCT-HOLD'])
assert.ok(report.findings.every(item => item.status === 'hold'))
for (const figure of report.figures) {
  assert.equal(figure.status, 'pass')
  assert.equal(figure.independentAssessment.status, 'pass')
  assert.equal(figure.independentAssessment.newCandidateRevisionRequired, false)
  assert.equal(figure.independentTextOnlyChecks.status, 'pass')
  assert.equal(hash(figure.nativeReview.path), figure.nativeReview.sha256)
  assert.equal(read(figure.nativeReview.path).status, 'pass')
  for (const item of Object.values(figure.selectedCurrent))
    assert.equal(hash(item.path), item.sha256)
}
save(path.join(tmp, 'n66-figure100101-scoped-admission-01.json'), {
  status: 'pass-current-candidates-only-for-offline-path-relocation',
  report: bind(reportPath), collection: bind(collectionPath),
  inheritedReportStatus: 'hold', preservedFindings: report.findings,
  perFigure: report.figures.map(item => ({
    figure: item.figure, candidateStatus: item.status, selectedCurrent: item.selectedCurrent,
    nativeReview: item.nativeReview,
  })),
  sourceGlyphOrFIRSTProcedureApproved: false, headedProductApproved: false,
  sourceUnknownsResolved: false, producerOrReviewerReruns: 0,
  permission: 'Active offline ticket permits durable resource integration of scoped candidate PASS.',
  parentImageLoads: 0, wholeLessonApproved: false, published: false,
})
