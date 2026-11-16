import assert from 'node:assert/strict'
import fs from 'node:fs'
import { spawnSync } from 'node:child_process'

assert.equal(process.env.PWDEBUG, undefined)
assert.equal(process.env.PLAYWRIGHT_HTML_OPEN, 'never')
const base = '.tmp/s10y-image/batch007/10c'
for (const number of [10, 11]) {
  const dir = `${base}/fig-${number}`
  const recordFile = `${dir}/attempt-01.commands.json`
  assert.equal(fs.existsSync(recordFile), false, 'First attempt already recorded; do not overwrite')
  const commands = [
    ['validator', 'python3', ['.agents/skills/ld-s10y-image/scripts/validate_spec.py', `${dir}/spec.json`, '--stage', 'draft', '--json']],
    ['renderer', process.execPath, ['.agents/skills/ld-s10y-image/scripts/render_spec.mjs', '--spec', `${dir}/spec.json`, '--svg', `${dir}/figure.svg`, '--png', `${dir}/figure.png`, '--report', `${dir}/figure.render.json`]],
  ]
  const records = []
  for (const [name, executable, argv] of commands) {
    const result = spawnSync(executable, argv, { encoding: 'utf8', env: process.env })
    fs.writeFileSync(`${dir}/attempt-01.${name}.stdout.txt`, result.stdout || '', { flag: 'wx' })
    fs.writeFileSync(`${dir}/attempt-01.${name}.stderr.txt`, result.stderr || '', { flag: 'wx' })
    records.push({ name, executable, argv, cwd: process.cwd(), exitCode: result.status, signal: result.signal, error: result.error?.message || null })
    fs.writeFileSync(recordFile, `${JSON.stringify({
      schema: 'n80/figure-author-commands@1', figure: `fig-${number}`,
      attempt: 1, repairCount: 0, environment: { PWDEBUG: null, PLAYWRIGHT_HTML_OPEN: 'never' }, commands: records,
    }, null, 2)}\n`)
    console.log(`fig-${number} ${name}: exit ${result.status}`)
    if (result.status !== 0) break
  }
}
