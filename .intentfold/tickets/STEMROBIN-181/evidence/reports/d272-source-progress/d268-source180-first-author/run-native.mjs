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
const opens = read(path.join(out, 'actual-opens.json'))
assert.equal(opens.budget.cumulativeContextImages, 24)
assert.equal(opens.opens.length, 2)
for (const input of bindings.preparedInputs) {
  assert.equal(hash(input.path), input.sha256)
  assert.equal(hash(path.join(out, input.destination)), input.sha256)
}
for (const input of bindings.sourceFiles) assert.equal(hash(input.path), input.sha256)
const receiptDir = path.join(out, 'native/0180')
fs.mkdirSync(receiptDir, { recursive: true })
assert(!fs.existsSync(path.join(receiptDir, 'receipt.json')), 'Never rerun SOURCE180 native stages')
const md = path.join(out, 'source/10p/pages/0180/page.md')
const snapshot = path.join(receiptDir, 'authored-before-finalize.md')
fs.copyFileSync(md, snapshot, fs.constants.COPYFILE_EXCL)
const python = path.join(root, '.claude/skills/ld-s10y-lesson/.venv/bin/python')
const tool = path.join(root, '.claude/skills/ld-s10y-lesson/tools/p2c.py')
const options = ['--book', '10p', '--page', '180', '--root', path.join(out, 'source'), '--work', path.join(out, 'work')]
const temp = path.join(out, 'native-tmp')
fs.mkdirSync(temp, { recursive: true })
const commands = []
function run(stage) {
  const argv = ['-B', tool, stage, ...options]
  const startedUtc = new Date().toISOString()
  const proc = spawnSync(python, argv, {
    cwd: root, encoding: 'utf8', maxBuffer: 8 * 1024 * 1024,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1', TMPDIR: temp },
  })
  const stdoutPath = path.join(receiptDir, `${stage}.stdout.txt`)
  const stderrPath = path.join(receiptDir, `${stage}.stderr.txt`)
  fs.writeFileSync(stdoutPath, proc.stdout || '', { flag: 'wx' })
  fs.writeFileSync(stderrPath, proc.stderr || '', { flag: 'wx' })
  const record = {
    stage, command: [python, ...argv], startedUtc, finishedUtc: new Date().toISOString(),
    exitCode: proc.status, signal: proc.signal, error: proc.error?.message || null,
    stdout: bound(stdoutPath), stderr: bound(stderrPath), attempt: 1,
  }
  commands.push(record)
  console.log(JSON.stringify({ ...record, stdoutText: proc.stdout, stderrText: proc.stderr }, null, 2))
  return proc.status
}
const finalizeExitCode = run('finalize')
let vectorizeExitCode = null
if (finalizeExitCode === 0) vectorizeExitCode = run('vectorize')
const figureDir = path.join(out, 'work/10p/pages/0180/figures')
const actualFigureFiles = fs.existsSync(figureDir) ? fs.readdirSync(figureDir) : []
const receipt = {
  schema: 'bounded-source180-native-first-author@1', page: 180, ticket: 'STEMROBIN-181',
  role: 'First source author, not independent reviewer', commands,
  finalizeCalls: 1, vectorizeCalls: commands.filter(c => c.stage === 'vectorize').length,
  finalizeExitCode, vectorizeExitCode, prepareCalls: 0, assembleCalls: 0,
  reruns: 0, nativeFailuresRetained: true, nativePreviewOrCropOpened: false,
  authoredBeforeFinalize: bound(snapshot), authoredAfterFinalize: bound(md),
  actualFigureFiles, sourceIndependentPASS: false, raw137IndependentPASS: false,
  noFiguresIsNotVectorFidelityEvidence: true,
}
fs.writeFileSync(path.join(receiptDir, 'receipt.json'), `${JSON.stringify(receipt, null, 2)}\n`, { flag: 'wx' })
console.log(JSON.stringify({ receipt: bound(path.join(receiptDir, 'receipt.json')), finalizeExitCode, vectorizeExitCode, actualFigureFiles }, null, 2))
process.exitCode = finalizeExitCode === 0 && vectorizeExitCode === 0 ? 0 : 1
