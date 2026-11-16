import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const own = path.dirname(fileURLToPath(import.meta.url))
const repo = path.resolve(own, '../../..')
const attempt = process.argv[2] || 'initial'
assert.ok(['initial', 'repair'].includes(attempt))
const out = path.join(own, attempt)
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: path.relative(repo, file), sha256: hash(file) })
const write = (name, value) => fs.writeFileSync(path.join(out, name), `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
const specFile = path.join(out, 'spec.json')
const validator = path.join(repo, '.agents/skills/ld-s10y-image/scripts/validate_spec.py')
const renderer = path.join(repo, '.agents/skills/ld-s10y-image/scripts/render_spec.mjs')
const calls = []
const run = (name, command, argv, script) => {
  const result = spawnSync(command, argv, { cwd: repo, encoding: 'utf8' })
  const call = {
    command, argv, cwd: repo, script: bind(script), exitCode: result.status,
    stdout: result.stdout, stderr: result.stderr, status: result.status === 0 ? 'pass' : 'fail',
  }
  write(`${name}-call.json`, call)
  calls.push({ name, ...call })
  return result
}
const draft = run('draft-validation', 'python3', [validator, specFile, '--stage', 'draft', '--json'], validator)
write('draft-validation.json', JSON.parse(draft.stdout))
if (draft.status !== 0) {
  write('native-calls.json', { attempt, status: 'fail', calls })
  throw new Error(draft.stdout)
}
const svgFile = path.join(out, 'fig-152.svg')
const renderFile = path.join(out, 'render.json')
const rendered = run('render', 'node', [renderer, '--spec', specFile, '--svg', svgFile, '--report', renderFile], renderer)
if (rendered.status !== 0) {
  write('native-calls.json', { attempt, status: 'fail', calls })
  throw new Error(rendered.stderr)
}
const validation = run('rendered-validation', 'python3', [validator, specFile, '--stage', 'rendered', '--json'], validator)
write('rendered-validation.json', JSON.parse(validation.stdout))
write('native-calls.json', {
  attempt, status: validation.status === 0 ? 'pass' : 'fail', calls,
  rendererInternalDraftValidation: 'The unmodified native renderer invokes validate_spec.py once internally before drawing.',
  spec: bind(specFile), svg: bind(svgFile), render: bind(renderFile),
})
assert.equal(validation.status, 0, validation.stdout)
console.log(JSON.stringify({ status: 'pass', attempt, spec: bind(specFile), svg: bind(svgFile), render: bind(renderFile), explicitCalls: calls.length }, null, 2))
