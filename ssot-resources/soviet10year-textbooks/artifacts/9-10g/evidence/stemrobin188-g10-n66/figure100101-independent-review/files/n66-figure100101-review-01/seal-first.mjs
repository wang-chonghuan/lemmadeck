import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const scope = path.dirname(fileURLToPath(import.meta.url));
const [id, source, expected] = process.argv.slice(2);
if (!/^fig-g10-(100|101)$/.test(id ?? '') || !source || !expected) {
  throw new Error('Usage: node seal-first.mjs fig-g10-100|101 source expected-sha256');
}
const first = path.join(scope, `${id}.FIRST.md`);
const receipt = path.join(scope, `${id}.FIRST.receipt.json`);
if (fs.existsSync(receipt)) throw new Error('Refusing to replace a FIRST seal');
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const sourceHash = hash(source);
if (sourceHash !== expected) throw new Error('Original input hash mismatch');
if (fs.lstatSync(first).isSymbolicLink()) throw new Error('FIRST must not be a symlink');
fs.chmodSync(first, 0o444);
const stat = fs.statSync(first);
const mode = (stat.mode & 0o777).toString(8).padStart(4, '0');
if (mode !== '0444') throw new Error('FIRST seal mode mismatch');
const payload = {
  schema: 'same188-6/independent-first-seal@1',
  figure: id,
  sealedAt: new Date().toISOString(),
  first: { path: first, sha256: hash(first), bytes: stat.size, mode },
  source: { path: source, sha256: sourceHash, bytes: fs.statSync(source).size },
  sourceObservedFromActualPixels: true,
  candidateAndLaterManifestReadBeforeSeal: false,
  strictFIRSTProcedureApproved: false,
  originalGlyphHoldsRetained: true,
};
fs.writeFileSync(receipt, `${JSON.stringify(payload, null, 2)}\n`, { flag: 'wx' });
console.log(JSON.stringify(payload, null, 2));
