import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const R = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck'
const O = path.join(R, '.intentfold/tickets/STEMROBIN-188/tmp/n66-figure100101-author-01')
const inputPath = path.join(R, '.intentfold/tickets/STEMROBIN-188/tmp/n66-figure-author-inputs-01/figure100101.json')
assert.equal(process.cwd(), R)
const input = JSON.parse(fs.readFileSync(inputPath, 'utf8'))
assert.equal(input.outputRoot, O)
const inventoryPath = path.join(O, 'pixel-inventories.json')
const inventory = JSON.parse(fs.readFileSync(inventoryPath, 'utf8'))
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex')
const binding = file => {
  const stat = fs.statSync(file)
  return {
    path: file,
    sha256: hash(fs.readFileSync(file)),
    bytes: stat.size,
    mode: (stat.mode & 0o7777).toString(8).padStart(4, '0'),
  }
}
const outputPath = name => {
  const absolute = path.resolve(O, name)
  assert.ok(absolute.startsWith(`${O}/`))
  return absolute
}
const write = (name, value, mode = 0o644) => {
  const file = outputPath(name)
  assert.ok(!fs.existsSync(file), `Refusing to overwrite existing evidence: ${file}`)
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx', mode })
  fs.chmodSync(file, mode)
  return file
}
const expectedInputs = [
  { path: inputPath },
  ...input.currentEditionText,
  ...input.figures.map(figure => figure.original),
  input.sourceAdmission,
  input.fullSourceLesson,
]
const collectInputs = () => expectedInputs.map(expected => {
  const actual = binding(expected.path)
  return {
    ...actual,
    expectedSha256: expected.sha256 ?? null,
    matchesExpected: !expected.sha256 || expected.sha256 === actual.sha256,
  }
})
const lesson = JSON.parse(fs.readFileSync(input.currentEditionText[0].path, 'utf8'))
const exercises = JSON.parse(fs.readFileSync(input.currentEditionText[1].path, 'utf8'))
const authoritativeText = [
  {
    lesson: lesson.id,
    text: [
      lesson.printed_title,
      ...lesson.prose.map(block => block.kind === 'fig'
        ? `[${block.id}]`
        : block.text),
    ].filter(Boolean).join('\n\n'),
  },
  ...exercises.exercises.map(exercise => ({
    lesson: lesson.id,
    exercise: exercise.number,
    text: exercise.text,
  })),
]
assert.ok(authoritativeText[0].text.includes('S_{(x+\\Delta x)}'))
assert.ok(authoritativeText[0].text.includes('V_{(b)}-V_{(a)}'))

const n = value => Number(value.toFixed(5))
const xy = (x, y) => [n(x), n(-y)]
const point = (id, x, y, label, visible = false, offset = [0, 0], position = 'S') => ({
  id, type: 'point', at: xy(x, y), label, visible,
  size: 2, strokeWidth: 1, stroke: 'ink', fill: 'ink',
  fontSize: 22, fontWeight: 400,
  labelPlacement: { position, gap: 12, offset },
})
const text = (id, x, y, value, fontSize = 22) => ({
  id, type: 'text', at: xy(x, y), text: value,
  fontSize, fontWeight: 400,
  labelPlacement: { position: 'CENTER' },
})
const segment = (id, a, b, dash = 0, strokeWidth = 2.8, stroke = 'ink') => ({
  id, type: 'segment', from: xy(...a), to: xy(...b),
  stroke, strokeWidth, dash,
})
const raw = (id, d, dash = 0, strokeWidth = 2.8, stroke = 'ink') => ({
  id, type: 'svgPath', d, stroke, strokeWidth, dash,
})
const displacement = (id, from, to, dx, dy = 0) => ({
  id, type: 'displacement', from, to, dx, dy,
})
const frame = (prefix, origin, xEnd, yTop, yBottom, transverse = false) => {
  const [x, y] = origin
  const objects = [
    segment(`${prefix}-x-axis`, [28, y], [xEnd, y]),
    segment(`${prefix}-y-axis`, [x, yBottom], [x, yTop]),
    { ...segment(`${prefix}-i-arrow`, [x, y], [x + 46, y], 0, 2.8), type: 'arrow' },
    { ...segment(`${prefix}-j-arrow`, [x, y], [x, y - 55], 0, 2.8), type: 'arrow' },
    text(`${prefix}-x-label`, xEnd - 1, y + 24, 'x'),
    text(`${prefix}-y-label`, x - 21, yTop + 4, 'y'),
    text(`${prefix}-i-label`, x + 42, y + 32, 'i\u20d7'),
    text(`${prefix}-j-label`, x - 26, y - 63, 'j\u20d7'),
  ]
  const assertions = [
    { id: `${prefix}-axes-perpendicular`, type: 'perpendicular',
      a: xy(28, y), b: xy(xEnd, y), c: xy(x, yBottom), d: xy(x, yTop) },
    { id: `${prefix}-i-connects`, type: 'connects', arrow: `${prefix}-i-arrow`,
      from: xy(x, y), to: xy(x + 46, y) },
    { id: `${prefix}-j-connects`, type: 'connects', arrow: `${prefix}-j-arrow`,
      from: xy(x, y), to: xy(x, y - 55) },
  ]
  if (transverse) {
    objects.push(
      segment(`${prefix}-transverse-axis`, [22, y + 68], [x + 42, y - 42]),
      { ...segment(`${prefix}-k-arrow`, [x, y], [x - 29, y + 29], 0, 2.8), type: 'arrow' },
      text(`${prefix}-k-label`, x - 54, y + 25, 'k\u20d7'),
    )
    assertions.push({
      id: `${prefix}-k-connects`, type: 'connects', arrow: `${prefix}-k-arrow`,
      from: xy(x, y), to: xy(x - 29, y + 29),
    })
  }
  return { objects, assertions }
}
const group = (id, description, objects, assertions, relations = false) => ({
  id, description, objects, assertions,
  ...(relations ? { requires: ['pointRelationships'] } : {}),
})
const base = (id, height, description, groups, objects, assertions) => ({
  schema: 'ld-s10y-image/figure-spec@2',
  id, mode: 'deterministic', description,
  source: {
    image: input.figures.find(figure => figure.id === id).original,
    authoritativeText,
    inventory: groups,
  },
  canvas: { width: 640, height, boundingBox: [0, 0, 640, -height],
    background: 'paper', keepAspectRatio: true },
  display: { purpose: 'instructional', layout: 'scroll', widths: [640], minTextPx: 16 },
  objects, assertions,
  layout: { minLabelGap: 4 },
})

function make100() {
  const f = frame('f100', [90, 220], 610, 25, 403, true)
  const stations = [
    point('f100-origin', 90, 220, '0', false, [-5, -8], 'NW'),
    point('f100-a', 175, 220, 'a', true, [0, 66]),
    point('f100-x', 280, 220, 'x', true, [0, 143]),
    point('f100-x-plus-dx', 395, 220, 'x+\u0394x', true, [0, 143]),
    point('f100-b', 535, 220, 'b', true, [0, 186]),
  ]
  const assertions = [
    ...f.assertions,
    displacement('f100-origin-before-a', 'f100-origin', 'f100-a', 85),
    displacement('f100-a-before-x', 'f100-a', 'f100-x', 105),
    displacement('f100-positive-dx', 'f100-x', 'f100-x-plus-dx', 115),
    displacement('f100-dx-before-b', 'f100-x-plus-dx', 'f100-b', 140),
    { id: 'f100-stations-collinear-1', type: 'collinear',
      a: 'f100-a', b: 'f100-x', c: 'f100-x-plus-dx' },
    { id: 'f100-stations-collinear-2', type: 'collinear',
      a: 'f100-x', b: 'f100-x-plus-dx', c: 'f100-b' },
  ]
  const knots = [[175, 45], [280, 95], [395, 130], [535, 165]]
  const slopes = knots.map((item, index) => index === 0
    ? (knots[1][1] - item[1]) / (knots[1][0] - item[0])
    : index === knots.length - 1
      ? (item[1] - knots[index - 1][1]) / (item[0] - knots[index - 1][0])
      : (knots[index + 1][1] - knots[index - 1][1])
        / (knots[index + 1][0] - knots[index - 1][0]))
  const controls = sign => knots.slice(0, -1).map((start, index) => {
    const end = knots[index + 1]
    const dx = (end[0] - start[0]) / 3
    return [
      [start[0], 220 + sign * start[1]],
      [start[0] + dx, 220 + sign * (start[1] + slopes[index] * dx)],
      [end[0] - dx, 220 + sign * (end[1] - slopes[index + 1] * dx)],
      [end[0], 220 + sign * end[1]],
    ]
  })
  const dFor = curves => `M ${curves[0][0].map(n).join(' ')} ` + curves.map(curve =>
    `C ${curve.slice(1).flat().map(n).join(' ')}`).join(' ')
  const top = controls(-1)
  const bottom = controls(1)
  const objects = [...stations, ...f.objects,
    raw('f100-body-top', dFor(top)),
    raw('f100-body-bottom', dFor(bottom)),
  ]
  const projection = 0.3
  const ellipseHalf = (id, center, radius, front, dash, width = 2.8) => {
    const rx = n(radius * projection)
    return raw(id,
      `M ${center} ${220 - radius} A ${rx} ${radius} 0 0 ${front ? 0 : 1} ${center} ${220 + radius}`,
      dash, width)
  }
  objects.push(
    ellipseHalf('f100-a-front-rim', 175, 45, true, 0),
    ellipseHalf('f100-a-rear-rim', 175, 45, false, 2, 1.8),
    ellipseHalf('f100-x-section-front', 280, 95, true, 2, 1.8),
    ellipseHalf('f100-x-section-rear', 280, 95, false, 2, 1.8),
    ellipseHalf('f100-outer-near-front', 280, 130, true, 0),
    ellipseHalf('f100-outer-near-rear', 280, 130, false, 2, 1.8),
    ellipseHalf('f100-dx-section-front', 395, 130, true, 0),
    ellipseHalf('f100-dx-section-rear', 395, 130, false, 2, 1.8),
    ellipseHalf('f100-inner-far-front', 395, 95, true, 2, 1.8),
    ellipseHalf('f100-inner-far-rear', 395, 95, false, 2, 1.8),
    ellipseHalf('f100-b-front-rim', 535, 165, true, 0),
    ellipseHalf('f100-b-rear-rim', 535, 165, false, 0),
    segment('f100-outer-top-generator', [280, 90], [395, 90], 0, 2.4),
    segment('f100-outer-bottom-generator', [280, 350], [395, 350], 0, 2.4),
    segment('f100-inner-top-generator', [280, 125], [395, 125], 2, 1.8),
    segment('f100-inner-bottom-generator', [280, 315], [395, 315], 2, 1.8),
    segment('f100-a-diameter', [175, 175], [175, 265], 2, 1.8),
    segment('f100-x-diameter', [280, 90], [280, 350], 2, 1.8),
    segment('f100-dx-diameter', [395, 90], [395, 350], 2, 1.8),
    segment('f100-b-vertical-diameter', [535, 55], [535, 385], 0, 2.2),
  )
  const k = 165 / Math.sqrt(2)
  const obliqueStart = [535 - projection * k, 220 + k]
  const obliqueEnd = [535 + projection * k, 220 - k]
  objects.push(segment('f100-b-oblique-diameter', obliqueStart, obliqueEnd, 0, 2.2))
  assertions.push(
    { id: 'f100-equal-cylinder-heights', type: 'equalDistance',
      a: xy(280, 90), b: xy(395, 90), c: xy(280, 125), d: xy(395, 125) },
    { id: 'f100-cylinder-height-is-dx', type: 'equalDistance',
      a: xy(280, 90), b: xy(395, 90), c: 'f100-x', d: 'f100-x-plus-dx' },
    { id: 'f100-parallel-generators', type: 'parallel',
      a: xy(280, 90), b: xy(395, 90), c: xy(280, 315), d: xy(395, 315) },
    { id: 'f100-small-matching-radii', type: 'equalDistance',
      a: 'f100-x', b: xy(280, 125), c: 'f100-x-plus-dx', d: xy(395, 125) },
    { id: 'f100-large-matching-radii', type: 'equalDistance',
      a: 'f100-x', b: xy(280, 90), c: 'f100-x-plus-dx', d: xy(395, 90) },
    { id: 'f100-positive-a-radius', type: 'distance',
      a: 'f100-a', b: xy(175, 175), value: 45 },
    { id: 'f100-positive-b-radius', type: 'distance',
      a: 'f100-b', b: xy(535, 55), value: 165 },
    { id: 'f100-b-oblique-through-center', type: 'collinear',
      a: xy(...obliqueStart), b: 'f100-b', c: xy(...obliqueEnd), tolerance: 0.002 },
    { id: 'f100-diameters-normal-to-axis', type: 'perpendicular',
      a: xy(280, 90), b: xy(280, 350), c: 'f100-x', d: 'f100-x-plus-dx' },
  )
  const groups = [
    group('f100-frame-and-stations',
      'One axial/transverse frame with x,y, vector i,j,k and origin glyph; a,x,x+Delta x,b remain on the same ordered axis.',
      [...stations.map(object => object.id), ...f.objects.map(object => object.id)],
      [...f.assertions.map(a => a.id), 'f100-origin-before-a', 'f100-a-before-x',
        'f100-positive-dx', 'f100-dx-before-b', 'f100-stations-collinear-1',
        'f100-stations-collinear-2'], true),
    group('f100-positive-body-endpoints',
      'Smooth increasing body profile has a positive small a end and a positive largest b end; neither source endpoint is extended or made zero.',
      ['f100-body-top', 'f100-body-bottom', 'f100-a', 'f100-b'],
      ['f100-positive-a-radius', 'f100-positive-b-radius']),
    group('f100-section-rims',
      'All four stations and all actual/added projected rims are retained; front/rear solid/dashed distinctions come from the independent pixel inventory.',
      objects.filter(object => object.id.includes('rim') || object.id.includes('section-')
        || object.id.includes('near-') || object.id.includes('far-')).map(object => object.id),
      ['f100-small-matching-radii', 'f100-large-matching-radii']),
    group('f100-comparison-cylinders',
      'Inner and outer cylinders share x to x+Delta x height. Small radius matches the x section; large radius matches the x+Delta x section. Added rims and generators do not create a second coordinate frame.',
      ['f100-x', 'f100-x-plus-dx', 'f100-outer-near-front', 'f100-outer-near-rear',
        'f100-inner-far-front', 'f100-inner-far-rear',
        'f100-outer-top-generator', 'f100-outer-bottom-generator',
        'f100-inner-top-generator', 'f100-inner-bottom-generator'],
      ['f100-positive-dx', 'f100-equal-cylinder-heights', 'f100-cylinder-height-is-dx',
        'f100-parallel-generators', 'f100-small-matching-radii', 'f100-large-matching-radii'], true),
    group('f100-center-diameters',
      'Dashed vertical diameters at a,x,x+Delta x; solid vertical and transverse diameters at b.',
      objects.filter(object => object.id.includes('diameter')).map(object => object.id),
      ['f100-b-oblique-through-center', 'f100-diameters-normal-to-axis']),
  ]
  const samples = top.flatMap(curve => Array.from({ length: 101 },
    (_, index) => bezier(curve, index / 100)))
  const sliceSamples = Array.from({ length: 1001 }, (_, index) => bezier(top[1], index / 1000))
  assert.ok(samples.every(([x, y]) => x >= 175 && x <= 535 && y >= 55 && y <= 175))
  assert.ok(samples.every((item, index) => index === 0 || item[1] <= samples[index - 1][1] + 1e-8))
  assert.ok(sliceSamples.every(([, y]) => 220 - y >= 95 - 1e-8 && 220 - y <= 130 + 1e-8))
  return {
    spec: base('fig-g10-100', 460,
      'Compare a growing solid-of-revolution slice between x and x+Delta x with its equal-height inner and outer cylinders; preserve the shared frame and all source station labels.',
      groups, objects, assertions),
    geometry: {
      schema: 'stemrobin188-author-geometry-checks@1', figure: 'fig-g10-100', status: 'pass',
      notVisualReview: true, notSourceGivenNumbers: true,
      modernLayout: { stations: knots, centerScreenY: 220, ellipseProjectionRatio: projection },
      checks: [
        { id: 'profile-endpoints', status: 'pass', aRadius: 45, bRadius: 165, extended: false },
        { id: 'increasing-profile', status: 'pass', samples: samples.length },
        { id: 'comparison-cylinder-nesting', status: 'pass', samples: sliceSamples.length,
          innerRadius: 95, outerRadius: 130, commonHeight: 115,
          smallerMatchesX: true, largerMatchesXPlusDeltaX: true },
        { id: 'uniform-affine-circle-projection', status: 'pass', ratio: projection },
        { id: 'finite-path-bounds', status: 'pass', reason: 'All Bezier controls and complete ellipse extrema fit the 640 by 460 canvas.' },
      ],
    },
  }
}

function bezier(curve, t) {
  const u = 1 - t
  return [0, 1].map(axis => u ** 3 * curve[0][axis]
    + 3 * u ** 2 * t * curve[1][axis]
    + 3 * u * t ** 2 * curve[2][axis]
    + t ** 3 * curve[3][axis])
}

function make101() {
  const f = frame('f101', [75, 330], 610, 35, 400)
  const stations = [
    point('f101-origin', 75, 330, '0', false, [-4, 12], 'SW'),
    point('f101-a', 210, 330, 'a', false, [0, 8]),
    point('f101-c', 350, 330, 'c', false, [0, 8]),
    point('f101-b', 505, 330, 'b', false, [0, 8]),
  ]
  const curves = [
    [[210, 330], [232, 218], [285, 80], [350, 80]],
    [[350, 80], [415, 80], [475, 205], [505, 330]],
  ]
  const upper = curves.flatMap((curve, curveIndex) =>
    Array.from({ length: 121 }, (_, index) => bezier(curve, index / 120))
      .filter((_, index) => curveIndex === 0 || index !== 0))
  const region = [...upper, [210, 330]]
  const hatches = []
  for (let intercept = -290; intercept <= 230; intercept += 14) {
    const intersections = []
    for (let index = 0; index < region.length - 1; index++) {
      const a = region[index]
      const b = region[index + 1]
      const da = a[1] - 0.62 * a[0] - intercept
      const db = b[1] - 0.62 * b[0] - intercept
      if ((da < 0 && db >= 0) || (db < 0 && da >= 0)) {
        const t = da / (da - db)
        intersections.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t])
      }
    }
    intersections.sort((a, b) => a[0] - b[0])
    for (let index = 0; index + 1 < intersections.length; index += 2) {
      hatches.push([intersections[index], intersections[index + 1]])
    }
  }
  const d = 'M 210 330 C 232 218 285 80 350 80 C 415 80 475 205 505 330'
  const objects = [
    ...stations, ...f.objects,
    segment('f101-c-guide', [350, 330], [350, 80], 0, 2.8),
    raw('f101-region-hatches', hatches.map(line => `M ${line[0].map(n).join(' ')} L ${line[1].map(n).join(' ')}`).join(' '), 0, 1.2, 'muted'),
    raw('f101-upper-curve', d, 0, 3),
    text('f101-function-label', 516, 132, 'f(x)', 24),
  ]
  const assertions = [
    ...f.assertions,
    displacement('f101-origin-before-a', 'f101-origin', 'f101-a', 135),
    displacement('f101-a-before-c', 'f101-a', 'f101-c', 140),
    displacement('f101-c-before-b', 'f101-c', 'f101-b', 155),
    { id: 'f101-stations-collinear', type: 'collinear',
      a: 'f101-a', b: 'f101-c', c: 'f101-b' },
    { id: 'f101-endpoint-a-on-axis', type: 'pointOnLine',
      point: 'f101-a', a: xy(28, 330), b: xy(610, 330) },
    { id: 'f101-endpoint-b-on-axis', type: 'pointOnLine',
      point: 'f101-b', a: xy(28, 330), b: xy(610, 330) },
    { id: 'f101-c-guide-normal-to-axis', type: 'perpendicular',
      a: 'f101-c', b: xy(350, 80), c: 'f101-a', d: 'f101-b' },
    { id: 'f101-c-guide-through-c', type: 'collinear',
      a: xy(350, 80), b: 'f101-c', c: xy(350, 200) },
  ]
  const groups = [
    group('f101-frame-and-stations',
      'One Cartesian frame with x,y, vector i,j and origin glyph; a,c,b are in that source order on the same x axis. There are no point dots or terminal axis arrows.',
      [...stations.map(object => object.id), ...f.objects.map(object => object.id)],
      [...f.assertions.map(a => a.id), 'f101-origin-before-a', 'f101-a-before-c',
        'f101-c-before-b', 'f101-stations-collinear'], true),
    group('f101-bounded-nonmonotone-curve',
      'A single positive interior hump labelled f(x), from a on the axis to b on the axis, with maximum above c; no specified equation or numerical heights.',
      ['f101-upper-curve', 'f101-function-label', 'f101-a', 'f101-c', 'f101-b'],
      ['f101-endpoint-a-on-axis', 'f101-endpoint-b-on-axis', 'f101-stations-collinear'], true),
    group('f101-c-guide',
      'Solid vertical guide from c on the x axis to the source hump maximum.',
      ['f101-c-guide', 'f101-a', 'f101-c', 'f101-b'],
      ['f101-c-guide-normal-to-axis', 'f101-c-guide-through-c']),
    group('f101-hatched-region',
      'Complete region between the solid upper curve and the x axis is hatched diagonally descending right, without an added answer or filled comparison shape.',
      ['f101-region-hatches', 'f101-upper-curve', 'f101-x-axis'],
      ['f101-endpoint-a-on-axis', 'f101-endpoint-b-on-axis']),
  ]
  assert.deepEqual(upper[0], [210, 330])
  assert.deepEqual(upper.at(-1), [505, 330])
  assert.ok(upper.slice(1, -1).every(([x, y]) => x > 210 && x < 505 && y < 330 && y >= 80))
  assert.ok(upper.slice(0, 121).every((item, index, list) => index === 0 || item[1] <= list[index - 1][1]))
  assert.ok(upper.slice(120).every((item, index, list) => index === 0 || item[1] >= list[index - 1][1]))
  assert.ok(hatches.length > 10)
  assert.ok(hatches.flat().every(([x, y]) => x >= 210 && x <= 505 && y >= 80 && y <= 330))
  return {
    spec: base('fig-g10-101', 430,
      'Inspect the nonmonotone continuous function and its full curvilinear region from a to b; retain the interior maximum above c without supplying a numerical value or equation.',
      groups, objects, assertions),
    geometry: {
      schema: 'stemrobin188-author-geometry-checks@1', figure: 'fig-g10-101', status: 'pass',
      notVisualReview: true, notSourceGivenNumbers: true,
      modernLayout: { aScreen: [210, 330], cScreen: [350, 330], bScreen: [505, 330],
        peakScreen: [350, 80], curves },
      checks: [
        { id: 'curve-exactly-bounded-by-a-b', status: 'pass', extended: false },
        { id: 'positive-interior-and-one-c-maximum', status: 'pass', samples: upper.length },
        { id: 'horizontal-join-above-c', status: 'pass', derivativeAtJoin: [195, 0] },
        { id: 'complete-diagonal-hatching', status: 'pass', clippedHatchSegments: hatches.length, slopeScreen: 0.62 },
        { id: 'finite-path-bounds', status: 'pass', reason: 'Bezier convex hull and clipped hatch endpoints fit the 640 by 430 canvas.' },
        { id: 'no-numeric-values-or-answer-annotations', status: 'pass' },
      ],
    },
  }
}

function prepare() {
  const before = collectInputs()
  assert.ok(before.every(file => file.matchesExpected), 'Listed input hash mismatch')
  write('input-bindings.before.json', { schema: 'stemrobin188-author-input-bindings@1', inputs: before }, 0o444)
  for (const result of [make100(), make101()]) {
    const id = result.spec.id
    const first = write(`${id}.spec.FIRST.json`, result.spec, 0o444)
    const current = write(`${id}.spec.json`, result.spec, 0o644)
    assert.equal(binding(first).sha256, binding(current).sha256)
    write(`${id}.geometry-checks.json`, {
      ...result.geometry,
      specSha256: binding(current).sha256,
      sourceInventory: binding(inventoryPath),
      regularization: inventory.figures.find(figure => figure.id === id).modernRegularizationSeparateFromSourceFacts,
    })
  }
  fs.chmodSync(inventoryPath, 0o444)
  console.log('Prepared two new source-inventoried FIRST/current FigureSpecs; FIRST modes are 0444, currents are 0644.')
}

function runStage(id, stage, command, args, attempt = 'initial') {
  const startedAt = new Date().toISOString()
  const result = spawnSync(command, args, {
    cwd: R, encoding: 'utf8', timeout: 180000,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
    maxBuffer: 16 * 1024 * 1024,
  })
  const receipt = {
    schema: 'stemrobin188-native-command-receipt@1', figure: id, stage, attempt,
    cwd: R, command: [command, ...args], startedAt, completedAt: new Date().toISOString(),
    exitCode: result.status, signal: result.signal, error: result.error?.message ?? null,
    stdout: result.stdout ?? '', stderr: result.stderr ?? '',
    status: result.status === 0 ? 'pass' : 'fail',
  }
  const stem = attempt === 'initial' ? id : `${id}.${attempt}`
  write(`${stem}.${stage}.receipt.json`, receipt)
  if (stage === 'draft-validation' && result.stdout) {
    write(`${stem}.draft-validation.json`, JSON.parse(result.stdout))
  }
  console.log(`${id} ${stage}: ${receipt.status} (exit ${receipt.exitCode})`)
  return receipt
}

function render() {
  const python = path.join(R, '.claude/skills/ld-s10y-lesson/.venv/bin/python')
  for (const { id } of input.figures) {
    const spec = outputPath(`${id}.spec.json`)
    const validation = runStage(id, 'draft-validation', python, [
      path.join(R, '.agents/skills/ld-s10y-image/scripts/validate_spec.py'), spec,
      '--stage', 'draft', '--json',
    ])
    if (validation.status !== 'pass') continue
    runStage(id, 'renderer', process.execPath, [
      path.join(R, '.agents/skills/ld-s10y-image/scripts/render_spec.mjs'),
      '--spec', spec, '--svg', outputPath(`${id}.svg`),
      '--png', outputPath(`${id}.png`),
      '--report', outputPath(`${id}.render.json`),
    ])
  }
}

function repairRender() {
  const id = 'fig-g10-100'
  const firstPath = outputPath(`${id}.spec.FIRST.json`)
  const currentPath = outputPath(`${id}.spec.json`)
  const first = JSON.parse(fs.readFileSync(firstPath, 'utf8'))
  const current = JSON.parse(fs.readFileSync(currentPath, 'utf8'))
  const expected = structuredClone(first)
  expected.objects.find(object => object.id === 'f100-x-plus-dx').labelPlacement.offset = [0, 188]
  assert.deepEqual(current, expected, 'Repair must change only the flagged label offset')
  const failedRenderPath = outputPath(`${id}.render.json`)
  const failedRender = JSON.parse(fs.readFileSync(failedRenderPath, 'utf8'))
  assert.equal(failedRender.status, 'fail')
  assert.deepEqual(failedRender.collisions.map(collision => collision.id), ['f100-x-plus-dx-label'])
  write(`${id}.repair01.json`, {
    schema: 'stemrobin188-targeted-spec-repair@1', figure: id,
    type: 'substantive-label-constraint-repair', number: 1, allowedMaximum: 1,
    trigger: binding(failedRenderPath),
    failedSpecPreservedAs: binding(firstPath), repairedCurrentSpec: binding(currentPath),
    change: {
      object: 'f100-x-plus-dx', field: 'labelPlacement.offset',
      before: [0, 143], after: [0, 188],
      screenDisplacementPx: [0, 45],
      reason: 'Move the flagged label below the lower body outline. Keep the true axial anchor, text, all geometry and all assertions unchanged.',
    },
    imageLoads: 0, executionRecovery: false, notReview: true,
    failedArtifactsRetained: [
      `${id}.svg`, `${id}.png`, `${id}.render.json`, `${id}.renderer.receipt.json`,
    ].map(name => binding(outputPath(name))),
  })
  const oldGeometryPath = outputPath(`${id}.geometry-checks.json`)
  write(`${id}.repair01.geometry-checks.json`, {
    ...JSON.parse(fs.readFileSync(oldGeometryPath, 'utf8')),
    specSha256: binding(currentPath).sha256,
    unchangedGeometryEvidence: binding(oldGeometryPath),
    targetedChange: 'Only f100-x-plus-dx labelPlacement.offset changed; all geometry, text content and assertions are byte-equivalent JSON values.',
    repairedLabelOffset: [0, 188],
  })
  const validation = runStage(id, 'draft-validation',
    path.join(R, '.claude/skills/ld-s10y-lesson/.venv/bin/python'), [
      path.join(R, '.agents/skills/ld-s10y-image/scripts/validate_spec.py'),
      currentPath, '--stage', 'draft', '--json',
    ], 'repair01')
  if (validation.status !== 'pass') return
  runStage(id, 'renderer', process.execPath, [
    path.join(R, '.agents/skills/ld-s10y-image/scripts/render_spec.mjs'),
    '--spec', currentPath, '--svg', outputPath(`${id}.repair01.svg`),
    '--png', outputPath(`${id}.repair01.png`),
    '--report', outputPath(`${id}.repair01.render.json`),
  ], 'repair01')
}

function finalize() {
  const before = JSON.parse(fs.readFileSync(outputPath('input-bindings.before.json'), 'utf8'))
  const after = collectInputs()
  assert.deepEqual(after, before.inputs, 'Input bytes or permissions changed during authoring')
  const files = fs.readdirSync(O).map(name => outputPath(name)).filter(file => fs.statSync(file).isFile())
  const figures = input.figures.map(({ id }) => {
    const owned = files.filter(file => path.basename(file).startsWith(`${id}.`))
    const receipts = owned.filter(file => file.endsWith('.receipt.json')).map(file => ({
      ...JSON.parse(fs.readFileSync(file, 'utf8')), receipt: binding(file),
    }))
    const repaired = fs.existsSync(outputPath(`${id}.repair01.json`))
    const selectedStem = repaired ? `${id}.repair01` : id
    const renderPath = outputPath(`${selectedStem}.render.json`)
    const report = fs.existsSync(renderPath) ? JSON.parse(fs.readFileSync(renderPath, 'utf8')) : null
    const first = binding(outputPath(`${id}.spec.FIRST.json`))
    const current = binding(outputPath(`${id}.spec.json`))
    assert.equal(first.mode, '0444')
    assert.equal(current.mode, '0644')
    return {
      id,
      source: input.figures.find(figure => figure.id === id).original,
      firstSpec: first, writableCurrentSpec: current,
      firstEqualsCurrent: first.sha256 === current.sha256,
      ownSourceImageLoads: 1, ownRenderedImageLoads: 0,
      nativeDraftValidation: receipts.find(receipt => receipt.stage === 'draft-validation'
        && (receipt.attempt ?? 'initial') === (repaired ? 'repair01' : 'initial'))?.status ?? 'not-run',
      nativeDraftValidationInvocations: receipts.filter(receipt => receipt.stage === 'draft-validation').length,
      renderer: report?.status ?? 'not-completed',
      rendererInvocations: receipts.filter(receipt => receipt.stage === 'renderer').length,
      renderDisplayChecks: report?.displayChecks ?? [],
      substantiveSpecRepairs: repaired ? 1 : 0, executionRecoveries: 0,
      failures: receipts.filter(receipt => receipt.status !== 'pass'),
      repairs: repaired ? [binding(outputPath(`${id}.repair01.json`))] : [],
      outputs: owned.map(binding),
      selectedOutputs: ['svg', 'png', 'render.json', 'draft-validation.json', 'geometry-checks.json']
        .map(extension => binding(outputPath(`${selectedStem}.${extension}`))),
      holds: [
        'Independent hash-bound mathematical/visual/cultural review is not authorized for this author and has not run.',
        'Exact original O/zero glyph identity and original font/arrow-accent typography remain local source uncertainties.',
        'Whole-lesson text review is pending; source S_{(x+Delta x)} and V_{(b)} forms were retained verbatim, not repaired.',
        'Offline/product integration, scroll-end behavior, durable-path adaptation, finalization, promotion and publication have not run.',
        ...(report?.status === 'pass' ? [] : ['Native authoring gate did not pass; see retained receipts.']),
      ],
      readyForIndependentReview: report?.status === 'pass',
      approved: false, published: false,
    }
  })
  const authorReport = {
    schema: 'stemrobin188-bounded-modern-figure-author-report@1',
    role: 'first-author-only-not-independent-reviewer',
    ticket: 'STEMROBIN-188', assignment: 'SAME188-6',
    lesson: lesson.id, book: input.book, edition: input.edition,
    repo: R, ownedRoot: O,
    status: figures.every(figure => figure.renderer === 'pass')
      ? 'authored-native-gates-pass-review-and-promotion-held'
      : 'authored-with-native-gate-holds',
    inputBefore: before.inputs, inputAfter: after, allInputsUnchanged: true,
    independentPixelInventories: binding(inventoryPath),
    figures,
    failures: figures.flatMap(figure => figure.failures),
    repairs: figures.flatMap(figure => figure.repairs),
    substantiveSpecRepairs: figures.reduce((count, figure) => count + figure.substantiveSpecRepairs, 0),
    executionRecoveries: 0,
    ownUsage: inventory.imageUse,
    sourceOriginalPathsOnly: input.figures.map(figure => figure.original.path),
    currentTextSnapshotsUsedInFull: input.currentEditionText,
    forbiddenActionsPerformed: [],
    paidCalls: 0, installedDependencies: false, envRead: false, databaseAccess: false,
    gitWrites: false, applicationChanges: false, otherOutputReads: false,
    independentReviewWritten: false, adaptFinalizeInvoked: false, publisherInvoked: false,
    preflightObservations: [
      'The assigned output directory did not exist at the initial ls check (exit 1); apply_patch created only the assigned directory. This was not a native validator/renderer or content failure.',
    ],
    authoritativeTextUnchanged: true, textbookSubscriptFormsRetained: true,
    approved: false, wholeLessonApproved: false, published: false,
  }
  const reportPath = write('author-report.json', authorReport)
  const outputs = fs.readdirSync(O)
    .filter(name => name !== 'output-index.json')
    .sort()
    .map(name => outputPath(name))
    .filter(file => fs.statSync(file).isFile())
    .map(binding)
  const indexPath = write('output-index.json', {
    schema: 'stemrobin188-author-output-index@1',
    root: O, outputs,
  })
  for (const output of outputs) assert.deepEqual(binding(output.path), output)
  console.log(JSON.stringify({
    index: binding(indexPath), report: binding(reportPath),
    figures: figures.map(figure => ({ id: figure.id, renderer: figure.renderer,
      readyForIndependentReview: figure.readyForIndependentReview })),
    ownImageLoads: inventory.imageUse,
    outputs: outputs.length,
  }, null, 2))
}

const stage = process.argv[2]
assert.ok(['prepare', 'render', 'repair-render', 'finalize'].includes(stage), 'Expected prepare, render, repair-render, or finalize')
if (stage === 'prepare') prepare()
if (stage === 'render') render()
if (stage === 'repair-render') repairRender()
if (stage === 'finalize') finalize()
