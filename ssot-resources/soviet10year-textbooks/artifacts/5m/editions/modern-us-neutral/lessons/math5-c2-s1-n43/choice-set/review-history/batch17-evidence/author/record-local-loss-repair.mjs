import fs from 'node:fs'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'

const dir = '.intentfold/tickets/STEMROBIN-182/tmp/5m-n43'
const oldPath = `${dir}/rejected-missing-local-loss/draft.json`
const currentPath = `${dir}/draft.json`
const read = f => JSON.parse(fs.readFileSync(f, 'utf8'))
const hash = f => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex')
const before = read(oldPath)
const after = read(currentPath)
const changes = []
for (let i = 0; i < before.questions.length; i++) {
  const oldQuestion = structuredClone(before.questions[i])
  const newQuestion = structuredClone(after.questions[i])
  const oldLoss = oldQuestion.intent.limitations
  const newLoss = newQuestion.intent.limitations
  delete oldQuestion.intent.limitations
  delete newQuestion.intent.limitations
  assert.deepEqual(newQuestion, oldQuestion)
  if (JSON.stringify(oldLoss) !== JSON.stringify(newLoss)) {
    changes.push({ path: `questions[${i}].intent.limitations`, question: oldQuestion.id,
      before: oldLoss, after: newLoss })
  }
}
assert.equal(changes.length, 8)
assert.deepEqual(before.coverage, after.coverage)
assert.deepEqual(before.new_figures, after.new_figures)
const view = read(`${dir}/view.json`)
assert.deepEqual(view.questions, after.questions.map(({ id, source_numbers, view }) =>
  ({ id, source_numbers, view })))
const record = {
  stage: 'parent-question-local-production-loss-only-repair',
  before: { path: oldPath, sha256: hash(oldPath) },
  after: { path: currentPath, sha256: hash(currentPath) },
  changes, changed_fields: 8, visible_views_byte_unchanged: true,
  source_seed_sha256: hash(`${dir}/seed.json`),
  view_sha256: hash(`${dir}/view.json`),
  unchanged: ['all question views', 'keys', 'rationales', 'source solutions',
    'coverage', 'unit order', 'new figures'],
  rerun_pureview_mathematics: false, canonical_runs: 0,
}
fs.writeFileSync(`${dir}/local-loss-repair.json`, JSON.stringify(record, null, 2) + '\n',
  { flag: 'wx' })
console.log(JSON.stringify({ changed_fields: 8, views_and_mathematics_unchanged: true }))
