import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const root = path.dirname(fileURLToPath(import.meta.url))
const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const [round, figure] = process.argv.slice(2)
if (!['initial', 'sole-repair'].includes(round) ||
    !['fig-147', 'fig-148'].includes(figure)) {
  throw new Error('Only the two authorized figures and bounded rounds are allowed')
}
const directory = path.join(root, round)
const spec = path.join(directory, `${figure}.spec.json`)
const receipt = path.join(directory, `${figure}.native-execution.json`)
if (fs.existsSync(receipt)) throw new Error('This native round was already executed')
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const validator = path.join(repo, '.agents/skills/ld-s10y-image/scripts/validate_spec.py')
const renderer = path.join(repo, '.agents/skills/ld-s10y-image/scripts/render_spec.mjs')
const commands = []
const run = (executable, args, name) => {
  const result = spawnSync(executable, args, {
    cwd: repo,
    encoding: 'utf8',
    env: { ...process.env, PWDEBUG: '0', PLAYWRIGHT_HTML_OPEN: 'never' }
  })
  const stdout = path.join(directory, `${figure}.${name}.stdout.txt`)
  const stderr = path.join(directory, `${figure}.${name}.stderr.txt`)
  fs.writeFileSync(stdout, result.stdout || '')
  fs.writeFileSync(stderr, result.stderr || '')
  const record = {
    executable, args, exitCode: result.status, error: result.error?.message || null,
    stdout: { path: stdout, sha256: hash(stdout) },
    stderr: { path: stderr, sha256: hash(stderr) }
  }
  commands.push(record)
  return result.status
}
const validationExit = run('python3', [validator, spec, '--stage', 'draft', '--json'], 'draft')
let renderExit = null
if (validationExit === 0) {
  renderExit = run(process.execPath, [
    renderer, '--spec', spec,
    '--svg', path.join(directory, `${figure}.svg`),
    '--png', path.join(directory, `${figure}.full.png`),
    '--report', path.join(directory, `${figure}.render.json`)
  ], 'render')
}
const result = {
  schema: 'STEMROBIN-181/bounded-native-execution@1',
  figure, round, spec: { path: spec, sha256: hash(spec) },
  validator: { path: validator, sha256: hash(validator) },
  renderer: { path: renderer, sha256: hash(renderer) },
  explicitDraftInvocations: 1,
  renderSpecInvocations: renderExit === null ? 0 : 1,
  renderSpecIncludesItsOwnDraftValidation: true,
  validationExit, renderExit, commands,
  status: validationExit === 0 && renderExit === 0 ? 'PASS' : 'FAIL',
  fullCardTests: false,
  recordReview: false,
  newImageOpens: 0
}
fs.writeFileSync(receipt, `${JSON.stringify(result, null, 2)}\n`)
console.log(JSON.stringify(result, null, 2))
process.exitCode = result.status === 'PASS' ? 0 : 2
