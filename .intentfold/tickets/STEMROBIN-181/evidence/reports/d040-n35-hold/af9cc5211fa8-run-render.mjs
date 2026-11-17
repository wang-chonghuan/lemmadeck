import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const owned = path.dirname(fileURLToPath(import.meta.url))
const attempt = process.argv[2] || 'initial'
assert(['initial', 'repair'].includes(attempt))
const dir = path.join(owned, attempt)
assert(!fs.existsSync(dir), `Do not overwrite attempt ${attempt}`)
if (attempt === 'repair') {
  const prior = JSON.parse(fs.readFileSync(path.join(owned, 'initial/commands.json')))
  assert(prior.status === 'fail', 'Repair only an observed initial failure')
}
fs.mkdirSync(dir)
const spec = path.join(owned, 'fig-63.spec.json')
fs.copyFileSync(spec, path.join(dir, 'fig-63.spec.json'))
const runs = []
const run = (command, args) => {
  const result = spawnSync(command, args, { cwd: process.cwd(), encoding: 'utf8' })
  runs.push({ command, args, exitCode: result.status, stdout: result.stdout, stderr: result.stderr, error: result.error?.message })
  return result.status === 0
}
const valid = run('python3', [
  '.agents/skills/ld-s10y-image/scripts/validate_spec.py',
  spec, '--stage', 'draft', '--json',
])
let rendered = false
if (valid) {
  rendered = run('node', [
    '.agents/skills/ld-s10y-image/scripts/render_spec.mjs',
    '--spec', spec, '--svg', path.join(dir, 'fig-63.svg'),
    '--png', path.join(dir, 'fig-63.png'),
    '--report', path.join(dir, 'fig-63.render.json'),
  ])
}
const receipt = { schema: 'ld-s10y-image/bounded-render-command@1', attempt, status: valid && rendered ? 'pass' : 'fail', runs }
fs.writeFileSync(path.join(dir, 'commands.json'), `${JSON.stringify(receipt, null, 2)}\n`)
console.log(JSON.stringify(receipt, null, 2))
process.exitCode = receipt.status === 'pass' ? 0 : 2
