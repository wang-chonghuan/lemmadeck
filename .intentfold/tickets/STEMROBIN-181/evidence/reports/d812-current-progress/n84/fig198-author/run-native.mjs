import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import { spawnSync } from 'node:child_process'

const R = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), R)
const own = `${R}/.intentfold/tickets/STEMROBIN-181/tmp/d795-n84-fig198-first-author`
const attempt = process.argv[2]
assert.match(attempt ?? '', /^(first|repair-[1-9][0-9]*)$/)
const stem = `fig-198.${attempt}`
const spec = `${own}/${stem}.spec.json`
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const write = (name, data) => fs.writeFileSync(`${own}/${name}`, `${JSON.stringify(data, null, 2)}\n`, { flag: 'wx' })
assert.ok(fs.existsSync(spec))
assert.ok(!fs.existsSync(`${own}/${stem}.native-results.json`), 'Do not replay a completed native attempt')
const stages = [
  { stage: 'validate', executable: 'python3', args: [`${R}/.agents/skills/ld-s10y-image/scripts/validate_spec.py`, spec, '--stage', 'draft', '--json'] },
  { stage: 'render', executable: 'node', args: [`${R}/.agents/skills/ld-s10y-image/scripts/render_spec.mjs`, '--spec', spec, '--svg', `${own}/${stem}.svg`, '--report', `${own}/${stem}.render.json`] },
]
const results = []
for (const stage of stages) {
  write(`${stem}.${stage.stage}.started.json`, { ...stage, cwd: R, specSha256: hash(spec) })
  const run = spawnSync(stage.executable, stage.args, {
    cwd: R, encoding: 'utf8', timeout: 120000, maxBuffer: 16 * 1024 * 1024,
  })
  const receipt = {
    ...stage, cwd: R, specSha256: hash(spec), exitCode: run.status,
    signal: run.signal, error: run.error?.message ?? null,
    stdout: run.stdout ?? '', stderr: run.stderr ?? '',
  }
  write(`${stem}.${stage.stage}.receipt.json`, receipt)
  results.push(receipt)
  process.stdout.write(run.stdout ?? '')
  process.stderr.write(run.stderr ?? '')
  if (run.status !== 0) {
    if (!fs.existsSync(`${own}/FIRST-failure.json`)) {
      write('FIRST-failure.json', {
        ...receipt, attempt, retainedSpec: { path: spec, sha256: hash(spec) },
        retainedRender: fs.existsSync(`${own}/${stem}.render.json`)
          ? { path: `${own}/${stem}.render.json`, sha256: hash(`${own}/${stem}.render.json`) } : null,
        dependentStagesStopped: true, approval: 'none',
      })
    }
    process.exitCode = 1
    break
  }
}
write(`${stem}.native-results.json`, {
  attempt, spec: { path: spec, sha256: hash(spec) }, results,
  status: results.length === 2 && results.every(r => r.exitCode === 0) ? 'pass' : 'fail',
  renderIncludesNativeValidation: true, independentReview: false, approval: 'none',
})
