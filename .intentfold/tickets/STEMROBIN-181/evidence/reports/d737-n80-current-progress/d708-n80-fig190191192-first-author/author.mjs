import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const own = path.dirname(fileURLToPath(import.meta.url))
assert.equal(own, `${repo}/.intentfold/tickets/STEMROBIN-181/tmp/d708-n80-fig190191192-first-author`)
const frozen = `${repo}/.intentfold/tickets/STEMROBIN-181/tmp/d701-source217-consume-prepare80`
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const write = (name, value) => {
  const target = path.resolve(own, name)
  assert.ok(target.startsWith(`${own}/`))
  assert.ok(!fs.existsSync(target), `Preserve existing output: ${target}`)
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.writeFileSync(target, `${JSON.stringify(value, null, 2)}\n`)
}
const inventory = read(`${own}/source-inventory.json`)
const requirements = read(`${frozen}/preauthor-source-requirements.json`)
const lesson = read(`${frozen}/root/10p/lessons/phy10-c2-s2-n80/lesson.json`)
const exercises = read(`${frozen}/root/10p/lessons/phy10-c2-s2-n80/exercises.json`)
assert.equal(requirements.status, 'SOURCE-CLOSED-PREAUTHOR-FROZEN')
assert.equal(lesson.id, 'phy10-c2-s2-n80')
assert.equal(exercises.count, 12)
const mappings = []
const base = (id, height, box, fontSize) => {
  const original = inventory.figures.find(item => item.id === id)
  assert.equal(hash(original.image.path), original.image.sha256)
  const text = id === 'fig-190'
    ? lesson.prose.filter(item => item.kind === 'p').map(item => ({ lesson: lesson.id, text: item.text }))
    : exercises.exercises.filter(item => item.figure_refs.includes(id)).map(item => ({
      lesson: lesson.id, exercise: item.number, text: item.text,
    }))
  assert.ok(text.length)
  return {
    schema: 'ld-s10y-image/figure-spec@2',
    id,
    mode: 'deterministic',
    description: id === 'fig-190'
      ? 'Approximate microscope ray-path schematic: objective forms inverted intermediate real image A1; the eyepiece emits parallel rays and the simplified eye focuses them at retinal image A2. No distances are numerical givens.'
      : 'Source-only unsolved construction prompt. Preserve the given axis and point positions; do not draw a lens, optical center, foci, connecting construction lines or answer rays.',
    source: {
      image: { path: original.image.path, sha256: original.image.sha256 },
      authoritativeText: text,
      inventory: [],
    },
    canvas: { width: id === 'fig-190' ? 1120 : 640, height, boundingBox: box, background: 'paper' },
    display: { purpose: 'instructional', layout: 'scroll', minTextPx: 16, widths: [640] },
    objects: [],
    assertions: [],
    layout: { minLabelGap: 4 },
    fontSize,
  }
}
const point = (s, id, at, label, placement = 'NE', options = {}) => {
  s.objects.push({
    id, type: 'point', at, visible: true, size: 2.5, stroke: 'ink', fill: 'paper',
    ...(label ? { label, fontSize: s.fontSize, labelPlacement: { position: placement, gap: 17 } } : {}),
    ...options,
  })
}
const hidden = (s, id, at) => s.objects.push({ id, type: 'point', at, visible: false })
const text = (s, id, at, value, position = 'CENTER') => s.objects.push({
  id, type: 'text', at, text: value, fontSize: s.fontSize,
  labelPlacement: { position, gap: 18 }, labelColor: 'ink',
})
const edge = (s, id, from, to, options = {}) => {
  s.objects.push({ id, type: 'segment', from, to, stroke: 'ink', strokeWidth: 3, dash: 0, ...options })
  s.assertions.push({ id: `${id}-endpoints`, type: 'connects', arrow: id, from, to })
}
const relation = (s, id, type, data) => s.assertions.push({ id, type, ...data })
const group = (s, id, description, objects, assertions, relational = false) => s.source.inventory.push({
  id, description, objects, assertions, ...(relational ? { requires: ['pointRelationships'] } : {}),
})
const displacement = (s, id, from, to, dx, dy) => relation(s, id, 'displacement', { from, to, dx, dy })
const count = (s, id, type, value) => relation(s, id, 'objectCount', { objectType: type, equals: value })

const microscope = base('fig-190', 440, [0, 240, 1120, -200], 32)
const objectX = 40
const objectiveX = 200
const intermediateX = 550
const eyepieceX = 690
const eyeLensX = 860
const retinaX = 1010
const objectHeight = 30
const intermediateHeight = -65.625
const f1 = 160 * 350 / 510
const f2 = 140
const raySlope = -intermediateHeight / f2
const retinalHeight = raySlope * (retinaX - eyeLensX)
const positions = {
  A: [objectX, objectHeight], B: [objectX, 0],
  'objective-axis': [objectiveX, 0],
  'objective-left-focus': [objectiveX - f1, 0],
  'objective-right-focus': [objectiveX + f1, 0],
  A1: [intermediateX, intermediateHeight], B1: [intermediateX, 0],
  'eyepiece-axis': [eyepieceX, 0],
  A2: [retinaX, retinalHeight], B2: [retinaX, 0],
}
for (const [id, at] of Object.entries(positions)) {
  const labels = { A: 'A', B: 'B', A1: 'A1', B1: 'B1', A2: 'A2', B2: 'B2' }
  const sides = { A: 'N', B: 'S', A1: 'SW', B1: 'NE', A2: 'E', B2: 'E' }
  point(microscope, id, at, labels[id], sides[id], { size: labels[id] ? 2.5 : 2 })
}
edge(microscope, 'principal-axis', [20, 0], [1060, 0], { strokeWidth: 1.8 })
edge(microscope, 'object-AB', 'B', 'A')
edge(microscope, 'intermediate-A1B1', 'B1', 'A1')
edge(microscope, 'retinal-A2B2', 'B2', 'A2')
for (const [id, x, top, bottom] of [
  ['objective', objectiveX, 125, -90], ['eyepiece', eyepieceX, 140, -145],
]) {
  edge(microscope, `${id}-upper-half`, [x, 0], [x, top], { type: 'arrow', strokeWidth: 3.5 })
  edge(microscope, `${id}-lower-half`, [x, 0], [x, bottom], { type: 'arrow', strokeWidth: 3.5 })
}
edge(microscope, 'F1-bracket', [objectiveX, 175], [objectiveX + f1, 175], { strokeWidth: 1.8 })
edge(microscope, 'F1-objective-extension', [objectiveX, 125], [objectiveX, 185], { strokeWidth: 1.8 })
edge(microscope, 'F1-focus-extension', 'objective-right-focus', [objectiveX + f1, 185], { strokeWidth: 1.8 })
edge(microscope, 'F2-bracket', [intermediateX, 175], [eyepieceX, 175], { strokeWidth: 1.8 })
edge(microscope, 'F2-intermediate-extension', 'B1', [intermediateX, 185], { strokeWidth: 1.8 })
edge(microscope, 'F2-eyepiece-extension', [eyepieceX, 140], [eyepieceX, 185], { strokeWidth: 1.8 })
text(microscope, 'F1', [objectiveX + f1 / 2, 175], 'F1', 'N')
text(microscope, 'F2', [(intermediateX + eyepieceX) / 2, 175], 'F2', 'N')
text(microscope, 'objective-name', [objectiveX, -165], 'Objective')
text(microscope, 'eyepiece-name', [eyepieceX, -165], 'Eyepiece')
text(microscope, 'eye-lens-name', [eyeLensX, 145], 'Eye lens')
text(microscope, 'retina-name', [retinaX, 145], 'Retina')
microscope.objects.push({
  id: 'eye-outline', type: 'svgPath', stroke: 'ink', strokeWidth: 3, fill: 'paper',
  fillOpacity: 0, dash: 0,
  d: 'M 1010 320 C 950 370 875 365 845 275 Q 818 265 820 240 Q 818 215 845 205 C 875 115 950 110 1010 160 Q 1030 240 1010 320 Z',
})
edge(microscope, 'modern-eye-lens-plane', [eyeLensX, -60], [eyeLensX, 100], { stroke: 'muted', strokeWidth: 1.8, dash: 2 })
const rayPoints = []
const rayEdges = []
for (const [index, objectiveY] of [30, 0].entries()) {
  const n = index + 1
  const eyepieceY = intermediateHeight + (intermediateHeight - objectiveY) / 350 * f2
  const eyeY = eyepieceY + raySlope * (eyeLensX - eyepieceX)
  const knots = [
    [`ray${n}-objective`, [objectiveX, objectiveY]],
    [`ray${n}-eyepiece`, [eyepieceX, eyepieceY]],
    [`ray${n}-eye`, [eyeLensX, eyeY]],
  ]
  for (const [id, at] of knots) hidden(microscope, id, at)
  const chain = ['A', knots[0][0], 'A1', knots[1][0], knots[2][0], 'A2']
  for (let i = 0; i < chain.length - 1; i++) {
    const id = `ray${n}-stage${i + 1}`
    edge(microscope, id, chain[i], chain[i + 1], { type: 'arrow', strokeWidth: 3 })
    rayEdges.push(id)
  }
  relation(microscope, `ray${n}-straight-through-intermediate`, 'collinear', {
    a: knots[0][0], b: 'A1', c: knots[1][0], tolerance: 1e-7,
  })
  rayPoints.push(knots)
}
relation(microscope, 'parallel-eyepiece-output', 'parallel', {
  a: 'ray1-eyepiece', b: 'ray1-eye', c: 'ray2-eyepiece', d: 'ray2-eye', tolerance: 1e-10,
})
relation(microscope, 'source-axis-collinearity', 'collinear', { a: 'B', b: 'B1', c: 'B2' })
relation(microscope, 'objective-foci-collinearity', 'collinear', {
  a: 'objective-left-focus', b: 'objective-axis', c: 'objective-right-focus',
})
relation(microscope, 'objective-equal-focal-distances', 'equalDistance', {
  a: 'objective-axis', b: 'objective-left-focus', c: 'objective-axis', d: 'objective-right-focus',
})
relation(microscope, 'object-ray-horizontal', 'parallel', {
  a: 'A', b: 'ray1-objective', c: 'B', d: 'objective-axis',
})
relation(microscope, 'central-objective-ray', 'collinear', { a: 'A', b: 'objective-axis', c: 'A1' })
displacement(microscope, 'object-upright', 'B', 'A', 0, 30)
displacement(microscope, 'intermediate-inverted', 'B1', 'A1', 0, -65.625)
displacement(microscope, 'retinal-upright', 'B2', 'A2', 0, retinalHeight)
displacement(microscope, 'object-before-objective', 'B', 'objective-axis', 160, 0)
displacement(microscope, 'intermediate-before-eyepiece', 'B1', 'eyepiece-axis', 140, 0)
displacement(microscope, 'intermediate-after-objective', 'objective-axis', 'B1', 350, 0)
displacement(microscope, 'eye-after-eyepiece', 'eyepiece-axis', 'B2', 320, 0)
group(microscope, 'object-and-three-images',
  inventory.figures[0].requirements[0].facts,
  ['A', 'B', 'A1', 'B1', 'A2', 'B2', 'object-AB', 'intermediate-A1B1', 'retinal-A2B2', 'principal-axis'],
  ['source-axis-collinearity', 'object-upright', 'intermediate-inverted', 'retinal-upright',
    'object-AB-endpoints', 'intermediate-A1B1-endpoints', 'retinal-A2B2-endpoints'], true)
group(microscope, 'objective-and-focal-marks',
  `${inventory.figures[0].requirements[1].facts} Modern distances are unlabelled schematic coordinates, not source measured values.`,
  ['A', 'B', 'objective-axis', 'objective-left-focus', 'objective-right-focus',
    'objective-upper-half', 'objective-lower-half', 'F1-bracket', 'F1-focus-extension', 'F1-objective-extension', 'F1'],
  ['object-upright', 'object-before-objective', 'objective-foci-collinearity', 'objective-equal-focal-distances',
    'F1-bracket-endpoints', 'F1-focus-extension-endpoints', 'F1-objective-extension-endpoints',
    'objective-upper-half-endpoints', 'objective-lower-half-endpoints'], true)
group(microscope, 'eyepiece-and-focal-plane',
  inventory.figures[0].requirements[2].facts,
  ['A1', 'B1', 'eyepiece-axis', 'eyepiece-upper-half', 'eyepiece-lower-half',
    'F2-bracket', 'F2-intermediate-extension', 'F2-eyepiece-extension', 'F2'],
  ['intermediate-inverted', 'intermediate-before-eyepiece', 'F2-bracket-endpoints',
    'F2-intermediate-extension-endpoints', 'F2-eyepiece-extension-endpoints',
    'eyepiece-upper-half-endpoints', 'eyepiece-lower-half-endpoints'], true)
group(microscope, 'two-forward-rays-and-eye',
  `${inventory.figures[0].requirements[3].facts} The added dashed eye-lens plane is a simplified refraction guide; solid rays are not virtual extensions.`,
  ['A', 'B', 'A1', 'B1', 'A2', 'B2', 'eye-outline', 'modern-eye-lens-plane', ...rayEdges],
  ['object-upright', 'intermediate-inverted', 'retinal-upright', 'parallel-eyepiece-output',
    'ray1-straight-through-intermediate', 'ray2-straight-through-intermediate',
    'modern-eye-lens-plane-endpoints', ...rayEdges.map(id => `${id}-endpoints`)], true)
group(microscope, 'line-style',
  `${inventory.figures[0].requirements[4].facts} English apparatus names and the dashed eye-lens plane are declared modern additions.`,
  ['principal-axis', 'eye-outline', 'modern-eye-lens-plane', 'objective-name', 'eyepiece-name', 'eye-lens-name', 'retina-name'],
  ['principal-axis-endpoints', 'modern-eye-lens-plane-endpoints'])
assert.ok(f1 < objectiveX - objectX && objectiveX - objectX < 2 * f1)
assert.ok(Math.abs(1 / f1 - 1 / 160 - 1 / 350) < 1e-12)
assert.ok(Math.abs(intermediateHeight / objectHeight + 350 / 160) < 1e-12)
for (const knots of rayPoints) {
  const eyeY = knots[2][1][1]
  assert.ok(Math.abs(eyeY + (raySlope - eyeY / 150) * 150 - retinalHeight) < 1e-10)
}
delete microscope.fontSize
write('fig-190/first/spec.json', microscope)
mappings.push({
  id: 'fig-190', spec: `${own}/fig-190/first/spec.json`,
  inventory: `${own}/source-inventory.json`, sourcePointIds: Object.keys(positions),
  approximateParaxialChecks: {
    status: 'pass', sourceDistancesAreNotNumericalGivens: true,
    objectBetweenFocalAndDoubleFocal: true, realInvertedIntermediate: true,
    intermediateAtEyepieceFocalPlane: true, parallelOutput: true,
    eyeThinPlaneConvergence: true,
  },
})

for (const id of ['fig-191', 'fig-192']) {
  const original = inventory.figures.find(item => item.id === id)
  const s = base(id, 400, id === 'fig-191' ? [0, 220, 640, -180] : [0, 300, 640, -100], 24)
  const scale = id === 'fig-191' ? 1.2 : 1.15
  const axisY = id === 'fig-191' ? 149 : 207.5
  const leftX = original.pointsFromPixelsApproximate.M[0]
  const mapped = {}
  for (const [name, [x, y]] of Object.entries(original.pointsFromPixelsApproximate)) {
    const at = [40 + (x - leftX) * scale, ['M', 'N'].includes(name) ? 0 : (axisY - y) * scale]
    mapped[name] = at
    point(s, name, at, name, ['M', 'N'].includes(name) ? 'N' : 'E',
      { size: ['M', 'N'].includes(name) ? 1 : 3, ...(name === 'S' ? { fill: 'ink' } : {}) })
  }
  edge(s, 'principal-axis-MN', 'M', 'N', { strokeWidth: 3, dash: 0 })
  const relationIds = []
  for (const name of Object.keys(mapped).filter(name => name !== 'M')) {
    const relationId = `source-M-to-${name}`
    displacement(s, relationId, 'M', name, mapped[name][0] - mapped.M[0], mapped[name][1])
    relationIds.push(relationId)
  }
  const pair = id === 'fig-191' ? ['S', 'S1'] : ['A', 'B']
  displacement(s, 'source-point-pair-order', pair[0], pair[1],
    mapped[pair[1]][0] - mapped[pair[0]][0], mapped[pair[1]][1] - mapped[pair[0]][1])
  relationIds.push('source-point-pair-order')
  assert.ok(mapped.M[0] < mapped[pair[0]][0] && mapped[pair[0]][0] < mapped[pair[1]][0] && mapped[pair[1]][0] < mapped.N[0])
  const markerIds = []
  if (id === 'fig-191') {
    assert.ok(mapped.S[1] > 0 && mapped.S1[1] < 0 && mapped.S[1] > -mapped.S1[1])
    for (const [n, [dx, dy]] of [[8, 0], [0, 8], [5.7, 5.7], [5.7, -5.7]].entries()) {
      const markerId = `S-marker-diameter${n + 1}`
      edge(s, markerId, [mapped.S[0] - dx, mapped.S[1] - dy],
        [mapped.S[0] + dx, mapped.S[1] + dy], { strokeWidth: 2 })
      markerIds.push(markerId)
    }
  } else {
    assert.ok(mapped.A[1] > mapped.B[1] && mapped.B[1] > 0)
  }
  count(s, 'exactly-four-given-points', 'point', 4)
  count(s, 'no-answer-arrows', 'arrow', 0)
  count(s, 'no-answer-lines', 'line', 0)
  count(s, 'source-only-segments', 'segment', id === 'fig-191' ? 5 : 1)
  group(s, 'unsolved-axis-and-points',
    `${original.requirements[0].facts} Uniform source-pixel scaling; only the scanned principal-axis tilt is levelled. No problem solution is computed.`,
    [...Object.keys(mapped), 'principal-axis-MN', ...markerIds],
    [...relationIds, 'principal-axis-MN-endpoints', ...markerIds.map(name => `${name}-endpoints`),
      'exactly-four-given-points', 'no-answer-arrows', 'no-answer-lines', 'source-only-segments'], true)
  delete s.fontSize
  write(`${id}/first/spec.json`, s)
  mappings.push({
    id, spec: `${own}/${id}/first/spec.json`, inventory: `${own}/source-inventory.json`,
    sourcePointIds: Object.keys(mapped),
    sourcePixelTransform: { scale, axisY, leftX, targetLeftX: 40, result: mapped },
    unsolvedPrompt: true, answerKeyUsed: false, lensCenterOrFociComputed: false,
  })
}
const inputs = [
  `${frozen}/preauthor-source-requirements.json`,
  `${frozen}/root/10p/lessons/phy10-c2-s2-n80/lesson.json`,
  `${frozen}/root/10p/lessons/phy10-c2-s2-n80/exercises.json`,
  `${own}/source-inventory.json`, fileURLToPath(import.meta.url),
  `${repo}/.agents/skills/ld-s10y-image/assets/figure-spec.schema.json`,
  `${repo}/.agents/skills/ld-s10y-image/scripts/validate_spec.py`,
  `${repo}/.agents/skills/ld-s10y-image/scripts/render_spec.mjs`,
]
write('source-to-spec.json', {
  ticket: 'STEMROBIN-181', card: lesson.id, stage: 'first-author-candidates',
  createdAt: new Date().toISOString(), modernTextD703: 'pending',
  promotion: false, independentReview: false, wholeCardApproved: false,
  paidCalls: 0, inputs: inputs.map(file => ({ path: file, sha256: hash(file) })),
  figures: mappings.map(item => ({ ...item, specSha256: hash(item.spec) })),
})
console.log(JSON.stringify({ status: 'first-authored', figures: mappings.map(item => item.spec) }, null, 2))
