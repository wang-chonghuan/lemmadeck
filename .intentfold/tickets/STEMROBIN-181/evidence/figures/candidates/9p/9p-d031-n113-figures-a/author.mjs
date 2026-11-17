import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const own = path.dirname(fileURLToPath(import.meta.url))
const repo = path.resolve(own, '../../..')
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: path.resolve(file), sha256: hash(file), bytes: fs.statSync(file).size })
const write = (file, value) => {
  assert.ok(path.resolve(file).startsWith(`${own}/`))
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
}
const inputs = read(path.join(own, 'input-bindings.json'))
for (const record of Object.values(inputs).filter(v => v?.path)) assert.equal(hash(record.path), record.sha256)
const inventory = read(path.join(own, 'source-inventory.json'))
assert.equal(inventory.inventoryCompletedBeforeDrawing, true)

function build(id) {
  const height = 520, p = (x, y) => [x, height - y]
  const objects = [], assertions = [], wires = [], buckets = {}
  const put = (object, bucket) => {
    objects.push(object)
    if (bucket) (buckets[bucket] ||= []).push(object.id)
    return object.id
  }
  const point = (name, x, y, bucket) => put({
    id: name, type: 'point', at: p(x, y), size: 1.2,
    stroke: 'ink', fill: 'ink', strokeWidth: 1,
  }, bucket)
  const segment = (name, from, to, bucket, physicalWire = false, strokeWidth = 4) => {
    put({ id: name, type: 'segment', from, to, stroke: 'ink', strokeWidth }, bucket)
    assertions.push({ id: `${name}-connects`, type: 'connects', arrow: name, from, to })
    if (physicalWire) wires.push(name)
  }
  const chain = (name, nodes, bucket) => {
    for (let i = 1; i < nodes.length; i++) segment(`${name}-${i}`, nodes[i - 1], nodes[i], bucket, true)
  }
  const label = (name, text, x, y, bucket = 'additions') => put({
    id: name, type: 'text', text, at: p(x, y), fontSize: 32,
    fontWeight: 500, labelColor: 'ink', labelPlacement: { position: 'CENTER' },
  }, bucket)
  const resolve = value => typeof value === 'string' ? objects.find(o => o.id === value).at : value
  const displacement = (name, from, to) => {
    const a = resolve(from), b = resolve(to)
    assertions.push({ id: name, type: 'displacement', from, to, dx: b[0] - a[0], dy: b[1] - a[1] })
  }
  const circle = (name, x, y, radius, bucket, strokeWidth = 4) => put({
    id: name, type: 'circle', center: p(x, y), radius,
    stroke: 'ink', strokeWidth, fill: 'paper', fillOpacity: 0,
  }, bucket)
  const element = (prefix, x1, x2, y, bucket) => {
    put({
      id: `${prefix}-body`, type: 'polygon',
      points: [p(x1, y - 20), p(x2, y - 20), p(x2, y + 20), p(x1, y + 20)],
      stroke: 'ink', strokeWidth: 4, fill: 'paper', fillOpacity: 1,
    }, bucket)
    point(`${prefix}-left`, x1, y, bucket)
    point(`${prefix}-right`, x2, y, bucket)
    displacement(`${prefix}-horizontal-terminals`, `${prefix}-left`, `${prefix}-right`)
  }
  const finish = (description, mode, topology, specifics) => {
    const observed = inventory.figures.find(f => f.id === id)
    const points = objects.filter(o => o.type === 'point')
    for (const point of points.slice(1)) displacement(`${point.id}-source-position`, points[0].id, point.id)
    assertions.push({ id: 'no-current-or-light-arrows', type: 'objectCount', objectType: 'arrow', count: 0 })
    const groups = observed.items.map(item => {
      const ids = buckets[item.id] || []
      assert.ok(ids.length, `Missing source mapping ${item.id}`)
      return {
        id: item.id, description: `${item.observation} ${item.requirement}`,
        objects: ids,
        assertions: assertions.filter(a => ids.includes(a.arrow)).map(a => a.id),
      }
    })
    groups.push({
      id: `${id}-source-point-relationships`,
      description: 'All source apparatus attachment points and dial pointer points share one executable relation group. Exact modern schematic coordinates preserve the source arrangement but are not measured source givens. Tiny terminal markers identify attachment points, not branch junctions.',
      objects: points.map(o => o.id),
      assertions: assertions.filter(a => a.type === 'displacement').map(a => a.id),
      requires: ['pointRelationships'],
    })
    const context = path.join(own, id, 'complete-context.json')
    const source = path.join(repo, observed.sourcePNG)
    assert.equal(hash(source), observed.sha256)
    const complete = read(context)
    const spec = {
      schema: 'ld-s10y-image/figure-spec@2', id, mode, description,
      source: {
        image: { path: source, sha256: hash(source) },
        authoritativeText: [complete.chineseCompleteLesson, complete.englishCompleteLesson]
          .flatMap(lesson => lesson.prose.filter(b => b.text.trim()).map(b => ({ lesson: complete.card, text: b.text }))),
        inventory: groups,
      },
      canvas: { width: 640, height, boundingBox: [0, height, 640, 0], background: 'paper', keepAspectRatio: true },
      display: { purpose: 'instructional', layout: 'scroll', minTextPx: 16, widths: [640] },
      assets: mode === 'hybrid' ? [{
        id: 'burner-artwork', path: path.join(own, 'fig-229/artwork/burner.png'),
        metadata: path.join(own, 'fig-229/artwork/burner-opaque.png.json'), role: 'artwork',
      }] : [],
      objects, assertions, layout: { minLabelGap: 6 },
    }
    const out = path.join(own, id, 'initial')
    write(path.join(out, 'spec.json'), spec)
    write(path.join(out, 'geometry.json'), {
      id, wires, topology, specifics,
      expectedLabels: objects.filter(o => o.type === 'text').map(o => o.text),
      modernAdditions: observed.modernAdditions, unknownPixels: observed.unresolvedPixels,
      sourceInventory: inputs.sourceInventory, completeContext: bind(context),
      singleSeriesCircuit: true, noAnswerAnnotations: true,
    })
    write(path.join(out, 'repair-history.json'), {
      repairCount: 0, maximumRepairs: 1, remainingRepairs: 1,
      initialSpec: bind(path.join(out, 'spec.json')),
      failures: [], policy: 'Preserve initial result. At most one targeted repair per figure, including artwork. A failed repair means HOLD.',
    })
  }
  return { p, put, point, segment, chain, label, circle, element, assertions, buckets, displacement, finish }
}

{
  const f = build('fig-229'), { p } = f
  const battery = '229-source-battery', loop = '229-source-series-loop'
  const meter = '229-source-ammeter', thermistor = '229-source-thermistor'
  f.put({ id: 'burner', type: 'image', asset: 'burner-artwork', at: p(322, 510), size: [106, 136] }, '229-source-burning-heat-source')
  f.point('battery-left', 115, 145, battery)
  f.point('battery-right', 265, 145, battery)
  for (const [name, x, half] of [['cell-1-short', 115, 18], ['cell-1-long', 135, 32], ['cell-2-short', 245, 18], ['cell-2-long', 265, 32]]) {
    f.segment(name, p(x, 145 - half), p(x, 145 + half), battery, false, 5)
  }
  f.segment('battery-interior-1', p(135, 145), p(160, 145), battery)
  f.segment('battery-interior-2', p(220, 145), p(245, 145), battery)
  f.label('battery-abbreviation', '...', 190, 139, battery)
  f.label('battery-label', 'Battery', 190, 82)
  f.circle('ammeter-ring', 490, 145, 40, meter)
  f.point('ammeter-left', 450, 145, meter)
  f.point('ammeter-right', 530, 145, meter)
  f.label('ammeter-A', 'A', 490, 145, meter)
  f.element('thermistor', 290, 460, 340, thermistor)
  f.label('thermistor-label', 'Thermistor', 375, 278)
  f.chain('battery-to-meter', ['battery-right', 'ammeter-left'], loop)
  f.chain('meter-to-thermistor', ['ammeter-right', p(575, 145), p(575, 340), 'thermistor-right'], loop)
  f.chain('thermistor-to-battery', ['thermistor-left', p(65, 340), p(65, 145), 'battery-left'], loop)
  f.assertions.push(
    { id: 'ammeter-left-on-ring', type: 'pointOnCircle', point: 'ammeter-left', center: p(490, 145), radius: 40 },
    { id: 'ammeter-right-on-ring', type: 'pointOnCircle', point: 'ammeter-right', center: p(490, 145), radius: 40 },
    { id: 'meter-terminals-horizontal', type: 'parallel', a: 'ammeter-left', b: 'ammeter-right', c: 'battery-left', d: 'battery-right' },
  )
  f.finish(
    'A temperature-sensitive semiconductor element, an abbreviated battery and a circular A ammeter form one series circuit. A separate lit burner heats the thermistor from below. No numeric meter reading, light response or answer is invented.',
    'hybrid', {
      externalComponents: 3, externalCycleRank: 0, expectedJunctions: [],
      componentPairs: [['battery-left', 'battery-right'], ['ammeter-left', 'ammeter-right'], ['thermistor-left', 'thermistor-right']],
      sequenceConnections: [['battery-right', 'ammeter-left'], ['ammeter-right', 'thermistor-right'], ['thermistor-left', 'battery-left']],
      forbiddenCrossings: true,
    }, {
      visibleCellPairs: 2, abbreviatedBatteryNotExactCellCount: true,
      longPlates: ['cell-1-long', 'cell-2-long'], shortPlates: ['cell-1-short', 'cell-2-short'],
      plateOrientation: 'long-right', burnerFitBoxScreen: { x: 322, y: 374, width: 106, height: 136 },
      thermistorBottomScreenY: 360, minimumBurnerSeparationPx: 14,
      artworkDerivation: bind(path.join(own, 'fig-229/artwork/derivation.json')),
    },
  )
}

{
  const f = build('fig-230'), { p } = f
  const cell = '230-source-cell', loop = '230-source-series-loop'
  const meter = '230-source-analog-meter', photo = '230-source-photoresistor'
  f.point('cell-left', 120, 295, cell)
  f.point('cell-right', 140, 295, cell)
  f.segment('cell-long', p(120, 263), p(120, 327), cell, false, 5)
  f.segment('cell-short', p(140, 277), p(140, 313), cell, false, 5)
  f.label('cell-label', 'Cell', 130, 230)
  f.circle('meter-rim', 355, 160, 95, meter)
  f.circle('meter-inner-rim', 355, 160, 88, meter, 2)
  const lowerY = 160 + Math.sqrt(95 ** 2 - 20 ** 2)
  f.point('ammeter-left', 335, lowerY, meter)
  f.point('ammeter-right', 375, lowerY, meter)
  f.point('needle-pivot', 355, 210, meter)
  const dial = (angle, radius) => p(355 + radius * Math.cos(angle * Math.PI / 180), 210 - radius * Math.sin(angle * Math.PI / 180))
  const tip = dial(118, 95)
  f.point('needle-tip', tip[0], 520 - tip[1], meter)
  f.segment('meter-needle', 'needle-pivot', 'needle-tip', meter, false, 4)
  f.put({ id: 'dial-scale', type: 'arc', center: p(355, 210), start: dial(30, 100), end: dial(150, 100), stroke: 'ink', strokeWidth: 2 }, meter)
  for (let i = 0; i <= 16; i++) {
    const angle = 30 + i * 7.5
    f.segment(`dial-tick-${i}`, dial(angle, 100), dial(angle, i % 4 === 0 ? 108 : 105), meter, false, 2)
  }
  f.label('ammeter-A', 'A', 405, 195)
  f.element('photoresistor', 265, 435, 425, photo)
  f.label('photoresistor-label', 'Photoresistor', 350, 480)
  f.chain('cell-to-meter', ['cell-right', p(335, 295), 'ammeter-left'], loop)
  f.chain('meter-to-photoresistor', ['ammeter-right', p(375, 295), p(580, 295), p(580, 425), 'photoresistor-right'], loop)
  f.chain('photoresistor-to-cell', ['photoresistor-left', p(60, 425), p(60, 295), 'cell-left'], loop)
  f.buckets['230-source-no-incident-light'] = ['photoresistor-body', 'meter-needle']
  f.assertions.push(
    { id: 'left-lower-terminal-on-rim', type: 'pointOnCircle', point: 'ammeter-left', center: p(355, 160), radius: 95 },
    { id: 'right-lower-terminal-on-rim', type: 'pointOnCircle', point: 'ammeter-right', center: p(355, 160), radius: 95 },
    { id: 'needle-tip-on-dial', type: 'pointOnCircle', point: 'needle-tip', center: 'needle-pivot', radius: 95 },
    { id: 'meter-lower-terminals-separate', type: 'distance', a: 'ammeter-left', b: 'ammeter-right', value: 40 },
  )
  f.displacement('needle-upper-left-position', 'needle-pivot', 'needle-tip')
  f.finish(
    'The baseline photoresistor circuit before the separate illuminated figure 231. One cell, an analog ammeter with a low-side upper-left needle on an unnumbered arched scale, and the light-sensitive element form one closed series circuit. No incident illumination, numerical reading or zero-current claim is shown.',
    'deterministic', {
      externalComponents: 3, externalCycleRank: 0, expectedJunctions: [],
      componentPairs: [['cell-left', 'cell-right'], ['ammeter-left', 'ammeter-right'], ['photoresistor-left', 'photoresistor-right']],
      sequenceConnections: [['cell-right', 'ammeter-left'], ['ammeter-right', 'photoresistor-right'], ['photoresistor-left', 'cell-left']],
      forbiddenCrossings: true,
    }, {
      visibleCellPairs: 1, longPlates: ['cell-long'], shortPlates: ['cell-short'], plateOrientation: 'long-left',
      analogTickCount: 17, tickCountIsModernRegularization: true, noNumericDialValues: true,
      needleAngleDegrees: 118, needleRadius: 95, scaleAngleDegrees: [30, 150],
      lowSideNonzeroPointer: true, unlitBaselineNotZeroCurrent: true,
      incidentLightArrows: 0, mechanicalScanBlemishOmitted: true,
    },
  )
}
console.log('Drafted fig-229 hybrid and fig-230 deterministic from independent source inventory.')
