import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const work = '.tmp/STEMROBIN-181/9p-d020-n72-figures'
const ticket = '.intentfold/tickets/STEMROBIN-181/tmp'
const lessonId = 'phy9-c2-s2-n72'
const templateRoot = `.tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons/${lessonId}`
const template = `${templateRoot}/lesson.template.json`
const proseFreeze = `${ticket}/9p-n72-prose-freeze.json`
const science = `${ticket}/9p-n72-science-review.json`
const raw = `ssot-resources/soviet10year-textbooks/artifacts/9p/lessons/${lessonId}/lesson.json`
const ids = ['fig-134', 'fig-135', 'fig-136', 'fig-137']
const renderer = '.agents/skills/ld-s10y-image/scripts/render_spec.mjs'
const validator = '.agents/skills/ld-s10y-image/scripts/validate_spec.py'
const python = '.claude/skills/ld-s10y-lesson/.venv/bin/python'
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: file, sha256: sha(file) })
const load = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const verify = binding => assert.equal(sha(binding.path), binding.sha256, binding.path)
const writeNew = (file, data) => {
  assert(!fs.existsSync(file), `Preserve existing artifact: ${file}`)
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`)
}
const snapshot = (file, destination) => {
  assert(!fs.existsSync(destination))
  fs.mkdirSync(path.dirname(destination), { recursive: true })
  fs.copyFileSync(file, destination)
  assert.equal(sha(file), sha(destination))
  return bind(destination)
}
const xy = (spec, x, screenY) => [x, spec.canvas.height - screenY]
const assertion = (spec, id, type, fields) => spec.assertions.push({ id, type, ...fields })
const text = (spec, id, x, y, value, fontSize = 36) => spec.objects.push({
  id, type: 'text', at: xy(spec, x, y), text: value, fontSize, fontWeight: 600,
  labelColor: 'ink', labelPlacement: { position: 'CENTER', gap: 0 },
})
const segment = (spec, id, from, to, strokeWidth = 3, extras = {}) => {
  spec.objects.push({ id, type: 'segment', from, to, stroke: 'ink', strokeWidth, ...extras })
  assertion(spec, `${id}-endpoints`, 'connects', { arrow: id, from, to })
}
const arrow = (spec, id, from, to, extras = {}) => {
  spec.objects.push({ id, type: 'arrow', from, to, stroke: 'ink', strokeWidth: 3.4, ...extras })
  assertion(spec, `${id}-endpoints`, 'connects', { arrow: id, from, to })
  assertion(spec, `${id}-directed-displacement`, 'displacement', {
    from, to, dx: to[0] - from[0], dy: to[1] - from[1],
  })
}
const point = (spec, id, x, y) => spec.objects.push({
  id, type: 'point', at: xy(spec, x, y), size: 7, stroke: 'ink', strokeWidth: 2,
  fill: 'paper',
})
const rectangle = (spec, id, screen, strokeWidth = 2) => {
  const [left, top, right, bottom] = screen
  spec.objects.push({
    id, type: 'polygon',
    points: [[left, top], [right, top], [right, bottom], [left, bottom]].map(([x, y]) => xy(spec, x, y)),
    stroke: 'ink', strokeWidth, fill: 'paper', fillOpacity: 0,
  })
}
const mapInventory = (spec, description, requirePoints = false) => spec.source.inventory.push({
  id: `${spec.id}-complete-source-inventory`, description,
  ...(requirePoints ? { requires: ['pointRelationships'] } : {}),
  objects: spec.objects.map(object => object.id),
  assertions: spec.assertions.map(item => item.id),
})

function base(id, height, context) {
  return {
    schema: 'ld-s10y-image/figure-spec@2', id, mode: 'deterministic', description: '',
    source: {
      image: context.sourceInventory.figures.find(figure => figure.id === id).source,
      authoritativeText: context.authoritativeText, inventory: [],
    },
    canvas: { width: 640, height, boundingBox: [0, height, 640, 0], background: 'paper', keepAspectRatio: true },
    display: { purpose: 'instructional', layout: 'inline', widths: [640, 331, 342], minTextPx: 16 },
    objects: [], assertions: [],
  }
}

function figure134(context) {
  const spec = base('fig-134', 1900, context)
  spec.description = 'Two source panels a/b show respectively varied unpolarized dipoles and a thermal orientational bias, not complete alignment. Each preserves13 connected plus/minus pairs, two plates/leads, a dielectric boundary and a hatched sampling region. Panel a has no external signs; panel b has plus at left and minus at right. Vertically stacked panels are readable layout only, not a changed physical arrangement or extra particle motion.'
  const inventory = context.sourceInventory.figures.find(figure => figure.id === spec.id)
  const geometry = []
  for (const panel of inventory.panels) {
    const sourceLeft = panel.dielectricScreen[0]
    const top = panel.id === 'a' ? 80 : 1000
    const transform = ([x, y]) => [130 + (x - sourceLeft) * 1.8, top + (y - 38) * 1.8]
    const at = sourcePoint => xy(spec, ...transform(sourcePoint))
    const region = sourceBox => {
      const start = transform(sourceBox.slice(0, 2))
      const end = transform(sourceBox.slice(2))
      return [...start, ...end]
    }
    const dielectric = region(panel.dielectricScreen)
    const sampling = region(panel.samplingScreen)
    rectangle(spec, `${panel.id}-dielectric`, dielectric)
    rectangle(spec, `${panel.id}-sampling`, sampling, 1.3)
    const [left, upper, right, lower] = sampling
    let hatchCount = 0
    for (let offset = -1 * (lower - upper) + 20; offset < right - left; offset += 20) {
      const x1 = Math.max(left, left + offset)
      const x2 = Math.min(right, left + offset + lower - upper)
      const y1 = upper + x1 - left - offset
      const y2 = upper + x2 - left - offset
      if (x2 > x1) segment(spec, `${panel.id}-sampling-hatch-${++hatchCount}`, xy(spec, x1, y1), xy(spec, x2, y2), 1, { stroke: 'muted' })
    }
    const [plateLeft, plateRight, plateTop, plateBottom] = panel.platesScreen
    const plateStart = at([plateLeft, plateTop])
    const plateEnd = at([plateLeft, plateBottom])
    segment(spec, `${panel.id}-left-plate`, plateStart, plateEnd, 6)
    segment(spec, `${panel.id}-right-plate`, at([plateRight, plateTop]), at([plateRight, plateBottom]), 6)
    assertion(spec, `${panel.id}-parallel-plates`, 'parallel', {
      a: plateStart, b: plateEnd, c: at([plateRight, plateTop]), d: at([plateRight, plateBottom]),
    })
    segment(spec, `${panel.id}-left-terminal`, at([plateLeft - 24, panel.terminalLeadScreenY]), at([plateLeft, panel.terminalLeadScreenY]))
    segment(spec, `${panel.id}-right-terminal`, at([plateRight, panel.terminalLeadScreenY]), at([plateRight + 24, panel.terminalLeadScreenY]))
    const pairGeometry = []
    const samplingCenters = { negative: 0, positive: 0 }
    const sourceInsideSample = ([x, y]) => x > panel.samplingScreen[0] && x < panel.samplingScreen[2] && y > panel.samplingScreen[1] && y < panel.samplingScreen[3]
    for (const [index, pair] of panel.negativeToPositiveCenters.entries()) {
      const id = `${panel.id}-dipole-${index + 1}`
      const [negative, positive] = pair.map(at)
      segment(spec, `${id}-connector`, negative, positive, 2.2)
      assertion(spec, `${id}-negative-to-positive`, 'displacement', {
        from: negative, to: positive, dx: positive[0] - negative[0], dy: positive[1] - negative[1],
      })
      for (const [chargeIndex, [polarity, center, sign]] of [
        ['negative', negative, '\u2212'], ['positive', positive, '+'],
      ].entries()) {
        spec.objects.push({ id: `${id}-${polarity}`, type: 'circle', center, radius: 22, stroke: 'ink', strokeWidth: 2.2, fill: 'paper', fillOpacity: 1 })
        text(spec, `${id}-${polarity}-sign`, center[0], spec.canvas.height - center[1], sign, 32)
        assertion(spec, `${id}-${polarity}-in-dielectric`, 'inside', { point: center, container: `${panel.id}-dielectric` })
        assertion(spec, `${id}-${polarity}-sign-in-dielectric`, 'inside', { point: `${id}-${polarity}-sign`, container: `${panel.id}-dielectric` })
        if (sourceInsideSample(pair[chargeIndex])) samplingCenters[polarity]++
      }
      pairGeometry.push({
        id, sourceNegativeToPositive: pair, negative, positive,
        dx: positive[0] - negative[0], dy: positive[1] - negative[1],
        samplingMembership: pair.map(sourceInsideSample),
        objects: [`${id}-connector`, `${id}-negative`, `${id}-negative-sign`, `${id}-positive`, `${id}-positive-sign`],
        relationshipAssertions: [`${id}-connector-endpoints`, `${id}-negative-to-positive`],
      })
    }
    assert.equal(pairGeometry.length, 13)
    assert.deepEqual(samplingCenters, panel.samplingCenters)
    if (panel.id === 'b') {
      text(spec, 'b-left-positive-plate-sign', ...transform(panel.externalSignCentersScreen[0]), '+')
      text(spec, 'b-right-negative-plate-sign', ...transform(panel.externalSignCentersScreen[1]), '\u2212')
      assert(pairGeometry.every(pair => pair.dx > 0))
      assert(new Set(pairGeometry.map(pair => Math.round(pair.dy / pair.dx * 100))).size > 1)
    }
    text(spec, `${panel.id}-panel-label`, 320, top + 825, panel.id)
    geometry.push({ panel: panel.id, isotropicScale: 1.8, sourceOrigin: [sourceLeft, 38], modernOrigin: [130, top], dipolePairs: pairGeometry, samplingCenters, hatchCount, hatchCountIsLayoutNotSourceFact: true })
  }
  assert.equal(spec.objects.filter(object => object.type === 'circle').length, 52)
  assert.equal(spec.objects.filter(object => object.type === 'arrow').length, 0)
  assertion(spec, 'all-52-circled-charges', 'objectCount', { objectType: 'circle', count: 52 })
  assertion(spec, 'no-invented-field-or-transport-arrows', 'objectCount', { objectType: 'arrow', count: 0 })
  mapInventory(spec, 'Actual source134 contains two panels with13 dipoles/26 circled charges per panel and one hatched sampling rectangle per dielectric. Every negative/positive circle and sign maps to its pair connector, signed center-displacement and dielectric-inside assertions using literal centers, not invisible dot objects. The author construction independently checks all26 pair mappings and each sampling rectangle contains3 negative/3 positive centers. Panel a has varied directions and no external polarity labels: its horizontal stubs are terminal leads. Panel b preserves varied tilted orientations biased rightward, plus on its left plate and minus on its right. Two plates, terminal endpoints, dielectric and sampling boundaries are retained in each panel. Vertical stacking, isotropic scale, glyph sizing and hatch spacing are explicit modern layout, not source numerical givens; no universal full alignment, charge flow or field arrows are added.')
  return { spec, geometry }
}

function figure135(context) {
  const spec = base('fig-135', 620, context)
  spec.description = 'The source tilted dipole rod has an open negative lower-left endpoint and positive upper-right endpoint, with equal/opposed horizontal forces in the frozen uniform-field approximation. Force equations retain signed q magnitude and field vectors. A separate E arrow is rightward. No endpoint charge label, rotation arc or invented motion state is added.'
  point(spec, 'positive-endpoint', 375, 190)
  point(spec, 'negative-endpoint', 220, 440)
  segment(spec, 'dipole-rod', 'negative-endpoint', 'positive-endpoint')
  arrow(spec, 'force-1', xy(spec, 375, 190), xy(spec, 565, 190))
  arrow(spec, 'force-2', xy(spec, 220, 440), xy(spec, 30, 440))
  text(spec, 'force-1-equation', 430, 95, 'F\u20d7\u2081 = +|q|E\u20d7')
  text(spec, 'force-2-equation', 210, 520, 'F\u20d7\u2082 = \u2212|q|E\u20d7')
  arrow(spec, 'external-field', xy(spec, 400, 300), xy(spec, 550, 300))
  text(spec, 'external-field-label', 475, 355, 'E\u20d7')
  assertion(spec, 'force1-at-positive-endpoint', 'connects', { arrow: 'force-1', from: 'positive-endpoint', to: xy(spec, 565, 190) })
  assertion(spec, 'force2-at-negative-endpoint', 'connects', { arrow: 'force-2', from: 'negative-endpoint', to: xy(spec, 30, 440) })
  assertion(spec, 'equal-force-magnitudes', 'equalDistance', { a: 'positive-endpoint', b: xy(spec, 565, 190), c: 'negative-endpoint', d: xy(spec, 30, 440) })
  assertion(spec, 'opposed-force-lines-parallel', 'parallel', { a: 'positive-endpoint', b: xy(spec, 565, 190), c: 'negative-endpoint', d: xy(spec, 30, 440) })
  assertion(spec, 'positive-force-along-field', 'parallel', { a: 'positive-endpoint', b: xy(spec, 565, 190), c: xy(spec, 400, 300), d: xy(spec, 550, 300) })
  assertion(spec, 'tilted-negative-to-positive-charge-order', 'displacement', { from: 'negative-endpoint', to: 'positive-endpoint', dx: 155, dy: 250 })
  assertion(spec, 'two-open-endpoints', 'objectCount', { objectType: 'point', count: 2 })
  assertion(spec, 'two-forces-and-one-field-arrow', 'objectCount', { objectType: 'arrow', count: 3 })
  mapInventory(spec, context.sourceInventory.figures.find(figure => figure.id === spec.id).facts.join(' ') + ' Both visible endpoint points have mapped pair relationships and each force is bound to its proper endpoint. Uncalibrated layout lengths are not printed values or amplitude calibration.', true)
  return { spec, geometry: { sourceEndpoints: 2, forces: 2, fieldArrows: 1, equalForceLengths: [190, 190], oppositeForceDisplacements: [[190, 0], [-190, 0]], sourceNumericalValuesAdded: false } }
}

function figure136(context) {
  const spec = base('fig-136', 350, context)
  spec.description = 'The source horizontal dipole has hollow endpoints, q with minus subscript at left and q with plus subscript at right, parallel to a separate rightward E-vector arrow below. This is the orientation diagram, not universal thermal complete alignment. No added force arrow, torque or p label.'
  point(spec, 'negative-endpoint', 150, 100)
  point(spec, 'positive-endpoint', 490, 100)
  segment(spec, 'dipole-rod', 'negative-endpoint', 'positive-endpoint')
  text(spec, 'negative-charge-label', 150, 170, 'q\u208b')
  text(spec, 'positive-charge-label', 490, 170, 'q\u208a')
  arrow(spec, 'external-field', xy(spec, 235, 230), xy(spec, 405, 230))
  text(spec, 'external-field-label', 320, 290, 'E\u20d7')
  assertion(spec, 'negative-to-positive-rightward-charge-order', 'displacement', { from: 'negative-endpoint', to: 'positive-endpoint', dx: 340, dy: 0 })
  assertion(spec, 'dipole-parallel-to-field', 'parallel', { a: 'negative-endpoint', b: 'positive-endpoint', c: xy(spec, 235, 230), d: xy(spec, 405, 230) })
  assertion(spec, 'two-open-endpoints', 'objectCount', { objectType: 'point', count: 2 })
  assertion(spec, 'only-one-field-arrow', 'objectCount', { objectType: 'arrow', count: 1 })
  mapInventory(spec, context.sourceInventory.figures.find(figure => figure.id === spec.id).facts.join(' ') + ' Both endpoints map to signed pair displacement and rod/field parallelism. The glyph subscripts preserve the printed q identities. All expanded coordinates are uncalibrated layout only.', true)
  return { spec, geometry: { sourceEndpoints: 2, fieldArrows: 1, chargeOrdering: ['negative-left', 'positive-right'], inventedForces: 0, sourceNumericalValuesAdded: false } }
}

function figure137(context) {
  const spec = base('fig-137', 920, context)
  spec.description = 'The source slab has oppositely signed plates, terminal leads and an inner dielectric rectangle. Exactly6 rightward solid E0 arrows span the plates, and5 leftward dashed E1 arrows lie within the dielectric. Opposing fields illustrate the fixed-free-charge static slab model from the full frozen prose; arrow lengths do not calibrate field magnitudes. No added total-E, bound particles, sigma or extra formula.'
  rectangle(spec, 'dielectric', [170, 70, 470, 840])
  segment(spec, 'left-plate', xy(spec, 100, 90), xy(spec, 100, 820), 6)
  segment(spec, 'right-plate', xy(spec, 540, 90), xy(spec, 540, 820), 6)
  assertion(spec, 'parallel-plates', 'parallel', { a: xy(spec, 100, 90), b: xy(spec, 100, 820), c: xy(spec, 540, 90), d: xy(spec, 540, 820) })
  segment(spec, 'left-terminal', xy(spec, 40, 450), xy(spec, 100, 450))
  segment(spec, 'right-terminal', xy(spec, 540, 450), xy(spec, 600, 450))
  text(spec, 'left-positive-plate-sign', 60, 270, '+')
  text(spec, 'right-negative-plate-sign', 580, 270, '\u2212')
  const families = [
    { name: 'external-field', rows: [150, 270, 390, 510, 630, 750], x: [100, 540], dash: 0 },
    { name: 'polarization-field', rows: [210, 330, 450, 570, 690], x: [465, 175], dash: 2 },
  ]
  const geometry = []
  for (const family of families) {
    for (const [index, row] of family.rows.entries()) {
      const id = `${family.name}-${index + 1}`
      const from = xy(spec, family.x[0], row)
      const to = xy(spec, family.x[1], row)
      arrow(spec, id, from, to, { dash: family.dash })
      assertion(spec, `${id}-horizontal`, 'parallel', { a: from, b: to, c: [0, 0], d: [1, 0] })
      assertion(spec, `${id}-normal-to-plates`, 'perpendicular', { a: from, b: to, c: xy(spec, 100, 90), d: xy(spec, 100, 820) })
      if (family.name === 'polarization-field') {
        assertion(spec, `${id}-tail-in-dielectric`, 'inside', { point: from, container: 'dielectric' })
        assertion(spec, `${id}-tip-in-dielectric`, 'inside', { point: to, container: 'dielectric' })
      }
      geometry.push({ id, from, to, dash: family.dash, dx: to[0] - from[0], dy: 0 })
    }
  }
  text(spec, 'external-field-vector-label', 420, 110, 'E\u20d7\u2080')
  text(spec, 'polarization-field-vector-label', 230, 170, 'E\u20d7\u2081')
  assert.equal(geometry.filter(item => item.dash === 0).length, 6)
  assert.equal(geometry.filter(item => item.dash === 2).length, 5)
  assert(geometry.filter(item => item.dash === 0).every(item => item.dx > 0))
  assert(geometry.filter(item => item.dash === 2).every(item => item.dx < 0))
  assertion(spec, 'six-plus-five-field-arrows', 'objectCount', { objectType: 'arrow', count: 11 })
  mapInventory(spec, context.sourceInventory.figures.find(figure => figure.id === spec.id).facts.join(' ') + ' Every field arrow maps to endpoints, signed displacement, horizontal parallelism and plate-normal assertions. All ten dashed-field endpoints remain inside the dielectric. Author executable per-family counts6/5 and directions supplement global arrow count11. The chosen equal row spacing and schematic arrow extents are layout, not calibrated magnitude data.')
  return { spec, geometry: { sourceSolidArrows: 6, sourceDashedArrows: 5, allArrowEndpointsAndDirections: geometry, sourceNumericalValuesAdded: false, arrowExtentNotAmplitudeCalibration: true } }
}

function author() {
  assert.equal(sha(proseFreeze), '5e47426ade4bbe3fd311ac206616534b6cb914cb522ad08d888bc1f592bf74be')
  assert.equal(sha(template), '8bd07c568e1dd5b7004fab8eb8c8d4c0bd6ffe4417496f54f33f0997ec74cb49')
  assert.equal(sha(science), '54c2c5c7ec68ef2f6fde6aee57ca6190d4a002649fad191fa1bda2e7666a0e5b')
  assert.equal(sha(raw), '1500c1648d14db92d80fb9f83f519fc5aae5bea44ff1c5770350043dd6408c29')
  const frozen = load(proseFreeze)
  const edition = load(template)
  for (const key of ['sourceLesson', 'sourceMarkdown', 'sourceExercises', 'lessonTemplate', 'exercisesTemplate', 'figuresTemplate']) verify(frozen.bindings[key])
  assert.equal(edition.exercise_count, 0)
  assert.equal(edition.prose.length, 13)
  assert.deepEqual(edition.source.data, load(raw))
  assert.deepEqual(edition.figures.map(figure => figure.id), ids)
  const inventory = load(`${work}/source-inventory.json`)
  for (const figure of inventory.figures) {
    verify(figure.source)
    assert.equal(figure.actuallyOpened, true)
    assert.equal(figure.openCount, 1)
  }
  const blocks = edition.prose.map((block, blockIndex) => ({
    blockIndex, kind: block.kind, id: block.id, sourceRefs: block.source_refs, text: block.text,
    blockSHA256: crypto.createHash('sha256').update(JSON.stringify(block)).digest('hex'),
  }))
  const context = {
    schema: 'ld-s10y-image/context@1', book: '9p', edition: 'modern-us-neutral', lesson: lessonId,
    bindings: {
      lesson: bind(template), canonicalSource: bind(raw), proseFreeze: bind(proseFreeze),
      independentScience: bind(science), sourceInventory: bind(`${work}/source-inventory.json`),
      sourceExercises: frozen.bindings.sourceExercises, sourceMarkdown: frozen.bindings.sourceMarkdown,
      exercisesTemplate: frozen.bindings.exercisesTemplate, figuresTemplate: frozen.bindings.figuresTemplate,
    },
    snapshots: {
      lesson: snapshot(template, `${work}/lesson.template.snapshot.json`),
      canonicalSource: snapshot(raw, `${work}/canonical.lesson.snapshot.json`),
      proseFreeze: snapshot(proseFreeze, `${work}/prose-freeze.snapshot.json`),
      independentScience: snapshot(science, `${work}/science-review.snapshot.json`),
      exercises: snapshot(frozen.bindings.sourceExercises.path, `${work}/canonical.exercises.snapshot.json`),
      exercisesTemplate: snapshot(frozen.bindings.exercisesTemplate.path, `${work}/exercises.template.snapshot.json`),
      figuresTemplate: snapshot(frozen.bindings.figuresTemplate.path, `${work}/figures.template.authority-snapshot.json`),
      nativeFontBridge: snapshot('.tmp/STEMROBIN-181/9p-d019-n73-figures/native-font-previews.mjs', `${work}/native-font-previews.mjs`),
    },
    authoritativeText: [{ lesson: lessonId, text: edition.printed_title },
      ...blocks.filter(block => block.text?.trim()).map(block => ({ lesson: lessonId, text: block.text }))],
    fullPerBlockTextAndIdentity: blocks, fullLessonData: edition, canonicalSourceData: load(raw),
    sourceInventory: inventory, tasks: 0, sourceOriginalsReopenedForThisStage: false,
    scienceStatus: 'Existing separate Zeno SCI PASS bound without author re-review or prose change.',
    frozenAuthorConditions: frozen.authorConditions,
  }
  assert.equal(context.authoritativeText.length, 10)
  writeNew(`${work}/context.json`, context)
  const built = [figure134(context), figure135(context), figure136(context), figure137(context)]
  for (const { spec } of built) writeNew(`${work}/${spec.id}/initial/spec.json`, spec)
  writeNew(`${work}/geometry-construction.initial.json`, {
    role: 'native-author-construction-not-independent-gate', context: bind(`${work}/context.json`),
    sourceInventory: bind(`${work}/source-inventory.json`), authorHelper: bind(`${work}/author.mjs`),
    figures: built.map(({ spec, geometry }) => ({
      id: spec.id, source: spec.source.image, spec: bind(`${work}/${spec.id}/initial/spec.json`),
      geometry, nativeAssertionCount: spec.assertions.length, repairsUsed: 0, maximumRepairs: 1,
    })),
    originalPixelsReopened: false, scienceSelfApproval: false, independentApproval: false,
  })
  console.log(JSON.stringify({ context: bind(`${work}/context.json`), specs: ids.map(id => bind(`${work}/${id}/initial/spec.json`)) }, null, 2))
}

function renderOne() {
  const [id, revision = 'initial'] = process.argv.slice(3)
  assert(ids.includes(id))
  assert(['initial', 'repair-1'].includes(revision))
  const dir = `${work}/${id}/${revision}`
  assert(fs.existsSync(`${dir}/spec.json`))
  assert(!fs.existsSync(`${dir}/invocation.json`), 'Never repeat an existing invocation')
  assert(!fs.existsSync(`${dir}/render.json`))
  if (revision === 'repair-1') assert(fs.existsSync(`${work}/${id}/initial/invocation.json`))
  const validationArgs = [validator, `${dir}/spec.json`, '--stage', 'draft']
  const validation = spawnSync(python, validationArgs, { encoding: 'utf8' })
  writeNew(`${dir}/draft-validation.json`, {
    command: [python, ...validationArgs], exitCode: validation.status,
    stdout: validation.stdout, stderr: validation.stderr,
    spec: bind(`${dir}/spec.json`), validator: bind(validator),
  })
  assert.equal(validation.status, 0, validation.stdout + validation.stderr)
  const renderArgs = ['--import', `./${work}/native-font-previews.mjs`, renderer,
    '--spec', `${dir}/spec.json`, '--svg', `${dir}/${id}.svg`,
    '--png', `${dir}/${id}.png`, '--report', `${dir}/render.json`]
  const result = spawnSync(process.execPath, renderArgs, { encoding: 'utf8', timeout: 180000 })
  writeNew(`${dir}/invocation.json`, {
    role: 'author-native-render-not-independent-review', command: [process.execPath, ...renderArgs],
    exitCode: result.status, signal: result.signal, error: result.error?.message ?? null,
    stdout: result.stdout, stderr: result.stderr,
    spec: bind(`${dir}/spec.json`), renderer: bind(renderer), fontBridge: bind(`${work}/native-font-previews.mjs`),
    isolatedHeadless: true, nativeSessionOnly: true, networkBlocked: true,
    outputs: ['render.json', `${id}.svg`, `${id}.png`, 'width-previews.json', 'width-640.png', 'width-331.png', 'width-342.png']
      .filter(name => fs.existsSync(`${dir}/${name}`)).map(name => bind(`${dir}/${name}`)),
    childProcessFinished: true,
  })
  console.log(JSON.stringify({ id, revision, exitCode: result.status, report: fs.existsSync(`${dir}/render.json`) ? load(`${dir}/render.json`) : null }, null, 2))
  process.exitCode = result.status ?? 1
}

function freeze() {
  const context = load(`${work}/context.json`)
  for (const binding of Object.values(context.bindings)) verify(binding)
  const observations = load(`${work}/author-pixel-observations.json`)
  const figures = ids.map(id => {
    const observed = observations.figures.find(figure => figure.id === id)
    assert(observed)
    assert(observed.repairsUsed >= 0 && observed.repairsUsed <= 1)
    const revision = observed.repairsUsed ? 'repair-1' : 'initial'
    const dir = `${work}/${id}/${revision}`
    const spec = load(`${dir}/spec.json`)
    const invocation = load(`${dir}/invocation.json`)
    const render = fs.existsSync(`${dir}/render.json`) ? load(`${dir}/render.json`) : null
    const previewManifest = fs.existsSync(`${dir}/width-previews.json`) ? load(`${dir}/width-previews.json`) : null
    assert.deepEqual(spec.source.authoritativeText, context.authoritativeText)
    verify(spec.source.image)
    if (render) {
      assert.equal(render.spec.sha256, sha(`${dir}/spec.json`))
      verify(render.output.svg)
    }
    const previews = (previewManifest?.previews ?? []).map(preview => {
      verify(preview)
      const opened = observed.images.find(image => path.resolve(image.path) === path.resolve(preview.path))
      assert(opened?.actuallyOpened && opened.openCount === 1 && opened.detail === 'original')
      assert.equal(opened.sha256, preview.sha256)
      return { ...preview, ...opened }
    })
    if (previewManifest) assert.deepEqual(previews.map(preview => preview.width), [640, 331, 342])
    const candidateReady = render?.status === 'pass' && invocation.exitCode === 0 && observed.findings.length === 0 && previews.length === 3
    return {
      id, status: candidateReady ? 'frozen-author-candidate-awaiting-independent-gate' : 'blocked-author-candidate',
      bindings: {
        source: spec.source.image, context: bind(`${work}/context.json`),
        lesson: context.bindings.lesson, lessonSnapshot: context.snapshots.lesson,
        canonicalSource: context.bindings.canonicalSource, proseFreeze: context.bindings.proseFreeze,
        independentScience: context.bindings.independentScience, sourceInventory: context.bindings.sourceInventory,
        spec: bind(`${dir}/spec.json`), invocation: bind(`${dir}/invocation.json`),
        draftValidation: bind(`${dir}/draft-validation.json`),
        ...(render ? { render: bind(`${dir}/render.json`), svg: bind(`${dir}/${id}.svg`) } : {}),
        ...(previewManifest ? { fullPNG: bind(`${dir}/${id}.png`), previewManifest: bind(`${dir}/width-previews.json`) } : {}),
      },
      native: { status: render?.status ?? 'failed-before-report', collisions: render?.collisions ?? null, displayChecks: render?.displayChecks ?? null, assertionCount: spec.assertions.length },
      sourceOriginalOpenReused: { actualOpened: true, priorOpenCount: 1, reopened: false },
      previews, authorObservations: observed,
      budget: { initialRenderInvocations: 1, repairsUsed: observed.repairsUsed, repairRenderInvocations: observed.repairsUsed, maximumRepairs: 1, remainingRepairs: 1 - observed.repairsUsed },
    }
  })
  const files = []
  const walk = dir => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const file = path.join(dir, entry.name)
      if (entry.isDirectory()) walk(file)
      else files.push(bind(file))
    }
  }
  walk(work)
  const file = `${ticket}/d020-n72-figures-author-freeze.json`
  writeNew(file, {
    ticket: 'STEMROBIN-181', batch: 'D020', lesson: lessonId, author: 'Einstein', role: 'modern-figure-author-only',
    status: figures.every(figure => figure.status.startsWith('frozen')) ? 'frozen-awaiting-main-unique-independent-figure-gate' : 'blocked-author-candidates',
    bindings: {
      ...context.bindings, context: bind(`${work}/context.json`),
      geometryConstruction: bind(`${work}/geometry-construction.initial.json`),
      authorObservations: bind(`${work}/author-pixel-observations.json`), authorHelper: bind(`${work}/author.mjs`),
      nativeFontBridge: bind(`${work}/native-font-previews.mjs`), nativeRenderer: bind(renderer), nativeValidator: bind(validator),
      imageSkill: bind('.agents/skills/ld-s10y-image/SKILL.md'),
    },
    snapshots: context.snapshots, fullAuthoritativeTextPerBlockBound: true, sourceBlockCount: 13, tasks: 0,
    figures, scratchFilesAndImmutableInitialRepairHistory: files,
    unresolvedSourceDetails: context.sourceInventory.figures.map(figure => ({ id: figure.id, uncertainties: figure.uncertainties })),
    sourceOriginalOpenCount: 4, originalPixelsReopened: false, priorPassedFiguresReopenedOrChanged: false,
    independentApproval: false, scienceSelfApproval: false, svgHandEdited: false,
    proseOrSourceOrTemplateOrDurableOrDbOrGitChanges: false, promotionOrFinalize: false,
    browser: 'Existing deterministic native renderer isolated headless sessions; inherited byte-identical font bridge; network blocked; no user browser.',
    inFlightProcesses: [],
  })
  console.log(JSON.stringify({ freeze: bind(file), figures: figures.map(({ id, status, budget }) => ({ id, status, budget })), inFlightProcesses: [] }, null, 2))
}

if (process.argv[2] === 'author') author()
else if (process.argv[2] === 'render') renderOne()
else if (process.argv[2] === 'freeze') freeze()
else throw new Error('Only author/render/freeze; no independent review or promotion')
