import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const ROOT = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck';
const OUT = path.join(ROOT, '.tmp/stemrobin-184-six/c6-display-range-recovery');
const read = name => JSON.parse(fs.readFileSync(path.join(OUT, name), 'utf8'));
const fileBinding = file => ({
  path: file, bytes: fs.statSync(file).size,
  sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'),
});
const fail = message => { throw new Error(message); };
if (process.cwd() !== ROOT || fs.existsSync(path.join(OUT, 'bindings.json')) ||
    fs.existsSync(path.join(OUT, 'manifest.json'))) fail('Wrong cwd or finalization replay');
const raw = read('browser-evidence.json');
const execution = read('execution.json');
if (raw.exitCode !== 1 || execution.exitCode !== 1 || !raw.browserClosed ||
    execution.attempts !== 1 || execution.truncation.timedOut ||
    raw.screenshots.length || raw.originalFlags.length !== 40) fail('Recorded stop facts conflict');
for (const stream of Object.values(execution.streams)) {
  if (fileBinding(stream.path).sha256 !== stream.sha256) fail('Browser stream hash mismatch');
}
if (fileBinding(execution.script.path).sha256 !== execution.script.sha256) fail('Executed script drift');
for (const bound of [...raw.inputs, ...raw.originalBindings]) {
  if (fileBinding(bound.path).sha256 !== bound.sha256) fail(`Input/original evidence drift: ${bound.path}`);
}
const stage = raw.stages[0];
const diagnosis = [342, 358, 359, 360, 367, 372, 375, 379].map(owner => {
  const previous = raw.originalFlags.filter(x => x.owner === owner);
  const current = stage.rangeDiagnosis.flags.filter(x => x.owner === owner);
  const deltas = current.map((x, i) => ({
    index: i, text: x.text, mathIndex: x.mathIndex, textIndex: x.textIndex,
    ancestor: x.ancestor, previous: previous[i],
    current: { excessTop: x.excessTop, excessBottom: x.excessBottom },
    deltaTop: x.excessTop - previous[i].excessTop,
    deltaBottom: x.excessBottom - previous[i].excessBottom,
    pixelVerdict: 'UNREACHED_HOLD',
  }));
  return { owner, originalFlags: previous.length, recoveryFlags: current.length,
    flaggedTextRuns: [...new Set(current.map(x => x.text))],
    observedResult: 'GEOMETRY_ONLY; no actual ink observation',
    actualPixelResult: 'UNREACHED_HOLD', deltas };
});
const maxAbsDelta = Math.max(...diagnosis.flatMap(x => x.deltas.flatMap(d => [Math.abs(d.deltaTop), Math.abs(d.deltaBottom)])));
const bindings = {
  schema: 'stemrobin-184/c6-display-range-recovery-bindings@1',
  ticket: 'STEMROBIN-184', assignment: '184-6', finish: 'review',
  scope: '9c/10c offline only; ONLY failed/unreached C6 display',
  verdict: 'HOLD_NOT_DISPLAY_APPROVED', recoveryStatus: 'TECHNICAL_CHECKER_STOP_BEFORE_INK',
  outputDirectory: OUT, outputDirectoryAbsentBeforeFirstWrite: true,
  actualCwd: ROOT, rawEvidence: fileBinding(path.join(OUT, 'browser-evidence.json')),
  receipt: fileBinding(path.join(OUT, 'execution.json')),
  inputs: raw.inputs, originalStoppedEvidence: raw.originalBindings,
  originalParentRetention: {
    path: path.join(ROOT, 'ssot-resources/soviet10year-textbooks/artifacts/10c/evidence/nov22-1846-c6-first-offline-display-failure'),
    humanSuppliedManifestReference: 'manifest04dd5179', payloadRead: false,
  },
  rawBrowserStatus: raw.status, actualExitCode: execution.exitCode,
  browserClosed: raw.browserClosed, browser: raw.browser,
  desktopPassedChecksReusedByHash: raw.reusedDesktop, perOwnerDiagnosis: diagnosis,
  maxAbsoluteRangeComponentDifferencePx: maxAbsDelta,
  diagnosis: 'Overstrict recovery-only 0.01px numerical equality gate stopped before screenshots; original 2px flag threshold unchanged. Geometry differences are not ink proof.',
  screenshots: ['desktop-top', 'desktop-middle-a', 'desktop-middle-b', 'desktop-bottom',
    'mobile-top', 'mobile-middle', 'mobile-scroll-end', 'mobile-bottom'].map(name => ({
      filename: name + '.png', status: 'NOT_CAPTURED_TECHNICAL_STOP', sha256: null,
      creationCount: 0, modelViewCount: 0,
    })),
  unreachable: [
    'All exact failed owner glyph screenshot-pixel adjudications',
    'Desktop horizontal math scroll reachability',
    'All desktop first screenshots and top/mid/bottom pixel observations',
    'All mobile390x844 first render/geometry/fonts/assets/errors/scroll checks',
    'All mobile first screenshots and usability pixel observations',
  ],
  usage: { textExecCount: 13, textExecLimit: 16, browserInvocations: 1,
    screenshotsCreated: 0, screenshotLimit: 8, modelImageViewToolCalls: 1,
    failedImageViewToolCalls: 1, successfulModelImageViews: 0, modelViewCallLimit: 8,
    currentImages: 0, batchImages: 0, currentAndBatchImageLimit: 8,
    actualImageUnits: 0, conservativeChargedUnitsIncludingFailedAttempt: 2,
    conservativeImageUnitLimit: 24, paidAuxiliaryCalls: 0, polls: 0, retries: 0,
    adjudicationInputs: 0, rasterCropOrEncode: 0 },
  faults: [
    ...raw.faults,
    { type: 'model-image-view-call', path: path.join(OUT, 'desktop-top.png'),
      result: 'No such file or directory (os error 2)', imageLoaded: false, retry: false },
    { type: 'routing-tool-display-truncation', command: 4, originalTokens: 11979, displayBudget: 11000 },
    { type: 'routing-tool-display-truncation', command: 7, originalTokens: 16418, displayBudget: 10500 },
  ],
  browserStreamTruncation: execution.truncation,
  unchangedHolds: ['source338 ambiguous2.3/empty answer', '371/373 qualified ownership', 'full-course HOLD'],
  parentActionsPending: ['intake', 'retention', 'actual reviewer closure'],
  completionCredit: 'No full lesson/course credit; no publication or closure',
};
for (const s of bindings.screenshots) if (fs.existsSync(path.join(OUT, s.filename))) fail('Unexpected screenshot');
fs.writeFileSync(path.join(OUT, 'bindings.json'), JSON.stringify(bindings, null, 2) + '\n', { flag: 'wx' });
const names = ['plan.md', 'run-once.mjs', 'recovery-check.mjs', 'execution-ledger.md',
  'report.md', 'finalize-evidence.mjs', 'browser-evidence.json', 'execution.json',
  'browser.stdout.txt', 'browser.stderr.txt', 'bindings.json'];
const manifest = {
  schema: 'stemrobin-184/c6-display-range-recovery-manifest@1',
  cwd: ROOT, argv: process.argv, timestamp: new Date().toISOString(), exitCode: 0,
  bindingVerification: 'PASS', displayVerdict: 'HOLD_NOT_DISPLAY_APPROVED',
  actualBrowserExitCode: 1, originalAndInputsUnchanged: true,
  files: names.map(name => fileBinding(path.join(OUT, name))),
  textExecCount: 13, browserInvocations: 1, screenshotCount: 0,
  imageViewToolCalls: 1, successfulImageViews: 0, conservativeChargedImageUnits: 2,
  note: 'Hashes verify preserved failure evidence, NOT a successful display review. Owned browser temporary data is not copied or enumerated.',
};
fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n', { flag: 'wx' });
for (const file of manifest.files) if (fileBinding(file.path).sha256 !== file.sha256) fail('Manifest drift');
console.log(JSON.stringify({
  cwd: ROOT, argv: process.argv, exitCode: 0, bindingVerification: 'PASS',
  verdict: bindings.verdict, actualBrowserExitCode: execution.exitCode,
  browserClosed: raw.browserClosed,
  report: fileBinding(path.join(OUT, 'report.md')),
  bindings: fileBinding(path.join(OUT, 'bindings.json')),
  execution: fileBinding(path.join(OUT, 'execution.json')),
  rawEvidence: fileBinding(path.join(OUT, 'browser-evidence.json')),
  manifest: fileBinding(path.join(OUT, 'manifest.json')),
  maxAbsDelta, counters: bindings.usage,
}, null, 2));
