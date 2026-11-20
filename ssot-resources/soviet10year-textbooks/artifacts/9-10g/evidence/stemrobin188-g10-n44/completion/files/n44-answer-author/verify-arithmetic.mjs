import assert from 'node:assert/strict'

const add = (a, b) => a.map((x, i) => x + b[i])
const sub = (a, b) => a.map((x, i) => x - b[i])
const scale = (a, s) => a.map(x => x * s)
const sq = a => a.reduce((s, x) => s + x * x, 0)
const dot = (a, b) => a.reduce((s, x, i) => s + x * b[i], 0)
const cross = (a, b) => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
]
const close = (a, b) => assert.ok(Math.abs(a - b) < 1e-10, `${a} != ${b}`)
const degrees = cosine => Math.acos(cosine) * 180 / Math.PI
const output = {}

const plotted = [[2, 3, 1], [1, -1, 2], [-3, 1 / 2, -1], [0, 2, -3], [0, 0, -3 / 2]]
output['16'] = plotted.map(([x, y, z]) => {
  const legs = [[x, 0, 0], [0, y, 0], [0, 0, z]]
  assert.deepEqual(legs.reduce(add, [0, 0, 0]), [x, y, z])
  return {point: [x, y, z], path: [[0, 0, 0], [x, 0, 0], [x, y, 0], [x, y, z]]}
})
const vector1 = sub([-1, 2, -3], [2, -3, 0])
assert.deepEqual(vector1, [-3, 5, -3])
assert.deepEqual(add([2, -3, 0], vector1), [-1, 2, -3])
// Cross-multiply the fractional coordinate differences independently.
const fractionDifferences = [[-3 * 2 - 1 * 5, 5 * 2], [0 * 3 - (-4) * 1, 1 * 3], [2 * 6 - 5 * 3, 3 * 6]]
assert.deepEqual(fractionDifferences, [[-11, 10], [4, 3], [-3, 18]])
output['17'] = {vector1, vector2Exact: ['-11/10', '4/3', '-1/6'], crossProducts: fractionDifferences}

const projected = [0, -3, 1]
assert.equal(sq(projected), 10)
output['18'] = {projection: projected, squaredLength: sq(projected), length: Math.sqrt(10)}

const M = [0, 1, 0]
const distanceA2 = sq(sub(M, [2, -1, 1]))
const distanceB2 = sq(sub(M, [0, 1, 3]))
assert.equal(distanceA2, 9)
assert.equal(distanceB2, 9)
output['19'] = {point: M, distanceA2, distanceB2, linearEquation: '4t=4'}

const A = [3, -2, 1], B = [3, 1, 5], C = [4, 0, 3]
const AB2 = sq(sub(B, A)), AC2 = sq(sub(C, A)), BC2 = sq(sub(C, B))
assert.deepEqual([AB2, AC2, BC2], [25, 9, 6])
const midpointBC = scale(add(B, C), 0.5)
const midpointAC = scale(add(A, C), 0.5)
const medianA2 = sq(sub(midpointBC, A))
const medianB2 = sq(sub(midpointAC, B))
assert.equal(medianA2, 62 / 4)
assert.equal(medianB2, 53 / 4)
// Apollonius' formula is independent of the midpoint-coordinate computation.
assert.equal((2 * AB2 + 2 * AC2 - BC2) / 4, medianA2)
assert.equal((2 * AB2 + 2 * BC2 - AC2) / 4, medianB2)
const centroid = scale(add(add(A, B), C), 1 / 3)
close(sq(centroid), 182 / 9)
const cosines = [
  (AB2 + AC2 - BC2) / (2 * Math.sqrt(AB2 * AC2)),
  (AB2 + BC2 - AC2) / (2 * Math.sqrt(AB2 * BC2)),
  (AC2 + BC2 - AB2) / (2 * Math.sqrt(AC2 * BC2)),
]
const expectedCosines = [14 / 15, 11 / (5 * Math.sqrt(6)), -5 / (3 * Math.sqrt(6))]
cosines.forEach((x, i) => close(x, expectedCosines[i]))
const anglesDegrees = cosines.map(degrees)
close(anglesDegrees.reduce((a, b) => a + b, 0), 180)
assert.deepEqual(cross(sub(B, A), sub(C, A)), [-2, 4, -3])
output['20'] = {
  midpointBC, midpointAC, medianSquaredLengths: [medianA2, medianB2],
  medianLengths: [Math.sqrt(medianA2), Math.sqrt(medianB2)],
  centroid, centroidSquaredDistance: sq(centroid), centroidDistance: Math.sqrt(182) / 3,
  sideSquaredLengths: {AB: AB2, AC: AC2, BC: BC2},
  cosines, anglesDegrees, angleSumDegrees: anglesDegrees.reduce((a, b) => a + b, 0),
}

const P = [1, -3, 0], Q = [-2, 4, 1], R = [-3, 1, 1]
assert.deepEqual(cross(sub(Q, P), sub(R, P)), [3, -1, 16])
const cases = [
  {oppositePair: 'AC', first: P, second: R, third: Q, D: [0, -6, 0], squaredLengths: [33, 105]},
  {oppositePair: 'AB', first: P, second: Q, third: R, D: [2, 0, 0], squaredLengths: [59, 27]},
  {oppositePair: 'BC', first: Q, second: R, third: P, D: [-6, 8, 2], squaredLengths: [10, 174]},
]
output['21'] = cases.map(c => {
  const D = sub(add(c.first, c.second), c.third)
  assert.deepEqual(D, c.D)
  assert.deepEqual(add(c.first, c.second), add(c.third, D))
  const lengths2 = [sq(sub(c.second, c.first)), sq(sub(D, c.third))]
  assert.deepEqual(lengths2, c.squaredLengths)
  return {oppositePair: c.oppositePair, D, squaredLengths: lengths2, lengths: lengths2.map(Math.sqrt)}
})

const V = {A: [2, 4, -4], B: [1, 1, -3], C: [-2, 0, 5], D: [-1, 3, 4]}
assert.deepEqual(sub(V.B, V.A), sub(V.C, V.D))
assert.deepEqual(sub(V.D, V.A), sub(V.C, V.B))
assert.deepEqual(cross(sub(V.B, V.A), sub(V.D, V.A)), [-23, 5, -8])
const center = scale(add(V.A, V.C), 0.5)
assert.deepEqual(center, scale(add(V.B, V.D), 0.5))
assert.deepEqual(center, [0, 2, 0.5])
assert.notDeepEqual(add(V.A, V.B), add(V.C, V.D))
assert.notDeepEqual(add(V.A, V.D), add(V.B, V.C))
const u = sub(V.C, V.A), v = sub(V.D, V.B)
assert.deepEqual(u, [-4, -4, 9])
assert.deepEqual(v, [-2, 2, 7])
assert.deepEqual([sq(u), sq(v), dot(u, v)], [113, 57, 63])
assert.equal(sq(u) * sq(v), 6441)
const acute = degrees(63 / Math.sqrt(6441))
const obtuse = degrees(-63 / Math.sqrt(6441))
close(acute + obtuse, 180)
const XA = sub(V.A, center), XB = sub(V.B, center), XC = sub(V.C, center), XD = sub(V.D, center)
close(degrees(dot(XA, XB) / Math.sqrt(sq(XA) * sq(XB))), acute)
close(degrees(dot(XC, XD) / Math.sqrt(sq(XC) * sq(XD))), acute)
close(degrees(dot(XB, XC) / Math.sqrt(sq(XB) * sq(XC))), obtuse)
close(degrees(dot(XD, XA) / Math.sqrt(sq(XD) * sq(XA))), obtuse)
output['22'] = {center, u, v, squaredLengths: [113, 57], dotProduct: 63, acuteDegrees: acute, obtuseDegrees: obtuse}

console.log(JSON.stringify({status: 'arithmetic-checks-completed', independentOfCandidate: true, results: output}, null, 2))
