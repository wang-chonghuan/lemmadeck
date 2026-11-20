import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const owned = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d180-n12-gauge-figure18-author');
const figures = path.join(repo, '.tmp/STEMROBIN-181/d1816-d180/figures');
const expectedFreezeSha = 'aac8ccd868292b4c489644fda49aec6e0ace47448947cb9c9f10a40078756f6b';
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const digest = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: path.resolve(file), bytes: bytes.length, sha256: digest(bytes) };
};
const check = expected => {
  const actual = bind(expected.path);
  assert.deepEqual(actual, expected);
  return actual;
};
const save = (name, value) => {
  const file = path.join(owned, name);
  assert.equal(path.dirname(file), owned);
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' });
  return bind(file);
};
const sourceInventory = path.join(owned, 'source-first-inventory.json');
const uncertaintyPath = path.join(owned, 'uncertainty-assessment.json');
const inventory = read(sourceInventory);
const uncertainty = read(uncertaintyPath);
assert.equal(inventory.authorState.actualImageOpens, 1);
assert.equal(inventory.authorState.figureSpecCreated, false);
assert.equal(uncertainty.verdict, 'HOLD');
assert.equal(uncertainty.numericalInterpretationHoldPreserved, true);

const inputFreezePath = path.join(owned, 'input-freeze.json');
const inputFreezeBinding = bind(inputFreezePath);
assert.equal(inputFreezeBinding.sha256, expectedFreezeSha);
const inputFreeze = read(inputFreezePath);
assert.deepEqual(inputFreeze.figures, ['fig-18']);
assert.equal(inputFreeze.numericalInterpretationHoldPreserved, true);
const contextBinding = check(inputFreeze.context);
const context = read(contextBinding.path);
assert.equal(context.figure, 'fig-18');
assert.equal(context.lesson, 'phy9-c1-s2-n12');
assert.equal(context.inheritedContentRepairs, 0);
const sourceBinding = check(context.sourceImage);
assert.equal(sourceBinding.sha256, inventory.source.sha256);
const sharedCarrier = check(inputFreeze.immutableSharedCarrier);
const textReviewCarrier = check(context.independentTextReview);
const inputBindings = {
  inputFreeze: inputFreezeBinding,
  inputContext: contextBinding,
  dispatchRecord: bind(path.join(owned, 'dispatch-record.json')),
  originalSourceImage: sourceBinding,
  immutableSharedInputCarrier: sharedCarrier,
  reusedTextReviewCarrier: textReviewCarrier,
  bilingualText: {},
  nativeContexts: {},
  reusedNativeExecutionReceipts: {}
};
const inputModesBefore = new Map();
const rememberMode = file => {
  inputModesBefore.set(path.resolve(file), fs.statSync(file).mode & 0o777);
};
for (const binding of [
  inputFreezeBinding, contextBinding, sourceBinding, sharedCarrier,
  textReviewCarrier, inputBindings.dispatchRecord
]) rememberMode(binding.path);

for (const [locale, language] of Object.entries(context.languages)) {
  const lesson = check(language.lesson);
  const current = read(lesson.path);
  assert.deepEqual(current.prose, language.blocks);
  const fullText = current.prose.filter(row => row.kind !== 'fig')
    .map(row => row.text).join('\n\n');
  assert.equal(fullText, language.fullText);
  const textBytes = Buffer.from(fullText, 'utf8');
  inputBindings.bilingualText[locale] = {
    lesson,
    fullText: {
      path: contextBinding.path,
      jsonPointer: `/languages/${locale}/fullText`,
      encoding: 'UTF-8',
      bytes: textBytes.length,
      sha256: digest(textBytes),
      completeProseVerifiedAgainstCurrentLesson: true
    }
  };
  rememberMode(lesson.path);
  const nativeContext = check(context.nativeContexts[locale]);
  inputBindings.nativeContexts[locale] = nativeContext;
  rememberMode(nativeContext.path);
  const native = read(nativeContext.path);
  assert.equal(native.figure, 'fig-18');
  assert.equal(native.sourceImage.width, 607);
  assert.equal(native.sourceImage.height, 469);
  const carrierSource = bind(path.resolve(repo, native.sourceImage.path));
  assert.equal(carrierSource.sha256, sourceBinding.sha256);
  assert.equal(carrierSource.bytes, sourceBinding.bytes);
  inputBindings.nativeContexts[locale] = {
    ...nativeContext,
    sourceImageCarrier: carrierSource
  };
  rememberMode(carrierSource.path);
  const receiptDir = path.join(repo,
    `.intentfold/tickets/STEMROBIN-181/tmp/d1816-recovery/native/d180-${locale}-fig18-first-context`);
  const receiptPath = path.join(receiptDir, 'receipt.json');
  const receipt = read(receiptPath);
  assert.equal(receipt.exitCode, 0);
  assert.equal(receipt.cwd, repo);
  inputBindings.reusedNativeExecutionReceipts[locale] = {
    receipt: bind(receiptPath),
    stdout: bind(path.join(receiptDir, 'stdout.txt')),
    stderr: bind(path.join(receiptDir, 'stderr.txt')),
    originalExitCode: 0,
    reusedWithoutReplay: true
  };
  for (const key of ['receipt', 'stdout', 'stderr']) {
    rememberMode(inputBindings.reusedNativeExecutionReceipts[locale][key].path);
  }
}

const counters = {
  actualImageOpensThisAuthor: 1,
  actualImageOpensThisContext: 1,
  originalImageOpens: 1,
  cropOpens: 0,
  reopens: 0,
  previewOpens: 0,
  parentImageOpens: 0,
  maximumActualImageOpens: 8,
  maximumContextImageOpens: 24,
  candidatesCreated: 0,
  selectedCandidates: 0,
  inheritedContentRepairs: 0,
  contentRepairsThisAuthor: 0,
  totalContentRepairs: 0,
  maximumTotalContentRepairs: 1,
  nativeCallsThisAuthor: 0,
  inheritedSuccessfulNativeContextCalls: 2,
  totalD180NativeContextCalls: 2,
  nativeContextReplays: 0,
  nativeDraftValidationCalls: 0,
  nativeRenderCalls: 0,
  nativeRecordReviewCalls: 0,
  newNativeExecutionReceipts: 0,
  reusedSuccessfulNativeExecutionReceipts: 2,
  failedNativeCallsThisAuthor: 0,
  paidCalls: 0,
  generatedArtCalls: 0,
  modelCalls: 0,
  sourcePageReviewReplays: 0,
  textReviewReplays: 0,
  courseRenders: 0,
  courseChecks: 0,
  publisherCalls: 0,
  databaseCalls: 0,
  gitCalls: 0,
  peerMessages: 0,
  canonicalPromotions: 0,
  completeCoursesAdded: 0
};
const missing = reason => ({ path: null, bytes: null, sha256: null, status: 'NOT_CREATED', reason });
const renderArtifacts = {
  spec: missing('Source-geometry HOLD before FigureSpec authoring.'),
  renderReport: missing('No eligible FigureSpec; native renderer not called.'),
  svg: missing('No candidate or native render.'),
  preview: missing('No candidate; no preview created or opened.'),
  review: missing('No independent PASS or native record-review authorized or executed.')
};
const evidenceBindings = {
  sourceFirstInventory: bind(sourceInventory),
  uncertaintyAssessment: bind(uncertaintyPath),
  reportingScript: bind(path.join(owned, 'freeze-author-hold.mjs'))
};
const generatedAt = new Date().toISOString();
const receiptBinding = save('author-binding-verification.receipt.json', {
  schema: 'stemrobin/author-local-binding-verification@1',
  batch: 'D180',
  figure: 'fig-18',
  generatedAt,
  cwd: repo,
  receiptKind: 'LOCAL_INPUT_BINDING_VERIFICATION_NOT_NATIVE_RENDER_OR_REVIEW',
  currentInputBindings: inputBindings,
  outputEvidenceBindings: evidenceBindings,
  inputsCheckedByBytesAndSha256: true,
  completeBilingualTextMatchesCurrentLesson: true,
  originalAndNativeContextSourceBytesIdentical: true,
  successfulNativeContextsReusedWithoutReplay: true,
  nativeExecutionsInThisAuthor: [],
  counters,
  nonNativeDiscoveryFailure: {
    command: 'ls -d .intentfold/tickets/STEMROBIN-181/tmp/d1816-d180* .tmp/STEMROBIN-181/d1816-d180*',
    cwd: repo,
    exitCode: 1,
    observedStderr: 'zsh:1: no matches found: .tmp/STEMROBIN-181/d1816-d180*',
    phase: 'READ_ONLY_PATH_DISCOVERY',
    technicalCause: 'No figure-output directory existed; zsh unmatched-glob expansion stopped ls.',
    recovery: 'Located existing author inputs with rg --files --hidden --no-ignore; no native stage or content stage was rerun.',
    contentRepair: false,
    scientificVerdict: false,
    outputDiscarded: false
  },
  status: 'INPUT_BINDINGS_VERIFIED_GEOMETRY_HOLD_UNCHANGED'
});
evidenceBindings.authorBindingVerificationReceipt = receiptBinding;
const reportBinding = save('report.json', {
  schema: 'stemrobin/figure-first-author-report@1',
  batch: 'D180',
  figure: 'fig-18',
  lesson: 'phy9-c1-s2-n12',
  role: 'FIRST_SOURCE_GEOMETRY_AUTHOR_ONLY',
  generatedAt,
  cwd: repo,
  verdict: 'HOLD',
  status: 'SOURCE_GEOMETRY_HOLD_NO_SPECULATIVE_CANDIDATE',
  heldPhase: uncertainty.heldPhase,
  authorready: false,
  selectedCandidate: null,
  numericalInterpretationHoldPreserved: true,
  numericalInterpretationHoldReleased: false,
  geometryVerdictIndependentOfNumericalHold: true,
  geometryHoldReason: 'The complete visible gauge tick/glyph set and ruler mark set cannot uniquely be enumerated from original pixels. Omitting or fabricating them would not be source-faithful.',
  actualSourceInventory: {
    binding: evidenceBindings.sourceFirstInventory,
    observedBeforeAnySpecOrDraft: true,
    components: inventory.components,
    labelsAndMarks: inventory.labelsAndMarks,
    visibleConnections: inventory.visibleConnections,
    uncertainty: inventory.uncertainty,
    textAuthorizedRoleResolution: uncertainty.approvedTextRoleMappings,
    finalDecisiveRequiredPixelAmbiguities: uncertainty.decisiveRequiredPixelAmbiguities
  },
  authoritativeScientificAndSafetyConstraints: uncertainty.scientificAndSafetyConstraints,
  numericalHold: uncertainty.numericalHold,
  currentInputBindings: inputBindings,
  candidateArtifactBindings: renderArtifacts,
  evidenceBindings,
  imageLedger: [{
    ordinal: 1,
    type: 'ORIGINAL_PNG',
    binding: sourceBinding,
    width: 607,
    height: 469,
    tool: 'functions.view_image',
    loadedIntoThisContext: true,
    parentPayloadDelivered: false
  }],
  nativeLedger: {
    executedThisAuthor: [],
    inheritedContextCalls: 2,
    reusedReceiptBindings: inputBindings.reusedNativeExecutionReceipts,
    reasonForNoNewNativeReceipt: 'Source-geometry eligibility failed before any FigureSpec. No native call ran; an execution receipt must not be fabricated.'
  },
  counters,
  writeScope: {
    authorizedAuthorDirectory: owned,
    authorizedFigureDirectory: figures,
    figureOutputDirectoryCreated: false,
    sharedRoot: path.resolve(repo, inputFreeze.root),
    sharedWork: path.resolve(repo, inputFreeze.work),
    sharedCarriersModified: false,
    inputPermissionsChanged: false,
    otherFiguresOpenedOrChanged: false,
    sharedManifestsChanged: false
  },
  approval: {
    figureApproved: false,
    independentFigurePass: false,
    wholeCourseApproved: false,
    courseApproval: false,
    parentCollectionPerformed: false,
    closurePerformed: false,
    awaitParentCollectionAndClosure: true
  }
});
const outputBindings = [
  evidenceBindings.sourceFirstInventory,
  evidenceBindings.uncertaintyAssessment,
  evidenceBindings.reportingScript,
  receiptBinding,
  reportBinding
];
const freezeBinding = save('author-freeze.json', {
  schema: 'stemrobin/figure-author-freeze@1',
  batch: 'D180',
  figure: 'fig-18',
  generatedAt,
  cwd: repo,
  verdict: 'HOLD',
  heldPhase: uncertainty.heldPhase,
  authorready: false,
  selectedCandidate: null,
  numericalInterpretationHoldPreserved: true,
  wholeCourseApproved: false,
  courseApproval: false,
  figureApproved: false,
  independentFigurePass: false,
  currentInputBindings: inputBindings,
  candidateArtifactBindings: renderArtifacts,
  outputBindings,
  report: reportBinding,
  counters,
  freezePolicy: {
    newOwnedOutputsOnly: true,
    newOwnedOutputsReadOnlyAfterWrite: true,
    inputFreezeContextsSourceSharedCarriersChmod: false,
    inputPermissionsUnchanged: true,
    modeForNewOwnedOutputs: '0444',
    authorFreezeSelfHashProvidedExternally: true,
    noSharedManifestMutation: true
  },
  awaitParentCollectionAndClosure: true
});
// Freeze only newly created owned outputs, never any inherited carrier.
for (const binding of [...outputBindings, freezeBinding]) {
  assert.equal(path.dirname(binding.path), owned);
  fs.chmodSync(binding.path, 0o444);
  assert.deepEqual(bind(binding.path), binding);
}
for (const [file, originalMode] of inputModesBefore) {
  assert.equal(fs.statSync(file).mode & 0o777, originalMode);
}
check(inputFreezeBinding);
check(contextBinding);
check(sourceBinding);
check(sharedCarrier);
check(textReviewCarrier);
for (const language of Object.values(inputBindings.bilingualText)) check(language.lesson);
for (const native of Object.values(inputBindings.nativeContexts)) {
  check({ path: native.path, bytes: native.bytes, sha256: native.sha256 });
  check(native.sourceImageCarrier);
}
console.log(JSON.stringify({
  verdict: 'HOLD',
  numericalInterpretationHoldPreserved: true,
  report: reportBinding,
  authorFreeze: freezeBinding,
  selectedCandidate: null,
  counters
}, null, 2));
