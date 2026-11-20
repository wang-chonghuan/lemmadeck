import fs from 'node:fs'
import path from 'node:path'
import {createRequire} from 'node:module'

const cwd = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck'
const owned = path.join(cwd, '.intentfold/tickets/STEMROBIN-188/tmp/n44-answer-author')
if (process.cwd() !== cwd) throw Error('wrong cwd')
const requireApp = createRequire(path.join(cwd, 'app/package.json'))
const requireLesson = createRequire(path.join(cwd, '.claude/skills/ld-s10y-lesson/package.json'))
const katex = requireLesson('katex')
const {ComputeEngine} = requireApp('@cortex-js/compute-engine')
const engine = new ComputeEngine()
const candidate = path.join(owned, 'work/9-10g/modern-us-neutral/lessons/geo910-c2-s1-n44/answer-keys.template.json')
const doc = JSON.parse(fs.readFileSync(candidate))
const arithmeticReceipt = JSON.parse(fs.readFileSync(path.join(owned, 'receipts/independent-arithmetic-once.json')))
if (arithmeticReceipt.exitCode !== 0) throw Error('independent arithmetic did not complete')
const independent = JSON.parse(arithmeticReceipt.stdout).results
const numericTargets = {
  '18:0': independent['18'].length,
  '20:0': independent['20'].medianLengths[0],
  '20:1': independent['20'].medianLengths[1],
  '20:2': independent['20'].centroidDistance,
  '20:3': independent['20'].anglesDegrees[0],
  '20:4': independent['20'].anglesDegrees[1],
  '20:5': independent['20'].anglesDegrees[2],
}
const failures = []
const renderChecks = []
const numericChecks = []
function render(value, label) {
  try {
    const output = katex.renderToString(value, {throwOnError: true, strict: 'error'})
    if (!output.includes('katex')) throw Error('no KaTeX output')
    renderChecks.push({label, latex: value, status: 'rendered'})
  } catch (error) {
    failures.push({label, latex: value, error: String(error)})
  }
}
for (const answer of doc.answers) {
  for (const field of ['prompt', 'displayAnswer']) {
    let i = 0
    for (const match of answer[field].matchAll(/\$([^$]+)\$/g)) {
      render(match[1], `${answer.exercise}.${field}[${i++}]`)
    }
  }
  for (const [index, part] of answer.parts.entries()) {
    for (const value of part.expected) {
      const label = `${answer.exercise}.parts[${index}]`
      render(value, `${label}.expected`)
      if (part.judge !== 'numeric') continue
      const parsed = engine.parse(value)
      const evaluated = parsed.N()
      const target = numericTargets[`${answer.exercise}:${index}`]
      const delta = Math.abs(evaluated.re - target)
      const compatible = Number.isFinite(evaluated.re) && evaluated.im === 0 && delta < 1e-9
      const wrongValueRejected = part.tolerance
        ? Math.abs(target) > part.tolerance
        : engine.parse('0').isEqual(parsed) === false
      if (!compatible || !wrongValueRejected || parsed.has('Error')) {
        failures.push({label, latex: value, reason: 'numeric value or negative control mismatch', target, value: evaluated.re, delta})
      }
      const result = {label, latex: value, unit: part.unit, evaluated: evaluated.re, independentTarget: target, delta, wrongValueRejected}
      if (part.unit === '°') {
        const cosine = independent['20'].cosines[index - 3]
        const rounded = Math.round(target * 10000) / 10000
        result.roundedDegreeValue = rounded
        result.roundedWithinTolerance = Math.abs(rounded - evaluated.re) <= part.tolerance
        result.cosineRejectedAsAngle = Math.abs(cosine - evaluated.re) > part.tolerance
        if (!result.roundedWithinTolerance || !result.cosineRejectedAsAngle) {
          failures.push({label, reason: 'angle tolerance or cosine-as-answer control failed'})
        }
      }
      numericChecks.push(result)
    }
  }
}
console.log(JSON.stringify({
  status: failures.length ? 'technical-katex-numeric-fail' : 'technical-katex-numeric-ok',
  candidate,
  katexModule: requireLesson.resolve('katex'),
  computeEngineModule: requireApp.resolve('@cortex-js/compute-engine'),
  katexChecked: renderChecks.length,
  numericChecked: numericChecks.length,
  renderChecks,
  numericChecks,
  failures,
  semanticReview: 'pending',
  mathLiveKeyboard: 'not run',
}, null, 2))
process.exitCode = failures.length ? 2 : 0
