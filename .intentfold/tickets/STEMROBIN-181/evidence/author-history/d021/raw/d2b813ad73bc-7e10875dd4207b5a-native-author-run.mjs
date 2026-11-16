import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const own = path.dirname(fileURLToPath(import.meta.url))
const repo = path.resolve(own, '../../..')
const figure = process.argv[2]
const attempt = process.argv[3] || 'initial'
assert.ok(['fig-153', 'fig-154'].includes(figure))
assert.ok(['initial', 'repair'].includes(attempt))
const out = path.join(own, figure, attempt)
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: path.relative(repo, file), sha256: hash(file) })
const write = (name, value) => fs.writeFileSync(path.join(out, name), `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
const specFile = path.join(out, 'spec.json')
const validator = path.join(repo, '.agents/skills/ld-s10y-image/scripts/validate_spec.py')
const renderer = path.join(repo, '.agents/skills/ld-s10y-image/scripts/render_spec.mjs')
assert.ok(!fs.existsSync(path.join(out, 'native-calls.json')))
const env = { ...process.env }
delete env.PWDEBUG
const calls = []
const run = (name, command, argv, script) => {
  const result = spawnSync(command, argv, { cwd: repo, encoding: 'utf8', env })
  const call = {
    command, argv, cwd: repo, script: bind(script), exitCode: result.status,
    stdout: result.stdout, stderr: result.stderr,
    status: result.status === 0 ? 'pass' : 'fail',
    PWDEBUG: 'unset', browser: 'Native unmodified renderer uses headless true, no persistent profile, no auto-open or external browser connection.',
  }
  write(`${name}-call.json`, call)
  calls.push({ name, ...call })
  return result
}
let status = 'fail'
try {
  const draft = run('draft-validation', 'python3', [validator, specFile, '--stage', 'draft', '--json'], validator)
  write('draft-validation.json', JSON.parse(draft.stdout))
  assert.equal(draft.status, 0, draft.stdout)
  const svgFile = path.join(out, `${figure}.svg`)
  const renderFile = path.join(out, 'render.json')
  const rendered = run('render', 'node', [renderer, '--spec', specFile, '--svg', svgFile, '--report', renderFile], renderer)
  assert.equal(rendered.status, 0, rendered.stderr)
  const validation = run('rendered-validation', 'python3', [validator, specFile, '--stage', 'rendered', '--json'], validator)
  write('rendered-validation.json', JSON.parse(validation.stdout))
  assert.equal(validation.status, 0, validation.stdout)
  assert.equal(JSON.parse(fs.readFileSync(renderFile, 'utf8')).status, 'pass')
  status = 'pass'
} finally {
  write('native-calls.json', {
    schema: 'ld-s10y-image/author-native-calls@1',
    figure, attempt, status, calls,
    rendererInternalDraftValidation: 'One unmodified internal validator invocation during the single renderer call.',
    repairLimit: 1, independentReview: false,
  })
}
console.log(JSON.stringify({ figure, attempt, status, calls: calls.map(call => ({ name: call.name, exitCode: call.exitCode })) }, null, 2))
