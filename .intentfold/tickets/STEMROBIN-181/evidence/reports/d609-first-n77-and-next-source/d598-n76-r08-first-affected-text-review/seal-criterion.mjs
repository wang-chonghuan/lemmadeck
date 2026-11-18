import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const original = path.join(path.dirname(root), 'd585-n76-first-independent-text-review');
const hash = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');
const readPinned = (name, expected) => {
  const file = path.join(original, name);
  const bytes = fs.readFileSync(file);
  assert.equal(hash(bytes), expected, `Original pin mismatch: ${file}`);
  return { pin: { path: file, sha256: expected, bytes: bytes.length }, json: JSON.parse(bytes) };
};
const report = readPinned('report.json', 'd73acc7fda78771360ea451917c8a4a67ad7fe971035bf5631d2b5eb4899f60a');
const criteria = readPinned('criteria.json', '06b0b42f78419a24dc7c72b436e49d0308a9b1b0631e87c285b641b82e61baa5');
const rows = criteria.json.requirements.filter((item) => item.id === 'N76-R08');
const findings = report.json.blocking_list.filter((item) => item.id === 'N76-R08-H01');
assert.equal(rows.length, 1);
assert.equal(findings.length, 1);
const writeSealed = (name, value) => {
  const file = path.join(root, name);
  const bytes = Buffer.from(`${JSON.stringify(value, null, 2)}\n`);
  fs.writeFileSync(file, bytes, { flag: 'wx', mode: 0o444 });
  assert.equal(fs.statSync(file).mode & 0o777, 0o444);
  return { path: file, sha256: hash(bytes), bytes: bytes.length, mode: '0444' };
};
const extracted = writeSealed('affected-criterion.json', {
  schema: 'n76-r08-immutable-affected-criterion-v1',
  ticket: 'STEMROBIN-181',
  criterion_pointer: '/requirements/7',
  finding_pointer: '/blocking_list/0',
  originals: { criteria: criteria.pin, report: report.pin },
  criterion: rows[0],
  first_HOLD: findings[0],
  extraction: 'Original JSON objects retained by structured deep equality; no replacement criterion.',
});
const freeze = writeSealed('criterion-freeze.json', {
  schema: 'n76-r08-precandidate-criterion-seal-v1',
  recorded_at_utc: new Date().toISOString(),
  phase: 'SEALED_BEFORE_D597_REPORT_DELTA_OR_CANDIDATE_READ',
  author_material_read: false,
  imageOpens: 0,
  extracted,
  originals: { criteria: criteria.pin, report: report.pin },
});
console.log(JSON.stringify({ extracted, freeze }, null, 2));
