import assert from 'node:assert/strict'
import fs from 'node:fs'
import { spawnSync } from 'node:child_process'

const root = '.intentfold/tickets/STEMROBIN-184/tmp/prepare-6g-p70-p71-first'
const python = '.claude/skills/ld-s10y-lesson/.venv/bin/python'
const p2c = '.claude/skills/ld-s10y-lesson/tools/p2c.py'
assert(!fs.existsSync(root), 'Only first preparation; preserve all prior evidence')
for (const page of [70, 71]) {
  const id = String(page).padStart(4, '0')
  assert(!fs.existsSync(`.tmp/ld-s10y-lesson/6-8g/pages/${id}`))
  assert(!fs.existsSync(`ssot-resources/soviet10year-textbooks/artifacts/6-8g/pages/${id}`))
}
fs.mkdirSync(root)
for (const page of [70, 71]) {
  const args = ['-B', p2c, 'prepare', '--book', '6-8g', '--page', String(page)]
  const startedAtUtc = new Date().toISOString()
  const result = spawnSync(python, args, { encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 })
  const prefix = `${root}/${page}`
  fs.writeFileSync(`${prefix}.stdout.txt`, result.stdout || '', { flag: 'wx' })
  fs.writeFileSync(`${prefix}.stderr.txt`, result.stderr || '', { flag: 'wx' })
  fs.writeFileSync(`${prefix}.command.json`, JSON.stringify({
    executable: python, args, cwd: process.cwd(), startedAtUtc,
    finishedAtUtc: new Date().toISOString(), exitCode: result.status, signal: result.signal,
    error: result.error?.message || null, invocationCount: 1,
    limits: 'Preparation only; no source transcription, inventory, approval, assembly or completed lesson.',
  }, null, 2) + '\n', { flag: 'wx' })
  console.log(result.stdout)
  assert.equal(result.status, 0, `Preserve first ${page} failure`)
}
