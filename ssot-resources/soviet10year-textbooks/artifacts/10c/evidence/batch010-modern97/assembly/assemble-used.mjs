import assert from 'node:assert/strict'
import fs from 'node:fs'
import { spawnSync } from 'node:child_process'

const source = 'ssot-resources/soviet10year-textbooks/artifacts/10c'
const root = '.intentfold/tickets/STEMROBIN-184/tmp/production-assembly10c104-106'
assert(!fs.existsSync(root), 'Preserve the first assembly')
fs.mkdirSync(root)
for (const page of ['0104', '0105', '0106']) {
  const from = `${source}/pages/${page}`
  const audit = JSON.parse(fs.readFileSync(`${from}/audit.json`, 'utf8'))
  assert.deepEqual(audit.errors, [])
  assert.equal(audit.lines_printed, audit.lines_md)
  const to = `${root}/10c/pages/${page}`
  fs.mkdirSync(to, { recursive: true })
  for (const file of ['page.md', 'page.json', 'audit.json']) {
    fs.copyFileSync(`${from}/${file}`, `${to}/${file}`)
  }
}
const args = ['.claude/skills/ld-s10y-lesson/tools/p2c.py', 'assemble',
  '--book', '10c', '--root', root, '--work', `${root}/work`,
  '--toc', 'ssot-resources/soviet10year-textbooks/toc/10c/zh.json']
const start = new Date().toISOString()
const result = spawnSync('.claude/skills/ld-s10y-lesson/.venv/bin/python', args,
  { encoding: 'utf8' })
fs.writeFileSync(`${root}/command.json`, JSON.stringify({
  args, start, finished: new Date().toISOString(), exitCode: result.status,
  signal: result.signal, error: result.error?.message ?? null,
}, null, 2) + '\n')
fs.writeFileSync(`${root}/stdout.txt`, result.stdout ?? '')
fs.writeFileSync(`${root}/stderr.txt`, result.stderr ?? '')
process.stdout.write(result.stdout ?? '')
process.stderr.write(result.stderr ?? '')
process.exitCode = result.status ?? 1
