import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const own = path.dirname(fileURLToPath(import.meta.url))
const repo = path.resolve(own, '../../..')
const attempt = process.argv[2] || 'initial'
assert.ok(['initial', 'repair'].includes(attempt))
const out = path.join(own, attempt)
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: path.relative(repo, file), sha256: hash(file) })
const write = (file, value) => {
  assert.ok(file.startsWith(`${own}/`))
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
}
const context = JSON.parse(fs.readFileSync(path.join(own, 'context.json'), 'utf8'))
const inventoryFile = path.join(own, 'source-inventory.json')
assert.equal(hash(inventoryFile), context.frozenBindings.inventory.sha256)
const original = JSON.parse(fs.readFileSync(inventoryFile, 'utf8')).figures['fig-152']
for (const item of Object.values(context.frozenBindings)) {
  assert.equal(hash(path.join(repo, item.path)), item.sha256)
}
const objects = []
const assertions = []
const maps = new Map(original.sourceFacts.map(fact => [fact.id, {
  id: fact.id, description: `${fact.observation} ${fact.certainty}`,
  objects: [], assertions: [],
}]))
const at = ([x, y]) => [x + 13, 450 - y]
const positions = new Map()
const add = (object, facts) => {
  objects.push(object)
  for (const fact of facts) maps.get(fact).objects.push(object.id)
  return object.id
}
const relation = (item, facts) => {
  assertions.push(item)
  for (const fact of facts) maps.get(fact).assertions.push(item.id)
}
const anchor = (id, p) => {
  positions.set(id, at(p))
  objects.push({ id, type: 'point', at: at(p), visible: false, stroke: 'ink', fill: 'ink' })
  return id
}
const segment = (id, from, to, facts, width = 2.2, role = 'ink') => {
  add({ id, type: 'segment', from, to, stroke: role, strokeWidth: width }, facts)
  relation({ id: `${id}-connects`, type: 'connects', arrow: id, from, to }, facts)
  return id
}
const line = (id, a, b, facts, width = 2.2, role = 'ink') => segment(id, at(a), at(b), facts, width, role)
const polygon = (id, points, facts, filled = false, width = 2.8) => add({
  id, type: 'polygon', points: points.map(at), stroke: 'ink', strokeWidth: width,
  fill: filled ? 'ink' : 'paper', fillOpacity: filled ? 1 : 0,
}, facts)
const circle = (id, p, radius, facts, filled = false, width = 2.8) => add({
  id, type: 'circle', center: at(p), radius, stroke: 'ink', strokeWidth: width,
  fill: filled ? 'ink' : 'paper', fillOpacity: filled ? 1 : 0,
}, facts)

const top = anchor('instrument-top-contact-anchor', [94, 75])
const pivot = anchor('instrument-pivot-anchor', [94, 174])
const bottom = anchor('instrument-rod-bottom-anchor', [94, 242])
const sw = anchor('instrument-needle-sw-anchor', [44, 224])
const ne = anchor('instrument-needle-ne-anchor', [146, 122])
const lower = anchor('instrument-lower-contact-anchor', [124, 264])
const leftContact = anchor('left-plate-contact-anchor', [297, 148])
const rightContact = anchor('right-plate-contact-anchor', [431, 145])

circle('instrument-face-rim', [94, 174], 86, ['instrument-face'], false, 5.2)
const upperFine = [
  [[14, 153], [106, 98]],
  [[18, 157], [111, 103]],
  [[24, 158], [117, 106]],
  [[19, 146], [89, 101]],
  [[25, 133], [75, 103]],
  [[42, 118], [89, 93]],
]
upperFine.forEach(([a, b], index) => line(`instrument-upper-fine-${index + 1}`, a, b, ['instrument-upper-fine-strokes'], 2.05))
line('instrument-lower-oblique-mark', [36, 209], [51, 198], ['instrument-lower-fine-strokes'], 2.5)
const shortFine = [
  [[49, 224], [46, 231]],
  [[57, 227], [52, 236]],
  [[66, 231], [62, 240]],
  [[74, 234], [70, 245]],
  [[83, 237], [81, 246]],
  [[91, 235], [89, 248]],
]
shortFine.forEach(([a, b], index) => line(`instrument-lower-short-${index + 1}`, a, b, ['instrument-lower-fine-strokes'], 2.15))
const lowerRightFine = [
  [[107, 246], [158, 213]],
  [[101, 252], [148, 225]],
  [[116, 250], [145, 233]],
]
lowerRightFine.forEach(([a, b], index) => line(`instrument-lower-right-fine-${index + 1}`, a, b, ['instrument-lower-fine-strokes'], 2.0))
segment('instrument-rod-upper', top, pivot, ['instrument-rod-and-needle', 'instrument-terminals'], 2.7)
segment('instrument-rod-lower', pivot, bottom, ['instrument-rod-and-needle'], 2.7)
segment('instrument-needle-lower', sw, pivot, ['instrument-rod-and-needle'], 5.2)
segment('instrument-needle-upper', pivot, ne, ['instrument-rod-and-needle'], 5.2)
circle('instrument-pivot', [94, 174], 3.2, ['instrument-rod-and-needle'], true, 1.5)
circle('instrument-rod-end', [94, 242], 2.3, ['instrument-rod-and-needle', 'instrument-lower-fine-strokes'], true, 1.5)
relation({ id: 'instrument-rod-through-pivot', type: 'collinear', a: top, b: pivot, c: bottom }, ['instrument-rod-and-needle'])
relation({ id: 'instrument-needle-through-pivot', type: 'collinear', a: sw, b: pivot, c: ne }, ['instrument-rod-and-needle'])
polygon('instrument-top-contact', [[90, 69], [99, 69], [100, 78], [89, 78]], ['instrument-terminals'], true, 2)
line('instrument-top-contact-shoulder', [86, 79], [103, 79], ['instrument-terminals'], 2.7)
polygon('instrument-lower-contact-tab', [[117, 257], [132, 256], [132, 272], [120, 274]], ['instrument-terminals'], true, 2)
circle('instrument-lower-contact', [124, 264], 3.6, ['instrument-terminals'], true, 2)

polygon('instrument-stem', [[87, 259], [99, 259], [101, 328], [109, 339], [79, 339], [84, 328]], ['instrument-stem-and-tripod'], true, 2)
line('instrument-stem-inner-edge', [91, 275], [89, 327], ['instrument-stem-and-tripod'], 2.1, 'paper')
polygon('instrument-tripod-left', [[91, 329], [93, 344], [35, 378], [26, 378], [28, 363], [78, 336]], ['instrument-stem-and-tripod'], true, 2)
polygon('instrument-tripod-right', [[93, 330], [169, 352], [174, 360], [173, 370], [165, 371], [92, 345]], ['instrument-stem-and-tripod'], true, 2)
line('instrument-tripod-overlap-contour', [65, 350], [92, 335], ['instrument-stem-and-tripod'], 2.5)
line('instrument-stem-rim-join', [94, 255], [94, 270], ['instrument-face', 'instrument-stem-and-tripod'], 5)

for (const [side, x] of [['left', 297], ['right', 431]]) {
  const fact = `${side}-plate-mount-and-stand`
  polygon(`${side}-stand-post`, [[x - 3, 141], [x + 3, 141], [x + 3, 328], [x - 3, 328]], [fact], false, 2.4)
  polygon(`${side}-stand-cap`, [[x - 4, 134], [x + 4, 134], [x + 4, 141], [x - 4, 141]], [fact], true, 2)
  polygon(`${side}-stand-upper-collar`, [[x - 5, 155], [x + 5, 155], [x + 5, 170], [x - 5, 170]], [fact], false, 2.3)
  circle(`${side}-stand-side-knob`, [x + (side === 'left' ? -7 : 7), 179], 4.0, [fact], false, 2.2)
  polygon(`${side}-stand-lower-collar`, [[x - 4, 173], [x + 4, 173], [x + 4, 187], [x - 4, 187]], [fact], false, 2.1)
  polygon(`${side}-stand-base`, [
    [x - 3, 321], [x + 5, 321], [x + 12, 334],
    [x + 42, 351], [x + 42, 364], [x + 32, 364], [x + 3, 344],
    [x - 40, 362], [x - 49, 362], [x - 47, 348], [x - 11, 334],
  ], [fact], true, 2.3)
  circle(`${side}-stand-base-upturned-end`, [x - 43, 340], 4, [fact], true, 1.8)
  line(`${side}-stand-foot-detail`, [x - 44, 342], [x - 45, 354], [fact], 4.3)
  line(`${side}-stand-base-overlap-contour`, [x - 20, 344], [x - 4, 332], [fact], 2.2)
  line(`${side}-stand-post-base-join`, [x, 316], [x, 336], [fact], 4.4)
}
segment('left-mount-arm', leftContact, at([344, 148]), ['left-plate-mount-and-stand', 'two-separate-plates'], 4.0)
polygon('left-mount-end-collar', [[335, 140], [346, 140], [348, 143], [348, 152], [344, 154], [335, 154]], ['left-plate-mount-and-stand'], false, 2.6)
segment('right-mount-arm', at([399, 145]), rightContact, ['right-plate-mount-and-stand', 'two-separate-plates'], 4.0)
circle('left-plate-contact', [297, 148], 4.8, ['left-plate-mount-and-stand', 'lead-crossings-and-contacts'], true, 2)
circle('right-plate-contact', [431, 145], 5.2, ['right-plate-mount-and-stand', 'lead-crossings-and-contacts'], false, 3)

for (const [side, cx, rx] of [['left', 348, 16], ['right', 383, 17]]) {
  const screenX = cx + 13
  const screenY = 145 + 14
  add({
    id: `${side}-plate-outline`, type: 'svgPath',
    d: `M ${screenX} ${screenY - 90} A ${rx} 90 0 1 1 ${screenX} ${screenY + 90} A ${rx} 90 0 1 1 ${screenX} ${screenY - 90} Z`,
    stroke: 'ink', strokeWidth: 3.2, fill: 'paper', fillOpacity: 0,
  }, ['two-separate-plates'])
}
relation({ id: 'two-independent-plate-contours', type: 'objectCount', objectType: 'svgPath', count: 2 }, ['two-separate-plates'])

const slabFacts = ['foreground-slab-frame']
const slabPoints = [[278, 376], [424, 353], [544, 387], [394, 423]]
const slabAnchors = slabPoints.map((p, index) => anchor(`slab-corner-${index + 1}`, p))
for (let index = 0; index < 4; index++) {
  segment(`slab-edge-${index + 1}`, slabAnchors[index], slabAnchors[(index + 1) % 4], slabFacts, 3.0)
}
line('slab-front-thickness', [276, 381], [393, 428], slabFacts, 2.6)
line('slab-left-thickness', [270, 380], [278, 376], slabFacts, 2.5)
line('slab-corner-thickness', [270, 380], [276, 381], slabFacts, 2.6)
line('slab-front-corner-return', [394, 423], [393, 428], slabFacts, 2.2)

// Curves are sampled only as bounded drawing coordinates, never physical readings.
const catmull = (knots, count) => Array.from({ length: count }, (_, index) => {
  const value = index / (count - 1) * (knots.length - 1)
  const k = Math.min(Math.floor(value), knots.length - 2)
  const t = value - k
  const p0 = knots[Math.max(0, k - 1)]
  const p1 = knots[k]
  const p2 = knots[k + 1]
  const p3 = knots[Math.min(knots.length - 1, k + 2)]
  return [0, 1].map(axis => Number((0.5 * (
    2 * p1[axis] + (-p0[axis] + p2[axis]) * t +
    (2 * p0[axis] - 5 * p1[axis] + 4 * p2[axis] - p3[axis]) * t * t +
    (-p0[axis] + 3 * p1[axis] - 3 * p2[axis] + p3[axis]) * t * t * t
  )).toFixed(4)))
})
const lead = (name, knots, count, start, end, fact) => {
  const samples = catmull(knots, count)
  const nodes = samples.map((p, index) => (
    index === 0 ? start : index === count - 1 ? end : anchor(`${name}-node-${index}`, p)
  ))
  for (let index = 0; index < nodes.length - 1; index++) {
    segment(`${name}-segment-${index + 1}`, nodes[index], nodes[index + 1], [fact, 'lead-crossings-and-contacts'], 4.1)
  }
  return { name, sourceFact: fact, nodes, segments: nodes.slice(1).map((_, index) => `${name}-segment-${index + 1}`), samples }
}
const leads = [
  lead('upper-lead', [[94, 75], [101, 22], [127, 9], [154, 28], [176, 65], [205, 127], [238, 159], [268, 166], [297, 148]], 20, top, leftContact, 'upper-lead'),
  lead('lower-lead', [[124, 264], [196, 248], [249, 251], [316, 267], [365, 266], [402, 244], [437, 216], [456, 190], [453, 167], [431, 145]], 26, lower, rightContact, 'lower-lead'),
]

const sourceInventory = [...maps.values()].filter(group => group.id !== 'source-labels-and-values')
for (const group of sourceInventory) {
  group.objects = [...new Set(group.objects)]
  group.assertions = [...new Set(group.assertions)]
  assert.ok(group.objects.length > 0, `unmapped source group: ${group.id}`)
}
sourceInventory.find(group => group.id === 'instrument-lower-fine-strokes').description +=
  ' The explicitly placed short strokes preserve the visible irregular family; their drawing count is not a certified original scale count and carries no calibration.'
sourceInventory.find(group => group.id === 'two-separate-plates').description +=
  ' Clean projected oval contours and a small readable central clearance are modern noncalibrated regularization.'
const spec = {
  schema: 'ld-s10y-image/figure-spec@2', id: 'fig-152', mode: 'deterministic',
  description: 'Qualitative parallel-plate capacitance apparatus: complete electrometer face, central rod and diagonal indicator, two separately supported plates, two independently connected leads, and the foreground dielectric slab before insertion. All drawing positions and fine graduation-like strokes are uncalibrated; no numerical reading, polarity label, measured gap, field arrow or inserted full-gap medium is supplied.',
  source: {
    image: { path: context.sourceImage.path, sha256: context.sourceImage.sha256 },
    authoritativeText: context.lessons[0].authoritativeText,
    inventory: sourceInventory,
  },
  canvas: { width: 640, height: 512, boundingBox: [0, 464, 580, 0], background: 'paper', keepAspectRatio: true },
  display: { layout: 'inline', purpose: 'instructional', maxWidthPx: 640, minTextPx: 16, widths: [640, 331, 342] },
  objects, assertions,
}
assert.ok(objects.length <= 200, `geometry budget exceeded: ${objects.length}`)
assert.ok(objects.every(object => !object.label && !object.text))
assert.ok(objects.every(object => !['axis', 'grid', 'measure', 'arrow', 'image'].includes(object.type)))
write(path.join(out, 'spec.json'), spec)
write(path.join(out, 'geometry.json'), {
  schema: 'ld-s10y-image/author-geometry@1',
  figure: 'fig-152', attempt, status: 'authored',
  drawingCoordinateRule: 'Source-like locating coordinates transformed to a padded 640x512 canvas; these are illustrative drawing coordinates, not measurements.',
  declaredObjects: objects.length, assertions: assertions.length,
  hiddenAnchors: objects.filter(object => object.type === 'point').length,
  visibleLabels: [], scaleValues: [], sourceScaleCount: null,
  leads,
  originalInventory: bind(inventoryFile),
  currentContext: bind(path.join(own, 'context.json')),
  spec: bind(path.join(out, 'spec.json')),
  sourceInventoryMaps: sourceInventory,
  labelAbsence: { sourceId: 'source-labels-and-values', observation: original.sourceFacts.find(fact => fact.id === 'source-labels-and-values').observation, mappedObjects: [], check: 'No text/labels/axis/measure/arrow objects exist.' },
  mappingDecision: 'The validator forbids source.inventory mapping of invisible construction points. Source apparatus strokes map to visible segments/circles/polygons, whose connects assertions refer to genuine shared hidden anchors. No extra visible dots or synthetic pointRelationships/group counts were invented. Lead continuity is independently checked over every actual node in the geometry graph.',
  modernRegularization: [
    'Clean circular instrument rim and two projected oval plate contours.',
    'Explicit irregular fine-stroke representatives without certified scale counts, labels or calibrated intervals.',
    'Bounded smooth lead sampling, consistent finite contours and mobile-readable stroke weights.',
    'No hidden tripod leg; visible splayed contours and foot details preserved.',
    'Foreground slab remains outside the gap; no inserted full-fill medium is depicted.',
  ],
})
console.log(JSON.stringify({ status: 'authored', objects: objects.length, assertions: assertions.length, spec: bind(path.join(out, 'spec.json')) }, null, 2))
