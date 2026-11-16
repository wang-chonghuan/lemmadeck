import assert from 'node:assert/strict'
import fs from 'node:fs'
import { createHash } from 'node:crypto'

const base = 'ssot-resources/soviet10year-textbooks/artifacts/10c/editions/modern-us-neutral/lessons/ana10-c6-s2-n79'
const scratch = '.tmp/ld-s10y-answer/10c/modern-us-neutral/lessons/ana10-c6-s2-n79'
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const source = `${scratch}/answer-keys.candidate.json`
const target = `${base}/answer-keys.json`

assert.equal(hash(source), '1d67abd10e1776b3288d089a9e20a23dc38b6c8264e227ad1b54cbf48343604d')
assert.equal(hash(`${scratch}/answer-keys.template.json`), '86b3da2bc64a2efbe5e072f55c27d9cd10d0e8de7bd7c3eedac63580b2c25964')
assert.equal(hash(`${base}/lesson.json`), '8e355befa6b80102fb828d4258f1bc61272d9fe0a776355a6d091b2a7ad5b851')
assert.equal(hash(`${base}/exercises.json`), '5b84bbff8fb4fe203b986fcc555d101408cc469ef88c383c84f1715262d399a3')
assert.equal(hash('.intentfold/tickets/STEMROBIN-184/tmp/ana10-n79-n80-independent-answer-prose-review.md'), 'd425d1f794b8c02accfc2232df11378437bf2cdc559f94ce38e05a9000fb0ae8')
const candidate = read(source)
const template = read(`${scratch}/answer-keys.template.json`)
const exercises = read(`${base}/exercises.json`).exercises
const protectedCandidate = structuredClone(candidate)
assert.deepEqual(candidate.answers.map(answer => answer.exercise), ['46', '47', '48', '49', '50', '51'])
assert.equal(candidate.answers.length, exercises.length)
for (let index = 0; index < candidate.answers.length; index++) {
  const answer = candidate.answers[index]
  const exercise = exercises[index]
  assert.equal(answer.prompt, exercise.text)
  assert.equal(answer.grading, 'ungraded')
  assert.equal(answer.source, 'derived')
  assert(answer.displayAnswer.trim())
  assert.deepEqual(answer.parts, [])
  assert.deepEqual(answer.figureEvidence, [])
  assert.deepEqual(exercise.figure_refs, [])
  assert.deepEqual(exercise.figures, [])
  protectedCandidate.answers[index].grading = template.answers[index].grading
  protectedCandidate.answers[index].displayAnswer = template.answers[index].displayAnswer
}
assert.deepEqual(protectedCandidate, template)
assert(!fs.existsSync(target), 'Do not overwrite existing durable answers')
fs.copyFileSync(source, target, fs.constants.COPYFILE_EXCL)
assert.equal(hash(target), hash(source))
console.log('n79: all six approved answers copied byte-identically; formal identities and current prompts match')
