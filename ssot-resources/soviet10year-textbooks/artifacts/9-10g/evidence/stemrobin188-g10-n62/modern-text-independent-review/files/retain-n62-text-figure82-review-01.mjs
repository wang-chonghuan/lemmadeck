import assert from 'node:assert/strict'
import path from 'node:path'
import { tmp, core, read, bind, save, retain } from './retain-scoped-evidence-02.mjs'

const root = path.join(tmp, 'n62-text-n60fig8182-review-01')
const collectionPath = path.join(tmp, 'n62-text-n60fig8182-review-01-collection-01.json')
const collection = read(collectionPath)
assert.equal(collection.outputsVerified, 22)
assert.equal(collection.outputIndex.sha256,
  '690c90466f2af8a54552e5e11bcc55bdeb55d36b6e4e17cdc6889f8f75cc6f83')
const reportPath = path.join(root, 'report.json')
const report = read(reportPath)
assert.equal(report.source81failureunchanged, true)
assert.equal(report.FIRST.actualModesEstablishedBeforeAnyManifestContextCandidateOrReceipt, true)
const textReviewPath = path.join(root, 'n62-modern-text-review.json')
const textReview = read(textReviewPath)
const figureReviewPath = path.join(root, 'n60-figure82-review.json')
assert.equal(textReview.status, 'pass')
assert.equal(textReview.coverage.reviewed, 20)
assert.equal(read(figureReviewPath).status, 'pass')
const inputPath = path.join(tmp, 'n62-text-n60fig8182-review-inputs-01/manifest.json')
const input = read(inputPath)
const textManifest = read(input.modernText.path)
const files = [...new Set([
  collectionPath, collection.outputIndex.path, ...collection.outputs.map(b => b.path),
  inputPath, ...input.bindings.map(b => b.path),
  ...textManifest.bindings.map(b => b.path),
  new URL(import.meta.url).pathname,
])]
const target = path.join(core, 'evidence/stemrobin188-g10-n62/modern-text-independent-review')
retain(target, files, {
  schema: 'stemrobin188-n62-text-and-n60-figure82-scoped-review-retention@1',
  status: 'N62-text-semanticPASS-and82-visualPASS-with-inheritedHOLDs',
  report: bind(reportPath), collection: bind(collectionPath),
  n62ObjectsReviewed: 20, orderedMathSpans: 34, reviewerImageLoads: 2,
  source81FailureUnchanged: true, source81RepairsUsed: 1,
  source82GlyphAndPanelHoldsCleared: false, stagesRepeated: 0,
})
const candidates = textManifest.candidates.map(c => {
  const current = bind(c.path)
  assert.equal(current.sha256, c.sha256)
  return current
})
save(path.join(tmp, 'n62-modern-text-admission-01.json'), {
  schema: 'stemrobin188-scoped-modern-text-admission@1',
  status: 'pass-for-modern-n62-text-only-with-inherited-source-holds',
  lesson: 'geo910-c2-s3-n62', review: bind(textReviewPath),
  collection: bind(collectionPath), retention: bind(path.join(target, 'bindings.json')),
  candidates, sourceHolds: textManifest.sourceHolds,
  reviewHolds: textReview.additionalHolds, objects: 20, formulas: 34,
  contentRepairs: 0, remainingRepairs: 1,
  savedFlowAnchorsApprovedWithoutRerun: true, templatesApplied: false,
  wholeLessonApproved: false, figuresApproved: false, published: false,
})
