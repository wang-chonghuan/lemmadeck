import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const own = path.dirname(new URL(import.meta.url).pathname);
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const inventory = path.join(own, 'source-inventory.json');
assert.equal(sha(fs.readFileSync(inventory)),
  '427ecc435db63a6b3ac6532e9fd0dd4a29cf7809c46668f3af8380e250399045');
const reportPath = path.join(own, 'report.json');
const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
assert.equal(report.gates.SOURCE205.status, 'PASS');
assert.equal(report.gates.SOURCE205_LOCAL_BOUNDARIES.status, 'PASS');
assert.equal(report.gates.SOURCE204205_JOIN.status, 'HOLD');
assert.equal(report.imageBudget.actualOpens, 5);
assert.equal(report.lineByLineEvidence.length, 22);
assert.equal(report.figures.RAW.status, 'NOT-APPLICABLE');
assert.equal(report.figures.SVG.status, 'NOT-APPLICABLE');
const freezePath = path.join(own, 'review-freeze.json');
assert.equal(fs.existsSync(freezePath), false);
const names = fs.readdirSync(own).sort();
const files = names.map(name => {
  const p = path.join(own, name);
  assert.ok(fs.lstatSync(p).isFile(), 'Only regular owned files are expected.');
  assert.equal(fs.realpathSync(p), p);
  fs.chmodSync(p, 0o444);
  const bytes = fs.readFileSync(p);
  return {path: p, sha256: sha(bytes), bytes: bytes.length, mode: '0444'};
});
const freeze = {
  schema: 's10y/first-independent-review-freeze@1',
  reviewer: 'd586', role: 'fresh-one-off-FIRST-independent-SOURCE205-reviewer',
  ticket: 'STEMROBIN-181', sourcePage: 205, ownershipRoot: own,
  status: 'SOURCE205-PASS-LOCAL-BOUNDARIES-PASS-CROSSPAGE-JOIN-HOLD',
  sourceInventory: report.sourceInventory,
  inventoryQualification: report.inventoryQualification,
  source: report.source, authorFreeze: report.authorFreeze,
  authorReport: report.authorReport, preNativeFreeze: {
    path: report.preNativeFreeze.path, sha256: report.preNativeFreeze.sha256,
  },
  report: files.find(f => f.path === reportPath),
  gates: {
    SOURCE205: 'PASS', SOURCE205_LOCAL_BOUNDARIES: 'PASS',
    SOURCE204205_JOIN: 'HOLD', RAW: 'NOT-APPLICABLE', SVG: 'NOT-APPLICABLE',
  },
  actualImageOpens: 5, batchLimit: 8, contextLimit: 24,
  parentAndOldReviewersNotReset: true,
  setupFAILPreserved: true, authorBoundaryHOLDPreserved: true,
  otherOldFAILsUntouched: true, nextPageUnread: true, n77Closed: false,
  passedNativeNotReplayed: true, boundedBatchEnded: true,
  files, excludesSelf: true, selfMode: '0444',
  selfHash: 'External final receipt only; manifest cannot contain its own SHA-256.',
  frozenAt: new Date().toISOString(),
};
fs.writeFileSync(freezePath, JSON.stringify(freeze, null, 2) + '\n', {flag: 'wx'});
fs.chmodSync(freezePath, 0o444);
for (const f of files) {
  assert.equal(fs.statSync(f.path).mode & 0o777, 0o444);
  assert.equal(sha(fs.readFileSync(f.path)), f.sha256);
}
assert.equal(fs.statSync(freezePath).mode & 0o777, 0o444);
console.log(JSON.stringify({
  finalFiles: [
    files.find(f => f.path === reportPath),
    files.find(f => f.path === inventory),
    files.find(f => f.path === report.inventoryQualification.path),
    {path: freezePath, sha256: sha(fs.readFileSync(freezePath)), mode: '0444'},
  ],
  frozenOwnedFileCountIncludingManifest: files.length + 1,
  allOwnedFilesMode: '0444', manifestPinsVerified: true,
  gates: freeze.gates, actualImageOpens: 5, boundedBatchEnded: true,
}, null, 2));
