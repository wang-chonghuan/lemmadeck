import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const root = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck';
assert.equal(process.cwd(), root);
const base = path.join(root, '.tmp/stemrobin-184-six');
const directory = path.join(base, 'n47-offline');
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const rows = [];
const parsed = new Map();
function traverse(value) {
  if (value === null || typeof value !== 'object') return 1;
  return Object.values(value).reduce((n, child) => n + traverse(child), 0);
}
function walk(folder) {
  assert.equal(fs.statSync(folder).mode & 0o777, 0o555);
  for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
    const file = path.join(folder, entry.name);
    assert(!entry.isSymbolicLink());
    if (entry.isDirectory()) walk(file);
    else {
      assert.equal(fs.statSync(file).mode & 0o777, 0o444);
      const bytes = fs.readFileSync(file);
      const row = { path: path.relative(root, file), bytes: bytes.length, sha256: sha(bytes) };
      if (entry.name.endsWith('.json')) {
        const data = JSON.parse(bytes.toString('utf8'));
        parsed.set(path.relative(directory, file), data);
        row.intake = 'Complete JSON parse and all-leaf traversal; cross-linked below';
        row.scalarLeaves = traverse(data);
      } else if (entry.name.endsWith('.png')) {
        row.intake = 'Byte hash custody only, no image view/open/decode';
      } else {
        row.intake = 'Complete UTF-8 read; primary code/report independently read by parent';
        row.lines = bytes.toString('utf8').split('\n').length;
      }
      rows.push(row);
    }
  }
}
walk(directory);
const manifest = parsed.get('hash-manifest.json');
for (const binding of manifest.ownedFiles) {
  const row = rows.find(x => x.path === binding.path);
  assert(row);
  assert.equal(row.bytes, binding.bytes);
  assert.equal(row.sha256, binding.sha256);
}
assert.equal(rows.length, manifest.ownedFiles.length + 1);
const evidence = parsed.get('browser-evidence-first.json');
const report = parsed.get('report.json');
const images = parsed.get('image-observations.json');
const execution = parsed.get('execution/first.receipt.json');
assert.equal(execution.exitCode, 1);
assert.equal(report.assertionVerdict, 'FAIL');
assert.equal(report.visualVerdict, 'FAIL');
assert.equal(report.overallVerdict, 'FAIL');
assert.deepEqual(report.nativeClicks, evidence.nativeClicks);
assert.deepEqual(report.assertionEvidence, evidence.assertions.map(x => ({
  id: x.id, passed: x.passed, classification: x.classification,
  details: 'browser-evidence-first.json assertion with this id',
})));
assert.deepEqual(report.visualObservations, images.observations);
assert.equal(evidence.assertions.length, 150);
assert.equal(evidence.assertions.filter(x => x.passed).length, 148);
assert.deepEqual(evidence.unresolvedFailures, evidence.assertions.filter(x => !x.passed));
assert.deepEqual(report.assertions.unresolvedFailures, report.unresolvedFailures);
assert.equal(report.unresolvedFailures.length, 3);
assert.equal(evidence.nativeClicks.length, 64);
for (const click of evidence.nativeClicks) {
  assert.equal(click.nativeEvents.length, 1);
  assert.equal(click.nativeEvents[0].isTrusted, true);
  assert.deepEqual(click.after[click.questionId], [click.optionId]);
  for (const id of Object.keys(click.before)) {
    if (id !== click.questionId) assert.deepEqual(click.before[id], click.after[id]);
  }
}
for (const view of evidence.views) {
  const content = report.contentEvidence.find(x => x.view === view.name);
  assert(content);
  assert.deepEqual(content.fonts, view.fonts);
  assert.deepEqual(content.preservedContent, view.content);
  assert.deepEqual(content.endContent, view.end);
  assert.deepEqual(content.document, view.layout.document);
  assert.deepEqual(content.localHorizontalScroll, view.localScroll);
}
for (const image of images.observations) {
  assert.equal(image.toolCalls, 1);
  assert.equal(image.actualObserved, true);
  const binding = rows.find(x => x.path === image.path);
  assert.equal(binding.sha256, image.sha256);
}
assert.equal(report.accounting.actualImageToolViews, 6);
assert.equal(report.accounting.parentImagesOrDecodes, 0);
assert.equal(report.accounting.hiddenBrowserImageInternals, 'UNKNOWN');
assert.equal(report.cleanup.browserClosed, true);
const stdout = fs.readFileSync(path.join(directory, 'execution/first.stdout'), 'utf8');
const stderr = fs.readFileSync(path.join(directory, 'execution/first.stderr'), 'utf8');
const stdoutRows = stdout.trim().split('\n').map(line => JSON.parse(line));
const stderrRows = stderr.trim().split('\n').map(line => JSON.parse(line).failure);
assert.equal(stdoutRows.length, 7);
assert.deepEqual(stderrRows, evidence.unresolvedFailures);
const receipt = {
  schema: 'stemrobin1846/n47-offline-first-failure-full-intake@1',
  at: new Date().toISOString(), files: rows,
  parentConsumption: {
    primaryText: ['checker.mjs', 'finalize.mjs', 'report.md', 'session-ledger.json',
      'image-observations.json', 'packaging-ledger.json', 'hash-manifest.json',
      'execution/first.receipt.json'],
    largeStructuredEvidence: 'All JSON parsed/traversed in full and all 150 assertions, 64 native states, six content/font/end/scroll records and failure details cross-linked; not falsely claimed individually verbatim-printed',
    disclosure: 'One parent diagnostic JSON print exceeded its tool output cap; this complete structured intake supersedes that truncated display, not its history',
    imagesOrDecodes: 0,
  },
  result: 'FIRST FAIL RECEIVED; NOT ACCEPTED',
  originalStage: execution.stage, originalExit: execution.exitCode,
  unresolvedFailures: report.unresolvedFailures,
  originalFrozenPackageVerified: true, actualOriginalImageViews: 6,
  reservedViewsUsed: 0, hiddenBrowserImageInternals: 'UNKNOWN',
  independentReviewer: '01a1fd18-a579-7b73-bb09-48464d24ae6b',
  reviewerClosed: false,
  next: 'Same checker zero-image affected-layout diagnosis; no passed-gate replay',
};
const target = path.join(base, 'n47-offline-failure-parent-receipt.json');
fs.writeFileSync(target, JSON.stringify(receipt, null, 2) + '\n', { flag: 'wx' });
const progressPath = path.join(base, 'source-progress.json');
const progress = JSON.parse(fs.readFileSync(progressPath, 'utf8'));
assert.equal(progress.n47.offline.closed, false);
assert(!progress.n47.offline.failureIntake);
progress.n47.offline.failureIntake = {
  path: path.relative(root, target), sha256: sha(fs.readFileSync(target)),
  originalFailRetained: true, accepted: false,
};
progress.status = 'n47 offline first FAIL received; affected layout diagnosis only';
fs.writeFileSync(progressPath, JSON.stringify(progress, null, 2) + '\n');
const usagePath = path.join(root, '.intentfold/tickets/STEMROBIN-184/usage.json');
const usage = JSON.parse(fs.readFileSync(usagePath, 'utf8'));
usage.nov21_1846_n47_offline_first_failure_intake = receipt;
fs.writeFileSync(usagePath, JSON.stringify(usage, null, 2) + '\n');
console.log(JSON.stringify({
  verifiedFiles: rows.length, parsedJSON: parsed.size,
  assertions: evidence.assertions.map(a => [a.id, a.passed]),
  failures: report.unresolvedFailures,
  clippingByView: evidence.views.map(v => ({
    view: v.name, flags: v.layout.clipping.length,
    kinds: [...new Set(v.layout.clipping.map(c => `${c.axis}:${c.text}:${c.ancestor}`))],
  })),
  stdout: stdoutRows, receipt: path.relative(root, target),
  parentImagesOrDecodes: 0, accepted: false,
}));
