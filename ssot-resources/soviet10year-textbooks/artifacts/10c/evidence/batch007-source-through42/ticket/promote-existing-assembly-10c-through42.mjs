import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'

const ticket = '.intentfold/tickets/STEMROBIN-184/tmp'
const root = `${ticket}/assembly-10c-p7-p42`
const book = `${root}/10c`
const source = 'ssot-resources/soviet10year-textbooks/artifacts/10c'
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const read = file => JSON.parse(fs.readFileSync(file))
assert(!fs.existsSync(`${root}/promotion-resume.json`), 'Preserve earlier promotion')
const actual = read(`${root}/result.json`)
assert.equal(actual.exitCode, 0, 'Reuse actual successful official assembly only')
assert.equal(read(`${ticket}/advance-10c-through42/vectorize42.command.json`).exitCode, 0)
assert.equal(read(`${ticket}/advance-10c-through42/assemble42.command.json`).exitCode, 1,
  'Retain failed zero-based wrapper expectation')
const index = read(`${book}/book.json`)
assert.deepEqual(index.audit.errors, [])
const page42 = read(`${source}/pages/0042/page.json`)
const openIndex = page42.blocks.findIndex(block => block.open)
assert.equal(openIndex, 10)
// assemble.read_pages gives each source reference its one-based block number.
const expectedRef = `p0042#${openIndex + 1}`
assert.equal(index.audit.warnings.length, 1)
assert(index.audit.warnings[0].includes(expectedRef))
for (const input of actual.inputs) assert.equal(hash(input.path), input.sha256)
const previous = read(`${source}/book.json`)
for (const lesson of previous.lessons.filter(l => l.id !== 'ana10-c6-s3-n83')) {
  for (const name of ['lesson.json', 'lesson.md', 'exercises.json']) {
    assert.equal(hash(`${book}/lessons/${lesson.id}/${name}`),
      hash(`${source}/lessons/${lesson.id}/${name}`), 'Unchanged75-82 source bytes')
  }
}
for (const lesson of index.lessons) {
  fs.cpSync(`${book}/lessons/${lesson.id}`, `${source}/lessons/${lesson.id}`, { recursive: true })
}
for (const name of fs.readdirSync(`${book}/figures`)) {
  const from = path.join(book, 'figures', name)
  const to = path.join(source, 'figures', name)
  if (fs.existsSync(to)) assert.equal(hash(from), hash(to), 'Retain old source figure bytes')
  else fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL)
}
fs.copyFileSync(`${book}/book.json`, `${source}/book.json`)
fs.writeFileSync(`${root}/promotion-resume.json`, JSON.stringify({
  status: 'pass',
  officialAssemblyExitCode: actual.exitCode,
  originalWrapperExitCode: 1,
  affectedGuard: 'Source block index10 is reference p0042#11; assemble.read_pages is one-based.',
  expectedRef,
  officialAssemblyReruns: 0,
  vectorizationReruns: 0,
  bookSha256: hash(`${source}/book.json`),
  limitations: 'All original source UNKNOWNs/101 conditional parsing/n81 terminal13/n82 guide HOLD remain. This is source promotion, not a modern lesson.',
}, null, 2) + '\n')
const executable = '.claude/skills/ld-s10y-lesson/.venv/bin/python'
const args = ['-B', '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'adapt-prepare',
  '--book', '10c', '--edition', 'modern-us-neutral',
  '--lesson', 'ana10-c6-s3-n83', '--lesson', 'ana10-c6-s3-n84']
for (const id of ['ana10-c6-s3-n83', 'ana10-c6-s3-n84']) {
  assert(!fs.existsSync(`.tmp/ld-s10y-lesson/adapt/10c/modern-us-neutral/lessons/${id}`),
    'Prepare only previously unattempted modern templates')
}
const startedAtUtc = new Date().toISOString()
const result = spawnSync(executable, args, { encoding: 'utf8' })
const output = `${ticket}/advance-10c-through42/adapt-prepare83-84`
fs.writeFileSync(`${output}.stdout.txt`, result.stdout || '')
fs.writeFileSync(`${output}.stderr.txt`, result.stderr || '')
fs.writeFileSync(`${output}.command.json`, JSON.stringify({
  executable, args, cwd: process.cwd(), startedAtUtc,
  finishedAtUtc: new Date().toISOString(), exitCode: result.status,
  signal: result.signal, error: result.error?.message || null,
}, null, 2) + '\n')
console.log('Existing successful source assembly promoted; zero official gate reruns')
console.log(result.stdout)
console.error(result.stderr)
assert.equal(result.status, 0, 'Preserve the first prepare failure if any')
