import assert from 'node:assert/strict'
import fs from 'node:fs'
import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'

const ticket = '.intentfold/tickets/STEMROBIN-184/tmp'
const root = `${ticket}/n84-figure-contexts`
const text = 'ssot-resources/soviet10year-textbooks/artifacts/10c/editions/modern-us-neutral/lessons/ana10-c6-s3-n84'
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
assert.equal(hash(`${text}/lesson.json`),
  '8f5b23c0785a64fb25a8f416f28a629c499c5a35b75990b8a4183cc5b142caa7')
assert.equal(hash(`${text}/exercises.json`),
  '0e800acf85dfc5f4d8be3a57877fa2aeb009544656d7452730f0bcc38ea638b9')
assert(!fs.existsSync(root))
for (const id of ['fig-22', 'fig-23']) {
  assert(!fs.existsSync(`.tmp/s10y-image/batch007/10c/${id}/context.json`))
}
fs.mkdirSync(root)
for (const id of ['fig-22', 'fig-23']) {
  const executable = 'python3'
  const args = ['.agents/skills/ld-s10y-image/scripts/build_context.py',
    '--book', '10c', '--edition', 'modern-us-neutral', '--figure', id,
    '--output', `.tmp/s10y-image/batch007/10c/${id}/context.json`]
  const startedAtUtc = new Date().toISOString()
  const result = spawnSync(executable, args, { encoding: 'utf8' })
  fs.writeFileSync(`${root}/${id}.stdout.txt`, result.stdout || '')
  fs.writeFileSync(`${root}/${id}.stderr.txt`, result.stderr || '')
  fs.writeFileSync(`${root}/${id}.command.json`, JSON.stringify({
    executable, args, cwd: process.cwd(), startedAtUtc,
    finishedAtUtc: new Date().toISOString(), exitCode: result.status,
    signal: result.signal, error: result.error?.message || null,
  }, null, 2) + '\n')
  console.log(result.stdout)
  console.error(result.stderr)
  assert.equal(result.status, 0, `Preserve first ${id} context failure`)
}
