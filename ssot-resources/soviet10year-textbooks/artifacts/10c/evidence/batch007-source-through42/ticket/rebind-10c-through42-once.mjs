import assert from 'node:assert/strict'
import fs from 'node:fs'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'

const ticket = '.intentfold/tickets/STEMROBIN-184/tmp'
const root = `${ticket}/rebind-10c-through42`
const book = 'ssot-resources/soviet10year-textbooks/artifacts/10c/book.json'
assert.equal(createHash('sha256').update(fs.readFileSync(book)).digest('hex'),
  '93d6d63d1572316e8ecda7b296911b593279a6a425be0261939d619e924f1565')
assert(!fs.existsSync(root), 'Run only this previously unattempted current binding')
fs.mkdirSync(root)
const executable = 'python3'
const args = [`${ticket}/rebind-book-trace.py`, '10c',
  'ana10-c6-s1-n75', 'ana10-c6-s1-n76', 'ana10-c6-s1-n77',
  'ana10-c6-s1-n78', 'ana10-c6-s2-n79']
const startedAtUtc = new Date().toISOString()
const result = spawnSync(executable, args, {
  cwd: process.cwd(), encoding: 'utf8',
  env: { ...process.env, PLAYWRIGHT_HTML_OPEN: 'never' },
})
fs.writeFileSync(`${root}/stdout.txt`, result.stdout || '')
fs.writeFileSync(`${root}/stderr.txt`, result.stderr || '')
fs.writeFileSync(`${root}/command.json`, JSON.stringify({
  executable, args, cwd: process.cwd(), startedAtUtc,
  finishedAtUtc: new Date().toISOString(), exitCode: result.status,
  signal: result.signal, error: result.error?.message || null,
}, null, 2) + '\n')
console.log(result.stdout)
console.error(result.stderr)
assert.equal(result.status, 0, 'Preserve any first failure; no automatic rerun')
