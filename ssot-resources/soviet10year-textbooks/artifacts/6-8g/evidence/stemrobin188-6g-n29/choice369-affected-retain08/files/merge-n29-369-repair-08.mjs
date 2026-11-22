import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { repo, tmp, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'

assert.equal(process.cwd(), repo)
const own = path.join(tmp, 'n29-choice369-locus-repair-08')
const original = path.join(tmp, 'n29-choice370-definition-author-07/merged-draft.json')
assert.equal(hash(original), '8d4c76c556acd9a20ed2a50e35c16a17caef7dd72bb81019db5253c3d44ce6e0')
const before = read(original)
const replacement = read(path.join(own, 'replacement369.json'))
const questionId = 'n29-center-locus'
assert.equal(replacement.id, questionId)
assert.deepEqual(replacement.source_numbers, ['369'])
const after = structuredClone(before)
after.questions = after.questions.map(question => question.id === questionId ? replacement : question)
const coverage = after.coverage.find(item => item.source_number === '369')
coverage.reason = 'The complete three-branch locus classification retains the noncollinear, opposite and coincident ray families and valid vertex contacts. Unlike unchanged 368, the response requires their explicit geometric shapes rather than repeating the equal-distance predicate.'
for (const question of before.questions.filter(item => item.id !== questionId))
  assert.deepEqual(after.questions.find(item => item.id === question.id), question)
for (const item of before.coverage.filter(item => item.source_number !== '369'))
  assert.deepEqual(after.coverage.find(row => row.source_number === item.source_number), item)
const stripChanged = value => ({
  ...value,
  questions: value.questions.filter(item => item.id !== questionId),
  coverage: value.coverage.filter(item => item.source_number !== '369'),
})
assert.deepEqual(stripChanged(before), stripChanged(after))
const draft = path.join(own, 'draft.json')
save(draft, after)
fs.chmodSync(draft, 0o444)
save(path.join(own, 'repair.json'), {
  status: 'N29_369_GEOMETRIC_LOCUS_REPAIR_AUTHOR_ONLY',
  original: bind(original), replacement: bind(path.join(own, 'replacement369.json')),
  draft: bind(draft), affectedQuestion: questionId, affectedCoverage: '369',
  affectedRelationship: ['n29-two-ray-construction', questionId],
  otherEightQuestionsAndCoverageDeepEqual: true, images: 0,
  originalFailurePreserved: true, independentAffectedReviewPending: true,
})
console.log(JSON.stringify({ draft: bind(draft), record: bind(path.join(own, 'repair.json')) }))
