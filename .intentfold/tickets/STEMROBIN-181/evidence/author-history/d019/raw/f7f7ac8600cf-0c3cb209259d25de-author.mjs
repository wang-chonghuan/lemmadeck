import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

const work = '.tmp/STEMROBIN-181/9p-d019-n73-figures'
const ticket = '.intentfold/tickets/STEMROBIN-181/tmp'
const lessonId = 'phy9-c2-s2-n73'
const template = `.tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons/${lessonId}/lesson.template.json`
const proseFreeze = `${ticket}/9p-n73-prose-freeze.json`
const inventoryPath = `${ticket}/9p-n73-figure-source-inventory.json`
const raw = `ssot-resources/soviet10year-textbooks/artifacts/9p/lessons/${lessonId}/lesson.json`
const fontBridge = '.tmp/STEMROBIN-181/9p-d019-n70-figures/native-font-previews.mjs'
const ids = ['fig-138', 'fig-139']
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: file, sha256: sha(file) })
const load = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const writeNew = (file, value) => {
  assert(!fs.existsSync(file), `Preserve existing artifact: ${file}`)
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`)
}
const snapshot = (file, destination) => {
  assert(!fs.existsSync(destination))
  fs.mkdirSync(path.dirname(destination), { recursive: true })
  fs.copyFileSync(file, destination)
  return bind(destination)
}
const validateBinding = binding => assert.equal(sha(binding.path), binding.sha256, binding.path)
const xy = (spec, x, screenY) => [x, spec.canvas.height - screenY]
const assertion = (spec, id, type, fields) => spec.assertions.push({ id, type, ...fields })
const text = (spec, id, x, y, value) => spec.objects.push({
  id, type: 'text', at: xy(spec, x, y), text: value, fontSize: 36, fontWeight: 600,
  labelColor: 'ink', labelPlacement: { position: 'CENTER', gap: 0 },
})
const segment = (spec, id, from, to, strokeWidth = 3) => {
  spec.objects.push({ id, type: 'segment', from, to, stroke: 'ink', strokeWidth })
  assertion(spec, `${id}-endpoints`, 'connects', { arrow: id, from, to })
}
const arrow = (spec, id, from, to, strokeWidth = 3.4) => {
  spec.objects.push({ id, type: 'arrow', from, to, stroke: 'ink', strokeWidth })
  assertion(spec, `${id}-endpoints`, 'connects', { arrow: id, from, to })
  assertion(spec, `${id}-directed-displacement`, 'displacement', {
    from, to, dx: to[0] - from[0], dy: to[1] - from[1],
  })
}
const visiblePoint = (spec, id, x, y, hollow = false) => spec.objects.push({
  id, type: 'point', at: xy(spec, x, y), size: 4,
  stroke: 'ink', strokeWidth: 2, fill: hollow ? 'paper' : 'ink',
})

function base(id, height, context) {
  return {
    schema: 'ld-s10y-image/figure-spec@2', id, mode: 'deterministic', description: '',
    source: {
      image: context.sourceInventory.figures.find(figure => figure.id === id).source,
      authoritativeText: context.authoritativeText,
      inventory: [],
    },
    canvas: { width: 640, height, boundingBox: [0, height, 640, 0], background: 'paper', keepAspectRatio: true },
    display: { purpose: 'instructional', layout: 'inline', widths: [640, 331, 342], minTextPx: 16 },
    objects: [], assertions: [],
  }
}

function platesAndField(spec, rows, top, bottom) {
  segment(spec, 'left-plate', xy(spec, 100, top), xy(spec, 100, bottom), 7)
  segment(spec, 'right-plate', xy(spec, 540, top), xy(spec, 540, bottom), 7)
  assertion(spec, 'parallel-vertical-plates', 'parallel', {
    a: xy(spec, 100, top), b: xy(spec, 100, bottom),
    c: xy(spec, 540, top), d: xy(spec, 540, bottom),
  })
  for (const [index, row] of rows.entries()) {
    const from = xy(spec, 540, row)
    const to = xy(spec, 100, row)
    const id = `field-arrow-${index + 1}`
    arrow(spec, id, from, to)
    assertion(spec, `${id}-uniform-horizontal-direction`, 'parallel', {
      a: from, b: to, c: [0, 0], d: [1, 0],
    })
    assertion(spec, `${id}-plate-normal`, 'perpendicular', {
      a: from, b: to, c: xy(spec, 100, top), d: xy(spec, 100, bottom),
    })
  }
}

function mappedInventory(spec, description) {
  spec.source.inventory.push({
    id: `${spec.id}-retained-source`,
    description,
    requires: ['pointRelationships'],
    objects: spec.objects.map(object => object.id),
    assertions: spec.assertions.map(item => item.id),
  })
}

function dimension(spec, id, from, to, label, labelX, labelY) {
  arrow(spec, `${id}-right-terminal`, from, to, 2.1)
  arrow(spec, `${id}-left-terminal`, to, from, 2.1)
  text(spec, `${id}-label`, labelX, labelY, label)
}

function figure138(context) {
  const spec = base('fig-138', 980, context)
  spec.description = 'Two parallel plates B and D, exactly seven leftward uniform-field arrows, E-vector label and same-line points1 and2. Distances d1,d2 and Delta d share B as reference, with point2 between B and point1. No polarity symbols are added to this source crop. The frozen text supplies the positive-charge1-to2 work context and the finite-plate approximation conditions.'
  platesAndField(spec, [150, 250, 350, 450, 620, 790, 850], 125, 880)
  text(spec, 'field-vector', 320, 90, 'E\u20d7')
  text(spec, 'plate-B-label', 80, 930, 'B')
  text(spec, 'plate-D-label', 560, 930, 'D')
  visiblePoint(spec, 'point-1', 420, 620)
  visiblePoint(spec, 'point-2', 250, 620)
  text(spec, 'point-1-label', 445, 665, '1')
  text(spec, 'point-2-label', 225, 665, '2')
  segment(spec, 'point-1-dimension-extension', xy(spec, 420, 530), xy(spec, 420, 750), 1.8)
  segment(spec, 'point-2-dimension-extension', xy(spec, 250, 530), xy(spec, 250, 640), 1.8)
  dimension(spec, 'd2-dimension', xy(spec, 100, 550), xy(spec, 250, 550), 'd\u2082', 175, 510)
  dimension(spec, 'delta-d-dimension', xy(spec, 250, 550), xy(spec, 420, 550), '\u0394d', 335, 510)
  dimension(spec, 'd1-dimension', xy(spec, 100, 735), xy(spec, 420, 735), 'd\u2081', 260, 700)
  assertion(spec, 'point-identities-on-one-field-line', 'collinear', {
    a: 'point-2', b: 'point-1', c: xy(spec, 100, 620),
  })
  assertion(spec, 'point1-to-point2-leftward-displacement', 'displacement', {
    from: 'point-1', to: 'point-2', dx: -170, dy: 0,
  })
  assertion(spec, 'd1-common-left-plate-reference', 'equalDistance', {
    a: xy(spec, 100, 620), b: 'point-1', c: xy(spec, 100, 735), d: xy(spec, 420, 735),
  })
  assertion(spec, 'd2-common-left-plate-reference', 'equalDistance', {
    a: xy(spec, 100, 620), b: 'point-2', c: xy(spec, 100, 550), d: xy(spec, 250, 550),
  })
  assertion(spec, 'delta-d-point-separation', 'equalDistance', {
    a: 'point-2', b: 'point-1', c: xy(spec, 250, 550), d: xy(spec, 420, 550),
  })
  assertion(spec, 'point2-before-point1-from-left-reference', 'displacement', {
    from: xy(spec, 100, 620), to: 'point-2', dx: 150, dy: 0,
  })
  assertion(spec, 'complete-field-and-dimension-arrow-objects', 'objectCount', { objectType: 'arrow', count: 13 })
  mappedInventory(spec, 'Retained actual source inventory: two plates labeled B(left) and D(right), exactly seven leftward field arrows, E-vector, filled point1(right) and point2(left) on the same field line, two horizontal dimension-guide levels with d2 and Delta d sharing the upper level and d1 below. Distances use B as the common reference, with d2<d1 and the interval between2 and1 equal to their difference. Native double-ended dimension arrows regularize the tiny printed terminal marks, separately from the seven field arrows. The two source points and every directed segment/dimension are mapped to native relationship assertions. Modern coordinates, widened dimension-label gaps and uniform readable font are layout only, not source numerical data. The source does not print extra plus/minus symbols, a charge-value label or a work answer in fig138.')
  return {
    spec,
    geometry: {
      fieldArrows: 7, dimensionArrowTerminals: 6, sourcePointMarkers: 2,
      schematicDistances: { d1: 320, d2: 150, deltaD: 170 },
      additiveDistanceCheck: 320 === 150 + 170,
      coordinateValuesAreUnprintedLayoutOnly: true,
      sourceNumericalDataAdded: false,
    },
  }
}

function figure139(context) {
  const spec = base('fig-139', 860, context)
  spec.description = 'Two oppositely signed plates and exactly six leftward field arrows. The open directed1-to2 path bows below the same-height endpoints and retains an orthogonal staircase approximation. Its signed horizontal displacement is leftward; this mathematical construction is not a prescribed particle trajectory, closed loop or solution label.'
  platesAndField(spec, [150, 260, 370, 530, 640, 750], 125, 780)
  text(spec, 'negative-plate-sign', 60, 150, '\u2212')
  text(spec, 'positive-plate-sign', 580, 150, '+')
  visiblePoint(spec, 'point-1', 470, 370)
  visiblePoint(spec, 'point-2', 170, 370, true)
  text(spec, 'point-1-label', 470, 315, '1')
  text(spec, 'point-2-label', 170, 315, '2')
  assertion(spec, 'same-height-numbered-endpoints', 'collinear', {
    a: 'point-2', b: 'point-1', c: xy(spec, 100, 370),
  })
  assertion(spec, 'open-path1-to2-signed-displacement', 'displacement', {
    from: 'point-1', to: 'point-2', dx: -300, dy: 0,
  })
  const curveScreen = t => [470 - 300 * t, 370 + 320 * t * (1 - t)]
  const curve = t => {
    const [x, y] = curveScreen(t)
    return xy(spec, x, y)
  }
  spec.objects.push({
    id: 'open-bowed-path1-to2', type: 'svgPath',
    d: 'M 470 370 Q 320 530 170 370', stroke: 'ink', strokeWidth: 3.2, fill: 'paper', fillOpacity: 0,
  })
  for (const [index, parameter] of [0.2, 0.5, 0.8].entries()) {
    arrow(spec, `curve-direction-${index + 1}`, curve(parameter - 0.025), curve(parameter + 0.025), 2.8)
  }
  const curveSamples = Array.from({ length: 9 }, (_, i) => ({ t: i / 8, screen: curveScreen(i / 8), at: curve(i / 8) }))
  const staircase = []
  for (let i = 0; i < curveSamples.length - 1; i++) {
    const from = curveSamples[i].at
    const to = curveSamples[i + 1].at
    const elbow = [from[0], to[1]]
    segment(spec, `stair-vertical-${i + 1}`, from, elbow, 2)
    assertion(spec, `stair-vertical-${i + 1}-zero-field-parallel-component`, 'displacement', {
      from, to: elbow, dx: 0, dy: elbow[1] - from[1],
    })
    assertion(spec, `stair-vertical-${i + 1}-perpendicular-to-field`, 'perpendicular', {
      a: from, b: elbow, c: [0, 0], d: [1, 0],
    })
    segment(spec, `stair-horizontal-${i + 1}`, elbow, to, 2)
    assertion(spec, `stair-horizontal-${i + 1}-signed-field-parallel-component`, 'displacement', {
      from: elbow, to, dx: to[0] - elbow[0], dy: 0,
    })
    assertion(spec, `stair-horizontal-${i + 1}-parallel-to-field`, 'parallel', {
      a: elbow, b: to, c: [0, 0], d: [1, 0],
    })
    staircase.push({ from, elbow, to, dx: to[0] - from[0], dy: to[1] - from[1] })
  }
  assertion(spec, 'six-field-arrows-and-three-path-direction-marks', 'objectCount', { objectType: 'arrow', count: 9 })
  mappedInventory(spec, 'Retained actual source inventory: two vertical plates with minus at the left and plus at the right, exactly six leftward field arrows, numbered point1 on the right and point2 on the left at the same field-line height, one open1-to2 curve bowed below the endpoints and one superposed orthogonal staircase. Retained author inventory records the lower source staircase/path ink as partly merged; the number of separately printed small legs and path-direction marks was not reliably established. The eight modern subdivisions and three directional marks are explicit uncalibrated regularization of that existing construction, not a claim about printed source counts, new data, another path or a particle-motion state. Native endpoint, signed-displacement and parallel/perpendicular assertions cover both numbered points and every staircase leg. No B/D, E-vector, distance or work/energy labels absent from fig139 are introduced.')
  const totalDx = staircase.reduce((sum, step) => sum + step.dx, 0)
  const totalDy = staircase.reduce((sum, step) => sum + step.dy, 0)
  assert.equal(totalDx, -300)
  assert.equal(totalDy, 0)
  assert.deepEqual(curve(0), spec.objects.find(object => object.id === 'point-1').at)
  assert.deepEqual(curve(1), spec.objects.find(object => object.id === 'point-2').at)
  return {
    spec,
    geometry: {
      fieldArrows: 6, sourceNumberedEndpoints: 2,
      curve: { family: 'uncalibrated quadratic regularization', screenControlPoints: [[470, 370], [320, 530], [170, 370]], sourcePrintedNumericalCurve: false },
      curveSamples, staircase, summedSignedDx: totalDx, summedSignedDy: totalDy,
      staircaseSubdivisions: 8, subdivisionCountIsModernRegularizationNotSourceFact: true,
      sourceStepCountUnresolvedAsRetainedInventoryStates: true,
      pathDirectionMarks: 3, markCountIsModernRegularizationNotSourceFact: true,
      noInventedLoopOrTrajectoryOrAnswerLabels: true,
    },
  }
}

function author() {
  assert.equal(sha(proseFreeze), 'a9f823a98c1c00d4d41082b73642d8338c73486d8ef33237822208011ccc1394')
  assert.equal(sha(template), 'eac584ad8e7a071aa7ef58065f27c4adf0eee19a5f491ae20d9b3fa5c4a9e001')
  assert.equal(sha(inventoryPath), '957a097d89d59957b1c05460101a906b6ddc85dafa88811525009a0c669d03f9')
  const frozen = load(proseFreeze)
  const edition = load(template)
  const inventory = load(inventoryPath)
  validateBinding(frozen.bindings.sourceLesson)
  validateBinding(frozen.bindings.exercisesTemplate)
  validateBinding(frozen.bindings.figuresTemplate)
  assert.equal(edition.exercise_count, 0)
  assert.equal(edition.prose.length, 22)
  assert.deepEqual(edition.figures.map(figure => figure.id), ids)
  assert.deepEqual(edition.source.data, load(raw))
  for (const figure of inventory.figures) {
    validateBinding(figure.source)
    assert.equal(figure.openCount, 1)
    assert.equal(figure.actuallyOpened, true)
    assert.equal(figure.repairsUsed, 0)
  }
  const blocks = edition.prose.map((block, blockIndex) => ({
    blockIndex, kind: block.kind, sourceRefs: block.source_refs, text: block.text,
    blockSHA256: crypto.createHash('sha256').update(JSON.stringify(block)).digest('hex'),
  }))
  const context = {
    schema: 'ld-s10y-image/context@1', book: '9p', edition: 'modern-us-neutral', lesson: lessonId,
    bindings: {
      proseFreeze: bind(proseFreeze), lesson: bind(template), canonicalSource: bind(raw),
      sourceInventory: bind(inventoryPath),
      sourceExercises: frozen.bindings.sourceExercises,
      exercisesTemplate: frozen.bindings.exercisesTemplate,
      figuresTemplate: frozen.bindings.figuresTemplate,
    },
    snapshots: {
      lesson: snapshot(template, `${work}/lesson.template.snapshot.json`),
      canonicalSource: snapshot(raw, `${work}/canonical.lesson.snapshot.json`),
      sourceInventory: snapshot(inventoryPath, `${work}/source-inventory.snapshot.json`),
      figuresTemplate: snapshot(frozen.bindings.figuresTemplate.path, `${work}/figures.template.authority-snapshot.json`),
      exercisesTemplate: snapshot(frozen.bindings.exercisesTemplate.path, `${work}/exercises.template.snapshot.json`),
      nativeFontBridge: snapshot(fontBridge, `${work}/native-font-previews.mjs`),
    },
    authoritativeText: [{ lesson: lessonId, text: edition.printed_title },
      ...blocks.filter(block => block.text?.trim()).map(block => ({ lesson: lessonId, text: block.text }))],
    fullPerBlockTextAndIdentity: blocks, fullLessonData: edition,
    canonicalSourceData: load(raw), sourceInventory: inventory,
    sourceOriginalsReopenedForThisStage: false,
    scienceStatus: 'Main independent SCI in flight; author does not approve or change prose.',
    tasks: 0,
  }
  writeNew(`${work}/context.json`, context)
  const built = [figure138(context), figure139(context)]
  for (const { spec } of built) writeNew(`${work}/${spec.id}/initial/spec.json`, spec)
  writeNew(`${work}/geometry-construction.initial.json`, {
    role: 'figure-author-native-construction-not-independent-science-or-figure-gate',
    context: bind(`${work}/context.json`), sourceInventory: bind(inventoryPath),
    helper: bind(`${work}/author.mjs`),
    figures: built.map(({ spec, geometry }) => ({
      id: spec.id, source: spec.source.image, spec: bind(`${work}/${spec.id}/initial/spec.json`),
      geometry, fieldArrowCountDerivedFromIds: spec.objects.filter(object => /^field-arrow-\d+$/.test(object.id)).length,
      nativeAssertionCount: spec.assertions.length, repairsUsed: 0, maximumRepairs: 1,
    })),
    originalsReopened: false, modernProseChanged: false, independentApproval: false,
  })
  console.log(JSON.stringify({ context: bind(`${work}/context.json`), specs: ids.map(id => bind(`${work}/${id}/initial/spec.json`)) }, null, 2))
}

function freeze() {
  const context = load(`${work}/context.json`)
  for (const binding of Object.values(context.bindings)) validateBinding(binding)
  const observations = load(`${work}/author-pixel-observations.json`)
  const figures = ids.map(id => {
    const observed = observations.figures.find(figure => figure.id === id)
    assert(observed)
    const revision = observed.repairsUsed ? 'repair-1' : 'initial'
    const dir = `${work}/${id}/${revision}`
    const spec = load(`${dir}/spec.json`)
    const render = load(`${dir}/render.json`)
    const previews = load(`${dir}/width-previews.json`)
    assert.deepEqual(spec.source.authoritativeText, context.authoritativeText)
    assert.equal(render.spec.sha256, sha(`${dir}/spec.json`))
    validateBinding(render.output.svg)
    const images = previews.previews.map(preview => {
      validateBinding(preview)
      const opened = observed.images.find(image => path.resolve(image.path) === path.resolve(preview.path))
      assert(opened?.actuallyOpened && opened.openCount === 1 && opened.detail === 'original')
      assert.equal(opened.sha256, preview.sha256)
      return { ...preview, ...opened }
    })
    assert.deepEqual(images.map(image => image.width), [640, 331, 342])
    return {
      id, status: render.status === 'pass' && observed.findings.length === 0
        ? 'frozen-author-candidate-awaiting-independent-gate' : 'blocked-author-candidate',
      bindings: {
        source: spec.source.image, context: bind(`${work}/context.json`),
        lesson: context.bindings.lesson, lessonSnapshot: context.snapshots.lesson,
        proseFreeze: context.bindings.proseFreeze, canonicalSource: context.bindings.canonicalSource,
        sourceInventory: context.bindings.sourceInventory,
        spec: bind(`${dir}/spec.json`), render: bind(`${dir}/render.json`),
        svg: bind(`${dir}/${id}.svg`), fullPNG: bind(`${dir}/${id}.png`),
        previewManifest: bind(`${dir}/width-previews.json`),
      },
      fieldArrowCount: spec.objects.filter(object => /^field-arrow-\d+$/.test(object.id)).length,
      sourceOriginalOpenReused: { actuallyOpenedBeforeFinalProseFreeze: true, priorOpenCount: 1, reopened: false },
      native: { status: render.status, assertionCount: spec.assertions.length, collisions: render.collisions, displayChecks: render.displayChecks },
      previews: images, authorObservations: observed,
      budget: { initialRenderInvocations: 1, repairsUsed: observed.repairsUsed, repairRenderInvocations: observed.repairsUsed, maximumRepairs: 1, remainingRepairs: 1 - observed.repairsUsed },
    }
  })
  const file = `${ticket}/d019-n73-figures-author-freeze.json`
  writeNew(file, {
    ticket: 'STEMROBIN-181', batch: 'D019', lesson: lessonId, author: 'Einstein',
    role: 'modern-figure-author-only',
    status: figures.some(figure => figure.status.startsWith('blocked')) ? 'blocked-author-candidates' : 'frozen-awaiting-main-unique-independent-figure-gate',
    bindings: {
      context: bind(`${work}/context.json`), lesson: context.bindings.lesson,
      proseFreeze: context.bindings.proseFreeze, canonicalSource: context.bindings.canonicalSource,
      sourceInventory: context.bindings.sourceInventory,
      geometryConstruction: bind(`${work}/geometry-construction.initial.json`),
      authorObservations: bind(`${work}/author-pixel-observations.json`),
      authorHelper: bind(`${work}/author.mjs`),
      nativeFontBridge: bind(`${work}/native-font-previews.mjs`),
      nativeRenderer: bind('.agents/skills/ld-s10y-image/scripts/render_spec.mjs'),
      nativeValidator: bind('.agents/skills/ld-s10y-image/scripts/validate_spec.py'),
    },
    fullAuthoritativeTextPerBlockBound: true, originalTasks: 0,
    figures, unresolvedSourceDetail: context.sourceInventory.figures.map(figure => ({ id: figure.id, uncertainties: figure.uncertainties })),
    originalPixelsReopened: false, earlierPassedFiguresReopenedOrChanged: false,
    independentApproval: false, scienceSelfApproval: false,
    modernProseOrSourceOrTemplateOrDurableOrDbOrGitChanges: false,
    svgHandEdited: false, promotionOrFinalize: false,
    browser: 'Existing deterministic native renderer isolated headless sessions and byte-identical inherited font bridge only; network blocked, no user browser.',
    inFlightProcesses: [],
  })
  console.log(JSON.stringify({ freeze: bind(file), figures: figures.map(({ id, status, budget }) => ({ id, status, budget })), inFlightProcesses: [] }, null, 2))
}

if (process.argv[2] === 'author') author()
else if (process.argv[2] === 'freeze') freeze()
else throw new Error('Only author/freeze; no independent review or promotion')
