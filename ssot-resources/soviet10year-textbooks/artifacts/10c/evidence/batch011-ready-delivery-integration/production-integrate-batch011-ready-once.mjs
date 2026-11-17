import assert from 'node:assert/strict'
import fs from 'node:fs'
import { createHash } from 'node:crypto'
import { execFileSync, spawnSync } from 'node:child_process'

const ticket = '.intentfold/tickets/STEMROBIN-184/tmp'
const output = `${ticket}/production-batch011-ready-integration`
const root = 'ssot-resources/soviet10year-textbooks/artifacts/10c'
const bookPath = `${root}/book.json`
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const sha = bytes => createHash('sha256').update(bytes).digest('hex')
const selected = ['ana10-c7-s2-n102', 'ana10-c7-s2-n103']
assert(!fs.existsSync(output), 'Do not repeat delivery integration')
assert.equal(execFileSync('git', ['branch', '--show-current'], { encoding: 'utf8' }).trim(),
  'codex/STEMROBIN-184-textbooks')
const beforeBytes = fs.readFileSync(bookPath)
const before = JSON.parse(beforeBytes)
const base = JSON.parse(execFileSync('git', ['show', `HEAD:${bookPath}`],
  { encoding: 'utf8' }))
assert.deepEqual(before.lessons.slice(0, base.lessons.length), base.lessons)
assert.deepEqual(before.lessons.slice(base.lessons.length).map(item => item.id),
  [...selected, 'ana10-c7-s2-n107'])
const rows = selected.map(id => before.lessons.find(item => item.id === id))
const lessons = [...base.lessons, ...rows]
const numbers = []
const figures = new Set()
for (const row of lessons) {
  const source = read(`${root}/lessons/${row.id}/lesson.json`)
  const exercises = read(`${root}/lessons/${row.id}/exercises.json`).exercises
  assert.equal(source.prose.length, row.prose_blocks)
  assert.equal(exercises.length, row.exercises)
  assert.equal(source.figures.length, row.figures)
  for (const exercise of exercises) {
    const number = String(exercise.source_number ?? exercise.number)
    if (/^\d+$/.test(number)) numbers.push(Number(number))
  }
  for (const figure of source.figures) {
    const match = /^fig-(\d+)$/.exec(figure.id)
    if (match) figures.add(Number(match[1]))
  }
}
const next = {
  ...base,
  pages: base.pages + 5,
  lessons,
  audit: {
    ...base.audit,
    exercise_count: lessons.reduce((sum, row) => sum + row.exercises, 0),
    exercise_range: [Math.min(...numbers), Math.max(...numbers)],
    figure_numbers: [...figures].sort((a, b) => a - b),
    warnings: [...base.audit.warnings,
      'Partial submitted-catalog aggregates only; inherited source gate records are retained, not a fresh whole-book PASS.'],
  },
}
assert.equal(next.audit.exercise_count, 209)
assert.deepEqual(next.audit.exercise_range, [1, 443])
assert.deepEqual(next.audit.figure_numbers, base.audit.figure_numbers)
assert.deepEqual(next.lessons.slice(0, base.lessons.length), base.lessons)
for (const id of selected) {
  const directory = `${root}/editions/modern-us-neutral/lessons/${id}`
  assert.equal(read(`${directory}/adaptation.audit.json`).status, 'pass')
  assert.equal(read(`${directory}/answer-keys.audit.json`).status, 'pass')
}
fs.mkdirSync(output)
fs.writeFileSync(`${output}/before-book.json`, beforeBytes, { flag: 'wx' })
fs.writeFileSync(`${output}/base-book.json`, JSON.stringify(base, null, 2) + '\n',
  { flag: 'wx' })
const nextBytes = Buffer.from(JSON.stringify(next, null, 2) + '\n')
assert(fs.readFileSync(bookPath).equals(beforeBytes), 'Concurrent book edit')
fs.writeFileSync(bookPath, nextBytes)
fs.writeFileSync(`${output}/after-book.json`, nextBytes, { flag: 'wx' })
fs.writeFileSync(`${output}/index-integration.json`, JSON.stringify({
  completeLessons: selected,
  heldIndexEntryNotDelivered: 'ana10-c7-s2-n107',
  heldSourceFilesAndFrozenFailures: 'Preserved unchanged; original index bytes retained in before-book.json.',
  sourceSupportPages: [120, 121, 122, 123, 124],
  beforeBookSha256: sha(beforeBytes), afterBookSha256: sha(nextBytes),
  aggregateOnly: true, wholeBookApproval: false,
  priorLessonEntriesUnchanged: true,
  inheritedGateRecordsNotRerun: true,
}, null, 2) + '\n', { flag: 'wx' })

const edition = `${root}/editions/modern-us-neutral/lessons`
const choices = lessons.map(item => item.id).filter(id =>
  fs.existsSync(`${edition}/${id}/choice-set/review.json`))
assert.equal(choices.length, 10)
fs.copyFileSync(`${ticket}/rebind-book-trace.py`, `${output}/rebind-book-trace-used.py`)
fs.copyFileSync(`${ticket}/rebind-choice-provenance-once.py`,
  `${output}/rebind-choice-provenance-used.py`)
const args = ['-B', `${ticket}/rebind-book-trace.py`, '10c', ...choices]
const started = new Date().toISOString()
const result = spawnSync('python3', args,
  { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 })
for (const [name, text] of [['stdout', result.stdout], ['stderr', result.stderr]]) {
  fs.writeFileSync(`${output}/${name}.txt`, text ?? '', { flag: 'wx' })
}
fs.writeFileSync(`${output}/command.json`, JSON.stringify({
  args, started, finished: new Date().toISOString(),
  exitCode: result.status, signal: result.signal, error: result.error?.message ?? null,
  scope: 'Changed book-trace bindings only; existing source, semantic and display evidence reused.',
}, null, 2) + '\n', { flag: 'wx' })
for (const id of choices) {
  const seed = read(`${edition}/${id}/choice-set/seed.json`)
  const prior = `${ticket}/provenance-before-current/10c/${id}`
  if (fs.existsSync(prior)) fs.cpSync(prior, `${output}/before-choices/${id}`,
    { recursive: true })
  fs.cpSync(`${edition}/${id}/choice-set`, `${output}/after-choices/${id}`,
    { recursive: true })
  assert.equal(seed.trace[0].sha256, sha(nextBytes))
}
process.stdout.write(result.stdout ?? '')
process.stderr.write(result.stderr ?? '')
assert.equal(result.status, 0, 'Provenance integration failed; preserve records')
console.log(JSON.stringify({ completeLessons: selected, choicesRebound: choices.length,
  sourceBookSha256: sha(nextBytes), wholeBookApproval: false, oldChecksRerun: false }))
