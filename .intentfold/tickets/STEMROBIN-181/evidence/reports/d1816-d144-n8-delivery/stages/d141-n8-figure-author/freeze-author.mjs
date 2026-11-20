import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
const home = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d141-n8-figure-author');
const first = path.join(repo, '.tmp/STEMROBIN-181/d1816-d141/figure05/candidate-1');
const current = path.join(repo, '.tmp/STEMROBIN-181/d1816-d141/figure05/candidate-2');
assert.equal(process.cwd(), repo);
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const binding = file => ({ path: file, bytes: fs.statSync(file).size, sha256: hash(file) });
const writeNew = (file, data) => {
  assert(!fs.existsSync(file), `Refusing overwrite: ${file}`);
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
};
const inputFreezePath = path.join(home, 'input-freeze.json');
const contextPath = path.join(home, 'fig-05.input-context.json');
assert.equal(hash(inputFreezePath), 'a7fd3f97f1b89bfccc110a40e45a8b37f34a41a2da5fc982de4be83ed39a2651');
assert.equal(hash(contextPath), 'af49fd69408b6bb2b3e4d480a1766f8f12df42924b3b8c19a91fc28d82fb80d1');
const input = read(inputFreezePath);
const context = read(contextPath);
const protectedBindings = [
  ...input.drafts.flatMap(item => Object.values(item)),
  input.authorFreeze, input.textReviewCollected,
  ...Object.values(context.nativeContexts),
  ...Object.values(context.textBindings).map(item => item.lesson),
  context.sourceImage, context.durableSourceImage,
  context.originalLesson, context.originalExercises,
];
const changedInputBindings = protectedBindings.filter(item => hash(item.path) !== item.sha256);
assert.deepEqual(changedInputBindings, [], 'Frozen/protected input drift: retain outputs but do not freeze a stale author result');
const selected = Object.fromEntries([
  ['spec', 'fig-05.spec.json'], ['svg', 'fig-05.svg'], ['render', 'fig-05.render.json'],
  ['preview', 'fig-05.preview-640.png'], ['previewHtml', 'author-preview.html'],
  ['mobileScrollStart', 'author-mobile-scroll-start.png'], ['mobileScrollEnd', 'author-mobile-scroll-end.png'],
  ['sourceRelationsAssertions', 'source-relations.assertions.json'],
  ['previewAssertions', 'author-preview.assertions.json'],
  ['construction', 'schematic-construction.json'], ['repair', 'repair.json'],
  ['inputVerification', 'input-verification.json'],
].map(([key, name]) => [key, binding(path.join(current, name))]));
const spec = read(selected.spec.path);
const render = read(selected.render.path);
const relationChecks = read(selected.sourceRelationsAssertions.path);
const previewChecks = read(selected.previewAssertions.path);
assert.equal(spec.schema, 'ld-s10y-image/figure-spec@2');
assert.equal(render.status, 'pass');
assert.equal(render.spec.sha256, selected.spec.sha256);
assert.equal(render.output.svg.sha256, selected.svg.sha256);
assert.equal(relationChecks.status, 'pass');
assert.equal(relationChecks.spec.sha256, selected.spec.sha256);
assert.equal(previewChecks.status, 'pass');
assert.equal(previewChecks.svg.sha256, selected.svg.sha256);
assert.equal(read(selected.repair.path).contentRepairOrdinal, 1);
const sourceInventory = binding(path.join(home, 'source-pixel-inventory.json'));
assert.equal(relationChecks.sourceInventory.sha256, sourceInventory.sha256);
const callNames = [
  'fig05-c1-native-validate', 'fig05-c1-source-relations',
  'fig05-c2-native-validate', 'fig05-c2-source-relations',
  'fig05-c2-native-render', 'fig05-c2-author-preview-inspect',
  'fig05-c2-author-preview-technical-recovery',
];
const receipts = callNames.map(name => binding(path.join(home, 'native', name, 'receipt.json')));
assert.equal(read(receipts[2].path).exitCode, 0);
assert.equal(read(receipts[3].path).exitCode, 0);
assert.equal(read(receipts[4].path).exitCode, 0);
assert.equal(read(receipts[6].path).exitCode, 0);
const validation = read(path.join(home, 'native/fig05-c2-native-validate/stdout.txt'));
assert.equal(validation.status, 'pass');
const imageOpens = [
  { ordinal: 1, purpose: 'Original source PNG pixels before inventory/spec/source SVG', file: binding(context.sourceImage.path) },
  { ordinal: 2, purpose: 'Selected native-render preview at source canvas and actual 640px media width', file: selected.preview },
  { ordinal: 3, purpose: '390px mobile author-preview scroll start', file: selected.mobileScrollStart },
  { ordinal: 4, purpose: '390px mobile author-preview scroll end', file: selected.mobileScrollEnd },
];
const usage = {
  imagesOpened: 4,
  maximumBatchImageOpens: 8,
  imagesLoadedIntoThisContext: 4,
  maximumContextImageOpens: 24,
  parentImageOpens: 0,
  imagePayloadsReturnedToParent: 0,
  imagesGeneratedDeterministically: 3,
  imageCropsOpened: 0,
  sourcePngReopens: 0,
  sourceSvgOpens: 0,
  contentRepairs: 1,
  maximumContentRepairs: 1,
  remainingContentRepairs: 0,
  technicalRecoveries: 1,
  nativeTopLevelValidationCalls: 2,
  nativeRenderCalls: 1,
  nativeRendererInternalDraftValidationCalls: 1,
  sourceRelationCheckCalls: 2,
  previewInspectionCalls: 2,
  originalTasks: 0,
  answers: 0,
  choices: 0,
  paidCalls: 0,
  modelCalls: 0,
  nativeReviewCalls: 0,
  durablePromotions: 0,
  nativeFinalizationCalls: 0,
  databaseCalls: 0,
  publisherCalls: 0,
  deployCalls: 0,
  gitCalls: 0,
  supervisorOrPeerMessages: 0,
  subagents: 0,
  wholeProjectTests: 0,
};
const imageLedgerPath = path.join(home, 'image-usage.json');
writeNew(imageLedgerPath, { schema: 'STEMROBIN-181/figure-author-image-usage@1', usage, imageOpens });
const observationsPath = path.join(home, 'author-visual-observations.json');
writeNew(observationsPath, {
  schema: 'STEMROBIN-181/figure-author-visual-observations@1',
  status: 'author-inspected',
  independentApproval: false,
  source: context.sourceImage,
  selectedPreview: selected.preview,
  inspectionImages: imageOpens,
  observations: [
    'Compared original pixels with the selected 640px native preview: one F-r frame, origin 0, equilibrium r0, all three signed solid curves, dashed upper/lower guide branches and thick near-zero net segment remain visible.',
    'Upper repulsion and lower attraction English leaders reach their own curves; the net-force leader reaches the middle curve. No source Chinese or additional physical calibration appears.',
    'Net crosses once at r0, remains negative to the right, has a rounded minimum, and approaches zero between the two components. The thick segment straddles the same crossing and stays on the net curve.',
    'All seven labels remain readable in the 640px preview. At mobile scroll start the origin, F and r0 are inspectable; at scroll end the rightward r axis, force tails and Repulsion/Attraction labels are reachable.',
    'White preview is nonblank and not black/broken; source solid/dashed/thickness distinctions remain usable without color.',
  ],
  modernRegularization: [
    'Smooth screen-space force curves are qualitative regularization, not sampled source measurements or a claimed physical formula.',
    'Dashed guides are regularized to opposite smooth guide branches; no added physical interpretation or invented numerical ticks is assigned.',
    'Source Chinese callouts are translated to English; layout spacing supports 20px labels at the required 640px display width.',
  ],
  limitations: [
    'Author inspection is not independent visual/scientific approval.',
    'The isolated author-preview host is not the native lesson/product surface.',
  ],
});
const reportPath = path.join(home, 'report.json');
const holds = [
  'Independent figure approval remains false; separate independent source/spec/render/text review is required.',
  'Native bilingual lesson integration and its authoritative offline/product surface checks remain with the parent.',
  'No ld-s10y-image/review@1, durable promotion, native finalization or product acceptance is authorized or recorded here.',
  'Current render metadata intentionally binds scratch author outputs. Approved durable integration must establish durable output bindings; do not promote this temporary report as-is.',
  'The one content repair has been consumed. A second content failure must be retained and held, not repaired again in this assignment.',
];
const failureRecords = [
  {
    category: 'native-spec-contract',
    candidate: 1,
    cause: 'Explicit svgPath.fill=none rejected as non-semantic role by native validator.',
    receipt: receipts[0],
    evidence: binding(path.join(home, 'native/fig05-c1-native-validate/stdout.txt')),
    resolution: 'Omit fill in the sole repair; current native validation passes.',
  },
  {
    category: 'content-assertion',
    candidate: 1,
    cause: 'Repulsion leader outside retained curve; thick-segment deviation 2.06476209375px exceeds unchanged 1.5px bound.',
    receipt: receipts[1],
    evidence: binding(path.join(first, 'source-relations.assertions.json')),
    resolution: 'Sole targeted repair moves leader onto the visible curve and shortens the exact net emphasis; current 39 checks pass.',
  },
  {
    category: 'technical-preview-locator',
    candidate: 2,
    cause: 'First preview script omitted the renderer-added -label suffix; label lookup timed out.',
    receipt: receipts[5],
    evidence: binding(path.join(home, 'native/fig05-c2-author-preview-inspect/stderr.txt')),
    resolution: 'Recovered only failed mobile-end lookup and remaining pixel checks. Spec/SVG/render and first screenshot bytes unchanged; native render not repeated.',
    recoveryReceipt: receipts[6],
    earlierMetricsLimitation: 'Earlier viewport/theme assertions reached the failing lookup but did not serialize metric details; retained script/timeout stack bind the executed sequence.',
  },
];
const report = {
  schema: 'STEMROBIN-181/figure-author-report@1',
  ticket: 'STEMROBIN-181',
  batch: 'D141',
  role: 'FIRST_DETERMINISTIC_SHARED_MODERN_N8_FIG05_AUTHOR',
  status: 'AUTHOR_COMPLETE_PENDING_INDEPENDENT_REVIEW',
  finish: 'review',
  grill: 'self-already-completed-same-invocation-not-replayed',
  book: '9p',
  lesson: 'phy9-c1-s1-n8',
  figure: 'fig-05',
  mode: 'deterministic',
  independentApproval: false,
  independentFigureApproval: false,
  nativeReviewRecorded: false,
  productAcceptance: false,
  selectedCandidate: 2,
  current: selected,
  source: { inspectedImage: context.sourceImage, durableImage: context.durableSourceImage, pixelInventory: sourceInventory },
  inputs: {
    inputFreeze: binding(inputFreezePath), context: binding(contextPath),
    nativeContexts: context.nativeContexts,
    approvedCompleteText: Object.fromEntries(Object.entries(context.textBindings).map(([lang, item]) => [lang, item.lesson])),
    protectedBindingsRechecked: protectedBindings.length,
    protectedInputDrift: changedInputBindings,
    authoritativeTextEntriesAreActualCompleteLearnerText: true,
  },
  checks: {
    nativeValidation: { status: validation.status, receipt: receipts[2], result: binding(path.join(home, 'native/fig05-c2-native-validate/stdout.txt')) },
    nativeRender: { status: render.status, objects: render.objects, labels: render.labels, collisions: render.collisions, displayChecks: render.displayChecks, receipt: receipts[4] },
    sourceRelations: { status: relationChecks.status, totalChecks: relationChecks.totalChecks, nativeAssertions: relationChecks.nativeAssertions, objectCountOnlyAssertions: relationChecks.objectCountOnlyAssertions, report: selected.sourceRelationsAssertions },
    preview: { status: previewChecks.status, report: selected.previewAssertions, nativeProductAcceptance: false },
    visualAuthorObservations: binding(observationsPath),
  },
  usage,
  imageLedger: binding(imageLedgerPath),
  nativeReceipts: receipts,
  firstCandidate: {
    retained: true,
    spec: binding(path.join(first, 'fig-05.spec.json')),
    construction: binding(path.join(first, 'schematic-construction.json')),
    sourceRelations: binding(path.join(first, 'source-relations.assertions.json')),
    nativeRenderNotAttempted: 'Stopped dependent stage at failed validation/content assertions.',
  },
  failures: failureRecords,
  unresolvedExecutionOrContentFailures: [],
  remainingHolds: holds,
  ownership: {
    writesOnlyUnder: [home, path.join(repo, '.tmp/STEMROBIN-181/d1816-d141/figure05')],
    meterIndexTextTemplatesCarrierChangedByAuthor: false,
    frozenInputsRewritten: false,
    otherEditsReverted: false,
  },
};
writeNew(reportPath, report);
const freezePath = path.join(home, 'author-freeze.json');
writeNew(freezePath, {
  schema: 'STEMROBIN-181/figure-author-freeze@1',
  status: 'AUTHOR_FROZEN_PENDING_INDEPENDENT_REVIEW',
  ticket: 'STEMROBIN-181', batch: 'D141', figure: 'fig-05',
  independentApproval: false,
  productAcceptance: false,
  inputFreeze: binding(inputFreezePath),
  inputContext: binding(contextPath),
  sourceImage: context.sourceImage,
  durableSourceImage: context.durableSourceImage,
  sourceInventory,
  completeApprovedText: report.inputs.approvedCompleteText,
  nativeContexts: context.nativeContexts,
  selectedCandidate: 2,
  selectedFiles: selected,
  authorReport: binding(reportPath),
  imageUsage: binding(imageLedgerPath),
  authorObservations: binding(observationsPath),
  nativeReceipts: receipts,
  authorTools: ['author-figure.mjs', 'source-relations-check.mjs', 'repair-figure.mjs', 'inspect-preview.mjs', 'recover-preview.mjs', 'run-native.mjs', 'freeze-author.mjs'].map(name => binding(path.join(home, name))),
  firstFailuresPreserved: report.firstCandidate,
  contentRepairCount: 1,
  technicalRecoveryCount: 1,
  imagesOpened: 4,
  remainingHolds: holds,
});
console.log(JSON.stringify({
  status: report.status, imagesOpened: 4, contentRepairs: 1, technicalRecoveries: 1,
  selected: Object.fromEntries(['spec', 'svg', 'render', 'preview'].map(key => [key, selected[key]])),
  report: binding(reportPath), freeze: binding(freezePath),
}, null, 2));
