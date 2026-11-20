import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const root = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck'
assert.equal(process.cwd(), root)
const ordinal = process.argv[2]
assert(['1', '1-technical-recovery', '2'].includes(ordinal))
const work = path.join(root, '.tmp/STEMROBIN-181/d1816-d333')
const evidence = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d333-fig277-first-author')
const attempt = path.join(work, `attempt-${ordinal}`)
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
fs.mkdirSync(attempt)
const spec = path.join(attempt, 'fig-277.spec.json')
fs.copyFileSync(path.join(work, 'fig-277.spec.json'), spec, fs.constants.COPYFILE_EXCL)
const writeNew = (file, value) => fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
const run = (name, executable, args) => {
  const started = new Date().toISOString()
  const tick = performance.now()
  const result = spawnSync(executable, args, { cwd: root, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 })
  const receipt = {
    schema: 'stemrobin-181/native-call-receipt@1',
    stage: name, executionAttempt: ordinal, contentAttempt: Number(ordinal[0]), cwd: root, executable, args,
    startedAtUtc: started, elapsedMs: Math.round(performance.now() - tick),
    exitCode: result.status, signal: result.signal,
    executionError: result.error?.message ?? null,
    spec: { path: spec, sha256: hash(spec) },
    stdout: result.stdout ?? '', stderr: result.stderr ?? '',
  }
  const receiptPath = path.join(evidence, `attempt-${ordinal}-${name}.receipt.json`)
  writeNew(receiptPath, receipt)
  console.log(JSON.stringify({ stage: name, exitCode: result.status, receipt: receiptPath, stdout: result.stdout, stderr: result.stderr }))
  return result.status
}
const validator = path.join(root, '.agents/skills/ld-s10y-image/scripts/validate_spec.py')
const renderer = path.join(root, '.agents/skills/ld-s10y-image/scripts/render_spec.mjs')
const validateStatus = run('validate-spec', 'python3', [validator, spec, '--stage', 'draft', '--json'])
if (validateStatus !== 0) {
  process.exitCode = validateStatus || 1
} else {
  process.exitCode = run('render-spec', process.execPath, [
    renderer, '--spec', spec,
    '--svg', path.join(attempt, 'fig-277.svg'),
    '--png', path.join(attempt, 'fig-277.native-screen.png'),
    '--report', path.join(attempt, 'fig-277.render.json'),
  ]) || 0
}
