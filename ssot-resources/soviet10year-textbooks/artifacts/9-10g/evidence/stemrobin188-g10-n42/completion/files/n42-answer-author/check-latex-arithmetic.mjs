import fs from 'node:fs'
import path from 'node:path'
import assert from 'node:assert/strict'
import {createRequire} from 'node:module'
import {pathToFileURL} from 'node:url'
import {cwd, owned, workLesson, bind, readJson} from './run.mjs'

const requireLesson = createRequire(path.join(cwd, '.claude/skills/ld-s10y-lesson/package.json'))
const requireApp = createRequire(path.join(cwd, 'app/package.json'))
const katex = requireLesson('katex')
const {ComputeEngine} = requireApp('@cortex-js/compute-engine')
const {exactMathAnswersMatch, normalizeMathAnswer} = await import(
  pathToFileURL(path.join(cwd, 'app/src/lib/answer-normalize.ts')).href
)
const engine = new ComputeEngine()
const candidatePath = path.join(workLesson, 'answer-keys.template.json')
const candidate = readJson(candidatePath)
const arithmetic = readJson(path.join(owned, 'receipts/independent-arithmetic.stdout.txt'))
const renderChecks = []
const arithmeticChecks = []
const lexicalChecks = []
function render(label, latex) {
  const html = katex.renderToString(latex, {throwOnError: true, strict: 'error'})
  assert.ok(html.includes('katex') && !html.includes('katex-error'))
  renderChecks.push({label, latex, status: 'rendered'})
}
function numericValue(latex) {
  const parsed = engine.parse(latex)
  assert.ok(!parsed.has('Error'), JSON.stringify(parsed.json))
  const result = parsed.N()
  assert.ok(Number.isFinite(result.re) && result.im === 0, latex)
  return result.re
}
function close(actual, target) {
  return Math.abs(actual - target) <= 1e-12
}
for (const answer of candidate.answers) {
  for (const field of ['prompt', 'displayAnswer']) {
    const fragments = [...answer[field].matchAll(/\$([^$]+)\$/g)]
    for (const [index, match] of fragments.entries()) {
      render(`${answer.exercise}.${field}[${index}]`, match[1])
    }
  }
  for (const [index, part] of answer.parts.entries()) {
    for (const [aliasIndex, latex] of part.expected.entries()) {
      const label = `${answer.exercise}.parts[${index}].expected[${aliasIndex}]`
      render(label, latex)
      if (['1', '2', '3'].includes(answer.exercise)) {
        const parsed = engine.parse(latex)
        assert.ok(!parsed.has('Error'), JSON.stringify(parsed.json))
        assert.equal(parsed.ops?.length, 3, JSON.stringify(parsed.json))
        const values = parsed.ops.map(op => {
          const numeric = op.N()
          assert.ok(Number.isFinite(numeric.re) && numeric.im === 0)
          return numeric.re
        })
        const target = arithmetic.tupleTargets[answer.exercise][index]
        assert.ok(values.every((value, i) => close(value, target[i])), label)
        arithmeticChecks.push({label, parsed: parsed.json, values, independentTarget: target,
          allCoordinatesMatch: true})
      } else if (part.judge === 'numeric') {
        const value = numericValue(latex)
        const target = arithmetic.numericTargets[answer.exercise][index]
        assert.ok(close(value, target), label)
        const wrongValueRejected = !close(value + 1, target)
        assert.ok(wrongValueRejected)
        arithmeticChecks.push({label, value, independentTarget: target, wrongValueRejected})
      } else if (answer.exercise === '7') {
        const expectedConclusion = arithmetic.dotProducts['7'][index].perpendicular
        const normalized = normalizeMathAnswer(latex)
        const allowed = expectedConclusion ? ['垂直', '是'] : ['不垂直', '否']
        assert.ok(allowed.includes(normalized))
        arithmeticChecks.push({label, normalizedConclusion: normalized,
          independentlyComputedDotProduct: arithmetic.dotProducts['7'][index].sum})
      }
    }
    if (part.judge === 'exact') {
      const latex = part.expected[0]
      const plainWrapping = latex.replaceAll('\\left', '').replaceAll('\\right', '')
      assert.ok(exactMathAnswersMatch(part.expected, plainWrapping))
      let wrong
      if (answer.exercise === '7') {
        wrong = index === 0 ? '\\text{垂直}' : '\\text{不垂直}'
      } else {
        wrong = latex.replace('(', '(99,')
      }
      assert.ok(!exactMathAnswersMatch(part.expected, wrong))
      lexicalChecks.push({label: `${answer.exercise}.parts[${index}]`,
        plainDelimiterSerializationMatches: true, wrongAnswerRejected: true,
        evidenceKind: 'shared-normalizer-only, not real MathLive input'})
    }
  }
}
const fractionalPart = candidate.answers[0].parts[2]
assert.ok(exactMathAnswersMatch(fractionalPart.expected, '(0,0.5,-\\sqrt{2})'))
assert.ok(exactMathAnswersMatch(fractionalPart.expected, '(0,\\frac{1}{2},-\\sqrt{2})'))
assert.ok(!exactMathAnswersMatch(fractionalPart.expected, '(0,-\\frac{1}{2},-\\sqrt{2})'))
assert.ok(!exactMathAnswersMatch(candidate.answers[0].parts[6].expected, '(8,0,1)'))
assert.ok(!exactMathAnswersMatch(candidate.answers[2].parts[1].expected, '(-\\frac{14}{6},0,-7)'))
assert.equal(arithmetic.collinearity['4'].bothCollinear, true)
assert.deepEqual(arithmetic.collinearity['4'].aMinusScaledB, ['0', '0', '0'])
assert.deepEqual(arithmetic.collinearity['4'].dMinusScaledC, ['0', '0', '0'])
assert.deepEqual(arithmetic.collinearity['5'].substitutionResidual, ['0', '0', '0'])
console.log(JSON.stringify({
  status: 'author-katex-arithmetic-support-ok',
  candidate: bind(candidatePath),
  runtimeBindings: [
    process.execPath, requireLesson.resolve('katex'), requireApp.resolve('@cortex-js/compute-engine'),
    path.join(cwd, 'app/src/lib/answer-normalize.ts'),
  ].map(bind),
  katexFragmentsChecked: renderChecks.length,
  expectedValuesArithmeticallyChecked: arithmeticChecks.length,
  numericValuesChecked: 4,
  tupleExpectedValuesChecked: 14,
  tupleCoordinatesChecked: 42,
  conclusionExpectedValuesChecked: 4,
  exactPartsLexicallyChecked: lexicalChecks.length,
  renderChecks, arithmeticChecks, lexicalChecks,
  extraNegativeControls: ['half-coordinate sign', 'i/k tuple order', 'scalar-multiple denominator',
    'opposite perpendicularity conclusion'],
  semanticReview: 'pending independent reviewer',
  realMathLiveKeyboardCheck: false,
  exactFinalizeEvidence: false,
}, null, 2))
