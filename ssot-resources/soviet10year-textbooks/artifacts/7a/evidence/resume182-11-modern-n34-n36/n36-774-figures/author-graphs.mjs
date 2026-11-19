import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

export const root = '/Users/yong/.codex/worktrees/d9b1/lemmadeck'
export const base = path.join(
  root, '.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/n36-774-figures',
)
assert.equal(process.cwd(), root, 'Every operation must retain the sole authorized cwd')

export function hash(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
}

export function writeNew(name, data) {
  const target = path.resolve(base, name)
  assert.ok(target.startsWith(`${base}/`), 'Output escaped ownership')
  const text = typeof data === 'string' ? data : `${JSON.stringify(data, null, 2)}\n`
  fs.writeFileSync(
    target,
    text.replace(/[\u007f-\uffff]/g, ch => `\\u${ch.charCodeAt(0).toString(16).padStart(4, '0')}`),
    { flag: 'wx' },
  )
  return target
}

const originalPath = path.join(
  root,
  'ssot-resources/soviet10year-textbooks/artifacts/7a/lessons/alg7-c4-s2-n36/exercises.json',
)
const selected = JSON.parse(fs.readFileSync(originalPath, 'utf8')).exercises
  .filter(item => item.number === '774')
  .map(item => ({ number: item.number, text: item.text, figure_refs: item.figure_refs || [] }))
assert.equal(selected.length, 1)
assert.equal(selected[0].figure_refs.length, 0)
assert.ok(selected[0].text.includes('\\sqrt{x}=6-x'))
assert.ok(selected[0].text.includes('\\sqrt{x}=\\frac{6}{x}'))

const gcd = (a, b) => b === 0 ? a : gcd(b, a % b)
const fraction = (a, b) => {
  const divisor = gcd(a, b)
  return [a / divisor, b / divisor]
}
const value = ratio => ratio[0] / ratio[1]
const number = n => Number(n.toFixed(9)).toString()
const project = (box, [x, y]) => [x - box[0], box[1] - y]
const screenPair = (box, point) => project(box, point).map(number).join(' ')

function text(id, at, content, color = 'ink') {
  return {
    id, type: 'text', at, text: content, fontSize: 20, fontWeight: 500,
    labelColor: color, labelPlacement: { position: 'CENTER' },
  }
}

function ticks(min, max, horizontal) {
  const result = []
  for (let n = min; n <= max; n += 1) {
    if (n === 0) continue
    result.push({
      at: horizontal ? [n, 0] : [0, n],
      label: String(n), size: 0.065, fontSize: 20,
      labelPlacement: {
        position: horizontal ? 'S' : 'W',
        gap: horizontal ? 18 : 13,
      },
    })
  }
  return result
}

function build(kind) {
  const line = kind === 'line'
  const id = `fig-choice-n36-774-${kind}`
  const window = line ? [-1, 7, 11, -5] : [-1, 7, 7, -1]
  const box = line ? [-2, 8, 12, -6] : [-2, 8, 8, -2]
  const [xmin, ymax, xmax, ymin] = window
  const step = line ? 1 : 0.5
  const scale = 640 / (box[2] - box[0])
  const objects = [
    {
      id: 'instructional-grid', type: 'grid',
      bounds: window, xStep: step, yStep: step,
      xOffset: 0, yOffset: 0, stroke: 'grid', strokeWidth: 1,
    },
    {
      id: 'coordinate-frame', type: 'polygon',
      points: [[xmin, ymin], [xmax, ymin], [xmax, ymax], [xmin, ymax]],
      fillOpacity: 0, stroke: 'muted', strokeWidth: 1,
    },
    {
      id: 'x-axis', type: 'axis', from: [xmin, 0], to: [xmax, 0],
      stroke: 'ink', strokeWidth: 1.5, fontSize: 20,
      ticks: ticks(xmin, xmax, true),
    },
    {
      id: 'y-axis', type: 'axis', from: [0, ymin], to: [0, ymax],
      stroke: 'ink', strokeWidth: 1.5, fontSize: 20,
      ticks: ticks(ymin, ymax, false),
    },
    text('origin-label', [-0.28, -0.35], '0'),
    text('x-axis-label', [xmax + 0.55, 0], 'x'),
    text('y-axis-label', [0, 7.55], 'y'),
    text('sqrt-formula', [line ? 2.8 : 2.3, 7.55], 'y = sqrt(x)'),
    text('rhs-formula', [line ? 8 : 5.7, 7.55], line ? 'y = 6 - x' : 'y = 6/x', 'muted'),
    {
      id: 'sqrt-legend-stroke', type: 'segment',
      from: [line ? 0.95 : 0.85, 7.55], to: [line ? 1.55 : 1.3, 7.55],
      stroke: 'ink', strokeWidth: 3.2,
    },
    {
      id: 'rhs-legend-stroke', type: 'segment',
      from: [line ? 6.4 : 4.4, 7.55], to: [line ? 7 : 4.85, 7.55],
      stroke: 'muted', strokeWidth: 3.2, dash: 2,
    },
  ]

  // A quadratic Bezier represents x = C*t^2, y = sqrt(C)*t exactly.
  const controls = [[0, 0], [0, Math.sqrt(xmax) / 2], [xmax, Math.sqrt(xmax)]]
  const sqrtPath = `M ${screenPair(box, controls[0])} Q ${screenPair(box, controls[1])} ${screenPair(box, controls[2])}`
  objects.push({
    id: 'sqrt-curve', type: 'svgPath', d: sqrtPath,
    stroke: 'ink', strokeWidth: 3.2,
  })

  let reciprocal = null
  if (line) {
    objects.push({
      id: 'rhs-curve', type: 'segment', from: [-1, 7], to: [11, -5],
      stroke: 'muted', strokeWidth: 3.2, dash: 2,
    })
  } else {
    const intervals = 2048
    const samples = Array.from({ length: intervals + 1 }, (_, i) => {
      const x = fraction(6 * intervals + 43 * i, 7 * intervals)
      const y = fraction(42 * intervals, 6 * intervals + 43 * i)
      assert.equal(BigInt(x[0]) * BigInt(y[0]), 6n * BigInt(x[1]) * BigInt(y[1]))
      return { index: i, x, y }
    })
    const d = samples.map((s, i) => (
      `${i === 0 ? 'M' : 'L'} ${screenPair(box, [value(s.x), value(s.y)])}`
    )).join(' ')
    objects.push({
      id: 'rhs-curve', type: 'svgPath', d,
      stroke: 'muted', strokeWidth: 3.2, dash: 2,
    })
    const h = 43 / (7 * intervals)
    const maxSecondDerivative = 12 / (6 / 7) ** 3
    const interpolationBoundPx = scale * maxSecondDerivative * h ** 2 / 8
    const coordinateEncodingBoundPx = Math.SQRT2 * scale * 0.5e-9
    const floatingArithmeticAllowancePx = 1e-9
    const totalBoundPx = interpolationBoundPx + coordinateEncodingBoundPx + floatingArithmeticAllowancePx
    assert.ok(totalBoundPx < 0.0015)
    assert.deepEqual(samples[0].x, [6, 7])
    assert.deepEqual(samples[0].y, [7, 1])
    assert.deepEqual(samples.at(-1).x, [7, 1])
    assert.deepEqual(samples.at(-1).y, [6, 7])
    reciprocal = {
      schema: 'n36-774/analytic-samples@1',
      figure: id, equation: 'y = 6/x', intervals,
      exactConstruction: 'x_i = (6*N + 43*i)/(7*N); y_i = 42*N/(6*N + 43*i); i=0,...,N; N=2048',
      allSamplesVerified: 'Exact integer cross-products verify x_i*y_i=6 for every sample.',
      screenProjection: '[u,v] = [x - canvas.xMin, canvas.yMax - y]; renderer scales by 64 px per unit.',
      error: {
        theorem: 'For linear interpolation on an interval of width h, |f-L| <= h^2*max|f_second|/8.',
        fSecond: '12/x^3',
        intervalWidth: h, maxSecondDerivative, scalePxPerUnit: scale,
        interpolationBoundPx, coordinateEncodingBoundPx, floatingArithmeticAllowancePx,
        totalBoundPx,
        justification: 'All x >= 6/7. Vertical error bounds Euclidean distance to the curve at the same x. Nine-place source-screen coordinates add the stated vector bound.',
      },
      clipping: {
        positiveBranch: 'Visible portion starts exactly at (6/7,7) on the top frame and ends exactly at (7,6/7) on the right frame.',
        negativeBranch: 'For -1 <= x < 0, 6/x <= -6, entirely below yMin=-1. No negative branch lies in this window.',
        excluded: 'No epsilon cutoff, interpolation of guessed points, intersection marker or fabricated domain restriction.',
      },
      samples,
    }
  }

  const assertions = [
    {
      id: 'grid-cell-count', type: 'gridDimensions', grid: 'instructional-grid',
      columns: (xmax - xmin) / step, rows: (ymax - ymin) / step,
    },
    {
      id: 'orthogonal-axes', type: 'perpendicular',
      a: [xmin, 0], b: [xmax, 0], c: [0, ymin], d: [0, ymax],
    },
    {
      id: 'x-frame-extent', type: 'displacement',
      from: [xmin, ymin], to: [xmax, ymin], dx: xmax - xmin, dy: 0,
    },
    {
      id: 'y-frame-extent', type: 'displacement',
      from: [xmin, ymin], to: [xmin, ymax], dx: 0, dy: ymax - ymin,
    },
    {
      id: 'curve-representation-count', type: 'objectCount',
      objectType: 'svgPath', count: line ? 1 : 2,
    },
    {
      id: 'no-point-markers', type: 'objectCount', objectType: 'point', count: 0,
    },
  ]
  if (line) {
    assertions.push({
      id: 'rhs-slope', type: 'displacement',
      from: [-1, 7], to: [11, -5], dx: 12, dy: -12,
    })
    assertions.push({
      id: 'rhs-intercept', type: 'pointOnLine',
      point: [0, 6], a: [-1, 7], b: [11, -5],
    })
  }
  const basis = [
    'New authored deterministic choice support graph, independently derived only from original written exercise 774.',
    'No intentional false curve, no answer key, no guessed source coordinates and no original PNG.',
    `The display window is x=[${xmin},${xmax}], y=[${ymin},${ymax}], not a domain restriction.`,
    `Square-root domain is x>=0; visible square-root segment is x=[0,${xmax}].`,
    `sqrt-curve uses the exact quadratic parametric Bezier x=${xmax}*t^2, y=sqrt(${xmax})*t, 0<=t<=1.`,
    line
      ? 'RHS is the full affine line y=6-x, clipped only by the coordinate frame; the x=9 tick remains visible without highlighting.'
      : 'RHS is y=6/x, domain x!=0; all and only its frame-visible portion is sampled analytically at 2049 exact rational pairs, with total screen error below 0.0015 px.',
    'Numeric unit labels; the reciprocal grid has half-unit cells. All learner-facing text is ASCII, 20 px at width 640.',
    'No intersection point, solution coordinate, projected intersection guide or answer-bearing annotation.',
    'The supported assertion vocabulary does not prove arbitrary svgPath identities; exact construction and sampling checks are in the separately hash-bound mathematical receipt, not misrepresented as validator proof.',
  ].join(' ')
  const spec = {
    schema: 'ld-s10y-image/figure-spec@2', id, mode: 'deterministic',
    description: `Shared coordinate frame for inspecting y=sqrt(x) and ${line ? 'y=6-x' : 'y=6/x'} from written exercise 774, without marked solutions.`,
    source: {
      authoredBasis: basis,
      authoritativeText: [{
        lesson: 'alg7-c4-s2-n36', exercise: '774', text: selected[0].text,
      }],
      inventory: [
        {
          id: 'authored-shared-frame',
          description: 'Modern authored numeric coordinate frame and regular grid; not original pixel evidence.',
          objects: ['instructional-grid', 'coordinate-frame', 'x-axis', 'y-axis', 'origin-label', 'x-axis-label', 'y-axis-label'],
          assertions: ['grid-cell-count', 'orthogonal-axes', 'x-frame-extent', 'y-frame-extent'],
          requires: ['gridDimensions'],
        },
        {
          id: 'authored-sqrt',
          description: 'The actual positive square-root curve from the written left-hand side, with solid stroke and formula label.',
          objects: ['sqrt-curve', 'sqrt-formula', 'sqrt-legend-stroke'],
          assertions: ['curve-representation-count', 'no-point-markers'],
        },
        {
          id: 'authored-rhs',
          description: line
            ? 'The affine right-hand side y=6-x, drawn across the whole coordinate frame with a dashed stroke.'
            : 'The analytic right-hand side y=6/x, sampled only between its exact frame crossings with a dashed stroke.',
          objects: ['rhs-curve', 'rhs-formula', 'rhs-legend-stroke'],
          assertions: line ? ['rhs-slope', 'rhs-intercept', 'no-point-markers'] : ['curve-representation-count', 'no-point-markers'],
        },
      ],
    },
    canvas: { width: 640, height: 640, boundingBox: box, background: 'paper', keepAspectRatio: true },
    display: { layout: 'scroll', purpose: 'instructional', widths: [640], minTextPx: 16 },
    objects, assertions, layout: { minLabelGap: 4 },
  }
  const specPath = writeNew(`${id}.spec.FIRST.json`, spec)
  const samplesPath = reciprocal && writeNew(`${id}.samples.FIRST.json`, reciprocal)
  return {
    id, specPath, specSha256: hash(specPath),
    sourceProjection: {
      path: path.relative(root, originalPath),
      selectedFields: ['number', 'text', 'figure_refs'],
      projectedSha256: crypto.createHash('sha256').update(JSON.stringify(selected[0])).digest('hex'),
      originalPromptExact: true, noImageRequired: true,
    },
    construction: {
      displayedWindow: { x: [xmin, xmax], y: [ymin, ymax] },
      canvasBoundingBox: box, scalePxPerUnit: scale,
      finiteWindowIsNotDomain: true,
      sqrt: {
        domain: 'x>=0', parameter: '0<=t<=1',
        symbolic: `P0=(0,0), P1=(0,sqrt(${xmax})/2), P2=(${xmax},sqrt(${xmax})); B(t)=(${xmax}*t^2,sqrt(${xmax})*t).`,
        proof: `B_y(t)^2=${xmax}*t^2=B_x(t), and B_y(t)>=0. Affine screen projection preserves the quadratic Bezier.`,
        controlsUserSpace: controls,
        svgCoordinateEncoding: 'Nine decimal places; every control-coordinate error <=5e-10 units, hence curve-point vector error <=sqrt(2)*scale*5e-10 px by convexity of Bezier weights.',
        coordinateEncodingBoundPx: Math.SQRT2 * scale * 0.5e-9,
      },
      rhs: line ? {
        domain: 'all real x',
        equation: 'y=6-x',
        endpointsUserSpace: [[-1, 7], [11, -5]],
        proof: 'Both endpoints satisfy x+y=6; the affine segment consists exactly of that line inside this convex rectangular frame.',
        x9RemainsInDisplayedWindow: true,
      } : {
        domain: 'x!=0',
        equation: 'y=6/x',
        samples: { path: samplesPath, sha256: hash(samplesPath), count: reciprocal.samples.length },
        error: reciprocal.error, clipping: reciprocal.clipping,
      },
      executableAssertionLimit: 'validate_spec checks grid dimensions, axis orthogonality, frame extents, point-marker absence and line slope/intercept. It has no analytic-curve assertion type; this mathematical receipt records the independent formula construction instead.',
      visibleExclusions: ['intersection dots', 'intersection coordinate labels', 'projected intersection guides', 'solution values', 'cultural glyphs'],
    },
  }
}

if (process.argv[1] === path.join(base, 'author-graphs.mjs')) {
  const figures = ['line', 'reciprocal'].map(build)
  const receipt = writeNew('mathematical-construction.FIRST.json', {
    schema: 'n36-774/mathematical-construction@1',
    ticket: 'STEMROBIN-182', sourceExercise: '774', soleCwd: root, ownerDirectory: base,
    authorScript: { path: path.join(base, 'author-graphs.mjs'), sha256: hash(path.join(base, 'author-graphs.mjs')) },
    derivationScope: 'Written equations only; no solving, answer key, author key or original images were consulted.',
    figures,
    independentGraphGate: { owner: 'parent', status: 'pending', authorCannotPromote: true },
    imageUsage: { planned: 2, viewed: 0, skillPerBatchLimit: 8, contextLimit: 24 },
  })
  console.log(JSON.stringify({ receipt, sha256: hash(receipt), figures: figures.map(f => ({ id: f.id, spec: f.specPath })) }, null, 2))
}
