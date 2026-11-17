import assert from 'node:assert/strict'
import fs from 'node:fs'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'

const source = 'ssot-resources/soviet10year-textbooks/artifacts/10c'
const root = '.intentfold/tickets/STEMROBIN-184/tmp/production-assembly10c168-171'
const hash = bytes => createHash('sha256').update(bytes).digest('hex')
assert(!fs.existsSync(root), 'Preserve first assembly')
const inputs = []
for (const number of [168, 169, 170, 171]) {
  const page = String(number).padStart(4, '0')
  const from = `${source}/pages/${page}`
  const audit = JSON.parse(fs.readFileSync(`${from}/audit.json`, 'utf8'))
  assert.deepEqual(audit.errors, [])
  assert.equal(audit.lines_printed, audit.lines_md)
  assert.deepEqual(audit.figures, [])
  for (const name of ['page.md', 'page.json', 'audit.json']) {
    const bytes = fs.readFileSync(`${from}/${name}`)
    inputs.push({ source: `${from}/${name}`, destination: `${root}/10c/pages/${page}/${name}`,
      bytes: bytes.length, sha256: hash(bytes) })
  }
}
fs.mkdirSync(root)
for (const item of inputs) {
  const directory = item.destination.slice(0, item.destination.lastIndexOf('/'))
  fs.mkdirSync(directory, { recursive: true })
  fs.copyFileSync(item.source, item.destination, fs.constants.COPYFILE_EXCL)
  assert.equal(hash(fs.readFileSync(item.destination)), item.sha256)
}
fs.writeFileSync(`${root}/inputs.json`, JSON.stringify(inputs, null, 2) + '\n', { flag: 'wx' })
const args = ['-B', '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'assemble',
  '--book', '10c', '--root', root, '--work', `${root}/work`,
  '--toc', 'ssot-resources/soviet10year-textbooks/toc/10c/zh.json']
const started = new Date().toISOString()
const result = spawnSync('.claude/skills/ld-s10y-lesson/.venv/bin/python', args,
  { encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 })
fs.writeFileSync(`${root}/command.json`, JSON.stringify({
  args, started, finished: new Date().toISOString(), exitCode: result.status,
  signal: result.signal, error: result.error?.message ?? null,
}, null, 2) + '\n', { flag: 'wx' })
fs.writeFileSync(`${root}/stdout.txt`, result.stdout ?? '', { flag: 'wx' })
fs.writeFileSync(`${root}/stderr.txt`, result.stderr ?? '', { flag: 'wx' })
process.stdout.write(result.stdout ?? '')
process.stderr.write(result.stderr ?? '')
process.exitCode = result.status ?? 1
