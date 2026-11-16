import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'

const root = process.cwd()
const ticket = '.intentfold/tickets/STEMROBIN-184/tmp'
const out = `${ticket}/source-10c-p53-affected-finalize`
const page = 'ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0053'
const prepared = '.tmp/ld-s10y-lesson/10c/pages/0053'
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const write = (file, value) => fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' })
assert(!fs.existsSync(out), 'One affected finalize; no overwrite/retry')
const diagnostic = JSON.parse(fs.readFileSync(`${ticket}/source-10c-p53-row-diagnostic/diagnostic.json`))
const old = Object.keys(diagnostic.protected).find(file => file.endsWith('/0053/page.md'))
const archive = 'ssot-resources/soviet10year-textbooks/artifacts/10c/evidence/batch007-source-p52-p53-first-failure'
const find = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
  const file = path.join(dir, entry.name)
  return entry.isDirectory() ? find(file) : [file]
})
const originalMd = find(archive).find(file => hash(file) === diagnostic.protected[old])
assert(originalMd, 'Retained first-failure MD must exist')
const before = fs.readFileSync(originalMd, 'utf8')
const edited = fs.readFileSync(`${page}/page.md`, 'utf8')
assert.equal((before.match(/\\arccos/g) || []).length, 8)
assert.equal(edited, before.replaceAll('\\arccos', '\\operatorname{arc\\,cos}'))
const guardFiles = [
  ...['page.md', 'page.json', 'audit.json'].map(name =>
    `ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0052/${name}`),
  ...['page.png', 'page.grid.png', 'layout.json', 'page.template.md'].map(name => `${prepared}/${name}`),
  `${prepared}/figures/fig-31.png`,
]
const guard = guardFiles.map(file => ({ path: file, sha256: hash(file) }))
const oldJson = JSON.parse(fs.readFileSync(`${page}/page.json`))
fs.mkdirSync(out)
for (const phase of ['before', 'after']) {
  if (phase === 'after') break
  fs.mkdirSync(`${out}/${phase}`)
  for (const file of ['page.md', 'page.json', 'audit.json'])
    fs.copyFileSync(`${page}/${file}`, `${out}/${phase}/${file}`, fs.constants.COPYFILE_EXCL)
}
const executable = '.claude/skills/ld-s10y-lesson/.venv/bin/python'
const args = ['-B', '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'finalize', '--book', '10c', '--page', '53']
const start = { executable, args, cwd: root, startedAtUtc: new Date().toISOString(), invocationCount: 1, guard }
write(`${out}/start.json`, start)
const result = spawnSync(executable, args, { encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 })
fs.writeFileSync(`${out}/stdout.txt`, result.stdout || '', { flag: 'wx' })
fs.writeFileSync(`${out}/stderr.txt`, result.stderr || '', { flag: 'wx' })
write(`${out}/result.json`, {
  ...start, finishedAtUtc: new Date().toISOString(), exitCode: result.status,
  signal: result.signal, error: result.error?.message || null,
})
fs.mkdirSync(`${out}/after`)
for (const file of ['page.md', 'page.json', 'audit.json'])
  fs.copyFileSync(`${page}/${file}`, `${out}/after/${file}`, fs.constants.COPYFILE_EXCL)
console.log(result.stdout)
console.error(result.stderr)
assert.equal(result.status, 0, 'Preserve failure; no repeat')
for (const item of guard) assert.equal(hash(item.path), item.sha256, item.path)
const current = JSON.parse(fs.readFileSync(`${page}/page.json`))
const replace = value => {
  if (typeof value === 'string') return value.replaceAll('\\arccos', '\\operatorname{arc\\,cos}')
  if (Array.isArray(value)) return value.map(replace)
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, replace(item)]))
  return value
}
assert.deepEqual(current, replace(oldJson))
const audit = JSON.parse(fs.readFileSync(`${page}/audit.json`))
assert.equal(audit.lines_printed, 20)
assert.equal(audit.lines_md, 20)
assert.deepEqual(audit.normalizations, [])
write(`${out}/comparison.json`, {
  status: 'AFFECTED_FINALIZE_PASS_NOT_SOURCE_APPROVAL',
  changed: 'Only eight independently supported operator tokens; counter core guard',
  sourceJsonExactOperatorReplacementOnly: true, guards: guard,
  audit, pageMdSha256: hash(`${page}/page.md`), pageJsonSha256: hash(`${page}/page.json`),
  preservedFirstFailure: true, newImages: 0, broadChecks: false,
})
console.log(JSON.stringify({ exit: result.status, rows: [audit.lines_printed, audit.lines_md], md: hash(`${page}/page.md`), json: hash(`${page}/page.json`) }))
