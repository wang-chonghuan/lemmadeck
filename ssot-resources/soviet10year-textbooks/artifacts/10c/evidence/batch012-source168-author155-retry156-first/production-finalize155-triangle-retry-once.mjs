import assert from 'node:assert/strict'
import fs from 'node:fs'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'

const ticket = '.intentfold/tickets/STEMROBIN-184/tmp'
const root = 'ssot-resources/soviet10year-textbooks/artifacts/10c'
const durable = `${root}/pages/0155`
const first = `${ticket}/production-source10c152-155-first-finalize/0155`
const retained = `${root}/evidence/batch012-source155156-affected-and160-first`
const output = `${ticket}/production-source155-triangle-retry`
const work = `${ticket}/production-source10c152-155`
const source = `${work}/10c/pages/0155/page.png`
const layout = '.claude/skills/ld-s10y-lesson/tools/layout.py'
const layoutSha256 = '899ea25c2ede96a1f8c60eec3b5565e22f967e2c345d34d8255a11dc21d88a73'
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
assert(!fs.existsSync(output), 'Sole affected retry only')
assert.equal(hash(layout), layoutSha256)
assert.equal(hash(`${retained}/155-affected-text/triangle-corrected-report.md`),
  '4948d026b0a711fcfdf54ceca50e696ab4e04d37b699217fd0ac5ec514064632')
assert.equal(hash(`${durable}/page.md`), '52e78b8ce14e4ea297256639efc6385048bdff9e67caea28c93915ba20e58a84')
assert.equal(read(`${first}/command.json`).exitCode, 1)
assert.deepEqual(read(`${durable}/audit.json`), read(`${first}/audit.json`))
const oldAudit = read(`${first}/audit.json`)
assert.equal(oldAudit.lines_printed, 25)
assert.equal(oldAudit.lines_md, 25)
assert.equal(oldAudit.unknown_chars[0].codepoint, 'U+25B6')
const sourceSha256 = hash(source)
const originalMd = fs.readFileSync(`${durable}/page.md`)
const oldJson = read(`${durable}/page.json`)
fs.mkdirSync(output)
for (const name of ['page.md', 'page.json', 'audit.json'])
  fs.copyFileSync(`${durable}/${name}`, `${output}/before-${name}`, fs.constants.COPYFILE_EXCL)
const args = ['-B', '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'finalize',
  '--book', '10c', '--page', '155', '--work', work]
const started = new Date().toISOString()
const result = spawnSync('.claude/skills/ld-s10y-lesson/.venv/bin/python', args,
  { encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 })
fs.writeFileSync(`${output}/command.json`, JSON.stringify({
  args, started, finished: new Date().toISOString(), exitCode: result.status,
  signal: result.signal, error: result.error?.message ?? null, layoutSha256, source, sourceSha256,
}, null, 2) + '\n', { flag: 'wx' })
for (const [name, text] of [['stdout', result.stdout], ['stderr', result.stderr]])
  fs.writeFileSync(`${output}/${name}.txt`, text ?? '', { flag: 'wx' })
for (const name of ['page.md', 'page.json', 'audit.json'])
  fs.copyFileSync(`${durable}/${name}`, `${output}/${name}`, fs.constants.COPYFILE_EXCL)
const audit = read(`${durable}/audit.json`)
const current = read(`${durable}/page.json`)
assert.equal(hash(layout), layoutSha256)
assert.equal(hash(source), sourceSha256)
assert(originalMd.equals(fs.readFileSync(`${durable}/page.md`)))
assert.deepEqual(audit.figures, oldAudit.figures)
assert.deepEqual(audit.count_exclusions, oldAudit.count_exclusions)
assert.deepEqual(audit.normalizations, [])
assert.deepEqual(current.blocks.filter(block => block.type === 'fig'),
  oldJson.blocks.filter(block => block.type === 'fig'))
fs.writeFileSync(`${output}/invariants.json`, JSON.stringify({
  sourceUnchanged: true, markdownUnchanged: true, layoutUnchanged: true,
  figureGeometryUnchanged: true, countExclusionsUnchanged: true, normalizations: [],
  otherPagesRerun: [], linesPrinted: audit.lines_printed, linesMarkdown: audit.lines_md,
  firstFailurePreserved: first,
}, null, 2) + '\n', { flag: 'wx' })
console.log(JSON.stringify({ exitCode: result.status, stdout: result.stdout, stderr: result.stderr }))
process.exitCode = result.status ?? 1
