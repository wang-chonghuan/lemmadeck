import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const directory = path.dirname(fileURLToPath(import.meta.url))
const specPath = path.join(directory, 'spec.attempt-01.json')
const basisPath = path.join(directory, 'geometry-basis.attempt-01.json')
const lessonPath = 'ssot-resources/soviet10year-textbooks/artifacts/10c/editions/modern-us-neutral/lessons/ana10-c6-s3-n84/lesson.json'
const contextPath = '.tmp/s10y-image/batch007/10c/fig-23/context.json'
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const spec = read(specPath)
const basis = read(basisPath)
const lesson = read(lessonPath)
const context = read(contextPath)
const objects = new Map(spec.objects.map(object => [object.id, object]))

assert.equal(sha(lessonPath), basis.mirrorAuthority.approvedLessonSha256)
assert.equal(context.sourceImage.sha256, spec.source.image.sha256)
assert.equal(sha(spec.source.image.path), spec.source.image.sha256)
assert(lesson.prose[1].text.includes('关于直线 $y=x$ 对称'))
assert(lesson.prose[3].text.includes('$g$ 严格上升（图23a）'))
assert(lesson.prose[3].text.includes('$g$ 严格下降（图23b）'))
assert.deepEqual(spec.source.authoritativeText.map(item => item.text),
  lesson.prose.filter(item => item.text).map(item => item.text))
assert.equal(spec.display.layout, 'scroll')
assert.deepEqual(spec.display.widths, [640])
assert.equal(spec.display.minTextPx, 16)
assert.equal(basis.originTreatment.sourceOpticalCodePoint,
  'UNKNOWN: capital O versus numeral zero')
assert(spec.source.inventory.some(group => group.description.includes('UNKNOWN')))
assert.equal(spec.objects.filter(object => object.type === 'point').length, 0)
assert.equal(spec.objects.filter(object => object.type === 'svgPath').length, 4)
assert.equal(spec.objects.filter(object => object.type === 'arrow').length, 4)
assert(spec.objects.every(object => !String(object.text || object.label || '').includes('?')))
assert(spec.objects.every(object => object.text !== 'y=x' && object.text !== 'y = x'))

const canonicalPath = segments => [
  `M ${segments[0][0].join(' ')}`,
  ...segments.map(segment => `C ${segment.slice(1).flat().join(' ')}`),
].join(' ')

// Exact quadratic extrema prove the entire cubic derivative, not sampled points.
function derivativeRange(segment, component) {
  const difference = segment.slice(1).map((point, index) =>
    point[component] - segment[index][component])
  const c = difference[0]
  const b = 2 * (difference[1] - difference[0])
  const a = difference[0] - 2 * difference[1] + difference[2]
  const values = [c, a + b + c]
  if (a !== 0) {
    const t = -b / (2 * a)
    if (t > 0 && t < 1) values.push(a * t * t + b * t + c)
  }
  return [3 * Math.min(...values), 3 * Math.max(...values)]
}

const results = []
for (const panel of basis.panels) {
  const [ox, oy] = panel.originScreen
  const reflected = panel.fSegments.map(segment => segment.map(([x, y]) =>
    [ox + oy - y, oy + ox - x]))
  const gSegments = panel.strictDirection === 'increasing'
    ? reflected
    : reflected.slice().reverse().map(segment => segment.slice().reverse())
  const f = objects.get(`fig23-${panel.id}-f`)
  const g = objects.get(`fig23-${panel.id}-g`)
  assert.equal(f.d, canonicalPath(panel.fSegments))
  assert.equal(g.d, canonicalPath(gSegments))
  assert.equal(f.dash || 0, 0)
  assert.equal(g.dash || 0, 0)
  const diagonal = objects.get(`fig23-${panel.id}-diagonal`)
  assert.equal(diagonal.type, 'segment')
  assert(diagonal.dash > 0)
  const xAxis = objects.get(`fig23-${panel.id}-x-axis`)
  const yAxis = objects.get(`fig23-${panel.id}-y-axis`)
  assert.equal(xAxis.from[1], 640 - oy)
  assert.equal(xAxis.to[1], 640 - oy)
  assert.equal(yAxis.from[0], ox)
  assert.equal(yAxis.to[0], ox)
  assert(xAxis.from[0] < ox && xAxis.to[0] > ox)
  assert(yAxis.from[1] < 640 - oy && yAxis.to[1] > 640 - oy)
  assert.equal(objects.get(`fig23-${panel.id}-origin-label`).text, '0')
  assert.equal(ox - ox, 0)
  assert.equal(oy - oy, 0)
  const derivatives = []
  for (const [name, segments] of [['f', panel.fSegments], ['g', gSegments]]) {
    for (const [index, segment] of segments.entries()) {
      const dx = derivativeRange(segment, 0)
      const screenDy = derivativeRange(segment, 1)
      assert(dx[0] > 0, `${panel.id} ${name}: x must increase everywhere`)
      if (panel.strictDirection === 'increasing') assert(screenDy[1] < 0)
      else assert(screenDy[0] > 0)
      assert(segment.every(([x, y]) => x > ox && y < oy))
      assert(segment.every(([x, y]) =>
        name === 'f' ? x + y > ox + oy : x + y < ox + oy))
      if (index) {
        const previous = segments[index - 1]
        assert.deepEqual(previous[3], segment[0])
        assert.deepEqual(previous[3].map((value, axis) => value - previous[2][axis]),
          segment[1].map((value, axis) => value - segment[0][axis]))
      }
      derivatives.push({ curve: name, segment: index, dx, screenDy })
    }
  }
  results.push({
    panel: panel.id,
    strictDirection: panel.strictDirection,
    exactMirror: 'all cubic control points; Bernstein affine invariance',
    separateSide: 'control hull strictly f below / g above local y=x',
    localOriginAnnotation: '0 is modern numeric chart annotation; source code point UNKNOWN',
    derivatives,
  })
}

console.log(JSON.stringify({
  schema: 'ana10-n84/scratch-author-proof@1',
  status: 'proved',
  scope: 'Author evidence only, not an independent mathematical/figure gate',
  specSha256: sha(specPath),
  basisSha256: sha(basisPath),
  lessonSha256: sha(lessonPath),
  contextSha256: sha(contextPath),
  mediaWidthPx: 640,
  panels: results,
}, null, 2))
