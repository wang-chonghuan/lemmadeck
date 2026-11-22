import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { repo, tmp, read, bind, save } from './retain-scoped-evidence-02.mjs'
import { retainCurrent6g } from './retain-current-6g-evidence-03.mjs'

const own = path.join(tmp, 'n32-finite-grading-revision1-14')
const recordFile = path.join(own, 'record.json')
const record = read(recordFile)
const reportFile = path.join(own, 'mathlive-report.json')
const receiptFile = path.join(own, 'mathlive.execution.json')
assert.ok(!fs.existsSync(receiptFile) && !fs.existsSync(reportFile))
const argv = ['node', '.claude/skills/ld-s10y-answer/tools/check_mathlive_exact.mjs',
  '--cases', path.relative(repo, record.cases.path),
  '--output', path.relative(repo, reportFile)]
const startedAt = new Date().toISOString()
const result = spawnSync(argv[0], argv.slice(1), { cwd: repo, encoding: 'utf8' })
const streams = {}
for (const name of ['stdout', 'stderr']) {
  const file = path.join(own, `mathlive.${name}`)
  fs.writeFileSync(file, result[name] ?? '', { flag: 'wx' })
  streams[name] = bind(file)
}
save(receiptFile, { cwd: repo, argv, startedAt, endedAt: new Date().toISOString(),
  exitCode: result.status, signal: result.signal, streams })
assert.equal(result.status, 0, result.stderr || result.stdout)
const inputsFile = path.join(own, 'affected-review-inputs.json')
save(inputsFile, {
  status: 'FOUR_FINITE_DECISIONS_GRADING_ONLY_EDITOR_CHECK_COMPLETE_REVIEW_PENDING',
  record: bind(recordFile), baseline: record.baseline, candidate: record.candidate,
  cases: record.cases, editorReport: bind(reportFile), editorReceipt: bind(receiptFile),
  priorIndependentReview: bind(path.join(tmp,
    'n32-nineanswers-text-207208-independent-review-11/manifest.json')),
  instructions: 'Zero images. Reuse prior independent math/source PASS for433434435436 and all unchanged displayAnswer strings. Review only auto/exact grading eligibility, ten requested part labels, expected/reject strings and actual editor key-input-delete-reserialization facts. Do not solve unchanged proofs or reopen figures. Other five answer objects unchanged. Preserve grading-only revision1 each and4371/4381/4402. Not full Gate2 or full-nine finalization.',
})
const references = [bind(recordFile), record.candidate, record.cases, bind(reportFile),
  bind(receiptFile), ...Object.values(streams), bind(inputsFile),
  bind(path.join(tmp, 'prepare-n32-finite-grading-revision1-14.mjs')),
  bind(path.join(tmp, 'check-retain-n32-finite-grading-14.mjs'))]
console.log(JSON.stringify(retainCurrent6g(
  'evidence/stemrobin188-6g-n32/finite-grading-revision1-14', references,
  [
    'evidence/stemrobin188-6g-n32/independent-nineanswers-text-207208-review12/retention.json',
    'evidence/stemrobin188-6g-n32/440-incidence-affected-review13/retention.json',
  ], {
    status: 'FINITE_GRADING_EDITOR_PASS_AFFECTED_REVIEW_PENDING',
    record: bind(recordFile), editorReport: bind(reportFile),
    editorReceipt: bind(receiptFile), affectedInputs: bind(inputsFile),
    gradingOnlyRevisions: record.gradingOnlyRevisions,
    existingProofRevisions: record.existingProofRevisions,
    originalFIRSTsFailuresAndUNKNOWNPreserved: true,
    questionsAndApprovedExplanationsUnchanged: true,
    editorInvocations: 1, fullNineFinalizerRun: false, parentImageLoads: 0,
  })))
