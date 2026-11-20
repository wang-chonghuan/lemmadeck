import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const readJson = name => JSON.parse(fs.readFileSync(path.join(root, name), 'utf8'));
const sha256 = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const report = readJson('report.json');
const ledger = readJson('image-ledger.json');
const probe = readJson('probe.json');
const exit = readJson('exit.json');
if (exit.code !== 0 || probe.screenshots.length !== 2 ||
  ledger.newBoundedTask.visualViews !== 2 ||
  report.rows.length !== 8 ||
  !report.rows.every(row => row.readableCells.length === 3 &&
    row.readableCells.every(value => value === true))) {
  throw new Error('Report, execution or bounded-review records inconsistent.');
}
const inputBytes = fs.readFileSync(report.input.path);
if (sha256(inputBytes) !== report.input.sha256) throw new Error('Final input hash changed.');
for (const entry of ledger.newBoundedTask.entries) {
  if (entry.visualInspections !== 1 || entry.reopens !== 0 ||
    sha256(fs.readFileSync(entry.path)) !== entry.sha256) {
    throw new Error('Screenshot hash/count mismatch.');
  }
}
if (fs.statSync(path.join(root, 'stderr.log')).size !== 0) {
  throw new Error('Probe stderr is not empty.');
}
if (Object.values(probe.cleanup).some(value => value !== 'closed')) {
  throw new Error('Probe resources not confirmed closed.');
}
const excluded = new Set(['file-manifest.json', 'file-manifest.sha256']);
const outputs = fs.readdirSync(root, { withFileTypes: true })
  .filter(entry => !excluded.has(entry.name))
  .sort((a, b) => a.name.localeCompare(b.name))
  .map(entry => {
    if (!entry.isFile()) throw new Error(`Unexpected residual directory: ${entry.name}`);
    const filename = path.join(root, entry.name);
    const bytes = fs.readFileSync(filename);
    return { path: filename, bytes: bytes.length, sha256: sha256(bytes) };
  });
const manifest = {
  schema: 'stemrobin-184/file-manifest@1',
  createdAt: new Date().toISOString(),
  hashAlgorithm: 'SHA-256',
  input: {
    path: report.input.path, bytes: inputBytes.length,
    sha256: sha256(inputBytes), unchanged: true,
  },
  outputs,
  outputCountExcludingManifestAndSidecar: outputs.length,
  manifestSelfExcluded: true,
  checksumSidecarExcluded: true,
  visualReviewPerformedByFinalizer: false,
  note: 'Finalizer verifies records and byte hashes only; no browser or image viewing.',
};
const bytes = Buffer.from(JSON.stringify(manifest, null, 2) + '\n');
fs.writeFileSync(path.join(root, 'file-manifest.json'), bytes, { flag: 'wx' });
const manifestHash = sha256(bytes);
fs.writeFileSync(path.join(root, 'file-manifest.sha256'),
  `${manifestHash}  ${path.join(root, 'file-manifest.json')}\n`, { flag: 'wx' });
console.log(JSON.stringify({
  verdict: report.verdict,
  captureCount: probe.screenshots.length,
  visualInspections: ledger.newBoundedTask.visualViews,
  reopens: 0,
  inputUnchanged: true,
  cleanup: probe.cleanup,
  outputFileCountIncludingManifestAndSidecar: outputs.length + 2,
  reportSha256: outputs.find(entry => entry.path.endsWith('/report.md')).sha256,
  reportJsonSha256: outputs.find(entry => entry.path.endsWith('/report.json')).sha256,
  manifest: path.join(root, 'file-manifest.json'),
  manifestSha256: manifestHash,
  outputs,
}, null, 2));
