import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { fileURLToPath } from 'node:url'

const root = path.dirname(fileURLToPath(import.meta.url))
const output = path.join(root, 'geometry-assertions.json')
if (fs.existsSync(output)) throw new Error('Scoped relationship receipt already exists')
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const figures = []
for (const id of ['fig-147', 'fig-148']) {
  const file = path.join(root, 'sole-repair', `${id}.spec.json`)
  const spec = JSON.parse(fs.readFileSync(file, 'utf8'))
  const objects = new Map(spec.objects.map(object => [object.id, object]))
  const point = ref => Array.isArray(ref) ? ref : objects.get(ref).at
  const checks = []
  const check = (name, evaluate) => {
    try {
      evaluate()
      checks.push({ name, status: 'PASS' })
    } catch (error) {
      checks.push({ name, status: 'FAIL', message: error.message })
    }
  }
  const order = (ids, coordinate, ascending = true) => {
    for (let i = 1; i < ids.length; i++) {
      const previous = point(ids[i - 1])[coordinate]
      const next = point(ids[i])[coordinate]
      assert(ascending ? next > previous : next < previous)
    }
  }
  const along = (objectId, from, to) => {
    const object = objects.get(objectId)
    const start = point(object.from), end = point(object.to)
    const a = point(from), b = point(to)
    assert((end[0] - start[0]) * (b[0] - a[0]) +
      (end[1] - start[1]) * (b[1] - a[1]) > 0)
  }
  const interior = (pointId, segmentId) => {
    const object = objects.get(segmentId), p = point(pointId)
    const a = point(object.from), b = point(object.to)
    const dx = b[0] - a[0], dy = b[1] - a[1]
    const t = ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy)
    const area = Math.abs(dx * (p[1] - a[1]) - dy * (p[0] - a[0]))
    assert(area < 1e-6 && t >= 0 && t <= 1)
  }
  if (id === 'fig-147') {
    check('source-order-O-F-P-S1', () => order(['O', 'F', 'P', 'S1'], 0))
    check('source-C-above-P-D-above-F-A-below-axis', () => {
      assert(point('C')[1] > point('P')[1])
      assert(point('D')[1] > point('F')[1])
      assert(point('A')[1] < 0)
    })
    check('D-interior-on-reflected-CD-track', () => interior('D', 'reflected-CD'))
    check('incoming-AC-direction', () => along('incident-direction', 'A', 'C'))
    check('reflected-CD-direction', () => along('reflected-direction', 'C', 'D'))
    check('backward-extension-is-dashed-and-not-an-arrow', () => {
      assert.equal(objects.get('backward-extension').type, 'segment')
      assert(objects.get('backward-extension').dash > 0)
    })
  } else {
    check('source-order-B-O-B1-F-P', () => order(['B', 'O', 'B1', 'F', 'P'], 0))
    check('source-contact-order-E-P-K-C', () => order(['E', 'P', 'K', 'C'], 1, false))
    check('object-up-image-down-and-smaller', () => {
      assert(point('A')[1] > point('B')[1])
      assert(point('A1')[1] < point('B1')[1])
      assert(Math.abs(point('A1')[1] - point('B1')[1]) <
        Math.abs(point('A')[1] - point('B')[1]))
      assert.equal(objects.get('object-AB').from, 'B')
      assert.equal(objects.get('object-AB').to, 'A')
      assert.equal(objects.get('image-B1A1').from, 'B1')
      assert.equal(objects.get('image-B1A1').to, 'A1')
    })
    check('A1-interior-to-all-four-reflected-tracks', () => {
      for (const line of ['ray-AC', 'ray-KA1', 'ray-PA1', 'ray-EA1']) interior('A1', line)
    })
    for (const [arrow, from, to] of [
      ['ray-AC-direction', 'A', 'C'], ['ray-CA-direction', 'C', 'A'],
      ['ray-AK-direction', 'A', 'K'], ['ray-KA1-direction', 'K', 'A1'],
      ['ray-AP-direction', 'A', 'P'], ['ray-PA1-direction', 'P', 'A1'],
      ['ray-AE-direction', 'A', 'E'], ['ray-EA1-direction', 'E', 'A1']
    ]) check(`${arrow}-orientation`, () => along(arrow, from, to))
    check('AP-pole-reflection-symmetric-about-principal-axis', () => {
      const a = point('A'), p = point('P'), i = point('A1')
      const axisReflectionOfA = [a[0], 2 * p[1] - a[1]]
      assert(Math.abs((i[0] - p[0]) * (axisReflectionOfA[1] - p[1]) -
        (i[1] - p[1]) * (axisReflectionOfA[0] - p[0])) < 1e-6)
    })
  }
  figures.push({
    figure: id, spec: { path: file, sha256: hash(file) },
    checks, status: checks.every(check => check.status === 'PASS') ? 'PASS' : 'FAIL'
  })
}
const receipt = {
  schema: 'STEMROBIN-181/scoped-source-order-and-direction-assertions@1',
  figures, status: figures.every(figure => figure.status === 'PASS') ? 'PASS' : 'FAIL',
  purpose: 'Supplement supported FigureSpec assertions with executable source ordering, image-arrow and direction checks only.',
  sourceGlyphVisualProof: false,
  nativeCollisionVerdictsOverridden: false,
  independentFIGOrDISPLAYGranted: false,
  imagesOpened: 0, wholeLessonTests: false, renderRuns: 0
}
fs.writeFileSync(output, `${JSON.stringify(receipt, null, 2)}\n`)
console.log(JSON.stringify(receipt, null, 2))
