import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

const repo = '/Users/yong/.codex/worktrees/a07e/lemmadeck'
assert.equal(process.cwd(), repo)
const batch = path.join(repo, '.tmp/s10y-image/batch014-n36-133134')
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'))
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const sub = (a, b) => a.map((v, i) => v - b[i])
const add = (a, b) => a.map((v, i) => v + b[i])
const mul = (a, s) => a.map(v => v * s)
const dot = (a, b) => a.reduce((s, v, i) => s + v * b[i], 0)
const norm = a => Math.sqrt(dot(a, a))
const det = (a, b) => a[0] * b[1] - a[1] * b[0]
const close = (a, b, eps = 1e-8) => norm(sub(a, b)) <= eps
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const atFraction = (a, b, t) => add(a, mul(sub(b, a), t))

for (const id of [133, 134]) {
  const dir = path.join(batch, `fig-${id}`)
  const modelPath = path.join(dir, 'spatial-model.json')
  const specPath = path.join(dir, 'spec.json')
  const model = read(modelPath)
  const spec = read(specPath)
  const world = model.points
  const screen = Object.fromEntries(spec.objects.filter(o => o.type === 'point').map(o => [o.id, o.at]))
  const records = []
  const check = (name, value, detail) => {
    records.push({ id: name, status: value ? 'pass' : 'fail', detail })
    assert(value, name)
  }
  for (const record of Object.values(model.provenance)) {
    check(`current-${path.basename(record.path)}`, hash(record.path) === record.sha256, 'Hash-bound input is current.')
  }
  const project = p => model.projection.columns.reduce((s, c, i) => add(s, mul(c, p[i])), model.projection.offset)
  check('affine-projection-all-points', Object.keys(world).every(p => close(project(world[p]), screen[p])),
    'Every named spatial point maps to its actual FigureSpec anchor, including both normal endpoints.')
  const baseU = sub(world.B, world.A)
  const baseV = sub(world[id === 133 ? 'D' : 'C'], world.A)
  const planeNormal = cross(baseU, baseV)
  check('base-nondegenerate', norm(planeNormal) > 1e-8, 'Base spans a genuine plane.')
  const planePoints = id === 133 ? ['A', 'B', 'C', 'D'] : ['A', 'B', 'C', 'N']
  check(id === 133 ? 'rectangle-coplanar' : 'triangle-and-N-coplanar',
    planePoints.every(p => Math.abs(dot(sub(world[p], world.A), planeNormal)) < 1e-8),
    'All declared base points, and the normal foot, lie in the spatial plane.')
  const normal = sub(world[model.normal.tip], world[model.normal.foot])
  check(id === 133 ? 'MA-normal-to-base' : 'MN-normal-to-plane',
    norm(normal) > 0 && Math.abs(dot(normal, baseU)) < 1e-8 && Math.abs(dot(normal, baseV)) < 1e-8,
    'The normal is orthogonal to two independent spatial base directions, not screen vectors.')
  check('M-off-plane', Math.abs(dot(sub(world.M, world.A), planeNormal)) > 1e-8, 'M is not in the base plane.')
  if (id === 133) {
    check('rectangle-adjacent-orthogonal', Math.abs(dot(baseU, baseV)) < 1e-8,
      'Adjacent base sides meet orthogonally in 3D.')
    check('rectangle-opposite-equal', close(sub(world.C, world.D), baseU) && close(sub(world.C, world.B), baseV),
      'Opposite spatial sides have equal displacement; their affine projection is a parallelogram.')
    check('source-position-order', screen.M[1] > screen.A[1] && screen.A[1] > screen.B[1] &&
      screen.D[0] > screen.A[0] && screen.C[0] > screen.B[0] && screen.D[1] > screen.C[1],
      'M above A; A/B left; D/C right; A,D are the rear projected base vertices.')
  } else {
    const lengths = [['A', 'B'], ['B', 'C'], ['C', 'A']].map(([a, b]) => norm(sub(world[a], world[b])))
    check('triangle-equilateral', lengths.every(v => Math.abs(v - lengths[0]) < 1e-8),
      'Three spatial side lengths agree; no equality of projected screen lengths is asserted or labelled.')
    const u = sub(screen.B, screen.A)
    const v = sub(screen.C, screen.A)
    const w = sub(screen.M, screen.A)
    const b = det(w, v) / det(u, v)
    const c = det(u, w) / det(u, v)
    check('M-projection-inside-triangle', b > 0 && c > 0 && b + c < 1,
      'M has an interior screen projection; this does not put spatial M in the plane.')
    check('source-N-top-M-bottom', screen.N[0] === screen.M[0] && screen.N[1] > screen.C[1] &&
      screen.N[1] > screen.M[1] && screen.M[1] > screen.A[1],
      'N is the upper endpoint; M is the lower endpoint, above AB. The labels were not swapped.')
  }
  const [a, b] = model.projectedCrossing.first
  const [c, d] = model.projectedCrossing.second
  const first = sub(screen[b], screen[a])
  const second = sub(screen[d], screen[c])
  const delta = sub(screen[c], screen[a])
  const denominator = det(first, second)
  const t = det(delta, second) / denominator
  const u = det(delta, first) / denominator
  const spatialFirst = atFraction(world[a], world[b], t)
  const spatialSecond = atFraction(world[c], world[d], u)
  check(id === 133 ? 'MC-AD-projected-only-crossing' : 'MN-AC-projected-only-crossing',
    Math.abs(denominator) > 1e-8 && t > 0 && t < 1 && u > 0 && u < 1 &&
      close(atFraction(screen[a], screen[b], t), atFraction(screen[c], screen[d], u)) &&
      !close(spatialFirst, spatialSecond),
    'The two projected segment interiors cross, but their corresponding 3D points are distinct. No point object is added at the crossing.')
  const expectedEdges = id === 133 ?
    { AB: ['A', 'B'], BC: ['B', 'C'], CD: ['C', 'D'], DA: ['D', 'A'], MA: ['M', 'A'], MB: ['M', 'B'], MC: ['M', 'C'], MD: ['M', 'D'] } :
    { AB: ['A', 'B'], BC: ['B', 'C'], CA: ['C', 'A'], MN: ['M', 'N'] }
  const edges = spec.objects.filter(o => o.type === 'segment')
  check('exact-source-edge-set-and-solid-style', edges.length === Object.keys(expectedEdges).length &&
    edges.every(e => expectedEdges[e.id]?.[0] === e.from && expectedEdges[e.id]?.[1] === e.to &&
      e.dash === 0 && e.visible !== false),
    'No edge, endpoint, solid/dashed distinction or solution construction was changed.')
  check('exact-label-and-marker-set', spec.objects.every(o => o.type === 'point' || o.type === 'segment') &&
    spec.objects.filter(o => o.type === 'point').length === 5 &&
    spec.objects.filter(o => o.type === 'point').every(o => o.label === o.id &&
      o.visible === (id === 133 ? ['M', 'A'].includes(o.id) : ['M', 'N'].includes(o.id))),
    'Five source-bound labels; only the source normal endpoint/junction dots have standalone markers.')
  const report = {
    schema: 'ld-s10y-image/spatial-check@1', figure: spec.id, status: 'pass',
    checker: { path: path.join(batch, 'spatial-check.mjs'), sha256: hash(path.join(batch, 'spatial-check.mjs')) },
    model: { path: modelPath, sha256: hash(modelPath) },
    spec: { path: specPath, sha256: hash(specPath) },
    scope: 'Source/edition-given 3D mathematics and the actual affine projection; no answer-key access, solution construction or invented visible dimensions.',
    checks: records,
  }
  fs.writeFileSync(path.join(dir, 'spatial-check.json'), JSON.stringify(report, null, 2) + '\n', { flag: 'wx' })
  console.log(`PASS: ${spec.id}, ${records.length} spatial/topology/provenance checks`)
}
