import assert from 'node:assert/strict'
import fs from 'node:fs'
import { spawnSync } from 'node:child_process'

const out = '.intentfold/tickets/STEMROBIN-184/tmp/source-10c-p53-row-core-guard/compatibility-tests'
assert(!fs.existsSync(out), 'First focused compatibility run only')
const executable = '.claude/skills/ld-s10y-lesson/.venv/bin/python'
const modules = [
  'test_fraction_line_spacing', 'test_compound_fraction_rows', 'test_inline_fraction_row',
  'test_interval_fraction_rows', 'test_underlined_rows', 'test_vector_arrow_rows',
]
const args = ['-B', '-m', 'unittest', '-v', ...modules]
const cwd = `${process.cwd()}/.claude/skills/ld-s10y-lesson/tests`
const start = { executable: `${process.cwd()}/${executable}`, args, cwd, startedAtUtc: new Date().toISOString() }
fs.mkdirSync(out)
fs.writeFileSync(`${out}/start.json`, JSON.stringify(start, null, 2) + '\n', { flag: 'wx' })
const result = spawnSync(start.executable, args, { cwd, encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 })
fs.writeFileSync(`${out}/stdout.txt`, result.stdout || '', { flag: 'wx' })
fs.writeFileSync(`${out}/stderr.txt`, result.stderr || '', { flag: 'wx' })
fs.writeFileSync(`${out}/result.json`, JSON.stringify({
  ...start, finishedAtUtc: new Date().toISOString(), exitCode: result.status,
  signal: result.signal, error: result.error?.message || null,
}, null, 2) + '\n', { flag: 'wx' })
console.log(result.stdout)
console.error(result.stderr)
assert.equal(result.status, 0, 'Retain first failure; do not rerun successful cases')
