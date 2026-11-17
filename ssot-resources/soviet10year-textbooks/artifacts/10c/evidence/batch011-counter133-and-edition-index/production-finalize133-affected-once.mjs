import assert from 'node:assert/strict'
import fs from 'node:fs'
import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'

const scratch = '.intentfold/tickets/STEMROBIN-184/tmp'
const output = `${scratch}/production-source133-affected-finalize`
const page = 'ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0133'
const work = `${scratch}/production-source10c130-133`
const layout = '.claude/skills/ld-s10y-lesson/tools/layout.py'
const source = `${work}/10c/pages/0133/page.png`
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const approved = JSON.parse(fs.readFileSync(
  `${scratch}/production-counter133-nested-repair/residual-followup/followup-affected-count.json`, 'utf8'))
assert(!fs.existsSync(output), 'Preserve every execution record')
assert.equal(approved.count, 16)
assert.equal(approved.count_matches_unchanged_witness, true)
assert.equal(hash(layout), approved.layout_sha256)
assert.equal(hash(source), approved.source_sha256_after)
fs.mkdirSync(output)
for (const file of ['page.md', 'page.json', 'audit.json']) {
  fs.copyFileSync(`${page}/${file}`, `${output}/before-${file}`)
}
const args = ['-B', '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'finalize',
  '--book', '10c', '--page', '133', '--work', work]
const started = new Date().toISOString()
const result = spawnSync('.claude/skills/ld-s10y-lesson/.venv/bin/python', args,
  { encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 })
fs.writeFileSync(`${output}/command.json`, JSON.stringify({
  args, started, finished: new Date().toISOString(), exitCode: result.status,
  signal: result.signal, error: result.error?.message ?? null,
  layoutSha256: approved.layout_sha256, sourceSha256: approved.source_sha256_after,
}, null, 2) + '\n')
for (const name of ['stdout', 'stderr']) fs.writeFileSync(`${output}/${name}.txt`, result[name] ?? '')
for (const file of ['page.md', 'page.json', 'audit.json']) {
  fs.copyFileSync(`${page}/${file}`, `${output}/after-${file}`)
}
process.stdout.write(result.stdout ?? '')
process.stderr.write(result.stderr ?? '')
assert.equal(result.status, 0, 'Only the failed source page is retried')
assert.equal(hash(source), approved.source_sha256_after)
assert.equal(hash(layout), approved.layout_sha256)
for (const file of ['page.md', 'page.json']) {
  assert.equal(hash(`${output}/before-${file}`), hash(`${output}/after-${file}`))
}
const audit = JSON.parse(fs.readFileSync(`${page}/audit.json`, 'utf8'))
assert.deepEqual(audit.errors, [])
assert.equal(audit.lines_printed, 16)
assert.equal(audit.lines_md, 16)
fs.writeFileSync(`${output}/preservation.json`, JSON.stringify({
  status: 'pass', page: 133, printed: 16, markdown: 16,
  sourceUnchanged: true, markdownUnchanged: true, structuredContentUnchanged: true,
  sourceSha256: hash(source), markdownSha256: hash(`${page}/page.md`),
  structuredContentSha256: hash(`${page}/page.json`), auditSha256: hash(`${page}/audit.json`),
  otherPassedPagesRerun: false, page130Held: true,
}, null, 2) + '\n')
