import assert from 'node:assert/strict'
import fs from 'node:fs'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'

const ticket = '.intentfold/tickets/STEMROBIN-184/tmp'
const root = 'ssot-resources/soviet10year-textbooks/artifacts/10c'
const work = `${ticket}/production-source10c164-167`
const output = `${ticket}/production-source10c164-165-first-finalize`
const layout = '.claude/skills/ld-s10y-lesson/tools/layout.py'
const layoutSha256 = '899ea25c2ede96a1f8c60eec3b5565e22f967e2c345d34d8255a11dc21d88a73'
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const mdHashes = [
  'ba98d98c480cb58f62c6e886a4340736377672b34ea5145ae82a3403c64d938b',
  '7ef6666efc6bb2b6c208f190a1e640b5ebb8968d22c2fbb220e2a0ed44c6bbeb',
]
assert(!fs.existsSync(output), 'First operations only; no 166/167 rerun')
assert.equal(hash(layout), layoutSha256)
assert.equal(hash(`${root}/evidence/batch012-source164-affected168-first114-assembly/affected164/freeze.json`),
  '58896b1409f33f9d13550ab49aa5810ba7654dacf6833deba98faa2c760de466')
for (let i = 0; i < 2; i++) {
  const page = String(164 + i).padStart(4, '0')
  assert(!fs.existsSync(`${root}/pages/${page}/audit.json`))
  assert.equal(hash(`${root}/pages/${page}/page.md`), mdHashes[i])
}
fs.mkdirSync(output)
let failed = false
for (let i = 0; i < 2; i++) {
  const number = 164 + i
  const page = String(number).padStart(4, '0')
  const record = `${output}/${page}`
  const markdown = `${root}/pages/${page}/page.md`
  const source = `${work}/10c/pages/${page}/page.png`
  const sourceSha256 = hash(source)
  assert.equal(hash(layout), layoutSha256)
  assert.equal(hash(markdown), mdHashes[i])
  fs.mkdirSync(record)
  fs.copyFileSync(markdown, `${record}/before.md`, fs.constants.COPYFILE_EXCL)
  const args = ['-B', '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'finalize',
    '--book', '10c', '--page', String(number), '--work', work]
  const started = new Date().toISOString()
  const result = spawnSync('.claude/skills/ld-s10y-lesson/.venv/bin/python', args,
    { encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 })
  fs.writeFileSync(`${record}/command.json`, JSON.stringify({
    args, started, finished: new Date().toISOString(), exitCode: result.status,
    signal: result.signal, error: result.error?.message ?? null,
    layoutSha256, source, sourceSha256, sourceUnchanged: hash(source) === sourceSha256,
  }, null, 2) + '\n', { flag: 'wx' })
  for (const [name, text] of [['stdout', result.stdout], ['stderr', result.stderr]])
    fs.writeFileSync(`${record}/${name}.txt`, text ?? '', { flag: 'wx' })
  for (const name of ['page.md', 'page.json', 'audit.json'])
    if (fs.existsSync(`${root}/pages/${page}/${name}`))
      fs.copyFileSync(`${root}/pages/${page}/${name}`, `${record}/${name}`, fs.constants.COPYFILE_EXCL)
  assert.equal(hash(layout), layoutSha256)
  assert.equal(hash(source), sourceSha256)
  console.log(JSON.stringify({ page, exitCode: result.status,
    stdout: result.stdout, stderr: result.stderr }))
  failed ||= result.status !== 0
}
process.exitCode = failed ? 1 : 0
