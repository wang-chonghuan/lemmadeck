import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const root = path.dirname(fileURLToPath(import.meta.url))
const repo = path.resolve(root, '../../../../..')
const candidate = path.join(root, 'answer-keys.candidate.json')
const checker = path.join(repo, '.claude/skills/ld-s10y-answer/tools/check_math_expressions.mjs')
const { validateMathExpected } = await import(checker)
const require = createRequire(path.join(repo, 'app/package.json'))
const { ComputeEngine } = require('@cortex-js/compute-engine')
const engine = new ComputeEngine()
const bytes = fs.readFileSync(candidate)
const document = JSON.parse(bytes)
const allParts = document.answers.flatMap(answer => answer.parts)
const expectedValidation = validateMathExpected(allParts)
const question = document.answers.find(answer => answer.exercise === '234')
const examples = [
  {
    positive: ['y=3', '6\\cdot y=18', 'y-3=0', '3=y'],
    negative: ['y=-3', 'y=4'],
  },
  {
    positive: [
      '2\\cdot y-\\sqrt{5}\\cdot z=9',
      '4\\cdot y-2\\cdot\\sqrt{5}\\cdot z=18',
      '2\\cdot y-\\sqrt{5}\\cdot z-9=0',
    ],
    negative: ['2\\cdot y+\\sqrt{5}\\cdot z=9', '2\\cdot y-\\sqrt{5}\\cdot z=8'],
  },
  {
    positive: [
      '2\\cdot x-2\\cdot y-z=9',
      '4\\cdot x-4\\cdot y-2\\cdot z=18',
      '2\\cdot x-2\\cdot y-z-9=0',
    ],
    negative: ['2\\cdot x-2\\cdot y+z=9', '2\\cdot x-2\\cdot y-z=8'],
  },
]
const comparisons = []
const contractFailures = []
for (const [index, part] of question.parts.entries()) {
  const targets = part.expected.map(value => engine.parse(value))
  for (const [kind, values] of Object.entries(examples[index])) {
    for (const submitted of values) {
      const input = engine.parse(submitted)
      const equalResults = targets.map(target => input.isEqual(target))
      const accepted = !input.has('Error') && equalResults.some(result => result === true)
      const wanted = kind === 'positive'
      const row = {
        exercise: '234',
        part: index + 1,
        submitted,
        wanted,
        accepted,
        equalResults: equalResults.map(result => result === undefined ? 'undefined' : result),
        inputMathJson: input.json,
      }
      comparisons.push(row)
      if (wanted !== accepted) contractFailures.push(row)
    }
  }
}
const report = {
  status: expectedValidation.status === 'pass' && !contractFailures.length ? 'pass' : 'fail',
  scope: 'One validateMathExpected call, plus bounded equation-equivalence probes using the current parser and input.isEqual(target) === true criterion from textbook-answer.ts. No server import, DB, UI or MathLive.',
  candidate,
  candidateSha256: crypto.createHash('sha256').update(bytes).digest('hex'),
  candidateMode: (fs.statSync(candidate).mode & 0o7777).toString(8).padStart(4, '0'),
  checker,
  checkerSha256: crypto.createHash('sha256').update(fs.readFileSync(checker)).digest('hex'),
  computeEngineEntry: require.resolve('@cortex-js/compute-engine'),
  node: process.version,
  expectedValidation,
  comparisons,
  contractFailures,
}
fs.writeFileSync(path.join(root, 'expected-parser-check.FIRST.json'), JSON.stringify(report, null, 2) + '\n')
console.log(JSON.stringify(report, null, 2))
process.exitCode = report.status === 'pass' ? 0 : 2
