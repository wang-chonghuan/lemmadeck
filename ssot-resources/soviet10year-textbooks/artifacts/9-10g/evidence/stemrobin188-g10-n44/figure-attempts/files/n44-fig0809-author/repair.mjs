import fs from 'node:fs'
import path from 'node:path'
import { owned, sha, write } from './audit.mjs'

for (const number of ['08', '09']) {
  const id = `fig-g10-${number}`
  const first = path.join(owned, id, 'first/spec.json')
  const spec = JSON.parse(fs.readFileSync(first))
  const changes = []
  if (number === '08') {
    const label = spec.objects.find(object => object.id === 'A')
    const before = label.labelPlacement
    label.labelPlacement = { position: 'SE', gap: 23 }
    changes.push({ object: 'A', field: 'labelPlacement', before, after: label.labelPlacement,
      reason: 'First renderer collision A-label: source x ray contacts the label footprint.' })
  }
  for (const object of spec.objects.filter(object => object.dash === 2)) {
    changes.push({ object: object.id, field: 'dash', before: 2, after: 3,
      reason: 'First 300px visual comparison: short source construction dashes read as dots.' })
    object.dash = 3
  }
  const target = path.join(owned, id, 'repaired/spec.json')
  write(target, spec)
  write(path.join(owned, id, 'repair.json'), {
    figure: id, contentRepairsUsed: 1, contentRepairBudget: 1, technicalRetriesDoNotResetBudget: true,
    first: { path: first, sha256: sha(first) }, repaired: { path: target, sha256: sha(target) },
    changes, geometryChanged: false, assertionsChanged: false, sourceInventoryChanged: false,
    contentFailureRetained: true, independentReview: false
  })
}
