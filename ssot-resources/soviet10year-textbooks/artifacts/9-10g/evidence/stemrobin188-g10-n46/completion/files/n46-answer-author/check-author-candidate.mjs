import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repo = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck'
const own = path.dirname(fileURLToPath(import.meta.url))
assert.equal(process.cwd(), repo)
assert.equal(own, path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp/n46-answer-author'))
assert.equal(fs.realpathSync(own), own)
const load = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex')
const record = file => {
  const bytes = fs.readFileSync(file)
  return { path: file, sha256: sha(bytes), bytes: bytes.length }
}
const candidatePath = path.join(own, 'answer-keys.json')
const candidate = load(candidatePath)
const derivationPath = path.join(own, 'derivations.json')
const derivations = load(derivationPath)
const exercisesPath = path.join(own, 'artifacts/9-10g/editions/modern-us-neutral/lessons/geo910-c2-s1-n46/exercises.json')
const exercises = load(exercisesPath)
const templatePath = path.join(own, 'work/9-10g/modern-us-neutral/lessons/geo910-c2-s1-n46/answer-keys.template.json')
const template = load(templatePath)
const expectedNumbers = exercises.exercises.map(item => item.number)

assert.equal(candidate.schema, 'ld-s10y-answer/lesson-answers@1')
assert.equal(candidate.status, 'draft')
assert.equal(candidate.book, '9-10g')
assert.equal(candidate.lesson, 'geo910-c2-s1-n46')
assert.equal(candidate.edition, 'modern-us-neutral')
assert.deepEqual(expectedNumbers, ['34', '35', '36', '37', '38', '39'])
assert.deepEqual(candidate.answers.map(item => item.exercise), expectedNumbers)
assert.deepEqual(derivations.exercises.map(item => item.exercise), expectedNumbers)
assert.equal(new Set(expectedNumbers).size, 6)
for (const [index, answer] of candidate.answers.entries()) {
  const exercise = exercises.exercises[index]
  const prepared = template.answers[index]
  assert.equal(prepared.prompt, exercise.text)
  assert.deepEqual(prepared.figureEvidence, [])
  assert.deepEqual(exercise.figure_refs, [])
  assert.equal(answer.grading, 'ungraded')
  assert.equal(answer.source, prepared.source)
  assert.equal(answer.source, 'derived')
  assert.equal(answer.displayAnswer.trim().length > 100, true)
  assert.ok(typeof answer.notes === 'string' && answer.notes.length > 0)
  assert.deepEqual(answer.parts, [])
  assert.deepEqual(answer.historical_entities, [])
  assert.equal(Object.hasOwn(answer, 'bookRaw'), Object.hasOwn(prepared, 'bookRaw'))
  if (Object.hasOwn(prepared, 'bookRaw')) assert.equal(answer.bookRaw, prepared.bookRaw)
  assert.ok(!/(题面未附图|题面未提供图|无法可靠确定)/.test(answer.displayAnswer))
  assert.equal((answer.displayAnswer.match(/\$\$/g) ?? []).length % 2, 0, 'Display delimiters must pair')
}

// Exact rational coefficient identities verify the authored substitutions,
// not the product's grading contract or a source symbol's intended meaning.
const gcd = (a, b) => {
  a = a < 0n ? -a : a
  b = b < 0n ? -b : b
  while (b) [a, b] = [b, a % b]
  return a
}
const rational = value => {
  let [n, d] = Array.isArray(value) ? value.map(BigInt) : [BigInt(value), 1n]
  assert.notEqual(d, 0n)
  if (d < 0n) [n, d] = [-n, -d]
  const divisor = gcd(n, d)
  return [n / divisor, d / divisor]
}
const multiply = (a, b) => rational([a[0] * b[0], a[1] * b[1]])
const add = (a, b) => rational([a[0] * b[1] + b[0] * a[1], a[1] * b[1]])
const r = values => values.map(rational)
const printable = values => values.map(([n, d]) => `${n}/${d}`)
const algebraChecks = []
for (const exercise of derivations.exercises) {
  for (const subcase of exercise.subcases) {
    if (!subcase.affineCheck) continue
    const check = subcase.affineCheck
    const original = r(check.originalPlane)
    const inverseScale = r(check.inverseLinearDiagonal)
    const inverseShift = r(check.inverseTranslation)
    const proposed = r(check.proposedImagePlane)
    const multiplier = rational(check.residualMultiplier)
    const substituted = original.slice(0, 3).map((value, index) => multiply(value, inverseScale[index]))
    let constant = original[3]
    for (let index = 0; index < 3; index++) constant = add(constant, multiply(original[index], inverseShift[index]))
    substituted.push(constant)
    const comparison = proposed.map(value => multiply(value, multiplier))
    assert.deepEqual(substituted, comparison)
    assert.notEqual(multiplier[0], 0n)
    algebraChecks.push({
      exercise: exercise.exercise,
      subcase: subcase.label,
      kind: 'exact-polynomial-coefficient-identity',
      result: 'pass',
      substitutedCoefficients: printable(substituted),
      imageCoefficients: printable(proposed),
      nonzeroResidualMultiplier: printable([multiplier])[0],
      conditional: subcase.interpretationStatus === 'HOLD-conditional-only',
      limitation: 'Verifies stated inverse substitution, not open-answer grading or symbol provenance.',
    })
  }
}
assert.equal(algebraChecks.length, 5)

const reflectionChecks = derivations.exercises.find(item => item.exercise === '35').subcases.map(subcase => {
  assert.deepEqual(subcase.diagonal.map(value => value * value), [1, 1, 1])
  return { subcase: subcase.label, diagonal: subcase.diagonal, involution: 'pass', distinctCoordinateMap: true }
})
assert.equal(new Set(reflectionChecks.map(item => JSON.stringify(item.diagonal))).size, 3)

const areaChecks = []
for (const exercise of derivations.exercises) {
  for (const subcase of exercise.subcases) {
    if (!subcase.originalToImageRatio) continue
    const k = rational(subcase.coefficient)
    const square = multiply(k, k)
    const factor = rational(subcase.imageToOriginalAreaFactor)
    const originalToImage = rational(subcase.originalToImageRatio)
    assert.deepEqual(square, factor)
    assert.deepEqual(multiply(originalToImage, factor), rational(1))
    areaChecks.push({
      exercise: exercise.exercise,
      subcase: subcase.label,
      coefficient: printable([k])[0],
      imageToOriginalAreaFactor: printable([factor])[0],
      originalToImageRatio: subcase.originalToImageRatio.join(':'),
      result: 'pass',
      limitation: 'Checks surface-area scaling and ratio direction only; construction remains an independent semantic-review responsibility.',
    })
  }
}
assert.equal(areaChecks.length, 3)
assert.deepEqual(areaChecks.map(item => item.originalToImageRatio), ['1:4', '4:1', '9:1'])
assert.ok(candidate.answers[4].displayAnswer.includes('S:S_1=1:4'))
assert.ok(candidate.answers[4].displayAnswer.includes('S:S_1=4:1'))
assert.ok(candidate.answers[5].displayAnswer.includes('S:S_1=9:1'))
assert.ok(candidate.answers[0].displayAnswer.includes('3x-y+8z-33=0'))
assert.ok(candidate.answers[0].displayAnswer.includes('6x-2y+16z+51=0'))
assert.ok(candidate.answers[2].displayAnswer.includes('7x-2y-5z+1=0'))
assert.ok(candidate.answers[2].displayAnswer.includes('7x-2y+5z-1=0'))
assert.ok(candidate.answers[2].displayAnswer.includes('7x-2y+5z+1=0'))
assert.ok(candidate.answers[2].notes.includes('HOLD N46-36-1-SYMBOL'))
assert.ok(candidate.answers[2].displayAnswer.includes('若此处表示'))
assert.ok(candidate.answers[3].displayAnswer.includes('k=1'))
assert.ok(candidate.answers[3].displayAnswer.includes('k=-1'))
assert.ok(candidate.answers[3].displayAnswer.includes('k=0'))
assert.ok(candidate.answers[3].displayAnswer.includes('k\\ne0'))
assert.ok(candidate.answers[3].displayAnswer.includes('作为点的集合相同'))
assert.ok(candidate.answers[3].displayAnswer.includes('当且仅当'))

const inputBeforePath = path.join(own, 'inputbindings.before.json')
const inputAfterPath = path.join(own, 'inputbindings.after.json')
const inputBefore = load(inputBeforePath)
const inputAfter = load(inputAfterPath)
assert.deepEqual(inputAfter.files, inputBefore.files)
assert.deepEqual(inputAfter.toolingAndInstructions, inputBefore.toolingAndInstructions)
assert.deepEqual(inputAfter.capturedRawAnswers, inputBefore.capturedRawAnswers)
for (const input of inputBefore.files) {
  assert.equal(record(input.source.path).sha256, input.source.sha256)
  assert.equal(record(input.snapshotPath).sha256, input.source.sha256)
}
for (const input of inputBefore.toolingAndInstructions) assert.equal(record(input.path).sha256, input.sha256)
assert.equal(inputAfter.capturedRawAnswers.exists, false)

const preparePath = path.join(own, 'prepare.receipt.json')
const prepareReceipt = load(preparePath)
assert.equal(prepareReceipt.attempts, 1)
assert.equal(prepareReceipt.exitCode, 0)
assert.equal(prepareReceipt.finalizeRun, false)
assert.equal(prepareReceipt.mathliveRun, false)
assert.equal(prepareReceipt.publishRun, false)
const initialPath = path.join(own, 'answer-keys.author-initial.json')
const initial = load(initialPath)
const expectedRepaired = structuredClone(initial)
expectedRepaired.answers[2].displayAnswer = expectedRepaired.answers[2].displayAnswer.replace('记原点的坐标为', '记原平面上一点的坐标为')
assert.deepEqual(candidate, expectedRepaired, 'Only disclosed wording repair is allowed relative to retained initial candidate')
const failuresPath = path.join(own, 'exploration-failures.json')
const failures = load(failuresPath)

const report = {
  schema: 'n46-answer-author/report@1',
  time: new Date().toISOString(),
  assignment: 'SAME188-6 STEMROBIN-188 N46 ANSWER AUTHOR ONLY',
  cwd: repo,
  ownedRoot: own,
  status: 'draft-candidate-with-holds',
  semanticApproval: false,
  candidate: record(candidatePath),
  initialCandidate: record(initialPath),
  counts: {
    answers: candidate.answers.length,
    auto: candidate.answers.filter(item => item.grading === 'auto').length,
    ungraded: candidate.answers.filter(item => item.grading === 'ungraded').length,
    parts: candidate.answers.reduce((sum, item) => sum + item.parts.length, 0),
    sourceDerived: candidate.answers.filter(item => item.source === 'derived').length,
    capturedBookRaw: candidate.answers.filter(item => Object.hasOwn(item, 'bookRaw')).length,
    exerciseImageRefs: 0,
    imagesViewed: 0,
    imagesCopied: 0,
    imagesCreated: 0,
    nativePrepareInvocations: 1,
    localAffineIdentitiesChecked: algebraChecks.length,
    localAreaRatiosChecked: areaChecks.length,
    retainedReadLookupFailures: failures.failures.length,
    retainedWordingRepairs: failures.candidateRepairs.length,
  },
  bindings: {
    before: record(inputBeforePath),
    afterSnapshot: record(path.join(own, 'inputbindings.after-snapshot.json')),
    afterPrepare: record(path.join(own, 'inputbindings.after-prepare.json')),
    after: record(inputAfterPath),
    unchanged: true,
    snapshotReceipt: record(path.join(own, 'snapshot.receipt.json')),
    files: inputBefore.files,
    toolingAndInstructions: inputBefore.toolingAndInstructions,
    rawCoreLabelResolution: inputBefore.rawCoreLabelResolution,
    capturedRawAnswers: inputBefore.capturedRawAnswers,
  },
  evidence: {
    prepareReceipt: record(preparePath),
    prepareStdout: record(path.join(own, 'prepare.stdout.txt')),
    prepareStderr: record(path.join(own, 'prepare.stderr.txt')),
    prepareOnceMarker: record(path.join(own, 'prepare.once.json')),
    template: record(templatePath),
    derivations: record(derivationPath),
    failuresAndRepairs: record(failuresPath),
    authorCheckScript: record(fileURLToPath(import.meta.url)),
    snapshotScript: record(path.join(own, 'guarded-snapshot.mjs')),
  },
  localChecks: {
    status: 'pass-local-author-selfcheck-only',
    structure: 'Schema/book/edition/lesson/status, ordered exact six-answer coverage, empty ungraded parts, nonempty displays/notes, source/bookRaw consistency with prepare template, zero exercise figures, paired display math delimiters',
    algebraChecks,
    reflectionChecks,
    areaChecks,
    wordingRepairDiff: 'Only the disclosed introductory wording repair in exercise 36; no mathematical formula or HOLD changed',
    limitations: [
      'Not independent semantic review, not Gate 2 approval, not MathLive, not native finalize, not publication or integration.',
      'Coefficient equality checks the authored affine substitutions; it does not establish the intended meaning of z_0.',
      'Area factors verify ratio direction; they do not constitute an automatic construction grader.',
      'Current runtime read-only inspection supports the conservative grading decision; no library API experiment or open-equation equivalence claim is made.',
    ],
  },
  capacity: derivations.autoGradingCapacity,
  perExerciseDerivations: derivations.exercises,
  holds: derivations.holds,
  preservedFailuresAndRepairs: failures,
  notRun: [
    'setup', 'freshness update', 'Grill', 'backend read/write', 'environment-file access',
    'database', 'model/paid calls', 'install', 'Git', 'messages', 'delegation',
    'choices or interaction-spec reads', 'old lesson answer-key reads', 'peer result reads',
    'image viewing/generation', 'MathLive', 'native finalize', 'Gate 2 approval',
    'publish', 'promote', 'parent local integration',
  ],
  authorizedWrites: 'Only new files below ownedRoot; source snapshots are read-only; no core/peer changes or reversions',
}
const reportPath = path.join(own, 'report.json')
assert.ok(!fs.existsSync(reportPath), 'Preserve any existing author check receipt')
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, { flag: 'wx' })
console.log(JSON.stringify({
  candidate: report.candidate,
  report: record(reportPath),
  counts: report.counts,
  holds: report.holds.map(hold => hold.id),
  semanticApproval: false,
}, null, 2))
