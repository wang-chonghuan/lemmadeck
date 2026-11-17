import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'

const ticket = '.intentfold/tickets/STEMROBIN-184/tmp'
const output = `${ticket}/n19-current-first-review-validation`
const seed = `${ticket}/geo910-n19-choice-current-trace/seed.json`
const draft = `${ticket}/geo910-n19-choice-current-trace/draft.json`
const review = process.argv[2]
const expectedReviewHash = process.argv[3]
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const record = file => ({ path: file, sha256: hash(file) })
assert(review?.startsWith(`${ticket}/geo910-n19-choice-independent-stage3/`))
assert(/^[a-f0-9]{64}$/.test(expectedReviewHash || ''))
assert.equal(hash(review), expectedReviewHash, 'Parent-consumed official review required')
assert.equal(hash(seed), '75407854ceca1d1058c0dac057f840707951dc09911e0ea8208839eb864d3c5b')
assert.equal(hash(draft), 'ca93970e0d8d7517828dfd2c9584925b266f088fcebb2cebf9fe261de7427305')
assert(!fs.existsSync(output), 'Only the first current review-validator invocation')
const evidence = JSON.parse(fs.readFileSync(review))
assert.equal(evidence.reviewer.kind, 'independent_agent')
assert.equal(evidence.source_reviews.length, 6)
assert.equal(evidence.question_reviews.length, 6)
assert.equal(evidence.question_reviews.flatMap(item => item.mathematics.option_checks).length, 24)
assert.equal(evidence.seed_sha256, 'ca8db4e6562985a58ec8e37905bbee7df6c305e89d6d60c0ffc74b8f0ffe29df')
assert.equal(evidence.draft_sha256, '2e9a8b1d0d276528e6ed4918656641aff8880f07f9d43ad99d099fd8e10e8174')
fs.mkdirSync(output)
const inputs = [seed, draft, review].map(record)
const executable = 'python3'
const args = [
  '-B', '.agents/skills/ld-s10y-choice/scripts/validate.py',
  '--repo', '.', '--seed', seed, '--draft', draft, '--review', review,
]
const startedAtUtc = new Date().toISOString()
const result = spawnSync(executable, args, {
  encoding: 'utf8',
  maxBuffer: 8 * 1024 * 1024,
  env: { ...process.env, PWDEBUG: '', PLAYWRIGHT_HTML_OPEN: 'never' },
})
for (const [name, data] of [['stdout.raw', result.stdout || ''], ['stderr.raw', result.stderr || '']]) {
  fs.writeFileSync(path.join(output, name), data, { flag: 'wx' })
}
const command = {
  executable, args, cwd: process.cwd(), startedAtUtc, finishedAtUtc: new Date().toISOString(),
  exit: result.status, signal: result.signal, error: result.error?.message || null,
  invocationCount: 1, inputs, declaredOutcome: evidence.outcome,
  limits: 'Mechanical binding check only; independent semantic evidence is not automatically proved.',
}
fs.writeFileSync(`${output}/command.json`, JSON.stringify(command, null, 2) + '\n', { flag: 'wx' })
for (const input of inputs) assert.equal(hash(input.path), input.sha256)
console.log(JSON.stringify(command, null, 2))
console.log(result.stdout || '')
console.error(result.stderr || '')
process.exitCode = result.status ?? 1
