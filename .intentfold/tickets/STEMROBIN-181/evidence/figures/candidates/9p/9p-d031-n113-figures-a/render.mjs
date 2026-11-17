import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const own = path.dirname(fileURLToPath(import.meta.url))
const repo = path.resolve(own, '../../..')
const [id, attempt = 'initial'] = process.argv.slice(2)
assert.ok(['fig-229', 'fig-230'].includes(id))
assert.ok(['initial', 'repair-1'].includes(attempt))
const out = path.join(own, id, attempt)
const python = path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python')
const validator = path.join(repo, '.agents/skills/ld-s10y-image/scripts/validate_spec.py')
const renderer = path.join(repo, '.agents/skills/ld-s10y-image/scripts/render_spec.mjs')
const spec = path.join(out, 'spec.json')
const validation = spawnSync(python, [validator, spec, '--stage', 'draft'], { cwd: repo, encoding: 'utf8' })
fs.writeFileSync(path.join(out, 'draft-validation.json'), JSON.stringify({
  command: [python, validator, spec, '--stage', 'draft'],
  status: validation.status === 0 ? 'pass' : 'fail', exitCode: validation.status,
  stdout: validation.stdout, stderr: validation.stderr,
}, null, 2) + '\n', { flag: 'wx' })
assert.equal(validation.status, 0, validation.stdout + validation.stderr)
const args = [
  renderer, '--spec', spec, '--svg', path.join(out, `${id}.svg`),
  '--png', path.join(out, `${id}.native.png`), '--report', path.join(out, 'render.json'),
]
if (id === 'fig-229') args.push('--artwork', path.join(out, `${id}.artwork.png`))
const result = spawnSync(process.execPath, args, { cwd: repo, encoding: 'utf8', timeout: 120000 })
fs.writeFileSync(path.join(out, 'render-command.json'), JSON.stringify({
  command: [process.execPath, ...args], exitCode: result.status,
  stdout: result.stdout, stderr: result.stderr, error: result.error?.message || null,
  outputIsAuthorCandidateNotPromoted: true,
}, null, 2) + '\n', { flag: 'wx' })
console.log(result.stdout)
if (result.stderr) console.error(result.stderr)
process.exitCode = result.status === 0 ? 0 : 2
