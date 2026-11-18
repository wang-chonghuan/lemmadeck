import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const out = path.dirname(fileURLToPath(import.meta.url));
const author = path.resolve(out, '../d268-source180-first-author');
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const freezePath = path.join(author, 'author-freeze.json');
assert.equal(hash(freezePath), 'b0ade04e1f7953e6f1f7d5397df9ede4ba87a891b7ce2f7055ba5764f3a31b8a');
assert.equal(fs.statSync(freezePath).mode & 0o777, 0o444);
const freeze = read(freezePath);
for (const a of freeze.artifacts) {
  assert.equal(hash(a.path), a.sha256);
  if (a.bytes !== undefined) assert.equal(fs.statSync(a.path).size, a.bytes);
}
const oldReports = [];
for (const [directory, expected] of [
  ['d259-source177-raw135-first-review', 'fab5383e52d3f8ee466c4503ac2eacfe39bb3499b72774b5c66b39116bc5a28f'],
  ['d263-n67-fig134-first-review', '33735fbc3c656c453c1318f14b13f3d41b5784f8e2bc41c0b22552eb7a519ed8'],
  ['d265-source177-text-affected-review', '9f3c5f3338aa71d9885445bc2b21b56c2b825cde71dc86617d0799a36ec3dfcd'],
  ['d267-source178179-raw136-first-review', '7efccf933a94992d9dbfd615e6ca926822995d57cb341f67a8cb924b7bff4bcd'],
]) {
  const p = path.resolve(out, '..', directory, 'report.json');
  assert.equal(hash(p), expected);
  assert.equal(fs.statSync(p).mode & 0o777, 0o444);
  oldReports.push({ path: p, sha256: expected, unchanged: true });
}
const opens = read(path.join(out, 'actual-opens.json'));
assert.equal(hash(opens.inheritedLedger.path), opens.inheritedLedger.sha256);
assert.equal(read(opens.inheritedLedger.path).cumulative, 19);
assert.equal(opens.opens.length, 3);
assert.equal(opens.cumulative, 22);
assert.equal(opens.remaining, 2);
for (const [i, o] of opens.opens.entries()) {
  assert.equal(o.lifetimeOrdinal, 20 + i);
  assert.equal(hash(o.path), o.sha256);
}
const native = read(path.join(author, 'native/0180/receipt.json'));
assert.equal(native.finalizeCalls, 1);
assert.equal(native.vectorizeCalls, 1);
assert.equal(native.finalizeExitCode, 0);
assert.equal(native.vectorizeExitCode, 0);
assert.deepEqual(native.actualFigureFiles, []);
const receipt = {
  schema: 'd270-input-integrity-command-receipts@1', date: '2026-11-18', exitCode: 0,
  freeze: { path: freezePath, sha256: hash(freezePath), mode: '0444', verifiedArtifacts: freeze.artifacts.length },
  authorReport: { path: path.join(author, 'report.json'), sha256: hash(path.join(author, 'report.json')) },
  oldReports, actualImageBudget: { inherited: 19, new: 3, cumulative: 22, remaining: 2, reset: false },
  commands: {
    initialFreezeHashAndArtifacts: { exitCode: 0 },
    necessaryDetailGenerationAndPreparedInputHashes: { exitCode: 0, inputs: 5, generatedDetails: 2, opens: 0 },
    independentObservedTextComparison: { exitCode: 0, SOURCEStatus: 'FAIL', passRows: 26, failRows: 1, boldItalicRanges: 5, mathRanges: 9 },
    finalIntegrityCheck: { exitCode: 0 },
  },
  consumedAuthorNative: { lines: '27/27', finalizeExit: 0, vectorizeExit: 0, finalizeInvocations: 1, vectorizeInvocations: 1, actualFigures: 0 },
  reviewerNativeRuns: 0, SOURCE179ImageOpens: 0, RAW137ImageOpens: 0,
  authorRepairs: 0, canonicalMeterIndexGitDBAppStableSkillWrites: 0, newWorkersWorktreesBranches: 0,
};
const destination = path.join(out, 'command-receipts.json');
fs.writeFileSync(destination, JSON.stringify(receipt, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ path: destination, sha256: hash(destination), exitCode: 0, actualImageBudget: receipt.actualImageBudget }));
