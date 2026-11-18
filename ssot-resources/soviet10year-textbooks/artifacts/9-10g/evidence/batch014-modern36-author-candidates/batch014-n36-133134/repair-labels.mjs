import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

const repo = '/Users/yong/.codex/worktrees/a07e/lemmadeck'
assert.equal(process.cwd(), repo)
const batch = path.join(repo, '.tmp/s10y-image/batch014-n36-133134')
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'))
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const semantic = spec => JSON.stringify({
  ...spec,
  objects: spec.objects.map(({ labelPlacement, ...object }) => object),
})
for (const [id, point] of [[133, 'M'], [134, 'N']]) {
  const initial = path.join(batch, `fig-${id}`)
  const repaired = path.join(initial, 'r1')
  fs.mkdirSync(repaired)
  const priorPath = path.join(initial, 'spec.json')
  const prior = read(priorPath)
  const current = structuredClone(prior)
  const target = current.objects.find(o => o.id === point)
  assert.deepEqual(target.labelPlacement, { position: 'N', offset: [0, -14] })
  target.labelPlacement.offset = [0, -24]
  assert.equal(semantic(current), semantic(prior))
  const specPath = path.join(repaired, 'spec.json')
  fs.writeFileSync(specPath, JSON.stringify(current, null, 2) + '\n', { flag: 'wx' })
  const repair = {
    schema: 'ld-s10y-image/affected-label-repair@1',
    figure: `fig-${id}`, repairNumberInThisAuthorBatch: 1,
    authorization: 'Direct human authorization for ordinary reversible zero-paid repairs; historical totals are not reset.',
    priorSpec: { path: priorPath, sha256: hash(priorPath) },
    currentSpec: { path: specPath, sha256: hash(specPath) },
    failedRender: { path: path.join(initial, 'render.json'), sha256: hash(path.join(initial, 'render.json')) },
    reusedSpatialCheck: { path: path.join(initial, 'spatial-check.json'), sha256: hash(path.join(initial, 'spatial-check.json')) },
    changes: [{
      path: `objects[id=${point}].labelPlacement.offset[1]`,
      before: -14, after: -24, unit: 'source canvas px at fixed 640px product width',
      reason: 'Move only the upper label 10px farther north to clear the padded endpoint-dot footprint.',
    }],
    unaffected: 'Exact same point anchors, identities, visible markers, edges, endpoints, dash styles, assertions, canvas and source/edition inventory. Mathematical 3D and projection proof reused without rerunning it.',
    semanticGeometryIdentical: true,
    status: 'pass',
    paidCalls: 0,
  }
  fs.writeFileSync(path.join(repaired, 'repair-check.json'), JSON.stringify(repair, null, 2) + '\n', { flag: 'wx' })
  console.log(`REPAIR 1: fig-${id} ${point} upper label only; all non-placement FigureSpec data identical`)
}
