import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const ROOT = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck';
assert.equal(process.cwd(), ROOT);
const OUT = path.join(ROOT, '.tmp/stemrobin-184-six/n47-offline-recovery');
const BASE = path.join(ROOT, '.tmp/stemrobin-184-six');
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const rel = file => path.relative(ROOT, file);
const reads = [];
const bind = (file, purpose) => {
  const bytes = fs.readFileSync(file);
  const item = { path: rel(file), bytes: bytes.length, sha256: sha(bytes), purpose };
  reads.push(item);
  return item;
};
const load = file => {
  bind(file, 'Own recovery evidence/observations for text-only packaging');
  return JSON.parse(fs.readFileSync(file, 'utf8'));
};
const write = (file, value) => fs.writeFileSync(path.join(OUT, file),
  typeof value === 'string' ? value : JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
assert(!fs.existsSync(path.join(OUT, 'report.json')));
const evidence = load(path.join(OUT, 'browser-evidence-headless.json'));
const headed = load(path.join(OUT, 'browser-evidence.json'));
const images = load(path.join(OUT, 'image-observations.json'));
const checkpoint = load(path.join(OUT, 'entry-checkpoint.json'));
assert.equal(headed.assertionVerdict, 'FAIL');
assert.equal(headed.gui.mode, 'headed');
assert.equal(headed.accounting.screenshotCreations, 0);
assert.equal(headed.cleanup.browserClosed, true);
assert.equal(evidence.gui.mode, 'headless');
assert.deepEqual(evidence.launchOptions, { headless: true, timeout: 30000 });
assert.equal(evidence.assertionVerdict, 'PASS');
assert.equal(evidence.cleanup.browserClosed, true);
assert.equal(evidence.screenshots.length, 2);
assert.equal(images.observations.length, 2);
assert.equal(images.actualImageToolViews, 2);
assert.equal(images.cumulativeImageToolViews, 8);
assert(images.observations.every(x => x.actualObserved && x.actualToolCalls === 1));
for (const observation of images.observations) {
  const capture = evidence.screenshots.find(x => x.viewport.id === observation.viewport);
  assert.equal(capture.path, observation.path);
  assert.equal(capture.sha256, observation.sha256);
  const actual = bind(path.join(ROOT, capture.path), 'Current two capture SHA bindings only; no PNG decode or image reopen');
  assert.equal(actual.sha256, capture.sha256);
}
const inputs = [...new Map(evidence.bindings.map(x => [x.path, x])).values()];
for (const binding of inputs) {
  const current = bind(path.resolve(ROOT, binding.path), 'Unchanged authorized input verification; no browser');
  assert.equal(current.sha256, binding.sha256);
  assert.equal(current.bytes, binding.bytes);
}
const firstPackageManifest = bind(path.join(BASE, 'n47-offline/hash-manifest.json'),
  'Original frozen first-package manifest text/raw SHA only; no old screenshot reads');
assert.equal(firstPackageManifest.sha256, '840cd5bead575dc7347184504c78ef275ee872d0ef8238aec6d16f982f99cc23');
const diagnosisManifest = bind(path.join(BASE, 'n47-offline-diagnosis/hash-manifest.json'),
  'Frozen diagnosis manifest unchanged SHA only');
assert.equal(diagnosisManifest.sha256, '739fb4aeb0197b335dbc99c3b54b361b4b607b08e0bb30b144b46a732212e226');
const stages = [];
fs.mkdirSync(path.join(OUT, 'execution'));
for (const [label, stage] of [
  ['headed-first', 'n47-offline-affected-layout-recovery-first'],
  ['headless-prelaunch-first', 'n47-offline-affected-layout-recovery-headless-first'],
  ['headless-entry', 'n47-offline-affected-layout-recovery-headless-entry'],
]) {
  const prefix = path.join(BASE, 'stages', stage);
  const bindings = [];
  for (const suffix of ['stdout', 'stderr', 'receipt.json']) {
    const source = `${prefix}.${suffix}`;
    bindings.push(bind(source, 'Actual unique recovery-stage output; all failures retained'));
    fs.copyFileSync(source, path.join(OUT, 'execution', `${label}.${suffix}`), fs.constants.COPYFILE_EXCL);
  }
  const receipt = JSON.parse(fs.readFileSync(`${prefix}.receipt.json`, 'utf8'));
  assert.equal(receipt.cwd, ROOT);
  stages.push({ label, stage, receipt, bindings });
}
assert.equal(stages[0].receipt.exitCode, 1);
assert.equal(stages[1].receipt.exitCode, 1);
assert.equal(stages[2].receipt.exitCode, 0);
const coverageAssertions = images.observations.map(x => ({
  ...x.coverageAssertion, evidence: { path: x.path, sha256: x.sha256,
    actualToolViews: x.actualToolCalls, cumulativeViewOrder: x.orderCumulative },
}));
const unresolvedFailures = coverageAssertions.filter(x => !x.passed).map(x => ({
  ...x, status: 'UNRESOLVED', standaloneProductDefect: 'UNKNOWN',
  note: 'No choices visual PASS. Image budget8/8 exhausted; no extra screenshot, crop, decode, image reopen or browser retry authorized or performed.',
}));
const accounting = {
  ...evidence.accounting,
  actualImageToolViews: images.observations.reduce((sum, x) => sum + x.actualToolCalls, 0),
  cumulativeImageToolViews: 6 + images.observations.reduce((sum, x) => sum + x.actualToolCalls, 0),
  screenshotCreations: evidence.screenshots.length,
  cumulativeScreenshotCreations: 6 + evidence.screenshots.length,
  stoppedHeadedRecoveryScreenshotCreations: 0,
  stoppedHeadedRecoveryImageViews: 0,
  prelaunchFailedHeadlessBrowserLaunches: 0,
  prelaunchFailedHeadlessScreenshotCreations: 0,
  newNativeClicks: 0, inheritedNativeClicks: 64,
  recoveryBrowserTransactions: 2,
  recoveryBrowserModesActuallyUsed: ['headed-stopped-first', 'headless-final-entry'],
  recoveryProcessInvocations: 3,
  currentEntryBrowserTransactions: 1,
  remainingImageViews: 0, additionalImagesOrDecodes: 0,
  parentImagesOrDecodes: 0, hiddenBrowserImageInternals: 'UNKNOWN',
};
const frameSummaries = evidence.views.flatMap(v => v.frames.map(f => ({
  viewport: v.viewport, kind: f.kind, frameBox: f.frameBox,
  document: f.measurement.document, affectedContainerCount: f.measurement.containers.length,
  maxRangeTopExcess: Math.max(...f.measurement.containers.map(x => x.maxTopExcess)),
  maxRangeBottomExcess: Math.max(...f.measurement.containers.map(x => x.maxBottomExcess)),
  verticalScrollbarEligibleCount: f.measurement.containers.filter(x => x.scrollbars.verticalScrollbarEligible).length,
  verticalScrollbarGutters: [...new Set(f.measurement.containers.map(x => x.scrollbars.verticalGutterPx))],
  bodySha256: f.measurement.bodySha256,
  renderSignatureSha256: f.measurement.renderSignatureSha256,
  spacing: f.measurement.controls, endpoints: f.endpoints,
  paintedChoicesCoverage: f.kind === 'choices' ? 'FAIL: blank capture region' : 'Observed repaired text',
})));
const report = {
  schema: 'stemrobin1846/n47-final-affected-recovery-review@1',
  createdAt: new Date().toISOString(), root: ROOT, finish: 'review',
  assertionVerdict: unresolvedFailures.length ? 'FAIL' : evidence.assertionVerdict,
  visualVerdict: images.observations.every(x => x.verdict === 'PASS') ? 'PASS' : 'FAIL',
  overallVerdict: 'FAIL',
  browserDomAssertionVerdict: evidence.assertionVerdict,
  browserDomAssertions: { executed: evidence.assertions.length,
    passed: evidence.assertions.filter(x => x.passed).length,
    evidence: path.join(OUT, 'browser-evidence-headless.json') },
  finalPaintedCoverageAssertions: coverageAssertions,
  explanation: '111 actual DOM assertions passed, but the two actual screenshot observations show blank choices iframe regions. Final assertionVerdict includes failed painted-coverage requirements; no visual PASS or complete two-surface recovery is claimed.',
  scope: { authorized: evidence.scope, harness: 'Two actual repaired file iframes, test framing only, not product UI.',
    writtenOpened: false, originalImagesReopened: false,
    contentMathSourceGatesReplayed: false, nativeClicksReplayed: false,
    dbServerKeyboardPublisherAcceptance: false, strictFullSourceApproval: false,
    sourcePreviewArtifactsToolingModifiedByReviewer: false,
    firstOriginalFail: 'FAIL retained; no original package rewritten',
    firstPackageManifest, diagnosisManifest,
    previousHoldsAndUnknowns: 'Unchanged; choices repaired visual acceptance remains HOLD_UNOBSERVED.',
    parentReportedRepairMaterializeHistory: 'Parent reports first materialize exit1 before writes, affected materialize recovery exit0. Those parent-run stages were not opened or re-run by this checker.' },
  unresolvedFailures,
  observations: images.observations,
  accounting, cleanup: { browserClosed: evidence.cleanup.browserClosed,
    currentEntryContextsClosed: evidence.cleanup.contextsClosed,
    stoppedHeadedBrowserClosed: headed.cleanup.browserClosed,
    stoppedHeadedContextsClosed: headed.cleanup.contextsClosed,
    filesMode: '0444', treeMode: '0555',
    freezeVerification: 'This packager verifies all owned modes and manifest hashes after chmod.' },
  entryHistory: { checkpoint,
    stoppedHeadedFirst: { assertionVerdict: headed.assertionVerdict,
      actualGui: headed.gui, started: headed.started, ended: headed.ended,
      screenshotCreations: 0, newImageViews: 0,
      unresolvedTechnicalFailures: headed.unresolvedFailures, cleanup: headed.cleanup },
    prelaunchHeadlessFirst: { stageExitCode: 1, browserLaunches: 0,
      failure: 'EEXIST on existing owned captures directory; invoked checker retained unchanged, output not redirected.' },
    correctedHeadlessEntry: { actualGui: evidence.gui, launchOptions: evidence.launchOptions,
      stageExitCode: 0, newScreenshots: 2, newImageViews: 2 },
    stages },
  inheritedEvidence: evidence.inherited,
  byteAndRenderBindings: inputs, frameSummaries,
  screenshots: evidence.screenshots.map(x => ({ ...x,
    imageToolViewed: true, actualNewImageToolViews: 1,
    contentShown: 'Repaired text only; choices region blank despite full DOM geometry.' })),
  endpointLimitations: frameSummaries.filter(x => x.endpoints.length).map(x => ({
    viewport: x.viewport.id, kind: x.kind,
    note: 'Screenshot is left-reset; the complete oversized expression is not shown simultaneously. Both endpoints were actually reached and unmasked hit-tested, then reset.',
    dimensions: x.endpoints.map(e => ({ clientWidth: e.clientWidth,
      scrollWidth: e.scrollWidth, maxScroll: e.maxScroll, passed: e.passed })),
  })),
  noClippingWaiver: 'All measured full descendant Range bounds are contained with exact0 top/bottom excess. This does not replace missing painted choices coverage.',
  handoff: { parentMustFullyConsumeAndActuallyCloseReviewer: true,
    imagesToParent: 0, textOnly: true, imageBudgetExhausted: true,
    nextAction: 'Retain FAIL/HOLD. No further screenshot/view/replay within this exhausted8/8 assignment.' },
};
assert.equal(accounting.actualImageToolViews, 2);
assert.equal(accounting.cumulativeImageToolViews, 8);
assert.equal(report.assertionVerdict, 'FAIL');
assert.equal(report.visualVerdict, 'FAIL');
write('report.json', report);
const md = [
  '# n47 Final Affected Recovery',
  '',
  '**Assertion verdict: FAIL. Visual verdict: FAIL.** Final two-surface image coverage is incomplete.',
  '',
  '## Finding',
  '',
  'Both actual composite screenshots paint repaired text at the top but leave the expected choices iframe region blank white. Therefore choices parentheses/spacing/control visual recovery is HOLD_UNOBSERVED, not PASS. The pixels do not prove the standalone repaired choices file is blank; this is a harness/capture coverage failure.',
  '',
  'The111 headless DOM assertions actually passed:12 text and49 choice containers per viewport contain full descendant Range bounds with0 top/bottom excess; local vertical gutters/eligibility0; exact innerWidth/clientWidth1440 or390; no document sideways overflow; body and rendering signatures equal separately measured files. Those measurements cannot substitute for missing painted choices coverage.',
  '',
  '## Two Actual Observations',
  '',
  ...images.observations.flatMap(x => [
    `### ${x.viewport}: FAIL`,
    '',
    x.textSurfaceObservation,
    '',
    x.choicesSurfaceObservation,
    '',
    `Capture SHA256: ${x.sha256}`,
    '',
  ]),
  '## Actual Accounting',
  '',
  '- New screenshots2; new actual image-tool views2, one per file. First6 + new2 = cumulative8/8. No remaining views, extra screenshots/crops/reopens/manual decodes or further browser retry.',
  '- New native clicks0. Original64 trusted clicks/content PASS are inherited by bound unchanged body bytes, not replayed. Written was not opened or navigated.',
  '- Parent images/decodes0; hidden browser/image internals UNKNOWN.',
  '- Long formulas were reset left. Desktop text endpoint window685/697px, maxScroll12px; mobile windows358/545,358/697,358/480px, maxScroll187,339,122px. Both endpoints were reached and hit-tested. A single left-reset image conceals each right endpoint.',
  '',
  '## Retained Entry History',
  '',
  '- Original affected recovery first invoked the headed checker before the correction. It waited on below-fold iframe font readiness, was closed with TERM to its exact owned process, and retained exit1/54 assertions/0 screenshots/0 views. Browser closure is recorded.',
  '- First headless working copy failed before any browser launch: EEXIST recreating the already-owned empty captures directory. Exit1 and invoked checker are retained; no redirect or overwrite.',
  '- Distinct corrected entry used exactly chromium.launch({headless:true,timeout:30000}), no headed attempt/fallback/CDP/user profile. It reused the verified empty owned directory, warmed iframe font readiness, retained bounded10s waits, exited0 and closed both contexts/browser.',
  '- Three process entries, two actual recovery browser transactions: headed1 and headless1. Both earlier failures, scripts and complete stdout/stderr/receipts are preserved.',
  '',
  'Original n47-offline FAIL and diagnosis packages were not changed; their frozen manifest hashes remain unchanged. This checker did not modify source, repaired previews, artifacts, renderer, charter or stable skills.',
  '',
  '## Custody',
  '',
  'report.json gives assertions, observations, entry history, inherited evidence, signatures and exact accounting. browser-evidence-headless.json intentionally retains its pre-observation DOM PASS/PENDING visual state; final report adds the two actual failed painted-coverage assertions. entry-checkpoint.json preserves the reported channel correction history.',
  '',
  'All owned files are frozen0444 and directories0555, with hashes verified after freeze. hash-manifest.json binds the package excluding its unavoidable self-reference; final manifest SHA is emitted in the terminal receipt. Parent must consume the text/structured evidence and actually close this reviewer. No source/server/keyboard/DB/publication/strict-source acceptance is claimed.',
  '',
].join('\n');
write('report.md', md);
write('ledger.json', {
  schema: 'stemrobin1846/n47-recovery-read-execution-image-ledger@1',
  root: ROOT, explicitCwdEveryExec: true,
  executions: [
    { command: 'ls -ld .tmp/stemrobin-184-six/n47-offline-recovery', exitCode: 1, note: 'Expected absent owned directory' },
    { command: "sed -n '1,260p' .tmp/stemrobin-184-six/n47-preview-repaired/manifest.json", exitCode: 0 },
    { commandSummary: 'node -e: SHA repair manifest, renderer, own first browser evidence and own diagnosis evidence', exitCode: 0 },
    { command: 'mkdir .tmp/stemrobin-184-six/n47-offline-recovery', exitCode: 0 },
    { stage: stages[0].stage, command: 'node .tmp/stemrobin-184-six/run-stage.mjs n47-offline-affected-layout-recovery-first node .tmp/stemrobin-184-six/n47-offline-recovery/checker.mjs',
      sessionId: 18984, polls: 5, exitCode: 1, actualBrowserMode: 'headed', screenshots: 0, views: 0 },
    { command: 'ls -l .tmp/stemrobin-184-six/n47-offline-recovery/captures .tmp/stemrobin-184-six/n47-offline-recovery/browser-evidence.json', exitCode: 1, note: 'Owned state only; evidence still pending, captures empty' },
    { command: "sed -n '1,260p' /Users/yong/.agents/skills/ips-chrome-background/SKILL.md", exitCode: 0 },
    { command: "pgrep -fl 'n47-offline-recovery/checker.mjs'", exitCode: 0, note: 'Exact task process match only' },
    { command: 'kill -TERM 48558', exitCode: 0, note: 'Owned checker only; no user browser/process close' },
    { commandSummary: 'node -e: read own stopped headed evidence and report actual GUI/accounting/failure before another browser execution', exitCode: 0 },
    { command: 'cp .tmp/stemrobin-184-six/n47-offline-recovery/checker.mjs .tmp/stemrobin-184-six/n47-offline-recovery/checker-headless.mjs', exitCode: 0, note: 'Mechanical working-copy creation; invoked original unchanged' },
    { stage: stages[1].stage, exitCode: 1, browserLaunches: 0, failure: 'EEXIST before launch', outputRedirected: false },
    { command: 'cp .tmp/stemrobin-184-six/n47-offline-recovery/checker-headless.mjs .tmp/stemrobin-184-six/n47-offline-recovery/checker-headless-entry.mjs', exitCode: 0, note: 'Preserve prelaunch-failed invoked copy' },
    { stage: stages[2].stage, command: 'node .tmp/stemrobin-184-six/run-stage.mjs n47-offline-affected-layout-recovery-headless-entry node .tmp/stemrobin-184-six/n47-offline-recovery/checker-headless-entry.mjs',
      sessionId: 98971, polls: 1, exitCode: 0, browserLaunches: 1, actualBrowserMode: 'headless', screenshots: 2 },
    { commandSummary: 'node -e: read own final headless evidence; print actual counts, dimensions, signatures and endpoint summaries', exitCode: 0 },
    { command: 'node .tmp/stemrobin-184-six/n47-offline-recovery/package.mjs',
      actualArgv: process.argv, actualCwd: process.cwd(), purpose: 'Packaging/hash/freeze only; no browser/image calls' },
  ],
  resumedPackagingOnlyExecutions: [
    { command: "sed -n '1,260p' .tmp/stemrobin-184-six/n47-offline-recovery/package.mjs",
      actualCwd: ROOT, exitCode: 0, purpose: 'Read unexecuted packager as text only' },
    { command: 'cat .tmp/stemrobin-184-six/n47-offline-recovery/image-observations.json .tmp/stemrobin-184-six/n47-offline-recovery/entry-checkpoint.json',
      actualCwd: ROOT, exitCode: 0, purpose: 'Read own preserved observations and entry history as text only' },
    { command: "sed -n '261,400p' .tmp/stemrobin-184-six/n47-offline-recovery/package.mjs",
      actualCwd: ROOT, exitCode: 0, purpose: 'Read remaining packager as text only' },
  ],
  browserReads: evidence.reads, stoppedHeadedReads: headed.reads, packagingReads: reads,
  imageToolCalls: images.observations.map(x => ({
    tool: images.tool, path: x.path, actualCalls: 1, cumulativeOrder: x.orderCumulative,
  })),
  accounting, manualCodeEdits: 'functions.apply_patch only; two cp commands create distinct working copies.',
  invocationPreservation: 'All three invoked checkers retained; no executed checker changed, first headed and headless-prelaunch exits remain1.',
  forbiddenActionsPerformed: [],
  writes: 'Own new recovery tree and user-mandated unique stage receipts only. No original/preview/artifact/app/charter/skill writes.',
});
function walk(dir) {
  const files = [], directories = [dir];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    assert(!entry.isSymbolicLink());
    if (entry.isDirectory()) {
      const child = walk(file); files.push(...child.files); directories.push(...child.directories);
    } else { assert(entry.isFile()); files.push(file); }
  }
  return { files, directories };
}
const before = walk(OUT);
const outputs = before.files.sort().map(file => {
  const bytes = fs.readFileSync(file);
  return { path: rel(file), bytes: bytes.length, sha256: sha(bytes), frozenMode: '0444' };
});
write('hash-manifest.json', {
  schema: 'stemrobin1846/n47-recovery-complete-hash-bindings@1',
  createdAt: new Date().toISOString(), root: ROOT,
  outputs, inputs, originalFrozenManifestBindings: [firstPackageManifest, diagnosisManifest],
  stageOutputs: stages.flatMap(x => x.bindings),
  self: { path: rel(path.join(OUT, 'hash-manifest.json')),
    binding: 'SHA emitted after freeze; excluded from self-referential output hash list' },
  freeze: { files: '0444', directories: '0555' },
  hiddenBrowserImageInternals: 'UNKNOWN',
});
const final = walk(OUT);
for (const file of final.files) fs.chmodSync(file, 0o444);
for (const dir of final.directories.sort((a, b) => b.length - a.length)) fs.chmodSync(dir, 0o555);
for (const file of final.files) assert.equal(fs.statSync(file).mode & 0o777, 0o444);
for (const dir of final.directories) assert.equal(fs.statSync(dir).mode & 0o777, 0o555);
for (const binding of outputs) assert.equal(sha(fs.readFileSync(path.resolve(ROOT, binding.path))), binding.sha256);
console.log(JSON.stringify({
  assertionVerdict: report.assertionVerdict, visualVerdict: report.visualVerdict,
  browserDomAssertionVerdict: report.browserDomAssertionVerdict,
  newScreenshots: accounting.screenshotCreations, actualImageToolViews: accounting.actualImageToolViews,
  cumulativeImageToolViews: accounting.cumulativeImageToolViews,
  newClicks: 0, inheritedClicks: 64, parentImagesOrDecodes: 0,
  hiddenBrowserImageInternals: 'UNKNOWN', remainingImageViews: 0,
  browserClosed: true, stoppedHeadedBrowserClosed: true,
  firstRecoveryStageExitCode: 1, prelaunchHeadlessStageExitCode: 1,
  correctedHeadlessEntryExitCode: 0, originalFirstGateRemainsFail: true,
  filesFrozen0444: true, treeFrozen0555: true, hashesVerifiedAfterFreeze: true,
  fileCount: final.files.length, directoryCount: final.directories.length,
  hashManifestSha256: sha(fs.readFileSync(path.join(OUT, 'hash-manifest.json'))),
  unresolvedFailures: unresolvedFailures.map(x => x.id),
  report: path.join(OUT, 'report.json'), reportMarkdown: path.join(OUT, 'report.md'),
  parentMustConsumeAndActuallyCloseReviewer: true,
}));
