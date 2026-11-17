import assert from 'node:assert/strict'
import fs from 'node:fs'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'

const ticket = '.intentfold/tickets/STEMROBIN-184/tmp'
const root = 'ssot-resources/soviet10year-textbooks/artifacts/10c'
const work = `${ticket}/production-source10c156-159`
const output = `${ticket}/production-source10c156-159-first-finalize`
const layout = '.claude/skills/ld-s10y-lesson/tools/layout.py'
const layoutSha256 = '899ea25c2ede96a1f8c60eec3b5565e22f967e2c345d34d8255a11dc21d88a73'
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const mdHashes = [
  'f50332d5e804caeace277dfda404b235f9ef735507da3fe99018203e63a5158f',
  'ffcc823cffd8780539e59c23744cbbdca555bbd2ec01d9ca1558591c02180c3d',
  '22e9140d7ea488a10e1d305c7dc35e626752aeec5dd264cb22082834936a041e',
  '531e8168395ccbb501ec4d7e6bf90e992d6245bccebe52c846ae197b187dcf6d',
]
assert(!fs.existsSync(output), 'First operations only')
assert.equal(hash(layout), layoutSha256)
assert.equal(hash(`${root}/evidence/batch012-source155156-affected-and160-first/156-159-affected-text/affected-text-report.md`),
  'cc50a193935a382557753e16ae9d8895820654ce1c05869bcf607b12c92c03bd')
for (let i = 0; i < 4; i++) {
  const page = String(156 + i).padStart(4, '0')
  assert(!fs.existsSync(`${root}/pages/${page}/audit.json`))
  assert.equal(hash(`${root}/pages/${page}/page.md`), mdHashes[i])
}
fs.mkdirSync(output)
let failed = false
for (let i = 0; i < 4; i++) {
  const number = 156 + i
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
