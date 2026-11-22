import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { tmp, hash, read, bind, save } from './retain-scoped-evidence-02.mjs'
import { retainCurrent6g } from './retain-current-6g-evidence-03.mjs'

const manifestFile = path.join(tmp, 'n32-choice-authoring-from-FIRST-16/manifest.json')
assert.equal(hash(manifestFile), '81059c1a30175ae0a7b996beb4736e7ee33c90d3594fe10c5a5666cb1dc0b95a')
const manifest = read(manifestFile)
assert.equal(manifest.status, 'OFFLINE_DRAFT_STRUCTURAL_EXIT0_INDEPENDENT_QUESTION_REVIEW_PENDING')
assert.deepEqual(manifest.activeExecSessions, [])
assert.equal(manifest.actualStructuralValidation.exitCode, 0)
assert.equal(manifest.actualStructuralValidation.invocations, 1)
assert.equal(manifest.cumulativeImageLedger.cumulativeChargedAttempts, 3)
const references = [bind(manifestFile), ...manifest.inputs, ...manifest.outputs]
for (const item of references) {
  assert.equal(hash(item.path), item.sha256, item.path)
  if (item.mode === '0444') assert.equal(fs.statSync(item.path).mode & 0o777, 0o444)
}
const own = path.join(tmp, 'receive-n32-choice-author-16')
assert.ok(!fs.existsSync(own))
fs.mkdirSync(own)
const draft = manifest.outputs.find(item => item.name === 'offline-author-draft')
const record = {
  status: 'N32_NINE_CHOICES_37_OPTIONS_AUTHOR_DRAFT_RECEIVED_INDEPENDENT_REVIEW_PENDING',
  manifest: bind(manifestFile), draft, inventory: manifest.draftInventory,
  validation: manifest.actualStructuralValidation,
  proofAndConventionHandling: manifest.proofAndConventionHandling,
  revisionLedger: manifest.revisionLedger,
  imageLedger: manifest.cumulativeImageLedger,
  scopeClarification: 'Reviewer-in-flight statements were parent-agent messages, not new direct human authorization.',
  independentQuestionReviewPerformed: false, semanticApproval: false,
  parentImageLoads: 0, wholeLessonApproved: false, published: false,
}
const file = path.join(own, 'record.json')
save(file, record)
references.push(bind(file), bind(path.join(tmp, 'receive-n32-choice-author-16.mjs')))
console.log(JSON.stringify(retainCurrent6g(
  'evidence/stemrobin188-6g-n32/choice-author-draft16', references,
  ['evidence/stemrobin188-6g-n32/choice-source-solving-FIRST16/retention.json',
    'evidence/stemrobin188-6g-n32/formal-choice-seed16/retention.json'], record)))

const inputRoot = path.join(tmp, 'n32-choice-independent-inputs-16')
const candidate = read(draft.path)
const viewsFile = path.join(inputRoot, 'views-only.json')
save(viewsFile, {
  status: 'N32_VISIBLE_QUESTIONS_WITHOUT_AUTHOR_INTENT_OR_KEY',
  questions: candidate.questions.map(({ id, source_numbers, view }) => ({ id, source_numbers, view })),
})
const postFile = path.join(inputRoot, 'post-FIRST.json')
save(postFile, {
  status: 'READ_ONLY_AFTER_ACTUAL_COMPLETE_SOURCE_FIRST_CHMOD_STAT_SHA_LOCK',
  visibleProjection: bind(viewsFile),
  stageTwo: 'Review source-task fidelity, redundancy and leakage, then independently solve every visible alternative and the complete true sets. Lock PREKEY by actual chmod/stat/SHA before reading the author internals.',
  authorInternalsReadOnlyAfterPREKEY: draft,
  authorStructuralReceipt: manifest.outputs.find(item => item.name === 'actual-structural-validation-receipt'),
  stageThree: 'Only after PREKEY compare derivations, misconceptions, correct set, full coverage and limitations, and produce the contract review. Run with-review structural checker once on completed review. Preserve failure and never edit candidate.',
  newFigures: [], maxChargedImages: 8, maxContextImages: 24,
  parentImageLoads: 0, wholeLessonApproved: false, published: false,
})
console.log(JSON.stringify({ postFIRST: bind(postFile), visibleProjection: bind(viewsFile) }))
