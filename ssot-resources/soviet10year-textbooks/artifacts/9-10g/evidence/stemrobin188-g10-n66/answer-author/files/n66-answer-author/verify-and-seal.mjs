import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import {createHash} from 'node:crypto'
import {createRequire} from 'node:module'
import {spawnSync} from 'node:child_process'
import {fileURLToPath} from 'node:url'
import {validateMathExpected} from '../../../../../.claude/skills/ld-s10y-answer/tools/check_math_expressions.mjs'

const repo = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck'
const output = path.dirname(fileURLToPath(import.meta.url))
assert.equal(process.cwd(), repo)
assert.equal(output, path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp/n66-answer-author'))
const candidatePath = path.join(output, 'answer-keys.candidate.json')
const firstPath = path.join(output, 'answer-keys.FIRST.json')
const reportPath = path.join(output, 'report.json')
const indexPath = path.join(output, 'output-index.json')
for (const target of [firstPath, reportPath, indexPath]) {
  assert.equal(fs.existsSync(target), false, `Do not rerun or overwrite ${target}`)
}
const lessonId = 'geo910-c2-s3-n66'
const lessonRoot = path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/modern-us-neutral/lessons', lessonId)
const exercisePath = path.join(lessonRoot, 'exercises.json')
const lessonPath = path.join(lessonRoot, 'lesson.json')
const templatePath = path.join(output, 'work/9-10g/modern-us-neutral/lessons', lessonId, 'answer-keys.template.json')
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const candidate = read(candidatePath)
const template = read(templatePath)
const exercises = read(exercisePath)
assert.equal(template.answers[0].prompt, exercises.exercises[0].text)
assert.equal(template.answers[0].source, 'derived')
assert.equal(template.answers[0].bookRaw, undefined)
assert.deepEqual(template.answers[0].figureEvidence, [])
assert.deepEqual(exercises.exercises[0].figure_refs, [])
assert.deepEqual(exercises.exercises[0].figures, [])
assert.equal(candidate.status, 'draft')
assert.equal(candidate.answers[0].source, 'derived')
assert.equal(candidate.answers[0].bookRaw, undefined)
const parts = candidate.answers[0].parts
assert.equal(parts.length, 6)
assert.deepEqual(parts.map(part => part.judge), ['numeric', 'numeric', 'numeric', 'expression', 'numeric', 'numeric'])

const structure = spawnSync(
  path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python'),
  ['-B', '-c', [
    'import json, sys',
    'from pathlib import Path',
    'sys.path.insert(0, str(Path.cwd() / ".claude/skills/ld-s10y-answer/tools"))',
    'from lesson_answers import validate_lesson',
    'profile = json.loads((Path.cwd() / ".claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json").read_text())',
    'terms = profile.get("forbidden_terms", []) + profile.get("forbidden_person_names", [])',
    '_, errors = validate_lesson(Path(sys.argv[1]), Path(sys.argv[2]), "9-10g", "geo910-c2-s3-n66", "modern-us-neutral", terms)',
    'print(json.dumps({"status": "fail" if errors else "pass", "errors": errors}))',
    'sys.exit(2 if errors else 0)',
  ].join('\n'), candidatePath, exercisePath],
  {cwd: repo, encoding: 'utf8', env: {...process.env, PYTHONDONTWRITEBYTECODE: '1'}},
)
assert.equal(structure.status, 0, structure.stdout + structure.stderr)
const structuralCheck = JSON.parse(structure.stdout)
const parseCheck = validateMathExpected(parts)
assert.equal(parseCheck.status, 'pass', JSON.stringify(parseCheck))
assert.equal(parseCheck.checked, 6)

const require = createRequire(path.join(repo, 'app/package.json'))
const {ComputeEngine} = require('@cortex-js/compute-engine')
const engine = new ComputeEngine()
const alternatives = [
  '\\frac{351\\pi}{3}',
  '\\frac{2\\pi}{10}',
  '\\frac{32\\pi}{30}',
  '\\frac{1}{2}\\pi a^3',
  '\\frac{256\\pi}{14}',
  '\\frac{326\\pi}{28}',
]
const wrongAnswers = [
  '117',
  '\\frac{\\pi}{4}',
  '\\frac{32\\pi}{15}',
  '\\frac{\\pi a^2}{2}',
  '\\frac{64\\pi}{7}',
  '\\frac{86\\pi}{7}',
]
const equalityChecks = parts.map((part, index) => {
  const expected = engine.parse(part.expected[0])
  const equivalent = engine.parse(alternatives[index])
  const wrong = engine.parse(wrongAnswers[index])
  const equivalentAccepted = equivalent.isEqual(expected) === true
  const wrongRejected = wrong.isEqual(expected) !== true
  assert.equal(equivalentAccepted, true, `Equivalent answer ${index + 1}`)
  assert.equal(wrongRejected, true, `Incorrect answer ${index + 1}`)
  return {part: index + 1, equivalent: alternatives[index], equivalentAccepted, wrong: wrongAnswers[index], wrongRejected}
})

const gcd = (a, b) => b === 0n ? (a < 0n ? -a : a) : gcd(b, a % b)
const fraction = (n, d = 1n) => {
  const g = gcd(n, d)
  return [n / g, d / g]
}
const add = ([an, ad], [bn, bd]) => fraction(an * bd + bn * ad, ad * bd)
const square = coefficients => {
  const result = Array(coefficients.length * 2 - 1).fill(0n)
  coefficients.forEach((a, i) => coefficients.forEach((b, j) => {result[i + j] += a * b}))
  return result
}
const integrate = (coefficients, lower, upper) => coefficients.reduce(
  (sum, coefficient, degree) => add(sum, fraction(
    coefficient * (upper ** BigInt(degree + 1) - lower ** BigInt(degree + 1)),
    BigInt(degree + 1),
  )), [0n, 1n],
)
const fractionText = ([n, d]) => d === 1n ? String(n) : `${n}/${d}`
const models = [
  {part: 1, bounds: ['1', '4'], region: '1 <= x <= 4; 0 <= y <= 2x+1', radius: '2x+1', coefficients: [1n, 2n], lower: 1n, upper: 4n, coefficient: '117', volume: '117\\pi', condition: 'Two explicit vertical boundaries; radius is positive.', primitive: '\\frac{4x^3}{3}+2x^2+x'},
  {part: 2, bounds: ['0', '1'], region: '0 <= x <= 1; 0 <= y <= x^2', radius: 'x^2', coefficients: [0n, 0n, 1n], lower: 0n, upper: 1n, coefficient: '1/5', volume: '\\frac{\\pi}{5}', condition: 'Closure at the axis intersection (0,0); no extra vertical boundary assumed.', primitive: '\\frac{x^5}{5}'},
  {part: 3, bounds: ['0', '2'], region: '0 <= x <= 2; 0 <= y <= 2x-x^2', radius: '2x-x^2', coefficients: [0n, 2n, -1n], lower: 0n, upper: 2n, coefficient: '16/15', volume: '\\frac{16\\pi}{15}', condition: 'Two axis intersections x=0,2; curve nonnegative between them.', primitive: '\\frac{4x^3}{3}-x^4+\\frac{x^5}{5}'},
  {part: 4, bounds: ['0', 'a'], region: '0 <= x <= a; 0 <= y <= sqrt(ax)', radius: '\\sqrt{ax}', coefficient: 'a^3/2', volume: '\\frac{\\pi a^3}{2}', condition: 'a>0; axis intersection x=0; squared radius ax.', primitive: '\\frac{ax^2}{2}'},
  {part: 5, bounds: ['0', '2'], region: '0 <= x <= 2; 0 <= y <= x^3', radius: 'x^3', coefficients: [0n, 0n, 0n, 1n], lower: 0n, upper: 2n, coefficient: '128/7', volume: '\\frac{128\\pi}{7}', condition: 'Closure at the axis intersection (0,0); no x<0 region is bounded.', primitive: '\\frac{x^7}{7}'},
  {part: 6, bounds: ['1', '2'], region: '1 <= x <= 2; 1-x^3 <= y <= 0', radius: 'x^3-1', coefficients: [1n, 0n, 0n, -1n], lower: 1n, upper: 2n, coefficient: '163/14', volume: '\\frac{163\\pi}{14}', condition: 'Axis intersection x=1; curve below axis on (1,2]; use absolute distance, not x=0.', primitive: '\\frac{x^7}{7}-\\frac{x^4}{2}+x'},
]
const results = models.map(model => {
  let arithmetic
  if (model.part === 4) {
    const samples = [1n, 2n, 3n].map(a => {
      const integrated = integrate([0n, a], 0n, a)
      assert.deepEqual(integrated, fraction(a ** 3n, 2n))
      return {a: String(a), integralDividedByPi: fractionText(integrated)}
    })
    arithmetic = {status: 'pass', symbolicDerivation: 'Integral of ax from 0 to a is a*(a^2)/2=a^3/2.', positiveParameterExactSamples: samples}
  } else {
    const integrated = integrate(square(model.coefficients), model.lower, model.upper)
    assert.equal(fractionText(integrated), model.coefficient)
    arithmetic = {status: 'pass', exactPolynomialIntegralDividedByPi: fractionText(integrated)}
  }
  assert.equal(parts[model.part - 1].expected[0], model.volume)
  return {
    part: model.part, bounds: model.bounds, region: model.region, radius: model.radius,
    condition: model.condition, primitiveOfSquaredRadius: model.primitive,
    volume: model.volume, judge: parts[model.part - 1].judge, arithmetic,
  }
})

const metadata = file => {
  const bytes = fs.readFileSync(file)
  return {
    path: file,
    sha256: createHash('sha256').update(bytes).digest('hex'),
    bytes: bytes.length,
    mode: (fs.statSync(file).mode & 0o777).toString(8).padStart(4, '0'),
  }
}
fs.copyFileSync(candidatePath, firstPath, fs.constants.COPYFILE_EXCL)
fs.chmodSync(firstPath, 0o444)
fs.chmodSync(candidatePath, 0o444)
const report = {
  schema: 'ld-s10y-answer/n66-author-report@1',
  ticket: 'STEMROBIN-188',
  lesson: lessonId,
  exercise: '242',
  status: 'author-candidate-validated-not-finalized',
  source: 'derived',
  sourceBasis: 'Parent first-prepare template records derived and no bookRaw. Solved from current modern lesson and exercises; no old/book answers, choice-author output or review evidence read.',
  inputs: [templatePath, lessonPath, exercisePath].map(metadata),
  results,
  grading: {
    status: 'auto',
    reason: 'Exercise requests only six volumes, not drawings or proofs. Five numeric keys are finite real constants; the a>0 parameter key uses expression equivalence. No exact keys.',
    equalityContract: 'Offline installed ComputeEngine parse/isEqual, as used by textbook-answer.ts; no product server, native editor or display integration executed.',
    equalityChecks,
  },
  validation: {passes: 1, structuralCheck, parseCheck, arithmetic: 'Six separately bounded integrals checked; five exact polynomial integrations and symbolic parameter derivation with three exact positive samples.'},
  images: {loaded: 0, created: 0, exerciseFigures: 0, proseFiguresOpened: 0},
  usage: {contentRepairs: 0, successorCandidates: 0, technicalVerificationRetries: 0, prepareRuns: 0, finalizeRuns: 0, publishRuns: 0, networkCalls: 0, paidCalls: 0},
  first: metadata(firstPath),
  candidate: metadata(candidatePath),
  scope: 'Only this author output directory written; no env, DB, Git, Plane, app edits, package installs, agents or production-chat messages.',
}
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2) + '\n', {flag: 'wx'})
fs.chmodSync(reportPath, 0o444)
fs.chmodSync(fileURLToPath(import.meta.url), 0o444)
const collect = directory => fs.readdirSync(directory, {withFileTypes: true}).flatMap(entry => {
  const file = path.join(directory, entry.name)
  if (entry.isDirectory()) return collect(file)
  assert.equal(entry.isFile(), true, `Unexpected non-file ${file}`)
  return file === indexPath ? [] : [metadata(file)]
})
const index = {
  schema: 'ld-s10y-answer/output-index@1',
  root: output,
  outputs: collect(output).sort((a, b) => a.path.localeCompare(b.path)),
}
fs.writeFileSync(indexPath, JSON.stringify(index, null, 2) + '\n', {flag: 'wx'})
fs.chmodSync(indexPath, 0o444)
console.log(JSON.stringify({status: report.status, candidate: report.candidate, report: metadata(reportPath), index: metadata(indexPath)}, null, 2))
