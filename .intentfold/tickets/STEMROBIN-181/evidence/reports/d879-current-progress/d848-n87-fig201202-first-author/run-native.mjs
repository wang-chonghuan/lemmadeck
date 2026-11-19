import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { spawnSync } from 'node:child_process'

const R = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const D = path.join(R, '.intentfold/tickets/STEMROBIN-181/tmp/d848-n87-fig201202-first-author')
const round = process.argv[2] || 'FIRST'
if (!['FIRST', 'repair-1', 'repair-2'].includes(round)) throw new Error('Only the bounded rounds are allowed')
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const results = []
for (const figure of ['fig-201', 'fig-202']) {
  const folder = path.join(D, 'figures', figure, round)
  const spec = path.join(folder, 'spec.json')
  const stages = [
    ['validation', 'python3', ['.agents/skills/ld-s10y-image/scripts/validate_spec.py', spec, '--stage', 'draft', '--json']],
    ['render', 'node', [
      '.agents/skills/ld-s10y-image/scripts/render_spec.mjs', '--spec', spec,
      '--svg', path.join(folder, `${figure}.svg`),
      '--png', path.join(folder, `${figure}.png`),
      '--report', path.join(folder, `${figure}.render.json`),
    ]],
  ]
  const calls = []
  for (const [stage, command, args] of stages) {
    const result = spawnSync(command, args, {
      cwd: R, encoding: 'utf8', maxBuffer: 8 * 1024 * 1024,
      env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
    })
    const receipt = path.join(D, 'calls', `${figure}-${round}-${stage}.json`)
    fs.writeFileSync(receipt, `${JSON.stringify({
      command, args, cwd: R, spec: { path: spec, sha256: hash(spec) },
      exitCode: result.status, signal: result.signal, stdout: result.stdout, stderr: result.stderr,
    }, null, 2)}\n`, { flag: 'wx' })
    fs.chmodSync(receipt, 0o444)
    calls.push({ stage, receipt, sha256: hash(receipt), exitCode: result.status })
    console.log(`${figure} ${round} ${stage}: exit=${result.status} ${result.stdout.trim()}`)
    if (result.status !== 0) {
      console.log(result.stderr.trim())
      break
    }
  }
  for (const file of fs.readdirSync(folder)) fs.chmodSync(path.join(folder, file), 0o444)
  results.push({ figure, round, calls })
}
fs.writeFileSync(path.join(D, `native-${round}-summary.json`), `${JSON.stringify(results, null, 2)}\n`, { flag: 'wx' })
