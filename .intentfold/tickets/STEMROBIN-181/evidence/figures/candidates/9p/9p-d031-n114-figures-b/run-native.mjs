import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const own = path.dirname(fileURLToPath(import.meta.url))
const repo = path.resolve(own, '../../..')
const skill = path.join(repo, '.agents/skills/ld-s10y-image/scripts')
const [id, attempt = 'initial'] = process.argv.slice(2)
assert.ok(['fig-235', 'fig-236', 'fig-237'].includes(id))
assert.ok(['initial', 'repair-1'].includes(attempt))
const out = path.join(own, id, attempt)
const spec = path.join(out, 'spec.json')
function run(name, command, args) {
  const receipt = path.join(out, `${name}-command.json`)
  assert.ok(!fs.existsSync(receipt), 'No attempt replay')
  const result = spawnSync(command, args, {
    cwd: repo, encoding: 'utf8',
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1', PWDEBUG: '' },
  })
  fs.writeFileSync(receipt, `${JSON.stringify({
    command: [command, ...args], exitCode: result.status,
    stdout: result.stdout, stderr: result.stderr, error: result.error?.message,
  }, null, 2)}\n`, { flag: 'wx' })
  console.log(`${id} ${attempt} ${name}: ${result.status}`)
  if (result.status !== 0) {
    console.log(result.stdout || result.stderr)
    process.exit(result.status || 2)
  }
}
run('validate-draft', 'python3', [path.join(skill, 'validate_spec.py'), spec, '--stage', 'draft', '--json'])
run('render', process.execPath, [
  path.join(skill, 'render_spec.mjs'), '--spec', spec,
  '--svg', path.join(out, `${id}.svg`),
  '--png', path.join(out, `${id}.native.png`),
  '--report', path.join(out, 'render.json'),
])
run('validate-rendered', 'python3', [path.join(skill, 'validate_spec.py'), spec, '--stage', 'rendered', '--json'])
