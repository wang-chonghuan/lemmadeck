import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { createRequire } from 'node:module'
import { exactMathAnswersMatch } from '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/app/src/lib/answer-normalize.ts'

const repo = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck'
const own = path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp/n47-answer-author')
if (process.cwd() !== repo) throw new Error('Wrong cwd')
const receipt = path.join(own, 'evidence/author-arithmetic.json')
if (fs.existsSync(receipt)) throw new Error('Arithmetic checks already run')
const candidatePath = path.join(own, 'candidate/answer-keys.json')
const candidateSha256 = crypto.createHash('sha256').update(fs.readFileSync(candidatePath)).digest('hex')
const frozen = JSON.parse(fs.readFileSync(path.join(own, 'evidence/first-candidate-freeze.json'), 'utf8'))
if (candidateSha256 !== frozen.candidate.sha256) throw new Error('Candidate changed')
const candidate = JSON.parse(fs.readFileSync(candidatePath, 'utf8'))
const require = createRequire(path.join(repo, 'app/package.json'))
const { ComputeEngine } = require('@cortex-js/compute-engine')
const ce = new ComputeEngine()
const checks = []
const test = (name, condition, details) => checks.push({ name, passed: condition, details })
const close = (left, right) => Math.abs(left - right) < 1e-10
const answer = (number) => candidate.answers.find((item) => item.exercise === number)
const numeric = (value) => ce.parse(value).N().re

// These are assertions against the frozen manually authored keys, not answer generation.
for (const [number, counts] of [['49', [6, 4, 0]], ['51', [12]]]) {
  const numericParts = answer(number).parts.filter((part) => part.judge === 'numeric')
  numericParts.forEach((part, index) => {
    test(`${number}/${part.label}: independently counted value`, numeric(part.expected[0]) === counts[index], {
      expectedLatex: part.expected[0], counted: counts[index],
    })
    test(`${number}/${part.label}: adjacent wrong integer rejected by equivalence`,
      ce.parse(part.expected[0]).isEqual(ce.number(counts[index] + 1)) === false,
      { wrongInteger: counts[index] + 1 })
  })
}
const exactNegatives = {
  '49': ['\\text{正方体}'],
  '50': ['\\text{不能}', '\\text{能}'],
  '53': ['\\text{不正确}', '\\text{正确}'],
}
for (const [number, negatives] of Object.entries(exactNegatives)) {
  const parts = answer(number).parts.filter((part) => part.judge === 'exact')
  parts.forEach((part, index) => test(
    `${number}/${part.label}: contrary literal rejected`,
    !exactMathAnswersMatch(part.expected, negatives[index]),
    { contrary: negatives[index], method: 'Product pure normalizer only; this is not a second MathLive edit check or semantic proof check.' },
  ))
}
test('52: square-pyramid edge count', 4 + 4 === 8, { baseEdges: 4, sideEdges: 4 })
test('52: triangular-prism edge count', 3 + 3 + 3 === 9, { lowerEdges: 3, upperEdges: 3, joiningEdges: 3 })
const containsP = ([x, y, z]) => x >= 0 && x <= 2 && y >= 0 && y <= 1 && z >= 0 && z <= 1
const containsQ = ([x, y, z]) => x >= 0 && x <= 1 && y >= 0 && y <= 2 && z >= 0 && z <= 1
const X = [7 / 4, 3 / 4, 1 / 2]
const Y = [3 / 4, 7 / 4, 1 / 2]
const M = X.map((value, index) => (value + Y[index]) / 2)
test('53/2: concrete three-dimensional nonconvex-union witness',
  containsP(X) && containsQ(Y) && !containsP(M) && !containsQ(M),
  { X, Y, midpoint: M, midpointInP: containsP(M), midpointInQ: containsQ(M) })

const subtract = (left, right) => left.map((value, index) => value - right[index])
const cross = (left, right) => [
  left[1] * right[2] - left[2] * right[1],
  left[2] * right[0] - left[0] * right[2],
  left[0] * right[1] - left[1] * right[0],
]
const norm = (vector) => Math.hypot(...vector)
const triangleArea = (A, B, C) => norm(cross(subtract(B, A), subtract(C, A))) / 2
const points = {
  A: [0, 0, 0], B: [1, 0, 0], C: [1, 1, 0], D: [0, 1, 0],
  F: [1 / 4, 0, Math.sqrt(3) / 4], E: [3 / 4, 0, Math.sqrt(3) / 4],
}
const distance = (A, B) => norm(subtract(points[A], points[B]))
for (const edge of [['A', 'F'], ['B', 'E'], ['E', 'F']]) {
  test(`54: manually derived coordinates satisfy |${edge.join('')}|=a/2 at a=1`,
    close(distance(...edge), 1 / 2), { distance: distance(...edge) })
}
const alpha = 180 / Math.PI * Math.asin(points.F[2] / distance('A', 'F'))
const beta = 180 / Math.PI * Math.atan(points.F[2])
const parts54 = answer('54').parts
test('54/1: slope from stated geometry agrees with key', close(alpha, numeric(parts54[0].expected[0])), {
  alphaDegrees: alpha, expectedLatex: parts54[0].expected[0],
})
test('54/2: dihedral from stated geometry agrees with degree key', close(beta, numeric(parts54[1].expected[0])), {
  betaDegrees: beta, expectedLatex: parts54[1].expected[0],
})
test('54/2: arccos normal-vector expression agrees',
  close(beta, 180 / Math.PI * Math.acos(4 / Math.sqrt(19))), { betaDegrees: beta })
test('54/2: common two-decimal approximation inside declared tolerance',
  Math.abs(beta - 23.41) <= parts54[1].tolerance, { inputDegrees: 23.41, tolerance: parts54[1].tolerance })
test('54/2: 24 degrees outside declared tolerance',
  Math.abs(beta - 24) > parts54[1].tolerance, { wrongDegrees: 24, tolerance: parts54[1].tolerance })
const areas = {
  ABCD: 1,
  ABEF: triangleArea(points.A, points.B, points.E) + triangleArea(points.A, points.E, points.F),
  DCEF: triangleArea(points.D, points.C, points.E) + triangleArea(points.D, points.E, points.F),
  ADF: triangleArea(points.A, points.D, points.F),
  BCE: triangleArea(points.B, points.C, points.E),
}
const total = Object.values(areas).reduce((sum, area) => sum + area, 0)
const manualAreaCoefficient = 3 / 16 * (8 + Math.sqrt(3) + Math.sqrt(19))
test('54/3: all five face areas sum to manually derived coefficient',
  close(total, manualAreaCoefficient), { normalizedAt: 'a=1', areas, total, manualAreaCoefficient })
const targetArea = ce.parse(parts54[2].expected[0])
const expandedArea = ce.parse('\\frac{3a^2}{2}+\\frac{3\\sqrt{3}a^2}{16}+\\frac{3\\sqrt{19}a^2}{16}')
test('54/3: alternate expanded area is equivalent under installed ComputeEngine',
  targetArea.isEqual(expandedArea) === true, { alternateLatex: expandedArea.latex })
const missingTriangleArea = ce.parse('\\frac{5a^2}{4}+\\frac{3\\sqrt{3}a^2}{16}+\\frac{3\\sqrt{19}a^2}{16}')
test('54/3: omitting one triangular face is not equivalent',
  targetArea.isEqual(missingTriangleArea) === false, { wrongLatex: missingTriangleArea.latex })
test('54: surface incidence closes every edge exactly twice', (() => {
  const faces = [['A', 'B', 'C', 'D'], ['A', 'B', 'E', 'F'], ['D', 'C', 'E', 'F'], ['A', 'D', 'F'], ['B', 'C', 'E']]
  const incidence = new Map()
  for (const face of faces) {
    for (let index = 0; index < face.length; index += 1) {
      const edge = [face[index], face[(index + 1) % face.length]].sort().join('')
      incidence.set(edge, (incidence.get(edge) ?? 0) + 1)
    }
  }
  return incidence.size === 9 && [...incidence.values()].every((count) => count === 2)
})(), { vertices: 6, edges: 9, faces: 5, eulerCharacteristic: 6 - 9 + 5 })
const failed = checks.filter((check) => !check.passed)
const report = {
  status: failed.length ? 'fail' : 'pass',
  role: 'author-arithmetic-and-key-checks-only',
  candidateSha256,
  computeEnginePath: require.resolve('@cortex-js/compute-engine'),
  productNormalizerPath: path.join(repo, 'app/src/lib/answer-normalize.ts'),
  checkCount: checks.length, failureCount: failed.length,
  checks,
  sourcePixelMetricInference: false,
  generatedAnswers: false,
  independentReview: false,
  gate2Approval: false,
  backendImportedOrCalled: false,
}
fs.writeFileSync(receipt, `${JSON.stringify(report, null, 2)}\n`, { flag: 'wx' })
console.log(JSON.stringify({ receipt, status: report.status, checks: checks.length, failures: failed }, null, 2))
process.exitCode = failed.length ? 2 : 0
