import assert from 'node:assert/strict'
import fs from 'node:fs'
import { spawnSync } from 'node:child_process'

const ticket = '.intentfold/tickets/STEMROBIN-184/tmp'
const work = `${ticket}/production-modern10c114`
const sourceRoot = `${ticket}/production-assembly10c114-heading-fixed`
const id = 'ana10-c8-s2-n114'
const mode = process.argv[2]
if (mode === 'snapshot-prepared') {
  const from = `${work}/adapt/10c/modern-us-neutral/lessons/${id}`
  const to = `${work}/prepared-snapshots`
  assert(!fs.existsSync(to))
  fs.mkdirSync(to)
  for (const name of ['lesson', 'exercises', 'figures'])
    fs.copyFileSync(`${from}/${name}.template.json`, `${to}/${name}.template.json`, fs.constants.COPYFILE_EXCL)
  console.log('Copied the three exact prepared templates before manual authorship.')
  process.exit(0)
}
assert(['prepare', 'flow', 'finalize', 'render'].includes(mode))
const output = `${work}/first-${mode}`
assert(!fs.existsSync(output), 'Only the first operation for this new modern lesson')
fs.mkdirSync(output, { recursive: true })
const executable = mode === 'flow' ? 'node' : '.claude/skills/ld-s10y-lesson/.venv/bin/python'
const args = mode === 'flow'
  ? ['.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs',
    `${work}/adapt/10c/modern-us-neutral/lessons/${id}/lesson.template.json`]
  : ['-B', '.claude/skills/ld-s10y-lesson/tools/p2c.py',
    { prepare: 'adapt-prepare', finalize: 'adapt-finalize', render: 'render' }[mode],
    '--book', '10c', '--edition', 'modern-us-neutral', '--lesson', id,
    '--root', sourceRoot, '--work', work]
const started = new Date().toISOString()
const result = spawnSync(executable, args, { encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 })
fs.writeFileSync(`${output}/command.json`, JSON.stringify({
  executable, args, cwd: process.cwd(), started, finished: new Date().toISOString(),
  exitCode: result.status, signal: result.signal, error: result.error?.message ?? null,
  scope: 'Only newly complete114; no115 or historical HOLD/PASS source operations',
}, null, 2) + '\n', { flag: 'wx' })
fs.writeFileSync(`${output}/stdout.txt`, result.stdout ?? '', { flag: 'wx' })
fs.writeFileSync(`${output}/stderr.txt`, result.stderr ?? '', { flag: 'wx' })
process.stdout.write(result.stdout ?? '')
process.stderr.write(result.stderr ?? '')
process.exitCode = result.status ?? 1
