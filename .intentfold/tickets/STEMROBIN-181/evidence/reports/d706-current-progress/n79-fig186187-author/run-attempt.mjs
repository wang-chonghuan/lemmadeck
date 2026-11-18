import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import crypto from 'node:crypto'

const root = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const own = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp/d694-n79-fig186187-first-author')
const [id, attempt] = process.argv.slice(2)
if (process.cwd() !== root || !['fig-186', 'fig-187'].includes(id) || !['first', 'repair-1'].includes(attempt)) throw new Error('Invalid bounded attempt')
const folder = path.join(own, id, attempt)
const receiptFile = path.join(folder, 'attempt.receipt.json')
if (fs.existsSync(receiptFile)) throw new Error('An attempt cannot be rerun')
const spec = path.join(folder, 'spec.json')
const sha = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const rel = (file) => path.relative(root, file)
const receipt = { figure: id, attempt, spec: { path: rel(spec), sha256: sha(spec) }, firstAuthorOnly: true }
const runtime = path.join(own, 'runtime', id, attempt)
fs.mkdirSync(runtime, { recursive: true })
const run = (command, args, stage) => {
  const result = spawnSync(command, args, {
    cwd: root, encoding: 'utf8', maxBuffer: 10 * 1024 * 1024,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1', TMPDIR: runtime },
  })
  const stdout = path.join(folder, `${stage}.stdout.txt`)
  const stderr = path.join(folder, `${stage}.stderr.txt`)
  fs.writeFileSync(stdout, result.stdout || '')
  fs.writeFileSync(stderr, result.stderr || '')
  receipt[stage] = {
    command, args, exitCode: result.status, signal: result.signal,
    ...(result.error ? { executionError: result.error.message } : {}),
    stdout: { path: rel(stdout), sha256: sha(stdout) },
    stderr: { path: rel(stderr), sha256: sha(stderr) },
  }
  return result.status === 0
}
const valid = run('python3', [
  path.join(root, '.agents/skills/ld-s10y-image/scripts/validate_spec.py'),
  spec, '--stage', 'draft', '--json',
], 'validation')
if (valid) {
  const rendered = run('node', [
    path.join(root, '.agents/skills/ld-s10y-image/scripts/render_spec.mjs'),
    '--spec', spec,
    '--svg', path.join(folder, `${id}.svg`),
    '--png', path.join(folder, `${id}.native640.png`),
    '--report', path.join(folder, `${id}.render.json`),
  ], 'render')
  receipt.status = rendered ? 'FIRST-VALIDATE-RENDER-PASS' : 'RENDER-FAIL'
} else {
  receipt.status = 'DRAFT-VALIDATION-FAIL'
  receipt.render = { status: 'NOT-RUN-DEPENDENT-STAGE-STOPPED' }
}
receipt.independentReview = 'NOT-PERFORMED'
fs.writeFileSync(receiptFile, `${JSON.stringify(receipt, null, 2)}\n`)
console.log(JSON.stringify(receipt, null, 2))
process.exitCode = receipt.status === 'FIRST-VALIDATE-RENDER-PASS' ? 0 : 2
