import assert from 'node:assert/strict'
import test from 'node:test'
import { graphSpec } from './graph-options.mjs'

const source = { path: 'test/reference.png', sha256: '0'.repeat(64) }
const reference = {
  description: 'Synthetic coordinate reference; the test model supplies the function and domain.',
  authoritativeText: [{ text: 'Plot the specified function, retaining its domain and endpoint inclusion.' }],
}
const text = 'Choose the graph of the specified function on its stated domain.'
const frame = {
  bounds: [-6, 8, 6, -4],
  xStep: 2,
  yStep: 2,
  xTicks: [-4, -2, 2, 4],
  yTicks: [-2, 2, 4, 6],
}
const specFor = (graph, coordinateFrame = frame) =>
  graphSpec('test-graph', graph, source, text, reference, coordinateFrame)
const objectsOf = (spec, type) => spec.objects.filter(object => object.type === type)

function close(actual, expected) {
  assert.ok(Number.isFinite(actual), `Non-finite coordinate: ${actual}`)
  const tolerance = 1e-10 * Math.max(1, Math.abs(expected))
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} != ${expected}`)
}

function coordinate(actual, expected) {
  assert.equal(actual.length, 2)
  actual.forEach((value, index) => close(value, expected[index]))
}

function segment(spec, start, end, k, l) {
  const lines = objectsOf(spec, 'segment')
  assert.equal(lines.length, 1, 'A continuous affine graph has one visible line segment')
  assert.equal(objectsOf(spec, 'svgPath').length, 0)
  const ends = [lines[0].from, lines[0].to].sort((a, b) => a[0] - b[0])
  coordinate(ends[0], start)
  coordinate(ends[1], end)
  for (const [x, y] of ends) close(y, k * x + l)
}

function markers(spec, expected) {
  const points = objectsOf(spec, 'point').sort((a, b) => a.at[0] - b.at[0])
  assert.equal(points.length, expected.length, 'Only genuine visible domain endpoints get markers')
  for (let index = 0; index < points.length; index += 1) {
    const [at, included] = expected[index]
    coordinate(points[index].at, at)
    assert.equal(points[index].stroke, 'ink')
    assert.equal(points[index].fill, included ? 'ink' : 'paper',
      'Included endpoints are filled; excluded endpoints are hollow')
    assert.ok(points[index].size > 0)
  }
}

function discretePoints(spec, expected) {
  assert.equal(objectsOf(spec, 'segment').length, 0, 'Integer inputs must not be joined')
  assert.equal(objectsOf(spec, 'svgPath').length, 0, 'Integer inputs must not form a curve')
  const points = objectsOf(spec, 'point').sort((a, b) => a.at[0] - b.at[0])
  assert.equal(points.length, expected.length)
  points.forEach((point, index) => {
    coordinate(point.at, expected[index])
    assert.equal(point.fill, 'ink')
    assert.ok(Number.isInteger(point.at[0]))
  })
}

// FigureSpec paths use local, downward-y coordinates; restore mathematical coordinates.
function pathCoordinates(spec, object) {
  const tokens = object.d.trim().split(/\s+/)
  assert.equal(tokens.length % 3, 0)
  const [left, top] = spec.canvas.boundingBox
  const points = []
  for (let index = 0; index < tokens.length; index += 3) {
    assert.equal(tokens[index], index === 0 ? 'M' : 'L')
    const x = Number(tokens[index + 1])
    const y = Number(tokens[index + 2])
    assert.ok(Number.isFinite(x) && Number.isFinite(y))
    points.push([x + left, top - y])
  }
  assert.ok(points.length >= 2, 'A legacy curve must be nonempty')
  return points
}

for (const { name, k, l, start, end } of [
  { name: 'positive slope and nonzero intercept', k: 2, l: 1, start: [-2.5, -4], end: [3.5, 8] },
  { name: 'negative slope and nonzero intercept', k: -2, l: 3, start: [-2.5, 8], end: [3.5, -4] },
  { name: 'horizontal constant function', k: 0, l: -2, start: [-6, -2], end: [6, -2] },
  { name: 'shallow line clipped by vertical boundaries', k: 0.25, l: 2, start: [-6, 0.5], end: [6, 3.5] },
  { name: 'steep line clipped by horizontal boundaries', k: 1000, l: 2, start: [-0.006, -4], end: [0.006, 8] },
  { name: 'off-frame intercept with a visible line', k: 2, l: 14, start: [-6, 2], end: [-3, 8] },
]) {
  test(`unrestricted affine: ${name}`, () => {
    const spec = specFor({ type: 'affine', k, l })
    segment(spec, start, end, k, l)
    markers(spec, [])
  })
}

test('affine defaults the omitted intercept to zero', () => {
  const spec = specFor({ type: 'affine', k: 1 })
  segment(spec, [-4, -4], [6, 6], 1, 0)
  markers(spec, [])
})

test('custom frame preserves bounds, grid steps, ticks, labels and common option geometry', () => {
  const custom = {
    bounds: [-10, 12, 14, -8],
    xStep: 4,
    yStep: 5,
    xTicks: [-8, -4, 4, 8, 12],
    yTicks: [-5, 5, 10],
    xLabel: 't',
    yLabel: 'V',
  }
  const spec = specFor({ type: 'affine', k: -0.5, l: 2 }, custom)
  const grid = objectsOf(spec, 'grid')
  assert.equal(grid.length, 1)
  assert.deepEqual(grid[0].bounds, custom.bounds)
  assert.equal(grid[0].xStep, custom.xStep)
  assert.equal(grid[0].yStep, custom.yStep)
  const axes = objectsOf(spec, 'axis')
  const horizontal = axes.find(axis => axis.from[1] === 0 && axis.to[1] === 0)
  const vertical = axes.find(axis => axis.from[0] === 0 && axis.to[0] === 0)
  assert.ok(horizontal && vertical)
  coordinate(horizontal.from, [-10, 0])
  coordinate(horizontal.to, [14, 0])
  coordinate(vertical.from, [0, -8])
  coordinate(vertical.to, [0, 12])
  const xScale = axes.find(axis => axis.id === 'x-scale')
  const yScale = axes.find(axis => axis.id === 'y-scale')
  assert.deepEqual(xScale.ticks.map(tick => tick.at), custom.xTicks.map(value => [value, -8]))
  assert.deepEqual(yScale.ticks.map(tick => tick.at), custom.yTicks.map(value => [-10, value]))
  assert.deepEqual(xScale.ticks.map(tick => tick.label), custom.xTicks.map(String))
  assert.deepEqual(yScale.ticks.map(tick => tick.label), custom.yTicks.map(String))
  const labels = objectsOf(spec, 'text').map(object => object.text)
  assert.ok(labels.includes('t') && labels.includes('V'))
  const [left, top, right, bottom] = spec.canvas.boundingBox
  assert.ok(left <= -10 && top >= 12 && right >= 14 && bottom <= -8)
  const other = specFor({ type: 'affine', k: 0.25, l: -1 }, custom)
  assert.deepEqual(other.canvas, spec.canvas)
  assert.deepEqual(objectsOf(other, 'grid'), grid)
  assert.deepEqual(objectsOf(other, 'axis'), axes)
  segment(spec, [-10, 7], [14, -5], -0.5, 2)
})

for (const closed of [[true, true], [false, true], [true, false], [false, false]]) {
  test(`finite affine: endpoint inclusion ${JSON.stringify(closed)}`, () => {
    const spec = specFor({ type: 'affine', k: 1.5, l: -2, domain: [1, 4], closed })
    segment(spec, [1, -0.5], [4, 4], 1.5, -2)
    markers(spec, [[[1, -0.5], closed[0]], [[4, 4], closed[1]]])
  })
}

test('finite affine defaults both endpoints to closed', () => {
  const spec = specFor({ type: 'affine', k: 0, l: 3, domain: [-2, 1] })
  segment(spec, [-2, 3], [1, 3], 0, 3)
  markers(spec, [[[-2, 3], true], [[1, 3], true]])
})

test('finite affine does not mark a lower endpoint hidden by frame clipping', () => {
  const spec = specFor({ type: 'affine', k: 1, l: 1, domain: [-10, 2], closed: [false, true] })
  segment(spec, [-5, -4], [2, 3], 1, 1)
  markers(spec, [[[2, 3], true]])
})

test('finite affine does not mark an upper endpoint hidden by frame clipping', () => {
  const spec = specFor({ type: 'affine', k: 1, l: 0, domain: [-2, 10], closed: [false, true] })
  segment(spec, [-2, -2], [6, 6], 1, 0)
  markers(spec, [[[-2, -2], false]])
})

test('finite affine has no invented endpoint markers when both endpoints are off-frame', () => {
  const spec = specFor({ type: 'affine', k: 2, l: 1, domain: [-10, 10], closed: [false, false] })
  segment(spec, [-2.5, -4], [3.5, 8], 2, 1)
  markers(spec, [])
})

test('integer domain with fractional bounds draws only its integer inputs', () => {
  const spec = specFor({ type: 'affine', k: 2, l: 1, domain: [-1.4, 2.7], integers: true })
  discretePoints(spec, [[-1, -1], [0, 1], [1, 3], [2, 5]])
})

for (const closed of [[true, true], [false, true], [true, false], [false, false]]) {
  test(`integer domain respects open and closed bounds ${JSON.stringify(closed)}`, () => {
    const spec = specFor({ type: 'affine', k: -1, l: 2, domain: [-2, 2], integers: true, closed })
    const xs = [-1, 0, 1]
    if (closed[0]) xs.unshift(-2)
    if (closed[1]) xs.push(2)
    discretePoints(spec, xs.map(x => [x, -x + 2]))
  })
}

test('integer plotting is clipped to the visible coordinate frame without connecting points', () => {
  const spec = specFor({ type: 'affine', k: 2, l: 1, domain: [-10, 10], integers: true })
  discretePoints(spec, [-2, -1, 0, 1, 2, 3].map(x => [x, 2 * x + 1]))
})

test('integer inputs may share a constant output without losing distinct points', () => {
  const spec = specFor({ type: 'affine', k: 0, l: -1, domain: [-2, 2], integers: true })
  discretePoints(spec, [-2, -1, 0, 1, 2].map(x => [x, -1]))
})

for (const [name, domain] of [
  ['one bound', [0]],
  ['three bounds', [-1, 0, 1]],
  ['reversed bounds', [2, -2]],
  ['equal bounds', [1, 1]],
  ['NaN bound', [NaN, 1]],
  ['infinite bound', [0, Infinity]],
  ['string bound', ['0', 1]],
  ['null instead of an interval', null],
  ['false instead of an interval', false],
  ['zero instead of an interval', 0],
]) {
  test(`invalid affine domain is rejected: ${name}`, () => {
    assert.throws(() => specFor({ type: 'affine', k: 1, l: 0, domain }))
  })
}

for (const [name, graph] of [
  ['non-finite slope', { type: 'affine', k: NaN, l: 0 }],
  ['non-finite intercept', { type: 'affine', k: 1, l: Infinity }],
  ['integer mode without a finite domain', { type: 'affine', k: 1, integers: true }],
  ['one endpoint inclusion flag', { type: 'affine', k: 1, domain: [-1, 1], closed: [true] }],
  ['non-boolean endpoint flag', { type: 'affine', k: 1, domain: [-1, 1], closed: [true, 'false'] }],
  ['non-boolean integer flag', { type: 'affine', k: 1, domain: [-1, 1], integers: 'false' }],
  ['domain wholly beyond the x frame', { type: 'affine', k: 0, l: 0, domain: [7, 9] }],
  ['horizontal function wholly beyond the y frame', { type: 'affine', k: 0, l: 9 }],
]) {
  test(`invalid or invisible affine graph is rejected: ${name}`, () => {
    assert.throws(() => specFor(graph))
  })
}

for (const [name, coordinateFrame] of [
  ['missing frame', undefined],
  ['missing bounds', { ...frame, bounds: undefined }],
  ['extra bound', { ...frame, bounds: [-6, 8, 6, -4, 10] }],
  ['non-finite bound', { ...frame, bounds: [-6, Infinity, 6, -4] }],
  ['reversed x bounds', { ...frame, bounds: [6, 8, -6, -4] }],
  ['reversed y bounds', { ...frame, bounds: [-6, -4, 6, 8] }],
  ['origin outside frame', { ...frame, bounds: [1, 8, 6, -4] }],
  ['zero x step', { ...frame, xStep: 0 }],
  ['negative y step', { ...frame, yStep: -1 }],
  ['non-finite grid step', { ...frame, xStep: NaN }],
  ['non-finite x tick', { ...frame, xTicks: [NaN] }],
  ['non-finite y tick', { ...frame, yTicks: [Infinity] }],
  ['tick outside its axis', { ...frame, xTicks: [-7] }],
]) {
  test(`invalid affine frame is rejected: ${name}`, () => {
    assert.throws(() => graphSpec('invalid-frame', { type: 'affine', k: 1, l: 0 },
      source, text, reference, coordinateFrame))
  })
}

for (const type of ['direct', 'direct-positive', 'inverse', 'inverse-positive']) {
  for (const k of type.startsWith('inverse') ? [6, -6] : [0.2, -3]) {
    test(`legacy ${type} remains mathematically usable with k=${k}`, () => {
      const spec = specFor({ type, k })
      const curves = objectsOf(spec, 'svgPath')
      const positive = type.endsWith('positive')
      const inverse = type.startsWith('inverse')
      assert.equal(curves.length, positive ? 1 : 2)
      assert.equal(objectsOf(spec, 'point').length, 0)
      const points = curves.flatMap(curve => pathCoordinates(spec, curve))
      for (const [x, y] of points) {
        if (inverse) {
          assert.notEqual(x, 0, 'An inverse graph must not include its singularity')
          close(x * y, k)
        } else close(y, k * x)
        assert.ok(x >= -8 - 1e-10 && x <= 8 + 1e-10)
        assert.ok(y >= -8 - 1e-10 && y <= 8 + 1e-10)
        if (positive) assert.ok(x >= 0)
      }
      assert.ok(points.some(([x]) => x > 0))
      if (!positive) assert.ok(points.some(([x]) => x < 0))
    })
  }
}

test('legacy named points preserve coordinates and labels without connecting them', () => {
  const supplied = [['A', -3, 2], ['B', 1, -4], ['C', 0, 0]]
  const spec = specFor({ type: 'points', points: supplied })
  const points = objectsOf(spec, 'point')
  assert.equal(points.length, supplied.length)
  for (const [label, x, y] of supplied) {
    const point = points.find(object => object.label === label)
    assert.ok(point, `Missing named point ${label}`)
    coordinate(point.at, [x, y])
  }
  assert.equal(objectsOf(spec, 'segment').length, 0)
  assert.equal(objectsOf(spec, 'svgPath').length, 0)
})

test('graph specifications retain the supplied source and complete authoritative text', () => {
  const spec = specFor({ type: 'affine', k: 1, l: 2 })
  assert.equal(spec.schema, 'ld-s10y-image/figure-spec@2')
  assert.equal(spec.mode, 'deterministic')
  assert.deepEqual(spec.source.image, source)
  assert.deepEqual(spec.source.authoritativeText, [...reference.authoritativeText, { text }])
  assert.ok(spec.source.inventory.some(item => item.description === reference.description))
})
