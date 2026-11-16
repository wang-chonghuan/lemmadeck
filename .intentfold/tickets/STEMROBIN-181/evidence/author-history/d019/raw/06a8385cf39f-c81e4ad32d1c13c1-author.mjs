import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

const work = '.tmp/STEMROBIN-181/9p-d019-n69-figures'
const tmp = '.intentfold/tickets/STEMROBIN-181/tmp'
const card = 'phy9-c2-s2-n69'
const template = `.tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons/${card}/lesson.template.json`
const sourceLesson = `ssot-resources/soviet10year-textbooks/artifacts/9p/lessons/${card}/lesson.json`
const expectedTemplate = 'c5ed2a7630afc930caaefe0d8e7762a97700132aa1dba01973c1f11e445f56b5'
const freezePath = `${tmp}/d019-n69-figures-author-freeze.json`
const ids = ['fig-121', 'fig-122', 'fig-123', 'fig-124']
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: file, sha256: sha(file) })
const load = file => JSON.parse(fs.readFileSync(file, 'utf8'))
function writeNew(file, value) {
  assert(!fs.existsSync(file), `Preserve recorded bytes: ${file}`)
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`)
}
function snapshot(file, target) {
  assert(!fs.existsSync(target), `Preserve snapshot: ${target}`)
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.copyFileSync(file, target)
  assert.equal(sha(file), sha(target))
  return bind(target)
}
const text = (id, at, value, size = 32) => ({
  id, type: 'text', at, text: value, fontSize: size, fontWeight: 600,
  labelColor: 'ink', labelPlacement: { position: 'CENTER', gap: 0 },
})
const point = (id, at) => ({ id, type: 'point', at, visible: false })
const segment = (id, from, to, stroke = 'ink', width = 3) => ({
  id, type: 'segment', from, to, stroke, strokeWidth: width,
})
const circle = (id, center, radius, stroke = 'ink') => ({
  id, type: 'circle', center, radius, stroke, strokeWidth: 2.5, fill: 'paper', fillOpacity: 0,
})
const connects = (id, arrow, from, to) => ({ id, type: 'connects', arrow, from, to })
const count = (id, objectType, amount) => ({ id, type: 'objectCount', objectType, count: amount })
const inside = (id, anchored, container) => ({ id, type: 'inside', point: anchored, container })
const pathObject = (id, d, stroke = 'ink', width = 3, fill = 'paper', opacity = 0) => ({
  id, type: 'svgPath', d, stroke, strokeWidth: width, fill, fillOpacity: opacity,
})
const group = (id, description, objects, assertions = []) => ({ id, description, objects, assertions })

function base(id, context, height, description) {
  return {
    schema: 'ld-s10y-image/figure-spec@2', id, mode: 'deterministic', description,
    source: {
      image: context.sourceImages.find(item => item.id === id).binding,
      authoritativeText: [
        { lesson: card, text: context.lesson.data.printed_title },
        ...context.lesson.data.prose.filter(item => item.text.trim()).map(item => ({ lesson: card, text: item.text })),
      ],
      inventory: [],
    },
    canvas: { width: 640, height, boundingBox: [0, height, 640, 0], background: 'paper', keepAspectRatio: true },
    display: { purpose: 'instructional', layout: 'inline', widths: [640, 331, 342], minTextPx: 16 },
    objects: [], assertions: [],
  }
}

const positivePixels = [
  [156, 57], [233, 56], [309, 57], [386, 58],
  [78, 133], [156, 135], [233, 135], [309, 135], [386, 136],
  [77, 212], [154, 212], [232, 214], [307, 213], [385, 214],
]
const negativePixels = [
  [118, 40], [204, 60], [268, 38], [341, 42], [419, 44],
  [109, 86], [183, 101], [257, 96], [359, 97], [416, 116], [49, 116],
  [209, 155], [96, 169], [176, 170], [331, 166], [425, 170],
  [41, 229], [111, 220], [197, 232], [258, 198], [339, 234],
]

function figure121(context) {
  const spec = base('fig-121', context, 450,
    'Source-visible positive ions and mobile electrons in one metal frame. Only fourteen readable plus signs and twenty-one readable minus signs are transcribed; the obscured upper-left ink supplies no inferred sign or hidden particle count. Icons are schematic, not equal unit charges or a quantitative neutrality census.')
  const transform = ([x, y]) => [35 + x * 1.25, 405 - y * 1.25]
  spec.objects.push({
    id: 'metal-frame', type: 'polygon',
    points: [[55, 381], [590, 375], [579, 91], [58, 95]],
    stroke: 'ink', strokeWidth: 3, fill: 'paper', fillOpacity: 0,
  })
  const signObjects = []
  for (const [prefix, pixels, value, radius] of [
    ['positive', positivePixels, '+', 18], ['negative', negativePixels, '\u2212', 13],
  ]) {
    for (const [index, pixel] of pixels.entries()) {
      const at = transform(pixel)
      const ringId = `${prefix}-${index + 1}-ring`
      const signId = `${prefix}-${index + 1}-sign`
      spec.objects.push(circle(ringId, at, radius), text(signId, at, value))
      spec.assertions.push(inside(`${signId}-inside-frame`, signId, 'metal-frame'))
      signObjects.push(ringId, signId)
    }
  }
  spec.objects.push({
    id: 'source-unreadable-region', type: 'polygon',
    points: [[58, 377], [118, 377], [155, 344], [143, 320], [83, 350], [58, 350]],
    stroke: 'muted', strokeWidth: 2, fill: 'grid', fillOpacity: 1,
  })
  for (const [index, offset] of [0, 12, 24, 36, 48].entries()) {
    spec.objects.push(segment(`unreadable-hatch-${index}`, [63 + offset, 370], [77 + offset, 354], 'muted', 2))
  }
  spec.objects.push(
    text('diagram-title', [320, 425], 'Metal: schematic carriers'),
    text('unreadable-note', [320, 59], 'Hatched area: unreadable source'),
    text('nonquantitative-note', [320, 24], 'Not a quantitative charge count'),
  )
  spec.assertions.push(count('readable-signed-circles', 'circle', 35))
  spec.source.inventory = [
    group('single-metal-frame', 'One irregular source frame encloses all readable carrier symbols. No scale, axis, motion arrow, or measured grid occurs.', ['metal-frame']),
    group('readable-positive-ions', 'Fourteen fully readable circled plus signs: four in the upper readable row, five in the middle row, five in the lower row. The first upper-left source area is occluded, not a reconstructed fifteenth signed ion.', signObjects.filter(id => id.startsWith('positive-')), spec.assertions.filter(item => item.id.startsWith('positive-')).map(item => item.id)),
    group('readable-electrons', 'Twenty-one individually readable smaller circled minus signs lie between and around the positive circles. Their source-relative locations are retained without treating each symbol as one elementary charge balancing one positive icon.', signObjects.filter(id => id.startsWith('negative-')), spec.assertions.filter(item => item.id.startsWith('negative-')).map(item => item.id)),
    group('unreadable-source-ink', 'The upper-left frame and nearby partial particle-like ink are obscured. A declared modern hatched region substitutes for unreadable ink, not for an invented sign or particle. No charge or hidden count is assigned.', ['source-unreadable-region', ...Array.from({ length: 5 }, (_, index) => `unreadable-hatch-${index}`)]),
    group('source-visible-carrier-total-only', 'The executable circle count covers only the thirty-five readable signed circles, never the occluded source region or the full physical metal.', signObjects, ['readable-signed-circles']),
  ]
  spec.modernAdditions = ['English model title and uncertainty/nonquantitative notes.', 'Regularized carrier circle outlines and approximate uncalibrated positions; no hidden symbols restored.']
  return spec
}

function figure122(context) {
  const spec = base('fig-122', context, 565,
    'A single unmarked metal-sphere circle lies in the initial applied field. Eight solid horizontal arrows point right; four cross the circle and two lie above and below it. This is the initial applied-field diagram, not a nonzero total field in an equilibrated conductor.')
  const center = [260, 288]
  const radius = 126
  spec.objects.push(circle('metal-sphere', center, radius))
  const rows = [477, 423, 369, 315, 261, 207, 153, 99]
  for (const [index, y] of rows.entries()) {
    const id = `applied-field-${index + 1}`
    spec.objects.push(
      point(`${id}-start`, [60, y]), point(`${id}-tip`, [565, y]),
      { id, type: 'arrow', from: `${id}-start`, to: `${id}-tip`, stroke: 'ink', strokeWidth: 3 },
    )
    spec.assertions.push(
      connects(`${id}-connects`, id, `${id}-start`, `${id}-tip`),
      { id: `${id}-rightward`, type: 'displacement', from: `${id}-start`, to: `${id}-tip`, dx: 505, dy: 0 },
    )
    if (index) spec.assertions.push({
      id: `${id}-parallel`, type: 'parallel', a: [60, rows[0]], b: [565, rows[0]], c: [60, y], d: [565, y],
    })
  }
  spec.objects.push(text('initial-field-title', [320, 536], 'Initial applied field'), text('field-vector-symbol', [573, 48], 'E\u20d7', 36))
  spec.assertions.push(
    { id: 'sphere-right-radius', type: 'pointOnCircle', point: [386, 288], center, radius },
    count('source-eight-field-arrows', 'arrow', 8),
    count('single-source-sphere', 'circle', 1),
  )
  spec.source.inventory = [
    group('single-unmarked-sphere', 'One circular sphere outline without charge signs, point labels or nuclear/orbit symbols; the source circle crosses four of eight field lines.', ['metal-sphere'], ['sphere-right-radius', 'single-source-sphere']),
    group('eight-applied-field-lines', 'Eight solid horizontal lines all have rightward arrowheads: two above the sphere, four through it, two below. Hidden endpoint anchors are construction only and introduce no source dots.', rows.map((_, index) => `applied-field-${index + 1}`), spec.assertions.filter(item => item.id.startsWith('applied-field-')).map(item => item.id).concat('source-eight-field-arrows')),
    group('source-vector-label', 'The source has E with an overhead right-pointing vector mark at the lower-right, retained as a readable mathematical label.', ['field-vector-symbol']),
  ]
  spec.modernAdditions = ['English initial-applied-field qualifier follows the authoritative prose; no equilibrium claim or surface charges added.']
  return spec
}

function figure124(context) {
  const height = 800
  const spec = base('fig-124', context, height,
    'Deterministic apparatus schematic: open wire-mesh cylinder on three supports and an elliptical metal base, movable central rod through a top aperture, three visible exterior foil strips and the paired leaves below the lower rim. The shown source stage has the paired leaves outside the cylinder; it does not depict a closed-shell equilibrium proof or hidden material identities.')
  const at = ([x, y]) => [x, height - y]
  const ellipse = (id, cx, cy, rx, ry, stroke = 'ink', width = 3) =>
    pathObject(id, `M ${cx - rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx + rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx - rx} ${cy}`, stroke, width)
  spec.objects.push(ellipse('elliptical-metal-base', 285, 666, 225, 55))
  const supports = [
    ['left-support', [166, 457], [107, 657]],
    ['right-support', [406, 457], [447, 699]],
    ['rear-support', [320, 461], [324, 614]],
  ]
  for (const [id, top, bottom] of supports) {
    spec.objects.push(point(`${id}-top`, at(top)), point(`${id}-foot`, at(bottom)), segment(id, `${id}-top`, `${id}-foot`, 'ink', 5))
    spec.assertions.push(connects(`${id}-connects`, id, `${id}-top`, `${id}-foot`))
  }
  spec.objects.push(
    ellipse('cylinder-top-rim', 285, 171, 130, 43),
    ellipse('cylinder-bottom-rim', 285, 450, 130, 43),
    pathObject('left-cylinder-side', 'M 155 171 L 155 450', 'ink', 4),
    pathObject('right-cylinder-side', 'M 415 171 L 415 450', 'ink', 4),
  )
  const meshIds = []
  for (const [index, y] of [206, 241, 276, 311, 346, 381, 416].entries()) {
    const id = `mesh-horizontal-${index}`
    spec.objects.push(ellipse(id, 285, y, 130, 24, 'muted', 2))
    meshIds.push(id)
  }
  for (const [index, x] of [174, 196, 218, 240, 262, 284, 306, 328, 350, 372, 394].entries()) {
    const id = `mesh-vertical-${index}`
    const offset = (x - 285) / 130
    const dy = Math.sqrt(1 - offset * offset) * 43
    spec.objects.push(pathObject(id, `M ${x} ${171 + dy} L ${x} ${450 + dy}`, 'muted', 2))
    meshIds.push(id)
  }
  spec.objects.push(
    point('rod-top', at([285, 41])), point('rod-aperture-center', at([285, 171])), point('rod-leaf-joint', at([285, 550])),
    segment('movable-rod-upper', 'rod-top', 'rod-aperture-center', 'ink', 6),
    segment('movable-rod-lower', 'rod-aperture-center', 'rod-leaf-joint', 'ink', 4),
    ellipse('rod-aperture-rim', 285, 171, 37, 13),
    pathObject('rod-top-knob', 'M 277 42 L 277 24 Q 285 14 293 24 L 293 42 Z', 'ink', 2, 'ink', 1),
  )
  spec.assertions.push(
    connects('upper-rod-connects', 'movable-rod-upper', 'rod-top', 'rod-aperture-center'),
    connects('lower-rod-connects', 'movable-rod-lower', 'rod-aperture-center', 'rod-leaf-joint'),
    { id: 'rod-straight-through-aperture', type: 'collinear', a: 'rod-top', b: 'rod-aperture-center', c: 'rod-leaf-joint' },
    { id: 'source-shown-leaves-below-rim', type: 'displacement', from: [285, height - 450], to: 'rod-leaf-joint', dx: 0, dy: -100 },
  )
  const leaves = [
    ['exterior-left-leaf', [[155, 257], [117, 319], [108, 311], [145, 253]]],
    ['exterior-right-leaf', [[415, 257], [452, 322], [462, 316], [425, 253]]],
    ['exterior-front-leaf', [[219, 283], [186, 368], [175, 364], [209, 278]]],
    ['movable-left-leaf', [[285, 550], [259, 617], [270, 622], [289, 558]]],
    ['movable-right-leaf', [[285, 550], [308, 617], [319, 619], [289, 555]]],
  ]
  for (const [id, vertices] of leaves) spec.objects.push({
    id, type: 'polygon', points: vertices.map(at), stroke: 'ink', strokeWidth: 2.5, fill: 'paper', fillOpacity: 1,
  })
  spec.objects.push(
    text('rod-label', at([460, 75]), 'Movable rod'),
    text('screen-label', at([515, 214]), 'Wire screen'),
    text('outside-stage-label', at([320, 760]), 'Shown: leaves outside'),
  )
  spec.assertions.push(count('source-visible-foil-strips', 'polygon', 5))
  spec.source.inventory = [
    group('wire-cylinder-source', 'One open cylindrical mesh cage with top elliptical rim, bottom rim and side silhouettes. Source wires are irregular, overlapping and partly obscured, not a countable measured grid. Modern uniform mesh strands are explicitly schematic regularization, not recovered cell counts.', ['cylinder-top-rim', 'cylinder-bottom-rim', 'left-cylinder-side', 'right-cylinder-side', ...meshIds]),
    group('support-and-base-source', 'Three visible support legs descend from the cage to one broad elliptical base; the rear leg remains separate from the movable central rod.', ['elliptical-metal-base', ...supports.map(item => item[0])], supports.map(item => `${item[0]}-connects`)),
    group('movable-rod-and-aperture-source', 'One central vertical movable rod with a dark upper knob passes through a visible top aperture and continues below the cage to the paired leaf joint. No insulating material, electrical connection or hidden rod attachment is inferred from dark overlaps.', ['movable-rod-upper', 'movable-rod-lower', 'rod-aperture-rim', 'rod-top-knob'], ['upper-rod-connects', 'lower-rod-connects', 'rod-straight-through-aperture', 'source-shown-leaves-below-rim']),
    group('visible-foil-source', 'Three visible splayed exterior strips occur at left, right and front-left cage locations. Two narrower paired strips meet at the lower rod joint below the bottom rim; they are shown outside, not silently moved into the cavity. Their source material cannot be distinguished visually and is not labelled tin or gold.', leaves.map(item => item[0]), ['source-visible-foil-strips']),
  ]
  spec.modernAdditions = [
    'English apparatus labels and an explicit shown-outside stage qualifier; the one source stage is not replaced by an invented second stage.',
    'Wire mesh regularization preserves openings and cage topology without claiming measured mesh dimensions or perfect electrostatic shielding.',
    'Convenient dimensions are schematic, never source measurements. No force arrows, charge signs, deflection angles, voltage or operation instructions are added.',
  ]
  return spec
}

function author() {
  assert.equal(sha(template), expectedTemplate, 'Use only the dispatched frozen complete prose')
  assert(!fs.existsSync(`${work}/context.json`))
  const lesson = load(template)
  const raw = load(sourceLesson)
  assert.equal(lesson.prose.length, 18)
  assert.equal(lesson.exercise_count, 0)
  const context = {
    schema: 'ld-s10y-image/context@1', book: '9p', edition: 'modern-us-neutral', lessonId: card,
    lesson: { binding: bind(template), snapshot: snapshot(template, `${work}/lesson.template.snapshot.json`), data: lesson },
    canonicalSource: { binding: bind(sourceLesson), snapshot: snapshot(sourceLesson, `${work}/source.lesson.snapshot.json`), data: raw },
    authority: 'The entire frozen modern prose is authoritative; original PNGs supply visual facts. This is author evidence, not SCI or independent figure approval.',
    sourceImages: ids.map(id => ({
      id, binding: bind(`ssot-resources/soviet10year-textbooks/artifacts/9p/figures/${id}.png`),
      actualOriginalOpened: true, detail: 'original', author: 'session-D-n69-figure-author',
    })),
  }
  writeNew(`${work}/context.json`, context)
  writeNew(`${tmp}/d019-n69-figure-source-inventory.json`, {
    role: 'source-image-inventory-by-figure-author-not-source-page-regate',
    context: bind(`${work}/context.json`),
    originalPNGsOpenedSeparately: true, fullSourcePagesReopened: false,
    figures: [
      { id: 'fig-121', source: context.sourceImages[0].binding, readablePositivePixels: positivePixels, readableNegativePixels: negativePixels,
        facts: ['One irregular closed frame; fourteen readable circled pluses and twenty-one readable circled minuses.', 'Upper-left frame/particle ink is occluded; neither its sign nor any hidden particle count is asserted. No source arrows or calibrated axis.'],
        limits: ['Readability counts are not elementary-charge counts or a quantitative metal neutrality census.', 'Source relative positions are approximate display coordinates, not measurements.'] },
      { id: 'fig-122', source: context.sourceImages[1].binding,
        facts: ['One unmarked circular sphere.', 'Eight solid horizontal field lines point right; four cross the circle, two above, two below.', 'Lower-right E has an overhead vector arrow.'],
        interpretation: 'Initial applied field consistent with the frozen prose; not equilibrium total field.' },
      { id: 'fig-123', source: context.sourceImages[2].binding,
        facts: ['One sphere outline.', 'Five readable plus signs on the left and five minus signs on the right.', 'Six dashed interior horizontal lines have rightward arrowheads; solid paths have different directions and curved exterior extensions.', 'No source text label distinguishes initial/external/induced/total fields.'],
        conflict: 'The authoritative prose follows electrons moving left under a rightward applied field, hence negative left and positive right; the printed source signs are opposite.',
        unavailableInference: 'Do not declare every unclear exterior arrowhead direction or silently swap charge signs.' },
      { id: 'fig-124', source: context.sourceImages[3].binding,
        facts: ['Open cylindrical wire-mesh cage with top and lower elliptical rims.', 'Movable central rod with dark upper knob and top aperture; lower paired leaves are outside below the cage.', 'Three support legs and one broad elliptical base.', 'Three visible splayed exterior foil strips and the two lower rod leaves; no printed labels/signs/scales.'],
        limits: ['Dark overlap does not determine hidden electrical/insulating joints.', 'Mesh wire counts and tin/gold identity are not measurements recoverable from these pixels.'] },
    ],
  })
  for (const spec of [figure121(context), figure122(context), figure124(context)]) writeNew(`${work}/${spec.id}/initial/spec.json`, spec)
  writeNew(`${work}/fig-123/source-conflict-blocker.json`, {
    id: 'fig-123', status: 'blocked-source-sign-conflict', repairsUsed: 0, maximumTargetedRepairs: 1,
    bindings: { source: context.sourceImages[2].binding, context: bind(`${work}/context.json`), lesson: context.lesson.binding, inventory: bind(`${tmp}/d019-n69-figure-source-inventory.json`) },
    sourceFacts: 'Actual PNG prints positive signs left and negative signs right; six interior dashed arrows point right.',
    modernPhysics: 'For the rightward applied field and electron transfer left in the dispatched prose, the induced negative net charge is left and positive net charge is right; the induced interior field must oppose the applied field.',
    contractLimit: 'Existing source-image inventory maps original source requirements. The contract has no approved source-figure charge-sign/arrow substitution erratum. source.authoredBasis only supports new fig-choice- diagrams and cannot replace this source image. Merely declaring a swap in prose would not authorize a source-fidelity claim.',
    outcome: 'No spec or SVG rendered for this contradictory source diagram. Do not silently correct or publish the printed configuration as the prose example.',
    independentDecisionPending: true,
  })
  console.log(JSON.stringify({
    context: bind(`${work}/context.json`),
    inventory: bind(`${tmp}/d019-n69-figure-source-inventory.json`),
    specs: ['fig-121', 'fig-122', 'fig-124'].map(id => bind(`${work}/${id}/initial/spec.json`)),
    blocked: bind(`${work}/fig-123/source-conflict-blocker.json`),
  }, null, 2))
}

function freeze() {
  const context = load(`${work}/context.json`)
  assert.equal(sha(template), context.lesson.binding.sha256, 'Context drift must not be hidden')
  assert.equal(sha(sourceLesson), context.canonicalSource.binding.sha256)
  const observationsPath = `${work}/author-observations.json`
  const observations = load(observationsPath)
  const figures = ids.map(id => {
    if (id === 'fig-123') return {
      id, status: 'blocked-source-sign-conflict', contextKind: 'lesson', repairsUsed: 0, maximumTargetedRepairs: 1,
      bindings: load(`${work}/fig-123/source-conflict-blocker.json`).bindings,
      blocker: bind(`${work}/fig-123/source-conflict-blocker.json`),
      nativeRenderInvocations: 0, candidateProduced: false,
    }
    const observation = observations.figures.find(item => item.id === id)
    assert(observation)
    const dir = `${work}/${id}/${observation.finalAttempt}`
    const render = load(`${dir}/render.json`)
    const spec = load(`${dir}/spec.json`)
    assert.equal(render.spec.sha256, sha(`${dir}/spec.json`))
    assert.equal(sha(spec.source.image.path), spec.source.image.sha256)
    assert.equal(sha(`${dir}/${id}.svg`), render.output.svg.sha256)
    const widthManifest = load(`${dir}/width-previews.json`)
    const previews = widthManifest.previews.map(item => {
      const opened = observation.images.find(image => path.resolve(image.path) === path.resolve(item.path))
      assert(opened?.actuallyOpened && opened.detail === 'original')
      assert.equal(sha(item.path), item.sha256)
      assert.equal(opened.sha256, item.sha256)
      return { ...item, actualOpened: true, authorObservation: opened.observations, detail: 'original' }
    })
    assert.equal(previews.length, 3)
    assert(observation.images.some(item => item.path === `${dir}/${id}.png` && item.actuallyOpened))
    return {
      id, contextKind: 'lesson', mode: 'deterministic',
      status: render.status === 'pass' && !observation.defects.length ? 'frozen-author-candidate' : 'blocked-author-candidate',
      repairsUsed: observation.repairsUsed, maximumTargetedRepairs: 1,
      bindings: {
        source: spec.source.image, context: bind(`${work}/context.json`), lesson: context.lesson.binding,
        lessonSnapshot: context.lesson.snapshot, spec: bind(`${dir}/spec.json`), render: bind(`${dir}/render.json`),
        svg: bind(`${dir}/${id}.svg`), png: bind(`${dir}/${id}.png`), previews: bind(`${dir}/width-previews.json`),
      },
      previews, nativeStatus: render.status, authorObservations: observation,
      assertions: spec.assertions.map(item => item.id), independentApproval: false,
      preservedInitialFailure: observation.repairsUsed ? {
        spec: bind(`${work}/${id}/initial/spec.json`),
        render: bind(`${work}/${id}/initial/render.json`),
        svg: bind(`${work}/${id}/initial/${id}.svg`),
        png: bind(`${work}/${id}/initial/${id}.png`),
        previews: bind(`${work}/${id}/initial/width-previews.json`),
        repair: bind(`${work}/${id}/repair/repair-record.json`),
      } : null,
    }
  })
  writeNew(freezePath, {
    ticket: 'STEMROBIN-181', batch: 'D019', lesson: card,
    role: 'modern-figure-author-only', status: 'frozen-with-native-and-source-figure-blockers',
    bindings: {
      context: bind(`${work}/context.json`), lesson: context.lesson.binding, sourceLesson: context.canonicalSource.binding,
      inventory: bind(`${tmp}/d019-n69-figure-source-inventory.json`), authorHelper: bind(`${work}/author.mjs`),
      observations: bind(observationsPath),
      renderer: bind('.agents/skills/ld-s10y-image/scripts/render_spec.mjs'),
      validator: bind('.agents/skills/ld-s10y-image/scripts/validate_spec.py'),
      fontPreviewBridge: bind('.tmp/STEMROBIN-181/9p-d019-n67-figures/native-font-previews.mjs'),
    },
    figures, originalPNGsOpenedIndividually: true, completeProseRead: true,
    sourcePageOrSCIReviewRepeated: false, independentApproval: false,
    productTemplateIndexDbWrites: false, sourceSignConflictNotSilentlyCorrected: true,
    remaining: ['Main unique independent figure gate for usable candidates', 'Main source-sign conflict decision for123; n69 is not complete'],
    inFlightProcesses: [],
  })
  console.log(JSON.stringify({ freeze: bind(freezePath), figures: figures.map(item => ({ id: item.id, status: item.status, repairsUsed: item.repairsUsed })) }, null, 2))
}

if (process.argv[2] === 'author') author()
else if (process.argv[2] === 'freeze') freeze()
else throw new Error('Expected author or freeze')
