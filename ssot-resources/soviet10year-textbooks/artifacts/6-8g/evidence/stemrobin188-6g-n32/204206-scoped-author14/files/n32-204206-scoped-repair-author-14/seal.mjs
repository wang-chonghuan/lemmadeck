import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const cwd = process.cwd();
const root = path.join(cwd, '.intentfold/tickets/STEMROBIN-188/tmp/n32-204206-scoped-repair-author-14');
const old = path.join(cwd, '.intentfold/tickets/STEMROBIN-188/tmp/n32-fig204206-author-first-10');
const textRoot = path.join(cwd, '.intentfold/tickets/STEMROBIN-188/tmp/n32-text-candidate-10');
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const bind = file => ({ path: file, sha256: hash(file), bytes: fs.statSync(file).size });
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const write = (file, data) => {
  if (!file.startsWith(root + path.sep)) throw new Error('Write outside owned root');
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', { flag: 'wx' });
};
const resolveBinding = binding => ({ ...binding, path: path.resolve(cwd, binding.path) });
const assertBinding = binding => {
  const resolved = resolveBinding(binding);
  if (hash(resolved.path) !== resolved.sha256) throw new Error('Input hash drift: ' + resolved.path);
};
const interpretation = read(path.join(root, 'interpretation.json'));
const ledger = read(path.join(root, 'image-ledger.json'));
if (ledger.chargedAttempts > 8 || ledger.contextImagesAttempted > 24 || ledger.attempts.length !== ledger.chargedAttempts) throw new Error('Image budget violation');
if (ledger.attempts.some(attempt => !attempt.status.startsWith('opened'))) throw new Error('Unsettled image attempt');
const firstLocks = ['fig-204', 'fig-206'].map(id => {
  const files = ['FIRST.json', 'source.inventory.json'].map(file => {
    const absolute = path.join(root, id, file);
    const stat = fs.statSync(absolute);
    if ((stat.mode & 0o777) !== 0o444) throw new Error('FIRST not locked');
    return { ...bind(absolute), mode: '0444' };
  });
  return { figure: id, files, lockedBeforeCandidateRead: true };
});
const authoritativeFiles = ['lesson.template.json', 'exercises.template.json', 'record.json'].map(file => bind(path.join(textRoot, file)));
for (const file of ['fig-204/context.json', 'fig-206/context.r1.json']) {
  const context = read(path.join(old, file));
  context.bindings.forEach(assertBinding);
}
const oldManifest = read(path.join(old, 'figures.manifest.json'));
const relevantOldFigures = oldManifest.figures.filter(figure => ['fig-204', 'fig-206'].includes(figure.id));
for (const figure of relevantOldFigures) {
  for (const key of ['source', 'first', 'firstFreeze', 'context', 'spec', 'svg', 'render', 'nativePreview', 'hold']) assertBinding(figure[key]);
  for (const call of figure.calls) {
    assertBinding(call.receipt);
    for (const input of call.inputs || []) assertBinding(input);
    for (const stream of Object.values(call.streams || {})) assertBinding(stream);
    for (const output of call.outputs || []) assertBinding(output);
  }
}
const media = read(path.join(root, 'media.evidence.json'));
if (media.status !== 'completed' || !media.browserClosed) throw new Error('Media evidence incomplete');
[...media.inputs, ...media.historicalInputs, ...media.outputs].forEach(assertBinding);
const nativeReceiptPaths = ['validate.r1.call.json', 'render.r1.call.json'].map(file => path.join(root, 'fig-204', file));
for (const file of nativeReceiptPaths) {
  const receipt = read(file);
  if (receipt.exitCode !== 0) throw new Error('Native call failed');
  [...receipt.inputs, receipt.tool, ...Object.values(receipt.streams), ...receipt.outputs].forEach(assertBinding);
}
const current204 = read(path.join(root, 'fig-204/spec.r1.json'));
const old204 = read(path.join(old, 'fig-204/spec.json'));
for (const object of old204.objects) {
  if (JSON.stringify(current204.objects.find(item => item.id === object.id)) !== JSON.stringify(object)) throw new Error('Original 204 object changed: ' + object.id);
}
for (const assertion of old204.assertions) {
  if (JSON.stringify(current204.assertions.find(item => item.id === assertion.id)) !== JSON.stringify(assertion)) throw new Error('Original 204 assertion changed');
}
if (JSON.stringify(current204.source.authoritativeText) !== JSON.stringify(old204.source.authoritativeText)) throw new Error('204 authoritative text changed');

const context = {
  schema: 'scoped-figure-context@1', figure: 'fig-204', book: '6-8g', lesson: 'geo68-c3-s1-n32',
  bindings: authoritativeFiles, authoritativeText: current204.source.authoritativeText,
  priorContext: bind(path.join(old, 'fig-204/context.json')),
  sourceFirst: bind(path.join(root, 'fig-204/FIRST.json')),
  sourceInventory: bind(path.join(root, 'fig-204/source.inventory.json')),
  currentSpec: bind(path.join(root, 'fig-204/spec.r1.json')),
  semanticMapping: interpretation.figures[0],
  relevantExercises: [], answerKeysRead: false, independentApproval: false,
};
write(path.join(root, 'fig-204/context.r1.json'), context);
const hold206 = {
  schema: 'scoped-author-hold@1', figure: 'fig-206', status: 'HOLD',
  originalHold: bind(path.join(old, 'fig-206/hold.json')),
  originalFailure: bind(path.join(old, 'fig-206/firstfailure.json')),
  currentSpec: bind(path.join(old, 'fig-206/spec.r1.json')),
  authoritativeContext: bind(path.join(old, 'fig-206/context.r1.json')),
  incompleteInitialContext: bind(path.join(old, 'fig-206/context.json')),
  interpretation: bind(path.join(root, 'interpretation.json')),
  reason: interpretation.figures[1].remainingHold,
  displayFailureDiagnosis: bind(path.join(root, 'media.evidence.json')),
  displayedSourcePathsAndLabelsPreserved: true,
  nativeStages: 'reused unchanged; valid native render is not mathematical fidelity approval',
  contentRevisions: { cumulativeInput: 1, addedHere: 0, cumulativeOutput: 1, nextUnused: 2 },
  affectedProducerStopped: true, otherProducersBlocked: false,
  schemaOrGateChangeRequestedOrPerformed: false, independentApproval: false, promotion: false,
};
write(path.join(root, 'fig-206/hold.json'), hold206);
write(path.join(root, 'execution.receipts.json'), {
  schema: 'scoped-author-execution-receipts@1',
  calls: [
    {
      argv: [process.execPath, path.join(root, 'run-native.mjs')], cwd,
      exitCode: 0, observedToolResult: 'exec_command returned exit 0; validate exit=0 and render exit=0',
      tool: bind(path.join(root, 'run-native.mjs')), stages: nativeReceiptPaths.map(bind),
      activeExecSessions: [],
    },
    {
      argv: media.argv, cwd: media.cwd, startedAt: media.startedAt, finishedAt: media.finishedAt,
      exitCode: 0, observedToolResult: 'exec_command returned exit 0; media evidence completed',
      tool: bind(path.join(root, 'check-media.mjs')),
      evidence: bind(path.join(root, 'media.evidence.json')),
      outputs: media.outputs, activeExecSessions: [],
    },
  ],
  standaloneValidatorInvocations: { 'fig-204': 1, 'fig-206': 0 },
  rendererInvocations: { 'fig-204': 1, 'fig-206': 0 },
  rendererInternalValidatorInvocations: { 'fig-204': 1, 'fig-206': 0 },
  semanticValidatorProcessesIncludingRendererInternal: { 'fig-204': 2, 'fig-206': 0 },
  noHiddenSecondCandidateOrRetry: true, activeExecSessions: [],
});
const revisionLedger = {
  schema: 'scoped-content-revision-ledger@1',
  'fig-204': {
    cumulativeInput: 0, maximumNewThisTask: 1, addedHere: 1, cumulativeOutput: 1,
    input: bind(path.join(old, 'fig-204/spec.json')), output: bind(path.join(root, 'fig-204/spec.r1.json')),
    change: 'Source objects and assertions byte-equivalent after structured parsing; only semantic description/inventory and separately identified modern c extension added.',
  },
  'fig-206': {
    cumulativeInput: 1, maximumNewThisTask: 1, addedHere: 0, cumulativeOutput: 1, nextUnused: 2,
    input: bind(path.join(old, 'fig-206/spec.r1.json')), output: bind(path.join(old, 'fig-206/spec.r1.json')),
    change: 'None; complete context.r1 and native stages reused. Only new author interpretation/HOLD and screenshot diagnosis retained.',
  },
  historicalLimitIsNotNewApprovalBarrier: true,
  historicalLedger: bind(path.join(old, 'ledger.json')),
  historicalFailuresAndCountsReset: false,
};
write(path.join(root, 'revision-ledger.json'), revisionLedger);

const inputPaths = [
  '.intentfold/readme.md', '.intentfold/charter/engineering.md', '.intentfold/charter/operations.md',
  '.agents/skills/ld-s10y-image/SKILL.md',
  '.agents/skills/ld-s10y-image/references/figure-spec.md',
  '.agents/skills/ld-s10y-image/references/quality-gate.md',
  '.agents/skills/ld-s10y-image/assets/figure-spec.schema.json',
  '.agents/skills/ld-s10y-image/scripts/validate_spec.py',
  '.agents/skills/ld-s10y-image/scripts/render_spec.mjs',
  '.claude/skills/ld-s10y-lesson/references/production-resume.md',
].map(file => path.join(cwd, file));
const historicalPaths = [
  'figures.manifest.json', 'ledger.json', 'mobile.evidence.json', 'mobile.firstfailure.json', 'mobile.mjs',
  'mobile-300.png', 'mobile-358.png',
  'fig-204/FIRST.json', 'fig-204/FIRST.freeze.json', 'fig-204/context.json', 'fig-204/spec.json', 'fig-204/hold.json',
  'fig-204/validate.call.json', 'fig-204/validate.stdout.txt', 'fig-204/validate.stderr.txt',
  'fig-204/render.call.json', 'fig-204/render.stdout.txt', 'fig-204/render.stderr.txt',
  'fig-204/fig-204.svg', 'fig-204/fig-204.render.json', 'fig-204/fig-204.native.png',
  'fig-206/FIRST.json', 'fig-206/FIRST.freeze.json', 'fig-206/context.json', 'fig-206/context.r1.json',
  'fig-206/spec.json', 'fig-206/spec.r1.json', 'fig-206/hold.json', 'fig-206/firstfailure.json', 'fig-206/revision.r1.json',
  'fig-206/validate.call.json', 'fig-206/validate.stdout.txt', 'fig-206/validate.stderr.txt',
  'fig-206/validate.r1.call.json', 'fig-206/validate.r1.stdout.txt', 'fig-206/validate.r1.stderr.txt',
  'fig-206/render.r1.call.json', 'fig-206/render.r1.stdout.txt', 'fig-206/render.r1.stderr.txt',
  'fig-206/fig-206.r1.svg', 'fig-206/fig-206.r1.render.json', 'fig-206/fig-206.r1.native.png',
].map(file => path.join(old, file));
const sources = ['fig-204', 'fig-206'].map(id => bind(path.join(cwd, `ssot-resources/soviet10year-textbooks/artifacts/6-8g/figures/${id}.png`)));
const currentFigures = [
  {
    id: 'fig-204', disposition: 'READY_FOR_SEPARATE_INDEPENDENT_REVIEW',
    spec: bind(path.join(root, 'fig-204/spec.r1.json')), context: bind(path.join(root, 'fig-204/context.r1.json')),
    svg: bind(path.join(root, 'fig-204/fig-204.r1.svg')), render: bind(path.join(root, 'fig-204/fig-204.r1.render.json')),
    native: bind(path.join(root, 'fig-204/fig-204.r1.native.png')),
    first: bind(path.join(root, 'fig-204/FIRST.json')), sourceInventory: bind(path.join(root, 'fig-204/source.inventory.json')),
    originalHold: bind(path.join(old, 'fig-204/hold.json')), authorSemanticHold: null,
    stages: { validation: 'pass', nativeRender: 'pass', authorSemanticMapping: 'resolved-with-separated-modern-addition', offlineActualMedia: 'pass', independentReview: 'not-performed', promotion: 'not-performed' },
    cumulativeContentRevisions: 1,
  },
  {
    id: 'fig-206', disposition: 'HOLD',
    spec: bind(path.join(old, 'fig-206/spec.r1.json')), context: bind(path.join(old, 'fig-206/context.r1.json')),
    svg: bind(path.join(old, 'fig-206/fig-206.r1.svg')), render: bind(path.join(old, 'fig-206/fig-206.r1.render.json')),
    native: bind(path.join(old, 'fig-206/fig-206.r1.native.png')),
    first: bind(path.join(root, 'fig-206/FIRST.json')), sourceInventory: bind(path.join(root, 'fig-206/source.inventory.json')),
    originalHold: bind(path.join(old, 'fig-206/hold.json')), originalFailure: bind(path.join(old, 'fig-206/firstfailure.json')),
    authorSemanticHold: bind(path.join(root, 'fig-206/hold.json')),
    stages: { validation: 'pass-reused-r1', nativeRender: 'pass-reused-r1', authorSemanticMapping: 'hold-no-executable-rejected-hypothesis-scope', offlineActualMedia: 'pass-isolated-wrapper', historicalMultiSvgDisplay: 'fail-preserved-and-diagnosed', independentReview: 'not-performed', promotion: 'not-performed' },
    cumulativeContentRevisions: 1, nextContentRevisionUnused: 2,
  },
];
const report = {
  schema: 'scoped-repair-author-report@1', ticket: 'STEMROBIN-188', run: 'SAME188-6',
  mode: 'OFFLINE', finish: 'review', role: 'FRESH_NONFORK_AUTHOR_ONLY',
  ownedRoot: root, status: 'PARTIAL_READY_WITH_PRECISE_LOCALIZED_HOLD',
  figures: currentFigures, sourceInterpretationVsExecutableClaims: bind(path.join(root, 'interpretation.json')),
  semanticConclusion: {
    'fig-204': 'Represent the proof premises and proved intersection, not the refuted supposition. All original strokes/labels retained; added collinear dashed continuation separately inventoried.',
    'fig-206': 'Full proof rejects P. Current turned strokes cannot be actual parallel straight lines meeting. Existing geometric-predicate schema cannot execute a rejected conditional world; preserve semantic HOLD and stop this producer only.',
  },
  displayDiagnosis: media.historicalDiagnosis,
  currentMedia: media.outputs, mediaEvidence: bind(path.join(root, 'media.evidence.json')),
  imageLedger: bind(path.join(root, 'image-ledger.json')), imageAttempts: ledger.chargedAttempts,
  imageAttemptLimit: 8, contextImageAttempts: ledger.contextImagesAttempted, contextLimit: 24,
  chargedImagesHistorically: read(path.join(old, 'ledger.json')).chargedImagesTotal,
  cumulativeHistoricalPlusThisFreshBatch: read(path.join(old, 'ledger.json')).chargedImagesTotal + ledger.chargedAttempts,
  historicalCountsPreservedNotReset: true, imagePayloadReturned: false,
  firstLocks, revisionLedger: bind(path.join(root, 'revision-ledger.json')),
  executionReceipts: bind(path.join(root, 'execution.receipts.json')),
  originalHolds: ['fig-204/hold.json', 'fig-206/hold.json'].map(file => bind(path.join(old, file))),
  original206Failure: bind(path.join(old, 'fig-206/firstfailure.json')),
  originalDisplayFailure: bind(path.join(old, 'mobile.firstfailure.json')),
  authoritativeInputBindings: authoritativeFiles, currentSourceBindings: sources,
  reusedNativeStages: ['fig-206 validator r1', 'fig-206 render r1', 'fig-206 SVG/native bytes'],
  limitations: interpretation.unknownRemaining,
  independentApproval: false, reviewAt1Written: false,
  lessonExerciseAnswerChanges: false, schemaGateOrCharterChanges: false,
  networkApiPaidDbEnvInstallAppGitPromotionOrWholeProjectChecks: false,
  independentReviewerRootRead: false, otherEditsPreserved: true,
  activeExecSessions: [],
};
write(path.join(root, 'report.json'), report);
const outputFiles = fs.readdirSync(root, { recursive: true })
  .map(file => path.join(root, file))
  .filter(file => fs.statSync(file).isFile() && path.basename(file) !== 'manifest.json');
const manifest = {
  schema: 'scoped-repair-author-manifest@1', ticket: 'STEMROBIN-188', run: 'SAME188-6',
  mode: 'OFFLINE', finish: 'review', role: 'FRESH_NONFORK_AUTHOR_ONLY', ownedRoot: root,
  current: currentFigures, report: bind(path.join(root, 'report.json')),
  inputs: [...sources, ...authoritativeFiles, ...inputPaths.map(bind)],
  preservedHistoricalInputs: historicalPaths.map(bind),
  outputs: outputFiles.map(bind),
  imageLedger: bind(path.join(root, 'image-ledger.json')), revisionLedger: bind(path.join(root, 'revision-ledger.json')),
  executionReceipts: bind(path.join(root, 'execution.receipts.json')),
  firstLocks, independentApproval: false, remainingHold: bind(path.join(root, 'fig-206/hold.json')),
  noWholeExistingPackageCopied: true, activeExecSessions: [],
  selfBinding: 'Manifest is not self-hashed; its SHA-256 is returned in the final handoff.',
};
write(path.join(root, 'manifest.json'), manifest);
console.log(JSON.stringify({
  status: report.status, report: bind(path.join(root, 'report.json')), manifest: bind(path.join(root, 'manifest.json')),
  imageAttempts: ledger.chargedAttempts, activeExecSessions: [],
}, null, 2));
