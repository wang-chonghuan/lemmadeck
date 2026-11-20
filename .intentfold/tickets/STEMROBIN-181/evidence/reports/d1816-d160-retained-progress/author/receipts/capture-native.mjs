import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const cwd = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck'
assert.equal(process.cwd(), cwd)
const author = path.join(cwd, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d160-fig11-classification-author')
const output = path.join(cwd, '.tmp/STEMROBIN-181/d1816-d160/figures/fig-11')
const bind = (file) => {
  const bytes = fs.readFileSync(file)
  return { path: file, bytes: bytes.length, sha256: crypto.createHash('sha256').update(bytes).digest('hex') }
}
const stages = {
  render: {
    ordinal: 1,
    command: 'node',
    arguments: [
      '.agents/skills/ld-s10y-image/scripts/render_spec.mjs',
      '--spec', path.join(output, 'candidate-02.spec.json'),
      '--svg', path.join(output, 'candidate-02.svg'),
      '--png', path.join(output, 'candidate-02.preview.png'),
      '--report', path.join(output, 'candidate-02.render.json'),
    ],
  },
  validate: {
    ordinal: 2,
    command: 'python3',
    arguments: [
      '.agents/skills/ld-s10y-image/scripts/validate_spec.py',
      path.join(output, 'candidate-02.spec.json'),
      '--stage', 'draft', '--json',
    ],
  },
}
const stage = process.argv[2]
assert.ok(Object.hasOwn(stages, stage))
const selected = stages[stage]
const input = bind(path.join(output, 'candidate-02.spec.json'))
const freeze = JSON.parse(fs.readFileSync(path.join(author, 'input-freeze.json')))
assert.notEqual(input.sha256, freeze.baseline.sha256)
assert.ok(fs.existsSync(path.join(author, 'inventories/fig-11.structural-proof.json')))
const stem = `D160-native-${String(selected.ordinal).padStart(3, '0')}-fig-11-${stage}`
const receiptPath = path.join(author, 'receipts', `${stem}.json`)
assert.equal(fs.existsSync(receiptPath), false)
if (stage === 'render') {
  for (const suffix of ['svg', 'preview.png', 'render.json']) assert.equal(fs.existsSync(path.join(output, `candidate-02.${suffix}`)), false)
} else {
  const firstReceipt = JSON.parse(fs.readFileSync(path.join(author, 'receipts/D160-native-001-fig-11-render.json')))
  assert.equal(firstReceipt.exitCode, 0)
  assert.equal(firstReceipt.input.sha256, input.sha256)
}
const startedAt = new Date().toISOString()
const result = spawnSync(selected.command, selected.arguments, { cwd, encoding: null, maxBuffer: 20 * 1024 * 1024 })
const finishedAt = new Date().toISOString()
const stdoutPath = path.join(author, 'receipts', `${stem}.stdout.txt`)
const stderrPath = path.join(author, 'receipts', `${stem}.stderr.txt`)
fs.writeFileSync(stdoutPath, result.stdout ?? Buffer.alloc(0), { flag: 'wx' })
fs.writeFileSync(stderrPath, result.stderr ?? Buffer.alloc(0), { flag: 'wx' })
const receipt = {
  schema: 'D160/run-native-receipt@1',
  batch: 'D160',
  figure: 'fig-11',
  stage,
  ...selected,
  cwd,
  startedAt,
  finishedAt,
  exitCode: result.status,
  signal: result.signal,
  spawnError: result.error ? String(result.error) : null,
  input,
  stdout: bind(stdoutPath),
  stderr: bind(stderrPath),
  rendererIncludesNativeDraftValidation: stage === 'render',
  browserClosedByRendererFinally: stage === 'render' && result.status === 0,
  contentRepairsTotalAtInvocation: 1,
}
fs.writeFileSync(receiptPath, `${JSON.stringify(receipt, null, 2)}\n`, { flag: 'wx' })
console.log(JSON.stringify({ receipt: bind(receiptPath), exitCode: result.status, stdout: result.stdout?.toString(), stderr: result.stderr?.toString() }, null, 2))
process.exitCode = result.status ?? 1
