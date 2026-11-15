import assert from 'node:assert/strict'
import fs from 'node:fs'
import { createHash } from 'node:crypto'

const root = '.tmp/s10y-image/9-10g/fig-11'
const hash = (file) => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const read = (file) => JSON.parse(fs.readFileSync(file))
const spec = read(`${root}/fig-11.spec.json`)
const model = read(`${root}/projection-model.json`)
const render = read(`${root}/fig-11.render.json`)
const objects = Object.fromEntries(spec.objects.map((object) => [object.id, object]))
const close = (a, b) => a.forEach((value, index) => assert(Math.abs(value - b[index]) < 1e-8))
const dot = (a, b) => a.reduce((sum, value, index) => sum + value * b[index], 0)
assert.equal(render.status, 'pass')
assert.equal(render.spec.sha256, hash(`${root}/fig-11.spec.json`))
assert.equal(render.output.svg.sha256, hash(`${root}/fig-11.svg`))
assert.equal(spec.source.image.sha256, hash(spec.source.image.path))
for (const panel of model.panels) {
  const project = (coordinate) => panel.projection.origin.map((value, axis) =>
    value + coordinate.reduce((sum, component, index) =>
      sum + component * panel.projection.basis[index][axis], 0))
  panel.planeWindow.vertices.forEach((coordinate, index) => {
    assert.equal(dot(panel.plane.normal, coordinate), panel.plane.constant)
    close(project(coordinate), objects[panel.planeWindow.object].points[index])
  })
  for (const [key, coordinate] of Object.entries(panel.points)) {
    assert.equal(dot(panel.plane.normal, coordinate), panel.plane.constant)
    close(project(coordinate), objects[key].at)
  }
  for (const [key, line] of Object.entries(panel.lines)) {
    const direction = line.to.map((value, index) => value - line.from[index])
    assert.equal(dot(panel.plane.normal, line.from), panel.plane.constant)
    assert.equal(dot(panel.plane.normal, direction), 0)
    close(project(line.from), objects[key].from)
    close(project(line.to), objects[key].to)
  }
}
assert.equal(objects['left-line-a'].from[0], objects['left-line-a'].to[0])
assert.equal(objects['left-line-b'].from[0], objects['left-line-b'].to[0])
assert.equal(objects['left-M'].at[0], objects['left-line-b'].from[0])
assert.equal(objects['left-M'].at[0] - objects['left-line-a'].from[0], 115)
assert.equal(objects['right-M'].at[0], objects['right-line-a'].from[0])
assert.deepEqual(model.panels[1].aliases, { b: 'right-line-a' })
assert(!objects['right-line-b'] && !objects['right-b-label'])
assert.equal(spec.objects.filter((object) => object.type === 'segment').length, 3)
assert.equal(spec.objects.filter((object) => object.type === 'point').length, 2)
fs.writeFileSync('.intentfold/tickets/STEMROBIN-184/tmp/geo910-fig11-independent-math.json', JSON.stringify({
  status: 'pass', specSha256: hash(`${root}/fig-11.spec.json`), svgSha256: hash(`${root}/fig-11.svg`),
  modelSha256: hash(`${root}/projection-model.json`),
  checks: [
    'Both separate local plane windows/points/line extents project exactly to current spec',
    'Complete infinite lines have n.p0=constant and n.direction=0',
    'Left vertical a/b are distinct; M lies on b and is115projectionpixels off a',
    'Right M lies on sole a; alias b resolves to same geometry and no second b stroke/label is rendered',
  ],
  limitation: '115 is chosen layout separation, not a source measurement. Source/cultural/legibility review uses actual full previews separately.',
}, null, 2) + '\n')
console.log('Independent fig11 source relationships/affine bindings PASS')
