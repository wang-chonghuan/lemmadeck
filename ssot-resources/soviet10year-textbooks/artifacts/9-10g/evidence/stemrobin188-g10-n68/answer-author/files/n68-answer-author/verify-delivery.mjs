import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck'
const owner = path.dirname(fileURLToPath(import.meta.url))
assert.equal(process.cwd(), root)
assert.equal(owner, path.join(root, '.intentfold/tickets/STEMROBIN-188/tmp/n68-answer-author'))
const sha256 = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex')
const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
const local = (name) => path.join(owner, name)
const manifestPath = path.join(root, '.intentfold/tickets/STEMROBIN-188/tmp/n68-answer-author-inputs-01/manifest.json')
const manifest = readJson(manifestPath)
const candidate = readJson(local('answer-keys.candidate.json'))
const report = readJson(local('report.json'))
const template = readJson(manifest.template.path)
const initial = readJson(local('offline-judge-results.json'))
const recovered = readJson(local('offline-judge-results-recovered.json'))
const cases = readJson(local('offline-judge-cases.json'))
const exercisesPath = manifest.inputs.find((input) => input.path.endsWith('/exercises.json')).path
const exercises = readJson(exercisesPath).exercises

const inputChecks = manifest.inputs.map((input) => {
  const bytes = fs.readFileSync(input.path)
  const actual = sha256(bytes)
  assert.equal(actual, input.sha256, input.path)
  const claim = report.inputChecks.find((entry) => entry.path === input.path)
  assert.ok(claim)
  assert.equal(claim.beforeSha256, actual)
  assert.equal(claim.afterSha256, actual)
  assert.equal(claim.expectedSha256, actual)
  assert.equal(claim.bytes, bytes.length)
  assert.equal(claim.unchanged, true)
  for (const receipt of [initial, recovered]) {
    assert.equal(receipt.inputsBefore.find((entry) => entry.path === input.path).sha256, actual)
    assert.equal(receipt.inputsAfter.find((entry) => entry.path === input.path).sha256, actual)
  }
  return { path: input.path, expectedSha256: input.sha256, actualSha256: actual, bytes: bytes.length, unchanged: true }
})

assert.deepEqual(Object.keys(candidate).sort(), Object.keys(template).sort())
for (const key of Object.keys(template).filter((key) => key !== 'answers')) {
  assert.deepEqual(candidate[key], template[key], key)
}
assert.equal(candidate.status, 'draft')
assert.deepEqual(candidate.answers.map((answer) => answer.exercise), manifest.exercises)
assert.deepEqual(candidate.answers.map((answer) => answer.exercise), exercises.map((exercise) => exercise.number))
assert.equal(new Set(candidate.answers.map((answer) => answer.exercise)).size, 8)
assert.equal(candidate.answers.length, 8)
for (const [index, answer] of candidate.answers.entries()) {
  const original = template.answers[index]
  assert.deepEqual(Object.keys(answer).sort(), Object.keys(original).filter((key) => key !== 'figureEvidence').sort())
  assert.equal(answer.prompt, original.prompt)
  assert.equal(answer.prompt, exercises[index].text)
  assert.equal(answer.source, 'derived')
  assert.equal(answer.grading, 'ungraded')
  assert.ok(answer.displayAnswer.trim())
  assert.deepEqual(answer.parts, [])
  assert.deepEqual(answer.historical_entities, original.historical_entities)
  assert.ok(!Object.hasOwn(answer, 'bookRaw'))
  assert.ok(!Object.hasOwn(answer, 'figureEvidence'))
  const derivation = report.derivations.find((entry) => entry.exercise === answer.exercise)
  assert.equal(derivation.source, answer.source)
  assert.equal(derivation.grading, answer.grading)
  assert.equal(derivation.wholeSourceTask, true)
  assert.ok(derivation.derivation.length > 0)
  assert.ok(derivation.gradingRationale)
  assert.ok(derivation.capabilityLoss.lost)
}
assert.deepEqual(report.coverage.authoredExercises, manifest.exercises)
assert.equal(report.coverage.answered, 8)
assert.equal(report.coverage.auto, 0)
assert.equal(report.coverage.ungraded, 8)
assert.equal(report.coverage.templateBookRawOffered, template.answers.filter((answer) => Object.hasOwn(answer, 'bookRaw')).length)
const displays = Object.fromEntries(candidate.answers.map((answer) => [answer.exercise, answer.displayAnswer]))
assert.ok(displays['252'].includes('\\frac{V_1}{V_2}'))
assert.ok(displays['253'].includes('V_{\\mathrm{new}}=2V'))
assert.ok(displays['253'].includes('V_{\\mathrm{new}}=3V'))
assert.ok(displays['253'].includes('\\sqrt[3]{2}-1'))
assert.ok(displays['253'].includes('\\sqrt[3]{3}-1'))
assert.ok(displays['255'].includes('没有给出铁的密度'))
assert.ok(displays['255'].includes('\\rho_{\\mathrm{SI}}'))
assert.ok(displays['255'].includes('\\rho_{\\mathrm{cgs}}'))
assert.ok(displays['257'].includes('闭球体'))
assert.ok(displays['257'].includes('\\left|R\\right|^3'))
assert.ok(displays['258'].includes('\\left|kR\\right|^3'))
assert.ok(displays['258'].includes('$k<0$'))
assert.ok(displays['258'].includes('$k=0$'))
assert.ok(displays['259'].includes('$a>0$'))
assert.ok(displays['259'].includes('不能唯一确定球'))

assert.equal(cases.length, 30)
assert.deepEqual(initial.results.map((result) => result.id), cases.map((probe) => probe.id))
assert.deepEqual(recovered.results.map((result) => result.id), cases.map((probe) => probe.id))
assert.equal(initial.executionFailures, 27)
assert.equal(initial.results.filter((result) => !result.error && !result.matchesMathematics).length, 3)
assert.equal(recovered.executionFailures, 0)
assert.equal(recovered.behaviorFailures, 11)
assert.equal(recovered.results.filter((result) => result.mathematicallyCorrect && result.actual === false).length, 10)
assert.equal(recovered.results.filter((result) => !result.mathematicallyCorrect && result.actual === true).length, 1)
for (const [index, result] of recovered.results.entries()) {
  assert.equal(result.mathematicallyCorrect, cases[index].mathematicallyCorrect)
  assert.equal(result.submitted, cases[index].submitted)
  assert.deepEqual(result.part, cases[index].part)
  assert.equal(result.matchesMathematics, result.actual === result.mathematicallyCorrect)
}
const behaviorFailure = report.failures.find((failure) => failure.kind === 'genuine_native_judge_behavior_failures')
assert.deepEqual(behaviorFailure.falseRejectionIds, recovered.results.filter((result) => result.mathematicallyCorrect && result.actual === false).map((result) => result.id))
assert.deepEqual(behaviorFailure.falseAcceptanceIds, recovered.results.filter((result) => !result.mathematicallyCorrect && result.actual === true).map((result) => result.id))
const claimedProbeIds = report.derivations.flatMap((entry) => entry.probeIds)
assert.deepEqual([...claimedProbeIds].sort(), cases.map((probe) => probe.id).sort())
for (const receipt of [initial, recovered]) {
  assert.equal(sha256(fs.readFileSync(receipt.extraction.judgePath)), receipt.extraction.judgeSha256)
  assert.equal(sha256(fs.readFileSync(receipt.extraction.normalizePath)), receipt.extraction.normalizeSha256)
  assert.equal(sha256(fs.readFileSync(receipt.extraction.enginePath)), receipt.extraction.engineSha256)
  assert.equal(sha256(fs.readFileSync(receipt.extraction.casePath)), receipt.extraction.caseSha256)
  assert.equal(receipt.extraction.productionFunctionBodiesChanged, false)
  assert.equal(receipt.extraction.assumptionsAdded, false)
}
assert.equal(report.scopeCompliance.images, 0)
assert.equal(report.scopeCompliance.targetApplied, false)
assert.equal(report.scopeCompliance.published, false)
assert.equal(report.authorChecks.nativeFinalizeRun, false)
assert.equal(report.authorChecks.fullDefenceRun, false)

const verification = {
  status: 'pass',
  scope: 'bounded author output contract and hash checks only; not native finalize or full gate2 acceptance',
  inputManifestPath: manifestPath,
  inputManifestSha256: sha256(fs.readFileSync(manifestPath)),
  inputChecks,
  inputsUnchanged: true,
  candidateSchema: candidate.schema,
  candidateFieldsMatchNativeTemplateExceptUnreadPreparationEvidence: true,
  preparationEvidenceFieldOmittedWithoutViewing: 'figureEvidence',
  promptsPreserved: true,
  coverage: { requested: 8, answered: 8, missing: 0, duplicates: 0, derived: 8, auto: 0, ungraded: 8 },
  exactParts: 0,
  ungradedPartsEmpty: true,
  mathematicalExplanationsAndLossesPresent: true,
  initialProbeExecutionFailuresPreserved: 27,
  recoveredProbeExecutionFailures: 0,
  recoveredProbeMathematicalMismatchesPreserved: 11,
  images: 0,
  targetApplied: false,
  nativeFinalizeRun: false,
  fullDefenceRun: false,
  published: false,
}
fs.writeFileSync(local('verification.json'), `${JSON.stringify(verification, null, 2)}\n`, { flag: 'wx' })

const outputNames = [
  'answer-keys.candidate.json',
  'report.json',
  'offline-judge-cases.json',
  'offline-judge-probes.mjs',
  'offline-judge-results.json',
  'offline-judge-results-recovered.json',
  'verify-delivery.mjs',
  'verification.json',
  'verification-first-failure.json',
]
const outputs = outputNames.map((name) => {
  const outputPath = local(name)
  assert.ok(outputPath.startsWith(`${owner}/`))
  const bytes = fs.readFileSync(outputPath)
  const stat = fs.statSync(outputPath)
  assert.ok(stat.isFile())
  return { path: outputPath, sha256: sha256(bytes), bytes: bytes.length, mode: (stat.mode & 0o777).toString(8).padStart(4, '0') }
})
const indexPath = local('output-index.json')
assert.ok(!outputs.some((output) => output.path === indexPath))
const indexBytes = Buffer.from(`${JSON.stringify({ outputs }, null, 2)}\n`)
fs.writeFileSync(indexPath, indexBytes, { flag: 'wx' })
for (const output of readJson(indexPath).outputs) {
  const bytes = fs.readFileSync(output.path)
  assert.equal(sha256(bytes), output.sha256)
  assert.equal(bytes.length, output.bytes)
  assert.equal((fs.statSync(output.path).mode & 0o777).toString(8).padStart(4, '0'), output.mode)
}
console.log(JSON.stringify({ status: 'pass', coverage: '8/8', images: 0, outputs: outputs.length, indexPath, indexSHA: sha256(indexBytes), candidatePath: local('answer-keys.candidate.json'), reportPath: local('report.json'), verificationPath: local('verification.json') }, null, 2))
