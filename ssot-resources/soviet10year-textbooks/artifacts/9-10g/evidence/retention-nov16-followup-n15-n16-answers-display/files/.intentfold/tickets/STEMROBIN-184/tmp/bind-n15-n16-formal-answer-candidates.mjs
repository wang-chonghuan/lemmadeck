import assert from 'node:assert/strict'
import fs from 'node:fs'
import { createHash } from 'node:crypto'

const T = '.intentfold/tickets/STEMROBIN-184/tmp'
const root = '.tmp/ld-s10y-answer/9-10g/modern-us-neutral/lessons'
const edition = 'ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/modern-us-neutral'
const read = file => JSON.parse(fs.readFileSync(file))
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const record = file => ({ path: file, sha256: hash(file) })
const proseFile = `${T}/geo910-n14-n16-standard-answer-prose.json`
const prose = read(proseFile)
for (const n of process.argv.slice(2)) {
  assert(['15', '16'].includes(n))
  const id = `geo910-c1-s2-n${n}`
  const output = `${T}/n14-n16-production/n${n}-formal-answer-approved-binding.json`
  assert(!fs.existsSync(output))
  const candidateFile = `${root}/${id}/answer-keys.${n === '15' ? 'candidate-repaired' : 'candidate'}.json`
  const templateFile = `${root}/${id}/answer-keys.template.json`
  const candidate = read(candidateFile)
  const template = read(templateFile)
  const before = structuredClone(candidate)
  const approved = prose.lessons[id]
  assert.deepEqual(candidate.answers.map(a => a.exercise), approved.map(a => a.exercise))
  for (let i = 0; i < candidate.answers.length; i++) {
    candidate.answers[i].displayAnswer = approved[i].displayAnswer
    const protectedFields = answer => {
      const result = structuredClone(answer)
      for (const field of ['grading', 'displayAnswer']) delete result[field]
      return result
    }
    assert.deepEqual(protectedFields(candidate.answers[i]), protectedFields(template.answers[i]))
    assert.equal(candidate.answers[i].grading, 'ungraded')
    assert.deepEqual(candidate.answers[i].parts, [])
  }
  if (n === '15') {
    const expected = structuredClone(before)
    expected.answers[1].displayAnswer = approved[1].displayAnswer
    assert.deepEqual(candidate, expected)
    fs.writeFileSync(candidateFile, JSON.stringify(candidate, null, 2) + '\n')
  } else assert.deepEqual(candidate, before)
  const written = read(`${edition}/lessons/${id}/exercises.json`).exercises
  assert.deepEqual(candidate.answers.map(a => a.exercise), written.map(e => String(e.number)))
  for (let i = 0; i < written.length; i++) {
    assert.equal(candidate.answers[i].prompt, written[i].text)
    for (const figure of candidate.answers[i].figureEvidence) {
      const reviewFile = `${edition}/figures/${figure.id}.review.json`
      const review = read(reviewFile)
      assert.equal(review.status, 'pass')
      assert.equal(review.spec.sha256, hash(figure.figureSpec))
      assert.equal(review.source.sha256, hash(figure.originalPng))
      assert.equal(review.outputs.svg.sha256, hash(figure.editionAsset))
    }
  }
  fs.writeFileSync(output, JSON.stringify({
    status: 'mechanical_binding_only',
    candidate: record(candidateFile), template: record(templateFile), prose: record(proseFile),
    firstReview: record(`${T}/geo910-n14-n16-standard-answer-independent-review.md`),
    affectedReview: record(`${T}/geo910-n14-n16-standard-answer-independent-review-addendum.md`),
    finalAffectedReview: record(`${T}/geo910-n14-n16-standard-answer-independent-review-final-affected-addendum.md`),
    scope: `${candidate.answers.length} ungraded answers; approved prose identical; protected fields unchanged`,
    limits: 'No repeated mathematics review; final affected review disposition must be consumed before this binding.',
  }, null, 2) + '\n', { flag: 'wx' })
  console.log(`${id}: formal prompt/figure/prose binding PASS`)
}
