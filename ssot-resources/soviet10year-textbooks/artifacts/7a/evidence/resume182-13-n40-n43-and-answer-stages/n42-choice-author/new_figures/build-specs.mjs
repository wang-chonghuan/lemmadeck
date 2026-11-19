import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'

// This only transcribes authored coordinates into FigureSpecs. Rendering is
// delegated unchanged to the repository's ld-s10y-image renderer.
const here = path.dirname(fileURLToPath(import.meta.url))
const author = path.dirname(here)
const seed = JSON.parse(fs.readFileSync(path.join(author, 'seed.json'), 'utf8'))
const freeze = JSON.parse(fs.readFileSync(path.join(author, 'source-freeze.json'), 'utf8'))
const hash = value => crypto.createHash('sha256').update(value).digest('hex')
if (hash(fs.readFileSync(path.join(author, 'solve-notes.md'))) !== freeze.solve_notes_sha256_bytes) {
  throw new Error('pre-option solve notes changed')
}

const panelHeight = 390
const coefficients = [
  { label: 'A', slope: -3, intercept: 4, legend: 'y = -3x + 4' },
  { label: 'B', slope: 2, intercept: 5, legend: 'y = 2x + 5' },
  { label: 'C', slope: -2, intercept: -5, legend: 'y = -2x - 5' },
  { label: 'D', slope: 1 / 2, intercept: 3 / 2, legend: 'y = x/2 + 3/2' },
  { label: 'E', slope: -2 / 3, intercept: 5 / 3, legend: 'y = -2x/3 + 5/3' },
  { label: 'F', slope: -12 / 5, intercept: 2, legend: 'y = -12x/5 + 2' },
]
const comparison = [
  { label: 'P and L', slope: 1, intercept: 2, legend: 'L: y = x + 2' },
]

function makeSpec(id, sourceNumber, panels, basis) {
  const height = panelHeight * panels.length
  const objects = []
  const assertions = []
  const inventory = []
  panels.forEach((panel, index) => {
    const prefix = `panel-${index + 1}`
    const offset = index * panelHeight
    const at = (x, y) => [332 + 58 * x, height - offset - 264 + 11 * y]
    const screen = (x, y) => [332 + 58 * x, offset + 264 - 11 * y]
    const framed = [18, height - offset - 8, 622, height - offset - 375]
    const frame = `${prefix}-frame`
    const title = `${prefix}-title`
    const grid = `${prefix}-grid`
    const parabola = `${prefix}-parabola`
    const line = `${prefix}-line`
    const xAxis = `${prefix}-x-axis`
    const yAxis = `${prefix}-y-axis`
    objects.push({
      id: frame, type: 'polygon',
      points: [[framed[0], framed[1]], [framed[2], framed[1]],
        [framed[2], framed[3]], [framed[0], framed[3]]],
      stroke: 'muted', strokeWidth: 1, fill: 'paper', fillOpacity: 0,
    })
    objects.push({
      id: title, type: 'text', at: [36, height - offset - 28],
      text: `${panel.label}   ${panels.length === 1 ? 'P: y = x^2' : 'y = x^2'};   ${panel.legend}`,
      fontSize: 18, fontWeight: 600,
      labelPlacement: { position: 'E', offset: [0, 0] },
    })
    objects.push({
      id: grid, type: 'grid',
      bounds: [at(-4.5, 18)[0], at(-4.5, 18)[1], at(4.5, -6)[0], at(4.5, -6)[1]],
      xStep: 29, yStep: 11, xOffset: at(0, 0)[0], yOffset: at(0, 0)[1],
      stroke: 'grid', strokeWidth: 0.7,
    })
    objects.push({
      id: xAxis, type: 'axis', from: at(-4.5, 0), to: at(4.5, 0),
      stroke: 'muted', strokeWidth: 1, tickSize: 3,
      ticks: [-4, -3, -2, -1, 1, 2, 3, 4].map(x => ({
        at: at(x, 0), label: String(x), fontSize: 16,
        labelPlacement: { position: 'S', offset: [0, 9] },
      })),
    })
    objects.push({
      id: yAxis, type: 'axis', from: at(0, -6), to: at(0, 18),
      stroke: 'muted', strokeWidth: 1, tickSize: 3,
      ticks: [-5, 0, 5, 10, 15].map(y => ({
        at: at(0, y), label: String(y), fontSize: 16,
        labelPlacement: { position: 'W', offset: [-9, 0] },
      })),
    })
    objects.push({
      id: `${prefix}-x-label`, type: 'text', at: at(4.5, 0), text: 'x',
      fontSize: 18, labelPlacement: { position: 'N', offset: [0, -11] },
    })
    objects.push({
      id: `${prefix}-y-label`, type: 'text', at: at(0, 18), text: 'y',
      fontSize: 18, labelPlacement: { position: 'W', offset: [-11, 0] },
    })

    // Each quadratic Bezier segment is exact for y=x^2: the control point
    // between abscissas a,b has x=(a+b)/2 and y=a*b in mathematical space.
    const knots = [-Math.sqrt(18), -3, -2, -1, 0, 1, 2, 3, Math.sqrt(18)]
    const first = screen(knots[0], knots[0] ** 2)
    let d = `M ${first[0]} ${first[1]}`
    for (let n = 1; n < knots.length; n += 1) {
      const a = knots[n - 1]
      const b = knots[n]
      const control = screen((a + b) / 2, a * b)
      const end = screen(b, b ** 2)
      d += ` Q ${control[0]} ${control[1]} ${end[0]} ${end[1]}`
    }
    objects.push({ id: parabola, type: 'svgPath', d, stroke: 'ink', strokeWidth: 2.5 })
    const crossings = [(-6 - panel.intercept) / panel.slope, (18 - panel.intercept) / panel.slope]
    const left = Math.max(-4.5, Math.min(...crossings))
    const right = Math.min(4.5, Math.max(...crossings))
    const lineStart = at(left, panel.slope * left + panel.intercept)
    const lineEnd = at(right, panel.slope * right + panel.intercept)
    objects.push({
      id: line, type: 'segment', from: lineStart, to: lineEnd,
      stroke: 'ink', strokeWidth: 2, dash: 2,
    })
    const groupAssertions = [
      `${prefix}-grid-dimensions`, `${prefix}-title-inside`,
      `${prefix}-line-center`, `${prefix}-x-label-inside`, `${prefix}-y-label-inside`,
    ]
    assertions.push({
      id: groupAssertions[0], type: 'gridDimensions', grid, columns: 18, rows: 24,
    })
    assertions.push({ id: groupAssertions[1], type: 'inside', point: title, container: frame })
    assertions.push({
      id: groupAssertions[2], type: 'collinear',
      a: lineStart,
      b: at((left + right) / 2, panel.slope * ((left + right) / 2) + panel.intercept),
      c: lineEnd,
      tolerance: 0.000001,
    })
    assertions.push({
      id: groupAssertions[3], type: 'inside', point: `${prefix}-x-label`, container: frame,
    })
    assertions.push({
      id: groupAssertions[4], type: 'inside', point: `${prefix}-y-label`, container: frame,
    })
    inventory.push({
      id: prefix,
      description: `Authored panel ${panel.label}: both functions share the same x/y frame. ` +
        'No source image exists. Half-unit x grid and unit y grid, unlabelled crossings, ' +
        'and a dashed line versus solid exact parabola are new display aids. ' +
        'The line is clipped only at the plot boundary; no mathematical domain restriction is intended.',
      objects: [frame, title, grid, xAxis, yAxis, parabola, line, `${prefix}-x-label`, `${prefix}-y-label`],
      assertions: groupAssertions, requires: ['gridDimensions'],
    })
  })
  return {
    schema: 'ld-s10y-image/figure-spec@2', id, mode: 'deterministic',
    description: 'Read horizontal intersection coordinates and compare function heights on actual framed graphs.',
    source: {
      authoredBasis: basis,
      authoritativeText: [{
        lesson: seed.source.lesson, exercise: sourceNumber,
        text: seed.exercises.find(exercise => exercise.number === sourceNumber).text,
      }],
      inventory,
    },
    canvas: { width: 640, height, boundingBox: [0, height, 640, 0], keepAspectRatio: true, background: 'paper' },
    display: { layout: 'scroll', purpose: 'instructional', minTextPx: 16, widths: [640] },
    layout: { minLabelGap: 3 }, objects, assertions,
  }
}

const plans = [
  makeSpec('fig-choice-n42-height', '852', comparison,
    'New written-source graph, not an original. Plot y=x^2 and y=x+2 on the same frame. ' +
    'Exact crossings (-1,1),(2,4); y=x^2 is below the line for -1<x<2 and above outside. ' +
    'Crossings and solution intervals are not labelled. No deliberate false geometry.'),
  makeSpec('fig-choice-n42-six-graphs', '853', coefficients,
    'New written-source graph sheet, not an original. Six separate complete frames A-F each plot y=x^2. ' +
    'Their lines are respectively -3x+4,2x+5,-2x-5,x/2+3/2,-2x/3+5/3,-12x/5+2. ' +
    'These divide every term by the original leading coefficient when needed. ' +
    'Root abscissas are respectively {-4,1},{1-sqrt(6),1+sqrt(6)},none,{-1,3/2},' +
    '{-5/3,1},{(-6-sqrt(86))/5,(-6+sqrt(86))/5}. Exact quadratic Bezier paths, not guessed curves. ' +
    'No root labels, highlighted answers, or deliberate false geometry.'),
]
for (const spec of plans) {
  const target = path.join(here, `${spec.id}.spec.json`)
  if (process.argv.includes('--repair-assertion-contract')) {
    fs.copyFileSync(target, path.join(here, `${spec.id}.spec.failed-contract.json`), fs.constants.COPYFILE_EXCL)
  }
  fs.writeFileSync(target, `${JSON.stringify(spec, null, 2)}\n`, {
    flag: process.argv.includes('--repair-assertion-contract') ? 'w' : 'wx',
  })
  console.log(`prepared authoredBasis spec: ${spec.id}`)
}
