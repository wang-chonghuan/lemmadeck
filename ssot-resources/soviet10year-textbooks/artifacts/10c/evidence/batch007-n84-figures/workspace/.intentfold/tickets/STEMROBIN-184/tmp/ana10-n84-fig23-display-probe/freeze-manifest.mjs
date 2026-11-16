import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const dir = '.intentfold/tickets/STEMROBIN-184/tmp/ana10-n84-fig23-display-probe'
const report = '.intentfold/tickets/STEMROBIN-184/tmp/ana10-n84-fig23-display-probe-author.md'
const output = `${dir}/manifest.json`
if (fs.existsSync(path.join(root, output))) throw new Error('Manifest already frozen; stop')
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const record = relative => ({
  path: relative,
  sha256: hash(path.join(root, relative)),
  bytes: fs.statSync(path.join(root, relative)).size,
})
const list = relative => fs.readdirSync(path.join(root, relative), { withFileTypes: true })
  .sort((a, b) => a.name.localeCompare(b.name))
  .flatMap(entry => entry.isDirectory() ? list(`${relative}/${entry.name}`) : [`${relative}/${entry.name}`])
const metrics = JSON.parse(fs.readFileSync(path.join(root, dir, 'metrics.json'), 'utf8'))
const command = JSON.parse(fs.readFileSync(path.join(root, dir, 'command.json'), 'utf8'))
const currentInputs = Object.keys(metrics.before).map(name => {
  const absolute = path.join(metrics.inputDirectory, name)
  const value = record(path.relative(root, absolute))
  if (value.sha256 !== metrics.before[name] || value.sha256 !== metrics.after[name]) {
    throw new Error(`Assigned ${name} bytes changed before serialization`)
  }
  return value
})
const manifest = {
  schema: 'n84/fig23-immutable-mechanical-display-manifest@1',
  ticket: 'STEMROBIN-184',
  date: '2026-11-16',
  authority: 'parent-agent delegation under existing human ticket authority',
  role: 'mechanical display-evidence author only',
  figure: 'fig-23',
  figureApproval: null,
  independentReview: null,
  rendersPerformed: 0,
  geometryOrSpecChanges: 0,
  probeInvocations: 1,
  actualCommandExit: command.exit,
  mechanicalOutcome: metrics.outcome,
  summary: metrics.summary,
  inputsUnchanged: metrics.inputsUnchanged,
  inputFiles: currentInputs,
  report: record(report),
  outputFiles: list(dir).map(record),
  externalManifestHashRequired: true,
  stopped: true,
}
fs.writeFileSync(path.join(root, output), `${JSON.stringify(manifest, null, 2)}\n`)
console.log(`Report SHA256 ${manifest.report.sha256}`)
console.log(`Manifest SHA256 ${hash(path.join(root, output))}`)
