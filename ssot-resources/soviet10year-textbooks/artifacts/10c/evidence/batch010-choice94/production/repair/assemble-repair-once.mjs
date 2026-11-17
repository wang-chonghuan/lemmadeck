import assert from 'node:assert/strict'
import fs from 'node:fs'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'

const root = '.intentfold/tickets/STEMROBIN-184/tmp/production-choice10c94'
const directory = `${root}/repair`
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
assert.equal(hash(`${root}/author/draft.json`), 'cc705742a6768e5527f601780f2aca3c8c6d2b50cdf7ca412da42bba1c52ce52')
assert.equal(read(`${root}/reviewer/review.json`).outcome, 'revise')
assert(!fs.existsSync(`${directory}/draft.json`), 'Only one affected repair')
const before = read(`${root}/author/draft.json`)
const after = structuredClone(before)
after.questions = after.questions.filter(question => question.id !== 'q03')
after.questions[1] = read(`${directory}/new-q02.json`)
for (const item of after.coverage) {
  if (!['311', '312'].includes(item.source_number)) continue
  item.question_ids = ['q02']
  item.omitted_tasks = [
    'Discovering the sine substitution and independently writing the factorization, range rejection, periodic derivation and exhaustiveness proof are not demonstrated.',
    'The two written equations share a joint recognition response instead of separate produced derivations.',
  ]
  item.reason = `The joint response checks both different algebraic root sets before range filtering and both complete original real solution sets. Source ${item.source_number} retains its own equation and rejected root; shared endpoint-only answer transfer is removed. Recognition and the supplied substitution are explicitly recorded capacity losses.`
}
for (const question of before.questions.filter(question => !['q02', 'q03'].includes(question.id))) {
  assert.deepEqual(after.questions.find(item => item.id === question.id), question)
}
for (const coverage of before.coverage.filter(item => !['311', '312'].includes(item.source_number))) {
  assert.deepEqual(after.coverage.find(item => item.source_number === coverage.source_number), coverage)
}
assert.equal(after.questions.length, 14)
assert.equal(after.questions.reduce((sum, question) => sum + question.view.options.length, 0), 55)
assert.deepEqual(after.new_figures, before.new_figures)
assert.equal(after.seed_sha256, before.seed_sha256)
fs.writeFileSync(`${directory}/draft.json`, JSON.stringify(after, null, 2) + '\n', { flag: 'wx' })
fs.writeFileSync(`${directory}/views.json`, JSON.stringify(after.questions.map(({ id, view }) =>
  ({ id, view })), null, 2) + '\n', { flag: 'wx' })
const args = ['.agents/skills/ld-s10y-choice/scripts/validate.py', '--repo', '.',
  '--seed', `${root}/seed.json`, '--draft', `${directory}/draft.json`]
const result = spawnSync('python3', args, { encoding: 'utf8' })
fs.writeFileSync(`${directory}/validation-first.json`, JSON.stringify({
  args, exitCode: result.status, stdout: result.stdout, stderr: result.stderr,
}, null, 2) + '\n', { flag: 'wx' })
fs.writeFileSync(`${directory}/change-report.json`, JSON.stringify({
  parentAuthoredAffectedRepair: true,
  originalDraftUnchanged: hash(`${root}/author/draft.json`),
  originalReviewUnchanged: hash(`${root}/reviewer/review.json`),
  originalViewsUnchanged: hash(`${root}/author/views.json`),
  newDraftSha256: hash(`${directory}/draft.json`),
  newViewsSha256: hash(`${directory}/views.json`),
  affected: ['q02 replacement with sources311/312', 'q03 removed', 'coverage311/312 only'],
  unchangedQuestions: before.questions.filter(question => !['q02', 'q03'].includes(question.id)).map(({ id }) => id),
  unchangedCoverageSources: before.coverage.filter(item => !['311', '312'].includes(item.source_number)).map(({ source_number }) => source_number),
  questions: 14, options: 55,
  statement: 'All13 unaffected question objects and13 coverage objects are deeply equal. Original source solving and mathematical evidence reused, not rerun. Original15/57 draft/views/review remain unchanged.',
}, null, 2) + '\n', { flag: 'wx' })
console.log(JSON.stringify({ exitCode: result.status, stdout: result.stdout, stderr: result.stderr,
  draftSha256: hash(`${directory}/draft.json`), viewsSha256: hash(`${directory}/views.json`),
  questions: 14, options: 55 }, null, 2))
process.exitCode = result.status ?? 1
