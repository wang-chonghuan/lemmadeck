import assert from 'node:assert/strict'
import fs from 'node:fs'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'

const root = '.intentfold/tickets/STEMROBIN-184/tmp/source-9g-p76-first-finalize'
const source = 'ssot-resources/soviet10year-textbooks/artifacts/9-10g'
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const write = (name, value) => fs.writeFileSync(`${root}/${name}`, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' })
assert(!fs.existsSync(root))
assert(!fs.existsSync(`${source}/pages/0076/page.json`))
const disposition = '.intentfold/tickets/STEMROBIN-184/tmp/source-9g-p76-p79-targeted-disposition/disposition.json'
assert.equal(JSON.parse(fs.readFileSync(disposition)).status, 'SUPPORTED_SOURCE_SUBSET_APPLIED_RESIDUAL_HOLDS')
const protectedFiles = [`${source}/book.json`,
  ...[77, 78, 79].map(page => `${source}/pages/00${page}/page.md`),
  '.claude/skills/ld-s10y-lesson/tools/layout.py',
  '.tmp/ld-s10y-lesson/9-10g/pages/0076/page.png']
const records = protectedFiles.map(path => ({ path, sha256: hash(path) }))
fs.mkdirSync(root)
fs.copyFileSync(`${source}/pages/0076/page.md`, `${root}/before-page.md`, fs.constants.COPYFILE_EXCL)
write('before.json', { protected: records, disposition: { path: disposition, sha256: hash(disposition) } })
const executable = '.claude/skills/ld-s10y-lesson/.venv/bin/python'
const args = ['-B', '.claude/skills/ld-s10y-lesson/tools/p2c.py',
  'finalize', '--book', '9-10g', '--page', '76']
const startedAtUtc = new Date().toISOString()
const child = spawnSync(executable, args, { encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 })
for (const [name, text] of [['stdout.txt', child.stdout || ''], ['stderr.txt', child.stderr || '']]) {
  fs.writeFileSync(`${root}/${name}`, text, { flag: 'wx' })
}
write('command.json', { executable, args, cwd: process.cwd(), startedAtUtc,
  finishedAtUtc: new Date().toISOString(), exit: child.status,
  signal: child.signal, error: child.error?.message || null, invocationCount: 1 })
console.log(child.stdout)
console.error(child.stderr)
assert.deepEqual(protectedFiles.map(path => ({ path, sha256: hash(path) })), records)
const after = ['page.md', 'page.json', 'audit.json'].map(name => {
  const path = `${source}/pages/0076/${name}`
  return { path, sha256: hash(path) }
})
write('result.json', { status: child.status === 0 ? 'SOURCE76_FIRST_FINALIZE_PASS_PRECURSOR_ONLY' : 'SOURCE76_FIRST_FINALIZE_FAIL',
  after, protected: records, heldPagesUnfinalized: [77, 78, 79],
  limits: 'No previous gate repeated. Supported H1/H2 source corrections only; no assembly, vectorize, source-book, answer or whole-lesson approval.' })
assert.equal(child.status, 0, 'Preserve first failure; no retry or count override')
