import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'

const repo = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck'
const own = path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp/n47-answer-author')
if (process.cwd() !== repo) throw new Error('Wrong cwd')
const indexPath = path.join(own, 'output-index.json')
if (fs.existsSync(indexPath)) throw new Error('Collection already completed')
const sha = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex')
const file = (filename) => ({ path: filename, sha256: sha(fs.readFileSync(filename)), bytes: fs.statSync(filename).size })
const read = (filename) => JSON.parse(fs.readFileSync(path.join(own, filename), 'utf8'))
const candidatePath = path.join(own, 'candidate/answer-keys.json')
const candidate = read('candidate/answer-keys.json')
const frozen = read('evidence/first-candidate-freeze.json')
if (file(candidatePath).sha256 !== frozen.candidate.sha256) throw new Error('Frozen candidate changed')
if (file(path.join(own, 'candidate/answer-keys.FIRST.json')).sha256 !== frozen.candidate.sha256) {
  throw new Error('First snapshot changed')
}
const reportPath = path.join(own, 'report.json')
const report = read('report.json')
const exercises = read('artifacts/9-10g/editions/modern-us-neutral/lessons/geo910-c2-s2-n47/exercises.json')
const rawExercises = read('artifacts/9-10g/lessons/geo910-c2-s2-n47/exercises.json')
if (candidate.status !== 'draft' || candidate.answers.length !== 6) throw new Error('Candidate not six-answer draft')
if (candidate.answers.map((answer) => answer.exercise).join(',') !== '49,50,51,52,53,54') {
  throw new Error('Answer identity changed')
}
if (candidate.answers.find((answer) => answer.exercise === '52').grading !== 'ungraded') {
  throw new Error('Construction task must remain ungraded')
}
if (candidate.answers.some((answer) => answer.source !== 'derived' || 'bookRaw' in answer)) {
  throw new Error('Unbound book answer introduced')
}
for (const exerciseReport of report.perExercise) {
  const answer = candidate.answers.find((item) => item.exercise === exerciseReport.exercise)
  const modern = exercises.exercises.find((item) => item.number === exerciseReport.exercise)
  const raw = rawExercises.exercises.find((item) => item.number === exerciseReport.exercise)
  if (answer.prompt !== modern.text) throw new Error('Candidate prompt changed')
  exerciseReport.hashes = {
    algorithm: 'SHA256 of UTF-8 JSON.stringify object, without trailing newline; prompt is UTF-8 literal text.',
    answerObject: sha(JSON.stringify(answer)),
    modernExerciseObject: sha(JSON.stringify(modern)),
    rawExerciseObject: sha(JSON.stringify(raw)),
    modernPromptText: sha(modern.text),
    rawPromptText: sha(raw.text),
  }
}
const structure = read('evidence/structure-receipt.json')
const expected = read('evidence/expected-receipt.json')
const exact = read('evidence/exact-receipt.json')
const mathlive = read('evidence/mathlive-exact.json')
const arithmetic = read('evidence/author-arithmetic.json')
const ledger = read('evidence/counter-image-ledger.json')
for (const receipt of [structure, expected, exact]) {
  if (receipt.exitCode !== 0 || receipt.candidateSha256 !== frozen.candidate.sha256) {
    throw new Error('Check failure or different checked candidate')
  }
}
if (mathlive.caseCount !== 10 || mathlive.failures !== 0 || mathlive.results.some((item) =>
  item.attempts !== 1 || !item.accepted || !item.inserted || !item.preserved || item.inputEvents < 1)) {
  throw new Error('Real MathLive receipt does not support ledger')
}
if (arithmetic.checkCount !== 28 || arithmetic.failureCount !== 0 ||
  arithmetic.candidateSha256 !== frozen.candidate.sha256) throw new Error('Arithmetic receipt mismatch')
if (expected.parsed.checked !== 7) throw new Error('Expected checker count mismatch')
const entry = read('evidence/input-bindings.json')
const exitBindings = entry.bindings.map((binding) => ({
  path: binding.path,
  expectedSha256: binding.sha256,
  actualSha256: file(binding.path).sha256,
}))
const mismatches = exitBindings.filter((binding) => binding.expectedSha256 !== binding.actualSha256)
const exitReceipt = {
  status: mismatches.length ? 'input-drift' : 'unchanged',
  purpose: 'One exit binding recheck, not a repeated content or product stage.',
  checked: exitBindings.length,
  mismatches,
  bindings: exitBindings,
}
fs.writeFileSync(path.join(own, 'evidence/exit-bindings.json'), `${JSON.stringify(exitReceipt, null, 2)}\n`, { flag: 'wx' })
report.exitBindingStatus = exitReceipt.status
report.exitBindingMismatches = mismatches
report.candidate = file(candidatePath)
report.firstCandidate = file(path.join(own, 'candidate/answer-keys.FIRST.json'))
report.preparedOriginal = file(path.join(own, 'prepared-original/answer-keys.template.json'))
report.counterImageLedger = ledger
report.checkReceipts = ['structure', 'expected', 'exact'].map((mode) => {
  const receipt = read(`evidence/${mode}-receipt.json`)
  return { ...file(path.join(own, `evidence/${mode}-receipt.json`)), mode, exitCode: receipt.exitCode, authorSideOnly: true }
})
report.evidenceFiles = [
  'evidence/input-bindings.json', 'evidence/exit-bindings.json', 'evidence/copied-inputs.json',
  'evidence/book-answer-source.json', 'evidence/prepare-receipt.json',
  'evidence/prepared-original.json', 'evidence/first-candidate-freeze.json',
  'evidence/mathlive-exact.json', 'evidence/author-arithmetic.json',
  'evidence/counter-image-ledger.json',
].map((filename) => file(path.join(own, filename)))
report.toolFiles = [
  '.claude/skills/ld-s10y-answer/SKILL.md',
  '.claude/skills/ld-s10y-answer/references/gate-2-lesson-answers/gate.md',
  '.claude/skills/ld-s10y-lesson/references/production-resume.md',
  '.agents/skills/ld-s10y-image/SKILL.md',
  '.claude/skills/ld-s10y-answer/tools/lesson_answers.py',
  '.claude/skills/ld-s10y-answer/tools/check_math_expressions.mjs',
  '.claude/skills/ld-s10y-answer/tools/check_mathlive_exact.mjs',
  'app/src/lib/answer-normalize.ts', 'app/src/lib/textbook-answer.ts',
].map((filename) => file(path.join(repo, filename)))
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`)

const inventory = (directory) => fs.readdirSync(directory, { withFileTypes: true })
  .flatMap((entry) => {
    const filename = path.join(directory, entry.name)
    if (entry.isDirectory()) {
      if (filename === path.join(own, 'runtime-tmp')) return []
      return inventory(filename)
    }
    return [file(filename)]
  })
const index = {
  schema: 'stemrobin188/n47-answer-output-index@1',
  ticket: report.ticket,
  assignment: report.assignment,
  role: report.role,
  status: report.status,
  soleWriteRoot: own,
  candidate: file(candidatePath),
  reportJson: file(reportPath),
  reportMarkdown: file(path.join(own, 'report.md')),
  firstCandidate: report.firstCandidate,
  preparedOriginal: report.preparedOriginal,
  ledger: file(path.join(own, 'evidence/counter-image-ledger.json')),
  exerciseCount: 6,
  exerciseOrder: report.exerciseOrder,
  allAnswerSources: 'derived',
  autoExercises: 5,
  ungradedExercises: 1,
  autoParts: 12,
  imageLoads: 2,
  prepareCalls: 1,
  currentInputBindingsUnchanged: !mismatches.length,
  independentAnswerApproval: false,
  gate2Approval: false,
  finalized: false,
  published: false,
  wholeLessonApproved: false,
  parentResponseMustBeTextOnly: true,
  inventory: inventory(own),
  selfHash: 'Not self-referential; actual index SHA256 is returned on stdout.',
}
fs.writeFileSync(indexPath, `${JSON.stringify(index, null, 2)}\n`, { flag: 'wx' })
for (const filename of [reportPath, path.join(own, 'report.md'), indexPath]) fs.chmodSync(filename, 0o444)
console.log(JSON.stringify({
  candidate: index.candidate,
  reportJson: index.reportJson,
  reportMarkdown: index.reportMarkdown,
  outputIndex: file(indexPath),
  preparedOriginal: index.preparedOriginal,
  imageLoads: 2, prepareCalls: 1,
  inputBindingExitStatus: exitReceipt.status,
  independentAnswerApproval: false, gate2Approval: false, finalized: false, published: false,
}, null, 2))
