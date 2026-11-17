import assert from 'node:assert/strict'
import fs from 'node:fs'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'

const ticket = '.intentfold/tickets/STEMROBIN-184/tmp'
const root = 'ssot-resources/soviet10year-textbooks/artifacts/10c'
const work = `${ticket}/production-source10c168-171`
const output = `${ticket}/production-source10c168-171-first-finalize`
const layout = '.claude/skills/ld-s10y-lesson/tools/layout.py'
const layoutSha256 = '899ea25c2ede96a1f8c60eec3b5565e22f967e2c345d34d8255a11dc21d88a73'
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const mdHashes = [
  '4ad9cef52d6ce9bc90eb60349b15fd2af9a76c97ed966d1795274216a23d7e36',
  'ca67e8335de4eed69cd1c35ca5cbeaf37fc0eeab1b88e3ef3969e28042d1f1c7',
  'd7b658ff0c222adcfe4f1853baac4dabde36a6d136dc455e36b60becf640e19c',
  'cc5c595c812f745511f9c239fa22155bf5957a6a7a4cdd190e3600e13d178686',
]
assert(!fs.existsSync(output), 'First operations only')
assert.equal(hash(layout), layoutSha256)
assert.equal(hash(`${root}/evidence/batch012-source168-stageB172-author166-first/stageB168/input-outputbindings.json`),
  '392cf20c5d7a9d833c126ab5272eb1a780b9d76d8768a5e34fdd425508db00a5')
for (let i = 0; i < 4; i++) {
  const page = String(168 + i).padStart(4, '0')
  assert(!fs.existsSync(`${root}/pages/${page}/audit.json`))
  assert.equal(hash(`${root}/pages/${page}/page.md`), mdHashes[i])
}
fs.mkdirSync(output)
let failed = false
for (let i = 0; i < 4; i++) {
  const number = 168 + i
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
