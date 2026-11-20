import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const cwd = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck'
assert.equal(process.cwd(), cwd)
const author = path.join(cwd, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d185-n21-figures32-33-author')
const output = path.join(cwd, '.tmp/STEMROBIN-181/d1816-d185/figures')
const attempt = Number(process.argv[2])
assert.ok(attempt === 1 || attempt === 2)
if (attempt === 2) {
  const previous = JSON.parse(fs.readFileSync(path.join(author, 'fig-33.render-attempt-1.json'), 'utf8'))
  const repair = JSON.parse(fs.readFileSync(path.join(author, 'fig-33.repair-consumption.json'), 'utf8'))
  assert.notEqual(previous.exitCode, 0, 'Never rerun a valid passed producer.')
  assert.equal(repair.totalContentRepairsConsumed, 1)
  assert.equal(repair.remainingContentRepairs, 0)
}
const dir = path.join(output, `attempt-${attempt}`)
assert.ok(!fs.existsSync(dir), 'Never rerun an existing render attempt.')
fs.mkdirSync(dir, { recursive: true })
const hash = data => crypto.createHash('sha256').update(data).digest('hex')
const binding = file => {
  const bytes = fs.readFileSync(file)
  return { path: file, bytes: bytes.length, sha256: hash(bytes) }
}
const spec = path.join(output, 'fig-33.spec.json')
const specSnapshot = path.join(dir, 'spec.before-render.json')
fs.copyFileSync(spec, specSnapshot, fs.constants.COPYFILE_EXCL)
fs.chmodSync(specSnapshot, 0o444)
const args = [
  '.agents/skills/ld-s10y-image/scripts/render_spec.mjs',
  '--spec', spec,
  '--svg', path.join(dir, 'fig-33.svg'),
  '--png', path.join(dir, 'fig-33.display640.png'),
  '--report', path.join(dir, 'fig-33.render.json'),
]
const runtime = path.join(output, 'runtime')
fs.mkdirSync(runtime, { recursive: true })
const startedAt = new Date().toISOString()
const result = spawnSync(process.execPath, args, {
  cwd,
  env: { ...process.env, TMPDIR: runtime, PYTHONDONTWRITEBYTECODE: '1' },
  encoding: 'utf8',
  maxBuffer: 8 * 1024 * 1024,
})
fs.writeFileSync(path.join(dir, 'stdout.txt'), result.stdout || '', { flag: 'wx' })
fs.writeFileSync(path.join(dir, 'stderr.txt'), result.stderr || '', { flag: 'wx' })
const outputs = ['fig-33.svg', 'fig-33.display640.png', 'fig-33.render.json']
  .map(name => path.join(dir, name))
  .filter(file => fs.existsSync(file))
  .map(binding)
const receipt = {
  schema: 'bounded-author-command@1',
  stage: 'first-native-figure-render',
  attempt,
  command: [process.execPath, ...args],
  cwd,
  startedAt,
  finishedAt: new Date().toISOString(),
  exitCode: result.status,
  signal: result.signal,
  executionError: result.error?.message || null,
  specSnapshot: binding(specSnapshot),
  stdout: binding(path.join(dir, 'stdout.txt')),
  stderr: binding(path.join(dir, 'stderr.txt')),
  outputs,
  rendererInternalValidationOnly: true,
  standaloneCheckerReplayed: false,
  contentFailure: result.status === 2,
  contentRepairConsumed: result.status === 2 ? 1 : 0,
  failedCandidatePreserved: result.status !== 0 ? outputs : [],
  independentReview: false,
}
const receiptPath = path.join(author, `fig-33.render-attempt-${attempt}.json`)
fs.writeFileSync(receiptPath, `${JSON.stringify(receipt, null, 2)}\n`, { flag: 'wx' })
fs.chmodSync(receiptPath, 0o444)
for (const name of fs.readdirSync(dir)) fs.chmodSync(path.join(dir, name), 0o444)
console.log(JSON.stringify(receipt, null, 2))
process.exitCode = result.status || (result.error ? 1 : 0)
