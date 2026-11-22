import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const repo = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck';
const prior = path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp/n32-fig204206-author-first-10/fig-205');
const digest = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const bind = (file) => ({ path: file, sha256: digest(file), bytes: fs.statSync(file).size });
const own = (name) => path.join(root, name);
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const save = (file, value) => fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
assert.ok(!fs.existsSync(own('report.json')) && !fs.existsSync(own('manifest.json')));
const originalExpected = {
  'spec.r1.json': '02ca84a88c11e5bf468177457f91f72735f540754218fad5da9f24d5d3ecac6e',
  'context.json': '502077b616ba57f5577d62e6e95b898c23e0bedeb28a98f1a74867053fefd31e',
  'FIRST.json': '4e2bfcbdbf4f948b54bb6f5756b9033ed99faceb9b656924ee3670fdbc54d71e',
  'FIRST.freeze.json': 'b76f100737456f8b50af7c26dae605036cbc19a953f7936ed1f6cd3a77edceaf',
  'hold.json': 'c843b4999c27a53583f2e48acefebf629232d64a0b75a259fb31ead768f229d5',
  'failure.r1.json': 'a42d45dc94465f33f6ec6ec21be5dc3316e465459b0142dda12a81cdedac29ab',
  'fig-205.r1.render.json': 'bff4c049efb71d4e8b05c88eac7159894718ffe2ce3e814e544327db09a7ac88',
};
const originals = Object.entries(originalExpected).map(([name, sha256]) => {
  const binding = bind(path.join(prior, name));
  assert.equal(binding.sha256, sha256, `Original ${name} changed.`);
  return binding;
});
const spec = read(own('spec.r2.json'));
const baseline = read(path.join(prior, 'spec.r1.json'));
const context = read(path.join(prior, 'context.json'));
assert.deepEqual(spec.source.authoritativeText, context.authoritativeText);
const contextBindings = context.bindings.map((expected) => {
  const current = bind(expected.path);
  assert.equal(current.sha256, expected.sha256);
  return current;
});
const restored = structuredClone(spec);
const bIndex = baseline.objects.findIndex((object) => object.id === 's205-B');
restored.objects[bIndex].labelPlacement = structuredClone(baseline.objects[bIndex].labelPlacement);
assert.deepEqual(restored, baseline);
assert.deepEqual(spec.objects[bIndex].labelPlacement, { position: 'SE', offset: [10, 72] });
const first = read(own('FIRST.json'));
const firstFreeze = read(own('FIRST.freeze.json'));
assert.equal(fs.statSync(own('FIRST.json')).mode & 0o777, 0o444);
assert.equal(digest(own('FIRST.json')), firstFreeze.first.sha256);
assert.equal(first.constraints.priorAuthorFilesReadBeforeInventory, false);
const source = bind(path.join(repo, spec.source.image.path));
assert.equal(source.sha256, spec.source.image.sha256);
const render = read(own('fig-205.r2.render.json'));
assert.equal(render.status, 'pass');
assert.deepEqual(render.collisions, []);
assert.equal(render.spec.sha256, digest(own('spec.r2.json')));
assert.equal(render.output.svg.sha256, digest(own('fig-205.r2.svg')));
const mobile = read(own('mobile.r2.json'));
assert.equal(mobile.status, 'pass');
assert.deepEqual(mobile.results.map((result) => result.actualMedia.width), [300, 358]);
assert.equal(mobile.browser.closed, true);
const receipts = ['validate.r2.call.json', 'render.r2.call.json', 'mobile.r2.call.json'].map((name) => {
  const record = read(own(name));
  assert.equal(record.cwd, repo);
  assert.equal(record.exitCode, 0);
  assert.equal(record.signal, null);
  assert.equal(record.error, null);
  for (const expected of [
    ...record.inputs, ...record.tools, ...record.outputs,
    record.streams.stdout, record.streams.stderr,
  ]) {
    assert.equal(digest(expected.path), expected.sha256, `Receipt drift: ${expected.path}`);
  }
  return bind(own(name));
});
const ledger = read(own('image-ledger.json'));
assert.equal(ledger.chargedAttempts, 4);
for (const entry of ledger.entries) assert.equal(digest(entry.path), entry.sha256);
const historicalHold = read(path.join(prior, 'hold.json'));
const historicalRender = read(path.join(prior, 'fig-205.r1.render.json'));
const report = {
  schema: 'same188-6/bounded-offline-author-repair@1',
  ticket: 'STEMROBIN-188',
  assignment: 'SAME188-6/N32/fig-205/B-label-repair-author-13',
  role: 'AUTHOR_ONLY_NOT_REVIEW',
  disposition: 'AUTHOR_REPAIR_READY_FOR_INDEPENDENT_REVIEW',
  completedAt: new Date().toISOString(),
  ownedRoot: root,
  authority: {
    directInstruction: 'Bounded offline label-only repair, maximum two new content revisions, source-first inventory, no network/paid/DB/.env/app/dependency/Charter/canonical changes or commit/push/deployment.',
    humanDelegation: {
      path: path.join(repo, '.intentfold/tickets/STEMROBIN-188/plan.md'),
      section: '2026-11-20 latest authorization, lines 3044-3050',
      effect: 'Concrete ordinary repairs are delegated. Historical internal maximumContentRevisions=1 is not a new approval threshold.',
    },
    source,
    context: originals.find((item) => item.path.endsWith('/context.json')),
    contextBindings,
    authoritativeTextAndSourceInventoryUnchanged: true,
    sourceAlphabetAndTinyMarkUncertainties: 'Retained in the independent author FIRST; no spec source-inventory edits or answer-key construction.',
  },
  sourceFirst: {
    inventory: bind(own('FIRST.json')),
    freeze: bind(own('FIRST.freeze.json')),
    completedChmodThenStatThenShaSequentially: true,
    frozenModeOctal: '0444',
  },
  historicalEvidence: {
    bindings: originals,
    allOriginalFilesUnmodified: true,
    retainedOriginalFailedRenderAttempts: 2,
    originalFailureSummary: historicalHold.reason,
    originalContentRevisions: historicalHold.contentRevisions,
    maximumContentRevisionsHistoricalOnly: historicalHold.maximumContentRevisions,
    originalNativeStatus: historicalRender.status,
    originalCollisions: historicalRender.collisions,
    originalFailuresNotResetOrRewritten: true,
    originalBatchImageOrdinalPreservedInOriginalFIRST: 2,
  },
  revisions: {
    previousCumulativeContentRevisions: 1,
    newContentRevisions: 1,
    cumulativeContentRevisions: 2,
    authorizedMaximumNewContentRevisions: 2,
    cumulativeRevision3NotNeededOrRun: true,
    newFailedCandidates: [],
    previousFailedNativeAttempts: 2,
    newNativeRenderAttempts: 1,
    totalNativeRenderAttemptsIncludingHistoricalFailures: 3,
    newTechnicalRecoveries: 0,
  },
  labelOnlyDiff: {
    evidence: bind(own('diff.r2.json')),
    pointer: '/objects/5/labelPlacement/offset/1',
    owner: 's205-B',
    unchangedPoint: [340, 195],
    before: { position: 'SE', offset: [10, 48] },
    after: { position: 'SE', offset: [10, 72] },
    allOtherSpecFieldsBytePreserved: true,
    titleMetadataSourceInventoryGeometryAssertionsTextStylingDimensionsAndOtherLabelsChanged: false,
    svgHandEdited: false,
    rendererOrChecksChangedOrRelaxed: false,
  },
  finalBindings: {
    spec: bind(own('spec.r2.json')),
    render: bind(own('fig-205.r2.render.json')),
    svg: bind(own('fig-205.r2.svg')),
    nativePng: bind(own('fig-205.r2.native.png')),
    mobileReport: bind(own('mobile.r2.json')),
    mobile300: bind(own('fig-205.r2.media300.png')),
    mobile358: bind(own('fig-205.r2.media358.png')),
  },
  actualNativeStatuses: {
    validator: { status: 'pass', exitCode: 0, standaloneCalls: 1 },
    renderer: { status: render.status, exitCode: 0, calls: 1, collisions: render.collisions },
    intrinsicValidation: 'render_spec.mjs performs its normal embedded validation; it was neither disabled nor replayed separately.',
    displayChecks: render.displayChecks,
    objects: render.objects,
    labels: render.labels,
  },
  authorDisplayEvidence: {
    nativeFullResolution: 'Inspected once, B clear and associated with the common b/c/p point.',
    mobile: mobile.results.map((result) => ({
      status: result.status,
      actualMedia: result.actualMedia,
      measuredMinTextPx: result.measuredMinPx,
      screenshot: result.screenshot,
      pixels: result.pixels,
      authorObservation: ledger.entries.find((entry) => entry.path === result.screenshot.path).observation,
    })),
    headlessOfflineOnly: true,
    liveProductAcceptanceNotRun: true,
    independentReviewNotPerformed: true,
  },
  execution: {
    receipts,
    streamsRetained: true,
    changedCandidateValidatorAndRendererEachCalledOnce: true,
    unchangedSourceOtherFigureAndPassedLessonStagesReplayed: false,
    activeExecSessions: [],
    ownedBrowserClosed: true,
  },
  imageLedger: bind(own('image-ledger.json')),
  images: { chargedAttempts: 4, maximum: 8, contextUsage: 4, contextMaximum: 24, failedOpens: 0, parentPermanentUsage: '24/24', imagesReturnedToParent: 0 },
  pending: ['Sole independent source/math/display review elsewhere; no review@1 authored.', 'No promotion or canonical replacement.'],
  boundaries: {
    writesOutsideOwnedRoot: false,
    prohibitedInFlightRootsRead: false,
    networkCalls: 0,
    paidCalls: 0,
    dbCalls: 0,
    envAppDependencyCharterChanges: false,
    canonicalAssetChanges: false,
    commitPushDeployment: false,
  },
  activeExecSessions: [],
};
save(own('report.json'), report);
const manifest = {
  schema: 'same188-6/author-repair-manifest@1',
  role: 'AUTHOR_ONLY_NOT_REVIEW',
  ownedRoot: root,
  disposition: report.disposition,
  report: bind(own('report.json')),
  cumulativeContentRevisions: 2,
  imageAttempts: 4,
  finalBindings: report.finalBindings,
  artifacts: fs.readdirSync(root).sort().filter((name) => name !== 'manifest.json').map((name) => bind(own(name))),
  originalEvidenceReferences: originals,
  independentReview: 'pending',
  activeExecSessions: [],
};
save(own('manifest.json'), manifest);
console.log(JSON.stringify({ report: bind(own('report.json')), manifest: bind(own('manifest.json')), finalBindings: report.finalBindings, activeExecSessions: [] }, null, 2));
