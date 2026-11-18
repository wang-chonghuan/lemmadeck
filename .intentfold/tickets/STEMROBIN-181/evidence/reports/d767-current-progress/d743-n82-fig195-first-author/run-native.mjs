import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import { spawnSync } from 'node:child_process'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const owner = `${repo}/.intentfold/tickets/STEMROBIN-181/tmp/d743-n82-fig195-first-author`
const stage = process.argv[2]
assert.ok(['validate', 'render'].includes(stage))
const spec = `${owner}/fig-195.spec.json`
const specHash = crypto.createHash('sha256').update(fs.readFileSync(spec)).digest('hex')
const ledgerPath = `${owner}/native-attempts.json`
const ledger = fs.existsSync(ledgerPath) ? JSON.parse(fs.readFileSync(ledgerPath, 'utf8')) : []
assert.ok(!ledger.some(item => item.stage === stage && item.status === 'pass' && item.specSha256 === specHash), 'Do not replay a passed stage')
if (stage === 'render') assert.ok(ledger.some(item => item.stage === 'validate' && item.status === 'pass'), 'Stop render until native validation has passed')
const command = stage === 'validate' ? 'python3' : 'node'
const args = stage === 'validate'
  ? [`${repo}/.agents/skills/ld-s10y-image/scripts/validate_spec.py`, spec, '--stage', 'draft', '--json']
  : [`${repo}/.agents/skills/ld-s10y-image/scripts/render_spec.mjs`, '--spec', spec, '--svg', `${owner}/fig-195.svg`, '--report', `${owner}/fig-195.render.json`]
const result = spawnSync(command, args, { cwd: repo, encoding: 'utf8' })
const attempt = {
  stage, ordinal: ledger.filter(item => item.stage === stage).length + 1,
  command, args, cwd: repo, specSha256: specHash,
  exitCode: result.status, stdout: result.stdout, stderr: result.stderr,
  status: result.status === 0 ? 'pass' : 'fail',
}
ledger.push(attempt)
const receipt = `${owner}/${stage}.attempt-${attempt.ordinal}.json`
fs.writeFileSync(receipt, `${JSON.stringify(attempt, null, 2)}\n`)
fs.writeFileSync(ledgerPath, `${JSON.stringify(ledger, null, 2)}\n`)
if (attempt.status === 'fail' && !fs.existsSync(`${owner}/first-native-fail.json`)) {
  fs.copyFileSync(receipt, `${owner}/first-native-fail.json`)
  fs.copyFileSync(spec, `${owner}/first-native-fail.spec.json`)
  for (const name of ['fig-195.svg', 'fig-195.render.json']) {
    if (fs.existsSync(`${owner}/${name}`)) fs.copyFileSync(`${owner}/${name}`, `${owner}/first-native-fail.${name}`)
  }
}
process.stdout.write(result.stdout || '')
process.stderr.write(result.stderr || '')
process.exitCode = result.status ?? 1
