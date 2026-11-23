import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const cwd = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188'
assert.equal(process.cwd(), cwd)
const owned = path.dirname(fileURLToPath(import.meta.url))
const sourceRoot = 'ssot-resources/soviet10year-textbooks/artifacts/6-8g'
const textRoot = '.tmp/ld-s10y-lesson/adapt/6-8g/modern-us-neutral/lessons/geo68-c3-s2-n38'
const hash = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const expected = {
  'fig-234': '591754f84242a6e0ba18eef352a6acfd6bc9f2f29cc2b8d0c6526338e40788b3',
  'fig-235': 'a25712949bf83f2da5a035f26370ca99455bb8918914cc9dc62e89c4e6f97154',
  lesson: '9f61dabc64e3545533685aa2026402ccc7431ca42e78d791532b7c264bae5d9b',
  exercises: 'ebb0a3a864771163705b9c6f441deedbab5d1e611992e63439da11c328784f60',
}
assert.equal(fs.statSync(path.join(owned, 'SOURCE-INVENTORY.md')).mode & 0o777, 0o444)
for (const id of ['fig-234', 'fig-235']) {
  assert.equal(hash(`${sourceRoot}/figures/${id}.png`), expected[id])
}
for (const name of ['lesson', 'exercises']) {
  assert.equal(hash(`${textRoot}/${name}.template.json`), expected[name])
}
const lesson = JSON.parse(fs.readFileSync(`${textRoot}/lesson.template.json`, 'utf8'))
const exercises = JSON.parse(fs.readFileSync(`${textRoot}/exercises.template.json`, 'utf8'))
const authority = [
  ...lesson.prose.filter((item) => item.text?.trim()).map((item) => ({
    lesson: lesson.id, text: item.text,
  })),
  ...exercises.exercises.map((item) => ({
    lesson: lesson.id, exercise: item.number, text: item.text,
  })),
]
const display = {
  purpose: 'instructional', layout: 'inline', maxWidthPx: 640,
  minTextPx: 16, widths: [294, 310, 346, 358, 640],
}
const point = (id, at, label, placement) => ({
  id, type: 'point', at, ...(label ? { label, fontSize: 36, labelPlacement: placement } : {}),
  visible: true, size: 1, strokeWidth: 1, stroke: 'ink', fill: 'ink',
})
const segment = (id, from, to, strokeWidth = 3) => ({
  id, type: 'segment', from, to, stroke: 'ink', strokeWidth,
})
const connection = (id, edge) => ({
  id, type: 'connects', arrow: edge.id, from: edge.from, to: edge.to,
})
const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t)
const onRay = (center, target, radius) => {
  const length = Math.hypot(target[0] - center[0], target[1] - center[1])
  return center.map((v, i) => v + (target[i] - v) * radius / length)
}
const arc = (id, center, a, b, radius) => ({
  id, type: 'arc', center: center.id,
  start: onRay(center.at, a.at, radius), end: onRay(center.at, b.at, radius),
  stroke: 'ink', strokeWidth: 2.5,
})
const base = (id, description, height, boundingBox, inventory, objects, assertions) => ({
  schema: 'ld-s10y-image/figure-spec@2', id, mode: 'deterministic', description,
  source: {
    image: { path: `${sourceRoot}/figures/${id}.png`, sha256: expected[id] },
    authoritativeText: authority, inventory,
  },
  canvas: { width: 640, height, boundingBox, background: 'paper', keepAspectRatio: true },
  display, layout: { minLabelGap: 4 }, objects, assertions,
})

const left = point('s234-left', [1, 1.3], 'A', { position: 'SW' })
const upper = point('s234-upper', [8.15, 4.95], 'B', { position: 'N', gap: 36 })
const junction = point('s234-junction', [6.55, 1.3], 'C', { position: 'S', gap: 36 })
const end = point('s234-end', [9.15, 1.3], 'D', { position: 'S', gap: 36 })
const edges234 = [
  segment('s234-edge-left-upper', left.id, upper.id),
  segment('s234-edge-upper-junction', upper.id, junction.id),
  segment('s234-edge-left-junction', left.id, junction.id),
  segment('s234-continuation', junction.id, end.id),
]
const arcs234 = [
  arc('s234-left-arc-1', left, junction, upper, 0.72),
  arc('s234-left-arc-2', left, junction, upper, 0.9),
  arc('s234-upper-arc-1', upper, left, junction, 0.66),
  arc('s234-upper-arc-2', upper, left, junction, 0.82),
  arc('s234-upper-arc-3', upper, left, junction, 0.98),
  arc('s234-exterior-arc-1', junction, end, upper, 0.8),
]
const bars234 = [0.29, 0.48].map((t, i) => segment(
  `s234-unknown-bar-${i + 1}`, mix(left.at, upper.at, t - 0.006),
  mix(left.at, upper.at, t + 0.006), 5,
))
const assertions234 = [
  ...edges234.map((edge) => connection(`${edge.id}-connects`, edge)),
  { id: 's234-baseline-collinear', type: 'collinear', a: left.id, b: junction.id, c: end.id },
  { id: 's234-continuation-right', type: 'displacement', from: junction.id, to: end.id, dx: 2.6, dy: 0 },
  { id: 's234-four-role-labels', type: 'objectCount', objectType: 'point', count: 4 },
  { id: 's234-six-arc-strokes', type: 'objectCount', objectType: 'arc', count: 6 },
  ...bars234.map((edge) => connection(`${edge.id}-connects`, edge)),
]
const inventory234 = [
  {
    id: 's234-triangle-extension-labels',
    description: 'One three-corner triangle and actual horizontal continuation to the right, with four visible glyph positions. Old glyph alphabet/code UNKNOWN; modern A/B/C/D are justified by modern ABC and BCD prose only. Small junction markers are modern additions. Upper corner remains right of junction.',
    requires: ['pointRelationships'],
    objects: [left.id, upper.id, junction.id, end.id, ...edges234.map((edge) => edge.id)],
    assertions: assertions234.slice(0, 7).map((item) => item.id),
  },
  {
    id: 's234-arc-pattern',
    description: 'Two left interior arcs, three upper interior arcs, one exterior arc at the baseline junction; no separate junction-interior arc. Arc-multiplicity meaning/fine code UNKNOWN; no equality or angle value inferred. Ray/radius/group assertions are also executable in check-geometry.mjs.',
    objects: arcs234.map((item) => item.id), assertions: ['s234-six-arc-strokes'],
  },
  {
    id: 's234-fine-ink-unknown',
    description: 'Conspicuous short on-stroke rising-side patches retained as neutral thickened segments. Old fine-mark/bar roles UNKNOWN; original and sealed inventory preserve unresolved scan roughness. No equality ticks or numeric meaning assigned.',
    objects: bars234.map((item) => item.id),
    assertions: bars234.map((item) => `${item.id}-connects`),
  },
]
const spec234 = base(
  'fig-234', 'Triangle ABC with AC continued through C to D; show exterior BCD and its adjacent interior sector without printing angle-sum answers. Retain source arc counts and unresolved old mark roles.',
  400, [0, 6.25, 10, 0], inventory234,
  [left, upper, junction, end, ...edges234, ...arcs234, ...bars234], assertions234,
)

const pixelVertices = [[106, 20], [315, 15], [343, 142], [261, 258], [119, 308], [24, 225], [20, 108]]
const fromPixel = ([x, y]) => [0.8 + x * 0.023, 0.9 + (320 - y) * 0.023]
const vertices235 = pixelVertices.map((at, i) => point(`s235-v${i + 1}`, fromPixel(at)))
const hub235 = point('s235-hub', fromPixel([173, 142]), 'O', {
  position: 'S', offset: [10, 65],
})
hub235.size = 2
const polygon235 = {
  id: 's235-boundary', type: 'polygon', points: vertices235.map((item) => item.id),
  stroke: 'ink', strokeWidth: 3, fill: 'paper', fillOpacity: 0,
}
const spokes235 = vertices235.map((vertex, i) => segment(
  `s235-spoke-${i + 1}`, hub235.id, vertex.id,
))
const bars235 = [
  [1, 2, 0.01], [1, 2, 0.26], [2, 3, 0.03], [2, 3, 0.24],
].map(([a, b, t], i) => segment(
  `s235-unknown-bar-${i + 1}`,
  mix(vertices235[a].at, vertices235[b].at, Math.max(0, t - 0.009)),
  mix(vertices235[a].at, vertices235[b].at, t + 0.009), 5,
))
const assertions235 = [
  ...spokes235.map((edge) => connection(`${edge.id}-connects`, edge)),
  { id: 's235-hub-strictly-inside', type: 'inside', point: hub235.id, container: polygon235.id, margin: 1.2 },
  { id: 's235-hub-label-inside', type: 'inside', point: [hub235.at[0] + 10 / 64, hub235.at[1] - (36 * 0.45 + 65) / 64], container: polygon235.id, margin: 1.2 },
  { id: 's235-eight-junctions', type: 'objectCount', objectType: 'point', count: 8 },
  { id: 's235-one-boundary', type: 'objectCount', objectType: 'polygon', count: 1 },
  ...bars235.map((edge) => connection(`${edge.id}-connects`, edge)),
]
const spec235 = base(
  'fig-235', 'One irregular convex seven-sided source polygon partitioned by exactly seven spokes from the strictly interior arbitrary point O. Preserve source vertex/spoke count; no triangle-sum or full-turn answers are printed.',
  600, [0, 9.375, 10, 0],
  [
    {
      id: 's235-seven-vertices-and-spokes',
      description: 'Clockwise source order: upper-left, upper-right, right, lower-right, bottom, lower-left, left. Exactly seven distinct vertices and seven hub-to-vertex spokes. Not a regular polygon. Small junction markers are modern additions. Strict convexity/order/sector coverage are executable in check-geometry.mjs.',
      requires: ['pointRelationships'],
      objects: [...vertices235.map((item) => item.id), hub235.id, polygon235.id, ...spokes235.map((item) => item.id)],
      assertions: assertions235.slice(0, 11).map((item) => item.id),
    },
    {
      id: 's235-hub-label-unknown-code',
      description: 'Single visible O-like source glyph below the hub; old glyph alphabet/code UNKNOWN. Modern O comes only from edition proof. No vertex or sector labels, numeric angles, or angle-sum answers are added.',
      objects: [hub235.id], assertions: ['s235-hub-strictly-inside', 's235-hub-label-inside'],
    },
    {
      id: 's235-fine-ink-unknown',
      description: 'Four conspicuous outline patches retained as neutral on-stroke thickening, not equality ticks. Old fine-mark/bar roles UNKNOWN; canonical source and sealed inventory retain unresolved fine-pixel morphology.',
      objects: bars235.map((item) => item.id),
      assertions: bars235.map((item) => `${item.id}-connects`),
    },
  ],
  [...vertices235, hub235, polygon235, ...spokes235, ...bars235], assertions235,
)

for (const spec of [spec234, spec235]) {
  const requested = process.argv[3]
  if (requested) {
    assert.ok(['fig-234', 'fig-235'].includes(requested))
    if (requested !== spec.id) continue
  }
  const file = path.join(owned, `${spec.id}.spec.json`)
  if (fs.existsSync(file)) {
    assert.equal(process.argv[2], '--rebuild-preserved-revision')
    assert.ok(fs.existsSync(path.join(owned, spec.id, 'attempt-1', `${spec.id}.spec.json`)))
  }
  fs.writeFileSync(file, `${JSON.stringify(spec, null, 2)}\n`)
}
console.log(`Built ${process.argv[3] || 'fig-234 and fig-235'} specs from sealed inventory and hash-bound complete modern text; no promotion.`)
