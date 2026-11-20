import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const root = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck'
assert.equal(process.cwd(), root)
const mode = process.argv[2]
assert(['diagnostic', 'recovery'].includes(mode))
const evidence = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d333-fig277-first-author')
const work = path.join(root, '.tmp/STEMROBIN-181/d1816-d333')
const output = path.join(work, `render-${mode}`)
fs.mkdirSync(output)
const spec = path.join(work, 'attempt-2/fig-277.spec.json')
const hook = path.join(evidence, mode === 'diagnostic' ? 'marker-diagnostic-hook.mjs' : 'marker-recovery-hook.mjs')
const renderer = path.join(root, '.agents/skills/ld-s10y-image/scripts/render_spec.mjs')
const args = ['--import', hook, renderer, '--spec', spec,
  '--svg', path.join(output, 'fig-277.svg'),
  '--png', path.join(output, 'fig-277.native-screen.png'),
  '--report', path.join(output, 'fig-277.render.json')]
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const startedAtUtc = new Date().toISOString()
const tick = performance.now()
const result = spawnSync(process.execPath, args, { cwd: root, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 })
const receipt = {
  schema: 'stemrobin-181/render-technical-call@1',
  mode, cwd: root, executable: process.execPath, args, startedAtUtc,
  elapsedMs: Math.round(performance.now() - tick), exitCode: result.status, signal: result.signal,
  executionError: result.error?.message ?? null,
  unchangedSpec: { path: spec, sha256: hash(spec) },
  nativeRenderer: { path: renderer, sha256: hash(renderer) },
  scopedHook: { path: hook, sha256: hash(hook) },
  stdout: result.stdout ?? '', stderr: result.stderr ?? '',
}
const receiptPath = path.join(evidence, `render-${mode}.receipt.json`)
fs.writeFileSync(receiptPath, `${JSON.stringify(receipt, null, 2)}\n`, { flag: 'wx' })
console.log(JSON.stringify({ receipt: receiptPath, exitCode: result.status, stdout: result.stdout, stderr: result.stderr }))
process.exitCode = result.status || 0
