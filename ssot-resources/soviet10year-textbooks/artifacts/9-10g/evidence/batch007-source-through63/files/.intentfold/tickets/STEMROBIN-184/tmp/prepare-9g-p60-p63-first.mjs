import assert from 'node:assert/strict'
import fs from 'node:fs'
import { spawnSync } from 'node:child_process'

const root = '.intentfold/tickets/STEMROBIN-184/tmp/prepare-9g-p60-p63-first'
const pages = [60, 61, 62, 63]
assert(!fs.existsSync(root), 'Keep first preparation evidence')
for (const page of pages) {
  const id = String(page).padStart(4, '0')
  assert(!fs.existsSync(`.tmp/ld-s10y-lesson/9-10g/pages/${id}`), 'No re-prepare of an existing page')
  assert(!fs.existsSync(`ssot-resources/soviet10year-textbooks/artifacts/9-10g/pages/${id}`),
    'No existing durable page may be replaced')
}
fs.mkdirSync(root, { recursive: true })
for (const page of pages) {
  const executable = '.claude/skills/ld-s10y-lesson/.venv/bin/python'
  const args = ['-B', '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'prepare',
    '--book', '9-10g', '--page', String(page)]
  const startedAtUtc = new Date().toISOString()
  const result = spawnSync(executable, args, { encoding: 'utf8' })
  const prefix = `${root}/${String(page).padStart(4, '0')}`
  fs.writeFileSync(`${prefix}.stdout.txt`, result.stdout || '')
  fs.writeFileSync(`${prefix}.stderr.txt`, result.stderr || '')
  fs.writeFileSync(`${prefix}.command.json`, JSON.stringify({
    executable, args, cwd: process.cwd(), startedAtUtc,
    finishedAtUtc: new Date().toISOString(), exitCode: result.status,
    signal: result.signal, error: result.error?.message || null,
    status: 'Preparation only; no authoring, interpretation, page acceptance or lesson completion',
  }, null, 2) + '\n')
  console.log(result.stdout)
  console.error(result.stderr)
  assert.equal(result.status, 0, 'Preserve first preparation failure, no automatic retry')
}
