import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { tmp, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'
import { retainCurrent6g } from './retain-current-6g-evidence-03.mjs'

const proofRoot = path.join(tmp, 'n32-440-incidence-affected-review-13')
const proofManifestFile = path.join(proofRoot, 'manifest.json')
assert.equal(hash(proofManifestFile), '3007205d0cc460dd64831e0b455cb712d7d56a09cb8de6a2804bb6e7cec824bc')
const proof = read(proofManifestFile)
assert.equal(hash(proof.report.path), '1dab99b5bac57857e1f706e278f25086520d70846c7c54689c80f840369bbe4c')
assert.equal(proof.status, 'AFFECTED_REVIEW_COMPLETE_440_REVISION2_PROOF_PASS')
assert.deepEqual(proof.activeExecSessions, [])
assert.deepEqual(proof.perExerciseRevisionsUsed, { 437: 1, 438: 1, 440: 2 })
const proofReferences = [bind(proofManifestFile), proof.report, ...proof.actualReadInputs]
for (const item of proofReferences) assert.equal(hash(item.path), item.sha256, item.path)
const own = path.join(tmp, 'receive-440-pass-and171172-author-13')
fs.mkdirSync(own)
const proofRecord = {
  status: proof.status, report: proof.report, scope: proof.scope,
  verdicts: proof.verdicts, reusedPASS: proof.reusedPASS,
  cumulativeContentRevisions: proof.perExerciseRevisionsUsed,
  historicalRevision1FAILPreserved: true, authorizationCorrectionRetained: true,
  noFullGate2OrNativeFinalize: true, noNumericOrFormulaReplay: true,
  currentImageLedger: proof.currentImageLedger, parentImageLoads: 0,
  wholeLessonApproved: false,
}
const proofRecordFile = path.join(own, '440-record.json')
save(proofRecordFile, proofRecord)
proofReferences.push(bind(proofRecordFile), bind(path.join(tmp, 'receive-440-pass-and171172-author-13.mjs')))
const proofRetention = retainCurrent6g(
  'evidence/stemrobin188-6g-n32/440-incidence-affected-review13',
  proofReferences,
  [
    'evidence/stemrobin188-6g-n32/440-incidence-revision2-13/retention.json',
    'evidence/stemrobin188-6g-n32/threeanswers-affected-review12/retention.json',
  ],
  proofRecord,
)

const sourceRoot = path.join(tmp, 'source6g171172-author-first-13/work')
const sourceManifestFile = path.join(sourceRoot, 'manifest.json')
assert.equal(hash(sourceManifestFile), 'bcdf83d4d667edf2f3a5e4b3a7bb467a6868717bd22f262a095a9ad7e579bf57')
const source = read(sourceManifestFile)
assert.equal(hash(source.report.path), '1caa4aab833a3d55341c7274c6e3a75ead38274c961d89d58fc552d1ffddf9ab')
assert.deepEqual(source.activeExecSessions, [])
assert.equal(source.imageBudget.charged, 6)
const sourceReferences = [bind(sourceManifestFile), ...source.files]
for (const item of sourceReferences) assert.equal(hash(item.path), item.sha256, item.path)
for (const page of source.pages) {
  assert.ok([171, 172].includes(page.page))
  assert.equal(page.nativeFinalizeInvocations, 1)
  assert.equal(page.nativeExitCode, 0)
  assert.equal(page.nativePrintRows, 25)
  assert.equal(page.nativeMdRows, 25)
  for (const binding of [page.first, page.firstInventory, page.revision0])
    assert.equal(fs.statSync(binding.path).mode & 0o777, 0o444)
  const native = read(page.ordering.at(-1).receipt.path)
  assert.equal(native.exitCode, 0)
  assert.deepEqual(read(page.nativeAudit.file.path).errors, [])
}
const sourceRecord = {
  status: 'AUTHOR171172_RETAINED_NATIVE_PASS_NOT_INDEPENDENT_APPROVAL',
  report: source.report, physicalPages: [171, 172],
  pages: source.pages.map(page => ({
    page: page.page, nativeExitCode: page.nativeExitCode,
    nativeRows: [page.nativePrintRows, page.nativeMdRows],
    contentRevisions: page.candidateContentRevisions, inventoryRevisions: page.inventoryRevisions,
    first: page.first, firstInventory: page.firstInventory,
    visualBoundaries: page.visualBoundaries, crops: page.crops,
  })),
  imageBudget: source.imageBudget, holds: source.holds,
  originalFIRSTsFailuresUnknownsAndCountersPreserved: true,
  noNativeReplays: true, independentSourceReviewPending: true,
  parentImageLoads: 0, wholeLessonApproved: false,
}
const sourceRecordFile = path.join(own, '171172-record.json')
save(sourceRecordFile, sourceRecord)
sourceReferences.push(bind(sourceRecordFile), bind(path.join(tmp, 'receive-440-pass-and171172-author-13.mjs')))
const sourceRetention = retainCurrent6g(
  'evidence/stemrobin188-6g-source171172/author-first13',
  sourceReferences, [], sourceRecord,
)
console.log(JSON.stringify({ proofRetention, sourceRetention }))
