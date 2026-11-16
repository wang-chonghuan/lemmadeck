import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

assert.equal(process.env.PWDEBUG, undefined)
assert.equal(process.env.PLAYWRIGHT_HTML_OPEN, 'never')
const number = process.argv[2]
assert.ok(['55', '56'].includes(number))
const attempt = process.argv[3] || '01'
assert.ok(['01', '02'].includes(attempt))
const dir = `.tmp/s10y-image/batch007/9-10g/fig-${number}`
const evidence = `${dir}/evidence/attempt-${attempt}`
assert.equal(fs.existsSync(evidence), false, 'Preserve previous command evidence')
fs.mkdirSync(evidence)
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const write = (file, data) => fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, { flag: 'wx' })
fs.copyFileSync(`${dir}/spec.json`, `${evidence}/spec.json`, fs.constants.COPYFILE_EXCL)
const steps = [
  ['validate', process.env.PYTHON || 'python3', ['.agents/skills/ld-s10y-image/scripts/validate_spec.py', `${dir}/spec.json`, '--stage', 'draft', '--json']],
  ['render', process.execPath, ['.agents/skills/ld-s10y-image/scripts/render_spec.mjs', '--spec', `${dir}/spec.json`, '--svg', `${dir}/figure.svg`, '--png', `${dir}/figure.png`, '--report', `${dir}/figure.render.json`]],
  ['probe', process.execPath, ['.tmp/s10y-image/batch007/9-10g/fig-55/evidence/display-probe.mjs', number, attempt]],
]
for (const [step, executable, argv] of steps) {
  write(`${evidence}/${step}.command.json`, {
    role: 'author-only', executable, argv, cwd: process.cwd(),
    environment: { PWDEBUG: null, PLAYWRIGHT_HTML_OPEN: 'never' },
    specSha256: hash(`${dir}/spec.json`),
    note: step === 'render' ? 'Official renderer also performs its own mandatory draft validation; no standalone revalidation added.' : null,
  })
  const result = spawnSync(executable, argv, { encoding: 'utf8', env: process.env, maxBuffer: 16 * 1024 * 1024 })
  fs.writeFileSync(`${evidence}/${step}.stdout.txt`, result.stdout || '', { flag: 'wx' })
  fs.writeFileSync(`${evidence}/${step}.stderr.txt`, result.stderr || '', { flag: 'wx' })
  write(`${evidence}/${step}.result.json`, { exitCode: result.status, signal: result.signal, error: result.error?.message || null })
  console.log(`fig-${number} attempt-${attempt} ${step}: exit ${result.status}`)
  console.log(result.stdout || '')
  if (step === 'render') {
    for (const file of ['figure.svg', 'figure.png', 'figure.render.json']) {
      if (fs.existsSync(`${dir}/${file}`)) fs.copyFileSync(`${dir}/${file}`, `${evidence}/${file}`, fs.constants.COPYFILE_EXCL)
    }
  }
  if (result.status !== 0) {
    console.log(result.stderr || '')
    process.exitCode = result.status ?? 1
    break
  }
}
