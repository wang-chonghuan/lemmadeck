import assert from 'node:assert/strict'
import fs from 'node:fs'
import { spawnSync } from 'node:child_process'

const dir = '.tmp/s10y-image/batch007/10c/fig-10'
const command = `${dir}/probe.command.json`
assert.equal(fs.existsSync(command), false, 'Probe already attempted; preserve failures')
const argv = [`${dir}/display-probe.mjs`]
fs.writeFileSync(command, `${JSON.stringify({
  schema: 'n80/figure-author-probe-command@1', executable: process.execPath, argv,
  cwd: process.cwd(), environment: { PWDEBUG: null, PLAYWRIGHT_HTML_OPEN: 'never' },
  scope: 'Headless isolated offline harness; no product acceptance or review.',
}, null, 2)}\n`, { flag: 'wx' })
const result = spawnSync(process.execPath, argv, { encoding: 'utf8', env: process.env })
fs.writeFileSync(`${dir}/probe.stdout.txt`, result.stdout || '', { flag: 'wx' })
fs.writeFileSync(`${dir}/probe.stderr.txt`, result.stderr || '', { flag: 'wx' })
fs.writeFileSync(`${dir}/probe.result.json`, `${JSON.stringify({
  exitCode: result.status, signal: result.signal, error: result.error?.message || null,
}, null, 2)}\n`, { flag: 'wx' })
console.log(result.stdout || '')
if (result.status !== 0) console.log(result.stderr || '')
process.exitCode = result.status ?? 1
