import assert from 'node:assert/strict'
import fs from 'node:fs'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'

const number = process.argv[2]
assert(['94', '97'].includes(number), 'Expected n94 or n97')
const ticket = '.intentfold/tickets/STEMROBIN-184/tmp'
const production = `${ticket}/production-choice10c${number}`
const selected = number === '94' ? 'repair' : 'author'
const review = number === '94' ? 'repair-review.json' : 'review.json'
const paths = {
  seed: `${production}/seed.json`,
  draft: `${production}/${selected}/draft.json`,
  review: `${production}/reviewer/${review}`,
}
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
assert.equal(read(paths.review).outcome, 'pass', 'Semantic approval required')
const evidence = `${production}/first-with-review`
assert(!fs.existsSync(evidence), 'Current review gate runs once')
fs.mkdirSync(evidence)
const lesson = number === '94' ? 'ana10-c6-s4-n94' : 'ana10-c7-s1-n97'
const destination = `ssot-resources/soviet10year-textbooks/artifacts/10c/editions/modern-us-neutral/lessons/${lesson}/choice-set`
assert(!fs.existsSync(destination), 'Never overwrite a promoted choice set')
const args = [
  '.agents/skills/ld-s10y-choice/scripts/validate.py', '--repo', '.',
  '--seed', paths.seed, '--draft', paths.draft, '--review', paths.review,
]
const start = new Date().toISOString()
const result = spawnSync('python3', args, { encoding: 'utf8' })
const record = {
  args, start, finished: new Date().toISOString(), exitCode: result.status,
  signal: result.signal, error: result.error?.message ?? null,
  stdout: result.stdout, stderr: result.stderr,
}
fs.writeFileSync(`${evidence}/validation.json`, JSON.stringify(record, null, 2) + '\n', { flag: 'wx' })
assert.equal(result.status, 0, JSON.stringify(record))
fs.mkdirSync(destination)
const copies = []
for (const [name, source] of Object.entries(paths)) {
  const retained = `${destination}/${name}.json`
  fs.copyFileSync(source, retained, fs.constants.COPYFILE_EXCL)
  assert(fs.readFileSync(source).equals(fs.readFileSync(retained)))
  copies.push({ source, retained, sha256: hash(retained) })
}
const draft = read(paths.draft)
const report = {
  lesson, validation: record, copies,
  questions: draft.questions.length,
  options: draft.questions.reduce((sum, question) => sum + question.view.options.length, 0),
  statement: 'Approved seed/draft/review retained byte-for-byte. Earlier semantic and display gates reused without rerun. No database or application integration.',
}
fs.writeFileSync(`${evidence}/promotion.json`, JSON.stringify(report, null, 2) + '\n', { flag: 'wx' })
console.log(JSON.stringify(report, null, 2))
