import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'

const source = 'ssot-resources/soviet10year-textbooks/artifacts/10c'
const root = '.intentfold/tickets/STEMROBIN-184/tmp/production-assembly10c125-corrected'
const review = `${source}/evidence/batch012-source221-boundary-affected-classification/copy-manifest.json`
assert(fs.existsSync(review), 'Consume and retain affected review before changed assembly')
assert(!fs.existsSync(root), 'New isolated corrected assembly only')
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
assert.equal(hash(`${source}/pages/0221/page.md`), '4c9c26a42e4469655f1fccc3b051b856275b09a3adf6bed9734279dcdfbc1046')
const inputs = []
for (const page of ['0220', '0221']) {
  const from = `${source}/pages/${page}`
  const audit = JSON.parse(fs.readFileSync(`${from}/audit.json`, 'utf8'))
  assert.deepEqual(audit.errors, [])
  assert.equal(audit.lines_printed, audit.lines_md)
  for (const name of ['page.md', 'page.json', 'audit.json']) {
    const file = `${from}/${name}`
    inputs.push({ source: file, destination: `${root}/10c/pages/${page}/${name}`,
      bytes: fs.statSync(file).size, sha256: hash(file) })
  }
}
for (const item of inputs) {
  fs.mkdirSync(path.dirname(item.destination), { recursive: true })
  fs.copyFileSync(item.source, item.destination, fs.constants.COPYFILE_EXCL)
  assert.equal(hash(item.destination), item.sha256)
}
fs.writeFileSync(`${root}/inputs.json`, JSON.stringify(inputs, null, 2) + '\n', { flag: 'wx' })
const executable = '.claude/skills/ld-s10y-lesson/.venv/bin/python'
const args = ['-B', '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'assemble',
  '--book', '10c', '--root', root, '--work', `${root}/work`,
  '--toc', 'ssot-resources/soviet10year-textbooks/toc/10c/zh.json']
const started = new Date().toISOString()
const result = spawnSync(executable, args, { encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 })
fs.writeFileSync(`${root}/command.json`, JSON.stringify({
  executable, args, cwd: process.cwd(), started, finished: new Date().toISOString(),
  exitCode: result.status, signal: result.signal, error: result.error?.message ?? null,
  retainedReview: { path: review, sha256: hash(review) },
  scope: 'Only new corrected isolated125 assembly. Original ownership FAIL retained; no source finalizer/counter, prior124 or incomplete supplement approval.',
}, null, 2) + '\n', { flag: 'wx' })
for (const [name, text] of [['stdout', result.stdout], ['stderr', result.stderr]])
  fs.writeFileSync(`${root}/${name}.txt`, text ?? '', { flag: 'wx' })
console.log(JSON.stringify({ exitCode: result.status, stdout: result.stdout, stderr: result.stderr }))
process.exitCode = result.status ?? 1
