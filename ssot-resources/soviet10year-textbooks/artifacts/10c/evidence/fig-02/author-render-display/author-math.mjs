import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const directory = path.dirname(fileURLToPath(import.meta.url))
const specPath = path.join(directory, 'spec.json')
const lessonPath = 'ssot-resources/soviet10year-textbooks/artifacts/10c/editions/modern-us-neutral/lessons/ana10-c6-s1-n76/lesson.json'
const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'))
const sha = data => crypto.createHash('sha256').update(data).digest('hex')
const fileEvidence = file => ({ path: file, sha256: sha(fs.readFileSync(file)) })
const near = (actual, expected, message, tolerance = 1e-11) => {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${message}: ${actual} != ${expected}`)
}
const point = id => spec.objects.find(object => object.id === id).at
const [xmin, ymax, xmax, ymin] = spec.canvas.boundingBox
const sx = spec.canvas.width / (xmax - xmin)
const sy = spec.canvas.height / (ymax - ymin)
near(sx, sy, 'equal x/y scale')
const sourceBytes = fs.readFileSync(spec.source.image.path)
assert.equal(sha(sourceBytes), spec.source.image.sha256)
assert.ok(fs.existsSync(path.join(directory, 'source-inventory.md')))

const lesson = JSON.parse(fs.readFileSync(lessonPath, 'utf8'))
const prose = lesson.prose.filter(block => block.kind === 'p' && block.text)
assert.equal(prose.length, 14)
assert.deepEqual(spec.source.authoritativeText, prose.map(block => ({
  lesson: lesson.id, text: block.text,
})))
assert.deepEqual(spec.objects.filter(object => object.type === 'text').map(object => object.text), ['x', 'y', '0'])
assert.equal(spec.objects.filter(object => object.type === 'segment').length, 2)
assert.equal(spec.objects.filter(object => object.type === 'arrow').length, 2)
assert.ok(spec.objects.filter(object => object.type === 'point').every(object => object.visible === false && !object.label))

const halfPi = Math.PI / 2
const sine = x => x === halfPi ? 1 : x === -halfPi ? -1 : x === 0 ? 0 : Math.sin(x)
const cosine = x => Math.abs(x) === halfPi ? 0 : x === 0 ? 1 : Math.cos(x)
const breaks = [-2.7, -halfPi, 0, halfPi, 2.9]
const knots = [breaks[0]]
for (let interval = 0; interval < breaks.length - 1; interval += 1) {
  const left = breaks[interval]
  const right = breaks[interval + 1]
  const steps = Math.ceil((right - left) / 0.125)
  for (let i = 1; i <= steps; i += 1) {
    knots.push(i === steps ? right : left + (right - left) * i / steps)
  }
}
const toPath = ([x, y]) => [x - xmin, ymax - y]
const fromPath = ([x, y]) => [x + xmin, ymax - y]
const encode = coordinates => coordinates.map(value => Number(value.toPrecision(17))).join(' ')
const expectedPieces = knots.slice(1).map((right, i) => {
  const left = knots[i]
  const h = right - left
  return [
    [left, sine(left)],
    [left + h / 3, sine(left) + h * cosine(left) / 3],
    [right - h / 3, sine(right) - h * cosine(right) / 3],
    [right, sine(right)],
  ]
})
const curve = spec.objects.find(object => object.id === 'sine-curve')
const calculatedPath = `M ${encode(toPath(expectedPieces[0][0]))} ` +
  expectedPieces.map(piece => `C ${piece.slice(1).map(at => encode(toPath(at))).join(' ')}`).join(' ')
if (process.argv.includes('--serialize')) {
  // Mechanically serialize derived curve coordinates; all authored spec fields remain untouched.
  curve.d = calculatedPath
  fs.writeFileSync(specPath, `${JSON.stringify(spec, null, 2)}\n`)
}
assert.equal(curve.d, calculatedPath, 'current spec path is the derived Hermite curve')
assert.ok(!/[ALQSHVZT]/i.test(curve.d), 'only M/C commands permitted')
const raw = curve.d.match(/[-+]?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?/gi).map(Number)
assert.equal(raw.length, 2 + 6 * expectedPieces.length)
const decoded = []
let start = fromPath(raw.slice(0, 2))
for (let i = 2; i < raw.length; i += 6) {
  const piece = [start, ...[0, 2, 4].map(j => fromPath(raw.slice(i + j, i + j + 2)))]
  decoded.push(piece)
  start = piece[3]
}
const slope = (a, b) => (b[1] - a[1]) / (b[0] - a[0])
const checks = []
let maximumKnotError = 0
let maximumSlopeError = 0
let maximumStep = 0
const tolerance = 1e-11
for (const [index, piece] of decoded.entries()) {
  const [p0, p1, p2, p3] = piece
  const h = p3[0] - p0[0]
  maximumStep = Math.max(maximumStep, h)
  near(p1[0] - p0[0], h / 3, 'affine x first control')
  near(p3[0] - p2[0], h / 3, 'affine x second control')
  for (const endpoint of [p0, p3]) {
    const err = Math.abs(endpoint[1] - sine(knots[index + (endpoint === p3 ? 1 : 0)]))
    maximumKnotError = Math.max(maximumKnotError, err)
    assert.ok(err < tolerance)
  }
  const derivativeControls = [
    3 * (p1[1] - p0[1]) / h,
    3 * (p2[1] - p1[1]) / h,
    3 * (p3[1] - p2[1]) / h,
  ]
  const errors = [
    Math.abs(slope(p0, p1) - cosine(knots[index])),
    Math.abs(slope(p2, p3) - cosine(knots[index + 1])),
  ]
  maximumSlopeError = Math.max(maximumSlopeError, ...errors)
  assert.ok(Math.max(...errors) < tolerance)
  const middle = (p0[0] + p3[0]) / 2
  const derivativeSign = Math.abs(middle) < halfPi ? 1 : -1
  assert.ok(derivativeControls.every(value => derivativeSign * value >= -tolerance))
  assert.ok(piece.every(([x, y]) => x >= xmin && x <= xmax && y >= ymin && y <= ymax))
  assert.ok(piece.every(([, y]) => y <= 1 + tolerance && y >= -1 - tolerance))
  const originSide = middle > 0 ? -1 : 1
  assert.ok(piece.every(([x, y]) => originSide * (y - x) >= -tolerance))
}
checks.push({
  id: 'serialized-sine',
  result: 'verified',
  segments: decoded.length,
  maximumKnotError,
  maximumSlopeError,
  proof: 'Each serialized cubic has affine x and Hermite endpoint data sin(x), cos(x). For sine, |f^(4)|<=1, so the Hermite remainder is bounded by h^4/384 on every interval. Canonical origin and +/-pi/2 data are exactly 0,+/-1 and slopes 1,0 before decimal serialization.',
})
checks.push({
  id: 'shape-and-no-extra-turns',
  result: 'verified',
  proof: 'Every piece has derivative Bernstein controls of the sign of cos on its interval. Knots include both extrema. Thus there is exactly one trough and one crest, with no additional turns. All y-control values lie in [-1,1]; x is strictly increasing. Both crop endpoints stay within (-pi,pi), with opposite signs of sine.',
  leftEndpoint: decoded[0][0],
  rightEndpoint: decoded.at(-1)[3],
})
assert.ok(decoded[0][0][1] < 0 && decoded.at(-1)[3][1] > 0)

const contacts = [
  { id: 'origin', x: 0, y: 0, expectedSlope: 1 },
  { id: 'crest', x: halfPi, y: 1, expectedSlope: 0 },
]
for (const contact of contacts) {
  const leftPiece = decoded.find(piece => Math.abs(piece[3][0] - contact.x) < tolerance)
  const rightPiece = decoded.find(piece => Math.abs(piece[0][0] - contact.x) < tolerance)
  assert.ok(leftPiece && rightPiece, 'contact is a shared knot')
  near(leftPiece[3][1], contact.y, 'left incidence')
  near(rightPiece[0][1], contact.y, 'right incidence')
  const leftSlope = slope(leftPiece[2], leftPiece[3])
  const rightSlope = slope(rightPiece[0], rightPiece[1])
  near(leftSlope, contact.expectedSlope, 'left contact slope')
  near(rightSlope, contact.expectedSlope, 'right contact slope')
  near(point(contact.id)[0], contact.x, 'native contact x')
  near(point(contact.id)[1], contact.y, 'native contact y')
  checks.push({
    id: `${contact.id}-sine-tangency`,
    result: 'verified',
    contact: [contact.x, contact.y],
    leftSlope,
    rightSlope,
    nativePointVisible: false,
  })
}
checks.push({
  id: 'no-tangent-crossing-at-contact',
  result: 'verified',
  proof: 'All positive-x cubic control values satisfy y<=x, and all negative-x controls satisfy y>=x. The line difference is a Bernstein cubic, so no false diagonal crossing is introduced. All control values have y<=1, so the horizontal tangent is not crossed. Equality at the origin/crest is accompanied by the verified derivative slope.',
})
const originTangent = spec.objects.find(object => object.id === 'origin-tangent')
const crestTangent = spec.objects.find(object => object.id === 'crest-tangent')
originTangent.from.concat(originTangent.to).forEach(Number.isFinite)
for (const [x, y] of [originTangent.from, originTangent.to]) near(y, x, 'diagonal is y=x')
for (const [, y] of [crestTangent.from, crestTangent.to]) near(y, 1, 'horizontal is y=1')
assert.ok(crestTangent.from[0] > 0 && crestTangent.from[0] < halfPi && crestTangent.to[0] > halfPi)
assert.deepEqual(point('tangent-intersection'), [1, 1])
assert.ok(1 < halfPi, 'tangent intersection is left of crest')
checks.push({
  id: 'shared-frame-and-two-lines',
  result: 'verified',
  xScale: sx,
  yScale: sy,
  diagonalScreenSlope: -1,
  tangentIntersection: [1, 1],
  crest: [halfPi, 1],
  proof: 'Equal screen scales preserve the y=x bisector; the two exact tangent segments meet at (1,1), left of pi/2. Native incidence/connects/perpendicular/parallel/displacement assertions separately bind the actual spec endpoints.',
})

const theoreticalError = maximumStep ** 4 / 384
const evidence = {
  schema: '10c-fig02-author-math@1',
  role: 'author-check-only-not-independent-approval',
  source: fileEvidence(spec.source.image.path),
  context: fileEvidence(path.join(directory, 'context.json')),
  inventory: fileEvidence(path.join(directory, 'source-inventory.md')),
  modernLesson: fileEvidence(lessonPath),
  modernParagraphCount: prose.length,
  spec: fileEvidence(specPath),
  pathSha256: sha(curve.d),
  error: {
    maximumStep,
    theoreticalUserUnits: theoreticalError,
    theoreticalNativePixels: theoreticalError * sy,
    floatingPointToleranceUserUnits: tolerance,
    statement: 'A numerical SVG approximation to the analytic sine, not a claim that a cubic equals sine identically. Exact knot incidence and endpoint slopes are preserved to the stated serialization tolerance.',
  },
  checks,
  limitation: 'FigureSpec has no native analytic sine/tangency assertion type. This author evidence verifies the actual serialized path; it supplements, not replaces, the separate source-first independent mathematical/visual review.',
  result: 'author-math-checks-complete',
}
fs.writeFileSync(path.join(directory, 'author-math.json'), `${JSON.stringify(evidence, null, 2)}\n`)
console.log(JSON.stringify({
  role: evidence.role,
  segments: decoded.length,
  nativePixelErrorBound: evidence.error.theoreticalNativePixels,
  specSha256: evidence.spec.sha256,
  checks: checks.map(check => check.id),
}, null, 2))
