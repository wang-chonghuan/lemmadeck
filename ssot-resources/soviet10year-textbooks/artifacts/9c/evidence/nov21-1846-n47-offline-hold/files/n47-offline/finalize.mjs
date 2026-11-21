import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const ROOT = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck';
assert.equal(process.cwd(), ROOT);
const OUT = path.join(ROOT, '.tmp/stemrobin-184-six/n47-offline');
const STAGE = path.join(ROOT, '.tmp/stemrobin-184-six/stages/n47-offline-browser-check-first');
const started = new Date().toISOString();
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const rel = file => path.relative(ROOT, file);
const reads = [];
const bind = (file, purpose = 'Packaging/hash binding only') => {
  const bytes = fs.readFileSync(file);
  const item = { path: rel(file), bytes: bytes.length, sha256: sha(bytes), purpose };
  reads.push(item);
  return item;
};
const load = file => {
  bind(file, 'Read owned evidence for packaging, no browser');
  return JSON.parse(fs.readFileSync(file, 'utf8'));
};
const write = (file, data) => fs.writeFileSync(path.join(OUT, file),
  typeof data === 'string' ? data : JSON.stringify(data, null, 2) + '\n', { flag: 'wx' });
assert(!fs.existsSync(path.join(OUT, 'report.json')));
const evidence = load(path.join(OUT, 'browser-evidence-first.json'));
const images = load(path.join(OUT, 'image-observations.json'));
const session = load(path.join(OUT, 'session-ledger.json'));
assert.equal(images.observations.length, 6);
assert.equal(images.actualImageToolViews, 6);
assert.equal(evidence.screenshots.length, 6);
assert.equal(evidence.accounting.screenshotCreations, 6);
assert(images.observations.every(x => x.actualObserved && x.toolCalls === 1));
assert.equal(new Set(images.observations.map(x => x.path)).size, 6);
for (const observation of images.observations) {
  const capture = evidence.screenshots.find(x => x.view === observation.view);
  assert(capture);
  assert.equal(capture.path, observation.path);
  assert.equal(capture.sha256, observation.sha256);
  const actual = bind(path.join(ROOT, observation.path), 'SHA only after the single image-tool observation; no explicit PNG decode');
  assert.equal(actual.sha256, capture.sha256);
}
assert.equal(evidence.nativeClicks.length, evidence.nativeClickCount);
assert(evidence.nativeClicks.every(x => x.nativeEvents.length === 1 && x.nativeEvents[0].isTrusted));
fs.mkdirSync(path.join(OUT, 'execution'));
const stageBindings = [];
for (const suffix of ['stdout', 'stderr', 'receipt.json']) {
  const source = `${STAGE}.${suffix}`;
  stageBindings.push(bind(source, 'Only this NEW mandatory first-stage output'));
  fs.copyFileSync(source, path.join(OUT, 'execution', `first.${suffix}`), fs.constants.COPYFILE_EXCL);
}
const receipt = JSON.parse(fs.readFileSync(`${STAGE}.receipt.json`, 'utf8'));
assert.equal(receipt.stage, 'n47-offline-browser-check-first');
assert.equal(receipt.cwd, ROOT);
assert.equal(receipt.exitCode, 1);
const guidance = [
  '.agents/skills/ld-s10y-image/SKILL.md',
  'app/node_modules/playwright-core/lib/tools/cli-client/skill/SKILL.md',
  '.claude/skills/ld-s10y-lesson/tools/htmlfrag.js',
  '.claude/skills/ld-s10y-lesson/tools/render_lesson.js',
  '.tmp/stemrobin-184-six/run-stage.mjs',
  'app/node_modules/playwright/index.mjs',
  'app/node_modules/playwright/package.json',
].map(file => bind(path.join(ROOT, file), 'Consulted guidance/tool/runtime binding; not production execution'));
const inputs = [...new Map(evidence.bindings.map(b => [b.path, b])).values()];
for (const b of inputs) {
  const current = bind(path.join(ROOT, b.path), 'Final unchanged binding verification only');
  assert.equal(current.sha256, b.sha256, `Concurrent input change: ${b.path}`);
  assert.equal(current.bytes, b.bytes);
}
const unresolvedFailures = [
  ...evidence.unresolvedFailures.map(x => ({
    id: x.id, type: x.classification, status: 'UNRESOLVED',
    evidence: 'browser-evidence-first.json assertions[] and views[].layout.clipping',
    flaggedRangeRecords: x.actual.length,
    note: 'Retained first FAIL. Text Range boxes may exceed painted glyph ink, but no technical resolution was attempted and no clipping pass is claimed.',
  })),
  {
    id: 'visual-local-vertical-scrollbars', type: 'visual-layout', status: 'UNRESOLVED',
    views: ['desktop-text', 'mobile-text'],
    evidence: images.observations.filter(x => x.defectIds.includes('visual-local-vertical-scrollbars'))
      .map(x => ({ path: x.path, sha256: x.sha256, observationOrder: x.order })),
    note: 'Actual screenshots show vertical mini-scrollbars on local math containers. Horizontal-only oversized-equation allowance does not waive this defect. Preview and source remain untouched.',
  },
];
const accounting = {
  ...evidence.accounting,
  actualImageToolViews: images.observations.reduce((sum, x) => sum + x.toolCalls, 0),
  screenshotCreationCount: evidence.screenshots.length,
  imageViewsByCapture: images.observations.map(x => ({ view: x.view, path: x.path, tool: images.tool, actualViews: x.toolCalls })),
  parentImagesOrDecodes: 0,
  manualPNGOrPillowDecodesOrOpens: 0,
  hiddenBrowserImageInternals: 'UNKNOWN',
  unusedReservedViews: 2, extraImageViews: 0,
  nativeClicks: evidence.nativeClicks.length,
  nativeClicksByView: evidence.views.filter(x => x.behavior).map(x => ({
    view: x.name, actual: evidence.nativeClicks.filter(click => click.view === x.name).length,
    derivedOptions: x.behavior.derivedOptionCount,
    trustedClickEvents: evidence.nativeClicks.filter(click => click.view === x.name)
      .reduce((sum, click) => sum + click.nativeEvents.filter(event => event.isTrusted).length, 0),
  })),
  installs: 0, networkDocs: 0, paidCalls: 0, browserRecoveries: 0,
};
const report = {
  schema: 'stemrobin1846/n47-offline-visual-behavior-review@1',
  root: ROOT, ticket: 'STEMROBIN-184/184-6', lesson: 'ana9-c4-s2-n47',
  finish: 'review', firstStage: receipt.stage, firstStageExitCode: receipt.exitCode,
  started: evidence.started, browserEnded: evidence.ended, finalizedAt: new Date().toISOString(),
  assertionVerdict: evidence.assertionVerdict,
  visualVerdict: images.observations.every(x => x.verdict === 'PASS') ? 'PASS' : 'FAIL',
  overallVerdict: 'FAIL',
  scope: {
    authorized: 'First offline file-only browser visual/native-option review of current n47 preview and final display content.',
    exclusions: ['live app', 'server judging', 'keyboard', 'DB', 'publisher', 'source/PDF/native production',
      'mathematical re-solving', 'independent choice semantics', 'strict full-source approval'],
    previousHoldsAndUnknowns: 'All prior HOLD/UNKNOWN statuses remain unchanged; no prior gate evidence was consumed.',
    sourceModified: false, previewModified: false, artifactsModified: false,
    pipelineModified: false, paidServicesUsed: false,
    proceduralDisclosure: session.readDisclosure,
  },
  environment: { browser: 'Chromium', version: evidence.browserVersion, gui: evidence.gui,
    freshOfflineContexts: evidence.cleanup.contextsClosed,
    remoteDependenciesObserved: 0, networkRequests: evidence.requests,
    offline: true, serverStarted: false },
  accounting,
  assertions: { executed: evidence.assertions.length,
    passed: evidence.assertions.filter(x => x.passed).length,
    failed: evidence.assertions.filter(x => !x.passed).length,
    unresolvedFailures, evidencePath: path.join(OUT, 'browser-evidence-first.json') },
  assertionEvidence: evidence.assertions.map(x => ({
    id: x.id, passed: x.passed, classification: x.classification,
    details: 'browser-evidence-first.json assertion with this id',
  })),
  nativeClicks: evidence.nativeClicks,
  contentEvidence: evidence.views.map(v => ({
    view: v.name, fonts: v.fonts, preservedContent: v.content,
    endContent: v.end, document: v.layout.document,
    localHorizontalScroll: v.localScroll,
    horizontalScrollLimitation: v.localScroll.length
      ? 'Left-reset full-page image does not show the whole oversized equation simultaneously; both endpoints were reached and hit-tested in DOM.'
      : null,
  })),
  visualObservations: images.observations,
  screenshots: evidence.screenshots.map(x => ({
    ...x, imageViewed: true, imageToolViews: 1,
    note: 'Generated once, SHA-bound, observed once through functions.view_image; no separate manual PNG/Pillow decode/open.',
  })),
  inputBindings: inputs, guidanceBindings: guidance, firstExecutionBindings: stageBindings,
  unresolvedFailures,
  cleanup: { browserClosed: evidence.cleanup.browserClosed,
    contextsClosed: evidence.cleanup.contextsClosed,
    ownedFilesMode: '0444', ownedTreeMode: '0555',
    freezeVerification: 'finalize.mjs verifies actual modes and all manifest hashes after chmod; terminal receipt is the final attestation.',
    parentAgentClose: 'NOT_CLAIMED; parent must fully consume these text/evidence files and actually close this checker agent.' },
  recovery: { performed: false, firstFailRetained: true,
    reason: 'Actual text-page visual defect is reported; choice clipping remains unresolved. No automatic extra image or whole-gate replay.' },
  handoff: { state: 'AWAITING_PARENT_FULL_CONSUMPTION_AND_ACTUAL_AGENT_CLOSE',
    parentMustRead: ['report.json', 'report.md', 'checker.mjs', 'browser-evidence-first.json',
      'image-observations.json', 'session-ledger.json', 'packaging-ledger.json',
      'hash-manifest.json', 'execution/first.stdout', 'execution/first.stderr',
      'execution/first.receipt.json'],
    imagesToParent: 0, textOnlyReturn: true },
};
assert.equal(report.cleanup.browserClosed, true);
assert.equal(report.accounting.actualImageToolViews, 6);
assert.equal(report.accounting.parentImagesOrDecodes, 0);
assert.equal(report.accounting.hiddenBrowserImageInternals, 'UNKNOWN');
assert.equal(report.assertionVerdict, 'FAIL');
write('report.json', report);
const markdown = [
  '# n47 First Offline Visual / Behavior Review',
  '',
  `Assertion verdict: **${report.assertionVerdict}**. Visual verdict: **${report.visualVerdict}**. Finish: review.`,
  '',
  'Offline file previews only; not live app, server/keyboard/DB acceptance or strict full-source approval. All prior HOLD/UNKNOWN statuses remain.',
  '',
  '## Unresolved Findings',
  '',
  '- Text desktop/mobile: actual screenshots show gray vertical mini-scrollbars on inline math. This is outside the horizontal-only oversized-formula allowance; no preview repair was made.',
  '- Choices desktop/mobile: first no-ink-clipping assertions each flag 56 parenthesis/ancestor range records. Full-page pixels do not show obvious missing curve segments, but Range bounds are not exact glyph ink. Neither failure was resolved or waived.',
  '',
  '## Actual Execution',
  '',
  `- One headed Chromium transaction (${evidence.browserVersion}), two fresh offline contexts; no GUI limitation.`,
  `- Mandatory stage ${receipt.stage}: exit ${receipt.exitCode}; original stdout/stderr/receipt preserved and copied under execution/.`,
  `- ${evidence.assertions.length} assertions: ${evidence.assertions.filter(x => x.passed).length} passed, ${evidence.assertions.filter(x => !x.passed).length} unresolved. No recovery or browser replay.`,
  '- Six full-page screenshot creations; six actual image-tool observations, one per file. Extra views 0; reserved views unused 2.',
  '- Manual PNG/Pillow decode/open 0; parentImagesOrDecodes 0; hiddenBrowserImageInternals UNKNOWN.',
  `- Native clicks: ${evidence.nativeClicks.length} (${accounting.nativeClicksByView.map(x => `${x.view} ${x.actual}`).join(', ')}), all with trusted events. Inventory derives four IDs and sixteen options from each actual DOM; every option was clicked and clicked again, with exclusive single selection and cross-question isolation asserted.`,
  '- Font readiness, six prose blocks, four exercises 378-381, four rendered display answers including mixed variables and all three 381 condition/zero/empty-domain paragraphs passed preservation assertions.',
  '- No raw dollar/KaTeX error, paragraph indentation, page-wide horizontal overflow or incoherent flow overlap was detected. Both static text/written navigation directions actually resolved at both viewports.',
  '- Choices expose native view/id projection, not answer/rationale/internal source payload; no answer semantics were re-reviewed.',
  '',
  '## Horizontal Scroll Limitation',
  '',
  ...evidence.views.filter(v => v.localScroll.length).map(v =>
    `- ${v.name}: ${v.localScroll.length} equation scroller(s), client/scroll widths `
    + v.localScroll.map(s => `${s.clientWidth}/${s.scrollWidth}px`).join(', ')
    + '. Both endpoints were reached and unmasked hit-tested, then reset left before capture. A single left-reset image cannot show the complete long expression at once.'),
  '',
  '## Six Single-View Observations',
  '',
  ...images.observations.flatMap(x => [
    `### ${x.order}. ${x.view}: ${x.verdict}`,
    '',
    x.observations,
    '',
    `SHA256: ${x.sha256}`,
    '',
  ]),
  '## Evidence And Scope',
  '',
  'report.json carries actual click states, assertion references, content/font/endpoint evidence and SHA-bound observations. browser-evidence-first.json retains full first-run facts; its imageViewed=false and PENDING visual status intentionally preserve its pre-observation state. The final report records the completed six observations.',
  '',
  'Read/execution disclosure: an initial over-broad filename search listed ticket/history names without reading their bodies; an extra guidance search scanned unrelated skill files without matching content. These are disclosed metadata/search overreach, not prior gate consumption. Source fields embedded in authorized modern JSON were ignored for judgement. No artifacts, source, preview or pipeline scripts were modified.',
  '',
  'hash-manifest.json binds all owned files except its unavoidable self-reference, plus inputs, consulted tooling/guidance and the NEW first-stage receipts. The manifest SHA is emitted after freeze. Owned files are frozen 0444 and directories 0555; finalizer verifies modes and hashes after chmod.',
  '',
  'Browser and both contexts are actually closed. Parent must fully consume the report/checker/evidence/ledgers/manifest and actually close this agent. Parent closure is not claimed here. Text-only handoff; do not reopen the six-image batch in the parent.',
  '',
].join('\n');
write('report.md', markdown);
write('packaging-ledger.json', {
  schema: 'stemrobin1846/n47-offline-packaging-ledger@1',
  command: 'node .tmp/stemrobin-184-six/n47-offline/finalize.mjs',
  actualCwd: process.cwd(), actualArgv: process.argv, started,
  browserCalls: 0, imageToolCalls: 0, explicitPNGDecodes: 0,
  reads, writes: ['report.json', 'report.md', 'packaging-ledger.json', 'hash-manifest.json',
    'execution/first.stdout', 'execution/first.stderr', 'execution/first.receipt.json'],
  subsequentActions: 'Hash all owned files, chmod every owned file 0444 and directory 0555, verify modes and hashes, emit final manifest SHA and exit.',
});
function walk(directory) {
  const files = [], directories = [directory];
  for (const item of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, item.name);
    assert(!item.isSymbolicLink(), 'No symlink ownership escape');
    if (item.isDirectory()) {
      const nested = walk(file);
      files.push(...nested.files); directories.push(...nested.directories);
    } else {
      assert(item.isFile());
      files.push(file);
    }
  }
  return { files, directories };
}
const before = walk(OUT);
const ownedBindings = before.files.sort().map(file => {
  const bytes = fs.readFileSync(file);
  return { path: rel(file), bytes: bytes.length, sha256: sha(bytes), frozenMode: '0444' };
});
write('hash-manifest.json', {
  schema: 'stemrobin1846/n47-offline-complete-bindings@1',
  createdAt: new Date().toISOString(), root: ROOT,
  ownedFiles: ownedBindings,
  self: { path: rel(path.join(OUT, 'hash-manifest.json')),
    sha256: 'Emitted by finalizer after freezing; excluded from self-referential hash list.' },
  inputs, guidance, firstStageOutputs: stageBindings,
  excludedPriorManifestRenderReferences: 'Old render output paths appear in input preview manifest metadata only. They were not opened or rehashed.',
  runtimeTransitiveInternals: 'Not individually enumerated. Installed app Playwright entry/package and actual Chromium version are bound; hidden browser/image internals UNKNOWN.',
  freeze: { files: '0444', directories: '0555', directoriesOwned: before.directories.map(rel) },
});
const final = walk(OUT);
for (const file of final.files) fs.chmodSync(file, 0o444);
for (const directory of final.directories.sort((a, b) => b.length - a.length)) fs.chmodSync(directory, 0o555);
for (const file of final.files) assert.equal(fs.statSync(file).mode & 0o777, 0o444);
for (const directory of final.directories) assert.equal(fs.statSync(directory).mode & 0o777, 0o555);
for (const b of ownedBindings) {
  const bytes = fs.readFileSync(path.join(ROOT, b.path));
  assert.equal(sha(bytes), b.sha256);
  assert.equal(bytes.length, b.bytes);
}
const manifestBytes = fs.readFileSync(path.join(OUT, 'hash-manifest.json'));
console.log(JSON.stringify({
  report: path.join(OUT, 'report.json'), reportMarkdown: path.join(OUT, 'report.md'),
  assertionVerdict: report.assertionVerdict, visualVerdict: report.visualVerdict,
  actualImageToolViews: report.accounting.actualImageToolViews,
  screenshotCreations: report.accounting.screenshotCreations,
  actualNativeClicks: report.accounting.nativeClicks,
  browserClosed: report.cleanup.browserClosed,
  ownedFileCount: final.files.length, ownedDirectoryCount: final.directories.length,
  actualFiles0444: true, actualTree0555: true, actualManifestHashesVerified: true,
  hashManifestSha256: sha(manifestBytes),
  unresolvedFailures: report.unresolvedFailures.map(x => x.id),
  firstStageExitCode: receipt.exitCode, firstFailRetained: true,
  parentMustFullyConsumeAndActuallyCloseAgent: true,
}));
