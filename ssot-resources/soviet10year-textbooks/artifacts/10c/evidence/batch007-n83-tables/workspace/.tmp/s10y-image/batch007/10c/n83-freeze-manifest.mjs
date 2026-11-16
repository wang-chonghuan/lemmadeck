import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const base = '.tmp/s10y-image/batch007/10c'
const ticket = '.intentfold/tickets/STEMROBIN-184/tmp'
const report = `${ticket}/ana10-n83-modern-tables-author.md`
const output = `${ticket}/ana10-n83-modern-tables-author.manifest.json`
if (fs.existsSync(output)) throw new Error('Immutable manifest already exists; stop')
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const record = relative => ({
  path: relative,
  sha256: hash(path.join(root, relative)),
  bytes: fs.statSync(path.join(root, relative)).size,
})
const list = relative => fs.readdirSync(path.join(root, relative), { withFileTypes: true })
  .sort((a, b) => a.name.localeCompare(b.name))
  .flatMap(entry => entry.isDirectory() ? list(`${relative}/${entry.name}`) : [`${relative}/${entry.name}`])
const tables = ['tbl-p0036-01', 'tbl-p0038-01'].map(id => {
  const dir = `${base}/${id}`
  const spec = JSON.parse(fs.readFileSync(path.join(root, dir, 'spec.json'), 'utf8'))
  const context = JSON.parse(fs.readFileSync(path.join(root, dir, 'context.json'), 'utf8'))
  const render = JSON.parse(fs.readFileSync(path.join(root, dir, 'table.render.json'), 'utf8'))
  const probes = JSON.parse(fs.readFileSync(path.join(root, dir, 'previews/metrics.json'), 'utf8'))
  const specSha = hash(path.join(root, dir, 'spec.json'))
  const svgSha = hash(path.join(root, dir, 'table.svg'))
  if (render.spec.sha256 !== specSha || render.output.svg.sha256 !== svgSha ||
      render.status !== 'pass' || !probes.canonicalBytesUnchanged ||
      hash(path.join(root, spec.source.image.path)) !== spec.source.image.sha256) {
    throw new Error(`${id}: package binding changed before freeze`)
  }
  const authoritativeText = context.lessons.flatMap(lesson =>
    lesson.prose.flatMap(prose => prose.nearbyText.map(text => ({ lesson: lesson.lesson, text }))),
  )
  if (JSON.stringify(authoritativeText) !== JSON.stringify(spec.source.authoritativeText)) {
    throw new Error(`${id}: context text differs`)
  }
  for (const name of ['spec.json', 'table.svg', 'table.png', 'table.render.json']) {
    if (hash(path.join(root, dir, name)) !== hash(path.join(root, dir, 'attempt-01', name))) {
      throw new Error(`${id}: canonical ${name} differs from first output`)
    }
  }
  return {
    id,
    package: dir,
    role: 'author; independent review pending',
    source: record(spec.source.image.path),
    context: record(`${dir}/context.json`),
    firstRenderExit: 0,
    rendererStatus: render.status,
    renderAttempts: 1,
    specRepairs: 0,
    display: { layout: 'scroll', mediaWidthPx: 640, minimumEffectiveTextPx: 18 },
    packageFiles: list(dir).map(record),
  }
})
const helpers = [
  'n83-author-run.mjs',
  'n83-display-probes.mjs',
  'n83-display-probes.first-module-resolution-failure.mjs',
  'n83-display-probes.first-module-resolution-failure.command.json',
  'n83-display-probes.first-module-resolution-failure.stderr-excerpt.txt',
  'n83-display-probes.command.json',
  'n83-display-probes.stdout.txt',
  'n83-display-probes.stderr.txt',
  'n83-freeze-manifest.mjs',
].map(name => record(`${base}/${name}`))
const approvedText = ['lesson.json', 'exercises.json'].map(name => record(
  `ssot-resources/soviet10year-textbooks/artifacts/10c/editions/modern-us-neutral/lessons/ana10-c6-s3-n83/${name}`,
))
if (approvedText[0].sha256 !== 'd4db11167eea1ec208f6d30039e3b9befaa94e48fbce03e5ccedb4a7b102ff8e' ||
    approvedText[1].sha256 !== '3174f166733abd18869f76197cec5577573b6e3468e729b194b0a583af110266') {
  throw new Error('Approved text bytes changed before freeze')
}
const manifest = {
  schema: 'n83/immutable-author-manifest@1',
  ticket: 'STEMROBIN-184',
  date: '2026-11-16',
  authority: 'parent-agent delegation under existing human ticket authority',
  role: 'modern table author only',
  independentApproval: null,
  promotion: false,
  report: record(report),
  sourceInventory: record(`${ticket}/ana10-n83-table-author-source-inventory.md`),
  approvedText,
  tables,
  helpers,
  externalSelfHashRequired: true,
  stop: 'Author handoff complete; independent gate and promotion remain pending.',
}
fs.writeFileSync(path.join(root, output), `${JSON.stringify(manifest, null, 2)}\n`)
console.log(`Report SHA256 ${manifest.report.sha256}`)
console.log(`Manifest SHA256 ${hash(path.join(root, output))}`)
console.log(output)
