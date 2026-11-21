import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const ROOT = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck';
assert.equal(process.cwd(), ROOT);
const OUT = path.join(ROOT, '.tmp/stemrobin-184-six/n47-offline-diagnosis');
const ORIGINAL = path.join(ROOT, '.tmp/stemrobin-184-six/n47-offline');
const STAGE = path.join(ROOT, '.tmp/stemrobin-184-six/stages/n47-offline-affected-layout-diagnosis-first');
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const rel = file => path.relative(ROOT, file);
const reads = [];
const bind = (file, purpose) => {
  const bytes = fs.readFileSync(file);
  const binding = { path: rel(file), bytes: bytes.length, sha256: sha(bytes), purpose };
  reads.push(binding);
  return binding;
};
const write = (file, value) => fs.writeFileSync(path.join(OUT, file),
  typeof value === 'string' ? value : JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
assert(!fs.existsSync(path.join(OUT, 'report.json')));
bind(path.join(OUT, 'diagnosis-evidence.json'), 'Own technical diagnosis evidence');
const evidence = JSON.parse(fs.readFileSync(path.join(OUT, 'diagnosis-evidence.json'), 'utf8'));
assert.equal(evidence.hypothesisVerdict, 'SUPPORTED_BY_EXACT_DOM_METRICS');
assert.equal(evidence.cleanup.browserClosed, true);
assert.equal(evidence.accounting.screenshotCreations, 0);
assert.equal(evidence.accounting.actualImageToolViews, 0);
assert.equal(evidence.accounting.nativeClicks, 0);
assert.equal(evidence.custody.originalByteIdentical, true);
const originalFinalBindings = [];
for (const item of evidence.custody.before.files) {
  const file = path.join(ROOT, item.path);
  const actual = bind(file, 'Original frozen-package raw-byte custody, not image decode or history judgement');
  assert.equal(actual.sha256, item.sha256);
  assert.equal(actual.bytes, item.bytes);
  assert.equal((fs.statSync(file).mode & 0o777).toString(8), item.mode);
  originalFinalBindings.push(actual);
}
for (const item of evidence.custody.before.directories) {
  assert.equal((fs.statSync(path.join(ROOT, item.path)).mode & 0o777).toString(8), item.mode);
}
const previewBindings = evidence.reads.filter(x => x.purpose === 'Authorized current affected preview only');
for (const item of previewBindings) {
  const actual = bind(path.join(ROOT, item.path), 'Affected preview final unchanged SHA binding');
  assert.equal(actual.sha256, item.sha256);
}
fs.mkdirSync(path.join(OUT, 'execution'));
const stageBindings = [];
for (const suffix of ['stdout', 'stderr', 'receipt.json']) {
  const source = `${STAGE}.${suffix}`;
  stageBindings.push(bind(source, 'NEW unique affected diagnosis stage only'));
  fs.copyFileSync(source, path.join(OUT, 'execution', `first.${suffix}`), fs.constants.COPYFILE_EXCL);
}
const receipt = JSON.parse(fs.readFileSync(`${STAGE}.receipt.json`, 'utf8'));
assert.equal(receipt.stage, 'n47-offline-affected-layout-diagnosis-first');
assert.equal(receipt.exitCode, 0);
assert.equal(receipt.cwd, ROOT);
const summaries = evidence.views.map(v => ({
  view: v.name,
  eligibleContainers: v.before.containers.length,
  affectedContainers: v.affectedIndices.length,
  rangeProtrudingContainersBefore: v.before.containers.filter(x => !x.containsFullRangeBoundsExactly).length,
  rangeProtrudingContainersAfter: v.after.containers.filter(x => !x.containsFullRangeBoundsExactly).length,
  verticalScrollbarEligibleBefore: v.before.containers.filter(x => x.scrollbars.verticalScrollbarEligible).length,
  verticalScrollbarEligibleAfter: v.after.containers.filter(x => x.scrollbars.verticalScrollbarEligible).length,
  maxBeforeTopRangeExcessPx: Math.max(...v.before.containers.map(x => x.rangeBounds.topExcess)),
  maxBeforeBottomRangeExcessPx: Math.max(...v.before.containers.map(x => x.rangeBounds.bottomExcess)),
  maxAfterTopRangeExcessPx: Math.max(...v.after.containers.map(x => x.rangeBounds.topExcess)),
  maxAfterBottomRangeExcessPx: Math.max(...v.after.containers.map(x => x.rangeBounds.bottomExcess)),
  beforeDocument: v.before.document, afterDocument: v.after.document,
  beforeHorizontalEndpoints: v.beforeEndpoints,
  afterHorizontalEndpoints: v.afterEndpoints,
  afterMinimumVerticalSlackPx: Math.min(...v.after.containers.flatMap(x => [
    x.rangeBounds.minimumTop == null ? Infinity : x.rangeBounds.minimumTop - x.viewport.top,
    x.rangeBounds.maximumBottom == null ? Infinity : x.viewport.bottom - x.rangeBounds.maximumBottom,
  ])),
}));
const desktopText = evidence.views.find(x => x.name === 'desktop-text');
const desktopChoices = evidence.views.find(x => x.name === 'desktop-choices');
const samples = [
  { view: desktopText.name, pair: desktopText.pairs.find(x => x.index === 4) },
  { view: desktopChoices.name, pair: desktopChoices.pairs.find(x => x.optionId === 'A'
    && x.questionId === 'n47-affine-positive' && x.className === 'sr-nb') },
  { view: desktopChoices.name, pair: desktopChoices.pairs.find(x => x.optionId === 'A'
    && x.questionId === 'n47-affine-positive' && x.className === 'option-text') },
];
assert(samples.every(x => x.pair));
const css = fs.readFileSync(path.join(OUT, 'recommended.css'), 'utf8');
bind(path.join(OUT, 'recommended.css'), 'Exact tested CSS recommendation, no preview write');
const report = {
  schema: 'stemrobin1846/n47-bounded-technical-layout-diagnosis-report@1',
  createdAt: new Date().toISOString(), root: ROOT, finish: 'diagnosis-only',
  stage: receipt.stage, stageExitCode: receipt.exitCode,
  hypothesisVerdict: evidence.hypothesisVerdict,
  visualVerdict: 'NOT_PERFORMED; NO_VISUAL_PASS',
  scope: evidence.scope,
  originalFirstGate: {
    verdict: 'FAIL; retained unchanged',
    originalPackage: ORIGINAL,
    originalByteIdentical: true, originalFileCount: originalFinalBindings.length,
    originalFilesStill0444: true, originalTreeStill0555: true,
    originalManifestSha256: originalFinalBindings.find(x => x.path.endsWith('/hash-manifest.json')).sha256,
  },
  diagnosis: [
    'Before correction, text .nb computed overflow-y:auto with zero padding; six containers per viewport had scrollHeight > clientHeight. A desktop sample is scrollHeight34/clientHeight33/offsetHeight33 and has a15px vertical scrollbar gutter. This is measured overflow, not a harmlessness assumption.',
    'Before correction, choice tuple parenthesis Range height43px extends beyond the roughly34.844px .sr-nb and34.875px .option-text boxes. Maximum excess is3.734375px above and4.421875px below. Equal scrollHeight/clientHeight on some tuple containers did not prove Range containment.',
    'With the exact appended CSS, every measured full descendant Range fits its adjusted scroll viewport with zero top/bottom excess, and all local vertical scrollbar eligibility/gutters are zero. Existing overflow-x:auto remains in effect.',
    'The CSS was tested jointly on math wrappers and option-text containers. Minimality of the option-text padding alone was not separately tested; only this exact combined rule is supported by these measurements.',
    'The choices document becomes taller, so visual spacing/alignment acceptance remains pending. This diagnosis did not inspect pixels, click options, rerun written/content/math/behavior gates or repair any production input.',
  ],
  recommendedExactCss: css,
  cssPlacement: 'Append these narrowly scoped declarations after existing preview styles. Keep existing overflow-x:auto, max-width, font-size and content unchanged. This file is a recommendation only.',
  summaries, exactDimensionSamples: samples,
  affectedBeforeAfter: evidence.views.map(v => ({ view: v.name,
    affectedPairs: v.pairs.filter(x => x.initiallyAffected) })),
  fullRangeEvidence: path.join(OUT, 'diagnosis-evidence.json'),
  rangeMeasurement: 'Every nonempty descendant text Range with positive width/height is recorded; intentional hidden .katex-mathml is excluded. Bounds use fractional border-box geometry minus measured scrollbar gutter. Vertical containment has no tolerance waiver; horizontal endpoint hit checks allow1px rounding only.',
  accounting: evidence.accounting,
  environment: { browser: 'Chromium', version: evidence.browserVersion,
    gui: evidence.gui, freshOfflineContexts: evidence.cleanup.contextsClosed,
    requestedFilesOnly: ['text.html', 'choices.html'], requests: evidence.requests },
  assertions: { technicalOnly: true, count: evidence.technicalAssertions.length,
    passed: evidence.technicalAssertions.filter(x => x.passed).length,
    failures: evidence.unresolvedTechnicalFailures },
  cleanup: { ...evidence.cleanup, newFilesMode: '0444', newTreeMode: '0555',
    freezeVerification: 'package.mjs verifies all new file/directory modes and hashes after chmod.' },
  inputBindings: previewBindings, originalCustodyBindings: originalFinalBindings, executionBindings: stageBindings,
  remaining: ['Parent implements the real narrowly scoped CSS repair.',
    'Reserve2 remains LOCKED until parent separately releases affected recovery.',
    'Actual repaired visual acceptance is pending; original first FAIL is not replaced by this technical diagnosis.',
    'Parent fully consumes the diagnosis evidence and actually closes this reviewer.'],
};
write('report.json', report);
const lines = [
  '# n47 Affected Layout Diagnosis',
  '',
  '**SUPPORTED_BY_EXACT_DOM_METRICS**, diagnosis only. **No visual PASS.** Unique stage exited0; browser closed.',
  '',
  'Only text .nb and choices .sr-nb/.option-text were measured. Written preview, content/math/behavior gates and option clicks were not run. Screenshots0, image views0, manual decodes0. Reserve2 LOCKED.',
  '',
  '## Measured Cause',
  '',
  '- Text: overflow-y computes to auto while padding is0. Six wrappers per viewport have vertical overflow. Desktop sample: scrollHeight34/clientHeight33/offsetHeight33, vertical gutter15px. After the CSS:43/43/43, gutter0.',
  '- Choice tuples: a43px parenthesis Range exceeds a34.84375px wrapper and34.875px option-text box. Up to3.734375px above and4.421875px below is outside the viewport. Equal scroll/client heights did not disprove this.',
  '- After the combined CSS: all12 text wrappers and49 choice containers per viewport fully contain every measured Range with exactly0px top/bottom excess. Vertical scrolling is hidden, scrollbar eligibility/gutters0.',
  '',
  '## Exact Tested CSS',
  '',
  '```css',
  css.trim(),
  '```',
  '',
  'Append after existing styles; existing overflow-x:auto/max-width/font-size/content are unchanged. Both wrapper and option-text padding were tested jointly; no claim that a smaller subset was validated.',
  '',
  '## Before / After',
  '',
  '| View | Affected | Range-outside containers | Vertical scrollbar eligible | Document height |',
  '| --- | ---: | ---: | ---: | ---: |',
  ...summaries.map(s => `| ${s.view} | ${s.affectedContainers}/${s.eligibleContainers} | ${s.rangeProtrudingContainersBefore} -> ${s.rangeProtrudingContainersAfter} | ${s.verticalScrollbarEligibleBefore} -> ${s.verticalScrollbarEligibleAfter} | ${s.beforeDocument.documentHeight} -> ${s.afterDocument.documentHeight}px |`),
  '',
  '- Document scrollWidth equals clientWidth before/after: desktop text1440, desktop choices1425, mobile390px. No page-wide sideways overflow.',
  '- Desktop text long chain: clientWidth670 ->685px, scrollWidth697px; maxScroll27 ->12px. Both endpoints actually reached and unmasked hit-tested before/after.',
  '- Mobile text: three long equation scrollers remain358/545,358/697,358/480px, maxScroll187,339,122px. All endpoints reached before/after, reset left.',
  '- No horizontally overflowing choice container existed before or after at these viewports; horizontal scrolling remains enabled in computed styles.',
  '',
  'The choices page grows1528 ->1905px desktop and1698 ->2099px mobile. Visual spacing/controls are not approved by DOM containment, and no pixels were inspected.',
  '',
  '## Custody',
  '',
  'Original n47-offline remains byte-identical across18 files, including its manifest; original modes remain0444/files and0555/directories. Raw PNG bytes were hashed for custody only, never decoded or image-opened.',
  '',
  'diagnosis-evidence.json retains all BEFORE/AFTER container dimensions, computed overflow/padding, full descendant Range records, document widths and local endpoint evidence. report.json exposes all affected pairs and bounded summaries. execution/ retains actual stdout/stderr/exit. ledger.json records reads/execution/image accounting. hash-manifest.json binds all new outputs except its unavoidable self-reference and emits its SHA after freezing.',
  '',
  'No preview/artifact/tooling/production files were modified. Parent implements the actual repair and separately releases only reserve2 for affected recovery. Original FAIL and all source/acceptance HOLDs remain. Parent must consume this technical package and actually close the reviewer.',
  '',
];
write('report.md', lines.join('\n'));
write('ledger.json', {
  schema: 'stemrobin1846/n47-diagnosis-read-execution-image-ledger@1',
  root: ROOT, cwdExplicitEveryExec: true,
  executions: [
    { command: 'ls -ld .tmp/stemrobin-184-six/n47-offline-diagnosis', exitCode: 1,
      note: 'Expected absent directory; no redirection or fallback' },
    { commandSummary: 'node -e: read only own first browser-evidence-first.json; select affected geometry records', exitCode: 0 },
    { command: 'mkdir .tmp/stemrobin-184-six/n47-offline-diagnosis', exitCode: 0 },
    { command: 'node .tmp/stemrobin-184-six/run-stage.mjs n47-offline-affected-layout-diagnosis-first node .tmp/stemrobin-184-six/n47-offline-diagnosis/diagnose.mjs',
      stageExitCode: receipt.exitCode, receipt, sessionId: 52179,
      polling: { tool: 'functions.write_stdin', calls: 1, finalState: 'exited' } },
    { commandSummary: 'node -e: read own diagnosis-evidence.json; print numerical summaries/samples/endpoints', exitCode: 0 },
    { command: 'node .tmp/stemrobin-184-six/n47-offline-diagnosis/package.mjs',
      actualArgv: process.argv, actualCwd: process.cwd(), purpose: 'Packaging, custody verification and freeze only; no browser/image calls' },
  ],
  diagnosticReads: evidence.reads, packagingReads: reads,
  custodyImageHandling: 'PNG bytes hashed only; no manual image decode/open and no image tool',
  writes: 'Only this new diagnosis tree plus the user-mandated unique run-stage stdout/stderr/receipt; no original package writes.',
  manualEditTool: 'functions.apply_patch',
  accounting: evidence.accounting,
  previousImageViews: 'Original six observations unchanged; this diagnosis adds zero. Reserve2 LOCKED.',
  noBroadDiscovery: true,
});
function walk(dir) {
  const files = [], directories = [dir];
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, item.name);
    assert(!item.isSymbolicLink());
    if (item.isDirectory()) {
      const nested = walk(file); files.push(...nested.files); directories.push(...nested.directories);
    } else { assert(item.isFile()); files.push(file); }
  }
  return { files, directories };
}
const before = walk(OUT);
const outputs = before.files.sort().map(file => {
  const bytes = fs.readFileSync(file);
  return { path: rel(file), bytes: bytes.length, sha256: sha(bytes), frozenMode: '0444' };
});
write('hash-manifest.json', {
  schema: 'stemrobin1846/n47-diagnosis-complete-bindings@1',
  outputs, inputs: previewBindings, originalCustody: originalFinalBindings,
  execution: stageBindings,
  self: { path: rel(path.join(OUT, 'hash-manifest.json')),
    binding: 'SHA emitted after freeze; self excluded from self-referential hash list' },
  frozenModes: { files: '0444', directories: '0555' },
});
const all = walk(OUT);
for (const file of all.files) fs.chmodSync(file, 0o444);
for (const dir of all.directories.sort((a, b) => b.length - a.length)) fs.chmodSync(dir, 0o555);
for (const file of all.files) assert.equal(fs.statSync(file).mode & 0o777, 0o444);
for (const dir of all.directories) assert.equal(fs.statSync(dir).mode & 0o777, 0o555);
for (const binding of outputs) assert.equal(sha(fs.readFileSync(path.join(ROOT, binding.path))), binding.sha256);
for (const binding of originalFinalBindings) assert.equal(sha(fs.readFileSync(path.join(ROOT, binding.path))), binding.sha256);
console.log(JSON.stringify({
  hypothesisVerdict: report.hypothesisVerdict, visualVerdict: report.visualVerdict,
  stageExitCode: receipt.exitCode, originalByteIdentical: true,
  originalManifestSha256: report.originalFirstGate.originalManifestSha256,
  screenshotsCreated: 0, imageToolViews: 0, manualDecodes: 0, nativeClicks: 0,
  reserve2: 'LOCKED', browserClosed: true,
  newFilesFrozen0444: true, newDirectoriesFrozen0555: true,
  newFiles: all.files.length, newDirectories: all.directories.length,
  hashesVerifiedAfterFreeze: true,
  newManifestSha256: sha(fs.readFileSync(path.join(OUT, 'hash-manifest.json'))),
  minimumAfterRangeSlackPx: summaries.map(s => ({ view: s.view, px: s.afterMinimumVerticalSlackPx })),
  report: path.join(OUT, 'report.json'), reportMarkdown: path.join(OUT, 'report.md'),
  recommendedCss: path.join(OUT, 'recommended.css'),
}));
