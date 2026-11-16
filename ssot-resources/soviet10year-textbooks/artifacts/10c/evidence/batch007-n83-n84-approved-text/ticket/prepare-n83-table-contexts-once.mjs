import assert from 'node:assert/strict'
import fs from 'node:fs'
import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'

const ticket = '.intentfold/tickets/STEMROBIN-184/tmp'
const root = `${ticket}/n83-table-contexts`
const ids = ['tbl-p0036-01', 'tbl-p0038-01']
const text = 'ssot-resources/soviet10year-textbooks/artifacts/10c/editions/modern-us-neutral/lessons/ana10-c6-s3-n83'
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
assert.equal(hash(`${text}/lesson.json`),
  'd4db11167eea1ec208f6d30039e3b9befaa94e48fbce03e5ccedb4a7b102ff8e')
assert.equal(hash(`${text}/exercises.json`),
  '3174f166733abd18869f76197cec5577573b6e3468e729b194b0a583af110266')
assert(!fs.existsSync(root), 'Only the first official context preparation')
for (const id of ids) {
  assert(!fs.existsSync(`.tmp/s10y-image/batch007/10c/${id}/context.json`))
}
fs.mkdirSync(root)
for (const id of ids) {
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
  assert.equal(result.status, 0, `Preserve first failure of ${id}`)
}
