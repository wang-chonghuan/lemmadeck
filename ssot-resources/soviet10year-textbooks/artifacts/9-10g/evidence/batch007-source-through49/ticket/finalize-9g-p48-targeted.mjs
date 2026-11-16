import assert from 'node:assert/strict'
import fs from 'node:fs'
import { spawnSync } from 'node:child_process'

const root = '.intentfold/tickets/STEMROBIN-184/tmp/9g-p48-count-diagnostic'
const durable = 'ssot-resources/soviet10year-textbooks/artifacts/9-10g/pages/0048'
assert(!fs.existsSync(`${root}/finalize-command.json`), 'No repeated affected finalize')
const executable = '.claude/skills/ld-s10y-lesson/.venv/bin/python'
const args = ['-B', '.claude/skills/ld-s10y-lesson/tools/p2c.py',
  'finalize', '--book', '9-10g', '--page', '48']
const startedAtUtc = new Date().toISOString()
const result = spawnSync(executable, args, { encoding: 'utf8' })
fs.writeFileSync(`${root}/finalize.stdout.txt`, result.stdout || '')
fs.writeFileSync(`${root}/finalize.stderr.txt`, result.stderr || '')
fs.writeFileSync(`${root}/finalize-command.json`, JSON.stringify({
  executable, args, cwd: process.cwd(), startedAtUtc,
  finishedAtUtc: new Date().toISOString(), exitCode: result.status,
  signal: result.signal, error: result.error?.message || null,
}, null, 2) + '\n')
fs.mkdirSync(`${root}/after-targeted`, { recursive: true })
for (const name of ['page.md', 'page.json', 'audit.json']) {
  fs.copyFileSync(`${durable}/${name}`, `${root}/after-targeted/${name}`,
    fs.constants.COPYFILE_EXCL)
}
console.log(result.stdout)
console.error(result.stderr)
assert.equal(result.status, 0, 'Preserve actual failure and stop')
const read = file => JSON.parse(fs.readFileSync(file))
const before = read(`${root}/before-metadata/page.json`)
const after = read(`${durable}/page.json`)
for (const index of [0, 2]) before.blocks[index].lines[1] += ' '
assert.deepEqual(after.blocks, before.blocks, 'Only two independently identified trailing spaces')
const audit = read(`${durable}/audit.json`)
assert.equal(audit.lines_printed, 25)
assert.equal(audit.lines_md, 25)
assert.deepEqual(audit.errors, [])
console.log('Affected48 passed25/25; exactly two trailing spaces, no mathematical change')
