import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'

const root = path.dirname(fileURLToPath(import.meta.url))
const repo = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck'
const tmp = path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp')
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
const absolute = (file) => path.isAbsolute(file) ? file : path.join(repo, file)
const digest = (data) => crypto.createHash('sha256').update(data).digest('hex')
const ownBinding = (name) => {
  const file = path.join(root, name)
  const data = fs.readFileSync(file)
  const stat = fs.statSync(file)
  return {
    path: file,
    sha256: digest(data),
    bytes: data.length,
    mode: (stat.mode & 0o777).toString(8).padStart(4, '0'),
  }
}
const inputA = path.join(tmp, 'n32-fig205-independent-inputs-13')
const aSource = read(path.join(inputA, 'source-only.json'))
const a = read(path.join(inputA, 'post-FIRST.json'))
const aAuthor = read(a.authorReport.path)
const inputB = path.join(tmp, 'n32-208-text-binding-revision2-13/affected-review-inputs.json')
const b = read(inputB)
const inputC = path.join(tmp, 'n32-finite-grading-revision1-14/affected-review-inputs.json')
const c = read(inputC)
const editor = read(c.editorReport.path)
const cases = read(c.cases.path).cases
const answers = read(c.candidate.path).answers
const prior = read(c.priorIndependentReview.path)
const old208Review = read(b.originalReview.path)
const approved438 = read(b.textReviewManifest.path)
const receiptBinding = (binding) => {
  const receipt = read(binding.path)
  return {
    ...binding,
    cwd: receipt.cwd,
    argv: receipt.argv,
    exitCode: receipt.exitCode,
    signal: receipt.signal,
    recordedStatus: receipt.status ?? 'completed per exitCode and retained streams',
    inputs: receipt.inputs ?? [],
    outputs: receipt.outputs ?? [],
    streams: receipt.streams,
    producerReplayed: false,
  }
}
const historical = (directory, name, sha256, bytes) => ({
  path: path.join(tmp, directory, name),
  sha256,
  bytes,
  untouched: true,
})
const aHistory = 'n32-fig204206-author-first-10/fig-205'
const first = ownBinding('FIRST-205.md')
const inventory = ownBinding('inventory-205.json')
if (first.mode !== '0444' || inventory.mode !== '0444'
  || first.sha256 !== 'dc96bd7cce272c1b911c48946e05f7b5b5f8a88b1c91362a89ef3aa6a6cadb6a'
  || inventory.sha256 !== '8e8cc4945746365d033bc7d45c35fbefe094f9e95e3df274c81b8651bed50177') {
  throw new Error('Independent FIRST locks differ from their completed pre-post-FIRST locks')
}

// External hashes below were already checked by the completed read-only calls.
// This is packaging, not a second reception gate or producer invocation.
const manifest = {
  schema: 'same188-6/independent-affected-review-manifest@1',
  ticket: 'STEMROBIN-188',
  assignment: 'SAME188-6 OFFLINE finish=review',
  date: '2026-11-22',
  reviewer: 'SOLE fresh NONFORK INDEPENDENT reviewer',
  ownedRoot: root,
  cwd: repo,
  statuses: {
    A: 'PASS_FIRST_FULL_INDEPENDENT_SOURCE_MATH_CULTURE_CURRENT_NATIVE_MOBILE300_358_REVISION2',
    B: 'PASS_AFFECTED_TEXT_CONTEXT_SPEC_RENDER_BINDINGS_ONLY_REUSE_OLD208_AND_APPROVED438',
    C: 'PASS_AFFECTED_FINITE_AUTO_EXACT_PARTS_STRINGS_AND_EXISTING_EDITOR_RECEIPT_ONLY',
  },
  report: ownBinding('report.md'),
  ownOutputBindings: [first, inventory, ownBinding('build-manifest.mjs')],
  independentFirstLocks: {
    actualSourceOnlyInput: {
      path: path.join(inputA, 'source-only.json'),
      sha256: 'cb6c27d54b70b44657ddd43c60eaf63084383e0898d7b0f6c99d36a767400c82',
      hashToolChunk: '503a07',
      readToolChunk: '3252fa',
    },
    actualSourceImage: aSource.originalImage,
    sourceHashToolChunk: '965b54',
    imageTool: 'functions.view_image',
    chargedOrdinal: 1,
    first,
    inventory,
    lockCommandsSequentialAndCompletedBeforeAnyPostFirstInput: [
      { file: first.path, operation: 'chmod 0444', toolChunk: 'ae3df8', exitCode: 0 },
      { file: first.path, operation: "stat -f '%N mode=%OLp bytes=%z'", toolChunk: 'b309e2', exitCode: 0, actualMode: '0444', actualBytes: 3002 },
      { file: first.path, operation: 'shasum -a 256', toolChunk: '338884', exitCode: 0, actualSha256: first.sha256 },
      { file: inventory.path, operation: 'chmod 0444', toolChunk: 'e5e258', exitCode: 0 },
      { file: inventory.path, operation: "stat -f '%N mode=%OLp bytes=%z'", toolChunk: '3add3e', exitCode: 0, actualMode: '0444', actualBytes: 2234 },
      { file: inventory.path, operation: 'shasum -a 256', toolChunk: '5996bf', exitCode: 0, actualSha256: inventory.sha256 },
    ],
    postFirstInputFirstReadToolChunk: '05a4c8',
    noCandidateContextSkillContractOrOtherTaskInputBeforeLock: true,
    priorAuthorFirstNotSubstitutedForIndependentFirst: true,
  },
  A: {
    status: 'PASS',
    scope: 'First complete independent source/math/culture/current native and actual300/358 offline-media review',
    postFirstInput: {
      path: path.join(inputA, 'post-FIRST.json'),
      sha256: '69e2a016e77b9606ec3ffa6a84521812c48aacebe214c0d6030b1b1e16bfc616',
      hashToolChunk: 'edd06c',
    },
    currentOutputBindings: a.candidate,
    context: a.context,
    contextBindings: a.contextBindings,
    authorReport: a.authorReport,
    authorManifest: a.authorManifest,
    existingReception: a.reception,
    existingReceipts: aAuthor.execution.receipts.map(receiptBinding),
    bindingCheck: { toolChunk: '7e11b2', checkedBindings: 27, errors: [] },
    receiptStreamCheck: { toolChunk: '37e3ad', errors: [], replay: false },
    independentExactLeafDiff: [
      { pointer: '/objects/5/labelPlacement/offset/1', before: 48, after: 72, owner: 's205-B' },
    ],
    allOtherSpecLeavesUnchanged: true,
    authoritativeTextSpecContextAndTemplateExact: true,
    sourceInventoryCoverage: {
      strokes: ['s205-a', 's205-b', 's205-c', 's205-p'],
      points: ['s205-foot', 's205-B'],
      labels: ['a', 'b', 'c', 'p', 'B'],
      squareSegments: ['s205-right-a-c-1', 's205-right-a-c-2', 's205-right-p-c-1', 's205-right-p-c-2'],
      sourceRasterConcurrencyUncertaintyPreserved: true,
      closedPolygonInferred: false,
      modernFootAnchorInsideExistingInk: true,
    },
    independentVerdicts: { source: 'PASS', math: 'PASS', culture: 'PASS', native: 'PASS', actual300: 'PASS', actual358: 'PASS' },
    reusedMeasuredTextPx: { media300: 16.875, media358: 20.1375, native640: 36 },
    oldFailureEvidence: [
      historical(aHistory, 'firstfailure.json', '14b8555b42a4464c86d4232847831387ddf1c591a14059ce86fffc623a5f2ad7', 3573),
      historical(aHistory, 'render.call.json', '146522a88f409d0dab9b90c4af5a5d1b7635e482742f46041b4a0c6426c35108', 3123),
      historical(aHistory, 'fig-205.render.json', 'b6b52632ca515d04096cb6c47264834d91269878482f54ed484c3745cb15690d', 1379),
      ...a.priorFailedSpecAndEvidence,
      historical(aHistory, 'render.r1.call.json', 'd0978ebbf3e6e878dac62fbf5c82f3c21c19820010e1ee4bf38a2d9ccd58001e', 3156),
    ],
    oldAuthorFirst: a.priorFailedSpecAndEvidence.filter((x) => /FIRST/.test(x.path)),
    repairAuthorFirst: [aAuthor.sourceFirst.inventory, aAuthor.sourceFirst.freeze],
    bothOriginalCollisionFailsPreserved: { count: 2, statuses: ['fail', 'fail'], exitCodes: [2, 2], id: 's205-B-label', score: 10000 },
    revisions: { previous: 1, candidate: 2, newThisReview: 0, reset: false },
    answerKeysReadForFigure: false,
    rendererValidatorWidthOrCaptureReplay: false,
    promotionOrReviewAt1: false,
  },
  B: {
    status: 'PASS_AFFECTED_BINDING_ONLY',
    images: 0,
    input: {
      path: inputB,
      sha256: '494cd645d2bab00f8eaffc75c8bf59376c5a4ecbf35596155c2f7704970a7738',
      hashToolChunk: '0e674d',
    },
    namedBindings: Object.fromEntries(Object.entries(b).filter(([, value]) => value?.path && value.sha256)),
    sourceInventoryGeometryLabelsAssertionsDisplayLeavesUnchanged: true,
    exactSpecChangedLeaves: ['/source/authoritativeText/0/text'],
    exactContextChangedLeaves: ['/authoritativeText/0/text', '/textPaths/1/path', '/textPaths/1/sha256'],
    svgByteEquality: { equal: true, sha256: b.newSVG.sha256 },
    contextSpecAndApprovedTemplateExactlyEqual: true,
    bindingAndExactDiffCheck: { toolChunk: '5a1cb1', errors: [] },
    templateMatchCheck: { toolChunk: '7b28aa', exactMatches: 1 },
    old208IndependentPassReused: {
      review: b.originalReview,
      oldReviewSourceBinding: old208Review.source,
      oldReviewSpecBinding: old208Review.spec,
      oldReviewRenderBinding: old208Review.render,
      oldReviewOutputBindings: old208Review.outputs,
      substantiveIndependentReport: prior.finalReport,
      reportSection: 'Figure208 independent verdicts only',
      source: 'PASS_REUSED',
      math: 'PASS_REUSED',
      culture: 'PASS_REUSED',
      native640: 'PASS_REUSED',
      actualMobile300: 'PASS_REUSED',
      sourcePixelsReopened: false,
    },
    approved438PresentationPassReused: {
      manifest: b.textReviewManifest,
      report: approved438.report,
      scope: 'scopeC presentation-only numeric prefixes and exact footnote paragraph',
      status: approved438.scopeC.disposition,
      answerKeyReview: false,
    },
    existingChangedSpecReceipts: [b.validateReceipt, b.renderReceipt].map(receiptBinding),
    receiptStreamCheck: { toolChunk: '37e3ad', errors: [], replay: false },
    historicalFailuresRecoveryAndOldReviewPreserved: true,
    historicalEvidenceReference: prior.finalReport,
    historicalEvidenceSection: 'Image ledger, revisions and no-active-session facts',
    oldReviewAt1Unmodified: true,
    revisions: { previous: 1, candidate: 2, textBindingChanges: 1, newGeometry: 0, newThisReview: 0 },
    sourceNativeWidthOrCaptureReplay: false,
    promotionOrNewReviewAt1: false,
  },
  C: {
    status: 'PASS_AFFECTED_FINITE_AUTO_EXACT_ONLY',
    beganAfterABFigureVerdictsRecorded: true,
    images: 0,
    input: {
      path: inputC,
      sha256: '98bd82030b967473e590a83ded30da97c2eab9c2e3fb67734cee98c3629e6b6b',
      actualHashComputedOnce: true,
      hashToolChunk: 'f3062d',
    },
    namedBindings: Object.fromEntries(Object.entries(c).filter(([, value]) => value?.path && value.sha256)),
    candidateActualSha256: 'ae50cd849ccfc06dfb40d9c38b98dffb91dd1986597bea217c9547e91ee7ddd1',
    priorIndependentMathSourcePassReused: {
      manifest: c.priorIndependentReview,
      report: prior.finalReport,
      perExercise: prior.perExercise.filter((item) => ['433', '434', '435', '436'].includes(item.exercise)),
      inclusiveParallelismQualificationRetained: true,
      earlierDefinitionIndependentlyRead: false,
      unchangedProofsResolvedAgain: false,
    },
    approvedDisplayAnswerSnapshot: {
      path: path.join(tmp, 'n32-nineanswer-draft-and-review-inputs-11/answer-keys.json'),
      sha256: '2e9f43b12a3aac9d0b9c7dd439e1988fb93ef432727baf8e38ce8f50e8e50f07',
      fourDisplayAnswerUtf8BytesEqual: true,
    },
    exactCandidateChanges: {
      gradingLeaves: ['/answers/1/grading', '/answers/2/grading', '/answers/3/grading', '/answers/4/grading'],
      before: 'ungraded',
      after: 'auto',
      addedPartIndexes: { '/answers/1/parts': [0], '/answers/2/parts': [0, 1, 2, 3, 4], '/answers/3/parts': [0, 1, 2], '/answers/4/parts': [0] },
      otherChangedFields: [],
      checkToolChunk: '3de747',
    },
    finitePartBindings: answers.filter((item) => ['433', '434', '435', '436'].includes(item.exercise)).map((answer) => ({
      exercise: answer.exercise,
      grading: answer.grading,
      displayAnswerSha256: digest(Buffer.from(answer.displayAnswer, 'utf8')),
      unchangedExplanation: true,
      parts: answer.parts.map((part) => ({
        ...part,
        reject: cases.find((item) => item.name === `${answer.exercise}/${part.label}/${part.expected[0]}`).reject,
      })),
    })),
    tenPartLabelsExact: true,
    partBoundAcceptedStringCount: 23,
    globallyDistinctAcceptedStringCount: 11,
    oppositeRejectionObservationCount: 23,
    casesNamesInputsExpectedRejectsExactlyMapCurrentParts: true,
    bindingCheck: { toolChunk: '3de747', errors: [] },
    approvedBytesCaseAndEditorFactsCheck: { toolChunk: '28dd6b', errors: [] },
    otherFiveAnswerObjectsUnchanged: ['432', '437', '438', '439', '440'],
    displayAnswersDerivationsAndAllOtherLeavesUnchanged: true,
    editorReceipt: receiptBinding(c.editorReceipt),
    editorReport: c.editorReport,
    actualEditorFacts: {
      status: editor.status,
      positiveCases: editor.caseCount,
      positiveAccepted: editor.results.filter((item) => item.accepted).length,
      negativesRejected: editor.results.flatMap((item) => item.rejected).filter((item) => item.rejected).length,
      terminalFailures: editor.failures,
      positiveAndNegativeInputEventsObserved: true,
      keyboardInsertedExpandedSuffix: '+1',
      keyboardDeletion: 'two Backspace presses; preservation requires restoration of expanded LaTeX',
      allAcceptedAndRejectedEmittedStringsPreserved: true,
      reportBytesEqualActualStdout: true,
      retryCases: editor.results.filter((item) => item.attempts > 1).map((item) => ({ name: item.name, attempts: item.attempts })),
      allOtherPositiveAndNegativeAttempts: 1,
      seededViaElementValueBeforeKeyboardEdits: true,
      wholeChineseAnswerTypedViaIMEEstablished: false,
      liveProductAcceptanceEstablished: false,
      existingCheckerNotRun: true,
      checkerMeaningReadOnlySource: absolute('.claude/skills/ld-s10y-answer/tools/check_mathlive_exact.mjs'),
      checkerMeaningReadOnlyRanges: ['60-140', '192-225'],
    },
    gradingOnlyRevisions: { '433': 1, '434': 1, '435': 1, '436': 1 },
    preservedProofRevisions: { '437': 1, '438': 1, '440': 2 },
    newRevisionsThisReview: 0,
    originalFirstFailuresUnknownAndPriorReviewsPreserved: true,
    editorOrFinalizerReplay: false,
    fullGate2OrFullNineApproval: false,
  },
  imageLedger: {
    batchLimit: 8,
    contextLimit: 24,
    chargedAttempts: 4,
    successfulLoads: 4,
    contextImages: 4,
    failedOpens: 0,
    reopens: 0,
    crops: 0,
    attempts: [
      { ordinal: 1, kind: 'actual-source205-before-FIRST', binding: aSource.originalImage, success: true },
      { ordinal: 2, kind: 'current-native205-after-FIRST', binding: a.candidate.nativePng, success: true },
      { ordinal: 3, kind: 'actual-media300-after-FIRST', binding: a.candidate.mobile300, success: true },
      { ordinal: 4, kind: 'actual-media358-after-FIRST', binding: a.candidate.mobile358, success: true },
    ],
    scopeA: 4,
    scopeB: 0,
    scopeC: 0,
    parentPermanent: '24/24',
    imagePayloadsReturnedToParent: 0,
    captureOrRerenderCount: 0,
  },
  guidanceRead: {
    localImageSkill: absolute('.agents/skills/ld-s10y-image/SKILL.md'),
    productionResumeContract: absolute('.claude/skills/ld-s10y-lesson/references/production-resume.md'),
    qualityGate: absolute('.agents/skills/ld-s10y-image/references/quality-gate.md'),
    allAfterIndependentFirstLocks: true,
    specificHumanOfflineReviewLimitsOverrideUsualPromotionDefault: true,
  },
  restrictionLedger: {
    writesOutsideOwnedRoot: 0,
    reverts: 0,
    networkDocsApiDbEnvPaidCalls: 0,
    setupFreshnessGrillDependencyAppCharterGitWholeProjectChecks: 0,
    producerReruns: 0,
    repairs: 0,
    promotions: 0,
    newReviewAt1: 0,
    editorFinalizerReplay: 0,
    delegatedChatsOrSubagents: 0,
    unchangedProofSolving: 0,
    imagesAfterAnswerKeyAccess: 0,
    figureReviewUsingAnswerKeys: 0,
  },
  exclusions: ['whole-lesson', 'full Gate2', 'native-nine', 'other-figure clearance', 'live-product acceptance', 'promotion', 'review@1'],
  historicalPackagesDuplicated: false,
  activeExecSessions: [],
  unresolvedExecSessions: 0,
  manifestSelfHash: 'returned externally; no recursive self-hash',
}
fs.writeFileSync(path.join(root, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`)
console.log(JSON.stringify({
  status: 'MANIFEST_PACKAGED',
  statuses: manifest.statuses,
  report: manifest.report,
  manifest: ownBinding('manifest.json'),
  activeExecSessions: [],
}))
