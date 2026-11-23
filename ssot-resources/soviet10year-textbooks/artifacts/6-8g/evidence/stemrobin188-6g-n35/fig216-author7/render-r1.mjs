import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const repo = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188'
assert.equal(process.cwd(), repo)
const relative = '.intentfold/tickets/STEMROBIN-188/tmp/n35-fig216-author7'
const work = path.join(repo, relative)
const hash = name => crypto.createHash('sha256').update(fs.readFileSync(path.join(work, name))).digest('hex')
const argv = ['.agents/skills/ld-s10y-image/scripts/render_spec.mjs',
  '--spec', `${relative}/fig-216.spec.json`, '--svg', `${relative}/fig-216.svg`,
  '--report', `${relative}/fig-216.render.json`]
const result = spawnSync('node', argv, { cwd: repo, encoding: 'utf8' })
fs.writeFileSync(path.join(work, 'native-render-execution.r1.json'), `${JSON.stringify({
  cwd: repo, argv: ['node', ...argv], exitCode: result.status, signal: result.signal,
  stdout: result.stdout, stderr: result.stderr, nativeRenderCallsTotal: 2,
  revisionsTotal: 1, repair: 'objectCount value -> count; include actual desktop inline maximum 640 instead of an unmeasured 480.',
  firstFailure: 'native-render-execution.json', firstSpec: 'fig-216.spec.first-failure.json',
  currentSpec: { path: 'fig-216.spec.json', sha256: hash('fig-216.spec.json') },
  paidCalls: 0, networkCalls: 0
}, null, 2)}\n`, { flag: 'wx' })
console.log(result.stdout)
console.error(result.stderr)
if (result.status !== 0) process.exit(result.status ?? 1)
const reportPath = path.join(work, 'fig-216.render.json')
const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'))
assert.equal(report.status, 'pass')
fs.copyFileSync(reportPath, path.join(work, 'fig-216.render.pre-portability.json'), fs.constants.COPYFILE_EXCL)
const root = 'ssot-resources/soviet10year-textbooks/artifacts/6-8g/editions/modern-us-neutral'
report.spec.path = `${root}/figures/fig-216.spec.json`
report.output.svg.path = `${root}/figures/fig-216.svg`
assert.equal(report.spec.sha256, hash('fig-216.spec.json'))
assert.equal(report.output.svg.sha256, hash('fig-216.svg'))
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`)
