import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const own = path.dirname(fileURLToPath(import.meta.url))
const repo = path.resolve(own, '../../..')
const ticket = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp')
const scripts = path.join(repo, '.agents/skills/ld-s10y-image/scripts')
const python = path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python')
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: path.resolve(file), sha256: hash(file) })
const write = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
}
const freezeFile = path.join(ticket, '9p-n94-prose-freeze.json')
const scienceFile = path.join(ticket, '9p-n94-science-review.json')
const inventoryFile = path.join(own, 'source-inventory.json')
const frozen = read(freezeFile)
const science = read(scienceFile)
const inventory = read(inventoryFile)
const ids = inventory.figures.map(item => item.id)
const inputs = Object.fromEntries(Object.entries(frozen.bindings).map(([key, value]) => [key, path.resolve(repo, value.path)]))
const lesson = read(inputs.lessonTemplate)
const exercises = read(inputs.exercisesTemplate)
const figures = read(inputs.figuresTemplate)
const sourceLessonFile = path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts/9p/lessons/phy9-c2-s3-n94/lesson.json')
const sourceExercisesFile = path.join(path.dirname(sourceLessonFile), 'exercises.json')
const sourceLesson = read(sourceLessonFile)
const sourceExercises = read(sourceExercisesFile)
const fullProse = [lesson.printed_title, ...lesson.prose.map(block => block.text)].join('\n\n')
const attemptDir = (id, attempt = 'initial') => path.join(own, id, attempt)
const current = id => inventory.figures.find(item => item.id === id)
const contextKind = id => id === 'fig-179' ? 'exercises' : 'lesson'
const referencing = (document, id) => document.exercises.filter(item =>
  item.figure_refs?.includes(id) || item.figures?.some(figure => figure.id === id))

function checkInputs() {
  assert.equal(hash(freezeFile), '09e06285eb2e21784bf84f1dcbdd227adfa839f0ef78d91a01739172208a19f8')
  assert.equal(hash(scienceFile), 'f289c08dfcf96ba4b849ca139c24dd59edccb8d5adea2b9ced209c34f6713738')
  assert.equal(science.status, 'pass')
  assert.equal(science.review.allThreeIndependentSolutionsPass, true)
  for (const [key, file] of Object.entries(inputs)) assert.equal(hash(file), frozen.bindings[key].sha256)
  for (const source of frozen.sources) assert.equal(hash(path.resolve(repo, source.path)), source.sha256)
  assert.deepEqual(lesson.source.data, sourceLesson)
  assert.deepEqual(exercises.source.data, sourceExercises)
  assert.deepEqual(ids, ['fig-177', 'fig-178', 'fig-179'])
  assert.deepEqual(lesson.figures.map(item => item.id), ids)
  assert.deepEqual(figures.figures.map(item => item.id), ids)
  assert.equal(exercises.exercises.length, 3)
  ids.forEach((id, index) => {
    assert.equal(referencing(exercises, id).length, 1)
    assert.equal(referencing(exercises, id)[0].source_number, String(index + 1))
    assert.equal(referencing(sourceExercises, id).length, 1)
    const source = current(id)
    assert.equal(source.imageOpen.opens, 1)
    assert.equal(hash(path.resolve(repo, source.source.path)), source.source.sha256)
    const entry = figures.figures.find(item => item.id === id)
    assert.equal(entry.source.png.sha256, source.source.sha256)
    for (const format of ['png', 'svg']) {
      const file = path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts/9p', entry.source[format].path)
      assert.equal(hash(file), entry.source[format].sha256)
    }
  })
}

function invoke(name, command, args, input) {
  const call = path.join(own, 'invocations', `${name}.json`)
  write(call, { command, args, cwd: repo, input: input ? JSON.parse(input) : null })
  const result = spawnSync(command, args, {
    cwd: repo, input, encoding: 'utf8', maxBuffer: 20 * 1024 * 1024,
    env: { ...process.env, PYTHON: python, PYTHONDONTWRITEBYTECODE: '1', PLAYWRIGHT_HTML_OPEN: 'never', PWDEBUG: '', PLAYWRIGHT_DEBUG: '' },
  })
  write(path.join(own, 'invocations', `${name}.result.json`), {
    exitCode: result.status, signal: result.signal, stdout: result.stdout, stderr: result.stderr,
  })
  return result
}

function snapshotInputs() {
  const files = [
    freezeFile, scienceFile, inventoryFile, ...Object.values(inputs),
    ...frozen.sources.map(item => path.resolve(repo, item.path)),
    path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts/9p/book.json'),
    ...ids.flatMap(id => ['png', 'svg'].map(extension =>
      path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts/9p/figures', `${id}.${extension}`))),
    ...['build_context.py', 'validate_spec.py', 'render_spec.mjs', 'materialize_arrowheads.mjs'].map(name => path.join(scripts, name)),
    path.join(repo, '.agents/skills/ld-s10y-image/assets/figure-spec.schema.json'),
    path.join(repo, '.agents/skills/ld-s10y-image/SKILL.md'),
    ...['routing.md', 'figure-spec.md', 'quality-gate.md'].map(name =>
      path.join(repo, '.agents/skills/ld-s10y-image/references', name)),
    path.join(repo, '.agents/skills/node_modules/jsxgraph/package.json'),
    path.join(repo, '.agents/skills/node_modules/jsxgraph/distrib/jsxgraphcore.js'),
    path.join(repo, '.agents/skills/node_modules/jsxgraph/distrib/jsxgraph.css'),
    path.join(repo, '.agents/skills/node_modules/playwright-core/package.json'),
    path.join(own, 'author.mjs'), path.join(own, 'previews.mjs'),
  ]
  const snapshots = []
  for (const file of [...new Set(files)]) {
    const copy = path.join(own, 'inputs', path.relative(repo, file))
    fs.mkdirSync(path.dirname(copy), { recursive: true })
    fs.copyFileSync(file, copy, fs.constants.COPYFILE_EXCL)
    snapshots.push({ original: bind(file), retainedInitialBytes: bind(copy) })
  }
  write(path.join(own, 'input-bindings.json'), {
    status: 'pass', checks: 'Exact supplied input hashes, all current source/template hashes, complete source data, manifest figure entries and original exercise reference incidence.',
    contextKinds: Object.fromEntries(ids.map(id => [id, contextKind(id)])),
    snapshots,
    runtime: {
      node: { executable: bind(fs.realpathSync(process.execPath)), version: process.version },
      python: { executable: bind(fs.realpathSync(python)), version: spawnSync(python, ['--version'], { encoding: 'utf8' }).stdout.trim() },
    },
  })
}

function makeContext(id) {
  const item = current(id)
  const supplied = {
    id, source: item.source, lesson, exercises, sourceLesson, sourceExercises,
    fullProse, contextKind: contextKind(id),
    bindings: Object.fromEntries([
      ...Object.entries(inputs), ['sourceLesson', sourceLessonFile],
      ['sourceExercises', sourceExercisesFile], ['proseFreeze', freezeFile],
      ['science', scienceFile], ['inventory', inventoryFile],
    ].map(([key, file]) => [key, bind(file)])),
  }
  const result = invoke(`context-${id}`, python, ['-B', '-c', String.raw`
import json,sys
from pathlib import Path
sys.path.insert(0,'.agents/skills/ld-s10y-image/scripts')
import build_context
p=json.load(sys.stdin)
w,h=build_context.png_size(Path(p['source']['path']))
referencing=build_context.exercise_context(p['exercises']['exercises'],p['id'])
assert len(referencing)==1
print(json.dumps({
 'schema':'ld-s10y-image/context@1','book':'9p','edition':'modern-us-neutral','figure':p['id'],
 'contextKind':p['contextKind'],
 'sourceImage':dict(p['source'],width=w,height=h),
 'suggestedSize':build_context.suggested_size(w,h),
 'authoritativeRule':'Complete current bound text is authoritative; original pixels supply geometry. Complete worked solutions are retained as context, never used to calculate or label drawing geometry.',
 'lessons':[{'lesson':p['lesson']['id'],'title':p['lesson']['printed_title'],
   'prose':build_context.prose_context(p['lesson']['prose'],p['id']),
   'fullProse':p['lesson']['prose'],'fullProseText':p['fullProse'],
   'exercises':referencing,
   'fullReferencingExercises':[x for x in p['exercises']['exercises'] if p['id'] in x.get('figure_refs',[]) or p['id'] in [f.get('id') for f in x.get('figures',[])]]
 }],
 'fullSourceLesson':p['sourceLesson'],'fullSourceExercises':p['sourceExercises'],
 'bindings':p['bindings']
},ensure_ascii=False))
`], JSON.stringify(supplied))
  assert.equal(result.status, 0, result.stderr)
  const context = JSON.parse(result.stdout)
  assert.deepEqual([context.sourceImage.width, context.sourceImage.height], item.sourceDimensionsPx)
  write(path.join(own, id, 'context.json'), context)
}

function drawing(id, height, description) {
  const toUser = ([x, y]) => [x, height - y]
  const spec = {
    schema: 'ld-s10y-image/figure-spec@2', id, mode: 'deterministic', description,
    source: {
      image: { path: current(id).source.path, sha256: current(id).source.sha256 },
      authoritativeText: [
        { lesson: lesson.id, text: fullProse },
        ...referencing(exercises, id).map(item => ({ lesson: lesson.id, exercise: String(item.number), text: item.text })),
      ],
      inventory: [],
    },
    canvas: { width: 640, height, boundingBox: [0, height, 640, 0], background: 'paper' },
    display: { purpose: 'instructional', layout: 'inline', maxWidthPx: 640, widths: [640, 331, 342], minTextPx: 16 },
    objects: [], assertions: [], layout: { minLabelGap: 4 },
  }
  const geometry = { id, contextKind: contextKind(id), expectedLabels: [], wires: [], components: [], arrows: [], sourceRegions: {} }
  const point = (name, at, visible = false) => {
    spec.objects.push({ id: name, type: 'point', at: toUser(at), visible, size: 4, fill: 'ink', stroke: 'ink' })
    return name
  }
  const anchor = (name, value) => typeof value === 'string' ? value : point(name, value)
  const edge = (name, from, to, type = 'segment', conducting = false, style = {}) => {
    const a = anchor(`${name}-from`, from)
    const b = anchor(`${name}-to`, to)
    spec.objects.push({ id: name, type, from: a, to: b, stroke: 'ink', strokeWidth: 4, ...style })
    spec.assertions.push({ id: `${name}-connects`, type: 'connects', arrow: name, from: a, to: b })
    if (conducting) geometry.wires.push({ id: name, from: a, to: b })
    if (type === 'arrow') geometry.arrows.push({ id: name, from: a, to: b, conducting: false })
    return name
  }
  const wire = (name, from, to) => edge(name, from, to, 'segment', true)
  const label = (name, at, text) => {
    spec.objects.push({ id: name, type: 'text', at: toUser(at), text, fontSize: 32, fontWeight: 600, labelColor: 'ink', labelPlacement: { position: 'CENTER' } })
    geometry.expectedLabels.push(text)
    return name
  }
  const component = (name, left, right, symbol, bounds) => {
    geometry.components.push({ id: name, left, right, symbol })
    spec.assertions.push({
      id: `${name}-port-displacement`, type: 'displacement', from: left, to: right,
      dx: bounds ? bounds[2] - bounds[0] : 80, dy: 0,
    })
  }
  const rectangle = (name, bounds, leftName, rightName) => {
    const [x0, y0, x1, y1] = bounds
    const y = (y0 + y1) / 2
    const left = point(leftName, [x0, y])
    const right = point(rightName, [x1, y])
    spec.objects.push({ id: name, type: 'polygon', points: [[x0, y0], [x1, y0], [x1, y1], [x0, y1]].map(toUser), stroke: 'ink', strokeWidth: 4, fill: 'paper', fillOpacity: 0 })
    component(name, left, right, 'rectangle', bounds)
    for (const [port, x] of [[left, x0], [right, x1]]) {
      spec.assertions.push({ id: `${port}-on-symbol`, type: 'pointOnLine', point: port, a: toUser([x, y0]), b: toUser([x, y1]) })
    }
    return { left, right }
  }
  const meter = (name, center, radius) => {
    const centerName = point(`${name}-center`, center)
    const left = point(`${name}-left`, [center[0] - radius, center[1]])
    const right = point(`${name}-right`, [center[0] + radius, center[1]])
    spec.objects.push({ id: name, type: 'circle', center: centerName, radius, stroke: 'ink', strokeWidth: 4, fill: 'paper', fillOpacity: 0 })
    geometry.components.push({ id: name, left, right, symbol: 'circle' })
    for (const port of [left, right]) spec.assertions.push({ id: `${port}-on-symbol`, type: 'pointOnCircle', point: port, center: centerName, radius })
    return { left, right }
  }
  const span = (name, x0, x1, y) => {
    const mid = [(x0 + x1) / 2, y]
    edge(`${name}-left`, mid, [x0, y], 'arrow', false, { strokeWidth: 3 })
    edge(`${name}-right`, mid, [x1, y], 'arrow', false, { strokeWidth: 3 })
  }
  const group = (name, description, names, assertionNames = [], requires = []) => {
    spec.source.inventory.push({
      id: name, description, objects: names,
      assertions: assertionNames, ...(requires.length ? { requires } : {}),
    })
  }
  return { spec, geometry, toUser, point, edge, wire, label, rectangle, meter, span, group }
}

function figure177() {
  const d = drawing('fig-177', 480, 'Series voltmeter range-extension schematic: preserve blank circular meter, rectangular added resistor, two partial voltage spans, total voltage span and lower measured-voltage block. No numerical answer or meter reading. Uncalibrated source geometry regularized for readable English labels.')
  const { spec, geometry, point, edge, wire, label, rectangle, meter, span, group } = d
  point('left-top', [90, 100])
  point('right-top', [566, 100])
  point('left-junction', [90, 381], true)
  point('right-junction', [566, 381], true)
  point('intermediate', [318, 100])
  const circle = meter('meter', [222, 100], 40)
  const resistor = rectangle('series-resistor', [370, 87, 458, 113], 'series-left', 'series-right')
  const block = rectangle('measured-voltage-block', [145, 310, 500, 452], 'block-left', 'block-right')
  wire('left-outer-wire', 'left-top', 'left-junction')
  wire('right-outer-wire', 'right-top', 'right-junction')
  wire('meter-left-wire', 'left-top', circle.left)
  wire('meter-intermediate-wire', circle.right, 'intermediate')
  wire('intermediate-series-wire', 'intermediate', resistor.left)
  wire('series-right-wire', resistor.right, 'right-top')
  wire('left-terminal-lead', [15, 381], 'left-junction')
  wire('right-terminal-lead', 'right-junction', [625, 381])
  wire('block-left-wire', 'left-junction', block.left)
  wire('block-right-wire', block.right, 'right-junction')
  edge('partial-voltage-divider', 'intermediate', [318, 217], 'segment', false, { strokeWidth: 2 })
  span('meter-voltage-span', 90, 318, 200)
  span('series-voltage-span', 318, 566, 200)
  span('total-voltage-span', 90, 566, 275)
  label('meter-resistance-label', [300, 42], 'R_int')
  label('series-resistance-label', [414, 42], 'R_series')
  label('meter-voltage-label', [200, 161], 'V0')
  label('series-voltage-label', [442, 161], 'V_series')
  label('total-voltage-label', [328, 239], 'V')
  label('measured-voltage-label', [322, 381], 'Measured voltage')
  spec.assertions.push(
    { id: 'one-meter', type: 'objectCount', objectType: 'circle', count: 1 },
    { id: 'resistor-and-measured-block', type: 'objectCount', objectType: 'polygon', count: 2 },
    { id: 'six-voltage-arrowheads', type: 'objectCount', objectType: 'arrow', count: 6 },
    { id: 'outer-junction-alignment', type: 'displacement', from: 'left-junction', to: 'right-junction', dx: 476, dy: 0 },
  )
  group('source-series-apparatus', current(spec.id).facts[0],
    ['meter', 'series-resistor', 'meter-resistance-label', 'series-resistance-label'],
    ['one-meter', 'series-resistor-port-displacement', 'meter-left-on-symbol', 'meter-right-on-symbol', 'series-left-on-symbol', 'series-right-on-symbol'])
  group('source-outer-wires-and-measured-block', current(spec.id).facts[1],
    ['left-junction', 'right-junction', 'measured-voltage-block', 'measured-voltage-label', ...geometry.wires.map(item => item.id)],
    ['outer-junction-alignment', 'resistor-and-measured-block', 'measured-voltage-block-port-displacement', ...geometry.wires.map(item => `${item.id}-connects`)],
    ['pointRelationships'])
  group('source-partial-and-total-voltage-spans', current(spec.id).facts.slice(2, 5).join(' '),
    ['partial-voltage-divider', ...geometry.arrows.map(item => item.id), 'meter-voltage-label', 'series-voltage-label', 'total-voltage-label'],
    ['partial-voltage-divider-connects', 'six-voltage-arrowheads', ...geometry.arrows.map(item => `${item.id}-connects`)])
  geometry.sourceRegions = { meter: [177, 55, 267, 146], seriesResistor: [366, 83, 462, 117], measuredBlock: [140, 305, 505, 457], voltageSpans: [85, 192, 571, 282] }
  geometry.expectedComponentNets = {
    meter: ['left-junction', 'intermediate'],
    'series-resistor': ['intermediate', 'right-junction'],
    'measured-voltage-block': ['left-junction', 'right-junction'],
  }
  return d
}

function figure178() {
  const d = drawing('fig-178', 520, 'Parallel ammeter shunt schematic: one circle marked A, internal resistance R_a, one rectangular shunt, two junctions and all seven source current arrows. No calculated resistance or current values; normalized spacing is uncalibrated.')
  const { spec, geometry, point, edge, wire, label, rectangle, meter, group } = d
  point('left-junction', [145, 397], true)
  point('right-junction', [547, 397], true)
  point('left-top', [145, 100])
  point('right-top', [547, 100])
  const circle = meter('ammeter', [346, 100], 58)
  const shunt = rectangle('shunt-resistor', [260, 378, 425, 416], 'shunt-left', 'shunt-right')
  wire('upper-left-upright', 'left-junction', 'left-top')
  wire('upper-left-wire', 'left-top', circle.left)
  wire('upper-right-wire', circle.right, 'right-top')
  wire('upper-right-upright', 'right-top', 'right-junction')
  wire('input-lead', [20, 397], 'left-junction')
  wire('output-lead', 'right-junction', [620, 397])
  wire('shunt-left-wire', 'left-junction', shunt.left)
  wire('shunt-right-wire', shunt.right, 'right-junction')
  for (const [name, from, to] of [
    ['input-current', [30, 397], [92, 397]],
    ['output-current', [567, 397], [612, 397]],
    ['left-shunt-current', [180, 397], [225, 397]],
    ['right-shunt-current', [450, 397], [497, 397]],
    ['meter-up-current', [145, 306], [145, 228]],
    ['meter-left-current', [201, 100], [246, 100]],
    ['meter-right-current', [450, 100], [492, 100]],
  ]) edge(name, from, to, 'arrow')
  label('ammeter-marking', [346, 100], 'A')
  label('internal-resistance-label', [346, 194], 'R_a')
  label('shunt-resistance-label', [346, 337], 'R_shunt')
  label('meter-current-label', [194, 253], 'I0')
  label('shunt-current-label', [197, 466], 'I_shunt')
  label('input-current-label', [60, 450], 'I')
  label('output-current-label', [598, 450], 'I')
  spec.assertions.push(
    { id: 'one-ammeter', type: 'objectCount', objectType: 'circle', count: 1 },
    { id: 'one-shunt', type: 'objectCount', objectType: 'polygon', count: 1 },
    { id: 'seven-current-arrowheads', type: 'objectCount', objectType: 'arrow', count: 7 },
    { id: 'junction-alignment', type: 'displacement', from: 'left-junction', to: 'right-junction', dx: 402, dy: 0 },
  )
  group('source-parallel-apparatus', current(spec.id).facts.slice(0, 2).join(' '),
    ['left-junction', 'right-junction', 'ammeter', 'ammeter-marking', 'internal-resistance-label', 'shunt-resistor', 'shunt-resistance-label', ...geometry.wires.map(item => item.id)],
    ['one-ammeter', 'one-shunt', 'junction-alignment', 'shunt-resistor-port-displacement', 'ammeter-left-on-symbol', 'ammeter-right-on-symbol', ...geometry.wires.map(item => `${item.id}-connects`)],
    ['pointRelationships'])
  group('source-seven-current-arrows', current(spec.id).facts.slice(2).join(' '),
    [...geometry.arrows.map(item => item.id), 'meter-current-label', 'shunt-current-label', 'input-current-label', 'output-current-label'],
    ['seven-current-arrowheads', ...geometry.arrows.map(item => `${item.id}-connects`)])
  geometry.sourceRegions = { ammeter: [284, 38, 408, 162], shuntResistor: [255, 373, 430, 421], uprights: [139, 96, 553, 403], upperArrows: [198, 91, 500, 110] }
  geometry.expectedComponentNets = { ammeter: ['left-junction', 'right-junction'], 'shunt-resistor': ['left-junction', 'right-junction'] }
  return d
}

function figure179() {
  const d = drawing('fig-179', 360, 'Worked example3 source network: A--r1--B--r2--r3--C--D with r4 in the lower BC branch, four marked nodes, and a nonconducting outward-headed terminal-voltage span V. Geometry established from original179 and stem, not the calculated solution. No numerical answers or givens added.')
  const { spec, geometry, point, edge, wire, label, rectangle, span, group } = d
  for (const [name, at] of [['A', [40, 155]], ['B', [215, 155]], ['C', [551, 155]], ['D', [603, 155]]]) point(name, at, true)
  point('middle', [367, 155])
  point('lower-left', [215, 273])
  point('lower-right', [551, 273])
  const resistors = [
    rectangle('r1', [98, 143, 174, 167], 'r1-left', 'r1-right'),
    rectangle('r2', [251, 143, 331, 167], 'r2-left', 'r2-right'),
    rectangle('r3', [404, 143, 484, 167], 'r3-left', 'r3-right'),
    rectangle('r4', [404, 261, 484, 285], 'r4-left', 'r4-right'),
  ]
  wire('A-r1-wire', 'A', resistors[0].left)
  wire('r1-B-wire', resistors[0].right, 'B')
  wire('B-r2-wire', 'B', resistors[1].left)
  wire('r2-middle-wire', resistors[1].right, 'middle')
  wire('middle-r3-wire', 'middle', resistors[2].left)
  wire('r3-C-wire', resistors[2].right, 'C')
  wire('C-D-wire', 'C', 'D')
  wire('B-lower-wire', 'B', 'lower-left')
  wire('lower-r4-wire', 'lower-left', resistors[3].left)
  wire('r4-lower-wire', resistors[3].right, 'lower-right')
  wire('lower-C-wire', 'lower-right', 'C')
  edge('voltage-left-guide', 'A', [40, 45], 'segment', false, { strokeWidth: 2 })
  edge('voltage-right-guide', 'D', [603, 45], 'segment', false, { strokeWidth: 2 })
  span('terminal-voltage-span', 40, 603, 65)
  for (const [name, at] of [['A', [40, 194]], ['B', [215, 112]], ['C', [551, 112]], ['D', [603, 194]]]) label(`${name}-text`, at, name)
  for (const [name, at] of [['r1', [136, 207]], ['r2', [291, 207]], ['r3', [444, 207]], ['r4', [444, 320]]]) label(`${name}-text`, at, name)
  label('terminal-voltage-label', [322, 28], 'V')
  spec.assertions.push(
    { id: 'four-resistors', type: 'objectCount', objectType: 'polygon', count: 4 },
    { id: 'two-voltage-arrowheads', type: 'objectCount', objectType: 'arrow', count: 2 },
    { id: 'AB-order', type: 'displacement', from: 'A', to: 'B', dx: 175, dy: 0 },
    { id: 'BC-order', type: 'displacement', from: 'B', to: 'C', dx: 336, dy: 0 },
    { id: 'CD-wire-order', type: 'displacement', from: 'C', to: 'D', dx: 52, dy: 0 },
  )
  group('source-four-resistor-topology', current(spec.id).facts.slice(0, 2).join(' '),
    ['r1', 'r2', 'r3', 'r4', ...geometry.wires.map(item => item.id)],
    ['four-resistors', ...['r1', 'r2', 'r3', 'r4'].map(name => `${name}-port-displacement`), ...geometry.wires.map(item => `${item.id}-connects`)])
  group('source-marked-nodes-and-symbolic-labels', current(spec.id).facts[2],
    ['A', 'B', 'C', 'D', ...['A', 'B', 'C', 'D', 'r1', 'r2', 'r3', 'r4'].map(name => `${name}-text`)],
    ['AB-order', 'BC-order', 'CD-wire-order'], ['pointRelationships'])
  group('source-voltage-dimension-not-conducting-branch', current(spec.id).facts.slice(3).join(' '),
    ['voltage-left-guide', 'voltage-right-guide', 'terminal-voltage-span-left', 'terminal-voltage-span-right', 'terminal-voltage-label'],
    ['voltage-left-guide-connects', 'voltage-right-guide-connects', 'two-voltage-arrowheads', 'terminal-voltage-span-left-connects', 'terminal-voltage-span-right-connects'])
  geometry.sourceRegions = { r1: [94, 139, 178, 171], r2: [247, 139, 335, 171], r3: [400, 139, 488, 171], r4: [400, 257, 488, 289], lowerBranch: [211, 269, 555, 280], voltageSpan: [36, 55, 607, 74] }
  geometry.expectedComponentNets = { r1: ['A', 'B'], r2: ['B', 'middle'], r3: ['middle', 'C'], r4: ['B', 'C'] }
  geometry.geometryBasis = {
    sourcePixels: bind(path.resolve(repo, current(spec.id).source.path)),
    completeCurrentStem: referencing(exercises, spec.id)[0].text.split('解')[0],
    solutionUsedForGeometry: false, answerValuesAdded: false,
  }
  return d
}

function topologyAssertions(spec, geometry) {
  const parent = new Map(spec.objects.filter(item => item.type === 'point').map(item => [item.id, item.id]))
  const root = name => parent.get(name) === name ? name : root(parent.get(name))
  geometry.wires.forEach(wire => parent.set(root(wire.from), root(wire.to)))
  const actual = {}
  for (const component of geometry.components) {
    const expected = geometry.expectedComponentNets[component.id]
    assert.ok(expected)
    assert.equal(root(component.left), root(expected[0]))
    assert.equal(root(component.right), root(expected[1]))
    assert.notEqual(root(component.left), root(component.right))
    actual[component.id] = expected
  }
  if (spec.id === 'fig-179') {
    assert.equal(root('C'), root('D'))
    assert.notEqual(root('A'), root('B'))
    assert.notEqual(root('B'), root('C'))
    assert.notEqual(root('middle'), root('B'))
    assert.notEqual(root('middle'), root('C'))
    assert.equal(spec.objects.filter(item => item.type === 'point' && item.visible).length, 4)
  }
  return {
    status: 'pass', componentEndpointNets: actual,
    method: 'Contract only the declared conducting source wires; check every component port against its named net. Exclude all current arrows, voltage spans and dimension guides from conducting connectivity.',
  }
}

function prepare() {
  snapshotInputs()
  for (const id of ids) makeContext(id)
  for (const d of [figure177(), figure178(), figure179()]) {
    const out = attemptDir(d.spec.id)
    write(path.join(out, 'spec.json'), d.spec)
    write(path.join(out, 'geometry.json'), d.geometry)
    write(path.join(out, 'author-assertions.json'), {
      role: 'AUTHOR', status: 'pass', contextKind: contextKind(d.spec.id),
      sourcePixelInventory: bind(inventoryFile), spec: bind(path.join(out, 'spec.json')),
      topology: topologyAssertions(d.spec, d.geometry),
      exactSourceComponents: true, sourceArrowsPreserved: true, sourceDimensionsAreUncalibrated: true,
      labelAliases: current(d.spec.id).labelAliases,
      modernAdditions: current(d.spec.id).modernAdditions,
      noCalculatedAnswerAnnotations: true, noIndependentReview: true,
    })
  }
  write(path.join(own, 'preparation.json'), {
    role: 'AUTHOR', status: 'pass', count: 3, ids,
    sourceOpens: 3, renderedPreviewOpens: 0, priorSuccessfulGatesReplayed: false,
    nativeContextCalls: 3, specsDerivedAfterIndependentPixelInventory: true,
  })
}

function renderOne(id, attempt) {
  const out = attemptDir(id, attempt)
  assert.ok(!fs.existsSync(path.join(out, 'render.json')), 'Do not rerun an existing render gate')
  const result = invoke(`render-${id}-${attempt}`, process.execPath, [
    path.join(scripts, 'render_spec.mjs'), '--spec', path.join(out, 'spec.json'),
    '--svg', path.join(out, `${id}.svg`), '--png', path.join(out, `${id}.png`),
    '--report', path.join(out, 'render.json'),
  ])
  const report = fs.existsSync(path.join(out, 'render.json')) ? read(path.join(out, 'render.json')) : null
  write(path.join(out, 'native-gate-receipt.json'), {
    status: result.status === 0 && report?.status === 'pass' ? 'pass' : 'fail',
    draftValidation: 'Exactly one built-in draft validator invocation by unmodified render_spec.mjs; no separate replay of that successful gate.',
    renderCalls: 1, internalDraftValidationCalls: 1, externalDraftValidationCalls: 0,
    spec: bind(path.join(out, 'spec.json')),
    ...(report ? { render: bind(path.join(out, 'render.json')), svg: bind(path.join(out, `${id}.svg`)) } : {}),
    invocation: bind(path.join(own, 'invocations', `render-${id}-${attempt}.json`)),
    result: bind(path.join(own, 'invocations', `render-${id}-${attempt}.result.json`)),
  })
  console.log(JSON.stringify({ id, attempt, exitCode: result.status, status: report?.status || 'fail', collisions: report?.collisions }))
}

function freeze() {
  const previewObservationsFile = path.join(own, 'author-preview-observations.json')
  const observations = read(previewObservationsFile)
  assert.equal(observations.role, 'AUTHOR')
  assert.equal(observations.imageBudget.totalOpens, observations.imageOpenLog.length)
  assert.ok(observations.imageBudget.totalOpens <= 8)
  const selected = read(path.join(own, 'selected-attempts.json'))
  const entries = []
  for (const id of ids) {
    const attempt = selected[id]
    const out = attemptDir(id, attempt)
    const report = read(path.join(out, 'render.json'))
    const previews = read(path.join(out, 'width-previews.json'))
    const assertion = read(path.join(out, 'author-assertions.json'))
    assert.equal(report.status, 'pass')
    assert.equal(previews.status, 'pass')
    assert.equal(report.spec.sha256, hash(path.join(out, 'spec.json')))
    assert.equal(report.output.svg.sha256, hash(path.join(out, `${id}.svg`)))
    assert.equal(assertion.spec.sha256, hash(path.join(out, 'spec.json')))
    const observed = observations.figures.find(item => item.id === id)
    assert.equal(observed.status, 'pass')
    assert.equal(observed.preview.sha256, hash(path.join(out, 'width-331.png')))
    entries.push({
      id, attempt, status: 'author-pass-awaiting-independent-review', contextKind: contextKind(id),
      source: bind(path.resolve(repo, current(id).source.path)),
      context: bind(path.join(own, id, 'context.json')),
      lesson: bind(inputs.lessonTemplate), exercises: bind(inputs.exercisesTemplate), manifest: bind(inputs.figuresTemplate),
      spec: bind(path.join(out, 'spec.json')), render: bind(path.join(out, 'render.json')),
      svg: bind(path.join(out, `${id}.svg`)), nativeCanvasPreview: bind(path.join(out, `${id}.png`)),
      nativeGate: bind(path.join(out, 'native-gate-receipt.json')),
      sourceInventory: bind(inventoryFile), authorAssertions: bind(path.join(out, 'author-assertions.json')),
      geometry: bind(path.join(out, 'geometry.json')),
      previewEvidence: bind(path.join(out, 'width-previews.json')),
      actualWidthPreviews: previews.checks.map(check => ({ widthPx: check.widthPx, ...check.preview, minTextPx: check.metrics.minTextPx, status: check.status })),
      completeReferringExerciseRetained: true, sourceStemNotCalculatedAnswerUsedForGeometry: true,
      initial: fs.readdirSync(attemptDir(id)).sort().map(name => bind(path.join(attemptDir(id), name))),
    })
  }
  const invocations = fs.readdirSync(path.join(own, 'invocations')).filter(name => !name.endsWith('.result.json'))
  const nativeRenderCalls = invocations.filter(name => name.startsWith('render-')).length
  const repairs = Object.values(selected).filter(attempt => attempt !== 'initial').length
  assert.ok(repairs <= 1)
  const snapshot = read(path.join(own, 'input-bindings.json'))
  const retainedFiles = []
  const walk = directory => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name)
      if (entry.isDirectory()) walk(file)
      else retainedFiles.push(bind(file))
    }
  }
  walk(own)
  const output = path.join(ticket, 'd024-n94-figures-author-freeze.json')
  write(output, {
    schema: 'STEMROBIN-181/modern-figures-author-freeze@1', ticket: 'STEMROBIN-181', batch: 'D024',
    date: '2026-11-16', role: 'AUTHOR', lesson: lesson.id,
    status: 'author-pass-frozen-awaiting-independent-review', count: 3, figures: entries,
    currentBindings: {
      proseFreeze: bind(freezeFile), scienceReview: bind(scienceFile),
      lesson: bind(inputs.lessonTemplate), exercises: bind(inputs.exercisesTemplate), manifest: bind(inputs.figuresTemplate),
      sourceLesson: bind(sourceLessonFile), sourceExercises: bind(sourceExercisesFile),
      sourceInventory: bind(inventoryFile), authorPreviewObservations: bind(previewObservationsFile),
      retainedInitialInputs: bind(path.join(own, 'input-bindings.json')),
      nativeTools: snapshot.snapshots.filter(item => item.original.path.startsWith(scripts) || item.original.path.includes('figure-spec.schema')).map(item => item.original),
      authorTools: ['author.mjs', 'previews.mjs'].map(name => bind(path.join(own, name))),
      runtime: snapshot.runtime,
    },
    counts: {
      authoredFigures: 3, nativeContexts: 3, initialNativeRenders: 3,
      totalNativeRenderCalls: nativeRenderCalls, internalDraftValidationCalls: nativeRenderCalls,
      externalDraftValidationCalls: 0, actualWidthPreviewScreenshots: entries.reduce((sum, entry) => sum + entry.actualWidthPreviews.length, 0),
      ...observations.imageBudget, affectedRepairs: repairs, independentReviews: 0,
      reviewRecords: 0, promotions: 0, acceptanceRuns: 0, databaseWrites: 0, sourceOrTemplateWrites: 0,
    },
    preservation: {
      allInitialBytesRetained: true, initialFailuresRetained: true,
      successfulNativeGatesNotRerun: true, generatedNativeToolsUnchanged: true,
      outputScope: [own, output], noPublicationOrIndependentApproval: true,
    },
    retainedFiles,
  })
  console.log(JSON.stringify({ freeze: output, sha256: hash(output), count: 3, status: 'AUTHOR_PASS', imageOpens: observations.imageBudget.totalOpens, repairs }))
}

checkInputs()
const phase = process.argv[2]
if (phase === 'prepare') prepare()
else if (phase === 'render') {
  const id = process.argv[3]
  assert.ok(ids.includes(id))
  renderOne(id, process.argv[4] || 'initial')
} else if (phase === 'freeze') freeze()
else throw new Error('Use prepare, render <id> [initial|repair], or freeze')
