import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import {createRequire} from 'node:module'

const cwd = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck'
const owned = path.join(cwd, '.intentfold/tickets/STEMROBIN-188/tmp/n44-answer-author')
if (process.cwd() !== cwd) throw Error('wrong cwd')
const bindOwned = relative => {
  const file = path.join(owned, relative)
  const bytes = fs.readFileSync(file)
  return {path: file, sha256: crypto.createHash('sha256').update(bytes).digest('hex'), bytes: bytes.length}
}
const read = relative => fs.readFileSync(path.join(owned, relative), 'utf8')
const json = relative => JSON.parse(read(relative))
const work = 'work/9-10g/modern-us-neutral/lessons/geo910-c2-s1-n44'
const candidate = json(`${work}/answer-keys.template.json`)
const candidateBinding = bindOwned(`${work}/answer-keys.template.json`)
const firstBinding = bindOwned(`${work}/answer-keys.first-candidate.json`)
if (candidateBinding.sha256 !== firstBinding.sha256) throw Error('unexpected candidate revision')
const receiptNames = [
  'input-bindings',
  'prepare-once',
  'rasterize-current-fig08',
  'preserve-prepared-original',
  'independent-arithmetic-once',
  'freeze-pre-candidate-derivations',
  'freeze-first-candidate',
  'structure-once',
  'katex-numeric-once',
  'existing-math-expression-once',
]
const commands = receiptNames.map(name => ({
  receipt: bindOwned(`receipts/${name}.json`),
  ...json(`receipts/${name}.json`),
}))
if (commands.some(r => r.exitCode !== 0)) throw Error('a required bounded command did not succeed')
const technical = Object.fromEntries(
  ['structure-once', 'katex-numeric-once', 'existing-math-expression-once'].map(name =>
    [name, JSON.parse(commands.find(r => r.receipt.path.endsWith(`/${name}.json`)).stdout)]
  )
)
const originals = [
  {exercise: '16', requestedTasks: ['1) construct A', '2) construct B', '3) construct D', '4) construct E', '5) construct G'], originalRequests: 5},
  {exercise: '17', requestedTasks: ['1) entire vector PQ', '2) entire vector PQ'], originalRequests: 2},
  {exercise: '18', requestedTasks: ['length of OB'], originalRequests: 1},
  {exercise: '19', requestedTasks: ['entire equidistant point on Oy'], originalRequests: 1},
  {exercise: '20', requestedTasks: ['1) AA_1 and BB_1 lengths', '2) distance to centroid', '3) all three interior angles'], originalRequests: 3, expandedQuantities: 6},
  {exercise: '21', requestedTasks: ['both diagonal lengths, all allowed vertex-pair cases'], originalRequests: 1, enumeratedCaseBranches: 3},
  {exercise: '22', requestedTasks: ['proof of parallelogram', 'all diagonal intersection angles'], originalRequests: 2, calculatedDistinctAngles: 2},
]
const coverage = candidate.answers.map((answer, index) => ({
  ...originals[index],
  sourceNumber: answer.sourceNumber,
  groupId: answer.groupId,
  group: answer.group,
  groupPrompt: answer.groupPrompt,
  prompt: answer.prompt,
  figureEvidence: answer.figureEvidence,
  source: answer.source,
  grading: answer.grading,
  gradedPartCount: answer.parts.length,
  parts: answer.parts,
  displayAnswer: answer.displayAnswer,
  notes: answer.notes ?? null,
  contentRepairs: 0,
}))
const requireApp = createRequire(path.join(cwd, 'app/package.json'))
const katexRuntime = technical['katex-numeric-once']
const runtimePaths = [
  process.execPath,
  katexRuntime.katexModule,
  katexRuntime.computeEngineModule,
  requireApp.resolve('playwright'),
]
const runtimeBindings = runtimePaths.map(file => {
  const bytes = fs.readFileSync(file)
  return {path: file, sha256: crypto.createHash('sha256').update(bytes).digest('hex'), bytes: bytes.length}
})
const summary = technical['structure-once'].summary
const report = {
  schema: 'n44-answer-author/report@1',
  ticket: 'STEMROBIN-188',
  assignment: 'SAME188-6',
  role: 'STANDARD ANSWER author ONLY offline',
  generatedAt: new Date().toISOString(),
  cwd,
  ownedDirectory: owned,
  status: 'author-candidate-complete-pending-independent-semantic-review-and-MathLive-finalize',
  book: candidate.book,
  edition: candidate.edition,
  lesson: candidate.lesson,
  candidate: {...candidateBinding, status: candidate.status, authoredWith: 'apply_patch'},
  firstCandidate: {...firstBinding, immutable: true, revision: 0},
  preparedOriginal: {...bindOwned(`${work}/answer-keys.prepared-original.json`), immutable: true, untouched: true},
  preCandidateDerivations: {...bindOwned('derivations.pre-candidate.md'), immutable: true},
  completeDerivations: read('derivations.pre-candidate.md'),
  independentArithmetic: JSON.parse(commands.find(r => r.receipt.path.endsWith('/independent-arithmetic-once.json')).stdout),
  summary: {
    answerCount: candidate.answers.length,
    derivedAnswerCount: 7,
    autoExerciseCount: summary.autoExercises.length,
    ungradedExerciseCount: summary.ungradedExercises.length,
    ...summary,
    originalRequestedTasks: originals.reduce((sum, item) => sum + item.originalRequests, 0),
    completeRequestedCoverage: coverage,
  },
  immutableInputBindings: json('input-bindings.json'),
  actualResolvedRuntimeBindings: runtimeBindings,
  runtimeNote: 'Existing packages resolve through worktree symlinks to the shared local checkout. No installation or package modification; no DB-bearing runtime module imported.',
  images: json('image-opens.json'),
  checkedCommands: commands,
  technicalResults: technical,
  initialTechnicalFailures: json('receipts/initial-technical-failures.json'),
  outputTruncation: {
    producer: 'katex-numeric-once',
    toolPreviewTruncated: true,
    diskStdoutStderrComplete: true,
    producerRerun: false,
  },
  counters: {
    prepareInvocations: 1,
    independentArithmeticInvocations: 1,
    boundedValidationBatches: 1,
    structureInvocations: 1,
    katexNumericInvocations: 1,
    existingMathExpressionInvocations: 1,
    imagesOpened: 2,
    failedImageOpens: 0,
    imageBatches: 1,
    maximumImagesInBatch: 2,
    contentRepairsTotal: 0,
    contentRepairBudgetPerAffectedAnswerUnit: 1,
    repairsByExercise: Object.fromEntries(coverage.map(c => [c.exercise, 0])),
    repairsByGradedPart: Object.fromEntries(coverage.flatMap(c => c.parts.map((p, i) => [`${c.exercise}:${i}:${p.label}`, 0]))),
    imageRepairs: 0,
    sourceRepairs: 0,
    paidCalls: 0,
    initialExploratoryTechnicalFailures: 3,
    contentFailures: 0,
    candidateValidationFailures: 0,
    localHOLDS: 0,
  },
  pending: {
    independentSemanticReview: true,
    independentSemanticPASSClaim: false,
    realMathLiveKeyboardGate: true,
    exactPartsAwaitingMathLive: 3,
    lessonAnswersFinalize: true,
    gate2Approval: false,
    productionCoreAnswerRead: false,
    productionCoreAnswerWrite: false,
    parentControlsRemainingStages: true,
  },
  restrictions: {
    otherAuthorOrReviewerSolutionsConsulted: false,
    sourcePagesRead: false,
    answerPdfReadOrCrawled: false,
    otherLessonKeysRead: false,
    interactionsOrChoicesReadOrWritten: false,
    finalizeRun: false,
    realMathLiveGateRun: false,
    publicationRun: false,
    databaseAccess: false,
    environmentFileAccess: false,
    installation: false,
    network: false,
    gitOperations: false,
    backendOperations: false,
    setupOrFreshnessOrGrill: false,
    deployOrClosureOrContact: false,
    writesOutsideOwnedDirectory: false,
    otherEditsPreserved: true,
  },
}
const bindingList = report.immutableInputBindings.bindings
const paragraphs = [
  read('report-notes.md').trim(),
  '## Candidate Bindings',
  `Candidate: \`${candidateBinding.path}\`\n\nSHA-256: \`${candidateBinding.sha256}\`\n\nPrepared original: \`${report.preparedOriginal.path}\`\n\nPrepared SHA-256: \`${report.preparedOriginal.sha256}\`\n\nFirst candidate: \`${firstBinding.path}\`\n\nFirst SHA-256: \`${firstBinding.sha256}\`\n\nPre-candidate derivations SHA-256: \`${report.preCandidateDerivations.sha256}\``,
  '## Coverage',
  '| Exercise | Grading | Original Requests | Graded Parts | Source | Content Repairs |\n|---|---|---:|---:|---|---:|\n' +
    coverage.map(c => `| ${c.exercise} | ${c.grading} | ${c.originalRequests} | ${c.gradedPartCount} | ${c.source} | 0 |`).join('\n'),
  `Total: 7 exercises; 4 auto / 3 ungraded; 10 graded parts (3 exact / 7 numeric / 0 expression). The 15 original requests include compound median and angle questions; exercise 20 expands to six separately labelled graded quantities. Exercise 21 has three exhaustive case branches. No ungraded request is silently omitted.`,
  '## Complete Part Keys',
  '```json\n' + JSON.stringify(coverage.map(({exercise, grading, parts}) => ({exercise, grading, parts})), null, 2) + '\n```',
  '## Technical Evidence',
  `Structure exit 0; KaTeX rendered ${katexRuntime.katexChecked} math fragments; ${katexRuntime.numericChecked} numeric values compared to independent arithmetic, with negative controls; existing numeric/expression validator checked 7 values, exit 0. All three ran once. No MathLive keyboard transaction or semantic-review PASS is inferred.`,
  '## Actual Image Opens',
  '```json\n' + JSON.stringify(report.images, null, 2) + '\n```',
  '## Immutable Inputs',
  bindingList.map(b => `- \`${b.path}\`\n  SHA-256 \`${b.sha256}\` (${b.bytes} bytes)`).join('\n'),
  '## Actual Runtime Bindings',
  runtimeBindings.map(b => `- \`${b.path}\`\n  SHA-256 \`${b.sha256}\` (${b.bytes} bytes)`).join('\n'),
  report.runtimeNote,
  '## Full Command Receipts',
  'All commands below ran in the exact workdir shown. Each original on-disk receipt is immutable and includes full stdout/stderr. Tool-preview truncation did not truncate the stored output or trigger a rerun.',
  ...commands.flatMap(r => [
    `### ${path.basename(r.receipt.path, '.json')}`,
    `Receipt: \`${r.receipt.path}\`\n\nReceipt SHA-256: \`${r.receipt.sha256}\`\n\nWorkdir: \`${r.cwd}\`\n\nCommand argv:\n\`\`\`json\n${JSON.stringify(r.command, null, 2)}\n\`\`\`\nExit: ${r.exitCode}; signal: ${r.signal ?? 'none'}; error: ${r.error ?? 'none'}`,
    `Full stdout:\n\`\`\`text\n${r.stdout}\`\`\`\n\nFull stderr:\n\`\`\`text\n${r.stderr}\`\`\``,
  ]),
  '## Retained First Technical Failures',
  '```json\n' + JSON.stringify(report.initialTechnicalFailures, null, 2) + '\n```',
  '## Image and Repair Counters',
  '```json\n' + JSON.stringify(report.counters, null, 2) + '\n```',
  '## Complete Pre-Candidate Derivations',
  report.completeDerivations.trim(),
  '## Remaining Gates',
  'Independent semantic review, real MathLive keyboard gate for the three exact parts, and lesson_answers.py finalize remain pending with the parent. No independent semantic PASS, gate-2 approval or production publication is claimed.',
]
fs.writeFileSync(path.join(owned, 'report.json'), JSON.stringify(report, null, 2) + '\n', {flag: 'wx'})
fs.writeFileSync(path.join(owned, 'report.md'), paragraphs.join('\n\n') + '\n', {flag: 'wx'})
console.log(JSON.stringify({
  status: report.status,
  candidate: candidateBinding,
  reports: [bindOwned('report.md'), bindOwned('report.json')],
  counts: {exercises: 7, auto: 4, ungraded: 3, parts: 10, imageOpens: 2, contentRepairs: 0},
  mathLiveFinalize: 'pending',
  independentSemanticPASSClaim: false,
}, null, 2))
