import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const own = path.dirname(fileURLToPath(import.meta.url))
const repo = path.resolve(own, '../../..')
const skill = path.join(repo, '.agents/skills/ld-s10y-image/scripts')
const [id, attempt = 'initial'] = process.argv.slice(2)
assert.ok(['fig-233', 'fig-234'].includes(id))
assert.ok(['initial', 'repair-1'].includes(attempt))
const out = path.join(own, id, attempt)
const spec = path.join(out, 'spec.json')
const run = (name, command, args) => {
  const file = path.join(own, 'commands', `${id}-${attempt}-${name}.json`)
  assert.ok(!fs.existsSync(file), 'No attempt replay')
  const result = spawnSync(command, args, {
    cwd: repo, encoding: 'utf8',
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  })
  fs.writeFileSync(file, `${JSON.stringify({
    command: [command, ...args], exitCode: result.status,
    stdout: result.stdout, stderr: result.stderr, error: result.error?.message,
  }, null, 2)}\n`, { flag: 'wx' })
  console.log(`${id} ${attempt} ${name}: exit${result.status}`)
  if (result.stdout) console.log(result.stdout.trim())
  if (result.stderr) console.log(result.stderr.trim())
  if (result.status !== 0) process.exit(result.status || 2)
}
run('validate-draft', 'python3', [path.join(skill, 'validate_spec.py'), spec, '--stage', 'draft', '--json'])
run('render', process.execPath, [
  path.join(skill, 'render_spec.mjs'), '--spec', spec,
  '--svg', path.join(out, `${id}.svg`),
  '--png', path.join(out, `${id}.native.png`),
  '--report', path.join(out, 'render.json'),
])
run('validate-rendered', 'python3', [path.join(skill, 'validate_spec.py'), spec, '--stage', 'rendered', '--json'])
