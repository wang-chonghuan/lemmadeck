import assert from 'node:assert/strict'
import fs from 'node:fs'
import { spawnSync } from 'node:child_process'

const ticket = '.intentfold/tickets/STEMROBIN-184/tmp'
const work = `${ticket}/production-source10c98-101`
const output = `${ticket}/production-source10c98-101-finalize`
const durable = 'ssot-resources/soviet10year-textbooks/artifacts/10c/pages'
assert(!fs.existsSync(output), 'Preserve first finalize records')
fs.mkdirSync(output)
for (const number of [98, 99, 100, 101]) {
  const page = String(number).padStart(4, '0')
  const record = `${output}/${page}`
  fs.mkdirSync(record)
  const before = `${work}/before-header-repair/${page}.md`
  if (number !== 98) {
    const original = fs.readFileSync(before, 'utf8')
    const current = fs.readFileSync(`${durable}/${page}/page.md`, 'utf8')
    assert.equal(current.replaceAll('<!-- exhead -->', '<!-- p -->'), original)
    fs.copyFileSync(before, `${record}/before-header-repair.md`)
  }
  fs.copyFileSync(`${durable}/${page}/page.md`, `${record}/before-finalize.md`)
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
