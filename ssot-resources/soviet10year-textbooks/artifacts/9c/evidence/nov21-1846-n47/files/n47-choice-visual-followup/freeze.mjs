import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const ROOT = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck';
assert.equal(process.cwd(), ROOT);
const OUT = path.join(ROOT, '.tmp/stemrobin-184-six/n47-choice-visual-followup');
const STAGE = 'n47-independent-choice-capture-followup-first';
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const rel = file => path.relative(ROOT, file);
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: file.startsWith(ROOT + path.sep) ? rel(file) : file, bytes: bytes.length, sha256: sha(bytes) };
};
const writeNew = (file, value) => fs.writeFileSync(file,
  typeof value === 'string' ? value : JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
assert(!fs.existsSync(path.join(OUT, 'report.json')), 'No finalization replay.');
assert(!fs.existsSync(path.join(OUT, 'hash-manifest.json')), 'No frozen manifest replacement.');
const evidence = JSON.parse(fs.readFileSync(path.join(OUT, 'evidence.json'), 'utf8'));
assert.equal(evidence.assertionVerdict, 'PASS');
assert.equal(evidence.screenshots.length, 2);
assert.equal(evidence.accounting.screenshotCreations, 2);
assert.equal(evidence.unresolvedFailures.length, 0);
assert(evidence.cleanup.browserClosed && evidence.cleanup.contexts.every(item => item.closed));

const inputSpecifications = [
  ['.tmp/stemrobin-184-six/n47-preview-repaired/choices.html', 'Actual top-level repaired choices input',
    '21cd70805a4601cbbbd9fbd2822da4047fcdc674bc68ba037e543f9324ef59be'],
  ['.tmp/stemrobin-184-six/n47-preview-repaired/manifest.json', 'Only actual choices output binding selected',
    '96f02fd7ce8caf794923526056741d09b712e27b9807366a27115c8030f0f60c'],
  ['.tmp/stemrobin-184-six/run-stage.mjs', 'Unique acquisition stage wrapper'],
  ['.tmp/stemrobin-184-six/n47-offline-recovery/checker-headless-entry.mjs',
    'Tooling only: headless launch, font readiness, cleanup pattern; never executed'],
  ['app/node_modules/playwright/index.mjs', 'Existing official Playwright entrypoint'],
  ['/Users/yong/.agents/skills/ips-chrome-background/SKILL.md', 'Isolated headless channel guidance'],
];
const inputReferences = inputSpecifications.map(([file, purpose, expected]) => {
  const result = bind(path.isAbsolute(file) ? file : path.join(ROOT, file));
  if (expected) assert.equal(result.sha256, expected);
  return { ...result, purpose, copied: false };
});

const stageFiles = ['stdout', 'stderr', 'receipt.json']
  .map(suffix => path.join(ROOT, '.tmp/stemrobin-184-six/stages', `${STAGE}.${suffix}`));
const receipt = JSON.parse(fs.readFileSync(stageFiles[2], 'utf8'));
assert.equal(receipt.stage, STAGE);
assert.equal(receipt.exitCode, 0);
assert.equal(receipt.cwd, ROOT);
assert.equal(receipt.signal, null);
for (const name of ['stdout', 'stderr']) {
  const actual = bind(path.join(ROOT, receipt.outputs[name].path));
  assert.equal(actual.sha256, receipt.outputs[name].sha256);
  assert.equal(actual.bytes, receipt.outputs[name].bytes);
}

fs.mkdirSync(path.join(OUT, 'observations'));
const observations = evidence.screenshots.map((capture, index) => {
  const id = evidence.views[index].id;
  const actual = bind(path.join(ROOT, capture.path));
  assert.equal(actual.sha256, capture.sha256);
  assert.equal(actual.bytes, capture.bytes);
  const observation = {
    schema: 'stemrobin1846/actual-image-tool-observation@1',
    order: index + 1, viewportId: id, tool: 'functions.view_image',
    toolArguments: { path: path.join(ROOT, capture.path) },
    actualCalls: 1, actualObservation: true, reopened: false, cropped: false,
    capture: actual, viewport: capture.viewport,
    observedFullImageSize: { width: capture.fullContent.width, height: capture.fullContent.height },
    visualVerdict: 'PASS',
    findings: {
      sectionsVisiblyPresent: 4, optionsVisiblyPresent: 16, visibleRadios: 16,
      parentheses: 'Intact in every option; no visibly truncated top/bottom arcs.',
      fractions: 'Bars, numerators, denominators and superscripts visibly present; no vertical cutoff.',
      localVerticalScrollbars: 'None observed.',
      clipping: 'No visibly clipped option glyphs or fraction/parenthesis parts.',
      gutters: 'Radio circles remain separate from the formula text; consistent left gutter.',
      spacing: 'Option rows and section rules remain separate; no incoherent text/control/section overlap.',
      finalTuple: 'Fourth question, option D is visibly present in full, including its closing parenthesis.',
      blankState: 'No blank or error-only choices region; normal page margins and trailing whitespace are not missing content.',
    },
    limits: [
      'One tool observation of the complete fullPage capture, with no reopen, zoom, crop or extra decode.',
      'This is a visual/layout observation, not a mathematical, source, answer, key, server or keyboard approval.',
      id === 'desktop'
        ? 'The tool displays the entire tall desktop page; tiny glyph pixel fidelity at additional zoom levels was not tested.'
        : 'All options fit visibly at the recorded 390px width; other mobile widths and devices were not tested.',
      'Hidden browser image internals remain UNKNOWN.',
    ],
  };
  const file = path.join(OUT, 'observations', `${id}.json`);
  writeNew(file, observation);
  return { ...bind(file), viewportId: id, actualCalls: 1, verdict: observation.visualVerdict };
});
const accounting = {
  actualImageToolViews: 2, historicalSartreImageViews: 8, totalKnownN47ImageViews: 10,
  parentImagesOrDecodes: 0, hiddenBrowserImageInternals: 'UNKNOWN',
  newNativeClicks: 0, inheritedNativeClicks: 64, inheritedDOMAssertions: 111,
  inheritedTextVisual: 'PASS affected text only',
  screenshotCreations: 2, imageViewLimit: 2, screenshotLimit: 2,
  historicalFirstViews: 6, historicalRecoveryViews: 2,
  historicalCounterReset: false, historicalEvidenceReopened: false,
  newManualImageDecodesOutsideImageTool: 0, binaryHashesAreNotImageDecodes: true,
  networkDocs: 0, httpRequests: evidence.accounting.networkRequests,
  paidCalls: 0, installs: 0, credentials: 0, DB: 0, publication: 0, Git: 0, deploy: 0,
  ticketCalls: 0, otherAgentMessages: 0,
};
writeNew(path.join(OUT, 'image-observation-ledger.json'), {
  schema: 'stemrobin1846/two-actual-observation-ledger@1',
  batch: 'NEW bounded n47 repaired choices only',
  entries: observations, accounting,
  historicalArithmetic: 'Original first6 + recovery2 = 8/8 retained unchanged; fresh2 = known10.',
  authority: 'Historical values inherited only from user authorization; prior packages and images not opened.',
});

const execLedger = {
  schema: 'stemrobin1846/read-exec-ledger@1', cwd: ROOT,
  everyExecExplicitCwdRoot: true,
  externalInputs: inputReferences,
  sectionOnlyGuidance: {
    path: '.agents/skills/ld-s10y-image/SKILL.md', openedLines: '30-44 image-batches only',
    fullFileHash: 'NOT_ACQUIRED: full-section-only authorization respected',
  },
  orderMeaning: 'Submission order; independent reads 1-5 and 6-9 ran in parallel.',
  readsPolicy: 'No old image/evidence package, PDF/source, draft/review/keys/answers, previous math evidence or unrelated files read.',
  toolingInspectionLimitation: 'The recovery checker was read as tooling only, not run; embedded references were not followed.',
  inputInspectionDisclosure: 'Allowed choices HTML structural/style inspection emitted large embedded font CSS, truncated by the terminal. No image bytes or font runtime files were opened or copied.',
  runtimeReads: 'Playwright necessarily loads its existing dependency/runtime and Chromium resources. No author evidence, font-runtime package, network docs or unrelated repository exploration was performed.',
  execs: [
    { order: 1, toolOutputId: '92e72e', command: 'sed -n \'1,240p\' .tmp/stemrobin-184-six/run-stage.mjs', exitCode: 0 },
    { order: 2, toolOutputId: '5f9972', command: 'sed -n \'1,240p\' .tmp/stemrobin-184-six/n47-offline-recovery/checker-headless-entry.mjs', exitCode: 0 },
    { order: 3, toolOutputId: '94ab91', command: 'sed -n \'1,200p\' /Users/yong/.agents/skills/ips-chrome-background/SKILL.md', exitCode: 0 },
    { order: 4, toolOutputId: 'ba4b10', command: 'rg -n \'image.bat|batch|\u9884\u7b97|\u89c2\u5bdf|\u622a\u56fe|view\' .agents/skills/ld-s10y-image/SKILL.md', exitCode: 0,
      limitation: 'Match-only section locator returned lines outside the image-batches section; those sections were not opened or used.' },
    { order: 5, toolOutputId: 'fd04aa', command: 'shasum -a 256 .tmp/stemrobin-184-six/n47-preview-repaired/choices.html .tmp/stemrobin-184-six/n47-preview-repaired/manifest.json', exitCode: 0 },
    { order: 6, toolOutputId: '9a6d7c', command: 'sed -n \'30,44p\' .agents/skills/ld-s10y-image/SKILL.md', exitCode: 0 },
    { order: 7, toolOutputId: '4d9163', command: 'rg -n -A 16 \'chromium\\.launch|^\\} finally\' .tmp/stemrobin-184-six/n47-offline-recovery/checker-headless-entry.mjs', exitCode: 0 },
    { order: 8, toolOutputId: '6fc6c3', executable: 'node --input-type=module -e',
      command: String.raw`node --input-type=module -e 'import fs from "node:fs"; const base=".tmp/stemrobin-184-six/"; const manifest=JSON.parse(fs.readFileSync(base+"n47-preview-repaired/manifest.json","utf8")); const html=fs.readFileSync(base+"n47-preview-repaired/choices.html","utf8"); console.log(JSON.stringify({binding:manifest.outputs.find(x=>x.path===base+"n47-preview-repaired/choices.html"), targetAbsent:!fs.existsSync(base+"n47-choice-visual-followup"), stageAbsent:["stdout","stderr","receipt.json"].every(x=>!fs.existsSync(base+"stages/n47-independent-choice-capture-followup-first."+x)), styles:[...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(x=>x[1]), structuralTags:[...html.matchAll(/<(?:section|label|input|h2|div)[^>]*(?:preview-question|preview-option|option-text|data-question-id|type="radio")[^>]*>/g)].map(x=>x[0])},null,2));'`,
      operation: 'Read only repaired manifest and choices HTML; select manifest.outputs choices binding; check new directory/stage absence; emit style blocks and structural section/label/input tags.',
      inputPaths: inputReferences.slice(0, 2).map(item => item.path), exitCode: 0 },
    { order: 9, toolOutputId: '70f3c2', command: 'sed -n \'1,80p\' app/node_modules/playwright/index.mjs', exitCode: 0 },
    { order: 10, toolOutputId: '0ba480',
      command: 'node .tmp/stemrobin-184-six/run-stage.mjs n47-independent-choice-capture-followup-first node .tmp/stemrobin-184-six/n47-choice-visual-followup/checker.mjs',
      exitCode: 0, authoritativeReceipt: bind(stageFiles[2]) },
    { order: 11, toolOutputId: 'd9e369', executable: 'node --input-type=module -e',
      command: String.raw`node --input-type=module -e 'import fs from "node:fs"; const e=JSON.parse(fs.readFileSync(".tmp/stemrobin-184-six/n47-choice-visual-followup/evidence.json","utf8")); console.log(JSON.stringify({assertions:e.assertions.length,views:e.views.map(v=>({id:v.id,readyState:v.ready.readyState,fontStatus:v.ready.fontStatus,usedFontLoads:v.ready.usedLoads.length,usedFamilies:[...new Set(v.ready.usedLoads.map(x=>x.family))],loadedFaces:v.ready.loadedFaces,fullContent:v.layout.fullContent,lastOptionRect:v.layout.lastOption.rect,lastTextRect:v.layout.lastOption.textRect,reachability:v.finalOptionReachability,minimumRadioGap:Math.min(...v.layout.questions.flatMap(q=>q.options.map(o=>o.controls[0].horizontalGap)))})),requests:e.requests,cleanup:e.cleanup},null,2));'`,
      operation: 'Read only NEW evidence.json to emit readiness/fonts/full extents/last tuple reachability/radio gaps/requests/cleanup summary.', exitCode: 0 },
    { order: 12, command: 'node .tmp/stemrobin-184-six/n47-choice-visual-followup/freeze.mjs',
      operation: 'This finalizer: verify hashes; create only NEW report/observation/read-exec/hash files; freeze only owned files/directories and unique stage outputs; binary hash screenshots without image decoding.',
      inProcessVerification: 'Assertions below must pass before success stdout; terminal completion is observed by calling agent.' },
  ].map(item => ({ ...item, cwd: ROOT })),
  edits: [
    { tool: 'functions.apply_patch', action: 'Add only NEW checker.mjs', existingSharedFileEdits: 0 },
    { tool: 'functions.apply_patch', action: 'Add only NEW freeze.mjs', existingSharedFileEdits: 0 },
    { tool: 'functions.apply_patch', action: 'Refine only NEW freeze.mjs ledger before execution', existingSharedFileEdits: 0 },
  ],
  actualImageToolCalls: observations.map(item => ({
    tool: 'functions.view_image', viewportId: item.viewportId, actualCalls: 1, observation: item.path,
  })),
  cleanup: evidence.cleanup, prohibitedActionsExecuted: [],
};
writeNew(path.join(OUT, 'read-exec-ledger.json'), execLedger);

const report = {
  schema: 'stemrobin1846/n47-choice-followup-review-report@1',
  ticket: 'STEMROBIN-184/184-6', finish: 'review',
  assertionVerdict: 'PASS', visualVerdict: 'PASS', unresolvedFailures: [],
  scope: 'Only missing repaired n47 CHOICES visual coverage; desktop1440x960/mobile390x844.',
  accounting, inputReferences, actualManifestBinding: evidence.actualManifestBinding,
  evidence: bind(path.join(OUT, 'evidence.json')),
  acquisitionSnapshotNote: 'Acquisition evidence correctly preserves its pre-observation visual PENDING state; these two actual observation files and this report complete that affected visual gate.',
  newAffectedAcquisitionAssertions: evidence.assertions.length,
  actualQuestionIds: evidence.views[0].layout.questions.map(question => question.questionId),
  inheritedAssertionsRerun: 0, inheritedNativeClicksRerun: 0, optionClicks: 0,
  findings: [
    'Four actual question IDs and sixteen nonempty option elements per viewport, with sixteen visible, nonempty radio controls.',
    'Both actual fullPage captures visibly contain all sixteen options, intact parentheses/fractions, separated radio gutters, coherent section spacing and the complete final tuple.',
    'No observed local vertical scrollbar, clipping, incoherent overlap, blank choices region or error-only page.',
    'Twelve used KaTeX font specifications explicitly loaded per viewport; four used loaded faces: Main normal400, Math italic400, Size1 normal400, Size2 normal400.',
    'Final option D actually scrolled into the viewport without a click, then every scroller reset left/top before capture.',
    'No pageerror, HTTP request, iframe composite or headed/CDP/user-window access; both OWN contexts and browser closed.',
  ],
  captures: evidence.screenshots.map((capture, index) => ({
    ...capture, imageObservation: 'PASS', actualImageToolViews: 1,
    observation: observations[index], finalOptionReachability: evidence.views[index].finalOptionReachability,
  })),
  observations, cleanup: evidence.cleanup,
  limits: [
    'Exactly two actual image-tool observations in this NEW batch, no crops or reopens.',
    'Historical Sartre eight views retained unchanged; exhausted reviewer not reopened.',
    'Parent permanently24/24 with zero image views/decodes here; text/hash return only.',
    'No mathematical/source/key/answer/content review or inherited111DOM/64click replay.',
    'Inherited text visual PASS applies to affected text only, not newly inspected text.',
    'No whole-course completion or strict-source, production/server, keyboard, deployment or publication approval.',
    'The shared stages parent directory is not owned and is not chmodded; only this unique stage trio is frozen.',
    'Hidden browser image internals UNKNOWN; additional zoom/device/viewports are untested.',
  ],
  freeze: { fileMode: '0444', ownedDirectoryMode: '0555', hashManifestOutputsExcludeSelf: true },
};
writeNew(path.join(OUT, 'report.json'), report);
writeNew(path.join(OUT, 'report.md'), `# N47 Choices Visual Followup

STEMROBIN-184/184-6, finish=review. Assertion PASS; visual PASS; unresolvedFailures=[].

- NEW batch only: 2 screenshots, 2 actual image-tool views, 0 new native clicks.
- Historical original first6 + recovery2 = 8/8 unchanged; known N47 views = 10. Parent image views/decodes = 0; hidden browser image internals = UNKNOWN.
- Inherited only: 111 DOM assertions, 64 native clicks, text visual PASS affected text only. No inherited gate replay.
- Direct standalone file, no iframe: desktop viewport 1440x960/fullPage 1440x1905; mobile viewport 390x844/fullPage 390x2099. Fractional document content bottoms: 1904.625 / 2099.3125.
- Four actual sections and sixteen painted, nonempty options with sixteen radio controls per viewport. Minimum radio/text gutter 14px.
- Observed all sixteen options and final tuple D in both complete images; parentheses/fractions intact, no local vertical scrollbars/clipping or incoherent overlap. Normal margins/trailing whitespace, no blank choices/error-only state.
- Fonts complete: twelve explicitly loaded used specifications per viewport, Main normal400 / Math italic400 / Size1 normal400 / Size2 normal400.
- Final D text reaches desktop y897.203125..951.234375 at scrollY847 and mobile y780.890625..834.921875 at scrollY1174. Scrollers reset left/top before screenshots.
- Pageerrors 0; HTTP requests 0; OWN contexts/browser closed. Exactly one view per new capture, no crop/reopen/extra image decode.

## Evidence

The acquisition evidence is an immutable pre-observation snapshot; observations/desktop.json and observations/mobile.json are actual visual observations. report.json resolves only this new affected visual gate. hash-manifest.json binds only NEW output files, excluding itself; inputs referenced by hash without copying historical packages.

One fullPage image-tool observation per viewport does not certify extra zoom/device fidelity. No source, math, answer/key, whole-course, strict-source, server, keyboard, publication or production approval. Earlier evidence and all shared files remain untouched.

Files 0444; owned directory tree 0555. Unique acquisition stdout/stderr/receipt 0444; shared stages directory permissions deliberately unchanged.
`);

const outputFiles = [
  'checker.mjs', 'freeze.mjs', 'evidence.json', 'report.json', 'report.md',
  'read-exec-ledger.json', 'image-observation-ledger.json',
  'observations/desktop.json', 'observations/mobile.json',
  'captures/desktop-choices-full.png', 'captures/mobile-choices-full.png',
].map(file => path.join(OUT, file)).concat(stageFiles);
const manifest = {
  schema: 'stemrobin1846/new-output-hash-manifest@1',
  created: new Date().toISOString(), scope: 'Only this NEW batch and its unique acquisition stage outputs',
  inputReferences, outputs: outputFiles.map(file => ({ ...bind(file), requiredMode: '0444' })),
  selfExcluded: true, directoryModes: { ownedRoot: '0555', captures: '0555', observations: '0555' },
  sharedStageDirectoryUnchanged: true,
};
const manifestFile = path.join(OUT, 'hash-manifest.json');
writeNew(manifestFile, manifest);
for (const file of [...outputFiles, manifestFile]) fs.chmodSync(file, 0o444);
for (const directory of [path.join(OUT, 'captures'), path.join(OUT, 'observations'), OUT]) {
  fs.chmodSync(directory, 0o555);
  assert.equal(fs.statSync(directory).mode & 0o777, 0o555);
}
for (const item of manifest.outputs) {
  const file = path.join(ROOT, item.path), actual = bind(file);
  assert.equal(actual.sha256, item.sha256);
  assert.equal(actual.bytes, item.bytes);
  assert.equal(fs.statSync(file).mode & 0o777, 0o444);
}
assert.equal(fs.statSync(manifestFile).mode & 0o777, 0o444);
console.log(JSON.stringify({
  assertionVerdict: report.assertionVerdict, visualVerdict: report.visualVerdict, unresolvedFailures: [],
  accounting, frozenOutputBindings: manifest.outputs.length,
  report: bind(path.join(OUT, 'report.json')), reportMarkdown: bind(path.join(OUT, 'report.md')),
  hashManifest: bind(manifestFile), stageReceipt: bind(stageFiles[2]),
  ownFilesMode: '0444', ownDirectoriesMode: '0555', uniqueStageFilesMode: '0444',
  screenshotHashesVerifiedWithoutDecode: true,
}, null, 2));
