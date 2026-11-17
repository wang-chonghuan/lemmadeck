import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const own = path.dirname(fileURLToPath(import.meta.url))
const repo = path.resolve(own, '../../..')
const card = 'phy9-c2-s4-n113'
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: path.resolve(file), sha256: hash(file), bytes: fs.statSync(file).size })
const write = (file, value) => {
  assert.ok(path.resolve(file).startsWith(`${own}/`))
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
}
const scienceFile = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/9p-n113-science-review.json')
assert.equal(hash(scienceFile), 'a737213742ab0bb257fe29a829b7c75f1e16d1bfcee376870208add938906fe7')
const science = read(scienceFile)
assert.equal(science.status, 'SCI-PASS')
assert.equal(science.pass, true)
const lessonDir = path.join(repo, `.tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons/${card}`)
const englishDir = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d031-n113-prose-author')
const inputs = {
  lesson: bind(path.join(lessonDir, 'lesson.template.json')),
  english: bind(path.join(englishDir, 'lesson.en.json')),
  exercises: bind(path.join(lessonDir, 'exercises.template.json')),
  englishExercises: bind(path.join(englishDir, 'exercises.en.json')),
  science: bind(scienceFile),
}
for (const input of [inputs.lesson, inputs.exercises, inputs.english, inputs.englishExercises]) {
  assert.ok(science.reviewedTextFiles.slice(0, 4).some(r => r.sha256 === input.sha256))
}
const zh = read(inputs.lesson.path), en = read(inputs.english.path)
const zhEx = read(inputs.exercises.path), enEx = read(inputs.englishExercises.path)
assert.equal(zh.prose.length, 13)
assert.equal(en.prose.length, 13)
assert.equal(zhEx.exercises.length, 2)
assert.equal(enEx.exercises.length, 2)
for (const [i, block] of en.prose.entries()) assert.equal(block.chinese_text, zh.prose[i].text)
for (const [i, ex] of enEx.exercises.entries()) {
  assert.equal(ex.chinese_text, zhEx.exercises[i].text)
  assert.equal(ex.lines.join('\n'), ex.text)
}
const inventoryFile = path.join(own, 'source-inventory.json')
const inventory = read(inventoryFile)
assert.equal(inventory.inventoryCompletedBeforeDrawing, true)
write(path.join(own, 'input-bindings.json'), {
  ...inputs, sourceInventory: bind(inventoryFile),
  chineseReadInFull: true, englishReadInFull: true,
  bothCompleteSolvedExamplesReadInBothLanguages: true,
  sciReusedWithoutResearchOrReplay: true,
})

function build(id, height) {
  const observed = inventory.figures.find(f => f.id === id)
  const source = path.join(repo, observed.sourcePNG)
  assert.equal(hash(source), observed.sha256)
  const applicable = zhEx.exercises.filter(e => e.figure_refs.includes(id)).map(e => e.number)
  assert.deepEqual(applicable, id === 'fig-232' ? ['2'] : [])
  const contextFile = path.join(own, id, 'complete-context.json')
  write(contextFile, {
    schema: 'ld-s10y-image/complete-context@1', ticket: 'STEMROBIN-181',
    card, figure: id, bindings: inputs, source: bind(source),
    sourceInventory: bind(inventoryFile),
    chineseCompleteLesson: zh, englishCompleteLesson: en,
    chineseCompleteExercises: zhEx, englishCompleteExercises: enEx,
    applicableExercises: applicable,
    chineseFigurePointer: id === 'fig-232' ? '/exercises/1/figures/0' : '/prose/7',
    englishFigurePointer: id === 'fig-232' ? '/exercises/1/figures/0' : '/prose/7',
    sourceObservation: observed, renderingChoice: observed.routing,
    rule: 'Complete approved edition prose is authoritative; original pixels and the question determine drawing structure. Complete solutions are context, never a source of newly answer-bearing labels or diagrams.',
    scienceReused: { sha256: inputs.science.sha256, status: science.status, freshResearch: false, replay: false },
  })
  const p = (x, y) => [x, height - y]
  const objects = [], assertions = [], buckets = {}, wires = []
  const put = (object, bucket) => {
    objects.push(object)
    if (bucket) (buckets[bucket] ||= []).push(object.id)
    return object.id
  }
  const resolve = value => typeof value === 'string' ? objects.find(o => o.id === value).at : value
  const point = (name, x, y, bucket) => put({
    id: name, type: 'point', at: p(x, y), size: 1.2,
    stroke: 'ink', fill: 'ink', strokeWidth: 1,
  }, bucket)
  const edge = (name, from, to, bucket, physicalWire = false, strokeWidth = 4, arrow = false) => {
    put({ id: name, type: arrow ? 'arrow' : 'segment', from, to, stroke: 'ink', strokeWidth }, bucket)
    assertions.push({ id: `${name}-connects`, type: 'connects', arrow: name, from, to })
    if (physicalWire) wires.push(name)
  }
  const chain = (name, nodes, bucket) => {
    for (let i = 1; i < nodes.length; i++) edge(`${name}-${i}`, nodes[i - 1], nodes[i], bucket, true)
  }
  const label = (name, text, x, y, bucket = 'modern-identifications') => put({
    id: name, type: 'text', text, at: p(x, y), fontSize: 32,
    fontWeight: 500, labelColor: 'ink', labelPlacement: { position: 'CENTER' },
  }, bucket)
  const displacement = (name, from, to) => {
    const a = resolve(from), b = resolve(to)
    assertions.push({ id: name, type: 'displacement', from, to, dx: b[0] - a[0], dy: b[1] - a[1] })
  }
  const finish = (description, topology, specifics) => {
    const points = objects.filter(o => o.type === 'point')
    for (const point of points.slice(1)) displacement(`${point.id}-schematic-position`, points[0].id, point.id)
    const groups = observed.items.map(item => {
      const ids = buckets[item.id]
      assert.ok(ids?.length, `Missing independently inventoried group ${item.id}`)
      return {
        id: item.id, description: `${item.observation} ${item.requirement}`,
        objects: ids,
        assertions: assertions.filter(a => ids.includes(a.arrow)).map(a => a.id),
      }
    })
    groups.push({
      id: `${id}-source-point-relationships`,
      description: 'One shared executable relation group covers every apparatus terminal, pointer point and illumination endpoint. Coordinates are modern schematic positions, not calibrated source givens.',
      objects: points.map(o => o.id),
      assertions: assertions.filter(a => a.type === 'displacement').map(a => a.id),
      requires: ['pointRelationships'],
    })
    if (buckets['modern-identifications']) groups.push({
      id: `${id}-modern-identifications`, description: 'Prose-based English component identifications, explicitly separate from source-pixel facts.',
      objects: buckets['modern-identifications'], assertions: [],
    })
    const authoritativeText = [
      ...zh.prose.filter(b => b.text.trim()).map(b => ({ lesson: card, language: 'zh', text: b.text })),
      ...en.prose.filter(b => b.text.trim()).map(b => ({ lesson: card, language: 'en', text: b.text })),
    ]
    if (id === 'fig-232') {
      authoritativeText.push(
        { lesson: card, exercise: '2', language: 'zh', text: zhEx.exercises[1].text },
        { lesson: card, exercise: '2', language: 'en', text: enEx.exercises[1].text },
      )
    }
    const spec = {
      schema: 'ld-s10y-image/figure-spec@2', id, mode: 'deterministic', description,
      source: { image: { path: source, sha256: hash(source) }, authoritativeText, inventory: groups },
      canvas: { width: 640, height, boundingBox: [0, height, 640, 0], background: 'paper', keepAspectRatio: true },
      display: { purpose: 'instructional', layout: 'scroll', minTextPx: 16, widths: [640] },
      assets: [], objects, assertions, layout: { minLabelGap: 6 },
    }
    const out = path.join(own, id, 'initial')
    write(path.join(out, 'spec.json'), spec)
    write(path.join(out, 'geometry.json'), {
      id, wires, topology, specifics,
      expectedLabels: objects.filter(o => o.type === 'text').map(o => o.text),
      modernAdditions: observed.modernAdditions, unknownPixels: observed.unresolvedPixels,
      sourceInventory: bind(inventoryFile), completeContext: bind(contextFile),
      noAnswerAnnotations: true, singleSeriesCircuit: true,
    })
    write(path.join(out, 'repair-history.json'), {
      repairCount: 0, maximumRepairs: 1, remainingRepairs: 1, failures: [],
      initialSpec: bind(path.join(out, 'spec.json')),
      policy: 'Preserve all initial failure evidence. One targeted repair per figure maximum; an exhausted failure blocks.',
    })
  }
  return { p, put, point, edge, chain, label, displacement, finish, assertions }
}

{
  const f = build('fig-231', 640), { p } = f
  const cell = '231-source-cell', meter = '231-source-analog-meter'
  const photo = '231-source-photoresistor', loop = '231-source-series-loop', light = '231-source-incident-light'
  f.point('cell-left', 120, 295, cell)
  f.point('cell-right', 140, 295, cell)
  f.edge('cell-long', p(120, 263), p(120, 327), cell, false, 5)
  f.edge('cell-short', p(140, 277), p(140, 313), cell, false, 5)
  f.label('cell-label', 'Cell', 130, 230)
  for (const [name, radius, width] of [['meter-rim', 95, 4], ['meter-inner-rim', 88, 2]]) f.put({
    id: name, type: 'circle', center: p(355, 160), radius,
    stroke: 'ink', strokeWidth: width, fill: 'paper', fillOpacity: 0,
  }, meter)
  const lowerY = 160 + Math.sqrt(95 ** 2 - 20 ** 2)
  f.point('ammeter-left', 335, lowerY, meter)
  f.point('ammeter-right', 375, lowerY, meter)
  f.point('needle-pivot', 355, 210, meter)
  const dial = (angle, radius) => p(355 + radius * Math.cos(angle * Math.PI / 180), 210 - radius * Math.sin(angle * Math.PI / 180))
  const tip = dial(94, 95)
  f.point('needle-tip', tip[0], 640 - tip[1], meter)
  f.edge('meter-needle', 'needle-pivot', 'needle-tip', meter)
  f.put({ id: 'dial-scale', type: 'arc', center: p(355, 210), start: dial(30, 100), end: dial(150, 100), stroke: 'ink', strokeWidth: 2 }, meter)
  for (let i = 0; i <= 16; i++) {
    const angle = 30 + i * 7.5
    f.edge(`dial-tick-${i}`, dial(angle, 100), dial(angle, i % 4 === 0 ? 108 : 105), meter, false, 2)
  }
  f.label('ammeter-A', 'A', 405, 195)
  f.put({
    id: 'photoresistor-body', type: 'polygon',
    points: [p(265, 405), p(435, 405), p(435, 445), p(265, 445)],
    stroke: 'ink', strokeWidth: 4, fill: 'paper', fillOpacity: 1,
  }, photo)
  f.point('photoresistor-left', 265, 425, photo)
  f.point('photoresistor-right', 435, 425, photo)
  f.label('photoresistor-label', 'Photoresistor', 350, 363)
  f.chain('cell-to-meter', ['cell-right', p(335, 295), 'ammeter-left'], loop)
  f.chain('meter-to-photoresistor', ['ammeter-right', p(375, 295), p(580, 295), p(580, 425), 'photoresistor-right'], loop)
  f.chain('photoresistor-to-cell', ['photoresistor-left', p(60, 425), p(60, 295), 'cell-left'], loop)
  for (let i = 0; i < 5; i++) {
    const x = 225 + i * 34
    f.point(`light-${i + 1}-start`, x, 550, light)
    f.point(`light-${i + 1}-end`, x + 54, 470, light)
    f.edge(`incident-light-${i + 1}`, `light-${i + 1}-start`, `light-${i + 1}-end`, light, false, 4, true)
    f.displacement(`light-${i + 1}-up-right`, `light-${i + 1}-start`, `light-${i + 1}-end`)
    if (i) f.assertions.push({ id: `light-${i + 1}-parallel`, type: 'parallel', a: 'light-1-start', b: 'light-1-end', c: `light-${i + 1}-start`, d: `light-${i + 1}-end` })
  }
  f.label('light-label', 'Light', 231, 600, light)
  f.displacement('needle-near-upright-slightly-left', 'needle-pivot', 'needle-tip')
  f.assertions.push(
    { id: 'left-lower-terminal-on-rim', type: 'pointOnCircle', point: 'ammeter-left', center: p(355, 160), radius: 95 },
    { id: 'right-lower-terminal-on-rim', type: 'pointOnCircle', point: 'ammeter-right', center: p(355, 160), radius: 95 },
    { id: 'needle-tip-on-dial', type: 'pointOnCircle', point: 'needle-tip', center: 'needle-pivot', radius: 95 },
    { id: 'meter-terminals-separated', type: 'distance', a: 'ammeter-left', b: 'ammeter-right', value: 40 },
    { id: 'five-light-arrows', type: 'objectCount', objectType: 'arrow', count: 5 },
  )
  f.finish(
    'Illumination of the same photoresistor circuit as FIG230. Five incident-light arrows aim upwards and rightwards at the semiconductor. The unnumbered analog meter needle is nearly upright and slightly left of vertical, a larger deflection than the FIG230 upper-left low-side pointer. No numeric current, calibration, or temperature change is invented.',
    {
      componentPairs: [['cell-left', 'cell-right'], ['ammeter-left', 'ammeter-right'], ['photoresistor-left', 'photoresistor-right']],
      sequenceConnections: [['cell-right', 'ammeter-left'], ['ammeter-right', 'photoresistor-right'], ['photoresistor-left', 'cell-left']],
    },
    {
      visibleCellPairs: 1, longPlates: ['cell-long'], shortPlates: ['cell-short'], plateOrientation: 'long-left',
      analogTickCount: 17, tickCountIsModernRegularization: true, noNumericDialValues: true,
      needleAngleDegrees: 94, baselineStyleNeedleAngleDegrees: 118, needleRadius: 95,
      sourceDirection: 'upward nearly vertical, slightly left', incidentLightArrows: 5,
      currentArrows: 0, calibratedNumericValues: 0,
      styleReuseOnly: bind(path.join(repo, '.tmp/STEMROBIN-181/9p-d031-n113-figures-a/fig-230/initial/spec.json')),
    },
  )
}

{
  const f = build('fig-232', 520), { p } = f
  const cap = '232-source-capacitor', resistor = '232-source-resistor'
  const supply = '232-source-supply', loop = '232-source-series-loop'
  f.point('capacitor-left', 290, 110, cap)
  f.point('capacitor-right', 320, 110, cap)
  f.edge('capacitor-left-plate', p(290, 65), p(290, 155), cap, false, 5)
  f.edge('capacitor-right-plate', p(320, 65), p(320, 155), cap, false, 5)
  f.label('capacitor-C', 'C', 305, 210, cap)
  f.put({
    id: 'resistor-body', type: 'polygon',
    points: [p(515, 190), p(555, 190), p(555, 330), p(515, 330)],
    stroke: 'ink', strokeWidth: 4, fill: 'paper', fillOpacity: 1,
  }, resistor)
  f.point('resistor-top', 535, 190, resistor)
  f.point('resistor-bottom', 535, 330, resistor)
  f.label('resistor-R', 'R', 605, 260, resistor)
  f.point('supply-left', 245, 405, supply)
  f.point('supply-right', 365, 405, supply)
  for (const [name, x, half] of [
    ['cell-1-short', 245, 18], ['cell-1-long', 265, 32],
    ['cell-2-short', 345, 18], ['cell-2-long', 365, 32],
  ]) f.edge(name, p(x, 405 - half), p(x, 405 + half), supply, false, 5)
  f.edge('supply-interior-left', p(265, 405), p(282, 405), supply)
  f.edge('supply-interior-right', p(328, 405), p(345, 405), supply)
  f.label('supply-abbreviation', '...', 305, 399, supply)
  f.label('supply-E', 'E', 305, 476, supply)
  f.chain('capacitor-to-resistor', ['capacitor-right', p(535, 110), 'resistor-top'], loop)
  f.chain('resistor-to-supply', ['resistor-bottom', p(535, 405), 'supply-right'], loop)
  f.chain('supply-to-capacitor', ['supply-left', p(70, 405), p(70, 110), 'capacitor-left'], loop)
  f.assertions.push(
    { id: 'equal-capacitor-plate-lengths', type: 'equalDistance', a: p(290, 65), b: p(290, 155), c: p(320, 65), d: p(320, 155) },
    { id: 'parallel-capacitor-plates', type: 'parallel', a: p(290, 65), b: p(290, 155), c: p(320, 65), d: p(320, 155) },
    { id: 'no-answer-or-ion-arrows', type: 'objectCount', objectType: 'arrow', count: 0 },
  )
  f.finish(
    'The given experimental circuit for worked example 2: capacitor C in the upper wire, vertical resistor R on the right, and abbreviated high-voltage supply E below, connected in series exactly as in the existing source figure. The question and existing diagram are the drawing basis. No ions, current directions, numeric data, voltage answer or solution-derived equation is added.',
    {
      componentPairs: [['capacitor-left', 'capacitor-right'], ['resistor-top', 'resistor-bottom'], ['supply-left', 'supply-right']],
      sequenceConnections: [['capacitor-right', 'resistor-top'], ['resistor-bottom', 'supply-right'], ['supply-left', 'capacitor-left']],
    },
    {
      visibleCellPairs: 2, abbreviatedBatteryNotExactCellCount: true,
      longPlates: ['cell-1-long', 'cell-2-long'], shortPlates: ['cell-1-short', 'cell-2-short'], plateOrientation: 'long-right',
      capacitorPlateLength: 90, capacitorPlateGap: 30,
      originalLabels: ['C', 'R', 'E'], addedAnnotation: 'Supply abbreviation only',
      applicableExercise: '2', drawingBasis: 'Source question and existing figure, not solution',
      currentArrows: 0, ionArrows: 0, solutionDerivedLabels: 0, visibleNumericValues: 0,
    },
  )
}
console.log('Authored FIG231 and FIG232 deterministic drafts; original inventories and complete approved bilingual contexts bound.')
