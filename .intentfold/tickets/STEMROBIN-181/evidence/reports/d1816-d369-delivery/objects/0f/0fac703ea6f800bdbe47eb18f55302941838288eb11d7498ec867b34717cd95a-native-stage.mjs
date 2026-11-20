import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const root = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck'
assert.equal(process.cwd(), root)
const work = path.join(root, '.tmp/STEMROBIN-181/d1816-d344')
const evidence = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d344-fig277-label-repair')
const spec = path.join(work, 'fig-277.spec.json')
const original = path.join(root, '.tmp/STEMROBIN-181/d1816-d333/fig-277.spec.json')
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
assert.equal(hash(original), 'bdee7015054c8bb86c8cfd05f72057c5355aa4c16233a791632192990c218857')
const before = JSON.parse(fs.readFileSync(original))
const after = JSON.parse(fs.readFileSync(spec))
assert.deepEqual(after.objects.find(object => object.id === 'positron-label').labelPlacement.offset, [0, -8])
delete after.objects.find(object => object.id === 'positron-label').labelPlacement.offset
assert.deepEqual(after, before)

const run = (stage, executable, args, code) => {
  const receiptPath = path.join(evidence, `${stage}.receipt.json`)
  assert(!fs.existsSync(receiptPath), `Receipt already exists: ${receiptPath}`)
  const startedAtUtc = new Date().toISOString()
  const tick = performance.now()
  const codeBefore = hash(code)
  const result = spawnSync(executable, args, {
    cwd: root,
    encoding: 'utf8',
    maxBuffer: 16 * 1024 * 1024,
  })
  const codeAfter = hash(code)
  const receipt = {
    schema: 'stemrobin-181/native-call-receipt@1',
    scope: 'D344 fig-277 affected author stage only',
    stage,
    contentRepairOrdinal: 2,
    localContentRepairOrdinal: 1,
    cwd: root,
    executable,
    args,
    startedAtUtc,
    finishedAtUtc: new Date().toISOString(),
    elapsedMs: Math.round(performance.now() - tick),
    exitCode: result.status,
    signal: result.signal,
    executionError: result.error?.message ?? null,
    spec: { path: spec, sha256: hash(spec) },
    code: { path: code, sha256Before: codeBefore, sha256After: codeAfter },
    stdout: result.stdout ?? '',
    stderr: result.stderr ?? '',
    qualification: 'Unmodified native entry point; no hook, fallback, review, promotion or lesson-stage rerun.',
  }
  fs.writeFileSync(receiptPath, `${JSON.stringify(receipt, null, 2)}\n`, { flag: 'wx' })
  console.log(JSON.stringify({ stage, exitCode: result.status, receipt: receiptPath, stdout: result.stdout, stderr: result.stderr }))
  return result.status ?? 1
}

const validator = path.join(root, '.agents/skills/ld-s10y-image/scripts/validate_spec.py')
const renderer = path.join(root, '.agents/skills/ld-s10y-image/scripts/render_spec.mjs')
const validateStatus = run('validate-spec', 'python3', [validator, spec, '--stage', 'draft', '--json'], validator)
if (validateStatus !== 0) {
  process.exitCode = validateStatus
} else {
  process.exitCode = run('render-spec', process.execPath, [
    renderer,
    '--spec', spec,
    '--svg', path.join(work, 'fig-277.svg'),
    '--png', path.join(work, 'fig-277.png'),
    '--report', path.join(work, 'fig-277.render.json'),
  ], renderer)
}
