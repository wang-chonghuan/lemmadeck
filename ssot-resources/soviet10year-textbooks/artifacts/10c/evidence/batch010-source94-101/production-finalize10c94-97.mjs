import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'

const ticket = '.intentfold/tickets/STEMROBIN-184/tmp'
const work = `${ticket}/production-source10c94-97`
const output = `${ticket}/production-source10c94-97-finalize`
const durable = 'ssot-resources/soviet10year-textbooks/artifacts/10c/pages'
const original = `${work}/p0094-original-reconstructed.md`
assert.equal(createHash('sha256').update(fs.readFileSync(original)).digest('hex'),
  '85d8f52b0ff0bba03d0590e7235f905f15453a9fa673e4d924d74f6813bd0b21')
assert(!fs.existsSync(output), 'Preserve the first operation records')
fs.mkdirSync(output)
fs.copyFileSync(original, `${output}/p0094-original-reconstructed.md`)
for (const number of [94, 95, 96, 97]) {
  const page = String(number).padStart(4, '0')
  const record = path.join(output, page)
  fs.mkdirSync(record)
  fs.copyFileSync(`${durable}/${page}/page.md`, `${record}/before.md`)
  const args = ['.claude/skills/ld-s10y-lesson/tools/p2c.py', 'finalize',
    '--book', '10c', '--page', String(number), '--work', work]
  const start = new Date().toISOString()
  const result = spawnSync('.claude/skills/ld-s10y-lesson/.venv/bin/python', args,
    { encoding: 'utf8' })
  fs.writeFileSync(`${record}/command.json`, JSON.stringify({
    args, start, finished: new Date().toISOString(), exitCode: result.status,
    signal: result.signal, error: result.error?.message ?? null,
  }, null, 2) + '\n')
  fs.writeFileSync(`${record}/stdout.txt`, result.stdout ?? '')
  fs.writeFileSync(`${record}/stderr.txt`, result.stderr ?? '')
  for (const file of ['page.md', 'page.json', 'audit.json']) {
    if (fs.existsSync(`${durable}/${page}/${file}`)) {
      fs.copyFileSync(`${durable}/${page}/${file}`, `${record}/${file}`)
    }
  }
  console.log(JSON.stringify({ page, exitCode: result.status,
    stdout: result.stdout, stderr: result.stderr }))
  if (result.status !== 0) process.exit(result.status ?? 1)
}
