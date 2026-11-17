import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'

const tmp = '.intentfold/tickets/STEMROBIN-184/tmp'
const source = 'ssot-resources/soviet10year-textbooks/artifacts/9-10g'
const root = `${tmp}/source-9g-p73-approved-affected-finalize`
const production = '.claude/skills/ld-s10y-lesson/tools/layout.py'
const [approvalFile, approvalSha] = process.argv.slice(2)
const sha = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const read = file => JSON.parse(fs.readFileSync(file))
const record = file => ({ path: file, sha256: sha(file) })
const copy = (from, to) => {
  fs.mkdirSync(path.dirname(to), { recursive: true })
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL)
  assert.equal(sha(from), sha(to))
}
assert(approvalFile?.startsWith(`${tmp}/`) && /^[a-f0-9]{64}$/.test(approvalSha || ''))
assert.equal(sha(approvalFile), approvalSha)
const approval = read(approvalFile)
assert.equal(approval.status, 'COUNTER73_CANDIDATE_APPROVED_FOR_SOLE_AFFECTED_FINALIZE')
assert.equal(approval.baseline.sha256, 'eb6fca6d9a62663ed7e97d7f39cda32d803375f61bf71adbf9aac84b4c335c3d')
assert.equal(sha(production), approval.candidate.sha256)
assert.equal(sha(approval.candidate.path), approval.candidate.sha256)
assert.equal(sha(approval.report.path), approval.report.sha256)
assert.equal(approval.validContractsAllPass, true)
assert.equal(approval.compatibilityScope, '68-76; only original73 band1556-1642 merges')
assert.equal(approval.parentConsumedFullReportDiffTestsAndComparison, true)
assert(!fs.existsSync(root), 'Only the sole affected finalize is authorized')
const beforeAudit = read(`${source}/pages/0073/audit.json`)
assert.equal(beforeAudit.lines_printed, 25)
assert.equal(beforeAudit.lines_md, 24)
assert.equal(beforeAudit.errors.length, 1)
const pageFiles = ['page.md', 'page.json', 'audit.json'].map(name => `${source}/pages/0073/${name}`)
const beforeRecords = pageFiles.map(record)
const protectedFiles = [`${source}/book.json`, production]
for (let page = 8; page <= 83; page++) {
  if (page === 73) continue
  for (const name of ['page.md', 'page.json', 'audit.json']) {
    const file = `${source}/pages/${String(page).padStart(4, '0')}/${name}`
    if (fs.existsSync(file)) protectedFiles.push(file)
  }
}
for (const name of fs.readdirSync(`${source}/editions/modern-us-neutral/lessons`)) {
  for (const fileName of ['lesson', 'exercises', 'figures', 'answer-keys']) {
    const file = `${source}/editions/modern-us-neutral/lessons/${name}/${fileName}.json`
    if (fs.existsSync(file)) protectedFiles.push(file)
  }
}
protectedFiles.push('.tmp/ld-s10y-lesson/9-10g/pages/0073/page.png')
const protectedRecords = protectedFiles.map(record)
fs.mkdirSync(root)
copy(approvalFile, `${root}/approval.json`)
copy(production, `${root}/layout.approved.py`)
for (const file of pageFiles) copy(file, `${root}/before/${path.basename(file)}`)
fs.writeFileSync(`${root}/before.json`, JSON.stringify({ beforeRecords, protectedRecords }, null, 2) + '\n', { flag: 'wx' })
const argv = [
  '-B', '.claude/skills/ld-s10y-lesson/tools/p2c.py',
  'finalize', '--book', '9-10g', '--page', '73',
]
const executable = '.claude/skills/ld-s10y-lesson/.venv/bin/python'
const startedAtUtc = new Date().toISOString()
const child = spawnSync(executable, argv, {
  encoding: 'utf8', maxBuffer: 16 * 1024 * 1024,
  env: { ...process.env, PWDEBUG: '', PLAYWRIGHT_HTML_OPEN: 'never' },
})
for (const [name, content] of [['stdout.raw', child.stdout || ''], ['stderr.raw', child.stderr || '']]) {
  fs.writeFileSync(`${root}/${name}`, content, { flag: 'wx' })
}
const command = {
  executable, argv, cwd: process.cwd(), startedAtUtc,
  finishedAtUtc: new Date().toISOString(), exit: child.status,
  signal: child.signal, error: child.error?.message || null, invocationCount: 1,
  production: record(production),
}
fs.writeFileSync(`${root}/command.json`, JSON.stringify(command, null, 2) + '\n', { flag: 'wx' })
console.log(JSON.stringify(command))
assert.equal(child.status, 0, 'Retain first affected failure; never repeat successful phases')
const audit = read(`${source}/pages/0073/audit.json`)
assert.equal(audit.lines_printed, 24)
assert.equal(audit.lines_md, 24)
assert.deepEqual(audit.errors, [])
assert.deepEqual(audit.normalizations, [])
assert.deepEqual(audit.figures, [])
assert.deepEqual(audit.count_exclusions, [])
assert.equal(sha(`${source}/pages/0073/page.md`), beforeRecords[0].sha256)
assert.equal(sha(`${source}/pages/0073/page.json`), beforeRecords[1].sha256)
for (const item of protectedRecords) assert.equal(sha(item.path), item.sha256)
const release = {
  status: 'COUNTER73_PROMOTED_AFFECTED_FINALIZE_PASS',
  approval: record(approvalFile), production: record(production),
  audit, after: pageFiles.map(record), protectedRecords,
  preservedFirstFailure: 'Original25/24 first-finalize audit and allv1-v5 candidate failures remain unchanged in their existing evidence.',
  limits: 'Sole73 counter-affected finalize only; no source-body change, source rereview, earlier-page finalize, assembly, modern lesson approval, publisher or DB.',
}
fs.writeFileSync(`${root}/release.json`, JSON.stringify(release, null, 2) + '\n', { flag: 'wx' })
console.log(JSON.stringify({ status: release.status, release: record(`${root}/release.json`) }))
