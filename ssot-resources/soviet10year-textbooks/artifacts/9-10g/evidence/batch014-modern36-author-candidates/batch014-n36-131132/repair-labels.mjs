import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

const cwd = '/Users/yong/.codex/worktrees/a07e/lemmadeck'
assert.equal(process.cwd(), cwd)
const root = path.join(cwd, '.tmp/s10y-image/batch014-n36-131132')
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const write = (p, value) => {
  assert.ok(p.startsWith(`${root}/`))
  fs.mkdirSync(path.dirname(p), { recursive: true })
  fs.writeFileSync(p, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
}
const edits = {
  'fig-131': { C: [0, 20], B: [0, 20], 'alpha-label': [0, -24], 'm-label': [0, -24] },
  'fig-132': { M: [10, -8], N: [16, 16] },
}
for (const [id, placements] of Object.entries(edits)) {
  const initial = path.join(root, id, 'initial/spec.json')
  const source = JSON.parse(fs.readFileSync(initial, 'utf8'))
  const repaired = structuredClone(source)
  const changes = []
  for (const [name, offset] of Object.entries(placements)) {
    const obj = repaired.objects.find(o => o.id === name)
    assert.ok(obj)
    changes.push({ object: name, field: 'labelPlacement.offset', before: obj.labelPlacement.offset ?? [0, 0], after: offset })
    obj.labelPlacement.offset = offset
  }
  const stripPlacements = spec => {
    const value = structuredClone(spec)
    for (const obj of value.objects) if (obj.labelPlacement) delete obj.labelPlacement.offset
    return value
  }
  assert.deepEqual(stripPlacements(repaired), stripPlacements(source), 'Non-placement edit in label-only repair')
  const dir = path.join(root, id, 'repair-1')
  write(path.join(dir, 'spec.json'), repaired)
  write(path.join(dir, 'repair.json'), {
    cwd, figure: id, revision: 1, sourceSpec: { path: initial, sha256: hash(initial) },
    reason: 'Renderer-reported collisions confirmed in complete initial preview. Move only six affected labels across the two figures.',
    changes, geometrySourceInventoryAssertionsAuthorityAndModelUnchanged: true,
    failedCandidatePreserved: true, imageCountBeforeRepair: 4,
    authorization: 'Latest direct human authorizes ordinary reversible zero-paid repairs; image usage remains cumulative.',
  })
  console.log(`${id}: label-only repair-1 (${changes.length} placement changes); initial candidate preserved.`)
}
