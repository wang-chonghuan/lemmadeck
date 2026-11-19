import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const evidence = 'ssot-resources/soviet10year-textbooks/artifacts/9c/evidence/nov19-1844-n13-figure';
const source = '.tmp/stemrobin-184-resume/n13-figure-author';
const projection = '.tmp/stemrobin-184-resume/n13-figure-promotion-candidate';
const durable = 'ssot-resources/soviet10year-textbooks/artifacts/9c/editions/modern-us-neutral/figures';
const target = `${evidence}/promotion`;
const read = file => fs.readFileSync(file);
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const verdictPath = `${evidence}/independent-review/independent.verdict.json`;
assert.equal(hash(read(verdictPath)), '52d74cbcae834c054ea0c41ad52a2bdf62ae8291c33d3676170162878017e8f8');
const verdict = JSON.parse(read(verdictPath));
assert.equal(verdict.status, 'pass');
assert.equal(verdict.commandEvidence.exitCode, 0);
assert.equal(verdict.assertionVerdict.evaluated, 65);
for (const row of verdict.inputs) {
  assert.equal(hash(read(row.path)), row.sha256, row.role);
  assert.equal(read(row.path).length, row.bytes, row.role);
}
assert.equal(hash(read(`${projection}/tbl-p0056-01.render.json`)), '4f86e54934c46a9d8970f773a3d9faaa4ed64a9f539a92a7d47bc9e860b77d45');
const entries = [
  [`${source}/tbl-p0056-01.spec.json`, `${durable}/tbl-p0056-01.spec.json`],
  [`${source}/tbl-p0056-01.svg`, `${durable}/tbl-p0056-01.svg`],
  [`${projection}/tbl-p0056-01.render.json`, `${durable}/tbl-p0056-01.render.json`],
];
assert(!fs.existsSync(target), 'Promotion evidence protected');
for (const [, file] of entries) assert(!fs.existsSync(file), 'Existing modern figure protected');
const rows = [];
for (const [input, file] of entries) {
  const bytes = read(input);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, bytes, { flag: 'wx' });
  rows.push({ input, path: file, bytes: bytes.length, sha256: hash(bytes) });
}
fs.mkdirSync(target);
for (const name of ['tbl-p0056-01.render.json', 'receipt.json']) {
  fs.writeFileSync(`${target}/projected-${name}`, read(`${projection}/${name}`), { flag: 'wx', mode: 0o444 });
}
fs.writeFileSync(`${target}/promote.mjs`, read('.tmp/stemrobin-184-resume/promote-n13-figure.mjs'), { flag: 'wx', mode: 0o444 });
fs.writeFileSync(`${target}/receipt.json`, JSON.stringify({
  schema: 'approved-modern-figure-promotion@1', recordedAt: new Date().toISOString(),
  rows, independentVerdict: { path: verdictPath, sha256: hash(read(verdictPath)) },
  sourceSpecSvgExactApprovedBytes: true, renderOnlyTwoAlreadyApprovedPathChanges: true,
  rendererReruns: 0, sourceReopens: 0, parentImages: 'Permanent24/24;0newopens/payloads',
  next: 'Official hash-bound review record once, then first modern finalize',
  wholeLessonApproval: false, boundary: 'No DB,publisher,E,main,merge,deploy,handofforclosure',
}, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ promoted: rows.length, rendererReruns: 0, sourceSpecSvgExactApprovedBytes: true }));
