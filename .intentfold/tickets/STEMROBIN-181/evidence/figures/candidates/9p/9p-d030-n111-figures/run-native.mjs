import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const root = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const work = path.dirname(fileURLToPath(import.meta.url))
const id = process.argv[2]
const attempt = process.argv[3] || 'initial'
assert(['fig-224', 'fig-225', 'fig-226'].includes(id))
assert(['initial', 'repair-1'].includes(attempt))
const directory = path.join(work, id, attempt)
const specPath = path.join(directory, 'spec.json')
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'))
const gate = read(path.join(work, 'science-gate.json'))
assert.equal(gate.status, 'PASS')
for (const field of ['effectiveSCI', 'correctedFreeze', 'chinese', 'english']) {
  assert.equal(hash(gate[field].path), gate[field].sha256, `Changed ${field}`)
}
assert.equal(read(gate.effectiveSCI.path).status, 'PASS')
assert(!fs.existsSync(path.join(directory, 'native-command.json')), 'Native attempt already executed')
const tools = path.join(root, '.agents/skills/ld-s10y-image/scripts')
const validatorArgs = [path.join(tools, 'validate_spec.py'), specPath, '--stage', 'draft', '--json']
const rendererArgs = [
  path.join(tools, 'render_spec.mjs'),
  '--spec', specPath,
  '--svg', path.join(directory, `${id}.svg`),
  '--png', path.join(directory, `${id}.preview.png`),
  '--report', path.join(directory, `${id}.render.json`),
]
const validation = spawnSync('python3', validatorArgs, { cwd: root, encoding: 'utf8' })
fs.writeFileSync(path.join(directory, 'validate.stdout.txt'), validation.stdout || '', { flag: 'wx' })
fs.writeFileSync(path.join(directory, 'validate.stderr.txt'), validation.stderr || '', { flag: 'wx' })
let render = null
if (validation.status === 0) {
  render = spawnSync(process.execPath, rendererArgs, { cwd: root, encoding: 'utf8' })
  fs.writeFileSync(path.join(directory, 'render.stdout.txt'), render.stdout || '', { flag: 'wx' })
  fs.writeFileSync(path.join(directory, 'render.stderr.txt'), render.stderr || '', { flag: 'wx' })
}
const receipt = {
  schema: 'ld-s10y-image/author-native-command@1',
  figure: id,
  attempt,
  effectiveSCIBinding: gate.effectiveSCI,
  explicitValidator: { executable: 'python3', args: validatorArgs, exitCode: validation.status, error: validation.error?.message || null },
  nativeRenderer: render ? { executable: process.execPath, args: rendererArgs, exitCode: render.status, error: render.error?.message || null } : null,
  rendererAlsoInvokesValidatorInternally: true,
  initialOrRepairOutputsPreserved: true,
  status: validation.status === 0 && render?.status === 0 ? 'pass' : 'fail',
}
fs.writeFileSync(path.join(directory, 'native-command.json'), JSON.stringify(receipt, null, 2) + '\n', { flag: 'wx' })
console.log(JSON.stringify(receipt, null, 2))
if (validation.stdout) console.log(validation.stdout.trim())
if (render?.stdout) console.log(render.stdout.trim())
if (validation.stderr) console.error(validation.stderr.trim())
if (render?.stderr) console.error(render.stderr.trim())
process.exitCode = receipt.status === 'pass' ? 0 : 1
