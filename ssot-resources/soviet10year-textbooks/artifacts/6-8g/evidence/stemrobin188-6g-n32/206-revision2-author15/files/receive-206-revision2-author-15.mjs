import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { tmp, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'
import { retainCurrent6g } from './retain-current-6g-evidence-03.mjs'

const root = path.join(tmp, 'n32-206-annotation-assertion-revision2-author-15')
const manifestFile = path.join(root, 'manifest.json')
assert.equal(hash(manifestFile), '9f9314551b90302c46488b83bddf51962e3ccf1c9a1e794850c143b5b0de856a')
const manifest = read(manifestFile)
assert.equal(manifest.reportText.sha256, 'baf448230b526823896f7e5ef294cfa00944b4ebd244fcc78c9122e915b275b4')
assert.equal(manifest.status, 'AUTHOR_REPAIR_COMPLETE_READY_FOR_AFFECTED_ONLY_INDEPENDENT_REVIEW')
assert.deepEqual(manifest.activeExecSessions, [])
const current = manifest.currentNamedBindings
assert.equal(current.contentRevision, 2)
assert.equal(current.preservation.status, 'pass')
assert.equal(current.preservation.originalObjects, 9)
assert.equal(current.preservation.originalAssertions, 9)
assert.equal(current.preservation.falseRejectedWorldAssertionsAdded, false)
const images = read(manifest.imageLedger.path)
assert.equal(images.chargedAttempts, 4)
const references = [bind(manifestFile), manifest.report, manifest.reportText,
  ...manifest.namedInputBindings, ...manifest.unchangedAuthoritativeBindings,
  ...manifest.oldFailureBindings, ...manifest.thisTaskFailureBindings,
  ...manifest.historicalLedgers]
for (const item of Object.values(current))
  if (item?.path && item.sha256) references.push(item)
for (const item of manifest.outputs)
  if (!item.path.endsWith('.started.json') && !/\/(?:seal|evidence)\.mjs$/.test(item.path))
    references.push(item)
for (const item of new Map(references.map(item => [item.path, item])).values())
  assert.equal(hash(item.path), item.sha256, item.path)
assert.equal(fs.statSync(current.reusedFullFirst.path).mode & 0o777, 0o444)
const own = path.join(tmp, 'receive-206-revision2-author-15')
assert.ok(!fs.existsSync(own))
fs.mkdirSync(own)
const record = {
  status: 'FIG206_REVISION2_AUTHOR_READY_INDEPENDENT_AFFECTED_REVIEW_PENDING',
  manifest: bind(manifestFile), report: manifest.reportText,
  current, imageLedger: images, revisionLedger: manifest.revisionLedger,
  firstMediaFailureAndRecoveryPreserved: true,
  oldFIRSTFailuresUNKNOWNAndCountersPreserved: true,
  nativeRendererReplays: 0, sourceReopens: 0, parentImageLoads: 0,
  independentApproval: false, wholeLessonApproved: false,
}
const recordFile = path.join(own, 'record.json')
save(recordFile, record)
const reviewInputFile = path.join(own, 'affected-review-inputs.json')
save(reviewInputFile, {
  status: 'FIG206_REVISION2_CHANGED_ANNOTATION_CONCLUSION_COVERAGE_ONLY',
  current, changeScope: bind(path.join(root, 'change-scope.r2.json')),
  authorReport: manifest.reportText, manifest: bind(manifestFile),
  priorIndependentFullFirst: current.reusedFullFirst,
  priorIndependentFindings: current.reusedAuthority,
  previousSpec: manifest.namedInputBindings.find(item => item.name === 'revision1-spec'),
  previousContext: manifest.namedInputBindings.find(item => item.name === 'revision1-context'),
  executionReceipts: manifest.executionReceipts,
  actualMediaEvidence: bind(path.join(root, 'media.recovery1.evidence.json')),
  technicalFailure: bind(path.join(root, 'media.firstfailure.json')),
  instructions: 'Reuse unchanged full source-FIRST/source/math/visual review. Review ONLY newly visible modern annotation, true a/b conclusion assertion and inventory/description, extended canvas framing and changed current native/actual300358. No source reopening, re-solving original solid/dash geometry, producer/native/width replay, review@1, promotion or whole lesson approval. Independently ensure original objects/assertions/text remain unchanged and no false rejected-world claim added. Preserve revision2 and charged author4/8 including media failure; parent permanently24/24. Max8 reviewer images,24/context.',
  wholeLessonApproved: false, parentImageLoads: 0,
})
references.push(bind(recordFile), bind(reviewInputFile),
  bind(path.join(tmp, 'receive-206-revision2-author-15.mjs')))
console.log(JSON.stringify({
  affectedReview: bind(reviewInputFile),
  retention: retainCurrent6g('evidence/stemrobin188-6g-n32/206-revision2-author15',
    references, [
      'evidence/stemrobin188-6g-n32/204206-scoped-author14/retention.json',
      'evidence/stemrobin188-6g-n32/204206-source169171-independent-review15/retention.json',
      'evidence/stemrobin188-6g-n32/figures204206-author-first10/retention.json',
    ], record),
}))
