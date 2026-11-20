import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import {spawnSync} from 'node:child_process'

const cwd = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck'
assert.equal(process.cwd(), cwd)
const author = path.join(cwd, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d168-n5-figures23-author')
const root = path.join(cwd, '.tmp/STEMROBIN-181/d1816-d168/figures')
const [figure, stage, attempt] = process.argv.slice(2)
assert.ok(['fig-02', 'fig-03'].includes(figure))
assert.ok(['validate', 'render'].includes(stage))
assert.ok(['01', '02'].includes(attempt))
const candidate = path.join(root, figure, 'candidate-' + attempt)
const prefix = `${figure}-${stage}-candidate-${attempt}`
const dir = path.join(author, 'receipts', prefix)
assert.ok(!fs.existsSync(dir), 'Receipt directory already exists: ' + dir)
fs.mkdirSync(dir, {recursive: true})
const spec = path.join(candidate, figure + '.spec.json')
const python = path.join(cwd, '.claude/skills/ld-s10y-lesson/.venv/bin/python')
const command = stage === 'validate'
  ? [python, '.agents/skills/ld-s10y-image/scripts/validate_spec.py', spec, '--stage', 'draft', '--json']
  : [process.execPath, '.agents/skills/ld-s10y-image/scripts/render_spec.mjs', '--spec', spec,
    '--svg', path.join(candidate, figure + '.svg'),
    '--png', path.join(candidate, figure + '.preview.png'),
    '--report', path.join(candidate, figure + '.render.json')]
const binding = p => ({
  path: p, bytes: fs.statSync(p).size,
  sha256: crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
})
if (stage === 'render') {
  const prior = JSON.parse(fs.readFileSync(path.join(author, 'receipts',
    `${figure}-validate-candidate-${attempt}`, 'receipt.json'), 'utf8'))
  assert.equal(prior.exitCode, 0, 'A failed validation blocks render')
  assert.equal(prior.input.sha256, binding(spec).sha256)
  for (const suffix of ['.svg', '.preview.png', '.render.json']) {
    assert.ok(!fs.existsSync(path.join(candidate, figure + suffix)))
  }
}
const startedAt = new Date().toISOString()
const result = spawnSync(command[0], command.slice(1), {
  cwd, encoding: 'utf8', maxBuffer: 20 * 1024 * 1024,
  env: {...process.env, PYTHONDONTWRITEBYTECODE: '1', PYTHON: python}
})
fs.writeFileSync(path.join(dir, 'stdout.txt'), result.stdout || '', {flag: 'wx'})
fs.writeFileSync(path.join(dir, 'stderr.txt'), result.stderr || '', {flag: 'wx'})
const receipt = {
  schema: 'd168/native-call-receipt@1', role: 'author-only', figure, stage, attempt,
  cwd: process.cwd(), command, startedAt, finishedAt: new Date().toISOString(),
  exitCode: result.status, error: result.error?.message || null,
  input: binding(spec),
  tool: binding(path.resolve(command[1])),
  stdout: binding(path.join(dir, 'stdout.txt')), stderr: binding(path.join(dir, 'stderr.txt')),
  outputs: stage === 'render'
    ? ['.svg', '.preview.png', '.render.json'].map(suffix => path.join(candidate, figure + suffix))
      .filter(p => fs.existsSync(p)).map(binding) : [],
  nativeValidationCalls: stage === 'render' ? 1 : 1,
  validationAccounting: stage === 'render' ? 'Renderer internally invokes the validator once in addition to the separately retained draft call.' : 'One external draft validator call.',
  imageOpensByThisCall: 0,
  contentVerdict: 'Tool status only; no independent approval or review registration.',
  outputSnapshotOverwrite: false
}
fs.writeFileSync(path.join(dir, 'receipt.json'), JSON.stringify(receipt, null, 2) + '\n', {flag: 'wx'})
console.log(JSON.stringify(receipt, null, 2))
process.exitCode = result.status ?? 1
