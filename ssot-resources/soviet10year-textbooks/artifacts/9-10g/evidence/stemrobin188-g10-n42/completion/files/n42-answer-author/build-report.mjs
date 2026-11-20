import fs from 'node:fs'
import path from 'node:path'
import assert from 'node:assert/strict'
import {cwd, owned, lesson, workLesson, bind, sha, readJson, jsonNew, writeNew} from './run.mjs'

const candidate = path.join(workLesson, 'answer-keys.template.json')
const firstCandidate = path.join(workLesson, 'answer-keys.first-candidate.json')
const preparedOriginal = path.join(workLesson, 'answer-keys.prepared-original.json')
assert.equal(sha(candidate), sha(firstCandidate))
const document = readJson(candidate)
const inputs = readJson(path.join(owned, 'inputs.manifest.json'))
const inputDrift = inputs.bindings.flatMap(input => {
  const current = bind(input.path)
  return current.sha256 === input.sha256 ? [] : [{captured: input, current}]
})
const receipts = fs.readdirSync(path.join(owned, 'receipts')).filter(name => name.endsWith('.json'))
  .map(name => {
    const file = path.join(owned, 'receipts', name)
    const receipt = readJson(file)
    assert.equal(receipt.exitCode, 0, name)
    assert.equal(receipt.cwd, cwd)
    fs.chmodSync(file, 0o444)
    fs.chmodSync(receipt.stdoutFile.path, 0o444)
    fs.chmodSync(receipt.stderrFile.path, 0o444)
    return {
      name: receipt.name, receipt: bind(file), command: receipt.command, cwd: receipt.cwd,
      startedAt: receipt.startedAt, completedAt: receipt.completedAt,
      exitCode: receipt.exitCode, signal: receipt.signal, error: receipt.error,
      stdout: receipt.stdoutFile, stderr: receipt.stderrFile,
    }
  }).sort((a, b) => a.startedAt.localeCompare(b.startedAt))
const result = name => readJson(path.join(owned, `receipts/${name}.stdout.txt`))
const structure = result('structure')
const latex = result('latex-arithmetic')
const arithmetic = result('independent-arithmetic')
const mathContract = result('math-expression-contract')
const images = readJson(path.join(owned, 'image-ledger.json'))
for (const image of images.opens) assert.equal(sha(image.path), image.sha256)
for (const spec of images.specsReadBeforeSolving) assert.equal(sha(spec.path), spec.sha256)
const originalRequestCounts = [7, 3, 3, 2, 1, 2, 2]
const coverage = document.answers.map((answer, index) => ({
  exercise: answer.exercise, sourceNumber: answer.sourceNumber, groupId: answer.groupId,
  group: answer.group, numberingScope: answer.numberingScope, sourcePages: answer.sourcePages,
  prompt: answer.prompt, figureEvidence: answer.figureEvidence, source: answer.source,
  originalRequests: originalRequestCounts[index], grading: answer.grading,
  displayAnswer: answer.displayAnswer, parts: answer.parts, notes: answer.notes ?? null,
}))
const report = {
  schema: 'stemrobin188/offline-answer-author-report@1',
  ticket: 'STEMROBIN-188', assignment: '188-6', role: 'N42 ANSWER AUTHOR ONLY',
  generatedAt: new Date().toISOString(), cwd, ownedDirectory: owned,
  status: inputDrift.length ? 'HOLD-input-drift-after-authoring' :
    'author-candidate-complete-pending-independent-semantic-review-and-MathLive-finalize',
  book: '9-10g', edition: 'modern-us-neutral', lesson,
  candidate: {...bind(candidate), status: document.status, authoredWith: 'apply_patch'},
  firstCandidate: {...bind(firstCandidate), immutable: true, revision: 0},
  preparedOriginal: {...bind(preparedOriginal), immutable: true, untouched: true},
  derivations: {...bind(path.join(owned, 'derivations.pre-candidate.md')), immutable: true},
  inputManifest: bind(path.join(owned, 'inputs.manifest.json')),
  actualInputBindings: inputs.bindings,
  inputDrift,
  identity: {
    existingBookNumbering: 'book', actualSourcePageNumberingScope: 'g10',
    lessonScopedOriginalKeys: ['1', '2', '3', '4', '5', '6', '7'],
    groupIdPreserved: 'g1', sourcePhysicalPages: [154, 155], sourcePrintedPages: [147, 148],
    originalExerciseSnapshotSha256: '94ad62709a3a901db7ef359e53f14c2eb30aa1ee14630bb353573af08efa88a4',
    sourcePdf: {
      name: '9-10g 苏联十年制学校数学教材 几何 9-10年级.pdf',
      sha256FromCorePageMetadata: '1900be5207d00404f64e5a40ab855fbfb8495bd2a06c5ce295ae0e145444578a',
      wholePdfRehashedOrCopied: false,
    },
    earlierBookSectionQuestion1Used: false, section43WorkedProblem1UsedAsN42Exercise1: false,
    sourceAndEmbeddedEditionSnapshotExactMatch: true,
    modernLessonAndExercisesAndFiguresReadyAtCapture: true,
    coreMetadataChanged: false,
  },
  summary: {
    answerCount: 7, derivedAnswers: 7, autoExercises: 6, ungradedExercises: 1,
    gradedParts: 19, exactParts: 15, numericParts: 4, expressionParts: 0,
    exactExpectedValues: 18, numericExpectedValues: 4,
    originalRequestedSubtasks: 20, requestedQuantitiesOrReasoningResponses: 21,
    taskCountNote: 'Exercise 5 requests x and y together; expanded into two numeric parts. Exercise 4 has two fully answered reasoning responses, no graded parts.',
    katexFragmentsChecked: latex.katexFragmentsChecked,
    tupleExpectedValuesChecked: latex.tupleExpectedValuesChecked,
    tupleCoordinatesChecked: latex.tupleCoordinatesChecked,
    originalQuestionsMissing: 0, duplicateQuestions: 0, unknownSourceQuestions: 0,
    completeCoverage: coverage,
  },
  sourcePolicy: {rawBookAnswer: inputs.bookRaw, answerSource: 'derived',
    oldKeysOrChoiceAuthorOrPeerSolutionsUsed: false},
  technicalEvidence: {
    interpretation: 'Author support only, not independent semantic review or gate-2 approval',
    structure: {receipt: bind(path.join(owned, 'receipts/structure.json')), result: structure},
    katexAndArithmetic: {
      receipt: bind(path.join(owned, 'receipts/latex-arithmetic.json')),
      completeStdout: bind(path.join(owned, 'receipts/latex-arithmetic.stdout.txt')),
      status: latex.status, katexFragmentsChecked: latex.katexFragmentsChecked,
      expectedValuesArithmeticallyChecked: latex.expectedValuesArithmeticallyChecked,
      sharedNormalizerOnly: true, runtimeBindings: latex.runtimeBindings,
      realMathLiveInputEvidence: false,
    },
    numericExpressionContract: {receipt: bind(path.join(owned, 'receipts/math-expression-contract.json')),
      result: mathContract},
    independentArithmetic: {
      receipt: bind(path.join(owned, 'receipts/independent-arithmetic.json')),
      completeStdout: bind(path.join(owned, 'receipts/independent-arithmetic.stdout.txt')),
      result: arithmetic, calculatedBeforeCandidate: true, candidateReadByArithmetic: false,
    },
  },
  imageLedger: {binding: bind(path.join(owned, 'image-ledger.json')), ...images},
  commands: receipts,
  counters: {
    prepareInvocations: 1, arithmeticInvocations: 1,
    structuralInvocations: 1, katexArithmeticInvocations: 1, numericExpressionContractInvocations: 1,
    validationBatches: 1, producerReruns: 0, candidateContentRevisions: 0,
    contentRepairsByExercise: Object.fromEntries(document.answers.map(a => [a.exercise, 0])),
    candidateCheckFailures: 0, imagesOpened: 6, imageBatches: 1, reopens: 0,
    paidCalls: 0, sourceRepairs: 0, figureRepairs: 0,
    sourceHOLDS: 0, inputDriftHOLDS: inputDrift.length ? 1 : 0,
  },
  pending: {
    independentSemanticReview: true, independentSemanticPASSClaim: false,
    realMathLiveKeyboardGate: true, exactPartsAwaitingParentGate: 15,
    exactExpectedValuesAwaitingParentGate: 18, lessonAnswersFinalize: true,
    gate2Approval: false, parentOwnsRemainingStages: true,
  },
  boundaries: {
    coreAnswerKeyRead: false, coreAnswerKeyWritten: false, coreFilesWritten: false,
    userEditsReverted: false, choicesOrInteractionsReadOrWritten: false,
    n42ChoiceAuthorOrReviewerRead: false, peerReportsRead: false,
    figureReviewFilesByteHashedOnly: true,
    otherLessonAuthorHelperScriptsReadForAuthorizedWorkflowPattern: true,
    finalizeRun: false, realMathLiveExactCheckRun: false,
    browserUsedOnlyForOfflineLocalSvgRasterization: true,
    publisherInvoked: false, databaseAccess: false, environmentReadOrChanged: false,
    modelChanged: false, paidOrExternalApiCalls: 0, networkRequests: 0,
    otherAgentContact: false, gitMutations: 0,
    unintendedInitialReadOnlyGitStatusInvocations: 1,
    boundaryDeviation: 'Initial git status --short was run despite No Git; read-only, no mutation, no later Git command.',
    writesOutsideOwnedArtifactDirectory: false,
    preReceiptExplorationLimitations: bind(path.join(owned, 'exploration-notes.md')),
  },
  reportGenerationReceipt: {
    command: ['node', '.intentfold/tickets/STEMROBIN-188/tmp/n42-answer-author/build-report.mjs'],
    cwd, captureBy: 'run.mjs run build-report',
    receiptPath: path.join(owned, 'receipts/build-report.json'),
    note: 'Written after these reports; the final seal binds this receipt without circular hashes.',
  },
}
jsonNew('report.json', report)
const markdown = [
  '# N42 Offline Answer Author',
  `Status: ${report.status}. Candidate remains draft.`,
  '## Artifacts',
  `Candidate: \`${report.candidate.path}\`\nSHA-256: \`${report.candidate.sha256}\``,
  `First candidate: \`${report.firstCandidate.path}\`\nSHA-256: \`${report.firstCandidate.sha256}\``,
  `Prepared original: \`${report.preparedOriginal.path}\`\nSHA-256: \`${report.preparedOriginal.sha256}\``,
  '## Coverage',
  'Seven original g10 questions, source physical pages 154-155 / printed 147-148. Existing book metadata and group g1 are preserved. No earlier section question 1 is substituted.',
  '| Exercise | Source Blocks | Grading | Parts | Source |\n|---|---|---|---:|---|\n' +
    coverage.map(c => `| ${c.exercise} | ${c.sourcePages.join(', ')} | ${c.grading} | ${c.parts.length} | derived |`).join('\n'),
  '6 auto / 1 ungraded; 19 parts (15 exact, 4 numeric). All 20 original subtasks are answered, with the combined x,y question split into two numeric quantities. Exercise 4 has both full scalar-multiple explanations.',
  '## Checks',
  'The shared structural validator passes without finalize; source identity and prompts match. KaTeX renders 100 prompt/display/expected fragments. All 22 expected values match independently calculated source arithmetic; 14 tuple forms contain 42 checked coordinates. Four numeric values pass the existing ComputeEngine contract. Positive/negative shared-normalizer checks are author support only, never actual input-chain evidence.',
  'Each preparation/calculation/check ran once. Full commands, cwd, exit code, stdout, stderr and their SHA-256 bindings are retained in the receipts directory and indexed in report.json.',
  '## Images',
  'Six actual image opens in one batch: original/current figures 1 and 2, and hash-bound source pages 154 and 155. No reopen, crop reopen, paid call, or image payload returned to parent. Prepared figureEvidence arrays are all empty because no original exercise refers to a figure. Both current specs were read before solving.',
  '## Input Bindings',
  inputs.bindings.map(b => `- \`${b.path}\`: \`${b.sha256}\``).join('\n'),
  `Input drift after capture: ${inputDrift.length}.`,
  '## Command Receipts',
  receipts.map(r => `- ${r.name}: exit ${r.exitCode}; \`${r.receipt.path}\`; SHA-256 \`${r.receipt.sha256}\`.\n  Command: \`${JSON.stringify(r.command)}\`\n  stdout: \`${r.stdout.path}\`; stderr: \`${r.stderr.path}\`.`).join('\n'),
  '## Restrictions And Deviation',
  'No publisher, DB, core write, revert, environment access/change, model change, installation, paid request, external network request, other-agent contact, finalize or MathLive keyboard gate. Offline Chromium was used only to rasterize the two local current SVGs.',
  'One initial read-only git status --short was mistakenly run despite the No Git restriction. No Git mutation or subsequent Git command occurred; exploration-notes.md records this deviation and the initial missing-path observations.',
  '## Pending',
  'Independent semantic review, real MathLive keyboard checking for 15 exact parts / 18 accepted exact forms, and lesson_answers.py finalize remain with the parent. This report claims no independent semantic PASS, gate-2 approval, ready answer key, or publication.',
  '## Complete Independent Derivations',
  fs.readFileSync(path.join(owned, 'derivations.pre-candidate.md'), 'utf8'),
]
writeNew('report.md', markdown.join('\n\n') + '\n')
console.log(JSON.stringify({
  status: report.status, candidate: bind(candidate),
  reports: [bind(path.join(owned, 'report.json')), bind(path.join(owned, 'report.md'))],
  counts: {answers: 7, auto: 6, ungraded: 1, parts: 19, exact: 15, numeric: 4,
    images: 6, katexFragments: 100, sourceHOLDS: 0},
  pending: report.pending,
}, null, 2))
