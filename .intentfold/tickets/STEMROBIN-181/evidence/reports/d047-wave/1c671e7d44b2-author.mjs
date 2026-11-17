import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const A = path.dirname(fileURLToPath(import.meta.url))
const W = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const T = path.dirname(A)
const S = `${W}/.agents/skills/ld-s10y-image`
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const bind = file => ({ path: file, sha256: sha(file) })
const r = value => Number(value.toFixed(6))
const destination = name => {
  const file = path.resolve(A, name)
  assert(file.startsWith(`${A}/`))
  fs.mkdirSync(path.dirname(file), { recursive: true })
  return file
}
const write = (name, value) => {
  const file = destination(name)
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
  return bind(file)
}
const snapshots = []
const copy = (file, name, expected) => {
  if (expected) assert.equal(sha(file), expected, `Changed input ${file}`)
  const target = destination(name)
  fs.copyFileSync(file, target, fs.constants.COPYFILE_EXCL)
  assert.equal(sha(file), sha(target))
  snapshots.push({ input: bind(file), snapshot: bind(target) })
  return target
}
const command = (name, executable, args, spec) => {
  const result = spawnSync(executable, args, { cwd: W, encoding: 'utf8',
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1', TMPDIR: `${A}/browser-tmp/` },
    maxBuffer: 16 * 1024 * 1024 })
  write(name, { executable, args, cwd: W, exitCode: result.status, signal: result.signal,
    stdout: result.stdout, stderr: result.stderr, error: result.error?.message ?? null,
    spec: bind(spec), tools: args.filter(file => fs.existsSync(file) && fs.statSync(file).isFile())
      .filter(file => file.startsWith(S)).map(bind) })
  return result.status === 0
}

const n38FreezePath = `${T}/d044-10p-n38-author/author-freeze.json`
const n39FreezePath = `${T}/d045-n39-text-repair/repair-freeze.json`
assert.equal(sha(n38FreezePath), 'd5e69cdda197b60aa3d89879184a2f77401e9700539972e11da96bd086562048')
assert.equal(sha(n39FreezePath), '3220c430f340cb5d40213da415e6826a0990179e2d36b3f842a2bbd1a347febf')
const n38 = read(n38FreezePath)
const n39 = read(n39FreezePath)
const pixels = read(`${A}/png-measurements-v2.json`)
copy(n38FreezePath, 'inputs/current/n38-author-freeze.json')
copy(n39FreezePath, 'inputs/current/n39-repair-freeze.json')
for (const name of ['SKILL.md', 'references/routing.md', 'references/figure-spec.md',
  'references/quality-gate.md', 'assets/figure-spec.schema.json',
  'scripts/render_spec.mjs', 'scripts/validate_spec.py', 'scripts/materialize_arrowheads.mjs']) {
  copy(`${S}/${name}`, `inputs/contracts/${name}`)
}
const context = {}
for (const language of ['zh', 'en']) {
  const frozen38 = n38.frozen.find(item => item.language === language)
  const frozen39 = n39.outputs.find(item => item.language === language)
  const get38 = (key, target) => copy(frozen38[key].path,
    `inputs/current/n38/${language}/${target}`, frozen38[key].sha256)
  const template38 = get38('template', 'lesson.template.json')
  const ex38 = get38('exercisesTemplate', 'exercises.template.json')
  get38('figuresTemplate', 'figures.template.json')
  const prose38 = get38('readingText', 'prose.md')
  get38('currentProse', 'prose.json')
  const template39 = copy(path.resolve(W, frozen39.frozen.path),
    `inputs/current/n39/${language}/lesson.template.json`, frozen39.frozen.sha256)
  const prose39 = copy(path.resolve(W, frozen39.prose.path),
    `inputs/current/n39/${language}/prose.md`, frozen39.prose.sha256)
  const ex39 = copy(`${T}/d045-n39-text-repair/frozen/${language}/exercises.template.json`,
    `inputs/current/n39/${language}/exercises.template.json`)
  copy(`${T}/d045-n39-text-repair/frozen/${language}/figures.template.json`,
    `inputs/current/n39/${language}/figures.template.json`)
  context[language] = [
    { card: n38.card, lesson: read(template38), exercises: read(ex38),
      lessonBinding: bind(template38), exerciseBinding: bind(ex38),
      proseBinding: bind(prose38), completeText: fs.readFileSync(prose38, 'utf8') },
    { card: n39.card, lesson: read(template39), exercises: read(ex39),
      lessonBinding: bind(template39), exerciseBinding: bind(ex39),
      proseBinding: bind(prose39), completeText: fs.readFileSync(prose39, 'utf8') },
  ]
  for (const number of [69, 71]) {
    for (const name of ['native-context.json', 'full-context.json', 'prose.md']) {
      copy(`${T}/d044-wave-figure-context/fig-${number}/${language}/${name}`,
        `inputs/before/fig-${number}/${language}/${name}`)
    }
    const before = read(`${A}/inputs/before/fig-${number}/${language}/full-context.json`)
    const current = context[language].filter(item => number === 71 || item.card === n38.card)
    if (number === 71) {
      const previous39 = before.authoritativeLessons.find(item => item.card === n39.card)
      assert.deepEqual(current[1].exercises, previous39.exercises,
        'All six source questions must remain byte-equivalent structured content.')
      assert.equal(sha(ex39), previous39.exerciseBinding.sha256)
      assert.equal(current[1].exercises.count, 6)
      assert.notEqual(current[1].completeText, before.authoritativeText,
        'Do not silently retain pre-repair complete text.')
    }
    write(`inputs/current/fig-${number}/${language}/full-context.json`, {
      ...before, sourceImage: pixels.figures[number].source,
      authoritativeLessons: current,
      authoritativeText: current.map(item => item.completeText).join('\n\n'),
      scientificReview: 'pending-current-text', authorOnly: true,
      previousSnapshot: bind(`${A}/inputs/before/fig-${number}/${language}/full-context.json`),
      replacedPreRepairN39: number === 71,
      currentTextFreeze: number === 71 ? bind(n39FreezePath) : bind(n38FreezePath),
    })
  }
}
for (const number of [69, 71]) {
  copy(pixels.figures[number].source.path, `inputs/original/fig-${number}.png`,
    pixels.figures[number].source.sha256)
}
write('input-bindings.json', { snapshots, n38: bind(n38FreezePath), n39: bind(n39FreezePath),
  currentAuthorityRole: 'Complete current frozen ZH/EN prose and all unchanged source questions.',
  beforeRole: 'Retained reference-only pre-repair snapshots, never current authority.',
  scienceApproval: false, bilingualApproval: false })

// The fit is derived from the 18 original reference marks, not a guessed wavelength.
const fit = points => {
  const n = points.length
  const mid = (n - 1) / 2
  const mean = points.reduce((sum, value) => sum + value, 0) / n
  const step = points.reduce((sum, value, index) => sum + (index - mid) * (value - mean), 0)
    / points.reduce((sum, _, index) => sum + (index - mid) ** 2, 0)
  return { start: mean - step * mid, step }
}
const referenceFit = fit(pixels.figures[71].referenceMarks.map(item =>
  (item.top[0] + item.bottom[0]) / 2))
const offsets = pixels.figures[71].balls.bBalls.map((ball, index) =>
  ball.center[0] - referenceFit.start - referenceFit.step * index)
const repeatedOffsets = offsets.slice()
for (let index = 0; index < 6; index += 1) {
  repeatedOffsets[index] = repeatedOffsets[index + 12] = (offsets[index] + offsets[index + 12]) / 2
}
const bases = {}
const regularization = {
  coordinates: 'Drawing pixels, not physical units or measured physical amplitude.',
  scanStraightening: 'Straighten source equilibrium rows, rails, and reference marks; remove print/scan skew.',
  balls: 'Uniform circular bodies and clean strokes replace ink fill irregularities; numbers retain exact 1..18 sequence.',
  springs: '17 distinct elastic couplings per apparatus, each with six schematic zigzag cycles; coil turn typography is not source numerical data.',
  figure69: 'Equal intervals and shared suspension junctions regularize the nominal equilibrium apparatus; no motion or waveform added.',
  figure71: { referenceFit, measuredOffsetsPx: offsets, pairedOffsetsPx: repeatedOffsets,
    method: 'Fit the 18 equilibrium reference marks. Retain the measured displacement sequence, pair-average only corresponding indices 12 apart. No sinusoid, ghost nodes, interpolated particle row, or invented answer label.',
    periodBallIntervals: 12, basis: 'Current complete n39 prose plus the source given 4-to-16 lambda dimension.',
    pairAveragingMaximumChangePx: Math.max(...offsets.map((value, i) => Math.abs(value - repeatedOffsets[i]))),
    sourceAbsoluteXMaxChangePx: null,
    lengthLabel: 'Only the source-given lambda span is shown, without phase/density annotation.',
  },
}
write('regularization.json', regularization)
write('source-observations.json', {
  method: 'Independently inspected each exact original PNG using view_image detail=original before authoring; Pillow measurements supplement those two observations.',
  contextImageOpens: [
    { ordinal: 1, ...pixels.figures[69].source, dimensions: pixels.figures[69].dimensions },
    { ordinal: 2, ...pixels.figures[71].source, dimensions: pixels.figures[71].dimensions },
  ],
  fig69: { subfigures: 1, balls: 18, labels: Array.from({ length: 18 }, (_, i) => String(i + 1)),
    threads: 36, springs: 17, support: 'One long overhead support, with pairs of converging threads to every ball and common adjacent attachment locations.',
    relationships: 'One almost horizontal nominal-equilibrium chain; every consecutive pair is linked by a coiled light spring; all 18 labels sit below their own balls.',
    absent: 'No waveform, direction arrows, phase labels, axes, scale ticks, second particle row, or numerical dimensions.' },
  fig71: { subfigures: ['a', 'b'], aBalls: 18, bBalls: 18, threads: 36, springs: 17,
    support: 'Two long rails with a depth connector at each end, forming one perspective support frame; two threads suspend each top-row ball.',
    labels: 'Top apparatus only has numbers 1..18. Source top Cyrillic a and bottom Cyrillic be become English a and b. Bottom balls have no additional number labels.',
    referenceMarks: 18, referenceMarkMeaning: 'Each is the nominal equilibrium reference for the corresponding top-row numbered ball, not a bottom suspension or spring.',
    bSpacing: 'Measured pixel gaps contract through balls 4..6, widen around 8..12, contract again around 15..17; order remains 1..18. No displacement curve is drawn.',
    givenDimension: pixels.figures[71].givenDimension,
    absent: 'No extra springs or suspended supports in panel b, no sine wave, no phase values, no density labels, no answers.' },
  measurements: bind(`${A}/png-measurements-v2.json`),
  regularization: bind(`${A}/regularization.json`), independentApproval: false,
})

function make(number) {
  const height = number === 69 ? 320 : 600
  const objects = []
  const assertions = []
  const inventory = []
  const pointPositions = new Map()
  const screen = (x, y) => [r(x), r(height - y)]
  const point = (id, at, ball = false) => {
    objects.push({ id, type: 'point', at, size: ball ? 10 : 0.2,
      stroke: 'ink', fill: 'ink', strokeWidth: ball ? 1.5 : 0.2 })
    pointPositions.set(id, at)
    return id
  }
  const text = (id, at, value) => {
    objects.push({ id, type: 'text', at, text: value, fontSize: 30, fontWeight: 400,
      labelPlacement: { position: 'CENTER' } })
    return id
  }
  const position = value => typeof value === 'string' ? pointPositions.get(value) : value
  const relation = (id, from, to) => {
    const a = position(from), b = position(to)
    assertions.push({ id, type: 'displacement', from, to, dx: r(b[0] - a[0]), dy: r(b[1] - a[1]),
      tolerance: 0.00001 })
    return id
  }
  const edge = (id, from, to, width = 2, type = 'segment') => {
    objects.push({ id, type, from, to, stroke: 'ink', strokeWidth: width })
    const check = `${id}-connects`
    assertions.push({ id: check, type: 'connects', arrow: id, from, to })
    return { object: id, assertion: check }
  }
  const group = (id, description, objectIds, assertionIds, points = true) => inventory.push({
    id, description, objects: objectIds, assertions: assertionIds,
    ...(points ? { requires: ['pointRelationships'] } : {}),
  })
  const spring = (prefix, from, to) => {
    const a = position(from), b = position(to)
    const vertices = [a, [a[0] + 12, a[1]]]
    for (let index = 0; index < 12; index += 1) {
      vertices.push([r(a[0] + 14 + (b[0] - a[0] - 28) * index / 11),
        r(a[1] + (index % 2 ? -6 : 6))])
    }
    vertices.push([b[0] - 12, b[1]], b)
    const links = vertices.slice(1).map((vertex, index) =>
      edge(`${prefix}-coil-${index}`, index === 0 ? from : vertices[index],
        index === vertices.length - 2 ? to : vertex, 2))
    group(prefix, 'One source light spring coupling this consecutive pair, with both exact particle endpoints. Coil typography is regularization, not an additional source wavelength.',
      [from, to, ...links.map(item => item.object)],
      [...links.map(item => item.assertion), relation(`${prefix}-particle-gap`, from, to)])
    return links.map(item => item.object)
  }
  const ballIds = []
  const numberMapping = []
  const topRow = []
  const anchorIds = []
  const supportEdges = []
  const threadIds = []
  const prefix = `fig${number}`
  const xFor = index => number === 69 ? 50 + 1000 * index / 17
    : referenceFit.start + referenceFit.step * index
  const topY = number === 69 ? 210 : 255
  // Declare meaningful source attachment points only, not extra particles.
  if (number === 69) {
    for (let i = 0; i <= 18; i += 1) anchorIds.push(point(`${prefix}-support-${i}`,
      screen(xFor(0) - 1000 / 34 + i * 1000 / 17, 65)))
    objects.push({ id: `${prefix}-support-board`, type: 'polygon',
      points: [screen(15, 50), screen(1085, 50), screen(1085, 65), screen(15, 65)],
      fill: 'paper', fillOpacity: 1, stroke: 'ink', strokeWidth: 2 })
  } else {
    for (let i = 0; i < 18; i += 1) {
      anchorIds.push(point(`${prefix}-far-${i + 1}`, screen(55 + 976 * i / 17, 45)))
      anchorIds.push(point(`${prefix}-near-${i + 1}`, screen(104 + 980 * i / 17, 125)))
    }
    for (const [id, from, to] of [
      ['far-rail', anchorIds[0], anchorIds[34]],
      ['near-rail', anchorIds[1], anchorIds[35]],
      ['left-depth-connector', anchorIds[0], anchorIds[1]],
      ['right-depth-connector', anchorIds[34], anchorIds[35]],
    ]) supportEdges.push(edge(`${prefix}-${id}`, from, to, 3))
  }
  for (let i = 0; i < 18; i += 1) {
    const id = point(`${prefix}-a-ball-${i + 1}`, screen(xFor(i), topY), true)
    ballIds.push(id); topRow.push(id)
    const label = text(`${prefix}-number-${i + 1}`, screen(xFor(i), number === 69 ? 266 : 300), String(i + 1))
    numberMapping.push({ number: i + 1, sourcePixels: pixels.figures[number].balls[number === 69 ? 'balls' : 'aBalls'][i],
      sourceLabelPixels: pixels.figures[number].numberRegions[i], point: id, label,
      labelAssertion: relation(`${prefix}-number-${i + 1}-below-own-ball`, id,
        screen(xFor(i), number === 69 ? 266 : 300)) })
    const anchors = number === 69 ? [anchorIds[i], anchorIds[i + 1]]
      : [anchorIds[2 * i], anchorIds[2 * i + 1]]
    for (let j = 0; j < 2; j += 1) {
      const thread = edge(`${prefix}-thread-${i + 1}-${j + 1}`, anchors[j], id, 1.8)
      threadIds.push(thread)
      group(`${prefix}-source-thread-${i + 1}-${j + 1}`,
        'Source suspension thread joins its own support attachment and numbered metal ball, with no missing thread.',
        [anchors[j], id, thread.object], [thread.assertion, relation(`${thread.object}-offset`, anchors[j], id)])
    }
  }
  const rowRelations = topRow.slice(1).map((id, i) =>
    relation(`${prefix}-equilibrium-gap-${i + 1}`, topRow[i], id))
  group(`${prefix}-source-equilibrium-particles`,
    'All 18 source metal balls in numerical order on a nominal equilibrium row. Exact equal-spacing and horizontal alignment remove print skew; all points have wholly internal adjacent displacement assertions.',
    topRow, rowRelations)
  group(`${prefix}-source-numbers`,
    'Every given number 1..18 belongs below its own top/apparatus ball. No bottom numbers are added.',
    [...topRow, ...numberMapping.map(item => item.label)],
    [...rowRelations, ...numberMapping.map(item => item.labelAssertion)])
  const railRelations = []
  if (number === 69) {
    for (let i = 1; i < anchorIds.length; i += 1)
      railRelations.push(relation(`${prefix}-support-gap-${i}`, anchorIds[i - 1], anchorIds[i]))
  } else {
    for (let i = 2; i < anchorIds.length; i += 1)
      railRelations.push(relation(`${prefix}-rail-attachment-gap-${i}`, anchorIds[i - 2], anchorIds[i]))
  }
  group(`${prefix}-source-support`,
    number === 69 ? 'One overhead support with all 19 shared attachment junctions, not 19 additional particles.'
      : 'Two source rails, two end depth connectors and all 36 source thread attachments. No missing end connector; attachment points are structural junctions, not waveform ghost balls.',
    [...anchorIds, ...(number === 69 ? [`${prefix}-support-board`] : supportEdges.map(item => item.object))],
    [...railRelations, ...supportEdges.map(item => item.assertion)])
  const springIds = []
  for (let i = 0; i < 17; i += 1)
    springIds.push(...spring(`${prefix}-spring-${i + 1}`, topRow[i], topRow[i + 1]))
  const lowerRow = []
  const guideMapping = []
  const phaseRelations = []
  if (number === 71) {
    const panels = [text(`${prefix}-panel-a`, screen(20, 206), 'a'),
      text(`${prefix}-panel-b`, screen(20, 446), 'b')]
    group(`${prefix}-source-panel-labels`, 'Exactly the two given panel identifiers, localized to English a and b, with no added descriptor.',
      panels, [], false)
    for (let i = 0; i < 18; i += 1) {
      const id = point(`${prefix}-b-ball-${i + 1}`, screen(xFor(i) + repeatedOffsets[i], 455), true)
      lowerRow.push(id); ballIds.push(id)
      const guide = edge(`${prefix}-equilibrium-mark-${i + 1}`,
        screen(xFor(i), 335), screen(xFor(i), 408), 1.8)
      const displacement = relation(`${prefix}-source-longitudinal-displacement-${i + 1}`, topRow[i], id)
      guideMapping.push({ number: i + 1, sourcePixels: pixels.figures[71].balls.bBalls[i],
        sourceGuide: pixels.figures[71].referenceMarks[i], point: id, guide: guide.object,
        guideAssertion: guide.assertion, displacementAssertion: displacement })
      group(`${prefix}-source-ball-correspondence-${i + 1}`,
        'The lower source ball retains its own numbered top-ball identity and original equilibrium reference mark. This line is not a suspension or added motion arrow.',
        [topRow[i], id, guide.object], [guide.assertion, displacement])
    }
    const density = lowerRow.slice(1).map((id, i) =>
      relation(`${prefix}-source-lower-gap-${i + 1}`, lowerRow[i], id))
    group(`${prefix}-source-lower-density-row`,
      'All 18 lower source balls with their measured compression/rarefaction order. No springs, invented waveform, extra number labels, or answer annotations. Pair-averaging documented separately preserves the given repeated phase geometry.',
      lowerRow, density)
    for (let i = 0; i < 6; i += 1) {
      phaseRelations.push(relation(`${prefix}-given-repeat-${i + 1}-${i + 13}`, lowerRow[i], lowerRow[i + 12]))
      assertions.push({ id: `${prefix}-equal-paired-displacement-${i + 1}`,
        type: 'equalDistance', a: topRow[i], b: lowerRow[i], c: topRow[i + 12], d: lowerRow[i + 12],
        tolerance: 0.00001 })
      phaseRelations.push(`${prefix}-equal-paired-displacement-${i + 1}`)
    }
    group(`${prefix}-given-repeated-spacing`, 'Source given span and current n39 prose identify repeated particle positions 12 intervals apart. All 36 points are covered inside this combined group; no phase value is printed on the output.',
      [...topRow, ...lowerRow], [...rowRelations, ...density, ...phaseRelations])
    const left = screen(position(lowerRow[3])[0], 520)
    const right = screen(position(lowerRow[15])[0], 520)
    const extLeft = edge(`${prefix}-lambda-extension-4`, lowerRow[3], left, 1.8)
    const extRight = edge(`${prefix}-lambda-extension-16`, lowerRow[15], right, 1.8)
    const forward = edge(`${prefix}-lambda-arrow-right`, left, right, 1.8, 'arrow')
    const backward = edge(`${prefix}-lambda-arrow-left`, right, left, 1.8, 'arrow')
    const lambda = text(`${prefix}-source-lambda`, screen((left[0] + right[0]) / 2, 553), '\u03bb')
    const length = `${prefix}-source-lambda-length`
    assertions.push({ id: length, type: 'equalDistance', a: lowerRow[3], b: lowerRow[15],
      c: lowerRow[1], d: lowerRow[13], tolerance: 0.00001 })
    group(`${prefix}-source-given-dimension`,
      'Only the original double-headed lambda dimension, bounded by extension lines at lower balls 4 and 16. Lambda also equals the source/text 2-to-14 distance. No answer-derived labels are added.',
      [lowerRow[1], lowerRow[3], lowerRow[13], lowerRow[15], extLeft.object, extRight.object,
        forward.object, backward.object, lambda],
      [extLeft.assertion, extRight.assertion, forward.assertion, backward.assertion, length,
        phaseRelations[2], phaseRelations[6]])
  }
  // Balls cover spring endpoints, as in the source solid metal bodies.
  const ballObjects = objects.filter(item => ballIds.includes(item.id))
  const rest = objects.filter(item => !ballIds.includes(item.id))
  const authority = []
  const authorityBindings = []
  for (const language of ['zh', 'en']) {
    for (const item of context[language].filter(item => number === 71 || item.card === n38.card)) {
      authorityBindings.push({ index: authority.length, language, card: item.card, prose: item.proseBinding })
      authority.push({ lesson: item.card, text: item.completeText })
      if (item.card === n39.card) {
        for (const exercise of item.exercises.exercises) {
          authority.push({ lesson: item.card, exercise: String(exercise.number), text: exercise.text })
        }
      }
    }
  }
  assertions.push({ id: `${prefix}-all-source-point-objects`, type: 'objectCount',
    objectType: 'point', count: topRow.length + lowerRow.length + anchorIds.length })
  const spec = { schema: 'ld-s10y-image/figure-spec@2', id: `fig-${number}`, mode: 'deterministic',
    description: number === 69
      ? 'Inspect all 18 numbered metal balls suspended by paired threads and elastically coupled by 17 light springs. Nominal equilibrium apparatus for n38, without motion or answer annotations.'
      : 'Inspect the full longitudinal 18-ball model: upper a equilibrium apparatus with paired suspension and 17 springs; lower b preserves all 18 given particles and reference marks with compressed/rarefied spacing, and the original double-headed lambda dimension. Supports n38 and current repaired n39 without extra phase or density labels.',
    source: { image: pixels.figures[number].source, authoritativeText: authority, inventory },
    canvas: { width: 1100, height, boundingBox: [0, height, 1100, 0],
      background: 'paper', keepAspectRatio: true },
    display: { purpose: 'instructional', layout: 'scroll', widths: [640, 1100], minTextPx: 16 },
    objects: [...rest, ...ballObjects], assertions, layout: { minLabelGap: 2 } }
  const initial = `fig-${number}/initial`
  write(`${initial}/fig-${number}.spec.json`, spec)
  write(`${initial}/source-inventory.json`, { groups: inventory, numberMapping, guideMapping,
    threadMapping: threadIds, springSegmentIds: springIds, authorityBindings,
    pointRoleMapping: { balls: ballIds, structuralAttachments: anchorIds },
    originalPixels: bind(`${A}/png-measurements-v2.json`),
    regularization: bind(`${A}/regularization.json`) })
  write(`${initial}/geometry-basis.json`, { topRow, lowerRow, ballIds, anchorIds, pointPositions: [...pointPositions],
    referenceFit: number === 71 ? referenceFit : null, repeatedOffsets: number === 71 ? repeatedOffsets : null,
    authorityBindings, allPointsCoveredByInternalNativeRelationships: true })
  bases[number] = { spec, initial, authorityBindings }
  return spec
}
fs.mkdirSync(`${A}/browser-tmp`, { recursive: true })
for (const number of [69, 71]) {
  make(number)
  const F = `${A}/fig-${number}/initial`
  const spec = `${F}/fig-${number}.spec.json`
  const draft = command(`fig-${number}/initial/draft-validation.json`, 'python3',
    [`${S}/scripts/validate_spec.py`, spec, '--stage', 'draft', '--json'], spec)
  let rendered = false
  if (draft) rendered = command(`fig-${number}/initial/render-command.json`, 'node',
    [`${S}/scripts/render_spec.mjs`, '--spec', spec, '--svg', `${F}/fig-${number}.svg`,
      '--png', `${F}/fig-${number}.native.png`, '--report', `${F}/fig-${number}.render.json`], spec)
  if (rendered) command(`fig-${number}/initial/rendered-validation.json`, 'python3',
    [`${S}/scripts/validate_spec.py`, spec, '--stage', 'rendered', '--json'], spec)
  console.log(JSON.stringify({ figure: number, draft: draft ? 'PASS' : 'FAIL',
    render: rendered ? 'PASS' : 'FAIL', repairsUsed: 0, sourceContextImageOpens: 2 }))
}
