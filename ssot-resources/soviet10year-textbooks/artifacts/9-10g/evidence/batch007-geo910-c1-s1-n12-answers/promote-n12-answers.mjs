import assert from 'node:assert/strict'
import fs from 'node:fs'
import { createHash } from 'node:crypto'

const base = 'ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/modern-us-neutral/lessons/geo910-c1-s1-n12'
const scratch = '.tmp/ld-s10y-answer/9-10g/modern-us-neutral/lessons/geo910-c1-s1-n12'
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const source = `${scratch}/answer-keys.candidate.json`
const target = `${base}/answer-keys.json`

assert.equal(hash(source), 'e0485393c2f013a6231672a0f2517b3b297aeddf06750b78fc32e7c7e5b4f0f1')
assert.equal(hash(`${scratch}/answer-keys.template.json`), '55eeec1a447af278e422417998dc931998227fb0b24328a4b384822b635272d8')
assert.equal(hash(`${base}/lesson.json`), 'd550f8974e78a7eaf3f76a417bcf0b157184493ca792cb02fdec212c809a82ec')
assert.equal(hash(`${base}/exercises.json`), 'd1870d3f9b231eadae04debdebc0b5aed813d53b6bc6b53da19274d7e6356eb2')
assert.equal(hash('.intentfold/tickets/STEMROBIN-184/tmp/geo910-n11-n12-source-answer-prose.md'), '1f802a1ef610090215d39d0dfb448c96a04c5d23714f15b5af16ac6c310a32e1')
assert.equal(hash('.intentfold/tickets/STEMROBIN-184/tmp/geo910-n11-n12-independent-source-first.md'), '873824899a5d02a45293503c81eb60216ec66ac27a0a9e0b34cdaabd58b3efd8')
const candidate = read(source)
const template = read(`${scratch}/answer-keys.template.json`)
const exercises = read(`${base}/exercises.json`).exercises
const protectedCandidate = structuredClone(candidate)
assert.deepEqual(candidate.answers.map(answer => answer.exercise), ['97', '98', '99', '100', '101', '102', '103', '104', '105', '106'])
assert.equal(candidate.answers.length, exercises.length)
for (let index = 0; index < candidate.answers.length; index++) {
  const answer = candidate.answers[index]
  const exercise = exercises[index]
  assert.equal(answer.prompt, exercise.text)
  assert.equal(answer.grading, answer.exercise === '106' ? 'auto' : 'ungraded')
  assert.equal(answer.source, 'derived')
  assert(answer.displayAnswer.trim())
  assert.deepEqual(answer.figureEvidence, [])
  assert.deepEqual(exercise.figure_refs, [])
  assert.deepEqual(exercise.figures, [])
  if (answer.exercise === '106') {
    assert.deepEqual(answer.parts, [
      { label: '|AM|', judge: 'expression', expected: ['\\frac{m\\cdot p}{p+q}'] },
      { label: '|MB|', judge: 'expression', expected: ['\\frac{m\\cdot q}{p+q}'] },
    ])
    protectedCandidate.answers[index].parts = template.answers[index].parts
  } else assert.deepEqual(answer.parts, [])
  protectedCandidate.answers[index].grading = template.answers[index].grading
  protectedCandidate.answers[index].displayAnswer = template.answers[index].displayAnswer
}
assert.deepEqual(protectedCandidate, template)
assert(!fs.existsSync(target), 'Do not overwrite existing durable answers')
fs.copyFileSync(source, target, fs.constants.COPYFILE_EXCL)
assert.equal(hash(target), hash(source))
console.log('n12: ten approved conditional-aware answers copied byte-identically; formal template and current prompts match')
