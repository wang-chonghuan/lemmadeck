import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { repo, tmp, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'
import { retainCurrent6g } from './retain-current-6g-evidence-03.mjs'

const review = path.join(tmp, 'source163164-first-and161-affected-review-12')
const reviewManifest = path.join(review, 'manifest.json')
const reportFile = path.join(review, 'report.json')
assert.equal(hash(reviewManifest), 'a999a4ed3c5dbeef7e12e73442b9258c26d42c7a78f4982253987d9e8570c901')
assert.equal(hash(reportFile), '69a2780be434e95e2c17bb5420091b327dfe666a47bb89b6a609e55dca38db87')
const report = read(reportFile)
const manifest = read(reviewManifest)
assert.deepEqual(report.activeExecSessions, [])
assert.equal(report.counters.freshReviewerChargedAttempts, 4)
assert.equal(report.scopeB.pendingAffectedRepairReviewResolved, true)
assert.equal(fs.statSync(report.scopeA.FIRST.path).mode & 0o777, 0o444)
const reviewReferences = [...manifest.inputFiles, ...manifest.newEvidence, bind(reviewManifest)]
for (const item of reviewReferences) assert.equal(hash(item.path), item.sha256, item.path)
const own = path.join(tmp, 'receive-source-reviews-and169170-12')
fs.mkdirSync(own)
const reviewRecord = {
  status: report.status, report: bind(reportFile), FIRST: report.scopeA.FIRST,
  source163164Defects: report.scopeA.defects, sourceFigures: report.scopeA.figures,
  source161AffectedPASS: report.scopeB, counters: report.counters,
  originalFIRSTsFailuresAndUnknownsPreserved: true,
  wholeLessonApproved: false, parentImageLoads: 0, producerReplays: 0,
}
const reviewRecordFile = path.join(own, 'review-record.json')
save(reviewRecordFile, reviewRecord)
reviewReferences.push(bind(reviewRecordFile), bind(path.join(tmp, 'receive-source-reviews-and169170-12.mjs')))
console.log(JSON.stringify(retainCurrent6g(
  'evidence/stemrobin188-6g-source163164/independent-review12', reviewReferences,
  ['evidence/stemrobin188-6g-source163164/author-first11/retention.json',
    'evidence/stemrobin188-6g-source161162/author-first10/retention.json',
    'evidence/stemrobin188-6g-source161162/independent-review11/retention.json',
    'evidence/stemrobin188-6g-source161162/two-affected-repairs11/retention.json'],
  reviewRecord,
)))

const author = path.join(tmp, 'source6g169170-author-first-12')
const authorManifestFile = path.join(author, 'manifest.json')
const summaryFile = path.join(author, 'summary.json')
assert.equal(hash(authorManifestFile), '89e5eff99967621e54c02f7811de8c06d2b5df3010dc1e1d6fb5e6a5574ddc53')
assert.equal(hash(summaryFile), '15f0fbb5e831fcbf1b1a8758c9e5fb93f2707011b6403151a2b41ffff62fb1b3')
const authorManifest = read(authorManifestFile)
const summary = read(summaryFile)
assert.deepEqual(summary.activeExecSessions, [])
assert.equal(summary.chargedImageAttempts, 2)
const authorReferences = [...authorManifest.files, bind(authorManifestFile)]
for (const item of authorReferences) assert.equal(hash(item.path), item.sha256, item.path)
for (const page of summary.pages) {
  for (const item of [page.first, page.inventory, page.draft])
    assert.equal(fs.statSync(item.path).mode & 0o777, 0o444)
  const stage = page.stages.find(item => item.argv.includes('finalize'))
  const receipt = read(stage.receiptFile.path)
  assert.equal(receipt.cwd, repo)
  assert.equal(receipt.exitCode, 1)
  for (const stream of Object.values(receipt.streams))
    assert.equal(hash(stream.path), stream.sha256)
}
const packagingFile = path.join(author, 'receipts/retain-evidence.json')
const packaging = read(packagingFile)
assert.equal(packaging.exitCode, 0)
authorReferences.push(bind(packagingFile), bind(path.join(author, 'manifest.sha256')))
for (const stream of Object.values(packaging.streams)) {
  assert.equal(hash(stream.path), stream.sha256)
  authorReferences.push(bind(stream.path))
}
const authorRecord = {
  status: 'SOURCE169170_AUTHOR_ONLY_BOTH_NATIVE_FAILURES_RECEIVED',
  summary: bind(summaryFile), report: bind(path.join(author, 'report.md')),
  pages: summary.pages.map(page => ({
    physicalPage: page.physicalPage, first: page.first, inventory: page.inventory,
    lineCounts: page.lineCounts, nativeErrors: page.nativeErrors,
    contentRevision: page.contentRevision, contentRetries: page.contentRetries,
  })),
  actualNextHeading: summary.actualNextHeading, exerciseBoundary: summary.exerciseBoundary,
  chargedImages: 2, originalFIRSTsFailuresDraftsAndUnknownsPreserved: true,
  wholeLessonApproved: false, parentImageLoads: 0, producerReplays: 0,
}
const authorRecordFile = path.join(own, 'author-record.json')
save(authorRecordFile, authorRecord)
authorReferences.push(bind(authorRecordFile), bind(path.join(tmp, 'receive-source-reviews-and169170-12.mjs')))
console.log(JSON.stringify(retainCurrent6g(
  'evidence/stemrobin188-6g-source169170/author-first12', authorReferences, [], authorRecord,
)))
