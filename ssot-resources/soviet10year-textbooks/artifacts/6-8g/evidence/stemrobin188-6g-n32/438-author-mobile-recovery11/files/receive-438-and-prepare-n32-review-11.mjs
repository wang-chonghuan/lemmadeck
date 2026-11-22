import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { repo, tmp, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'
import { retainCurrent6g } from './retain-current-6g-evidence-03.mjs'

const author = path.join(tmp, 'n32-438-author-mobile-recovery-11')
const manifestFile = path.join(author, 'manifest.json')
const hashesFile = path.join(author, 'hashes.json')
assert.equal(hash(manifestFile), 'd5f5b8bf718324e1d62257bf1005e532890070d20b5fa596fa0c40dbf35d775c')
assert.equal(hash(hashesFile), '14274aeb7f64be104c9595112826ddaa8325582742fdddc430a1da86b6b4198e')
const manifest = read(manifestFile)
assert.equal(manifest.status, 'AUTHOR_ONLY_COMPLETE_INDEPENDENT_REVIEW_HOLD')
assert.equal(manifest.activeExecSessions.length, 0)
assert.equal(fs.statSync(manifest.FIRST.path).mode & 0o777, 0o444)
assert.equal(manifest.scopedAuthorSanity.actualExitCode, 0)
assert.equal(manifest.scopedAuthorSanity.subparts, 10)
assert.equal(manifest.figure208.contentRevisions, 1)
const references = [...read(hashesFile).files, bind(hashesFile), bind(manifestFile)]
for (const reference of references)
  assert.equal(hash(reference.path), reference.sha256, reference.path)
for (const expected of manifest.executionReceipts) {
  const receipt = read(expected.path)
  assert.equal(receipt.cwd, repo)
  assert.equal(receipt.exitCode ?? receipt.actualExitCode, expected.actualExitCode)
  assert.deepEqual(receipt.argv, expected.argv)
  for (const stream of Object.values(receipt.streams))
    assert.equal(hash(stream.path), stream.sha256)
}
const own = path.join(tmp, 'n32-nineanswer-draft-and-review-inputs-11')
fs.mkdirSync(own)
const failureFile = path.join(own, 'reception-FIRSTFAIL.json')
save(failureFile, {
  status: 'TECHNICAL_RECEIPT_ALIAS_READ_FAILURE',
  execution: 'node .intentfold/tickets/STEMROBIN-188/tmp/receive-438-and-prepare-n32-review-11.mjs',
  exitCode: 1, failedAssertion: 'undefined !== 0 at line25',
  actualField: 'exitCode', summaryField: 'actualExitCode',
  firstScript: bind(path.join(tmp, 'receive-438-and-prepare-n32-review-11.FIRSTFAIL.mjs')),
  correction: 'Compare the actual exitCode alias against summary actualExitCode',
  authorOrRendererReplay: false, contentFailure: false, countersReset: false,
})
const eightFile = path.join(tmp, 'n32-eight-answers-author-first-10/answer-candidates.json')
const newFile = path.join(author, 'answer-keys.json')
assert.equal(hash(newFile), '72370300316d82e5952889f8695d1e3da519967a9a002812b2b1e7f1a59a2ee6')
const eight = read(eightFile)
const one = read(newFile)
assert.deepEqual(one.answers.map(a => a.exercise), ['438'])
const answers = [...eight.answers, ...one.answers].sort((a, b) =>
  Number(a.exercise) - Number(b.exercise))
assert.deepEqual(answers.map(a => a.exercise), ['432', '433', '434', '435', '436',
  '437', '438', '439', '440'])
const nineFile = path.join(own, 'answer-keys.json')
save(nineFile, { ...eight, status: 'draft', answers })
const figureManifestFile = path.join(tmp, 'n32-fig207208-author-first-10/figures.manifest.json')
const figures = read(figureManifestFile).figures
const postFile = path.join(own, 'post-FIRST.json')
save(postFile, {
  status: 'COMPLETE_NINE_DRAFT_KEYS_AFTER_INDEPENDENT_FIRST_ONLY_NOT_DISPATCHED',
  book: '6-8g', lesson: 'geo68-c3-s1-n32',
  modernTemplates: ['lesson', 'exercises', 'figures'].map(name =>
    bind(path.join(tmp, `n32-text-candidate-10/${name}.template.json`))),
  textAuthorRecord: bind(path.join(tmp, 'n32-text-candidate-10/record.json')),
  answerCandidates: bind(nineFile),
  answerProvenance: [bind(eightFile), bind(newFile)],
  figureAuthorManifest: bind(figureManifestFile),
  figures: figures.map(f => ({
    id: f.id, first: f.first, source: f.source, context: f.context,
    current: f.current, priorRevisions: f.author.contentRevisions,
  })),
  mobile208AuthorRecovery: bind(manifestFile),
  reviewScope: 'First independent all-nine task solving, knowledge/boundary review and207208 source/current mathematical-cultural-visual comparison only. Source inventory and all solutions must be frozen before modern outputs or keys. Assess proofs against the source lesson premises as well as mathematical correctness.',
  exclude: ['204206 figure review', 'whole lesson approval', 'canonical promotion',
    'native full-nine finalize', 'publishing', 'paid calls', 'new source pages'],
  preserve: ['204206 semantic/collision holds and exhausted revisions',
    '208 original malformed-load failure and content revision1',
    '155 original glyphFAIL and printing-role UNKNOWN outside lesson32 output'],
  authorSanityReplays: 0, wholeLessonApproved: false, parentImageLoads: 0,
})
const record = {
  status: '438_AUTHOR_MOBILE_RECOVERY_RECEIVED_NINE_DRAFT_KEYS_READY_FOR_FIRST_REVIEW',
  manifest: bind(manifestFile), first: manifest.FIRST,
  authorMobileSanity: manifest.authorMobileSanity,
  authorSanity: manifest.scopedAuthorSanity,
  ledger: read(path.join(author, 'ledger.json')),
  combinedDraft: bind(nineFile), postFIRST: bind(postFile),
  originalEightAnd438ObjectsUnchanged: true, independentReview: false,
  originalFailuresRevisionsAndCountersPreserved: true,
  sourceAndWholeLessonApproval: false, producerReplays: 0,
}
const recordFile = path.join(own, 'record.json')
save(recordFile, record)
references.push(bind(nineFile), bind(postFile), bind(recordFile),
  bind(failureFile), bind(path.join(tmp, 'receive-438-and-prepare-n32-review-11.FIRSTFAIL.mjs')),
  bind(path.join(tmp, 'receive-438-and-prepare-n32-review-11.mjs')))
console.log(JSON.stringify(retainCurrent6g(
  'evidence/stemrobin188-6g-n32/438-author-mobile-recovery11', references,
  ['evidence/stemrobin188-6g-n32/figures207208-author-first10/retention.json',
    'evidence/stemrobin188-6g-n32/layout-author-first10/retention.json',
    'evidence/stemrobin188-6g-n32/eightanswers-author-first10/retention.json'], record,
)))
console.log(JSON.stringify({ postFIRST: bind(postFile), nineDraft: bind(nineFile) }))
