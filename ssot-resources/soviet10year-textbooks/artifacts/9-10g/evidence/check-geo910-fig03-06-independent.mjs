import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'

const root = '.tmp/s10y-image/9-10g'
const hash = (file) => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const read = (file) => JSON.parse(fs.readFileSync(file))
const dot = (a, b) => a.reduce((sum, value, index) => sum + value * b[index], 0)
const close = (a, b) => a.forEach((value, index) => assert(Math.abs(value - b[index]) < 1e-8))
const results = []
for (const number of [3, 4, 5, 6]) {
  const id = `fig-${String(number).padStart(2, '0')}`
  const directory = path.join(root, id)
  const specPath = path.join(directory, `${id}.spec.json`)
  const spec = read(specPath)
  const render = read(path.join(directory, `${id}.render.json`))
  assert.equal(render.status, 'pass')
  assert.equal(render.spec.sha256, hash(specPath))
  assert.equal(render.output.svg.sha256, hash(path.join(directory, `${id}.svg`)))
  assert.equal(spec.source.image.sha256, hash(spec.source.image.path))
  const objects = Object.fromEntries(spec.objects.map((object) => [object.id, object]))
  const point = (value) => typeof value === 'string' ? objects[value].at : value
  const checks = []
  if (number <= 5) {
    const model = read(path.join(directory, 'projection-model.json'))
    const project = (coordinate) => model.projection.origin.map((value, axis) =>
      value + coordinate.reduce((sum, component, index) =>
        sum + component * model.projection.basis[index][axis], 0))
    for (const [key, window] of Object.entries(model.planarWindows)) {
      window.forEach((coordinate, index) => {
        assert.equal(dot(model.plane.normal, coordinate), model.plane.constant)
        close(project(coordinate), objects[key].points[index])
      })
    }
    for (const [key, coordinate] of Object.entries(model.spatialPoints)) close(project(coordinate), objects[key].at)
    checks.push('All finite plane-window vertices and named model points bind exactly to current spec')
    if (number === 3) {
      assert.notEqual(dot(model.plane.normal, model.spatialPoints.A), model.plane.constant)
      const top = Math.max(...objects['alpha-outline'].points.map((coordinate) => coordinate[1]))
      assert(objects.A.at[1] - top >= 30)
      assert(objects['A-label'].at[1] - top >= 30)
      checks.push('A is outside z=0; dot and A label are above the entire drawing window')
    }
    if (number === 4) {
      assert.equal(dot(model.plane.normal, model.spatialLine.from), model.plane.constant)
      assert.equal(dot(model.plane.normal, model.spatialLine.direction), 0)
      close(project(model.spatialLine.from), objects['line-a'].from)
      close(project(model.spatialLine.from.map((value, index) => value + model.spatialLine.direction[index])),
        objects['line-a'].to)
      checks.push('Entire infinite a lies in z=0; finite depicted extents bind to its projection')
    }
    if (number === 5) {
      assert.equal(dot(model.plane.normal, model.spatialPoints.A), 0)
      assert.equal(dot(model.plane.normal, model.spatialPoints.B), 1)
      assert.equal(dot(model.plane.normal, model.spatialLine.from), 0)
      assert.equal(dot(model.plane.normal, model.spatialLine.direction), 1)
      assert.deepEqual(model.spatialLine.from, model.spatialPoints.A)
      assert.deepEqual(model.spatialLine.direction, [1, 0, 1])
      for (const [index, piece] of model.sourceVisibility.entries()) {
        assert.equal(piece.dash, [0, 2, 0][index])
        assert.equal(objects[piece.id].dash, piece.dash)
        const projected = piece.parameters.map((parameter) =>
          project(model.spatialLine.from.map((value, axis) => value + parameter * model.spatialLine.direction[axis])))
        close(projected[0], point(objects[piece.id].from))
        close(projected[1], point(objects[piece.id].to))
      }
      checks.push('a(t)=(t,0,t) meets z=0 iff t=0=A; B lies on solid upper piece; solid/dashed/solid sequence binds')
    }
  } else {
    const [A, B, C] = ['A', 'B', 'C'].map((key) => objects[key].at)
    const determinant = (B[0] - A[0]) * (C[1] - A[1]) - (B[1] - A[1]) * (C[0] - A[0])
    assert.equal(determinant, 21715)
    assert.deepEqual(spec.objects.filter((object) => object.type === 'point').map((object) => object.id), ['A', 'B', 'C'])
    assert.equal(spec.objects.filter((object) => object.id.startsWith('rod-')).length, 3)
    for (const coordinate of [A, B, C]) {
      const signs = objects.card.points.map((from, index, vertices) => {
        const to = vertices[(index + 1) % vertices.length]
        return Math.sign((to[0] - from[0]) * (coordinate[1] - from[1]) -
          (to[1] - from[1]) * (coordinate[0] - from[0]))
      })
      assert(signs.every((sign) => sign === signs[0] && sign !== 0))
    }
    checks.push('A/B/C are inside one convex card; determinant21715 proves noncollinearity; exactly three supports')
  }
  results.push({ id, status: 'pass', specSha256: hash(specPath), svgSha256: hash(path.join(directory, `${id}.svg`)), checks })
}
fs.writeFileSync('.intentfold/tickets/STEMROBIN-184/tmp/geo910-fig03-06-independent-math.json',
  JSON.stringify({ status: 'pass', results, limitation: 'Chosen text-consistent projected models, not measured source3D geometry. Separate actual screenshots establish visual/source fit.' }, null, 2) + '\n')
console.log('Independent source-driven math/projection bindings PASS for figures3-6')
