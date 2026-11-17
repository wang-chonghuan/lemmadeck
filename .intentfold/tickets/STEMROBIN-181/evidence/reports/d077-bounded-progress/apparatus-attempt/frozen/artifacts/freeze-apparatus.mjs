import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

const root = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const base = path.dirname(fileURLToPath(import.meta.url));
assert.equal(process.cwd(), root);
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const bind = p => ({ path: p, sha256: hash(p), bytes: fs.statSync(p).size });
const write = (p, j) => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, `${JSON.stringify(j, null, 2)}\n`, { flag: 'wx' });
  return bind(p);
};
const copy = (from, rel) => {
  const original = bind(from);
  const p = path.join(base, 'frozen', rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.copyFileSync(from, p, fs.constants.COPYFILE_EXCL);
  assert.equal(hash(p), original.sha256);
  return { original, frozen: bind(p), exactCopy: true };
};
const oldFreeze = path.join(base, '../author-freeze.json');
const oldInventory = path.join(base, '../frozen/evidence/source-inventory.json');
assert.equal(hash(oldFreeze), '0fcf6458cdd6f5447a13185b9a87cf5b0aca2e93e12608296e56d17421a03050');
assert.equal(hash(oldInventory), 'd5bce351452a229bfb67d9454c62ecddc376e839f7ba796ad74353cdaf15a9ea');
const source = path.join(root, 'ssot-resources/soviet10year-textbooks/artifacts/10p/figures/fig-114.png');
assert.equal(hash(source), 'b87f6b0a98c6948fd384c61818fecc1c59507aa2e203587201dc26b408e3e96e');
const previous = {
  firstHOLD: copy(oldFreeze, 'before/first-HOLD-author-freeze.json'),
  pixelInventory: copy(oldInventory, 'source/first-pixel-inventory.json'),
  source: copy(source, 'source/fig-114.png'),
};
const textInputs = {};
for (const [locale, sha] of [
  ['zh', 'dc7aa68cac91370fd9e0680c95f649e0da09789a297e5d5bfafa9ce753044074'],
  ['en', '2b970b64f7e710efc4d752402b24f2e2b48f078f02dfc0905c96cebae444b10d'],
]) {
  const p = path.join(root, `.intentfold/tickets/STEMROBIN-181/tmp/d065-n58-text-repair/frozen/${locale}/lesson.template.json`);
  assert.equal(hash(p), sha);
  textInputs[locale] = bind(p);
  const ex = path.join(root, `.intentfold/tickets/STEMROBIN-181/tmp/d065-n58-text-repair/frozen/${locale}/exercises.template.json`);
  assert.equal(hash(ex), '1e727e2121cd32133a7e4a7ac0eba47151285934f0423ec6dc8b16f74287bdb3');
}
const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
  const p = path.join(dir, entry.name);
  if (dir === base && entry.name === 'frozen') return [];
  return entry.isDirectory() ? walk(p) : [p];
});
const files = walk(base);
const records = {};
for (const p of files) {
  const rel = path.relative(base, p);
  records[rel] = copy(p, `artifacts/${rel}`);
}
const draft = JSON.parse(fs.readFileSync(path.join(base, 'initial/draft.command.json')));
const initialNative = JSON.parse(fs.readFileSync(path.join(base, 'initial/native.command.json')));
const repairNative = JSON.parse(fs.readFileSync(path.join(base, 'repair1/native.command.json')));
assert.equal(draft.exit, 0);
assert.equal(initialNative.exit, 0);
assert.equal(repairNative.exit, 0);
const preview = JSON.parse(fs.readFileSync(path.join(base, 'previews/preview-evidence.json')));
const observation = JSON.parse(fs.readFileSync(path.join(base, 'author-observation.json')));
assert.equal(preview.checkResult, 'pass-author-preview-only');
assert.equal(observation.imageLedger.length, 8);
const commandEvidence = write(path.join(base, 'frozen/evidence/command-summary.json'), {
  schema: 'd067/fig114-apparatus-command-summary@1',
  cwd: root,
  scope: 'author-only one apparatus candidate plus sole targeted coil-clearance repair',
  buildSpec: { command: 'node apparatus-attempt/build-spec.mjs', exit: 0, invocations: 1 },
  draft: { explicitInvocations: 1, exit: draft.exit, receipt: records['initial/draft.command.json'].frozen },
  native: {
    invocations: 2,
    initialExit: initialNative.exit,
    repair1Exit: repairNative.exit,
    rendererInternalDraftValidationInvocations: 2,
    explicitDraftValidationWasNotRerun: true,
    receipts: [records['initial/native.command.json'].frozen, records['repair1/native.command.json'].frozen],
  },
  targetedRepair: { command: 'node apparatus-attempt/repair-coil-clearance.mjs', exit: 0, invocations: 1, finding: 'N58-FIG114-COIL-03' },
  authorPreview: {
    command: 'node apparatus-attempt/preview-and-check.mjs', exit: 0, invocations: 1,
    browser: 'isolated headless existing app Playwright Chromium',
    widths: preview.previews.map(p => ({
      containerPx: p.containerWidth, mediaPx: p.mediaWidth, minTextPx: p.minTextPx,
      reachedScrollEndPx: p.end.scrollLeft, labelCollisionCount: p.overlaps.length,
    })),
  },
  browserLaunches: 3,
  crop: { invocations: 1, exit: 0, readableLabelObtained: false, artifact: records['label-02.crop6x.png'].frozen },
  sourceSVGTextRead: {
    invocations: 1,
    sha256: '3337b3c6746f99ed3aa5d650d852cd2ca4330e837cc3721e728af7985b1dc4cc',
    screenOpenedAsImage: false,
    onlyUsedAsSourceContourText: true,
  },
  sourceFullPNGReopens: 0,
  otherImagesPagesAnswersReads: 0,
  fullLessonNativeDisplayInvocations: 0,
  independentReviewOrGateInvocations: 0,
  freeze: { command: 'node apparatus-attempt/freeze-apparatus.mjs', exit: 0, invocations: 1 },
});
const beforeAfter = write(path.join(base, 'frozen/evidence/author-before-after.json'), {
  schema: 'd067/fig114-apparatus-before-after@1',
  before: {
    firstAuthorHOLD: previous.firstHOLD,
    previousSourceInventory: previous.pixelInventory,
    spec: null,
    rendererInvocations: 0,
    newContextImageCount: 1,
    inheritedParentImageCount: 24,
  },
  initial: {
    spec: records['initial/fig-114.spec.json'].frozen,
    svg: records['initial/fig-114.svg'].frozen,
    render: records['initial/fig-114.render.json'].frozen,
    authorFinding: 'N58-FIG114-COIL-03',
    nativeStatus: 'pass', independentApproval: false, bytesPreserved: true,
  },
  after: {
    selectedSpec: records['repair1/fig-114.spec.json'].frozen,
    selectedSVG: records['repair1/fig-114.svg'].frozen,
    selectedRender: records['repair1/fig-114.render.json'].frozen,
    geometry: records['repair1/geometry.json'].frozen,
    nativeStatus: 'pass',
    authorPreviewOnly: true,
    independentlyReviewed: false,
    localLabelHOLD: 'N58-FIG114-LABEL-02',
    promotable: false,
    newContextImageCount: 8,
    inheritedParentImageCount: 24,
  },
  humanTargetDescriptionCorrectionNotGeometryRepair: true,
  geometryRepairsConsumed: 1,
  oldTemplateHOLDFAILBytesChanged: false,
  sourceChanged: false,
  textChangedOrReviewedAgain: false,
});
for (const record of Object.values(records)) assert.equal(hash(record.original.path), record.original.sha256);
assert.equal(hash(oldFreeze), previous.firstHOLD.original.sha256);
assert.equal(hash(oldInventory), previous.pixelInventory.original.sha256);
const freeze = write(path.join(base, 'author-freeze.json'), {
  schema: 'd067/n58-fig114-apparatus-author-freeze@1',
  createdAt: new Date().toISOString(),
  ticket: 'STEMROBIN-181',
  lesson: 'phy10-c1-s6-n58',
  figure: 'fig-114',
  role: 'temporary bounded fresh figure author; not a permanent A-D worker or independent reviewer',
  status: 'author-only-candidate-frozen-independent-figure-review-pending-local-label-HOLD',
  source: previous.source,
  sourceInventory: {
    initialPixelObservation: previous.pixelInventory,
    mappedFactsAndSeparateAdditions: records['repair1/geometry.json'].frozen,
    sourceLabelUnknown: 'N58-FIG114-LABEL-02',
    initialSourceFullOpenCount: 1,
    continuationFullSourceOpenCount: 0,
  },
  textInputs,
  previousFirstHOLD: previous.firstHOLD,
  candidate: {
    mode: 'deterministic',
    spec: records['repair1/fig-114.spec.json'].frozen,
    svg: records['repair1/fig-114.svg'].frozen,
    render: records['repair1/fig-114.render.json'].frozen,
    nativePreview: records['repair1/fig-114.native.png'].frozen,
    nativeStatus: 'pass',
    draftStatus: 'pass',
    outputContract: 'author-only temp deterministic spec+SVG+render; no review or promotion contract supplied',
  },
  evidence: {
    commandSummary: commandEvidence,
    beforeAfter,
    authorObservation: records['author-observation.json'].frozen,
    topology: records['previews/topology-evidence.json'].frozen,
    preview: records['previews/preview-evidence.json'].frozen,
    repairFinding: records['repair1/repair-finding.json'].frozen,
  },
  artifacts: records,
  imageBudget: {
    priorContextCount: 1,
    newImagesThisContinuation: 7,
    cumulativeThisFreshContext: 8,
    batches: [1, 7],
    perBatchMaximum: 8,
    contextMaximum: 24,
    inheritedParent24Untouched: true,
    imagePayloadReturned: false,
  },
  stageCounts: { explicitDraft: 1, native: 2, rendererInternalValidation: 2, geometryRepair: 1, authorPreview: 1, independentReview: 0, fullLessonNativeDisplay: 0 },
  unresolved: [
    'N58-FIG114-LABEL-02: original small voltage suffix remains unknown. U_audio is a separately declared edition-text-supported modern notation, not a recovered source fact.',
    'N58-FIG114-CROP-TECH-04: the sole allowed crop output was unreadable; its bytes and actual exit are retained, with no retry.',
    'Independent figure review remains pending and must judge this exact hash-bound apparatus candidate, its source topology, regularized trace and label notation.',
  ],
  preservation: {
    oldFirstHOLDAndPixelInventoryExact: true,
    initialFailureFindingAndOutputBytesRetained: true,
    specifiedSourceAndTextHashesUnchanged: true,
    originalZeroTasksUnchanged: true,
    noOriginalTemplateFAILHOLDModified: true,
    noSOURCE_RAW_SCI_ZHEN_ReviewReplay: true,
  },
  boundary: {
    cwd: root,
    writesOnlyUnder: base,
    originalBranch: 'codex/STEMROBIN-181-textbooks',
    newChatWorktreeBranch: false,
    paidGeneration: false,
    browser: 'isolated headless only',
    userWindowProfileOrCDPUsed: false,
    skillDependencyApplicationProductionWrites: false,
    databaseUseCommitPush: false,
    manualSVGEdits: false,
    otherPagesImagesAnswersViewed: false,
  },
  notClaimed: { independentlyApproved: false, sourceSuffixResolved: false, fullLessonPASS: false, ready: false, promotable: false, published: false },
});
console.log(JSON.stringify({
  freeze,
  spec: records['repair1/fig-114.spec.json'].frozen,
  svg: records['repair1/fig-114.svg'].frozen,
  render: records['repair1/fig-114.render.json'].frozen,
  geometry: records['repair1/geometry.json'].frozen,
  commandSummary: commandEvidence,
  beforeAfter,
  imageCount: 8,
}, null, 2));
