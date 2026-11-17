import assert from 'node:assert/strict'
import fs from 'node:fs'
import { spawnSync } from 'node:child_process'

const ticket = '.intentfold/tickets/STEMROBIN-184/tmp'
const output = `${ticket}/production-source10c111-119-format-retry`
assert(!fs.existsSync(output), 'Preserve first failure and retry records')
fs.mkdirSync(output)
const source = 'ssot-resources/soviet10year-textbooks/artifacts/10c/pages'
const before = `${ticket}/production-source10c110-121-supported-edits`
const current111 = fs.readFileSync(`${source}/0111/page.md`, 'utf8')
assert.equal(current111, fs.readFileSync(`${before}/0111-before-profile-repair.md`, 'utf8')
  .replace('利用定理1–3', '利用定理1-3'))
const current119 = fs.readFileSync(`${source}/0119/page.md`, 'utf8')
const previous119 = fs.readFileSync(`${before}/0119-before-erratum-binding-repair.md`, 'utf8')
const metadata = text => JSON.parse(text.split('---')[1])
const oldOriginal = metadata(previous119).errata[0].original
const newOriginal = metadata(current119).errata[0].original
assert.equal(newOriginal, oldOriginal.replace('↵', ''))
assert.equal(current119, previous119.replace(JSON.stringify(oldOriginal), JSON.stringify(newOriginal)))
let failed = false
for (const [n, first, last] of [[111, 110, 113], [119, 118, 121]]) {
  const page = String(n).padStart(4, '0')
  const dir = `${output}/${page}`
  fs.mkdirSync(dir)
  fs.copyFileSync(`${source}/${page}/page.md`, `${dir}/before.md`)
  const args = ['.claude/skills/ld-s10y-lesson/tools/p2c.py', 'finalize',
    '--book', '10c', '--page', String(n), '--work',
    `${ticket}/production-source10c${first}-${last}`]
  const started = new Date().toISOString()
  const result = spawnSync('.claude/skills/ld-s10y-lesson/.venv/bin/python', args,
    { encoding: 'utf8' })
  fs.writeFileSync(`${dir}/command.json`, JSON.stringify({
    args, started, finished: new Date().toISOString(), exitCode: result.status,
    signal: result.signal, error: result.error?.message ?? null,
  }, null, 2) + '\n')
  fs.writeFileSync(`${dir}/stdout.txt`, result.stdout ?? '')
  fs.writeFileSync(`${dir}/stderr.txt`, result.stderr ?? '')
  for (const name of ['page.md', 'page.json', 'audit.json']) {
    fs.copyFileSync(`${source}/${page}/${name}`, `${dir}/${name}`)
  }
  console.log(JSON.stringify({ page, exitCode: result.status, stdout: result.stdout }))
  failed ||= result.status !== 0
}
process.exitCode = failed ? 1 : 0
