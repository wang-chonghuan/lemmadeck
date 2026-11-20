import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { tmp, core, read, bind, save, retain } from './retain-scoped-evidence-02.mjs'

const action = process.argv[2]
const script = new URL(import.meta.url).pathname
if (action === 'n60-text') {
  const root = path.join(tmp, 'source224225-n60-text-review-01')
  const collectionPath = path.join(tmp, 'source224225-n60-text-review-01-collection-01.json')
  const collection = read(collectionPath)
  assert.equal(collection.outputsVerified, 15)
  const reviewPath = path.join(root, 'n60-modern-text-review.json')
  const review = read(reviewPath)
  assert.equal(review.status, 'PASS_READABLE_N60_TEXT_ONLY_WITH_HOLDS')
  assert.equal(review.independentTextApproved, true)
  assert.equal(review.coverage.totalObjectsReviewed, 33)
  assert.equal(review.coverage.formulaSpansByteExact, 49)
  assert.deepEqual(review.FAIL, [])
  const inputPath = path.join(tmp, 'n60-modern-text-review-inputs-01/manifest.json')
  const input = read(inputPath)
  const admissionPath = path.join(tmp, 'n60-modern-text-admission-01.json')
  save(admissionPath, {
    schema: 'stemrobin188-scoped-modern-text-admission@1',
    status: 'pass-for-modern-n60-text-only-with-inherited-source-holds',
    lesson: 'geo910-c2-s3-n60', review: bind(reviewPath), collection: bind(collectionPath),
    candidates: input.candidates, sourceHolds: input.sourceHolds, reviewHolds: review.HOLD,
    objects: 33, formulas: 49, contentRepairs: 1, remainingRepairs: 0,
    savedFlowAnchorsApprovedWithoutRerun: true, templatesApplied: false,
    wholeLessonApproved: false, figuresApproved: false, published: false,
  })
  retain(path.join(core, 'evidence/stemrobin188-g10-n60/modern-text-independent-review'),
    [admissionPath, collectionPath, collection.outputIndex.path, inputPath,
      ...input.bindings.map(b => b.path), script,
      ...collection.outputs.filter(b => /n60|comparison|bindings|report|ledger/.test(path.basename(b.path))).map(b => b.path)], {
      schema: 'stemrobin188-n60-modern-text-independent-retention@1',
      status: 'PASS-readable-modern-text33objects49formulas-only-with-HOLDs',
      admission: bind(admissionPath), contentRepairs: 1, remainingRepairs: 0,
      sourceOrFigureReReview: false, nativeOrFlowRerun: false,
    })
} else if (action === 'source224225') {
  const root = path.join(tmp, 'source224225-n60-text-review-01')
  const collectionPath = path.join(tmp, 'source224225-n60-text-review-01-collection-01.json')
  const collection = read(collectionPath)
  const inputPaths = [224, 225].map(n =>
    path.join(tmp, `source${n}-FIRST-review-inputs-01/manifest.json`))
  for (const n of [224, 225]) {
    const review = read(path.join(root, `source${n}-review.json`))
    assert.equal(review.status, 'PASS_LITERAL_OBJECTS_AND_NATIVE_CROPS_WITH_HOLDS')
    assert.deepEqual(review.FAIL, [])
  }
  retain(path.join(core, 'evidence/stemrobin188-source224225/FIRST-review'),
    [collectionPath, collection.outputIndex.path, ...inputPaths,
      ...inputPaths.flatMap(p => read(p).bindings.map(b => b.path)), script,
      ...collection.outputs.filter(b => !/n60|compare-bound-text/.test(path.basename(b.path))).map(b => b.path)], {
      schema: 'stemrobin188-source224225-independent-retention@1',
      status: 'PASS-literal-source224225-with-HOLDs',
      sourceRepairs: { 224: 1, 225: 0 }, imagesLoaded: 6, reviewImagesIncludeN60: false,
      source224InitialCropFAILPreserved: true, source225LiteralRNotCorrected: true,
      source224AlphaLikeGlyphNotReplaced: true, nativeRerun: false,
    })
} else {
  assert.ok(['n61-author-retain', 'n61-text-review-inputs', 'n60-fig7778-retain'].includes(action))
  const n61 = action.startsWith('n61')
  const name = n61 ? 'n61-modern-text-author' : 'n60-fig7778-author'
  const root = path.join(tmp, name)
  const collectionPath = path.join(tmp, `${name}-collection-01.json`)
  const collection = read(collectionPath)
  assert.equal(collection.outputsVerified, n61 ? 51 : 36)
  const reportPath = path.join(root, n61 ? 'author-report.json' : 'author-result.json')
  const report = read(reportPath)
  const inputPath = path.join(tmp, n61 ? 'n61-modern-text-author-inputs-01/manifest.json'
    : 'n60-fig7778-author-inputs-01/manifest.json')
  const input = read(inputPath)
  const files = [...new Set([collectionPath, collection.outputIndex.path, inputPath,
    ...collection.outputs.map(b => b.path), ...input.bindings.map(b => b.path), script])]
  const target = path.join(core, n61 ? 'evidence/stemrobin188-g10-n61/modern-text-author-attempt'
    : 'evidence/stemrobin188-g10-n60/figure7778-author-attempt')
  if (action.endsWith('retain')) {
    retain(target, files, {
      schema: 'stemrobin188-bounded-author-attempt-retention@1',
      status: n61 ? 'author-only-N61-modern-text30objects-independent-review-pending'
        : 'author-only77-nativePASS-after-sole-repair78-route-HOLD',
      report: bind(reportPath), collection: bind(collectionPath),
      contentRepairs: n61 ? { text: 0 } : { figure77: 1, figure78: 0 },
      imagesLoaded: n61 ? 0 : 6, firstFailuresAndTechnicalRecoveryPreserved: true,
      independentReviewPending: true, nativeRerun: false,
    })
  } else {
    const retentionPath = path.join(target, 'bindings.json')
    read(retentionPath)
    assert.equal(report.counts.allObjects, 30)
    assert.equal(report.counters.contentRepairsUsed, 0)
    const candidates = ['lesson.template.json', 'exercises.template.json']
      .map(n => bind(path.join(root, n)))
    const output = path.join(tmp, 'n61-modern-text-review-inputs-01')
    assert.ok(!fs.existsSync(output), output)
    fs.mkdirSync(output)
    save(path.join(output, 'manifest.json'), {
      schema: 'stemrobin188-n61-modern-text-independent-review-inputs@1',
      status: 'pending-first-complete-independent-modern-text-review',
      ticket: 'STEMROBIN-188', assignment: 'SAME188-6', book: '9-10g',
      lesson: 'geo910-c2-s3-n61', candidates,
      rawLesson: input.rawLesson, rawExercises: input.rawExercises,
      sourceAdmission: input.sourceAdmission, figureContractsOnly: input.figureContractsOnly,
      authorReport: bind(reportPath), authorRetention: bind(retentionPath),
      collection: bind(collectionPath), savedFlow: bind(path.join(root, report.savedActualFlow.path)),
      sourceHolds: report.holds, objectsRequired: 30,
      exercise209SourceRefs: ['p0220#12', 'p0221#1'],
      soleSource220DelimiterRepairAndHistoryPreserved: true,
      imageOpensPlanned: 0, contentRepairs: 0, contentRepairLimit: 1,
      producerChecksOrFlowOrNativeRerunsAuthorized: false,
      sourceOrFigureReReviewAuthorized: false, templatesApplied: false,
      figuresApproved: false, wholeLessonApproved: false, published: false,
      bindings: [...files, retentionPath].map(bind),
    })
    console.log(JSON.stringify({ output, bindings: files.length + 1, objects: 30, images: 0 }))
  }
}
