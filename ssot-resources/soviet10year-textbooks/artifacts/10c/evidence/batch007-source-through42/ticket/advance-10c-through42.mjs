import assert from 'node:assert/strict'
import fs from 'node:fs'
import { spawnSync } from 'node:child_process'

const root = '.intentfold/tickets/STEMROBIN-184/tmp/advance-10c-through42'
assert(!fs.existsSync(root), 'Preserve earlier advancement')
const page = '.tmp/ld-s10y-lesson/10c/pages/0042/figures'
for (const id of ['fig-22', 'fig-23']) assert(!fs.existsSync(`${page}/${id}.svg`))
fs.mkdirSync(root, { recursive: true })
const python = '.claude/skills/ld-s10y-lesson/.venv/bin/python'
const tool = '.claude/skills/ld-s10y-lesson/tools/p2c.py'
for (const [name, executable, args] of [
  ['vectorize42', python, ['-B', tool, 'vectorize', '--book', '10c', '--page', '42']],
  ['assemble42', process.execPath, ['.intentfold/tickets/STEMROBIN-184/tmp/assemble-ana10-through19.mjs', '42']],
  ['adapt-prepare83-84', python, ['-B', tool, 'adapt-prepare', '--book', '10c',
    '--edition', 'modern-us-neutral', '--lesson', 'ana10-c6-s3-n83', '--lesson', 'ana10-c6-s3-n84']],
]) {
  const startedAtUtc = new Date().toISOString()
  const result = spawnSync(executable, args, { encoding: 'utf8' })
  fs.writeFileSync(`${root}/${name}.stdout.txt`, result.stdout || '')
  fs.writeFileSync(`${root}/${name}.stderr.txt`, result.stderr || '')
  fs.writeFileSync(`${root}/${name}.command.json`, JSON.stringify({
    executable, args, cwd: process.cwd(), startedAtUtc,
    finishedAtUtc: new Date().toISOString(), exitCode: result.status,
    signal: result.signal, error: result.error?.message || null,
  }, null, 2) + '\n')
  console.log(result.stdout)
  console.error(result.stderr)
  assert.equal(result.status, 0, `Stop at ${name}'s actual failure`)
}
