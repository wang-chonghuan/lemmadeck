import assert from 'node:assert/strict'
import fs from 'node:fs'
import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'

const root = '.intentfold/tickets/STEMROBIN-184/tmp/advance-10c-through35'
assert(!fs.existsSync(root), 'Preserve an earlier advancement')
assert(!fs.existsSync('.tmp/ld-s10y-lesson/10c/pages/0035/figures/fig-21.svg'))
assert(!fs.existsSync('.tmp/ld-s10y-lesson/adapt/10c/modern-us-neutral/lessons/ana10-c6-s2-n82'))
const review = '.intentfold/tickets/STEMROBIN-184/tmp/source-review-10c-p35-p38.md'
assert.equal(createHash('sha256').update(fs.readFileSync(review)).digest('hex'),
  '84f8aad58ffe21417f9f3b52a5fcb366b016da533a914f4f741b40611790237e')
fs.mkdirSync(root, { recursive: true })
const python = '.claude/skills/ld-s10y-lesson/.venv/bin/python'
const tool = '.claude/skills/ld-s10y-lesson/tools/p2c.py'
for (const [name, executable, args] of [
  ['vectorize35', python, ['-B', tool, 'vectorize', '--book', '10c', '--page', '35']],
  ['assemble35', process.execPath, ['.intentfold/tickets/STEMROBIN-184/tmp/assemble-ana10-through19.mjs', '35']],
  ['adapt-prepare82', python, ['-B', tool, 'adapt-prepare', '--book', '10c',
    '--edition', 'modern-us-neutral', '--lesson', 'ana10-c6-s2-n82']],
]) {
  const started = new Date().toISOString()
  const result = spawnSync(executable, args, { encoding: 'utf8' })
  fs.writeFileSync(`${root}/${name}.stdout.txt`, result.stdout || '')
  fs.writeFileSync(`${root}/${name}.stderr.txt`, result.stderr || '')
  fs.writeFileSync(`${root}/${name}.command.json`, JSON.stringify({
    executable, args, cwd: process.cwd(), startedAtUtc: started,
    finishedAtUtc: new Date().toISOString(), exit: result.status,
    signal: result.signal, error: result.error?.message || null,
  }, null, 2) + '\n')
  console.log(result.stdout)
  console.error(result.stderr)
  assert.equal(result.status, 0, `Stop on ${name}'s actual failure`)
}
