import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const out = path.dirname(fileURLToPath(import.meta.url));
const tmp = path.dirname(out);
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const verified = [];
for (const [directory, expected] of [
  ['d257-n67-fig134-first-author', '8de86cadafc7c5ad20fd9f8cab967e077869b203661e9f7b855fa2cc36026981'],
  ['d264-source177-local-text-repair', '849e706abbcfa20b59c5e4db431b039e4960ddd0a084d30261e7089f3a39ae9d'],
  ['d260-source178179-first-author', 'dcf230fad0f066dd28f065766cf3614c36bc060505fc78dea7e940b4e8d53a85'],
]) {
  const p = path.join(tmp, directory, 'author-freeze.json');
  assert.equal(hash(p), expected);
  assert.equal(fs.statSync(p).mode & 0o777, 0o444);
  const f = read(p);
  for (const a of f.artifacts) {
    assert.equal(hash(a.path), a.sha256);
    if (a.bytes !== undefined) assert.equal(fs.statSync(a.path).size, a.bytes);
  }
  verified.push({ path: p, sha256: expected, mode: '0444', artifacts: f.artifacts.length, unchanged: true });
}
for (const [directory, expected] of [
  ['d259-source177-raw135-first-review', 'fab5383e52d3f8ee466c4503ac2eacfe39bb3499b72774b5c66b39116bc5a28f'],
  ['d263-n67-fig134-first-review', '33735fbc3c656c453c1318f14b13f3d41b5784f8e2bc41c0b22552eb7a519ed8'],
  ['d265-source177-text-affected-review', '9f3c5f3338aa71d9885445bc2b21b56c2b825cde71dc86617d0799a36ec3dfcd'],
]) {
  const p = path.join(tmp, directory, 'report.json');
  assert.equal(hash(p), expected);
  assert.equal(fs.statSync(p).mode & 0o777, 0o444);
  verified.push({ path: p, sha256: expected, mode: '0444', unchanged: true });
}
const ledger = read(path.join(out, 'actual-opens.json'));
assert.equal(hash(ledger.inheritedLedger.path), ledger.inheritedLedger.sha256);
const old = read(ledger.inheritedLedger.path);
assert.equal(old.cumulative, 12);
assert.equal(ledger.inherited, old.cumulative);
assert.equal(ledger.opens.length, 7);
assert.equal(ledger.cumulative, ledger.inherited + ledger.opens.length);
assert.equal(ledger.remaining, 24 - ledger.cumulative);
assert.equal(ledger.reset, false);
for (const [i, o] of ledger.opens.entries()) {
  assert.equal(o.newOrdinal, i + 1);
  assert.equal(o.lifetimeOrdinal, 13 + i);
  assert.equal(o.observed, true);
  assert.equal(hash(o.path), o.sha256);
}
const current177 = read(path.join(tmp, 'd264-source177-local-text-repair/source/10p/pages/0177/page.json'));
assert.equal(current177.blocks[10].open, true);
assert(current177.blocks[10].lines[3].endsWith('光源以对'));
const rowCheck = read(path.join(out, 'text-observation-check.json'));
assert.equal(rowCheck.status, 'PASS');
assert.equal(rowCheck.sourceFindings.length, 0);
const receipt = {
  schema: 'd267-final-input-integrity-and-command-receipts@1', date: '2026-11-18', exitCode: 0,
  verified, source177ContinuationUsesCurrentD264Tail: true,
  actualImageBudget: { inherited: 12, new: 7, cumulative: 19, remaining: 5, reset: false },
  commands: {
    initialFreezeHashModeAndArtifacts: { exitCode: 0, verifiedArtifacts: [28, 12, 37] },
    existingRecordReviewD263: { exitCode: 0, invocations: 1, nativeRenders: 0 },
    independentD263GeometryCheck: { exitCode: 0, assertions: 35, samples: 240, renders: 0 },
    zeroImageD265AffectedChecks: { exitCode: 0, fields: 3, restoredDeepEqual: true },
    d267DetailGenerationAndPageRegionEquality: { exitCode: 0, details: 3, opens: 0 },
    d267FirstResvgPreview: { exitCode: 0, invocations: 1, nativeReruns: 0 },
    d267IndependentObservedTextComparison: { exitCode: 0, rows: [19, 24], typographyRanges: 9 },
    finalIntegrityCheck: { exitCode: 0 },
  },
  recordedAuthorNativeOnly: [
    { page: 178, lines: '19/19', finalizeExit: 0, vectorizeExit: 0, vectorMismatchPercent: 0.000, replayed: false },
    { page: 179, lines: '24/24', finalizeExit: 0, vectorizeExit: 0, actualFigures: 0, replayed: false },
  ],
  writes: 'Only reviewer-owned new d263, d265 and d267 evidence; no old input artifact writes.',
  canonicalMeterIndexGitDBAppStableSkillWrites: 0, newWorkersWorktreesBranches: 0,
};
const destination = path.join(out, 'command-receipts.json');
fs.writeFileSync(destination, JSON.stringify(receipt, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ path: destination, sha256: hash(destination), exitCode: 0, budget: receipt.actualImageBudget }));
