import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { repo, tmp, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'

assert.equal(process.cwd(), repo)
const output = path.join(tmp, 'n68-choice253-repair-02')
assert.ok(!fs.existsSync(output))
const seed = path.join(tmp, 'n68-choice-author/seed.json')
const originalPath = path.join(tmp, 'n68-choice-author/draft.json')
const oldReview = path.join(tmp, 'n68-answer-choice-review-01/review.json')
const original = read(originalPath)
assert.equal(read(oldReview).outcome, 'revise')
assert.equal(read(oldReview).source_reviews.find(item => item.source_number === '253').coverage.verdict, 'revise')
const questionPath = path.join(tmp, 'n68-choice-growth-question-02.json')
const question = read(questionPath)
assert.equal(question.id, 'q-inverse-volume-growth')
const candidate = structuredClone(original)
const earth = candidate.questions.find(item => item.id === 'q-earth-moon')
earth.intent.unit_reason = 'The planetary forward-scaling task remains unchanged. The inverse-growth task is separately assessed in q-inverse-volume-growth with both source-wording branches explicitly conditional.'
earth.intent.limitations = [
  "HOLD: '增大两倍' still does not select final volume2V versus an increase2V. The separate conditional inverse-growth question does not resolve that historical wording.",
  'The planetary result uses the stated rounded spherical model; independent written production of either derivation is not certified.',
]
candidate.questions.push(question)
const coverage = candidate.coverage.find(item => item.source_number === '253')
coverage.question_ids.push(question.id)
coverage.omitted_tasks = [
  "HOLD: the original phrase '增大两倍' does not select one of the two explicitly assessed conditional branches.",
  'Independent written derivation and numerical approximation of the planetary and inverse-growth tasks are not certified by choice recognition.',
]
coverage.reason = 'Both forward planetary volume comparison and inverse diameter growth are assessed. The new complete conditional result preserves the general cube-root relationship, the multiplier/increment distinction, and both final2V and increase2V readings without guessing the source convention.'
original.questions.forEach((item, index) => {
  assert.deepEqual(candidate.questions[index].view, item.view)
  assert.deepEqual(candidate.questions[index].key, item.key)
  if (item.id !== 'q-earth-moon') assert.deepEqual(candidate.questions[index], item)
})
original.coverage.filter(item => item.source_number !== '253').forEach(item =>
  assert.deepEqual(candidate.coverage.find(value => value.source_number === item.source_number), item))
fs.mkdirSync(output)
const draft = path.join(output, 'draft.json')
save(draft, candidate)
const visible = path.join(output, 'visible-questions.json')
save(visible, { questions: candidate.questions.map(item => ({
  id: item.id, source_numbers: item.source_numbers, view: item.view,
})) })
fs.chmodSync(draft, 0o444)
fs.chmodSync(visible, 0o444)
const command = path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python')
const args = ['-B', '.agents/skills/ld-s10y-choice/scripts/validate.py',
  '--repo', repo, '--seed', seed, '--draft', draft]
const result = spawnSync(command, args, { cwd: repo, encoding: 'utf8' })
save(path.join(output, 'validation.command.json'), {
  command, args, cwd: repo, exitCode: result.status, stdout: result.stdout, stderr: result.stderr,
})
assert.equal(result.status, 0, result.stderr || result.stdout)
save(path.join(output, 'repair.json'), {
  status: 'single-affected-choice-coverage-repair-review-pending',
  original: bind(originalPath), rejectedReview: bind(oldReview), candidate: bind(draft),
  newQuestion: bind(questionPath), seed: bind(seed),
  eightViewsAndKeysUnchanged: true, sevenCompleteQuestionsUnchanged: true,
  changes: ['Added one inverse-growth question.', 'Only253coverage and q-earth-moon internal limitations/unit reason updated.'],
  inheritedSourceAmbiguityAndMissingDensityHoldsPreserved: true,
  contentRepairs: 1, images: 0, wholeLessonApproved: false, published: false,
})
save(path.join(output, 'review-inputs.json'), {
  seed: bind(seed), visible: bind(visible), candidateKeyLast: bind(draft),
  previousReviewKeyLast: bind(oldReview), repair: bind(path.join(output, 'repair.json')),
  outputRoot: path.join(tmp, 'n68-choice253-affected-review-02'),
  scope: 'New inverse-growth question,253coverage and affected package relationships only; reuse all8 question PASS.',
  maxImageLoads: 0, answersAlreadyPASSNotReaudited: true,
  sourceFirstViewFirstKeyLastRequired: true, published: false,
})
console.log(JSON.stringify({ output, questions: 9, options: 36, images: 0 }))
