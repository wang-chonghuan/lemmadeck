import assert from 'node:assert/strict'
import fs from 'node:fs'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'

const ticket = '.intentfold/tickets/STEMROBIN-184/tmp'
const root = `${ticket}/prepare-n13-rebind9g-through49`
const book = 'ssot-resources/soviet10year-textbooks/artifacts/9-10g/book.json'
assert.equal(createHash('sha256').update(fs.readFileSync(book)).digest('hex'),
  '64cef3281fdfe97c724fea1e9cbac38aef44ef4cd674855ae7ffa763e6651eed')
assert(!fs.existsSync(root))
assert(!fs.existsSync('.tmp/ld-s10y-lesson/adapt/9-10g/modern-us-neutral/lessons/geo910-c1-s1-n13'))
fs.mkdirSync(root)
const run = (name, executable, args) => {
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
  assert.equal(result.status, 0, `Preserve first ${name} failure`)
}
run('prepare-n13', '.claude/skills/ld-s10y-lesson/.venv/bin/python', [
  '-B', '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'adapt-prepare',
  '--book', '9-10g', '--edition', 'modern-us-neutral',
  '--lesson', 'geo910-c1-s1-n13',
])
run('prior-choice-trace', 'python3', [
  `${ticket}/rebind-book-trace.py`, '9-10g',
  'geo910-c1-s1-n3', 'geo910-c1-s1-n4',
  'geo910-c1-s1-n7', 'geo910-c1-s1-n10',
])
