import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const scope = path.dirname(fileURLToPath(import.meta.url));
const tmp = path.dirname(scope);
const phase = process.argv[2];
if (!['before', 'after'].includes(phase)) throw new Error('Expected before or after');
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const manifestPath = path.join(tmp, 'n66-figure100101-review-inputs-01/manifest.json');
const intakePath = path.join(tmp, 'n66-figure100101-review-inputs-01/blind-intake.json');
for (const id of ['fig-g10-100', 'fig-g10-101']) {
  const receipt = JSON.parse(fs.readFileSync(path.join(scope, `${id}.FIRST.receipt.json`)));
  if (hash(receipt.first.path) !== receipt.first.sha256 ||
      (fs.statSync(receipt.first.path).mode & 0o777) !== 0o444) {
    throw new Error(`Invalid FIRST seal: ${id}`);
  }
}
const manifest = JSON.parse(fs.readFileSync(manifestPath));
const references = new Map();
function visit(value) {
  if (!value || typeof value !== 'object') return;
  if (typeof value.path === 'string' && typeof value.sha256 === 'string') {
    const prior = references.get(value.path);
    if (prior && prior.sha256 !== value.sha256) throw new Error('Conflicting binding');
    references.set(value.path, value);
  }
  for (const child of Object.values(value)) visit(child);
}
visit(manifest);
const records = [...references.values()].map(record => {
  const stat = fs.lstatSync(record.path);
  if (!stat.isFile() || stat.isSymbolicLink()) throw new Error('Non-regular input');
  const actual = hash(record.path);
  if (actual !== record.sha256) throw new Error(`SHA256 mismatch: ${record.path}`);
  if (record.bytes !== undefined && record.bytes !== stat.size) {
    throw new Error(`Byte mismatch: ${record.path}`);
  }
  return {
    path: record.path, sha256: actual, bytes: stat.size,
    mode: (stat.mode & 0o777).toString(8).padStart(4, '0'),
    expectedSha256: record.sha256, hashMatch: true,
    manifestDeclaredBytes: record.bytes ?? null,
  };
});
for (const p of [manifestPath, intakePath]) {
  const stat = fs.statSync(p);
  records.push({
    path: p, sha256: hash(p), bytes: stat.size,
    mode: (stat.mode & 0o777).toString(8).padStart(4, '0'),
    expectedSha256: null, hashMatch: null, manifestDeclaredBytes: null,
  });
}
if (phase === 'after') {
  const before = JSON.parse(fs.readFileSync(path.join(scope, 'input-bindings.before.json')));
  for (const record of records) {
    const prior = before.inputs.find(item => item.path === record.path);
    if (!prior || prior.sha256 !== record.sha256 || prior.bytes !== record.bytes) {
      throw new Error(`Input changed during review: ${record.path}`);
    }
  }
}
const payload = {
  schema: 'same188-6/input-binding-audit@1', phase,
  checkedAt: new Date().toISOString(), status: 'pass',
  note: 'Manifest supplies SHA256 but no byte counts; observed bytes are bound before and compared after.',
  inputs: records,
  noImagesOpenedByThisScript: true,
};
fs.writeFileSync(path.join(scope, `input-bindings.${phase}.json`),
  `${JSON.stringify(payload, null, 2)}\n`, { flag: 'wx' });
console.log(`PASS: ${records.length} hash/byte input records (${phase})`);
