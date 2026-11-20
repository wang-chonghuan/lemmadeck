import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import { validateMathExpected } from '../../../../../.claude/skills/ld-s10y-answer/tools/check_math_expressions.mjs'

const root = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck'
const out = path.dirname(fileURLToPath(import.meta.url))
const require = createRequire(path.join(root, 'app/package.json'))
const { ComputeEngine } = require('@cortex-js/compute-engine')
const engine = new ComputeEngine()
const candidatePath = path.join(root, '.intentfold/tickets/STEMROBIN-188/tmp/n66-answer-author/answer-keys.candidate.json')
const candidateBytes = fs.readFileSync(candidatePath)
const candidate = JSON.parse(candidateBytes)
const parts = candidate.answers[0].parts
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex')
const independentCases = [
  { index: 0, input: '\\frac{351\\pi}{3}', want: true, reason: 'Independent source integral 364/3-13/3=351/3.' },
  { index: 0, input: '57\\pi', want: false, reason: 'Width-only reset of [1,4] to [0,3].' },
  { index: 1, input: '\\pi\\cdot\\frac{1}{5}', want: true, reason: 'Independent disk integral [x^5/5]_0^1.' },
  { index: 1, input: '\\frac{2\\pi}{5}', want: false, reason: 'Invented symmetric region doubles the volume.' },
  { index: 2, input: '\\frac{32\\pi}{30}', want: true, reason: 'Independent exact integral 16/15 with numerator and denominator doubled.' },
  { index: 2, input: '\\frac{256\\pi}{15}', want: false, reason: 'Dropped cross term in (2x-x^2)^2.' },
  { index: 3, input: '\\frac{\\pi}{2}a\\cdot a^2', want: true, reason: 'Independent integral a*x^2/2 at x=a, reordered and factored.' },
  { index: 3, input: '\\frac{a^3\\pi}{2}', want: true, reason: 'Equivalent reordered polynomial for every a>0.' },
  { index: 3, input: '\\pi a^3', want: false, reason: 'Endpoint-radius cylinder doubles the volume for every a>0.' },
  { index: 3, input: '\\frac{\\pi a^2}{2}', want: false, reason: 'Wrong parameter power; a=2 is a counterexample.' },
  { index: 3, input: '\\frac{\\pi a^3}{2}+(a-1)(a-2)', want: false, reason: 'Agrees at a=1,2 only; a=3 adds 2. Must not accept a few point coincidences.' },
  { index: 3, input: '\\frac{\\pi b^3}{2}', want: false, reason: 'Wrong free parameter, not identical as an expression in a.' },
  { index: 4, input: '\\frac{256\\pi}{14}', want: true, reason: 'Independent x^7/7 endpoint value, fraction multiplied by 2/2.' },
  { index: 4, input: '4\\pi', want: false, reason: 'Unsquared cubic-radius area integral.' },
  { index: 5, input: '\\frac{326\\pi}{28}', want: true, reason: 'Independent 86/7-9/14=163/14, fraction multiplied by 2/2.' },
  { index: 5, input: '\\frac{86\\pi}{7}', want: false, reason: 'Extra [0,1] piece from an invented boundary.' },
  { index: 5, input: '-\\frac{163\\pi}{14}', want: false, reason: 'Incorrect negative volume for a below-axis region.' }
]
for (const index of [0, 1, 2, 4, 5]) {
  independentCases.push({ index, input: '\\infty', want: false, reason: 'Nonfinite numeric submission cannot equal this finite solid volume.' })
}
const checks = independentCases.map(({ index, input, want, reason }) => {
  const submitted = engine.parse(input)
  const target = engine.parse(parts[index].expected[0])
  const actual = !submitted.has('Error') && !target.has('Error') && submitted.isEqual(target) === true
  return { label: parts[index].label, judge: parts[index].judge, input, expectedVerdict: want, actualVerdict: actual, result: actual === want ? 'PASS' : 'FAIL', reason }
})
const finiteTargets = parts.map((part, index) => {
  const parsed = engine.parse(part.expected[0])
  const n = parsed.N()
  return {
    index,
    label: part.label,
    judge: part.judge,
    latex: part.expected[0],
    parseError: parsed.has('Error'),
    canonical: parsed.json,
    finiteRealConstant: part.judge === 'numeric' ? Number.isFinite(n.re) && n.im === 0 : null,
    numericalValue: part.judge === 'numeric' ? n.re : null
  }
})
const syntax = validateMathExpected(parts)
const failures = checks.filter(c => c.result !== 'PASS')
if (syntax.status !== 'pass') failures.push({ type: 'expectedSyntax', failures: syntax.failures })
for (const target of finiteTargets) {
  if (target.parseError || (target.judge === 'numeric' && !target.finiteRealConstant)) failures.push({ type: 'target', ...target })
}
const report = {
  schema: 'stemrobin188-n66-bounded-engine-probe@1',
  result: failures.length ? 'FAIL' : 'PASS',
  candidatePath,
  candidateSha256Before: hash(candidateBytes),
  candidateSha256After: hash(fs.readFileSync(candidatePath)),
  interfaces: ['Existing validateMathExpected(parts)', 'Installed ComputeEngine.parse(), BoxedExpression.N(), BoxedExpression.isEqual()'],
  runtimeRelationship: 'The current judgeTextbookPart uses parse then isEqual(...)===true when numeric tolerance is absent and for expression. These probes use that installed pure comparison interface with supported LaTeX. They do not invoke the server wrapper or submission flow.',
  notClaimed: ['No MathLive keyboard/browser verification', 'No DB or server submission verification', 'No auto grading of integration proofs or choice-production skill', 'No exhaustive proof of the general symbolic engine'],
  finiteTargets,
  expectedSyntaxCheck: syntax,
  comparisonCount: checks.length,
  positiveCount: checks.filter(c => c.expectedVerdict).length,
  negativeCount: checks.filter(c => !c.expectedVerdict).length,
  checks,
  failures,
  testsRead: false,
  expectedSelfComparisons: 0,
  databaseConnections: 0,
  networkCalls: 0
}
fs.writeFileSync(path.join(out, 'engine-probes.json'), `${JSON.stringify(report, null, 2)}\n`, { flag: 'wx' })
console.log(JSON.stringify({ result: report.result, comparisonCount: report.comparisonCount, positiveCount: report.positiveCount, negativeCount: report.negativeCount, failures }, null, 2))
process.exitCode = report.result === 'PASS' ? 0 : 2
