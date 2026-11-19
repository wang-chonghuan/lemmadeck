import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const R = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const O = `${R}/.intentfold/tickets/STEMROBIN-181/tmp/d794-n83-fig196197-first-author`
assert.equal(process.cwd(), R)
const [id, revision, stage] = process.argv.slice(2)
assert.ok(['fig-196', 'fig-197'].includes(id))
assert.ok(/^(initial|repair-[1-9][0-9]*)$/.test(revision))
assert.ok(['draft', 'render', 'rendered'].includes(stage))
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const dir = `${O}/${id}/${revision}`
const spec = `${dir}/spec.json`
const specSha256 = hash(spec)
const command = stage === 'render' ? 'node' : 'python3'
const args = stage === 'render'
  ? [`${R}/.agents/skills/ld-s10y-image/scripts/render_spec.mjs`, '--spec', spec, '--svg', `${dir}/${id}.svg`, '--report', `${dir}/render.json`]
  : [`${R}/.agents/skills/ld-s10y-image/scripts/validate_spec.py`, spec, '--stage', stage, '--json']
const receipt = `${dir}/${stage}.command.json`
assert.ok(!fs.existsSync(receipt), 'Do not repeat completed native stage')
if (stage !== 'draft') {
  const prerequisite = stage === 'render' ? 'draft' : 'render'
  assert.equal(JSON.parse(fs.readFileSync(`${dir}/${prerequisite}.command.json`)).exitCode, 0)
}
const result = spawnSync(command, args, {
  cwd: R, encoding: 'utf8', env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  maxBuffer: 20 * 1024 * 1024,
})
const payload = {
  figure: id, revision, stage, command, args, cwd: R, specSha256,
  exitCode: result.status, signal: result.signal,
  stdout: result.stdout, stderr: result.stderr,
  error: result.error?.message ?? null,
}
fs.writeFileSync(receipt, `${JSON.stringify(payload, null, 2)}\n`, { flag: 'wx' })
if (result.status !== 0 && !fs.existsSync(`${O}/${id}/FIRST-native-failure.json`)) {
  fs.writeFileSync(`${O}/${id}/FIRST-native-failure.json`, `${JSON.stringify({
    ...payload, preservedSpec: { path: spec, sha256: specSha256 },
    preservedOutputs: ['render.json', `${id}.svg`].filter(p => fs.existsSync(`${dir}/${p}`))
      .map(p => ({ path: `${dir}/${p}`, sha256: hash(`${dir}/${p}`) })),
  }, null, 2)}\n`, { flag: 'wx' })
}
console.log(JSON.stringify({
  figure: id, revision, stage, exitCode: result.status, receipt,
  native: stage === 'render' && fs.existsSync(`${dir}/render.json`)
    ? JSON.parse(fs.readFileSync(`${dir}/render.json`)) : result.stdout.trim(),
  error: result.error?.message ?? null,
}, null, 2))
process.exitCode = result.status === 0 ? 0 : 1
