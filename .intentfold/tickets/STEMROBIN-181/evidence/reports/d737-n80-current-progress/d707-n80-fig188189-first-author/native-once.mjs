import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { spawnSync } from 'node:child_process'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
if (process.cwd() !== repo) throw new Error('Wrong cwd')
const own = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d707-n80-fig188189-first-author')
const ids = ['fig-188', 'fig-189']
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const write = (name, data) => fs.writeFileSync(path.join(own, name), `${JSON.stringify(data, null, 2)}\n`, { flag: 'wx' })
const results = []
for (const id of ids) {
  const spec = path.join(own, `${id}.first.spec.json`)
  const stages = [
    { name: 'validate', executable: 'python3', args: ['.agents/skills/ld-s10y-image/scripts/validate_spec.py', spec, '--stage', 'draft', '--json'] },
    { name: 'render', executable: 'node', args: ['.agents/skills/ld-s10y-image/scripts/render_spec.mjs', '--spec', spec, '--svg', path.join(own, `${id}.first.svg`), '--png', path.join(own, `${id}.first.native.png`), '--report', path.join(own, `${id}.first.render.json`)] },
  ]
  const record = { id, spec, specSha256: hash(spec), stages: [], contentRepairs: 0 }
  for (const stage of stages) {
    write(`${id}.first.${stage.name}.started.json`, { cwd: repo, ...stage, specSha256: hash(spec) })
    const run = spawnSync(stage.executable, stage.args, { cwd: repo, encoding: 'utf8', timeout: 120000, maxBuffer: 16 * 1024 * 1024 })
    fs.writeFileSync(path.join(own, `${id}.first.${stage.name}.stdout.txt`), run.stdout || '', { flag: 'wx' })
    fs.writeFileSync(path.join(own, `${id}.first.${stage.name}.stderr.txt`), run.stderr || '', { flag: 'wx' })
    const receipt = {
      cwd: repo, executable: stage.executable, args: stage.args,
      exitCode: run.status, signal: run.signal, error: run.error?.message || null,
      specSha256: hash(spec),
    }
    write(`${id}.first.${stage.name}.receipt.json`, receipt)
    record.stages.push({ stage: stage.name, ...receipt })
    if (stage.name === 'validate' && run.stdout?.trim()) {
      try { write(`${id}.first.validation.json`, JSON.parse(run.stdout)) } catch {}
    }
    if (run.status !== 0) {
      record.status = 'fail'
      record.failedStage = stage.name
      const nativeReport = path.join(own, `${id}.first.render.json`)
      write(`${id}.first-failure.json`, {
        ...receipt, stage: stage.name,
        retainedSpec: { path: spec, sha256: hash(spec) },
        failedNativeReport: fs.existsSync(nativeReport) ? { path: nativeReport, sha256: hash(nativeReport) } : null,
        dependentStagesStopped: true,
      })
      break
    }
    record.status = 'pass'
  }
  results.push(record)
  console.log(JSON.stringify({ id, status: record.status, failedStage: record.failedStage || null }))
}
write('native-first-results.json', {
  results, standaloneValidations: results.length,
  renderInvocations: results.filter(r => r.stages.some(s => s.stage === 'render')).length,
  rendererInternallyValidates: true,
  independentReview: false, wholeCardApproved: false,
})
