import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'

const owned = path.join(process.cwd(), '.intentfold/tickets/STEMROBIN-181/tmp/d577-n75-fig164165-first-modern-author')
const firstPath = path.join(owned, 'fig-164/first/spec.json')
const firstReportPath = path.join(owned, 'fig-164/first/native.render.json')
const firstSpec = JSON.parse(fs.readFileSync(firstPath, 'utf8'))
const firstReport = JSON.parse(fs.readFileSync(firstReportPath, 'utf8'))
const hash = (p) => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
if (firstReport.status !== 'fail' || firstReport.collisions.length !== 3) throw Error('Repair must match the actual first findings')
const after = structuredClone(firstSpec)
const changes = []
for (const [id, labelPlacement] of [
  ['s164-o1', { position: 'S', gap: 45 }],
  ['s164-o2', { position: 'S', gap: 45 }],
  ['s164-r2-label', { position: 'S', gap: 30, offset: [-62, 32] }],
]) {
  const object = after.objects.find((o) => o.id === id)
  changes.push({ object: id, field: 'labelPlacement', before: object.labelPlacement, after: labelPlacement })
  object.labelPlacement = labelPlacement
}
const directory = path.join(owned, 'fig-164/repair')
fs.mkdirSync(directory, { recursive: false })
const afterPath = path.join(directory, 'spec.json')
fs.writeFileSync(afterPath, `${JSON.stringify(after, null, 2)}\n`, { flag: 'wx' })
const evidence = {
  schema: 'd577-one-targeted-repair@1', figure: 'fig-164', repairUsed: 1, repairLimit: 1,
  actualFirstFailure: { path: firstReportPath, sha256: hash(firstReportPath), status: firstReport.status, affectedFindings: firstReport.collisions },
  before: { path: firstPath, sha256: hash(firstPath), mode: '0444' },
  after: { path: afterPath, sha256: hash(afterPath) },
  changes, unchanged: ['canvas', 'source', 'display', 'geometry coordinates', 'relationships', 'assertions', 'source counts'],
  observation: 'Image open 3: first full native PNG shows R2 near the right curve, and curvature-center labels close to point footprints. Move only their label constraints.',
  terminalIfSecondFails: true, manualSvgEdits: false,
}
const evidencePath = path.join(owned, 'fig-164/repair-delta.json')
fs.writeFileSync(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`, { flag: 'wx' })
fs.chmodSync(evidencePath, 0o444)
console.log(JSON.stringify(evidence, null, 2))
