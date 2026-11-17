import assert from 'node:assert/strict'
import fs from 'node:fs'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'

const ticket = '.intentfold/tickets/STEMROBIN-184/tmp'
const root = 'ssot-resources/soviet10year-textbooks/artifacts/10c'
const work = `${ticket}/production-source10c172-175`
const output = `${ticket}/production-source10c173-175-remaining-first-finalize`
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const layout = '.claude/skills/ld-s10y-lesson/tools/layout.py'
const layoutSha256 = '899ea25c2ede96a1f8c60eec3b5565e22f967e2c345d34d8255a11dc21d88a73'
const mdHashes = [
  '12092f95d5c0bf630d50d438ff81f87251f9b1982226b71871cd5639162b654c',
  '39f28dab815fc54fbb6c78029b782cc2eee2184a1eca63d925dcc51b041cd539',
  '090949afbe2210890123f9ced960716594b7cc6845c84ff295333713cae866a9',
]
assert(!fs.existsSync(output))
assert.equal(JSON.parse(fs.readFileSync(`${ticket}/production-source10c172-175-first-finalize/0172/command.json`, 'utf8')).exitCode, 1)
for (let i = 0; i < 3; i++) {
  const page = String(173 + i).padStart(4, '0')
  assert(!fs.existsSync(`${root}/pages/${page}/audit.json`), 'Never rerun an executed page')
  assert.equal(hash(`${root}/pages/${page}/page.md`), mdHashes[i])
}
assert.equal(hash(layout), layoutSha256)
fs.mkdirSync(output)
let failed = false
for (let i = 0; i < 3; i++) {
  const number = 173 + i
  const page = String(number).padStart(4, '0')
  const record = `${output}/${page}`
  const source = `${work}/10c/pages/${page}/page.png`
  const sourceSha256 = hash(source)
  fs.mkdirSync(record)
  fs.copyFileSync(`${root}/pages/${page}/page.md`, `${record}/before.md`, fs.constants.COPYFILE_EXCL)
  const executable = '.claude/skills/ld-s10y-lesson/.venv/bin/python'
  const args = ['-B', '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'finalize',
    '--book', '10c', '--page', String(number), '--work', work]
  const started = new Date().toISOString()
  const result = spawnSync(executable, args, { encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 })
  fs.writeFileSync(`${record}/command.json`, JSON.stringify({
    executable, args, cwd: process.cwd(), started, finished: new Date().toISOString(),
    exitCode: result.status, signal: result.signal, error: result.error?.message ?? null,
    layoutSha256, source, sourceSha256, sourceUnchanged: hash(source) === sourceSha256,
    qualification: 'Remaining three first operations only;172 first FAIL and helper abort preserved',
  }, null, 2) + '\n', { flag: 'wx' })
  for (const [name, text] of [['stdout', result.stdout], ['stderr', result.stderr]])
    fs.writeFileSync(`${record}/${name}.txt`, text ?? '', { flag: 'wx' })
  for (const name of ['page.md', 'page.json', 'audit.json'])
    if (fs.existsSync(`${root}/pages/${page}/${name}`))
      fs.copyFileSync(`${root}/pages/${page}/${name}`, `${record}/${name}`, fs.constants.COPYFILE_EXCL)
  assert.equal(hash(layout), layoutSha256)
  assert.equal(hash(source), sourceSha256)
  console.log(JSON.stringify({ page, exitCode: result.status, stdout: result.stdout, stderr: result.stderr }))
  failed ||= result.status !== 0
}
process.exitCode = failed ? 1 : 0
