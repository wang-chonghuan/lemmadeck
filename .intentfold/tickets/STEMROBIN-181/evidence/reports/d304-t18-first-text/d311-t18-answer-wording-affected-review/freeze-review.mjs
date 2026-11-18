import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {
  ticket, absolute, read, bytes, bind, verify, immutableWrite,
} from '../retain-d016-evidence.mjs';

const folder = `${ticket}/tmp/d311-t18-answer-wording-affected-review`;
const reportPath = `${folder}/report.json`;
const report = await read(reportPath);
for (const binding of [
  report.firstReview, report.repairFreeze, report.repairDelta, report.candidate,
  report.affectedZHNativeCandidate, report.unchangedENNativeCandidate,
]) await verify(binding.path, binding.sha256);
const delta = await read(report.repairDelta.path);
for (const row of delta.files) {
  await verify(row.before.path, row.before.sha256);
  await verify(row.after.path, row.after.sha256);
  const before = await bytes(row.before.path), after = await bytes(row.after.path);
  if (row.changedPaths.length) {
    const replacement = before.toString('utf8').replace(
      report.changedPhrase.before, report.changedPhrase.after);
    assert.deepEqual(after, Buffer.from(replacement, 'utf8'));
  } else assert.deepEqual(after, before);
}
assert.equal(delta.files.length, 3);
assert.equal(report.outcome, 'pass');
assert.equal(report.unaffectedDisplayAnswersReReviewed, 0);
const binding = await bind(reportPath);
await fs.chmod(absolute(reportPath), 0o444);
const freezePath = `${folder}/review-freeze.json`;
await immutableWrite(freezePath, `${JSON.stringify({
  schema: 'STEMROBIN-181/affected-answer-wording-review-freeze@1',
  ticket: 'STEMROBIN-181', frozenUtc: new Date().toISOString(),
  report: binding, outcome: 'pass', finding: report.finding,
  exactPhraseOnly: true, otherAnswersUnchanged: true, imagesOpened: 0,
  firstRejectedSnapshotPreserved: true, fullGate2PASS: false,
}, null, 2)}\n`);
await fs.chmod(absolute(freezePath), 0o444);
console.log(JSON.stringify({ report: binding, freeze: await bind(freezePath) }));
