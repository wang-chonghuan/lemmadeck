import assert from 'node:assert/strict'
import path from 'node:path'
import { tmp, core, read, bind, save, retain } from './retain-scoped-evidence-02.mjs'

const root = path.join(tmp, 'source226227-FIRST-review-01')
const collectionPath = path.join(tmp, 'source226227-FIRST-review-01-collection-01.json')
const collection = read(collectionPath)
assert.equal(collection.outputsVerified, 26)
assert.equal(collection.outputIndex.sha256,
  'a26c9e82f9079c16b83dc38a525f2fb3268d884699d8bae615ba75eb60f94a57')
const reportPath = path.join(root, 'report.json')
const report = read(reportPath)
assert.deepEqual(report.scopes.map(s => s.verdict), ['HOLD', 'PASS', 'PASS', 'HOLD'])
assert.equal(report.FIRSTProtocol.mode0444BeforeManifest, false)
const manifestPath = path.join(tmp, 'source226227-n61-fig77-review-inputs-01/manifest.json')
const manifest = read(manifestPath)
const files = [...new Set([
  collectionPath, collection.outputIndex.path, ...collection.outputs.map(b => b.path),
  manifestPath, ...manifest.bindings.map(b => b.path),
  new URL(import.meta.url).pathname,
])]
const target = path.join(core, 'evidence/stemrobin188-g10-n61/modern-text-independent-review')
retain(target, files, {
  schema: 'stemrobin188-n61-text-and-n60-figure77-scoped-review-retention@1',
  status: 'N61-text-semanticPASS-and77-visualPASS-with-proceduralHOLD',
  report: bind(reportPath), collection: bind(collectionPath),
  source226227Verdict: 'HOLD', figure78Verdict: 'HOLD',
  n61ObjectsReviewed: 30, figure77RepairsUsed: 1, source220RepairsUsed: 1,
  delayedFIRSTModeHOLDPreserved: true, reviewerFalseFAILAndAffectedRecoveryPreserved: true,
  sourceAndFigureHoldsCleared: false, stagesRepeated: 0,
})
const textManifest = read(manifest.modernText.path)
const textReviewPath = path.join(root, 'n61-modern-text-review.json')
const textReview = read(textReviewPath)
assert.equal(textReview.verdict, 'PASS')
assert.equal(textReview.coverage.objects, 30)
const candidates = textManifest.candidates.map(c => {
  const current = bind(c.path)
  assert.equal(current.sha256, c.sha256)
  return current
})
save(path.join(tmp, 'n61-modern-text-admission-01.json'), {
  schema: 'stemrobin188-scoped-modern-text-admission@1',
  status: 'pass-for-modern-n61-text-only-with-inherited-source-and-procedural-holds',
  lesson: 'geo910-c2-s3-n61', review: bind(textReviewPath),
  collection: bind(collectionPath), retention: bind(path.join(target, 'bindings.json')),
  candidates, sourceHolds: textManifest.sourceHolds,
  reviewHolds: textReview.proceduralHOLDSeparate,
  objects: 30, contentRepairs: 0, remainingRepairs: 1,
  savedFlowAnchorsApprovedWithoutRerun: true,
  strictFIRSTProcessApproved: false, templatesApplied: false,
  wholeLessonApproved: false, figuresApproved: false, published: false,
})
