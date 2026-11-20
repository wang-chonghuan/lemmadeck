import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'

const repo = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck'
assert.equal(process.cwd(), repo)
const tmp = path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp')
const output = path.join(tmp, 'n47-choice-internal-repair-01')
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: file, sha256: hash(file) })
const check = binding => assert.equal(hash(binding.path), binding.sha256, binding.path)
const save = (file, value) => fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' })
const stage = process.argv[2]
assert.ok(['prepare', 'seal'].includes(stage))
const authorRoot = path.join(tmp, 'n47-choice-author')
const originalDraftPath = path.join(authorRoot, 'draft.json')
const seedPath = path.join(authorRoot, 'seed.json')
const firstReviewRoot = path.join(tmp, 'n47-answer-choice-surfaces-review-01')
const firstReviewPath = path.join(firstReviewRoot, 'review.json')
const indexPath = path.join(firstReviewRoot, 'output-index.json')
assert.equal(hash(indexPath), 'd81f7439e25f4450ca09c515985f6df65606d4b4c3108993496df7e369256277')
read(indexPath).outputs.forEach(check)
assert.equal(read(firstReviewPath).outcome, 'revise')
assert.equal(read(firstReviewPath).question_reviews[6].mathematics.verdict, 'revise')
assert.equal(read(path.join(authorRoot, 'report.json')).cumulative_counters.targeted_real_content_repairs, 0)
if (stage === 'prepare') {
  assert.ok(!fs.existsSync(output))
  fs.mkdirSync(output)
  fs.copyFileSync(originalDraftPath, path.join(output, 'draft.json'), fs.constants.COPYFILE_EXCL)
  fs.chmodSync(path.join(output, 'draft.json'), 0o644)
  save(path.join(output, 'before.json'), {
    original: bind(originalDraftPath), seed: bind(seedPath), firstReview: bind(firstReviewPath),
    index: bind(indexPath), changedQuestion: 'n47-fig22-complete-result',
    repairCountBefore: 0, originalAuthorAndFirstPreserved: true, parentImageLoads: 0,
  })
  console.log(JSON.stringify({ output, contentChangesApplied: 0 }))
} else {
  const before = read(path.join(output, 'before.json'))
  for (const binding of [before.original, before.seed, before.firstReview, before.index]) check(binding)
  const original = read(originalDraftPath)
  const repaired = read(path.join(output, 'draft.json'))
  const expected = structuredClone(original)
  const intent = expected.questions[6].intent
  const oldSolution = intent.source_solution
  const oldObservation = intent.figure_observations[0].observation
  assert.equal(oldSolution.match(/CDEF/g).length, 2)
  assert.equal(oldObservation.match(/CDEF/g).length, 1)
  intent.source_solution = oldSolution.replaceAll('CDEF', 'DCEF')
  intent.figure_observations[0].observation = oldObservation.replaceAll('CDEF', 'DCEF')
  assert.deepEqual(repaired, expected, 'Only the two internal cyclic-face fields may change')
  assert.deepEqual(repaired.questions.map(item => item.view), original.questions.map(item => item.view))
  const bindings = [
    before.original, before.seed, before.firstReview, before.index,
    ...read(indexPath).outputs, bind(path.join(output, 'draft.json')),
    bind(path.join(output, 'before.json')), bind(path.join(tmp, 'repair-n47-choice-internal-01.mjs')),
  ]
  bindings.forEach(check)
  save(path.join(output, 'manifest.json'), {
    status: 'pending-affected-only-independent-choice-review',
    ticket: 'STEMROBIN-188', assignment: 'SAME188-6', book: '9-10g', lesson: 'geo910-c2-s2-n47',
    seed: before.seed, original: before.original, repaired: bind(path.join(output, 'draft.json')),
    firstReview: before.firstReview, firstReviewIndex: before.index,
    changedQuestion: 'n47-fig22-complete-result',
    changedFields: ['intent.source_solution', 'intent.figure_observations[0].observation'],
    cyclicFaceCorrection: { before: 'CDEF', after: 'DCEF', replacements: 3 },
    allViewsAndOptionsAndKeysAndOtherFieldsUnchanged: true, cumulativeContentRepairs: 1,
    inheritedSourceReviewsAndSixQuestionPassesNotRepeated: true,
    answerAndSurfacePassesNotRepeated: true, bindings, images: [], imageOpensPlanned: 0,
    originalFirstAndRejectsAndHoldsPreserved: true, parentImageLoads: 0,
    wholeLessonApproved: false, published: false,
  })
  console.log(JSON.stringify({ output, changedFields: 2, contentRepairs: 1, images: 0 }))
}
