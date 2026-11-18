import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const root = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const out = path.dirname(fileURLToPath(import.meta.url))
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const bound = p => ({ path: p, sha256: hash(p), bytes: fs.statSync(p).size })
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'))
const bindings = read(path.join(out, 'input-bindings.json'))
const finding = bindings.originalFinding
for (const input of [...bindings.contractFiles, ...bindings.preservedOriginalFiles]) assert.equal(hash(input.path), input.sha256)
for (const copy of bindings.copies) {
  assert.equal(hash(copy.input.path), copy.input.sha256)
  if (!copy.candidateInitialCopy.path.endsWith('/page.md')) {
    assert.equal(hash(copy.candidateInitialCopy.path), copy.candidateInitialCopy.sha256)
  }
}
const md = path.join(out, 'source/10p/pages/0180/page.md')
const originalMd = bindings.copies.find(c => c.input.path.endsWith('/page.md')).input
const originalText = fs.readFileSync(originalMd.path, 'utf8')
assert.equal(originalText.split(finding.actual).length, 2)
assert.equal(fs.readFileSync(md, 'utf8'), originalText.replace(finding.actual, finding.profileExpected))
const opens = read(path.join(out, 'actual-opens.json'))
assert.equal(opens.budget.cumulativeContextImages, 24)
assert.equal(opens.budget.newImages, 0)
assert.deepEqual(opens.opens, [])
const receiptDir = path.join(out, 'native/0180')
fs.mkdirSync(receiptDir, { recursive: true })
const snapshot = path.join(receiptDir, 'repaired-before-finalize.md')
fs.copyFileSync(md, snapshot, fs.constants.COPYFILE_EXCL)
const python = path.join(root, '.claude/skills/ld-s10y-lesson/.venv/bin/python')
const tool = path.join(root, '.claude/skills/ld-s10y-lesson/tools/p2c.py')
const argv = [
  '-B', tool, 'finalize', '--book', '10p', '--page', '180',
  '--root', path.join(out, 'source'), '--work', path.join(out, 'work'),
]
const temp = path.join(out, 'native-tmp')
fs.mkdirSync(temp, { recursive: true })
const startedUtc = new Date().toISOString()
const proc = spawnSync(python, argv, {
  cwd: root, encoding: 'utf8', maxBuffer: 8 * 1024 * 1024,
  env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1', TMPDIR: temp },
})
const stdout = path.join(receiptDir, 'finalize.stdout.txt')
const stderr = path.join(receiptDir, 'finalize.stderr.txt')
fs.writeFileSync(stdout, proc.stdout || '', { flag: 'wx' })
fs.writeFileSync(stderr, proc.stderr || '', { flag: 'wx' })
const receipt = {
  schema: 'bounded-source180-punctuation-repair-native@1', ticket: 'STEMROBIN-181',
  finding: finding.id, role: 'Original author repair, not independent review',
  command: [python, ...argv], startedUtc, finishedUtc: new Date().toISOString(),
  exitCode: proc.status, signal: proc.signal, error: proc.error?.message || null,
  stdout: bound(stdout), stderr: bound(stderr),
  physicalPages: [180], finalizeCalls: 1, prepareCalls: 0, vectorizeCalls: 0,
  assembleCalls: 0, renderCalls: 0, reruns: 0,
  repairedBeforeFinalize: bound(snapshot), repairedAfterFinalize: bound(md),
  nativeFailureMustRemainHOLD: true, newImageOpens: 0,
  independentSOURCE180PASS: false, RAW137PASS: false, wholeCardPASS: false,
}
const receiptPath = path.join(receiptDir, 'receipt.json')
fs.writeFileSync(receiptPath, `${JSON.stringify(receipt, null, 2)}\n`, { flag: 'wx' })
console.log(JSON.stringify({
  receipt: bound(receiptPath), exitCode: proc.status,
  stdout: proc.stdout, stderr: proc.stderr,
  newImages: 0, cumulativeImages: 24,
}, null, 2))
process.exitCode = proc.status === 0 ? 0 : 1
