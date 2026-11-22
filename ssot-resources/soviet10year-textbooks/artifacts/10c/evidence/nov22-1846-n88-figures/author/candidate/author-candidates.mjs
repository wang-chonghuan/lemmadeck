import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

const repo = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck'
const parent = path.join(repo, '.tmp/stemrobin-184-six/n88-fig38-41-author')
const owner = path.join(parent, 'candidate')
const frozen = path.join(parent, 'source-freeze')
const release = path.join(repo, '.tmp/stemrobin-184-six/n88-figure-text-release')
const texts = path.join(release, 'input/10c/editions/modern-us-neutral/lessons/ana10-c6-s3-n88')
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex')
const bind = file => ({ path: file, sha256: hash(fs.readFileSync(file)) })
const expectedRelease = 'ad2498fc54f7995be1fee1c7d83aba1a9c33d0e9be746183b8fde9ad1514fa3c'
assert.equal(bind(path.join(release, 'manifest.json')).sha256, expectedRelease)
assert.equal(bind(path.join(frozen, 'hash-manifest.json')).sha256, '8e55fa93d0b366c03630072c208b663692c0e6fe2e6ce731b9516a6f391e299b')
const freeze = JSON.parse(fs.readFileSync(path.join(frozen, 'hash-manifest.json')))
const lessonBytes = fs.readFileSync(path.join(texts, 'lesson.json'))
const exerciseBytes = fs.readFileSync(path.join(texts, 'exercises.json'))
assert.equal(hash(lessonBytes), 'f25f3d3c67a2fd900d0d36e06a2ca7f73cc86da3902bb08621de536ef434adb4')
assert.equal(hash(exerciseBytes), 'c415dabb6e8145256181b508970807808618a1856e9f994e7adfe9eea326a917')
const lesson = JSON.parse(lessonBytes)
const exercises = JSON.parse(exerciseBytes)
const authoritativeText = lesson.prose
  .filter(block => block.kind === 'p' && block.text.trim())
  .map(block => ({ lesson: 'ana10-c6-s3-n88', text: block.text }))
assert.ok(exercises.exercises.every(item => !(item.figure_refs || []).some(id => ['fig-38', 'fig-39', 'fig-40', 'fig-41'].includes(id))))
const PI = Math.PI
const pi = '\u03c0'
const round = value => Number(value.toFixed(12))
const cot = x => Math.cos(x) / Math.sin(x)
const arcctg = x => Math.atan2(1, x)
const tolerance = 2e-9
const recordPath = path.join(owner, 'authoring-record.json')
assert.ok(!fs.existsSync(recordPath), 'Do not replay an unchanged author')
const produced = []

function author(number, canvas, description) {
  const prefix = `f${number}`
  const entry = freeze.entries.find(item => item.figure === `fig-${number}`)
  const inventoryText = fs.readFileSync(entry.inventory_path, 'utf8')
  assert.equal(hash(Buffer.from(inventoryText)), entry.inventory_sha256)
  const sections = Object.fromEntries(
    [...inventoryText.matchAll(/^### (f\d+-[^\n]+)\n([\s\S]*?)(?=^### |^## |\s*$)/gm)]
      .map(match => [match[1], match[2].trim()]),
  )
  // Slice between headings explicitly; retain every source fact, not a summary.
  for (const groupId of entry.stable_group_ids) {
    const start = inventoryText.indexOf(`### ${groupId}\n`)
    assert.ok(start >= 0)
    const remainder = inventoryText.slice(start + `### ${groupId}\n`.length)
    const stop = remainder.search(/^#{2,3} /m)
    sections[groupId] = (stop < 0 ? remainder : remainder.slice(0, stop)).trim()
  }
  const directory = path.join(owner, `fig${number}`)
  const contextPath = path.join(directory, 'context.json')
  const context = JSON.parse(fs.readFileSync(contextPath))
  assert.equal(context.sourceImage.sha256, entry.source_sha256_observed)
  assert.equal(JSON.parse(fs.readFileSync(path.join(directory, 'context.execution.json'))).exitCode, 0)
  const objects = []
  const assertions = []
  const inventory = []
  const curves = []
  const spec = {
    schema: 'ld-s10y-image/figure-spec@2',
    id: `fig-${number}`,
    mode: 'deterministic',
    description,
    source: {
      image: { path: entry.source_path, sha256: entry.source_sha256_observed },
      authoritativeText,
      inventory,
    },
    canvas: { ...canvas, background: 'paper', keepAspectRatio: false },
    display: { layout: 'scroll', purpose: 'instructional', minTextPx: 16, widths: [640] },
    objects, assertions,
    layout: { minLabelGap: 3, avoidRegions: [] },
  }
  const fontSize = number === 39 ? 34 : 24
  const add = object => { objects.push(object); return object.id }
  const claim = assertion => { assertions.push(assertion); return assertion.id }
  const text = (id, at, content, position, gap = 18, offset = [0, 0]) => add({
    id, type: 'text', at, text: content, fontSize, fontWeight: 500,
    labelColor: 'ink', labelPlacement: { position, gap, offset },
  })
  const segment = (id, from, to, dashed = false) => add({
    id, type: 'segment', from, to, stroke: dashed ? 'muted' : 'ink',
    strokeWidth: dashed ? 2.2 : 2.4, ...(dashed ? { dash: 2 } : {}),
  })
  const point = (id, at) => add({
    id, type: 'point', at, visible: true, size: 4.5,
    stroke: 'ink', fill: 'ink', strokeWidth: 1.5,
  })
  const count = (id, type, expected) => claim({
    id, type: 'objectCount', objectType: type, count: expected,
  })
  const displacement = (id, from, to, dx, dy) => claim({
    id, type: 'displacement', from, to, dx, dy, tolerance,
  })
  const onAxis = (id, position, axis) => {
    const object = objects.find(item => item.id === axis)
    return claim({ id, type: 'pointOnLine', point: position, a: object.from, b: object.to, tolerance })
  }
  const connects = (id, objectId) => {
    const object = objects.find(item => item.id === objectId)
    return claim({ id, type: 'connects', arrow: objectId, from: object.from, to: object.to, tolerance })
  }
  const group = (id, objectIds, assertionIds, modern, requires = []) => {
    inventory.push({
      id,
      description: [
        `Frozen source inventory: ${entry.inventory_path} SHA-256 ${entry.inventory_sha256}.`,
        sections[id],
        `MODERN/TEXT-DERIVED, NOT PIXEL FACT: ${modern}`,
        'RETAINED UNKNOWN/HOLD: source codepoints, exact source scales/coordinates, ink endpoint intent, offscale detail and extraction/source-fidelity limits are not resolved or approved.',
      ].join('\n\n'),
      objects: objectIds, assertions: assertionIds,
      ...(requires.length ? { requires } : {}),
    })
  }
  const axes = (horizontal, vertical, originPosition = 'SW', originOffset = [0, 0]) => {
    add({ id: `${prefix}-axis-horizontal`, type: 'arrow', from: horizontal[0], to: horizontal[1], stroke: 'ink', strokeWidth: 3 })
    add({ id: `${prefix}-axis-vertical`, type: 'arrow', from: vertical[0], to: vertical[1], stroke: 'ink', strokeWidth: 3 })
    text(`${prefix}-label-origin`, [0, 0], '0', originPosition, number === 39 ? 18 : 24, originOffset)
    const h = objects.find(item => item.id === `${prefix}-axis-horizontal`)
    const v = objects.find(item => item.id === `${prefix}-axis-vertical`)
    claim({ id: `${prefix}-axes-perpendicular`, type: 'perpendicular', a: h.from, b: h.to, c: v.from, d: v.to, tolerance })
    connects(`${prefix}-horizontal-arrow-connects`, h.id)
    connects(`${prefix}-vertical-arrow-connects`, v.id)
    onAxis(`${prefix}-origin-horizontal`, [0, 0], h.id)
    onAxis(`${prefix}-origin-vertical`, [0, 0], v.id)
    count(`${prefix}-axis-arrows-count`, 'arrow', 2)
  }
  const axisObjects = () => objects.filter(item => item.type === 'arrow' || item.id.includes('-label-origin') || item.id.endsWith('-label-x') || item.id.endsWith('-label-y')).map(item => item.id)
  const axisAssertions = () => assertions.filter(item => item.id.includes('axes-') || item.id.includes('arrow-') || item.id.includes('origin-')).map(item => item.id)

  function curve(id, equation, samples, interval, parameter) {
    const [xmin, ymax, xmax, ymin] = canvas.boundingBox
    let maxResidual = 0
    let maxMidpointErrorPx = 0
    for (let index = 0; index < samples.length; index++) {
      const [x, y] = samples[index]
      assert.ok([x, y].every(Number.isFinite))
      assert.ok(x > xmin && x < xmax && y > ymin && y < ymax)
      if (index) {
        assert.ok(x > samples[index - 1][0] && y < samples[index - 1][1])
        const [leftX, leftY] = samples[index - 1]
        const midX = (leftX + x) / 2
        const midY = (leftY + y) / 2
        const exactY = equation === 'cot' ? cot(midX) : arcctg(midX)
        maxMidpointErrorPx = Math.max(maxMidpointErrorPx, Math.abs(exactY - midY) * canvas.height / (ymax - ymin))
      }
      const expected = equation === 'cot' ? cot(x) : arcctg(x)
      maxResidual = Math.max(maxResidual, Math.abs(expected - y))
      if (equation === 'arcctg') assert.ok(y > 0 && y < PI)
      else assert.ok(x > interval[0] && x < interval[1])
    }
    assert.ok(maxResidual < tolerance)
    assert.ok(maxMidpointErrorPx < 0.01)
    const screen = samples.map(([x, y]) => [round(x - xmin), round(ymax - y)])
    const d = screen.map(([x, y], index) => `${index ? 'L' : 'M'} ${x} ${y}`).join(' ')
    add({ id, type: 'svgPath', d, stroke: 'ink', strokeWidth: 3.5 })
    curves.push({
      id, equation: equation === 'cot' ? 'y = cos(x) / sin(x)' : 'y = atan2(1, x) = pi/2 - atan(x)',
      domain: equation === 'cot' ? { openInterval: interval } : 'all real x',
      range: equation === 'arcctg' ? { openInterval: [0, PI] } : 'all real y',
      parameter, sampleCount: samples.length, maxNodeEquationResidual: maxResidual,
      maxSegmentMidpointErrorCanvasPx: maxMidpointErrorPx,
      firstVisibleSample: samples[0], lastVisibleSample: samples.at(-1),
      endpointMarkers: false,
      truncationIsAuthorChosenPlotWindowNotFunctionEndpoint: true,
      pathConvention: '[x - xMin, yMax - y]; keepAspectRatio=false matches installed raw-path scaling and JSXGraph coordinates.',
    })
  }
  const cotCurve = (id, k = 0, extraY = []) => {
    const levels = [...new Set([
      ...Array.from({ length: 1025 }, (_, index) => round(3.2 - 6.4 * index / 1024)),
      ...extraY,
    ])].sort((a, b) => b - a)
    curve(id, 'cot', levels.map(y => [arcctg(y) + k * PI, y]), [k * PI, (k + 1) * PI], {
      type: 'y-parametric', formula: 'x = atan2(1, y) + k*pi',
      k, yWindow: [-3.2, 3.2], uniformSteps: 1024, exactExtraLevels: extraY,
    })
  }
  const uncertainty = (id, expectedPoints) => {
    count(`${prefix}-no-invented-markers`, 'point', expectedPoints)
    group(id, [], [`${prefix}-no-invented-markers`, `${prefix}-axis-arrows-count`],
      `Unresolved flecks/end ink are not converted into new marks or labels. Exactly ${expectedPoints} point objects are authored, and only the two certain axis arrows are present; these counts do not resolve source ambiguity.`)
  }
  const finish = additions => {
    assert.deepEqual(inventory.map(item => item.id).sort(), entry.stable_group_ids.toSorted())
    const specPath = path.join(directory, 'spec.json')
    assert.ok(!fs.existsSync(specPath))
    fs.writeFileSync(specPath, `${JSON.stringify(spec, null, 2)}\n`)
    const basis = {
      schema: 'n88-modern-figure-mathematical-basis@1',
      figure: spec.id, source: entry,
      context: bind(contextPath),
      releaseManifest: bind(path.join(release, 'manifest.json')),
      lesson: bind(path.join(texts, 'lesson.json')),
      exercises: bind(path.join(texts, 'exercises.json')),
      spec: bind(specPath),
      authoritativeTextCoverage: 'Every modern lesson prose paragraph; full exercises read but no exercise references these figures and no question answers are annotated.',
      originalFacts: 'Frozen inventory descriptions copied verbatim into matching stable source groups.',
      modernTextDerivedOrAuthorChosen: additions,
      curves,
      finiteGeometry: {
        candidateMathChecks: 'pass',
        allSampleNodesFiniteAndStrictlyInsideCanvas: true,
        allCurvesStrictlyDescendingInVisibleWindow: true,
        sourceExactCoordinatesClaimed: false,
        maximumNodeResidualTolerance: tolerance,
        maximumSegmentMidpointErrorPx: 0.01,
        caveat: 'Floating-point samples and deterministic polyline display, not an exact analytic-path primitive. A separate independent review is still required.',
      },
      outputModelImageViews: 0,
      sourceFidelityHoldRetained: true,
      scienceApprovalClaimed: false,
      reviewApprovalClaimed: false,
    }
    const basisPath = path.join(directory, 'mathematical-basis.json')
    fs.writeFileSync(basisPath, `${JSON.stringify(basis, null, 2)}\n`)
    produced.push({ figure: spec.id, spec: bind(specPath), mathematicalBasis: bind(basisPath), context: bind(contextPath) })
  }
  return { prefix, spec, objects, assertions, curves, add, claim, text, segment, point, count, displacement, onAxis, connects, group, axes, axisObjects, axisAssertions, cotCurve, curve, uncertainty, finish }
}

{
  const a = author(38, { width: 640, height: 640, boundingBox: [-0.8, 3.9, 4.1, -3.9] },
    'Cotangent on the principal open interval (0, pi), with its zero and right pole guide. Exact graph meaning is modern-text-derived, not an inferred source scale.')
  a.axes([[-0.55, 0], [3.85, 0]], [[0, -3.6], [0, 3.6]])
  a.text('f38-label-x', [3.65, 0], 'x', 'S', 30)
  a.text('f38-label-y', [0, 3.25], 'y', 'W', 18)
  a.segment('f38-line-dashed', [PI, -3.4], [PI, 3.4], true)
  a.text('f38-label-pi', [PI, 0], pi, 'SW', 18, [0, 8])
  a.text('f38-label-fraction', [PI / 2, 0], `${pi}/2`, 'SW', 20, [0, 20])
  a.cotCurve('f38-curve-main')
  a.count('f38-one-curve', 'svgPath', 1)
  a.onAxis('f38-zero-on-axis', [PI / 2, 0], 'f38-axis-horizontal')
  a.displacement('f38-zero-coordinate', [0, 0], [PI / 2, 0], PI / 2, 0)
  a.claim({ id: 'f38-pole-parallel-y', type: 'parallel', a: [PI, -3.4], b: [PI, 3.4], c: [0, -3.6], d: [0, 3.6] })
  a.connects('f38-pole-connects', 'f38-line-dashed')
  a.displacement('f38-pole-coordinate', [0, 0], [PI, 0], PI, 0)
  a.group('f38-layout', a.objects.map(item => item.id), ['f38-one-curve', 'f38-axes-perpendicular'],
    'One shared frame is retained. Upright exact axes and the finite plotting window are modern regularization; no enclosure or grid is added.')
  a.group('f38-axes', a.axisObjects(), a.axisAssertions(),
    'The modern coordinate frame supplies x, y and digit 0. Original codepoints remain UNKNOWN. No source ticks or endpoint dots are invented.')
  a.group('f38-solid-curve', ['f38-curve-main'], ['f38-one-curve', 'f38-zero-on-axis'],
    'Equation y=cot(x) and the open interval (0,pi) come from modern prose. Only |y|<=3.2 is drawn; stroke ends are plot truncations, not domain endpoints.')
  a.group('f38-mid-label', ['f38-label-fraction'], ['f38-zero-on-axis', 'f38-zero-coordinate'],
    'Modern prose explicitly states cot(pi/2)=0; pi/2 is placed at that coordinate without adding a dot or a tick. The inline mathematical typography replaces the raster fraction stack.')
  a.group('f38-dashed-reference', ['f38-line-dashed', 'f38-label-pi'], ['f38-pole-parallel-y', 'f38-pole-connects', 'f38-pole-coordinate'],
    'The right dashed guide is assigned x=pi, a pole of cotangent, from modern mathematics. Its original meaning/scale and optical label identity remain UNKNOWN.')
  a.uncertainty('f38-unresolved-marks', 0)
  a.finish([
    'Modern equation cot(x)=cos(x)/sin(x), open domain (0,pi), zero pi/2 and excluded pole pi.',
    'Chosen finite |y|<=3.2 window, exact upright axes, axis-label digit 0, inline pi/2 typography, semantic colors, and 640px scroll media.',
    'No source endpoint markers, unnamed y-values, y ticks, or new annotations.',
  ])
}

{
  const a = author(39, { width: 1280, height: 640, boundingBox: [-8, 4, 11.5, -4] },
    'Five cotangent branches in one shared coordinate frame, from (-2*pi,-pi) through (2*pi,3*pi); five dashed pole guides and all half-period labels are retained.')
  a.axes([[-7.6, 0], [10.9, 0]], [[0, -3.65], [0, 3.65]], 'SE', [0, 22])
  a.text('f39-label-x', [10.9, 0], 'x', 'S', 44)
  a.text('f39-label-y', [0, 3.3], 'y', 'W', 22)
  const poles = [
    [-2, `-2${pi}`, 'SW'], [-1, `-${pi}`, 'SW'],
    [1, pi, 'SE'], [2, `2${pi}`, 'SW'], [3, `3${pi}`, 'SE'],
  ]
  const poleObjects = []
  const poleAssertions = []
  for (const [index, [k, label, side]] of poles.entries()) {
    const id = `f39-dash-0${index + 1}`
    const x = k * PI
    poleObjects.push(a.segment(id, [x, -3.3], [x, 3.3], true))
    poleObjects.push(a.text(`f39-label-dash-0${index + 1}`, [x, 0], label, side, 16, [0, 24]))
    poleAssertions.push(a.connects(`${id}-connects`, id))
    poleAssertions.push(a.displacement(`${id}-coordinate`, [0, 0], [x, 0], x, 0))
    poleAssertions.push(a.claim({ id: `${id}-parallel-y`, type: 'parallel', a: [x, -3.3], b: [x, 3.3], c: [0, -3.65], d: [0, 3.65] }))
  }
  const halves = [`-3${pi}/2`, `-${pi}/2`, `${pi}/2`, `3${pi}/2`, `5${pi}/2`]
  for (let index = 0; index < 5; index++) {
    const k = index - 2
    const id = `f39-curve-0${index + 1}`
    const zero = (k + 0.5) * PI
    a.cotCurve(id, k)
    a.text(`f39-label-mid-0${index + 1}`, [zero, 0], halves[index], 'SW', 18, [6, 70])
    a.onAxis(`${id}-zero-on-axis`, [zero, 0], 'f39-axis-horizontal')
    a.displacement(`${id}-zero-coordinate`, [0, 0], [zero, 0], zero, 0)
    a.displacement(`${id}-periodic-offset`, [PI / 2, 0], [zero, 0], k * PI, 0)
    a.group(`f39-branch-0${index + 1}`, [id, `f39-label-mid-0${index + 1}`],
      [`${id}-zero-on-axis`, `${id}-zero-coordinate`, `${id}-periodic-offset`],
      `Branch k=${k} is calculated from cotangent on (${k}*pi,${k + 1}*pi). Its exact half-period zero and translated samples are modern/text-derived. Inline half-period labels remain below the axis, offset left of the crossing; their lower label row is a modern legibility choice.`)
  }
  a.count('f39-five-curves', 'svgPath', 5)
  a.count('f39-five-dashed-guides', 'segment', 5)
  a.group('f39-layout', a.objects.map(item => item.id), ['f39-five-curves', 'f39-five-dashed-guides', 'f39-axes-perpendicular'],
    'All five branches share one frame and scale. Five dashed guides are retained; x=0 stays the solid vertical axis. No panel split, grid or extra pole guide is added.')
  a.group('f39-axes', a.axisObjects(), a.axisAssertions(),
    'Modern coordinates supply x, y and digit 0. Original codepoints and optical scales remain UNKNOWN.')
  a.group('f39-dashed-references', poleObjects, [...poleAssertions, 'f39-five-dashed-guides'],
    'Assign the five visible guides to -2*pi,-pi,pi,2*pi,3*pi using the period pi and pole set x=n*pi in modern text. Each guide and label has its own binding and coordinate/connectivity assertion. The solid y-axis represents the remaining displayed pole at zero.')
  a.count('f39-no-invented-markers', 'point', 0)
  a.group('f39-endpoints-and-print-marks', a.curves.map(item => item.id),
    ['f39-five-curves', 'f39-no-invented-markers', 'f39-axis-arrows-count'],
    'Draw only author-chosen |y|<=3.2 on each branch. No closed/open endpoint markers or curve arrows are inferred from source ink; source clipping/continuation remains UNKNOWN.')
  // Match the frozen group order for downstream inventory intake.
  a.spec.source.inventory.sort((x, y) => freeze.entries[1].stable_group_ids.indexOf(x.id) - freeze.entries[1].stable_group_ids.indexOf(y.id))
  a.finish([
    'Five exact formula-sampled branches k=-2,-1,0,1,2, using the modern cotangent definition and period pi.',
    'Exactly five dashed guides at -2*pi,-pi,pi,2*pi,3*pi; x=0 is the shared solid vertical axis.',
    'All five half-period labels plus pole labels and zero. Inline mathematical typography and a separate lower row for half-period labels are modern legibility regularization.',
    'Chosen |y|<=3.2 plot window, 1280px canvas, 34px labels measured at fixed 640px media, no invented endpoints/ticks/grid.',
  ])
}

{
  const a = author(40, { width: 640, height: 440, boundingBox: [-6, 3.7, 6, -0.6] },
    'Principal inverse cotangent y=arcctg(x), defined for all real inputs with open range (0,pi); one curve only, not an inverse of the full periodic cotangent graph.')
  a.axes([[-5.6, 0], [5.6, 0]], [[0, -0.32], [0, 3.52]])
  a.text('f40-label-x', [5.2, 0], 'x', 'S', 24)
  a.text('f40-label-y', [0, 3.4], 'y', 'W', 18)
  a.segment('f40-line-dashed', [-5.65, PI], [5.65, PI], true)
  a.text('f40-label-pi', [0, PI], pi, 'SW', 20, [0, 8])
  a.text('f40-label-fraction', [0, PI / 2], `${pi}/2`, 'W', 20)
  const samples = Array.from({ length: 2049 }, (_, index) => {
    const x = round(-5.25 + 10.5 * index / 2048)
    return [x, arcctg(x)]
  })
  a.curve('f40-curve-main', 'arcctg', samples, null, {
    type: 'x-parametric', formula: 'y=atan2(1,x)', xWindow: [-5.25, 5.25], uniformSteps: 2048,
  })
  a.count('f40-one-curve', 'svgPath', 1)
  a.connects('f40-dashed-connects', 'f40-line-dashed')
  a.claim({ id: 'f40-dashed-parallel-x', type: 'parallel', a: [-5.65, PI], b: [5.65, PI], c: [-5.6, 0], d: [5.6, 0] })
  a.displacement('f40-upper-level', [0, 0], [0, PI], 0, PI)
  a.onAxis('f40-mid-on-y-axis', [0, PI / 2], 'f40-axis-vertical')
  a.displacement('f40-mid-coordinate', [0, 0], [0, PI / 2], 0, PI / 2)
  a.group('f40-layout', a.objects.map(item => item.id), ['f40-one-curve', 'f40-axes-perpendicular'],
    'Retain one shared frame with one curve and the upper dashed horizontal guide. No reflected curve or y=x line is added.')
  a.group('f40-axes', a.axisObjects(), a.axisAssertions(),
    'Use exact modern x/y axes and digit 0; source typography, scaling and possible end dots remain UNKNOWN.')
  a.group('f40-dashed-reference', ['f40-line-dashed', 'f40-label-pi'], ['f40-dashed-connects', 'f40-dashed-parallel-x', 'f40-upper-level'],
    'The modern definition supplies the excluded upper output limit pi. The dashed stroke is placed at y=pi; the x-axis supplies the lower limit y=0. These meanings are not optical findings.')
  a.group('f40-solid-curve', ['f40-curve-main'], ['f40-one-curve', 'f40-mid-on-y-axis'],
    'Only the principal inverse y=atan2(1,x), with all-real domain and strictly open range (0,pi), is rendered. Finite x endpoints +/-5.25 are modern plot-window cuts, not domain boundaries or closed endpoints.')
  a.group('f40-middle-label', ['f40-label-fraction'], ['f40-mid-on-y-axis', 'f40-mid-coordinate'],
    'The modern inverse definition yields arcctg(0)=pi/2. Place the inline mathematical label there without adding a point marker or tick. Its codepoint identity in the source remains UNKNOWN.')
  a.uncertainty('f40-unresolved-marks', 0)
  a.finish([
    'Principal arcctg defined as atan2(1,x); domain R and open range (0,pi), with the full modern branch qualification preserved.',
    'Text-derived y=pi guide, y=0 lower limiting axis, and y-axis pi/2 crossing; no supplementary symmetry line or branch.',
    'Chosen x window [-5.25,5.25], exact modern scale, 640px scroll media, no endpoint markers/ticks.',
  ])
}

{
  const a = author(41, { width: 640, height: 700, boundingBox: [-1.3, 3.9, 4.1, -3.9] },
    'A shared principal cotangent branch with distinct positive and negative level guides, sign labels, and both projected x-axis dots; levels are illustrative modern choices, not recovered source coordinates.')
  const positive = 1.5
  const negative = -1.2
  const positiveX = arcctg(positive)
  const negativeX = arcctg(negative)
  const upperMeet = [positiveX, positive]
  const lowerMeet = [negativeX, negative]
  a.axes([[-1.1, 0], [3.85, 0]], [[0, -3.6], [0, 3.6]])
  a.text('f41-label-x', [3.6, 0], 'x', 'S', 28)
  a.text('f41-label-y', [0, 3.25], 'y', 'W', 18)
  a.segment('f41-guide-upper', [-1.05, positive], [3.75, positive])
  a.segment('f41-guide-lower', [-1.05, negative], [3.75, negative])
  a.segment('f41-line-dashed-reference', [PI, -3.4], [PI, 3.4], true)
  a.text('f41-label-pi', [PI, 0], pi, 'SE', 18, [0, 12])
  a.text('f41-label-fraction', [PI / 2, 0], `${pi}/2`, 'SW', 18, [0, 28])
  a.text('f41-label-upper-a', [0, positive], 'a', 'NW', 18, [0, -10])
  a.text('f41-label-lower-a', [0, negative], 'a', 'NW', 18, [0, -10])
  a.text('f41-label-positive-condition', [-0.8, 2.15], 'a > 0', 'CENTER', 18)
  a.text('f41-label-negative-condition', [-0.8, -1.65], 'a < 0', 'CENTER', 18)
  a.point('f41-point-upper-foot', [positiveX, 0])
  a.point('f41-point-lower-foot', [negativeX, 0])
  a.segment('f41-projection-upper', upperMeet, 'f41-point-upper-foot', true)
  a.segment('f41-projection-lower', 'f41-point-lower-foot', lowerMeet, true)
  a.cotCurve('f41-curve-main', 0, [positive, negative])
  a.count('f41-one-curve', 'svgPath', 1)
  a.count('f41-two-foot-dots', 'point', 2)
  a.count('f41-five-guide-projection-segments', 'segment', 5)
  a.displacement('f41-foot-horizontal-relationship', 'f41-point-upper-foot', 'f41-point-lower-foot', negativeX - positiveX, 0)
  a.onAxis('f41-upper-foot-on-axis', 'f41-point-upper-foot', 'f41-axis-horizontal')
  a.onAxis('f41-lower-foot-on-axis', 'f41-point-lower-foot', 'f41-axis-horizontal')
  a.connects('f41-upper-projection-connects', 'f41-projection-upper')
  a.connects('f41-lower-projection-connects', 'f41-projection-lower')
  a.displacement('f41-upper-projection-displacement', 'f41-point-upper-foot', upperMeet, 0, positive)
  a.displacement('f41-lower-projection-displacement', 'f41-point-lower-foot', lowerMeet, 0, negative)
  for (const [name, level] of [['upper', positive], ['lower', negative]]) {
    a.connects(`f41-${name}-guide-connects`, `f41-guide-${name}`)
    a.claim({ id: `f41-${name}-guide-parallel-x`, type: 'parallel', a: [-1.05, level], b: [3.75, level], c: [-1.1, 0], d: [3.85, 0] })
    a.displacement(`f41-${name}-chosen-level`, [0, 0], [0, level], 0, level)
  }
  a.connects('f41-pole-connects', 'f41-line-dashed-reference')
  a.displacement('f41-pole-coordinate', [0, 0], [PI, 0], PI, 0)
  a.claim({ id: 'f41-pole-parallel-y', type: 'parallel', a: [PI, -3.4], b: [PI, 3.4], c: [0, -3.6], d: [0, 3.6] })
  a.onAxis('f41-zero-on-axis', [PI / 2, 0], 'f41-axis-horizontal')
  a.displacement('f41-zero-coordinate', [0, 0], [PI / 2, 0], PI / 2, 0)
  a.group('f41-layout', a.objects.map(item => item.id),
    ['f41-one-curve', 'f41-two-foot-dots', 'f41-five-guide-projection-segments', 'f41-axes-perpendicular', 'f41-foot-horizontal-relationship'],
    'Keep the single shared graph frame and both visible projection-foot dots. The two dots share the x-axis and are related wholly within this group. Exact dot positions are calculated from two author-chosen levels, never attributed to source pixels.',
    ['pointRelationships'])
  a.group('f41-axes', a.axisObjects(), a.axisAssertions(),
    'Exact modern axes and digit 0 replace optical UNKNOWN scale/codepoints without inventing source ticks or endpoint dots.')
  a.group('f41-solid-curve', ['f41-curve-main'], ['f41-one-curve', 'f41-zero-on-axis'],
    'Modern prose supplies cot(x) on (0,pi), excluding both poles. Draw only |y|<=3.2, with exact samples at both chosen levels; no curve/guide junction dot is added from ambiguous ink.')
  a.group('f41-upper-guide', ['f41-guide-upper', 'f41-label-upper-a', 'f41-label-positive-condition'],
    ['f41-upper-guide-connects', 'f41-upper-guide-parallel-x', 'f41-upper-chosen-level'],
    'Preserve the a label and a>0 sign condition. Choose positive plotting level 1.5 purely for this illustration and do not label it numerically. This is not a recovered source value or an exercise answer. No ambiguous guide arrowhead is invented.')
  a.group('f41-upper-projection', ['f41-projection-upper', 'f41-point-upper-foot'],
    ['f41-upper-projection-connects', 'f41-upper-projection-displacement', 'f41-upper-foot-on-axis'],
    'Retain the certain axis-foot dot and connect it to the upper curve/guide meeting. The meeting is a coordinate literal, not an extra marker. Its exact x=atan2(1,1.5) is a modern illustrative calculation, not a source point coordinate.')
  a.group('f41-middle-fraction', ['f41-label-fraction'], ['f41-zero-on-axis', 'f41-zero-coordinate'],
    'Modern cot(pi/2)=0 locates pi/2 between the two foot dots. Its inline typography and exact alignment are modern regularization, with no dot/tick at the zero.')
  a.group('f41-lower-guide', ['f41-guide-lower', 'f41-label-lower-a', 'f41-label-negative-condition'],
    ['f41-lower-guide-connects', 'f41-lower-guide-parallel-x', 'f41-lower-chosen-level'],
    'Preserve a and a<0 separately from the upper guide. Choose negative plotting level -1.2 purely for the illustration; do not label it numerically or treat it as a recovered source value. No guide arrowhead is invented.')
  a.group('f41-lower-projection', ['f41-projection-lower', 'f41-point-lower-foot'],
    ['f41-lower-projection-connects', 'f41-lower-projection-displacement', 'f41-lower-foot-on-axis'],
    'Retain the certain axis-foot dot and connect it to the lower curve/guide meeting without an extra junction marker. x=atan2(1,-1.2) is a modern illustrative calculation, not a source coordinate.')
  a.group('f41-tall-dashed-reference', ['f41-line-dashed-reference', 'f41-label-pi'],
    ['f41-pole-connects', 'f41-pole-coordinate', 'f41-pole-parallel-y'],
    'Assign the tall dashed guide to the excluded pole x=pi from modern cotangent mathematics, while retaining its crossings with both level guides and the axis.')
  a.group('f41-unresolved-print-marks', [], ['f41-two-foot-dots', 'f41-axis-arrows-count'],
    'Only the two certain axis-foot dots and two certain axis arrows are authored. Ambiguous curve/guide junction ink and guide-line end arrowheads stay UNKNOWN and are not reconstructed.')
  a.finish([
    'Modern principal cotangent equation and pi/2 zero/poles; source scales/codepoints/coordinates remain UNKNOWN.',
    { authorChosenUnlabelledLevels: { positive: 1.5, negative: -1.2 }, exactModernMeetings: { upper: upperMeet, lower: lowerMeet }, reason: 'Distinct sign-level schematic only; neither level is asserted as a source value and no question answer is shown.' },
    'Preserve two a labels, a>0 and a<0, two horizontal guides, two dashed projections and both certain foot dots. No extra curve junction dots or guide arrows.',
    'Chosen |y|<=3.2 plot window, independent x/y display scaling, inline pi/2 typography, 640px scroll media.',
  ])
}

fs.writeFileSync(recordPath, `${JSON.stringify({
  schema: 'n88-figure-candidate-authoring@1',
  candidateOnly: true,
  releaseManifest: bind(path.join(release, 'manifest.json')),
  sourceFreezeManifest: bind(path.join(frozen, 'hash-manifest.json')),
  lesson: bind(path.join(texts, 'lesson.json')),
  exercises: bind(path.join(texts, 'exercises.json')),
  fullModernLessonParagraphsRead: authoritativeText.length,
  fullModernExerciseTextsRead: exercises.exercises.length,
  producer: bind(path.join(owner, 'author-candidates.mjs')),
  sourceModelViewsCarried: 4,
  originalPngReadsByThisAuthor: 0,
  outputModelViews: 0,
  produced,
  approvalClaimed: false,
}, null, 2)}\n`)
console.log(JSON.stringify({ status: 'four-candidates-authored', record: bind(recordPath), produced }))
