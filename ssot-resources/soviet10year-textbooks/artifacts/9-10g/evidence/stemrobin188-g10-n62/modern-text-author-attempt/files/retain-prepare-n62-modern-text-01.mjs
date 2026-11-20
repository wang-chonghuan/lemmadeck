import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { tmp, core, read, bind, save, retain } from './retain-scoped-evidence-02.mjs'

const root = path.join(tmp, 'n62-modern-text-author')
const collectionPath = path.join(tmp, 'n62-modern-text-author-collection-01.json')
const collection = read(collectionPath)
assert.equal(collection.outputsVerified, 22)
assert.equal(collection.outputIndex.sha256,
  '7ef8e8b7dc35c19f62af9993a92df9a1edd4836029b16b61b5b75c84de7f03b0')
const reportPath = path.join(root, 'author-report.json')
const report = read(reportPath)
assert.equal(report.object_counts.all, 20)
assert.equal(report.counters.content_repairs_used, 0)
assert.equal(report.initial_content_result.status, 'PASS')
assert.equal(report.counters.images_created_or_read, 0)
assert.equal(report.counters.post_anchor_flow_reruns, 0)
const inputPath = path.join(tmp, 'n62-modern-text-author-inputs-01/manifest.json')
const input = read(inputPath)
const script = new URL(import.meta.url).pathname
const files = [...new Set([
  collectionPath, collection.outputIndex.path, reportPath, inputPath,
  ...collection.outputs.map(b => b.path), ...input.bindings.map(b => b.path), script,
])]
const target = path.join(core, 'evidence/stemrobin188-g10-n62/modern-text-author-attempt')
if (process.argv[2] === 'retain') {
  retain(target, files, {
    schema: 'stemrobin188-n62-modern-text-author-attempt-retention@1',
    status: 'author-only-modern-text20objects-first-independent-review-pending',
    report: bind(reportPath), collection: bind(collectionPath),
    contentRepairs: 0, contentRepairLimit: 1, imagesLoaded: 0,
    fileDiscoveryFailureAndRecoveryPreserved: true,
    savedFlowAndTwoAnchorsReused: true, producerChecksRerun: false,
  })
} else {
  assert.equal(process.argv[2], 'review')
  const retentionPath = path.join(target, 'bindings.json')
  read(retentionPath)
  const candidates = report.outputs.map(b => bind(path.join(root, b.path)))
  assert.deepEqual(read(candidates[0].path).section_breaks, report.prose_flow.final_anchors)
  const directory = path.join(tmp, 'n62-modern-text-review-inputs-01')
  assert.ok(!fs.existsSync(directory), directory)
  fs.mkdirSync(directory)
  save(path.join(directory, 'manifest.json'), {
    schema: 'stemrobin188-n62-modern-text-independent-review-inputs@1',
    status: 'pending-first-complete-independent-modern-text-review',
    ticket: 'STEMROBIN-188', assignment: 'SAME188-6', book: '9-10g',
    lesson: 'geo910-c2-s3-n62', candidates,
    rawLesson: input.rawLesson, rawExercises: input.rawExercises,
    sourceAdmission: input.sourceAdmission, figureContractsOnly: input.figureContractsOnly,
    authorReport: bind(reportPath), collection: bind(collectionPath),
    authorRetention: bind(retentionPath),
    savedFlow: bind(path.join(root, report.prose_flow.structured_final_flow.path)),
    sourceHolds: report.source_holds, objectsRequired: 20,
    proofSourceRefs: ['p0222#11', 'p0223#3'],
    exercise220SourceRefs: ['p0223#10', 'p0224#1'],
    lastTwoExerciseSourceRefs: ['p0224#2', 'p0224#3'],
    splitMathCoordinatesNotMergedOrChanged: true,
    raisedQuestionMarkersNotAngleClaims: true, N63AndSource225Excluded: true,
    imagesPlanned: 0, contentRepairs: 0, contentRepairLimit: 1,
    producerChecksFlowNativeRenderOrSourceReReviewAllowed: false,
    templatesApplied: false, wholeLessonApproved: false, figuresApproved: false, published: false,
    bindings: [...files, retentionPath].map(bind),
  })
  console.log(JSON.stringify({ directory, bindings: files.length + 1, objects: 20, images: 0 }))
}
