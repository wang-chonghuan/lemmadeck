import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const root = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/.intentfold/tickets/STEMROBIN-188/tmp/source165166-first-and163164-affected-review-12';
const names = ['FIRST.md', 'inventory.json', 'FIRST-freeze-receipt.json',
  'FIRST-annotations.md', 'verify.mjs', 'verification.json', 'manifest.json',
  'verification-command.receipt.json', 'report.json', 'image-ledger.json', 'seal.mjs'];
const files = names.map(name => {
  const file = path.join(root, name);
  const bytes = fs.readFileSync(file);
  if (name.endsWith('.json')) JSON.parse(bytes);
  return { path: file, sha256: crypto.createHash('sha256').update(bytes).digest('hex'),
    bytes: bytes.length, mode: (fs.statSync(file).mode & 0o777).toString(8).padStart(4, '0') };
});
const report = JSON.parse(fs.readFileSync(path.join(root, 'report.json')));
const ledger = JSON.parse(fs.readFileSync(path.join(root, 'image-ledger.json')));
const freeze = JSON.parse(fs.readFileSync(path.join(root, 'FIRST-freeze-receipt.json')));
assert.equal(report.counters.currentFreshChargedImageAttempts, ledger.events.length);
assert.equal(ledger.chargedAttempts, 7);
assert.equal(ledger.scopeBImageAttempts, 0);
assert.deepEqual(report.activeExecSessions, []);
assert.deepEqual(ledger.activeExecSessions, []);
for (const artifact of freeze.artifacts) {
  const actual = files.find(file => file.path === path.join(root, artifact.file));
  assert.equal(actual.sha256, artifact.sha256);
  assert.equal(actual.mode, '0444');
}
const manifest = {
  schema: 'same188-final-text-results-manifest@1', root, files,
  sourceAndStreamBindingsManifest: files.find(file => file.path.endsWith('/manifest.json')),
  dispositions: { A: report.scopeA.disposition, B: report.scopeB.disposition },
  currentImageUsage: '7/8 charged; 7/24 context; B0; parent24/24 unchanged',
  noCounterReset: true, noWholeLessonApproval: true,
  noExternalWritesNoNativeReplays: true, activeExecSessions: []
};
const result = path.join(root, 'result-manifest.json');
fs.writeFileSync(result, JSON.stringify(manifest, null, 2) + '\n');
const sha256 = crypto.createHash('sha256').update(fs.readFileSync(result)).digest('hex');
console.log(JSON.stringify({ status: 'TEXT_RESULTS_SEALED', resultManifest: result, sha256,
  report: files.find(file => file.path.endsWith('/report.json')), activeExecSessions: [] }));
