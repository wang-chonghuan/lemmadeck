import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'

const root = '.intentfold/tickets/STEMROBIN-184/tmp/10c-p40-count-diagnostic'
const source = 'ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0040'
const sha = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
assert(!fs.existsSync(`${root}/finalize-command.json`), 'Do not repeat this affected finalize')
assert.equal(sha(`${source}/page.json`),
  '88af1f446cc15852d6a66d4b483840a506744688ccb5a4a5ca3a5f68562e4e29')
assert.equal(sha(`${source}/audit.json`),
  'ef7d43a8a1a6af6199ac3f23c16bec0ad4b780bf0e944f7dce09f2b532678aa7')
const executable = '.claude/skills/ld-s10y-lesson/.venv/bin/python'
const args = ['-B', '.claude/skills/ld-s10y-lesson/tools/p2c.py',
  'finalize', '--book', '10c', '--page', '40']
const startedAtUtc = new Date().toISOString()
const result = spawnSync(executable, args, { encoding: 'utf8' })
fs.writeFileSync(`${root}/finalize.stdout.txt`, result.stdout || '')
fs.writeFileSync(`${root}/finalize.stderr.txt`, result.stderr || '')
fs.writeFileSync(`${root}/finalize-command.json`, JSON.stringify({
  executable, args, cwd: process.cwd(), startedAtUtc,
  finishedAtUtc: new Date().toISOString(), exitCode: result.status,
  signal: result.signal, error: result.error?.message || null,
}, null, 2) + '\n')
fs.mkdirSync(`${root}/after-metadata`, { recursive: true })
for (const name of ['page.md', 'page.json', 'audit.json']) {
  fs.copyFileSync(path.join(source, name), `${root}/after-metadata/${name}`,
    fs.constants.COPYFILE_EXCL)
}
console.log(result.stdout)
console.error(result.stderr)
assert.equal(result.status, 0, 'Preserve actual affected failure and stop')
const before = JSON.parse(fs.readFileSync(`${root}/first-failed-triples/page.json`))
const after = JSON.parse(fs.readFileSync(`${source}/page.json`))
assert.deepEqual(after.blocks, before.blocks, 'All 38 literal tasks and same rows unchanged')
const audit = JSON.parse(fs.readFileSync(`${source}/audit.json`))
assert.deepEqual(audit.errors, [])
assert.equal(audit.lines_md, 21)
assert.equal(audit.lines_printed, 21)
console.log('Affected metadata finalize passed21/21; all source blocks unchanged')
