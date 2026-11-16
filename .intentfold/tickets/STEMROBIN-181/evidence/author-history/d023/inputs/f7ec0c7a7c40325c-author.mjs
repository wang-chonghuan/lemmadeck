import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const out = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const repo = path.resolve(out, '../../../../..')
const local = (...parts) => path.join(out, ...parts)
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const binding = file => ({ path: file, sha256: sha(file) })
const write = (file, data) => {
  assert.ok(file.startsWith(`${out}/`))
  fs.mkdirSync(path.dirname(file), { recursive: true })
  assert.ok(!fs.existsSync(file), `refusing to overwrite ${file}`)
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`)
}
const lessonPath = path.join(repo, '.tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons/phy9-c2-s3-n92/lesson.template.json')
const exercisesPath = path.join(path.dirname(lessonPath), 'exercises.template.json')
const sciencePath = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/9p-n92-science-effective-review.json')
const correctionPath = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/9p-n92-prose-correction-freeze.json')
const sourcePath = path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts/9p/figures/fig-172.png')
const native = path.join(repo, '.agents/skills/ld-s10y-image/scripts')
const python = path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python')
const lesson = read(lessonPath)
const exercises = read(exercisesPath)
const science = read(sciencePath)
const correction = read(correctionPath)
assert.equal(sha(sciencePath), 'dd8ee4ca44944096803e2650424160076fa6bfa2a8eeff6f4733d68ffee150f0')
assert.equal(sha(correctionPath), '6aafb2f19b3dc708a2ea6f332aa48b626013eb31e1faa0b75935bce2c86674f3')
assert.equal(science.status, 'pass')
assert.equal(sha(lessonPath), science.bindings.lessonTemplate.sha256)
assert.equal(sha(lessonPath), correction.bindings.lessonTemplate.sha256)
assert.equal(sha(exercisesPath), science.bindings.exercisesTemplate.sha256)
assert.equal(lesson.id, 'phy9-c2-s3-n92')
assert.equal(lesson.exercise_count, 0)
assert.equal(exercises.count, 0)
assert.deepEqual(exercises.exercises, [])
assert.equal(lesson.prose.length, 10)
assert.deepEqual(lesson.prose.map(block => block.kind), ['p', 'p', 'p', 'fig', 'cap', 'p', 'p', 'p', 'p', 'p'])
const fullText = [lesson.printed_title, ...lesson.prose.map(block => block.text).filter(Boolean)].join('\n\n')
const authority = [{ lesson: lesson.id, text: fullText }]
const inputBindings = {
  lesson: binding(lessonPath),
  exercises: binding(exercisesPath),
  science: binding(sciencePath),
  correctedFreeze: binding(correctionPath),
  source: binding(sourcePath),
}
write(local('context/input-bindings.json'), inputBindings)
write(local('context/lesson.template.json'), lesson)
write(local('context/exercises.template.json'), exercises)
write(local('context/science-effective-review.json'), science)
write(local('context/prose-correction-freeze.json'), correction)

const commands = []
function run(id, executable, args) {
  const start = new Date().toISOString()
  const env = { ...process.env, PLAYWRIGHT_HTML_OPEN: 'never', PYTHONDONTWRITEBYTECODE: '1' }
  delete env.PWDEBUG
  const result = spawnSync(executable, args, { cwd: repo, env, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 })
  const entry = {
    id, executable, args, cwd: repo, started: start, ended: new Date().toISOString(),
    environment: { PWDEBUG: 'unset', PLAYWRIGHT_HTML_OPEN: 'never', PYTHONDONTWRITEBYTECODE: '1' },
    exitCode: result.status, signal: result.signal, error: result.error?.message ?? null,
    stdout: result.stdout ?? '', stderr: result.stderr ?? '',
  }
  write(local('commands', `${id}.json`), entry)
  commands.push(binding(local('commands', `${id}.json`)))
  return entry
}
assert.equal(run('source-measurement', python, [local('commands/measure-source.py')]).exitCode, 0)
const measurements = read(local('inventory/source-pixel-measurements.json'))
assert.equal(measurements.source.sha256, sha(sourcePath))
assert.deepEqual(measurements.source.size, [601, 348])
assert.equal(measurements.measuredUpperTrace.length, 248)
assert.deepEqual(measurements.measuredUpperTrace[0], [208, 211])
assert.deepEqual(measurements.measuredUpperTrace.at(-1), [455, 37])

const stagedRoot = local('context/native-input')
const stagedBook = path.join(stagedRoot, '9p')
const stagedLesson = path.join(stagedBook, 'editions/modern-us-neutral/lessons', lesson.id)
write(path.join(stagedLesson, 'lesson.json'), lesson)
write(path.join(stagedLesson, 'exercises.json'), exercises)
fs.mkdirSync(path.join(stagedBook, 'figures'), { recursive: true })
fs.copyFileSync(sourcePath, path.join(stagedBook, 'figures/fig-172.png'), fs.constants.COPYFILE_EXCL)
const contextRun = run('native-buildcontext-initial', python, [
  path.join(native, 'build_context.py'), '--book', '9p', '--edition', 'modern-us-neutral',
  '--figure', 'fig-172', '--root', stagedRoot, '--output', local('context/native-context-initial.json'),
])
assert.equal(contextRun.exitCode, 0)
const nativeContext = read(local('context/native-context-initial.json'))
assert.equal(nativeContext.lessons.length, 1)
assert.equal(nativeContext.lessons[0].lesson, lesson.id)
assert.equal(nativeContext.lessons[0].title, lesson.printed_title)
write(local('context/context.json'), {
  ...nativeContext,
  sourceImage: { ...nativeContext.sourceImage, ...inputBindings.source },
  authoritativeText: authority,
  completeLesson: lesson,
  bindings: inputBindings,
  lessons: [{
    ...nativeContext.lessons[0],
    printed_title: lesson.printed_title,
    fullProse: lesson.prose,
    authoritativeText: fullText,
    exercises: [],
  }],
  canonicalAuthority: '[lesson.printed_title, ...lesson.prose.map(block => block.text).filter(Boolean)].join("\\n\\n")',
  limits: 'Native nearby context is preserved separately; complete corrected current prose/caption/title is authoritative. No answer key or source lesson replay.',
})

const sourceGeometry = {
  frame: { origin: [57, 286], horizontalEnd: [569, 282], verticalEnd: [57, 14] },
  ticks: [{ value: 1, x: 93 }, { value: 2, x: 128 }, { value: 3, x: 162 }, { value: 4, x: 195 }, { value: 5, x: 231 }],
  zeroBranch: [[57, 286], [201, 286]],
  transition: [[201, 286], [201, 211]],
  shoulder: [[201, 211], [208, 211]],
  upperTrace: measurements.measuredUpperTrace,
}
const descriptions = {
  frame: 'One shared unboxed Cartesian frame. Positive horizontal arrow at source right and positive vertical arrow at source top. No negative signs, no grid, no subpanels.',
  ticks: 'Exactly five downward temperature ticks labelled 1, 2, 3, 4, 5; raster centers x=93,128,162,195,231. Retain these positions, not an invented uniform grid.',
  labels: 'Vertical Greek rho, an origin 0, and horizontal T with historical degree-K notation; there are no numbered rho ticks and no vertical unit. Modern label T (K) removes obsolete degree notation without changing Kelvin.',
  zero: 'Visible zero-rho branch coincides with the horizontal baseline up to the abrupt transition. Its left end is the visible axis-origin clipping boundary, not a measured lower temperature cutoff. No marker or temperature numeral is added there.',
  transition: 'The narrow nearly vertical ink stripe occupies x=198..203 continuously through the baseline; representative centerline x=201 runs from y=286 to the adjoining upper shoulder y=211. It is just to the right of tick 4, before tick 5. These are raster locations, not inferred rho numbers or an exact calibrated transition temperature.',
  trace: 'Solid upper branch rises to the right with increasing slope. Every integer source column 208..455 is measured as the midpoint of its contiguous ink run. First center is (208,211); terminal nonempty column is (455,37), with x=456 and x=457 empty. No extrapolation, fitted physical function, marked samples, rho values or upper endpoint temperature is added.',
  historical: 'The full current text explicitly attributes 4.1 K to the original historical mercury report; it does not define a universal critical temperature. The figure does not add a 4.1 tick or modern numerical correction.',
}
const objects = []
const assertions = []
const groupObjects = { frame: [], ticks: [], labels: [], zero: [], transition: [], trace: [] }
const groupAssertions = { frame: [], ticks: [], labels: [], zero: [], transition: [], trace: [] }
const toUser = ([x, y]) => [x + 23, 480 - (y + 104)]
const line = (id, from, to, group, stroke = 'ink', strokeWidth = 3, type = 'segment') => {
  const a = toUser(from)
  const b = toUser(to)
  objects.push({ id, type, from: a, to: b, stroke, strokeWidth })
  groupObjects[group].push(id)
  for (const check of [
    { id: `${id}-connects`, type: 'connects', arrow: id, from: a, to: b },
    { id: `${id}-displacement`, type: 'displacement', from: a, to: b, dx: b[0] - a[0], dy: b[1] - a[1], tolerance: 1e-9 },
  ]) {
    assertions.push(check)
    groupAssertions[group].push(check.id)
  }
}
const text = (id, at, value, group, color = 'ink') => {
  objects.push({
    id, type: 'text', at: toUser(at), text: value, fontSize: 32, fontWeight: 500,
    labelColor: color, labelPlacement: { position: 'CENTER' },
  })
  groupObjects[group].push(id)
}
line('source-temperature-axis', [57, 286], [569, 286], 'frame', 'ink', 3, 'arrow')
line('source-rho-axis', [57, 286], [57, 14], 'frame', 'ink', 3, 'arrow')
assertions.push({
  id: 'source-axes-perpendicular', type: 'perpendicular',
  a: toUser([57, 286]), b: toUser([569, 286]),
  c: toUser([57, 286]), d: toUser([57, 14]),
})
groupAssertions.frame.push('source-axes-perpendicular')
for (const { value, x } of sourceGeometry.ticks) {
  line(`source-tick-${value}`, [x, 286], [x, 299], 'ticks')
  text(`source-tick-${value}-value`, [x, 321], String(value), 'ticks')
}
text('source-rho-label', [15, 51], '\u03c1', 'labels')
text('source-origin-zero', [22, 286], '0', 'labels')
text('source-temperature-label', [531, 336], 'T (K)', 'labels')
line('source-zero-branch', ...sourceGeometry.zeroBranch, 'zero', 'accent', 5)
line('source-sharp-transition', ...sourceGeometry.transition, 'transition', 'accent', 5)
line('source-shoulder', ...sourceGeometry.shoulder, 'trace', 'accent', 5)
for (let index = 1; index < sourceGeometry.upperTrace.length; index++) {
  line(`source-trace-column-${sourceGeometry.upperTrace[index][0]}`,
    sourceGeometry.upperTrace[index - 1], sourceGeometry.upperTrace[index], 'trace', 'accent', 5)
}
text('modern-historical-scope', [297, -59], 'Mercury (original report)', 'labels', 'muted')
assertions.push({ id: 'source-exact-five-ticks', type: 'objectCount', objectType: 'segment', count: 255 })
groupAssertions.ticks.push('source-exact-five-ticks')
assertions.push({ id: 'source-label-count', type: 'objectCount', objectType: 'text', count: 9 })
groupAssertions.labels.push('source-label-count')

const inventory = Object.entries(groupObjects).map(([id, ids]) => ({
  id: `source-${id}`,
  description: descriptions[id === 'frame' ? 'frame' : id === 'ticks' ? 'ticks' : id === 'labels' ? 'labels' : id === 'zero' ? 'zero' : id === 'transition' ? 'transition' : 'trace'],
  objects: ids,
  assertions: groupAssertions[id],
}))
const sourceInventory = {
  schema: 'd023-n92/source-inventory@1',
  originalOpened: { count: 1, detail: 'original', beforeDrawing: true, source: inputBindings.source },
  sourceGeometry,
  observedFacts: descriptions,
  pixelMeasurement: binding(local('inventory/source-pixel-measurements.json')),
  mappings: inventory,
  modernAdditions: [
    'Translation only: source x + 23 and source screen y + 104; top/bottom white margins are enlarged for 32px labels.',
    'Source baseline scanner skew (about y286 left to y282 right) is leveled to y286, and its vertical axis is straightened; tick x centers and upper-curve coordinates are not rescaled or regularized.',
    'Variable strokes are normalized to semantic ink axes and semantic accent data trace. Labels are typeset rather than copied raster handwriting.',
    'T (K) is the modern notation for the source Kelvin axis. Mercury (original report) is a text-bound provenance qualifier, not an additional source label.',
    'The zero branch and narrow transition use explicit representative centerlines within source ink. Their pixel coordinates are not a new physical calibration.',
  ],
  prohibitedInferencesAbsent: [
    'No vertical resistance/resistivity numerical values or unit.',
    'No low-temperature cutoff, labelled zero-branch endpoint, or added 4.1 tick.',
    'No extrapolated high-temperature endpoint, universal critical temperature, grid, or answer annotation.',
  ],
  executableContentChecks: 'commands/source-content-checks.json, produced from this inventoried geometry before native render; native connects and displacement IDs bind every segment.',
}
write(local('inventory/inventory.json'), sourceInventory)
const spec = {
  schema: 'ld-s10y-image/figure-spec@2', id: 'fig-172', mode: 'deterministic',
  description: 'Read the abrupt source-reported mercury transition in a rho-versus-temperature graph; retain the unnumbered vertical scale and measured source trace without extrapolation or a fabricated low-temperature cutoff.',
  source: { image: inputBindings.source, authoritativeText: authority, inventory },
  canvas: { width: 640, height: 480, boundingBox: [0, 480, 640, 0], background: 'paper', keepAspectRatio: true },
  display: { layout: 'inline', purpose: 'instructional', maxWidthPx: 640, widths: [640, 331, 342], minTextPx: 16 },
  objects, assertions, layout: { minLabelGap: 4 },
}
write(local('spec/initial.json'), spec)
const contentChecks = []
const check = (id, fn) => { fn(); contentChecks.push({ id, status: 'pass' }) }
const byId = new Map(objects.map(object => [object.id, object]))
check('CONTENT-authority-full-current-canonical', () => assert.deepEqual(spec.source.authoritativeText, authority))
check('CONTENT-source-axis-directions', () => {
  assert.deepEqual(byId.get('source-temperature-axis').from, toUser([57, 286]))
  assert.deepEqual(byId.get('source-temperature-axis').to, toUser([569, 286]))
  assert.deepEqual(byId.get('source-rho-axis').to, toUser([57, 14]))
})
check('CONTENT-exact-five-tick-values-and-positions', () => {
  const ticks = objects.filter(object => /^source-tick-\d+$/.test(object.id))
  assert.equal(ticks.length, 5)
  for (const { value, x } of sourceGeometry.ticks) {
    assert.deepEqual(byId.get(`source-tick-${value}`).from, toUser([x, 286]))
    assert.equal(byId.get(`source-tick-${value}-value`).text, String(value))
  }
})
check('CONTENT-signs-symbols-and-units', () => {
  assert.equal(byId.get('source-rho-label').text, '\u03c1')
  assert.equal(byId.get('source-origin-zero').text, '0')
  assert.equal(byId.get('source-temperature-label').text, 'T (K)')
  assert.deepEqual(objects.filter(object => object.type === 'text').map(object => object.text),
    ['1', '2', '3', '4', '5', '\u03c1', '0', 'T (K)', 'Mercury (original report)'])
})
check('CONTENT-zero-branch-not-invented-cutoff', () => {
  assert.deepEqual(byId.get('source-zero-branch').from, toUser(sourceGeometry.frame.origin))
  assert.deepEqual(byId.get('source-zero-branch').to, byId.get('source-sharp-transition').from)
  assert.ok(!objects.some(object => object.type === 'point'))
})
check('CONTENT-sharp-transition-between-ticks-four-and-five', () => {
  const edge = byId.get('source-sharp-transition')
  assert.equal(edge.from[0], edge.to[0])
  assert.ok(edge.from[0] > byId.get('source-tick-4').from[0])
  assert.ok(edge.from[0] < byId.get('source-tick-5').from[0])
  assert.deepEqual(edge.to, byId.get('source-shoulder').from)
})
check('CONTENT-every-measured-column-no-fit-no-extrapolation', () => {
  assert.equal(objects.filter(object => object.id.startsWith('source-trace-column-')).length, 247)
  for (let index = 1; index < measurements.measuredUpperTrace.length; index++) {
    const edge = byId.get(`source-trace-column-${measurements.measuredUpperTrace[index][0]}`)
    assert.deepEqual(edge.from, toUser(measurements.measuredUpperTrace[index - 1]))
    assert.deepEqual(edge.to, toUser(measurements.measuredUpperTrace[index]))
  }
  assert.deepEqual(byId.get('source-trace-column-455').to, toUser([455, 37]))
  assert.deepEqual(measurements.diagnostics.upperEndpointColumns['456'], [])
  assert.ok(!byId.has('source-trace-column-456'))
})
check('CONTENT-historical-provenance-not-universal-temperature', () => {
  assert.ok(lesson.prose[0].text.includes('原书记述的转变温度为$4.1\\mathrm{K}$'))
  assert.ok(lesson.prose[1].text.includes('不是所有超导材料的共同上限'))
  assert.ok(!objects.some(object => String(object.text).includes('4.1')))
})
check('CONTENT-all-source-groups-have-executable-bindings', () => {
  for (const group of inventory) {
    assert.ok(group.objects.length)
    assert.ok(group.assertions.length)
    for (const id of group.objects) assert.ok(byId.has(id))
    for (const id of group.assertions) assert.ok(assertions.some(item => item.id === id))
  }
})
write(local('commands/source-content-checks.json'), {
  status: 'pass', spec: binding(local('spec/initial.json')), inventory: binding(local('inventory/inventory.json')),
  checks: contentChecks, limits: 'Author source-content assertions, not independent visual review or science re-review.',
})
const validation = run('native-validate-initial', python, [
  path.join(native, 'validate_spec.py'), local('spec/initial.json'), '--stage', 'draft', '--json',
])
const rendering = run('native-render-initial', process.execPath, [
  path.join(native, 'render_spec.mjs'), '--spec', local('spec/initial.json'),
  '--svg', local('svg/initial.svg'), '--report', local('render/initial.json'),
])
write(local('commands/initial-summary.json'), {
  inputBindings, commands,
  nativeCounts: { buildcontext: 1, validateExplicit: 1, validateRendererInternal: 1, render: 1 },
  targetedRepairs: 0,
  validationExit: validation.exitCode,
  renderExit: rendering.exitCode,
  status: validation.exitCode === 0 && rendering.exitCode === 0 ? 'pass' : 'fail',
})
console.log(JSON.stringify({
  out, validationExit: validation.exitCode, renderExit: rendering.exitCode,
  render: fs.existsSync(local('render/initial.json')) ? read(local('render/initial.json')) : rendering.stderr,
}, null, 2))
