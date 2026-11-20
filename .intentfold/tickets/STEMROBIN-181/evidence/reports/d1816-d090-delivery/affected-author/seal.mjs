import fs from 'node:fs'
import path from 'node:path'
import assert from 'node:assert/strict'
import {
  repo, output, evidence, editions, changedBlocks, load, dump, write, bind,
  template, currentFigure,
} from './common.mjs'

assert.ok(!fs.existsSync(`${evidence}/author-freeze.json`))
const before = load(`${evidence}/before-bindings.json`)
const whitelist = load(`${evidence}/exact-diff-whitelist.json`)
const validation = load(`${evidence}/native-text-validation-affected-only.json`)
assert.equal(whitelist.status, 'pass')
assert.equal(validation.status, 'pass')
assert.deepEqual(validation.errors, [])
const unchanged = [
  ...before.freezes,
  ...before.copies.flatMap((row) => [row.source, row.before]),
  ...before.immutableUnchangedSVGs,
  before.savedAuthority.readme, before.savedAuthority.comments,
]
const report = load(before.freezes[2].path)
const base = load(before.freezes[0].path)
for (const record of report.reusedSourceApprovals) {
  unchanged.push(record)
}
for (const record of unchanged) {
  assert.equal(bind(record.path).sha256, record.sha256, record.path)
}
for (const record of whitelist.records) {
  assert.equal(bind(record.before.path).sha256, record.before.sha256)
  assert.equal(bind(record.after.path).sha256, record.after.sha256)
  assert.equal(record.outsideWhitelist.length, 0)
}
const recoveryNames = [
  ['native-source-math-text',
    'The selected historical final prose-flow receipt preceded section-anchor binding.'],
  ['native-source-math-text-receipt-recovery',
    'Historical bound prose-flow receipts still preceded final D079 text token/layout corrections.'],
  ['native-source-math-text-hash-bound-baseline',
    'Extra whole-lesson identity diagnostic found unchanged D079 raw/template title differences; ' +
      'all changed text/native source/math tests passed. Diagnostic is preserved, not repaired or approved.'],
]
dump(`${evidence}/native-recovery.json`, {
  batch: 'D092', role: 'AFFECTED_AUTHOR_ONLY',
  failures: recoveryNames.map(([name, cause]) => ({
    receipt: bind(`${evidence}/native/${name}/receipt.json`), cause,
    candidateRevisionCausedByFailure: false,
  })),
  failedValidationReport: bind(`${evidence}/native-text-validation.json`),
  firstCheckerSnapshot: bind(`${output}/before/runtime/validate-text-pre-receipt-recovery.py`),
  correction: 'Use the D089 hash-bound final-template paragraph/boundary baseline, ' +
    'and compare unchanged identity diagnostics separately from the affected-only text verdict.',
  finalReceipt: bind(`${evidence}/native/native-source-math-text-affected-only/receipt.json`),
  finalReport: bind(`${evidence}/native-text-validation-affected-only.json`),
  finalAffectedTextStatus: 'pass', originalReceiptsOverwritten: false,
  nativeTextAttempts: 4, technicalBaselineReceiptCorrections: 2,
  outOfScopeDiagnosticDispositionCorrections: 1, contentRevisions: 1,
  unchangedOutOfScopeIdentityDiagnostics: validation.locales.map((row) => ({
    edition: row.edition, errors: row.unchangedOutOfScopeIdentityDiagnostics,
  })),
})

const unchangedProse = Array.from({ length: 22 }, (_, i) => i)
  .filter((index) => !changedBlocks.includes(index))
const reuse = {
  schema: 'STEMROBIN-181/affected-author-stage-reuse@1', batch: 'D092',
  authority: before.freezes[2], immutableReviewFreeze: before.freezes[3],
  source: {
    status: 'PASS_REUSE', reviewedAgain: false,
    approvals: report.reusedSourceApprovals,
  },
  science: {
    sourceAndMathTokenFidelity: 'PASS_REUSE',
    formulaAlgebraAndSignsInStatedSetup: 'PASS_REUSE',
    changedTeachingExplanation: 'AUTHOR_REPAIRED_INDEPENDENT_AFFECTED_REVIEW_PENDING',
  },
  zh: { translationWordingStructureCulture: 'PASS_REUSE_UNAFFECTED',
    unchangedProseBlocks: unchangedProse, changedBlocks: changedBlocks,
    wholeLocaleApproval: false },
  en: { translationWordingStructureCulture: 'PASS_REUSE_UNAFFECTED',
    unchangedProseBlocks: unchangedProse, changedBlocks: changedBlocks,
    wholeLocaleApproval: false },
  figures: ['fig-290', 'fig-291'].map((id) => ({
    id, status: 'PASS_REUSE_GRAPHIC_ONLY',
    scope: report.verdicts[id].scope,
    imageOpened: false, geometryReviewedAgain: false,
    changedAuthoritativeTextApproval: 'PENDING_INDEPENDENT_AFFECTED_ONLY_REVIEW',
    nativeReviewRecordCreated: false, wholeLessonApproval: false,
  })),
}
dump(`${evidence}/stage-reuse.json`, reuse)

const current = {
  schema: 'STEMROBIN-181/affected-author-current-bindings@1',
  batch: 'D092', book: '9p', lesson: 'phy9-c2-s6-n128',
  selection: 'D092 text/context copies; D086 unchanged fig290 SVG; D079 unchanged fig291 SVG. ' +
    'The failed D079 fig290 graphic remains immutable history, not the current output.',
  templates: editions.map((edition) => {
    const original = base.templates.find((row) => row.edition === edition)
    const checked = validation.locales.find((row) => row.edition === edition)
    return {
      edition, lesson: bind(template(edition)),
      changedPointers: changedBlocks.map((index) => `/prose/${index}/text`),
      unchangedExercisesTemplate: bind(original.exercises.path),
      unchangedFigureManifestTemplate: bind(original.figures.path),
      nativeTextStatus: 'pass', sourceProseBlocks: 22,
      finalParagraphs: checked.finalParagraphs,
      separateFormulaParagraphs: checked.separateFormulaParagraphs,
      sectionBreaks: checked.sectionBreakIndices,
      formulaTokens: checked.mathTokens, exercises: 0,
    }
  }),
  figures: ['fig-290', 'fig-291'].map((id) => ({
    id, spec: bind(`${output}/modern/${id}.spec.json`),
    render: bind(`${output}/modern/${id}.render.json`),
    unchangedSVG: bind(`${currentFigure(id)}.svg`),
    sourceImage: load(`${output}/modern/${id}.spec.json`).source.image,
    changedPointers: ['/source/authoritativeText/0/text', '/source/authoritativeText/1/text'],
    renderMetadataChangedPointers: ['/spec/path', '/spec/sha256'],
    graphicReview: 'D089_PASS_REUSE_GRAPHIC_ONLY',
    contextOnlyRelocation: true, newRender: false, newApproval: false,
    independentAffectedContextReviewPending: true,
  })),
  unchangedSourceLesson: validation.sourceLesson,
  reusedStageBindings: bind(`${evidence}/stage-reuse.json`),
}
dump(`${evidence}/current-bindings.json`, current)

const count = {
  contentRepairRounds: 1, affectedLessonTemplates: 2, affectedFigureSpecs: 2,
  lessonTextFieldsChanged: 8, figureContextTextFieldsChanged: 4,
  renderMetadataFieldsChanged: 4, whitelistViolations: 0,
  nativeProseFlowCalls: 2, nativeTextCheckAttempts: 4,
  nativeTextTechnicalBaselineRecoveryCalls: 2,
  nativeOutOfScopeDiagnosticDispositionRecoveryCalls: 1,
  finalNativeChangedTextBlocksChecked: 8,
  finalNativeSourceMathIntegrityBlocks: 44, finalExactMathTokens: 90,
  paragraphsEach: 29, standaloneFormulaParagraphsEach: 8, sectionBreaksEach: 3,
  primaryPublicPageReads: 3, primaryReadHTTP200: 3,
  publicURLSearchBatches: 1,
  nativeRenders: 0, nativeImagePreviews: 0, nativeGeometryReviews: 0,
  imageOpens: 0, imageReopens: 0, imageCrops: 0,
  nativeRecordReviewCalls: 0, adaptFinalizeCalls: 0, promotions: 0,
  freshnessCalls: 0, backendCalls: 0, externalModelCalls: 0, paidCalls: 0,
  purchases: 0, dependencyChanges: 0, skillChanges: 0,
  canonicalSourceOrRawWrites: 0, canonicalProductWrites: 0,
  meterOrIndexWrites: 0, sourcePagesAdded: 0, coursesAdded: 0,
  databaseConnections: 0, databaseWrites: 0, EActions: 0, deploys: 0,
  commits: 0, pushes: 0, otherChatMessages: 0, countersReset: false,
}
dump(`${evidence}/counts.json`, count)

const files = (root) => fs.readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
  const filename = path.join(root, entry.name)
  assert.ok(!entry.isSymbolicLink(), `Unexpected symlink in owned directory: ${filename}`)
  return entry.isDirectory() ? files(filename) : [filename]
})
const ownedFiles = [...files(output), ...files(evidence)].sort()
const freeze = {
  schema: 'STEMROBIN-181/affected-author-freeze@1',
  ticket: 'STEMROBIN-181', batch: 'D092', role: 'AFFECTED_AUTHOR_ONLY',
  book: '9p', lesson: 'phy9-c2-s6-n128', workdir: repo,
  ownedRoots: [output, evidence], finish: 'review', grillMode: 'self',
  status: 'author-frozen-native-affected-text-pass-independent-affected-review-pending',
  frozenAt: new Date().toISOString(),
  authority: {
    savedCommentId: '830251c5-4c6f-48af-9bae-6e3a22118c80',
    ongoingProductionInvocation: true, freshnessCalls: 0, backendCalls: 0,
    savedBindings: before.savedAuthority,
  },
  immutableInputs: before.freezes,
  beforeBindings: bind(`${evidence}/before-bindings.json`),
  currentBindings: bind(`${evidence}/current-bindings.json`),
  templates: current.templates, figures: current.figures,
  exactChangedPointers: whitelist.records.map((row) => ({
    file: row.after.path, pointers: row.actualChanges.map((change) => change.pointer),
  })),
  exactDiffWhitelist: bind(`${evidence}/exact-diff-whitelist.json`),
  nativeTextOutcome: {
    status: validation.status, scope: validation.verdictScope,
    report: bind(`${evidence}/native-text-validation-affected-only.json`),
    receipt: bind(`${evidence}/native/native-source-math-text-affected-only/receipt.json`),
    errors: [], originalTitleDiagnosticsPreservedOutOfScope: true,
  },
  renderDisclosure: {
    statement: 'Context-only metadata relocation, not new render or approval. ' +
      'Both native reports only rebind spec.path and spec.sha256; their SVG, status, ' +
      'geometry, labels, relationships and measurements are unchanged. ' +
      'The original reports and D089 graphic PASS remain historical authorities.',
    evidence: bind(`${evidence}/context-only-render-rebinding.json`),
  },
  sourceAndUnchangedLocaleStages: bind(`${evidence}/stage-reuse.json`),
  primaryPhysicsContext: bind(`${evidence}/primary-physics-readings.json`),
  failures: bind(`${evidence}/failures.json`),
  nativeRecovery: bind(`${evidence}/native-recovery.json`),
  counts: count, countsReceipt: bind(`${evidence}/counts.json`),
  preservation: {
    immutableInputBindingsChecked: unchanged.length,
    originalFreezesAndBeforeFilesAndSVGsUnchanged: true,
    nativeFailuresPreservedOnce: true, geometryOrLabelsOrRelationshipsChanged: false,
    allWritesWithinOwnedRoots: true, untouchedExistingUserEdits: true,
  },
  approval: {
    authorIsNotReviewer: true, independentAffectedOnlyReviewPending: true,
    requiredReviewScope: 'Both locales prose/8,9,10,12 explanations and both figures ' +
      'source.authoritativeText exact bilingual binding; reuse D089 SOURCE, math fidelity/algebra, ' +
      'unaffected ZH/EN and graphic-only PASS. No repeated geometry/visual review.',
    wholeN128Approval: false, newFigureApproval: false,
    nativeRecordReview: false, adaptFinalize: false, promotion: false,
  },
  files: ownedFiles.map(bind),
}
dump(`${evidence}/author-freeze.json`, freeze)
const result = bind(`${evidence}/author-freeze.json`)
write(`${evidence}/author-freeze.sha256`, `${result.sha256}  author-freeze.json\n`)
for (const file of [...files(output), ...files(evidence)]) fs.chmodSync(file, 0o444)
assert.equal(bind(result.path).sha256, result.sha256)
console.log(JSON.stringify({ authorFreeze: result, status: freeze.status,
  counts: count, independentAffectedOnlyReviewPending: true }, null, 2))
