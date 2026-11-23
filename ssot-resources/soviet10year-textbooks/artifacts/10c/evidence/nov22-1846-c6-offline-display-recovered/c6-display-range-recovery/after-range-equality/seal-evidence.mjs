import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const ROOT = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck';
const OUT = path.join(ROOT, '.tmp/stemrobin-184-six/c6-display-range-recovery/after-range-equality');
const read = name => JSON.parse(fs.readFileSync(path.join(OUT, name), 'utf8'));
const bind = file => ({ path: file, bytes: fs.statSync(file).size,
  sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex') });
const check = (ok, message) => { if (!ok) throw new Error(message); };
check(process.cwd() === ROOT && !fs.existsSync(path.join(OUT, 'bindings.json')), 'Wrong cwd or sealing replay');
const raw = read('browser-evidence.json'), receipt = read('execution.json'), review = read('review-observations.json');
check(raw.browserClosed && raw.exitCode === receipt.exitCode && receipt.attemptsThisContinuation === 1, 'Execution facts conflict');
check(!receipt.truncation.timedOut && !receipt.truncation.truncated, 'Interrupted/truncated browser');
for (const stream of Object.values(receipt.streams)) check(bind(stream.path).sha256 === stream.sha256, 'Stream drift');
check(bind(receipt.script.path).sha256 === receipt.script.sha256, 'Executed script drift');
for (const bound of [...raw.inputs, ...raw.evidenceBindings]) check(bind(bound.path).sha256 === bound.sha256, 'Input/original drift');
for (const screenshot of raw.screenshots) check(bind(screenshot.path).sha256 === screenshot.sha256, 'Screenshot drift');
check(review.usage.lifetimeModelViewCalls <= 8 && review.usage.lifetimeChargedUnits <= 24 &&
  review.usage.lifetimeScreenshots <= 7 && review.usage.continuationTextExec <= 6, 'Lifetime budget exceeded');
const bindings = {
  schema: 'stemrobin-184/c6-after-range-equality-bindings@1',
  ticket: 'STEMROBIN-184', assignment: '184-6', finish: 'review',
  scope: '9c/10c offline; only C6 failed/unreached display',
  verdict: review.verdict, actualBrowserStatus: raw.status,
  outputDirectory: OUT, outputDirectoryAbsentBeforeFirstWrite: true,
  actualReceipt: bind(path.join(OUT, 'execution.json')),
  rawEvidence: bind(path.join(OUT, 'browser-evidence.json')),
  inputs: raw.inputs, originalEvidenceUnchanged: raw.evidenceBindings,
  screenshots: raw.screenshots.map(s => ({ ...s,
    modelViewCount: review.viewedScreenshots.includes(s.filename) ? 1 : 0 })),
  originalFlagsAndFirstDeltas: 'Preserved in raw evidence; both prior packages unchanged',
  newRangeDifferences: raw.stages[0]?.rangeDifferences,
  numericEqualityRequirement: 'REMOVED; original Range threshold2px unchanged; geometry is not ink proof',
  perOwnerPixelFindings: review.perOwner,
  mobileFirstVerification: raw.stages.find(x => x.name === 'mobile'),
  pixelScopeAndLimits: review.pixelScopeAndLimits, unreached: review.unreached,
  usage: review.usage, faults: raw.faults, browserClosed: raw.browserClosed,
  parentRetentionOfFirstFailure: {
    humanSuppliedRetention: 'fcca668d4a772310351dd2ec95d98832bcb21c9b56d1b1010bc0feeffaf584ef',
    fileCount: 12, bytes: 156202, executionReference: '06ed3f36', exitCode: 0, payloadRead: false,
  },
  unchangedHolds: ['source338 ambiguous2.3/empty answer', '371/373 qualified ownership', 'full-course HOLD'],
  noFullLessonOrCourseCredit: true, parentIntakeRetentionAndActualClosurePending: true,
};
fs.writeFileSync(path.join(OUT, 'bindings.json'), JSON.stringify(bindings, null, 2) + '\n', { flag: 'wx' });
const names = ['plan.md', 'run-once.mjs', 'recovery-check.mjs', 'seal-evidence.mjs',
  'browser-evidence.json', 'execution.json', 'browser.stdout.txt', 'browser.stderr.txt',
  'report.md', 'review-observations.json', 'execution-ledger.md', 'bindings.json',
  'desktop-adjudication-attempt.json', 'control-transport-receipt.json',
  ...raw.screenshots.map(x => x.filename)];
const manifest = {
  schema: 'stemrobin-184/c6-after-range-equality-manifest@1',
  cwd: ROOT, argv: process.argv, timestamp: new Date().toISOString(), exitCode: 0,
  bindingVerification: 'PASS', displayVerdict: review.verdict,
  actualBrowserExitCode: receipt.exitCode, browserClosed: raw.browserClosed,
  files: names.map(name => bind(path.join(OUT, name))), usage: review.usage,
  note: 'New evidence only. Temporary Chromium data not copied/enumerated. No original package overwritten.',
};
fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n', { flag: 'wx' });
for (const f of manifest.files) check(bind(f.path).sha256 === f.sha256, 'Manifest drift');
console.log(JSON.stringify({ verdict: review.verdict, actualBrowserExitCode: receipt.exitCode,
  browserClosed: raw.browserClosed, bindingVerification: 'PASS',
  report: bind(path.join(OUT, 'report.md')), bindings: bind(path.join(OUT, 'bindings.json')),
  actualReceipt: bind(path.join(OUT, 'execution.json')), manifest: bind(path.join(OUT, 'manifest.json')),
  usage: review.usage, perOwner: review.perOwner, unreached: review.unreached }, null, 2));
