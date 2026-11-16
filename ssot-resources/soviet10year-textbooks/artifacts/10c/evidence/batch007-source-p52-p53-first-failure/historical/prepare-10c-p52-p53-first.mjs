import assert from 'node:assert/strict'
import fs from 'node:fs'
import { spawnSync } from 'node:child_process'

const root = '.intentfold/tickets/STEMROBIN-184/tmp/prepare-10c-p52-p53-first'
const executable = '.claude/skills/ld-s10y-lesson/.venv/bin/python'
assert(!fs.existsSync(root), 'Preserve first preparation evidence')
for (const page of [52, 53]) {
  const id = String(page).padStart(4, '0')
  assert(!fs.existsSync(`.tmp/ld-s10y-lesson/10c/pages/${id}`))
  assert(!fs.existsSync(`ssot-resources/soviet10year-textbooks/artifacts/10c/pages/${id}`))
}
fs.mkdirSync(root)
for (const page of [52, 53]) {
  const args = ['-B', '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'prepare', '--book', '10c', '--page', String(page)]
  const startedAtUtc = new Date().toISOString()
  const result = spawnSync(executable, args, { encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 })
  const prefix = `${root}/${page}`
  fs.writeFileSync(`${prefix}.stdout.txt`, result.stdout || '', { flag: 'wx' })
  fs.writeFileSync(`${prefix}.stderr.txt`, result.stderr || '', { flag: 'wx' })
  fs.writeFileSync(`${prefix}.command.json`, JSON.stringify({
    executable, args, cwd: process.cwd(), startedAtUtc, finishedAtUtc: new Date().toISOString(),
    exitCode: result.status, signal: result.signal, error: result.error?.message || null, invocationCount: 1,
    limits: 'First preparation only; no transcription, row override, source review, completed unit or existing HOLD re-gate.',
  }, null, 2) + '\n', { flag: 'wx' })
  console.log(result.stdout)
  assert.equal(result.status, 0, `Preserve first page${page} failure`)
}
