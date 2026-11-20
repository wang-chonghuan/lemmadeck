import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

const cwd = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck'
assert.equal(process.cwd(), cwd)
const author = path.join(cwd, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d185-n21-figures32-33-author')
const output = path.join(cwd, '.tmp/STEMROBIN-181/d1816-d185/figures')
const hash = data => crypto.createHash('sha256').update(data).digest('hex')
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const binding = file => {
  const data = fs.readFileSync(file)
  return { path: file, bytes: data.length, sha256: hash(data) }
}
const inBoundary = file => assert.ok(
  file.startsWith(`${author}/`) || file.startsWith(`${output}/`),
  `Write outside bounded author scope: ${file}`,
)
function writeNew(file, value, immutable = false) {
  inBoundary(file)
  fs.mkdirSync(path.dirname(file), { recursive: true })
  const data = typeof value === 'string' ? value : `${JSON.stringify(value, null, 2)}\n`
  fs.writeFileSync(file, data, { flag: 'wx' })
  if (immutable) fs.chmodSync(file, 0o444)
  return binding(file)
}
function copyNew(source, target, expected) {
  inBoundary(target)
  const actual = binding(source)
  if (expected) {
    assert.equal(actual.bytes, expected.bytes, `Byte drift: ${source}`)
    assert.equal(actual.sha256, expected.sha256, `Hash drift: ${source}`)
  }
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.copyFileSync(source, target, fs.constants.COPYFILE_EXCL)
  fs.chmodSync(target, 0o444)
  return { original: actual, frozen: binding(target) }
}

function prepare() {
  const inputPath = path.join(author, 'input-freeze.json')
  const input = read(inputPath)
  const contexts = input.contexts.map(item => {
    assert.deepEqual(binding(item.path), item)
    return read(item.path)
  })
  assert.equal(input.nativeContextCalls, 4)
  assert.equal(input.paidCalls, 0)
  const copies = []
  const freeze = (file, relative, expected) => {
    const item = copyNew(file, path.join(author, 'frozen', relative), expected)
    copies.push(item)
    return item.frozen
  }
  freeze(inputPath, 'input/input-freeze.json')
  freeze(path.join(author, 'dispatch-record.json'), 'input/dispatch-record.json')
  for (const item of input.contexts) freeze(item.path, `context/${path.basename(item.path)}`, item)
  for (const item of input.sources) {
    const relative = path.relative(path.join(cwd, 'ssot-resources/soviet10year-textbooks/artifacts/10p'), item.path)
    freeze(item.path, `source/${relative}`, item)
  }
  for (let index = 0; index < input.drafts.length; index += 1) {
    const draft = input.drafts[index]
    const edition = index < 3 ? 'modern-us-neutral' : 'modern-us-neutral-en'
    for (const [role, item] of Object.entries(draft)) {
      freeze(item.path, `current/${role}/${edition}/${path.basename(item.path)}`, item)
    }
  }
  const native = []
  for (const context of contexts) {
    for (const [language, item] of Object.entries(context.nativeContexts)) {
      const receipt = freeze(item.path, `native/${language}/${path.basename(item.path)}`, item)
      native.push({ figure: context.figure, language, receipt, producerReplayed: false })
    }
    freeze(context.sourceImage.path, `current/source-images/${context.figure}.png`, context.sourceImage)
    freeze(path.join(author, `${context.figure}.source-inventory.json`), `inventory/${context.figure}.source-inventory.json`)
  }
  const texts = {}
  for (const [language, item] of Object.entries(contexts[0].languages)) {
    assert.equal(item.fullText, contexts[1].languages[language].fullText)
    assert.equal(item.fullText, item.blocks.filter(block => block.text).map(block => block.text).join('\n\n'))
    texts[language] = writeNew(path.join(author, `frozen/fulltext/${language}.txt`), item.fullText, true)
    const lesson = read(item.lesson.path)
    assert.equal(item.fullText, lesson.prose.filter(block => block.text).map(block => block.text).join('\n\n'))
  }
  const collected = read(input.textReview.path)
  assert.equal(collected.scienceVerdict, 'pass')
  assert.equal(collected.zhVerdict, 'pass')
  assert.equal(collected.enVerdict, 'pass')
  freeze(input.textReview.path, 'evidence/D195-parent-collected.json', input.textReview)
  const review = read(path.join(cwd, collected.freeze.path))
  assert.equal(review.composedTextApproval, true)
  assert.equal(review.scope.scienceComposition.inheritedPasses, 20)
  freeze(path.join(cwd, collected.report.path), 'evidence/D195-report.json', collected.report)
  freeze(path.join(cwd, collected.freeze.path), 'evidence/D195-review-freeze.json', collected.freeze)
  const retainedRoles = new Set([
    'inherited-D184-review-verdicts',
    'collected-D184-review-binding',
    'collected-D194-repair-binding',
    'D194-repair-report-binding-not-independent-verdict',
    'D194-author-freeze-binding',
  ])
  for (const item of review.fileBindings.filter(item => retainedRoles.has(item.role))) {
    freeze(item.path, `evidence/${item.role}/${path.basename(item.path)}`, item)
  }
  const routing = {
    schema: 'ld-s10y-image/author-routing@1',
    batch: 'D185',
    figures: {
      'fig-32': {
        status: 'HOLD',
        modeRequired: 'hybrid',
        reason: 'The source is a physical CRT oscilloscope illustration. Apparatus identity, screen, handle, control and leads require semantic artwork, with any exact screen trace/lattice as a deterministic overlay. No model/network/paid generation is authorized. Do not substitute a made-up geometric apparatus or omit the apparatus to publish only a curve.',
        extraSourceUncertainty: 'Exact screen lattice count is unresolved in the degraded PNG. No numeric time/voltage calibration may be invented.',
        safety: 'Historical description only. No outlet, mains connection, or child experiment will be authored.',
        specProduced: false,
        candidateProduced: false,
        independentApproval: false,
      },
      'fig-33': {
        status: 'AUTHOR_IN_PROGRESS',
        modeRequired: 'deterministic',
        reason: 'The source is a schematic edge-on plane/loop, uniform field, directed vectors, angle and rotation curve. It contains no indispensable pictorial apparatus or semantic scene.',
        display: contexts[1].defaultDisplay,
        modernRegularization: [
          'Use exact parallel horizontal field lines at equal schematic spacing; spacing is not numerical source data.',
          'Use a narrow capsule with two parallel sides and rounded caps for the edge-on loop outline.',
          'Choose exact perpendicular normal/loop directions matching the source projection.',
          'Regularize the source alpha stroke and rotation curve into circular arcs; preserve their distinct meanings and directions.',
          'Increase the three existing labels to 26 output pixels at actual 640 px media width.',
        ],
        newVisibleLabelsOrNumbers: false,
        phaseConvention: 'The single alpha sector shows the current geometric angle between n and B. The retained approved bilingual prose explains continuously accumulated rotation phase and its identical cosine. The figure does not assert that the small sector is an unrestricted accumulated phase.',
        independentApproval: false,
      },
    },
    sourceInventoriesSavedBeforeDrawing: true,
    generationAuthorized: false,
    nativeContextProducerCallsThisAuthor: 0,
  }
  writeNew(path.join(author, 'routing.json'), routing, true)
  buildSpec(texts)
  writeNew(path.join(author, 'prepared-bindings.json'), {
    copies, texts, native,
    authority: {
      review: binding(path.join(cwd, collected.freeze.path)),
      composedTextApproval: true,
      affectedPassedBlocks: 1,
      inheritedPassedBlocks: 20,
      scienceVerdict: 'pass', zhVerdict: 'pass', enVerdict: 'pass',
      textReReviewed: false,
    },
    inputFreeze: binding(inputPath),
    imageOpenLedger: [
      { ordinal: 1, kind: 'original', figure: 'fig-32', path: contexts[0].sourceImage.path },
      { ordinal: 2, kind: 'original', figure: 'fig-33', path: contexts[1].sourceImage.path },
    ],
  }, true)
}

function buildSpec(texts) {
  const objects = []
  const assertions = []
  const inventory = []
  const point = (x, y) => [x, y]
  const origin = point(230, 200)
  const lower = point(176, 92)
  const upper = point(284, 308)
  const normalEnd = point(350, 140)
  const fieldEnd = point(410, 200)
  const add = (a, b) => a.map((v, i) => v + b[i])
  const shift = [8 / Math.sqrt(5), -4 / Math.sqrt(5)]
  const negativeShift = shift.map(value => -value)
  const upperPlus = add(upper, shift)
  const upperMinus = add(upper, negativeShift)
  const lowerPlus = add(lower, shift)
  const lowerMinus = add(lower, negativeShift)
  const arcPoint = (radius, degrees) => [
    origin[0] + radius * Math.cos(degrees * Math.PI / 180),
    origin[1] + radius * Math.sin(degrees * Math.PI / 180),
  ]
  const pushAssertion = (id, type, values) => {
    assertions.push({ id, type, ...values })
    return id
  }
  const fieldObjects = []
  const fieldAssertions = []
  const rows = [350, 275, 200, 125, 50]
  for (const [index, y] of rows.entries()) {
    const id = `field-${index + 1}`
    const from = point(36, y)
    const to = point(608, y)
    objects.push({ id, type: 'arrow', from, to, stroke: 'muted', strokeWidth: 2.5 })
    fieldObjects.push(id)
    fieldAssertions.push(pushAssertion(`${id}-direction`, 'connects', { arrow: id, from, to }))
    fieldAssertions.push(pushAssertion(`${id}-horizontal-right`, 'displacement', { from, to, dx: 572, dy: 0 }))
    if (index > 0) {
      fieldAssertions.push(pushAssertion(`${id}-parallel`, 'parallel', {
        a: point(36, rows[0]), b: point(608, rows[0]), c: from, d: to,
      }))
    }
  }
  for (let i = 0; i < 3; i += 1) {
    fieldAssertions.push(pushAssertion(`field-equal-spacing-${i + 1}`, 'equalDistance', {
      a: point(36, rows[i]), b: point(36, rows[i + 1]),
      c: point(36, rows[i + 1]), d: point(36, rows[i + 2]),
    }))
  }
  for (const [index, y] of rows.slice(1, 4).entries()) {
    const crossing = point(origin[0] + (y - origin[1]) / 2, y)
    fieldAssertions.push(pushAssertion(`field-loop-crossing-${index + 2}`, 'pointOnLine', {
      point: crossing, a: lower, b: upper,
    }))
    fieldAssertions.push(pushAssertion(`field-shared-frame-crossing-${index + 2}`, 'pointOnLine', {
      point: crossing, a: point(36, y), b: point(608, y),
    }))
  }
  inventory.push({
    id: 'uniform-field',
    description: 'Independent PNG inventory: five rightward parallel field lines in one shared frame; rows two, three and four cross the tilted edge-on loop, while the outer two do not. Equal spacing is schematic modern regularization, not given numerical calibration.',
    objects: fieldObjects, assertions: fieldAssertions,
  })
  objects.push(
    { id: 'loop-side-plus', type: 'segment', from: lowerPlus, to: upperPlus, stroke: 'ink', strokeWidth: 3 },
    { id: 'loop-side-minus', type: 'segment', from: lowerMinus, to: upperMinus, stroke: 'ink', strokeWidth: 3 },
    { id: 'loop-upper-cap', type: 'arc', center: upper, start: upperPlus, end: upperMinus, stroke: 'ink', strokeWidth: 3 },
    { id: 'loop-lower-cap', type: 'arc', center: lower, start: lowerMinus, end: lowerPlus, stroke: 'ink', strokeWidth: 3 },
  )
  const loopAssertions = [
    pushAssertion('loop-parallel-sides', 'parallel', { a: lowerPlus, b: upperPlus, c: lowerMinus, d: upperMinus }),
    pushAssertion('loop-centered-on-field', 'pointOnLine', { point: origin, a: lower, b: upper }),
    pushAssertion('loop-equal-side-lengths', 'equalDistance', { a: lowerPlus, b: upperPlus, c: lowerMinus, d: upperMinus }),
  ]
  for (const [name, center, endpoints] of [
    ['upper', upper, [upperPlus, upperMinus]],
    ['lower', lower, [lowerPlus, lowerMinus]],
  ]) {
    for (const [index, endpoint] of endpoints.entries()) {
      loopAssertions.push(pushAssertion(`loop-${name}-cap-end-${index + 1}`, 'pointOnCircle', {
        point: endpoint, center, radius: 4,
      }))
    }
  }
  inventory.push({
    id: 'edge-on-loop',
    description: 'Independent PNG inventory: one narrow tilted closed loop with two long sides and two rounded closures, rising rightward. No S label, vertex dots or separate axle. The outline is retained, not replaced by a filled face-on plane.',
    objects: ['loop-side-plus', 'loop-side-minus', 'loop-upper-cap', 'loop-lower-cap'],
    assertions: loopAssertions,
  })
  const angleNormal = add(origin, [132 / Math.sqrt(5), -66 / Math.sqrt(5)])
  const angleField = add(origin, [66, 0])
  objects.push(
    { id: 'B-vector', type: 'arrow', from: origin, to: fieldEnd, stroke: 'accent', strokeWidth: 4 },
    { id: 'normal-vector', type: 'arrow', from: origin, to: normalEnd, stroke: 'ink', strokeWidth: 3.5 },
    { id: 'alpha-sector', type: 'arc', center: origin, start: angleNormal, end: angleField, stroke: 'ink', strokeWidth: 2.5 },
    { id: 'B', type: 'text', at: point(380, 228), text: 'B\u20d7', fontSize: 26, labelPlacement: { position: 'CENTER' } },
    { id: 'n', type: 'text', at: point(262, 152), text: 'n\u20d7', fontSize: 26, labelPlacement: { position: 'CENTER' } },
    { id: 'alpha', type: 'text', at: point(337, 174), text: '\u03b1', fontSize: 26, labelPlacement: { position: 'CENTER' } },
  )
  inventory.push({
    id: 'field-normal-angle',
    description: 'Independent PNG inventory: B right and n down-right share the loop-center tail, each with a vector-accent letter. Alpha is on the small arc BETWEEN B AND n, not between the loop plane and B. Approved text supplies normal/plane perpendicularity. No numerical angle or new point label is added.',
    objects: ['B-vector', 'normal-vector', 'alpha-sector', 'B', 'n', 'alpha'],
    assertions: [
      pushAssertion('B-common-tail', 'connects', { arrow: 'B-vector', from: origin, to: fieldEnd }),
      pushAssertion('normal-common-tail', 'connects', { arrow: 'normal-vector', from: origin, to: normalEnd }),
      pushAssertion('B-along-middle-field', 'pointOnLine', { point: origin, a: point(36, 200), b: point(608, 200) }),
      pushAssertion('B-rightward', 'displacement', { from: origin, to: fieldEnd, dx: 180, dy: 0 }),
      pushAssertion('normal-down-right', 'displacement', { from: origin, to: normalEnd, dx: 120, dy: -60 }),
      pushAssertion('normal-perpendicular-to-plane', 'perpendicular', { a: lower, b: upper, c: origin, d: normalEnd }),
      pushAssertion('alpha-end-on-normal-ray', 'pointOnLine', { point: angleNormal, a: origin, b: normalEnd }),
      pushAssertion('alpha-end-on-B-ray', 'pointOnLine', { point: angleField, a: origin, b: fieldEnd }),
      pushAssertion('alpha-normal-end-radius', 'pointOnCircle', { point: angleNormal, center: origin, radius: 66 }),
      pushAssertion('alpha-B-end-radius', 'pointOnCircle', { point: angleField, center: origin, radius: 66 }),
    ],
  })
  const rotationFrom = arcPoint(62, 25)
  const rotationStart = arcPoint(62, 125)
  const rotationTo = arcPoint(62, 10)
  objects.push(
    { id: 'rotation-curve', type: 'arc', center: origin, start: rotationFrom, end: rotationStart, stroke: 'accent', strokeWidth: 2.5 },
    { id: 'rotation-head', type: 'arrow', from: rotationFrom, to: rotationTo, stroke: 'accent', strokeWidth: 2 },
  )
  inventory.push({
    id: 'rotation',
    description: 'Independent PNG inventory: one distinct curved clockwise rotation arrow above the loop center. The arc and its short terminal arrow are one composite curved arrow, not another magnetic vector. No speed or accumulated-phase number is shown.',
    objects: ['rotation-curve', 'rotation-head'],
    assertions: [
      pushAssertion('rotation-terminal-connects', 'connects', { arrow: 'rotation-head', from: rotationFrom, to: rotationTo }),
      ...[rotationStart, rotationFrom, rotationTo].map((p, index) => pushAssertion(
        `rotation-radius-${index + 1}`, 'pointOnCircle', { point: p, center: origin, radius: 62 },
      )),
    ],
  })
  const counts = [
    pushAssertion('eight-directional-arrows', 'objectCount', { objectType: 'arrow', count: 8 }),
    pushAssertion('three-existing-math-labels', 'objectCount', { objectType: 'text', count: 3 }),
    pushAssertion('no-calibration-grids', 'objectCount', { objectType: 'grid', count: 0 }),
    pushAssertion('no-calibration-axes', 'objectCount', { objectType: 'axis', count: 0 }),
    pushAssertion('no-apparatus-artwork', 'objectCount', { objectType: 'image', count: 0 }),
  ]
  inventory.push({
    id: 'absent-apparatus-and-calibration',
    description: 'Independent PNG inventory: one subfigure with eight directional arrows and exactly B, n and alpha labels; no physical apparatus, controls, electrical leads, ticks, units, coordinate grid or numerical values.',
    objects: ['B', 'n', 'alpha'], assertions: counts,
  })
  const source = binding(path.join(author, 'frozen/source/figures/fig-33.png'))
  writeNew(path.join(output, 'fig-33.spec.json'), {
    schema: 'ld-s10y-image/figure-spec@2',
    id: 'fig-33', mode: 'deterministic',
    description: 'Edge-on planar loop in a uniform magnetic field. The normal n is perpendicular to the loop plane, and alpha is the geometric angle between n and rightward B. Preserve the independent clockwise rotation arrow. The complete approved bilingual prose distinguishes the accumulated rotation phase from this instantaneous geometric sector. Coordinates and spacing are schematic, with no numeric calibration.',
    source: {
      image: { path: source.path, sha256: source.sha256 },
      authoritativeText: Object.entries(texts).map(([language, item]) => ({
        lesson: `phy10-c1-s3-n21:${language}`,
        text: fs.readFileSync(item.path, 'utf8'),
      })),
      inventory,
    },
    canvas: {
      width: 640, height: 400, boundingBox: [0, 400, 640, 0],
      background: 'paper', keepAspectRatio: true,
    },
    display: { purpose: 'instructional', layout: 'scroll', widths: [640], minTextPx: 16 },
    objects, assertions, layout: { minLabelGap: 6 },
  })
  writeNew(path.join(author, 'fig-33.geometry-basis.json'), {
    schema: 'ld-s10y-image/author-geometry-basis@1',
    coordinatesAre: 'Schematic rendering coordinates, not source-given numerical measurements.',
    sourceObservation: binding(path.join(author, 'fig-33.source-inventory.json')),
    origin, lower, upper, normalEnd, fieldEnd, fieldRows: rows,
    alpha: { center: origin, normalEnd: angleNormal, fieldEnd: angleField, labelAnchor: [337, 174] },
    rotation: { center: origin, curveBegin: rotationStart, curveEnd: rotationFrom, terminalEnd: rotationTo, direction: 'clockwise' },
    visibleAddedNumbers: 0,
    sourcePointLabels: 0,
    constructionPointsRendered: 0,
    note: 'No pointRelationships flag is claimed: the source has no marked points. Exact relationships among construction coordinates are covered by executable perpendicular, parallel, displacement, equalDistance, pointOnLine, pointOnCircle and connects assertions.',
  }, true)
}

assert.equal(process.argv[2], 'prepare')
prepare()
