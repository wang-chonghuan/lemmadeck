import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const own = path.dirname(fileURLToPath(import.meta.url))
const repo = path.resolve(own, '../../..')
const id = 'fig-232'
assert.equal(process.argv.slice(2).length, 0)
const out = path.join(own, 'final')
const python = path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python')
const validator = path.join(repo, '.agents/skills/ld-s10y-image/scripts/validate_spec.py')
const renderer = path.join(repo, '.agents/skills/ld-s10y-image/scripts/render_spec.mjs')
const spec = path.join(out, 'spec.json')
const write = (name, value) => fs.writeFileSync(path.join(out, name), `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
const validation = spawnSync(python, [validator, spec, '--stage', 'draft'], { cwd: repo, encoding: 'utf8' })
write('draft-validation.json', {
  command: [python, validator, spec, '--stage', 'draft'],
  status: validation.status === 0 ? 'pass' : 'fail', exitCode: validation.status,
  stdout: validation.stdout, stderr: validation.stderr,
})
assert.equal(validation.status, 0, validation.stdout + validation.stderr)
const args = [
  renderer, '--spec', spec, '--svg', path.join(out, `${id}.svg`),
  '--png', path.join(out, `${id}.native.png`), '--report', path.join(out, 'render.json'),
]
const result = spawnSync(process.execPath, args, { cwd: repo, encoding: 'utf8', timeout: 180000 })
write('render-command.json', {
  command: [process.execPath, ...args], exitCode: result.status,
  stdout: result.stdout, stderr: result.stderr, error: result.error?.message || null,
  outputIsAuthorCandidateNotPromoted: true,
})
console.log(result.stdout)
if (result.stderr) console.error(result.stderr)
process.exitCode = result.status === 0 ? 0 : 2
