import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'

const root = path.resolve('.intentfold/tickets/STEMROBIN-188/tmp/n61-fig8586-author')
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const initialFile = path.join(root, 'fig-g10-86.initial.spec.json')
const initial = JSON.parse(fs.readFileSync(initialFile, 'utf8'))
const repaired = structuredClone(initial)
const placements = {
  B: { position: 'E', gap: 56 },
  O: { position: 'SE', gap: 20 },
  A1: { position: 'NW', gap: 28 },
  O1: { position: 'N', gap: 63 },
}
const changes = []
for (const object of repaired.objects) {
  if (placements[object.id]) {
    changes.push({ object: object.id, field: 'labelPlacement', before: object.labelPlacement || null, after: placements[object.id] })
    object.labelPlacement = placements[object.id]
  }
  if (object.dash === 1) {
    changes.push({ object: object.id, field: 'dash', before: 1, after: 2 })
    object.dash = 2
  }
}
const output = path.join(root, 'fig-g10-86.repair1.spec.json')
if (fs.existsSync(output)) throw new Error('The single repair has already been prepared')
fs.writeFileSync(output, JSON.stringify(repaired, null, 2) + '\n', { flag: 'wx' })
fs.writeFileSync(path.join(root, 'fig-g10-86.repair1.changes.json'), JSON.stringify({
  role: 'figure author, one targeted repair after native failure and one actual initial visual inspection',
  repairCount: 1, maximumRepairs: 1,
  initial: { spec: path.basename(initialFile), sha256: hash(initialFile), render: 'fig-g10-86.initial.render.json', snapshot: 'fig-g10-86.initial.widths480-300.png' },
  defects: [
    'Native first attempt reports geometry collisions for B-label, O-label, A1-label and O1-label; actual first snapshot confirms upper labels crossing diameter/rim and lower labels touching silhouette/diameter.',
    'Actual first snapshot shows the native hidden segments as dot-like, unlike the source dashed strokes. Use supported dash style 2 consistently for the hidden generator, height, lower diameter and rear rim.',
  ],
  changes,
  untouched: ['all point coordinates', 'all true-world projection parameters', 'all curve geometry', 'all mathematical assertions', 'source labels and subscript notation', 'source inventories', 'all figure85 files'],
  regularization: 'Move O1 above the upper rim and A1 outside its left edge because the upper-disk compartments cannot fit 28px labels without stroke collisions. B moves outside the right silhouette; O moves below-right of the center. These are readable label placements, not new geometry or source pixel claims.',
  noGeneratedSvgEdits: true,
  ifStillFail: 'Local HOLD for figure86; no second repair.',
}, null, 2) + '\n', { flag: 'wx' })
console.log(JSON.stringify({ figure: 'fig-g10-86', repairCount: 1, changes }))
