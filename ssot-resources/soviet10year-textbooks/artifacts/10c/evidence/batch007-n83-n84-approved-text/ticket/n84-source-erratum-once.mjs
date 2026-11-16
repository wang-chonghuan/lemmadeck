import assert from 'node:assert/strict'
import fs from 'node:fs'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'

const ticket = '.intentfold/tickets/STEMROBIN-184/tmp'
const root = `${ticket}/n84-source-erratum`
const page = 'ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0041'
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const mode = process.argv[2]
assert(['snapshot', 'finalize'].includes(mode))
if (mode === 'snapshot') {
  assert(!fs.existsSync(root), 'Preserve the first source erratum snapshot')
  assert.equal(hash(`${page}/page.json`),
    'a9d4042068c380444408c85dbbdc81f86a3164b90540ceb20f5292c612085e7a')
  fs.mkdirSync(`${root}/before`, { recursive: true })
  for (const name of ['page.md', 'page.json', 'audit.json']) {
    fs.copyFileSync(`${page}/${name}`, `${root}/before/${name}`, fs.constants.COPYFILE_EXCL)
  }
  const template = '.tmp/ld-s10y-lesson/adapt/10c/modern-us-neutral/lessons/ana10-c6-s3-n84'
  fs.cpSync(template, `${root}/template-before`, { recursive: true, errorOnExist: true, force: false })
  console.log('Exact pre-erratum source and untouched84 templates saved')
} else {
  assert(!fs.existsSync(`${root}/finalize.command.json`), 'Only this unattempted affected finalize')
  const before = JSON.parse(fs.readFileSync(`${root}/before/page.json`))
  const md = fs.readFileSync(`${page}/page.md`, 'utf8')
  const oldMd = fs.readFileSync(`${root}/before/page.md`, 'utf8')
  assert.equal(md.slice(md.indexOf('\n---\n')), oldMd.slice(oldMd.indexOf('\n---\n')),
    'Keep the exact faithful body')
  const executable = '.claude/skills/ld-s10y-lesson/.venv/bin/python'
  const args = ['-B', '.claude/skills/ld-s10y-lesson/tools/p2c.py',
    'finalize', '--book', '10c', '--page', '41']
  const startedAtUtc = new Date().toISOString()
  const result = spawnSync(executable, args, { encoding: 'utf8' })
  fs.writeFileSync(`${root}/finalize.stdout.txt`, result.stdout || '')
  fs.writeFileSync(`${root}/finalize.stderr.txt`, result.stderr || '')
  fs.writeFileSync(`${root}/finalize.command.json`, JSON.stringify({
    executable, args, cwd: process.cwd(), startedAtUtc,
    finishedAtUtc: new Date().toISOString(), exitCode: result.status,
    signal: result.signal, error: result.error?.message || null,
  }, null, 2) + '\n')
  fs.mkdirSync(`${root}/after`)
  for (const name of ['page.md', 'page.json', 'audit.json']) {
    fs.copyFileSync(`${page}/${name}`, `${root}/after/${name}`, fs.constants.COPYFILE_EXCL)
  }
  console.log(result.stdout)
  console.error(result.stderr)
  assert.equal(result.status, 0, 'Retain the first failure')
  const after = JSON.parse(fs.readFileSync(`${page}/page.json`))
  assert.equal(after.meta.errata.length, 1)
  const restored = structuredClone(after)
  restored.meta.errata = before.meta.errata
  assert.deepEqual(restored, before, 'Only meta.errata may change')
  const oldAudit = JSON.parse(fs.readFileSync(`${root}/before/audit.json`))
  const newAudit = JSON.parse(fs.readFileSync(`${page}/audit.json`))
  const auditRestored = { ...newAudit, errata: oldAudit.errata }
  assert.deepEqual(auditRestored, oldAudit, 'Only audit.errata may change')
  fs.writeFileSync(`${root}/comparison.json`, JSON.stringify({
    sourceBodyUnchanged: true, sourceBlocksUnchanged: true,
    pageChangedFields: ['meta.errata'], auditChangedFields: ['errata'],
    actualExitCode: result.status, pageSha256: hash(`${page}/page.json`),
    erratum: after.meta.errata[0], limits: 'Faithful lesson triples and original source pixels unchanged; not modern-text or figure approval.',
  }, null, 2) + '\n')
}
