import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const root = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck'
const out = path.dirname(fileURLToPath(import.meta.url))
const require = createRequire(path.join(root, 'app/package.json'))
const { ComputeEngine } = require('@cortex-js/compute-engine')
const engine = new ComputeEngine()
const candidatePath = path.join(root, '.intentfold/tickets/STEMROBIN-188/tmp/n66-answer-author/answer-keys.candidate.json')
const bytes = fs.readFileSync(candidatePath)
const part = JSON.parse(bytes).answers[0].parts[3]
const target = engine.parse(part.expected[0])
const cases = [
  { input: '\\frac{\\pi\\left|a\\right|^3}{2}', want: true, proof: 'a>0 implies |a|=a, so this is pi*a^3/2 throughout the prompt domain.' },
  { input: '\\frac{\\pi\\sqrt{a^6}}{2}', want: true, proof: 'For a>0, a^3>0 and the principal real square root sqrt((a^3)^2)=a^3.' },
  { input: '\\frac{\\pi a^2\\sqrt{a^2}}{2}', want: true, proof: 'a>0 implies sqrt(a^2)=a, so the numerator is pi*a^3.' },
  { input: '-\\frac{\\pi\\left|a\\right|^3}{2}', want: false, proof: 'For a>0 the proposed value is the negative of the strictly positive volume.' }
]
const checks = cases.map(({ input, want, proof }) => {
  const parsed = engine.parse(input)
  const actual = !parsed.has('Error') && parsed.isEqual(target) === true
  return { input, expectedVerdict: want, actualVerdict: actual, result: want === actual ? 'PASS' : 'FAIL', parseError: parsed.has('Error'), canonical: parsed.json, proof }
})
const failures = checks.filter(c => c.result === 'FAIL')
const hash = b => crypto.createHash('sha256').update(b).digest('hex')
const report = {
  schema: 'stemrobin188-n66-parameter-domain-engine-probe@1',
  result: failures.length ? 'FAIL' : 'PASS',
  scope: 'Exercise242 part4 automatic expression grading under the stated a>0 domain; not answer-volume correctness.',
  candidatePath,
  candidateSha256Before: hash(bytes),
  candidateSha256After: hash(fs.readFileSync(candidatePath)),
  judge: part.judge,
  targetLatex: part.expected[0],
  targetCanonical: target.json,
  interface: 'Installed ComputeEngine.parse().isEqual(target)===true, as used by current judgeTextbookPart with no domain assumptions.',
  checks,
  failures,
  comparisonCount: checks.length,
  positiveCount: cases.filter(c => c.want).length,
  negativeCount: cases.filter(c => !c.want).length,
  expectedSelfComparisons: 0,
  networkCalls: 0,
  databaseConnections: 0,
  testsRead: false
}
fs.writeFileSync(path.join(out, 'parameter-domain-probes.json'), `${JSON.stringify(report, null, 2)}\n`, { flag: 'wx' })
console.log(JSON.stringify(report, null, 2))
process.exitCode = failures.length ? 2 : 0
