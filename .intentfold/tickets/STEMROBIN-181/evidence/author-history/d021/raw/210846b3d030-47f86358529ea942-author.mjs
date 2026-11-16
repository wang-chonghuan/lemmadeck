import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const own = path.dirname(fileURLToPath(import.meta.url))
const repo = path.resolve(own, '../../..')
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: path.relative(repo, file), sha256: hash(file) })
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const write = (file, value) => {
  assert.ok(file.startsWith(`${own}/`))
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
}
const inventoryFile = path.join(own, 'source-inventory.json')
const inventory = read(inventoryFile)
const display = { layout: 'inline', purpose: 'instructional', maxWidthPx: 640, minTextPx: 16, widths: [640, 331, 342] }

function construction(id, width, height, boundingBox) {
  const context = read(path.join(own, id, 'context.json'))
  const objects = []
  const assertions = []
  const maps = new Map(inventory.figures[id].sourceFacts.map(fact => [fact.id, { id: fact.id, description: fact.observation, objects: [], assertions: [] }]))
  const add = (object, facts) => {
    objects.push(object)
    facts.forEach(fact => maps.get(fact).objects.push(object.id))
    return object.id
  }
  const relation = (item, facts) => {
    assertions.push(item)
    facts.forEach(fact => maps.get(fact).assertions.push(item.id))
  }
  const anchor = (name, at) => {
    objects.push({ id: name, type: 'point', at, visible: false })
    return name
  }
  const segment = (name, from, to, facts, strokeWidth = 3, stroke = 'ink') => {
    add({ id: name, type: 'segment', from, to, stroke, strokeWidth }, facts)
    relation({ id: `${name}-connects`, type: 'connects', arrow: name, from, to }, facts)
  }
  const finish = (description, geometry) => {
    const groups = [...maps.values()].map(group => ({ ...group, objects: [...new Set(group.objects)], assertions: [...new Set(group.assertions)] }))
    groups.forEach(group => assert.ok(group.objects.length, `Unmapped source group: ${group.id}`))
    const spec = {
      schema: 'ld-s10y-image/figure-spec@2', id, mode: 'deterministic', description,
      source: { image: { path: context.sourceImage.path, sha256: context.sourceImage.sha256 }, authoritativeText: context.authoritativeText, inventory: groups },
      canvas: { width, height, boundingBox, background: 'paper', keepAspectRatio: true },
      display, objects, assertions,
    }
    assert.ok(objects.length <= 200)
    write(path.join(own, id, 'initial/spec.json'), spec)
    write(path.join(own, id, 'initial/geometry.json'), {
      schema: 'ld-s10y-image/author-geometry@1', figure: id, attempt: 'initial', status: 'authored',
      context: bind(path.join(own, id, 'context.json')), sourceInventory: bind(inventoryFile),
      objects: objects.length, assertions: assertions.length,
      inventoryMappingDecision: 'Apparatus/plate objects map to visible geometry; hidden construction anchors are referenced by executable connects/parallel/collinear assertions, never declared as extra source points. The source has no named point geometry or grid.',
      ...geometry,
    })
  }
  return { add, relation, anchor, segment, finish, objects }
}

{
  const id = 'fig-158'
  const { add, relation, anchor, segment, finish, objects } = construction(id, 640, 688, [0, 430, 400, 0])
  const at = ([x, y]) => [x + 18, 430 - (y + 12)]
  const line = (name, from, to, facts, width = 3, role = 'ink') => segment(name, at(from), at(to), facts, width, role)
  const raw = (name, d, facts, fill = 'paper', fillOpacity = 0, strokeWidth = 2.8) => add({ id: name, type: 'svgPath', d, stroke: 'ink', strokeWidth, fill, fillOpacity }, facts)
  const pathPoint = ([x, y]) => [x + 18, y + 12]
  const oval = (name, p, rx, ry, facts, filled = false, width = 2.8) => {
    const [x, y] = pathPoint(p)
    raw(name, `M ${x - rx} ${y} A ${rx} ${ry} 0 1 1 ${x + rx} ${y} A ${rx} ${ry} 0 1 1 ${x - rx} ${y} Z`, facts, filled ? 'ink' : 'paper', filled ? 1 : 0, width)
  }
  const ball = (name, p, r, facts) => add({ id: name, type: 'circle', center: at(p), radius: r, stroke: 'ink', strokeWidth: 3, fill: 'paper', fillOpacity: 1 }, facts)

  oval('glass-mouth', [81, 101], 62, 28, ['glass-vessel'])
  line('glass-left-side', [19, 101], [19, 352], ['glass-vessel'], 3)
  line('glass-right-side', [143, 101], [143, 352], ['glass-vessel'], 3)
  const [leftX, lowerY] = pathPoint([19, 352])
  raw('glass-rounded-bottom', `M ${leftX} ${lowerY} A 62 28 0 0 0 ${leftX + 124} ${lowerY}`, ['glass-vessel', 'outer-lining'], 'paper', 0, 3)
  line('glass-left-short-inner-contour', [24, 115], [24, 150], ['glass-vessel'], 1.8)
  line('inner-lining-rear-edge', [55, 81], [55, 115], ['inner-lining'], 3.2)
  oval('inner-lining-top', [71, 179], 53, 28, ['inner-lining'], true, 2.8)
  const leftBand = [[19, 180], [27, 184], [27, 362], [21, 354]].map(pathPoint)
  const rightBand = [[124, 181], [140, 190], [140, 354], [126, 372], [124, 199]].map(pathPoint)
  for (const [side, points] of [['left', leftBand], ['right', rightBand]]) {
    raw(`outer-lining-${side}-band`, `M ${points.map(p => p.join(' ')).join(' L ')} Z`, ['outer-lining'], 'ink', 1, 2)
  }
  line('inner-lining-front-right-edge', [119, 202], [119, 366], ['inner-lining'], 2.3)
  const top = anchor('terminal-center', at([81, 43]))
  const stem = anchor('rod-mouth-center', at([81, 101]))
  const interior = anchor('rod-interior-contact', at([81, 174]))
  segment('central-rod-above-mouth', top, stem, ['central-rod-and-ball'], 4.3)
  segment('central-rod-inside', stem, interior, ['central-rod-and-ball'], 4.3)
  relation({ id: 'rod-is-one-straight-conductor', type: 'collinear', a: top, b: stem, c: interior }, ['central-rod-and-ball'])
  ball('central-terminal-ball', [81, 43], 7.2, ['central-rod-and-ball'])

  const pivot = anchor('discharger-joint-anchor', at([235, 85]))
  const upperTip = anchor('discharger-upper-tip-anchor', at([90, 34]))
  const lowerTip = anchor('discharger-lower-tip-anchor', at([158, 196]))
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
  const arm = (name, knots, count, start, end, fact) => {
    const samples = catmull(knots, count)
    const nodes = samples.map((p, index) => index === 0 ? start : index === count - 1 ? end : anchor(`${name}-node-${index}`, at(p)))
    const segments = []
    for (let index = 0; index < nodes.length - 1; index++) {
      const nameId = `${name}-segment-${index + 1}`
      segment(nameId, nodes[index], nodes[index + 1], [fact], 4.2)
      segments.push(nameId)
    }
    return { name, nodes, segments, samples }
  }
  const arms = [
    arm('discharger-upper', [[90, 34], [115, 20], [151, 16], [183, 25], [209, 49], [235, 85]], 22, upperTip, pivot, 'discharger-upper-arm'),
    arm('discharger-lower', [[235, 85], [235, 117], [226, 148], [206, 175], [181, 189], [158, 196]], 20, pivot, lowerTip, 'discharger-lower-arm'),
  ]
  ball('discharger-lower-ball', [158, 196], 5.4, ['discharger-lower-arm'])
  ball('discharger-joint-ring', [235, 85], 5.3, ['discharger-joint-and-handle'])
  const handleEnd = anchor('handle-end-anchor', at([345, 62]))
  segment('discharger-handle', pivot, handleEnd, ['discharger-joint-and-handle'], 11)
  relation({ id: 'two-distinct-arm-families', type: 'objectCount', objectType: 'circle', count: 3 }, ['central-rod-and-ball', 'discharger-lower-arm', 'discharger-joint-and-handle'])
  assert.ok(objects.every(object => !object.text && !object.label))
  finish('Historical foil-lined Leyden bottle and two-arm discharger, faithfully retaining the open vessel, interior conductor, separate outer coating, central terminal, shared discharger joint and handle. This is apparatus identification, not an experiment to repeat. No liquid, person, charge signs, spark, force, field, procedure or worked-solution annotation is added.', {
    arms,
    rod: { nodes: [top, stem, interior], segments: ['central-rod-above-mouth', 'central-rod-inside'] },
    joints: [{ anchor: pivot, incident: [arms[0].segments.at(-1), arms[1].segments[0], 'discharger-handle'] }],
    lowerTipClearance: { ballCenterDrawing: [158, 196], radius: 5.4, outerWallX: 143, strictlyPositive: true, physicalMeasurement: false },
    expectedLabels: [],
    sourceSignCount: 0,
    modernRegularization: ['Clean source-like projected glass and foil contours', 'Smooth bounded arm sampling with shared nodes', 'Consistent mobile-readable strokes', 'Upper approach preserved without a labelled spark gap'],
    sourceRegions: {
      vessel: [34, 82, 164, 395],
      interiorFoil: [36, 160, 144, 221],
      terminalAndRod: [90, 44, 109, 190],
      upperArm: [104, 25, 259, 109],
      lowerArm: [165, 100, 261, 217],
      handle: [254, 61, 367, 105],
    },
  })
}

{
  const id = 'fig-159'
  const height = 660
  const { add, relation, segment, finish, objects } = construction(id, 640, height, [0, height, 640, 0])
  const at = ([x, y]) => [x, height - y]
  const left = { top: at([120, 82]), bottom: at([120, 615]) }
  const right = { top: at([520, 82]), bottom: at([520, 615]) }
  segment('negative-plate', left.top, left.bottom, ['parallel-plates'], 6)
  segment('positive-plate', right.top, right.bottom, ['parallel-plates'], 6)
  relation({ id: 'plates-parallel', type: 'parallel', a: left.top, b: left.bottom, c: right.top, d: right.bottom }, ['parallel-plates'])
  relation({ id: 'plates-same-length', type: 'equalDistance', a: left.top, b: left.bottom, c: right.top, d: right.bottom }, ['parallel-plates'])
  segment('negative-outward-lead', at([40, 348]), at([120, 348]), ['plate-side-leads'], 4)
  segment('positive-outward-lead', at([520, 348]), at([600, 348]), ['plate-side-leads'], 4)
  relation({ id: 'negative-lead-meets-plate', type: 'pointOnLine', point: at([120, 348]), a: left.top, b: left.bottom }, ['plate-side-leads'])
  relation({ id: 'positive-lead-meets-plate', type: 'pointOnLine', point: at([520, 348]), a: right.top, b: right.bottom }, ['plate-side-leads'])
  const label = (name, p, text, fact) => add({ id: name, type: 'text', at: at(p), text, fontSize: 34, fontWeight: 600, labelColor: 'ink', labelPlacement: { position: 'CENTER' } }, [fact])
  label('negative-charge', [59, 117], '-|q|', 'charge-labels')
  label('positive-charge', [581, 117], '+|q|', 'charge-labels')
  label('total-field-vector', [320, 77], 'E\u20d7', 'field-vector-label')
  const fieldRows = [125, 215, 305, 395, 485, 575]
  const signRows = [89, 179, 269, 359, 449, 539]
  for (const [index, y] of signRows.entries()) {
    label(`negative-sign-${index + 1}`, [151, y], '-', 'negative-signs')
    label(`positive-sign-${index + 1}`, [489, y], '+', 'positive-signs')
  }
  for (const [index, y] of fieldRows.entries()) {
    const from = at([520, y])
    const to = at([120, y])
    const arrow = `gap-field-${index + 1}`
    add({ id: arrow, type: 'arrow', from, to, stroke: 'ink', strokeWidth: 3.6 }, ['field-lines'])
    relation({ id: `${arrow}-connects`, type: 'connects', arrow, from, to }, ['field-lines'])
    relation({ id: `${arrow}-perpendicular`, type: 'perpendicular', a: from, b: to, c: left.top, d: left.bottom }, ['field-lines'])
    relation({ id: `${arrow}-positive-origin`, type: 'pointOnLine', point: from, a: right.top, b: right.bottom }, ['field-lines'])
    relation({ id: `${arrow}-negative-end`, type: 'pointOnLine', point: to, a: left.top, b: left.bottom }, ['field-lines'])
  }
  relation({ id: 'exactly-six-gap-field-arrows', type: 'objectCount', objectType: 'arrow', count: 6 }, ['field-lines'])
  relation({ id: 'exactly-fifteen-source-text-labels', type: 'objectCount', objectType: 'text', count: 15 }, ['negative-signs', 'positive-signs', 'charge-labels', 'field-vector-label'])
  assert.equal(objects.filter(object => object.type === 'text').length, 15)
  finish('One original parallel-plate total-field diagram: right +|q| plate, left -|q| plate, six positive and six negative marks, two short outward leads and exactly six leftward gap-field arrows, with only the original E vector label. The n83 other-plate E/2 contribution remains in the prose; no E/2, force, distance, energy formula, extra charge or answer overlay is invented.', {
    expectedLabels: ['-|q|', '+|q|', 'E\u20d7', ...Array(6).fill('-'), ...Array(6).fill('+')],
    signRows, fieldRows, leftPlate: left, rightPlate: right,
    expectedArrowDirection: 'right positive to left negative',
    sourceCounts: { plates: 2, outwardLeads: 2, negativeMarks: 6, positiveMarks: 6, fieldArrows: 6 },
    noEOverTwoOrForceLabel: true,
    modernRegularization: ['Clean equal-length parallel plates', 'Even spacing preserving six source field arrows and six sign pairs', '34px mathematical glyphs, at least 17.58px at 331px width'],
    sourceRegions: {
      negativePlate: [115, 78, 126, 619],
      positivePlate: [514, 78, 526, 619],
      allFieldArrows: [118, 119, 523, 580],
      negativeCharge: [15, 90, 103, 144],
      positiveCharge: [537, 90, 626, 144],
      vectorE: [297, 48, 344, 108],
    },
  })
}
console.log(JSON.stringify({ status: 'authored', figures: ['fig-158', 'fig-159'], attempt: 'initial', scope: 'Owned scratch specs only' }))
