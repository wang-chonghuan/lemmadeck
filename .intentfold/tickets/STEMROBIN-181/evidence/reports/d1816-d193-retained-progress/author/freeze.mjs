import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'

const cwd = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck'
assert.equal(process.cwd(), cwd)
const lane = path.join(cwd, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d193-n20-figures30-31-author')
const media = path.join(cwd, '.tmp/STEMROBIN-181/d1816-d193/figures')
const read = (file) => JSON.parse(fs.readFileSync(file))
const receipt = (file) => {
  const absolute = path.resolve(cwd, file)
  const bytes = fs.readFileSync(absolute)
  return { path: absolute, bytes: bytes.length, sha256: crypto.createHash('sha256').update(bytes).digest('hex') }
}
const write = (file, value) => {
  assert.ok(file.startsWith(`${lane}/`))
  assert.ok(!fs.existsSync(file), `Refusing to replace frozen evidence ${file}`)
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`)
}
const inputBindings = read(path.join(lane, 'input-bindings.json'))
const immutableInputs = [inputBindings.inputFreeze, ...inputBindings.files]
for (const expected of immutableInputs) assert.deepEqual(receipt(expected.path), expected, `Immutable input changed: ${expected.path}`)
const visual = read(path.join(lane, 'author-visual-observations.json'))
assert.equal(visual.actualImageOpensTotal, 5)
assert.ok(visual.actualImageOpensTotal <= 8 && visual.contextImageOpensTotal <= 24)
const records = []
const candidateFiles = []
const candidateNames = [
  'spec.json', 'text-binding.json', 'render-command.json', 'preview-command.json',
  'geometry-observations.json', 'geometry-current.json'
]
for (const id of ['fig-30', 'fig-31']) {
  const attempt = path.join(media, id, 'attempt-1')
  const paths = [
    ...candidateNames.map((name) => path.join(attempt, name)),
    ...[`${id}.svg`, `${id}.render.json`, `${id}.preview.png`, `${id}.media640.png`].map((name) => path.join(attempt, name)),
    ...(id === 'fig-31' ? [path.join(attempt, 'drawing-model.json')] : [])
  ]
  candidateFiles.push(...paths)
  const render = read(path.join(attempt, `${id}.render.json`))
  const geometry = read(path.join(attempt, 'geometry-current.json'))
  const nativeCommand = read(path.join(attempt, 'render-command.json'))
  const context = read(path.join(lane, `${id}.input-context.json`))
  const spec = read(path.join(attempt, 'spec.json'))
  const binding = read(path.join(attempt, 'text-binding.json'))
  const ready = render.status === 'pass' && geometry.status === 'pass'
    && geometry.candidateUnchangedSinceFirstChecker && nativeCommand.exitCode === 0
    && visual.figures[id].contentRevisionNeeded === false
  assert.equal(render.spec.sha256, receipt(path.join(attempt, 'spec.json')).sha256)
  assert.equal(render.output.svg.sha256, receipt(path.join(attempt, `${id}.svg`)).sha256)
  assert.deepEqual(geometry.candidateSpec, receipt(path.join(attempt, 'spec.json')))
  assert.deepEqual(geometry.candidateSvg, receipt(path.join(attempt, `${id}.svg`)))
  assert.deepEqual(spec.source.authoritativeText.map((entry) => entry.text), Object.values(context.languages).map((value) => value.fullText))
  records.push({
    figure: id,
    status: ready ? 'authorready' : 'HOLD',
    holdReasons: ready ? [] : ['Candidate has an unresolved author-stage render, geometry, or visible-content failure.'],
    role: 'first bounded author',
    mode: spec.mode,
    scope: '10p / phy10-c1-s3-n20 / D193; author evidence only',
    sourceInventory: receipt(path.join(lane, `${id}.source-inventory.json`)),
    fullInputContext: receipt(path.join(lane, `${id}.input-context.json`)),
    sourceImage: receipt(context.durableSourceImage.path),
    sourceCarrierImage: receipt(context.sourceImage.path),
    frozenLanguageTexts: binding.frozenTexts.map(({ language, carrier, fullTextUtf8Bytes, fullTextSha256 }) => ({
      language, carrier, fullTextUtf8Bytes, fullTextSha256,
      completeTextContainedIn: receipt(path.join(attempt, 'text-binding.json'))
    })),
    frozenQuestionInputs: binding.questions.map((entry) => entry.input),
    nativeContextReceipts: Object.values(context.nativeContexts).map((entry) => receipt(entry.path)),
    inheritedD189TextReviewReceipt: receipt(context.independentTextReview.path),
    candidate: {
      spec: receipt(path.join(attempt, 'spec.json')),
      svg: receipt(path.join(attempt, `${id}.svg`)),
      nativeRenderReport: receipt(path.join(attempt, `${id}.render.json`)),
      nativePreview: receipt(path.join(attempt, `${id}.preview.png`)),
      media640Preview: receipt(path.join(attempt, `${id}.media640.png`)),
      textBinding: receipt(path.join(attempt, 'text-binding.json')),
      firstGeometryEvidence: receipt(path.join(attempt, 'geometry-observations.json')),
      currentGeometryEvidence: receipt(path.join(attempt, 'geometry-current.json')),
      nativeRenderCommand: receipt(path.join(attempt, 'render-command.json')),
      previewCommand: receipt(path.join(attempt, 'preview-command.json')),
      ...(id === 'fig-31' ? { drawingModel: receipt(path.join(attempt, 'drawing-model.json')) } : {})
    },
    renderStatus: render.status,
    geometryStatus: geometry.status,
    authorVisualObservations: receipt(path.join(lane, 'author-visual-observations.json')),
    display: {
      ...spec.display,
      nativeMeasuredTextPx: render.displayChecks,
      sourceCanvasWidthPx: spec.canvas.width,
      productAcceptance: false,
      productSurfaceScrollVerification: 'Not performed or claimed; only candidate media640 readability was authorized.'
    },
    attempts: {
      authoredCandidates: 1,
      nativeRenderProducerCalls: 1,
      nativeDraftValidationCalls: 1,
      fullGeometryCheckerCalls: 1,
      firstGeometryCheckerExitCode: 1,
      firstGeometryFailure: 'Palette checker falsely included invisible JSXGraph construction nodes and inherited context-stroke markers.',
      affectedFailedPaletteAssertionRecoveryCalls: 1,
      affectedRecoveryExitCode: 0,
      reusedPassedFirstGeometryChecks: geometry.reusedPassedFirstChecks,
      previouslyUnexecutedSourceLandmarkChecks: geometry.newNonreplayedSourceLandmarkChecks,
      nativeContextPreparationInherited: 2,
      nativeContextPreparationThisAuthor: 0,
      producerReplays: 0,
      nativeValidationReplays: 0,
      fullGeometryCheckerReplays: 0,
      rasterMediaResamplingCalls: 1,
      inheritedContentRepairs: 0,
      actualFigureContentRepairs: 0,
      totalFigureContentRepairs: 0,
      maximumTotalFigureContentRepairs: 1,
      remainingContentRepairAllowance: 1,
      changedCandidateSnapshots: 0,
      actualImageOpens: visual.figures[id].actualImageOpens,
      paidCalls: 0,
      generationCalls: 0
    },
    evidenceDisposition: 'Original attempt-1 spec/SVG/render/preview/failed geometry evidence preserved and made read-only. Current geometry aggregation reuses all passed checks and references the first failed assertion evidence; candidate bytes never changed.',
    independentReviewPerformed: false,
    independentFigureApproval: false,
    promoted: false
  })
}
const authoredLaneNames = [
  'fig-30.source-inventory.json', 'fig-31.source-inventory.json',
  'first-discovery-failure.json', 'context-read-failure.json',
  'author.mjs', 'geometry-check.py', 'input-bindings.json',
  'geometry-first-command-receipts.json', 'author-visual-observations.json',
  'palette-recovery.py', 'palette-recovery-command-receipts.json',
  'author-command-receipt.json', 'freeze.mjs'
]
const authoredLaneFiles = authoredLaneNames.map((name) => path.join(lane, name))
const nativeInputContextFiles = records.flatMap((record) => record.nativeContextReceipts)
const report = {
  schema: 'd193/first-bounded-figure-author-report@1',
  ticket: 'STEMROBIN-181',
  batch: 'D193',
  book: '10p',
  lesson: 'phy10-c1-s3-n20',
  cwd,
  date: '2026-11-20',
  invocation: { continuation: 'SAME offline production invocation', finish: 'review', grill: 'self already satisfied; not repeated', freshnessSetupRepeated: false },
  status: records.every((record) => record.status === 'authorready') ? 'authorready' : 'HOLD',
  statusMeaning: 'Author-ready candidate evidence only. This does not certify independent review, promotion, product acceptance, or completion of lesson/course production.',
  figures: records,
  inputBindings: receipt(path.join(lane, 'input-bindings.json')),
  inputFreeze: receipt(path.join(lane, 'input-freeze.json')),
  currentImmutableInputsMatchSuppliedFreeze: true,
  nativePreparation: { inheritedCalls: 4, thisAuthorCalls: 0, replays: 0, receipts: nativeInputContextFiles, inheritedStatus: 'PASS supplied by human and hash-bound; no preparation replay' },
  inheritedTextStatus: 'SCI/ZH/EN and all four original questions independently PASS D189, supplied authority; no review replay.',
  imageUsage: {
    actualImageOpens: 5, contextImageOpens: 5, parentImageOpens: 0,
    originalOpens: 2, previewOpens: 3, reopens: 0, crops: 0,
    maximumBatchOpens: 8, maximumContextOpens: 24,
    ledger: receipt(path.join(lane, 'author-visual-observations.json'))
  },
  totalAttempts: {
    nativeRenderCalls: 2, nativeDraftValidationCalls: 2,
    fullGeometryCheckerCalls: 2, firstGeometryCheckerFailures: 2,
    affectedFailedPaletteAssertionRecoveryCalls: 2,
    previouslyUnexecutedSourceLandmarkChecks: 1,
    contentRepairsInherited: 0, contentRepairsThisAuthor: 0,
    readDiscoveryCommandFailures: 2,
    readPathCorrections: 1, missingOutputDirectoryResolvedByAllowedFileCreation: 1,
    technicalCwdPermissionOutputParserRecoveries: 0,
    nativeContextPreparationReplays: 0, producerReplays: 0,
    fullPassedCheckerReplays: 0, paidCalls: 0, modelGenerationCalls: 0
  },
  preservedFailureEvidence: [
    receipt(path.join(lane, 'first-discovery-failure.json')),
    receipt(path.join(lane, 'context-read-failure.json')),
    receipt(path.join(lane, 'geometry-first-command-receipts.json')),
    ...records.map((record) => record.candidate.firstGeometryEvidence)
  ],
  recoveryEvidence: receipt(path.join(lane, 'palette-recovery-command-receipts.json')),
  scripts: ['author.mjs', 'geometry-check.py', 'palette-recovery.py', 'freeze.mjs'].map((name) => receipt(path.join(lane, name))),
  boundaries: {
    writeRoots: [lane, media],
    carrierWorkRootSourceTemplatesEdited: false,
    nativeLessonFinalizeCalls: 0, nativeLessonRenderCalls: 0,
    sourceReviewReplays: 0, answerKeyReadsOrWrites: 0,
    choiceOutputs: 0, databaseCalls: 0, publisherCalls: 0,
    environmentFileAccess: 0, gitCalls: 0, mainSyncs: 0,
    paidCalls: 0, apiCalls: 0, networkCalls: 0,
    interactiveBrowserOrBrowserToolCalls: 0,
    nativeRendererInternalHeadlessEngineLaunches: 2,
    nativeRendererEngineQualification: 'Only the explicitly requested local JSXGraph render_spec engine; no URL/browser interaction or external content fetch.',
    supervisorOrPeerMessages: 0, formalHandoffs: 0,
    independentFigureReviewsRecorded: 0, canonicalPromotions: 0,
    completeCoursesAdded: 0, courseCompleteClaim: false,
    figureApproval: false, productAcceptance: false
  },
  retainedForNextAuthorizedPhase: 'Separate independent figure review and downstream authorized lesson validation remain outstanding; neither was performed by D193.'
}
const reportFile = path.join(lane, 'report.json')
write(reportFile, report)
const frozenOutputFiles = [...authoredLaneFiles, ...candidateFiles, reportFile]
for (const file of frozenOutputFiles) fs.chmodSync(file, 0o444)
const outputs = frozenOutputFiles.map((file) => ({
  ...receipt(file),
  immutable: true,
  permissionMode: (fs.statSync(file).mode & 0o777).toString(8)
}))
const freezeFile = path.join(lane, 'author-freeze.json')
write(freezeFile, {
  schema: 'd193/author-freeze@1',
  ticket: 'STEMROBIN-181', batch: 'D193', role: 'first bounded author',
  cwd, status: report.status,
  sourceAndTextInputs: immutableInputs,
  sourceAndTextInputPermissionChanges: false,
  report: receipt(reportFile),
  exactCurrentOutputs: outputs,
  immutableCopiesPolicy: 'Attempt-1 candidate files and first failure evidence are themselves immutable read-only snapshots. No changed candidate exists, so no duplicate candidate copy is needed. Existing frozen context/source/text/native receipt paths are retained by exact bytes/SHA256 without copying a whole evidence package or changing their permissions.',
  outputTreeDependencies: { sourceInventories: records.map((record) => record.sourceInventory), candidates: records.map((record) => record.candidate) },
  imageUsage: report.imageUsage,
  counters: report.totalAttempts,
  independentReview: false, promotion: false, productAcceptance: false,
  selfHashPolicy: 'Self SHA256 is returned externally, not embedded recursively in this JSON.'
})
fs.chmodSync(freezeFile, 0o444)
console.log(JSON.stringify({ report: receipt(reportFile), authorFreeze: receipt(freezeFile) }, null, 2))
