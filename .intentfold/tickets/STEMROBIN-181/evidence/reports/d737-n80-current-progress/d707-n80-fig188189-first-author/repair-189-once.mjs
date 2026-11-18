import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { spawnSync } from 'node:child_process'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
if (process.cwd() !== repo) throw new Error('Wrong cwd')
const own = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d707-n80-fig188189-first-author')
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const write = (name, data) => fs.writeFileSync(path.join(own, name), `${JSON.stringify(data, null, 2)}\n`, { flag: 'wx' })
const firstSpec = path.join(own, 'fig-189.first.spec.json')
const firstReport = path.join(own, 'fig-189.first.render.json')
const report = JSON.parse(fs.readFileSync(firstReport))
if (report.status !== 'fail' || !fs.existsSync(path.join(own, 'fig-189.first-failure.json'))) throw new Error('No first failure')
const spec = JSON.parse(fs.readFileSync(firstSpec))
spec.objects.find(o => o.id === 'phi1-incident-angle-label').at = [500, 280]
spec.objects.find(o => o.id === 'F-dimension').labelPlacement.offset = [0, 0]
for (const id of ['chief-incident', 'other-incident']) spec.objects.find(o => o.id === id).type = 'arrow'
const repairedSpec = path.join(own, 'fig-189.repaired.spec.json')
write('fig-189.repaired.spec.json', spec)
write('fig-189.sole-author-repair.json', {
  repairOrdinal: 1, maximum: 1,
  reason: 'Native first render reports incident phi1 ray collision and F bottom-edge collision. First native inspection also identifies missing incident direction arrowheads recorded in the source inventory.',
  changes: ['Move incident phi1 above both rays', 'Reduce F label south offset to fit canvas', 'Use existing arrow objects for both incident ray directions; endpoints and all geometry unchanged'],
  firstSpec: { path: firstSpec, sha256: hash(firstSpec) },
  failedNative: { path: firstReport, sha256: hash(firstReport) },
  repairedSpec: { path: repairedSpec, sha256: hash(repairedSpec) },
  independentReview: false,
})
const stages = [
  { name: 'validate', executable: 'python3', args: ['.agents/skills/ld-s10y-image/scripts/validate_spec.py', repairedSpec, '--stage', 'draft', '--json'] },
  { name: 'render', executable: 'node', args: ['.agents/skills/ld-s10y-image/scripts/render_spec.mjs', '--spec', repairedSpec, '--svg', path.join(own, 'fig-189.repaired.svg'), '--png', path.join(own, 'fig-189.repaired.native.png'), '--report', path.join(own, 'fig-189.repaired.render.json')] },
]
for (const stage of stages) {
  write(`fig-189.repaired.${stage.name}.started.json`, { cwd: repo, ...stage, specSha256: hash(repairedSpec) })
  const run = spawnSync(stage.executable, stage.args, { cwd: repo, encoding: 'utf8', timeout: 120000, maxBuffer: 16 * 1024 * 1024 })
  fs.writeFileSync(path.join(own, `fig-189.repaired.${stage.name}.stdout.txt`), run.stdout || '', { flag: 'wx' })
  fs.writeFileSync(path.join(own, `fig-189.repaired.${stage.name}.stderr.txt`), run.stderr || '', { flag: 'wx' })
  const receipt = { cwd: repo, ...stage, exitCode: run.status, signal: run.signal, error: run.error?.message || null, specSha256: hash(repairedSpec) }
  write(`fig-189.repaired.${stage.name}.receipt.json`, receipt)
  if (stage.name === 'validate' && run.stdout?.trim()) {
    try { write('fig-189.repaired.validation.json', JSON.parse(run.stdout)) } catch {}
  }
  console.log(JSON.stringify({ stage: stage.name, exitCode: run.status }))
  if (run.status !== 0) {
    write('fig-189.second-failure-stop.json', { ...receipt, noFurtherRepair: true, dependentStagesStopped: true })
    process.exitCode = 2
    break
  }
}
